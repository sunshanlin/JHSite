// Pictograms: two-colour line icons — navy ink strokes, mint for the thing that works, warm pastel fills, 6 px strokes at 1080,
// round caps, no gradients. Plain SVGs; a moving part takes a 0–1 progress prop, so the scene owns the timing. Used by S4 (the
// category discs), S5 (the card fronts) and S6 (the pieces flying in round the wordmark).
import React from 'react';
import { FONT, M } from './skin';

export const INK = M.ink;
const MINT = M.mint;
const FILL = '#FFF1E0';
const line = { stroke: INK, strokeWidth: 6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
const svgStyle: React.CSSProperties = { display: 'block', overflow: 'visible' };

/** A monitor whose screen shows a TH | EN language toggle. */
export const ScreenPicto: React.FC<{ size?: number }> = ({ size = 260 }) => {
  const s = size / 260;
  return (
    <svg width={260 * s} height={226 * s} viewBox="0 0 260 226" style={svgStyle}>
      <rect x={10} y={10} width={240} height={160} rx={16} {...line} fill="#fff" />
      <path d="M130 170 V200 M92 206 H168" {...line} />
      <rect x={58} y={66} width={144} height={48} rx={24} {...line} fill={FILL} strokeWidth={4} />
      <circle cx={84} cy={90} r={16} fill={MINT} />
      <text x={122} y={100} fontFamily={FONT} fontWeight={700} fontSize={26} fill={INK}>TH</text>
      <text x={162} y={100} fontFamily={FONT} fontWeight={700} fontSize={26} fill={INK} opacity={0.45}>EN</text>
    </svg>
  );
};

/** A document page with text lines; `seal` (0–1) scales in the mint approval seal with a check mark. */
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
          <circle r={32} fill={MINT} />
          <path d="M-14 1 L-4 11 L15 -10" stroke="#fff" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      )}
    </svg>
  );
};

/** Regulatory (the Revenue Department): a building with columns. */
export const BuildingPicto: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={svgStyle}>
    <path d="M24 72 L100 24 L176 72 Z" {...line} fill="#fff" />
    <rect x={30} y={72} width={140} height={14} rx={4} {...line} fill={FILL} />
    <path d="M52 86 V156 M84 86 V156 M116 86 V156 M148 86 V156" {...line} />
    <rect x={22} y={156} width={156} height={16} rx={5} {...line} fill="#fff" />
  </svg>
);

/** Market: a rocket. */
export const RocketPicto: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={svgStyle}>
    <path d="M100 18 c30 26 40 70 30 112 H70 c-10 -42 0 -86 30 -112z" {...line} fill="#fff" />
    <circle cx={100} cy={82} r={16} {...line} fill={FILL} />
    <path d="M70 110 L44 140 H72 M130 110 L156 140 H128" {...line} fill="#fff" />
    <path d="M86 130 c0 20 6 34 14 44 c8 -10 14 -24 14 -44" fill={MINT} />
  </svg>
);

/** National standards: one made-up national flag on a pole (owner 2026-10-19: "รูปธงชาติสมมติ", "ผืนเดียวก็พอ") — a pink field, a
 *  sand diagonal band, a mint triangle in the fly corner and a white hexagon: deliberately nothing like a real country's flag. */
export const FlagsPicto: React.FC<{ size?: number }> = ({ size = 200 }) => {
  const w = 106, h = 74;
  const wave = `M0 0 C${w * 0.2} -9 ${w * 0.4} 9 ${w * 0.6} 0 S${w * 0.9} -6 ${w} 2 L${w} ${h + 2} C${w * 0.9} ${h - 4} ${w * 0.8} ${h + 8} ${w * 0.6} ${h} S${w * 0.2} ${h - 8} 0 ${h} Z`;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={svgStyle}>
      <path d="M58 24 V186" {...line} strokeWidth={7} />
      <g transform="translate(58 30)">
        <clipPath id="flag-cloth"><path d={wave} /></clipPath>
        <g clipPath="url(#flag-cloth)">
          <rect x={-6} y={-14} width={w + 12} height={h + 28} fill="#F29BB3" />
          <polygon points={`-6,${h * 0.66} ${w * 0.6},-14 ${w * 0.9},-14 -6,${h * 1.04}`} fill="#F8C987" />
          <polygon points={`${w + 6},${h * 0.46} ${w + 6},${h + 14} ${w * 0.52},${h + 14}`} fill="#6FCFBD" />
          <polygon points={`${w * 0.3},${h * 0.18} ${w * 0.38},${h * 0.18} ${w * 0.42},${h * 0.32} ${w * 0.38},${h * 0.46} ${w * 0.3},${h * 0.46} ${w * 0.26},${h * 0.32}`} fill="#ffffff" />
        </g>
        <path d={wave} {...line} strokeWidth={5} fill="none" />
      </g>
      <circle cx={58} cy={20} r={8} fill={INK} />
    </svg>
  );
};
