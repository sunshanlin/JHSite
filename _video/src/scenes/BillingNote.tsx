// ใบวางบิล — row-embed (demos/ui-entrance/row-embed/RowEmbed.tsx) on the real billing note,
// after a lead-in on two real JWIC screens in one panel: the Billing Board's December month with its TO BILL
// figure marked on beat 78.5 (owner 2026-10-13 "โชว์ Billing Board"), then the Billing Worklist and its
// Create Billing Notes click on beat 83.
// Kept from the demo: rows fall from the air with perspective translateY(−120·air) rotateX(16°·air),
// flight 12 f on bezier(0.5,0,0.8,0.75) (still fast at touchdown), scale 1.06 → 0.995 then a 4 f press,
// vertical motion blur from speed, an empty-slot patch in the page's own paper colour + dashed slot that
// vanishes 2 f after landing, a contact shadow that tightens as the row nears, a 2 px seam from the centre
// out on touchdown (5 f out-cubic, 8 f fade, clipped to the row), cues tightening 10 → 7 f, the camera
// drifting down and in while the rows land.
// Adapted: four slots on a portrait A4 page (customer box, invoice lines, total), seam in jade. Final review
// 2026-10-13: the page fills a wide panel (rows ~45 px tall, readable) instead of a 640 px thumbnail, the cues
// tighten 10 → 9 → 8 f, the title sits above the panel, everything clears the corner calendar (x ≤ 282).
// The 2 % push runs to the shot's end (final review 2026-10-13: a frozen hold reads as a stalled player).
import React from 'react';
import { useHeroMode } from '../heroMode';
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from 'remotion';
import { useAuthorFrame } from '../rate';
import { EASE, mix, ramp, softShadow } from '../fx/Polish';
import { Stage, alpha } from '../fx/Look';
import { C, L, THAI, gradText, glass } from '../theme';
import { box, type Frac } from '../DocCrop';
import { BN_BOARD_CLICK_BEAT, BN_CLICK_BEAT, BN_HL_BEAT, SHOTS, TAIL, localBeat } from '../timeline';
import { Tag } from '../Tag';
import { BN_PILL } from '../data/bn';

const SRC = 'docs/billing-note.png';
// owner 2026-10-13 "ไม่ต้อง zoom เข้าไปในเอกสารเยอะ": the whole sheet at reading size on the right (its foot runs off
// the frame), title column on the left as in the other document shots; only a 2 % push about the slots' centre
const DW = 860;
const DH = DW * 1.4134;
// y 132: the tag riding the page's corner stays clear of the top safe margin to the shot's end (PGY 64 put it at y 8,
// final review 2026-10-13; the drift lifts the page's top 18 px, so 116 would end with the tag at y 42)
const PGX = 990, PGY = 132;
const CAM_O = 0.3345; // push origin = the slots' centre
const PAGE_BG = '#ffffff';
// Billing Worklist page area and its Create Billing Notes action (CSS px, capture/dec/layout.json)
const WL = { x: 400, y: 60, w: 1122, h: 400 }; // page panel only (no grey canvas strips, no app bar)
const ACT = { x: 1179.6, y: 229, w: 164.2, h: 38 }; // capture/dec/layout.json createBillingNotesAction
const WS = 1500 / WL.w;
// Billing Board, December 2026 (capture/dec/layout.json "billing-board"): the board and its TO BILL figure (pixel scan)
const BB = { x: 92, y: 140, w: 1718, h: 656 }; // board 108,148 1686×640 plus a margin so the TO BILL ring is not clipped
const TB = { x: 112, y: 185, w: 154, h: 36 };
const BS = 1500 / BB.w;
const PANEL = { x: 330, y: 220 }; // both screens open in the same panel
type Box = { x: number; y: number; w: number; h: number };
const onScreen = (r: Box): Box => ({ x: PANEL.x + (r.x - BB.x) * BS, y: PANEL.y + (r.y - BB.y) * BS, w: r.w * BS, h: r.h * BS });
const inPanel = (r: Box): Box => ({ x: (r.x - BB.x) * BS, y: (r.y - BB.y) * BS, w: r.w * BS, h: r.h * BS });
// what the board's parts do (owner 2026-10-14: "มีเส้นโยง 3 อันบอกว่า element ทำอะไร"), in the site's own words for the
// billing feature (index.html #billing-flow, the BOT API panel). Board CSS px from capture/dec/layout.json + a pixel scan
// of screens/billing-board.png. Labels sit in the calendar's first row (29 Nov – 5 Dec, empty), level with the headline.
const SUM: Box = { x: 110, y: 181, w: 474, h: 44 }; // TO BILL · TO DELIVER · LATE figures
const HOL: Box = { x: 1077.5, y: 365, w: 229, h: 21 }; // 10 Dec วันรัฐธรรมนูญ | Constitution Day (a holiday entry)
const CUS: Box = { x: 1317.6, y: 365.5, w: 229.7, h: 22 }; // 11 Dec บริษัท เอเชียเทรดดิ้ง จำกัด (day11Chips[0]): the chip clicked
const LABEL_Y = 309; // the headline's top
type Callout = { label: string; box: Box; left: number; anchor: 'left' | 'centre'; at: number };

const FLY = 12;
const HL = localBeat('bn', BN_HL_BEAT); // headline วางแผนวางบิล
const BC = localBeat('bn', BN_BOARD_CLICK_BEAT); // click on the 11 Dec chip
const CLICK = localBeat('bn', BN_CLICK_BEAT); // Create Billing Notes
const SWAP = BC + 2; // the worklist's window opens out of the clicked chip (the tax invoice's portal grammar, 16 f)
// callouts 10 f apart after the headline, the clicked chip's last, so its ring carries straight into the click
const CALLOUTS: Callout[] = [
  { label: 'ยอดที่ต้องวางบิล', box: SUM, left: 773, anchor: 'left', at: HL + 10 },
  { label: 'วันหยุดจาก ธปท.', box: HOL, left: 1270, anchor: 'centre', at: HL + 20 },
  { label: 'รอบวางบิลของลูกค้า', box: CUS, left: 1440, anchor: 'left', at: HL + 30 },
];
// the last row lands on beat 90 (was 89, before the board's callouts); landings 10 → 9 → 8 f apart
const LAST = localBeat('bn', 90);
const CUES = [LAST - 27, LAST - 17, LAST - 8, LAST].map((l) => l - FLY);
const ROWS0 = CUES[0] - 12; // camera drift starts with the rain
const END = SHOTS.bn.dur + 2 * TAIL; // last local frame (the scene wakes TAIL early and stays TAIL late)
const FLY_EASE = Easing.bezier(0.5, 0, 0.8, 0.75);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const airOf = (f: number, cue: number) => 1 - interpolate(f, [cue, cue + FLY], [0, 1], { ...clamp, easing: FLY_EASE });

// page fractions, measured on SBN26120004 (capture/dec, fgrid)
const SLOTS: Frac[] = [
  { x: 0.025, y: 0.145, w: 0.95, h: 0.127 }, // customer + document box
  { x: 0.025, y: 0.306, w: 0.95, h: 0.021 }, // IV26120001
  { x: 0.025, y: 0.333, w: 0.95, h: 0.022 }, // amount in words + จำนวนรวมทั้งสิ้น
  { x: 0.025, y: 0.462, w: 0.95, h: 0.062 }, // ช่องทางชำระเงิน: bank, account name, account no. (no QR: PromptPay ID cleared on the bank card)
];

export const BillingNote: React.FC = () => {
  const f = useAuthorFrame();
  const hero = useHeroMode();
  // lead-in 1: the Billing Board pops into the panel (the PO form's 0.94 → 1 pop), its headline chip names the board's
  // job on beat 78.5 (วางแผนวางบิล), three callouts tie a label to the part they explain, then the 11 Dec chip is
  // clicked on beat 82 and the worklist opens out of it; the board lifts and blurs away behind the window
  const bbIn = ramp(f, 6, 12, EASE.snappy);
  const bbOut = ramp(f, SWAP + 6, 12, EASE.swift);
  const bb = bbIn * (1 - bbOut);
  const cOut = ramp(f, BC, 8, EASE.out); // headline, labels and their ties clear as the chip is clicked
  const hlChip = ramp(f, HL + 4, 12, EASE.snappy) * (1 - cOut);
  const press = ramp(f, BC, 6, EASE.out) * (1 - ramp(f, BC + 6, 8, EASE.out));
  // lead-in 2: Billing Worklist, its window opening out of the chip, push to the action, one click, then it recedes
  const portal = ramp(f, SWAP, 16, EASE.smooth);
  const wlExit = 1 - ramp(f, CLICK + 19, 16, EASE.swift);
  const wl = (f >= SWAP ? 1 : 0) * wlExit;
  const cusS = onScreen(CUS);
  const wlW = WL.w * WS, wlH = WL.h * WS;
  const k = 1 - portal;
  const wlClip = portal < 0.999
    ? `inset(${((cusS.y - PANEL.y) * k).toFixed(2)}px ${((PANEL.x + wlW - cusS.x - cusS.w) * k).toFixed(2)}px ${((PANEL.y + wlH - cusS.y - cusS.h) * k).toFixed(2)}px ${((cusS.x - PANEL.x) * k).toFixed(2)}px round ${mix(5, 18, portal).toFixed(2)}px)`
    : undefined;
  const wlPush = mix(1, 1.08, ramp(f, SWAP, CLICK - SWAP, EASE.smooth));
  const click = ramp(f, CLICK, 6, EASE.out) * (1 - ramp(f, CLICK + 6, 8, EASE.out));
  const lock = CLICK - 21;
  const page = ramp(f, CLICK + 23, 18, EASE.snappy);
  // the drift down and in runs until the breath takes over (was 70 f, then a ~2 s frozen hold)
  const drift = ramp(f, ROWS0, END - ROWS0, EASE.linear);
  const cam = mix(1, 1.02, drift);
  const camY = mix(0, -10, drift);
  const title = (k: number) => ramp(f, CLICK + 30 + k * 5, 22, EASE.out);
  const S = (r: Frac) => box(r, DW, DH);
  const pageS = mix(0.96, 1, page) * cam; // the page's scale about (50 %, CAM_O) and its y offset
  const pageY = (1 - page) * 40 + camY;

  return (
    <AbsoluteFill style={{ fontFamily: THAI, overflow: 'hidden' }}>
      <Stage look={L} keyLight={{ x: 0.6, y: 0.18 }} fill={{ x: 0.1, y: 0.9 }} grain={0.035} />

      {/* Billing Board, December 2026 (real BC capture, board area only) */}
      {bb > 0.001 && (
        <div style={{
          position: 'absolute', left: PANEL.x, top: PANEL.y, width: BB.w * BS, height: BB.h * BS, borderRadius: 18, overflow: 'hidden',
          ...glass, transform: `scale(${(mix(0.94, 1, bbIn) * mix(1, 1.04, bbOut)).toFixed(4)})`, transformOrigin: '50% 30%', opacity: bb,
          filter: bbOut > 0.02 ? `blur(${(bbOut * 8).toFixed(2)}px)` : undefined,
        }}>
          <div style={{
            position: 'absolute', inset: 0, backgroundImage: `url(${staticFile('screens/billing-board.png')})`,
            backgroundSize: `${1920 * BS}px ${1080 * BS}px`, backgroundPosition: `${-BB.x * BS}px ${-BB.y * BS}px`,
          }} />
          {/* each callout's target ring; the clicked chip's stays through the click and rides the board out */}
          {CALLOUTS.map((c, i) => {
            const r = inPanel(c.box);
            const ring = ramp(f, c.at, 10, EASE.snappy);
            const op = ramp(f, c.at, 8, EASE.out) * (c.box === CUS ? 1 : 1 - cOut);
            if (op <= 0.001) return null;
            return (
              <div key={i} style={{
                position: 'absolute', left: r.x - 6, top: r.y - 5, width: r.w + 12, height: r.h + 10, borderRadius: 9, border: `3px solid ${C.c1}`,
                background: alpha(C.c1, c.box === CUS ? 0.08 * ring + 0.22 * press : 0.08 * ring), transform: `scale(${mix(1.25, 1, ring).toFixed(3)})`, opacity: op,
              }} />
            );
          })}
          {/* the click on the 11 Dec chip */}
          {(() => {
            const r = inPanel(CUS);
            return <div style={{ position: 'absolute', left: r.x + r.w / 2 - 34, top: r.y + r.h / 2 - 34, width: 68, height: 68, borderRadius: 34, border: `3px solid ${C.c2}`, transform: `scale(${mix(0.5, 1.6, press).toFixed(3)})`, opacity: press }} />;
          })()}
        </div>
      )}
      {/* callout ties: from the ringed part to its label in the calendar's first row */}
      {bb > 0.001 && cOut < 1 && (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {CALLOUTS.map((c, i) => {
            const draw = ramp(f, c.at + 2, 10, EASE.out);
            if (draw <= 0) return null;
            const t = onScreen(c.box);
            let d: string;
            let a: { x: number; y: number };
            if (t.y + t.h < LABEL_Y) {
              // the summary row sits above the first row: out of its right end, then down onto the label's top
              a = { x: t.x + t.w + 8, y: t.y + t.h / 2 };
              const bx = c.left + 36, rr = 14;
              d = `M${a.x},${a.y} H${bx - rr} Q${bx},${a.y} ${bx},${a.y + rr} V${LABEL_Y}`;
            } else {
              // a chip in the second row: straight up from the ring into the label's foot
              const x = c.anchor === 'centre' ? t.x + t.w / 2 : Math.max(c.left + 40, t.x + 40);
              a = { x, y: t.y - 7 };
              d = `M${a.x},${a.y} V${LABEL_Y + 52}`;
            }
            return (
              <g key={i} opacity={(0.9 * (1 - cOut)).toFixed(3)}>
                <path d={d} fill="none" stroke={C.c1} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={(1 - draw).toFixed(4)} />
                <circle cx={a.x} cy={a.y} r={5} fill={C.c1} opacity={Math.min(1, draw * 3)} />
              </g>
            );
          })}
        </svg>
      )}
      {/* callout labels */}
      {CALLOUTS.map((c, i) => {
        const o = ramp(f, c.at + 6, 6, EASE.out) * (1 - cOut);
        if (o <= 0.001) return null;
        const q = ramp(f, c.at + 6, 12, EASE.out);
        return (
          <div key={i} style={{
            position: 'absolute', left: c.left, top: LABEL_Y, height: 52, padding: '0 22px', borderRadius: 26, display: 'flex', alignItems: 'center',
            background: 'linear-gradient(180deg, #ffffff 0%, #fbfbfa 100%)', border: `1px solid ${L.line}`, boxShadow: `inset 0 1px 0 #fff, ${softShadow(8, { color: L.shadow, strength: 0.8 })}`,
            fontFamily: THAI, fontWeight: 600, fontSize: 30, color: C.ink, whiteSpace: 'nowrap', opacity: o,
            transform: `translateX(${c.anchor === 'centre' ? '-50%' : '0'}) translateY(${((1 - q) * 12).toFixed(2)}px)`,
          }}>{c.label}</div>
        );
      })}
      {/* the headline: what the board is for, under its TO BILL figure (over the board's empty first-row cells). Owner
          2026-10-14: "ไม่ต้องบอกว่ารอวางบิล 37 ใบ แต่ให้บอกว่าวางแผนวางบิล" (was รอวางบิล 37 ใบ) */}
      {hlChip > 0.001 && (
        <div style={{
          position: 'absolute', left: PANEL.x + (TB.x - BB.x) * BS, top: PANEL.y + (TB.y + TB.h - BB.y) * BS + 18, height: 52, padding: '0 22px', borderRadius: 26,
          background: C.c1, color: '#fff', display: 'flex', alignItems: 'center', gap: 12, fontFamily: THAI, fontWeight: 700, fontSize: 32, whiteSpace: 'nowrap',
          fontVariantNumeric: 'tabular-nums', opacity: hlChip, transform: `translateY(${((1 - hlChip) * 12).toFixed(2)}px)`, boxShadow: `0 10px 24px ${alpha(C.c1, 0.35)}`,
        }}>วางแผนวางบิล</div>
      )}

      {/* Billing Worklist (real BC capture, page area only; boxes from capture/layout.json) */}
      {wl > 0.001 && (
        <div style={{
          position: 'absolute', left: PANEL.x, top: PANEL.y, width: wlW, height: wlH, borderRadius: 18, overflow: 'hidden',
          ...glass, transform: `scale(${wlPush.toFixed(4)})`, transformOrigin: `${(ACT.x - WL.x + ACT.w / 2) * WS}px ${(ACT.y - WL.y) * WS}px`, opacity: wl,
          clipPath: wlClip, WebkitClipPath: wlClip, filter: wl < 0.98 ? `blur(${((1 - wl) * 8).toFixed(2)}px)` : undefined,
        }}>
          <div style={{
            position: 'absolute', inset: 0, backgroundImage: `url(${staticFile('screens/billing-worklist.png')})`,
            backgroundSize: `${1920 * WS}px ${1080 * WS}px`, backgroundPosition: `${-WL.x * WS}px ${-WL.y * WS}px`,
          }} />
          {/* click on Create Billing Notes */}
          <div style={{
            position: 'absolute', left: (ACT.x - WL.x) * WS - 6, top: (ACT.y - WL.y) * WS - 6, width: ACT.w * WS + 12, height: ACT.h * WS + 12, borderRadius: 10,
            border: `3px solid ${C.c1}`, background: alpha(C.c1, 0.08 * click), transform: `scale(${mix(1.25, 1, ramp(f, lock, 10, EASE.snappy)).toFixed(3)})`,
            opacity: ramp(f, lock, 8, EASE.out) * (1 - ramp(f, CLICK + 15, 8, EASE.out)),
          }} />
          <div style={{ position: 'absolute', left: (ACT.x - WL.x + ACT.w / 2) * WS - 34, top: (ACT.y - WL.y + ACT.h / 2) * WS - 34, width: 68, height: 68, borderRadius: 34, border: `3px solid ${C.c2}`, transform: `scale(${mix(0.5, 1.6, click).toFixed(3)})`, opacity: click }} />
        </div>
      )}

      {/* origin tags: the Billing Board, the Billing Worklist and the billing note are all JWIC's (BC has no billing note);
          one tag holds over both screens of the panel */}
      <Tag kind="jw" f={f} at={12} out={CLICK + 19} id="jw-bn1" style={{ left: PANEL.x, top: PANEL.y - 58 }} />
      {/* rides the page's top-left corner through its entrance and drift, so the page never slides under it */}
      <Tag kind="jw" f={f} at={CLICK + 27} id="jw-bn2" style={{ left: PGX + (DW / 2) * (1 - pageS), top: PGY + pageY + CAM_O * DH * (1 - pageS) - 56 }} />

      {/* title column (same place as the other document shots) */}
      <div style={{ visibility: hero ? 'hidden' : undefined, position: 'absolute', left: 140, top: 380, width: 820 }}>
        <div style={{ display: 'flex', fontWeight: 700, fontSize: 104, lineHeight: 1.28, color: C.ink, whiteSpace: 'nowrap' }}>
          {['สร้าง', 'ใบวางบิล'].map((w, k) => {
            const q = title(k);
            return <span key={k} style={{ display: 'inline-block', opacity: q, transform: `translateY(${((1 - q) * 36).toFixed(2)}px)`, filter: q >= 0.999 ? undefined : `blur(${((1 - q) * 10).toFixed(2)}px)`, ...(k === 1 ? gradText : null) }}>{w}</span>;
          })}
        </div>
        <div style={{
          display: 'inline-block', marginTop: 22, padding: '8px 26px', borderRadius: 999, border: `1.5px solid ${C.ink}`, background: '#fff', whiteSpace: 'nowrap',
          fontWeight: 600, fontSize: 34, color: C.ink, opacity: title(2), transform: `translateY(${((1 - title(2)) * 16).toFixed(2)}px)`,
        }}>{BN_PILL}</div>
      </div>

      {/* billing note page: the whole sheet, the camera drifts down and in by 2 % */}
      <div style={{
        position: 'absolute', left: PGX, top: PGY, width: DW, height: DH, borderRadius: 12, overflow: 'hidden', background: PAGE_BG,
        boxShadow: softShadow(16, { color: L.shadow, strength: 1.1 }), opacity: page,
        transform: `translateY(${pageY.toFixed(2)}px) scale(${pageS.toFixed(5)})`, transformOrigin: `50% ${(CAM_O * 100).toFixed(2)}%`,
      }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: DW, height: DH }}>
        <div style={{ position: 'absolute', inset: 0, background: PAGE_BG }}>
          <Img src={staticFile(SRC)} style={{ width: '100%', height: '100%' }} />
          {SLOTS.map((r0, i) => {
            const r = S(r0);
            const cue = CUES[i];
            const land = cue + FLY;
            const patch = interpolate(f, [land, land + 2], [1, 0], clamp);
            const hint = interpolate(f, [cue - 6, cue + 4], [0.55, 1], clamp);
            let flyer: React.ReactNode = null;
            let contact: React.ReactNode = null;
            if (f >= cue && f < land + 4) {
              const air = airOf(f, cue);
              const p = 1 - air;
              const appear = interpolate(f, [cue, cue + 3], [0, 1], clamp);
              const scale = f < land ? 1.06 - 0.065 * p : interpolate(f, [land, land + 4], [0.995, 1], { ...clamp, easing: Easing.out(Easing.quad) });
              const vy = 120 * (airOf(f - 0.5, cue) - airOf(f + 0.5, cue));
              const mb = f < land ? Math.min(3.2, vy * 0.22) : 0;
              flyer = (
                <div style={{
                  position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, opacity: appear, zIndex: 3,
                  transform: `perspective(900px) translateY(${(-120 * air).toFixed(2)}px) rotateX(${(16 * air).toFixed(3)}deg) scale(${scale.toFixed(4)})`,
                  filter: mb > 0.25 ? `url(#bn-mb-${i})` : undefined,
                }}>
                  {mb > 0.25 && (
                    <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden>
                      <filter id={`bn-mb-${i}`} x="-5%" y="-30%" width="110%" height="160%"><feGaussianBlur stdDeviation={`0 ${mb.toFixed(2)}`} /></filter>
                    </svg>
                  )}
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: 4, overflow: 'hidden', backgroundColor: '#fff',
                    backgroundImage: `url(${staticFile(SRC)})`, backgroundSize: `${DW}px ${DH}px`, backgroundPosition: `-${r.x}px -${r.y}px`,
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,${(0.9 * air).toFixed(3)}), 0 0 0 1px rgba(14,46,42,${(0.07 * air).toFixed(3)}), 0 ${(34 * air).toFixed(1)}px ${(64 * air).toFixed(1)}px -${(10 * air).toFixed(1)}px rgba(14,46,42,${(0.24 * air).toFixed(3)}), 0 ${(6 * air).toFixed(1)}px ${(14 * air).toFixed(1)}px rgba(14,46,42,${(0.1 * air).toFixed(3)})`,
                  }} />
                </div>
              );
              const near = interpolate(air, [0, 0.5], [1, 0], clamp);
              const cop = f < land ? near * 0.5 : interpolate(f, [land, land + 3], [0.5, 0], clamp);
              contact = <div style={{ position: 'absolute', left: r.x + 6, top: r.y + 3, width: r.w - 12, height: r.h - 3, borderRadius: 4, zIndex: 2, boxShadow: `0 ${(2 + 6 * air).toFixed(1)}px ${(6 + 18 * air).toFixed(1)}px rgba(14,46,42,${(0.22 * cop).toFixed(3)})` }} />;
            }
            let seam: React.ReactNode = null;
            if (f >= land && f < land + 8) {
              const spread = interpolate(f, [land, land + 5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
              const so = interpolate(f, [land, land + 2, land + 8], [1, 1, 0], clamp);
              const sw = r.w * spread;
              seam = <div style={{ position: 'absolute', left: r.x + (r.w - sw) / 2, top: r.y + r.h - 2, width: sw, height: 2, borderRadius: 1, zIndex: 4, opacity: so, background: `linear-gradient(90deg, ${alpha(C.c1, 0)} 0%, ${C.c1} 18%, ${C.c2} 50%, ${C.c1} 82%, ${alpha(C.c1, 0)} 100%)`, boxShadow: `0 0 7px ${alpha(C.c2, 0.38)}` }} />;
            }
            return (
              <React.Fragment key={i}>
                {patch > 0 && (
                  <div style={{ position: 'absolute', left: r.x - 4, top: r.y - 2, width: r.w + 8, height: r.h + 4, background: PAGE_BG, opacity: patch, zIndex: 1 }}>
                    <div style={{ position: 'absolute', left: 4, top: 2, width: r.w, height: r.h, borderRadius: 4, border: `1px dashed ${alpha(C.c1, 0.3)}`, boxSizing: 'border-box', opacity: hint, background: alpha(C.c1, 0.02) }} />
                  </div>
                )}
                {contact}
                {flyer}
                {seam}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      </div>
      {/* the amount billed, readable at film size once the rows are in (~90 s cut: the hold has room for it) */}
      {(() => {
        const c = ramp(f, LAST + FLY + 14, 12, EASE.snappy);
        if (c <= 0.001) return null;
        return (
          <div style={{
            position: 'absolute', left: PGX + DW - 330, top: PGY + 0.36 * DH + 14, height: 52, padding: '0 22px', borderRadius: 26, background: C.c1, color: '#fff',
            display: 'flex', alignItems: 'center', gap: 12, fontFamily: THAI, fontWeight: 700, fontSize: 32, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums',
            opacity: c, transform: `translateY(${((1 - c) * 12).toFixed(2)}px)`, boxShadow: `0 10px 24px ${alpha(C.c1, 0.35)}`,
          }}><span style={{ fontWeight: 600, opacity: 0.85 }}>ยอดวางบิล</span>53,500.00</div>
        );
      })()}

    </AbsoluteFill>
  );
};
