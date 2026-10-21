// S5 ในระบบจริง — card-flip-reveal (demos/transition/card-flip-reveal/CardFlipReveal.tsx): three cards, pictogram in front,
// the real JHCore screens and documents behind. Each card flips as its VO line names the thing (semantic pair: the category's
// pictogram → what the system actually produces).
// Kept from the demo: perspective 1600 + preserve-3d, both faces backface-hidden with the back pre-rotated 180°, 4 f anticipation
// to −10°, 16 f bezier(0.55,0,0.3,1) to 194°, spring (damping 15, stiffness 190) back to 180°, translateZ lift on a sin envelope,
// face shading by |cos θ| with the narrow edge light sweeping 56° → 124° and peaking at 90°, the mirrored reflection masked to
// 26 %, the ground shadow scaled by |cos θ|, the back's number springing 1.08 → 1 and its label rising 4 f later, camera
// 1 → 1.03. Adapted: the three flips are timed to the VO lines (not a fixed 12 f stagger), the cards are light (shade ≤ 0.25)
// on the ledger paper, the back holds two real captures (report → form) with a JWIC Thai Localization tag. Skin (owner
// 2026-10-19, skin.ts): paper-slip fronts with an ink border and serif names, hard shadows instead of the reflection and
// the soft ground shadow.
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { EASE, bezier, mix, ramp } from '../../fx/Polish';
import { alpha, springAt } from '../../fx/Look';
import { JwMark } from '../../JwMark';
import { Ground } from '../Ground';
import { BuildingPicto, FlagsPicto, INK } from '../Picto';
import { FONT, M, soft } from '../skin';
import { useSceneFrame } from '../frame';
import { cue } from '../timeline';

const CW = 480, CH = 620, GAP = 48;
const X0 = (1920 - (CW * 3 + GAP * 2)) / 2;
const Y = 200; // cards end at 820, above the subtitle box
const PRE = 4, FLIP = 16, PEAK_DEG = 194;
const flipEase = bezier(0.55, 0, 0.3, 1);

const angleAt = (f: number, s: number) => {
  if (f < s + PRE) return -10 * ramp(f, s, PRE, EASE.out);
  if (f < s + PRE + FLIP) return mix(-10, PEAK_DEG, ramp(f, s + PRE, FLIP, flipEase));
  return PEAK_DEG - (PEAK_DEG - 180) * springAt(f, s + PRE + FLIP, { damping: 15, stiffness: 190 });
};

type Card = {
  category: string; name: string; pal: readonly [string, string]; Picto: React.FC<{ size?: number }>;
  top: { src: string; w: number; h: number; crop?: { y: number; h: number } }; // a 16:9 screen or a landscape report
  bottom: { src: string; w: number; h: number; crop: { y: number; h: number } }; // the top region of an A4 form
  topLabel: string; bottomLabel: string;
};
const CARDS: Card[] = [
  { category: 'Regulatory', name: 'ภ.พ.30', pal: M.badge.doc, Picto: BuildingPicto,
    top: { src: 'docs/sales-vat.png', w: 2573, h: 1819, crop: { y: 0, h: 0.78 } }, topLabel: 'รายงานภาษีขาย · แยกสาขา',
    bottom: { src: 'docs/pp30.png', w: 1819, h: 2573, crop: { y: 0.03, h: 0.32 } }, bottomLabel: 'ภ.พ.30 พร้อมยื่น' },
  { category: 'Regulatory', name: '50 ทวิ', pal: M.badge.tax, Picto: BuildingPicto,
    top: { src: 'screens/direct-wht-info.png', w: 3840, h: 2160 }, topLabel: 'จ่ายผู้ขาย · หัก ณ ที่จ่าย',
    bottom: { src: 'docs/wht-cert.png', w: 1819, h: 2573, crop: { y: 0.04, h: 0.32 } }, bottomLabel: 'หนังสือรับรอง 50 ทวิ · ไฟล์ ภ.ง.ด.' },
  { category: 'National standards', name: 'ใบวางบิล', pal: M.badge.trade, Picto: FlagsPicto,
    top: { src: 'screens/billing-board.png', w: 3840, h: 2160 }, topLabel: 'Billing Board · รอบวางบิลของลูกค้า',
    bottom: { src: 'docs/billing-note.png', w: 1819, h: 2573, crop: { y: 0.03, h: 0.32 } }, bottomLabel: 'ใบวางบิล' },
];

// a region of a capture, drawn at width w (page fractions for the crop), never redrawn (Q1)
const Crop: React.FC<{ src: string; iw: number; ih: number; w: number; crop?: { y: number; h: number }; style?: React.CSSProperties }> = ({ src, iw, ih, w, crop, style }) => {
  const ph = (w * ih) / iw;
  const y = crop ? crop.y * ph : 0;
  const h = crop ? crop.h * ph : ph;
  return <div style={{ width: w, height: h, backgroundImage: `url(${staticFile(src)})`, backgroundSize: `${w}px ${ph}px`, backgroundPosition: `0 ${-y}px`, borderRadius: 16, boxShadow: `inset 0 0 0 1px ${alpha(INK, 0.1)}`, ...style }} />;
};

const FaceLight: React.FC<{ angle: number; max: number }> = ({ angle, max }) => {
  const c = Math.abs(Math.cos((angle * Math.PI) / 180));
  const shade = (1 - c) * max;
  const band = Math.max(0, 1 - Math.abs(angle - 90) / 34);
  const pos = mix(-20, 120, Math.min(1, Math.max(0, (angle - 56) / 68)));
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: '#0E2E2A', opacity: shade }} />
      {band > 0.01 && <div style={{ position: 'absolute', inset: 0, opacity: band * 0.35, background: `linear-gradient(100deg, rgba(255,255,255,0) ${pos - 12}%, rgba(255,255,255,0.9) ${pos}%, rgba(255,255,255,0) ${pos + 12}%)` }} />}
    </>
  );
};

const FlipCard: React.FC<{ i: number; f: number; start: number }> = ({ i, f, start }) => {
  const angle = angleAt(f, start);
  const c = CARDS[i];
  const lift = Math.max(0, Math.sin((Math.min(180, Math.max(0, angle)) * Math.PI) / 180));
  const land = start + PRE + FLIP;
  const num = springAt(f, land - 2, { damping: 18, stiffness: 160 });
  const lab = ramp(f, land + 2, 14, EASE.snappy);
  const P = c.Picto;
  return (
    <div style={{ position: 'absolute', inset: 0, perspective: 1600 }}>
      <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `translateZ(${(lift * 60).toFixed(2)}px) rotateY(${angle.toFixed(3)}deg)` }}>
        {/* front: a gradient badge with the category's pictogram and the one key word */}
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 44, overflow: 'hidden', background: '#fff', fontFamily: FONT }}>
          <div style={{ position: 'absolute', left: '50%', top: 96, width: 300, height: 300, marginLeft: -150, borderRadius: '50%', background: `linear-gradient(155deg, ${c.pal[0]}, ${c.pal[1]})`, boxShadow: `0 30px 44px -16px ${c.pal[1]}aa`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><P size={210} /></div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 64, textAlign: 'center', fontSize: 60, fontWeight: 800, color: M.ink, lineHeight: 1.2, letterSpacing: '-0.01em' }}>{c.name}</div>
          <FaceLight angle={angle} max={0.18} />
        </div>
        {/* back: the real thing */}
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 44, overflow: 'hidden', background: '#fff', fontFamily: FONT }}>
          <div style={{ position: 'absolute', left: 20, top: 20, transform: `scale(${mix(1.08, 1, num).toFixed(4)})`, transformOrigin: 'top left' }}>
            <Crop src={c.top.src} iw={c.top.w} ih={c.top.h} w={CW - 40} crop={c.top.crop} />
          </div>
          <div style={{ position: 'absolute', left: 20, top: 316, transform: `scale(${mix(1.08, 1, num).toFixed(4)})`, transformOrigin: 'top left' }}>
            <Crop src={c.bottom.src} iw={c.bottom.w} ih={c.bottom.h} w={CW - 40} crop={c.bottom.crop} />
          </div>
          <div style={{ position: 'absolute', right: 22, bottom: 20, width: 64, height: 64, borderRadius: 32, background: `linear-gradient(155deg, ${M.badge.doc[0]}, ${M.badge.doc[1]})`, boxShadow: soft(10, 0.25), display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: lab, transform: `scale(${mix(0.6, 1, lab)})` }}>
            <JwMark size={40} id={`jw-s5-${i}`} />
          </div>
          <FaceLight angle={180 - angle} max={0.2} />
        </div>
      </div>
    </div>
  );
};

export const S5RealSystem: React.FC = () => {
  const { f, inOp } = useSceneFrame('s5');
  const starts = [0, 1, 2].map((i) => cue('s5Flips', i)); // แยกตามสาขา · ระบบออกหนังสือรับรอง · วางตามรอบ
  const push = 1 + 0.02 * ramp(f, 0, 640, EASE.smooth);
  return (
    <AbsoluteFill style={{ opacity: inOp }}>
      <Ground field="butter" />
      <AbsoluteFill style={{ transform: `scale(${push.toFixed(4)})`, transformOrigin: '50% 55%' }}>
        {CARDS.map((_, i) => {
          const p = springAt(f, 2 + i * 6, { damping: 14, stiffness: 120 });
          const x = X0 + i * (CW + GAP);
          const cos = Math.abs(Math.cos((angleAt(f, starts[i]) * Math.PI) / 180));
          return (
            <div key={i} style={{ opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 40}px)` }}>
              {/* soft shadow: the card's footprint narrows with |cos θ| as it turns edge-on */}
              <div style={{ position: 'absolute', left: x + (CW * (1 - cos)) / 2, top: Y + 30, width: CW * cos, height: CH - 20, borderRadius: 44, background: 'rgba(70,76,120,0.32)', filter: 'blur(28px)' }} />
              <div style={{ position: 'absolute', left: x, top: Y, width: CW, height: CH }}>
                <FlipCard i={i} f={f} start={starts[i]} />
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
