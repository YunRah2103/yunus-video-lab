# YUNEX 003 front suspension module

Agent B owned module for a simplified, reference-informed 992 GT3 RS front double-wishbone illustration.

Coordinates are metres in the approved car-local frame: +Y up, +Z forward, +X driver's left. Quaternions are [x,y,z,w].

FrontSuspension consumes a chassis pose plus FL/FR upright poses. FL/FR quaternions describe the upright only. Do not include tyre/rim spin. This keeps upright/caliper context separate from Spin_FL and Spin_FR.

SuspensionFixtureProof is only a deterministic pre-contract fixture for connected-endpoint/profile checks. It is not the final Manager/A motion binding.

The teardrop link section is explanatory geometry: rounded leading region faces +Z and tapers toward -Z. Pickup-point and profile dimensions are illustrative, not manufacturer CAD.
