# YUNEX 003 — POLISH 02 — AGENT C — ESTABLISHED CIRCUIT WORLD
Phase: Y003-POLISH-02
Work branch: sol/y003-p02-track-world
Exclusive production ownership: yunex/src/video003/track/
Shared Y002 track components are READ-ONLY unless Manager explicitly approves a proposed patch.

## Mission
Make the full Y003 drive read as one coherent established race circuit instead of open asphalt/empty horizon, without changing the successful car motion.

## Diagnose first
Y003 already mounts the corrected Y002 TrackWorld. Do not simply add another TrackWorld.
Determine why circuit identity falls away:
- route extent/course coverage
- camera frusta/sides
- track furniture spacing
- vegetation/background coverage
- fog/clipping
- edge/runoff continuity
- Y003 adapter parameters

## Required visual language
Across the full Y003 route provide:
- continuous readable track edges
- selected apex/exit kerbs
- appropriate runoff/gravel/grass
- barriers beyond runoff
- restrained fencing/furniture where useful
- intentional vegetation/background depth
- consistent materials/lighting with established Y002 circuit
- believable road-relative parallax

Avoid random roadside forest, giant grandstands, cloned repetition and fake 2D backgrounds.
Do not bend the track underneath an incompatible locked car path.
Do not alter vehicle speed to make scenery fit.

Prefer an isolated Y003 adapter/extension under src/video003/track/.
If a shared Y002 change is genuinely required, write a proposed patch/report only; Manager decides whether to apply it.

## Required deliverables
- production adapter/track changes
- report under yunex/video003/reports/P02-C/
- native frames for hook, turn-in, technical/reveal, whole-car and exit
- 4–6 s moving proof showing circuit identity + parallax
- coverage/repetition checks
- compile/tests

Push branch and return full remote commit SHA.
