# Agent C: run the TRUE native camera + guides proof after Manager integration

This proof composition is C-owned code. It references the A motion and B rear steering public APIs, so it is intentionally **integration dependent** and cannot render on C's isolated dispatch branch. Do not cherry-pick another agent's source into C to make it appear independent.

Pinned API compatibility inspected (not Manager accepted): A `8ba8678a9a98d5abd5b1b61bd800c5e90b95dc83`, B `0c6398a497bd034ca12baa39d519e5a92b504a26`.

In a checkout with Manager-accepted A/B/C integrated, from the repository root:

```bash
cp cars/porsche-911-gt3-rs-992/model.glb yunex/public/model.glb
cd yunex
npm ci --no-audit --no-fund
npx esbuild src/video004/camera/testEntry.ts --bundle --platform=node --format=cjs --outfile=/tmp/y004-c-tests.cjs
node /tmp/y004-c-tests.cjs
NODE_OPTIONS=--require=./fix-network.cjs npx remotion render src/video004/camera/proofEntry.tsx Y004-C-NATIVE-PROOF out/Y004-C-NATIVE-PROOF.mp4 --gl=swangle --concurrency=1 --codec=h264 --pixel-format=yuv420p --crf=17 --muted
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate,nb_frames -of json out/Y004-C-NATIVE-PROOF.mp4
ffmpeg -v error -i out/Y004-C-NATIVE-PROOF.mp4 -f null -
```

Expect 330 continuous frames at 1080x1920/30fps/11.0s. Review the MP4 normally, muted, across opening, moving macro, matched low/high, fixed trackside pass and rear exit. The last two are deliberately cut, not a single teleporting camera move. All scenes use the real model/track and A+B runtime: a runtime failure is a **blocked proof**, not permission to fake rear steer.

Publish immutable integrated source SHA, artifact ID, run ID, exact range/source frame mapping, FFprobe and full decoder results, and any observed defects. This is only a runner, not evidence it has run or passed.
