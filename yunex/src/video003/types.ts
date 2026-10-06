import type {MotionState} from './motion';
import type {FrontSuspensionState} from './suspension';
import type {Y003CameraPose,Y003CameraShotId} from './cameras/cameraContract';

export type Y003SharedFrameState={
  frame:number;
  seconds:number;
  motion:MotionState;
  suspension:FrontSuspensionState;
  camera:Y003CameraPose;
  shot:Y003CameraShotId;
  reveal01:number;
  suspensionVisibility01:number;
  airflowVisibility01:number;
  mechanicalExposure01:number;
};

export type Y003RenderManifest={
  phase:'Y003-SUSPENSION-AERO-01';
  fps:30;
  width:1080;
  height:1920;
  durationFrames:number;
  durationSeconds:number;
  modelSha256:string;
};
