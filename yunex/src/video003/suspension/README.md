# YUNEX 003 front suspension module

Agent B owned module for a simplified, reference-informed 992 GT3 RS front double-wishbone illustration.

Coordinates are metres in the approved car-local frame: +Y up, +Z forward, +X driver's left. Quaternions are [x,y,z,w].

FrontSuspension consumes a chassis pose plus FL/FR upright poses. FL/FR quaternions describe the upright only. Do not include tyre/rim spin. This keeps upright/caliper context separate from Spin_FL and Spin_FR.

POLISH-02 adds purposeful mechanical resolution while preserving the original anchor contract:
- teardrop upper/lower wishbone links with visible joint housings and inboard clevises
- a round steering tie rod with joint ends
- separate damper body and piston shaft
- spring seats plus a compact bump-stop/dust-boot cue
- triangulated upright/hub carrier structure tied to the same upright pose
- material separation and brighter edge/joint highlights for macro readability

SuspensionDetailProof is a five-second isolated articulation harness. At 30 fps, frames 0..149 exercise steering and bump through the existing deterministic fixture. Set diagnostic=true to show chassis/upright pickup markers.

SuspensionFixtureProof remains the simpler legacy fixture wrapper.

The teardrop link section and all added joint, clevis, damper, spring-seat, bump-stop and carrier dimensions are explanatory/reference-informed geometry, not measured Porsche CAD. The approved wheel centres and existing topology/pose contract remain unchanged.
