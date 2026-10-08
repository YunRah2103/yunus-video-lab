# Agent B — YUNEX 004 rear mechanical rig implementation

Phase: Y004-REAR-STEERING-01  
Branch: `sol/y004-b-rig`  
Initial dispatch SHA: `bf2f0996f4176791d5ac78d818090e8b429397ad`  
Locked actual Porsche model SHA256: `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`

## Changes in exclusively owned B paths

- `yunex/src/video004/rig/index.ts` exports `createY004RearSteerRig(model)`. Accepts `Y004DriveFrame` from A, or a typed `MotionState` fixture until A is approved. `apply`, idempotent `restore`, terminal `dispose`, and dynamic `audit`.
- Finds the real Porsche `Steer_RL/RR`, `Spin_RL/RR` and `Caliper_RL/RR`. Uses Three.js world-pose-preserving `attach()` before creating the UNMODIFIED corrected P03 `createRuntimeMotionRig`. Rear calipers then inherit steer/upright suspension offset, not tyre/wheel roll.
- Retains P03's measured camber spin axes, quaternion composition, wheel spin by distance, contact and chassis transforms. Bodywork, GLB bytes, older productions, track and common manager contracts are untouched.
- Snapshots/restores rear-caliper original parents, position, quaternion, scale and descendant mesh material references. Repeated restore and reactivation are implemented. Validates all four wheel samples, shared-frame agreement, rear same-sign coherence and illustrative rear steer <= 1 degree (not claimed as Porsche calibration).
- `rig.test.ts` includes synthetic fixture checks, out-of-order transform determinism, all wheel hubs, mismatched-frame/rear-sign/cap errors, caliper non-spin, exact hierarchy restoration and actual-GLB P03 rim NORMAL precession across 4 wheels × 72 turns × rear 0/±1°. Checks world tyre contact.
- `BRearRigProofScene.tsx` and `proof-entry.tsx` register independent 150-frame low/high native Remotion wheel macro fixtures using the actual Porsche on a moving approved track. These are **not** Agent A's accepted production controller.
- `render-proof.cjs` stages the SHA-locked Porsche, runs real asset tests, renders 2 native 1080x1920 30fps 5-second H.264/yuv420p MP4s, full-decodes each with FFmpeg, enforces dimensions/frame count/duration, and writes real artifact SHA256 identities to `yunex/out/y004-b-rig/proof-manifest.json`. Outputs are intentionally not committed to Git.

## How to execute the evidence gate

Run from `yunex/` in a full checked-out source environment (Node 22, npm ci, Chromium/Remotion, FFmpeg, actual Porsche GLB):

```bash
npx --yes tsx src/video004/rig/rig.test.ts
node src/video004/rig/render-proof.cjs
```

The second command itself runs the test first and fails closed on a model-hash mismatch. It emits native clips in `yunex/out/y004-b-rig/`. Upload those via the Manager/E authorized GitHub Actions workflow as downloadable artifacts; send the output manifest, run ID, source SHA and inspected clips to F.

## Evidence and limitations (do not overstate)

- Static TypeScript/TSX parser and Node script syntax checks performed in an isolated workspace; no syntax diagnostics in authored files.
- **Actual GLB tests: NOT EXECUTED in this ChatGPT environment** (source checkout/GLB and Three/Remotion dependencies not locally available).
- **Native moving clip render: NOT EXECUTED.** No genuine proof artifact/run ID or validated frame metrics can be asserted before executing the provided runner.
- Wheel-arch clipping cannot be certified by static source checks; inspect both rendered moving clips at 100% and slow motion.
- **Agent A integration: PENDING its independently verified accepted SHA.** Do not imply A is done; B fixture does not simulate proprietary Porsche steering logic.

## Manager integration

Import `createY004RearSteerRig` from `src/video004/rig`. Call `const rig=createY004RearSteerRig(gltf.scene)` once, then `rig.apply(y004MotionAtFrame(frame))` each frame; call `rig.dispose()` on teardown. Never instantiate a second P03 rig against the same model. Avoid extra caliper transforms/rotations in the Manager composition. When A's branch is accepted, test actual A low/high/boundary samples in this rig, record A's full SHA and rerun the native proof and independent F QA. No source files outside B ownership were modified.
