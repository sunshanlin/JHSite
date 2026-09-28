# Screen to Seal — design philosophy for the hero visual (concept 2: BC → Thai tax invoice)

Written 28 Sep 2026 with the canvas-design process, after the document-pile concept (`2026-09-hero-doc-philosophy.md`) was set aside and the user picked concept 2 of three new sketches.
The comps rendered from it are the spec; `DESIGN.md` stays the rulebook.

## The movement

**Two materials, one truth.** The frame holds two kinds of surface and never lets them blur: light and paper. The screen is cool and flat, ruled in hairlines, its corners exact and its type neutral — working software at nine in the morning. The paper is warm white, has weight and shadow, and takes ink. They overlap, but they are never the same thing, and the space between them is where the work happens.

**The hinge.** Between screen and paper sits one small, decisive joint: a label no larger than a button, placed exactly on the seam. It is the only element that belongs to both surfaces, and everything in the composition leans toward it. The transformation is never drawn as magic — no sparkles, no sweeping arrows — but as a precise connection, the way a cabinetmaker shows a well-cut joint.

**Numbers as the bridge.** The same figures appear on both surfaces, identical to the satang and set in the same tabular sans, so the eye can travel from one to the other and find that nothing was lost. The labels change language and the layout becomes a legal form; the document number, the branch, the tax ID and every amount stay exactly as they were. What changes is the demonstration. What stays the same is the promise kept.

**Color and ground.** Flat planes of deep teal, jade and sage, with a corner of pink and burgundy, form the architecture underneath; they meet the frame and each other and never float. The screen borrows only the neutral greys and the near-black bar of the interface it quotes. The paper is white, and it carries exactly one warm mark: a stamp in burgundy ink, pressed by hand and slightly off square.

**Hierarchy and scale.** The paper leads, because it is the outcome; the screen sits behind and above it, because it is the source. Type is small and exact, and a single title in a loopless Thai face is the largest line on the paper. Dense detail lives inside the two surfaces; outside them there is only quiet color.

**Craft.** The work must look meticulously crafted, the product of deep expertise and painstaking attention: hairlines on the pixel, figures reconciled, every label spelled the way Business Central and the Revenue Department actually spell it, every margin tuned until the composition holds still. The viewer should not see the care. They should simply believe both surfaces.

## The subtle reference

Everything on the paper is traceable to a field on the screen: `IV26090001` is the same number on both, `Branch Code 00001` becomes *สาขา 00001*, `VAT Registration No.` becomes *เลขประจำตัวผู้เสียภาษี*, and the paper adds what only a Thai form carries — *ต้นฉบับ/Original*, VAT on its own line, and the total in Thai words. The layout follows the real form the package prints (`img/sales-invoice.webp`), including its Christian-era date, so the mock never claims a feature the product doesn't have.

The parties are fictional: the buyer is the `#vat-service` demo company (สมชายค้าวัสดุก่อสร้าง, 0105558000123) and the seller's ID is made up; both 13-digit IDs fail the check digit.

## Palette and type (from `DESIGN.md`)

| Role | Value |
|---|---|
| Planes | Jade `#417771` · Sage `#739B97` · Deep Teal `#012F2A` · Burgundy `#A63A56` · Editorial Pink `#E08CA2`, on Paper Ivory `#EFEFE9` |
| Screen | white page, near-black app bar `#1F1F1F`, Fluent greys `#242424` / `#616161` / `#E0E0E0` — quoted from the BC web client, used nowhere else |
| Paper | `#fff`, form rules in Deep Teal, header row tint `#DCEBE8` |
| Seal | Burgundy Seal `#A63A56`, the one warm mark |
| Type | Anuphan (Thai) · Plus Jakarta Sans (Latin, tabular figures) — the self-hosted files in `css/fonts/` |
