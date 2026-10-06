export type TrackVec2 = [number, number];

export type TrackSide = 'left' | 'right';
export type KerbPurpose = 'none' | 'apex' | 'exit';

export type KerbEligibility = {
  left: KerbPurpose;
  right: KerbPurpose;
};

export type TrackLayoutSample = {
  z: number;
  center: TrackVec2;
  tangent: TrackVec2;
  leftNormal: TrackVec2;
  roadLeft: TrackVec2;
  roadRight: TrackVec2;
  runoffLeft: TrackVec2;
  runoffRight: TrackVec2;
  barrierLeft: TrackVec2;
  barrierRight: TrackVec2;
  landscapeLeft: TrackVec2;
  landscapeRight: TrackVec2;
  leftRunoffWidth: number;
  rightRunoffWidth: number;
  kerb: KerbEligibility;
};

export type TrackLayoutValidation = {
  ok: boolean;
  issues: string[];
  metrics: {
    sampleCount: number;
    roadWidth: number;
    minCarFootprintEdgeClearance: number;
    maxHeadingDegrees: number;
    maxCenterStep: number;
    straightCorridorMaxCenterError: number;
  };
};
