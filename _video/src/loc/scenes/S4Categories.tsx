// S4 สามหมวด — "modern" look (owner picked it 2026-10-19; story first, less text): Microsoft's three categories one after another, each on its own
// pastel colour field (the colour change is the hand-over): a numbered gradient bubble, the category word, a few short example chips as the
// voice names them, and the category's pictogram in a white disc on the right. Line 7 first shows the three categories as white cards. No gloss
// line and no heading sentence — the voice says it. Hand-over timing is the word-relay's (in 14 f snappy, out 10 f exit, 6 f overlap).
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { EASE, mix, ramp } from '../../fx/Polish';
import { springAt } from '../../fx/Look';
import { Ground } from '../Ground';
import { BuildingPicto, FlagsPicto, RocketPicto } from '../Picto';
import { useSceneFrame } from '../frame';
import { FONT, M, soft, type Field } from '../skin';
import { VO_LOCAL, cue, speechFrames } from '../timeline';
import type { CueName } from '../vo';

const WORD_SIZE = 124;
const DISC = { cx: 1560, cy: 510, d: 470 };
const FIELDS: Field[] = ['mint', 'pink', 'butter']; // one colour field per category
const PAL = [M.badge.doc, M.badge.trade, M.badge.tax] as const;
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const grad = (p: readonly [string, string]) => `linear-gradient(155deg, ${p[0]}, ${p[1]})`;

type Chip = { at: number; text: string };
type Slot = { word: string; in0: number; out0: number | null; chips: Chip[]; Picto: React.FC<{ size?: number }> };

const envelope = (f: number, s: Slot) => {
  const tin = ramp(f, s.in0, 14, EASE.snappy);
  const tout = s.out0 === null ? 0 : ramp(f, s.out0, 10, EASE.exit);
  return { tin, tout, alive: f >= s.in0 - 1 && tout < 1 };
};

const Chips: React.FC<{ f: number; chips: Chip[]; fade: number; slide: number; pal: readonly [string, string] }> = ({ f, chips, fade, slide, pal }) => (
  <div style={{ position: 'absolute', left: 120, top: 484, width: 1020, display: 'flex', flexWrap: 'wrap', gap: '18px 20px', opacity: fade, transform: `translateX(${slide}px)` }}>
    {chips.map((c, i) => {
      const k = springAt(f, c.at, { damping: 13, stiffness: 180 });
      if (f < c.at) return null;
      return (
        <div key={i} style={{ height: 66, padding: '0 28px 0 18px', borderRadius: 33, background: '#fff', boxShadow: soft(12, 0.18), display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT, fontWeight: 600, fontSize: 34, color: M.ink, whiteSpace: 'nowrap', opacity: Math.min(1, k * 2), transform: `translateY(${(1 - Math.min(1, k)) * 24}px) scale(${mix(0.9, 1, Math.min(1.05, k))})` }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: grad(pal), flex: 'none' }} />
          {c.text}
        </div>
      );
    })}
  </div>
);

const NAMES = ['Regulatory', 'National standards', 'Market'];
const PICTOS = [BuildingPicto, FlagsPicto, RocketPicto];

export const S4Categories: React.FC = () => {
  const { f } = useSceneFrame('s4');
  // VO lines 8 (three categories) · 9 Regulatory · 11 National standards · 13 Market (the names are from before line 2 joined)
  const T5 = VO_LOCAL[8], T6 = VO_LOCAL[9], T8 = VO_LOCAL[11], T10 = VO_LOCAL[13];
  const chips = (name: CueName, texts: string[]) => texts.map((text, i) => ({ at: cue(name, i), text })); // each on the word it names
  const SLOTS: Slot[] = [
    { word: 'Regulatory', in0: T6 - 4, out0: T8 - 8, Picto: BuildingPicto, chips: chips('s4Regulatory', ['ภาษีซื้อ · ภาษีขาย แยกสาขา', 'ใบกำกับภาษี', 'ใบลดหนี้ · ใบเพิ่มหนี้', 'หัก ณ ที่จ่าย', 'รายงานเคลื่อนไหวสินค้า', 'ทะเบียนทรัพย์สิน']) },
    { word: 'National standards', in0: T8 - 4, out0: T10 - 8, Picto: FlagsPicto, chips: chips('s4National', ['ใบวางบิล', 'รอบวางบิล', 'ที่อยู่แบบไทย', 'เอกสารไทย / อังกฤษ', 'งบการเงินไทย']) },
    { word: 'Market', in0: T10 - 4, out0: null, Picto: RocketPicto, chips: chips('s4Market', ['รายงานวิเคราะห์ยอดขาย', 'BOT อัตราแลกเปลี่ยน']) },
  ];
  const e = SLOTS.map((s) => envelope(f, s));
  const active = f < SLOTS[1].in0 ? 0 : f < SLOTS[2].in0 ? 1 : 2;
  const relayOn = f >= SLOTS[0].in0 - 1;
  // colour field: mint → pink → butter, cross-faded on the hand-over
  const toPink = ramp(f, SLOTS[1].in0 - 6, 14, EASE.smooth), toButter = ramp(f, SLOTS[2].in0 - 6, 14, EASE.smooth);

  const preview = 1 - ramp(f, SLOTS[0].in0 - 12, 12, EASE.exit);
  const lightAt = cue('s4Light'); // "สามหมวด"
  const seg = (i: number) => ramp(f, lightAt + i * 14, 12, EASE.out);

  return (
    <AbsoluteFill>
      <Ground field={FIELDS[0]} />
      <AbsoluteFill style={{ opacity: toPink }}><Ground field={FIELDS[1]} /></AbsoluteFill>
      <AbsoluteFill style={{ opacity: toButter }}><Ground field={FIELDS[2]} /></AbsoluteFill>

      {/* line 7: the three categories as white cards */}
      {preview > 0.001 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 250, display: 'flex', justifyContent: 'center', gap: 44, opacity: preview }}>
          {PICTOS.map((P, i) => {
            const p = springAt(f, T5 + 16 + i * 10, { damping: 14, stiffness: 130 });
            return (
              <div key={i} style={{ width: 420, height: 400, borderRadius: 52, background: '#fff', boxShadow: soft(30, 0.22), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, opacity: Math.min(1, p * 1.5) * mix(0.6, 1, seg(i)), transform: `translateY(${(1 - p) * 50}px) scale(${mix(0.92, 1, Math.min(1, p))})` }}>
                <div style={{ width: 210, height: 210, borderRadius: '50%', background: grad(PAL[i]), display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 24px 36px -14px ${PAL[i][1]}aa` }}><P size={150} /></div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 36, color: M.ink, whiteSpace: 'nowrap' }}>{NAMES[i]}</div>
              </div>
            );
          })}
        </div>
      )}

      {relayOn &&
        SLOTS.map((s, i) => {
          if (!e[i].alive) return null;
          const { tin, tout } = e[i];
          const P = s.Picto;
          const slide = mix(60, 0, tin) + mix(0, -60, tout);
          const op = clamp01(tin * 1.6) * (1 - tout);
          const bar = ramp(f, s.in0 + 8, 14, EASE.snappy);
          const pic = springAt(f, s.in0 + 4, { damping: 14, stiffness: 130 });
          return (
            <React.Fragment key={s.word}>
              <div style={{ position: 'absolute', left: 120, top: 240, width: 72, height: 72, borderRadius: 36, background: grad(PAL[i]), boxShadow: `0 18px 26px -10px ${PAL[i][1]}aa`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 36, opacity: op, transform: `translateX(${slide}px)` }}>{i + 1}</div>
              <div style={{ position: 'absolute', left: 120, top: 324, opacity: op, transform: `translateX(${slide}px) scale(${mix(1.04, 1, tin)})`, transformOrigin: '0 60%', filter: tin < 0.999 ? `blur(${((1 - tin) * 8).toFixed(2)}px)` : undefined }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <div style={{ position: 'relative', fontFamily: FONT, fontWeight: 800, fontSize: WORD_SIZE, lineHeight: 1.18, color: M.ink, whiteSpace: 'nowrap', letterSpacing: '-0.02em' }}>{s.word}</div>
                  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 4, height: 14, borderRadius: 7, background: grad(PAL[i]), transformOrigin: '0 50%', transform: `scaleX(${bar})` }} />
                </div>
              </div>
              <Chips f={f} chips={s.chips} fade={op} slide={slide} pal={PAL[i]} />
              {/* the pictogram in a white disc */}
              <div style={{ position: 'absolute', left: DISC.cx - DISC.d / 2, top: DISC.cy - DISC.d / 2, width: DISC.d, height: DISC.d, borderRadius: '50%', background: '#fff', boxShadow: soft(34, 0.22), opacity: op, transform: `translateX(${slide * 0.6}px) scale(${mix(0.85, 1, Math.min(1, pic))}) rotate(${mix(-8, 0, Math.min(1, pic))}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: DISC.d - 90, height: DISC.d - 90, borderRadius: '50%', background: grad(PAL[i]), opacity: 0.35, position: 'absolute' }} />
                <div style={{ position: 'relative' }}><P size={290} /></div>
              </div>
            </React.Fragment>
          );
        })}

      {/* bottom: three pills, the current one filling while its category runs (no words) */}
      <div style={{ position: 'absolute', left: 120, right: 120, top: 800, display: 'flex', gap: 24 }}>
        {SLOTS.map((s, i) => {
          const end = s.out0 ?? SLOTS[2].in0 + speechFrames(13) + 40;
          const p = ramp(f, s.in0, end - s.in0, EASE.linear);
          const on = relayOn && i === active;
          return (
            <div key={i} style={{ flex: 1, height: 10, borderRadius: 5, background: 'rgba(52,56,95,0.12)', opacity: mix(0.3, 1, seg(i)), overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 5, background: grad(PAL[i]), opacity: on ? 1 : 0.55, transform: `scaleX(${p})`, transformOrigin: 'left' }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
