# YUNEX · Porsche 911 GT3 RS (992)

One reusable 992 GT3 RS exterior asset. `model.glb` is self-contained: textures are embedded. The `textures/` copies are optional for editing. Five preview PNGs live in `renders/`.

This is a production-prepared adaptation of Ddiaz Design's 2023 GT3 RS Carrera Tribute model, not a newly hand-modelled or manufacturer CAD asset. Original exterior topology and UVs are retained. The white / Python Green tribute finish is preserved.

## Coordinate contract

- Units: metres. Overall length: 4.572 m. Ground: Y = 0.
- Up: +Y. Forward: +Z. Driver's left: +X.
- Root: `YUNEX_Porsche_911_GT3_RS_992`. Origin at ground level, centred between the longitudinal bounds.
- Wheel suffixes: FL, FR, RL, RR (front/rear, left/right).
- `Steer_FL` / `Steer_FR`: rotate local Y to steer; front calipers follow these pivots.
- `Spin_FL`, `Spin_FR`, `Spin_RL`, `Spin_RR`: rotate local X for wheel rotation. Each group includes its tyre and rim.
- `Caliper_*`: independent stationary calipers. Brake-disc geometry remains with the source wheel assembly.
- `Wing`, `Wing_Flap`: separated spatially for aero illustrations, with local pivot near the wing. This is an approximate animation split, not a mechanically exact DRS rig.
- `Body`, `Glass`, `Lights`, `Grilles`, `Interior`: separately addressable groups.
- `Marker_Front_Axle`, `Marker_Rear_Axle`: empty wheel-centre markers.
- `Marker_Engine_Mass`: approximate empty marker behind the rear axle. No detailed engine geometry is included or claimed.

## Three.js example

```js
const gltf = await new GLTFLoader().loadAsync('model.glb');
scene.add(gltf.scene);
gltf.scene.getObjectByName('Steer_FL').rotation.y = 0.12;
gltf.scene.getObjectByName('Steer_FR').rotation.y = 0.12;
for (const side of ['FL', 'FR', 'RL', 'RR']) {
  gltf.scene.getObjectByName(`Spin_${side}`).rotation.x = distance / tyreRadius;
}
```

For cutaways, fade Body / Glass / Grilles / Interior while retaining the wheels. Add your own simplified engine at Marker_Engine_Mass. Mass, load and aero animations are explanatory illustrations; this asset does not contain a vehicle dynamics solver.

## Optimization and checks

- 253,890 source triangles retained to preserve silhouette and detail.
- 42 mesh primitives, 65 nodes, with baked world transforms.
- Source 32 texture maps resized to a maximum of 2048 px; embedded PNG/JPEG.
- No Draco or proprietary decoder needed.
- Vertex normals and UVs retained through transform baking.
- A triangulated render mesh; not a quad subdivision cage, engineering CAD or manufacturing model.
- Interior retained as a lightweight separate source group; no additional interior modelling.

`asset-manifest.json` contains exact dimensions, pivot positions, statistics and the model SHA-256.

## Attribution and licence

Original: **Ddiaz Design**, “2023 Porsche 911 GT3 RS 2.7 Carrera Tribute 992”.
Source: https://sketchfab.com/3d-models/2023-porsche-911-gt3-rs-27-carrera-tribute-992-f17a982d5d8a4d97baef4b00b51a4e9a
Original project notes identify a CSR2 base and credit GM25.
Retrieved via https://github.com/Nissmo89/Supercar-Vault-3D .

**CC BY-NC-SA 4.0** — attribution, noncommercial, share alike.
https://creativecommons.org/licenses/by-nc-sa/4.0/

YUNEX modifications: transform baking, metre scale, part consolidation, wheel pivots, wing splitting, texture optimization, material tuning and preview lighting.
The model and derivative model renders retain that licence. This is a noncommercial prototype asset. Commercial or monetized channel use needs permission from the relevant rights holders; this package does not grant it. Porsche names and marks belong to their respective owners. No affiliation is implied.

## Rebuild from the credited original GLB

Install `pygltflib numpy scipy Pillow`, then run `python prepare_asset.py /path/to/original.glb`. The original is not duplicated in this package.
