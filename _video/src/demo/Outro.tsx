// Outro — the trailer's "Draw + Wipe" close, re-pinned to this film's beat grid.
//
// Owner 2026-10-14: "Outro ใช้แบบเดียวกับ Trailer อันแรกที่ทำ". The design is src/scenes/Outro.tsx
// verbatim — the mark's outline traced and closing on the song's final hit, the square filling, the
// rose corner folding down, the name uncovered out of the mark, the lines after the stop.
//
// It is a copy rather than an import on purpose: the trailer's scene reads SHOTS.outro.from and
// FINAL_HIT_F from ../timeline and the frame from ../rate, all of which are absolute to the
// trailer's own cut. Mounted inside this composition those would resolve to the wrong frames, and
// editing that file is not ours to do — another session is working on the trailer right now.
// Shared, timeline-free pieces (JwMark, Stage, theme) ARE imported, so the mark itself can never
// drift between the two films.
//
// One adaptation: the trailer hands over from the month folder, which does not exist here. The
// series object (the document stack) takes that role — the thing the viewer has been watching
// drifts to the mark's place and softens away.

import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { EASE, ramp } from '../fx/Polish';
import { Stage } from '../fx/Look';
import { C, L, THAI } from '../theme';
import { JwMark } from '../JwMark';
import { SeriesObject } from './SeriesObject';
import { FINAL_HIT_F, SHOTS, beatF, t } from './timeline';

const MARK = 270;
const WORD = 'JWIC Consulting';
const WORD_SIZE = 108;
const SHIFT = -470; // the mark's place left of centre, so mark + wordmark sit centred as one lockup
const GAP = 60;

const local = (globalF: number) => globalF - SHOTS.outro.from;
const HIT = local(FINAL_HIT_F);
const FOLD_START = HIT + t(7);
const WIPE_START = local(beatF(137)) + t(4);
const LINES = local(beatF(140)) + t(2);

// the mark's outline in JwMark's 64-unit box, inset half a stroke, clockwise from the top-left
const OUTLINE =
  'M4.5,0.5 H59.5 A4,4 0 0 1 63.5,4.5 V59.5 A4,4 0 0 1 59.5,63.5 H4.5 A4,4 0 0 1 0.5,59.5 V4.5 A4,4 0 0 1 4.5,0.5 Z';
const WIPE_FEATHER = 18; // % of the name's width

export const Outro: React.FC = () => {
  const f = useCurrentFrame();

  const drift = ramp(f, t(6), t(24), EASE.smooth);
  const fade = ramp(f, t(14), t(22), EASE.smooth);
  const line = ramp(f, HIT - t(28), t(28), EASE.swift);
  const fill = ramp(f, HIT - t(4), t(12), EASE.out);
  const lineOut = ramp(f, HIT + t(6), t(12), EASE.out);
  const corner = ramp(f, FOLD_START, t(26), EASE.swift);
  const wipe = -WIPE_FEATHER + (100 + WIPE_FEATHER) * ramp(f, WIPE_START, t(32), EASE.swift);
  const wipeMask = `linear-gradient(90deg, #000 ${wipe.toFixed(2)}%, transparent ${(
    wipe + WIPE_FEATHER
  ).toFixed(2)}%)`;
  const tag = ramp(f, LINES, t(20), EASE.out);
  const url = tag;
  const loc = ramp(f, LINES + t(4), t(20), EASE.out);
  const textLeft = 960 + SHIFT + MARK / 2 + GAP;
  const centred: React.CSSProperties = { position: 'absolute', left: '50%', top: '50%' };

  return (
    <AbsoluteFill style={{ fontFamily: THAI }}>
      <Stage look={L} keyLight={{ x: 0.5, y: 0.36 }} fill={{ x: 0.85, y: 0.9 }} grain={0.035} />
      {/* hold under the song's last chord: a 2 % push, the lockup itself stays still */}
      <AbsoluteFill
        style={{
          transform: `scale(${(1 + 0.02 * ramp(f, t(120), t(84), EASE.smooth)).toFixed(5)})`,
          transformOrigin: '960px 560px',
        }}
      >
        <div style={{ position: 'absolute', left: 960 + SHIFT, top: 540, width: 0, height: 0 }}>
          {fade < 1 && (
            <div
              style={{
                ...centred,
                opacity: 1 - fade,
                filter: fade > 0.01 ? `blur(${(22 * fade).toFixed(2)}px)` : undefined,
                transform: `translate(-50%, -50%) translateX(${(-SHIFT * (1 - drift)).toFixed(
                  2,
                )}px) scale(${(1 - 0.04 * fade).toFixed(4)})`,
              }}
            >
              <SeriesObject width={520} height={520} spread={0.5} spin={-0.3} zoom={7.4} />
            </div>
          )}
          {fill > 0 && (
            <div style={{ ...centred, transform: 'translate(-50%, -50%)', opacity: fill }}>
              <JwMark size={MARK} corner={corner} />
            </div>
          )}
          {line > 0 && lineOut < 1 && (
            <svg
              width={MARK}
              height={MARK}
              viewBox="0 0 64 64"
              style={{
                ...centred,
                transform: 'translate(-50%, -50%)',
                opacity: 1 - lineOut,
                overflow: 'visible',
              }}
            >
              <path
                d={OUTLINE}
                pathLength={1}
                fill="none"
                stroke={C.c1}
                strokeWidth={1}
                strokeLinecap="round"
                strokeDasharray="1 1"
                strokeDashoffset={(1 - line).toFixed(4)}
              />
            </svg>
          )}
        </div>

        <div
          style={{
            position: 'absolute',
            left: textLeft,
            top: 540 - 30,
            transform: 'translateY(-50%)',
            fontWeight: 700,
            fontSize: WORD_SIZE,
            lineHeight: 1,
            color: C.ink,
            letterSpacing: '0.01em',
            whiteSpace: 'pre',
            maskImage: wipeMask,
            WebkitMaskImage: wipeMask,
          }}
        >
          {WORD}
        </div>
        <div
          style={{
            position: 'absolute',
            left: textLeft + 4,
            top: 540 + 50,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: '0.2em',
            color: C.muted,
            opacity: tag,
            transform: `translateY(${((1 - tag) * 14).toFixed(1)}px)`,
            filter: tag >= 0.999 ? undefined : `blur(${((1 - tag) * 6).toFixed(2)}px)`,
          }}
        >
          HONEST ADVICE, PRACTICAL SOLUTION
        </div>
        <div
          style={{
            position: 'absolute',
            left: textLeft + 4,
            top: 540 + 108,
            fontWeight: 600,
            fontSize: 45,
            color: C.green,
            whiteSpace: 'nowrap',
            opacity: loc,
            transform: `translateY(${((1 - loc) * 14).toFixed(1)}px)`,
            filter: loc >= 0.999 ? undefined : `blur(${((1 - loc) * 6).toFixed(2)}px)`,
          }}
        >
          Thai Localization สำหรับ Business Central
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 840,
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 64,
            color: C.green,
            opacity: url,
            transform: `translateY(${((1 - url) * 14).toFixed(1)}px)`,
          }}
        >
          www.jwicconsulting.com
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
