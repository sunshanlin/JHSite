// SFX for the in-game demo. Far sparser than the trailer's table: this clip's job is to be read,
// so only a state change gets a sound and the bed carries everything else.
//
// Levels are derived, not guessed. At BGM_VOL 0.24 the bed sits at ~ -27.4 dBFS RMS; each
// sample's `heard` level is its measured rms@peak + 20*log10(volume). Measurements are from
// tools/peaks3.py against the n/ (level-matched) copies, whose peak lags differ from the mp3s.
//
// Pin rule (the project's): from = targetFrame - PEAK; the map at the bottom then subtracts the
// output audio offset once, exactly as src/sfx.ts does.

import { FPS, OUTPUT_AUDIO_OFFSET_F, SHOTS, beatF, t } from './timeline';

export type Sfx = {
  from: number;
  src: string;
  volume: number;
  dur?: number;
  note: string;
};

/** seconds -> frames at the film's frame rate */
const pk = (s: number) => Math.round(s * FPS);

/** measured perceived-peak lag per sample actually used here */
const PEAK = {
  click: pk(0.007), // switch-click-quick.mp3 — effectively zero
  swell: pk(0.453), // transition-soft.mp3
  slide: pk(0.334), // n/paper-slide.wav
  turn: pk(0.126), // n/paper-page-turn.wav
  pop: pk(0.037), // n/pop.wav
};

/** scene-local frame (authored at 30 fps) -> global frame at the film's rate */
const at = (id: keyof typeof SHOTS, local30: number) => SHOTS[id].from + t(local30);
/** global frame of a beat — no conversion needed, beatF is computed from seconds */
const onBeat = (n: number) => beatF(n);

const RAW: Sfx[] = [
  // --- cover: the corner folds, then the lockup pills settle
  { from: at('cover', 23) - PEAK.turn, src: 'n/paper-page-turn.wav', volume: 0.42, note: 'cover corner folds' },
  { from: at('cover', 133) - PEAK.pop, src: 'n/pop.wav', volume: 0.5, note: 'cover pills settle' },

  // --- board: the window arrives, then the two callouts land
  { from: SHOTS.board.from - PEAK.swell, src: 'transition-soft.mp3', volume: 0.22, note: 'board window opens' },
  { from: at('board', 24) - PEAK.pop, src: 'n/pop.wav', volume: 0.6, note: 'callout ยอดที่ต้องวางบิล' },
  { from: at('board', 56) - PEAK.pop, src: 'n/pop.wav', volume: 0.6, note: 'callout รอบวางบิลของลูกค้า' },

  // --- click: the only click in this shot
  { from: at('click', 62) - PEAK.click, src: 'switch-click-quick.mp3', volume: 0.3, note: 'click the 11 Dec chip' },

  // --- worklist opens out of the chip
  { from: SHOTS.worklist.from - PEAK.swell, src: 'transition-soft.mp3', volume: 0.22, note: 'worklist opens' },

  // --- create: click, then the confirm arrives
  { from: at('create', 64) - PEAK.click, src: 'switch-click-quick.mp3', volume: 0.26, note: 'click Create Billing Notes' },
  { from: at('create', 96) - PEAK.turn, src: 'n/paper-page-turn.wav', volume: 0.42, note: 'created dialog' },

  // --- card
  { from: SHOTS.card.from - PEAK.slide, src: 'n/paper-slide.wav', volume: 0.45, note: 'billing note card arrives' },

  // --- release: click, then the status flips
  { from: at('release', 60) - PEAK.click, src: 'switch-click-quick.mp3', volume: 0.3, note: 'click Release' },
  { from: at('release', 92) - PEAK.pop, src: 'n/pop.wav', volume: 0.6, note: 'status becomes Released' },

  // --- print: the Thai form arrives
  { from: SHOTS.print.from - PEAK.slide, src: 'n/paper-slide.wav', volume: 0.5, note: 'printed billing note' },

  // --- outro: the mark's corner folds on the song's final hit
  { from: onBeat(136) - PEAK.turn, src: 'n/paper-page-turn.wav', volume: 0.45, note: 'logo corner folds on the hit' },
];

export const DEMO_SFX: Sfx[] = RAW.map((s) => ({
  ...s,
  from: Math.round(s.from - OUTPUT_AUDIO_OFFSET_F),
}));

/** for tools/backtest2.py — where each sample's peak is MEANT to be heard */
export const DEMO_SFX_TARGETS = RAW.map((s) => ({ src: s.src, note: s.note, target: s.from }));
