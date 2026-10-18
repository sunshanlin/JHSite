// SHOTS is the single source of truth for timing (DESIGN-SPEC §5). Flow breaths, captions and SFX
// all derive from it, so moving a shot moves everything pinned to it.
// Beat grid: analysis/beat_data.json (115.0 BPM). The BGM is the edited file public/audio/bgm-edit.wav
// (analysis/edit.json): its beat grid is continuous across the splice, so video beat n is at t0 + n·T.

import { AUTHOR_FPS } from './rate';

// Author grid (src/rate.ts): the whole cut — SHOTS, beat landings, breaths, sfx.ts — is expressed in
// 30 fps author frames and stays so. The render rate (60 fps since 2026-10-14) is applied by rf() at
// the Remotion boundary only, so the film's timing is bit-for-bit the one that was back-tested at 30.
export const FPS = AUTHOR_FPS;
export const SOURCE_BEAT0 = 0.2163; // s, analysis t0 — audit value, never mix render offsets into it
export const BEAT_INT = 0.52176; // s
// Render pipeline (Remotion 4.0.484 · AAC · 48 kHz · mp4): the output audio lags the picture by 42.3 ms
// (2032 samples; cross-correlation of out/jwic-month.mp4 against bgm-edit.wav, own 40.6 ms + final review
// 42.3 ms, 2026-10-13) — AAC encoder priming.
export const OUTPUT_AUDIO_OFFSET_SEC = 0.0423;
export const OUTPUT_AUDIO_OFFSET_F = OUTPUT_AUDIO_OFFSET_SEC * FPS;
export const beatT = (n: number) => SOURCE_BEAT0 + OUTPUT_AUDIO_OFFSET_SEC + n * BEAT_INT;
export const beatF = (n: number) => Math.round(beatT(n) * FPS);
export const BEAT_FRAMES = BEAT_INT * FPS; // 15.65

// owner 2026-10-13: ~90 s so each step can be followed — edit src 0–62.83 s (bar 30) + bar 46 (96.22 s) → end, score 0.991
export const SPLICE_F = beatF(120); // music join: since the 2026-10-13 story re-time it falls on the text file's window opening (accepted)
export const FINAL_HIT_BEAT = 168; // the song's last hit (src beat 232) = logo bloom
export const FINAL_HIT_F = beatF(FINAL_HIT_BEAT);

export type ShotId =
  | 'open' | 'b1' | 'po' | 'b2' | 'wht' | 'b3' | 'inv' | 'b4' | 'bn' | 'b5' | 'rct' | 'b6' | 'txt' | 'pp30' | 'more' | 'outro';

// Each flow breath is 47 f; the line's head reaches the new checkpoint 24 f after it starts (Flow.tsx), so a breath
// starts 24 f before its landing beat. Landings are bar downbeats with a real kick (beat_data perBeat kick ≥ 0.97).
export const BREATH_DUR = 47;
export const BREATH_LAND = 24;
type BreathId = 'b1' | 'b2' | 'b3' | 'b4' | 'b5' | 'b6';
// Story re-time (story review 2026-10-13): the purchase order says only "there is a Thai PO" (b2 one bar after its
// totals, 36 → 28) and every shot from the 50 ทวิ to the text file runs 8 beats earlier (b3–b6 56/84/104/124 →
// 48/76/96/116); the 8 beats go to the ภ.พ.30 tie-out and the feature wall. Final hit and outro stay put.
export const LANDINGS: Record<BreathId, number> = { b1: 16, b2: 28, b3: 48, b4: 76, b5: 96, b6: 116 };
const breathFrom = (id: keyof typeof LANDINGS) => beatF(LANDINGS[id]) - BREATH_LAND;

const OUTRO_FROM = FINAL_HIT_F - 46; // outro's flip reaches its thinnest frame (FLIP_MID 46) on the final hit
const PP30_FROM = beatF(130);
const MORE_FROM = beatF(152); // "มาพร้อมฟังก์ชันอีกมากมาย" (owner 2026-10-13), between the close and the outro
const TOTAL_F = 2790; // 93 s: the song's ring-out is below −70 dB by 93 s

const b = (id: keyof typeof LANDINGS) => ({ from: breathFrom(id), dur: BREATH_DUR });
const span = (from: number, to: number) => ({ from, dur: to - from });

// Business order (owner 2026-10-13): purchase order → vendor payment + 50 ทวิ → tax invoice → billing note →
// receipt → close (text file, VAT reports, ภ.พ.30).
const after = (id: BreathId) => breathFrom(id) + BREATH_DUR;
const RAW: Record<ShotId, { from: number; dur: number }> = {
  open: span(0, breathFrom('b1')),
  b1: b('b1'),
  po: span(after('b1'), breathFrom('b2')),
  b2: b('b2'),
  wht: span(after('b2'), breathFrom('b3')),
  b3: b('b3'),
  inv: span(after('b3'), breathFrom('b4')),
  b4: b('b4'),
  bn: span(after('b4'), breathFrom('b5')),
  b5: b('b5'),
  rct: span(after('b5'), breathFrom('b6')),
  b6: b('b6'),
  txt: span(after('b6'), PP30_FROM),
  pp30: span(PP30_FROM, MORE_FROM),
  more: span(MORE_FROM, OUTRO_FROM),
  outro: span(OUTRO_FROM, TOTAL_F),
};

export const SHOTS = Object.fromEntries(
  Object.entries(RAW).map(([k, v]) => [k, { ...v, end: v.from + v.dur }]),
) as Record<ShotId, { from: number; dur: number; end: number }>;

export const TOTAL = TOTAL_F;

// ภ.พ.30 shot: converge window (bezier-source-converge-merge demo value), shared by PP30.tsx and sfx.ts
// billing note (BillingNote.tsx, sfx.ts, Hero.tsx): the Billing Board's TO BILL ring, then Create Billing Notes
export const BN_HL_BEAT = 78.5;
// owner 2026-10-14: the board gets three callouts and a click on its 11 Dec chip that opens the worklist (as the
// system does), so the worklist's Create Billing Notes moved 83 → 84.5 and the last row 89 → 90 (BillingNote.tsx)
export const BN_BOARD_CLICK_BEAT = 82;
export const BN_CLICK_BEAT = 84.5;
export const PP30_CONV = 128; // demo 168 f — the feature wall after it needed the time (owner 2026-10-13)

// local frame of global beat n inside a shot whose local frame 0 is `from - lead` (scenes wake TAIL early)
export const TAIL = 8;
export const localBeat = (id: ShotId, n: number) => beatF(n) - (SHOTS[id].from - (id === 'open' ? 0 : TAIL));

export const MONTH = 'ธันวาคม 2569';
export const MONTH_SHORT = 'ธ.ค. 2569';

// Breath shots in order; breath k brings the flow's head to checkpoint k (Flow.tsx STEPS).
export const BREATHS: ShotId[] = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'];
