# JWIC "ครบทั้งเดือน" — Design spec

Co-creation mode (video-shotcraft `guided-free-creation`). Every row below was confirmed by the owner
(2026-10-12 / 2026-10-13) unless marked *agent*. This file is the baseline for the independent final review.
Revision 2 (2026-10-13): December data, purchase-first order, ~70 s, VAT reports in the close, native hero.
Revision 3 (2026-10-13 night): ~93 s cut with the feature wall; story re-time, owner-approved copy changes and the
aesthetics-review fixes (§5 is current; §9 records what changed and why).

## 1. Product brief

| Item | Decision | Evidence |
|---|---|---|
| Product | Business Central implementation + JWIC Thai Localization extension | www.jwicconsulting.com hero, feature blocks, pricing |
| Audience | Thai SME owners, accountants/CFOs choosing an ERP; existing BC users without Thai tax support | site copy, "for existing BC users" package |
| Purpose | Company intro clip (16:9, with music) + a silent 4:5 cut that replaces `.hero-doc` on the homepage | owner choice |
| Core claim | One month of Thai accounting work, done in one system | h1 "ครบวงจร" |
| Story order | ใบสั่งซื้อ → จ่ายผู้ขาย + 50 ทวิ → ใบกำกับภาษี/ใบแจ้งหนี้ → ใบวางบิล → ใบเสร็จรับเงิน → ปิดงวด (text file ภ.ง.ด.53, รายงานภาษีขาย/ซื้อ, ภ.พ.30) | owner 2026-10-13 ("ใบสั่งซื้อ จ่าย 50 ทวิ แล้วค่อยไปขาย"; "ก่อนออก ภพ มีรายงานภาษีซื้อขาย") |
| Length / format | Master ~93 s (2790 f), 1920×1080 @30fps. Hero cut 34.2 s (1027 f), 1080×1350, silent loop | owner: 60 s → ~70 s (PO shot) → ~90 s ("คนดูตามทัน", 2026-10-13) |
| Audio | Owner's track "Stay With Me" (Mixkit), edited to ~93 s ending on the song's own outro (§8); sparse SFX. Masters with and without BGM | owner 2026-10-13 |
| Outro | Folder → JW logo on the song's final hit → wordmark + tagline + URL. No CTA/contact card. Soft "Draw + Wipe": the mark's outline is drawn and closes on the hit, its rose corner visibly folds down, the name is uncovered out of the mark (replaced the flip-bloom) | owner 2026-10-13 · 2026-10-14 ("นุ่มนวลกว่านี้ … ยังต้องเข้ากับเพลง", "เห็นชัดๆ ว่าพับมุมเข้ามาสีชมพู") |
| Language | Thai on-screen copy (jhthai rules), BC captions stay English as on screen | owner + house rule |
| Data | A fresh December 2569 month posted in bcdev6 company TEST for this film (owner 2026-10-13: TEST may be edited freely — "แก้ได้เต็มที่") | owner 2026-10-13 |

## 2. Requirement → execution

| Requirement | Execution |
|---|---|
| A theme for a longer clip | One month as a process flow with checkpoints: ซื้อ › จ่าย › ขาย › วางบิล › รับเงิน › ปิดงวด (owner 2026-10-13: a calendar was too hard to follow) |
| Accounting audience reads closely | The documents carry their real posting dates (also under each checkpoint of the flow); the 50 ทวิ (WHT26120001) is the only row of the ภ.ง.ด.53 file; the VAT report totals (3,500 / 700) are tied by lines to ภ.พ.30 boxes 5 / 7, which hold the same figures, and box 11 ต้องชำระ 2,800 closes the tie-out; every amount chip is a plain number on blank paper beside the total it reads |
| No legal claims on the homepage | No filing deadlines, no law sections; the one compliance line is the owner's (2026-10-13) "ใบกำกับภาษีเต็มรูป · ถูกต้องตามหลักเกณฑ์กรมสรรพากร", backed by the printed form carrying every full-form item |
| Hero is small (≈490 px wide) | 4:5 cut, one action per scene, band text ≥ 68 px at 1350 |
| Show what JWIC adds (owner 2026-10-13) | Origin tags in every shot — grey "Business Central" on standard BC screens, green JW "JWIC Thai Localization" on JWIC's pages and Thai forms (`src/Tag.tsx`, JWIC's own rule: green = Localization); the opening pill is split into the two halves, "Microsoft Dynamics 365 Business Central" (plain text) + JW "JWIC Thai Localization"; each flow card carries the JW mark; the outro adds "Thai Localization สำหรับ Business Central" |
| Microsoft-style reference, no impersonation | Look only; no Microsoft logo or wordmark (BC app bar cropped out of every capture, the posted sales invoice included); the full product name, Microsoft Dynamics 365 Business Central, appears once — plain text on the opening pill, no logo (owner 2026-10-13) |
| Cut on the music | The flow's head reaches every checkpoint on a bar downbeat with a kick (16 / 28 / 48 / 76 / 96 / 116); the hook title lands on beat 4, the groove entry (beat 16) is the first checkpoint, the logo blooms on the song's final hit (beat 168) |

## 3. Visual direction

Reference: Microsoft "Dynamics 365 Business Central 2025 Release Wave 2 Release Highlights" (youtube `rs6jMUrvsfY`).

| Technique in the reference | Taken? |
|---|---|
| Translucent coloured sheets swirl and stack into a folder | Partly — opening fan + finale folder, but the documents stay plain white paper (owner 2026-10-13: no colour tint over documents) |
| Wireframe UI on frosted glass, bold title + pill tag | Yes — pill tags, glass |
| Real BC on a monitor, slow push-in | Partly — BC windows float over a blurred/sky ground (no desk photo) |
| UI close-up floating over blurred background | Yes — multiplane |
| Presenter / stock office footage | No (no footage) |

Tokens (palette "Jade + Rose"): jade `#1F7A70`, jade light `#2FA79A`, rose `#C25470`, pink `#E08CA2`, sand `#F2C48D`,
sage `#7FB8B0`, mist `#A6C0BD`; folder `#0F5A52→#14716A→#1F8A80`; sky `#EEF5F3/#E1EDEA/#F1E7EA/#F8EEF0`; ink `#1B1F3B`,
muted `#5A6190`; **text green `#0B4F48` and the title gradient within deep greens `#0B4F48→#0F5A52→#14716A`**
(owner 2026-10-13: "สีตัวอักษรอ่อนไป ขอเป็นเขียวเข้ม"); type Noto Sans Thai 600/700; the JW mark is one component
(`src/JwMark.tsx`) in the opening and the outro.

Motion personality: "professional trust" — the demos' own overshoots, no beat-pumping of the whole frame.

## 4. Feature → shot mapping (card · style → demo source)

| Shot | Card · style | Demo source |
|---|---|---|
| Opening | card-stack + blur-slide | demos/ui-entrance/card-stack/CardStack.tsx · demos/typography/blur-slide/BlurSlide.tsx |
| Flow breath ×6 | timeline-travel (travel curve, node light-up, milestone-card spring) + motion-framer principles (spring presets, stagger, layoutId-style dock morph) | demos/data/timeline-travel/TimelineTravel.tsx · github.com/freshtechbro/claudedesignskills motion-framer SKILL.md |
| ใบสั่งซื้อ | document pop + mark (the 50 ทวิ / receipt document grammar) | — |
| จ่ายผู้ขาย · 50 ทวิ | BC Direct WHT Info lead-in (worklist grammar) + draw-svg-trace | DrawSvgTrace.tsx |
| ใบกำกับภาษี | depth-layer-moves · multiplane → shot-transitions · mask-wipe → doc-park-left-pill-deal | MultiplaneReal.tsx · PortalWipeV2.tsx · DocParkLeftPillDeal.tsx |
| ใบวางบิล | Billing Board → Billing Worklist lead-in (one panel, worklist grammar) + row-embed | demos/ui-entrance/row-embed/RowEmbed.tsx |
| มาพร้อมฟังก์ชันอีกมากมาย | list-reveal (cards spring out of the month folder to a 4 × 3 wall, reversed on the way back) | — |
| ใบเสร็จรับเงิน | product-card-progressive-assemble | ProductCardProgressiveAssemble.tsx |
| Text file ภ.ง.ด.53 | document-typewriter-reveal | DocumentTypewriterReveal.tsx |
| ปิดงวด: VAT reports → ภ.พ.30 | bezier-source-converge-merge | BezierSourceConvergeMerge.tsx |
| Outro | draw-svg-trace (the mark's outline, `pathLength` dash) + a feathered linear mask wipe (the name) + a paper corner fold in `JwMark`; replaced ui-to-brand-morph · icon-flip-bloom (owner 2026-10-14) | DrawSvgTrace.tsx (trace) · own (wipe, fold) · IconFlipBloomLogo.tsx (old) |

Sample base URL: https://vincentwei1021.github.io/video-shotcraft/media/<style>.mp4

## 5. Timeline (master, 2790 f) — `src/timeline.ts` is the source of truth

Beat grid 115.0 BPM (t0 0.2163 s, T 0.52176 s; picture frame of beat n = round(30 · (t0 + 0.0423 + n·T))). Music edit
src 0–62.83 s (bar 30) + bar 46 (96.22 s) → end (score 0.991); the join is video beat 120 (f1886), the text file's
window opening (accepted in the 2026-10-13 story review); final hit = video beat 168 (f2637). Breath = 47 f; the flow's head
reaches the checkpoint 24 f in, on a bar downbeat with a kick: 16 / 28 / 48 / 76 / 96 / 116. Story re-time (story
review 2026-10-13): the hook lands one bar earlier, the PO shot is one bar shorter, the 50 ทวิ → text file run 8 beats earlier,
and the 8 beats go to the ภ.พ.30 tie-out and the feature wall.

| Shot | Frames | Pinned to (beat → frame) | On-screen |
|---|---|---|---|
| open | 0–234 | title on beat 4 (f70) | ครบทั้งเดือน ในระบบเดียว · [Microsoft Dynamics 365 Business Central] + [JW JWIC Thai Localization] · centre card = the six checkpoints with their dates · each document's label chip (30 px) in that document's own colour (owner 2026-10-13: header bar of JWIC's forms — PO #FFDAB8, tax invoice #A6DFD5, billing note #DAC7EC, receipt #AADBA9, deep same-hue text; ink of the RD forms — 50 ทวิ #3F4848, ภ.พ.30 #8C645C, white text) · the centre card fades into the first breath over 6 f |
| b1 | 234–281 | checkpoint ซื้อ on beat 16 (f258) | card ใบสั่งซื้อ · under each checkpoint its date as a 28 px muted line: 1 / 2 / 3 / 11 / 25 / 31 ธ.ค. (owner 2026-10-13; the docked list stays without dates) |
| po | 281–422 | totals marked beat 20 (f321) | สร้างใบสั่งซื้อ · PO26120001 · 1 ธ.ค. 2569 · Thai PO form (JW tag) · chip 10,700.00 under the totals block (owner: "ฝั่ง PO เน้นแค่มีเอกสารพอ") |
| b2 | 422–469 | beat 28 (f446) | จ่าย · card 50 ทวิ |
| wht | 469–735 | Direct WHT opens beat 33 (f524) · Generate beat 36 (f571) · trace closes beat 40 (f634) | pill จ่ายผู้ขาย · หัก ณ ที่จ่าย 3% · 300.00 over the Payment Journal (BC) → Direct WHT Info (JW) → 50 ทวิ (JW) · ออกหนังสือรับรอง การหักภาษี ณ ที่จ่าย · pill 50 ทวิ · หนังสือรับรองการหักภาษี ณ ที่จ่าย (gloss muted) · chip ภาษีที่หักนำส่ง 300.00 level with the traced total, left of the page |
| b3 | 735–782 | beat 48 (f759) | ขาย · card ใบกำกับภาษี |
| inv | 782–1173 | Print... beat 53 (f837) · pills 60 / 63 / 66 (f947 / 994 / 1041) | Posted Sales Invoice (BC, below its app bar) → Thai tax invoice (JW) · pills ใบกำกับภาษีเต็มรูป / ถูกต้องตามหลักเกณฑ์กรมสรรพากร (tied to the form's title) · เลขประจำตัวผู้เสียภาษี · สาขา / ดึงจากข้อมูลลูกค้า · ภาษีมูลค่าเพิ่ม 7% / ตรงกับยอดที่ Post · captions 46 px (owner 2026-10-13: full-form claim first, amount-in-words pill dropped; the TIN pill's tie is routed through blank paper — its row → the gutter → the gap above the item table → down the outer margin — so it crosses no text) |
| b4 | 1173–1220 | beat 76 (f1197) | วางบิล · card ใบวางบิล |
| bn | 1220–1486 | headline beat 78.5 (f1237) · callouts f1247 / 1257 / 1267 · click on the 11 Dec chip beat 82 (f1291), the worklist opens out of it (portal 16 f) · Create Billing Notes beat 84.5 (f1330) · last row beat 90 (f1417) | Billing Board December (JW) · headline chip วางแผนวางบิล (owner 2026-10-14, was รอวางบิล 37 ใบ) · callouts tied to their part: ยอดที่ต้องวางบิล (TO BILL · TO DELIVER · LATE) / วันหยุดจาก ธปท. (10 Dec holiday) / รอบวางบิลของลูกค้า (11 Dec chip, then clicked: the system opens the worklist from a board chip, owner 2026-10-14) → Billing Worklist (JW) → billing note (JW) · chip ยอดวางบิล 53,500.00 |
| b5 | 1486–1533 | beat 96 (f1510) | รับเงิน · card ใบเสร็จรับเงิน |
| rct | 1533–1799 | fields every 1¼ beats 98.5–104.75 (f1550 … 1647; amount pop beat 102.25, f1608) | receipt (JW) · chip 53,500.00 · โอนเงิน under the total |
| b6 | 1799–1846 | beat 116 (f1823) | ปิดงวด · card ภ.ง.ด.53 · ภ.พ.30 (anchored by its right edge, 145 px right of its stem) |
| txt | 1846–2043 | click 119 (f1870) · opens 120 (f1886) · lines 120.5 / 121.5 (f1894 / 1910) | PND Report (JW) → PND53_202612.txt · ส่งออกไฟล์ ภ.ง.ด.53 · พร้อมนำเข้า RD Prep (JW), aligned with the window's left edge · ภ.ง.ด.53 · จ่ายนิติบุคคล (muted) |
| pp30 | 2043–2387 | heading in with the lines (f2065) · merge ripple (f2126) · heading out as the folder opens (f2171) · reports land beat 140 (f2199) · rows 5 / 7 beat 143.5 / 144 (f2254 / 2262) · box 11 beat 144.5 (f2270) · exit f2366, folder closed and centred f2389 | ครบทั้งเดือน ในระบบเดียว as the converge's heading (bookend, owner 2026-10-13) → ปิดงวด · ธันวาคม 2569 · ภ.พ.30 พร้อมยื่น · ภ.พ.30 · แบบแสดงรายการภาษีมูลค่าเพิ่ม (muted) · รายงานภาษีขาย 3,500.00 · รายงานภาษีซื้อ 700.00 · chips ภาษีขาย / 3,500.00 · ภาษีซื้อ / 700.00 · ต้องชำระ / 2,800.00 (box 11, the form's own wording) · JW tag on the form's corner · tie-out complete ≈ f2282 and held to the exit, ≈ 2.8 s (rows 5 / 7 and their chips: ≥ 3 s) · label chips on each wire's start, the opening's words and colours: ใบสั่งซื้อ / 50 ทวิ / ใบกำกับภาษี / ใบวางบิล / ใบเสร็จรับเงิน / ไฟล์ ภ.ง.ด.53 (owner 2026-10-14; the converge sits 150 px further right to make room, the pan still ends with the folder centred) |
| more | 2387–2591 | fades in over the closed folder (f2387–2391) · cards burst beat 153 (f2403) · fly back beat 162.5 (f2551) | มาพร้อมฟังก์ชันอีกมากมาย (JW) · 12 cards, group + feature: ภาษีมูลค่าเพิ่ม ภ.พ.36 · สาขาภาษี · ภาษีไม่ถึงกำหนดชำระ · ใบแทนใบกำกับภาษี / ภาษีหัก ณ ที่จ่าย ภ.ง.ด.54 / สต็อกและทรัพย์สิน สต็อกการ์ด · ทะเบียนทรัพย์สิน · Cost Traceability / บัญชี งบการเงินไทย / API VAT Service · BOT อัตราแลกเปลี่ยน / เอกสารไทย TH / EN (owner grilling 2026-10-13; not in the hero) · the landed wall holds ~4.4 s |
| outro | 2591–2790 | folder drifts to the mark's place and fades (f2597–2627) · outline traced, closing on beat 168 (f2637) · fill on the hit · rose corner folds, upright on beat 169 (f2653) · name wiped in from the mark f2657–2689 (whole on beat 171) · lines after the stop, beat 172 (f2702) | JWIC Consulting · HONEST ADVICE, PRACTICAL SOLUTION · Thai Localization สำหรับ Business Central (45 px) · www.jwicconsulting.com (64 px, in with the tagline) |

SFX: every landing, chip, click and slide above has its pin in `src/sfx.ts` (the PO, Billing Board, receipt and the three
ภ.พ.30 chips share the soft pop `n/pop.wav`; `SFX_TARGETS` lists each sample's target frame).

Hero cut 4:5 (`src/Hero.tsx`, 1027 f ≈ 34.2 s, silent; no feature wall): same order; each segment mounts the master's
scene at a scene-local time and crops it in page space (`HeroMode` hides the scene's own titles and origin tags, skips
the 50 ทวิ journal and the outro's stage, stacks the opening pill under the band and narrows the fan); every segment is
opaque on the hero's own ground and its window's top 24 px feather into it, so dissolves never show the outgoing band;
breaths show the flow drawn vertically for 4:5 with the dates; the title band carries a compact mini flow (nodes + the
current step at 40 px); 6 f dissolves; the loop passes through the stage colour. Segments (f): open 90 · po 84 ·
wht 100 · inv 75 (the crop pans with the portal) · bn 80 · rct 80 · txt 80 · pp30 128 · outro 94 (from the outline
two-thirds drawn to the whole wordmark, no URL) · breaths 36. Total 1027 f ≈ 34.2 s since the Draw + Wipe outro (2026-10-14).

## 6. Documents and captures (TEST, December 2569 — capture/dec)

| Shot | Record | Source file |
|---|---|---|
| ใบสั่งซื้อ | PO26120001 · 01/12/2026 · V00002 บริษัท ทาร์กอน จำกัด · 10,000 + VAT 700 = 10,700 · posted as PPINV26120001 (vendor tax invoice TGN2612-0045) | report 56140 PDF |
| 50 ทวิ | WHT26120001 · PV26120001 · 02/12/2026 · ภ.ง.ด.53 · base 10,000 · tax 300 | report 56174 PDF |
| ใบกำกับภาษี | IV26120001 · 03/12/2026 · C00001 บริษัท ลูกค้าขาประจำ จำกัด · 50,000 + VAT 3,500 = 53,500 · ช่องทางชำระเงิน KBANK ธนาคารกสิกรไทย จำกัด (มหาชน) สาขาสีลม · JWIC Consulting · 123-4-56789-0, no QR | report 56130 PDF · Posted Sales Invoice page capture (Print... = Report Selection → 56130) |
| ใบวางบิล | SBN26120004 · 11/12/2026 · one invoice IV26120001 · 53,500 · same bank block, no QR | report 56100 PDF · Billing Worklist capture (pre-billing, the one row of IV26120001) |
| Billing Board | December 2026, mode Billing, all branches · TO BILL 37 Invoices ฿994,504.91 (SBN26120004 draws no chip: its invoice is paid, so only TO DELIVER counts it) | page 52115 capture `screens/billing-board.png` |
| ใบเสร็จรับเงิน | RCT26120005 · 25/12/2026 · โอนเงิน · IV26120001 → SBN26120004 · 53,500 | report 56110 PDF |
| Text file | PND53_202612.txt (header + 1 row = WHT26120001; dates in ค.ศ. as RD Prep expects) | page 52410 Download Text File |
| VAT reports | รายงานภาษีขาย (1 line, 50,000 / 3,500) · รายงานภาษีซื้อ (1 line, 10,000 / 700) | report PDFs, December 2569 |
| ภ.พ.30 | December 2569: box 1 = 50,000, 5 = 3,500, 6 = 10,000, 7 = 700, 8/11/15 = 2,800 | page PP30 download (template's screen-only Button1 removed before rasterising) |

Pre-existing December entries in TEST add no VAT or WHT lines (agent check). Unwatermarked rasters and captures are
gitignored (same rule as `img/originals/`).

Owner decisions 2026-10-13 (questions raised by the final review):
- The signature above "Jirapat Wichayapong" on the documents is a fake — fine to show.
- The TEST company TIN 0105560123454 on the documents is fine to show.
- *agent*: the TEST vendor's Tel / Mobile values (044395528, 0849133010 — valid formats, possibly real) are blanked on
  the purchase-order raster; nothing else on any document is retouched.
- QR codes off the documents, the full bank account on them (owner: "เอา QR ในเอกสารออก แต่ให้แสดงเลขที่บัญชีให้ครบ", "QR ไปปิด setup เอา"):
  in TEST the PromptPay ID is cleared on bank cards KBANK (was 0105500000000) and SCB (was 0812345678), so the reports
  print no QR; the KBANK card was completed (Name ธนาคารกสิกรไทย จำกัด (มหาชน) สาขาสีลม, was "KBANK" · Bank Branch No. 0001 ·
  Bank Account No. 123-4-56789-0 · Account Name JWIC Consulting); SCB's Account Name บริษัท ตัวอย่าง จำกัด → JWIC Consulting.
  Both documents stay on KBANK (owner): SBN26120004 is paid in full, so its Update Document is disabled and the planned
  switch to SCB would have left the two documents on different banks. Reprinted through Print preview → Download.
- The hosted video is an exception to the site's watermark rule: document frames in the film carry no watermark.
  The raw rasters/captures themselves stay gitignored and are never hosted.

## 7. Copy (jhthai)

Tax documents take `ออก`; other documents take `สร้าง`; `ใบเสร็จรับเงิน` in full; `ส่งออก` = export; no
spoken-register words; no ครับ/ค่ะ; form codes in Thai (ภ.พ.30, ภ.ง.ด.53); Thai written without spaces between words
(word-by-word reveals run without gaps).

## 8. Music and sound

- Edit (`analysis/edit.json`): source 0–62.83 s (bar 30) + bar 46 (96.22 s) to the end, 0.26 s equal-power crossfade,
  chosen by the best chroma/MFCC match (0.991) among 14–20-bar gaps (16 bars; owner 2026-10-13: ~90 s so viewers can
  follow each step); grid continuous across the join (video beat 120, f1886); the song's final hit is source beat 232 =
  video beat 168 (f2637); ring-out below −70 dB by 93 s (2790 f). The 70 s and 60 s edits are kept in `edit.json` as
  `previous`.
- BGM level 0.4 (≈ −8 dB), `bgm` inputProp; masters `out/jwic-month.mp4` and `out/jwic-month-nobgm.mp4`.
- Output audio offset 42.3 ms (AAC priming) compensated in `beatF` and the SFX table. Picture beats sit on average
  +0.66 f (≈ 22 ms) after the heard kick attack (analysis t0 ≈ 10 ms after the kick peaks) — inside tolerance, not refit.
- Renders: `--color-space=bt709 --image-format=png` (TV range, BT.709 tags, so the jade matches the page CSS). Every capture painted as a CSS background is preloaded as a hidden `<Img>` (`src/Preload.tsx`), or a tab can capture a scene's first frames before its PNG has loaded (2026-10-14: a blank Payment Journal for 5 frames).
- SFX table `src/sfx.ts`: peak lags re-measured (10 ms envelope max; attack for swells); quiet paper / keyboard samples
  are level-matched copies in `public/audio/sfx/n/`. Events: paper sheets/fan in the opening, a soft pop on each of the
  six checkpoint landings (sound-design 3.3), a paper slide as the PO form arrives, the same pop on the PO, Billing
  Board, receipt and the three ภ.พ.30 amount chips, marker pen on the trace, real clicks on BC actions, portal swell,
  keyboard on the writing window, merge hit, two paper slides (reports, ภ.พ.30), two soft swooshes as the feature cards
  burst out and fly back, the portal swell rising into the final hit (the outline closes), a quiet paper turn as the logo's corner folds, sparkle as the lockup settles (the deep impact went with the flip-bloom, owner 2026-10-14). No riser: the song's own ending
  carries the build (S7).

## 9. Deviations from the cards (recorded)

- Owner 2026-10-13 "ไม่ต้อง zoom เข้าไปในเอกสารเยอะ": no deep zooms into documents — every document is seen whole; the
  billing note is the whole sheet on the right (was a 1340 px panel crop); the text-file camera starts at 1.12 (demo
  1.32). Holds are never frozen (final review 2026-10-13: a still hold read as a stalled player): a push of ≤ 2 % runs
  to each document shot's end — PO, 50 ทวิ, receipt (its card breathe is 2 %, demo 3.5 %), the parked tax invoice (its
  ties follow) and the billing note; the tags ride their page's corner.
- Owner 2026-10-13 "ฝั่ง PO เน้นแค่มีเอกสารพอ": the PO shot is JWIC's printed form only — pop, totals marked on beat 20,
  chip (the crash-zoom-punch, first on the printed PO and then on BC's Purchase Order page, is dropped).
- Owner 2026-10-13 "มันควรมีหน้าจอ bc ซักหน่อย": the 50 ทวิ shot opens on BC's Payment Journal (standard BC, with a pill
  naming the payment) and then JWIC's Direct WHT Info dialog (WHT53 · 3 % · 300.00 marked, Generate and Print
  Certificate clicked on beat 36) instead of the scan-bracket sweep. BC screens appear in 4 of the 7 document shots —
  standard BC pages in two (Payment Journal, Posted Sales Invoice), JWIC's own BC pages in the billing note (Billing
  Board, Billing Worklist) and text-file (PND Report) shots.
- doc-park keeps the document fully visible when parked (card: ~35 % visible) — the marked evidence lines must stay
  readable; no auto-scroll on a single-page document (its "slow continuous drift" is the 2 % push). Captions stay after
  they darken instead of clearing before the next pill (final review: they lived ~7 f); pills 3 beats (47 f) apart (card
  ~38 f); the evidence lines dim to 45 % instead of clearing. After the multiplane drive the near layer recedes to 30 %
  (its half-out-of-frame pills read as fragments) and the lifted Print... carries its chip on its right (above, it hid
  the document number).
- multiplane drive 40 f (card 130 f) and portal + 30 f still + park in one 391 f shot.
- draw-svg-trace 38 f (card 40 f); the BC lead-in, the trace and a ≥ 3 s hold fit the 266 f shot. The closing flash
  eases rose → ink (it switched to black for two frames).
- row-embed: the whole sheet at reading size instead of a full-frame page or a 1340 px panel; the camera push is 2 %
  about the slots' centre with a 10 px drift down (card 1.12 → 1.25), running to the shot's end; 4 cues 10 → 9 → 8 f.
- Amount chips sit on blank paper under the total they read (PO, receipt); the 50 ทวิ has no blank paper under its total,
  so its chip sits level with the traced row on the stage left of the page (final review 2026-10-13: above, the chips hid
  the rows they sum).
- document-typewriter-reveal: header + 1 row (card 20 blocks), no history-stack tail; the document is a drawn
  editor window because the source is a plain text file.
- bezier-source-converge-merge: six sources (node 128 px), lines fade in right of the docked flow list; merge point is a
  folder that opens on the VAT reports, then ภ.พ.30; the tie lines end at the form's edge on rows 5 / 7, whose
  highlight carries them on to a two-line amount chip right of the form (an S-curve per row; box 11 lights half a beat
  later as the result); the purchase tie runs along its row into the corridor between the report and the form and then
  up, so it never crosses the report paper; the ties ride the documents' poses back into the folder; the opening's
  title returns as the converge's heading.
- timeline-travel: the camera does not travel — the progress line's head does (same curve), all six checkpoints stay
  in view, passed ones carry a ✓; between breaths the checkpoints spring (motion "stiff" 400/30, stagger 2 f) into a
  docked vertical list top-left and back. The unfold starts 6 f into the breath (once its ground is opaque) and the
  labels show only near either end of the morph (they crossed the outgoing title and piled up in flight); the card
  keeps the demo's 28 px secondary line as the checkpoint's date; the last card is anchored by its right edge.
  Checkpoint SFX = pop (sound-design 3.3), not the synth ui tones.
- No BC lead-in on the receipt and purchase order shots (time budget; the PO shot only says there is a Thai PO).
- Hand-offs: the opening's centre card fades over 6 f under the first breath (was a one-frame switch); the feature wall
  fades in over 4 f once ภ.พ.30's folder is back, closed and centred (it cut in its opaque stage over the exit).
- Origin tags clear the top safe margin (tops ≥ ~58 px): the documents sit at y 116 (the billing note at 132, its drift
  lifts it 18 px), the Direct WHT Info dialog at 0.9 of its capture, the ภ.พ.30 tag on the form's corner.
