#!/usr/bin/env python3
"""Y004 source-locked native render/assembly/validation. Standard library only."""
from __future__ import annotations
import argparse
from fractions import Fraction
import hashlib
import json
import re
import subprocess
from pathlib import Path

FPS = 30
WIDTH, HEIGHT = 1080, 1920
MODEL_SHA = '1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb'
SHA_RE = re.compile(r'^[0-9a-f]{40}$')
CHUNK_RE = re.compile(r'^chunk-(\d+)-(\d+)\.mp4$')


def require(ok: bool, message: str) -> None:
    if not ok:
        raise ValueError(message)


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()


def execute(*args: str, capture: bool = False) -> str:
    out = subprocess.run(list(args), text=True, check=True, stdout=subprocess.PIPE if capture else None)
    return out.stdout if capture else ''


def probe(path: Path, *, count_frames: bool = False) -> dict:
    require(path.is_file() and path.stat().st_size > 0, f'missing or empty: {path}')
    return json.loads(execute('ffprobe', '-v', 'error', *(['-count_frames'] if count_frames else []),
                              '-show_entries', 'format=duration,size:stream=index,codec_type,codec_name,pix_fmt,color_range,width,height,avg_frame_rate,r_frame_rate,nb_frames,nb_read_frames,sample_rate,channels',
                              '-of', 'json', str(path), capture=True))


def stream_of(data: dict, kind: str) -> list[dict]:
    return [s for s in data.get('streams', []) if s.get('codec_type') == kind]


def inspect_video(path: Path, frames: int, *, allow_full_range: bool = False) -> dict:
    d = probe(path, count_frames=True)
    v = stream_of(d, 'video')
    require(len(v) == 1 and not stream_of(d, 'audio'), f'{path.name}: expected exactly one video stream, no audio')
    s = v[0]
    require(s.get('codec_name') == 'h264', f'{path.name}: not H.264')
    require(s.get('pix_fmt') in (('yuv420p', 'yuvj420p') if allow_full_range else ('yuv420p',)), f'{path.name}: wrong pixel format {s.get("pix_fmt")}')
    if not allow_full_range:
        require(s.get('color_range') == 'tv', f'{path.name}: expected limited-range tv, got {s.get("color_range")}')
    require((s.get('width'), s.get('height')) == (WIDTH, HEIGHT), f'{path.name}: wrong dimensions')
    require(Fraction(s.get('avg_frame_rate', '0/1')) == FPS, f'{path.name}: wrong average fps')
    require(int(s.get('nb_read_frames') or 0) == frames, f'{path.name}: wrong decoded frame count')
    return s


def chunks_for(total: int, chunk_size: int) -> list[dict]:
    require(total > 0 and chunk_size > 0, 'positive total and chunk size required')
    return [{'part': f'{start:04d}-{end:04d}', 'frames': f'{start}-{end}',
             'start': start, 'end': end, 'count': end - start + 1}
            for start in range(0, total, chunk_size)
            for end in [min(total - 1, start + chunk_size - 1)]]


def validate_chunks(directory: Path, total: int, chunk_size: int, source: str) -> dict:
    require(bool(SHA_RE.fullmatch(source)), 'expected immutable 40-hex source SHA')
    rows = chunks_for(total, chunk_size)
    files = sorted(p.name for p in directory.glob('chunk-*.mp4'))
    expected = sorted('chunk-' + r['part'] + '.mp4' for r in rows)
    require(files == expected, f'chunk coverage/order mismatch: expected {expected}, got {files}')
    result = []
    for row in rows:
        part = row['part']
        path = directory / f'chunk-{part}.mp4'
        provenance = directory / f'source-sha-{part}.txt'
        require(provenance.exists(), f'missing source provenance: {provenance}')
        require(provenance.read_text().strip() == source, f'{path.name}: source SHA mismatch')
        inspect_video(path, row['count'], allow_full_range=True)
        result.append({**row, 'file': path.name, 'sha256': sha256(path), 'source_sha': source})
    return {'status': 'PASS', 'source_sha': source, 'fps': FPS, 'width': WIDTH,
            'height': HEIGHT, 'frames': total, 'chunks': result}


def atom_faststart(path: Path) -> bool:
    # Scan top-level atom headers; do not read multi-gigabyte mdat contents.
    with path.open('rb') as f:
        pos = 0
        moov, mdat = None, None
        while pos < path.stat().st_size:
            f.seek(pos)
            header = f.read(16)
            if len(header) < 8:
                break
            size = int.from_bytes(header[:4], 'big')
            kind = header[4:8]
            if size == 1:
                size = int.from_bytes(header[8:16], 'big')
            if size == 0:
                size = path.stat().st_size - pos
            require(size >= 8, f'{path}: invalid MP4 atom at {pos}')
            if kind == b'moov':
                moov = pos
            if kind == b'mdat':
                mdat = pos
            pos += size
    return moov is not None and mdat is not None and moov < mdat


def check_timestamps(path: Path, total: int) -> None:
    data = json.loads(execute('ffprobe', '-v', 'error', '-select_streams', 'v:0',
                              '-show_frames', '-show_entries', 'frame=best_effort_timestamp_time',
                              '-of', 'json', str(path), capture=True))
    times = [float(f['best_effort_timestamp_time']) for f in data['frames']]
    require(len(times) == total, f'presentation frame count: {len(times)} != {total}')
    for i, time in enumerate(times):
        require(abs(time - i / FPS) < 0.0012, f'frame {i}: bad/duplicate/gapped PTS {time}')


def validate_final(path: Path, total: int, source: str, audio_source: Path | None = None) -> dict:
    require(bool(SHA_RE.fullmatch(source)), 'expected immutable source SHA')
    d = probe(path, count_frames=True)
    videos = stream_of(d, 'video')
    audios = stream_of(d, 'audio')
    require(len(videos) == 1 and len(audios) == 1 and len(d['streams']) == 2,
            'final must contain exactly one video and one audio stream')
    v, a = videos[0], audios[0]
    require(v.get('codec_name') == 'h264' and v.get('pix_fmt') == 'yuv420p' and v.get('color_range') == 'tv',
            f'final is not limited-range H.264 yuv420p: {v}')
    require((v.get('width'), v.get('height')) == (WIDTH, HEIGHT), 'wrong final dimensions')
    require(Fraction(v.get('avg_frame_rate', '0/1')) == FPS, 'wrong final average fps')
    require(int(v.get('nb_read_frames') or 0) == total, 'wrong final decoded frame count')
    require(a.get('codec_name') == 'aac' and a.get('sample_rate') == '48000' and a.get('channels') == 2,
            'audio must be AAC stereo at 48 kHz')
    duration = total / FPS
    container_duration = float(d['format']['duration'])
    require(abs(container_duration - duration) <= 0.075, 'wrong final container duration')
    require(atom_faststart(path), 'MP4 faststart missing (moov must precede mdat)')
    execute('ffmpeg', '-hide_banner', '-nostdin', '-v', 'error', '-xerror', '-err_detect', 'explode',
            '-i', str(path), '-map', '0:v:0', '-map', '0:a:0', '-f', 'null', '-')
    check_timestamps(path, total)
    return {'status': 'PASS', 'file': str(path), 'sha256': sha256(path), 'size_bytes': path.stat().st_size,
            'render_source_sha': source, 'frames': total, 'fps': FPS, 'dimensions': [WIDTH, HEIGHT],
            'duration_seconds': duration, 'container_duration_seconds': container_duration,
            'video': {'codec': 'h264', 'pixel_format': 'yuv420p', 'color_range': 'tv'},
            'audio': {'codec': 'aac', 'rate': 48000, 'channels': 2,
                      'source': str(audio_source) if audio_source else None,
                      'source_sha256': sha256(audio_source) if audio_source else None},
            'faststart': True, 'full_decode': 'PASS', 'presentation_timestamps': 'PASS'}


def assemble(directory: Path, output: Path, total: int, chunk_size: int,
             source: str, audio: Path, evidence_dir: Path) -> dict:
    import tempfile
    coverage = validate_chunks(directory, total, chunk_size, source)
    ad = probe(audio)
    require(len(stream_of(ad, 'audio')) == 1, 'approved Y004 audio has no unique audio stream')
    audio_duration = float(ad['format']['duration'])
    duration = total / FPS
    require(0 < audio_duration <= duration + 0.01,
            f'audio {audio_duration:.3f}s exceeds locked video {duration:.3f}s; cannot truncate VO')
    require('y004' in audio.name.lower() or '004' in audio.name.lower(), 'not identifiable as new Y004 audio')
    output.parent.mkdir(parents=True, exist_ok=True)
    evidence_dir.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as temp:
        folder = Path(temp)
        concat = folder / 'concat.txt'
        concat.write_text(''.join("file '" + str((directory / ('chunk-' + r['part'] + '.mp4')).resolve()).replace("'", "'\\''") + "'\n"
                                  for r in chunks_for(total, chunk_size)))
        normalized = folder / 'native-visual.mp4'
        # Exactly one normalization encode ensures limited-range true yuv420p even if native chunks are yuvj420p.
        execute('ffmpeg', '-hide_banner', '-nostdin', '-v', 'error', '-xerror', '-y',
                '-f', 'concat', '-safe', '0', '-i', str(concat), '-an',
                '-vf', 'scale=in_range=auto:out_range=limited,format=yuv420p',
                '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p',
                '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
                '-r', str(FPS), '-fps_mode', 'cfr', '-frames:v', str(total), '-movflags', '+faststart', str(normalized))
        inspect_video(normalized, total)
        execute('ffmpeg', '-hide_banner', '-nostdin', '-v', 'error', '-xerror', '-y',
                '-i', str(normalized), '-i', str(audio), '-map', '0:v:0', '-map', '1:a:0',
                '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2',
                '-af', 'apad', '-t', f'{duration:.9f}', '-movflags', '+faststart', str(output))
    check = validate_final(output, total, source, audio)
    (evidence_dir / 'CHUNKS.json').write_text(json.dumps(coverage, indent=2) + '\n')
    (evidence_dir / 'RELEASE_VALIDATION.json').write_text(json.dumps(check, indent=2) + '\n')
    (evidence_dir / 'SHA256SUMS').write_text(f'{check["sha256"]}  {output.name}\n')
    return check


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__)
    sub = p.add_subparsers(dest='mode', required=True)
    m = sub.add_parser('matrix')
    m.add_argument('--frames', type=int, required=True)
    m.add_argument('--chunk-size', type=int, default=20)
    c = sub.add_parser('chunks')
    c.add_argument('directory', type=Path)
    c.add_argument('--frames', type=int, required=True)
    c.add_argument('--chunk-size', type=int, default=20)
    c.add_argument('--source', required=True)
    v = sub.add_parser('final')
    v.add_argument('file', type=Path)
    v.add_argument('--frames', type=int, required=True)
    v.add_argument('--source', required=True)
    a = sub.add_parser('assemble')
    a.add_argument('directory', type=Path)
    a.add_argument('output', type=Path)
    a.add_argument('--frames', type=int, required=True)
    a.add_argument('--chunk-size', type=int, default=20)
    a.add_argument('--source', required=True)
    a.add_argument('--audio', type=Path, required=True)
    a.add_argument('--evidence', type=Path, required=True)
    args = p.parse_args()
    if args.mode == 'matrix':
        print(json.dumps({'include': chunks_for(args.frames, args.chunk_size)}, separators=(',', ':')))
    elif args.mode == 'chunks':
        print(json.dumps(validate_chunks(args.directory, args.frames, args.chunk_size, args.source), indent=2))
    elif args.mode == 'final':
        print(json.dumps(validate_final(args.file, args.frames, args.source), indent=2))
    else:
        print(json.dumps(assemble(args.directory, args.output, args.frames, args.chunk_size,
                                  args.source, args.audio, args.evidence), indent=2))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, subprocess.CalledProcessError, json.JSONDecodeError) as exc:
        raise SystemExit(f'Y004 NATIVE RENDER FAILED: {exc}')
