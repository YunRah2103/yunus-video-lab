# YUNEX track static proof — STATIC QA

## Provenance

- Branch: `sol/yunex-track-static-final`
- Render source commit: `c714d3282e80f960ed039ee706f66153d3cda50b`
- Generated proof commit: `a362b8d5df922aae36292df38479c7040c88e8f6`
- GitHub Actions run: `37328785563`
- Baseline comparison commit: `73893baf2a75111cf91fd9d77fa83156c53d2e91`

## Locked assets

- Approved Porsche exterior SHA-256: `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`
- Approved engine SHA-256: `aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d`
- Both hashes were checked before rendering and again after rendering. The workflow completed the byte-identical verification successfully.
- No Porsche or engine geometry, materials, livery, transforms, scale, export, or placement contract was changed.

## Render commands

Baseline landscape was rendered after temporarily restoring `yunex/src/TrackPreview.tsx` and `yunex/src/index.tsx` from the baseline commit:

```bash
npx remotion still src/index.tsx YUNEX-TRACK-PREVIEW track-refinement/before_landscape.png --gl=swangle --timeout=120000
```

Refined landscape:

```bash
npx remotion still src/index.tsx YUNEX-TRACK-PREVIEW track-refinement/after_landscape.png --gl=swangle --timeout=120000
```

Final portrait hero:

```bash
npx remotion still src/index.tsx YUNEX-TRACK-PORTRAIT track-refinement/portrait_hero.png --gl=swangle --timeout=120000
```

Matched comparison:

```bash
ffmpeg -y -i yunex/track-refinement/before_landscape.png -i yunex/track-refinement/after_landscape.png -filter_complex "hstack=inputs=2" -frames:v 1 yunex/track-refinement/before_after_landscape.png
```

Metadata checks:

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,codec_name,pix_fmt -of json yunex/track-refinement/after_landscape.png
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,codec_name,pix_fmt -of json yunex/track-refinement/portrait_hero.png
```

## Technical validation

- `before_landscape.png`: 1600 × 1000
- `after_landscape.png`: 1600 × 1000
- `before_after_landscape.png`: 3200 × 1000 matched side-by-side comparison
- `portrait_hero.png`: 1080 × 1920
- Landscape ffprobe: PNG, RGB24, 1600 × 1000
- Portrait ffprobe: PNG, RGB24, 1080 × 1920
- Automated dimension assertions passed.
- Locked-asset pre/post hash verification passed.

## Human visual inspection

The actual final PNG outputs were opened and inspected after the last render.

### Baseline landscape

- The baseline is a clean matched reference using the original landscape camera.
- Porsche silhouette, splitter and rear wing are readable.
- The background is sparse and largely consists of rail, track and sky, making the foliage refinement easy to compare.

### Refined landscape

- Complete Porsche silhouette remains visible and unchanged.
- Front splitter, body, rear wing and wheels are all readable.
- Tyres appear visually planted on the asphalt; no floating-car issue was observed.
- Foliage remains behind the guardrail and does not intersect the Porsche.
- Shrubs and trees have enough scale/spacing variation to avoid a single repeated foliage wall.
- Greens are subdued relative to the bright white/green Porsche, so the car remains the visual hero.
- The rail, kerb, verge and layered foliage create a clearer local-circuit depth cue than the baseline.
- No giant empty-sky region dominates the landscape frame.
- No static clipping, shadow failure or obvious foliage intersection was observed.

### Matched before/after comparison

- Both halves use the same landscape framing and crop.
- The comparison clearly isolates the environment change without changing Porsche scale or camera angle.
- The refined side adds verge/foliage/background depth while retaining the baseline car presentation.

### Final portrait hero

- Native 1080 × 1920 portrait output was inspected at full frame.
- Porsche is large in frame while retaining safe left/right margins.
- Full splitter/body/rear wing are visible; the rear-wing endplate is no longer clipped.
- Sky is controlled and the car/background occupy a more purposeful vertical composition than the first portrait attempt.
- Guardrail, shrubs and trees provide depth without covering or competing with the car.
- Green livery remains clearly separated from the more muted foliage.
- No foliage-to-car intersection, silhouette clipping or floating-tyre issue was observed.

## Corrective passes

Two portrait-only framing corrections were made after inspecting rendered PNGs:

1. The first portrait proof had too much empty sky and the Porsche read too small.
2. A tighter portrait camera pass fixed that but clipped the front/rear-wing silhouette at the frame edges.
3. The final pass kept the lowered portrait horizon and closer camera position, but restored portrait FOV to 40° so the complete Porsche silhouette has safe margins.

Final portrait-only camera settings in `yunex/src/TrackPreview.tsx`:

- Position: `[6.65, 1.85, 7.95]`
- Target: `[-0.05, 0.38, 0.18]`
- FOV: `40`

The landscape camera is unchanged. The motion camera/path is unchanged, so Agent B's motion-proof work is not duplicated or altered.

## Remaining limitations

- Foliage is intentionally deterministic procedural low-poly geometry rather than photoreal scanned vegetation. At close scrutiny it remains somewhat stylized, but it is varied, subdued and non-blocking for this static proof.
- No motion proof or full-film edit was performed on this branch by Agent A.

## Static proof result

Agent A static proof requirements are complete: all four required PNGs exist, dimensions are verified, locked hashes passed before/after checks, the final PNGs were visually inspected, the portrait framing received corrective passes, and the outputs are pushed on the dedicated static branch.
