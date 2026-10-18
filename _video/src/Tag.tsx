// Origin tags (owner 2026-10-13: "วางแผนสื่อว่ามี JWIC Localization"). Two kinds, used the same way in every shot:
// grey "Business Central" on standard BC screens, green "JWIC Thai Localization" (with the JW mark; the product's
// full name, as on the opening pill — owner 2026-10-13) the first time an element JWIC adds is on screen — the same
// colour rule as JWIC's business-process charts (green = Localization).
// Entrance: opacity 6 f + scale 0.86 → 1 on EASE.overshoot 12 f (the pill-deal landing), then still.
// Not drawn in the 4:5 hero: its crops cut the tags into green slivers at the band edge (final review 2026-10-13).
import React from 'react';
import { EASE, mix, ramp, softShadow } from './fx/Polish';
import { alpha } from './fx/Look';
import { C, THAI } from './theme';
import { JwMark } from './JwMark';
import { useHeroMode } from './heroMode';

export type TagKind = 'bc' | 'jw';
export const TAG_H = 46;

export const Tag: React.FC<{ kind: TagKind; f: number; at: number; out?: number; style?: React.CSSProperties; id?: string }> = ({ kind, f, at, out, style, id }) => {
  const hero = useHeroMode();
  const p = ramp(f, at, 12, EASE.overshoot);
  const o = ramp(f, at, 6, EASE.out) * (out !== undefined ? 1 - ramp(f, out, 8, EASE.out) : 1);
  if (hero || o <= 0.001) return null;
  const jw = kind === 'jw';
  return (
    <div style={{
      position: 'absolute', height: TAG_H, padding: jw ? '0 18px 0 8px' : '0 18px', borderRadius: TAG_H / 2, display: 'flex', alignItems: 'center', gap: 10,
      background: jw ? C.green : '#fff', color: jw ? '#fff' : '#4A5160', border: jw ? 'none' : '1.5px solid #C7CDD3',
      fontFamily: THAI, fontWeight: 600, fontSize: 28, whiteSpace: 'nowrap', opacity: o, transform: `scale(${mix(0.86, 1, p).toFixed(4)})`, transformOrigin: '0% 100%',
      boxShadow: jw ? `0 8px 20px ${alpha(C.green, 0.3)}` : softShadow(6, { color: '#0E2E2A', strength: 0.8 }), ...style,
    }}>
      {jw && <JwMark size={30} id={id ?? 'jw-tag'} />}
      {jw ? 'JWIC Thai Localization' : 'Business Central'}
    </div>
  );
};
