// Visual vocabulary for the in-game demo series (JHPresales).
// Deliberately NOT the trailer's language: the trailer floats white paper on a pale sky; this one
// floats a real BC window on the dark teal ground the JHPresales covers use, and every interaction
// mark is burgundy — the one colour JWIC's own DESIGN.md reserves for "this is what you press"
// (index.html --brand-burgundy, "The Burgundy Toll Rule").
//
// Owner decisions 2026-10-14: dark green ground · burgundy marks · Noto Sans Thai · window frame
// · caption as a fixed bottom band · cover art from the JHPresales artifact animates as the open.

import React from 'react';
import { Img, staticFile } from 'remotion';
import { EASE, mix, ramp, softShadow } from '../fx/Polish';
import { alpha } from '../fx/Look';
import { E } from '../fx/Motion';
import { THAI } from '../theme';
import { t } from './timeline';

// ---------------------------------------------------------------------------
// Tokens

export const D = {
  /** the JHPresales cover ground, verbatim from the artifact's .poster */
  ground:
    'radial-gradient(ellipse 900px 700px at 50% 0%, #2f6b56 0%, transparent 55%),' +
    'linear-gradient(180deg, #1c4a3c 0%, #14342a 55%, #0d1f19 100%)',
  /** interaction marks — cursor, lock ring, click ripple, callout ties */
  burgundy: '#A63A56',
  /** the cover's own accent (episodes cycle this; the interaction marks never do) */
  ep: '#8E2C46',
  /** the back of the folded corner — the JW logo's own pink (artifact logo SVG) */
  fold: '#c07f8b',
  /** the front of the flap while it is lifting: the cover's top-glow green, catching light */
  foldFront: '#2f6b56',
  paper: '#f5f1ea',
  paperMuted: '#cfd9d3',
  mist: '#A6C0BD',
  tagGreen: '#0B4F48',
  pinkSoft: '#EFA9BB',
} as const;

export type Box = { x: number; y: number; w: number; h: number };

// ---------------------------------------------------------------------------
// Stage

export const DemoStage: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={{ position: 'absolute', inset: 0, background: D.ground, fontFamily: THAI }}>
    {/* the cover's 3px dot grain, so stage and cover are the same material */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(245,241,234,0.05) 1px, transparent 1px)',
        backgroundSize: '3px 3px',
        mixBlendMode: 'overlay',
        opacity: 0.5,
      }}
    />
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// The BC window: a crop of a 1920x1080 capture, drawn inside a minimal app frame.
// The frame is ours, not a copy of Chrome — it exists so the shot reads as "a real program is
// open", and it covers for the BC app bar we crop away (no Microsoft wordmark on screen).

export const BcWindow: React.FC<{
  src: string;
  crop: Box;
  box: Box;
  /** 0..1 entrance */
  p?: number;
  chrome?: boolean;
  children?: React.ReactNode;
}> = ({ src, crop, box, p = 1, chrome = true, children }) => {
  const BAR = chrome ? 40 : 0;
  const s = box.w / crop.w;
  const lift = mix(26, 0, p);
  return (
    <div
      style={{
        position: 'absolute',
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h + BAR,
        borderRadius: 14,
        overflow: 'hidden',
        background: '#fff',
        opacity: ramp(p, 0, 1, EASE.linear),
        transform: `translateY(${lift.toFixed(2)}px) scale(${mix(0.985, 1, p).toFixed(4)})`,
        boxShadow: `0 48px 110px -30px rgba(0,0,0,.72), 0 0 0 1px ${alpha('#ffffff', 0.13)}`,
      }}
    >
      {chrome && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: BAR,
            background: '#E8EDEC',
            borderBottom: '1px solid #D2DAD8',
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            paddingLeft: 18,
            zIndex: 3,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{ width: 12, height: 12, borderRadius: 6, background: '#C9D2D0' }}
            />
          ))}
        </div>
      )}
      <div style={{ position: 'absolute', left: 0, top: BAR, right: 0, bottom: 0, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${staticFile(src)})`,
            backgroundSize: `${(1920 * s).toFixed(2)}px ${(1080 * s).toFixed(2)}px`,
            backgroundPosition: `${(-crop.x * s).toFixed(2)}px ${(-crop.y * s).toFixed(2)}px`,
          }}
        />
        {children}
      </div>
    </div>
  );
};

/** capture px -> stage px, for anything that must sit on top of a BcWindow */
export const onStage = (r: Box, crop: Box, box: Box, barH = 40): Box => {
  const s = box.w / crop.w;
  return {
    x: box.x + (r.x - crop.x) * s,
    y: box.y + barH + (r.y - crop.y) * s,
    w: r.w * s,
    h: r.h * s,
  };
};

// ---------------------------------------------------------------------------
// Caption: one fixed band along the bottom. The screenshot is the subject, so the caption never
// floats beside it competing for the same space — the eye learns one place to read.

export const CaptionBand: React.FC<{ main: string; sub?: string; p: number; out?: number }> = ({
  main,
  sub,
  p,
  out = 0,
}) => {
  const o = p * (1 - out);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 168,
        zIndex: 6,
        background:
          'linear-gradient(to top, rgba(13,31,25,.97) 42%, rgba(13,31,25,0) 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 96px 18px',
        opacity: o,
      }}
    >
      <div
        style={{
          color: D.paper,
          fontSize: 52,
          fontWeight: 600,
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
          transform: `translateY(${mix(14, 0, p).toFixed(2)}px)`,
        }}
      >
        {main}
      </div>
      {sub ? (
        <div style={{ color: D.mist, fontSize: 30, fontWeight: 500, marginTop: 10 }}>{sub}</div>
      ) : null}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Interaction marks

export const Cursor: React.FC<{ x: number; y: number; press?: number; o?: number }> = ({
  x,
  y,
  press = 0,
  o = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      zIndex: 9,
      opacity: o,
      transform: `scale(${mix(1, 0.86, press).toFixed(3)})`,
      transformOrigin: '12% 8%',
      filter: 'drop-shadow(0 5px 10px rgba(0,0,0,.5))',
    }}
  >
    <svg width={44} height={58} viewBox="0 0 24 32">
      <path
        d="M3 2 L3 24 L9 18.4 L13.2 27.4 L16.8 25.7 L12.7 17 L20 17 Z"
        fill={D.burgundy}
        stroke="#fff"
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const LockRing: React.FC<{ r: Box; p: number; press?: number }> = ({ r, p, press = 0 }) => (
  <div
    style={{
      position: 'absolute',
      left: r.x - 7,
      top: r.y - 6,
      width: r.w + 14,
      height: r.h + 12,
      zIndex: 8,
      borderRadius: 10,
      border: `4px solid ${D.burgundy}`,
      background: alpha(D.burgundy, 0.1 + 0.16 * press),
      boxShadow: `0 0 0 7px ${alpha(D.burgundy, 0.13)}`,
      transform: `scale(${mix(1.22, 1, p).toFixed(3)})`,
      opacity: p,
    }}
  />
);

export const Ripple: React.FC<{ cx: number; cy: number; k: number }> = ({ cx, cy, k }) => {
  if (k <= 0.001) return null;
  const size = 96;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - size / 2,
        top: cy - size / 2,
        width: size,
        height: size,
        zIndex: 8,
        borderRadius: size / 2,
        border: `4px solid ${D.burgundy}`,
        transform: `scale(${mix(0.45, 1.65, k).toFixed(3)})`,
        opacity: 1 - k,
      }}
    />
  );
};

// ---------------------------------------------------------------------------
// Callout: a white pill tied to a rect on the screenshot. Same grammar as the trailer's billing
// shot, so the two films read as one product — only the tie colour changes.

export type CalloutSpec = {
  label: string;
  target: Box; // already converted to stage coords
  label_x: number;
  label_y: number;
  at: number;
  anchor?: 'left' | 'centre';
  /**
   * Where the tie leaves the target. 'below' drops from its bottom edge and turns to the label;
   * 'right' leaves the right edge and turns down. Pick whichever keeps the line over blank paper
   * — a tie that crosses a row of the screenshot makes both unreadable.
   */
  route?: 'below' | 'right';
};

export const Callout: React.FC<{ c: CalloutSpec; f: number; out: number }> = ({ c, f, out }) => {
  const ring = ramp(f, c.at, t(10), EASE.snappy);
  const draw = ramp(f, c.at + t(2), t(11), EASE.out);
  const pill = ramp(f, c.at + t(6), t(10), (q: number) => E.outBack(q));
  const o = ramp(f, c.at, t(8), EASE.out) * (1 - out);
  if (o <= 0.001) return null;

  const ly = c.label_y + 29;
  const lx = c.anchor === 'centre' ? c.label_x : c.label_x + 10;

  let tx: number;
  let ty: number;
  let d: string;
  if (c.route === 'right') {
    tx = c.target.x + c.target.w;
    ty = c.target.y + c.target.h / 2;
    const midX = (tx + lx) / 2;
    d = `M ${tx} ${ty} L ${midX} ${ty} L ${midX} ${ly} L ${lx} ${ly}`;
  } else {
    tx = c.target.x + c.target.w / 2;
    ty = c.target.y + c.target.h;
    const midY = (ty + ly) / 2;
    d = `M ${tx} ${ty} L ${tx} ${midY} L ${lx} ${midY} L ${lx} ${ly}`;
  }

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: c.target.x - 6,
          top: c.target.y - 5,
          width: c.target.w + 12,
          height: c.target.h + 10,
          zIndex: 8,
          borderRadius: 9,
          border: `3px solid ${D.burgundy}`,
          background: alpha(D.burgundy, 0.1),
          transform: `scale(${mix(1.25, 1, ring).toFixed(3)})`,
          opacity: o,
        }}
      />
      <svg
        width={1920}
        height={1080}
        style={{ position: 'absolute', inset: 0, zIndex: 7, overflow: 'visible', opacity: o }}
      >
        <path
          d={d}
          fill="none"
          stroke={D.burgundy}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - draw}
        />
        <circle cx={tx} cy={ty} r={7} fill={D.burgundy} opacity={draw > 0.05 ? 1 : 0} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: c.label_x,
          top: c.label_y,
          zIndex: 8,
          height: 58,
          padding: '0 24px',
          borderRadius: 29,
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          color: '#10241F',
          fontFamily: THAI,
          fontSize: 30,
          fontWeight: 600,
          whiteSpace: 'nowrap',
          boxShadow: softShadow(14, { color: '#000000', strength: 0.9 }),
          opacity: pill,
          transform: `translate(${c.anchor === 'centre' ? '-50%' : '0'}, ${mix(12, 0, pill).toFixed(2)}px)`,
        }}
      >
        {c.label}
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------
// Origin tag — green JW, same component language as the trailer's Tag but mounted on the dark
// ground, so it carries its own contrast instead of the trailer's white-on-pale.

export const JwTag: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      zIndex: 7,
      height: 48,
      padding: '0 20px 0 10px',
      borderRadius: 24,
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      background: D.tagGreen,
      color: '#fff',
      fontFamily: THAI,
      fontSize: 27,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      opacity: p,
      transform: `scale(${mix(0.88, 1, p).toFixed(4)})`,
      transformOrigin: '0% 100%',
      boxShadow: '0 10px 26px rgba(0,0,0,.42)',
    }}
  >
    <JwSquare size={30} />
    JWIC Thai Localization
  </div>
);

/** The JW mark: rounded square with the folded corner. Redrawn, not the PNG, so it can animate. */
export const JwSquare: React.FC<{ size: number; fold?: number }> = ({ size, fold = 1 }) => {
  const r = Math.round(size * 0.22);
  const c = size * 0.36 * fold;
  return (
    <span
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: r,
        background: '#2B6E63',
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        flexShrink: 0,
        fontFamily: THAI,
        fontWeight: 700,
        fontSize: size * 0.5,
        color: '#fff',
      }}
    >
      JW
      {c > 0.5 && (
        <span
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            borderStyle: 'solid',
            borderWidth: `0 ${c}px ${c}px 0`,
            borderColor: `transparent ${D.fold} transparent transparent`,
          }}
        />
      )}
    </span>
  );
};
