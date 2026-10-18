// Outro — the month folder hands over to the JW mark, which is drawn on the music, then the name is uncovered out of it.
// Owner 2026-10-14 (review of the shipped icon-flip-bloom): "นุ่มนวลกว่านี้ เปลี่ยน effect แต่ยังต้องเข้ากับเพลง" — picked
// "Draw + Wipe" from two rounds of previews (out/outro-variants/; the other readings are parked there as *.tsx.bak).
// Music under it (bgm-edit.wav; local f = scene frame − 8 = global − SHOTS.outro.from): the song's last hit is beat 168
// (f 46), one more bar plays (beats 169–171 at f 62 / 78 / 93), the groove stops on beat 172 (f 109) and the last chord
// rings out ~3 s.
//   f 6–36   the folder drifts from the centre to the lockup spot and softens away (fade + blur 22)
//   f 18–46  the mark's outline is traced there in jade, closing on the final hit
//   f 42–54  the square + JW fill in on the hit; the line fades after it
//   f 53–79  the rose corner folds down (JwMark `corner`), through vertical on beat 169
//   f 66–98  "JWIC Consulting" is uncovered left → right by a feathered mask sweeping out of the mark (whole on beat 171)
//   f 111+   tagline + URL, then the Localization line, settle just after the stop; a 2 % push under the ring-out
// The mark sits at the lockup spot from the start, so nothing slides once it is there.
// Phone legibility (owner 2026-10-13): the URL is 64 px and comes in with the tagline, the Localization line 45 px
// (about the wordmark's width, so the lockup stays one block). The 4:5 hero draws no stage of its own: its window sat
// as a lighter band with hard edges on the hero's ground (final review 2026-10-13).
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useAuthorFrame } from '../rate';
import { EASE, ramp } from '../fx/Polish';
import { Stage } from '../fx/Look';
import { C, L, THAI } from '../theme';
import { Folder } from '../Folder';
import { JwMark } from '../JwMark';
import { useHeroMode } from '../heroMode';
import { FINAL_HIT_F, SHOTS, beatF } from '../timeline';

const MARK = 270;
const WORD = 'JWIC Consulting';
const WORD_SIZE = 108;
const SHIFT = -470; // the mark's place left of centre, so mark + wordmark sit centred as one lockup
const GAP = 60;

const local = (globalF: number) => globalF - SHOTS.outro.from;
const HIT = local(FINAL_HIT_F); // 46 — beat 168
export const FOLD_START = HIT + 7; // 53: EASE.swift passes half-way at 35 % of its 26 f, so the corner stands up on beat 169
const WIPE_START = local(beatF(169)) + 4; // 66
const LINES = local(beatF(172)) + 2; // 111 — just after the stop

// the mark's outline in JwMark's 64-unit box, inset half a stroke, clockwise from the top-left corner
const OUTLINE = 'M4.5,0.5 H59.5 A4,4 0 0 1 63.5,4.5 V59.5 A4,4 0 0 1 59.5,63.5 H4.5 A4,4 0 0 1 0.5,59.5 V4.5 A4,4 0 0 1 4.5,0.5 Z';
const WIPE_FEATHER = 18; // % of the name's width

export const Outro: React.FC = () => {
  const frame = useAuthorFrame();
  const hero = useHeroMode();
  const f = frame - 8; // scene lead

  const drift = ramp(f, 6, 24, EASE.smooth); // folder: centre → the mark's place
  const fade = ramp(f, 14, 22, EASE.smooth);
  const line = ramp(f, HIT - 28, 28, EASE.swift);
  const fill = ramp(f, HIT - 4, 12, EASE.out);
  const lineOut = ramp(f, HIT + 6, 12, EASE.out);
  const corner = ramp(f, FOLD_START, 26, EASE.swift);
  const wipe = -WIPE_FEATHER + (100 + WIPE_FEATHER) * ramp(f, WIPE_START, 32, EASE.swift);
  const wipeMask = `linear-gradient(90deg, #000 ${wipe.toFixed(2)}%, transparent ${(wipe + WIPE_FEATHER).toFixed(2)}%)`;
  const tag = ramp(f, LINES, 20, EASE.out);
  const url = tag; // with the tagline
  const loc = ramp(f, LINES + 4, 20, EASE.out);
  const textLeft = 960 + SHIFT + MARK / 2 + GAP;
  const centred: React.CSSProperties = { position: 'absolute', left: '50%', top: '50%' };

  return (
    <AbsoluteFill style={{ fontFamily: THAI }}>
      {!hero && <Stage look={L} keyLight={{ x: 0.5, y: 0.36 }} fill={{ x: 0.85, y: 0.9 }} grain={0.035} />}
      {/* hold under the song's last chord: only a 2 % push, the lockup itself stays still */}
      <AbsoluteFill style={{ transform: `scale(${(1 + 0.02 * ramp(f, 120, 84, EASE.smooth)).toFixed(5)})`, transformOrigin: '960px 560px' }}>
      <div style={{ position: 'absolute', left: 960 + SHIFT, top: 540, width: 0, height: 0 }}>
        {fade < 1 && (
          <div style={{
            ...centred, opacity: 1 - fade, filter: fade > 0.01 ? `blur(${(22 * fade).toFixed(2)}px)` : undefined,
            transform: `translate(-50%, -50%) translateX(${(-SHIFT * (1 - drift)).toFixed(2)}px) scale(${(1 - 0.04 * fade).toFixed(4)})`,
          }}>
            <Folder />
          </div>
        )}
        {fill > 0 && <div style={{ ...centred, transform: 'translate(-50%, -50%)', opacity: fill }}><JwMark size={MARK} corner={corner} /></div>}
        {line > 0 && lineOut < 1 && (
          <svg width={MARK} height={MARK} viewBox="0 0 64 64" style={{ ...centred, transform: 'translate(-50%, -50%)', opacity: 1 - lineOut, overflow: 'visible' }}>
            {/* pathLength 1: the dash pattern runs in fractions of the outline, so `line` is how much of it is drawn */}
            <path d={OUTLINE} pathLength={1} fill="none" stroke={C.c1} strokeWidth={1} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={(1 - line).toFixed(4)} />
          </svg>
        )}
      </div>

      {/* wordmark, uncovered out of the mark */}
      <div style={{
        position: 'absolute', left: textLeft, top: 540 - 30, transform: 'translateY(-50%)', fontWeight: 700, fontSize: WORD_SIZE, lineHeight: 1,
        color: C.ink, letterSpacing: '0.01em', whiteSpace: 'pre', maskImage: wipeMask, WebkitMaskImage: wipeMask,
      }}>{WORD}</div>
      <div style={{
        position: 'absolute', left: textLeft + 4, top: 540 + 50, fontWeight: 600, fontSize: 34, letterSpacing: '0.2em', color: C.muted,
        opacity: tag, transform: `translateY(${((1 - tag) * 14).toFixed(1)}px)`, filter: tag >= 0.999 ? undefined : `blur(${((1 - tag) * 6).toFixed(2)}px)`,
      }}>HONEST ADVICE, PRACTICAL SOLUTION</div>
      {/* what the company ships, in one line (owner 2026-10-13: make JWIC Localization explicit) */}
      <div style={{
        position: 'absolute', left: textLeft + 4, top: 540 + 108, fontWeight: 600, fontSize: 45, color: C.green, whiteSpace: 'nowrap',
        opacity: loc, transform: `translateY(${((1 - loc) * 14).toFixed(1)}px)`, filter: loc >= 0.999 ? undefined : `blur(${((1 - loc) * 6).toFixed(2)}px)`,
      }}>Thai Localization สำหรับ Business Central</div>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 840, textAlign: 'center', fontWeight: 600, fontSize: 64, color: C.green,
        opacity: url, transform: `translateY(${((1 - url) * 14).toFixed(1)}px)`,
      }}>www.jwicconsulting.com</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
