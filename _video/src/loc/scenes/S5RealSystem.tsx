// S5 ในระบบจริง — card-flip-reveal (demos/transition/card-flip-reveal/CardFlipReveal.tsx): three cards, pictogram in front,
// the real JHCore screens and documents behind. Each card flips as its VO line names the thing (semantic pair: the category's
// pictogram → what the system actually produces).
// Kept from the demo: perspective 1600 + preserve-3d, both faces backface-hidden with the back pre-rotated 180°, 4 f anticipation
// to −10°, 16 f bezier(0.55,0,0.3,1) to 194°, spring (damping 15, stiffness 190) back to 180°, translateZ lift on a sin envelope,
// face shading by |cos θ| with the narrow edge light sweeping 56° → 124° and peaking at 90°, the mirrored reflection masked to
// 26 %, the ground shadow scaled by |cos θ|, the back's number springing 1.08 → 1 and its label rising 4 f later, camera
// 1 → 1.03. Adapted: the three flips are timed to the VO lines (not a fixed 12 f stagger), the cards are light (shade ≤ 0.25)
// on the sky ground, the back holds two real captures (report → form) with a JWIC Thai Localization tag, and the reflection
// is faint (0.12) on a light floor.
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { EASE, bezier, mix, ramp, softShadow } from '../../fx/Polish';
import { alpha, springAt } from '../../fx/Look';
import { C, THAI } from '../../theme';
import { JwMark } from '../../JwMark';
import { Ground } from '../Ground';
import { BuildingPicto, HandshakePicto, INK, JADE } from '../Picto';
import { useSceneFrame } from '../frame';
import { VO_LOCAL, speechFrames } from '../timeline';

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
  category: string; name: string; Picto: React.FC<{ size?: number }>;
  top: { src: string; w: number; h: number; crop?: { y: number; h: number } }; // a 16:9 screen or a landscape report
  bottom: { src: string; w: number; h: number; crop: { y: number; h: number } }; // the top region of an A4 form
  topLabel: string; bottomLabel: string;
};
const CARDS: Card[] = [
  { category: 'Regulatory', name: 'ภ.พ.30', Picto: BuildingPicto,
    top: { src: 'docs/sales-vat.png', w: 2573, h: 1819, crop: { y: 0, h: 0.78 } }, topLabel: 'รายงานภาษีขาย · แยกสาขา',
    bottom: { src: 'docs/pp30.png', w: 1819, h: 2573, crop: { y: 0.03, h: 0.32 } }, bottomLabel: 'ภ.พ.30 พร้อมยื่น' },
  { category: 'Regulatory', name: '50 ทวิ', Picto: BuildingPicto,
    top: { src: 'screens/direct-wht-info.png', w: 3840, h: 2160 }, topLabel: 'จ่ายผู้ขาย · หัก ณ ที่จ่าย',
    bottom: { src: 'docs/wht-cert.png', w: 1819, h: 2573, crop: { y: 0.04, h: 0.32 } }, bottomLabel: 'หนังสือรับรอง 50 ทวิ · ไฟล์ ภ.ง.ด.' },
  { category: 'National standards', name: 'ใบวางบิล', Picto: HandshakePicto,
    top: { src: 'screens/billing-board.png', w: 3840, h: 2160 }, topLabel: 'Billing Board · รอบวางบิลของลูกค้า',
    bottom: { src: 'docs/billing-note.png', w: 1819, h: 2573, crop: { y: 0.03, h: 0.32 } }, bottomLabel: 'ใบวางบิล' },
];

// a region of a capture, drawn at width w (page fractions for the crop), never redrawn (Q1)
const Crop: React.FC<{ src: string; iw: number; ih: number; w: number; crop?: { y: number; h: number }; style?: React.CSSProperties }> = ({ src, iw, ih, w, crop, style }) => {
  const ph = (w * ih) / iw;
  const y = crop ? crop.y * ph : 0;
  const h = crop ? crop.h * ph : ph;
  return <div style={{ width: w, height: h, backgroundImage: `url(${staticFile(src)})`, backgroundSize: `${w}px ${ph}px`, backgroundPosition: `0 ${-y}px`, borderRadius: 10, boxShadow: `inset 0 0 0 1px ${alpha(INK, 0.1)}`, ...style }} />;
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
        {/* front: the pictogram card */}
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 34, overflow: 'hidden', background: `linear-gradient(180deg, #ffffff 0%, ${C.sky[1]} 100%)`, boxShadow: `inset 0 0 0 2px ${alpha(JADE, 0.35)}, inset 0 2px 0 #fff`, fontFamily: THAI }}>
          <div style={{ position: 'absolute', left: 36, top: 32, fontSize: 24, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>{c.category}</div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center' }}><P size={220} /></div>
          <div style={{ position: 'absolute', left: 36, right: 36, bottom: 44, fontSize: 64, fontWeight: 800, color: C.green, lineHeight: 1.2 }}>{c.name}</div>
          <FaceLight angle={angle} max={0.25} />
        </div>
        {/* back: the real thing */}
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 34, overflow: 'hidden', background: '#fff', boxShadow: `inset 0 0 0 1.5px ${alpha(INK, 0.08)}, inset 0 2px 0 #fff`, fontFamily: THAI }}>
          <div style={{ position: 'absolute', left: 20, top: 20, transform: `scale(${mix(1.08, 1, num).toFixed(4)})`, transformOrigin: 'top left' }}>
            <Crop src={c.top.src} iw={c.top.w} ih={c.top.h} w={CW - 40} crop={c.top.crop} />
            <div style={{ marginTop: 10, fontSize: 24, fontWeight: 600, color: C.muted, opacity: lab }}>{c.topLabel}</div>
          </div>
          <div style={{ position: 'absolute', left: 20, top: 316, transform: `scale(${mix(1.08, 1, num).toFixed(4)})`, transformOrigin: 'top left' }}>
            <Crop src={c.bottom.src} iw={c.bottom.w} ih={c.bottom.h} w={CW - 40} crop={c.bottom.crop} />
            <div style={{ marginTop: 10, fontSize: 24, fontWeight: 600, color: C.muted, opacity: lab }}>{c.bottomLabel}</div>
          </div>
          <div style={{ position: 'absolute', left: 20, bottom: 18, height: 40, padding: '0 14px 0 6px', borderRadius: 20, background: C.green, color: '#fff', display: 'flex', alignItems: 'center', gap: 8, fontSize: 22, fontWeight: 600, opacity: lab, transform: `translateY(${(1 - lab) * 10}px)` }}>
            <JwMark size={26} id={`jw-s5-${i}`} />
            JWIC Thai Localization
          </div>
          <FaceLight angle={180 - angle} max={0.2} />
        </div>
      </div>
    </div>
  );
};

export const S5RealSystem: React.FC = () => {
  const { f, inOp, outOp } = useSceneFrame('s5');
  const starts = [VO_LOCAL[11] + Math.round(speechFrames(11) * 0.5), VO_LOCAL[12] + Math.round(speechFrames(12) * 0.3), VO_LOCAL[13] + Math.round(speechFrames(13) * 0.3)];
  const push = 1 + 0.03 * ramp(f, 0, 640, EASE.smooth);
  const label = ramp(f, 4, 14, EASE.out);
  return (
    <AbsoluteFill style={{ opacity: inOp * outOp }}>
      <Ground />
      <div style={{ position: 'absolute', left: 120, top: 84, fontFamily: THAI, fontWeight: 600, fontSize: 36, color: C.muted, opacity: label, transform: `translateY(${(1 - label) * 12}px)` }}>
        JWIC Thai Localization บน Business Central
      </div>
      {/* floor line */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: Y + CH + 6, height: 1, background: alpha(INK, 0.08) }} />
      <AbsoluteFill style={{ transform: `scale(${push.toFixed(4)})`, transformOrigin: '50% 60%' }}>
        {CARDS.map((_, i) => {
          const p = springAt(f, 2 + i * 6, { damping: 14, stiffness: 120 });
          const x = X0 + i * (CW + GAP);
          const cos = Math.abs(Math.cos((angleAt(f, starts[i]) * Math.PI) / 180));
          return (
            <div key={i} style={{ opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 40}px)` }}>
              <div style={{ position: 'absolute', left: x, top: Y + CH + 8, width: CW, height: CH, transform: 'scaleY(-1)', transformOrigin: 'center', opacity: 0.12, WebkitMaskImage: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 26%)', maskImage: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 26%)' }}>
                <FlipCard i={i} f={f} start={starts[i]} />
              </div>
              <div style={{ position: 'absolute', left: x + 30, width: CW - 60, top: Y + CH - 16, height: 36, borderRadius: '50%', background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${alpha('#0E2E2A', 0.35)}, ${alpha('#0E2E2A', 0)} 70%)`, transform: `scaleX(${Math.max(0.12, cos).toFixed(3)})` }} />
              <div style={{ position: 'absolute', left: x, top: Y, width: CW, height: CH, boxShadow: softShadow(20, { color: '#0E2E2A', strength: 0.9 }), borderRadius: 34 }}>
                <FlipCard i={i} f={f} start={starts[i]} />
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
