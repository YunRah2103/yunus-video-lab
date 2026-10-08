/** DO NOT confuse editorial estimates with sample-measured recorded speech. */
export const Y004_NARRATION_SCRIPT = [
  'The rear wheels on this Porsche steer too.',
  'At lower speeds, they turn slightly against the front wheels, helping the GT3 RS rotate into corners more quickly.',
  'But at higher speeds, they turn with the fronts instead.',
  'That makes the car more stable when changing direction at speed.',
  "So while you're driving, all four wheels are helping this Porsche turn.",
] as const;
export const Y004_RECORDING_STATUS = 'NEW_CEDAR_TAKE_SHA_VERIFIED_AUDIO_MIX_COMPLETE' as const;
export type Y004SentenceCue = Readonly<{
  id: 's1' | 's2' | 's3' | 's4' | 's5';
  text: string;
  startSeconds: number;
  endSeconds: number;
}>;
export type Y004MeasuredNarration = Readonly<{
  sourceSha256: string;
  durationSeconds: number;
  sampleRateHz: number;
  channels: number;
  /** Manually reviewed phrase timing from THIS take, not script estimates. */
  sentences: readonly Y004SentenceCue[];
}>;

/** Real user-approved source, 720-frame Manager lock; windows independently agree with acoustic gaps. */
export const Y004_MEASURED_NARRATION: Y004MeasuredNarration = {
  sourceSha256:'db75bbbe6aa468062b300004390f23f254679086e2b69d0de6aa1d553c8d404b',
  durationSeconds:22.704, sampleRateHz:24000, channels:1,
  sentences:[
    {id:'s1',text:Y004_NARRATION_SCRIPT[0],startSeconds:0,endSeconds:2.755},
    {id:'s2',text:Y004_NARRATION_SCRIPT[1],startSeconds:3.650,endSeconds:10.613},
    {id:'s3',text:Y004_NARRATION_SCRIPT[2],startSeconds:11.608,endSeconds:14.232},
    {id:'s4',text:Y004_NARRATION_SCRIPT[3],startSeconds:14.979,endSeconds:17.866},
    {id:'s5',text:Y004_NARRATION_SCRIPT[4],startSeconds:18.858,endSeconds:22.577},
  ],
} as const;

const smooth=(n:number)=>{const t=Math.min(1,Math.max(0,n));return t*t*(3-2*t);};
export function validateY004Narration(n: Y004MeasuredNarration): void {
  if(!/^[a-f0-9]{64}$/i.test(n.sourceSha256))throw new Error('Missing real voice recording SHA256');
  if(!Number.isFinite(n.durationSeconds)||n.durationSeconds<=0)throw new Error('Invalid measured voice duration');
  if(!Number.isSafeInteger(n.sampleRateHz)||n.sampleRateHz<8000 ||
     !Number.isSafeInteger(n.channels)||n.channels<1||n.channels>2)throw new Error('Invalid decoder metadata');
  if(n.sentences.length!==5)throw new Error('Must include five measured sentences');
  let priorEnd=0;
  n.sentences.forEach((cue,i)=>{
    if(cue.id!==`s${i+1}`||cue.text!==Y004_NARRATION_SCRIPT[i])throw new Error(`Unverified transcript at sentence ${i+1}`);
    if(!Number.isFinite(cue.startSeconds)||!Number.isFinite(cue.endSeconds)||
      cue.startSeconds<priorEnd||cue.endSeconds<=cue.startSeconds||cue.endSeconds>n.durationSeconds+.02)
      throw new Error(`Invalid measured sentence timestamps at sentence ${i+1}`);
    priorEnd=cue.endSeconds;
  });
}

/** When the new recording is absent, protect speech with full ducking rather than inventing syllable timings. */
export function y004NarrationActivity01(seconds: number, narration?: Y004MeasuredNarration, fadeSeconds=.095): number {
  if(!narration)return 1;
  validateY004Narration(narration);
  if(!Number.isFinite(seconds)||seconds<0)return 0;
  return narration.sentences.reduce((activity,cue)=>Math.max(activity,
    smooth((seconds-(cue.startSeconds-fadeSeconds))/fadeSeconds)*
    (1-smooth((seconds-cue.endSeconds)/fadeSeconds))),0);
}
