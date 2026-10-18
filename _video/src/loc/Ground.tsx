// The explainer's one ground: the month clip's breath sky (Main.tsx BreathGround), drawn by every scene so a cut
// between scenes only changes the content on top of it.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C } from '../theme';

export const Ground: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <AbsoluteFill style={{ opacity, background: `linear-gradient(135deg, ${C.sky[0]} 0%, ${C.sky[1]} 35%, ${C.sky[2]} 70%, ${C.sky[3]} 100%)` }}>
    <div style={{ position: 'absolute', left: 1240, top: -160, width: 640, height: 640, borderRadius: '50%', background: C.bokeh[0], filter: 'blur(70px)', opacity: 0.7 }} />
    <div style={{ position: 'absolute', left: -160, top: 620, width: 680, height: 680, borderRadius: '50%', background: C.bokeh[1], filter: 'blur(70px)', opacity: 0.7 }} />
  </AbsoluteFill>
);
