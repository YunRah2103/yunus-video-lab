# YUNEX 003 — POLISH 02 — AGENT B — SUSPENSION DETAIL
Phase: Y003-POLISH-02
Work branch: sol/y003-p02-suspension-detail
Exclusive production ownership: yunex/src/video003/suspension/
Do not edit motion, track, Video003.tsx, timeline, render workflow or registry.

## Mission
Upgrade the existing front double-wishbone illustration so the installed suspension looks purpose-built, mechanically credible and detailed in the current reveal.

## Preserve
- existing double-wishbone topology
- aerodynamic teardrop arm concept
- existing anchor/motion contract
- approved Porsche exterior/livery/model bytes
- current story and camera sequence

## Add purposeful detail
Where visually and mechanically defensible:
- joint/bush housings
- clevis/bracket connections
- spring seats
- damper body vs piston shaft
- bump-stop/dust-boot
- better upright/hub carrier structure
- clear link-end connections
- steering tie rod only if topology is defensible
- improved material separation, edge highlights and macro geometry resolution

No random bolts, hoses or sci-fi hardware.
Do not convert it into a generic MacPherson strut.
Document which details are approximate/reference-informed rather than Porsche CAD claims.

## Motion/connection rules
Use the existing A-state/anchors.
Links remain attached through steering and load.
No floating spring, detached wishbone, spinning caliper, tyre/body intersection or impossible joint stretch.
Cache reusable geometry; do not generate expensive buffers every frame.

## Required deliverables
- actual production changes under suspension/
- report under yunex/video003/reports/P02-B/
- installed macro before/after
- isolated diagnostic geometry view
- 3–5 s articulation proof at current reveal/load moments
- endpoint/clearance checks
- deterministic/connection tests

Push branch and return full remote commit SHA.
