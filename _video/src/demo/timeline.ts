// Beat grid and shot table for the in-game product demo (series JHPresales, EP01 — ระบบวางบิล).
// Decision record: analysis/edit.json key "demo"; shot list: DEMO-BILLING.md.
//
// BGM = public/audio/bgm-demo.wav — the trailer's song re-cut: source 0–62.8275 s (bar 30)
// + bar 54 (112.9165 s) to the end, 0.26 s equal-power crossfade, 77.4147 s, splice score 0.9907.
// The splice is bar-aligned (24 bars = 96 beats), so the grid is CONTINUOUS: video beat n sits at
// t0 + n*T throughout, and source beat = n for n <= 120, n + 96 for n >= 120.
//
// Do NOT import from ../timeline — that module is pinned to the trailer's 93 s edit and its
// SHOTS table; the two films share a song but not a cut.

export const FPS = 60;

/**
 * Every hand-written cue in this film (cursor waypoints, caption entrances, ramp lengths) was
 * authored as whole frames at 30 fps, because that is the grid the shot list was timed on.
 * `t()` converts one of those to the current FPS, so the film can be re-cut at another frame rate
 * by changing FPS alone — nothing below is a bare frame count except through this helper.
 * Beat-derived times need no conversion: beatF() is computed from seconds.
 */
export const SC = FPS / 30;
export const t = (framesAt30: number) => Math.round(framesAt30 * SC);

export const SOURCE_BEAT0 = 0.2163; // s — analysis t0 (audit value; never mix render offsets into it)
export const BEAT_INT = 0.52176; // s — 115.0 BPM (measured 114.99629)
export const BAR_INT = 4 * BEAT_INT; // 2.08702 s
export const OUTPUT_AUDIO_OFFSET_SEC = 0.0423; // AAC priming; re-verify with tools/backtest2.py
export const OUTPUT_AUDIO_OFFSET_F = OUTPUT_AUDIO_OFFSET_SEC * FPS; // 1.269 f

export const beatT = (n: number) => SOURCE_BEAT0 + OUTPUT_AUDIO_OFFSET_SEC + n * BEAT_INT;
export const beatF = (n: number) => Math.round(beatT(n) * FPS);
export const barF = (b: number) => beatF(b * 4);
export const BEAT_FRAMES = BEAT_INT * FPS; // 15.6528
export const BAR_FRAMES = BAR_INT * FPS; // 62.6106

export const SPLICE_BEAT = 120; // f1886 — the join
export const FINAL_HIT_BEAT = 136; // the song's last hit
export const FINAL_HIT_F = beatF(FINAL_HIT_BEAT); // 4274 at 60 fps (2137 at 30)
export const DEMO_TOTAL = t(2285); // 76.17 s = beat 145.5; 100 ms RMS is below -70 dB here.
// The bed runs to 77.415 s so the file never hard-cuts.

// Drums thin out here — a Thai caption gets room to be read (measured per-beat kick/snare).
export const DRUM_DROP_BEATS = [32, 64] as const;

export const BGM_SRC = 'audio/bgm-demo.wav';
export const BGM_VOL = 0.24; // ~ -12.4 dB. The trailer is 0.4; that competes with reading Thai.
export const BGM_FADE_IN_F = 24; // 0.8 s. No fade-out: the song's own ring-out ends it.

// ---------------------------------------------------------------------------
// Shots. Every boundary is a bar downbeat, so a cut always lands with the music.

export type ShotId =
  | 'cover'
  | 'board'
  | 'click'
  | 'worklist'
  | 'create'
  | 'card'
  | 'release'
  | 'print'
  | 'outro';

const EDGES: Record<ShotId, number> = {
  cover: 0,
  board: 12,
  click: 32,
  worklist: 40,
  create: 56,
  card: 68,
  release: 84,
  print: 96,
  outro: 128,
};

const ORDER: ShotId[] = [
  'cover',
  'board',
  'click',
  'worklist',
  'create',
  'card',
  'release',
  'print',
  'outro',
];

export type Span = { from: number; dur: number; end: number; beat: number };

export const SHOTS = Object.fromEntries(
  ORDER.map((id, i) => {
    const from = beatF(EDGES[id]);
    const end = i + 1 < ORDER.length ? beatF(EDGES[ORDER[i + 1]]) : DEMO_TOTAL;
    return [id, { from, dur: end - from, end, beat: EDGES[id] }];
  }),
) as Record<ShotId, Span>;

// Unlike the trailer there is no breath/overlap system here: a scene's local frame 0 IS its
// nominal start. Every in-scene constant is written as localBeat(id, n).
export const localBeat = (id: ShotId, n: number) => beatF(n) - SHOTS[id].from;

export const MONTH = 'ธันวาคม 2569';
export const NOTE_NO = 'SBN26120005';
export const BILL_TOTAL = '45,442.90';
