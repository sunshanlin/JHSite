// JwicLocalization — the explainer's master composition (LOC-DESIGN-SPEC.md). The VO is the clock: timeline.ts lays
// the scenes out from the measured VO lines; every scene is mounted at its SHOTS entry, every VO line and its subtitle
// at VO_AT. Scenes draw their own ground and fade in over the previous one (TAIL overlap, as Main.tsx).
import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from 'remotion';
import { RATE, rf } from '../rate';
import { Preload } from '../Preload';
import { BREATHS, LOC_TOTAL, SHOTS, TAIL, VO_AT, speechFrames, type LocId } from './timeline';
import { VO, voFile } from './vo';
import { SUB_OUT, Subtitle } from './Subtitle';
import { SFX } from './sfx';
import { Breath } from './scenes/Breath';
import { S1Define } from './scenes/S1Define';
import { S3Invoice } from './scenes/S3Invoice';
import { S4Categories } from './scenes/S4Categories';
import { S5RealSystem } from './scenes/S5RealSystem';
import { S6Outro } from './scenes/S6Outro';

const SCENES: Partial<Record<LocId, React.FC>> = {
  s1: S1Define,
  s3: S3Invoice,
  s4: S4Categories,
  s5: S5RealSystem,
  s6: S6Outro,
};
// breath copy: words split with | (Thai joins them on screen), one accent word per card (paper-title-card rule)
const BREATH_TEXT: Record<string, { words: string; accent: string }> = {
  b1: { words: 'เริ่มจาก|ใบกำกับภาษี', accent: 'ใบกำกับภาษี' },
  b2: { words: 'ใน|ระบบ|จริง', accent: 'จริง' },
};

// BGM bed: Mixkit "Infinity" (LOC-DESIGN-SPEC §6), 102.9 s, measured −12.2 LUFS against the scratch VO's −18.4 LUFS. It enters on
// the first breath card (S1 opens on the voice alone) and runs to the end, so its own ending never falls mid-outro.
// Level: BED under speech (≈ −20 dB, VO stays ~12 LU on top), BED_FREE between lines and in the cards/outro, 15 f ramps,
// 20 f fade-in, 40 f fade-out. Re-measure when the Botnoi files land (loc/measure-vo.py prints nothing about level: use ffmpeg ebur128).
const BED = 0.1, BED_FREE = 0.2, RAMP = 15, BGM_FROM = SHOTS.b1.from;
const bgmVolume = (renderFrame: number) => {
  const f = renderFrame / RATE + BGM_FROM; // global author frame
  let duck = 0;
  for (const l of VO) {
    const a = VO_AT[l.no], b = a + speechFrames(l.no);
    duck = Math.max(duck, interpolate(f, [a - RAMP, a, b, b + RAMP], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  }
  const level = BED_FREE - (BED_FREE - BED) * duck;
  const fadeIn = interpolate(f, [BGM_FROM, BGM_FROM + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(f, [LOC_TOTAL - 40, LOC_TOTAL - 2], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return level * fadeIn * fadeOut;
};

export const Loc: React.FC<{ bgm: boolean }> = ({ bgm }) => (
  <AbsoluteFill style={{ background: '#F3F6F5' }}>
    <Preload />
    {(Object.keys(SHOTS) as LocId[]).map((id) => {
      const s = SHOTS[id];
      if (BREATHS.includes(id)) {
        const t = BREATH_TEXT[id];
        return (
          <Sequence key={id} from={rf(s.from - TAIL)} durationInFrames={rf(s.dur + TAIL + TAIL)} name={id}>
            <Breath id={id} words={t.words} accent={t.accent} />
          </Sequence>
        );
      }
      const S = SCENES[id];
      if (!S) return null;
      const lead = s.from === 0 ? 0 : TAIL;
      return (
        <Sequence key={id} from={rf(s.from - lead)} durationInFrames={rf(s.dur + lead + TAIL)} name={id}>
          <S />
        </Sequence>
      );
    })}
    {VO.map((l) => (
      <Sequence key={`vo${l.no}`} from={rf(VO_AT[l.no])} durationInFrames={rf(speechFrames(l.no) + SUB_OUT)} name={`vo ${l.no}`}>
        <Audio src={staticFile(voFile(l.no))} />
        <Subtitle no={l.no} dur={speechFrames(l.no) + SUB_OUT} />
      </Sequence>
    ))}
    {bgm && (
      <Sequence from={rf(BGM_FROM)} durationInFrames={rf(LOC_TOTAL - BGM_FROM)} name="bgm" layout="none">
        <Audio src={staticFile('audio/bgm-infinity.mp3')} volume={bgmVolume} />
      </Sequence>
    )}
    {SFX.map((s, i) => (
      <Sequence key={`sfx${i}`} from={rf(s.from)} durationInFrames={rf(s.dur ?? 90)} name={`sfx: ${s.note}`} layout="none">
        <Audio src={staticFile(`audio/sfx/${s.src}`)} volume={s.volume} trimBefore={s.trimBefore === undefined ? undefined : rf(s.trimBefore)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
export { LOC_TOTAL };
