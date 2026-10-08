# YUNEX 004 — Agent I Release Readiness

**Status: PARTIAL / BLOCKED ON REPOSITORY-LOCAL AUDIO BINARY AND MANAGER + F FINAL GATES.**  
**Branch:** `sol/y004-i-release-prep`  
**Scope:** release preparation only. **No 720-frame render attempted.** No modification of H's integration, G/E renderer, F QA, Manager TASKS, or Porsche GLB.

## Proven completed work

### Real approved audio verified

Original approved bytes retrieved via the user's Library from `/Video Projects/YUNEX 004/Agent D/YUNEX_004_Cedar_final_mix_24s_48k_stereo.m4a`. Files Library ID `file_00000000c55081f4ad987154943cf66f`; original Library file path confirmed.

Independent on-file checks:
- Actual byte count **753,974**.
- SHA256 **`a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51`**, exact accepted D mix.
- `ffprobe`: **AAC / 48,000 Hz / 2 channels / 24.000000 seconds**.
- `ffmpeg -v error -xerror -i <original> -f null -`: **PASS**, no decoder error.
- The original was NOT regenerated/transcoded/modified.

A **byte-exact portable Git binary patch** was produced in the chat runtime as `YUNEX_004_Agent_I_approved_audio.patch`. Applying it to a clean temporary Git checkout restored the approved file at the contract-owned path and reproduced the exact approved SHA. The patch and original AAC are available as user-visible conversation downloads, but **neither is automatically present in the GitHub repository**. Avoid treating the portable patch as a committed binary.

`release-prep/import_approved_audio.py` is implemented and committed. It accepts the approved local M4A, rejects wrong size, wrong SHA, wrong codec/length, or decode failure, copies it to `yunex/video004/audio/y004-approved-cedar-24s.m4a` without changing its bytes, and rechecks the written destination. Its Python syntax was validated by the remote CI job. GitHub binary publication from this Agent I runtime is **BLOCKED**: the active GitHub connector exposes UTF-8 text-file writes and base64 blob text only; it does not accept a Library/container file reference. The sandbox cannot reach github.com directly, and the connector cannot ingest the materialized binary file from this runtime. No fake audio/placeholder was committed. **Do not claim the in-repository AAC is already delivered.**

To finish the single missing binary write from an authorized local Git checkout, download the provided `YUNEX_004_Agent_I_approved_audio.patch` from this Agent I chat, check out `sol/y004-i-release-prep`, then:
```bash
git apply --check /path/to/YUNEX_004_Agent_I_approved_audio.patch
git apply /path/to/YUNEX_004_Agent_I_approved_audio.patch
sha256sum yunex/video004/audio/y004-approved-cedar-24s.m4a
ffprobe -v error -show_entries format=duration:stream=codec_name,sample_rate,channels -of json yunex/video004/audio/y004-approved-cedar-24s.m4a
git add yunex/video004/audio/y004-approved-cedar-24s.m4a
git commit -m "Y004: publish byte-verified Agent D approved Cedar AAC"
git push origin sol/y004-i-release-prep
```
The printed SHA must be `a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51`. This is the **one remaining audio bridge** if H has not separately committed the exact same mix at `yunex/public/y004-final-mix.m4a`. Manager must select **one** canonical approved path in final source and set registry `release_audio_path` accordingly.

### Working non-default-branch workflow execution path

Created a **separately namespaced** file `.github/workflows/yunex-004-i-gated-release.yml`. It uses **`push`** on the I test branch and the Manager branch, not unregistered `workflow_dispatch`. On the I branch only `branch-smoke` executes: it compiles scripts, runs eight positive/negative unit tests, and independently checks the current pending Manager registry fails closed.

Actual GitHub Actions branch push proof:
- Workflow run [37763682122](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37763682122) **completed / success** at commit `15399a4a91954adbd1795346d8b747ea2fe3d48c`.
- Eight gate tests: **8 passed**. `py_compile` successful.
- **Expected blocked result**: `RELEASE BLOCKED: no immutable Manager source SHA`; the CI job accepts this as a correct denial on the I branch.
- Release jobs `locked-source-gate`, `render`, `package` were **all skipped**.
- Earlier registration proof run [37763511614](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37763511614) was also success.
- The last security hardening commits add a **one-shot Manager commit-message marker**; repeat remote CI after this report push for the final SHA.

Manager branch route after Agent H + I merge:
1. Keep the final immutable source SHA separate from the later registry commit.
2. Agent F validates fresh moving native visual proofs for the **exact combined H+I SHA**; Manager publishes `render_source_sha`, `locked_frames: 720`, `pre_render_qa_status: "PASS"`, structured `pre_render_qa_evidence` with `agent: "F"`, `verdict: "PASS"`, `source_sha` equal to render source, `report`, and `run_id` or `artifact_id`.
3. Manager explicitly sets `i_release_launch_authorized: true` and `release_audio_path` to **one** hash-confirmed final AAC path, and pushes to `sol/y004-rear-steering-manager` with head commit message containing **`[Y004-RELEASE-GO]`**. Ordinary Manager or Agent I pushes cannot initiate full rendering.
4. The branch-push CI requires the exact Manager/F registry gate, then checks **immutable git HEAD, original GLB SHA256, actual AAC size/SHA256/duration/full decode, final registered YUNEX-004 composition, and existing E pipeline unit tests** before releasing the 36 x 20-frame native Remotion matrix.
5. `render` uses E's exact native chunk commands and writes source provenance; `package` uses E's **unmodified** `render/pipeline.py assemble`, including complete frame and audio verification, mux, faststart and `YUNEX-004-FINAL-SINGLE-MASTER` artifact.

The Manager push release **has not been exercised**, because doing so before final H+F+Manager approval would violate production gates. The branch-trigger mechanism, registration, Python gate tests and correct-denial path **have** been exercised.

## Remaining hard blockers

1. **Audio bytes not yet pushed to remote I file path**. Original file and verified portable exact-byte patch are available locally in the Agent I chat only. Requires an authorized binary-capable Git transfer or accepted H independent byte-exact upload before Manager final source pin. No placeholder.
2. H completes and pushes retimed YUNEX-004 composition / aligned native proofs, then Manager merges H+I.
3. F delivers independent real moving visual **PASS on the exact combined source SHA**; Manager publishes source and evidence and chooses canonical audio.
4. Manager explicitly authorizes launch and pushes a Manager-branch `[Y004-RELEASE-GO]` commit. The release must not be initiated earlier.
5. G verifies actual completed final MP4 and F independently checks final audiovisual export before Master review.

**Delivery verdict:** Branch CI launch infrastructure **PASS**, real Cedar source inspection **PASS**, remote byte publication **NOT DONE**, full native release **correctly BLOCKED**.

## Final Agent I retry: authenticated binary publication (8 October 2026)

**Remote binary status: NOT PUBLISHED.** The GitHub contents request for
`yunex/video004/audio/y004-approved-cedar-24s.m4a` on this branch still returned HTTP 404.
The pre-existing release-launch workflow is already passing, and this update does not
rebuild or modify it.

Actual binary-capable transport check:
- The local terminal has Git 2.47.3 but no `gh` executable, no GitHub token,
  no credential helper, and no Git credentials available.
- A non-mutating `git ls-remote https://github.com/YunRah2103/yunus-video-lab.git`
  failed: `Could not resolve host: github.com`. Therefore local `git push`
  cannot deliver the file from this runtime.
- The connected GitHub connector can create a Git blob from caller-supplied
  complete Base64 bytes, but has no supported parameter for the materialized
  Library/container binary path; the connector-side execution environment cannot
  read the local file. No fake or partial Git blob was attempted.
- **Stop here on unsupported binary paths.** No unapproved Manager push,
  H/G code edits or native render took place.

**Independent patch restoration test (PASS)**

- Approved original: `/Video Projects/YUNEX 004/Agent D/YUNEX_004_Cedar_final_mix_24s_48k_stereo.m4a`
- Verified original size: **753,974 bytes**
- Original SHA256: `a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51`
- Portable patch: conversation download `YUNEX_004_Agent_I_approved_audio.patch`
- Patch SHA256: `4b7cc0b0b4fc3bd51c775a45b1ff7163c39fc6f26ddf8a5ae06773c40aff42c3`
- `git apply --check` in a clean temporary repository: **PASS**
- `git apply`, then binary compare against original: **EXACT MATCH**
- Restored path: `yunex/video004/audio/y004-approved-cedar-24s.m4a`
- Restored SHA256: `a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51`
- `ffprobe`: **AAC, 48000 Hz, stereo, 24.000000 seconds**
- Full `ffmpeg -xerror -err_detect explode` decode: **PASS**

### Minimal authorised Windows PowerShell publication

Download the provided **portable Git patch** from the Agent I chat into
your Downloads folder; Git for Windows must be installed and authorised to push
this repository. Open PowerShell and run:

```powershell
git clone https://github.com/YunRah2103/yunus-video-lab.git
cd yunus-video-lab
git switch -c sol/y004-i-release-prep --track origin/sol/y004-i-release-prep

$patch = Join-Path $env:USERPROFILE "Downloads\YUNEX_004_Agent_I_approved_audio.patch"
git apply --check "$patch"
if ($LASTEXITCODE -ne 0) { throw "Patch does not apply cleanly" }
git apply "$patch"
if ($LASTEXITCODE -ne 0) { throw "Audio patch application failed" }

$audio = "yunex/video004/audio/y004-approved-cedar-24s.m4a"
$expected = "a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51"
$actual = (Get-FileHash $audio -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $expected) { throw "WRONG AUDIO HASH: $actual" }

git add -- "$audio"
git commit -m "Y004: publish exact approved Cedar AAC"
git push origin HEAD:sol/y004-i-release-prep
git rev-parse HEAD
```

The expected SHA256 must match **exactly** before committing. The last
command prints the **new full remote SHA only if push succeeds**; verify it
with `git ls-remote origin refs/heads/sol/y004-i-release-prep`. If the
clone already exists, use your existing authorised checkout and
`git switch sol/y004-i-release-prep` instead. Do not merge or trigger
the final render here; Manager must take the exact committed audio into
the final source, obtain F PASS, and authorize the gated release.

**Conclusion:** The audio is **byte-perfect and locally recoverable**,
but is **not on the remote branch**. The only outstanding Agent I release
step is an authorised binary-capable Git push by the user/local machine.
