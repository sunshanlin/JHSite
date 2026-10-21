// S1 นิยาม — the definition in spoken Thai (owner 2026-10-19), modern skin (skin.ts), on soft cards. Gradient headline word, a gradient bar
// under "การปรับระบบ", a language card (a TH | EN switch) and a document card; the glossy mint sphere (the system) hops from the
// language card onto the document and settles there as the seal while the language card settles back — "ด้วยฟังก์ชันที่รองรับ
// กฎเหล่านั้น ซึ่งมากกว่าแค่การแปลภาษาบนหน้าจอ". VO lines 4 (definition) and 5 (functions); the hop lands on the seal pop in
// sfx.ts (VO_LOCAL[5] + 14).
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { EASE, mix, ramp } from '../../fx/Polish';
import { springAt } from '../../fx/Look';
import { Ground } from '../Ground';
import { useSceneFrame } from '../frame';
import { FONT, M, soft } from '../skin';
import { VO_END_LOCAL, VO_LOCAL, cue } from '../timeline';

const CARD_L = { cx: 610, cy: 610, w: 440, h: 330 };
const CARD_R = { cx: 1310, cy: 610, w: 380, h: 330 };
const SEAL = { x: CARD_R.cx + CARD_R.w / 2 - 78, y: CARD_R.cy + CARD_R.h / 2 - 78, r: 46 };
const R0 = 88;

const Pop: React.FC<{ f: number; at: number; children: React.ReactNode }> = ({ f, at, children }) => {
  const p = springAt(f, at, { damping: 12, stiffness: 190 });
  return <span style={{ display: 'inline-block', position: 'relative', opacity: Math.min(1, p * 3), transform: `translateY(${(1 - p) * 40}px) scale(${mix(0.8, 1, Math.min(1.05, p))})` }}>{children}</span>;
};

export const S1Modern: React.FC = () => {
  const { f } = useSceneFrame('s1');
  const lDef = VO_LOCAL[4], lFn = VO_LOCAL[5];
  const bar = ramp(f, VO_END_LOCAL(4) + 4, 14, EASE.snappy);
  const hopAt = lFn - 8, landAt = lFn + 14;
  const dimAt = cue('s1Dim'); // "แค่การแปลภาษา"

  const pL = springAt(f, lDef + 14, { damping: 14, stiffness: 150 });
  const pR = springAt(f, lDef + 20, { damping: 14, stiffness: 150 });
  const drop = springAt(f, lDef + 26, { damping: 9, stiffness: 120 });
  const dim = ramp(f, dimAt, 14, EASE.out);

  const t = ramp(f, hopAt, landAt - hopAt, EASE.swift);
  const sx = CARD_L.cx, sy = CARD_L.cy - 290;
  const x = mix(sx, SEAL.x, t);
  const y = mix(sy + (1 - drop) * -520, SEAL.y, t) - Math.sin(Math.PI * t) * 190 + (1 - t) * Math.sin(f * 0.1) * 8;
  const r = mix(R0, SEAL.r, t);
  const stretch = 1 + 0.16 * Math.sin(Math.PI * t);
  const green = ramp(f, landAt, 8, EASE.out);
  const seal = springAt(f, landAt, { damping: 11, stiffness: 190 });
  const knob = ramp(f, dimAt - 4, 16, EASE.smooth); // the switch slides from TH to EN as the card settles back

  return (
    <AbsoluteFill>
      <Ground field="pink" />

      <div style={{ position: 'absolute', left: 0, right: 0, top: 112, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, fontFamily: FONT, fontWeight: 800, fontSize: 74, color: M.ink, lineHeight: 1.25, whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
        <Pop f={f} at={lDef + 2}><span style={{ background: M.grad, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', paddingRight: 3 }}>Localization</span></Pop>
        <Pop f={f} at={lDef + 8}>คือ</Pop>
        <Pop f={f} at={lDef + 14}>
          <span style={{ position: 'relative', zIndex: 1 }}>การปรับระบบ</span>
          <span style={{ position: 'absolute', left: 0, right: 0, bottom: 2, height: 14, borderRadius: 7, background: M.grad, transformOrigin: '0 50%', transform: `scaleX(${bar})`, zIndex: 0 }} />
        </Pop>
        <Pop f={f} at={lDef + 20}>ตามกฎของประเทศ</Pop>
      </div>

      {/* language card: a TH | EN switch */}
      <div style={{ position: 'absolute', left: CARD_L.cx - CARD_L.w / 2, top: CARD_L.cy - CARD_L.h / 2, width: CARD_L.w, height: CARD_L.h, borderRadius: 52, background: '#fff', boxShadow: soft(26, 0.24), opacity: pL * mix(1, 0.5, dim), transform: `translateY(${(1 - pL) * 50}px) scale(${mix(0.88, 1, Math.min(1, pL)) * mix(1, 0.96, dim)})`, filter: dim > 0 ? `grayscale(${dim * 0.8})` : undefined, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26 }}>
        <div style={{ position: 'relative', width: 300, height: 96, borderRadius: 48, background: '#EEF5FB' }}>
          <div style={{ position: 'absolute', top: 8, left: 8 + knob * 148, width: 144, height: 80, borderRadius: 40, background: 'linear-gradient(155deg,#3DBFB0,#4FBFAA)', boxShadow: '0 10px 18px -6px rgba(94,194,176,0.55)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', fontFamily: FONT, fontWeight: 800, fontSize: 38 }}>
            <span style={{ flex: 1, textAlign: 'center', lineHeight: '96px', color: knob < 0.5 ? '#fff' : M.inkSoft, position: 'relative' }}>TH</span>
            <span style={{ flex: 1, textAlign: 'center', lineHeight: '96px', color: knob < 0.5 ? M.inkSoft : '#fff', position: 'relative' }}>EN</span>
          </div>
        </div>
      </div>

      {/* document card */}
      <div style={{ position: 'absolute', left: CARD_R.cx - CARD_R.w / 2, top: CARD_R.cy - CARD_R.h / 2, width: CARD_R.w, height: CARD_R.h, borderRadius: 52, background: '#fff', boxShadow: soft(26, 0.24), opacity: pR, transform: `translateY(${(1 - pR) * 50}px) scale(${mix(0.88, 1, Math.min(1, pR))})` }}>
        <div style={{ position: 'absolute', left: 52, top: 58, width: 150, height: 16, borderRadius: 8, background: M.grad }} />
        {[0, 1, 2].map((i) => <div key={i} style={{ position: 'absolute', left: 52, top: 104 + i * 38, width: i === 2 ? 170 : 276, height: 14, borderRadius: 7, background: '#EAF1F8' }} />)}
      </div>

      {/* the sphere: the system, then the green seal */}
      <div
        style={{
          position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', opacity: Math.min(1, drop * 3),
          background: green > 0.5 ? 'radial-gradient(circle at 32% 26%, #A5EADB 0%, #6FCFBD 48%, #35A895 100%)' : 'radial-gradient(circle at 32% 26%, #A5EADB 0%, #6FCFBD 38%, #4FBFAA 72%, #2E7F72 100%)',
          boxShadow: green > 0.5 ? '0 14px 22px -6px rgba(94,194,176,0.55), inset -6px -8px 14px rgba(40,100,90,0.18), inset 5px 6px 10px rgba(255,255,255,0.4)' : '0 40px 60px -16px rgba(94,194,176,0.5), inset -14px -18px 30px rgba(40,100,90,0.18), inset 10px 12px 24px rgba(255,255,255,0.35)',
          transform: `scale(${(green > 0 ? 0.9 + 0.1 * Math.min(1.15, seal) : 1) * (2 - stretch)}, ${stretch})`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <svg width={r * 1.1} height={r * 1.1} viewBox="0 0 40 40" style={{ opacity: green }}>
          <path d="M9 21 L17 29 L32 11" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
