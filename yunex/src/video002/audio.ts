import {BeatId} from './timeline';

export const VIDEO002_AUDIO={
  editedVo:'video002/d_vo_trimmed.wav',
  proofMix:'video002/d_mix.wav',
  originalVoSha256:'899514c1a72080d87b76a5155841cb727b43644d6c636aa16f8eb28c83f60171',
  editedVoSha256:'c023dd93a3dda53015107c0c670c046b1a6ce19db4785b23557394443a340d39',
  proofMixSha256:'217e5efe0619d922a215c7572c4cc205731b79e57b65267bfdf39daf6280a8b9',
  targetIntegratedLufs:-15,
  measuredIntegratedLufs:-15.4,
  measuredTruePeakDbfs:-1.0,
} as const;

export type AudioAccent={at:number;kind:'wingTick'|'brakeLoad';beat:BeatId;note:string};
export const VIDEO002_AUDIO_ACCENTS:readonly AudioAccent[]=[
  {at:.65,kind:'wingTick',beat:'hook',note:'Quiet mechanism tick; supports visible immediate flap movement.'},
  {at:10.25,kind:'wingTick',beat:'drs',note:'Restrained DRS transition cue.'},
  {at:14.15,kind:'wingTick',beat:'airbrake',note:'Mechanical set cue before brake load.'},
  {at:14.35,kind:'brakeLoad',beat:'airbrake',note:'Short filtered brake/wind load accent; no trailer boom.'},
] as const;

export const VIDEO002_AUDIO_PROVENANCE={
  voice:'User-supplied OpenAI FM Alloy MP3; words/pitch preserved, only detected silent intervals shortened.',
  engine:'Procedural low sine harmonics for D timing proof only.',
  wind:'Procedural filtered pink noise for D timing proof only.',
  mechanism:'Procedural short sine/noise accents for D timing proof only.',
  licensing:'No third-party SFX were introduced by Agent D.',
} as const;
