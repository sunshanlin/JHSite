// Frame units. The film was cut on a 30 fps grid, so every frame number in the scenes, in SHOTS,
// in sfx.ts and in Hero's segment table is an AUTHOR frame (1/30 s) and stays that way — the cut,
// the beat landings and the SFX placement are the ones that were back-tested and approved.
//
// The render rate is separate: since 2026-10-14 the trailer (JwicMonth + JwicMonthHero) renders at
// 60 fps, so Remotion's own frame numbers are twice as fine. Convert only at the boundary:
//   rf()              author frames → render frames (Sequence from/durationInFrames, Composition)
//   useAuthorFrame()  render frames → author frames inside a component
//
// useAuthorFrame returns a FRACTIONAL frame at 60 fps (… 10.0, 10.5, 11.0 …) — that is the whole
// point: interpolate() and spring() then yield a new value on every render frame, which is where
// the extra smoothness comes from, while the literals around them keep meaning the same instant.
//
// It reads the rate from the composition, so the 30 fps demo film (src/demo, rate 1) is unaffected
// and keeps running on raw frames.
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const AUTHOR_FPS = 30;
export const TRAILER_FPS = 60; // owner 2026-10-14: the trailer goes out at 1080p60
export const RATE = TRAILER_FPS / AUTHOR_FPS;

export const rf = (authorFrames: number) => Math.round(authorFrames * RATE);

export const useRate = () => useVideoConfig().fps / AUTHOR_FPS;
export const useAuthorFrame = () => useCurrentFrame() / useRate();
