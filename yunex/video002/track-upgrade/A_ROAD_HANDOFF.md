# YUNEX 002 — A_ROAD
Repo YunRah2103/yunus-video-lab, branch sol/yunex-002-active-aero, base c7b2be16526eeed9e5635c6462887fa92be94353.
Read yunex/video002/MANAGER_INTEGRATION_FINAL_QA.md and src/video002/Video002Integrated.tsx before work. Separate USER-OPENED chats only: no internal agents. Implement your chunk, not more handoffs.
Current A-D integration complete; 751frames/30fps/25.033s continuity proof is reduced-scale UPSCALED and VISUAL-ONLY. Preserve approved edit, cameras, timing, aero mechanics, VO, car geometry/materials. Track visible throughout. Native final must render true1080x1920 atscale1 and include audio.
Car SHA256 1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb remains unchanged. No car rebuild, entire circuit, grandstands, clutter, neon or HUD. Premium small racetrack supports hero.
Use new opt-in002 modules under yunex/src/video002/trackUpgrade; preserve001 defaults. Manager owns central scene wiring/types/config/index. A-D never edit TrackPreview.tsx or Video002Integrated.tsx. Export your isolated component accepting {quality:'preview'|'final',seed?:number}. Deterministic textures/instancing, no per-frame random/geometry/PMREM rebuilding. Current technicalworld transform[-1,groundY,0],YrotationPI;002groundY-.028. Manager locks common coordinates so avoid doubletransform.
Branch separately from current lockedbase; edit ownedfiles only. Context7 for unfamiliarAPI; follow applicable projectinstructions. Return commit,files,API,tests,actual native same-frame before/afterproof,limitations. No MP4/ZIP/cache inGit. One Manager-coordinated renderqueue, no fivefullrenders.
Escalate corecar/camera/story/rig changes, uncertaincoordinates, sharedfileconflicts, weakvisuals, excessivecost. Never fake proof or declare upscale native.

OWNED FILES: RoadSurfaces.tsx and road/* undertrackUpgrade (E usesutility/workflowpaths).
BRANCH: sol/yunex-002-track-road.
GOAL: credible asphalt/kerbs/roadedge close and wide.
TASKS: scale-correct subtle asphaltgrain, broad nonrepeatingroughness variation, sparsetyre/rubberwear, wornpaint/bevelledkerbs and grass-soil roadedge. Cover existingtravel andcamerarays, avoid obviousgreyvoid. Use authored/licensedtextures withprovenance. Own kerbs/groundpatches, notbarriers/plants. Export RoadSurfaces.
TESTS: no zfight/tiling/roadedge revealed in sevenbeats; correcttyrecontact, memorybudget. OUTPUT nativeclose/widecomparisons and costs.
