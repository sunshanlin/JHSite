// Pictograms (LOC-DESIGN-SPEC §3): two-colour line icons — ink strokes, jade for the thing that works, rose only for the
// gap ("not this"). 6 px strokes at 1080, round caps, flat sky-tint fills, no gradients. Every icon is a plain SVG whose
// moving parts take 0–1 progress props, so the scene owns the timing.
import React from 'react';
import { C, THAI } from '../theme';

export const INK = C.ink;
export const JADE = C.c1;
export const ROSE = C.c3;
export const SW = 6;
const line = { stroke: INK, strokeWidth: SW, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
const svgStyle: React.CSSProperties = { display: 'block', overflow: 'visible' };

/** A monitor whose screen shows a TH | EN language toggle. `strike` draws a rose cross-out over it. */
export const ScreenPicto: React.FC<{ size?: number; strike?: number }> = ({ size = 260, strike = 0 }) => {
  const s = size / 260;
  return (
    <svg width={260 * s} height={226 * s} viewBox="0 0 260 226" style={svgStyle}>
      <rect x={10} y={10} width={240} height={160} rx={16} {...line} fill="#fff" />
      <path d="M130 170 V200 M92 206 H168" {...line} />
      <rect x={58} y={66} width={144} height={48} rx={24} {...line} fill={C.sky[1]} strokeWidth={4} />
      <circle cx={84} cy={90} r={16} fill={JADE} />
      <text x={122} y={100} fontFamily={THAI} fontWeight={700} fontSize={26} fill={INK}>TH</text>
      <text x={162} y={100} fontFamily={THAI} fontWeight={700} fontSize={26} fill={INK} opacity={0.45}>EN</text>
      {strike > 0 && (
        <path d="M34 34 L226 146" stroke={ROSE} strokeWidth={10} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - strike} />
      )}
    </svg>
  );
};

/** A document page with text lines; `seal` (0–1) scales in the jade approval seal with a check mark. */
export const DocPicto: React.FC<{ size?: number; seal?: number; lines?: number }> = ({ size = 200, seal = 0, lines = 4 }) => {
  const s = size / 200;
  return (
    <svg width={200 * s} height={240 * s} viewBox="0 0 200 240" style={svgStyle}>
      <path d="M34 12 H132 L166 46 V214 a14 14 0 0 1 -14 14 H34 a14 14 0 0 1 -14 -14 V26 a14 14 0 0 1 14 -14 Z" {...line} fill="#fff" />
      <path d="M132 12 V46 H166" {...line} />
      {Array.from({ length: lines }, (_, i) => (
        <path key={i} d={`M48 ${84 + i * 28} H${i === lines - 1 ? 108 : 150}`} {...line} opacity={0.5} />
      ))}
      {seal > 0 && (
        <g transform={`translate(142 186) scale(${seal})`}>
          <circle r={32} fill={JADE} />
          <path d="M-14 1 L-4 11 L15 -10" stroke="#fff" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      )}
    </svg>
  );
};

/** The world: a globe with meridians and two land shapes (the W1 base app). */
export const GlobePicto: React.FC<{ size?: number }> = ({ size = 300 }) => (
  <svg width={size} height={size} viewBox="0 0 300 300" style={svgStyle}>
    <circle cx={150} cy={150} r={140} {...line} fill="#fff" />
    <path d="M70 112 c20 -20 52 -16 64 4 c10 18 -10 34 -32 36 c-24 2 -44 -16 -32 -40z" fill={C.sky[1]} />
    <path d="M176 172 c24 -12 52 4 48 26 c-4 20 -32 26 -50 14 c-16 -10 -16 -32 2 -40z" fill={C.sky[1]} />
    <path d="M120 230 c10 -10 30 -8 34 4 c4 12 -10 20 -22 18 c-12 -2 -20 -14 -12 -22z" fill={C.sky[1]} />
    <ellipse cx={150} cy={150} rx={62} ry={140} {...line} opacity={0.4} />
    <path d="M10 150 H290 M34 88 H266 M34 212 H266 M150 10 V290" {...line} opacity={0.4} />
  </svg>
);

/** A round rubber-stamp seal with a short label; `tone` grey = Microsoft's own localizations, jade = the partner's. */
export const Seal: React.FC<{ label: string; tone: 'grey' | 'jade'; p: number; size?: number; style?: React.CSSProperties }> = ({ label, tone, p, size = 88, style }) => {
  const col = tone === 'jade' ? JADE : '#6B7482';
  return (
    <div
      style={{
        position: 'absolute', width: size, height: size, borderRadius: '50%', boxSizing: 'border-box', border: `4px solid ${col}`,
        background: 'rgba(255,255,255,0.92)', color: col, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: THAI, fontWeight: 700, fontSize: size * 0.2, letterSpacing: '0.02em', transform: `rotate(-12deg) scale(${p})`,
        opacity: Math.min(1, p * 2), boxShadow: `0 0 0 2px rgba(255,255,255,0.9), inset 0 0 0 3px rgba(255,255,255,0.9), inset 0 0 0 5px ${col}22`,
        ...style,
      }}
    >
      {label}
    </div>
  );
};

/** The partner: a person with a gear. */
export const PartnerPicto: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={svgStyle}>
    <circle cx={86} cy={64} r={34} {...line} fill="#fff" />
    <path d="M24 172 c0 -42 28 -64 62 -64 s62 22 62 64" {...line} fill="#fff" />
    <g transform="translate(150 148)">
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={-7} y={-40} width={14} height={18} rx={4} fill={JADE} transform={`rotate(${i * 45})`} />)}
      <circle r={28} fill={JADE} />
      <circle r={10} fill="#fff" />
    </g>
  </svg>
);

/** An app tile: a rounded square holding a 2 × 2 grid. */
export const AppTilePicto: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={svgStyle}>
    <rect x={6} y={6} width={108} height={108} rx={26} {...line} fill="#fff" />
    <rect x={30} y={30} width={26} height={26} rx={7} fill={JADE} />
    <rect x={64} y={30} width={26} height={26} rx={7} fill={C.sky[1]} stroke={INK} strokeWidth={3} />
    <rect x={30} y={64} width={26} height={26} rx={7} fill={C.sky[1]} stroke={INK} strokeWidth={3} />
    <rect x={64} y={64} width={26} height={26} rx={7} fill={JADE} />
  </svg>
);

/** The law: a gavel on its block. */
export const LawPicto: React.FC<{ size?: number }> = ({ size = 140 }) => (
  <svg width={size} height={size} viewBox="0 0 140 140" style={svgStyle}>
    <rect x={20} y={112} width={100} height={14} rx={7} {...line} fill="#fff" />
    <path d="M44 100 L92 52" {...line} strokeWidth={9} />
    <rect x={72} y={18} width={54} height={34} rx={9} transform="rotate(45 99 35)" {...line} fill={C.sky[1]} />
  </svg>
);

/** The Revenue Department: a building with columns. */
export const BuildingPicto: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={svgStyle}>
    <path d="M24 72 L100 24 L176 72 Z" {...line} fill="#fff" />
    <rect x={30} y={72} width={140} height={14} rx={4} {...line} fill={C.sky[1]} />
    <path d="M52 86 V156 M84 86 V156 M116 86 V156 M148 86 V156" {...line} />
    <rect x={22} y={156} width={156} height={16} rx={5} {...line} fill="#fff" />
  </svg>
);

/** Trade practice: two hands shaking. */
export const HandshakePicto: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={svgStyle}>
    <path d="M14 96 L56 62 L96 78 L136 60 L186 92" {...line} />
    <path d="M14 96 L54 136 c10 10 24 10 34 0 L112 112" {...line} fill="#fff" />
    <path d="M186 92 L146 134 c-8 8 -20 8 -28 0 L96 110" {...line} />
    <path d="M78 92 L108 118 M92 86 L118 108" {...line} opacity={0.6} />
    <circle cx={100} cy={100} r={10} fill={JADE} />
  </svg>
);

/** Market: a rocket. */
export const RocketPicto: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={svgStyle}>
    <path d="M100 18 c30 26 40 70 30 112 H70 c-10 -42 0 -86 30 -112z" {...line} fill="#fff" />
    <circle cx={100} cy={82} r={16} {...line} fill={C.sky[1]} />
    <path d="M70 110 L44 140 H72 M130 110 L156 140 H128" {...line} fill="#fff" />
    <path d="M86 130 c0 20 6 34 14 44 c8 -10 14 -24 14 -44" fill={JADE} />
  </svg>
);
