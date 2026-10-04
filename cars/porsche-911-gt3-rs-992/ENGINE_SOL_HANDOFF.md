# YUNEX · engine add-on · Sol handoff

Create ONE separate reusable engine asset for the approved 992 GT3 RS. Do not edit or rebuild the exterior GLB. Astra owns visual direction and final acceptance. Keep this a modest, visually credible engineering asset, not a CAD or full internal-mechanism project.

## Model contract

- Represent the water-cooled, naturally aspirated 4.0-litre Porsche flat-six: three horizontally opposed cylinders per bank, longitudinal crankshaft, low broad crankcase, closed heads/cam covers, upper intake with six individual throttle-body connections, and three exhaust primaries per side joining collectors underneath.
- Do not use a V configuration, turbochargers, a classic air-cooled fan tower, or oversized exposed cooling fins. Cylinder detail should primarily sit inside credible water-cooled bank housings.
- Separate named groups: `Engine_Root`, `Crankcase`, `Bank_L`, `Bank_R`, `Intake`, `Headers_L`, `Headers_R`, `Accessory_Drive`, `Cover_L`, `Cover_R`, `Mounts`. Include only a few readable accessory forms and pipes; no tiny bolt grids, hoses everywhere, pistons, valvetrain or animated internals.
- Brushed/cast aluminium, dark composite intake/covers, stainless headers, restrained rubber. Add bevels, plausible ribs, flange edges and a few fasteners where they improve close-shot readability. Avoid grunge and invented branding.
- Target approximately 25–50k triangles and reusable PBR materials; textures optional, maximum 1k when used. Treat the target as a budget, not a reason to add geometry.

## Scale and installation

Metres; +Y up, +Z car forward, +X driver's left. Engine local root at the crankcase centre, predictable component origins and documented local explode vectors. Flywheel/transmission interface faces car-forward (+Z); accessory end faces rearward (-Z). Do not model the gearbox.

Start with an **illustrative envelope**, approximately 1.1 m wide × 0.85 m long × 0.65 m high, local Y roughly -0.24 to +0.41 m. These are fit targets, not measured Porsche engine dimensions. Install by attaching the engine root at the existing `Marker_Engine_Mass` ([0, 0.47, -1.78] m in the current car). Rear axle centre is approximately Z=-1.211 m. Check clearance against tyres, rear bumper, deck and ground; make small documented local offsets if necessary. The marker is approximate and is not a validated engine centre of gravity.

## References and execution

Use Porsche's 992 GT3 RS drivetrain reference and actual engine photographs to establish visible intake/header/accessory arrangement before modelling:
https://newsroom.porsche.com/dam/jcr%3Afe2fb6d3-d0e3-44d8-8f2d-d82a66674718/PAG-911-GT3-RS-EN.pdf
https://newsroom.porsche.com/en_US/2022/products/porsche-911-gt3-rs-world-premiere-29439.html

Use Context7 for current Three.js/glTF APIs and Superpowers for focused planning/debugging/verification. The existing local runtime is sufficient; Floot/Replit only if an observed limitation justifies it. Reuse current studio lighting/presentation code. Build original simplified geometry; do not silently import another restricted engine asset. Preserve the car's existing attribution/licence when presenting installed previews.

## Deliverables and acceptance

Store in `cars/porsche-911-gt3-rs-992/engine/`: `engine.glb`, rebuild source, `README.md`, `asset-manifest.json`, and `renders/` containing rear-three-quarter, side, top, isolated-hero and installed previews. Add one exploded preview to demonstrate separable groups; do not build another video yet.

First supply a rough isolated/installed look-development pair for Astra inspection. Then refine only silhouette, component readability, materials and fit. Verify glTF loading, finite bounds, metre scale, named groups, reusable materials, exploded transforms and installed clearance. Manifest records actual bounds, triangle count, placement transform, limitations and SHA-256. Commit on a dedicated branch for Astra review. Do not claim manufacturer CAD fidelity, mechanical simulation or final approval.
