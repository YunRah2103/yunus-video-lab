import {narrationActivity01} from './cues';

export type Y003AudioMotionInput = Readonly<{
  seconds: number;
  speedMps: number;
  longitudinalLoad01?: number;
  cornerLoad01?: number;
  cameraDistanceM?: number;
  tracksidePass01?: number;
  slowMotionScale?: number;
  mechanicalExposure01?: number;
}>;

export type Y003AudioMixState = Readonly<{
  engineDb: number;
  roadDb: number;
  windDb: number;
  passDb: number;
  mechanicalDb: number;
  speechDuckDb: number;
}>;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const clamp01 = (value: number) => clamp(value, 0, 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp01(t);

/**
 * Dependency-injected sound envelope for Manager integration.
 * It intentionally consumes only serializable motion/camera facts instead of importing A/C contracts.
 */
export const y003AudioMixState = (input: Y003AudioMotionInput): Y003AudioMixState => {
  const speed01 = clamp01(input.speedMps / 58);
  const load01 = clamp01(Math.max(input.longitudinalLoad01 ?? 0, input.cornerLoad01 ?? 0));
  const cameraDistanceM = Math.max(1.5, input.cameraDistanceM ?? 6);
  const distanceAttenuationDb = clamp((cameraDistanceM - 3) * 0.85, 0, 14);
  const slowMotionScale = clamp(input.slowMotionScale ?? 1, 0.2, 1);
  const pass01 = clamp01(input.tracksidePass01 ?? 0);
  const exposure01 = clamp01(input.mechanicalExposure01 ?? 0);
  const speechDuckDb = -7 * narrationActivity01(input.seconds);

  return {
    engineDb: lerp(-36, -18, speed01) - distanceAttenuationDb + speechDuckDb,
    roadDb: lerp(-44, -25, speed01) - distanceAttenuationDb * 0.55 + speechDuckDb,
    windDb: lerp(-50, -28, speed01) - distanceAttenuationDb * 0.35 + speechDuckDb,
    passDb: -60 + 31 * pass01 - distanceAttenuationDb * 0.25 + speechDuckDb,
    mechanicalDb: -58 + 24 * exposure01 + 5 * load01 + speechDuckDb - (1 - slowMotionScale) * 2,
    speechDuckDb,
  };
};
