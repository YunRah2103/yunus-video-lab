# YUNEX 002 — Agent D track lighting results

Status: IMPLEMENTED on sol/yunex-002-track-lighting from locked base c7b2be16526eeed9e5635c6462887fa92be94353.

## Owned implementation

- ../TrackLighting.tsx — opt-in lighting/reflection/contact component accepting quality preview/final plus optional seed.
- profile.ts — deterministic preview/final quality profiles and manager renderer setup recommendation.
- textures.ts — deterministic authored procedural outdoor sky and soft contact texture; created once per mount, never per frame.
- validate-track-lighting.cjs — static contract checks for determinism, moving contact, shadow support and no Porsche material/scene-graph mutation.

## Integration API

Use TrackLighting inside the integrated ThreeCanvas scene with quality="final" and seed={2103}.

Manager-owned renderer wiring when enabling the module:
- ThreeCanvas shadows enabled.
- gl.shadowMap.enabled = true.
- gl.shadowMap.type = THREE.PCFSoftShadowMap.
- gl.toneMapping = THREE.ACESFilmicToneMapping.
- gl.toneMappingExposure = 0.94.
- Porsche meshes castShadow = true; do not change material values.
- Track/road meshes receiveShadow = true.

The key light and its shadow camera translate with rootPoseAt(frame), keeping the shadow budget centred on the moving Porsche instead of freezing at the initial position. The restrained contact catcher also follows the moving root. Once the manager enables Porsche castShadow, the real shadow map naturally includes live front/rear aero geometry at each rendered frame.

## Look intent

Controlled neutral outdoor sky, warm soft key, cool restrained fill, preserved white highlights and green livery, low-opacity moving contact. No bloom, fake HDR, crushed shadows, neon or material overrides.

## QA

Run:

node src/video002/trackUpgrade/lighting/validate-track-lighting.cjs

Expected:

D lighting contract OK: deterministic sky, moving key/contact, preserved car materials, final 2048 shadow profile

Native same-frame before/after images and the short motion proof must be rendered by the manager/E native-render queue after central wiring, because Agent D is explicitly prohibited from editing Video002Integrated.tsx, TrackPreview.tsx, the central registry or workflow paths. Do not substitute an upscale or fabricated proof.

Recommended review frames are exported in TRACK_LIGHTING_REVIEW_FRAMES:
- hook 24
- macro 132
- DRS 342
- final 720
