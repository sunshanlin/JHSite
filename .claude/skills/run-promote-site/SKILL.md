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
- The driver waits 1.2 s after load for Google Fonts + hero entrance
  animations; screenshots taken faster show half-faded content.

## Test

No test suite — the consent check above is the smoke test.
