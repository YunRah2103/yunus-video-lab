# YUNEX engine refinement baseline diagnosis

Baseline implementation commit: `50a912e66c637402e5dc9cdbc1753b01da20bc4d`.

The locked review renders show four high-value weaknesses before geometry changes:

- **Housing joins read as stacked primitives.** The water-jacket masses, side covers and central case are individually readable, but the bank-to-case transition is abrupt and slab-like. The lower sump also reads as a rounded box rather than a structural casting.
- **The intake reads as a box with hoses.** The dark plenum is dominated by a rectangular silhouette and the bright vertical throttle/head-port pieces look like isolated knobs. Six runner paths are present, but their junctions into the plenum and heads are not mechanically convincing.
- **The headers route correctly but converge weakly.** The primaries are visible, yet the last transition into the capsule-like collector is abrupt. The collector needs a clearer three-into-one convergence and a restrained outlet collar.
- **Film-scale separation is too dependent on broad value blocks.** The existing materials separate dark composite, aluminium and stainless, but highlight-breaking seams, lips and stepped casting transitions are sparse. Tiny fasteners would not help at 1080×1920.

What already works and must be preserved: the low flat-six silhouette, six-runner symmetry, compact overall package, existing engine placement, independent animation groups, and the approved Porsche exterior/camera contract.

Triangle budget will be spent in this order: housing transitions and stepped masses, intake junctions and a sculpted plenum, header convergence, then only a small accessory/material pass.
