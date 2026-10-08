# Woodland Circuit V3 polish

User requested a better, less soulless reusable track and one actual MP4. This extends V2 on a dedicated branch; it does not rebuild the Porsche or the physical road.

Implemented: 347 varied oak trees and near-road alpha foliage shadows; mottled grass texture and 4,200 tufts; granular shoulders, restrained rubber traces, stones; garage side windows/cladding and roof seams; marked pit apron; terrace, benches, safety cones and cylindrical tire bundles. Brighter fill and sun plus depth haze. The third camera is elevated to reduce empty sky while retaining a complete moving Porsche.

Validation: deterministic layout and all 360 original driving samples pass containment and wheel-spin continuity. Rendering gate: four native proof frames, then six full-resolution 60-frame chunks, assembly and full decode. Final delivery requires downloaded-movie optical review. Composition YUNEX-CIRCUIT-V3: 12 s, 1080x1920, 30 fps. Demonstration synthetic driving sound remains unchanged; no Cedar voice is replaced.

Reuse: CircuitWorldV2 remains the API on this branch. V2 is preserved on its original branch at d501217476a3532571203eb323aa07329ed05775. See README.md for integration. No MP4 or render cache belongs in Git.
