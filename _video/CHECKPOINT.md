# CHECKPOINT — JWIC "ครบทั้งเดือน" video (2026-10-13, late)

Read this, then `DESIGN-SPEC.md` (revision 2 = this cut).
Skill: video-shotcraft, co-creation mode. Nothing is committed; the site repo (`D:\Web\promote-site`, branch main)
also has the owner's own uncommitted edits — do not touch those, do not commit unless asked.

## Owner decisions since the first checkpoint (2026-10-13)

- Text green deeper (`C.green #0B4F48`, title gradient within deep greens).
- Story order = purchase first: ใบสั่งซื้อ → จ่ายผู้ขาย + 50 ทวิ → ใบกำกับภาษี/ใบแจ้งหนี้ → ใบวางบิล →
  ใบเสร็จรับเงิน → ปิดงวด (text file, sales/purchase VAT reports, ภ.พ.30).
- VAT reports shown in the closing shot, tied to ภ.พ.30 boxes 5 / 7.
- Fresh December 2569 data in TEST (writes approved for those demo transactions only). Calendar days
  1 สั่งซื้อ · 2 จ่ายผู้ขาย · 3 ขาย · 11 วางบิล · 25 รับเงิน · 31 ปิดงวด. 50 ทวิ / text file = ภ.ง.ด.53
  (vendor V00002 บริษัท ทาร์กอน จำกัด, VAT-registered company). Sales invoice IV26120001 was posted 03/12 before
  the order change, so the purchase dates moved earlier instead of cancelling it.
- Length ~70 s (new music edit: src 0–44.04 s + bar 48 at 100.39 s → end, score 0.997; final hit = beat 124,
  f1949; TOTAL 2110 f).

## Later owner decisions (2026-10-13 evening)

- No colour tint over the documents (plain white paper in the opening fan and the converge thumbnails).
- No calendar ("คนคิดตามไม่ทัน"): the breaths are a process flow with checkpoints ซื้อ › จ่าย › ขาย › วางบิล ›
  รับเงิน › ปิดงวด (`src/Flow.tsx`, card timeline-travel + motion-framer principles: stiff springs, stagger,
  layoutId-style dock morph to a mini list top-left). Checkpoint SFX = level-matched pop (`sfx/n/pop.wav`).
  `src/Calendar.tsx` deleted. Opening stack starts at DS = 8 (title clock D = 28 unchanged).
- More BC on screen ("มันควรมีหน้าจอ bc ซักหน่อย"): PO crash zoom on BC's Purchase Order page (screens/po-page.png),
  50 ทวิ opens on BC's Direct WHT Info dialog (screens/direct-wht-info.png, click on beat 32). Unused captures left:
  payment-journal.png, pp30-form.png, posted-sales-invoice-clean.png.
- No deep zoom into documents: PO = whole BC page + totals lift; billing note = whole sheet; text-file camera 1.12.
- Make JWIC Localization explicit: `src/Tag.tsx` grey BC / green JW tags in every shot, split opening pill, JW mark
  on flow cards, outro line "Thai Localization สำหรับ Business Central".
- Owner leaves design judgement to the agent ("ผมวางใจคุณ … ไม่มีความรู้ด้าน design").

## Outro "Draw + Wipe" (2026-10-14, owner review of the shipped cut) — done, renders delivered

- Owner asked for a softer ending, still on the music, and a corner fold that clearly reads as a pink fold-in; after two
  preview rounds (logo hand-over: dissolve / morph / focus / light / draw; wordmark: rise / words / track / wipe / focus)
  the owner picked "Draw + Wipe". `src/scenes/Outro.tsx` now holds only that (timeline in its header): the folder drifts
  to the mark's place and fades, the mark's outline is traced and closes on the final hit (beat 168), the square fills,
  the rose corner folds down (upright on beat 169), the name is uncovered out of the mark (whole on beat 171), lines
  after the stop. `src/JwMark.tsx` `corner` is a real fold (0 plain → 1 the logo; at 1 it draws the static logo).
  SFX: soft swell into the hit (the impact whoosh is gone), paper turn on the fold, sparkle 0.4.
- Hero outro segment: src 40 / dur 94 (was 62 / 72) so the outline is seen closing; hero now 1027 f.
- `src/Preload.tsx` (mounted in Main + Hero): the first master render showed the Payment Journal as a blank panel for
  f475–479 — CSS-background captures were not waited for. Every `docs/` + `screens/` PNG is now a hidden `<Img>`.
- Renders (BT.709 / png, hero muted): `out/jwic-month.mp4`, `out/jwic-month-nobgm.mp4`, `out/jwic-month-hero.mp4`; the
  shipped flip-bloom renders are kept in `out/v1-flip/`. Previews and the parked variant code (`*.tsx.bak`) in
  `out/outro-variants/`. `out/web/hero-*` were not regenerated (the 4:5 cut is not on the site).
- Site: `video/month.mp4` re-encoded from the new master the DESIGN.md way (CRF 26, BT.709 tags, faststart); not committed.
- Same day, owner review round 2: (1) the ภ.พ.30 converge got label chips on each wire's start (PP30.tsx, converge
  shifted 150 px right, clear of the docked mini flow); (2) the Billing Board's chip says วางแผนวางบิล (was รอวางบิล 37 ใบ),
  three callouts tie a label to the summary row / a holiday / the 11 Dec customer chip, then that chip is clicked and
  the worklist opens out of it (BN_BOARD_CLICK_BEAT 82; Create Billing Notes 83 → 84.5; last row 89 → 90). Open:
  the clicked chip is บริษัท เอเชียเทรดดิ้ง (C00012) but the worklist capture is filtered to C00001 — the board was
  captured after SBN26120004, so C00001 has no chip on it any more. Owner: ship as is (no more edits), commit 95aa4e3
  pushed `video/month.mp4` to JHSite main. The owner had begun to say the holiday callout should go ("เช่น ลากอิสระ")
  and then withdrew it — if the board is touched again, replace วันหยุดจาก ธปท. with a drag-to-reschedule callout.

## State

- `src/timeline.ts`: 6 breaths, landings 16/28/40/60/76/88 (all bar downbeats with a kick), BREATH_LAND 24
  (page flat on the beat — review A3), pp30 from beat 100, outro = final hit − 46. Output offset 42.3 ms.
- New scene `src/scenes/PurchaseOrder.tsx` (crash-zoom-punch rebound, hit on beat 20), data `src/data/po.ts`
  (real PO26120001 measured). WHT re-timed (4 passes, trace closes beat 36, real WHT26120001 measured).
- TaxInvoice: 30 f still after the portal, pills 35 f apart, captions stay, Thai words joined, doc parked at x 330.
- BillingNote: wide panel (rows readable), title on top, cues 10→9→8 f. Receipt / TextFile re-pinned.
- PP30: CONV 168 (demo value), six sources incl. PO, line mask right of the calendar, VAT reports + connectors,
  holds ≥ 1.5 s. Placeholder report rasters until capture/dec arrives.
- Opening: story-order cards, unclipped two-line labels, mirrored z-order, JwMark (no serif "JW"), ring fades
  before the hand-off, month cover "ธ.ค." on the calendar card.
- SFX: re-measured peak lags, level-matched paper/keyboard copies in `public/audio/sfx/n/`.
- Hero rebuilt natively (`src/Hero.tsx`, scenes mounted at local time with `HeroMode` hiding their titles,
  breaths from the breath layer only, 6 f dissolves, loop through the stage colour). ≈985 f.
- Final review of the September cut: done (findings handled above; data/identity items wait for capture/dec).

## Latest (2026-10-13 night) — read this first, the "State" list above predates the ~93 s cut

- ~93 s master (2790 f), hero 1005 f; `src/timeline.ts` is the source of truth (DESIGN-SPEC §5 table is current).
- Feature wall `src/scenes/More.tsx` (2450–2591, not in the hero): 12 cards chosen in a grilling session —
  ภาษีมูลค่าเพิ่ม ภ.พ.36 · สาขาภาษี · ภาษีไม่ถึงกำหนดชำระ · ใบแทนใบกำกับภาษี / ภาษีหัก ณ ที่จ่าย ภ.ง.ด.54 /
  สต็อกและทรัพย์สิน สต็อกการ์ด · ทะเบียนทรัพย์สิน · Cost Traceability / บัญชี งบการเงินไทย / API VAT Service ·
  BOT อัตราแลกเปลี่ยน / เอกสารไทย TH / EN. Owner rejected พิมพ์เช็ค; English names kept where the system uses them.
- Billing shot opens on the Billing Board (December, TO BILL ringed beat 86.5 + chip รอวางบิล 37 ใบ · ฿994,504.91),
  then the worklist (click beat 91), last row beat 97. Beats shared in timeline.ts (BN_HL_BEAT / BN_CLICK_BEAT).
- No QR on the tax invoice / billing note: PromptPay ID cleared on the TEST bank cards, KBANK card completed, both
  documents reprinted (DESIGN-SPEC §6 lists old values). Owner: TEST may be edited freely ("แก้ได้เต็มที่").

## Review round 3 (2026-10-14) — four reviewers + owner grilling, then fixed

- Reviews: aesthetics / correctness / story + an outside-ideas search (FlowAccount, PEAK, Netflix Thai reading speed,
  hero-video practice). Owner decided every content item; design items were the agent's.
- Re-timed (total still 2790 f, final hit beat 168): title on beat 4; PO shortened (totals beat 20, b2 beat 28); WHT…TXT
  −8 beats; PP30 from beat 130, tie-out ≥ ~3 s; feature wall from beat 152 (cards out 153, back 162.5). DESIGN-SPEC §5.
- Copy: ภ.พ.30 chips carry amounts + "ต้องชำระ 2,800.00" on box 11; opening title returns over the converge (bookend);
  Thai pill on the Payment Journal; form-code glosses (text file / ภ.พ.30); checkpoint dates under the flow;
  "Microsoft Dynamics 365 Business Central" in the opening pill; tags read "JWIC Thai Localization"; Billing Board chip
  "รอวางบิล 37 ใบ"; "มาพร้อมฟังก์ชันอีกมากมาย"; PO chip a plain number; bigger URL / captions; hero without URL.
- Data in TEST (owner: "แก้ได้เต็มที่"; old values in DESIGN-SPEC §6):
  - company TIN 0105560123454 belonged to a real company (RD lookup) → 0105569902138;
  - vendor V00002 TIN failed the check digit → 0105562345675 (posted snapshots patched by SQL with the owner's permission);
  - Ship-to Name + statutory address + PP signer, payment terms N30 "เครดิต 30 วัน";
  - Game-of-Thrones customer names → ภูผาแอร์เซอร์วิส / ธาราคูลลิ่ง / นภาคูลแอร์;
  - vendor address/contact/phones fixed; PO26120001 recreated (kept, unposted).
- JHCore bug fixed and published: JHSalesVATReport.rdlc buyer column "ชื่อผู้ซื้อสินค้า/ผู้รับบริการ" (uncommitted).
- ภ.พ.30 raster now baked like Adobe: `tools/pp30bake/bake-render.mjs <in.pdf> <out.png> --font C:/Windows/Fonts/micross.ttf` (npm install in tools/pp30bake first).

## 60 fps for YouTube (2026-10-14, owner: "แก้ตัวแรก เป็น 60 fps ก่อน")

The trailer renders at **60 fps**; the demo film (`JwicDemoBilling`) is untouched at 30.

The cut was NOT re-timed. Every frame number in the scenes, in `SHOTS`, in `sfx.ts` and in Hero's segment
table is still an **author frame** on the 30 fps grid the film was cut, mixed and back-tested on — doubling
~300 hand-measured literals (BREATH_DUR, FLIP_MID, the SFX peak lags) would have risked the approved timing
for nothing. Instead `src/rate.ts` holds the two units and the conversion happens at the boundary only:

- `rf(authorFrames)` → render frames: used on every `Sequence from`/`durationInFrames` in `Main.tsx` and
  `Hero.tsx`, on the `Composition` durations in `Root.tsx`, and on the BGM fade-in and SFX `trimBefore`.
- `useAuthorFrame()` replaces `useCurrentFrame()` inside components: it divides by the rate it reads off the
  composition, so it returns a FRACTIONAL author frame (… 10.0, 10.5, 11.0 …). `interpolate` / `spring` then
  yield a new value on every render frame — that is where the smoothness comes from — while every literal
  around them keeps meaning the same instant. Because the rate comes from `useVideoConfig`, the shared
  `fx/*` components stay correct inside the 30 fps demo film (rate 1).
- Every `spring()` already passed `fps: 30` explicitly, so the springs needed no change at all.
- `fx/Motion.tsx` `useT` keeps raw frames: it is `frame / (durationInFrames − 1)`, fps-invariant by construction.
- `sfx.ts` and the audio offset are unchanged. The 42.3 ms lag is AAC encoder priming (2032 samples), a time,
  not a frame count, and SFX stay pinned to the author grid — the mix is the one that was back-tested.

Verified before the full render (`out/qa/r60/`): stills at author frames 60 / 300 / 1500 / 2520 against the
shipped 30 fps master measure PSNR 45.3 / 44.5 / 42.7 / 40.4 dB — h264 noise only, so the picture lands at the
same instant; render frames 4806 / 4807 / 4808 (the feature-card burst) all differ, so the in-betweens are
really drawn and not duplicated frames.

Delivered (GPU render, ANGLE/D3D11, ~7 min each on the RTX 3080):
`out/jwic-month-60.mp4` (5580 f · 93.056 s · 30.8 MB, +19 % over the 30 fps master) and
`out/jwic-month-60-nobgm.mp4`. The 30 fps masters and the website's `video/month.mp4` are untouched.
Back-test of the 60 fps pair (`tools/backtest2.py`, feed it WAVs — librosa cannot open the mp4 here;
`PYTHONIOENCODING=utf-8` or its ± sign dies on the cp874 console): output offset 43.00 ms (was 42.3),
beat landings within ±0.45 f, SFX attacks within +1.3 f — the same mix, in the same place.
Audio integrated loudness is unchanged at −20.6 LUFS; only the sample peak moved (−2.3 → −1.1 dBFS, one
transient, no clipping), which the YouTube normalise pass flattens anyway.

`JwicMonthHero` is at 60 fps too (it mounts the master's scene components, so it cannot run at another rate).
The hero clip on the site was not re-rendered; if it is, a 60 → 30 downsample for the web is exact.

## Date chip on the flow breaths (2026-10-14, owner review of the 60 fps cut) — done, shipped

- Owner on the breath frame: "ส่วนนี้มันโล่งไป อ่านไม่ทัน เอาข้อความวันที่ใส่รูปเป็น chip โชว์มันตรงกลาง" — the 28 px date under
  each checkpoint read as a footnote and the upper half of the frame was empty. `DateChip` in `src/Flow.tsx`
  (rendered by `FlowLayer`, not by the hero's vertical `FlowBig`): a calendar tile centred at 960 / 250, 232 px wide,
  a 62 px band reading ธันวาคม over a 104 px day number (`C.green`).
- The band is the palette's rose (`C.c3` → `C.c4`), not jade — owner: "พื้นหลังธันวาคมเป็นสีแดงสิ ไม่ใช่เขียว".
- Timing: it springs at breath frame 9 — 15 f before the milestone card, so the date is up for most of the travel —
  and fades with the card on the dock (`1 - D[k]`). Frame 9, not earlier: the breath ground is opaque only from
  frame 7 (`Main.tsx`), and at frame 4 the tile crossed the outgoing shot's title.
- Nothing else moved: `STEPS`, the small date line under each node, the milestone card, the stem, SHOTS and sfx.ts
  are untouched, so the cut and the mix are the ones that were back-tested.
- Renders (BT.709 / png, 60 fps): `out/jwic-month-60.mp4` (5580 f · 93.0 s · 31 MB) and `out/jwic-month-60-nobgm.mp4`;
  the pre-chip master is kept at `out/jwic-month-60.prev.mp4`. Site: `video/month.mp4` re-encoded from the 60 fps
  master (the site file is 60 fps from now on, was 30).

## Next

Delivered 2026-10-13 night (feature wall + Billing Board + no-QR documents), BT.709: `out/jwic-month.mp4`,
`out/jwic-month-nobgm.mp4`, `out/jwic-month-hero.mp4` (1005 f), web `out/web/hero-1080.mp4` (2.5 MB), `hero-720.mp4`
(1.2 MB), `hero-poster.webp`. Back-test: offset 42.33 ms, beats ±0.43 f, SFX attacks within +1.3 f, mix peak −1.5 dB.
Waiting for owner feedback.
Open items the owner may raise: TEST master data shown small on screen (PO ship-to name "ทดสอบซ่ำซอง", vendor address
district/province mismatch, vendor TIN check digit) — left as is; TEST may now be edited freely, so they can be fixed and reprinted if the owner wants.

The skill itself runs only on command: `disable-model-invocation: true` added to `D:/video-shotcraft/SKILL.md` (owner 2026-10-13) — re-add after a pull.

Workbench on this Windows box (no symlink privilege): `D:/video-shotcraft/workbench/proj` and `public\*` are
junctions/hard links made by hand; `workbench\demosrc` (a git symlink checked out as a text file) was replaced by a
junction; `scripts/gen-index.mjs` patched to emit "/" in import specifiers. Start with
`NODE_OPTIONS=--import=file:///<scratchpad>/tools/win-links.mjs node scripts/open.mjs` (preload copy kept at
`_video/tools/win-links.mjs`) from the workbench folder
(the preload turns symlinkSync into junctions / hard links) → http://localhost:5198/?import=project.

## Commands

- Type-check: `npx tsc --noEmit -p .`
- Still: `npx remotion still src/index.ts JwicMonth out/qa/<name>.png --frame=<N> --log=error`
- Scene local frame 0 = nominal start − 8 (TAIL) except the opening.
