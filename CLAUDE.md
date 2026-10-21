# promote-site

Landing page selling Microsoft Dynamics 365 Business Central localization for Thai businesses (JWIC Consulting, single page, TH/EN).

- **Live: https://www.jwicconsulting.com/** — GitHub Pages deploys on every push to `main` (repo sunshanlin/JHSite, **public**). Never delete `CNAME` at the root, or the custom domain breaks.
- One file: `index.html` — all HTML + CSS inline, no build step, no dependencies (`poster.html` = A4 poster, printed to PDF).
- Run / screenshot / test: skill `/run-promote-site` (not `python -m http.server` — python on this machine is a Store stub).
- Contact: phone/LINE 084-148-7480 (Jirapat Wichayapong — Sun) · e-mail **`jirapat.wi@outlook.co.th`** in every file of this repo (8 spots on the page, JSON-LD, articles, PRODUCT.md). `@outlook.com` reaches the same inbox (LinkedIn uses it), but the site keeps `.co.th` only, never mixed — schema and Google Business Profile should match.
- Style: read DESIGN.md before editing. All design tokens live in **one** `:root` block at the top of `<style>` (merged from 6 blocks on 23 Sep 2026, every value unchanged); add new tokens there, never open a second `:root`. `--ui-muted: #516661` and `--brand-pink-soft: #EFA9BB` came from the WCAG AA pass — don't roll them back. Legacy names (`--navy` `--accent` `--muted` …) are still used by early rules and now point at the brand.
- Bilingual: the `I18N` dictionary (selector → EN/TH) sits at the end of `<script>` in index.html — adding, moving or editing page copy means updating its pair too, nth-child selectors above all; `#articles` is untranslated on purpose. Thai `aria-label` / `alt` / `title` need a pair in `I18N_ATTR` (it takes the first `querySelector` match only, so the selector must be unique), except buttons whose label changes with state: they switch language in their own script. CI checks this.

## File layout — where a new file goes

Every committed file is served as a real URL on jwicconsulting.com, except folders starting with `_` or `.` and what `_config.yml` excludes. **Never move or rename an existing file** — links already shared would break.

| Kind of file | Goes to |
|---|---|
| New article | `articles/` |
| Images on the page | `img/` (logo/brand → `img/brand/`, badges and certificates → `img/credentials/`) |
| Unwatermarked source images | `img/originals/` — gitignored, never commit them to the host |
| Original certificate PDFs | `credentials/` |
| CSS shared by several pages | `css/` |
| Fonts (self-hosted woff2 + `OFL.txt`) | `css/fonts/` — the same set Google Fonts serves; `@font-face` declared at the top of index.html's `<style>` and of `css/article.css` |
| JS shared by several pages (only `js/article.js` today = cookie bar + GA for articles) | `js/` |
| Article share image (og:image) 1200×630 | `img/og/` — made with `node .claude/skills/run-promote-site/og.mjs` |
| Home page share image (og:image) 1200×630 | `img/og/home.png` — rendered from `.claude/skills/run-promote-site/og-home.html` (command in its header); og.mjs leaves it alone · `img/jh-poster.png` is no longer the share image but must not be deleted (old links still point at it) |
| Pages + Pages system files (`index.html` `404.html` `CNAME` `_config.yml` `robots.txt` `sitemap.xml` `llms.txt` `favicon.ico` `style.css`, and the print pages `poster.html` `banner.html` `flyer-overview.html` `flyer-implementation.html`) | root — only these; no new root file unless it is a real page |
| Internal notes at the root (`CLAUDE.md` `DESIGN.md` `PRODUCT.md` `JH-Site.code-workspace`) | listed under `exclude` in `_config.yml` (21 Oct 2026) — without it Pages served them as files and rendered the Markdown ones as `/CLAUDE.html` `/PRODUCT.html` `/DESIGN.html`. A new internal file at the root goes on that list too |
| Presales (PowerPoint decks + scripts) | **not in this repo any more** — moved to `D:\BC\Project\JHCore\docs\Presentation` (9 Oct 2026) |
| Plans and site reviews (not published) | `_plans/` — the `_` prefix keeps Jekyll from serving it (see the `.nojekyll` section below); latest `_plans/2026-09-improvement-plan.md` |
| Temporary screenshot/test output | `output/`, `.playwright-cli/` — gitignored, always safe to delete |

## Photo credits

The people photos in `#features` and `#contact` come from [Pexels](https://www.pexels.com/license/) and [Unsplash](https://unsplash.com/license) — both free for commercial use with no credit required; sources kept here so they aren't lost.

Unsplash+ (Getty) images fail to load (403), which works as a built-in license filter:

| File | Source |
|---|---|
| `feat-vat.webp` | Pexels 259139 |
| `feat-wht.webp` | Pexels 8111853 |
| `feat-stock.webp` | Pexels 4483941 |
| `feat-docs.webp` | Unsplash `7b_9cHdKgFg` |
| `feat-messenger.webp` | supplied by the owner (rights confirmed) |
| `why-person.webp` | supplied by the owner (rights confirmed) |
| `feat-api.webp` | Pexels 36706460 |
| `consult-meeting.webp` | Pexels 7643897 |
| `pricing-consultation.webp` | (already in the project) |

Every file went through `ffmpeg -vf "eq=brightness=..:saturation=1.18.."` to brighten it before the WebP conversion.

`img/credentials/dbd-registered.png` is a copy of the DBD badge, used in slides and as the **fallback when the DBD server is down** (`onerror` on the `.dbd` `<img>`). **The page must keep hotlinking from `dbdregistered.dbd.go.th` as the primary** — never make the copy primary; the badge link must always point at DBD's verification page.

## Folders starting with `_` — not published

**GitHub Pages' Jekyll does not serve folders starting with `_`**, so nothing in `_plans/` becomes a public URL.
⚠ **Never add `.nojekyll` at the root**: it turns Jekyll off entirely, and every `_` folder (and every file `_config.yml` excludes) becomes loadable from jwicconsulting.com at once.
Presales (the former `_presales/`) moved to `D:\BC\Project\JHCore\docs\Presentation` (9 Oct 2026). Its scripts still read images from this repo's `img/` (`imgRoot` in `build/deck-core.json`): moving or renaming an image in `img/` means fixing it there too.

## worker/ — proxy to the Revenue Department VAT Service (Cloudflare Worker `jwic-vat`)

- `#vat-service` on the live site calls `https://api.jwicconsulting.com/vat` (the worker's custom domain in `worker/wrangler.toml`) cross-origin, relying on CORS in `vat-proxy.js` · run locally (localhost) it calls `https://jwic-vat.jwic.workers.dev` instead (or `?vat=<url>`) · CSP `connect-src` must list both hosts.
- ⚠ **The `www` and apex records in Cloudflare must always be grey-cloud (DNS only)** — GitHub Pages can renew its Let's Encrypt cert only while DNS points straight at it. The old route `www.jwicconsulting.com/api/vat*` needed orange cloud on www, so the cert could not renew (status `bad_authz`), expired on 18 Oct 2026, and Cloudflare Full (strict) answered 526 for the whole site; hence the `api` subdomain.
- Cert status on GitHub: `gh api repos/sunshanlin/JHSite/pages --jq .https_certificate` · worker check: `curl -s "https://api.jwicconsulting.com/vat?tin=0105558000123"` returning JSON that starts `{"ok"` = working.
- Limit 20 requests/minute/IP (`[[unsafe.bindings]]` named RL) · the Revenue Department account goes in via `npx wrangler secret put RD_USER`, never in code — every file in `worker/` is a public URL.

## CI

- `links.yml` — internal links/images don't 404 (lychee offline) · a new `/#section` link in an article needs that section name added to `--exclude`.
- `page-checks.yml` — html-validate (rules in `.github/htmlvalidate.json`) + the page opened in real Chrome by `.github/scripts/page-checks.mjs`: console/CSP errors, horizontal scroll, nav bar wrapping to two rows, dead I18N selectors, Thai text or Thai aria-label/alt left in EN mode, `#pricing` copy overflowing or needing `.wrap-rescue`, buttons under 24px, mobile page length, CTA/other articles in every article, printed page count — run locally: `npm i --no-save --prefix .github/scripts playwright-core && node .github/scripts/page-checks.mjs`
