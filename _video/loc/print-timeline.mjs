// Prints the scene table src/loc/timeline.ts computes (same arithmetic) — a quick look without starting Remotion.
import fs from 'node:fs';
const narrated = !process.argv.includes('--beats'); // --beats: the no-voice timing (loc/beats.json) and its half-bar cuts
const VO = JSON.parse(fs.readFileSync(new URL(narrated ? './vo-durations.json' : './beats.json', import.meta.url), 'utf8'));
const sf = (s) => Math.round(s * 30);
const GAP = 12, BREATH = 55, BEAT0 = 0.0836, HALF_BAR = 2 * 0.69664;
const onGrid = (f) => (narrated ? f : sf(BEAT0 + Math.ceil((f / 30 - BEAT0) / HALF_BAR - 1e-6) * HALF_BAR));
const OUTRO = 199; // the month clip's outro: src/timeline.ts SHOTS.outro.dur (2790 − (beatF(168) − 46))
const DEFS = [
  ['s0', [1, 3], 10, 22], ['s1', [4, 5], 8, 24], ['b1', [], 0, BREATH], ['s3', [6, 7], 10, 30], ['s4', [8, 9, 10, 11, 12, 13], 10, 30],
  ['b2', [], 0, BREATH], ['s5', [14, 15, 16], 12, 30], ['s6', [17, 18], 16, 30], ['end', [], 0, OUTRO],
];
let c = 0;
for (const [id, lines, lead, tail] of DEFS) {
  let local = lead;
  const at = [];
  for (const no of lines) { at.push(`${no}@${local}`); local += sf(VO[no - 1].speechEnd) + GAP; }
  const dur = (id === 'end' ? c + (lines.length ? local - GAP + tail : tail) : onGrid(c + (lines.length ? local - GAP + tail : tail))) - c;
  console.log(id.padEnd(3), 'from', String(c).padStart(5), 'dur', String(dur).padStart(4), (dur / 30).toFixed(1).padStart(5) + 's', at.join(' '));
  c += dur;
}
console.log('TOTAL', c, 'f =', (c / 30).toFixed(1), 's');
