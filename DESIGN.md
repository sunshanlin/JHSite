---
name: JWIC Consulting
description: Business Central + Thai Localization landing page — a Microsoft product surface rendered as a Thai consulting practice
colors:
  brand-deep: "#012F2A"
  brand-teal: "#014A41"
  brand-ocean: "#1A5B54"
  brand-jade: "#417771"
  brand-mint: "#739B97"
  brand-mist: "#A6C0BD"
  brand-pale: "#D9E4E3"
  brand-burgundy: "#A63A56"
  brand-burgundy-dark: "#7D2440"
  brand-pink: "#E08CA2"
  brand-pink-deep: "#C25470"
  brand-ivory: "#fbf8f1"
  brand-ivory-deep: "#f6f1e5"
  hero-canvas: "#EFEFE9"
  ui-page: "#f6f8f7"
  ui-ink: "#10241F"
  ui-muted: "#5C736E"
  ui-line: "#E2E8E6"
  ms-navy: "#153A73"
  ms-blue: "#0078D4"
  ms-green: "#498205"
  ms-teal: "#008272"
  ms-cyan: "#0078A8"
  ms-gold: "#9A6700"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, Anuphan, Segoe UI, sans-serif"
    fontSize: "clamp(2.2rem, 3.4vw, 2.75rem)"
    fontWeight: 500
    lineHeight: 1.22
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Plus Jakarta Sans, Anuphan, Segoe UI, sans-serif"
    fontSize: "clamp(1.9rem, 2.6vw, 2.5rem)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Plus Jakarta Sans, Anuphan, Segoe UI, sans-serif"
    fontSize: "1.08rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Plus Jakarta Sans, Niramit, Anuphan, Segoe UI, Leelawadee UI, Tahoma, sans-serif"
    fontSize: "18px"
    fontWeight: 500
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Plus Jakarta Sans, Anuphan, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  btn: "3px"
  card: "8px"
  pill: "999px"
  circle: "50%"
spacing:
  gutter: "28px"
  card-pad: "28px"
  grid-gap: "22px"
  section-y: "72px"
  container: "1180px"
components:
  button-primary:
    backgroundColor: "{colors.brand-burgundy}"
    textColor: "#ffffff"
    rounded: "{rounded.btn}"
    padding: "10px 22px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.brand-burgundy-dark}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ui-ink}"
    rounded: "{rounded.btn}"
    padding: "10px 22px"
    height: "44px"
  card:
    backgroundColor: "#ffffff"
    textColor: "{colors.ui-ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-pad}"
  nav-cta:
    backgroundColor: "{colors.brand-burgundy}"
    textColor: "#ffffff"
    rounded: "{rounded.btn}"
  lang-toggle-on:
    backgroundColor: "{colors.brand-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.btn}"
  kicker:
    textColor: "{colors.ui-muted}"
    typography: "{typography.label}"
---

# Design System: JWIC Consulting

## Overview

**Creative North Star: "The Fluent Ledger"**

This is a Business Central screen that grew up and became a website. The visitor is an accountant or a finance lead who spends their working day inside Microsoft's ERP, and the page borrows that room's manners on purpose: square corners, hairline separators, a single saturated action color, and headings set at weight 500 rather than the heavy 700 that marketing pages default to. When someone who already runs BC lands here, the surface should feel like the same building — not like a startup selling to them.

The restraint is a credibility argument, not a stylistic preference. The practice sells one thing above all — a Thai localization package that already exists and already works — and the design's job is to make that claim look inspectable rather than promoted. Flat surfaces read as fact. Gradients, glows, and lifted cards read as sales. Everywhere the page has a choice, it takes the version that looks like documentation.

Warmth comes from two places only. The ivory paper tones (`#EFEFE9`, `#fbf8f1`) that carry the hero and every alternate section give the page the color of real accounting stock instead of the blue-white of a dashboard. And burgundy — a color no ERP vendor uses — is spent exclusively on the things a visitor is meant to touch. The deep teal family does the institutional work; burgundy does the asking.

**Key Characteristics:**
- Square-cornered and flat: 3px buttons, 8px cards, hairline shadows
- Ivory paper ground rather than blue-white dashboard ground
- One action color (burgundy) against one institutional family (deep teal)
- Headings at weight 500, tight tracking (-0.025em) — Fluent, not marketing
- Thai body copy set at 18px/500 for sustained reading, never smaller
- Microsoft's own brand hues appear only where Microsoft's own framework is being cited

## Colors

A deep-teal institutional family carried on warm ivory paper, interrupted by a single burgundy that belongs to actions alone.

### Primary
- **Burgundy Seal** (`#A63A56`): the only color a visitor is invited to press. Every `.cta`, the nav's contact button, the `#services` kicker, the hero's accented phrase, the text-selection highlight, and the focus outline. It appears nowhere decorative.
- **Deep Burgundy** (`#7D2440`): the pressed and hovered state of the above. Never a resting fill.

### Secondary
- **Deep Teal** (`#012F2A`): the institution. Section grounds for `#contact` and `#faq`, the language-toggle active state, the hero's quarter-round block, and the darkest stop of every teal gradient. This is the color of the practice itself.
- **Signing Teal** (`#014A41`): one step up from Deep Teal, used for the `#services` heading and for hover states on dark surfaces.
- **Jade** (`#417771`): the mid-tone workhorse — the `#why-us` comparison-table group icons and their `01`–`05` counters, hero proof-list bullets, the fourth Success-by-Design phase.
- **Sage** (`#739B97`) and **Mist** (`#A6C0BD`): the pale end of the teal ramp. Sage closes the progress gradient and fills the fifth phase; Mist carries kickers on dark grounds.

### Tertiary
- **Editorial Pink** (`#E08CA2`) and **Deep Rose** (`#C25470`): burgundy's quieter relatives. Section kickers, the hero tagline, the contact arrow, the `.tip` left rule. They signal "this is an aside" without spending an action color.
- **Microsoft Stage Hues** (`#0078D4` blue, `#498205` green, `#008272` teal, `#0078A8` cyan, `#9A6700` gold): the five Success by Design phase labels in `#services`, and nothing else. They are a quotation from Microsoft, so they are used at Microsoft's values.

### Neutral
- **Paper Ivory** (`#EFEFE9`): the hero ground.
- **Warm Ivory** (`#fbf8f1` → `#f6f1e5`): every `section.alt`, as a soft vertical gradient. This is what stops the page from reading as a dashboard.
- **Cool Page** (`#f6f8f7`): the default `body` ground under the non-alt sections.
- **Ink Green-Black** (`#10241F`): all headings and body text. Not pure black — a green-cast near-black that sits inside the teal family.
- **Slate Sage** (`#5C736E`): kickers, hero lead, secondary description text.
- **Hairline** (`#E2E8E6`) and **Pale Edge** (`#D9E4E3`): the only two border values. Cards, inputs, nav underline, icon frames.

### Named Rules

**The Burgundy Toll Rule.** Burgundy is the price of asking for something. If an element does not want a click, it does not get burgundy — not as a border, not as an icon tint, not as a hover. The nav has exactly one burgundy item; the hero has exactly one; a section has at most one.

**The Quotation Rule.** The `--ms-*` hues are Microsoft's, borrowed to label Microsoft's own five-phase framework. They never leak into JWIC's own UI. If a new element needs a color and reaches for `--ms-blue`, it has misunderstood what that token is for.

**The Paper Rule.** Every surface is ivory, cool page, or white. Never a colored tint of the accent, never a blue-grey. The page is printed matter, not a screen.

## Typography

**Display Font:** Plus Jakarta Sans (Latin) with **Anuphan** (Thai, loopless) — all headings, kickers, buttons, numerals
**Body Font:** Plus Jakarta Sans (Latin) with **Niramit** (Thai, looped) — all running copy
**Fallbacks:** Segoe UI, Leelawadee UI, Tahoma

**Character:** The pairing runs a deliberate Thai contrast that has no Latin equivalent: headings are loopless (Anuphan, ไม่มีหัว) and body is looped (Niramit, มีหัว). To a Thai reader this separates voice from statement as clearly as a serif/sans pairing does in English, and it happens without changing weight or size. The Latin faces stay in one family across both roles so the bilingual page does not fracture when the visitor flips to English.

### Hierarchy
- **Display** (500, `clamp(2.2rem, 3.4vw, 2.75rem)`, 1.22, -0.025em): the single `h1` in the hero.
- **Headline** (500, `clamp(1.9rem, 2.6vw, 2.5rem)`, 1.2, -0.025em): every section `h2`. Four sections (`#services`, `#features`, `#reports`, `#pricing`) center their heading block at `max-width: 720px`; the rest are left-aligned.
- **Title** (500, 1.08rem, -0.025em): card and feature-panel `h3`. The `#why-us` comparison table is the one exception: group bands run 700/0.95rem in Signing Teal, row labels 600 in Ink, because both must hold their own against the dark Business Central column beside them.
- **Body** (500, 18px, 1.7): all running copy, Thai and English. Descriptions inside cards drop to 0.95rem but keep weight 500.
- **Label** (600, 12px, 0.08em): `.section-kicker` above every `h2`, in Slate Sage on light grounds, Mist or Editorial Pink on dark.

### Named Rules

**The Thai Weight Floor Rule.** Thai body text never goes below 18px/500. Thai glyphs at weight 400 read thin and tiring at the sizes Latin tolerates; the whole page was raised to 18/500 for this reason. A redesign that "cleans up" the type by dropping to 16px/400 has made the page worse for its actual readers.

**The Loop Contrast Rule.** Headings are loopless (Anuphan), body is looped (Niramit). Never set a Thai heading in Niramit or Thai body copy in Anuphan — the hierarchy is carried by loop, not by size.

**The No-Break Rule.** Thai has no inter-word spaces, so browsers break compound words mid-term (`ครบ|วงจร`). Wrap any term that must not split in `.nb`.

## Layout

A single 1180px container (`.wrap`) with 28px gutters, holding a 13-section vertical scroll under a sticky nav. Sections are 72px tall in padding with `scroll-margin-top: 58px` and `scroll-padding-top: 76px` so anchored jumps clear the sticky bar.

Content grids are `repeat(auto-fit, minmax(260px, 1fr))` at 22px gaps — the column count is a consequence of width, not a fixed number. `#articles` is the exception: it is pinned to 3 columns above 981px, because auto-fit gave 4 columns to 6 cards and left a half-empty last row. The hero is the one bespoke grid: `1.15fr .85fr` at 56px, collapsing to a single column at 900px.

Alternating ground is the primary rhythm device: `section.alt` takes the warm ivory gradient, everything else sits on cool page. Two sections break out entirely — `#contact` and `#faq` share a deep-teal gradient ground, and `#about` runs on its own dark gradient in English.

**Breakpoints** cluster at 900px (the main two-column → one-column collapse), 760px (nav becomes a toggle menu), and 720/600/560/520px for progressive tightening. 1080/1100px handle wide-layout adjustments.

**The Right-Edge Bleed Rule.** The hero's color blocks are positioned with `right: calc(50% - 50vw)` so they run past the container to the viewport edge. They are hidden below 900px, where a single column would put them under the headline instead of beside it.

**The Claim-and-Proof Rule.** Where a section pairs a set of claims with screenshots (`#business-central`), it uses the accordion-and-image pattern Microsoft's own Dynamics 365 pages use: the claims are an accordion list in the left column, exactly one open at a time, and the open item's screenshot fills the right column. The claim text lives inside the accordion, not as a caption under the image — the image carries no caption. Above 1081px the two columns sit side by side (`.bento-tiles` in column 1, `.bento-shot` in column 2, swapped by `grid-column` rather than by DOM order). Below 1081px they stack, image first, and the accordion stays a full-width vertical list — never a horizontal scroller, which hides items off-screen with no indication they exist.

## Elevation & Depth

**Hybrid, weighted heavily toward flat.** The default is a Fluent-style hairline: `0 0 2px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.14)` on every card, figure, feature panel, and price card. It reads as a printed edge, not a lifted object. Depth in the body of the page comes from ground color changes and hairline borders, not from shadow.

The soft, wide, low-opacity shadows are reserved for the hero's floating document mocks, where the fiction is literally paper lying on a desk and the shadow is doing representational work. Outside the hero they are legacy and should be replaced with the hairline.

### Shadow Vocabulary
- **Hairline** (`0 0 2px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.14)`): the default for every surface below the hero.
- **Document Lift** (`0 34px 64px -26px rgba(7,45,48,.6)`): the hero's primary `.doc-card`.
- **Document Float** (`0 0 2px rgba(0,0,0,.12), 0 8px 24px -8px rgba(0,0,0,.28)`): the five `.doc-mini` slips scattered around it.
- **Focus Ring** (`outline: 2px solid #A63A56; outline-offset: 2px` on `.cta`; `3px rgba(124,203,196,.72)` elsewhere): never a shadow, always an outline.

### Named Rules

**The Hero-Only Lift Rule.** Soft wide shadows exist to say "this is paper on a desk." They belong to the hero document scene. A new card, panel, or price block gets the hairline. If a new element wants a big shadow, the honest question is whether it wants to be in the hero.

**The No Hover Lift Rule.** `.cta` explicitly kills `transform` and `box-shadow` on hover and changes background only, in 125ms. Buttons do not rise. `.pricing-cta`, `.snav`, `.chat-fab-btn` and the `#services` phase cards have been brought in line. `.card` still lifts 5px, which is the one remaining inconsistency.

## Shapes

Sharp by default. Buttons are 3px — barely rounded, deliberately close to square, matching Fluent's button geometry. Cards and panels are 8px. These two values are the system, and the reclaim block at the end of the `--ui-*` layer now maps the whole legacy tail (6, 9, 10, 11, 12, 14, 16, 17, 18, 20, 22, 24, 28px) onto them. What is left off-system is deliberate and decorative: the 4px `.doc-line` bars inside the hero document mock, and two inline SVG frames.

Full rounds survive in two justified places: `50%` for avatars, social buttons, and icon dots, and `999px` for badges and pills.

The hero contributes the system's one piece of geometry: a `200px` bottom-left radius on a deep-teal block that bleeds off the right edge, plus four hard-edged color rectangles butted against each other with no gaps. Nothing floats alone — every block touches either another block or the frame.

**The Two Radii Rule.** New components use `var(--ui-radius-btn)` (3px) or `var(--ui-radius-card)` (8px). Do not introduce a third value. A literal `border-radius: 14px` in new code is a bug, not a choice.

## Components

### Buttons
- **Shape:** near-square (`3px`), minimum 44px tall, `10px 22px` padding
- **Primary:** flat Burgundy Seal fill, white text, weight 500, no gradient, no shadow
- **Hover:** background only → Deep Burgundy, 125ms ease. No transform, no shadow
- **Focus:** 2px burgundy outline at 2px offset
- **Secondary / Ghost:** transparent fill, 1px Ink Green-Black border, ink text; hover fills `rgba(1,47,42,.06)`
- **Ghost on `#contact`:** the dark photo ground forces its own treatment — `rgba(0,0,0,.42)` scrim, 2px backdrop blur, `#f0f8f7` text, translucent white border. Without the scrim the label sinks into the photograph
- **Character:** tactile and confident. The button is a solid object that changes color when pressed, not a surface that floats

### Cards / Containers
- **Corner:** 8px
- **Background:** white on both ivory and cool-page grounds
- **Border:** 1px Pale Edge
- **Shadow:** Hairline
- **Padding:** 28px
- **Hover:** lifts 5px, border warms, a 3px accent bar fades in along the top edge (`.card::before`)

### Navigation
- **Style:** sticky, `rgba(255,255,255,.94)` with a 1px Hairline bottom border. Ink links, 0.9rem, weight 500, in the display family
- **Hover:** ink → Deep Teal with a `rgba(1,47,42,.06)` wash
- **Active:** a pink→burgundy gradient underline via `::after`
- **The last link is the contact CTA:** burgundy fill, white text, 3px radius — the only colored item in the bar
- **Language toggle:** two small outlined buttons; the active one fills Deep Teal
- **Mobile (≤760px):** collapses to a bordered hamburger; the link list animates open via `max-height` + opacity in 220ms

### Price Cards (signature)

Three `.plan-card` surfaces in `#pricing`, identical by design: white ground, 1px Pale Edge, 8px, Hairline. A flat Deep Teal banner runs across the top of each — the banner is a label, not a control, so it never takes burgundy; the only burgundy in the section is the one `.pricing-cta` per card. The discounted plan is marked by a Deep Teal border on the card, nothing louder.

Above 1081px the three cards are direct children of one grid (`.plan-group` and `.plan-group-cards` go `display: contents`) and each card subgrids the parent's seven rows — banner, name, description, price, note, CTA, details. Rows therefore align from real content. **Do not reintroduce `min-height` to line the cards up**: six hand-measured values used to do this job and had to be re-measured every time the copy or the font changed.

### Feature Tabs (signature)
Six tabs (`#feature-tab-vat` … `#feature-tab-api`) switching six panels in `#features`. Panel copy enters with `panelCopyIn` — 550ms on `cubic-bezier(.2,.75,.2,1)`, 80ms delay. This is the page's main interactive proof surface: it is where the localization package stops being a list and starts being a thing.

### Claim Accordion (signature)
Five rows in `#business-central`, one open at a time, each swapping the screenshot in the adjacent column. A row is not a card: no border, no radius, no fill — a 1px `#E2E8E6` rule along the top, a quiet tracked number (`01`–`05`) above the heading, and a chevron built from two `currentColor` borders rotated 45°, flipping to −135° when open. The open row is marked by a 3px Burgundy Seal bar down its left edge and by its body copy revealing on `panelCopyIn`. Hover is a `rgba(1,47,42,.035)` wash and nothing else — the rows never lift.

### Hero Document Scene (signature)
A rotated `.doc-card` Thai tax invoice built entirely in CSS — no image — surrounded by five `.doc-mini` slips (VAT report, PO, receipt, billing note, credit note) at rotations between -5° and +7°, with a dashed burgundy `.doc-stamp`. The card breathes on a 7.6s `docCardFloat` loop; the minis run 6.8s `docMiniFloat`; the stamp lands with `stampPop` at 1.25s on an overshoot curve (`cubic-bezier(.2,.9,.25,1.35)`).

This is the single most product-specific element on the site. It is the localization package, drawn. Do not replace it with stock imagery or a generic dashboard screenshot.

### Success by Design Stepper (signature)
Five `.step` items in `#services`, each carrying a `--phase` token from the teal ramp and a `--stage-text` token from the Microsoft hues. A `.steps-progress` bar fills across them in flat Jade on a Pale Edge track; the current step pulses on a 1.8s `stepPulse`. The English stage name is set as a Label (12px/600/0.08em) in its Microsoft hue and the Thai line under it is the Title — the Thai reader's sentence carries the hierarchy, not the borrowed English word.

### Motion
One easing curve carries the system: `cubic-bezier(.2,.75,.2,1)`, used nine times for entrances and reveals. State changes are faster and linear-ish (125–250ms `ease`). Six `prefers-reduced-motion: reduce` blocks disable animation, transitions, and the float loops — this coverage is a system commitment, not an optional extra.

## Do's and Don'ts

### Do:
- **Do** put new tokens in the **last** `:root` in the file — the `--ui-*` block (currently around line 2171). Being last is what makes it the one that wins; find it by searching `--ui-radius-btn`, not by line number.
- **Do** use `var(--ui-radius-btn)` (3px) or `var(--ui-radius-card)` (8px) for every new corner.
- **Do** give every new surface the Hairline shadow, and reach for a soft shadow only inside the hero document scene.
- **Do** keep Thai body copy at 18px/500 and Thai headings in Anuphan.
- **Do** wrap unbreakable Thai compounds in `.nb`.
- **Do** update the `I18N` dictionary at the end of `<script>` whenever page text moves — especially `nth-child` selectors, which silently mistranslate when a sibling is inserted.
- **Do** add a `prefers-reduced-motion: reduce` rule alongside any new animation.
- **Do** keep the burgundy CTA the single loudest thing in any viewport.

### Don't:
- **Don't** add a fifth `:root` block. There are already four (currently around lines 155, 762, 1577, 2171) and three of them are mostly dead. New work consolidates; it does not stack.
- **Don't** trust a color you read in the first `:root`. `--navy: #0D5257` and `--muted: #0f4a52` there are overridden and never render. The live values come from the `--brand-*` block and the `--ui-*` block that follow it — read both before quoting any value.
- **Don't** put a gradient on a button. `.cta` strips `background-image` with `!important` precisely because earlier layers added them.
- **Don't** let a button lift or glow on hover. Background change only, 125ms.
- **Don't** spend burgundy on anything that isn't asking for a click.
- **Don't** use the `--ms-*` hues outside the five Success by Design stage labels.
- **Don't** introduce a new radius value. The long tail of 9/12/14/16/18/20/22/24/28px is debt, not vocabulary.
- **Don't** put a gradient back on `header`. The hero ground is flat Paper Ivory (`#EFEFE9`). A multi-stop teal gradient and its `--hero-deep` / `--hero-mid` / `--hero-end` tokens lived here for a while, overridden and never rendering; they have been deleted.
- **Don't** add a new `!important`. The existing ones are documented specificity fights; each new one makes the next change harder.
- **Don't** move or rename a file. Every committed path is a live URL that may already have been shared.
