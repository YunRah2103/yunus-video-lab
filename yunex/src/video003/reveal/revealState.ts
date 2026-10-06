const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smoothStep = (a: number, b: number, value: number) => {
  const t = clamp01((value - a) / Math.max(1e-9, b - a));
  return t * t * (3 - 2 * t);
};

export type Y003RevealVisualState = {
  amount: number;
  bodyOpacity: number;
  glassOpacity: number;
  grillesOpacity: number;
  interiorOpacity: number;
  clipEnabled: boolean;
};

export const resolveY003RevealVisualState = (cueProgress: number): Y003RevealVisualState => {
  const p = clamp01(cueProgress);
  const revealIn = smoothStep(0.08, 0.34, p);
  const revealOut = 1 - smoothStep(0.76, 1, p);
  const amount = Math.min(revealIn, revealOut);

  return {
    amount,
    bodyOpacity: 1 - amount * 0.84,
    glassOpacity: 1 - amount * 0.7,
    grillesOpacity: 1 - amount * 0.78,
    interiorOpacity: 1 - amount * 0.64,
    clipEnabled: amount > 0.24,
  };
};

export const auditY003RevealState = () => {
  const start = resolveY003RevealVisualState(0);
  const middle = resolveY003RevealVisualState(0.5);
  const end = resolveY003RevealVisualState(1);
  const issues: string[] = [];
  if (start.amount !== 0 || end.amount !== 0) issues.push('exterior is not fully restored at reveal boundaries');
  if (middle.amount < 0.95) issues.push('mid-reveal does not expose enough installed suspension');
  if (middle.bodyOpacity < 0.1) issues.push('body becomes too invisible to retain Porsche context');
  return {ok: issues.length === 0, issues, start, middle, end};
};
