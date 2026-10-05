const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {spawnSync} = require('child_process');

const ROOT = path.resolve(__dirname, '../../..');
const YUNEX = path.resolve(__dirname, '../..');
const sourceModel = path.join(ROOT, 'cars/porsche-911-gt3-rs-992/model.glb');
const publicModel = path.join(YUNEX, 'public/model.glb');
const outDir = path.join(YUNEX, 'out/agent-a');
const expected = '1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb';

const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const run = (cmd, args) => {
  const result = spawnSync(cmd, args, {cwd: YUNEX, stdio: 'inherit', env: {...process.env, NODE_OPTIONS: '--require=./fix-network.cjs'}});
  if (result.status !== 0) process.exit(result.status ?? 1);
};

fs.mkdirSync(path.dirname(publicModel), {recursive: true});
fs.mkdirSync(outDir, {recursive: true});
if (hash(sourceModel) !== expected) throw new Error('Approved exterior hash mismatch before Agent A proof render.');
fs.copyFileSync(sourceModel, publicModel);
if (hash(publicModel) !== expected) throw new Error('Staged exterior hash mismatch.');

run('npx', [
  'remotion', 'render',
  'src/video002/a_mechanics_entry.tsx',
  'YUNEX-002-A-MECHANICS',
  'out/agent-a/a_mechanics_proof.mp4',
  '--gl=swangle', '--concurrency=2', '--codec=h264', '--crf=17', '--timeout=120000',
]);

run('ffmpeg', ['-y', '-ss', '0.40', '-i', 'out/agent-a/a_mechanics_proof.mp4', '-frames:v', '1', 'out/agent-a/a_high_downforce.png']);
run('ffmpeg', ['-y', '-ss', '1.20', '-i', 'out/agent-a/a_mechanics_proof.mp4', '-frames:v', '1', 'out/agent-a/a_drs.png']);
run('ffmpeg', ['-y', '-ss', '2.35', '-i', 'out/agent-a/a_mechanics_proof.mp4', '-frames:v', '1', 'out/agent-a/a_airbrake.png']);
run('ffmpeg', ['-v', 'error', '-i', 'out/agent-a/a_mechanics_proof.mp4', '-f', 'null', '-']);
run('ffprobe', ['-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate,nb_read_frames,codec_name', '-of', 'json', 'out/agent-a/a_mechanics_proof.mp4']);

if (hash(sourceModel) !== expected || hash(publicModel) !== expected) throw new Error('Approved exterior changed during proof render.');
console.log(`Agent A proof complete. Approved exterior SHA-256: ${expected}`);
