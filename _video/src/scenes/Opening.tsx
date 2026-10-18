// Opening — card-stack (demos/ui-entrance/card-stack/CardStack.tsx) + blur-slide title
// (demos/typography/blur-slide/BlurSlide.tsx).
// Kept from the demo: two-layer motion (own entry spring + shared fan clock), EASE.out-distributed
// "faster and faster" entry over 40 f, spring damping 13 / stiffness 150 from 820 px below, 5 px landing dip,
// 2 % squeeze at 62–72, fan spring damping 20 / stiffness 95 at 68, transform-origin 50% 130%, zIndex = index,
// camera 1 → 1.06 → 0.88 (×1.017 hold), featured card pulled out 72 px with ring + one sheen.
// Adapted: 7 cards (6 real documents + the calendar as the featured centre card), A4 cards 320×452,
// title is blur-slide (y / blur / opacity on one p, EASE.out) in Thai, split by hand into words.
import React from 'react';
import { useHeroMode } from '../heroMode';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { useAuthorFrame } from '../rate';
import { EASE, mix, ramp, softShadow } from '../fx/Polish';
import { Sheen, Stage, alpha, springAt, stagger } from '../fx/Look';
import { C, L, THAI, gradText } from '../theme';
import { FlowCard } from '../Flow';
import { CH, CW, CX, CY, FEATURED, LIFT, N, ORIGIN, ROT, TX, TX_HERO } from './openGeom';
import { SHOTS } from '../timeline';
import { JwMark } from '../JwMark';

// The month's documents in story order (purchase side first), the calendar in the centre. Labels are split at a
// word boundary so each fits the ~140 px strip a fanned card shows past its neighbour.
// each document's label chip wears that document's own colour (owner 2026-10-13: "สี chip ให้ตรงกับสีเอกสาร"),
// sampled from the rasters: the header bar of JWIC's four forms (pastel → deep text of the same hue, ≥ 5:1), the ink
// of the two Revenue Department forms (50 ทวิ prints black-grey, ภ.พ.30 brown → white text)
type Card = { label: string[]; img?: string; tint: string; ink?: string };
const CARDS: Card[] = [
  { label: ['ใบสั่งซื้อ'], img: 'docs/purchase-order.png', tint: '#FFDAB8', ink: '#8A4A12' },
  { label: ['50 ทวิ'], img: 'docs/wht-cert.png', tint: '#3F4848' },
  { label: ['ใบกำกับ', 'ภาษี'], img: 'docs/tax-invoice.png', tint: '#A6DFD5', ink: C.green },
  { label: [], tint: C.c1 }, // calendar
  { label: ['ใบวางบิล'], img: 'docs/billing-note.png', tint: '#DAC7EC', ink: '#4A2A73' },
  { label: ['ใบเสร็จ', 'รับเงิน'], img: 'docs/receipt.png', tint: '#AADBA9', ink: '#1F5A2B' },
  { label: ['ภ.พ.30'], img: 'docs/pp30.png', tint: '#8C645C' },
];

const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

// Entry order = z order: the left documents land left→right, the right ones right→left, the calendar last on
// top, so every card's outer strip (where its label sits) is uncovered in the fan and no zIndex ever changes
// (card-stack pitfall).
const ENTRY = [0, 1, 2, 6, 5, 4, 3]; // card index by entry slot
const ORDER_OF = CARDS_ORDER();
function CARDS_ORDER() { const o: number[] = []; ENTRY.forEach((card, e) => { o[card] = e; }); return o; }
const START = Array.from({ length: N }, (_, i) => 2 + stagger(ORDER_OF[i], N, 40, EASE.out));
const inAt = (f: number, i: number) => (f < START[i] ? 0 : springAt(f, START[i], { damping: 13, stiffness: 150 }));
const DROP = 820;

const DocFace: React.FC<{ c: Card; right: boolean }> = ({ c, right }) => (
  <div style={{ position: 'absolute', inset: 0 }}>
    <Img src={staticFile(c.img!)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
    {/* plain white paper: no coloured tint over the documents (owner 2026-10-13) */}
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 38%)' }} />
    <div style={{
      position: 'absolute', [right ? 'right' : 'left']: 16, bottom: 18, padding: '6px 16px', borderRadius: 16, display: 'flex', flexDirection: 'column',
      alignItems: right ? 'flex-end' : 'flex-start', background: c.tint,
      // a pastel chip keeps its edge on white paper with a hairline in its own text colour
      boxShadow: `${c.ink ? `inset 0 0 0 1.5px ${alpha(c.ink, 0.22)}, ` : ''}0 6px 18px ${alpha(c.ink ?? c.tint, 0.22)}`,
      // 30 px (was 26): the chips are read on a phone too (final review 2026-10-13)
      fontFamily: THAI, fontWeight: 700, fontSize: 30, lineHeight: 1.3, color: c.ink ?? '#fff', whiteSpace: 'nowrap',
    }}>{c.label.map((t) => <span key={t}>{t}</span>)}</div>
  </div>
);

// blur-slide word: opacity / translateY / blur all on one p (the card's core rule)
type Word = { text: string; start: number; dur: number; grad?: boolean };
const Words: React.FC<{ words: Word[]; dy: number; blur: number; style: React.CSSProperties }> = ({ words, dy, blur, style }) => {
  const f = useAuthorFrame() - D;
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', whiteSpace: 'nowrap', ...style }}>
      {words.map((w, i) => {
        const p = ramp(f, w.start, w.dur, EASE.out);
        return (
          <span key={i} style={{
            display: 'inline-block', opacity: p, transform: `translateY(${((1 - p) * dy).toFixed(2)}px)`,
            filter: p >= 0.999 ? undefined : `blur(${((1 - p) * blur).toFixed(2)}px)`, ...(w.grad ? gradText : null),
          }}>{w.text}</span>
        );
      })}
    </div>
  );
};

// Thai has no spaces between words: split by hand (blur-slide pitfall note).
// Story review 2026-10-13: the hook lands one bar earlier, on beat 4 (f70) instead of beat 8 (f133) — the
// words and the product pill run TITLE_EARLY frames ahead of the demo clock; lift / ring / sheen / fan keep it.
const TITLE_EARLY = 63; // beatF(8) − beatF(4)
const TITLE: Word[] = [
  { text: 'ครบ', start: 104 - TITLE_EARLY, dur: 22 },
  { text: 'ทั้งเดือน', start: 108 - TITLE_EARLY, dur: 22 },
  { text: ' ใน', start: 118 - TITLE_EARLY, dur: 22, grad: true },
  { text: 'ระบบเดียว', start: 122 - TITLE_EARLY, dur: 30, grad: true },
];

// Two clocks: the stack starts DS frames in (the first sheet lands within the first half second — final review r2
// S16: the stage was empty for ~1 s), the centre card's lift / ring / sheen keep the demo's frame numbers D frames
// in; the title runs TITLE_EARLY frames ahead of that clock.
const D = 28;
export const DS = 8;
const HANDOFF = SHOTS.b1.from;

export const Opening: React.FC = () => {
  const frame = useAuthorFrame();
  const hero = useHeroMode();
  const f = frame - DS; // stack clock
  const fT = frame - D; // title clock
  const dip = START.reduce((d, s) => d + Math.sin(clamp01((f - s - 6) / 9) * Math.PI) * 5, 0);
  const squeeze = 1 - 0.02 * Math.sin(clamp01((f - 62) / 10) * Math.PI);
  const fan = f < 68 ? 0 : springAt(f, 68, { damping: 20, stiffness: 95 });
  const camPush = mix(1, 1.06, ramp(f, 0, 64, EASE.smooth));
  const cam = mix(camPush, 0.88, ramp(f, 64, 42, EASE.smooth)) * mix(1, 1.017, ramp(fT, 122, 28, EASE.smooth));
  const lift = ramp(fT, 102, 18, EASE.overshoot);
  const ring = ramp(fT, 104, 12, EASE.out) * (1 - ramp(frame, HANDOFF - 10, 10, EASE.out)); // gone before the breath takes the tile
  const sheen = ramp(fT, 108, 22, EASE.smooth);
  const sub = ramp(fT, 130 - TITLE_EARLY, 20, EASE.out);
  const brand = ramp(f, 0, 12, EASE.out);
  const fanW = (hero ? TX_HERO : TX) / TX; // hero 4:5: a narrower fan keeps both outer chips inside the crop

  return (
    <AbsoluteFill style={{ background: L.bg[1] }}>
      <Stage look={L} keyLight={{ x: 0.5, y: 0.1 }} fill={{ x: 0.82, y: 0.95 }} grain={0.035}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 880, height: 200, background: `linear-gradient(180deg, ${alpha('#ffffff', 0)} 0%, ${alpha('#ffffff', 0.5)} 40%, ${alpha('#ffffff', 0)} 100%)` }} />
      </Stage>

      {/* brand eyebrow (frame furniture, does not ride the camera) */}
      <div style={{ visibility: hero ? 'hidden' : undefined, position: 'absolute', left: 96, top: 74, display: 'flex', alignItems: 'center', gap: 16, opacity: brand }}>
        <JwMark size={44} id="jw-open" />
        <div style={{ fontFamily: THAI, fontWeight: 700, fontSize: 32, color: C.ink }}>JWIC Consulting</div>
      </div>

      {/* title + pill. Hero 4:5: the band carries the title, so only the words drop out; the pill (1230 px as one row)
          stacks into the title's place, inside the hero's 1000 px crop and clear of the fan (final review 2026-10-13) */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: hero ? 150 : 118, fontFamily: THAI }}>
        {!hero && <Words words={TITLE} dy={36} blur={10} style={{ fontWeight: 700, fontSize: 104, lineHeight: 1.25, letterSpacing: '-0.01em', color: C.ink }} />}
        {/* the two halves of the product, in the film's tag colours: grey = standard BC (its full product name, plain
            text, no logo — owner 2026-10-13), green JW = JWIC Thai Localization */}
        <div style={{
          display: 'flex', flexDirection: hero ? 'column' : 'row', justifyContent: 'center', alignItems: 'center', gap: hero ? 4 : 16, marginTop: hero ? 0 : 10,
          opacity: sub, transform: `translateY(${((1 - sub) * 16).toFixed(2)}px)`, filter: sub >= 0.999 ? undefined : `blur(${((1 - sub) * 6).toFixed(2)}px)`,
        }}>
          <div style={{ padding: '8px 26px', borderRadius: 999, border: '1.5px solid #C7CDD3', background: '#fff', fontWeight: 600, fontSize: 32, color: '#4A5160', whiteSpace: 'nowrap' }}>Microsoft Dynamics 365 Business Central</div>
          <div style={{ fontWeight: 700, fontSize: 38, lineHeight: 1.2, color: C.muted }}>+</div>
          <div style={{ padding: '6px 26px 6px 8px', borderRadius: 999, background: C.green, color: '#fff', fontWeight: 600, fontSize: 32, display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap', boxShadow: `0 8px 20px ${alpha(C.green, 0.3)}` }}>
            <JwMark size={40} id="jw-pill" />JWIC Thai Localization
          </div>
        </div>
      </div>

      <AbsoluteFill style={{ transform: `scale(${cam.toFixed(4)})`, transformOrigin: `${ORIGIN.x}px ${ORIGIN.y}px` }}>
        <div style={{
          position: 'absolute', left: CX - mix(240, 980 * fanW, fan) / 2, top: CY + CH / 2 - 30 + dip, width: mix(240, 980 * fanW, fan), height: 80,
          borderRadius: '50%', background: `radial-gradient(ellipse at center, ${alpha(L.shadow, 0.24)} 0%, ${alpha(L.shadow, 0)} 70%)`,
          opacity: ramp(f, 6, 20, EASE.out),
        }} />
        <div style={{ position: 'absolute', inset: 0, perspective: '1800px' }}>
          {CARDS.map((c, i) => {
            if (f < START[i]) return null;
            const p = inAt(f, i);
            const y = (1 - p) * DROP;
            const vy = ((1 - inAt(f + 0.5, i)) - (1 - inAt(f - 0.5, i))) * DROP;
            const blurY = Math.min(10, Math.abs(vy) * 0.18);
            const k = i - (N - 1) / 2;
            const jitR = (rand(i * 3 + 1) - 0.5) * 6.4;
            const jitX = (rand(i * 5 + 2) - 0.5) * 22;
            const tilt = (i % 2 ? 1 : -1) * 9 * (y / DROP);
            const rot = mix(jitR + tilt, k * ROT, fan);
            const tx = mix(jitX, k * TX * fanW, fan);
            const feat = i === FEATURED;
            const ly = feat ? -LIFT * lift : 0;
            const elev = 6 + (y / DROP) * 50 + (feat ? 26 * lift : 0);
            return (
              <div key={i} style={{
                position: 'absolute', left: CX - CW / 2, top: CY - CH / 2, width: CW, height: CH, transformOrigin: '50% 130%',
                transform: `translate3d(${tx.toFixed(2)}px, ${(y + dip + ly).toFixed(2)}px, ${i * 2}px) rotate(${rot.toFixed(3)}deg) scale(${squeeze.toFixed(4)})`,
                zIndex: ORDER_OF[i],
                // the breath's big flow takes over here: a 6 f fade under the breath ground, not a one-frame switch (final review 2026-10-13)
                opacity: feat ? 1 - ramp(frame, HANDOFF - 3, 6, EASE.linear) : 1,
              }}>
                {blurY > 0.4 && (
                  <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden>
                    <filter id={`op-vb-${i}`} x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation={`0 ${blurY.toFixed(2)}`} /></filter>
                  </svg>
                )}
                {feat ? (
                  // the process card: the six checkpoints the breaths then walk through, one per shot
                  <div style={{ position: 'absolute', inset: 0, filter: blurY > 0.4 ? `url(#op-vb-${i})` : undefined }}>
                    <div style={{ width: CW, height: CH, borderRadius: 26, boxShadow: ring > 0 ? `0 0 0 ${(3 * ring).toFixed(2)}px ${alpha(C.c1, 0.9 * ring)}` : undefined, position: 'relative', overflow: 'hidden' }}>
                      <FlowCard w={CW} h={CH} elevation={elev} />
                      <Sheen progress={sheen} strength={0.7} width={0.18} />
                    </div>
                  </div>
                ) : (
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: 18, overflow: 'hidden', background: '#fff',
                    border: `1px solid ${L.line}`, boxSizing: 'border-box',
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.9), ${softShadow(elev, { color: L.shadow, strength: 1.1 })}`,
                    filter: blurY > 0.4 ? `url(#op-vb-${i})` : undefined,
                  }}>
                    <DocFace c={c} right={i > FEATURED} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
