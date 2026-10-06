export type TrackLightingQuality='preview'|'final';

export type TrackLightingProfile={
  keyIntensity:number;
  fillIntensity:number;
  hemisphereIntensity:number;
  contactOpacity:number;
  shadowMapSize:1024|2048;
  shadowExtent:number;
  environmentIntensity:number;
  backgroundIntensity:number;
};

const PROFILES:Record<TrackLightingQuality,TrackLightingProfile>={
  preview:{
    keyIntensity:2.55,
    fillIntensity:0.52,
    hemisphereIntensity:1.18,
    contactOpacity:0.13,
    shadowMapSize:1024,
    shadowExtent:5.0,
    environmentIntensity:0.84,
    backgroundIntensity:0.78,
  },
  final:{
    keyIntensity:2.72,
    fillIntensity:0.56,
    hemisphereIntensity:1.20,
    contactOpacity:0.12,
    shadowMapSize:2048,
    shadowExtent:5.4,
    environmentIntensity:0.88,
    backgroundIntensity:0.80,
  },
};

export const lightingProfileFor=(quality:TrackLightingQuality)=>PROFILES[quality];

export const TRACK_LIGHTING_SETUP={
  toneMapping:'ACESFilmicToneMapping',
  toneMappingExposure:0.94,
  shadowMapType:'PCFSoftShadowMap',
  rendererShadows:true,
  carCastShadow:true,
  trackReceiveShadow:true,
  preserveCarMaterials:true,
  note:'Manager owns ThreeCanvas/global renderer wiring. Enable shadows, set PCFSoftShadowMap and use exposure 0.94 when TrackLighting is active; do not alter Porsche material values.',
} as const;

export const TRACK_LIGHTING_REVIEW_FRAMES={
  hook:24,
  macro:132,
  drs:342,
  final:720,
} as const;
