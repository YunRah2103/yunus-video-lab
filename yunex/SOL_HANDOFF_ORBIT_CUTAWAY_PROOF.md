# YUNEX — next agent: orbit-to-cutaway proof
Reviewed engine: sol/gt3rs-engine-lookdev at 989947aaa7c71858ced751a05f3bc934ec62cb2e.

Master decision: accept this simplified engine for the next video look-development proof. Smooth shading, connected intake and readable opposed banks are sufficient at medium scale. This is not approval for macro realism or verified mechanical clearance. Stop further engine detailing.

Continue the existing project in YunRah2103/yunus-video-lab. Read yunex/SOL_HANDOFF_MODEL_LED_V2.md for locked creative direction and architecture. Preserve V1 and the approved exterior. Start a dedicated video-proof branch containing the reviewed engine changes; do not merge either branch to main.

Deliver only a 6–8 second 1080x1920, 30fps motion proof:
- 0–2s: centred green/white Porsche, charcoal studio, controlled rear-three-quarter orbit, hook PORSCHE NEVER FIXED THIS. Reveal a first engine glimpse by 2s.
- 2–5s: continuous move toward side-on; rear panel cutaway develops while a faint shell preserves the complete silhouette. Reveal the separate engine at Marker_Engine_Mass. No fixed-image crossfade.
- 5–8s: settle into a clean medium technical view showing FRONT AXLE, REAR AXLE and ENGINE MASS, with labels projected from actual coordinates.

Use the existing engine GLB, not the old procedural placeholder. Keep car wing/nose within safe margins and use the established typography/palette. Improve lighting in scene; do not remodel the engine merely to chase a shinier isolated preview.

Installed fit remains unresolved: the side render places the plenum near the deck line and transparent layers cannot establish clearance. Inspect opaque rear-body surfaces at the installed transform before rendering the reveal. If a genuine intersection appears, report the affected mesh and location; make only a small documented installation adjustment if justified. Do not alter the approved exterior, blindly shrink the engine, or claim CAD accuracy.

Use existing VO timing where available; no rewritten narration or full-film implementation. Frame-driven Three.js animation and Remotion assembly remain the architecture. Use Context7 for API details and Superpowers for focused debugging.

Return the playable proof MP4, three key frames, exact commit, fit findings and a short list of known limitations. Inspect the full proof for clipping, label collisions and awkward motion before delivering. Stop for master review. Full video follows after this gate.
