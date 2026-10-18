// The one JW mark of the film (opening eyebrow + outro lockup): img/brand/jwic-icon.svg redrawn with an explicit
// sans font — the svg file's <text> has no font-family and renders in a serif fallback.
import React from 'react';

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

// JW logo (img/brand/jwic-icon.svg). `corner` is the fold of the top-right corner, 0 = plain square → 1 = the logo
// (owner 2026-10-14: "ทำให้เห็นชัดๆ ว่าพับมุมเข้ามาสีชมพู"): the corner (64,0) folds down over the diagonal (42,0)–(64,22),
// exposing the rose layer beneath, and lands as the darker triangle (42,0)(42,22)(64,22) — the flap's back. Projected
// top-down as a one-axis scale across the fold line (cos of the fold angle), so the flap narrows to the diagonal and
// grows out again on the other side; its front is lit a little while it tilts and it casts a soft shadow until it lies
// flat. At corner = 1 the drawing is the static logo (every other use of the mark passes nothing = 1).
export const JwMark: React.FC<{ size: number; corner?: number; id?: string }> = ({ size, corner = 1, id = 'jw' }) => {
  const c = Math.cos(Math.PI * clamp01(corner)); // 1 flat (unfolded) → 0 vertical → −1 flat (folded)
  const lift = Math.sqrt(Math.max(0, 1 - c * c)); // how far off the surface the flap stands
  const moving = lift > 0.02;
  const flap = `translate(42,0) rotate(45) scale(1,${c.toFixed(4)}) rotate(-45) translate(-42,0)`;
  const shadow = moving ? `url(#${id}-s)` : undefined;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: 'block' }}>
      <defs>
        <clipPath id={`${id}-r`}><rect width="64" height="64" rx="4" /></clipPath>
        {moving && (
          <filter id={`${id}-s`} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx={(-0.9 * lift).toFixed(2)} dy={(1.4 * lift).toFixed(2)} stdDeviation={(1.6 * lift).toFixed(2)} floodColor="#000" floodOpacity={(0.45 * lift).toFixed(3)} />
          </filter>
        )}
      </defs>
      <g clipPath={`url(#${id}-r)`}>
        <rect width="64" height="64" fill="#1c4a3c" />
        {/* the rose layer under the corner, shown as the flap lifts away; not drawn before the fold starts, or the flat
            flap's anti-aliased edge leaves a faint rose crease on the plain square */}
        {corner > 0 && <polygon points="64,0 42,0 64,22" fill="#c07f8b" />}
        {/* the flap: its green front (lit as it tilts) until the fold passes vertical, then its darker back */}
        {corner <= 0 ? null : c > 0 ? (
          <g transform={flap} filter={shadow}>
            <polygon points="42,0 64,0 64,22" fill="#1c4a3c" />
            <polygon points="42,0 64,0 64,22" fill="#fff" fillOpacity={(0.3 * (1 - c)).toFixed(3)} />
          </g>
        ) : (
          <polygon points="42,0 64,0 64,22" fill="#000" fillOpacity={(0.16 + 0.14 * (1 + c)).toFixed(3)} transform={flap} filter={shadow} />
        )}
        <text x="32" y="43" textAnchor="middle" fontSize="27" fontWeight={800} letterSpacing="-1.5" fill="#f5f1ea" fontFamily="Arial, sans-serif">JW</text>
      </g>
    </svg>
  );
};
