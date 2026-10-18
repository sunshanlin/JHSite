// จ่ายผู้ขาย · 50 ทวิ — BC's Direct WHT Info dialog (JHCore; capture direct-wht-info, 2×) → "Generate and Print
// Certificate" clicked on beat 36 → the certificate, then draw-svg-trace (demos/ui-entrance/draw-svg-trace/
// DrawSvgTrace.tsx) around the withheld-tax total.
// Owner 2026-10-13 ("มันควรมีหน้าจอ bc ซักหน่อย"): BC's Payment Journal, then the Direct WHT dialog, replace the
// scan-bracket sweep. The lead-in uses the
// billing note's worklist grammar: the window floats in, the WHT line and the total are marked (row wash scaleX
// 0 → 1), the action is locked (snappy 10 f) and clicked, the window recedes with blur while the document pops in
// 0.86 → 1 (the scan card's document pop) and then holds still.
// draw-svg-trace kept: pathLength 1 dash draw over 38 f (card 40 f) inOut(cubic), three tapering pen dashes + a tip,
// closing flash (2 f to ink + 6 → 11 px, 6 f back; the colour eases rose → ink with it), then the trace hands over to
// a hairline. Hold (final review 2026-10-13: a frozen hold reads as a stalled player): a 2 % push runs to the shot's end.
import React from 'react';
import { useHeroMode } from '../heroMode';
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from 'remotion';
import { useAuthorFrame } from '../rate';
import { EASE, mix, ramp, softShadow } from '../fx/Polish';
import { Stage, alpha } from '../fx/Look';
import { C, L, THAI, gradText } from '../theme';
import { SHOTS, TAIL, localBeat } from '../timeline';
import { Tag } from '../Tag';

const DW = 640;
const DH = DW * 1.4134;
const DX = 1030;
const DY = 116; // the tag above the certificate clears the top safe margin (was centred: tag top at 32, final review 2026-10-13)

// Direct WHT Info dialog in CSS px of the capture (capture/dec/layout.json dialog) and boxes inside it
const SHOT = 'screens/direct-wht-info.png';
const DLG = { x: 520, y: 88, w: 880, h: 952 };
const LINE = { x: 26, y: 460, w: 830, h: 27 }; // WHT53 · 53SER · 3 % · 10,000.00 · 300.00 (fgrid)
const TOT = { x: 460, y: 809, w: 396, h: 29 }; // Total Withholding Tax 300.00
const ACT = { x: 24, y: 68, w: 224, h: 38 }; // Generate and Print Certificate
// 0.9 of the capture's size: its tag clears the top safe margin (DS 1 put the dialog at y 64, the tag at 8 — final review 2026-10-13)
const DS = 0.9;
const DLX = 990, DLY = 140;

// withheld-tax total row (รวมเงินที่จ่ายและภาษีที่หักนำส่ง), measured on WHT26120001 (capture/dec, fgrid.py)
const TOTAL = { x: 0.065, y: 0.767, w: 0.872, h: 0.018 };

// ~90 s cut: the shot opens on BC's Payment Journal (standard BC: vendor 10,700 · ภ.ง.ด.53 ค้างจ่าย 300 · bank 10,400),
// then Direct WHT Info opens over it on beat 33 (as it does in BC), Generate and Print Certificate on beat 36.
const JN_SHOT = 'screens/payment-journal.png';
const JN = { x: 396, y: 60, w: 1128, h: 380 }; // header, batch, actions and the three lines (CSS px, layout.json grid)
const JN_ROW = { x: 0, y: 362 - 60, w: 1128, h: 28 }; // the withheld-tax line, inside the crop
const JWS = 1500 / JN.w;
const JNX = 330, JNY = 250; // 30 px lower than before: the payment pill sits above the journal's tag
const OPEN_DLG = localBeat('wht', 33);
export const CLICK = localBeat('wht', 36); // bar downbeat (Hero.tsx switches its crop from the dialog to the certificate here)
const DOC0 = CLICK + 12; // the certificate pops in as the dialog recedes
const END = SHOTS.wht.dur + 2 * TAIL; // last local frame (the scene wakes TAIL early and stays TAIL late)

// the trace's closing flash eases rose → ink instead of switching to black for two frames (final review 2026-10-13)
const mixHex = (a: string, b: string, t: number) => {
  const h = (s: string, i: number) => parseInt(s.slice(1 + 2 * i, 3 + 2 * i), 16);
  const q = Math.max(0, Math.min(1, t));
  return `rgb(${[0, 1, 2].map((i) => Math.round(h(a, i) + (h(b, i) - h(a, i)) * q)).join(',')})`;
};

export const WhtCert: React.FC = () => {
  const f = useAuthorFrame();
  const hero = useHeroMode();
  // lead-in: the BC dialog
  const jn = ramp(f, 4, 14, EASE.snappy) * (1 - ramp(f, CLICK + 8, 16, EASE.swift));
  const jnDim = ramp(f, OPEN_DLG, 10, EASE.out);
  const jnRow = ramp(f, 22, 12, EASE.out);
  const win = ramp(f, OPEN_DLG, 12, EASE.snappy) * (1 - ramp(f, CLICK + 8, 16, EASE.swift));
  const winPush = mix(1, 1.03, ramp(f, OPEN_DLG, CLICK - OPEN_DLG, EASE.smooth));
  const markLine = ramp(f, OPEN_DLG + 12, 12, EASE.out);
  const markTot = ramp(f, OPEN_DLG + 20, 10, EASE.out);
  const lock = CLICK - 12;
  const click = ramp(f, CLICK, 6, EASE.out) * (1 - ramp(f, CLICK + 6, 8, EASE.out));
  const dp = ramp(f, DOC0, 12, EASE.snappy);

  // trace around the total row; closes on beat 40 (bar downbeat), 38 f draw (card 40 f)
  const T1 = localBeat('wht', 40), T0 = T1 - 38;
  const p = interpolate(f, [T0, T1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const flash = f < T1 + 2 ? ramp(f, T1, 2, EASE.linear) : 1 - ramp(f, T1 + 2, 6, EASE.out);
  const strokeW = 6 + flash * 5;
  const traceOp = 1 - ramp(f, T1 + 6, 10, EASE.linear);
  const fill = ramp(f, T1, 10, EASE.out);
  const chip = ramp(f, T1 + 2, 12, EASE.snappy);
  const penOp = interpolate(p, [0, 0.02, 0.97, 0.995], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const R = { x: TOTAL.x * DW - 6, y: TOTAL.y * DH - 4, w: TOTAL.w * DW + 12, h: TOTAL.h * DH + 8 }; // tight: no overlap with the rows around it
  const RX = 10;
  // hold: a 2 % push once the certificate has landed, linear so it still moves when the breath takes over; about the
  // page's upper centre, so the tag riding its corner rises ≤ 2 px and stays clear of the top safe margin
  const push = mix(1, 1.02, ramp(f, DOC0 + 12, END - DOC0 - 12, EASE.linear));
  const PO = { x: DW / 2, y: DH * 0.12 };
  const corner = { x: DX + PO.x * (1 - push), y: DY + PO.y * (1 - push) };
  // the payment the certificate is for, above the journal; it leaves with the journal (owner 2026-10-13)
  const pay = ramp(f, 12, 16, EASE.out) * (1 - ramp(f, CLICK + 8, 16, EASE.swift));

  // the title waits for the journal (which covers the title column) to recede
  const title = (k: number) => ramp(f, CLICK + 10 + k * 5, 22, EASE.out);
  const S = (b: { x: number; y: number; w: number; h: number }) => ({ left: b.x * DS, top: b.y * DS, width: b.w * DS, height: b.h * DS });

  return (
    <AbsoluteFill style={{ fontFamily: THAI, overflow: 'hidden' }}>
      <Stage look={L} keyLight={{ x: 0.66, y: 0.2 }} fill={{ x: 0.1, y: 0.9 }} grain={0.035} />

      {/* title column */}
      <div style={{ visibility: hero ? 'hidden' : undefined, position: 'absolute', left: 140, top: 360, width: 820 }}>
        {['ออกหนังสือรับรอง', 'การหักภาษี ณ ที่จ่าย'].map((line, k) => {
          const q = title(k + 1);
          return (
            <div key={k} style={{
              fontWeight: 700, fontSize: 84, lineHeight: 1.28, color: C.ink, opacity: q, transform: `translateY(${((1 - q) * 32).toFixed(2)}px)`,
              filter: q >= 0.999 ? undefined : `blur(${((1 - q) * 9).toFixed(2)}px)`, ...(k === 1 ? gradText : null), whiteSpace: 'nowrap',
            }}>{line}</div>
          );
        })}
        {/* the form code; the title above already spells out what "50 ทวิ" stands for, so no second gloss here */}
        <div style={{
          display: 'inline-flex', alignItems: 'baseline', gap: 12, marginTop: 22, padding: '8px 26px', borderRadius: 999, border: `1.5px solid ${C.ink}`, background: '#fff',
          fontWeight: 700, fontSize: 34, color: C.ink, whiteSpace: 'nowrap', opacity: title(3), transform: `translateY(${((1 - title(3)) * 16).toFixed(2)}px)`,
        }}>50 ทวิ</div>
      </div>

      {/* the payment behind the certificate, above the journal (PO pill style) */}
      {!hero && pay > 0.001 && (
        <div style={{
          position: 'absolute', left: JNX, top: 90, padding: '8px 26px', borderRadius: 999, border: `1.5px solid ${C.ink}`, background: '#fff', whiteSpace: 'nowrap',
          fontWeight: 600, fontSize: 34, color: C.ink, opacity: pay, transform: `translateY(${((1 - pay) * 16).toFixed(2)}px)`,
        }}>จ่ายผู้ขาย · หัก ณ ที่จ่าย 3% · 300.00</div>
      )}

      {/* BC: the Payment Journal (standard BC), dimmed once the WHT dialog opens over it. The 4:5 hero skips it and frames
          the dialog alone (final review 2026-10-13) */}
      {!hero && jn > 0.001 && (
        <div style={{
          position: 'absolute', left: JNX, top: JNY, width: JN.w * JWS, height: JN.h * JWS, borderRadius: 16, overflow: 'hidden', background: '#fff',
          boxShadow: softShadow(14, { color: L.shadow, strength: 1.2 }), opacity: jn, transform: `scale(${mix(0.94, 1, jn).toFixed(4)})`, transformOrigin: '50% 50%',
          filter: jn < 0.98 ? `blur(${((1 - jn) * 8).toFixed(2)}px)` : undefined,
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${staticFile(JN_SHOT)})`, backgroundSize: `${1920 * JWS}px ${1080 * JWS}px`, backgroundPosition: `${-JN.x * JWS}px ${-JN.y * JWS}px` }} />
          <div style={{ position: 'absolute', left: JN_ROW.x * JWS, top: JN_ROW.y * JWS, width: JN_ROW.w * JWS * jnRow, height: JN_ROW.h * JWS, background: alpha(C.c3, 0.12), boxShadow: `inset 0 0 0 2px ${alpha(C.c3, 0.6)}` }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,46,42,0.28)', opacity: jnDim }} />
        </div>
      )}
      <Tag kind="bc" f={f} at={10} out={OPEN_DLG} style={{ left: JNX, top: JNY - 58 }} />

      {/* BC: Direct WHT Info (real capture, the dialog only) */}
      {win > 0.001 && (
        <div style={{
          position: 'absolute', left: DLX, top: DLY, width: DLG.w * DS, height: DLG.h * DS, borderRadius: 10, overflow: 'hidden', background: '#fff',
          boxShadow: softShadow(18, { color: L.shadow, strength: 1.2 }), opacity: win,
          transform: `scale(${(winPush * mix(0.92, 1, win)).toFixed(4)})`, transformOrigin: `${(ACT.x + ACT.w / 2) * DS}px ${(ACT.y + ACT.h / 2) * DS}px`,
          filter: win < 0.98 ? `blur(${((1 - win) * 8).toFixed(2)}px)` : undefined,
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${staticFile(SHOT)})`, backgroundSize: `${1920 * DS}px ${1080 * DS}px`, backgroundPosition: `${-DLG.x * DS}px ${-DLG.y * DS}px` }} />
          {/* the WHT line and the total withheld, marked in turn */}
          <div style={{ position: 'absolute', ...S(LINE), borderRadius: 4, background: alpha(C.c3, 0.14), boxShadow: `inset 0 0 0 2px ${alpha(C.c3, 0.7)}`, transform: `scaleX(${markLine.toFixed(4)})`, transformOrigin: 'left center' }} />
          <div style={{ position: 'absolute', ...S(TOT), borderRadius: 4, background: alpha(C.c3, 0.14), boxShadow: `inset 0 0 0 2px ${alpha(C.c3, 0.7)}`, transform: `scaleX(${markTot.toFixed(4)})`, transformOrigin: 'left center' }} />
          {/* lock + click on Generate and Print Certificate */}
          <div style={{
            position: 'absolute', left: ACT.x * DS - 6, top: ACT.y * DS - 6, width: ACT.w * DS + 12, height: ACT.h * DS + 12, borderRadius: 10,
            border: `3px solid ${C.c1}`, background: alpha(C.c1, 0.08 * click), transform: `scale(${mix(1.25, 1, ramp(f, lock, 10, EASE.snappy)).toFixed(3)})`,
            opacity: ramp(f, lock, 8, EASE.out),
          }} />
          <div style={{ position: 'absolute', left: (ACT.x + ACT.w / 2) * DS - 34, top: (ACT.y + ACT.h / 2) * DS - 34, width: 68, height: 68, borderRadius: 34, border: `3px solid ${C.c2}`, transform: `scale(${mix(0.5, 1.6, click).toFixed(3)})`, opacity: click }} />
        </div>
      )}

      {/* origin tags: both the Direct WHT dialog and the certificate are JWIC's */}
      <Tag kind="jw" f={f} at={OPEN_DLG + 6} out={CLICK + 8} id="jw-wht1" style={{ left: DLX, top: DLY - 56 }} />
      <Tag kind="jw" f={f} at={DOC0 + 4} id="jw-wht2" style={{ left: corner.x, top: corner.y - 56 }} />

      {dp > 0.001 && (
        <div style={{ position: 'absolute', left: DX, top: DY, width: DW, height: DH, transform: `scale(${push.toFixed(5)})`, transformOrigin: `${PO.x.toFixed(1)}px ${PO.y.toFixed(1)}px` }}>
          {/* the printed certificate: pops in, then a 2 % push */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 10, overflow: 'hidden', background: '#fff',
            boxShadow: `inset 0 0 0 1px ${L.line}, ${softShadow(mix(22, 8, dp), { color: L.shadow, strength: 1.1 })}`,
            transform: `scale(${mix(0.86, 1, dp).toFixed(4)})`, opacity: Math.min(1, dp * 3),
          }}>
            <Img src={staticFile('docs/wht-cert.png')} style={{ width: '100%', height: '100%' }} />
            <div style={{ position: 'absolute', left: R.x, top: R.y, width: R.w, height: R.h, borderRadius: RX, background: alpha(C.c3, 0.12 * fill) }} />
          </div>

          {/* trace around the withheld-tax total */}
          {traceOp > 0.001 && f >= T0 && (
            <svg width={DW} height={DH} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: traceOp }}>
              <rect x={R.x} y={R.y} width={R.w} height={R.h} rx={RX} fill="none" stroke={mixHex(C.c3, C.ink, flash)} strokeWidth={strokeW}
                pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} strokeLinecap="round" />
              {penOp > 0 && [{ len: 0.04, w: 6.4 }, { len: 0.024, w: 8 }, { len: 0.011, w: 9.6 }].map(({ len, w }, k) => (
                <rect key={k} x={R.x} y={R.y} width={R.w} height={R.h} rx={RX} fill="none" stroke={C.c3} strokeWidth={w} opacity={penOp}
                  pathLength={1} strokeDasharray={`${len} ${1 - len}`} strokeDashoffset={len - p} strokeLinecap="round" />
              ))}
            </svg>
          )}
          <div style={{ position: 'absolute', left: R.x, top: R.y, width: R.w, height: R.h, borderRadius: RX, border: `2px solid ${alpha(C.c3, 0.8)}`, boxSizing: 'border-box', opacity: 1 - traceOp }} />
          {/* the withheld tax at film size, level with its traced row on the stage left of the page: above the row it hid
              line 5, and the certificate has no blank paper under its total (final review 2026-10-13) */}
          <div style={{
            position: 'absolute', right: DW + 18, top: R.y + R.h / 2 - 26, height: 52, padding: '0 22px', borderRadius: 26, background: C.c3, color: '#fff',
            display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 32, whiteSpace: 'nowrap', opacity: chip,
            transform: `translateX(${((1 - chip) * 14).toFixed(2)}px)`, boxShadow: `0 10px 24px ${alpha(C.c3, 0.35)}`,
          }}>ภาษีที่หักนำส่ง 300.00</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
