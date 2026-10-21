// SFX pin table of the explainer (sound-design §4, the month clip's sfx.ts conventions). Every `from` is derived from the
// scenes' own cue frames (SHOTS + VO_LOCAL + the word cues the scenes read, cue()), never a bare number, and shifted by the
// sample's perceived peak so the peak lands on the picture event. The VO is the loudest layer; SFX sit under it (≤ 0.6), the bed under both (Loc.tsx).
// Files: public/audio/sfx/ (Mixkit via video-shotcraft assets/audio/ATTRIBUTION.md; level-matched copies in sfx/n/).
// Vocabulary (S1): whoosh for the title cards and the slider fling, pop for chips, paper for pages and flips, marker for the
// underline, transition-soft for the category hand-overs. The JWIC Consulting outro ('end') keeps the month clip's three, at the
// month clip's frames: the swell into the mark's outline closing, the paper turn on the rose fold, the sparkle on the lockup —
// JWIC's sound signature, alone under the outro (no music, owner 2026-10-19), so S6 before it signs off with a pop only.
import { SHOTS, VO_END_LOCAL, VO_LOCAL, cue } from './timeline';
import { CUES } from './vo';
import { s3TitleRing } from './scenes/S3Invoice';
import { FINAL_HIT_F, SHOTS as MONTH_SHOTS, beatF } from '../timeline';

export type Sfx = { from: number; src: string; volume: number; dur?: number; trimBefore?: number; note: string };

const pk = (s: number) => Math.round(s * 30);
const PEAK = {
  pageTurn: pk(0.12), slide: pk(0.33), moveQuick: pk(0.32), click: pk(0.007), transition: pk(0.43), pop: pk(0.037),
  marker: pk(0.013), swoosh: pk(0.164), impact: pk(0.55), sparkle: pk(1.427), riserEnd: pk(4.81),
};
// scene-local cue frame → global author frame (a scene's choreography frame 0 is its nominal start, frame.ts)
const g = (id: keyof typeof SHOTS, local: number) => SHOTS[id].from + local;

// S0 (S0Modern.tsx): the "?" is stamped on the last word of line 1; a slip lands on each word of line 3 it names
// (line 2 and its invoice cards, ≠ and card SFX were cut on 2026-10-21)
const S0_Q = cue('s0Question');
const S0_SLIPS = [0, 1, 2].map((i) => cue('s0Slips', i));

// S3 slider: the fling starts on "แล้วโลคอลไลเซชันเติม" (S3Invoice.tsx T0)
const S3_T0 = cue('s3Fling');
// S4 word hand-overs (S4Categories.tsx SLOTS in0) and chips
const S4_IN = [VO_LOCAL[9] - 4, VO_LOCAL[11] - 4, VO_LOCAL[13] - 4];
const S4_CHIPS = (['s4Regulatory', 's4National', 's4Market'] as const).flatMap((n) => CUES[n].map((_, i) => cue(n, i)));
// S5 flips (S5RealSystem.tsx starts): the edge-on moment is PRE + FLIP − 6 after the start
const S5_FLIPS = [0, 1, 2].map((i) => cue('s5Flips', i) + 4 + 16 - 6);
// the outro's hit (outline closes, 46) and fold (rose corner upright, beat 169) as frames from its start in the month clip
const OUT_HIT = FINAL_HIT_F - MONTH_SHOTS.outro.from;
const OUT_FOLD = beatF(169) - MONTH_SHOTS.outro.from;

export const SFX: Sfx[] = [
  // S0 — the headline slides in, the question mark is stamped, three slips land on the ledger
  { from: g('s0', VO_LOCAL[1] + 2) - PEAK.slide, src: 'n/paper-slide.wav', volume: 0.35, note: 's0 headline' },
  { from: g('s0', S0_Q) - PEAK.pop, src: 'n/pop.wav', volume: 0.55, note: 's0 question mark stamp' },
  ...S0_SLIPS.map((f, i) => ({ from: g('s0', f) - PEAK.pop, src: 'n/pop.wav', volume: 0.5, note: `s0 slip ${i + 1}` })),

  // S1 — the title assembles, the marker underlines the defined word, the document gets its seal
  { from: g('s1', 36) - PEAK.pop, src: 'n/pop.wav', volume: 0.45, note: 's1 title assembled' },
  { from: g('s1', VO_END_LOCAL(4) + 6) - PEAK.marker, src: 'n/marker-pen-line.wav', volume: 0.6, note: 's1 marker underline' },
  { from: g('s1', VO_LOCAL[5] + 14) - PEAK.pop, src: 'n/pop.wav', volume: 0.5, note: 's1 seal' },

  // breath cards: one swoosh each (paper-title-card: same sound for the same element, S2)
  { from: g('b1', 2) - PEAK.swoosh, src: 'wind-swoosh-short.mp3', volume: 0.4, note: 'b1 card' },
  { from: g('b2', 2) - PEAK.swoosh, src: 'wind-swoosh-short.mp3', volume: 0.4, note: 'b2 card' },

  // S3 — the BC page slides in, the A4 page comes out of it, the slider flings and ticks, three chips
  { from: g('s3', 2) - PEAK.slide, src: 'n/paper-slide.wav', volume: 0.45, note: 's3 BC page' },
  { from: g('s3', VO_LOCAL[6] + 10) - PEAK.pageTurn, src: 'n/paper-page-turn.wav', volume: 0.5, note: 's3 A4 page out' },
  { from: g('s3', S3_T0) - PEAK.swoosh, src: 'wind-swoosh-short.mp3', volume: 0.5, note: 's3 slider fling' },
  { from: g('s3', S3_T0 + 12) - PEAK.click, src: 'switch-click-quick.mp3', volume: 0.3, note: 's3 slider bounce' },
  ...[0, 1, 2].map((i) => ({ from: g('s3', cue('s3Chips', i)) - PEAK.pop, src: 'n/pop.wav', volume: 0.5, note: `s3 ring ${i + 1}` })),
  { from: g('s3', s3TitleRing()) - PEAK.pop, src: 'n/pop.wav', volume: 0.5, note: 's3 ring 4 (the title, once the scrub uncovers it)' },

  // S4 — each category word arrives on a soft transition and the example slips pop
  ...S4_IN.map((f, i) => ({ from: g('s4', f + 4) - PEAK.transition, src: 'transition-soft.mp3', volume: 0.35, note: `s4 word ${i + 1}` })),
  ...S4_CHIPS.map((f, i) => ({ from: g('s4', f) - PEAK.pop, src: 'n/pop.wav', volume: 0.42, note: `s4 chip ${i + 1}` })),

  // S5 — three flips, one page-turn each at the edge-on frame
  ...S5_FLIPS.map((f, i) => ({ from: g('s5', f) - PEAK.pageTurn, src: 'n/paper-page-turn.wav', volume: 0.55, note: `s5 flip ${i + 1}` })),

  // S6 — the pieces fly in on one swoosh, the mark lands on a pop (the sign-off sounds belong to the outro after it)
  { from: g('s6', 10) - PEAK.swoosh, src: 'wind-swoosh-short.mp3', volume: 0.35, note: 's6 pieces fly in' },
  { from: g('s6', 44) - PEAK.pop, src: 'n/pop.wav', volume: 0.45, note: 's6 mark lands' },

  // the JWIC Consulting outro (src/scenes/Outro.tsx, frames local to its start as in the month clip's sfx.ts)
  { from: g('end', OUT_HIT) - PEAK.transition, src: 'transition-soft.mp3', volume: 0.4, note: 'end: the mark\'s outline closes' },
  { from: g('end', OUT_FOLD) - PEAK.pageTurn, src: 'n/paper-page-turn.wav', volume: 0.35, note: 'end: the rose corner folds down' },
  { from: g('end', 117) - PEAK.sparkle, src: 'sparkle.mp3', volume: 0.4, dur: 120, note: 'end: the lockup settles' },
].map((s) => (s.from < 0 ? { ...s, trimBefore: -s.from, from: 0 } : s));
