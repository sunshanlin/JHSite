// Origin tags in the modern look (owner 2026-10-19): who did it. "Business Central" = what standard BC makes (white pill), the JWIC
// pill = what Localization adds (mint gradient, JW mark) — the same "green = Localization" rule as the trailer's tags, softer.
import React from 'react';
import { EASE, mix, ramp } from '../fx/Polish';
import { JwMark } from '../JwMark';
import { FONT, M, soft } from './skin';

export const OriginTag: React.FC<{ kind: 'bc' | 'jw'; f: number; at: number; out?: number; style?: React.CSSProperties; id?: string }> = ({ kind, f, at, out, style, id }) => {
  const p = ramp(f, at, 12, EASE.overshoot);
  const o = ramp(f, at, 6, EASE.out) * (out !== undefined ? 1 - ramp(f, out, 8, EASE.out) : 1);
  if (o <= 0.001) return null;
  const jw = kind === 'jw';
  return (
    <div
      style={{
        position: 'absolute', height: 56, padding: jw ? '0 26px 0 10px' : '0 26px', borderRadius: 28, display: 'flex', alignItems: 'center', gap: 12,
        background: jw ? `linear-gradient(155deg, ${M.badge.doc[0]}, ${M.badge.doc[1]})` : '#fff', color: jw ? '#fff' : M.inkSoft,
        fontFamily: FONT, fontWeight: 700, fontSize: 32, whiteSpace: 'nowrap', opacity: o, transform: `scale(${mix(0.86, 1, p).toFixed(4)})`, transformOrigin: '0% 100%',
        boxShadow: jw ? `0 16px 26px -10px ${M.badge.doc[1]}99` : soft(10, 0.18), ...style,
      }}
    >
      {jw && <JwMark size={36} id={id ?? 'jw-tag'} />}
      {jw ? 'JWIC Thai Localization' : 'Business Central'}
    </div>
  );
};
