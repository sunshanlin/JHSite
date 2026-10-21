// JwicLocalization — the explainer's master composition (LOC-DESIGN-SPEC.md). The VO is the clock: timeline.ts lays
// the scenes out from the measured VO lines (or, with no voice, from each line's reading time — NARRATED in vo.ts); every scene is
// mounted at its SHOTS entry, every spoken VO line (SPOKEN: the lines a scene owns) and its subtitle at VO_AT. Scenes draw their own pastel field; a cut is an iris reveal of the next scene over the previous one (TAIL overlap).
import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from 'remotion';
import { RATE, rf, useAuthorFrame } from '../rate';
import { EASE, ramp } from '../fx/Polish';
import type { Field } from './skin';
import { S0Modern } from './scenes/S0Modern';
import { S1Modern } from './scenes/S1Modern';
import { LocPreload } from './LocPreload';
import { BREATHS, LOC_TOTAL, SHOTS, SPOKEN, TAIL, VO_AT, speechFrames, type LocId } from './timeline';
import { NARRATED, voFile } from './vo';
import { SUB_OUT, Subtitle } from './Subtitle';
import { SFX } from './sfx';
import { Breath } from './scenes/Breath';
import { S3Invoice } from './scenes/S3Invoice';
import { S4Categories } from './scenes/S4Categories';
import { S5RealSystem } from './scenes/S5RealSystem';
import { S6Outro } from './scenes/S6Outro';
import { Outro } from '../scenes/Outro';

// The JWIC Consulting ending is the month clip's outro itself ("Draw + Wipe", src/scenes/Outro.tsx), frame for frame: the mark
// and the name only (owner 2026-10-19 — no folder, tagline, Localization line or URL) and no music: its three SFX in sfx.ts are
// all that plays under it.
const JwicOutro: React.FC = () => <Outro handOver={false} lines={false} />;

const SCENES: Partial<Record<LocId, React.FC>> = {
  s0: S0Modern,
  s1: S1Modern,
  s3: S3Invoice,
  s4: S4Categories,
  s5: S5RealSystem,
  s6: S6Outro,
  end: JwicOutro,
};
// breath copy: words split with | (Thai joins them on screen), one accent word per card (paper-title-card rule)
const BREATH_TEXT: Record<string, { words: string; accent: string; field: Field }> = {
  b1: { words: 'เริ่มจาก|ใบกำกับภาษี', accent: 'ใบกำกับภาษี', field: 'butter' },
  b2: { words: 'ใน|ระบบ|จริง', accent: 'จริง', field: 'mint' },
};

// A cut between scenes is the next colour field opening as a circle from the centre (skin.ts: the colour change IS the transition).
// A non-first scene is mounted TAIL frames early (frame.ts), so the iris runs over those frames plus a few more.
const Iris: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useAuthorFrame();
  const p = ramp(f, 0, TAIL + 8, EASE.swift);
  return <AbsoluteFill style={{ clipPath: p < 1 ? `circle(${(1300 * p).toFixed(1)}px at 50% 50%)` : undefined }}>{children}</AbsoluteFill>;
};

// BGM bed: Mixkit "Infinity" (LOC-DESIGN-SPEC §6), 102.9 s, measured −12.2 LUFS against VO lines at −18 LUFS. It enters on
// the first breath card (S0 and S1 open on the voice alone; starting earlier would run the 102.9 s track out before the outro) and
// fades out by the JWIC Consulting outro, which plays on its SFX alone (owner 2026-10-19).
// Level: BED under speech (≈ −20 dB, VO stays ~12 LU on top), BED_FREE between lines and in the cards, 15 f ramps,
// 20 f fade-in, 40 f fade-out. D:/TTS/scripts/make_vo.py levels every line to −18 LUFS; another VO source must match it (ffmpeg ebur128).
// Since 2026-10-21 both modes play Mixkit "Lo-Fi 05" by Lily J instead (125.6 s, −11.1 LUFS, Mixkit Stock Music Free License; the
// owner's pick): narrated, from b1 and ducked as above, TRIM taking off the 1.1 dB it is hotter than Infinity; with no voice
// (NARRATED false) from the first frame at MUSIC with nothing to duck under, timeline.ts cutting on its half-bars. Same fade-out.
const BED = 0.1, BED_FREE = 0.2, RAMP = 15, MUSIC = 0.5, TRIM = 10 ** (-1.1 / 20), BGM_TO = SHOTS.end.from;
const BGM_FROM = NARRATED ? SHOTS.b1.from : 0, BGM_SRC = 'audio/bgm-lofi-05.mp3';
const bgmVolume = (renderFrame: number) => {
  const f = renderFrame / RATE + BGM_FROM; // global author frame
  let duck = 0;
  for (const l of SPOKEN) {
    const a = VO_AT[l.no], b = a + speechFrames(l.no);
    duck = Math.max(duck, interpolate(f, [a - RAMP, a, b, b + RAMP], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  }
  const level = NARRATED ? TRIM * (BED_FREE - (BED_FREE - BED) * duck) : MUSIC;
  const fadeIn = interpolate(f, [BGM_FROM, BGM_FROM + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(f, [BGM_TO - 40, BGM_TO - 2], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return level * fadeIn * fadeOut;
};

export const Loc: React.FC<{ bgm: boolean }> = ({ bgm }) => (
  <AbsoluteFill style={{ background: '#F3F6F5' }}>
    <LocPreload />
    {(Object.keys(SHOTS) as LocId[]).map((id) => {
      const s = SHOTS[id];
      if (BREATHS.includes(id)) {
        const t = BREATH_TEXT[id];
        return (
          <Sequence key={id} from={rf(s.from - TAIL)} durationInFrames={rf(s.dur + TAIL + TAIL)} name={id}>
            <Iris>
              <Breath id={id} words={t.words} accent={t.accent} field={t.field} />
            </Iris>
          </Sequence>
        );
      }
      const S = SCENES[id];
      if (!S) return null;
      const lead = s.from === 0 ? 0 : TAIL;
      return (
        <Sequence key={id} from={rf(s.from - lead)} durationInFrames={rf(s.dur + lead + TAIL)} name={id}>
          {lead === 0 ? <S /> : <Iris><S /></Iris>}
        </Sequence>
      );
    })}
    {SPOKEN.map((l) => (
      <Sequence key={`vo${l.no}`} from={rf(VO_AT[l.no])} durationInFrames={rf(speechFrames(l.no) + SUB_OUT)} name={`vo ${l.no}`}>
        {NARRATED && <Audio src={staticFile(voFile(l.no))} />}
        <Subtitle no={l.no} dur={speechFrames(l.no) + SUB_OUT} />
      </Sequence>
    ))}
    {bgm && (
      <Sequence from={rf(BGM_FROM)} durationInFrames={rf(BGM_TO - BGM_FROM)} name="bgm" layout="none">
        <Audio src={staticFile(BGM_SRC)} volume={bgmVolume} />
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
