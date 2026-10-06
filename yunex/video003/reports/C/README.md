# YUNEX 003 — Agent C camera / reveal / track report

Phase: Y003-SUSPENSION-AERO-01
Role: C — Automotive cameras, moving reveal and track adapter
Input SHA: 50fd478256bbe12d37410e78678bd7c302d96434
Work branch: sol/y003-cameras

## Implemented

- Added a prop-driven nine-shot automotive camera contract. Cameras consume external motion state (position, headingRad, speedMps, distanceM) and cue progress; they do not create a competing driving animation.
- Added deliberate focal lengths and portrait-safe vehicle-relative offsets for hook, braking/turn-in, wheel tracking, installed front-corner reveal, link profile, mechanical-load, whole-car and exit views.
- Added a genuine trackside-pass mode. Its camera position is frozen from a shot-entry anchor while its target follows the car, so the Porsche actually crosses the frame.
- Added deterministic camera audits for finite values, focal range, road-plane clearance, near-plane spacing and clip range.
- Added exterior reveal state that returns fully opaque at both cue boundaries, ghosts the existing Body/Glass/Grilles/Interior only during the reveal, and keeps wheel/suspension geometry available.
- Added a runtime Three.js reveal controller that clones materials instead of mutating the approved source materials. Optional clipping uses an explicitly supplied WORLD-space plane; no local/world transform is guessed. restore() / dispose() restore the original material references.
- Added a Y003 track adapter/audit over the corrected Y002 layout. It reuses the authoritative root transform and preserves existing surface -> runoff -> terrain -> barriers -> vegetation ownership. No second root transform or replacement circuit was introduced.
- Added footprint containment and trackside-world-point helpers so Manager/A can validate the final A path without changing Y002.

## Camera API proposed to Manager

resolveY003CameraPose(motion, cue) expects:

- motion.position: world-space car root [x,y,z]
- motion.headingRad: world yaw around +Y, with +Z forward and +X driver-left
- motion.speedMps / distanceM: carried from A for integration/debug; C does not alter them
- cue.id: one of the nine C shot IDs
- cue.progress: normalized progress within that shot
- cue.anchor: mandatory only for trackside-pass; capture once from A motion state at shot entry using makeShotAnchor()

Manager can adapt its final shared types.ts to this small interface without C editing central types.

## Reveal ownership

The approved GLB is unchanged. Runtime clones are limited to the existing Body, Glass, Grilles and Interior groups. Wheels, calipers, lights, installed suspension geometry and track are not hidden by the controller. The optional clipping plane must be transformed to world space by the integrating scene; this avoids applying the track/car root transform twice.

## Checks

Source self-check entry points:

- runY003CameraContractChecks() in src/video003/cameras/contractChecks.ts
- auditY003RevealState() in src/video003/reveal/revealState.ts
- auditY003TrackAdapterBaseline() and auditY003TrackContainment() in src/video003/track/trackAdapter.ts

Expected invariants:

- all nine shot samples pass camera finite/focal/near-plane checks
- trackside camera world position delta is zero while the target advances with the Porsche
- reveal amount is zero at cue 0 and 1 and near-full at mid-cue
- existing corrected track root is reused exactly once
- baseline centerline footprint retains >= 0.35 m road-edge clearance

## Dependency / proof status

Manager registry at coordination head 7cff23f91ec3669e9354c18b1fd78790d2f427e0 still had motion_contract_sha null and no sol/y003-driving branch when C started. Therefore C did NOT fabricate a driving path, bind to an old Y002 5.15 m motion curve, register a competing composition, or claim a visual pass.

The remaining C visual gate is dependency-bound: once Manager pins A's actual motion contract and cue timing, integrate this camera package, capture the 4–6 s tracking + fixed-trackside proof and the 3–5 s moving front-corner reveal, then inspect native hook/detail/exit frames. Until that exact A input exists, source implementation is complete but integrated moving-proof approval is BLOCKED by the unpublished A contract, not by C source work.

No Porsche bytes, Y001/Y002 source, central Y003 timeline/types/Video003/index, or full-film render workflow were modified.
