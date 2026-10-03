# ⚠️ CURRENT TAKEOVER INSTRUCTION

For the next visual rebuild, **read `GPT6_CODEX_HANDOFF.md` first**.

The user has reviewed the completed V2 and says it is better, but still misses the desired reference look. The older instruction that the V2 micro-event timeline is "locked" is superseded: it is now a baseline only. The primary reference `191652.mp4` is the visual authority for V3.

---

# V2 BUILD STATUS — 2026-10-03

A full V2 Porsche explainer has now been built and reviewed.

Before doing more work:
1. Read `docs/V2_BUILD_NOTES.md`.
2. Read `episodes/001-porsche-rear-engine/v2_visual_timeline.json`.
3. Treat the validated micro-event timeline as the new baseline.
4. Do **not** revert to V1 sentence-level captions, tiny presenter framing, or persistent HUD styling.

The reviewed master is 1080×1920, 60fps and 58.23s. The MP4 itself is not stored in GitHub.

Known limitation: the original `191652.mp4` / `191654.mp4` binaries and production photographic Porsche cutouts were unavailable inside the build environment for this pass. The master therefore uses authored procedural automotive/component art and synthetic timing VO. When better provided/licensed assets and production VO are available, replace those assets while preserving the validated foreground rhythm.

---

# NEXT AGENT HANDOFF — VEHICLE EXPLAINER V2

## READ THIS BEFORE TOUCHING THE PROJECT

You are taking over the vehicle-explainer format in:

`projects/vehicle-explainers/`

The first implementation technically works, but the **visual result missed the reference badly**.

Do **not** spend your first pass polishing the existing V1 composition.

Your job is to preserve the useful system/research work, then **rebuild the visual language so it actually captures the retention mechanics of the reference**.

---

# 1. AUTHORITATIVE REFERENCES

## Primary reference — MUST WATCH FIRST

`191652.mp4`

Reference properties already observed:

- 1080×1920
- 60fps
- ~67.5 seconds
- vehicle/component usually occupies the upper region
- narration-driven kinetic word/short-phrase captions
- presenter occupies the lower region and changes pose/crop constantly
- major numbers become temporary full visual events
- technical components replace the car when the narration calls for them
- the background is visually quiet
- the foreground does the retention work

Do **not** copy the reference creator's:
- presenter
- branding
- exact typography
- exact layouts
- character design

Copy/adapt the **retention mechanics and visual hierarchy**.

## Current weak version

`191654.mp4`

Treat this as a **failed/weak baseline for diagnosis**, not a design reference.

The user explicitly challenged:

> "How is this similar to the reference?"

That criticism is correct.

---

# 2. WHAT V1 GOT WRONG

The current version copied the reference at a diagram/structure level, but **not at an energy or visual-language level**.

## A. The Porsche asset is too flat and generic

Current V1 relies heavily on a simplified vector Porsche.

This makes the episode feel like:

**educational infographic**
instead of
**high-retention automotive explainer**

The reference uses recognisable photographic vehicle/component cutouts.

### V2 requirement

Use:
- real/high-quality vehicle cutouts
- proper Porsche images where appropriate
- real engine/suspension/component imagery when the narration discusses those parts
- clean transparent backgrounds or well-masked cutouts
- the existing Porsche footage for the hero payoff if available

Do not use the current flat lime Porsche as the primary visual for most of the episode.

It may survive only as a diagram when a simplified diagram is genuinely useful.

---

## B. Packet Guy is too small and passive

In V1 he often behaves like a mascot standing below an infographic.

In the reference the presenter is a **retention device**.

The presenter:
- becomes huge
- gets aggressively cropped
- changes pose
- changes expression
- leans/tilts into compositions
- sometimes occupies nearly half the lower screen
- reacts to surprising narration

### V2 requirement

Packet Guy needs multiple visual scales:

**NORMAL**
- waist-up / upper-body
- readable expression at phone size

**REACTION**
- giant head/shoulders
- approximately 35–55% of screen height
- strong facial expression

**POINTING / EXPLAINING**
- visibly interacting with the vehicle/component

**SIDE / LOOK-UP**
- gaze actually directs attention toward the relevant visual

Do not leave Packet Guy as a small full-body figure for most of the runtime.

The current Packet Guy identity is locked by:

`projects/stickman-studio/character/CHARACTER_SPEC.md`

Preserve:
- British-Bangladeshi / South Asian identity
- light-brown skin
- messy black hair
- light scruffy stubble
- black cap with cyan chevron
- oversized black hoodie
- dark cargos
- white/grey trainers
- slim/slouched silhouette
- cyan signature accent

You may improve the pose pack/rendering quality, but **do not redesign him into a different character**.

Avoid generic glossy AI/Pixar mascot styling.

---

## C. The captions behave too much like normal subtitles/headlines

V1 often shows phrases such as:

- THE REAR AXLE
- MORE WEIGHT
- DOWN HARD
- AT THE BACK
- PORSCHE STRETCHED
- BETTER SUSPENSION

This is cleaner than normal subtitles, but still too conventional.

The reference often turns the narration into individual visual beats:

WORD
→ WORD
→ SHORT PHRASE
→ WORD
→ STAT
→ REACTION

### V2 requirement

Prefer:
- 1 word
- 2 words
- occasionally 3 words

Examples for this Porsche episode:

ON PAPER  
→ WRONG  
→ PLACE  
→ ENGINE

PORSCHE  
→ KEPT IT

FLAT SIX  
→ BEHIND  
→ REAR AXLE

WHY?  
→ TRACTION

MORE WEIGHT  
→ DRIVEN WHEELS

BUT  
→ THAT MASS  
→ SWINGS

LIFT  
→ MID-CORNER  
→ ROTATE

1969  
→ +57 MM

CALMER

THEN  
→ WIDER TYRES  
→ BETTER GEOMETRY

993  
→ MULTI-LINK

WEIRD?  
→ YES.

CHARACTER.

Do not literally use this exact sequence unless it fits the final narration timing. It demonstrates the intended rhythm.

### Critical rule

Every spoken phrase must create **some visible reaction**:
- word change
- presenter pose/crop change
- vehicle shift
- zoom
- highlighted component
- stat
- diagram
- arrow
- image replacement
- comparison
- real footage

If the viewer hears a phrase and nothing visibly changes, improve that beat.

---

## D. V1 overuses the tech-interface aesthetic

The current version contains:
- dark technical grid
- persistent header
- cyan UI-style lines
- component cards
- interface-like labels

This pushes the project toward a cyber/tech UI explainer.

That is explicitly **not the target**.

### V2 requirement

Strip the background back.

Preferred background:
- near-black / charcoal
- subtle texture
- maybe an extremely faint grid if needed
- no persistent fake HUD
- no terminal-style clutter
- no always-on "PACKET GUY // MACHINES" interface if it distracts

The screen should primarily be:

**CAR / COMPONENT**
↓
**WORD / STAT**
↓
**PACKET GUY**

Technical graphics should appear only when they explain something real.

---

## E. Statistics are not dramatic enough

In the reference:

- 125 MPH
- 55 CRASHES / 5 FATAL
- 180 HP
- 225 HP
- 350 HP

become **events**, not subtitle fragments.

The Porsche episode contains one obvious opportunity:

**57 MM**

### V2 requirement

When narration reaches the 1969 wheelbase change:

the screen should transform.

Possible treatment:

1968 car
↓
wheelbase line

**+57 MM**

1969 car
↓
wheelbase line extends

Packet Guy points/reacts.

The number should temporarily become one of the biggest elements on screen.

Do not bury `57 MM` inside a sentence caption.

---

## F. Components need to genuinely replace the car

The reference does not keep showing the whole vehicle when discussing every mechanical detail.

When the narration discusses the engine, the engine becomes the visual.

When mechanical components change, the component imagery changes.

### V2 requirement

For the Porsche episode use actual/separate visuals for:

- 911 exterior
- side profile / rear-engine location
- flat-six engine
- weight / rear mass
- early 911
- wheelbase comparison
- rear suspension
- 993 multi-link rear axle
- modern 911
- real hero footage

Do not force one vehicle SVG to explain every concept.

---

# 3. WHAT TO KEEP FROM V1

Do not throw away useful work.

Keep/adapt:

- research
- narration thesis
- Porsche topic
- episode structure
- the six-mode concept if it remains useful
- deterministic presenter identity
- Remotion architecture
- timing data where useful
- GitHub project organisation
- Packet Guy identity spec

Relevant files:

`projects/vehicle-explainers/README.md`

`projects/vehicle-explainers/docs/FORMAT_SPEC.md`

`projects/vehicle-explainers/docs/REFERENCE_ANALYSIS.md`

`projects/vehicle-explainers/episodes/001-porsche-rear-engine/`

`projects/vehicle-explainers/src/`

`projects/vehicle-explainers/scripts/generate_presenter.py`

`projects/stickman-studio/character/CHARACTER_SPEC.md`

---

# 4. EPISODE TOPIC — KEEP THIS FOR V2

## WHY PORSCHE PUT THE ENGINE IN THE WRONG PLACE

Core narrative:

1. Conventional logic says the engine placement looks backwards.
2. The 911 puts the flat-six behind the rear axle.
3. Rear mass gives the driven tyres strong traction.
4. But that same rear mass creates a handling compromise.
5. Early 911s gained a reputation for abrupt lift-throttle oversteer.
6. Porsche lengthened the wheelbase by 57 mm for model year 1969.
7. Porsche kept refining tyres, suspension and chassis behaviour.
8. The 993 introduced a new multi-link rear axle.
9. The layout remained — Porsche engineered around it.
10. The unusual architecture became part of the 911's identity.

Do not introduce new technical claims without researching them properly.

---

# 5. CURRENT NARRATION

The current narration is usable:

1. On paper, this is the wrong place for an engine.
2. Porsche built an icon around it.
3. The 911 puts its flat six behind the rear axle.
4. That gives it a huge advantage: traction.
5. With more weight over the driven wheels, it can put power down hard.
6. But that weight also acts like a pendulum at the back.
7. Lift suddenly in a corner, and early 911s could rotate very quickly.
8. So in 1969, Porsche stretched the wheelbase by 57 millimetres.
9. Specifically to calm the handling.
10. Then came wider tyres, better suspension geometry, and smarter chassis control.
11. By the 993, a new multi link rear axle helped make the car much more stable.
12. So yes, the engine really is in the weird place.
13. Porsche just spent decades turning the weakness into the 911's character.

You may tighten wording for pacing, but do not turn it into corporate documentary narration.

Tone:
- conversational
- curious
- confident
- slightly dry
- minimal filler

---

# 6. TARGET VISUAL FLOW FOR THE REBUILD

This is guidance, not a frame-perfect lock.

## 0–4s — HOOK

Do not begin like a clean infographic.

Use:
- strong real Porsche cutout
- oversized Packet Guy reaction crop
- aggressive word sequence

Example rhythm:

ON PAPER  
→ THIS  
→ IS  
→ WRONG

Then:

ENGINE  
→ HERE?

Highlight behind rear axle.

The opening must immediately look more alive than V1.

---

## 4–10s — SHOW THE LAYOUT

Use a clean side-profile Porsche.

Show:
- front axle
- rear axle
- engine position behind rear axle

Packet Guy points upward toward the engine.

Caption cadence should keep changing.

Do not cover the screen with UI chrome.

---

## 10–18s — WHY PORSCHE KEPT IT

Shift from diagram to explanation.

Visual events:
- rear tyre highlight
- downward mass arrow
- driven-wheel highlight
- small vehicle scale punch
- Packet Guy explaining pose

Then make:

**TRACTION**

a major word event.

---

## 18–28s — THE PROBLEM

This should be one of the strongest sequences.

Show:
- rear mass
- simplified pendulum arc
- early 911 image
- car rotation / oversteer diagram
- Packet Guy surprised close-up

Narration:

"that weight also acts like a pendulum..."

Do not make this look like a static engineering slide.

The car should visibly rotate or the visual language should clearly demonstrate the rear trying to come around.

---

## 28–36s — 57 MM EVENT

This must be a standout retention beat.

Structure:

1968
→ wheelbase

1969
→ longer wheelbase

**+57 MM**

Huge.

Packet Guy points at the number or car.

Then:

CALMER.

The user should remember this stat after the video.

---

## 36–49s — PORSCHE EVOLVES THE CAR

Avoid:
good diagram
→ good diagram
→ good diagram

Instead progressively evolve the visual:

TYRES  
→ wider tyre visual

SUSPENSION  
→ rear suspension/component

GEOMETRY  
→ simple moving diagram

993  
→ new car

MULTI-LINK  
→ actual rear-axle/component cutout

STABLE  
→ car planted / Packet Guy reaction

---

## 49–END — PAYOFF

Return to the initial accusation:

WEIRD PLACE?

Packet Guy reaction.

YES.

Then transition into the strongest modern Porsche hero visual or real footage.

Final idea:

PORSCHE  
→ KEPT  
→ FIXING IT

until the unusual layout became:

**911 CHARACTER**

End on the modern car, not a technical UI.

---

# 7. VISUAL EVENT RATE

Target:

**one meaningful visual event approximately every 0.5–1.2 seconds**

This does NOT mean a new shot every second.

One asset can remain on screen for 5–8 seconds if something keeps changing:

- caption
- pose
- crop
- scale
- highlight
- component
- arrow
- number
- movement
- rotation
- reaction

The entire scene should not constantly reset.

---

# 8. PACKET GUY V2 REQUIREMENTS

The existing deterministic pack is useful as a consistency foundation but can be improved.

Minimum states should still cover:

- neutral
- talking A
- talking B
- pointing
- confused
- surprised
- annoyed
- thinking
- arms crossed
- explaining
- looking up
- looking side

For the reference-like format, additionally prioritise:

- shocked close-up
- skeptical close-up
- leaning into frame
- head-only reaction
- pointing upward
- looking directly at component
- open-hand explaining
- "you see the problem" expression

Consistency is more important than detail.

Do not generate a different person for each pose.

---

# 9. AUTOMOTIVE ASSET QUALITY BAR

Do not build the whole episode from hand-drawn placeholder vehicle art.

Prioritise:
1. real transparent cutouts
2. high-resolution photographs with clean masking
3. manufacturer/press imagery when appropriate and usable
4. technical component photos
5. simplified diagrams only for forces/geometry that photos cannot explain cleanly

The first 3 seconds should immediately communicate:

**THIS IS A CAR VIDEO**

not:

**THIS IS A SOFTWARE DASHBOARD**

---

# 10. MOTION LANGUAGE

Use Remotion motion deliberately:

- spring entry
- 2–5% scale punches
- subtle constant drift
- quick crop changes
- occasional blur punch
- presenter pose swap
- component reveal
- masked replacement
- number takeover
- short rotation to explain handling
- emphasis shake only when justified

Do not over-transition.

The reference gets energy from **changing foreground states**, not from flashy scene transitions.

---

# 11. AUDIO

Narration is the master timeline.

Sound design should reinforce:
- word punches
- engine reveal
- stat reveal
- mechanical callouts
- wheelbase extension
- oversteer movement
- hero footage

Use:
- restrained whooshes
- mechanical clicks
- low impacts
- tyre/engine sounds
- gear-change accents where appropriate

No constant transition screaming.

---

# 12. REQUIRED WORKFLOW

Follow this order.

## STEP 1 — WATCH BOTH VIDEOS

Watch:
- `191652.mp4` — authority
- `191654.mp4` — weak baseline

Do not start coding until you can explain the difference.

## STEP 2 — BUILD A COMPARISON CONTACT SHEET

Sample both videos across the runtime.

Compare:
- visual hierarchy
- presenter scale
- caption density
- number emphasis
- asset quality
- scene variety
- component replacement
- dead visual periods

## STEP 3 — AUDIT THE CURRENT REMOTION CODE

Decide what should survive.

Do not preserve weak architecture simply because it already exists.

## STEP 4 — IMPROVE/COMPLETE ASSETS

Get the Porsche/component/presenter assets to publishable quality.

## STEP 5 — LOCK THE NARRATION

Only minor wording changes unless the current wording creates timing problems.

## STEP 6 — CREATE A WORD/PHRASE TIMELINE

Map every spoken beat to a visible event.

No lazy subtitle timing.

## STEP 7 — REBUILD THE EPISODE

Make the format feel like:
- presenter-led
- automotive
- fast
- visual
- educational
- recognisable

## STEP 8 — RENDER FULL VIDEO

1080×1920
60fps

## STEP 9 — WATCH THE ENTIRE RENDER

Do not inspect only screenshots.

Check:
- clipping
- weak first 3 seconds
- repetitive layouts
- tiny presenter
- caption lag
- unreadable words
- dead periods
- cheap-looking vehicle assets
- overuse of UI graphics
- weak 57 mm moment
- weak ending

## STEP 10 — COMPARE AGAINST REFERENCE

The question is NOT:

"Does it technically work?"

The question is:

"Does the screen feel as alive as the reference while still being our own format?"

If no, revise.

## STEP 11 — RE-RENDER

Do not return a first-pass render if clear problems remain.

---

# 13. HARD DON'TS

DO NOT:

- preserve the existing V1 look just because it is already coded
- use the lime vector Porsche as the hero asset for most of the runtime
- keep Packet Guy tiny
- treat captions like conventional subtitles
- leave large portions visually static
- add random fake HUD elements
- turn it into a cyber video
- use dozens of unrelated automotive images
- cut to random footage with no narrative relationship
- make every visual event a full-screen scene cut
- redesign Packet Guy into another mascot
- invent technical Porsche facts
- return only a demo of the architecture
- return without watching the full render

---

# 14. WHAT SUCCESS LOOKS LIKE

A strong V2 should make someone who watches `191652.mp4` immediately understand why it was the structural inspiration **without feeling that we copied the creator**.

It should feel:

- automotive first
- presenter-led
- kinetic
- visually dense without being cluttered
- educational
- funny/dry in small doses
- recognisable as Packet Guy
- substantially more photographic and premium than V1
- scalable to dozens of episodes

The format should ultimately support:

- cars
- motorsport
- aircraft
- trains
- ships
- machinery
- engineering disasters
- mechanical mysteries

But do not build multiple episodes yet.

**Make this Porsche episode excellent first.**

---

# 15. FINAL DELIVERABLE

Your final response must include:

1. the improved playable MP4
2. a short summary of what changed from V1
3. the final GitHub commit SHA
4. any asset/source limitations that remain

Commit reusable code, docs and lightweight assets to:

`YunRah2103/yunus-video-lab`

Do not commit:
- large source footage
- rendered MP4s
- caches
- unnecessary ZIPs

---

# 16. MOST IMPORTANT SENTENCE

**Do not merely make V1 cleaner. Rebuild the foreground rhythm so every spoken idea visibly changes the car, the word, the presenter, the component, or the composition — the same reason the reference stays watchable.**
