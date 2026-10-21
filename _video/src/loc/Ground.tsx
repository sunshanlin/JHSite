// The ground of every scene: a soft two-stop neutral grey (skin.ts `M.bg`, owner 2026-10-21) with two slow, blurred bokeh blobs (white, grey) — the
// owner's grey since 2026-10-21. A cut between scenes is an iris reveal of the next scene (Loc.tsx); on one grey the circle shows on the content.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useAuthorFrame } from '../rate';
import { M, type Field } from './skin';

export const Ground: React.FC<{ field?: Field }> = ({ field = 'peach' }) => {
  const f = useAuthorFrame();
  const [a, b] = M.bg[field];
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${a} 0%, ${b} 100%)` }}>
      <div style={{ position: 'absolute', left: 1180 + Math.sin(f * 0.012) * 60, top: -220, width: 820, height: 820, borderRadius: '50%', background: M.bokeh[0], opacity: 0.75, filter: 'blur(90px)' }} />
      <div style={{ position: 'absolute', left: -240, top: 560 + Math.cos(f * 0.011) * 50, width: 760, height: 760, borderRadius: '50%', background: M.bokeh[1], opacity: 0.7, filter: 'blur(100px)' }} />
    </AbsoluteFill>
  );
};
