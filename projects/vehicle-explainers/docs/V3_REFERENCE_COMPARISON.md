# V3 reference diagnostic

Primary reference: supplied 191652.mp4, sampled throughout at 0.5-second intervals, plus requested diagnostic samples. Actual reference has a light grey background, crisp blue photographic Audi cutouts, black line presenter art, very short red spoken captions, coloured stat headlines, and component substitution. It is substantially more visually tangible than the saved Porsche baseline.

## Availability
The V2 master is not in GitHub or the current Library inventory. V2_BUILD_NOTES and v2_visual_timeline.json exist, but the repository composition is still the V1 six-mode implementation. 191654.mp4 matches the saved V1 file size and visual layout. Accordingly V2 columns below are documented observations, not invented frame observations. V3 is timed to the new user Cedar recording (60.264 seconds), not the old 58.225-second synthetic track.

| Sample | Reference foreground / presenter / text | Saved V1 baseline | V3 decision |
|---|---|---|---|
| 0 | Blurred photographic Audi entrance, giant diagonal face | Tiny lime vector and HUD | Huge photographic Porsche + skeptical face |
| 1 | Three-quarter Audi and logo, cropped face, short red word | Vector rear-engine callout | Car changes scale; word beside car |
| 2 | Same tangible car, talking face changes mouth | Same infographic | Engine replaces car on spoken engine |
| 4 | Photo remains strong without captions | Centred text and small mascot | WRONG stamped near engine; close reaction |
| 8 | Side-profile car, full presenter, model above | Axle labels around vector | Side profile + actual engine behind axle |
| 12 | Side car, presenter beside support explanation | Vector and MASS box | Frame resets to desirable car / advantage |
| 18 | Lift claim attached to tangible car | Vector with load arrow | Presenter-only problem interruption |
| 24 | Porsche Boxster replaces Audi, 30KG above | Procedural oversteer | Classic 911 replaces modern; yaw changes |
| 30 | 110MPH becomes top headline | Vector wheelbase line | Giant shocked face, rotation-linked FAST |
| 36 | Crash stat, same strong photographic car | Generic improvement cards | Classic comparison and 1969 takeover |
| 43 | Short caption, presenter gesture, car | Schematic rear axle | Actual suspension replaces car |
| 50 | Engine dominates, oversized head cropped into corner | Vector and fixed presenter | Actual 993 axle with traced linkage |
| end | Car returns, gesture, quick blur exit | Embedded horizontal video | Full-frame user Porsche driving, 911 payoff |

## V2 notes vs reference
V2 improved short captions, presenter scale and event rate, but its documented procedural automotive/component artwork cannot match the reference photographic quality. The event map repeatedly shares a caption zone. V3 discards the generic ModeFrame route and authors shot-specific object and typography placements. The new narration moves the 57 mm event to 38.14 s and 993 multi-link to 49.14 s.

## Visual principle
Quiet light background; cyan/charcoal identity; car/component remains the largest tangible object except for intentional reaction and number takeovers. Photos are not presented in interface cards. Presenter gestures and crop changes redirect attention. Mechanical illustrations supplement real parts only where motion needs explanation.
