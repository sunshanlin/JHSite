# JWIC "Localization คืออะไร" — Design spec (explainer, VO-driven)

Co-creation mode (video-shotcraft `guided-free-creation`). Owner confirmed the brief + 3 content choices on 2026-10-18;
design decisions are the agent's (owner: "ผมวางใจคุณ … ไม่มีความรู้ด้าน design"). Baseline for the independent final review.
Sibling of the ~93 s "ครบทั้งเดือน" clip (DESIGN-SPEC.md): same project, same tokens, same captures, new composition.

## 1. Product brief

| Item | Decision | Evidence |
|---|---|---|
| Purpose | Explainer for the article "Thai Localization ใน Business Central คืออะไร" (articles/localization-thailand.html) + YouTube | owner 2026-10-18 |
| Audience | Thai SME owners / accountants / CFOs choosing BC; existing BC users | DESIGN-SPEC.md §1 |
| Core message | Localization = functions that follow the country's rules · one close example (the tax invoice) · Microsoft's 3 categories · Thai examples by category · JWIC Thai Localization does this on BC | the article; owner 2026-10-18 dropped the "Thailand status" part (Partner/W1, who fixes it) |
| Length / format | VO-driven, ≈ 110 s (15 VO lines measure 95 s on the scratch voice) · 1920×1080 · 60 fps on the 30 fps author grid (`rate.ts`) · 16:9 only | owner 2026-10-18: 16:9 only |
| Voice | Female Thai VO from **Botnoi Voice** (owner 2026-10-18) — the owner generates `loc-01…19.mp3` from `loc/vo-botnoi.txt`; edge-tts th-TH-Premwadee (rate −5 %) is the scratch track for the cut only (owner rejected edge-tts quality 2026-08-15) | docs/Presentation/voice/README.md |
| Music | Soft bed under the VO (owner 2026-10-18 "เพลงเบา ๆ จากคลัง shotcraft"); the shotcraft bgm/ set is house/hip-hop only, so a Mixkit soft corporate track is used instead (same licence family as "Stay With Me"); ducked under VO; masters with and without BGM | assets/audio/ATTRIBUTION.md |
| On-screen text | Thai subtitles for every VO line, ≥ 54 px (Q11), Latin for product names; Thai tax terms spelled as on RD forms (jhthai) | house rule |
| Data | The sanitised TEST captures of the month clip (`public/docs`, `public/screens`); Microsoft's availability row re-typed as a pictogram table, no Microsoft logo, a "ที่มา: Microsoft Learn" line | DESIGN-SPEC.md §6 |

## 2. Requirement → execution

| Requirement | Execution |
|---|---|
| Explain, not sell | Narration carries the argument; every claim is one the article already makes; no legal citations, no deadlines |
| Positive tone (owner 2026-10-18 "พยายามเลี่ยง negative") | Say what Localization adds, never what is missing or who does not do it: no "ไม่มี / ไม่ใช่" lines, no strike-throughs or rose "gap" marks, the tax-invoice shot is "BC creates the invoice, Localization fills in the RD items" |
| "Pictograph + JHCore elements" (owner) | Two-colour line pictograms (ink `#1B1F3B` + jade `#1F7A70`, rose `#C25470` only for the gap / "missing") drawn as inline SVG, 6 px strokes at 1080; real JHCore documents and pages with the month clip's origin tags (grey Business Central / green JWIC Thai Localization) |
| VO is the clock | `src/loc/vo.ts` reads `loc/vo-durations.json`; each scene is pinned to its VO line's start; a scene never ends before its last line's speechEnd + 0.5 s |
| Readable pace | R3: one action per VO line; no beat-sync; titles hold ≥ 1 s |
| One technique, one hero (P4) | 8 cards, each the hero once (§4) |

## 3. Visual direction

Jade + Rose tokens from `src/theme.ts` (text green `#0B4F48`, title gradient in deep greens, Noto Sans Thai 600/700, glass panels,
sky ground). Pictogram style: rounded line icons, 6 px stroke, flat fills in sky tints, no gradients inside icons; rose is unused (no gap marks); motion "professional
trust" (stiff springs, short overshoot). Styleframe comparison skipped: owner delegated design and the tokens are the approved ones;
three stills are rendered for the agent's own check before the first full render.

## 4. Feature → shot mapping (card → demo source)

| # | Scene (VO lines) | Card · style | Demo source | Pictogram / JHCore element |
|---|---|---|---|---|
| S1 | นิยาม (01–02) | lead-word-zoom-assemble → marker-underline-title | LeadWordZoomAssemble.tsx · MarkerUnderlineTitle.tsx | "Localization" fills the frame, shrinks into the definition; marker under "ฟังก์ชัน"; pictogram: screen with TH/EN toggle dims, document with a seal brightens |
| B1 | breath "เริ่มจากใบกำกับภาษี" | paper-title-card | PaperTitleCard.tsx | — |
| S3 | ใบกำกับภาษี (03–04) | before-after-slider-scrub | BeforeAfterSliderScrub.tsx | BC Posted Sales Invoice page (screens/posted-sales-invoice-clean.png, BC tag) hands over an A4 plain-invoice pictogram (BC tag); the slider sweeps and the real ใบกำกับภาษี (docs/tax-invoice.png, JW tag) is revealed in the same A4 frame; three "+" chips: เลขประจำตัวผู้เสียภาษี · สาขา · เลขที่เอกสาร. Adaptation: the slow scrub runs on to 100 % (the whole form must stay for the chips) instead of back to 40 % |
| S4 | สามหมวด (05–10) | word-relay-geometry → own sort animation (springs + stagger) | WordRelayGeometry.tsx · own | Regulatory / National standards / Market with pictograms RD building · handshake · rocket; 7 task chips fly into three bins (the article's table) |
| B2 | breath "ในระบบจริง" | paper-title-card | PaperTitleCard.tsx | — |
| S5 | ตัวอย่างจริง (11–13) | card-flip-reveal ×3 | CardFlipReveal.tsx | pictogram front flips to the real thing: docs/pp30.png + docs/sales-vat.png · docs/wht-cert.png + screens/direct-wht-info.png · screens/billing-board.png + docs/billing-note.png |
| S6 | ปิด (14–15) | outro-group-photo-launch → JwMark | OutroGroupPhotoLaunch.tsx · src/JwMark.tsx | the pictograms and documents fly in around the JW mark; "JWIC Thai Localization สำหรับ Business Central" · www.jwicconsulting.com · hold ≥ 1 s |

## 5. Timeline

Source of truth: `src/loc/timeline.ts`, computed from `src/loc/vo.ts` (generated by `loc/gen-vo.mjs` from `loc/vo-durations.json`, which `loc/measure-vo.py` measures off the mp3s). Scratch cut: 3316 f ≈ 110.5 s. Breath cards 55 f
(1.8 s). Scene starts = VO line starts. Scratch cut:

| Scene | | Frames (author, 30 fps) | Duration | VO lines @ global frame |
|---|---|---|---|---|
| s1 | นิยาม | 0–403 | 403 (13.4 s) | 1 @ 8, 2 @ 207 |
| b1 | ใบคั่น "เริ่มจากใบกำกับภาษี" | 403–458 | 55 (1.8 s) | — |
| s3 | ใบกำกับภาษี | 458–962 | 504 (16.8 s) | 3 @ 468, 4 @ 593 |
| s4 | สามหมวด | 962–2188 | 1226 (40.9 s) | 5 @ 972, 6 @ 1135, 7 @ 1274, 8 @ 1556, 9 @ 1728, 10 @ 1991 |
| b2 | ใบคั่น "ในระบบจริง" | 2188–2243 | 55 (1.8 s) | — |
| s5 | ในระบบจริง | 2243–2903 | 660 (22.0 s) | 11 @ 2255, 12 @ 2472, 13 @ 2705 |
| s6 | ปิด | 2903–3316 | 413 (13.8 s) | 14 @ 2919, 15 @ 3142 |

Total 3316 f = 110.5 s (scratch voice; the table is regenerated when the Botnoi files land).

## 6. Sound

VO lines `public/audio/vo/loc-NN.mp3` at 0 dB; BGM bed = Mixkit "Infinity" by Arulo (1:43, Corporate · Atmospheric · Relaxed · Piano, no drums;
https://assets.mixkit.co/music/440/440.mp3, Mixkit Stock Music Free License, same family as the month clip's track) as `public/audio/bgm-infinity.mp3`,
ducked under speech, up a little in the breaths and the outro, faded out at the end; SFX from
`D:/video-shotcraft/assets/audio/sfx` (paper / ui / light / transition), one per landing, pinned in `src/loc/sfx.ts`.
Masters: `out/jwic-localization.mp4` (BGM) and `out/jwic-localization-nobgm.mp4` (VO + SFX).

## 7. Data safety

Captures reuse the sanitised TEST data (company TIN 0105569902138, fictional customers/vendors). No new captures needed.
No Microsoft logo or wordmark; the product name appears as plain text; Microsoft's table row is re-typed, with its source line.
