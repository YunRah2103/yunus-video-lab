const path = require('node:path');
const fs = require('node:fs');
require(path.resolve(__dirname, '../../../fix-network.cjs'));
const {bundle} = require('@remotion/bundler');
const {
  renderMedia,
  renderStill,
  selectComposition,
} = require('@remotion/renderer');

const PROOFS = [
  {
    id: 'YUNEX-003-A-P02-NEUTRAL',
    file: 'YUNEX_003_P02_A_NEUTRAL_ROLL.mp4',
    sourceFrames: [100, 189],
  },
  {
    id: 'YUNEX-003-A-P02-STEERING',
    file: 'YUNEX_003_P02_A_STEERING_LOAD.mp4',
    sourceFrames: [190, 279],
  },
  {
    id: 'YUNEX-003-A-P02-COMPARISON',
    file: 'YUNEX_003_P02_A_BEFORE_AFTER.mp4',
    sourceFrames: [290, 379],
  },
];

(async () => {
  const outputDir = path.resolve(__dirname, '../../../out/y003-agent-a-p02');
  fs.mkdirSync(outputDir, {recursive: true});

  const serveUrl = await bundle({
    entryPoint: path.resolve(__dirname, 'proof-entry.tsx'),
  });

  const manifest = {
    generatedBy: 'yunex/src/video003/motion/render-proof.cjs',
    native: true,
    width: 1080,
    height: 1920,
    fps: 30,
    proofs: [],
  };

  for (const spec of PROOFS) {
    const composition = await selectComposition({
      serveUrl,
      id: spec.id,
      chromiumOptions: {gl: 'swangle'},
    });

    const outputLocation = path.join(outputDir, spec.file);
    await renderMedia({
      serveUrl,
      composition,
      codec: 'h264',
      pixelFormat: 'yuv420p',
      outputLocation,
      chromiumOptions: {gl: 'swangle'},
      concurrency: 2,
      timeoutInMilliseconds: 180000,
    });

    const stem = path.basename(spec.file, '.mp4');
    for (const frame of [0, 22, 45, 68, 89]) {
      await renderStill({
        serveUrl,
        composition,
        frame,
        output: path.join(
          outputDir,
          `${stem}_frame-${String(frame).padStart(3, '0')}.png`,
        ),
        chromiumOptions: {gl: 'swangle'},
        timeoutInMilliseconds: 180000,
      });
    }

    manifest.proofs.push({
      composition: composition.id,
      file: spec.file,
      width: composition.width,
      height: composition.height,
      fps: composition.fps,
      durationInFrames: composition.durationInFrames,
      sourceFrames: spec.sourceFrames,
    });
  }

  fs.writeFileSync(
    path.join(outputDir, 'render-manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  );
  console.log(JSON.stringify(manifest, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
