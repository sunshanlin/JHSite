// S3 ใบกำกับภาษี — before-after-slider-scrub (demos/data/before-after-slider-scrub/BeforeAfterSliderScrub.tsx) on an A4 page:
// Business Central's Posted Sales Invoice page hands over a plain A4 invoice pictogram (what BC creates), then the divider sweeps
// across the same A4 frame and reveals JWIC's printed ใบกำกับภาษี (what Localization fills in). Three "+" chips mark the items
// the Revenue Department asks for. Positive framing throughout (owner 2026-10-18): the two layers are "what BC makes" and "what
// Localization adds", there is no before/after label and nothing is marked missing.
// Kept from the demo: 4 f pre-pull (8 → 6.5 %), 12 f fling to 76 % (EASE.out), 12 f bounce to 70 % (smooth), an 18 f hold, then a
// slow scrub at ~1/5 of the fling speed; clip-path inset follows the bar; 2 px white bar with hairline + soft shadow; 76 px round
// handle with the double arrow, scaleX squish by speed (peak 1.18), 6 % press while flung, directional SpeedBlur on bar + handle;
// the revealed layer carries its own tag that is clipped with it. Adapted: the scrub runs forward to 104 % (the whole form stays
// on screen for the chips) instead of back to 40 %, and the page is A4 (560 × 792) rather than the full frame.
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { EASE, SpeedBlur, mix, ramp, velocity } from '../../fx/Polish';
import { alpha, springAt } from '../../fx/Look';
import { C, THAI } from '../../theme';
import { OriginTag } from '../OriginTag';
import { Ground } from '../Ground';
import { INK } from '../Picto';
import { FONT, M, soft } from '../skin';
import { useSceneFrame } from '../frame';
import { VO_LOCAL, cue } from '../timeline';

// geometry
const BC = { x: 110, y: 170, w: 1000, h: 562 }; // 3840 × 2160 capture at 1000 px wide
const BC_PARK = { x: 70, y: 250, s: 0.6 }; // parked (scaled about its top-left) while the A4 page takes the stage
const A4 = { x: 1100, y: 96, w: 495, h: 700 }; // 1819 × 2573 raster → 0.707; ends at y 796, above the subtitle box
const PAGE_SRC = 'docs/tax-invoice.png';

// regions on the printed form (page fractions, measured on docs/tax-invoice.png)
const REG = {
  tin: { x: 0.1, y: 0.186, w: 0.26, h: 0.03 }, // เลขประจำตัวผู้เสียภาษี 9761236789323
  branch: { x: 0.362, y: 0.186, w: 0.078, h: 0.03 }, // the customer's สาขา 00005
  ourBranch: { x: 0.4766, y: 0.0793, w: 0.0781, h: 0.0113 }, // ours, in the seller block: สำนักงานใหญ่ — tight, the rows above and below are close (owner 2026-10-21: "สาขา ให้ชี้ของที่อยู่เราด้วย")
  title: { x: 0.678, y: 0.04, w: 0.292, h: 0.067 }, // ใบแจ้งหนี้/ใบกำกับภาษี + Tax Invoice (owner 2026-10-21: "แก้ 3 ให้ไปชี้ที่ Title"; was เลขที่เอกสาร)
};

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

// divider position in % of the page width, relative to the fling start T0 (demo curve, forward scrub)
const posAt = (r: number) => {
  if (r < 0) return mix(8, 6.5, ramp(r, -4, 4, EASE.smooth));
  if (r < 12) return mix(6.5, 76, ramp(r, 0, 12, EASE.out));
  if (r < 24) return mix(76, 70, ramp(r, 12, 12, EASE.smooth));
  if (r < 42) return 70;
  return mix(70, 104, ramp(r, 42, 48, EASE.smooth));
};
// ring 4 lands on its word (cue s3Chips 3) but never before the slow scrub has uncovered the title (68–97 % of the page width)
const TITLE_SHOWN = (() => {
  let r = 42;
  while (posAt(r) < 100 * (REG.title.x + REG.title.w) + 1) r++;
  return r + 2;
})();
/** scene-local frame of ring 4 (sfx.ts pops on it too) */
export const s3TitleRing = () => Math.max(cue('s3Chips', 3), cue('s3Fling') + TITLE_SHOWN);

/** The plain invoice Business Central prints: a generic A4 pictogram (not a replica of any page). */
const PlainInvoice: React.FC = () => {
  const bar = (x: number, y: number, w: number, h = 12, o = 0.14) => <div key={`${x}-${y}`} style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: h / 2, background: alpha(INK, o) }} />;
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fff' }}>
      <div style={{ position: 'absolute', left: 36, top: 36, width: 68, height: 68, borderRadius: 14, background: C.sky[1], border: `3px solid ${alpha(INK, 0.35)}`, boxSizing: 'border-box' }} />
      {bar(122, 44, 150, 14, 0.3)}
      {bar(122, 70, 230)}
      {bar(122, 92, 190)}
      <div style={{ position: 'absolute', right: 36, top: 36, fontFamily: THAI, fontWeight: 700, fontSize: 38, color: INK, letterSpacing: '0.02em' }}>Invoice</div>
      {bar(36, 150, 90, 12, 0.3)}
      {bar(140, 150, 240)}
      {bar(36, 176, 60, 12, 0.3)}
      {bar(140, 176, 280)}
      {bar(380, 150, 60, 12, 0.3)}
      {bar(450, 150, 80)}
      {bar(380, 176, 60, 12, 0.3)}
      {bar(450, 176, 80)}
      <div style={{ position: 'absolute', left: 36, top: 236, width: 488, height: 34, borderRadius: 6, background: C.sky[1] }} />
      {[0, 1, 2, 3, 4].map((i) => (
        <React.Fragment key={i}>
          {bar(50, 290 + i * 36, 60)}
          {bar(130, 290 + i * 36, 190)}
          {bar(360, 290 + i * 36, 40)}
          {bar(440, 290 + i * 36, 84)}
          <div style={{ position: 'absolute', left: 36, top: 316 + i * 36, width: 488, height: 1, background: alpha(INK, 0.08) }} />
        </React.Fragment>
      ))}
      {bar(330, 500, 100, 12, 0.3)}
      {bar(450, 500, 74)}
      {bar(330, 528, 80, 12, 0.3)}
      {bar(450, 528, 74)}
      <div style={{ position: 'absolute', left: 330, top: 556, width: 194, height: 2, background: alpha(INK, 0.4) }} />
      {bar(330, 570, 120, 14, 0.42)}
      {bar(440, 570, 84, 14, 0.42)}
      {bar(36, 740, 200, 10, 0.1)}
    </div>
  );
};

/** one of the three things Localization fills in: a ring drawn round the region and a numbered pink bubble — no words on the ring.
 * The bubble sits on the ring's top-left corner, or where it covers no text: bottom-right (`br`) or centred under it (`below`). */
const Ring: React.FC<{ n: number; p: number; reg: { x: number; y: number; w: number; h: number }; at?: 'br' | 'below' }> = ({ n, p, reg, at }) => {
  if (p <= 0.001) return null;
  const rx = A4.x + reg.x * A4.w, ry = A4.y + reg.y * A4.h, rw = reg.w * A4.w, rh = reg.h * A4.h;
  const bx = at === 'br' ? rx + rw - 18 : at === 'below' ? rx + rw / 2 - 26 : rx - 34;
  const by = at === 'br' ? ry + rh - 12 : at === 'below' ? ry + rh + 14 : ry - 40;
  const lead = clamp01((p - 0.2) / 0.8);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}>
        <rect x={rx - 8} y={ry - 6} width={rw + 16} height={rh + 12} rx={12} fill={alpha('#3FB3A0', 0.16 * lead)} stroke="#3FB3A0" strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lead} />
      </svg>
      <div style={{ position: 'absolute', left: bx, top: by, width: 52, height: 52, borderRadius: 26, background: `linear-gradient(155deg, ${M.badge.trade[0]}, ${M.badge.trade[1]})`, boxShadow: soft(8, 0.3), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 30, transform: `scale(${Math.min(1.1, p)})`, opacity: Math.min(1, p * 3) }}>{n}</div>
    </>
  );
};

export const S3Invoice: React.FC = () => {
  const { f, inOp, outOp } = useSceneFrame('s3');
  const T3 = VO_LOCAL[6]; // "ตัวอย่างใกล้ตัวที่สุด คือใบกำกับภาษี"

  // the BC page arrives, then parks when the A4 page takes the stage
  const pBc = ramp(f, 0, 18, EASE.out);
  const park = ramp(f, T3 + 6, 24, EASE.swift);
  const bcX = mix(BC.x, BC_PARK.x, park), bcY = mix(BC.y, BC_PARK.y, park), bcS = mix(1, BC_PARK.s, park);

  // the plain page springs out of the BC window to its place
  const pPage = springAt(f, T3 + 8, { damping: 15, stiffness: 110 });
  const pageX = mix(BC.x + BC.w - 300, A4.x, pPage), pageY = mix(BC.y + 120, A4.y, pPage), pageS = mix(0.55, 1, pPage);

  // the slider: the fling lands as "แล้ว Localization เติม…" is said
  const T0 = cue('s3Fling');
  const r = f - T0;
  const p = posAt(r);
  const x = (p / 100) * A4.w;
  const vx = velocity((ff) => (posAt(ff - T0) / 100) * A4.w, f);
  const speed = Math.abs(vx);
  const squish = 1 + Math.min(speed / 60, 1) * 0.18;
  const press = 1 - 0.06 * Math.sin(Math.PI * ramp(r, -4, 16, EASE.linear));
  const handleOp = 1 - ramp(p, 98, 6, EASE.out);

  // four rings, numbered apart (owner 2026-10-21 "แยกเป็น 1,2,3,4"), in the order the slider uncovers them: the customer's
  // เลขประจำตัวผู้เสียภาษี and สาขา, our สาขา, then the title — each on its word of line 7, 4 not before the scrub has passed the title
  const [c1, c2, c3] = [0, 1, 2].map((i) => springAt(f, cue('s3Chips', i), { damping: 13, stiffness: 170 }));
  const c4 = springAt(f, s3TitleRing(), { damping: 13, stiffness: 170 });

  return (
    <AbsoluteFill style={{ opacity: inOp * outOp }}>
      <Ground field="peach" />

      {/* Business Central: the Posted Sales Invoice page */}
      <div style={{ position: 'absolute', left: bcX, top: bcY, width: BC.w, height: BC.h, transform: `scale(${bcS})`, transformOrigin: '0 0', opacity: pBc, borderRadius: 26, overflow: 'hidden', boxShadow: soft(28, 0.22), background: '#fff' }}>
        <Img src={staticFile('screens/posted-sales-invoice-clean.png')} style={{ width: BC.w, height: BC.h, display: 'block', transform: `translateY(${(1 - pBc) * 30}px)` }} />
      </div>
      <OriginTag kind="bc" f={f} at={14} style={{ left: bcX + 8, top: bcY + BC.h * bcS + 22 }} />

      {/* the A4 page: what BC creates, then what Localization fills in */}
      {pPage > 0.001 && (
        <div style={{ position: 'absolute', left: pageX, top: pageY, width: A4.w, height: A4.h, transform: `scale(${pageS})`, transformOrigin: '0 0', opacity: Math.min(1, pPage * 2), borderRadius: 14, overflow: 'hidden', boxShadow: soft(32, 0.26), background: '#fff' }}>
          <PlainInvoice />
          {/* revealed layer: the printed ใบกำกับภาษี with its tag, clipped with the bar */}
          <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${Math.max(0, A4.w - x)}px 0 0)` }}>
            <Img src={staticFile(PAGE_SRC)} style={{ width: A4.w, height: A4.h, display: 'block' }} />
            <OriginTag kind="jw" f={f} at={T3 + 34} style={{ left: 24, top: 498 }} id="jw-s3" />
          </div>
          {/* contact shadow on the revealed side of the bar */}
          {x < A4.w && <div style={{ position: 'absolute', left: x - 24, top: 0, width: 24, height: A4.h, background: 'linear-gradient(90deg, rgba(14,46,42,0), rgba(14,46,42,0.08))' }} />}
          {handleOp > 0 && (
            <SpeedBlur vx={vx} amount={0.12} max={14} style={{ opacity: handleOp }}>
              <div style={{ position: 'absolute', left: x - 2, top: 0, width: 4, height: A4.h, background: '#fff', boxShadow: '0 0 0 1px rgba(70,76,120,0.12), 0 0 22px rgba(70,76,120,0.25)' }} />
              <div style={{ position: 'absolute', left: x - 38, top: A4.h / 2 - 38, width: 76, height: 76, borderRadius: 38, background: '#fff', boxShadow: soft(14 + Math.min(speed / 6, 10), 0.28), transform: `scale(${press * squish}, ${press})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
                <svg width={36} height={20} viewBox="0 0 36 20" style={{ display: 'block' }}>
                  <path d="M11 3 L4 10 L11 17" fill="none" stroke={M.inkSoft} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M25 3 L32 10 L25 17" fill="none" stroke={M.inkSoft} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </SpeedBlur>
          )}
        </div>
      )}
      {/* the plain page's tag: BC's own print until the bar has passed its corner (the JWIC tag is inside the revealed layer) */}
      <OriginTag kind="bc" f={f} at={T3 + 34} out={T0 + 4} style={{ left: A4.x + 24, top: A4.y + 630 }} />

      {/* the three things Localization fills in */}
      <Ring n={1} p={c1} reg={REG.tin} />
      <Ring n={2} p={c2} reg={REG.branch} at="br" />
      <Ring n={3} p={c3} reg={REG.ourBranch} at="below" />
      <Ring n={4} p={c4} reg={REG.title} />
    </AbsoluteFill>
  );
};
