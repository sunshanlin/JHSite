// Prints the scene table src/loc/timeline.ts computes (same arithmetic) — a quick look without starting Remotion.
import fs from 'node:fs';
const VO = JSON.parse(fs.readFileSync(new URL('./vo-durations.json', import.meta.url), 'utf8'));
const sf = (s) => Math.round(s * 30);
const GAP = 12, BREATH = 55;
const DEFS = [
  ['s1', [1, 2], 8, 24], ['b1', [], 0, BREATH], ['s3', [3, 4], 10, 30], ['s4', [5, 6, 7, 8, 9, 10], 10, 30],
  ['b2', [], 0, BREATH], ['s5', [11, 12, 13], 12, 30], ['s6', [14, 15], 16, 75],
];
let c = 0;
for (const [id, lines, lead, tail] of DEFS) {
  let local = lead;
  const at = [];
  for (const no of lines) { at.push(`${no}@${local}`); local += sf(VO[no - 1].speechEnd) + GAP; }
  const dur = lines.length ? local - GAP + tail : tail;
  console.log(id.padEnd(3), 'from', String(c).padStart(5), 'dur', String(dur).padStart(4), (dur / 30).toFixed(1).padStart(5) + 's', at.join(' '));
  c += dur;
}
console.log('TOTAL', c, 'f =', (c / 30).toFixed(1), 's');
