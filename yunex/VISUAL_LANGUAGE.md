# YUNEX visual language · film 001

An automotive engineering documentary in miniature. The car is the subject; a diagram must explain something footage cannot.

## Repeatable choices

- Vertical 1080 × 1920, 30 fps. Narration drives the timing.
- Charcoal studio backgrounds, warm ivory type, copper for the engineering compromise, pale green for grip and benefits.
- Barlow Condensed ExtraBold for short, composed statements. Small, spaced labels for part names. Emphasize ideas rather than transcribing speech.
- Alternate real motion, medium side-on explanations, overhead motion and wide hero views. Preserve the silhouette in explanatory shots.
- A change in meaning or visual state every 1–3 seconds: expose a part, move a mass label, rotate the car, load a contact patch, or change the era.
- Retain one consistent vehicle asset per episode. Do not substitute a vaguely similar car in a technical explanation.
- Show the cause alongside the effect: rear engine mass and axle in the same frame; mass moving with the rear as grip disappears; load above the driven tyres.
- Hold the final identity frame long enough to register. YUNEX appears subtly after the payoff.

## Episode 001 beats

| Time | Visual purpose |
|---|---|
| 0–3.5 s | Real rear view gives way to an immediate transparent engine reveal. |
| 3.5–8.5 s | Side-on model, both axle markers and rear engine mass; WEIGHT travels rearward. |
| 8.5–11.5 s | Overhead rear swing with a visible mass trail. Front axle held steady for illustration. |
| 11.5–13.2 s | Close exterior detail poses the question. |
| 13.2–16.2 s | Rear contact patch and downward load connect the same mass to grip. |
| 16.2–18.3 s | Real acceleration footage delivers the payoff. |
| 18.3–22.5 s | Original 911 photograph transitions to the modern GT3 RS. |
| 22.5–27.6 s | Modern moving hero, identity statement and quiet YUNEX signature. |

## Engineering limits

The engine is a simplified procedural flat-six illustration, not a detailed GT3 RS engine replica. Axle locations come from the GLB wheel centres. The mass marker is approximate. Rotation, settling and contact illumination explain an idea; they are not a vehicle dynamics simulation or quantitative load measurement.

## Regeneration

Run `node render-plates.cjs` to rebuild the five fixed transparent views and all 52 rotation frames from the same GLB. `LiveCarCanvas` preserves the 3D lighting/camera source. `CachedCar` composites these layers in the film so narration, typography and footage can be edited without rerendering static geometry.

See `LICENSES.md` before public or monetized release. The current model is an attributed noncommercial adaptation, not a commercially cleared original asset.
