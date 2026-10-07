# P02-B proof manifest

## Installed macro target
Use the existing YUNEX-003-VISUAL composition on this branch. The most useful installed macro window remains the current front-corner reveal / link-profile section around frames 200–310. Compare the phase-base SHA 064fc7687ad16e9fc99c32c3c323154b7e4496f1 against this branch at the same frame/camera.

Expected visible differences:
- joint housings at wishbone ends
- inboard clevis geometry
- round tie rod with joint ends
- distinct damper body and bright shaft
- spring seats and bump-stop cue
- triangulated upright and visible hub carrier

## Isolated diagnostic geometry
Render SuspensionDetailProof with diagnostic=true. Amber markers are chassis pickup points; cyan markers are upright pickup points. No marker changes production geometry.

## Articulation proof
Render SuspensionDetailProof frames 0..149 at 30 fps. This is exactly 5.0 seconds and exercises steer plus bump while re-running topology/detail audits per frame.

## Acceptance checks
- no floating spring or detached wishbone
- upper wishbone arms converge on one outboard joint
- tie rod remains connected
- upright/hub carrier follows upright steering/load without consuming rim spin
- no tyre/body intersection introduced by B geometry
- mechanical parts remain readable at the installed macro camera
