// JHPresales EP01 — ระบบวางบิล. The "in-game" cut: real Business Central screens being operated,
// Thai captions, a quiet bed. Companion to the trailer (JwicMonth), not a replacement: the trailer
// is the film, this is the product actually being used.
//
// Owner decisions 2026-10-14 — dark green ground (the JHPresales cover's own), burgundy
// interaction marks (DESIGN.md's Burgundy Toll Rule: burgundy = the thing you press), Noto Sans
// Thai, caption as a fixed bottom band, a window frame around the capture, the cover animated as
// the open and the trailer's lockup as the close.

import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from 'remotion';
import { Preload } from '../Preload';
import { THAI } from '../theme';
import { Cover } from './Cover';
import { Outro } from './Outro';
import { SHOT_CFG, Shot } from './Shots';
import { DEMO_SFX } from './sfx';
import {
  BGM_FADE_IN_F,
  BGM_SRC,
  BGM_VOL,
  DEMO_TOTAL,
  FPS,
  SHOTS,
  ShotId,
} from './timeline';

const OPERATING: ShotId[] = [
  'board',
  'click',
  'worklist',
  'create',
  'card',
  'release',
  'print',
];

export const Demo: React.FC<{ bgm: boolean }> = ({ bgm }) => (
  <AbsoluteFill style={{ background: '#0d1f19', fontFamily: THAI }}>
    <Preload />

    {bgm && (
      <Audio
        src={staticFile(BGM_SRC)}
        volume={(f) =>
          BGM_VOL * interpolate(f, [0, BGM_FADE_IN_F], [0, 1], { extrapolateRight: 'clamp' })
        }
      />
    )}

    <Sequence from={SHOTS.cover.from} durationInFrames={SHOTS.cover.dur} name="cover">
      <Cover />
    </Sequence>

    {OPERATING.map((id) => (
      <Sequence key={id} from={SHOTS[id].from} durationInFrames={SHOTS[id].dur} name={id}>
        <Shot cfg={SHOT_CFG[id as keyof typeof SHOT_CFG]} dur={SHOTS[id].dur} />
      </Sequence>
    ))}

    <Sequence from={SHOTS.outro.from} durationInFrames={SHOTS.outro.dur} name="outro">
      <Outro />
    </Sequence>

    {DEMO_SFX.map((s, i) => (
      <Sequence
        key={`sfx${i}`}
        from={s.from}
        durationInFrames={s.dur ?? FPS * 3}
        name={`sfx: ${s.note}`}
        layout="none"
      >
        <Audio src={staticFile(`audio/sfx/${s.src}`)} volume={s.volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export { DEMO_TOTAL, FPS as DEMO_FPS };
