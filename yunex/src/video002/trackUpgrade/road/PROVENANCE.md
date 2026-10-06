# YUNEX 002 A_ROAD — surface provenance

No external bitmap, scan, stock texture, or third-party road asset is used by A_ROAD.

- Asphalt albedo is authored procedurally in `proceduralRoadTexture.ts` from deterministic integer/value noise.
- Verge/soil albedo is authored procedurally in the same source file with a separate seed.
- Rubber wear, macro roughness patches, gravel breakup, kerb paint variation, and kerb wear chips are deterministic generated layouts from `layout.ts`.
- The bevelled kerb geometry is generated at runtime from a small authored extrusion profile; it does not modify or replace the approved Porsche asset.
- Default deterministic seed: `2103`.
- Preview texture resolution: 512² each.
- Final texture resolution: 1024² each.

This keeps licensing/provenance unambiguous and avoids network or file-system dependencies during Remotion rendering.
