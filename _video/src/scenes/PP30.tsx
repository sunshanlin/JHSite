// ภ.พ.30 — bezier-source-converge-merge (demos/ui-entrance/bezier-source-converge-merge/BezierSourceConvergeMerge.tsx)
// then the folder opens on the filled ภ.พ.30.
// Kept from the demo (×4 from its 480×270 design grid): path = straight run to x 74 then cubic to the merge point,
// draw-on staggered 0.045 with 0.17 windows, nodes ride the real curve (arc-length table, f0 = 96/len),
// three-stage shrink 44 → 15 (first 75 %) → 0, two whole packet cycles with i·0.13 phase, erase by negative
// dashoffset 0.78–0.90, badge pulse +12 % outBack 0.70–0.78, one ripple at 0.72, centring pan 0.76–0.93.
// Adapted: five sources are the month's documents (portrait thumbnails), the merge point is the month folder,
// node size 44 → 150 px screen (portrait 120×150) because five rows share the column. The opening's title comes back
// as the converge's heading (bookend, owner 2026-10-13); the tie-out ends on box 11 (ต้องชำระ), each chip carrying
// its amount; the tie lines ride the documents' poses back into the folder.
import React from 'react';
import { useHeroMode } from '../heroMode';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { useAuthorFrame } from '../rate';
import { E, lerp, seg } from '../fx/Motion';
import { EASE, mix, ramp, softShadow } from '../fx/Polish';
import { Stage, alpha } from '../fx/Look';
import { C, L, THAI, gradText } from '../theme';
import { Folder, FOLDER_H, FOLDER_W } from '../Folder';
import { MONTH, PP30_CONV, localBeat } from '../timeline';
import { PND_LINES } from '../data/pnd';
import { Tag } from '../Tag';

export const CONV = PP30_CONV; // demo 168 f (the 70 s cut gives the shot 330 f); then VAT reports → ภ.พ.30 (owner 2026-10-13)
const K = 4; // design → screen
// 440×240 canvas in the 480×270 design grid (design px). OX was 20 (centred); +37.5 (150 px on screen) makes room for
// the label chips left of the documents, clear of the docked mini flow (x ≤ 284, y ≤ 328) — owner 2026-10-14
const CHIP_ROOM = 150; // screen px
const OX = 20 + CHIP_ROOM / 4, OY = 15;
const XC = 332, YC = 120;

// the month's documents in story order: purchase order, 50 ทวิ, tax invoice, billing note, receipt, text file.
// label / chip / ink: the opening's chips (Opening.tsx CARDS) — same words, each document's own colour; the text file
// wears the Revenue Department ink of the 50 ทวิ, the form it is filed with
const SRCS = [
  { y: 20, img: 'docs/purchase-order.png', tint: C.c2, label: 'ใบสั่งซื้อ', chip: '#FFDAB8', ink: '#8A4A12' },
  { y: 60, img: 'docs/wht-cert.png', tint: C.c3, label: '50 ทวิ', chip: '#3F4848', ink: '' },
  { y: 100, img: 'docs/tax-invoice.png', tint: C.c1, label: 'ใบกำกับภาษี', chip: '#A6DFD5', ink: C.green },
  { y: 140, img: 'docs/billing-note.png', tint: C.c4, label: 'ใบวางบิล', chip: '#DAC7EC', ink: '#4A2A73' },
  { y: 180, img: 'docs/receipt.png', tint: C.c2, label: 'ใบเสร็จรับเงิน', chip: '#AADBA9', ink: '#1F5A2B' },
  { y: 220, img: '', tint: C.c6, label: 'ไฟล์ ภ.ง.ด.53', chip: '#3F4848', ink: '' }, // RD Prep text file
];

type Pt = { x: number; y: number };
const cubic = (y0: number, u: number): Pt => {
  const v = 1 - u;
  return {
    x: v * v * v * 74 + 3 * v * v * u * 186 + 3 * v * u * u * 214 + u * u * u * XC,
    y: v * v * v * y0 + 3 * v * v * u * y0 + 3 * v * u * u * YC + u * u * u * YC,
  };
};
const SAMPLES = 1600;
const LINE_LEN = 96;
const mkPathGeom = (y0: number) => {
  const cum: number[] = [0];
  let px = 74, py = y0, acc = 0;
  for (let k = 1; k <= SAMPLES; k++) {
    const p = cubic(y0, k / SAMPLES);
    acc += Math.hypot(p.x - px, p.y - py);
    cum.push(acc);
    px = p.x; py = p.y;
  }
  const len = LINE_LEN + acc;
  const pointAt = (s: number): Pt => {
    const sc = Math.max(0, Math.min(len, s));
    if (sc <= LINE_LEN) return { x: -22 + sc, y: y0 };
    const target = sc - LINE_LEN;
    let lo = 0, hi = SAMPLES;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < target) lo = mid + 1; else hi = mid;
    }
    const i = Math.max(1, lo);
    const s0 = cum[i - 1], s1 = cum[i];
    const u = (i - 1 + (s1 > s0 ? (target - s0) / (s1 - s0) : 0)) / SAMPLES;
    return cubic(y0, u);
  };
  return { len, pointAt, f0: LINE_LEN / len };
};
const GEOMS = SRCS.map((s) => mkPathGeom(s.y));
const TAIL = 9;
const TAIL_GAP = 0.0055;
const SHIFT = 352 - 240 + CHIP_ROOM / 4; // the centring pan still ends with the folder at x 960
const NODE = 128 / K; // design px (portrait 0.8 : 1); six rows 40 apart
// label chips (owner 2026-10-14: "จังหวะนี้ต้องมี Chip ด้านซ้าย … สื่อว่ามันคืออะไร" — the thumbnails are ~100 px and
// unreadable): one per document, right edge 14 px left of the resting thumbnail, on its wire's start. Each comes in
// with its document, stays on the wire while the document travels into the folder, and leaves as the merge lands.
const CHIP_RIGHT = (74 - (NODE * 0.8) / 2) * K - 14; // canvas px

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const Thumb: React.FC<{ img: string; tint: string }> = ({ img, tint }) => (
  <div style={{ position: 'absolute', inset: 0, borderRadius: 3, overflow: 'hidden', background: '#fff' }}>
    {img ? <Img src={staticFile(img)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} /> : (
      <div style={{ padding: '3px 2.5px', fontFamily: 'Consolas, monospace', fontSize: 2.2, lineHeight: '3.4px', color: '#3F4568' }}>
        {PND_LINES.map((l, k) => <div key={k} style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>{l}</div>)}
      </div>
    )}
  </div>
);

// ภ.พ.30 rows in page fractions of the RD form (same for every month): row 5 ภาษีขาย, row 7 ภาษีซื้อ, row 11 ต้องชำระ.
const ROW5 = 0.4668, ROW7 = 0.5198, ROW_H = 0.021; // measured on the December 2569 return (pp30-202612.pdf)
const ROW11 = 0.6096; // box 11's border centre (pixel scan of docs/pp30.png, 2026-10-13: borders at y 0.5989 / 0.6203)
const FORM_W = 620;
const FORM_H = FORM_W * 1.4134;
// y 116 (was centred at 102): the JW tag sits on the form's corner, clear of the top safe margin (final review
// 2026-10-13); the longer "JWIC Thai Localization" tag no longer fits in the eyebrow beside the form
const FORM_X = 1010, FORM_Y = 116;
const BOX_X = 0.765; // left edge of the value boxes (page fraction)
// the amount chips right of the form, two lines (label over amount): only ~270 px is free there (owner 2026-10-13).
// Rows 5 and 7 are 46 px apart, so the chips stack 10 px apart beside them (chip 5 sits above its row, 7 and 11 on
// theirs) and a short S-curve in the row's colour joins each lit row to its chip
const CHIP_X = FORM_W + 34, CHIP_H = 78, CHIP_GAP = 10;
const CHIP_Y = [ROW5 * FORM_H - CHIP_H, ROW5 * FORM_H + CHIP_GAP, ROW5 * FORM_H + 2 * CHIP_GAP + CHIP_H]; // chip tops, form px
// VAT reports (December 2569, one line each): landscape A4 pages whose content sits in the top 40 %, so each is
// shown as a strip of page fractions y Y0–Y1; tot = the รวมทั้งสิ้น row in page fractions (fgrid, 2026-10-13)
const REP_W = 620, REP_PH = REP_W / 1.4142; // full page height at REP_W
const Y0 = 0.035, Y1 = 0.39;
const REP_H = (Y1 - Y0) * REP_PH;
const REP_X = 330, REP_Y = [384, 684]; // clear of the corner calendar (x ≤ 282, y ≤ 344) and of the title's gloss line
const REPS = [
  { img: 'docs/sales-vat.png', label: 'รายงานภาษีขาย', amt: '3,500.00', c: C.c1, tot: { x: 0.612, y: 0.345, w: 0.255, h: 0.026 } },
  { img: 'docs/purchase-vat.png', label: 'รายงานภาษีซื้อ', amt: '700.00', c: C.c3, tot: { x: 0.612, y: 0.34, w: 0.255, h: 0.026 } },
];
// the tie-out on the form: lit row → its chip, in the form's own wording (owner 2026-10-13); box 11 = 5 − 7
const TIES = [
  { row: ROW5, c: C.c1, t: 'ภาษีขาย', amt: '3,500.00' },
  { row: ROW7, c: C.c3, t: 'ภาษีซื้อ', amt: '700.00' },
  { row: ROW11, c: C.ink, t: 'ต้องชำระ', amt: '2,800.00' },
];
// the opening's title words and stagger (Opening.tsx TITLE); a no-break space keeps the gap inside the inline-block
const HEAD = [
  { text: 'ครบ', start: 0, dur: 22 },
  { text: 'ทั้งเดือน', start: 4, dur: 22 },
  { text: '\u00a0ใน', start: 14, dur: 22, grad: true },
  { text: 'ระบบเดียว', start: 18, dur: 30, grad: true },
];

export const PP30: React.FC = () => {
  const f = useAuthorFrame();
  const hero = useHeroMode();
  const t = Math.min(1, f / (CONV - 1));
  const conv = seg(t, 0.34, 0.74, E.inOutCubic);
  const erase = seg(t, 0.78, 0.9, E.outQuad);
  const pkCycle = (seg(t, 0.1, 0.74, E.linear) * 2) % 1;
  const pan = seg(t, 0.76, 0.93, EASE.smooth);
  const bp = seg(t, 0.16, 0.26, E.outCubic);
  const badgeScale = lerp(bp, 0.7, 1) * (1 + seg(t, 0.7, 0.78, E.outBack) * 0.12 - seg(t, 0.78, 0.86, E.outQuad) * 0.12);
  const ripple = seg(t, 0.72, 0.86, EASE.out);

  // after the merge: the folder opens, the sales and purchase VAT reports come out, their totals are tied to
  // boxes 5 and 7 of the ภ.พ.30 that follows, box 11 (ต้องชำระ) lights one beat later, then everything goes back
  // in and the folder closes. Reports land on beat 140 (downbeat), rows 5 / 7 light on 143.5 / 144, box 11 on 144.5;
  // the finished tie-out holds ~2.6 s (rows 5 / 7 ≥ 3 s) and goes back into the folder, closed and centred before the
  // feature wall (beat 152) fades in over it.
  const REP_IN = localBeat('pp30', 140) - 22;
  const RISE = REP_IN + 38;
  const HL7 = localBeat('pp30', 144), HL5 = HL7 - 8;
  const HL11 = localBeat('pp30', 144.5); // half a beat after row 7 so the finished tie-out holds ≥ 3 s before EXIT
  const EXIT = localBeat('pp30', 152) - 21; // folder closed by the 'more' shot, which opens it again
  const open = ramp(f, REP_IN - 6, 16, EASE.swift) * (1 - ramp(f, EXIT + 11, 12, EASE.swift));
  const rep = ramp(f, REP_IN, 22, EASE.snappy) * (1 - ramp(f, EXIT, 14, EASE.exit));
  const repHl = (k: number) => ramp(f, REP_IN + 22 + k * 4, 8, EASE.out);
  const rise = ramp(f, RISE, 22, EASE.snappy) * (1 - ramp(f, EXIT + 2, 14, EASE.exit));
  const link = (k: number) => ramp(f, HL5 - 12 + k * 8, 12, EASE.out); // lands as its row lights
  const hl5 = ramp(f, HL5, 6, EASE.out);
  const hl7 = ramp(f, HL7, 6, EASE.out);
  const hl11 = ramp(f, HL11, 6, EASE.out);
  const chip5 = ramp(f, HL5 + 2, 10, EASE.snappy);
  const chip7 = ramp(f, HL7 + 2, 10, EASE.snappy);
  const chip11 = ramp(f, HL11 + 2, 10, EASE.snappy);
  const title = (k: number) => ramp(f, RISE + 4 + k * 5, 22, EASE.out);
  const titleOut = 1 - ramp(f, EXIT, 10, EASE.out);
  // bookend: the opening's title over the converge, in with the lines (~22 f after the shot starts, local 8), out as
  // the folder opens (owner 2026-10-13)
  const headIn = (k: number) => ramp(f, 30 + HEAD[k].start, HEAD[k].dur, EASE.out);
  const headOut = 1 - ramp(f, REP_IN - 6, 10, EASE.out);

  const fx = OX * K + (XC - SHIFT * pan) * K; // folder centre, screen
  const fy = OY * K + YC * K;
  // form: from inside the folder to a reading pose on the right
  const formX = mix(fx - FORM_W * 0.2, FORM_X, rise);
  const formY = mix(fy - FORM_H * 0.14, FORM_Y, rise);
  const formS = mix(0.4, 1, rise);
  const folderDrop = Math.max(rise, rep) * 520;
  const repPose = (k: number) => ({
    x: mix(fx - REP_W * 0.2, REP_X, rep), y: mix(fy - REP_H * 0.2, REP_Y[k], rep), s: mix(0.4, 1, rep),
  });
  // tie lines ride the documents' poses (they used to stay put while the documents flew back into the folder)
  const tieOp = 0.9 * clamp01((Math.min(rise, rep) - 0.4) / 0.5);

  return (
    // no breath before this shot: it dissolves in over the text file's last frames instead of a hard cut
    <AbsoluteFill style={{ fontFamily: THAI, overflow: 'hidden', opacity: ramp(f, 0, 10, EASE.out) }}>
      <Stage look={L} keyLight={{ x: 0.62, y: 0.25 }} fill={{ x: 0.1, y: 0.95 }} grain={0.035} />
      {/* converge canvas */}
      <div style={{ position: 'absolute', left: OX * K, top: OY * K, width: 440 * K, height: 240 * K, transform: `translateX(${(-pan * SHIFT * K).toFixed(2)}px)` }}>
        <svg width={440 * K} height={240 * K} viewBox="0 0 440 240" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <defs>
            {/* the lines fade in under the label chips (the docked mini flow covers screen x ≤ 284) */}
            <linearGradient id="pp-fadein" gradientUnits="userSpaceOnUse" x1={52} y1={0} x2={72} y2={0}>
              <stop offset="0" stopColor="#fff" stopOpacity={0} />
              <stop offset="1" stopColor="#fff" stopOpacity={1} />
            </linearGradient>
            <mask id="pp-mask" maskUnits="userSpaceOnUse" x={-60} y={-40} width={560} height={320}>
              <rect x={-60} y={-40} width={560} height={320} fill="url(#pp-fadein)" />
            </mask>
            <linearGradient id="pp-stroke" gradientUnits="userSpaceOnUse" x1={-22} y1={0} x2={XC} y2={0}>
              <stop offset="0" stopColor={C.c7} />
              <stop offset="0.45" stopColor={C.c6} />
              <stop offset="1" stopColor={C.c1} />
            </linearGradient>
          </defs>
          <g mask="url(#pp-mask)">
          {SRCS.map((s, i) => {
            const { len } = GEOMS[i];
            const draw = seg(t, 0.04 + i * 0.045, 0.04 + i * 0.045 + 0.17, E.outQuad);
            const off = erase > 0 ? -erase * len : len * (1 - draw);
            return (
              <path key={i} d={`M -22,${s.y} L 74,${s.y} C 186,${s.y} 214,${YC} ${XC},${YC}`} fill="none" stroke="url(#pp-stroke)"
                strokeWidth={0.9} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={off.toFixed(1)}
                opacity={(draw * (1 - clamp01((erase - 0.85) / 0.15))).toFixed(3)} />
            );
          })}
          </g>
        </svg>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 440, height: 240, transform: `scale(${K})`, transformOrigin: '0 0' }}>
          {SRCS.map((s, i) => {
            const { len, pointAt, f0 } = GEOMS[i];
            const frac = f0 + (1 - f0) * conv;
            const pt = pointAt(len * frac);
            const size = conv < 0.75 ? lerp(conv / 0.75, NODE, NODE * 15 / 44) : lerp((conv - 0.75) / 0.25, NODE * 15 / 44, 0);
            const appear = seg(t, 0.02 + i * 0.04, 0.02 + i * 0.04 + 0.1, EASE.overshoot);
            const appearOp = seg(t, 0.02 + i * 0.04, 0.02 + i * 0.04 + 0.06, EASE.out);
            const ph = (pkCycle + i * 0.13) % 1;
            const pkOn = seg(t, 0.1, 0.16) * (1 - seg(t, 0.7, 0.76));
            const pkOp = pkOn * (1 - Math.abs(ph - 0.5) * 0.6);
            const w = size * 0.8, h = size;
            return (
              <React.Fragment key={i}>
                {pkOp > 0.01 && Array.from({ length: TAIL }, (_, j) => TAIL - j).map((j) => {
                  const pj = ph - j * TAIL_GAP;
                  if (pj < 0) return null;
                  const q = pointAt(len * (f0 + (1 - f0) * pj));
                  const r = 2.6 * (1 - j / (TAIL + 1));
                  return <div key={`t${j}`} style={{ position: 'absolute', left: 0, top: 0, width: r * 2, height: r * 2, borderRadius: '50%', background: C.c3, transform: `translate(${(q.x - r).toFixed(2)}px,${(q.y - r).toFixed(2)}px)`, opacity: (pkOp * 0.38 * (1 - j / (TAIL + 1))).toFixed(3) }} />;
                })}
                {pkOp > 0.01 && (() => {
                  const q = pointAt(len * (f0 + (1 - f0) * ph));
                  return <div style={{ position: 'absolute', left: 0, top: 0, width: 6, height: 6, borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, ${C.c4}, ${C.c3})`, boxShadow: `0 0 0 1.5px ${alpha(C.c3, 0.16)}, 0 1px 3px ${alpha(C.c3, 0.45)}`, transform: `translate(${(q.x - 3).toFixed(2)}px,${(q.y - 3).toFixed(2)}px)`, opacity: pkOp.toFixed(3) }} />;
                })()}
                <div style={{
                  position: 'absolute', left: 0, top: 0, width: Math.max(0.1, w), height: Math.max(0.1, h), borderRadius: 3,
                  boxShadow: softShadow(1 + 2 * (size / NODE), { color: L.shadow, strength: 0.6 }),
                  transform: `translate(${(pt.x - w / 2).toFixed(2)}px,${(pt.y - h / 2).toFixed(2)}px) scale(${appear.toFixed(3)})`,
                  opacity: (appearOp * (conv > 0.92 ? clamp01((1 - conv) / 0.08) : 1)).toFixed(3),
                }}>
                  <Thumb img={s.img} tint={s.tint} />
                </div>
              </React.Fragment>
            );
          })}
        </div>
        {SRCS.map((s, i) => {
          const inP = ramp(f, (0.02 + i * 0.04) * (CONV - 1) + 4, 12, EASE.out);
          const p = inP * (1 - ramp(f, 0.66 * (CONV - 1), 10, EASE.out));
          if (p <= 0.001) return null;
          return (
            <div key={`chip${i}`} style={{
              position: 'absolute', left: CHIP_RIGHT, top: s.y * K, padding: '6px 16px', borderRadius: 16, background: s.chip,
              boxShadow: `${s.ink ? `inset 0 0 0 1.5px ${alpha(s.ink, 0.22)}, ` : ''}0 6px 18px ${alpha(s.ink || s.chip, 0.22)}`,
              fontWeight: 700, fontSize: 30, lineHeight: 1.3, color: s.ink || '#fff', whiteSpace: 'nowrap', opacity: p,
              transform: `translate(-100%, -50%) translateX(${((1 - inP) * 18).toFixed(2)}px)`,
              filter: inP < 0.995 ? `blur(${((1 - inP) * 6).toFixed(2)}px)` : undefined,
            }}>{s.label}</div>
          );
        })}
      </div>

      {/* receiving ripple */}
      <div style={{
        position: 'absolute', left: fx - FOLDER_W / 2, top: fy - FOLDER_H / 2, width: FOLDER_W, height: FOLDER_H, borderRadius: 26,
        border: `3px solid ${C.c2}`, transform: `scale(${lerp(ripple, 1, 1.6)})`, opacity: ripple > 0 && ripple < 1 ? (1 - ripple) * 0.55 : 0,
      }} />

      {/* folder (merge point) */}
      <div style={{
        position: 'absolute', left: fx - FOLDER_W / 2, top: fy - FOLDER_H / 2 + folderDrop, opacity: bp * (1 - Math.max(rise, rep)),
        transform: `scale(${badgeScale.toFixed(4)})`, transformOrigin: '50% 50%',
      }}>
        <Folder open={open} glow={seg(t, 0.7, 0.78) * (1 - seg(t, 0.78, 0.9))} />
      </div>

      {/* sales / purchase VAT reports (real, December) */}
      {rep > 0.001 && REPS.map((r, k) => {
        const p = repPose(k);
        const tb = { x: r.tot.x * REP_W, y: (r.tot.y - Y0) * REP_PH, w: r.tot.w * REP_W, h: r.tot.h * REP_PH };
        return (
          <div key={k} style={{ position: 'absolute', left: p.x, top: p.y, width: REP_W, height: REP_H, transform: `scale(${p.s.toFixed(4)})`, transformOrigin: '0 0', opacity: clamp01(rep * 3) }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 8, overflow: 'hidden', background: '#fff', boxShadow: softShadow(18, { color: L.shadow, strength: 1.2 }) }}>
              <Img src={staticFile(r.img)} style={{ position: 'absolute', left: 0, top: -Y0 * REP_PH, width: REP_W, height: REP_PH }} />
              <div style={{ position: 'absolute', left: tb.x - 4, top: tb.y - 2, width: (tb.w + 8) * repHl(k), height: tb.h + 4, borderRadius: 4, background: alpha(r.c, 0.22), boxShadow: `inset 0 0 0 2px ${alpha(r.c, 0.8 * repHl(k))}` }} />
            </div>
            <div style={{ position: 'absolute', left: 0, top: -62, height: 50, padding: '0 20px', borderRadius: 25, display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: `1.5px solid ${C.ink}`, fontWeight: 600, fontSize: 32, color: C.ink, whiteSpace: 'nowrap' }}>
              {r.label}<span style={{ color: r.c, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{r.amt}</span>
            </div>
          </div>
        );
      })}

      {/* report totals → boxes 5 / 7, anchored to the documents' poses so they ride back into the folder with them */}
      {!hero && tieOp > 0.01 && (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {REPS.map((r, k) => {
            const d = link(k);
            if (d <= 0) return null;
            const p = repPose(k);
            const a = { x: p.x + ((r.tot.x + r.tot.w) * REP_W + 6) * p.s, y: p.y + (r.tot.y - Y0 + r.tot.h / 2) * REP_PH * p.s };
            // ends at the form's left edge on its row (the lit row carries it on); drawn under the form, an end at the
            // value box hid the rise and read as pointing at rows 15/16 (final review r2 M3)
            const bb = { x: formX - 8 * formS, y: formY + FORM_H * (k === 0 ? ROW5 : ROW7) * formS };
            let path: string;
            if (k === 1) {
              // the purchase tie runs right along its own row into the corridor between the report and the form, then
              // straight up: the curve used to climb over the report paper (final review 2026-10-13)
              const cx = (p.x + REP_W * p.s + formX) / 2;
              const rr = Math.max(0, Math.min(14, Math.abs(a.y - bb.y) / 2, cx - a.x, bb.x - cx));
              const up = bb.y < a.y ? -1 : 1;
              path = `M${a.x},${a.y} H${cx - rr} Q${cx},${a.y} ${cx},${a.y + up * rr} V${bb.y - up * rr} Q${cx},${bb.y} ${cx + rr},${bb.y} H${bb.x}`;
            } else {
              const mx = (a.x + bb.x) / 2;
              path = `M${a.x},${a.y} C${mx},${a.y} ${mx},${bb.y} ${bb.x},${bb.y}`;
            }
            return (
              <g key={k} opacity={tieOp.toFixed(3)}>
                <path d={path} fill="none" stroke={r.c} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={(1 - d).toFixed(4)} />
                <circle cx={a.x} cy={a.y} r={6 * p.s} fill={r.c} opacity={Math.min(1, d * 3)} />
                <circle cx={bb.x} cy={bb.y} r={6 * formS} fill={r.c} opacity={clamp01(d * 2 - 1)} />
              </g>
            );
          })}
        </svg>
      )}

      {/* the filled ภ.พ.30 */}
      {rise > 0.001 && (
        <div style={{ position: 'absolute', left: formX, top: formY, width: FORM_W, height: FORM_H, transform: `scale(${formS.toFixed(4)})`, transformOrigin: '0 0', opacity: clamp01(rise * 3) }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 8, overflow: 'hidden', background: '#fff', boxShadow: softShadow(30, { color: L.shadow, strength: 1.3 }) }}>
            <Img src={staticFile('docs/pp30.png')} style={{ width: '100%', height: '100%' }} />
            {[hl5, hl7, hl11].map((hp, k) => (
              <div key={k} style={{
                position: 'absolute', left: FORM_W * 0.03, width: FORM_W * 0.94, top: FORM_H * (TIES[k].row - ROW_H / 2), height: FORM_H * ROW_H, borderRadius: 4,
                background: alpha(TIES[k].c, 0.18), boxShadow: `inset 0 0 0 2px ${alpha(TIES[k].c, 0.85)}`, transform: `scaleX(${hp.toFixed(4)})`, transformOrigin: 'left center',
              }} />
            ))}
          </div>
          {/* lit row → its chip */}
          <svg width={CHIP_X} height={FORM_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {[chip5, chip7, chip11].map((cp, k) => {
              if (cp <= 0) return null;
              const x0 = FORM_W * 0.97, y0 = FORM_H * TIES[k].row, x1 = CHIP_X, y1 = CHIP_Y[k] + CHIP_H / 2;
              return <path key={k} d={`M${x0},${y0} C${x0 + 26},${y0} ${x1 - 26},${y1} ${x1},${y1}`} fill="none" stroke={TIES[k].c} strokeWidth={3} strokeLinecap="round" opacity={0.85} pathLength={1} strokeDasharray="1 1" strokeDashoffset={(1 - cp).toFixed(4)} />;
            })}
          </svg>
          {[chip5, chip7, chip11].map((cp, k) => (
            <div key={k} style={{
              position: 'absolute', left: CHIP_X, top: CHIP_Y[k], height: CHIP_H, boxSizing: 'border-box', padding: '0 20px', borderRadius: 18,
              background: TIES[k].c, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', whiteSpace: 'nowrap', opacity: cp,
              transform: `translateX(${((1 - cp) * 18).toFixed(2)}px)`, boxShadow: `0 10px 24px ${alpha(TIES[k].c, 0.35)}`,
            }}>
              <div style={{ fontWeight: 600, fontSize: 24, lineHeight: 1.25, opacity: 0.9 }}>{TIES[k].t}</div>
              <div style={{ fontWeight: 700, fontSize: 30, lineHeight: 1.15, fontVariantNumeric: 'tabular-nums' }}>{TIES[k].amt}</div>
            </div>
          ))}
        </div>
      )}
      {/* origin tag on the form's corner (VAT reports, the RD text file and the ภ.พ.30 form are JWIC's) */}
      <Tag kind="jw" f={f} at={RISE + 14} out={EXIT} id="jw-pp30" style={{ left: formX, top: formY - 56 }} />

      {/* bookend: the opening's title as the converge's heading — above the first source line (y 140), clear of the curves
          and the docked list (owner 2026-10-13) */}
      {headOut > 0.001 && (
        <div style={{
          visibility: hero ? 'hidden' : undefined, position: 'absolute', left: 480, right: 480, top: 46, display: 'flex', justifyContent: 'center', alignItems: 'baseline',
          whiteSpace: 'nowrap', fontWeight: 700, fontSize: 64, lineHeight: 1.25, letterSpacing: '-0.01em', color: C.ink, opacity: headOut,
          transform: `translateY(${((1 - headOut) * -10).toFixed(2)}px)`,
        }}>
          {HEAD.map((w, k) => {
            const q = headIn(k);
            return <span key={k} style={{ display: 'inline-block', opacity: q, transform: `translateY(${((1 - q) * 24).toFixed(2)}px)`, filter: q >= 0.999 ? undefined : `blur(${((1 - q) * 8).toFixed(2)}px)`, ...(w.grad ? gradText : null) }}>{w.text}</span>;
          })}
        </div>
      )}

      {/* title (top, right of the calendar) */}
      <div style={{ visibility: hero ? 'hidden' : undefined, position: 'absolute', left: 330, top: 62, opacity: titleOut }}>
        <div style={{ fontWeight: 600, fontSize: 32, color: C.muted, opacity: title(0), transform: `translateY(${((1 - title(0)) * 16).toFixed(1)}px)` }}>ปิดงวด · {MONTH}</div>
        <div style={{ display: 'flex', gap: 20, fontWeight: 700, fontSize: 92, lineHeight: 1.25, color: C.ink, marginTop: 4 }}>
          {['ภ.พ.30', 'พร้อมยื่น'].map((w, k) => {
            const p = title(k + 1);
            return <span key={k} style={{ display: 'inline-block', opacity: p, transform: `translateY(${((1 - p) * 34).toFixed(2)}px)`, filter: p >= 0.999 ? undefined : `blur(${((1 - p) * 10).toFixed(2)}px)`, ...(k === 1 ? gradText : null) }}>{w}</span>;
          })}
        </div>
        {/* the form code's gloss, muted (owner 2026-10-13) */}
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 2, whiteSpace: 'nowrap', fontWeight: 600, fontSize: 30, color: C.muted,
          opacity: title(3), transform: `translateY(${((1 - title(3)) * 14).toFixed(1)}px)`,
        }}><span style={{ fontWeight: 700 }}>ภ.พ.30</span>· แบบแสดงรายการภาษีมูลค่าเพิ่ม</div>
      </div>
    </AbsoluteFill>
  );
};
