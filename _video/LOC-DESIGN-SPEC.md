# JWIC "Localization คืออะไร" — Design spec (explainer, VO-driven)

Co-creation mode (video-shotcraft `guided-free-creation`). Owner confirmed the brief + 3 content choices on 2026-10-18;
design decisions are the agent's (owner: "ผมวางใจคุณ … ไม่มีความรู้ด้าน design"). Baseline for the independent final review.
Sibling of the ~93 s "ครบทั้งเดือน" clip (DESIGN-SPEC.md): same project, same captures, new composition. **Revised 2026-10-19:** same captures only — the
look is no longer the month clip's (§3), the film opens on a "why" question (S0) and the definition is in spoken Thai (S1).

## 1. Product brief

| Item | Decision | Evidence |
|---|---|---|
| Purpose | Explainer for the article "Thai Localization ใน Business Central คืออะไร" (articles/localization-thailand.html) + YouTube | owner 2026-10-18 |
| Audience | Thai SME owners / accountants / CFOs choosing BC; existing BC users | DESIGN-SPEC.md §1 |
| Core message | Localization = functions that follow the country's rules · one close example (the tax invoice) · Microsoft's 3 categories · Thai examples by category · JWIC Thai Localization does this on BC | the article; owner 2026-10-18 dropped the "Thailand status" part (Partner/W1, who fixes it) |
| Length / format | **Narrated + captions** (owner 2026-10-21: tried "เอาแบบไม่พากย์", then "เอาแบบพาก"): 144.7 s — 17 of the 18 VO lines (line 02 cut by the owner 2026-10-21, see §4 S0) on the owner's cloned voice at tempo 0.93, conversational script (2026-10-21), + the 6.6 s JWIC Consulting outro · 1920×1080 · 60 fps on the 30 fps author grid (`rate.ts`) · 16:9 only. The no-voice cut (captions + music, cuts on half-bars) stays one switch away: `node loc/gen-beats.mjs` then `node loc/gen-vo.mjs --beats` | owner 2026-10-18: 16:9 only · owner 2026-10-21 |
| Voice | **On** (off for a few hours on 2026-10-21, back by the owner's "เอาแบบพาก"; script made conversational the same day, loc/script.md): **the owner's own voice, cloned** (owner 2026-10-19 picked reference `cand-06`): SiangTTS (VoxCPM2 + Thai LoRA) run locally; `D:/TTS/scripts/make_vo.py` writes `loc-01…17.mp3` from `loc/vo-botnoi.txt` — cut to the speech (the breath or click a take opens or ends on goes), −18 LUFS, true peak ≈ −2 dBFS; raw takes in `D:/TTS/out/vo-raw`, `make_vo.py 06@2` retakes one line. Replaces the Botnoi plan and the edge-tts scratch | memory user_voice_samples |
| Music | Mixkit "Lo-Fi 05" by Lily J (owner's pick 2026-10-21 "เพลงแนว Lofi"): narrated, from b1, ducked under the VO at the Infinity bed levels −1.1 dB; with no voice, from the first frame, no ducking | owner 2026-10-21 |
| On-screen text | With no voice the captions (`src/loc/subs.json`, owner-approved 2026-10-21) carry the words the picture does not: eight words or so a line, none where a headline, chips or slide tags already say it (lines 4, 6, 10, 12); 58 px (Q11), Latin for product names; Thai tax terms spelled as on RD forms (jhthai) | owner 2026-10-21 |
| Data | The sanitised TEST captures of the month clip (`public/docs`, `public/screens`); Microsoft's availability row re-typed as a pictogram table, no Microsoft logo, a "ที่มา: Microsoft Learn" line | DESIGN-SPEC.md §6 |

## 2. Requirement → execution

| Requirement | Execution |
|---|---|
| Explain, not sell | Captions and pictures carry the argument together; every claim is one the article already makes; no legal citations, no deadlines |
| Positive tone (owner 2026-10-18 "พยายามเลี่ยง negative") | Say what Localization adds, never what is missing or who does not do it: no "ไม่มี / ไม่ใช่" lines, no strike-throughs or rose "gap" marks, the tax-invoice shot is "BC creates the invoice, Localization fills in the RD items" |
| "Pictograph + JHCore elements" (owner) | Two-colour line pictograms (ink `#1B1F3B` + jade `#1F7A70`, rose `#C25470` only for the gap / "missing") drawn as inline SVG, 6 px strokes at 1080; real JHCore documents and pages with the month clip's origin tags (grey Business Central / green JWIC Thai Localization) |
| The clock | **No voice:** `loc/gen-beats.mjs` gives each line its reading time (caption + the text the scene shows meanwhile, 0.9 s + 11 Thai base characters a second) or 1.2 s + 0.55 s a cue for pictures, at least 1.8 s, and lands its cues by syllable in 10–70 % of it; `loc/beats.json` → `node loc/gen-vo.mjs --beats` → `src/loc/vo.ts` (NARRATED false), and `timeline.ts` stretches each scene to the next half-bar of the BGM (first beat 0.084 s, 0.6966 s a beat). **Narrated:** `src/loc/vo.ts` reads `loc/vo-durations.json`; each scene is pinned to its VO line's start; a scene never ends before its last line's speechEnd + 0.5 s. Word cues (a chip, a slip, a flip and its SFX on the word they illustrate) come from `loc/vo-cues.json` — a syllable of a line — placed on the measured speech runs by `loc/gen-vo.mjs` and read through `cue()` (timeline.ts) by the scenes and `sfx.ts` alike, so a retake moves them with it |
| Opens on the question (owner 2026-10-19 "ทำไมต้องเกิด Localization ขึ้นมา") | S0: serif headline "ทำไมต้องมี Localization ?" + a globe; line 03 names the three kinds of rule every country has of its own (ภาษี · รูปแบบเอกสาร · วิธีปฏิบัติทางการค้า) as slips with red pins on the globe. Positive: says what each country brings, never what a system lacks |
| Definition in natural Thai (owner 2026-10-19) | "Localization คือการปรับระบบให้ทำงานตามกฎของประเทศที่ใช้งาน" then "ด้วยฟังก์ชันที่ตรงกับกฎของประเทศนั้น ซึ่งมากกว่าแค่การแปลภาษาบนหน้าจอ" (was "ชุดฟังก์ชันที่ทำให้ระบบทำงานตามข้อกำหนดของประเทศที่ใช้งาน"); same claim as the article |
| Mood tone differs from the month clip (owner 2026-10-19) | new skin, §3 |
| Readable pace | R3: one action per line; captions hold for their reading time; cuts on the music's half-bars; titles hold ≥ 1 s |
| One technique, one hero (P4) | 8 cards, each the hero once (§4) |

## 3. Visual direction

**Skin v3 "flat explainer" (2026-10-19, owner: borrow the look of a flat 2D motion-graphics explainer, but keep it BRIGHT; code `src/loc/skin.ts`).**
Flat solid colour fields that change per scene (peach · pink · butter · mint · sky), a **red circle as the protagonist (the system)**, dark-grey /
plum thick outlines and type (`#5B2145`), bright accents (red, teal, purple, green, orange, yellow), drifting geometric confetti, dashed paths, **no
shadows**, Prompt (rounded geometric Thai + Latin) for everything, two-colour headline word ("Local" red + "ization" teal), subtitles as a white capsule with
a plum outline. A scene change is an **iris reveal of the next colour field** (`Iris` in Loc.tsx). Jade stays only for what JWIC adds (tags). No dark scenes.
Not copied from the reference: its footage, logo or assets — only the visual language. Earlier skins: month clip (theme.ts) and the paper ledger
(the paper-skin backup zip was deleted 2026-10-19 at the owner's request).
**Status (superseded, see §8):** S0, S1, Ground, Subtitle, Kicker, Breath were in v3 (its stills were deleted 2026-10-19 after the owner chose modern). S3–S6 run on v3's colour fields and tokens but keep their
paper-skin layouts (S4 already left-aligned with highlighter disc) until the owner confirms the direction, then they get v3 treatment (protagonist circle,
dashed paths, colour change per category).

## 4. Feature → shot mapping (card → demo source)

| # | Scene (VO lines) | Card · style | Demo source | Pictogram / JHCore element |
|---|---|---|---|---|
| S0 | ทำไมต้องมี (01 and 03; 03's "ก็เพราะแต่ละประเทศมีกฎของตัวเอง" answers 01's question straight away. Line 02, the owner's "ลองนึกภาพตาม สมมติ…" of 2026-10-19 with its Thai and Japanese invoice cards, was cut by the owner on 2026-10-21 ("เอาท่อน ลองนึกภาพตามกันออกไปเลย"). Its mp3 and its rows in vo-durations.json / vo.ts stay, because VO is indexed by line number, but no scene owns it (timeline.ts SPOKEN). The cards' code and the pre-cut masters are in `out/backup-2026-10-21-with-line2/`) | own (word stagger, stamp-thunk, highlighter) | own: S0Modern.tsx | headline "ทำไมต้องมี Localization ?" (highlighter behind the word, red "?" stamped as line 1 ends), a globe, three slips 01 ภาษี · 02 รูปแบบเอกสาร · 03 วิธีปฏิบัติทางการค้า landing on the words of line 2 while red pins land on the globe |
| S1 | นิยาม (03–04) | lead-word-zoom-assemble → marker-underline-title | LeadWordZoomAssemble.tsx · MarkerUnderlineTitle.tsx | "Localization" fills the frame, shrinks into "Localization คือ การปรับระบบ ตามกฎของประเทศ"; red-pen underline under "การปรับระบบ"; pictogram: screen with TH/EN toggle dims, document with a seal brightens |
| B1 | breath "เริ่มจากใบกำกับภาษี" | paper-title-card | PaperTitleCard.tsx | — |
| S3 | ใบกำกับภาษี (05–06) | before-after-slider-scrub | BeforeAfterSliderScrub.tsx | BC Posted Sales Invoice page (screens/posted-sales-invoice-clean.png, BC tag) hands over an A4 plain-invoice pictogram (BC tag); the slider sweeps and the real ใบกำกับภาษี (docs/tax-invoice.png, JW tag) is revealed in the same A4 frame; four numbered rings in the order the slider uncovers them (owner 2026-10-21 "แยกเป็น 1,2,3,4"): 1 the customer's เลขประจำตัวผู้เสียภาษี · 2 the customer's สาขา · 3 our สาขา (สำนักงานใหญ่ in the seller block) · 4 the title ใบแจ้งหนี้/ใบกำกับภาษี + Tax Invoice (was เลขที่เอกสาร), which waits for the slow scrub to pass it (`S3_TITLE_RING`, its pop in sfx.ts too); each bubble placed where it covers no text. Adaptation: the slow scrub runs on to 100 % (the whole form must stay for the chips) instead of back to 40 % |
| S4 | สามหมวด (07–12) | own: one category at a time down the left of the page (number stamp, serif word on an amber highlighter, Thai gloss, example slips), pictogram on a highlighter disc on the right (replaces word-relay-geometry's rings and gradient fill) | own: S4Categories.tsx | Regulatory / National standards / Market with pictograms RD building · handshake · rocket; line 7 shows the three as slips first; bottom 3-segment progress (the article's table) Chips (owner 2026-10-21): Regulatory = ภาษีซื้อ · ภาษีขาย แยกสาขา · ใบกำกับภาษี · หัก ณ ที่จ่าย · รายงานเคลื่อนไหวสินค้า · ทะเบียนทรัพย์สิน (VAT · สาขาภาษี merged into the first, "ซ้ำ"; the last two added); National standards = ใบวางบิล · รอบวางบิล (was ชำระตามรอบ) · ที่อยู่แบบไทย · เอกสารไทย / อังกฤษ · งบการเงินไทย; Market = รายงานวิเคราะห์ยอดขาย · BOT อัตราแลกเปลี่ยน (owner picks 2026-10-21). |
| B2 | breath "ในระบบจริง" | paper-title-card | PaperTitleCard.tsx | — |
| S5 | ตัวอย่างจริง (13–15) | card-flip-reveal ×3 (paper-slip fronts, hard shadows) | CardFlipReveal.tsx | pictogram front flips to the real thing: docs/pp30.png + docs/sales-vat.png · docs/wht-cert.png + screens/direct-wht-info.png · screens/billing-board.png + docs/billing-note.png |
| S6 | ปิด (16–17) | outro-group-photo-launch → JwMark | OutroGroupPhotoLaunch.tsx · src/JwMark.tsx | the pictograms and documents fly in around the JW mark + "JWIC Thai Localization"; 1 s hold, then END (the URL moved out, owner 2026-10-19) |
| END | JWIC Consulting (no VO) | the month clip's outro "Draw + Wipe" itself, frame for frame | src/scenes/Outro.tsx `handOver={false} lines={false}` | the JW mark's outline traced → filled → rose corner folds → "JWIC Consulting" wiped in. Owner 2026-10-19: same outro as the month clip, **mark + name only** (no tagline, Localization line or URL), **no music** — only its three SFX |

## 5. Timeline

Source of truth: `src/loc/timeline.ts`, computed from `src/loc/vo.ts` (generated by `loc/gen-vo.mjs` from `loc/vo-durations.json`, which `loc/measure-vo.py` measures off the mp3s;
`node loc/print-timeline.mjs` prints the table). Breath cards 55 f (1.8 s). Scene starts = VO line starts. On the owner's cloned voice, with line 02 cut (2026-10-21):

| Scene | | Frames (author, 30 fps) | Duration | VO lines @ scene-local frame |
|---|---|---|---|---|
| s0 | ทำไมต้องมี | 0–378 | 378 (12.6 s) | 1 @ 10, 3 @ 156 |
| s1 | นิยาม | 378–773 | 395 (13.2 s) | 4 @ 8, 5 @ 208 |
| b1 | ใบคั่น "เริ่มจากใบกำกับภาษี" | 773–828 | 55 (1.8 s) | — |
| s3 | ใบกำกับภาษี | 828–1429 | 601 (20.0 s) | 6 @ 10, 7 @ 123 |
| s4 | สามหมวด | 1429–2901 | 1472 (49.1 s) | 8 @ 10, 9 @ 171, 10 @ 296, 11 @ 712, 12 @ 895, 13 @ 1124 |
| b2 | ใบคั่น "ในระบบจริง" | 2901–2956 | 55 (1.8 s) | — |
| s5 | ในระบบจริง | 2956–3771 | 815 (27.2 s) | 14 @ 12, 15 @ 283, 16 @ 618 |
| s6 | ปิด | 3771–4142 | 371 (12.4 s) | 17 @ 16, 18 @ 236 |
| end | JWIC Consulting outro | 4142–4341 | 199 (6.6 s) — the month clip's outro length | — |

Total 4341 f = 144.7 s narrated (`node loc/print-timeline.mjs`); with line 02 it was 4689 f = 156.3 s (the 2026-10-21 19:20 master); the no-voice cut was 3378 f = 112.6 s (`--beats`, before the cut). Narrated, the BGM enters on b1, so S0 and S1 are voice only;
it fades out by the end scene.

## 6. Sound

No voice (2026-10-21): BGM = Mixkit "Lo-Fi 05" by Lily J (2:06, Rhythmic Underscore · Relaxed · Positive, 86 BPM; https://assets.mixkit.co/music/767/767.mp3,
Mixkit Stock Music Free License) as `public/audio/bgm-lofi-05.mp3`, from frame 0 at 0.5 (≈ −17 LUFS), 40 f fade-out into the outro; no VO. Narrated:
VO lines `public/audio/vo/loc-NN.mp3` at 0 dB; BGM bed = Mixkit "Infinity" by Arulo (1:43, Corporate · Atmospheric · Relaxed · Piano, no drums;
https://assets.mixkit.co/music/440/440.mp3, Mixkit Stock Music Free License, same family as the month clip's track) as `public/audio/bgm-infinity.mp3`,
ducked under speech, up a little in the breaths and the outro, faded out at the end; SFX from
`D:/video-shotcraft/assets/audio/sfx` (paper / ui / light / transition), one per landing, pinned in `src/loc/sfx.ts` (S0: a paper slide on the headline, a pop on the "?" and on each slip; S4's circles-lock click and Market sparkle went with the removed geometry).
The ending is JWIC's sound signature (owner 2026-10-19): the BGM is gone by the end scene, which plays the month clip's three outro SFX
alone at the month clip's frames — transition-soft swelling into the outline closing (local 46), the paper turn as the rose corner stands up
(beat 169 → local 62), the sparkle on the settled lockup (local 117). S6 before it keeps to a swoosh (fly-in) and a pop (mark lands); its
riser / impact / sparkle sign-off was dropped so nothing pre-empts the signature.
Masters: `out/jwic-localization.mp4` (BGM) and `out/jwic-localization-nobgm.mp4` (VO + SFX).

## 7. Data safety

Captures reuse the sanitised TEST data (company TIN 0105569902138, fictional customers/vendors). No new captures needed.
No Microsoft logo or wordmark; the product name appears as plain text; Microsoft's table row is re-typed, with its source line.

## 8. Shotcraft design record (2026-10-19, owner: "ใช้ Shotcraft ในการออกแบบด้วย")

Mode: co-creation (`references/guided-free-creation.md`); the three looks below are the **styleframes** of the visual-direction step
(S0 and S1 × flat / modern / 3d; the comparison sheets were deleted 2026-10-19 once modern was chosen). The owner picks one, then the shot mapping and storyboard of S3–S6 are redone in it.

| Look | What it is | Code |
|---|---|---|
| flat | borrowed flat 2D explainer: flat fields, plum outlines, red circle, confetti | deleted 2026-10-19 |
| modern | same story, cleaner: two-stop gradient fields + soft light blobs, gradient headline word, squircle app-icon badges, white cards/pills on soft layered shadows, no outlines, no confetti | `skin.ts` M, `S0Modern`, `S1Modern` (the look in use) |
| 3d | three.js (`@remotion/three`): glossy clay-like objects with volume, soft key light, shadows caught on a back wall; camera orbits slowly | deleted 2026-10-19 |

(The `look` switch, `look.ts`, the flat scenes and the three.js kit were deleted on 2026-10-19 once modern was chosen — owner: "ลบอันที่ไม่ใช้แล้วออกไปเลย". The 3d stills needed `chromiumOptions.gl = 'angle'`).

Rules applied (aesthetic-rules.md): **Q5** one hero with a full arc (the red sphere: drop → hover bob, sin period 40 f as in spotlight-hero-card → pulse per icon);
**Q7 / Q6** side-oblique orbit camera, ±7° over the scene, only on the narrative shots (S0, S1) — information-dense S3/S5 stay front-on; **Q3** no camera shake;
**C3** text in a 3d shot lives in the same 3d space (`Plane3D` shares the camera: headline and labels turn with the orbit, hover at translateZ 46–60 px with a shadow);
**R3** hold (arc ≥ 3 s, nothing faster than the first cut); **Q2** UI textures in 3d would need native-size rasterisation (not used yet: no screenshots in 3d).
**P2** reference breakdown (TED-Ed "What's the best way to give a presentation", 8 min, 720p): ADOPTED flat colour fields changing per scene, a single protagonist
circle, dashed/dotted paths, geometric accents, sparse two-colour type, colour-change transition; REJECTED its dark navy/plum scenes (owner: bright), its stage
footage and logos (not ours), its per-line talking-head structure.
**Colour theme = the first trailer's (owner 2026-10-19 "ผมเอาธีมสีแบบ JWIC Trailer ตัวแรก")**: every look now takes its tokens from `theme.ts` `C` — jade `#1F7A70` / jade light `#2FA79A`
(the system sphere, the seal), rose `#C25470` / pink `#E08CA2` (accents, "?"), sand `#F2C48D` (coin, highlighter), ink `#1B1F3B`, muted `#5A6190`, deep-green title gradient, ground tints of
`C.sky` with the trailer's mist-green and pink bokeh. **Pastel (owner: "สีให้มัน pastel")**: the same hues lifted to pastel — mint `#6CC9B8` / `#8ADBCB`, pink `#F08FAA` / `#F7B7C8`, peach `#FBD9A8`, softened navy ink `#34385F`, pale mint/pink/peach/sky grounds with mint and pink bokeh (`skin.ts` K, M). Mood, layout and motion stay different from the trailer (flat / modern / 3d); this satisfies shotcraft principle 2.
Deliberate deviation (to be confirmed by the owner): **Q7** asks for a dark contrasting material behind object close-ups — kept bright
(owner: "ยังอยากให้ออกมาสว่าง").
Open against the rules: **Q11** subtitles are 54 px (rule: ≥ 56, recommended 60) and auxiliary text must be ≥ 32 px — S5 card labels (22–24 px) and S4 tabs (26 px) are below it;
fix when the look is chosen. Final independent review (final-review.md, clean-context subagent) is still owed before delivery.

**Story first, less text (owner 2026-10-19: "ตัวอักษร คำอธิบายมากไป ต้องเน้นเล่าเรื่องราว").** The voice carries the explanation; the picture carries the story; text is only a hook
or a key word. Done so far: subtitles are no longer the VO verbatim — `SUBS` holds short captions (≤ 6 words) and an empty caption shows nothing where the headline, tab or slide
already says it (lines 1, 3, 5, 8–12, 16), size 58 px; the S0 icon labels are gone — instead the sphere (the system) hops out along each spoke to the thing the voice names
(ภาษี · เอกสาร · วิธีปฏิบัติทางการค้า), touches it and comes back (`hop.ts`); the S1 language card has no caption. Still to cut when the look is chosen: S3 callout chips,
S4 gloss line + example slips (keep one word per slip at most), S5 card captions and the two-line card labels, S6 tagline. Rule for every scene: what would the viewer see
happen with the sound off, and does a word add anything the motion has not already said?

**Look chosen: MODERN (owner 2026-10-19: "modern").** Modern is the only look in the code: the flat and 3d scenes, `threeKit.tsx`, `look.ts`, `Kicker.tsx` and the unused pictograms were deleted the same day at the owner's request.
Storyboard of the chosen look (latest stills in `out/loc-stills-richer/`, overview `out/sheet-richer.png`): S0 hook "ทำไมต้องมี Localization ?" + the sphere hopping to tax / document / trade →
S1 headline + the sphere hopping from the language card onto the document and becoming the seal → b1 → S3 the BC page hands over a plain A4, the slider sweeps, three numbered rings (no words) →
S4 three categories, one colour field each (mint / pink / butter), word + short chips + pictogram disc → b2 → S5 three cards flip from a badge + one word to the real documents (JW mark only) →
S6 the pieces fly in around the wordmark, URL, one short caption. Text left: headline words, chip words (≤ 2 words), card names, URL; all captions ≤ 6 words.
Components added for it: `OriginTag.tsx` (who did it: BC white pill / JWIC mint pill), `hop.ts`. `Ground` takes a field name (`peach` · `pink` · `butter` · `mint` · `sky`).

**Palette a notch richer (owner: "ปรับสีหน่อยมันอ่อนไปนิด").** Same hues, more saturation: grounds `peach #FFEAF1→#F9CFDF`, `pink #FBDDEB→#F0BBD3`, `butter #FFF1CF→#FFDC9A`, `mint #DDF6EE→#A9E5D4`, `sky #DCEFFF→#A9D5F5`; mint `#4FBFAA`/`#6FCFBD`, pink `#EC7898`/`#F29BB3`, sand `#F8C987`; headline gradient `#1F8070→#3FB19E`; ink `#2E3258`; bokeh `#A8E3D4`/`#F5B8CE`.
**National standards icon = two made-up national flags** (owner: "รูปธงชาติสมมติ"; `FlagsPicto` in `Picto.tsx`; not any real country's flag) — replaces the handshake in S4, S5 and S6.

**Grey grounds (owner 2026-10-21: "สีพื้นหลังมันควรเป็นสีเทาๆ", then "เทาล้วนไปเลย").** Every scene stands on one neutral grey `#F2F2F2→#DADADA`
(the per-scene Field names stay, all mapped to it) with a white `#FFFFFF` light and a soft grey `#E9E9E9` glow for bokeh; a cut is the iris over the content alone.
Type, cards, badges and accents unchanged; the grey now runs on into the JWIC Consulting outro's own grey. Stills: `out/loc-stills-grey/`.

