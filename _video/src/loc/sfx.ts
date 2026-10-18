// SFX pin table of the explainer (sound-design §4, the month clip's sfx.ts conventions). Every `from` is derived from the
// scenes' own cue frames (SHOTS + VO_LOCAL), never a bare number, and shifted by the sample's perceived peak so the peak lands
// on the picture event. The VO is the loudest layer; SFX sit under it (≤ 0.6), the bed under both (Loc.tsx).
// Files: public/audio/sfx/ (Mixkit via video-shotcraft assets/audio/ATTRIBUTION.md; level-matched copies in sfx/n/).
// Vocabulary (S1): whoosh for the title cards and the slider fling, pop for chips, paper for pages and flips, marker for the
// underline, transition-soft for the category hand-overs, riser → impact → sparkle for the outro sign-off (sound-design 4.3).
import { SHOTS, VO_END_LOCAL, VO_LOCAL, speechFrames } from './timeline';

export type Sfx = { from: number; src: string; volume: number; dur?: number; trimBefore?: number; note: string };

const pk = (s: number) => Math.round(s * 30);
const PEAK = {
  pageTurn: pk(0.12), slide: pk(0.33), moveQuick: pk(0.32), click: pk(0.007), transition: pk(0.43), pop: pk(0.037),
  marker: pk(0.013), swoosh: pk(0.164), impact: pk(0.55), sparkle: pk(1.427), riserEnd: pk(4.81),
};
// scene-local cue frame → global author frame (a scene's choreography frame 0 is its nominal start, frame.ts)
const g = (id: keyof typeof SHOTS, local: number) => SHOTS[id].from + local;
const at = (no: number, frac: number) => VO_LOCAL[no] + Math.round(speechFrames(no) * frac);

// S3 slider: the fling starts at 22 % of line 4 (S3Invoice.tsx T0)
const S3_T0 = at(4, 0.22);
// S4 word hand-overs (S4Categories.tsx SLOTS in0) and chips
const S4_IN = [VO_LOCAL[6] - 4, VO_LOCAL[8] - 4, VO_LOCAL[10] - 4];
const S4_CHIPS = [at(7, 0.08), at(7, 0.36), at(7, 0.6), at(7, 0.78), at(9, 0.05), at(9, 0.62), at(10, 0.72)];
// S5 flips (S5RealSystem.tsx starts): the edge-on moment is PRE + FLIP − 6 after the start
const S5_FLIPS = [at(11, 0.5), at(12, 0.3), at(13, 0.3)].map((s) => s + 4 + 16 - 6);

export const SFX: Sfx[] = [
  // S1 — the title assembles, the marker underlines the defined word, the document gets its seal
  { from: g('s1', 36) - PEAK.pop, src: 'n/pop.wav', volume: 0.45, note: 's1 title assembled' },
  { from: g('s1', VO_END_LOCAL(1) + 6) - PEAK.marker, src: 'n/marker-pen-line.wav', volume: 0.6, note: 's1 marker underline' },
  { from: g('s1', VO_LOCAL[2] + 14) - PEAK.pop, src: 'n/pop.wav', volume: 0.5, note: 's1 seal' },

  // breath cards: one swoosh each (paper-title-card: same sound for the same element, S2)
  { from: g('b1', 2) - PEAK.swoosh, src: 'wind-swoosh-short.mp3', volume: 0.4, note: 'b1 card' },
  { from: g('b2', 2) - PEAK.swoosh, src: 'wind-swoosh-short.mp3', volume: 0.4, note: 'b2 card' },

  // S3 — the BC page slides in, the A4 page comes out of it, the slider flings and ticks, three chips
  { from: g('s3', 2) - PEAK.slide, src: 'n/paper-slide.wav', volume: 0.45, note: 's3 BC page' },
  { from: g('s3', VO_LOCAL[3] + 10) - PEAK.pageTurn, src: 'n/paper-page-turn.wav', volume: 0.5, note: 's3 A4 page out' },
  { from: g('s3', S3_T0) - PEAK.swoosh, src: 'wind-swoosh-short.mp3', volume: 0.5, note: 's3 slider fling' },
  { from: g('s3', S3_T0 + 12) - PEAK.click, src: 'switch-click-quick.mp3', volume: 0.3, note: 's3 slider bounce' },
  ...[0.6, 0.74, 0.85].map((fr, i) => ({ from: g('s3', at(4, fr)) - PEAK.pop, src: 'n/pop.wav', volume: 0.5, note: `s3 chip ${i + 1}` })),

  // S4 — each category word arrives on a soft transition; chips pop; the circles lock; the conclusion word sparkles
  ...S4_IN.map((f, i) => ({ from: g('s4', f + 4) - PEAK.transition, src: 'transition-soft.mp3', volume: 0.35, note: `s4 word ${i + 1}` })),
  ...S4_CHIPS.map((f, i) => ({ from: g('s4', f) - PEAK.pop, src: 'n/pop.wav', volume: 0.42, note: `s4 chip ${i + 1}` })),
  { from: g('s4', S4_IN[1] + 36) - PEAK.click, src: 'switch-click-quick.mp3', volume: 0.3, note: 's4 circles lock' },
  { from: g('s4', S4_IN[2] + 30) - PEAK.sparkle, src: 'sparkle.mp3', volume: 0.3, note: 's4 Market settles white' },

  // S5 — three flips, one page-turn each at the edge-on frame
  ...S5_FLIPS.map((f, i) => ({ from: g('s5', f) - PEAK.pageTurn, src: 'n/paper-page-turn.wav', volume: 0.55, note: `s5 flip ${i + 1}` })),

  // S6 — riser into the group photo, the impact on the mark's stamp (the film's loudest SFX), sparkle on the rule
  { from: g('s6', 38) - PEAK.riserEnd, src: 'riser-cine.mp3', volume: 0.4, dur: 150, note: 's6 riser' },
  { from: g('s6', 38) - PEAK.impact, src: 'impact-deep-whoosh.mp3', volume: 0.5, note: 's6 mark stamp' },
  { from: g('s6', 58) - PEAK.sparkle, src: 'sparkle.mp3', volume: 0.4, note: 's6 rule sparkle' },
].map((s) => (s.from < 0 ? { ...s, trimBefore: -s.from, from: 0 } : s));
