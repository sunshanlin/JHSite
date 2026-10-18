// ใบเสร็จรับเงิน — product-card-progressive-assemble
// (demos/ui-entrance/product-card-progressive-assemble/ProductCardProgressiveAssemble.tsx).
// Kept from the demo: the fill cursor (2.5 px frame + 6 px halo + tag) leads each field and hops between
// boxes in 6 f with EASE.swift, fields land 2 f after it arrives, skeleton bars fade as a field lands,
// rise (y + blur, snappy 14 f) for big fields and spring pop for small ones, one "change" event in the
// middle (here: the amount springs 1.18 → 1, damping 14), marker sweep 6 f, cursor tucks into the last
// field, whole card breathes 1 → 1.035, clean hold at the end.
// Adapted: the card is the real receipt page; each field is a crop of the page raster (never redrawn). The breathe is
// 2 % (the owner forbids deep zooms) and runs to the shot's end, so the clean hold never freezes (final review
// 2026-10-13); it grows about the page's upper centre so the tag above the page stays clear of the top safe margin.
import React from 'react';
import { useHeroMode } from '../heroMode';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { useAuthorFrame } from '../rate';
import { EASE, mix, ramp } from '../fx/Polish';
import { Stage, alpha, springAt } from '../fx/Look';
import { C, L, THAI, gradText } from '../theme';
import { DocCrop, box, type Frac } from '../DocCrop';
import { SHOTS, TAIL, localBeat } from '../timeline';
import { Tag } from '../Tag';
import { RCT_PILL } from '../data/rct';

const SRC = 'docs/receipt.png';
const DW = 640;
const DH = DW * 1.4134;
const DX = 1030;
const DY = 116; // the tag above the page clears the top safe margin (was centred: tag top at 32, final review 2026-10-13)
const O = 10; // local offset: the scene wakes 8 f early under the breath
const END = SHOTS.rct.dur + 2 * TAIL - O; // last frame of the shifted clock
const PUSH_O = { x: DW / 2, y: DH * 0.12 };
const LAND = 2;
// field `at` = cursor arrival; the field itself lands LAND frames later, on the beat
const B = (n: number) => localBeat('rct', n) - O - LAND;

// page fractions of the receipt's fields, measured on RCT26120005 (capture/dec; same layout as RCT26090002)
const F: Record<string, { r: Frac; at: number; kind: 'rise' | 'pop' }> = {
  // fields land every 1¼ beats from beat 98.5 (~90 s cut: 266 f shot), the last on 104.75 → ~4 s clean hold
  head: { r: { x: 0.025, y: 0.028, w: 0.95, h: 0.112 }, at: B(98.5), kind: 'rise' },
  cust: { r: { x: 0.025, y: 0.147, w: 0.95, h: 0.126 }, at: B(99.75), kind: 'rise' },
  lines: { r: { x: 0.025, y: 0.282, w: 0.95, h: 0.046 }, at: B(101), kind: 'rise' },
  total: { r: { x: 0.62, y: 0.331, w: 0.356, h: 0.022 }, at: B(102.25), kind: 'pop' },
  pay: { r: { x: 0.025, y: 0.478, w: 0.6, h: 0.048 }, at: B(103.5), kind: 'pop' },
  sign: { r: { x: 0.025, y: 0.862, w: 0.95, h: 0.09 }, at: B(104.75), kind: 'rise' },
};
const ORDER = ['head', 'cust', 'lines', 'total', 'pay', 'sign'] as const;
const HOP = 6;

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const pageBox = (k: (typeof ORDER)[number]) => box(F[k].r, DW, DH);

const cursorBox = (f: number) => {
  let prev = pageBox(ORDER[0]);
  for (let i = 0; i < ORDER.length; i++) {
    const cur = F[ORDER[i]];
    if (f < cur.at) {
      const k = i === 0 ? 1 : ramp(f, cur.at - HOP, HOP, EASE.swift);
      const b = pageBox(ORDER[i]);
      return { x: mix(prev.x, b.x, k), y: mix(prev.y, b.y, k), w: mix(prev.w, b.w, k), h: mix(prev.h, b.h, k) };
    }
    prev = pageBox(ORDER[i]);
  }
  return prev;
};

export const Receipt: React.FC = () => {
  const f = useAuthorFrame() - O;
  const hero = useHeroMode();
  const enter = ramp(f, 0, 14, EASE.snappy);
  const push = 1 + 0.02 * ramp(f, 0, END, EASE.linear);
  const landP = (k: (typeof ORDER)[number], extra = 0) => ramp(f, F[k].at + LAND + extra, 14, EASE.snappy);
  const amount = springAt(f, F.total.at + LAND, { damping: 14, stiffness: 240 });
  const cb = cursorBox(f);
  const cursorOp = ramp(f, 2, 6, EASE.out) * (1 - ramp(f, F.sign.at + 8, 8, EASE.exit));
  const title = (k: number) => ramp(f, 6 + k * 5, 22, EASE.out);
  const amtChip = ramp(f, F.sign.at + LAND + 8, 12, EASE.snappy);
  const pageS = mix(0.96, 1, enter) * push;

  return (
    <AbsoluteFill style={{ fontFamily: THAI, overflow: 'hidden' }}>
      <Stage look={L} keyLight={{ x: 0.66, y: 0.15 }} fill={{ x: 0.1, y: 0.9 }} grain={0.035} />
      <div style={{ position: 'absolute', left: 1180, top: 560, width: 900, height: 700, background: `radial-gradient(closest-side, ${alpha(C.c2, 0.08)}, ${alpha(C.c2, 0)})` }} />

      {/* origin tag: the receipt form is JWIC's; it rides the page's corner through the entrance and the breathe */}
      <Tag kind="jw" f={f} at={10} id="jw-rct" style={{ left: DX + PUSH_O.x * (1 - pageS), top: DY + (1 - enter) * 30 + PUSH_O.y * (1 - pageS) - 56 }} />

      <div style={{ visibility: hero ? 'hidden' : undefined, position: 'absolute', left: 140, top: 380, width: 820 }}>
        <div style={{ display: 'flex', fontWeight: 700, fontSize: 96, lineHeight: 1.28, color: C.ink, whiteSpace: 'nowrap' }}>
          {['สร้าง', 'ใบเสร็จรับเงิน'].map((w, k) => {
            const q = title(k);
            return <span key={k} style={{ display: 'inline-block', opacity: q, transform: `translateY(${((1 - q) * 36).toFixed(2)}px)`, filter: q >= 0.999 ? undefined : `blur(${((1 - q) * 10).toFixed(2)}px)`, ...(k === 1 ? gradText : null) }}>{w}</span>;
          })}
        </div>
        <div style={{
          display: 'inline-block', marginTop: 22, padding: '8px 26px', borderRadius: 999, border: `1.5px solid ${C.ink}`, background: '#fff',
          fontWeight: 600, fontSize: 34, color: C.ink, opacity: title(2), transform: `translateY(${((1 - title(2)) * 16).toFixed(2)}px)`,
        }}>{RCT_PILL}</div>
      </div>

      <div style={{
        position: 'absolute', left: DX, top: DY, width: DW, height: DH,
        transform: `translateY(${((1 - enter) * 30).toFixed(2)}px) scale(${pageS.toFixed(5)})`, transformOrigin: `${PUSH_O.x}px ${PUSH_O.y.toFixed(1)}px`, opacity: clamp01(enter * 1.6),
      }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 12, background: '#fff', boxShadow: `inset 0 1px 0 #fff, 0 0 0 1px ${L.line}, 0 2px 4px ${alpha(L.shadow, 0.06)}, 0 40px 90px -20px ${alpha(L.shadow, 0.28)}` }} />
        {ORDER.map((k) => {
          const b = pageBox(k);
          const p = landP(k);
          const sk = 1 - p;
          const isPop = F[k].kind === 'pop';
          const content: React.CSSProperties = isPop
            ? { opacity: clamp01((f - F[k].at - LAND) / 4), transform: `scale(${(k === 'total' ? mix(1.18, 1, amount) : mix(0.6, 1, springAt(f, F[k].at + LAND, { damping: 13, stiffness: 260 }))).toFixed(4)})`, transformOrigin: k === 'total' ? '100% 50%' : '0% 50%' }
            : { opacity: clamp01(p * 1.8), transform: `translateY(${((1 - p) * 18).toFixed(2)}px)`, filter: p < 0.98 ? `blur(${((1 - p) * 6).toFixed(2)}px)` : undefined };
          return (
            <React.Fragment key={k}>
              {sk > 0.001 && (
                <div style={{ position: 'absolute', left: b.x + 8, top: b.y + 6, width: b.w - 16, height: b.h - 12, opacity: sk, display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
                  {[0.82, 0.6].slice(0, b.h > 60 ? 2 : 1).map((w, i) => <div key={i} style={{ height: Math.min(22, b.h / 3), width: `${w * 100}%`, borderRadius: 8, background: '#E6EEEC' }} />)}
                </div>
              )}
              <div style={{ position: 'absolute', inset: 0, ...content }}>
                <DocCrop src={SRC} r={F[k].r} pw={DW} ph={DH} />
              </div>
            </React.Fragment>
          );
        })}
        {/* the rest of the page (rules, small print) inks in after the last field */}
        <Img src={staticFile(SRC)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: ramp(f, F.sign.at + LAND + 6, 12, EASE.out), borderRadius: 12 }} />
        {/* marker on the amount after it lands */}
        <div style={{ position: 'absolute', left: pageBox('total').x - 4, top: pageBox('total').y + 2, width: pageBox('total').w + 8, height: pageBox('total').h - 2, borderRadius: '4px 8px 6px 3px', background: alpha(C.c2, 0.18), transform: `scaleX(${ramp(f, F.total.at + 16, 6, EASE.out).toFixed(4)})`, transformOrigin: 'left center' }} />
        {cursorOp > 0.01 && (
          <div style={{
            position: 'absolute', left: cb.x - 12, top: cb.y - 12, width: cb.w + 24, height: cb.h + 24, borderRadius: 16,
            border: `2.5px solid ${C.c1}`, background: alpha(C.c1, 0.04), opacity: cursorOp,
            boxShadow: `0 0 0 6px ${alpha(C.c1, 0.08)}, 0 10px 30px ${alpha(C.c1, 0.16)}`,
          }}>
            <div style={{ position: 'absolute', right: 14, top: -23, height: 44, padding: '0 16px', borderRadius: 11, background: C.c1, color: '#fff', display: 'flex', alignItems: 'center', gap: 8, fontFamily: THAI, fontWeight: 600, fontSize: 30, whiteSpace: 'nowrap' }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: '#fff', opacity: 0.6 + 0.4 * Math.sin(f / 3) }} />
              ดึงจาก BC
            </div>
          </div>
        )}
        {/* the amount, readable at film size once the page has inked in (final review r2 S6), on the blank paper under
            the total — above it, it hid the invoice line's amounts (final review 2026-10-13) */}
        <div style={{
          position: 'absolute', right: -24, top: pageBox('total').y + pageBox('total').h + 10, height: 52, padding: '0 22px', borderRadius: 26, background: C.c1, color: '#fff',
          display: 'flex', alignItems: 'center', gap: 12, fontFamily: THAI, fontWeight: 700, fontSize: 32, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums',
          opacity: amtChip, transform: `translateY(${((1 - amtChip) * 12).toFixed(2)}px)`, boxShadow: `0 10px 24px ${alpha(C.c1, 0.35)}`,
        }}>53,500.00<span style={{ fontWeight: 600, opacity: 0.85 }}>· โอนเงิน</span></div>
      </div>
    </AbsoluteFill>
  );
};
