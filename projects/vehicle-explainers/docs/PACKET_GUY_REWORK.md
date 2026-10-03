# Packet Guy — presenter rework

The user approved the Porsche V3 edit and identified the presenter model as its remaining weak part. This revision replaces presenter art while retaining the 25-shot automotive edit, caption timing, supplied Cedar voiceover and audio mix.

## Drawing

Built-in image generation produced two transparent RGBA atlases from the established Packet Guy identity. The redraw replaces dot eyes, tube arms, mitten hands and the rigid polygon hoodie with expressive eyes/eyebrows, a shaped nose and jaw, scruffy stubble, articulated hands and restrained cel-shaded clothing folds. The black cap/cyan chevron, messy black hair, natural light-brown skin and oversized black hoodie remain. No clothing or identity spec was redefined.

- `public/presenter/rework/poses.png`: 1254×1254, nine waist-up drawings. Skeptical, speaking, pointing, shrugging, shocked, unimpressed, thinking, explaining and looking up.
- `public/presenter/rework/heads.png`: 1254×1254, four larger reaction cutouts. Skeptical, confused, shocked and unimpressed.
- `src/components/PacketGuyRework.tsx`: explicit source viewports, an isolation polygon for the explaining gesture, bottom framing and small frame-driven speech emphasis. No CSS animation or runtime image generation.

Production atlases are retained byte-for-byte from the built-in output. Transparent cell padding and pose shapes differ, so source rectangles are intentionally authored rather than calculated by a uniform grid crop. The explaining and looking-up pose boundaries exclude neighbouring silhouettes without clipping their gestures. Waist-up drawings are framed through the lower edge of the video. Giant heads remain intentionally cropped at frame edges.

## Reproduce

Use the V3 preparation/render workflow in the main README. A separate output can be selected without replacing a previous local export:

```bash
V3_OUTPUT=out/PORSCHE_V3_PACKET_GUY_REWORK.mp4 npm run render:v3
```

No model API or regeneration is needed. Keep both committed art atlases available to the composition. The old Python presenter generator remains for the legacy V1 composition only.

## Generation briefs

Tool: built-in image generation, transparent background enabled. Identity reference: the legacy neutral Packet Guy, then the new pose atlas for the reaction atlas. The final prompts are retained in `public/presenter/rework/generation-prompts.json`.

## Limits

This is a consistent 2D illustrated pose pack, not a 3D rig or frame-by-frame character animation. Talking uses a speaking drawing with small motion emphasis; mouth shapes are not phoneme-synchronized. Giant reactions use the higher-detail head atlas. Some pose-to-pose drawing differences remain. Automotive imagery and footage limitations are unchanged from V3.

## Validation

TypeScript check passed. Six composition lookdev frames inspected before full render. Corrected a neighbouring-pose sliver and waist framing before export. Decoded and inspected the entire 3,616-frame export at half-second intervals, then corrected a second small neighbouring-hand sliver in the looking-up pose and re-rendered. Output remains 60.267s, 1080×1920 at 60fps, H.264/AAC. Decoded audio SHA-256 exactly matches the approved V3 export, verifying that the voiceover and mix did not change.

Review used chronological frame sequences and audio verification; real-time audiovisual playback was unavailable in this environment.
