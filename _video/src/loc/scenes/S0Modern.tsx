// S0 ทำไมต้องมี — the film opens on the question (owner 2026-10-19), modern skin (skin.ts): a pastel field, the headline with the
// gradient word, a glossy mint sphere (the system) dropping in. Line 3 answers it: dotted spokes run out and squircle badges bloom
// for the three things the voice names (ภาษี · รูปแบบเอกสาร · วิธีปฏิบัติทางการค้า) as the sphere hops out to each (hop.ts). No labels —
// the picture tells it (owner: "เน้นเล่าเรื่องราว"). Every cue lands on the word it illustrates (cue(), vo-cues.json).
// Line 2 between them, the owner's "ลองนึกภาพตาม สมมติ…" with a Thai and a Japanese invoice card, was cut by the owner on
// 2026-10-21. This file was never committed: its picture is kept in _video/out/backup-2026-10-21-with-line2/.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { EASE, mix, ramp } from '../../fx/Polish';
import { springAt } from '../../fx/Look';
import { Ground } from '../Ground';
import { useSceneFrame } from '../frame';
import { FONT, M, soft } from '../skin';
import { VO_LOCAL, cue } from '../timeline';
import { hopOffset } from '../hop';

const CX = 960, CY = 440, R = 100, RX = 560, RY = 235;
type Kind = 'tax' | 'doc' | 'trade' | 'orange' | 'purple' | 'teal' | 'dot';
const SPOKES: { a: number; kind: Kind; named?: number }[] = [
  { a: 180, kind: 'tax', named: 0 }, { a: 0, kind: 'doc', named: 1 }, { a: 90, kind: 'trade', named: 2 },
  { a: 45, kind: 'orange' }, { a: 135, kind: 'purple' }, { a: 225, kind: 'teal' }, { a: 315, kind: 'dot' },
];
const gradOf = (p: readonly [string, string]) => `linear-gradient(155deg, ${p[0]} 0%, ${p[1]} 100%)`;

const Glyph: React.FC<{ kind: Kind }> = ({ kind }) => {
  const w = { stroke: '#fff', strokeWidth: 7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  if (kind === 'tax') return <svg width={70} height={70} viewBox="0 0 70 70"><text x={35} y={52} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={62} fill="#fff">%</text></svg>;
  if (kind === 'doc') return (
    <svg width={70} height={70} viewBox="0 0 70 70">
      <path d="M16 6 H44 L58 20 V60 a4 4 0 0 1 -4 4 H16 a4 4 0 0 1 -4 -4 V10 a4 4 0 0 1 4 -4 Z" fill="#fff" />
      <path d="M22 34 H48 M22 44 H48 M22 54 H38" stroke={M.badge.doc[1]} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
  return <svg width={70} height={70} viewBox="0 0 70 70"><path d="M12 26 H50 M40 15 L52 26 L40 37 M58 46 H20 M30 35 L18 46 L30 57" {...w} /></svg>;
};

const Shape: React.FC<{ kind: Kind }> = ({ kind }) => {
  if (kind === 'orange') return <div style={{ width: 52, height: 52, borderRadius: '50%', background: gradOf(M.badge.trade), boxShadow: soft(10, 0.25) }} />;
  if (kind === 'purple') return <div style={{ width: 44, height: 44, borderRadius: 12, background: gradOf(M.badge.purple), transform: 'rotate(45deg)', boxShadow: soft(10, 0.25) }} />;
  if (kind === 'teal') return <div style={{ width: 0, height: 0, borderTop: '28px solid transparent', borderBottom: '28px solid transparent', borderLeft: `48px solid ${M.badge.teal[1]}`, filter: 'drop-shadow(0 8px 8px rgba(138,219,203,0.4))', borderRadius: 4 }} />;
  return <div style={{ width: 26, height: 26, borderRadius: '50%', background: gradOf(M.coral as unknown as readonly [string, string]), boxShadow: soft(8, 0.3) }} />;
};

const Word: React.FC<{ f: number; at: number; children: React.ReactNode }> = ({ f, at, children }) => {
  const p = springAt(f, at, { damping: 12, stiffness: 190 });
  return <span style={{ display: 'inline-block', opacity: Math.min(1, p * 3), transform: `translateY(${(1 - p) * 40}px) scale(${mix(0.8, 1, Math.min(1.05, p))})` }}>{children}</span>;
};

export const S0Modern: React.FC = () => {
  const { f } = useSceneFrame('s0');
  const l1 = VO_LOCAL[1], l3 = VO_LOCAL[3];
  const slips = [0, 1, 2].map((i) => cue('s0Slips', i)); // ภาษี · รูปแบบเอกสาร · วิธีปฏิบัติ

  const drop = springAt(f, l1 - 2, { damping: 9, stiffness: 120 });
  const dropPrev = springAt(f - 1, l1 - 2, { damping: 9, stiffness: 120 });
  const v = Math.abs(drop - dropPrev);
  const bump = (t: number) => (f < t ? 0 : Math.exp(-(f - t) / 7) * Math.sin((f - t) * 0.7));
  const pulse = 0.05 * slips.reduce((a, t) => a + bump(t), 0);
  const sy = 1 + Math.min(v * 2, 0.3) + pulse, sx = 1 - Math.min(v * 1.1, 0.18) + pulse;
  const hops = SPOKES.filter((s) => s.named !== undefined).map((s) => {
    const r = (s.a * Math.PI) / 180;
    return { at: slips[s.named as number], dx: RX * Math.cos(r), dy: RY * Math.sin(r) };
  });
  const [hx, hy] = hopOffset(f, hops);
  const q = springAt(f, cue('s0Question'), { damping: 10, stiffness: 220 });
  const spokeAt = (i: number) => l3 + 4 + i * 3; // "เพราะแต่ละประเทศมีกฎของตัวเอง": the rules reach out from the system

  return (
    <AbsoluteFill>
      <Ground field="peach" />

      <div style={{ position: 'absolute', left: 0, right: 0, top: 92, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28, fontFamily: FONT, fontWeight: 800, fontSize: 108, color: M.ink, lineHeight: 1.25, letterSpacing: '-0.02em' }}>
        <Word f={f} at={l1 + 2}>ทำไมต้องมี</Word>
        <Word f={f} at={cue('s0Word')}>
          <span style={{ background: M.grad, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', paddingRight: 4 }}>Localization</span>
        </Word>
        <svg width={64} height={104} viewBox="0 0 60 100" style={{ overflow: 'visible', opacity: Math.min(1, q * 3), transform: `scale(${mix(1.8, 1, Math.min(1, q))}) rotate(${mix(-18, 0, Math.min(1, q))}deg)`, transformOrigin: '50% 60%' }}>
          <defs><linearGradient id="q-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#EC7898" /><stop offset="1" stopColor="#F29BB3" /></linearGradient></defs>
          <path d="M10 32 C10 6 50 6 50 32 C50 52 30 52 30 70" fill="none" stroke="url(#q-grad)" strokeWidth={14} strokeLinecap="round" />
          <circle cx={30} cy={92} r={9} fill="#EC7898" />
        </svg>
      </div>

      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {SPOKES.map((s, i) => {
          const r = (s.a * Math.PI) / 180;
          const ex = CX + RX * Math.cos(r), ey = CY + RY * Math.sin(r);
          const len = Math.hypot(ex - CX, ey - CY), nx = (ex - CX) / len, ny = (ey - CY) / len;
          const gap = s.named !== undefined ? 76 : 40;
          const x1 = CX + nx * (R + 16), y1 = CY + ny * (R + 16), x2 = ex - nx * gap, y2 = ey - ny * gap;
          const p = ramp(f, spokeAt(i), 16, EASE.out);
          if (p <= 0) return null;
          return <line key={i} x1={x1} y1={y1} x2={mix(x1, x2, p)} y2={mix(y1, y2, p)} stroke="rgba(46,50,88,0.3)" strokeWidth={6} strokeDasharray="0.1 17" strokeLinecap="round" />;
        })}
      </svg>

      {SPOKES.map((s, i) => {
        const r = (s.a * Math.PI) / 180;
        const ex = CX + RX * Math.cos(r), ey = CY + RY * Math.sin(r);
        if (s.named === undefined) {
          if (f < spokeAt(i) + 12) return null;
          const k = springAt(f, spokeAt(i) + 12, { damping: 10, stiffness: 200 });
          return <div key={i} style={{ position: 'absolute', left: ex, top: ey, transform: `translate(-50%, -50%) scale(${k})` }}><Shape kind={s.kind} /></div>;
        }
        const bt = slips[s.named];
        const k = springAt(f, bt, { damping: 11, stiffness: 190 });
        const pal = s.kind === 'tax' ? M.badge.tax : s.kind === 'doc' ? M.badge.doc : M.badge.trade;
        return (
          <React.Fragment key={i}>
            {f >= spokeAt(i) + 14 && f < bt && <div style={{ position: 'absolute', left: ex - 9, top: ey - 9, width: 18, height: 18, borderRadius: 9, background: '#fff', boxShadow: soft(6, 0.25) }} />}
            {f >= bt && (
              <>
                <div style={{ position: 'absolute', left: ex - 64, top: ey - 64, width: 128, height: 128, borderRadius: 40, background: gradOf(pal), boxShadow: `0 26px 40px -12px ${pal[1]}99, inset 0 -6px 12px rgba(0,0,0,0.12), inset 0 6px 10px rgba(255,255,255,0.35)`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k}) rotate(${(1 - Math.min(1, k)) * -30}deg)` }}><Glyph kind={s.kind} /></div>
              </>
            )}
          </React.Fragment>
        );
      })}

      {/* the system: a glossy mint sphere with a soft glow */}
      {slips.map((t0, i) => {
        const t = f - t0;
        if (t < 0 || t > 26) return null;
        const o = 1 - t / 26;
        return <div key={i} style={{ position: 'absolute', left: CX - R + hx, top: CY - R + hy, width: R * 2, height: R * 2, borderRadius: '50%', border: '4px solid rgba(138,219,203,0.55)', opacity: o, transform: `scale(${1 + (t / 26) * 0.7})` }} />;
      })}
      <div
        style={{
          position: 'absolute', left: CX - R, top: CY - R, width: R * 2, height: R * 2, borderRadius: '50%', opacity: Math.min(1, drop * 3),
          background: 'radial-gradient(circle at 32% 26%, #A5EADB 0%, #6FCFBD 38%, #4FBFAA 72%, #2E7F72 100%)',
          boxShadow: '0 46px 70px -18px rgba(94,194,176,0.5), inset -16px -22px 36px rgba(40,100,90,0.18), inset 12px 14px 28px rgba(255,255,255,0.35)',
          transform: `translate(${hx}px, ${hy + (1 - drop) * -560}px) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`,
        }}
      />
    </AbsoluteFill>
  );
};
