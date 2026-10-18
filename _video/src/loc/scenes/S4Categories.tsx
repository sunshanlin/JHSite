// S4 สามหมวด — word-relay-geometry (demos/typography/word-relay-geometry/WordRelayGeometry.tsx) in the explainer's skin:
// Microsoft's three categories relay through the centre, each with its own geometry and pictogram, and the Thai examples the
// VO names fly in as chips under the word (the demo's "evidence" sub-line, as chips).
// Kept from the demo: per-word envelope (in 14 f snappy scale 1.06 → 1 + 10 px defocus, out 10 f exit scale → 0.86 + 12 px,
// 6 f hand-over overlap), outline-first then fill wiped in with a ±7 % soft-edged mask (18 f swift, outline left at 0.2),
// the three-layer padding trick, geometry 1: dashed ring + 120-tick ring that grows 0.4 → 1 while braking 160°, geometry 2: three
// circles trim-growing with a 6 f phase and then pulling 340 → 300 together with rivet points, word 3: outline → metal gradient →
// one sheen sweep (100°, 300 %) → solid with a bloom, a floor light-line, the bottom 3-segment progress, camera 1 → 1.025.
// Adapted: light ground, jade/green type, no comet on ring 1 (a seal, not speed), the word is 150 px (the long "National
// standards"), the evidence sub-line is chips timed to the VO, and line 5 shows the three pictograms as a preview row.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { EASE, mix, ramp, softShadow } from '../../fx/Polish';
import { alpha, springAt } from '../../fx/Look';
import { C, THAI, TITLE_GRAD } from '../../theme';
import { Ground } from '../Ground';
import { BuildingPicto, HandshakePicto, INK, JADE, RocketPicto } from '../Picto';
import { useSceneFrame } from '../frame';
import { VO_LOCAL, speechFrames } from '../timeline';

const W = 1920, CX = W / 2, CY = 430;
const WORD_SIZE = 150;
const GEO = alpha(C.c1, 0.42);
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

type Chip = { at: number; text: string };
type Slot = { word: string; sub: string; subAt: number; in0: number; out0: number | null; chips: Chip[]; Picto: React.FC<{ size?: number }> };

const envelope = (f: number, s: Slot) => {
  const tin = ramp(f, s.in0, 14, EASE.snappy);
  const tout = s.out0 === null ? 0 : ramp(f, s.out0, 10, EASE.exit);
  return { tin, tout, alive: f >= s.in0 - 1 && tout < 1 };
};

// geometry 1 — the seal ring: dashed ring + tick ring, grows and brakes, then turns slowly (no comet: law is steady)
const RingGeo: React.FC<{ f: number; fade: number }> = ({ f, fade }) => {
  const grow = ramp(f, 0, 22, EASE.snappy);
  const s = mix(0.4, 1, grow);
  const spin = -90 - 160 * (1 - grow) + f * 0.35;
  const spinTicks = 40 * (1 - grow) - f * 0.15;
  const R = 330, RT = 376;
  return (
    <g opacity={fade * mix(0.35, 1, grow)} transform={`translate(${CX} ${CY}) scale(${s})`}>
      <circle r={R} fill="none" stroke={GEO} strokeWidth={2.5} strokeDasharray="10 16" transform={`rotate(${spin})`} />
      <g transform={`rotate(${spinTicks})`}>
        {Array.from({ length: 120 }, (_, k) => {
          const a = (k / 120) * Math.PI * 2;
          const long = k % 10 === 0;
          const r0 = RT - (long ? 18 : 8);
          return <line key={k} x1={r0 * Math.cos(a)} y1={r0 * Math.sin(a)} x2={RT * Math.cos(a)} y2={RT * Math.sin(a)} stroke={long ? alpha(C.c1, 0.55) : alpha(C.c1, 0.22)} strokeWidth={long ? 2 : 1.4} />;
        })}
      </g>
      <circle r={R - 58} fill="none" stroke={alpha(C.c1, 0.1)} strokeWidth={1.4} />
    </g>
  );
};

// geometry 2 — three circles trim in with a phase, then pull together and lock (shared practice)
const LinkGeo: React.FC<{ f: number; fade: number; outF: number | null }> = ({ f, fade, outF }) => {
  const R = 218;
  const tight = ramp(f, 92, 14, EASE.swift);
  const gap = mix(340, 300, tight);
  const click = Math.sin(clamp01((f - 100) / 12) * Math.PI);
  return (
    <g opacity={fade} transform={`translate(${CX} ${CY})`}>
      {[-1, 0, 1].map((k, i) => {
        const grow = ramp(f, 58 + i * 6, 22, EASE.out);
        const back = outF === null ? 0 : ramp(f, outF - 4, 12, EASE.exit);
        const tr = Math.max(0, grow - back);
        const x = k * gap;
        const a = -Math.PI / 2 + tr * Math.PI * 2;
        const tip = tr > 0.001 && grow < 1 ? 1 - clamp01((grow - 0.85) / 0.15) : 0;
        return (
          <g key={k}>
            <circle cx={x} cy={0} r={R} fill="none" stroke={alpha(C.c1, 0.4 + 0.35 * click)} strokeWidth={2.4} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - tr} transform={`rotate(-90 ${x} 0)`} />
            {tip > 0 && <circle cx={x + Math.cos(a) * R} cy={Math.sin(a) * R} r={6} fill={C.c1} opacity={tip} style={{ filter: `drop-shadow(0 0 8px ${alpha(C.c1, 0.9)})` }} />}
          </g>
        );
      })}
      {[-1, 1].flatMap((k) => [-1, 1].map((sy) => {
        const h = Math.sqrt(Math.max(0, R * R - (gap / 2) ** 2));
        const on = ramp(f, 100 + (k + 1) * 1.5 + (sy + 1), 10, EASE.overshoot);
        return (
          <g key={`${k}${sy}`} transform={`translate(${(k * gap) / 2} ${sy * h}) rotate(45) scale(${on})`} opacity={clamp01(on)}>
            <rect x={-6} y={-6} width={12} height={12} fill={C.c1} style={{ filter: `drop-shadow(0 0 10px ${alpha(C.c1, 0.8)})` }} />
          </g>
        );
      }))}
    </g>
  );
};

const Word: React.FC<{ f: number; slot: Slot; last: boolean }> = ({ f, slot, last }) => {
  const { tin, tout } = envelope(f, slot);
  const scale = mix(1.06, 1, tin) * mix(1, 0.86, tout);
  const defocus = (1 - tin) * 10 + tout * 12;
  const fillp = ramp(f, slot.in0 + 10, 18, EASE.swift);
  const FE = 7;
  const edge = fillp * (100 + FE * 2) - FE;
  const mask = `linear-gradient(90deg, #000 ${(edge - FE).toFixed(2)}%, transparent ${(edge + FE).toFixed(2)}%)`;
  const r = f - slot.in0; // local to the word (the demo's Stronger ran 116 → 180: sh 4, sweep 8–32, white 30–42)
  const sh = ramp(r, 4, 10, EASE.out);
  const sweep = ramp(r, 8, 24, EASE.smooth);
  const white = ramp(r, 30, 12, EASE.out);
  const bloom = Math.sin(clamp01((r - 30) / 22) * Math.PI) * 0.9 + white * 0.35;
  const base: React.CSSProperties = { fontFamily: THAI, fontSize: WORD_SIZE, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, whiteSpace: 'nowrap', padding: '0.08em 0.1em 0.28em' };
  return (
    <div style={{ position: 'absolute', left: CX, top: CY, transform: `translate(-50%, ${-0.6 * WORD_SIZE}px) scale(${scale.toFixed(4)})`, transformOrigin: `50% ${0.6 * WORD_SIZE}px`, opacity: clamp01(tin * 1.6) * (1 - tout), filter: defocus > 0.05 ? `blur(${defocus.toFixed(2)}px)` : undefined }}>
      <div style={{ position: 'relative' }}>
        <div style={{ ...base, color: 'transparent', WebkitTextStroke: `2px ${alpha(C.green, 0.55)}`, opacity: last ? 1 - sh * 0.85 : 1 - fillp * 0.8 }}>{slot.word}</div>
        {last ? (
          <>
            <div style={{ ...base, position: 'absolute', inset: 0, color: 'transparent', backgroundImage: TITLE_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', opacity: sh * (1 - white) }}>{slot.word}</div>
            <div style={{ ...base, position: 'absolute', inset: 0, color: 'transparent', backgroundImage: `linear-gradient(100deg, transparent 38%, ${alpha(C.c5, 0.8)} 45%, #ffffff 50%, ${alpha(C.c5, 0.8)} 55%, transparent 62%)`, backgroundSize: '300% 100%', backgroundPosition: `${mix(100, 0, sweep).toFixed(2)}% 0`, WebkitBackgroundClip: 'text', backgroundClip: 'text', opacity: sh * (1 - white) * (sweep > 0 && sweep < 1 ? 1 : 0) }}>{slot.word}</div>
            <div style={{ ...base, position: 'absolute', inset: 0, color: C.green, opacity: white, textShadow: `0 0 ${(30 * bloom).toFixed(1)}px ${alpha(C.c1, 0.35 * bloom)}, 0 0 ${(90 * bloom).toFixed(1)}px ${alpha(C.c1, 0.22 * bloom)}` }}>{slot.word}</div>
          </>
        ) : (
          fillp > 0 && <div style={{ ...base, position: 'absolute', inset: 0, color: C.green, WebkitMaskImage: mask, maskImage: mask }}>{slot.word}</div>
        )}
      </div>
    </div>
  );
};

const ChipRow: React.FC<{ f: number; chips: Chip[]; fade: number }> = ({ f, chips, fade }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: CY + 190, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px 22px', maxWidth: 1100, margin: '0 auto', opacity: fade }}>
    {chips.map((c, i) => {
      const p = springAt(f, c.at, { damping: 13, stiffness: 170 });
      if (p <= 0.001) return null;
      return (
        <div key={i} style={{ height: 62, padding: '0 24px 0 14px', borderRadius: 31, background: 'rgba(255,255,255,0.92)', border: '1.5px solid rgba(255,255,255,0.95)', boxShadow: softShadow(10, { color: '#0E2E2A', strength: 0.8 }), display: 'flex', alignItems: 'center', gap: 12, fontFamily: THAI, fontWeight: 600, fontSize: 32, color: C.green, whiteSpace: 'nowrap', opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 26}px) scale(${mix(0.9, 1, Math.min(1.08, p))})` }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: JADE, flex: 'none' }} />
          {c.text}
        </div>
      );
    })}
  </div>
);

export const S4Categories: React.FC = () => {
  const { f, inOp, outOp } = useSceneFrame('s4');
  const T5 = VO_LOCAL[5], T6 = VO_LOCAL[6], T7 = VO_LOCAL[7], T8 = VO_LOCAL[8], T9 = VO_LOCAL[9], T10 = VO_LOCAL[10];
  const at = (t: number, no: number, frac: number) => t + Math.round(speechFrames(no) * frac);
  const SLOTS: Slot[] = [
    { word: 'Regulatory', sub: 'ข้อกำหนดตามกฎหมาย', subAt: T6 + 36, in0: T6 - 4, out0: T8 - 8, Picto: BuildingPicto,
      chips: [{ at: at(T7, 7, 0.08), text: 'ภาษีมูลค่าเพิ่ม · สาขาภาษี' }, { at: at(T7, 7, 0.36), text: 'รายงานภาษีซื้อ · ภาษีขาย' }, { at: at(T7, 7, 0.6), text: 'ใบกำกับภาษี' }, { at: at(T7, 7, 0.78), text: 'ภาษีหัก ณ ที่จ่าย' }] },
    { word: 'National standards', sub: 'มาตรฐานที่ทั้งประเทศใช้ร่วมกัน', subAt: T8 + 50, in0: T8 - 4, out0: T10 - 8, Picto: HandshakePicto,
      chips: [{ at: at(T9, 9, 0.05), text: 'ใบวางบิล' }, { at: at(T9, 9, 0.62), text: 'รับชำระตามรอบวางบิล' }] },
    { word: 'Market', sub: 'ช่วยให้ทำงานสะดวกขึ้น', subAt: T10 + 50, in0: T10 - 4, out0: null, Picto: RocketPicto,
      chips: [{ at: at(T10, 10, 0.72), text: 'ทะเบียนทรัพย์สิน' }] },
  ];
  const e = SLOTS.map((s) => envelope(f, s));
  const active = f < SLOTS[1].in0 ? 0 : f < SLOTS[2].in0 ? 1 : 2;
  const relayOn = f >= SLOTS[0].in0 - 1;
  const cam = mix(1, 1.025, ramp(f, 0, 1200, EASE.smooth));

  // line 5: heading + the three pictograms as a preview row; the bottom segments light up on "ตามที่มาของข้อบังคับ"
  const head = ramp(f, T5, 18, EASE.out);
  const preview = (1 - ramp(f, SLOTS[0].in0 - 12, 12, EASE.exit));
  const lightAt = at(T5, 5, 0.55);
  const seg = (i: number) => ramp(f, lightAt + i * 14, 12, EASE.out);
  const flare = Math.sin(clamp01((f - (SLOTS[2].in0 + 30)) / 26) * Math.PI);
  const PICTOS = [BuildingPicto, HandshakePicto, RocketPicto];

  return (
    <AbsoluteFill style={{ opacity: inOp * outOp }}>
      <Ground />
      <AbsoluteFill style={{ background: `radial-gradient(900px 500px at 50% 42%, rgba(255,255,255,${(0.35 + 0.3 * flare).toFixed(3)}), transparent 70%)` }} />
      <div style={{ position: 'absolute', left: 120, top: 84, fontFamily: THAI, fontWeight: 600, fontSize: 36, color: C.muted, opacity: head, transform: `translateY(${(1 - head) * 12}px)`, filter: head < 0.999 ? `blur(${((1 - head) * 6).toFixed(2)}px)` : undefined }}>
        Microsoft แบ่ง Localization เป็น 3 หมวด ตามที่มาของข้อบังคับ
      </div>

      <AbsoluteFill style={{ transform: `scale(${cam.toFixed(4)})`, transformOrigin: `${CX}px ${CY}px` }}>
        {/* preview row during line 5 */}
        {preview > 0.001 && (
          <div style={{ position: 'absolute', left: 0, right: 0, top: CY - 110, display: 'flex', justifyContent: 'center', gap: 220, opacity: preview }}>
            {PICTOS.map((P, i) => {
              const p = springAt(f, T5 + 16 + i * 10, { damping: 14, stiffness: 130 });
              return (
                <div key={i} style={{ opacity: Math.min(1, p * 1.5) * mix(0.55, 1, seg(i)), transform: `translateY(${(1 - p) * 30}px) scale(${mix(0.85, 1, p)})`, filter: `saturate(${mix(0.4, 1, seg(i))})` }}>
                  <P size={200} />
                </div>
              );
            })}
          </div>
        )}

        {relayOn && (
          <svg width={W} height={1080} viewBox={`0 0 ${W} 1080`} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            {e[0].alive && <RingGeo f={f - SLOTS[0].in0} fade={1 - e[0].tout} />}
            {e[1].alive && (
              <g transform={`translate(${CX} ${CY}) scale(${mix(1.04, 1, e[1].tin) * mix(1, 0.9, e[1].tout)}) translate(${-CX} ${-CY})`}>
                <LinkGeo f={f - SLOTS[1].in0 + 56} fade={clamp01(e[1].tin * 2) * (1 - e[1].tout)} outF={SLOTS[1].out0 === null ? null : SLOTS[1].out0 - SLOTS[1].in0 + 56} />
              </g>
            )}
          </svg>
        )}

        {/* the floor light-line under the conclusion word */}
        <div style={{ position: 'absolute', left: CX - 700, width: 1400, top: CY + 158, height: 2, background: `linear-gradient(90deg, transparent, ${alpha(C.c1, 0.7)} 50%, transparent)`, opacity: ramp(f, SLOTS[2].in0 + 32, 14, EASE.out) * 0.8, transform: `scaleX(${mix(0.2, 1, ramp(f, SLOTS[2].in0 + 30, 22, EASE.snappy))})`, boxShadow: `0 0 24px ${alpha(C.c1, 0.4)}` }} />

        {SLOTS.map((s, i) => {
          if (!e[i].alive) return null;
          const P = s.Picto;
          const fade = clamp01(e[i].tin * 1.6) * (1 - e[i].tout);
          const sub = ramp(f, s.subAt, 16, EASE.snappy);
          return (
            <React.Fragment key={s.word}>
              <div style={{ position: 'absolute', left: CX - 80, top: 112, opacity: fade, transform: `scale(${mix(1.06, 1, e[i].tin) * mix(1, 0.86, e[i].tout)})`, filter: e[i].tout > 0.02 ? `blur(${(e[i].tout * 8).toFixed(2)}px)` : undefined }}>
                <P size={160} />
              </div>
              <Word f={f} slot={s} last={i === 2} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: CY + 104, textAlign: 'center', fontFamily: THAI, fontWeight: 500, fontSize: 40, color: C.muted, opacity: sub * fade, transform: `translateY(${(1 - sub) * 14}px)`, filter: e[i].tout > 0.02 ? `blur(${(e[i].tout * 6).toFixed(2)}px)` : undefined }}>
                {s.sub}
              </div>
              <ChipRow f={f} chips={s.chips} fade={fade} />
            </React.Fragment>
          );
        })}
      </AbsoluteFill>

      {/* bottom: the three segments, lit on line 5, each filling while its category runs */}
      <div style={{ position: 'absolute', left: 160, right: 160, top: 776, display: 'flex', gap: 24 }}>
        {SLOTS.map((s, i) => {
          const start = s.in0;
          const end = s.out0 ?? SLOTS[2].in0 + speechFrames(10) + 40;
          const p = ramp(f, start, end - start, EASE.linear);
          const on = relayOn && i === active;
          const lit = seg(i);
          return (
            <div key={i} style={{ flex: 1, opacity: mix(0.25, 1, lit) }}>
              <div style={{ height: 3, background: alpha(INK, 0.12), position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
                <div style={{ position: 'absolute', inset: 0, background: on ? C.green : alpha(C.green, 0.45), transform: `scaleX(${p})`, transformOrigin: 'left' }} />
              </div>
              <div style={{ marginTop: 12, fontFamily: THAI, fontSize: 24, letterSpacing: '0.06em', color: on ? C.green : C.muted, fontWeight: on ? 700 : 500 }}>{`0${i + 1}  ${s.word}`}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
