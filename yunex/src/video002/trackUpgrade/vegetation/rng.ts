export type SeededRandom = () => number;

export const createSeededRandom = (seed = 2103): SeededRandom => {
  let state = (seed >>> 0) || 0x6d2b79f5;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

export const randomRange = (random: SeededRandom, min: number, max: number) =>
  min + (max - min) * random();

export const randomSigned = (random: SeededRandom, magnitude = 1) =>
  (random() * 2 - 1) * magnitude;

export const randomIndex = (random: SeededRandom, length: number) =>
  Math.min(length - 1, Math.floor(random() * length));
