---
name: run-promote-site
description: Run, serve, screenshot, or drive the JWIC Consulting landing page (index.html) headlessly — take screenshots, click the cookie banner, inspect DOM/localStorage. Use for "run the site", "screenshot the page", "test the cookie consent".
---

# Run promote-site

Static single-file landing page (`index.html`, no build step). The driver at
`.claude/skills/run-promote-site/driver.mjs` serves the repo over localhost,
opens it in headless Chrome/Edge via CDP, optionally runs JS in the page, and
saves a screenshot. All paths below are relative to the repo root.

## Prerequisites

Already on this machine — nothing to install:
- Node ≥ 22 (native `WebSocket`; v24 verified)
- Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe` (falls back to Edge)

## Run (agent path)

```bash
# viewport screenshot (1400x1000) — proves the page renders
node .claude/skills/run-promote-site/driver.mjs shot.png

# run JS in the page first (e.g. accept the cookie banner), then screenshot
node .claude/skills/run-promote-site/driver.mjs shot.png --eval "document.getElementById('cookie-accept').click()"

# evaluate + print an expression (runs after --eval, before the shot)
node .claude/skills/run-promote-site/driver.mjs shot.png --print "document.title"

# full-page screenshot (~7900px tall, ~3MB)
node .claude/skills/run-promote-site/driver.mjs full.png --full
```

Screenshot lands at the path you gave (absolute path recommended — e.g. into
the scratchpad dir). Exit is clean; nothing keeps running.

Verified end-to-end consent check:

```bash
node .claude/skills/run-promote-site/driver.mjs out.png \
  --eval "document.getElementById('cookie-accept').click()" \
  --print "JSON.stringify({consent: localStorage.getItem('ga_consent'), bannerHidden: document.getElementById('cookie-bar').hidden, gaLoaded: !!document.querySelector('script[src*=googletagmanager]')})"
# → {"consent":"granted","bannerHidden":true,"gaLoaded":true}
```

## Article share images (og:image)

```bash
node .claude/skills/run-promote-site/og.mjs                 # every article whose og:image points at img/og/
node .claude/skills/run-promote-site/og.mjs accounting-to-erp
```

Reads each article's `<h1>` and `.tag`, renders `og-template.html` (1200×630) through
`driver.mjs`, and writes `img/og/<slug>.png`. Articles that already use a real
screenshot as their share image are skipped on purpose. A new article opts in by
pointing its `og:image`, `twitter:image` and JSON-LD `image` at `/img/og/<slug>.png`.
Product names listed in `KEEP` inside the template never split across lines.

## Web video (GPU only)

Owner's standing rule: every render and encode runs on the GPU (RTX 3080) — Remotion `--gl=angle`, ffmpeg NVENC,
never libx264 or another CPU encoder. One recipe for every film on the site (masters in `_video/out/`, web files in
`video/`):

```bash
ffmpeg -y -hwaccel cuda -hwaccel_output_format cuda -i _video/out/<master>.mp4 \
  -c:v h264_nvenc -preset p7 -tune hq -profile:v high -spatial-aq 1 -temporal-aq 1 \
  -rc vbr -cq 30 -b:v 0 -maxrate 3M -bufsize 6M \
  -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1 \
  -c:a aac -b:a 128k -movflags +faststart video/<name>.mp4
```

- Keep the master's frame rate (a 60 fps film stays 60 fps). A file with no sound: drop the `-c:a …` pair, add `-an`.
- The BT.709 tags come from the `h264_metadata` filter: with CUDA frames, `-color_primaries`/`-color_trc` never reach
  the stream and come out `unknown` (checked 21 Oct 2026).
- Check: `ffprobe -v error -select_streams v:0 -show_entries stream=avg_frame_rate,color_primaries,color_transfer:stream_tags=encoder -of compact=p=0 video/<name>.mp4`
  → `h264_nvenc`, `bt709` twice.

Measured on the hero master `jwic-month-60.mp4` (21 Oct 2026, SSIM against the master):

| Encode | Video kbps | SSIM |
|---|---|---|
| libx264 CRF 26 — the current `video/month.mp4`, CPU, made before the rule | 970 | 0.9946 |
| **this recipe** (cq 30, max 3M) | 2034 | 0.9961 |
| NVENC cq 34 | 1630 | 0.9950 |
| NVENC cq 36 | 1339 | 0.9943 |
| NVENC 2-pass bitrate target (1M or 1.3M) | ~1275 | 0.9907 |

NVENC needs about 1.7× libx264's bitrate for the same SSIM. When a file must be smaller, raise `-cq` (34 matches the
old file's quality); a bitrate target loses to CQ at the same size.

## Run (human path)

Open `index.html` directly in a browser — it's fully self-contained.

## Gotchas

- **`python -m http.server` does NOT work here** despite CLAUDE.md suggesting
  it: `python`/`python3` on this machine are Microsoft Store stubs (exit 49,
  "Python was not found"). The driver ships its own Node static server instead.
- The driver serves over **http, not `file://`** — the CSP meta tag uses
  `'self'`, which is unreliable on `file://` origins.
- Every run uses a **fresh browser profile**, so the cookie banner always
  reappears and consent state never persists between runs.
- Clicking ยอมรับ loads **real GA** (`G-NGDPEC4BZ1`) and records a localhost
  pageview — harmless noise, but don't loop it.
- The driver waits 1.2 s after load for web fonts (self-hosted in `css/fonts/` since Sep 2026) + hero entrance
  animations; screenshots taken faster show half-faded content.
- **Don't trust headless for paint timing on desktop.** Headless Chrome often presents no frame at all until
  the `.hero-copy` entrance animation ends (FP/FCP/LCP ≈ 1.35 s instead of ≈ 0.3 s), at 30–90 % of runs
  depending on the machine's state. A real Chrome window never does it (0/30, 21 Oct 2026), and nor does
  headless with reduced motion. To measure paint, launch headful and park the window off-screen:
  `headless: false` + `--window-position=-2600,-2600 --disable-features=CalculateNativeWinOcclusion
  --disable-backgrounding-occluded-windows --disable-renderer-backgrounding`. Interleave the variants you
  compare, because rates drift between batches.
- **Don't judge an encode by dropped frames under CPU throttling.** With DevTools `setCPUThrottlingRate: 4`
  every film drops ~4–5 % of its frames, `video/month.mp4` included. Without throttling, none do.

## Test

No test suite — the consent check above is the smoke test.
