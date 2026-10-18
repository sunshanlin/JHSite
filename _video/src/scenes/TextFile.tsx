// ไฟล์ ภ.ง.ด.53 — short PND Form lead-in (real capture, Download Text File), then document-typewriter-reveal
// (demos/ui-entrance/document-typewriter-reveal/DocumentTypewriterReveal.tsx) on the real text file.
// Kept from the demo: blocks are revealed by a paper-coloured mask that shrinks from the left
// (bezier(0.4,0,0.6,1)), ONE caret only, riding the reveal edge inside the real text width and fading 2 f
// after its block; an idle blinking caret before the first block; a highlight wash grows after a block is
// written (multiply, so it tints the paper, not the glyphs); a floating window with rim + back-light + long
// shadow; a monotone Hermite camera from an oblique close-up back to the full window, then a slight tilt that
// frees the bottom for a closing line (rise reveal).
// Adapted: the "document" is the RD Prep text file shown in a plain editor window (the file is plain text, so it
// is drawn, not screenshotted — its bytes are src/data/pnd.ts); header + one row (Dec 2569: one payee) instead of
// 20 blocks, each line on a beat; the wash marks the payee of WHT26120001 (the 50 ทวิ shown earlier); no history tail.
import React from 'react';
import { useHeroMode } from '../heroMode';
import { AbsoluteFill, Easing, interpolate, staticFile } from 'remotion';
import { useAuthorFrame } from '../rate';
import { EASE, ramp, softShadow } from '../fx/Polish';
import { TextReveal, alpha } from '../fx/Look';
import { C, L, THAI, gradFill as gradText } from '../theme';
import { localBeat } from '../timeline';
import { Tag } from '../Tag';
import { PND_FILE, PND_FORM, PND_LINES } from '../data/pnd';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// PND Form capture (CSS px), layout key pnd-form-pnd3
const SHOT = 'screens/pnd-form.png';
const PCROP = { x: 440, y: 60, w: 1060, h: 660 };
const ACT = { x: 906, y: 169, w: 158, h: 38 }; // Download Text File
const PS = 1.25;
// x 340 (was centred at 297): with its 6 % push about Download Text File the page's left edge stays right of the
// docked list (x ≤ 284) — final review 2026-10-13
const PWIN = { x: 340, y: 150 };

const CLICK = localBeat('txt', 119);
const OPEN = localBeat('txt', 120); // bar downbeat (the music splice falls here since the 2026-10-13 re-time — accepted)
const CUES = PND_LINES.length > 2 ? [120.5, 121.25, 122].map((n) => localBeat('txt', n)) : [120.5, 121.5].map((n) => localBeat('txt', n)); // header + rows
const WIPE = 12;
const REVEAL = Easing.bezier(0.4, 0, 0.6, 1);

// editor window (its own page space; the camera flies over it)
const EW = 1500, EH = 520;
const PAPER = '#FCFDFC';
const MONO = 'Consolas, "Cascadia Mono", monospace';
const FS = 26, LH = 54, TOP = 120, LEFT = 96;
const CHAR_W = FS * 0.55; // Consolas advance ≈ 0.55 em — only bounds the caret, never positions marks
// a line longer than the window fades out at its end instead of being cut through a glyph (the header ended on a lone
// leading vowel, final review 2026-10-13)
const LINE_FADE = 'linear-gradient(90deg, #000 calc(100% - 120px), transparent)';
// closing line: left-aligned with the editor window's left edge in its final pose (it started ~70 px left of it)
const CLOSE = { x: 283, y: 846 };

// camera: page point (cx, cy) → screen centre, Hermite through the keys (demo's monotone spline)
type Cam = { cx: number; cy: number; zoom: number; rotX: number; rotY: number; sy: number };
const KEYS: (Cam & { f: number })[] = [
  // owner 2026-10-13: no deep zoom into documents — the oblique start is a gentle 1.12 (demo-style 1.32)
  { f: OPEN, cx: 600, cy: 200, zoom: 1.12, rotX: 6, rotY: -12, sy: 0 },
  { f: OPEN + 22, cx: 680, cy: 230, zoom: 1.05, rotX: 4, rotY: -8, sy: 0 },
  { f: OPEN + 52, cx: EW / 2, cy: EH / 2, zoom: 0.98, rotX: 3, rotY: -4, sy: -20 },
  { f: OPEN + 80, cx: EW / 2, cy: EH / 2, zoom: 0.9, rotX: 8, rotY: -2, sy: -110 },
  { f: OPEN + 130, cx: EW / 2, cy: EH / 2, zoom: 0.905, rotX: 8, rotY: -2, sy: -112 },
];
const hermite = (xs: number[], ys: number[]) => {
  const n = xs.length;
  const d = xs.slice(0, -1).map((x, i) => (ys[i + 1] - ys[i]) / (xs[i + 1] - x));
  const m = xs.map((_, i) => (i === 0 || i === n - 1 ? 0 : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2));
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b;
    if (h > 9) { const k = 3 / Math.sqrt(h); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; }
  }
  return (x: number) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (i < n - 2 && x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
};
const PARAMS: (keyof Cam)[] = ['cx', 'cy', 'zoom', 'rotX', 'rotY', 'sy'];
const CURVES = Object.fromEntries(PARAMS.map((p) => [p, hermite(KEYS.map((k) => k.f), KEYS.map((k) => k[p]))])) as Record<keyof Cam, (x: number) => number>;
const camAt = (f: number) => Object.fromEntries(PARAMS.map((p) => [p, CURVES[p](f)])) as Cam;

// row 1 = the payment behind the 50 ทวิ shown earlier: its payee and withheld amount get the wash.
// Fields are found by header name, so the same code reads ภ.ง.ด.3 and ภ.ง.ด.53 files.
// Split into segments so the wash follows the real glyph widths (Thai falls back to a proportional font).
const HEAD = (PND_LINES[0] ?? '').split('|');
const ROW1F = (PND_LINES[1] ?? '').split('|');
const MARKS = [HEAD.indexOf('ชื่อ'), HEAD.indexOf('จำนวนภาษีที่หัก')].filter((i) => i >= 0).map((i) => ROW1F[i]).filter(Boolean);
const segments = (line: string) => {
  const out: { t: string; mark: number }[] = [];
  let rest = line;
  MARKS.forEach((m, k) => {
    const i = rest.indexOf(m);
    if (i < 0) return;
    out.push({ t: rest.slice(0, i), mark: -1 }, { t: m, mark: k });
    rest = rest.slice(i + m.length);
  });
  out.push({ t: rest, mark: -1 });
  return out;
};

export const TextFile: React.FC = () => {
  const f = useAuthorFrame();
  const hero = useHeroMode();
  const lead = 1 - ramp(f, OPEN - 2, 14, EASE.swift); // PND page recedes
  const push = 1 + 0.06 * ramp(f, 4, CLICK - 4, EASE.smooth);
  const click = ramp(f, CLICK, 5, EASE.out) * (1 - ramp(f, CLICK + 5, 8, EASE.out));
  const win = ramp(f, OPEN, 16, EASE.snappy);
  const cam = camAt(Math.max(f, OPEN));
  // only one caret: the latest block still being written
  let caret = -1;
  CUES.forEach((c, i) => { if (f >= c && f <= c + WIPE + 2) caret = i; });
  const idle = f >= OPEN && f < CUES[0] ? (Math.floor(f / 4) % 2 === 0 ? 1 : 0.25) : 0;
  const tag = ramp(f, OPEN + 60, 18, EASE.out);

  return (
    <AbsoluteFill style={{ fontFamily: THAI, overflow: 'hidden', background: `radial-gradient(70% 90% at 50% 10%, #FFFFFF 0%, #EEF3F1 55%, #E1EAE7 100%)` }}>
      {/* PND Form lead-in */}
      {lead > 0.001 && (
        <div style={{
          position: 'absolute', left: PWIN.x, top: PWIN.y, width: PCROP.w * PS, height: PCROP.h * PS, borderRadius: 16, overflow: 'hidden',
          boxShadow: softShadow(14, { color: L.shadow, strength: 1.2 }), opacity: lead,
          transform: `scale(${(push * (0.9 + 0.1 * lead)).toFixed(4)})`, transformOrigin: `${(ACT.x - PCROP.x + ACT.w / 2) * PS}px ${(ACT.y - PCROP.y) * PS}px`,
          filter: lead < 0.98 ? `blur(${((1 - lead) * 8).toFixed(2)}px)` : undefined,
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${staticFile(SHOT)})`, backgroundSize: `${1920 * PS}px ${1080 * PS}px`, backgroundPosition: `${-PCROP.x * PS}px ${-PCROP.y * PS}px` }} />
          <div style={{
            position: 'absolute', left: (ACT.x - PCROP.x) * PS - 6, top: (ACT.y - PCROP.y) * PS - 6, width: ACT.w * PS + 12, height: ACT.h * PS + 12, borderRadius: 10,
            border: `3px solid ${C.c1}`, opacity: ramp(f, CLICK - 14, 8, EASE.out), transform: `scale(${(1.2 - 0.2 * ramp(f, CLICK - 14, 10, EASE.snappy)).toFixed(3)})`,
          }} />
          {click > 0 && <div style={{ position: 'absolute', left: (ACT.x - PCROP.x + ACT.w / 2) * PS - 34, top: (ACT.y - PCROP.y + ACT.h / 2) * PS - 34, width: 68, height: 68, borderRadius: 34, border: `3px solid ${C.c2}`, transform: `scale(${(0.5 + 1.1 * click).toFixed(3)})`, opacity: click }} />}
        </div>
      )}

      {/* editor window under the camera */}
      {f >= OPEN - 2 && (
        <AbsoluteFill style={{ transform: `translateY(${cam.sy.toFixed(2)}px)`, opacity: win }}>
          <div style={{ position: 'absolute', inset: 0, perspective: `${(2200 * cam.zoom).toFixed(1)}px`, perspectiveOrigin: '960px 540px' }}>
            <div style={{
              position: 'absolute', width: EW, height: EH, zoom: cam.zoom,
              transform: `translate(${(960 / cam.zoom - cam.cx).toFixed(2)}px, ${(540 / cam.zoom - cam.cy).toFixed(2)}px) rotateY(${cam.rotY.toFixed(3)}deg) rotateX(${cam.rotX.toFixed(3)}deg) scale(${(0.92 + 0.08 * win).toFixed(4)})`,
              transformOrigin: `${cam.cx.toFixed(1)}px ${cam.cy.toFixed(1)}px`, transformStyle: 'preserve-3d',
            }}>
              {/* back-light */}
              <div style={{ position: 'absolute', left: -200, top: -160, width: EW + 400, height: EH + 320, background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${alpha(C.c2, 0.22)} 0%, ${alpha(C.c4, 0.08)} 55%, transparent 72%)`, transform: 'translateZ(-40px)' }} />
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 22, overflow: 'hidden', background: PAPER,
                boxShadow: `0 0 0 1.5px ${alpha('#ffffff', 0.9)}, 0 60px 140px -20px ${alpha(L.shadow, 0.45)}, 0 18px 50px ${alpha(L.shadow, 0.18)}`,
              }}>
                {/* window chrome */}
                <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 64, background: '#F1F5F4', borderBottom: `1px solid ${L.line}`, display: 'flex', alignItems: 'center', gap: 14, padding: '0 26px' }}>
                  {['#E4E9E8', '#E4E9E8', '#E4E9E8'].map((c, i) => <span key={i} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
                  <span style={{ marginLeft: 12, fontFamily: THAI, fontWeight: 600, fontSize: 24, color: C.ink }}>{PND_FILE}</span>
                </div>
                {/* gutter */}
                <div style={{ position: 'absolute', left: 0, top: 64, bottom: 44, width: 72, background: '#F6F9F8', borderRight: `1px solid ${L.line}` }} />
                {PND_LINES.map((line, i) => {
                  const cue = CUES[i] ?? CUES[CUES.length - 1];
                  const cover = interpolate(f, [cue, cue + WIPE], [1, 0], { ...clamp, easing: REVEAL });
                  const y = TOP + i * LH;
                  const textW = Math.min(EW - LEFT - 30, line.length * CHAR_W);
                  const caretX = LEFT + (EW - LEFT) * (1 - cover);
                  return (
                    <React.Fragment key={i}>
                      <div style={{ position: 'absolute', left: 22, top: y, width: 34, textAlign: 'right', fontFamily: MONO, fontSize: 22, lineHeight: `${LH}px`, color: '#9AA6A3' }}>{i + 1}</div>
                      <div style={{ position: 'absolute', left: LEFT, top: y, right: 30, fontFamily: MONO, fontSize: FS, lineHeight: `${LH}px`, color: i === 0 ? C.muted : C.ink, whiteSpace: 'pre', overflow: 'hidden', maskImage: LINE_FADE, WebkitMaskImage: LINE_FADE }}>
                        {i !== 1 ? line : segments(line).map((sg, k) => {
                          if (sg.mark < 0) return <span key={k}>{sg.t}</span>;
                          // wash grows after the line is written (multiply: tints the paper, not the glyphs)
                          const g = interpolate(f, [cue + WIPE + 4 + sg.mark * 4, cue + WIPE + 12 + sg.mark * 4], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0, 0.2, 1) });
                          return (
                            <span key={k} style={{ position: 'relative', display: 'inline-block' }}>
                              <span style={{ position: 'absolute', left: -4, top: 8, bottom: 8, width: `calc(${(g * 100).toFixed(1)}% + 8px)`, borderRadius: 6, background: alpha(C.c4, 0.45), mixBlendMode: 'multiply' }} />
                              <span style={{ position: 'relative' }}>{sg.t}</span>
                            </span>
                          );
                        })}
                      </div>
                      {cover > 0 && <div style={{ position: 'absolute', right: 0, top: y, width: `${(cover * (EW - LEFT + 10)).toFixed(1)}px`, height: LH, background: PAPER }} />}
                      {i === caret && (
                        <div style={{
                          position: 'absolute', left: Math.min(caretX, LEFT + textW + 4), top: y + 12, width: 3, height: LH - 24, borderRadius: 2, background: C.c1,
                          boxShadow: `0 0 8px ${alpha(C.c1, 0.6)}, 0 0 20px ${alpha(C.c2, 0.45)}`,
                          opacity: cover > 0 ? 1 : interpolate(f, [cue + WIPE, cue + WIPE + 2], [1, 0], clamp),
                        }} />
                      )}
                    </React.Fragment>
                  );
                })}
                {idle > 0 && <div style={{ position: 'absolute', left: LEFT - 2, top: TOP + 12, width: 3, height: LH - 24, background: C.c1, opacity: idle }} />}
                {/* status bar: the file's real encoding and line ending */}
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 44, background: '#F1F5F4', borderTop: `1px solid ${L.line}`, display: 'flex', alignItems: 'center', gap: 28, padding: '0 26px', fontFamily: MONO, fontSize: 20, color: '#7C8A87' }}>
                  <span>UTF-8</span><span>CRLF</span><span style={{ fontFamily: THAI }}>{PND_LINES.length} บรรทัด</span>
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* origin tag: the PND Report page and its RD Prep text file are JWIC's */}
      <Tag kind="jw" f={f} at={10} out={OPEN - 2} id="jw-txt1" style={{ left: PWIN.x, top: PWIN.y - 58 }} />

      {/* closing line under the window, and the form code's gloss under it (muted, owner 2026-10-13) */}
      <div style={{ visibility: hero ? 'hidden' : undefined, position: 'absolute', left: CLOSE.x, top: CLOSE.y, display: 'flex', alignItems: 'center', gap: 28, opacity: tag > 0 ? 1 : 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', fontWeight: 700, fontSize: 80, lineHeight: 1.25, color: C.ink, whiteSpace: 'nowrap' }}>
          <TextReveal text="ส่งออกไฟล์" by="line" variant="rise" start={OPEN + 60} each={16} />
          <TextReveal text={` ${PND_FORM}`} by="line" variant="rise" start={OPEN + 64} each={16} unitStyle={() => gradText} />
        </div>
        <div style={{
          padding: '8px 26px', borderRadius: 999, border: `1.5px solid ${C.ink}`, background: '#fff', fontWeight: 600, fontSize: 34, color: C.ink, whiteSpace: 'nowrap',
          opacity: ramp(f, OPEN + 74, 14, EASE.out), transform: `translateY(${((1 - ramp(f, OPEN + 74, 16, EASE.snappy)) * 14).toFixed(2)}px)`,
        }}>พร้อมนำเข้า RD Prep</div>
        <Tag kind="jw" f={f} at={OPEN + 80} id="jw-txt2" style={{ position: 'relative' }} />
      </div>
      <div style={{
        visibility: hero ? 'hidden' : undefined, position: 'absolute', left: CLOSE.x + 4, top: CLOSE.y + 104, display: 'flex', alignItems: 'baseline', gap: 12, whiteSpace: 'nowrap',
        fontWeight: 600, fontSize: 32, color: C.muted, opacity: ramp(f, OPEN + 70, 14, EASE.out), transform: `translateY(${((1 - ramp(f, OPEN + 70, 16, EASE.snappy)) * 12).toFixed(2)}px)`,
      }}><span style={{ fontWeight: 700 }}>{PND_FORM}</span>· จ่ายนิติบุคคล</div>
    </AbsoluteFill>
  );
};
