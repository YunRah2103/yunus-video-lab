# YUNEX — engine visual refinement handoff
Implementation owner: GPT-5.6 Sol. Master retains creative direction and final approval.

## Mission
Make the existing 992 GT3 RS flat-six look like **serious, dense, engineered machinery** in the film's medium and close technical shots.

This is a **visual-strength pass, not a complexity contest**. Refine the existing engine. Do not rebuild the approved Porsche, replace the engine with a different asset, alter engine placement, rewrite the film, or chase manufacturer-CAD fidelity.

The pass succeeds only if the improvement is obvious in the **actual 1080×1920 film renderer**, not merely in a beauty render or wireframe.

## Canonical state
Repository: `YunRah2103/yunus-video-lab`

Film branch / source of truth:
- `sol/yunex-full-film-v2`
- handoff was added at commit `bf3a1e4bf834360786a8fa76c916d2a32bbd1fda`
- film baseline immediately before the handoff: `95c34f83a338133a4aee084f3648e6c41eb30c31`

Engine files already exist in:
- `cars/porsche-911-gt3-rs-992/engine/`
- builder: `build_engine.py`
- exported asset: `engine.glb`
- renderer: `render_review.mjs`
- manifest / validation: `asset-manifest.json`, `validation.json`

The current builder already contains:
- rounded crankcase and bank masses;
- cover ribs / restrained fasteners;
- one plenum + crown;
- six intake runners and six head-port collars;
- six header primaries + collectors;
- accessory pulleys and continuous belt;
- mounts / simple pipework.

**Do not spend the pass merely adding more of the same primitives.** Improve form quality, transitions, layering, routing and material separation.

Current engine reference metrics:
- approximately 39,108 triangles;
- approximately 1.10 × 0.65 × 0.85 m;
- SHA-256 `62216a409c52b2411315e8c02324e25907b3f447b44138cd26d73378dea617fd`

Approved exterior SHA-256:
- `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`
- **must remain unchanged**

Create a dedicated engine-refinement branch from the current film state. Bring over only required engine changes. Do not merge unrelated history.

---

## Before touching geometry
Render the current exported `engine.glb` from the exact cameras that will be used for the final before/after comparison.

Inspect at:
1. full isolated hero size;
2. close three-quarter;
3. actual film frame around the engine-detail beat (roughly frames 145–220 in `ModelLedVideo.tsx`);
4. installed engine view inside the approved car.

Write a short diagnosis before implementation:
- what currently reads as a block / toy / placeholder;
- what disappears at film scale;
- where the silhouette is already strong and must be preserved;
- where repeated box/cylinder primitives are visually obvious;
- which changes will create the largest improvement per triangle.

Do not modify the asset until this diagnosis exists.

---

## Visual target
The engine should read as:
- compact but substantial;
- horizontally opposed / unmistakably flat-six;
- layered rather than made from stacked boxes;
- mechanically connected rather than decorated;
- clean premium engineering, not rusty workshop machinery;
- visually strong enough that the user wants to look at the model when the cutaway appears.

The key improvement should come from **secondary forms and transitions**:
- stepped casting mass;
- tapered ribs;
- gasket / seam breaks;
- flange lips;
- bosses and mounting pads;
- runner junctions;
- collector transitions;
- believable overlap between large components.

Avoid fake complexity. One convincing transition is worth more than twenty tiny bolts.

Use official Porsche / credible technical imagery only as shape-and-routing reference. Record links used. Approximate unverifiable hidden geometry instead of inventing ornamental mechanisms.

---

# Component priorities

## 1. Housings — highest priority
The current engine already has a rounded main case, sump, cylinder bulges, bank water-jacket masses and ribs. The weakness is likely **how primitive those pieces join**.

Improve:
- crankcase-to-bank transitions so the banks feel grown from / bolted to the case rather than floating slabs;
- bank / head mass so it has clear stepped depth from central case → cylinder region → head / cover;
- tapered or shaped casting ribs instead of repeated rectangular strips where visible;
- shallow seam / gasket lips around major case and cover boundaries;
- 2–4 readable bosses or mounting pads where they improve construction logic;
- bevel / radius treatment sufficient to produce clean highlight lines in the native renderer;
- sump / lower case silhouette so it feels structural rather than a rounded box attached underneath.

Do **not**:
- add a forest of bolts;
- make every surface ribbed;
- cover the engine in random panel lines;
- turn the engine into a sci-fi machine.

### Housing acceptance test
At the matched close three-quarter camera, the crankcase and banks should no longer look like simple rounded prisms with cylinders attached.

---

## 2. Intake — make the top half visually premium
The current intake has a rounded plenum, crown, six runners, throttle bodies and six head-port collars. Preserve all six connections.

Improve:
- plenum silhouette: less "rounded rectangular box + capsule", more coherent sculpted/tapered volume;
- runner entries into the plenum: clear transition collars / lips instead of tubes disappearing into a slab;
- runner exits into the heads: clear connection / flange or restrained rubber-coupler break;
- bend quality and spacing so all six runners remain individually readable;
- subtle left/right bank symmetry with enough variation in depth to avoid a toy-like copied look;
- a restrained intake material hierarchy: dark composite main body, metallic collars / interfaces.

Do not enlarge the plenum merely to make it dominant. Do not hide the banks beneath intake geometry.

### Intake acceptance test
From the film-detail angle, a viewer should immediately read "six purposeful intake paths feeding a flat-six", not "six black hoses under a box".

---

## 3. Headers — improve construction logic, not just smoothness
The current engine already has three primaries per bank and collectors.

Improve:
- primary start flanges / short necks at the heads;
- smooth organic routing with no visual kinks;
- clearer spacing between adjacent primaries;
- collector convergence that looks physically continuous rather than three tubes terminating beside a capsule;
- outlet transition and one or two restrained collar / weld-band cues where they are actually visible;
- subtle warm stainless / heat tone separation from aluminium parts.

No giant exhaust tubing, no turbo hardware, no disconnected pipes, no spaghetti complexity.

### Header acceptance test
Each side must read as **three primaries becoming one collector** at a glance. No intersections should be hidden by camera choice.

---

## 4. Accessory drive / secondary forms
The current accessory drive already has pulleys, hubs, belt and a rear plate.

Improve only if the first three priorities are strong:
- break the rear plate's slab silhouette using plausible cut-ins / bosses / stepped depth;
- give pulleys readable hub depth and edge profiles;
- add a small number of brackets / tensioner-like supporting forms where useful;
- add 1–3 simple hose / wiring routes only if they connect meaningful areas and survive film scale.

Do not create a microscopic engine bay wiring harness.

---

# Material and shading strategy
Current source materials already distinguish cast aluminium, brushed aluminium, dark composite, stainless, rubber and steel.

Important runtime fact:
`yunex/src/ModelLedVideo.tsx` clones model materials into `MeshPhongMaterial`. It preserves base colour / maps / normal maps, and derives a coarse shininess/specular response from metallicness. It does **not** preserve the full PBR roughness response. The film also has shadows disabled.

Therefore:
- do not spend the pass tuning tiny PBR roughness differences that disappear in-film;
- use geometry, bevels, surface-normal quality, base-colour separation and readable highlight edges;
- keep metallic vs dark composite contrast obvious but tasteful;
- keep cast aluminium slightly darker / softer than machined edge or collar details;
- keep headers warmer / darker than the bright aluminium without making them bronze;
- avoid chrome, mirror finishes and noisy grunge.

Provide both:
1. isolated PBR review;
2. actual film-renderer review.

The native film frame wins any disagreement between the two.

---

# Detail budget
Current asset is ~39k triangles.

Target:
- preferred final range: **50k–75k triangles**
- hard ceiling: **90k triangles**
- going near 90k requires a visible, demonstrated benefit.

Suggested spending order:
1. housing silhouette / transitions;
2. intake transitions and cleaner curved geometry;
3. header collector quality;
4. accessory silhouette;
5. only then small fasteners / lines.

Use a **screen-space rule**:
- if a new feature contributes no silhouette, no highlight break and is effectively invisible in the 1080×1920 film close-up, do not spend geometry on it;
- repeated micro detail should be instanced / reused;
- do not increase curve radial segments everywhere by default.

A higher triangle count is not evidence of a better engine.

---

# Locked asset contract
Coordinate system:
- metres;
- +Y up;
- +Z car forward;
- +X driver's left.

Transform / placement:
- `Engine_Root` remains at crankcase centre;
- installed at `Marker_Engine_Mass = [0, 0.47, -1.78]`;
- zero local placement offset;
- rear axle Z approximately `-1.2114`;
- flywheel interface faces +Z;
- accessory end faces -Z.

Preserve these independent groups under `Engine_Root`:
- `Crankcase`
- `Bank_L`
- `Bank_R`
- `Intake`
- `Headers_L`
- `Headers_R`
- `Accessory_Drive`
- `Cover_L`
- `Cover_R`
- `Mounts`

All new details go beneath the correct existing group.

Preserve:
- explode capability;
- highlight capability;
- group independence;
- current engine location;
- car scale;
- car orientation;
- animation groups;
- exterior GLB.

Do not make visual impact by scaling the engine. Stay within the existing approximate 1.10 × 0.65 × 0.85 m envelope unless a very small change is mechanically necessary and explicitly reported.

The marker is an editorial placement anchor, not proof of centre-of-gravity or exact mechanical clearance.

---

# The approved car is untouchable
Do not modify:
- `yunex/public/model.glb`;
- approved Porsche exterior geometry;
- wheel placement;
- body materials;
- car camera path;
- cutaway timing;
- current engine marker;
- full-film animation structure.

The existing engine-detail beat uses an enlarged secondary engine view around frames 125–246. Improve the model so this shot becomes stronger; **do not redesign the film to hide engine weaknesses**.

No full-film rerender is required unless needed only for a short validation frame or clip.

---

# Implementation workflow
1. Record baseline commit, hashes, triangle count and bounds.
2. Render locked BEFORE cameras from the current GLB.
3. Diagnose the 3–5 largest visible weaknesses.
4. Improve housings first.
5. Re-render the exact hero + close cameras.
6. Improve intake only where it still reads weak.
7. Re-render.
8. Improve headers / collectors.
9. Spend remaining budget on secondary forms and material separation.
10. Export actual GLB and reload it from disk.
11. Validate hierarchy, bounds, normals, material values and component counts.
12. Sync approved refined `engine.glb` to `yunex/public/engine.glb`.
13. Confirm the two engine GLB hashes match.
14. Render native film frame(s) at 1080×1920.
15. Perform **one corrective pass** based on what the film renderer actually shows.
16. Deliver for master review. Stop there.

Use Context7 only when an unfamiliar Three.js / glTF API detail needs verification. Do not burn time researching APIs already working in the current pipeline.

---

# Matched BEFORE / AFTER requirement
This is mandatory and must be honest.

For each matched pair:
- same camera;
- same focal / orthographic settings;
- same model scale;
- same lighting;
- same background;
- same exposure;
- same output resolution;
- no extra depth of field, bloom or dramatic beauty-light cheat in AFTER.

Required matched pairs:
1. rear three-quarter hero;
2. close three-quarter focused on housing + intake + headers;
3. native film-renderer engine-detail frame.

Also provide:
- side;
- top;
- installed side/top with rear axle context;
- exploded component view.

If the difference is not immediately visible in the matched close pair, the pass is not finished.

---

# Validation gates
All must pass before delivery.

## Geometry
- six intake runners present;
- six head-port connections present;
- three header primaries per bank;
- both collectors continuous;
- no disconnected tubes;
- no obvious self-intersections in review angles;
- clean normals / no broken shading;
- finite bounds;
- export reload succeeds.

## Asset contract
- all required group names exist;
- independent groups still animate / explode correctly;
- `Engine_Root` origin contract preserved;
- placement unchanged;
- approximate envelope preserved;
- approved exterior hash unchanged.

## Film
- engine remains legible through the ghosted car;
- material separation survives MeshPhong conversion;
- no important detail depends solely on roughness;
- close engine-detail shot gains visible mechanical density;
- no new geometry causes ugly transparency / clipping behaviour;
- render performance remains reasonable.

## Quality rejection conditions
Reject your own pass if any of these are true:
- the improvement is mainly "more bolts";
- the plenum is still obviously a rounded box;
- the case/banks still look like stacked primitives;
- headers still merge abruptly into a capsule-like collector;
- AFTER only looks better because of lighting/camera;
- engine was scaled larger to fake impact;
- group hierarchy broke;
- exterior changed;
- film render looks materially worse than PBR preview;
- triangle count rose heavily with little screen-visible gain.

---

# Required deliverables
Update in the engine folder:
- `engine.glb`;
- `build_engine.py`;
- `README.md`;
- `asset-manifest.json`;
- `validation.json`;
- review images / comparison sheet as appropriate.

Synchronize:
- `yunex/public/engine.glb`

Return:
- branch;
- final commit SHA;
- exact triangle count;
- exact bounds;
- final engine SHA-256;
- exterior SHA-256 proving unchanged car;
- list of files changed;
- before/after preview paths;
- native 1080×1920 film-render preview path;
- concise description of what changed in housings, intake, headers and materials;
- remaining visible limitations / intersections, stated honestly.

## Done means
The refined engine looks **noticeably stronger, denser and more credible** without losing the flat-six silhouette, existing placement, approved car, or film animation contract.

The strongest test is simple:

> Put the old and new close three-quarter renders side-by-side at the same scale. The new engine should look like a more expensive model before anyone reads the changelog.

Stop after one strong refinement + corrective pass and return it for master visual approval.
