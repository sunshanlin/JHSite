// ใบสั่งซื้อ — owner 2026-10-13 "ฝั่ง PO เน้นแค่มีเอกสารพอ": the shot only says "there is a Thai purchase order form".
// Same layout and grammar as the other document shots (50 ทวิ / receipt): title column on the left, JWIC's printed
// PO form on the right — it pops in 0.86 → 1 (the scan card's document pop) — its totals block is marked on beat 20
// (row-wash scaleX 0 → 1) and a chip reads the total at film size, on the blank paper under the block.
// Hold (final review 2026-10-13: a frozen hold reads as a stalled player): a 2 % push runs to the shot's end (the
// billing note's grammar; the owner forbids deep zooms, 2 % is fine).
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { useAuthorFrame } from '../rate';
import { useHeroMode } from '../heroMode';
import { EASE, mix, ramp, softShadow } from '../fx/Polish';
import { Stage, alpha } from '../fx/Look';
import { C, L, THAI, gradText } from '../theme';
import { SHOTS, TAIL, localBeat } from '../timeline';
import { PO_DATE, PO_NO, PO_TOTAL } from '../data/po';
import { Tag } from '../Tag';

const DW = 640;
const DH = DW * 1.4134;
const DX = 1030;
const DY = 116; // the tag above the form clears the top safe margin (was centred: tag top at 32, final review 2026-10-13)
const TOT = { x: 0.64, y: 0.373, w: 0.338, h: 0.124 }; // totals block on the printed PO (page fractions, fgrid)
export const HIT = localBeat('po', 20); // totals marked on beat 20 (bar downbeat; story review: was beat 24)
const END = SHOTS.po.dur + 2 * TAIL; // last local frame (the scene wakes TAIL early and stays TAIL late)
const PUSH_O = { x: DW / 2, y: DH * 0.12 };

export const PurchaseOrder: React.FC = () => {
  const f = useAuthorFrame();
  const hero = useHeroMode();
  const dp = ramp(f, 6, 12, EASE.snappy);
  const mark = ramp(f, HIT, 12, EASE.out);
  const chip = ramp(f, HIT + 4, 12, EASE.snappy);
  const title = (k: number) => ramp(f, 14 + k * 5, 22, EASE.out);
  const b = { x: TOT.x * DW, y: TOT.y * DH, w: TOT.w * DW, h: TOT.h * DH };
  const push = mix(1, 1.02, ramp(f, 18, END - 18, EASE.linear)); // linear: still moving when the breath takes over
  // about the page's upper centre: its top edge (and the tag riding its corner) rises ≤ 2 px, so the tag stays clear
  // of the top safe margin; the 2 % growth goes into the blank paper at the foot
  const O = PUSH_O;
  const corner = { x: DX + O.x * (1 - push), y: DY + O.y * (1 - push) };
  return (
    <AbsoluteFill style={{ fontFamily: THAI, overflow: 'hidden' }}>
      <Stage look={L} keyLight={{ x: 0.66, y: 0.2 }} fill={{ x: 0.1, y: 0.9 }} grain={0.035} />

      {/* title column */}
      <div style={{ visibility: hero ? 'hidden' : undefined, position: 'absolute', left: 140, top: 380, width: 820 }}>
        <div style={{ display: 'flex', fontWeight: 700, fontSize: 104, lineHeight: 1.28, color: C.ink, whiteSpace: 'nowrap' }}>
          {['สร้าง', 'ใบสั่งซื้อ'].map((w, k) => {
            const q = title(k);
            return <span key={k} style={{ display: 'inline-block', opacity: q, transform: `translateY(${((1 - q) * 36).toFixed(2)}px)`, filter: q >= 0.999 ? undefined : `blur(${((1 - q) * 10).toFixed(2)}px)`, ...(k === 1 ? gradText : null) }}>{w}</span>;
          })}
        </div>
        <div style={{
          display: 'inline-block', marginTop: 22, padding: '8px 26px', borderRadius: 999, border: `1.5px solid ${C.ink}`, background: '#fff', whiteSpace: 'nowrap',
          fontWeight: 600, fontSize: 34, color: C.ink, opacity: title(2), transform: `translateY(${((1 - title(2)) * 16).toFixed(2)}px)`,
        }}>{PO_NO} · {PO_DATE}</div>
      </div>

      {/* JWIC's Thai purchase order form */}
      <div style={{ position: 'absolute', left: DX, top: DY, width: DW, height: DH, transform: `scale(${push.toFixed(5)})`, transformOrigin: `${O.x.toFixed(1)}px ${O.y.toFixed(1)}px` }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 10, overflow: 'hidden', background: '#fff',
          boxShadow: `inset 0 0 0 1px ${L.line}, ${softShadow(mix(22, 8, dp), { color: L.shadow, strength: 1.1 })}`,
          transform: `scale(${mix(0.86, 1, dp).toFixed(4)})`, opacity: Math.min(1, dp * 3),
        }}>
          <Img src={staticFile('docs/purchase-order.png')} style={{ width: '100%', height: '100%' }} />
          <div style={{
            position: 'absolute', left: b.x - 4, top: b.y - 4, width: (b.w + 8) * mark, height: b.h + 8, borderRadius: 6,
            background: alpha(C.green, 0.1), boxShadow: `inset 0 0 0 2px ${alpha(C.green, 0.8)}`,
          }} />
        </div>
        {/* the total, readable at film size: a plain number (owner 2026-10-13), on the blank paper under the marked block
            so it covers none of the rows it sums (final review 2026-10-13: above it, it hid the item line) */}
        <div style={{
          position: 'absolute', right: -24, top: b.y + b.h + 12, height: 52, padding: '0 22px', borderRadius: 26, background: C.c1, color: '#fff',
          display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 32, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums',
          opacity: chip, transform: `translateY(${((1 - chip) * 12).toFixed(2)}px)`, boxShadow: `0 10px 24px ${alpha(C.c1, 0.35)}`,
        }}>{PO_TOTAL}</div>
      </div>
      <Tag kind="jw" f={f} at={10} id="jw-po" style={{ left: corner.x, top: corner.y - 56 }} />
    </AbsoluteFill>
  );
};
