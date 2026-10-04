# YUNEX-001

A 27.6-second vertical automotive engineering explainer rendered at 1080 × 1920 and 30 fps with Remotion. See `VISUAL_LANGUAGE.md` for the repeatable directing and engineering conventions.

## Setup and preview

Requires Node.js and npm.

```bash
npm install
npm run preview
```

The preview opens Remotion Studio with the `YUNEX-001` composition.

## Render

```bash
npm run render
```

The finished video is written to `out/YUNEX_001.mp4`. Both scripts preload `fix-network.cjs`; the render uses software-angle graphics and two concurrent workers for predictable operation in this environment.

## Asset dependency

`public/model.glb` is a copied build artifact of `../cars/porsche-911-gt3-rs-992/model.glb`. The source asset package contains its manifest, preparation script, attribution, and validation notes. If the prepared car asset changes, copy it again before previewing or rendering:

```bash
cp ../cars/porsche-911-gt3-rs-992/model.glb public/model.glb
```

The GLB is self-contained and does not require external textures. Other footage, audio, imagery, and font files used by the composition are stored in `public/`. Review [LICENSES.md](LICENSES.md) before sharing any output.

## Car rendering architecture

`public/model.glb` is the live 3D source used by `LiveCarCanvas`. The production composition uses cached alpha layers in `public/plates/` to accelerate software video rendering. The live source component remains available to regenerate those plates when the model, camera, lighting, or technical overlays change.

## Restoring from GitHub

GitHub holds the source and canonical car asset; the delivered production ZIP includes the supplied or derived media and cached plates. Copy the canonical car asset to `public/model.glb`, then run `node render-plates.cjs`. Bring the credited media files from the production pack before previewing or rendering the full composition.
