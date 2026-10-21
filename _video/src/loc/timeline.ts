// Timeline of the Localization explainer — the VO is the clock (LOC-DESIGN-SPEC §2/§5); with no voice (NARRATED false, vo.ts from
// loc/gen-beats.mjs) each line's reading time is the clock instead, and every cut lands on a half-bar of the BGM.
// All numbers are AUTHOR frames (30 fps, see rate.ts). Each scene owns a run of VO lines: its first line starts
// `lead` frames into the scene, every following line starts GAP frames after the previous line's speech ends, and the
// scene ends `tail` frames after its last line's speech. Breath cards carry no VO.
import { CUES, NARRATED, VO, type CueName } from './vo';
import { SHOTS as MONTH_SHOTS } from '../timeline';

export const FPS = 30;
export const GAP = 12; // between two VO lines of one scene (0.4 s)
export const BREATH = 55; // paper-title-card (1.8 s)
export const TAIL = 8; // a scene wakes this many frames before its nominal start and fades in (Loc.tsx, frame.ts)

export type LocId = 's0' | 's1' | 'b1' | 's3' | 's4' | 'b2' | 's5' | 's6' | 'end';
type Def = { id: LocId; lines: number[]; lead: number; tail: number };

// lead/tail per scene: the scene's own entrance before the first word, and the rest after the last word (R1/R3).
// 'end' is the month clip's JWIC Consulting outro, as long as it is there (owner 2026-10-19: same outro, no music under it).
export const DEFS: Def[] = [
  // line 2, the owner's "ลองนึกภาพตาม สมมติ…" (2026-10-19), was cut by the owner on 2026-10-21: its file and its row in vo.ts stay
  // (VO is indexed by line number), but no scene owns it, so it is never played
  { id: 's0', lines: [1, 3], lead: 10, tail: 22 },
  { id: 's1', lines: [4, 5], lead: 8, tail: 24 },
  { id: 'b1', lines: [], lead: 0, tail: BREATH },
  { id: 's3', lines: [6, 7], lead: 10, tail: 30 },
  { id: 's4', lines: [8, 9, 10, 11, 12, 13], lead: 10, tail: 30 },
  { id: 'b2', lines: [], lead: 0, tail: BREATH },
  { id: 's5', lines: [14, 15, 16], lead: 12, tail: 30 },
  { id: 's6', lines: [17, 18], lead: 16, tail: 30 },
  { id: 'end', lines: [], lead: 0, tail: MONTH_SHOTS.outro.dur },
];

const sf = (s: number) => Math.round(s * FPS);
// No voice: the BGM is Mixkit "Lo-Fi 05" from frame 0 (Loc.tsx) — first beat 0.084 s, 0.6966 s a beat (86.13 BPM, librosa
// beat_track) — so a scene's tail stretches to the next half-bar, where the next scene cuts in. The outro keeps its own length.
const BEAT0 = 0.0836, HALF_BAR = 2 * 0.69664;
const onGrid = (frame: number) => (NARRATED ? frame : sf(BEAT0 + Math.ceil((frame / FPS - BEAT0) / HALF_BAR - 1e-6) * HALF_BAR));
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
  const end = d.id === 'end' ? cursor + dur : onGrid(cursor + dur);
  SHOTS[d.id] = { from: cursor, dur: end - cursor };
  cursor = end;
}
export const LOC_TOTAL = cursor;
/** the VO lines the film plays, in order (a line no scene owns stays out: line 2) */
export const SPOKEN = DEFS.flatMap((d) => d.lines).map(line);
export const BREATHS: LocId[] = ['b1', 'b2'];
export const speechFrames = (no: number) => sf(line(no).speechEnd);
/** scene-local frame where line `no` stops speaking */
export const VO_END_LOCAL = (no: number) => VO_LOCAL[no] + speechFrames(no);
/** scene-local frame where the i-th word of cue `name` is said (loc/vo-cues.json, measured on the audio by loc/gen-vo.mjs) */
export const cue = (name: CueName, i = 0) => VO_LOCAL[CUES[name][i].no] + sf(CUES[name][i].sec);
