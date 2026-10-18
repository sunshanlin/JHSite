// ใบกำกับภาษี — three cards in one shot, joined on the music:
// 1) depth-layer-moves · multiplane (demos/camera/depth-layer-moves/MultiplaneReal.tsx): one drive × layer
//    factors 0.35 / 0.7 / 1.4 (+ 0x), far layer blurred 5 px + desaturated + haze, mid layer = the real Posted
//    Sales Invoice (sharp, the reading layer), near layer = big blurred pills with speed blur, asymmetric
//    in-out drive bezier(0.45,0,0.18,1) with a real end, the hero lifts after the drive settles (ring + tag).
// 2) shot-transitions · mask-wipe (demos/transition/shot-transitions/PortalWipeV2.tsx): the lifted element grows
//    into the full window in 40 f on bezier(0.7,0,0.3,1), the world inside grows 0.42 → 1 on the same t, the
//    element's face fades within the first 28 % of travel, then the new world holds still.
// 3) doc-park-left-pill-deal (demos/ui-entrance/doc-park-left-pill-deal/DocParkLeftPillDeal.tsx): the document
//    parks left with inOutCubic + scale 0.92 (origin left edge), keeps a slow continuous drift, three pills are
//    dealt with a fast opacity (outQuad) and a slower outBack landing, a caption darkens word by word under each
//    and clears before the next, the evidence line on the document is marked and tied to its pill.
// Adapted: the hero is BC's own Print... action (it runs report 56130 through Report Selection); the document
// stays fully visible when parked because the marked lines must stay readable; pills land on beats; the drift is a
// 2 % push of the parked page (no auto-scroll on a one-page document) that runs to the shot's end, its ties following
// (final review 2026-10-13: the hold had frozen).
import React from 'react';
import { useHeroMode } from '../heroMode';
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from 'remotion';
import { useAuthorFrame } from '../rate';
import { E, seg } from '../fx/Motion';
import { EASE, SpeedBlur, bezier, mix, ramp, softShadow, velocity } from '../fx/Polish';
import { alpha, type } from '../fx/Look';
import { C, L, THAI, gradText } from '../theme';
import { SHOTS, TAIL, localBeat } from '../timeline';
import { Tag } from '../Tag';
import { box, type Frac } from '../DocCrop';

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

// ── posted sales invoice capture (CSS px of the 1920×1080 capture, capture/layout.json) ──
const SHOT = 'screens/posted-sales-invoice.png';
// page area below the BC app bar (y 48, as PO_PAGE: no product wordmark — final review 2026-10-13); the window sits 48 px
// lower than before, so Print... and the portal keep their screen place
const CROP = { x: 290, y: 48, w: 1350, h: 852 };
const PRINT = { x: 364, y: 210, w: 86, h: 38 }; // Print/Send → Print...
const WIN = { x: 440, y: 160 }; // mid-layer window rest position (screen)
const printScreen = { x: WIN.x + PRINT.x - CROP.x, y: WIN.y + PRINT.y - CROP.y, w: PRINT.w, h: PRINT.h };

// ── timing (local frames; scene wakes 8 f before its nominal start). The shot is 391 f (25 beats). ──
// Final review 2026-10-13: hero lift ~8 f after the drive has converged (card), the portal ends in a ≥30 f
// still before the park (mask-wipe "穿完必须真停"), pills ~35 f apart (card ~38 f; was 23.5 f), captions stay.
const CLICK = localBeat('inv', 53); // Print... clicked on beat 53 (~90 s cut: a longer drive before it)
const LIFT0 = CLICK - 16;
const DRIVE0 = 4, DRIVE_LEN = LIFT0 - 3 - DRIVE0; // soft landing converges ~5 f before its end → lift ≈ 8 f later
const P0 = CLICK + 8, P1 = P0 + 40; // portal 40 f
const PARK0 = P1 + 30, PARK1 = PARK0 + 20; // 30 f still, then park
// pills on beats, 3 beats (47 f) apart; the first lands as the park settles, so the finished list holds ~4 s before
// the next breath (final review r2 M6)
const T0 = [60, 63, 66].map((n) => localBeat('inv', n)); // 3 beats (47 f) apart
const END = SHOTS.inv.dur + 2 * TAIL; // last local frame (the scene wakes TAIL early and stays TAIL late)
export const PORTAL = { from: P0, to: P1 }; // Hero.tsx pans its crop across the portal
const DRIVE_EASE = bezier(0.45, 0, 0.18, 1);
const DRIVE = 360; // mid layer travels 360 px (0.7x) to its rest
const driveAt = (f: number) => DRIVE * (1 - ramp(f, DRIVE0, DRIVE_LEN, DRIVE_EASE));

// ── document world ──
const DOC = 'docs/tax-invoice.png';
const DW = 600;
const DH = DW * 1.4134;
const DOC_C = { x: (1920 - DW) / 2, y: (1080 - DH) / 2 }; // centred (portal end)
const DOC_P = { x: 330, y: (1080 - DH * 0.92) / 2 }; // parked clear of the corner calendar (x ≤ 282)
const PX = 930, PY0 = 380, PSTEP = 178;

// cap: Thai is written without spaces — the words are separate only so they can darken one by one
// route: a line that starts inside the page leaves it through blank paper (page fractions measured on the raster):
// along its own row to the gutter gx, down the gutter to the empty row gy, out past the page's right edge
type Item = { pill: string; cap: string[]; line: Frac; route?: { gx: number; gy: number } };
// owner 2026-10-13: the first pill says the form is a full tax invoice that meets the Revenue Department's rules (the
// printed IV26120001 carries every item a full-form tax invoice needs); the amount-in-words pill is dropped
const ITEMS: Item[] = [
  { pill: 'ใบกำกับภาษีเต็มรูป', cap: ['ถูกต้อง', 'ตาม', 'หลักเกณฑ์', 'กรมสรรพากร'], line: { x: 0.672, y: 0.035, w: 0.302, h: 0.068 } }, // ใบแจ้งหนี้/ใบกำกับภาษี · Tax Invoice
  // owner 2026-10-13: its tie must not cross the page — gutter 0.43–0.66 and row gap 0.307–0.325 are blank
  { pill: 'เลขประจำตัวผู้เสียภาษี · สาขา', cap: ['ดึง', 'จาก', 'ข้อมูล', 'ลูกค้า'], line: { x: 0.098, y: 0.191, w: 0.34, h: 0.019 }, route: { gx: 0.55, gy: 0.316 } },
  { pill: 'ภาษีมูลค่าเพิ่ม 7%', cap: ['ตรง', 'กับ', 'ยอด', 'ที่', ' Post'], line: { x: 0.655, y: 0.539, w: 0.32, h: 0.02 } },
];

const NEAR = [
  // frame-edge foreground: at rest only two sit half out of the bottom/top edges (demo: "framing pills")
  { t: 'IV26120001', x: 1500, y: 985, tone: 'jade' },
  { t: 'VAT 7%', x: 2100, y: -50, tone: 'ink' },
  { t: '53,500.00', x: 2620, y: 990, tone: 'rose' },
  { t: 'ลูกค้าขาประจำ', x: 3150, y: -40, tone: 'paper' },
] as const;

// word-by-word darkening caption (doc-park's caption grammar)
const mixC = (p: number, a: string, b: string) => {
  const h = (s: string) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
  const A = h(a), B = h(b), q = clamp01(p);
  return `rgb(${Math.round(A[0] + (B[0] - A[0]) * q)},${Math.round(A[1] + (B[1] - A[1]) * q)},${Math.round(A[2] + (B[2] - A[2]) * q)})`;
};
const Caption: React.FC<{ words: string[]; showV: number; innP: number; outP: number; style: React.CSSProperties }> = ({ words, showV, innP, outP, style }) => {
  const n = words.length, st = 0.78 / n, win = st * 1.5, stw = 0.55 / n;
  const rowOp = outP > 0 ? clamp01(1 - (outP - 0.7) / 0.3) : showV;
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', whiteSpace: 'nowrap', opacity: rowOp, ...style }}>
      {words.map((w, i) => {
        const q = clamp01((innP - i * st) / win);
        let col = mixC(q, '#C4CAC9', C.ink);
        if (outP > 0) col = mixC(1 - clamp01((outP - i * stw) / (stw * 1.4)), '#C4CAC9', C.ink);
        return <span key={i} style={{ color: col }}>{w}</span>;
      })}
    </div>
  );
};

const DocWorld: React.FC<{ f: number }> = ({ f }) => {
  const hero = useHeroMode();
  const park = ramp(f, PARK0, PARK1 - PARK0, E.inOutCubic);
  const s0 = mix(1, 0.92, park);
  // the parked page's drift: 2 % about its own centre, linear so it still moves when the breath takes over
  const drift = mix(1, 1.02, ramp(f, PARK1, END - PARK1, EASE.linear));
  const sc = s0 * drift;
  const x = mix(DOC_C.x, DOC_P.x, park) + (DW * s0 * (1 - drift)) / 2;
  const y = mix(DOC_C.y, DOC_P.y, park) + (DH * s0 * (1 - drift)) / 2;
  const title = (k: number) => ramp(f, PARK1 - 4 + k * 5, 22, EASE.out);
  const toScreen = (r: Frac) => {
    const b = box(r, DW, DH);
    return { x: x + b.x * sc, y: y + b.y * sc, w: b.w * sc, h: b.h * sc };
  };
  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${C.sky[0]} 0%, ${C.sky[1]} 35%, ${C.sky[2]} 70%, ${C.sky[3]} 100%)`, fontFamily: THAI }}>
      <div style={{ position: 'absolute', left: 1240, top: -160, width: 640, height: 640, borderRadius: '50%', background: C.bokeh[0], filter: 'blur(70px)', opacity: 0.6 }} />
      <div style={{ position: 'absolute', left: -160, top: 640, width: 680, height: 680, borderRadius: '50%', background: C.bokeh[1], filter: 'blur(70px)', opacity: 0.6 }} />

      {/* the document */}
      <div style={{ position: 'absolute', left: x, top: y, width: DW, height: DH, transform: `scale(${sc.toFixed(4)})`, transformOrigin: '0 0' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 10, overflow: 'hidden', background: '#fff', boxShadow: softShadow(18, { color: L.shadow, strength: 1.2 }) }}>
          <Img src={staticFile(DOC)} style={{ width: '100%', height: '100%' }} />
          {ITEMS.map((it, k) => {
            const mk = ramp(f, T0[k] + 10, 12, EASE.out);
            const b = box(it.line, DW, DH);
            return mk > 0 ? <div key={k} style={{ position: 'absolute', left: b.x - 4, top: b.y - 2, width: (b.w + 8) * mk, height: b.h + 4, borderRadius: 4, background: alpha(C.c2, 0.2), mixBlendMode: 'multiply' }} /> : null;
          })}
        </div>
      </div>

      {/* evidence lines: marked line → pill */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {ITEMS.map((it, k) => {
          const draw = ramp(f, T0[k] + 7, 12, EASE.out);
          // the tie stays, dimmed once the next pill arrives, so the finished list still shows where each came from
          const fade = 1 - 0.55 * (k < 2 ? ramp(f, T0[k + 1], 10, EASE.out) : 0);
          if (draw <= 0 || fade <= 0) return null;
          const a0 = toScreen(it.line);
          const a = { x: a0.x + a0.w + 6, y: a0.y + a0.h / 2 };
          const bb = { x: PX - 8, y: PY0 + k * PSTEP + 32 };
          let d: string;
          if (it.route) {
            // outside the page it drops straight down the margin, left of the first pill's tie, and turns into its pill
            const gx = x + it.route.gx * DW * sc, gy = y + it.route.gy * DH * sc, edge = x + DW * sc + 8, r = 10, r2 = 16;
            d = `M${a.x},${a.y} H${gx - r} Q${gx},${a.y} ${gx},${a.y + r} V${gy - r} Q${gx},${gy} ${gx + r},${gy} H${edge - r} Q${edge},${gy} ${edge},${gy + r} V${bb.y - r2} Q${edge},${bb.y} ${edge + r2},${bb.y} H${bb.x}`;
          } else {
            const mx = (a.x + bb.x) / 2;
            d = `M${a.x},${a.y} C${mx},${a.y} ${mx},${bb.y} ${bb.x},${bb.y}`;
          }
          return (
            <g key={k} opacity={(0.9 * fade).toFixed(3)}>
              <path d={d} fill="none" stroke={C.c1} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={(1 - draw).toFixed(4)} />
              <circle cx={a.x} cy={a.y} r={6} fill={C.c1} opacity={Math.min(1, draw * 3)} />
            </g>
          );
        })}
      </svg>

      {/* origin tag: the Thai tax invoice form is JWIC's; it rides on the document's corner as it parks */}
      <Tag kind="jw" f={f} at={P1 - 6} id="jw-inv" style={{ left: x, top: y - 56 * sc }} />

      {/* title */}
      <div style={{ visibility: hero ? 'hidden' : undefined, position: 'absolute', left: PX, top: 150, display: 'flex', fontWeight: 700, fontSize: 96, lineHeight: 1.25, color: C.ink, whiteSpace: 'nowrap' }}>
        {['ออก', 'ใบกำกับภาษี'].map((w, k) => {
          const q = title(k);
          return <span key={k} style={{ display: 'inline-block', opacity: q, transform: `translateY(${((1 - q) * 36).toFixed(2)}px)`, filter: q >= 0.999 ? undefined : `blur(${((1 - q) * 10).toFixed(2)}px)`, ...(k === 1 ? gradText : null) }}>{w}</span>;
        })}
      </div>

      {/* pills + captions */}
      {ITEMS.map((it, k) => {
        const t0 = T0[k];
        const o = ramp(f, t0, 6, E.outQuad);
        const bb = ramp(f, t0, 11, (t: number) => E.outBack(t));
        // caption darkens word by word over 16 f and then stays (was: cleared before the next pill → lived ~7 f)
        const cs = t0 + 9;
        const showV = ramp(f, cs, 4);
        const innP = ramp(f, cs, 22, EASE.linear);
        const outP = 0;
        const lift = mix(14, 4, clamp01(bb));
        return (
          <React.Fragment key={k}>
            <div style={{
              position: 'absolute', left: PX, top: PY0 + k * PSTEP, height: 64, padding: '0 30px 0 14px', borderRadius: 32, display: 'flex', alignItems: 'center', gap: 16,
              background: 'linear-gradient(180deg, #ffffff 0%, #fbfbfa 100%)', border: `1px solid ${L.line}`, boxShadow: `inset 0 1px 0 #fff, ${softShadow(lift, { color: L.shadow, strength: 0.8 })}`,
              opacity: o, transform: `translateY(${mix(28, 0, bb).toFixed(2)}px) scale(${mix(0.94, 1, bb).toFixed(4)})`, transformOrigin: 'left center',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: alpha(C.c1, 0.12), border: `1px solid ${alpha(C.c1, 0.2)}`, display: 'grid', placeItems: 'center', color: C.c1, fontWeight: 700, fontSize: 22 }}>✓</div>
              <div style={{ fontWeight: 600, fontSize: 32, color: C.ink, whiteSpace: 'nowrap' }}>{it.pill}</div>
            </div>
            {/* 46 px (was 34): read on a phone too; the right column has the room (owner 2026-10-13) */}
            <Caption words={it.cap} showV={showV} innP={innP} outP={outP} style={{ position: 'absolute', left: PX + 18, top: PY0 + k * PSTEP + 72, fontWeight: 600, fontSize: 46 }} />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

export const TaxInvoice: React.FC = () => {
  const f = useAuthorFrame();
  const d = driveAt(f);
  const vNear = -1.4 / 0.7 * velocity((x) => -driveAt(x), f);
  const lift = ramp(f, LIFT0, 16, EASE.out);
  const ring = ramp(f, LIFT0 + 4, 14, EASE.snappy);
  const click = ramp(f, CLICK, 5, EASE.out) * (1 - ramp(f, CLICK + 5, 8, EASE.out));
  // near layer: once the drive has settled, its half-out-of-frame pills recede to a hint (final review 2026-10-13: they
  // stayed as blurred fragments at the frame edges)
  const nearOp = 1 - 0.7 * ramp(f, DRIVE0 + DRIVE_LEN - 4, 14, EASE.out);

  // portal geometry
  const t = interpolate(f, [P0, P1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.7, 0, 0.3, 1) });
  const hs = 1 + 0.12 * lift; // hero lift scale (small element: the card's 1.035 reads as nothing on a button)
  const c0 = { x: printScreen.x - (PRINT.w * (hs - 1)) / 2, y: printScreen.y - 8 * lift - (PRINT.h * (hs - 1)) / 2, w: PRINT.w * hs, h: PRINT.h * hs, r: 6 };
  const wx = mix(c0.x, 0, t), wy = mix(c0.y, 0, t), ww = mix(c0.w, 1920, t), wh = mix(c0.h, 1080, t), wr = mix(c0.r, 0, t);
  const inner = mix(0.42, 1, t);
  const oldDim = 0.22 * ramp(f, P0, 34, EASE.out);

  return (
    <AbsoluteFill style={{ background: L.bg[1], fontFamily: THAI, overflow: 'hidden' }}>
      {t < 1 && (
        <>
          {/* far 0.35x: role centre, out of focus */}
          <div style={{ position: 'absolute', left: -60, top: -40, transform: `translateX(${(d * 0.35 / 0.7).toFixed(2)}px) scale(1.1)`, transformOrigin: '0 0', filter: 'blur(5px) saturate(0.7)', opacity: 0.7 }}>
            <Img src={staticFile('screens/role-center.png')} style={{ width: 1920, height: 1080 }} />
          </div>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${alpha('#F2F6F5', 0.82)} 0%, ${alpha('#EEF3F1', 0.6)} 50%, ${alpha('#E3EBE8', 0.55)} 100%)` }} />

          {/* mid 0.7x: the real Posted Sales Invoice (reading layer, no blur) */}
          <div style={{
            position: 'absolute', left: WIN.x, top: WIN.y, width: CROP.w, height: CROP.h, borderRadius: 14, overflow: 'hidden',
            transform: `translateX(${d.toFixed(2)}px)`, boxShadow: softShadow(10, { color: L.shadow, strength: 1.2 }),
          }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${staticFile(SHOT)})`, backgroundSize: '1920px 1080px', backgroundPosition: `${-CROP.x}px ${-CROP.y}px` }} />
          </div>
          {/* origin tag: the posted invoice page is standard BC */}
          <Tag kind="bc" f={f} at={14} out={P0} style={{ left: WIN.x + d, top: WIN.y - 58 }} />

          {/* hero: the Print... action lifts out of the page */}
          <div style={{
            position: 'absolute', left: printScreen.x + d, top: printScreen.y, width: PRINT.w, height: PRINT.h, borderRadius: 6, overflow: 'hidden',
            transform: `translateY(${(-8 * lift).toFixed(2)}px) scale(${hs.toFixed(4)})`, background: '#fff',
            boxShadow: `0 0 0 ${(2.5 * ring).toFixed(2)}px ${alpha(C.c1, 0.9)}, ${softShadow(4 + 16 * lift, { color: L.shadow, strength: 1.2 })}`,
            opacity: lift > 0 ? 1 : 0,
          }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${staticFile(SHOT)})`, backgroundSize: '1920px 1080px', backgroundPosition: `${-PRINT.x}px ${-PRINT.y}px` }} />
          </div>
          {/* tag: right of the lifted button — above it, it hid the document number IV26120001 (final review 2026-10-13) */}
          <div style={{
            position: 'absolute', left: printScreen.x + d + PRINT.w * (1 + hs) / 2 + 14, top: printScreen.y + PRINT.h / 2 - 25, height: 50, padding: '0 18px', borderRadius: 25, display: 'flex', alignItems: 'center', gap: 8,
            background: C.c1, color: '#fff', ...type(32, 700), fontFamily: THAI, whiteSpace: 'nowrap', opacity: ring,
            transform: `translate(${((1 - ring) * -12).toFixed(2)}px, ${(-8 * lift).toFixed(2)}px)`, boxShadow: softShadow(8, { color: L.shadow }),
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: '#fff' }} />ใบกำกับภาษี
          </div>
          {/* click ripple */}
          {click > 0 && <div style={{ position: 'absolute', left: printScreen.x + PRINT.w / 2 - 34, top: printScreen.y + PRINT.h / 2 - 34 - 8 * lift, width: 68, height: 68, borderRadius: 34, border: `3px solid ${C.c2}`, transform: `scale(${mix(0.5, 1.7, click).toFixed(3)})`, opacity: click }} />}

          {/* near 1.4x: big blurred pills crossing the lens */}
          <SpeedBlur vx={vNear} amount={0.2} max={10}>
            <div style={{ position: 'absolute', inset: 0, transform: `translateX(${(d * 2 - 1700).toFixed(2)}px)`, opacity: nearOp }}>
              {NEAR.map((p) => {
                const bg = p.tone === 'jade' ? C.c1 : p.tone === 'rose' ? C.c3 : p.tone === 'ink' ? C.ink : '#ffffff';
                const fg = p.tone === 'paper' ? C.ink : '#ffffff';
                return <div key={p.t} style={{ position: 'absolute', left: p.x, top: p.y, height: 120, padding: '0 52px', borderRadius: 60, display: 'flex', alignItems: 'center', background: bg, color: fg, fontWeight: 600, fontSize: 56, filter: 'blur(7px)', opacity: 0.9, boxShadow: `0 40px 70px -10px ${alpha(L.shadow, 0.3)}` }}>{p.t}</div>;
              })}
            </div>
          </SpeedBlur>
          {oldDim > 0.002 && <AbsoluteFill style={{ background: alpha('#0E2E2A', oldDim) }} />}
        </>
      )}

      {/* portal window with the document world inside */}
      {f >= P0 && (
        <div style={{ position: 'absolute', left: wx, top: wy, width: ww, height: wh, borderRadius: wr, overflow: 'hidden', boxShadow: t < 1 ? softShadow(40 * (1 - t) + 6, { color: L.shadow, strength: 1.5 }) : 'none' }}>
          <div style={{ position: 'absolute', width: 1920, height: 1080, left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${inner.toFixed(4)})` }}>
            <DocWorld f={f} />
          </div>
          {t < 0.3 && (
            <div style={{ position: 'absolute', inset: 0, opacity: Math.max(0, 1 - t * 3.6), backgroundImage: `url(${staticFile(SHOT)})`, backgroundSize: `${(1920 * ww) / PRINT.w}px ${(1080 * wh) / PRINT.h}px`, backgroundPosition: `${(-PRINT.x * ww) / PRINT.w}px ${(-PRINT.y * wh) / PRINT.h}px` }} />
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
