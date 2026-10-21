// The story beat of S0: the sphere (the system) hops out along a spoke to each thing a country has of its own — as the voice names
// it — touches it and comes back. Replaces the text labels: the picture tells it. Returns the sphere's offset in layout pixels.
import { EASE, ramp } from '../fx/Polish';

export type Hop = { at: number; dx: number; dy: number };

export const hopOffset = (f: number, hops: Hop[], reach = 0.6): [number, number] => {
  let x = 0, y = 0;
  for (const h of hops) {
    const out = ramp(f, h.at - 8, 10, EASE.swift);
    const back = ramp(f, h.at + 6, 12, EASE.swift);
    const k = out - back;
    if (k <= 0) continue;
    const arc = Math.sin(Math.PI * Math.min(1, k)) * -28; // a little jump on the way
    x += h.dx * reach * k;
    y += h.dy * reach * k + arc * (out < 1 || back > 0 ? 1 : 0);
  }
  return [x, y];
};
