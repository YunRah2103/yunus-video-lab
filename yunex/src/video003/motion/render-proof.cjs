const path = require('node:path');
const fs = require('node:fs');
require(path.resolve(__dirname, '../../../fix-network.cjs'));
const {bundle} = require('@remotion/bundler');
const {
  renderMedia,
  renderStill,
  selectComposition,
} = require('@remotion/renderer');

(async () => {
  const outputDir = path.resolve(__dirname, '../../../out/y003-agent-a');
  fs.mkdirSync(outputDir, {recursive: true});

  const serveUrl = await bundle({
    entryPoint: path.resolve(__dirname, 'proof-entry.tsx'),
  });
  const composition = await selectComposition({
    serveUrl,
    id: 'YUNEX-003-A-MOTION-PROOF',
    chromiumOptions: {gl: 'swangle'},
  });

  await renderMedia({
    serveUrl,
    composition,
    codec: 'h264',
    outputLocation: path.join(outputDir, 'YUNEX_003_A_MOTION_PROOF.mp4'),
    chromiumOptions: {gl: 'swangle'},
    concurrency: 2,
    timeoutInMilliseconds: 120000,
  });

  for (const frame of [0, 89, 128, 179]) {
    await renderStill({
      serveUrl,
      composition,
      frame,
      output: path.join(outputDir, `frame-${String(frame).padStart(3, '0')}.png`),
      chromiumOptions: {gl: 'swangle'},
      timeoutInMilliseconds: 120000,
    });
  }

  console.log(JSON.stringify({
    composition: composition.id,
    width: composition.width,
    height: composition.height,
    fps: composition.fps,
    durationInFrames: composition.durationInFrames,
    outputDir,
  }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
