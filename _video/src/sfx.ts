// SFX pin table (sound-design §4). Every `from` is derived from SHOTS / beatF, never a bare number, and is
// shifted by the sample's own perceived peak so the peak lands on the picture event. BGM already carries the
// beat, so only picture-specific actions get a sound (S2/S7).
// Files: public/audio/sfx/ (Mixkit, see video-shotcraft assets/audio/ATTRIBUTION.md). The quiet paper/keyboard
// samples are level-matched copies in sfx/n/ (scratchpad tools/norm_sfx2.py: gain to a target 150 ms window RMS
// + latency-compensated limiter at −6 dBFS so SFX + BGM never clip, 48 kHz wav) — final review 2026-10-13 measured
// them 12–18 dB under the BGM. Volumes keep every SFX within ~±3 dB of the BGM around it (back-test 2026-10-13).
// Peak lags (s): perceived peak = max of a 10 ms |y| envelope, attack used for swells (peaks2.py, 2026-10-13).
import { BN_BOARD_CLICK_BEAT, BN_CLICK_BEAT, BN_HL_BEAT, BREATHS, FINAL_HIT_F, LANDINGS, OUTPUT_AUDIO_OFFSET_F, PP30_CONV as CONV, SHOTS, beatF } from './timeline';

export type Sfx = { from: number; src: string; volume: number; dur?: number; trimBefore?: number; note: string };

const pk = (s: number) => Math.round(s * 30); // peak offset in frames
const PEAK = {
  pageTurn: pk(0.12), pageTurnBig: pk(0.32), slide: pk(0.33), moveQuick: pk(0.32), click: pk(0.007),
  transition: pk(0.43), pop: pk(0.037), marker: pk(0.013), hitWeak: pk(0.145), swoosh: pk(0.164),
  impact: pk(0.55), sparkle: pk(1.427),
};
const PEAK_BY_SRC: Record<string, number> = {
  'n/paper-page-turn.wav': PEAK.pageTurn, 'n/paper-page-turn-big.wav': PEAK.pageTurnBig, 'n/paper-slide.wav': PEAK.slide,
  'n/paper-move-quick.wav': PEAK.moveQuick, 'switch-click-quick.mp3': PEAK.click, 'transition-soft.mp3': PEAK.transition,
  'pop.mp3': PEAK.pop, 'n/pop.wav': PEAK.pop, 'n/marker-pen-line.wav': PEAK.marker, 'hit-weak.mp3': PEAK.hitWeak, 'wind-swoosh-short.mp3': PEAK.swoosh,
  'impact-deep-whoosh.mp3': PEAK.impact, 'sparkle.mp3': PEAK.sparkle,
};
const LAND = BREATHS.map((id) => LANDINGS[id as keyof typeof LANDINGS]); // calendar landing beats
const at = (id: keyof typeof SHOTS, local: number) => SHOTS[id].from - (id === 'open' ? 0 : 8) + local; // scene local → global

// Sequence.from = target frame − sample peak lag − output audio offset (sound-design §4.6)
const RAW: Sfx[] = [
  // opening: the stack forms, then fans out (Opening stack clock DS = 8 f into the scene)
  { from: 8 + 8 - PEAK.moveQuick, src: 'n/paper-move-quick.wav', volume: 0.6, note: 'first sheets land on the pile' },
  { from: 8 + 68 - PEAK.slide, src: 'n/paper-slide.wav', volume: 0.6, note: 'fan opens' },

  // the flow's head reaches each checkpoint on its landing beat: one soft pop per checkpoint (sound-design 3.3:
  // pop is the library's proven 6-in-a-row hit; the synth ui tones are rejected for product films)
  ...BREATHS.map((id, k) => ({ from: beatF(LAND[k]) - PEAK.pop, src: 'n/pop.wav', volume: 1.0, note: `checkpoint ${k + 1} (${id})` })),

  // purchase order: the Thai PO form arrives as the breath clears, its total is called out on beat 20
  { from: at('po', 10) - PEAK.slide, src: 'n/paper-slide.wav', volume: 0.5, note: 'Thai PO form slides in' },
  { from: beatF(20) + 4 - PEAK.pop, src: 'n/pop.wav', volume: 0.8, note: 'PO total chip' },
  // 50 ทวิ: Direct WHT Info opens over the Payment Journal (beat 33), Generate and Print Certificate (beat 36),
  // the pen traces the total, closing on beat 40
  { from: beatF(36) - PEAK.click, src: 'switch-click-quick.mp3', volume: 0.35, note: 'Generate and Print Certificate' },
  // the sample's stroke is ~9 f, so two strokes cover the 38 f trace (final review r2 S12)
  { from: beatF(40) - 38 - PEAK.marker, src: 'n/marker-pen-line.wav', volume: 1.0, dur: 19, note: 'pen traces the withheld-tax total (stroke 1)' },
  { from: beatF(40) - 19 - PEAK.marker, src: 'n/marker-pen-line.wav', volume: 0.85, dur: 19, note: 'pen traces the withheld-tax total (stroke 2)' },
  // tax invoice: Print... and the portal into the document
  { from: beatF(53) - PEAK.click, src: 'switch-click-quick.mp3', volume: 0.35, note: 'Print...' },
  { from: beatF(53) + 8 + 14 - PEAK.transition, src: 'transition-soft.mp3', volume: 0.45, note: 'Print... opens into the tax invoice (portal swell)' },
  // billing note: the Billing Board's TO BILL chip (BillingNote.tsx: HL + 4), then Create Billing Notes (rows land
  // silently — the jade seam is the visual click, card S2)
  { from: beatF(BN_HL_BEAT) + 4 - PEAK.pop, src: 'n/pop.wav', volume: 0.8, note: 'Billing Board headline chip วางแผนวางบิล' },
  // the board's 11 Dec chip is clicked and the worklist's window opens out of it (BillingNote.tsx: portal 16 f from
  // click + 2); the callouts before it stay silent like the tax invoice's pills (owner 2026-10-14)
  { from: beatF(BN_BOARD_CLICK_BEAT) - PEAK.click, src: 'switch-click-quick.mp3', volume: 0.35, note: 'click on the board\'s 11 Dec chip' },
  { from: beatF(BN_BOARD_CLICK_BEAT) + 2 + 16 - PEAK.transition, src: 'transition-soft.mp3', volume: 0.35, note: 'the worklist opens out of the chip (portal swell)' },
  { from: beatF(BN_CLICK_BEAT) - PEAK.click, src: 'switch-click-quick.mp3', volume: 0.35, note: 'Create Billing Notes' },
  // receipt: the amount springs in
  { from: beatF(102.25) - PEAK.pop, src: 'n/pop.wav', volume: 0.9, note: 'receipt amount springs in' },
  // text file (the music splice, beat 120, falls on its window opening — accepted in the 2026-10-13 story review)
  { from: beatF(119) - PEAK.click, src: 'switch-click-quick.mp3', volume: 0.35, note: 'Download Text File' },
  { from: beatF(120.5), src: 'n/keyboard.wav', volume: 0.8, dur: beatF(121.5) + 12 - beatF(120.5), note: 'text file lines write (writing window only)' },

  // finale
  { from: at('pp30', Math.round(0.72 * (CONV - 1))) - PEAK.hitWeak, src: 'hit-weak.mp3', volume: 0.55, note: 'documents swallowed by the month folder (ripple t 0.72)' },
  // PP30.tsx: REP_IN = localBeat('pp30', 140) − 22, RISE = REP_IN + 38
  { from: beatF(140) - 22 + 6 - PEAK.slide, src: 'n/paper-slide.wav', volume: 0.55, note: 'VAT reports slide out of the folder' },
  { from: beatF(140) - 22 + 38 + 6 - PEAK.slide, src: 'n/paper-slide.wav', volume: 0.6, note: 'ภ.พ.30 slides out of the folder' },
  // PP30.tsx: the amount chips start 2 f after their rows light — HL7 = localBeat('pp30', 144), HL5 = HL7 − 8, and the
  // box-11 chip half a beat after row 7 (localBeat('pp30', 144.5)); same soft pop as the PO chip (owner 2026-10-13)
  { from: beatF(144) - 8 + 2 - PEAK.pop, src: 'n/pop.wav', volume: 0.8, note: 'ภ.พ.30 chip ภาษีขาย 3,500.00 (row 5)' },
  { from: beatF(144) + 2 - PEAK.pop, src: 'n/pop.wav', volume: 0.8, note: 'ภ.พ.30 chip ภาษีซื้อ 700.00 (row 7)' },
  { from: beatF(144.5) + 2 - PEAK.pop, src: 'n/pop.wav', volume: 0.8, note: 'ภ.พ.30 chip ต้องชำระ 2,800.00 (box 11)' },
  // feature wall: the cards burst out of the folder on beat 153 and fly back on 162.5
  { from: beatF(153) - PEAK.swoosh, src: 'wind-swoosh-short.mp3', volume: 0.45, note: 'feature cards burst out' },
  { from: beatF(162.5) + 6 - PEAK.swoosh, src: 'wind-swoosh-short.mp3', volume: 0.35, note: 'feature cards fly back into the folder' },
  // outro "Draw + Wipe" (owner 2026-10-14, softer): the portal's swell rises into the hit where the mark's outline closes
  // (the impact whoosh went with the flip-bloom); the paper turn peaks as the rose corner stands up on beat 169 (Outro.tsx)
  { from: FINAL_HIT_F - PEAK.transition, src: 'transition-soft.mp3', volume: 0.4, note: 'the mark\'s outline closes on the song\'s final hit' },
  { from: beatF(169) - PEAK.pageTurn, src: 'n/paper-page-turn.wav', volume: 0.35, note: 'the mark\'s rose corner folds down' },
  { from: SHOTS.outro.from + 117 - PEAK.sparkle, src: 'sparkle.mp3', volume: 0.4, dur: 120, note: 'the lockup settles after the stop' },
];

export const SFX: Sfx[] = RAW.map((s) => ({ ...s, from: Math.round(s.from - OUTPUT_AUDIO_OFFSET_F) }));
// back-test probes: the picture frame each sample's peak is meant to land on
export const SFX_TARGETS = RAW.map((s) => ({ src: s.src, note: s.note, target: s.from + (PEAK_BY_SRC[s.src] ?? 0) }));
