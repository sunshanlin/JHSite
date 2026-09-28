# Stamped Ledger — design philosophy for the hero document scene

Written 28 Sep 2026 with the canvas-design process, before redrawing `.hero-doc` (direction B, "real paper").
The comps rendered from it are the spec; `DESIGN.md` → *Hero Document Scene* stays the rulebook.

## The movement

**Space and form.** Flat planes of color are architecture, never decoration. They meet the frame, meet each other, and never float alone. Paper is the only thing allowed to hover above them. Sheets overlap in a controlled cascade, each turned a few degrees inside a narrow band, the way a careful clerk squares a stack by hand, so the pile reads as order that a person touched rather than order that was generated. The drama lives at the edge of a plane: paper crosses it, half on the quiet ground and half on the saturated one.

**Color and material.** The palette is a ledger's: deep institutional teal, jade and sage as its daylight, warm ivory for the desk, near-white stock for the paper. One saturated ink is allowed, and only once — the wine red of a seal pressed by hand. Rules are hairlines of teal. Shadows are soft and long because they do representational work: this is paper lying on a surface, not a card on a screen.

**Scale and rhythm.** Meaning accumulates in small marks: tabular figures on a strict baseline, ruled rows, document numbers, a date, a thirteen-digit identifier. They are dense, orderly and patient, set against large planes that say nothing at all. The eye goes from the big quiet shapes to the one loud mark, then settles into the fine print and is rewarded for staying, because every line is plausible and every number adds up.

**Composition and hierarchy.** One sheet leads. The others orbit it and stay partly hidden, and that partial view is what makes the leader feel real. Hierarchy comes from size and weight, never from color: the title is the largest line, the total the heaviest, the seal the only warm event. Each satellite sheet carries one colored edge on the side that shows, like a file tab — a quiet system of signals that sorts the stack at a glance.

**Text.** Text is texture first and language second. Headings are set in a loopless Thai face with tight tracking, figures in a geometric sans that is always tabular, labels at a whisper. Nothing is placeholder and nothing is ornament: each word is one a practitioner would expect on that exact sheet.

**Craft.** The work must look meticulously crafted, the product of deep expertise and painstaking attention: every hairline sits on the pixel grid, every rotation is chosen rather than random, every figure reconciles, every margin has been adjusted until nothing can move without loss. Master-level execution here is quiet. The viewer should not notice the care, only feel that the page can be trusted.

## The subtle reference

The lead sheet carries the details that only a Thai accountant checks: the seller marked *สำนักงานใหญ่* and the buyer's *สาขาที่ 00001* (the branch code on a tax invoice), a 13-digit tax ID, *ต้นฉบับ*, a Buddhist-era date, and the total written out in Thai words. Everyone else sees a well-made invoice; someone who files ภ.พ.30 sees that whoever drew it knows the rules.

The sample parties are fictional. The buyer is the same company as the `#vat-service` demo (สมชายค้าวัสดุก่อสร้าง, 0105558000123), and both 13-digit IDs fail the check digit, so neither can belong to a real taxpayer.

## Palette and type (from `DESIGN.md`, nothing new)

| Role | Value |
|---|---|
| Desk (hero ground) | Paper Ivory `#EFEFE9` |
| Planes | Jade `#417771` · Sage `#739B97` · Deep Teal `#012F2A` · Burgundy `#A63A56` · Editorial Pink `#E08CA2` |
| Paper | `#fff`, hairlines `#E2E8E6` |
| Ink | Ink Green-Black `#10241F`, Slate Sage `#516661` for labels |
| Seal | Burgundy Seal `#A63A56` — the one warm mark on the paper |
| Type | Anuphan (Thai headings, labels) · Plus Jakarta Sans (figures, tabular) · Niramit (body) — the self-hosted files in `css/fonts/` |
