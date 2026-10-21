// Scene clock. Loc.tsx mounts every scene after the first TAIL frames before its nominal start (it wakes under the outgoing
// scene and fades in), so a scene's choreography runs on f = author frame − TAIL, while inOp / outOp are the scene's own
// crossfade: in over the first TAIL frames, out over the last TAIL frames of its nominal duration.
import { EASE, ramp } from '../fx/Polish';
import { useAuthorFrame } from '../rate';
import { SHOTS, TAIL, type LocId } from './timeline';

export const useSceneFrame = (id: LocId) => {
  const fa = useAuthorFrame();
  const first = SHOTS[id].from === 0;
  const f = first ? fa : fa - TAIL;
  const dur = SHOTS[id].dur;
  const inOp = 1; // the colour-field iris (Loc.tsx) is the entrance now, not a fade
  // outOp stays 1: the next layer is rendered on top and fades in, so fading out as well would dip to the root colour
  // (review 2026-10-18: S4 → b2 showed a plain #F3F6F5 frame for ~14 f)
  const outOp = 1;
  return { f, dur, inOp, outOp };
};
