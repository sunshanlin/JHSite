import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from 'remotion';
import { rf, useAuthorFrame } from './rate';
import { C } from './theme';
import { BREATHS, SHOTS, type ShotId } from './timeline';
import { FlowLayer } from './Flow';
import { SFX } from './sfx';
import { Opening } from './scenes/Opening';
import { PurchaseOrder } from './scenes/PurchaseOrder';
import { More } from './scenes/More';
import { PP30 } from './scenes/PP30';
import { WhtCert } from './scenes/WhtCert';
import { BillingNote } from './scenes/BillingNote';
import { TaxInvoice } from './scenes/TaxInvoice';
import { TextFile } from './scenes/TextFile';
import { Receipt } from './scenes/Receipt';
import { Outro } from './scenes/Outro';
import { Preload } from './Preload';

// Shots overlap their neighbours by TAIL frames so a breath can fade over the outgoing shot
// and the incoming shot is already alive when the breath fades away.
export const TAIL = 8;

export const SCENES: Partial<Record<ShotId, React.FC>> = {
  open: Opening,
  po: PurchaseOrder,
  wht: WhtCert,
  inv: TaxInvoice,
  bn: BillingNote,
  rct: Receipt,
  txt: TextFile,
  pp30: PP30,
  more: More,
  outro: Outro,
};

// Breath ground: the soft sky the calendar flips on (approved styleframe f2 ground).
export const BreathGround: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useAuthorFrame();
  const op = interpolate(f, [0, 7, dur - 4, dur + TAIL], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ opacity: op, background: `linear-gradient(135deg, ${C.sky[0]} 0%, ${C.sky[1]} 35%, ${C.sky[2]} 70%, ${C.sky[3]} 100%)` }}>
      <div style={{ position: 'absolute', left: 1240, top: -160, width: 640, height: 640, borderRadius: '50%', background: C.bokeh[0], filter: 'blur(70px)', opacity: 0.7 }} />
      <div style={{ position: 'absolute', left: -160, top: 620, width: 680, height: 680, borderRadius: '50%', background: C.bokeh[1], filter: 'blur(70px)', opacity: 0.7 }} />
    </AbsoluteFill>
  );
};

// BGM = analysis/edit.json (0–62.83 s (bar 30) + bar 46 (96.22 s) to the end, 0.26 s crossfade), rendered to one file.
// Level 0.4 (≈ −8 dB) leaves headroom for the SFX; the song's own ending is the fade-out.
const BGM_VOL = 0.4;

export const Main: React.FC<{ bgm: boolean }> = ({ bgm }) => {
  return (
    <AbsoluteFill style={{ background: '#F3F6F5' }}>
      <Preload />
      {bgm && <Audio src={staticFile('audio/bgm-edit.wav')} volume={(f) => BGM_VOL * interpolate(f, [0, rf(8)], [0, 1], { extrapolateRight: 'clamp' })} />}
      {(Object.keys(SCENES) as ShotId[]).map((id) => {
        const S = SCENES[id]!;
        const s = SHOTS[id];
        const lead = id === 'open' ? 0 : TAIL;
        return (
          // a scene's local frame 0 is TAIL frames before its nominal start (it wakes under the breath)
          <Sequence key={id} from={rf(s.from - lead)} durationInFrames={rf(s.dur + lead + TAIL)} name={id}>
            <S />
          </Sequence>
        );
      })}
      {BREATHS.map((id) => (
        <Sequence key={id} from={rf(SHOTS[id].from)} durationInFrames={rf(SHOTS[id].dur + TAIL)} name={id}>
          <BreathGround dur={SHOTS[id].dur} />
        </Sequence>
      ))}
      <FlowLayer hideAfter={SHOTS.more.from} />
      {SFX.map((s, i) => (
        <Sequence key={`sfx${i}`} from={rf(s.from)} durationInFrames={rf(s.dur ?? 90)} name={`sfx: ${s.note}`} layout="none">
          <Audio src={staticFile(`audio/sfx/${s.src}`)} volume={s.volume} trimBefore={s.trimBefore === undefined ? undefined : rf(s.trimBefore)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
