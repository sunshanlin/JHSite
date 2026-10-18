// Process flow with checkpoints — replaces the calendar breath (owner 2026-10-13: "ไม่อยากแสดงเป็นปฏิทินเพราะคน
// คิดตามไม่ทัน แต่ให้เสนอแบบ Flow ซื้อ > จ่าย > ขาย … เป็นเส้น Flow มี Check point แต่ละอัน").
// Card: timeline-travel (demos/data/timeline-travel/TimelineTravel.tsx). Kept from the demo: the travel curve
// (input [0, 0.15, 0.88, 1] → [0, 0.055, 0.9, 1], inOut quad — slow start, sprint, hard brake); a node lights
// hollow → solid over 6 f with its halo 0.6 → 1; the milestone card springs up from the axis (damping 11,
// stiffness 160, mass 0.9, 26 f; scaleY from its bottom edge + scaleX 0.85 → 1, opacity 2×) starting 6 f before
// the arrival, on a hairline stem; label 40 px / 720 with a 28 px secondary line under the node.
// Adapted: the camera does not travel — the progress line's head travels from the previous checkpoint to the new
// one and arrives on the landing beat (breath frame BREATH_LAND); all six checkpoints stay in view so the viewer
// always sees where in the process the film is; passed checkpoints carry a ✓; between breaths the flow docks as a
// vertical mini list where the calendar sat (top-left, x ≤ 284, y ≤ 328), which every scene already keeps clear.
// Each checkpoint carries its December date as the demo's 28 px secondary line (owner 2026-10-13) — muted, under the
// label, so the line still reads as a flow and not as a calendar; the docked list stays without dates.
import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring } from 'remotion';
import { useAuthorFrame } from './rate';
import { EASE, mix, ramp, softShadow } from './fx/Polish';
import { alpha } from './fx/Look';
import { C, THAI } from './theme';
import { BREATHS, BREATH_LAND, SHOTS } from './timeline';
import { JwMark } from './JwMark';

export const STEPS = [
  { t: 'ซื้อ', doc: 'ใบสั่งซื้อ', date: '1 ธ.ค.' },
  { t: 'จ่าย', doc: '50 ทวิ', date: '2 ธ.ค.' },
  { t: 'ขาย', doc: 'ใบกำกับภาษี', date: '3 ธ.ค.' },
  { t: 'วางบิล', doc: 'ใบวางบิล', date: '11 ธ.ค.' },
  { t: 'รับเงิน', doc: 'ใบเสร็จรับเงิน', date: '25 ธ.ค.' },
  { t: 'ปิดงวด', doc: 'ภ.ง.ด.53 · ภ.พ.30', date: '31 ธ.ค.' },
];
// the last checkpoint's card is anchored by its right edge 145 px right of its stem: centred it ended 45 px from the
// frame edge (final review 2026-10-13); 145 mirrors the first card's left margin (its left edge sits at x ≈ 115)
const LAST_CARD_R = 145;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const TRAVEL0 = 8; // head leaves the previous checkpoint (breath frame)
const travelAt = (lf: number) => {
  const t = clamp01((lf - TRAVEL0) / (BREATH_LAND - TRAVEL0));
  return interpolate(t, [0, 0.15, 0.88, 1], [0, 0.055, 0.9, 1], { easing: Easing.inOut(Easing.quad) });
};
const cardSpring = (lf: number) =>
  lf < BREATH_LAND - 6 ? 0 : spring({ frame: lf - (BREATH_LAND - 6), fps: 30, config: { damping: 11, stiffness: 160, mass: 0.9 }, durationInFrames: 26 });

type State = 'done' | 'now' | 'next';
const stateOf = (i: number, k: number): State => (i < k ? 'done' : i === k ? 'now' : 'next');

// one checkpoint: halo + core; ✓ once passed
const Node: React.FC<{ size: number; lit: number; check: number; now: boolean }> = ({ size, lit, check, now }) => {
  const core = size * 0.5;
  return (
    <div style={{ position: 'absolute', left: -size / 2, top: -size / 2, width: size, height: size }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: lit > 0 ? alpha(C.c1, now ? 0.2 : 0.12) : 'rgba(20,22,28,0.05)', transform: `scale(${(0.6 + 0.4 * lit).toFixed(3)})` }} />
      <div style={{
        position: 'absolute', left: (size - core) / 2, top: (size - core) / 2, width: core, height: core, borderRadius: '50%', boxSizing: 'border-box',
        border: `${Math.max(2, size * 0.06).toFixed(1)}px solid ${lit > 0.5 ? C.c1 : '#B9C7C4'}`, background: lit > 0.5 ? C.c1 : '#F4F6F5',
      }}>
        {check > 0 && (
          <svg viewBox="0 0 24 24" style={{ position: 'absolute', inset: '18%', overflow: 'visible' }}>
            <path d="M5 12.5 L10 17 L19 7.5" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={(1 - check).toFixed(3)} />
          </svg>
        )}
      </div>
    </div>
  );
};

// ── big flow (breaths) ──
type Geo = { vertical: boolean; pos: (i: number) => { x: number; y: number }; node: number; label: number; date: number; doc: number; line: number };
const GEO_H: Geo = { vertical: false, pos: (i) => ({ x: 260 + i * 280, y: 560 }), node: 64, label: 44, date: 28, doc: 40, line: 6 };
// hero 4:5 (1080 × 1350): a vertical flow fills the frame; its date line is 36 px, the hero is seen ~490 px wide
const GEO_V: Geo = { vertical: true, pos: (i) => ({ x: 250, y: 240 + i * 156 }), node: 76, label: 64, date: 36, doc: 46, line: 8 };

export const FlowBig: React.FC<{ k: number; lf: number; geo?: 'h' | 'v' }> = ({ k, lf, geo = 'h' }) => {
  const G = geo === 'v' ? GEO_V : GEO_H;
  const p0 = k === 0 ? (G.vertical ? { x: G.pos(0).x, y: G.pos(0).y - 110 } : { x: G.pos(0).x - 110, y: G.pos(0).y }) : G.pos(k - 1);
  const p1 = G.pos(k);
  const tr = travelAt(lf);
  const head = { x: mix(p0.x, p1.x, tr), y: mix(p0.y, p1.y, tr) };
  const first = G.pos(0), last = G.pos(STEPS.length - 1);
  const lit = ramp(lf, BREATH_LAND - 6, 6, EASE.linear);
  const check = ramp(lf, BREATH_LAND, 8, EASE.out);
  const s = cardSpring(lf);
  // first breath: the checkpoints arrive one by one (4 f apart) before the head sets off
  const appear = (i: number) => (k === 0 ? ramp(lf, 2 + i * 3, 10, EASE.overshoot) : 1);
  const lineStart = k === 0 ? p0 : first;
  return (
    <AbsoluteFill style={{ fontFamily: THAI }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <line x1={lineStart.x} y1={lineStart.y} x2={last.x} y2={last.y} stroke="#C9D6D3" strokeWidth={G.line} strokeLinecap="round" opacity={k === 0 ? ramp(lf, 0, 12, EASE.out) : 1} />
        <line x1={lineStart.x} y1={lineStart.y} x2={head.x} y2={head.y} stroke={C.c1} strokeWidth={G.line} strokeLinecap="round" />
      </svg>
      {STEPS.map((st, i) => {
        const S = stateOf(i, k);
        const p = G.pos(i);
        const a = appear(i);
        const l = S === 'done' ? 1 : S === 'now' ? lit : 0;
        const ch = S === 'done' ? 1 : S === 'now' ? check : 0;
        const col = S === 'now' ? C.green : S === 'done' ? C.ink : C.muted;
        const lab: React.CSSProperties = G.vertical
          ? { position: 'absolute', left: G.node * 0.75, top: -G.label * 0.68, whiteSpace: 'nowrap' }
          : { position: 'absolute', left: -150, width: 300, top: G.node * 0.62, textAlign: 'center' };
        return (
          <div key={i} style={{ position: 'absolute', left: p.x, top: p.y, opacity: a, transform: `scale(${mix(0.6, 1, a).toFixed(3)})` }}>
            <Node size={G.node} lit={l} check={ch} now={S === 'now'} />
            <div style={{ ...lab, fontWeight: S === 'next' ? 600 : 700, fontSize: G.label, lineHeight: 1.3, color: col, opacity: S === 'next' ? 0.7 : 1 }}>
              {st.t}
              <div style={{ fontWeight: 600, fontSize: G.date, lineHeight: 1.25, color: C.muted, marginTop: G.vertical ? -4 : 0 }}>{st.date}</div>
            </div>
          </div>
        );
      })}
      {/* milestone card: the document this step makes, springing up from the checkpoint */}
      {s > 0 && (() => {
        const p = G.pos(k);
        const STEM = G.vertical ? 0 : 36;
        const last = k === STEPS.length - 1;
        // the 4:5 hero's last card (the longest name) ran 20 px past the frame edge at 46 px: 40 px ends it ~60 px inside
        const docSize = G.vertical && last ? 40 : G.doc;
        const wrap: React.CSSProperties = G.vertical
          ? { position: 'absolute', left: p.x + G.node * 0.75 + 250, top: p.y - 58, transformOrigin: '0% 50%', transform: `scaleX(${s.toFixed(4)}) scaleY(${(0.85 + 0.15 * s).toFixed(4)})` }
          : {
            position: 'absolute', left: p.x + (last ? LAST_CARD_R : 0), top: p.y - G.node / 2 - 8 - STEM, transformOrigin: last ? `calc(100% - ${LAST_CARD_R}px) 100%` : '50% 100%',
            transform: `translateX(${last ? -100 : -50}%) translateY(-100%) scaleY(${s.toFixed(4)}) scaleX(${(0.85 + 0.15 * s).toFixed(4)})`,
          };
        return (
          <>
            {!G.vertical && <div style={{ position: 'absolute', left: p.x - 0.5, top: p.y - G.node / 2 - 8 - STEM * Math.min(1, s), width: 1, height: STEM * Math.min(1, s), background: alpha(C.c1, 0.5) }} />}
            <div style={{ ...wrap, opacity: Math.min(1, s * 2) }}>
              <div style={{
                padding: G.vertical ? '18px 30px' : '20px 34px', borderRadius: 18, background: '#fff', border: `1px solid ${alpha(C.c1, 0.3)}`,
                boxShadow: `inset 0 1px 0 #fff, ${softShadow(14, { color: '#0E2E2A', strength: 1.1 })}`, whiteSpace: 'nowrap', textAlign: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontWeight: 700, fontSize: docSize, color: C.ink, lineHeight: 1.3 }}><JwMark size={Math.round(docSize * 0.95)} id={`jw-flow-${k}`} />{STEPS[k].doc}</div>
              </div>
            </div>
          </>
        );
      })()}
    </AbsoluteFill>
  );
};

// ── mini flow (docked during the shots, and in the hero's title band) ──
// compact (hero band): only the nodes and the current step's label, 43 px (≥ 40 px under the band's 0.95 scale) on a
// 220 px panel — six 28 px labels shrank to ~13 px at the hero's ~490 px display width (final review 2026-10-13)
export const MINI_W = 200, MINI_H = 264;
export const FlowMini: React.FC<{ k: number; compact?: boolean }> = ({ k, compact = false }) => {
  const ROW = 40, TOP = 32, NX = 34;
  return (
    <div style={{
      position: 'relative', width: compact ? 220 : MINI_W, height: MINI_H, borderRadius: 22, background: 'rgba(255,255,255,0.94)', border: '1.5px solid #fff',
      boxShadow: `inset 0 1px 0 #fff, ${softShadow(10, { color: '#0E2E2A', strength: 1 })}`, fontFamily: THAI,
    }}>
      <div style={{ position: 'absolute', left: NX - 1.5, top: TOP, width: 3, height: ROW * (STEPS.length - 1), background: '#D3DEDB', borderRadius: 2 }} />
      <div style={{ position: 'absolute', left: NX - 1.5, top: TOP, width: 3, height: ROW * k, background: C.c1, borderRadius: 2 }} />
      {STEPS.map((st, i) => {
        const S = stateOf(i, k);
        return (
          <div key={i} style={{ position: 'absolute', left: NX, top: TOP + i * ROW }}>
            <Node size={S === 'now' ? 30 : 24} lit={S === 'next' ? 0 : 1} check={S === 'next' ? 0 : 1} now={S === 'now'} />
            {(!compact || S === 'now') && (
              <div style={{
                position: 'absolute', left: 26, top: compact ? -29 : -19, whiteSpace: 'nowrap', fontSize: compact ? 43 : 28, lineHeight: compact ? '58px' : '38px',
                fontWeight: S === 'now' ? 700 : S === 'done' ? 600 : 500, color: S === 'now' ? C.green : S === 'done' ? C.ink : C.muted, opacity: S === 'next' ? 0.75 : 1,
              }}>{st.t}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── opening: the fan's centre card shows the whole process, nothing passed yet ──
export const FlowCard: React.FC<{ w: number; h: number; elevation: number }> = ({ w, h, elevation }) => {
  const HEAD = 66, ROW = (h - HEAD - 70) / (STEPS.length - 1), NX = 58;
  return (
    <div style={{
      position: 'relative', width: w, height: h, borderRadius: 26, overflow: 'hidden', background: 'rgba(255,255,255,0.97)', border: '1.5px solid #fff',
      boxShadow: `inset 0 1px 0 #fff, ${softShadow(elevation, { color: '#0E2E2A', strength: 1.1 })}`, fontFamily: THAI,
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: HEAD, background: `linear-gradient(90deg, ${C.c1}, ${C.c2})`, color: '#fff', fontWeight: 600, fontSize: 30, lineHeight: `${HEAD}px`, textAlign: 'center' }}>ธันวาคม 2569</div>
      <div style={{ position: 'absolute', left: NX - 2, top: HEAD + 35, width: 4, height: ROW * (STEPS.length - 1), background: '#D3DEDB', borderRadius: 2 }} />
      {STEPS.map((st, i) => (
        <div key={i} style={{ position: 'absolute', left: NX, top: HEAD + 35 + i * ROW }}>
          <Node size={38} lit={0} check={0} now={false} />
          {/* the date rides after the label as a muted secondary (no room for a second line in a 63 px row) */}
          <div style={{ position: 'absolute', left: 36, top: -24, display: 'flex', alignItems: 'baseline', gap: 12, whiteSpace: 'nowrap', lineHeight: '48px' }}>
            <span style={{ fontSize: 34, fontWeight: 700, color: C.ink }}>{st.t}</span>
            <span style={{ fontSize: 28, fontWeight: 600, color: C.muted }}>{st.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── global layer: one set of checkpoints that morphs between the big flow (breaths) and the docked mini list
// (shots), like motion's layoutId shared-element moves (motion-framer skill, owner 2026-10-13): each checkpoint
// springs to its new place on motion's "stiff" preset (stiffness 400, damping 30; "gentle" 100 / 20 left the
// checkpoints crossing the next shot for ~1.5 s), staggered 2 f out to the corner and 1 f back to the centre so
// the line is in place before the head travels.
// The line is drawn through the checkpoints' current positions, so it turns from horizontal to vertical with them.
const MINI = { x: 84, y: 64 };
const M_ROW = 40, M_TOP = 32, M_NX = 34;
const miniPos = (i: number) => ({ x: MINI.x + M_NX, y: MINI.y + M_TOP + i * M_ROW });
const OUT = 12;
const STIFF = { stiffness: 400, damping: 30, mass: 1 };
const sp = (f: number, start: number, config: typeof STIFF) => (f < start ? 0 : spring({ frame: f - start, fps: 30, config }));

// Date chip: the current step's date, held in the middle of the empty upper frame for the whole breath. As a 28 px
// second line under the node it read as a footnote and the breath was over before it was read (owner 2026-10-14:
// "ส่วนนี้มันโล่งไป อ่านไม่ทัน … โชว์มันตรงกลาง"). Drawn as a calendar tile (owner 2026-10-14) — the gradient month band of the
// opening's FlowCard over one big day number, its band in the palette's rose (owner 2026-10-14: a calendar's month band is red) — so a glance reads it as a date, not as a label. It pops 9 f into the
// breath — 15 f before the card — so the date is on screen for most of the travel, and leaves with the card when the
// flow docks. It waits for the breath ground to go opaque (frame 7, Main.tsx) like the checkpoints do, or it crosses
// the outgoing shot's title. Centred at y 250: the tile ends at y ≈ 356, the card's top sits at y ≈ 404.
const CHIP = { x: 960, y: 250, w: 232, head: 62 };
const dayOf = (d: string) => d.split(' ')[0];
const DateChip: React.FC<{ k: number; lf: number; vis: number }> = ({ k, lf, vis }) => {
  const s = lf < 9 ? 0 : spring({ frame: lf - 9, fps: 30, config: { damping: 12, stiffness: 170, mass: 0.9 }, durationInFrames: 24 });
  if (vis <= 0.001 || s <= 0.001) return null;
  return (
    <div style={{
      position: 'absolute', left: CHIP.x, top: CHIP.y, opacity: Math.min(1, s * 2) * vis,
      transform: `translate(-50%, -50%) scale(${mix(0.86, 1, s).toFixed(4)})`,
    }}>
      <div style={{
        width: CHIP.w, borderRadius: 26, overflow: 'hidden', background: '#fff', border: `1px solid ${alpha(C.c1, 0.3)}`,
        boxShadow: `inset 0 1px 0 #fff, ${softShadow(16, { color: '#0E2E2A', strength: 1.1 })}`, textAlign: 'center',
      }}>
        <div style={{ height: CHIP.head, background: `linear-gradient(90deg, ${C.c3}, ${C.c4})`, color: '#fff', fontWeight: 600, fontSize: 32, lineHeight: `${CHIP.head}px` }}>ธันวาคม</div>
        <div style={{ fontWeight: 700, fontSize: 104, lineHeight: '144px', color: C.green, letterSpacing: '-0.02em' }}>{dayOf(STEPS[k].date)}</div>
      </div>
    </div>
  );
};

const stepAt = (f: number) => {
  let k = -1;
  for (let i = 0; i < BREATHS.length; i++) if (f >= SHOTS[BREATHS[i]].from) k = i;
  return k;
};

export const FlowLayer: React.FC<{ hideAfter: number }> = ({ hideAfter }) => {
  const f = useAuthorFrame();
  const k = stepAt(f);
  if (k < 0) return null; // the opening owns the screen
  const fade = interpolate(f, [hideAfter, hideAfter + 12], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (fade <= 0) return null;
  const G = GEO_H;
  const b = SHOTS[BREATHS[k]];
  const lf = f - b.from;
  // dock factor per checkpoint: 0 = big flow, 1 = corner list. The unfold waits 6 f for the breath ground (opaque
  // from its 7th frame) so the checkpoints no longer cross the outgoing shot's title (final review 2026-10-13); the
  // head's travel and its beat landing are unchanged
  const dockOf = (i: number) => {
    const out = sp(f, b.end - OUT + i * 2, STIFF);
    const inn = k === 0 ? 1 : sp(f, b.from + 6 + i, STIFF);
    return Math.min(1, Math.max(0, 1 - inn + out));
  };
  // labels show only near either end of the morph: in flight the six of them piled up on one another
  // (the docked rows are 40 px apart, so a docked label shows only in the last 10 % of its flight)
  const labelVis = (d: number) => Math.max(clamp01(1 - d / 0.2), clamp01((d - 0.9) / 0.1));
  const D = STEPS.map((_, i) => dockOf(i));
  const pos = STEPS.map((_, i) => {
    const a = G.pos(i), m = miniPos(i);
    return { x: mix(a.x, m.x, D[i]), y: mix(a.y, m.y, D[i]) };
  });
  const docked = Math.min(...D);
  // head: travels from checkpoint k−1 to k on the beat while the flow is big; sits on k once docked
  const tr = travelAt(lf);
  const from = k === 0 ? { x: pos[0].x - 110 * (1 - D[0]), y: pos[0].y } : pos[k - 1];
  const head = { x: mix(from.x, pos[k].x, tr), y: mix(from.y, pos[k].y, tr) };
  const lit = ramp(lf, BREATH_LAND - 6, 6, EASE.linear);
  const check = ramp(lf, BREATH_LAND, 8, EASE.out);
  const s = cardSpring(lf) * (1 - D[k]);
  const lastCard = k === STEPS.length - 1;
  const appear = (i: number) => (k === 0 ? ramp(lf, 2 + i * 3, 10, EASE.overshoot) : 1);
  const lineW = mix(G.line, 3, docked);
  const seg = (i: number) => `M${pos[i].x.toFixed(1)},${pos[i].y.toFixed(1)} L${pos[i + 1].x.toFixed(1)},${pos[i + 1].y.toFixed(1)}`;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: fade, fontFamily: THAI }}>
      {/* the docked list's panel appears once every checkpoint has arrived */}
      <div style={{
        position: 'absolute', left: MINI.x, top: MINI.y, width: MINI_W, height: MINI_H, borderRadius: 22, opacity: docked,
        background: 'rgba(255,255,255,0.94)', border: '1.5px solid #fff', boxShadow: `inset 0 1px 0 #fff, ${softShadow(10, { color: '#0E2E2A', strength: 1 })}`,
      }} />
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {k === 0 && D[0] < 1 && <path d={`M${(pos[0].x - 110).toFixed(1)},${pos[0].y} L${pos[0].x},${pos[0].y}`} stroke="#C9D6D3" strokeWidth={lineW} strokeLinecap="round" opacity={(1 - D[0]) * ramp(lf, 0, 12, EASE.out)} />}
        {STEPS.slice(0, -1).map((_, i) => <path key={`b${i}`} d={seg(i)} stroke="#C9D6D3" strokeWidth={lineW} strokeLinecap="round" fill="none" opacity={k === 0 ? appear(i + 1) : 1} />)}
        {STEPS.slice(0, Math.max(0, k)).map((_, i) => (i < k - 1 ? <path key={`p${i}`} d={seg(i)} stroke={C.c1} strokeWidth={lineW} strokeLinecap="round" fill="none" /> : null))}
        <path d={`M${from.x.toFixed(1)},${from.y.toFixed(1)} L${head.x.toFixed(1)},${head.y.toFixed(1)}`} stroke={C.c1} strokeWidth={lineW} strokeLinecap="round" fill="none" />
      </svg>
      {STEPS.map((st, i) => {
        const S = stateOf(i, k);
        const d = D[i];
        const a = appear(i);
        const l = S === 'done' ? 1 : S === 'now' ? lit : 0;
        const ch = S === 'done' ? 1 : S === 'now' ? check : 0;
        const size = mix(G.node, S === 'now' ? 30 : 24, d);
        const fs = mix(G.label, 28, d);
        const col = S === 'now' ? C.green : S === 'done' ? C.ink : C.muted;
        return (
          <div key={i} style={{ position: 'absolute', left: pos[i].x, top: pos[i].y, opacity: a, transform: `scale(${mix(0.6, 1, a).toFixed(3)})` }}>
            <Node size={size} lit={l} check={ch} now={S === 'now'} />
            {/* label: centred under the checkpoint in the big flow, left-aligned beside it in the list; the date line
                belongs to the big flow only */}
            <div style={{
              position: 'absolute', left: mix(0, 26, d), top: mix(G.node * 0.62, -19, d), whiteSpace: 'nowrap', fontSize: fs, lineHeight: 1.3,
              transform: `translateX(${(-50 * (1 - d)).toFixed(2)}%)`, fontWeight: S === 'now' ? 700 : S === 'done' ? 600 : 500, color: col,
              opacity: (S === 'next' ? 0.72 : 1) * labelVis(d), textAlign: 'center',
            }}>
              {st.t}
              {d < 0.2 && <div style={{ fontWeight: 600, fontSize: G.date, lineHeight: 1.3, color: C.muted, opacity: clamp01(1 - d / 0.2) }}>{st.date}</div>}
            </div>
          </div>
        );
      })}
      {/* milestone card: the document this step makes, springing up from the checkpoint */}
      {s > 0.001 && (
        <>
          <div style={{ position: 'absolute', left: pos[k].x - 0.5, top: pos[k].y - G.node / 2 - 8 - 36 * Math.min(1, s), width: 1, height: 36 * Math.min(1, s), background: alpha(C.c1, 0.5) }} />
          <div style={{
            position: 'absolute', left: pos[k].x + (lastCard ? LAST_CARD_R : 0), top: pos[k].y - G.node / 2 - 8 - 36, opacity: Math.min(1, s * 2),
            transformOrigin: lastCard ? `calc(100% - ${LAST_CARD_R}px) 100%` : '50% 100%',
            transform: `translateX(${lastCard ? -100 : -50}%) translateY(-100%) scaleY(${s.toFixed(4)}) scaleX(${(0.85 + 0.15 * s).toFixed(4)})`,
          }}>
            <div style={{
              padding: '20px 34px', borderRadius: 18, background: '#fff', border: `1px solid ${alpha(C.c1, 0.3)}`, whiteSpace: 'nowrap',
              boxShadow: `inset 0 1px 0 #fff, ${softShadow(14, { color: '#0E2E2A', strength: 1.1 })}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontWeight: 700, fontSize: G.doc, color: C.ink, lineHeight: 1.3 }}><JwMark size={Math.round(G.doc * 0.95)} id={`jw-flow-${k}`} />{STEPS[k].doc}</div>
            </div>
          </div>
        </>
      )}
      <DateChip k={k} lf={lf} vis={1 - D[k]} />
    </AbsoluteFill>
  );
};

// hero breath: the vertical big flow, held centred for the whole segment (the hero has no docked list)
export const FlowHeroBreath: React.FC<{ k: number }> = ({ k }) => {
  const lf = useAuthorFrame();
  return <FlowBig k={k} lf={lf} geo="v" />;
};
