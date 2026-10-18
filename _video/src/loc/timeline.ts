// Timeline of the Localization explainer — the VO is the clock (LOC-DESIGN-SPEC §2/§5).
// All numbers are AUTHOR frames (30 fps, see rate.ts). Each scene owns a run of VO lines: its first line starts
// `lead` frames into the scene, every following line starts GAP frames after the previous line's speech ends, and the
// scene ends `tail` frames after its last line's speech. Breath cards carry no VO.
import { VO } from './vo';

export const FPS = 30;
export const GAP = 12; // between two VO lines of one scene (0.4 s)
export const BREATH = 55; // paper-title-card (1.8 s)
export const TAIL = 8; // a scene wakes this many frames before its nominal start and fades in (Loc.tsx, frame.ts)

export type LocId = 's1' | 'b1' | 's3' | 's4' | 'b2' | 's5' | 's6';
type Def = { id: LocId; lines: number[]; lead: number; tail: number };

// lead/tail per scene: the scene's own entrance before the first word, and the rest after the last word (R1/R3).
export const DEFS: Def[] = [
  { id: 's1', lines: [1, 2], lead: 8, tail: 24 },
  { id: 'b1', lines: [], lead: 0, tail: BREATH },
  { id: 's3', lines: [3, 4], lead: 10, tail: 30 },
  { id: 's4', lines: [5, 6, 7, 8, 9, 10], lead: 10, tail: 30 },
  { id: 'b2', lines: [], lead: 0, tail: BREATH },
  { id: 's5', lines: [11, 12, 13], lead: 12, tail: 30 },
  { id: 's6', lines: [14, 15], lead: 16, tail: 75 },
];

const sf = (s: number) => Math.round(s * FPS);
const line = (no: number) => VO[no - 1];

export type Shot = { from: number; dur: number };
export const SHOTS = {} as Record<LocId, Shot>;
/** global author frame where VO line `no` starts playing */
export const VO_AT: Record<number, number> = {};
/** scene-local author frame where VO line `no` starts (for the scenes' own choreography) */
export const VO_LOCAL: Record<number, number> = {};

let cursor = 0;
for (const d of DEFS) {
  let local = d.lead;
  for (const no of d.lines) {
    VO_AT[no] = cursor + local;
    VO_LOCAL[no] = local;
    local += sf(line(no).speechEnd) + GAP;
  }
  const dur = d.lines.length ? local - GAP + d.tail : d.tail;
  SHOTS[d.id] = { from: cursor, dur };
  cursor += dur;
}
export const LOC_TOTAL = cursor;
export const BREATHS: LocId[] = ['b1', 'b2'];
export const speechFrames = (no: number) => sf(line(no).speechEnd);
/** scene-local frame where line `no` stops speaking */
export const VO_END_LOCAL = (no: number) => VO_LOCAL[no] + speechFrames(no);
