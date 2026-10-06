export type NarrationCue = Readonly<{
  id: string;
  start: number;
  end: number;
  text: string;
}>;

export const Y003_NARRATION = {
  sourceName: 'openai-fm-cedar-friendly.mp3',
  libraryId: 'libfile_6e284ae6e75c819197dd652690e22ae8',
  sourceSha256: '826d7863cd4ec135e0352e9800f47b54239f8ba1d4c0d98ff5909a071905cfbb',
  durationSeconds: 23.256,
  sampleRateHz: 24000,
  channels: 1,
  recommendedFilmDurationSeconds: 24.5,
  transcript:
    'Even the suspension on this Porsche helps make downforce. On the 911 GT3 RS, Porsche shaped the front suspension so air can move more cleanly underneath the car. That means the suspension is doing more than just controlling the wheels. Under braking and cornering, it also helps keep the car stable and controlled. So on a GT3 RS, even the suspension is part of the aero system.',
} as const;

export const Y003_SENTENCE_CUES: readonly NarrationCue[] = [
  {id: 's1', start: 0.05, end: 3.31, text: 'Even the suspension on this Porsche helps make downforce.'},
  {id: 's2', start: 4.15, end: 10.3, text: 'On the 911 GT3 RS, Porsche shaped the front suspension so air can move more cleanly underneath the car.'},
  {id: 's3', start: 11.02, end: 13.94, text: 'That means the suspension is doing more than just controlling the wheels.'},
  {id: 's4', start: 14.71, end: 18.57, text: 'Under braking and cornering, it also helps keep the car stable and controlled.'},
  {id: 's5', start: 19.32, end: 23.15, text: 'So on a GT3 RS, even the suspension is part of the aero system.'},
] as const;

export const Y003_PHRASE_CUES: readonly NarrationCue[] = [
  {id: 'p1', start: 0.05, end: 1.977, text: 'Even the suspension on this Porsche'},
  {id: 'p2', start: 2.195, end: 3.323, text: 'helps make downforce.'},
  {id: 'p3', start: 4.153, end: 5.86, text: 'On the 911 GT3 RS,'},
  {id: 'p4', start: 6.229, end: 7.79, text: 'Porsche shaped the front suspension'},
  {id: 'p5', start: 8.086, end: 10.311, text: 'so air can move more cleanly underneath the car.'},
  {id: 'p6', start: 11.026, end: 13.94, text: 'That means the suspension is doing more than just controlling the wheels.'},
  {id: 'p7', start: 14.717, end: 15.966, text: 'Under braking and cornering,'},
  {id: 'p8', start: 16.319, end: 18.59, text: 'it also helps keep the car stable and controlled.'},
  {id: 'p9', start: 19.313, end: 20.556, text: 'So on a GT3 RS,'},
  {id: 'p10', start: 20.913, end: 23.15, text: 'even the suspension is part of the aero system.'},
] as const;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

/** Speech activity used for deterministic SFX ducking. Fades avoid gain discontinuities. */
export const narrationActivity01 = (seconds: number, fadeSeconds = 0.08): number => {
  let activity = 0;
  for (const cue of Y003_PHRASE_CUES) {
    const fadeIn = smoothstep((seconds - (cue.start - fadeSeconds)) / fadeSeconds);
    const fadeOut = 1 - smoothstep((seconds - cue.end) / fadeSeconds);
    activity = Math.max(activity, clamp01(Math.min(fadeIn, fadeOut)));
  }
  return activity;
};
