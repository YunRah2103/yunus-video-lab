import type {Y004SegmentId} from '../contracts';

/** This is a provisional shot-local editorial plan, NOT an audio transcription. */
export type Y004EditWindow = Readonly<{
  segmentId: Y004SegmentId;
  startFrame: number;
  endFrame: number;
}>;
export type Y004TextCue = Readonly<{
  segmentId: Y004SegmentId;
  startFrame: number;
  endFrame: number;
  eyebrow?: string;
  line1: string;
  line2?: string;
  placement: 'top' | 'lower';
  treatment: 'dominant' | 'signature';
}>;

export const Y004_REQUIRED_SEGMENTS: readonly Y004SegmentId[] = [
  'low-hook', 'rear-macro', 'low-explain', 'high-explain', 'high-drive', 'trackside-exit',
] as const;
export const Y004_EDIT_PALETTE = {
  ivory: '#f1eadc', green: '#bddb78', charcoal: '#0d1011',
} as const;
export const Y004_SAFE_MARGIN_PX = {x: 72, top: 144, bottom: 158} as const;

/** Only an editable PRE-VO guide; the Manager sets final bounds after measuring narration. */
export const Y004_PROVISIONAL_EDIT_WINDOWS: readonly Y004EditWindow[] = [
  {segmentId: 'low-hook', startFrame: 0, endFrame: 84},
  {segmentId: 'rear-macro', startFrame: 84, endFrame: 150},
  {segmentId: 'low-explain', startFrame: 150, endFrame: 285},
  {segmentId: 'high-explain', startFrame: 285, endFrame: 405},
  {segmentId: 'high-drive', startFrame: 405, endFrame: 555},
  {segmentId: 'trackside-exit', startFrame: 555, endFrame: 720},
] as const;

const COPY: Record<Y004SegmentId, Omit<Y004TextCue, 'segmentId' | 'startFrame' | 'endFrame'> | null> = {
  'low-hook': {line1: 'THE REAR WHEELS', line2: 'TURN TOO.', placement: 'top', treatment: 'dominant'},
  'rear-macro': {eyebrow: 'REAR AXLE', line1: 'A SMALL CHANGE.', placement: 'top', treatment: 'dominant'},
  'low-explain': {eyebrow: 'OPPOSITE DIRECTION', line1: 'LOWER SPEED', line2: 'AGILITY', placement: 'top', treatment: 'dominant'},
  'high-explain': {eyebrow: 'SAME DIRECTION', line1: 'HIGHER SPEED', line2: 'STABILITY', placement: 'top', treatment: 'dominant'},
  'high-drive': null,
  'trackside-exit': {line1: 'YUNEX', placement: 'lower', treatment: 'signature'},
};

/** Reject noncontiguous, stale, truncated or overlapping Manager timeline inputs. */
export function validateY004Windows(windows: readonly Y004EditWindow[], durationFrames: number): void {
  if (!Number.isSafeInteger(durationFrames) || durationFrames < 120) {
    throw new Error('Y004 edit duration must be an integer frame count >= 120');
  }
  if (windows.length !== Y004_REQUIRED_SEGMENTS.length) throw new Error('Y004 edit requires six ordered segments');
  let expectedStart = 0;
  windows.forEach((w, i) => {
    if (w.segmentId !== Y004_REQUIRED_SEGMENTS[i]) throw new Error(`Y004 segment order mismatch at ${i}`);
    if (!Number.isSafeInteger(w.startFrame) || !Number.isSafeInteger(w.endFrame) ||
        w.startFrame !== expectedStart || w.endFrame <= w.startFrame) {
      throw new Error(`Y004 invalid / noncontiguous segment: ${w.segmentId}`);
    }
    expectedStart = w.endFrame;
  });
  if (expectedStart !== durationFrames) throw new Error('Y004 segment end does not match film duration');
  if (windows[0].endFrame > 84) throw new Error('Y004 hook must reveal rear steering by frame 84');
}

export function buildY004EditCues(windows: readonly Y004EditWindow[], durationFrames: number): readonly Y004TextCue[] {
  validateY004Windows(windows, durationFrames);
  return windows.flatMap(w => {
    const cue = COPY[w.segmentId];
    if (!cue) return [];
    // Move identity off the picture until the latter portion of the rolling exit.
    const startFrame = w.segmentId === 'trackside-exit'
      ? w.startFrame + Math.floor((w.endFrame - w.startFrame) * .62)
      : w.startFrame;
    return [{segmentId: w.segmentId, startFrame, endFrame: w.endFrame, ...cue}];
  });
}

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (x: number) => {const t = clamp01(x); return t * t * (3 - 2 * t);};
export function y004CueOpacity(frame: number, cue: Pick<Y004TextCue, 'startFrame' | 'endFrame'>): number {
  if (!Number.isFinite(frame) || frame < cue.startFrame || frame >= cue.endFrame) return 0;
  const length = cue.endFrame - cue.startFrame;
  const fade = Math.max(1, Math.min(8, Math.floor(length / 3)));
  return smooth((frame - cue.startFrame) / fade) * smooth((cue.endFrame - frame) / fade);
}
export function y004ActiveTextCue(frame: number, cues: readonly Y004TextCue[]): Y004TextCue | undefined {
  return cues.find(cue => frame >= cue.startFrame && frame < cue.endFrame);
}
