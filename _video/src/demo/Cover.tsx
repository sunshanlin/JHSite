// The open: two cards on one continuous camera move.
//
// Structure taken from the reference the owner chose (Microsoft's own Business Central channel,
// "Introducing: Composite Document Layouts"): card 1 says whose channel this is, card 2 says what
// this episode is, and ONE lit 3D object drifts across both so the pair reads as a single move
// rather than two slides. That split is also exactly the music structure the owner asked for —
// card 1 is the part every episode reuses, card 2 is the part that changes.
//
// The object is ours, not theirs: the JW mark as a slab with its corner physically turned in,
// pink underside showing. Built in three.js (src/demo/JwSolid.tsx).

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { EASE, mix, ramp } from '../fx/Polish';
import { E } from '../fx/Motion';
import { THAI } from '../theme';
import { D, DemoStage, JwSquare } from './Look';
import { SeriesObject } from './SeriesObject';
import { ScreenSolid } from './ScreenSolid';

/**
 * Which signature the open uses. Both are built; the owner picks.
 *   'layers' — three floating UI panels, the front one ours (abstract)
 *   'screen' — the captured Billing Board tilted in space, turning to face-on (the product itself)
 */
type IntroKind = 'layers' | 'screen';
/** owner 2026-10-14, after seeing both: "ผมอยากไปทาง B" — the abstract layers. */
const INTRO = 'layers' as IntroKind;
import { localBeat, t } from './timeline';

const b = (n: number) => localBeat('cover', n);

/** card 2 takes over here */
const SWAP = 7;

export const Cover: React.FC = () => {
  const f = useCurrentFrame();

  // one camera move across both cards — never restarts
  const drift = ramp(f, 0, b(12), EASE.linear);
  const fold = ramp(f, b(1.5), t(30), (q: number) => E.outCubic(q));

  // card 1
  const brand = ramp(f, b(0.5), t(14), (q: number) => E.outBack(q));
  const c1a = ramp(f, b(2), t(16), EASE.out);
  const c1b = ramp(f, b(2.8), t(16), EASE.out);
  const c1out = ramp(f, b(SWAP) - t(6), t(12), EASE.out);

  // card 2
  const c2a = ramp(f, b(SWAP) + t(2), t(16), EASE.out);
  const c2b = ramp(f, b(SWAP) + t(10), t(16), EASE.out);
  const c2c = ramp(f, b(SWAP) + t(18), t(16), EASE.out);

  return (
    <DemoStage>
      {/* a soft pool of shadow so the object sits on the ground instead of floating on it */}
      <div
        style={{
          position: 'absolute',
          right: -120,
          top: 120,
          width: 1100,
          height: 1100,
          borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(4,16,12,0.5), rgba(4,16,12,0) 72%)',
          transform: `translateY(${mix(10, 40, drift).toFixed(1)}px)`,
        }}
      />

      {/* the signature object, bleeding off the right edge, drifting the whole time */}
      <div
        style={{
          position: 'absolute',
          right: -170,
          top: -20,
          width: 1240,
          height: 1240,
          transform: `translate(${mix(34, -24, drift).toFixed(1)}px, ${mix(-18, 26, drift).toFixed(
            1,
          )}px) scale(${mix(0.94, 1.1, drift).toFixed(4)})`,
          transformOrigin: '62% 50%',
        }}
      >
        {INTRO === 'layers' ? (
          <SeriesObject
            width={1240}
            height={1240}
            spread={mix(0.25, 1.05, fold)}
            spin={mix(-0.74, -0.34, drift)}
            zoom={12.8}
          />
        ) : (
          <ScreenSolid
            width={1240}
            height={1240}
            src="screens/demo-board.png"
            turn={mix(1, 0.42, drift)}
          />
        )}
      </div>

      {/* brand row, top-left — stays through both cards */}
      <div
        style={{
          position: 'absolute',
          left: 106,
          top: 70,
          display: 'flex',
          alignItems: 'center',
          gap: 15,
          opacity: brand,
          transform: `translateX(${mix(-26, 0, brand).toFixed(2)}px)`,
        }}
      >
        <JwSquare size={46} fold={fold} />
        <span style={{ color: D.paper, fontFamily: THAI, fontSize: 26, fontWeight: 600 }}>
          JWIC Consulting
        </span>
      </div>

      {/* card 1 — the series */}
      <div style={{ position: 'absolute', left: 106, top: 300, maxWidth: 1040, opacity: 1 - c1out }}>
        <Line p={c1a} size={92} weight={700} color={D.paper}>
          JWIC Thai Localization
        </Line>
        <Line p={c1b} size={44} weight={400} color={D.paperMuted} mt={16}>
          สำหรับ Microsoft Dynamics 365 Business Central
        </Line>
      </div>

      {/* card 2 — this episode */}
      <div style={{ position: 'absolute', left: 106, top: 268, maxWidth: 1060 }}>
        <Line p={c2a} size={96} weight={700} color={D.paper}>
          วางบิลทั้งเดือน
        </Line>
        <Line p={c2b} size={96} weight={700} color={D.paper}>
          บนปฏิทินเดียว
        </Line>
        <Line p={c2c} size={40} weight={400} color={D.paperMuted} mt={22}>
          ระบบวางบิลสำหรับ Business Central
        </Line>
      </div>
    </DemoStage>
  );
};

/** a line that slides up out of a blur, the way the reference reveals its subtitle */
const Line: React.FC<{
  p: number;
  size: number;
  weight: number;
  color: string;
  mt?: number;
  children: React.ReactNode;
}> = ({ p, size, weight, color, mt = 0, children }) => {
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        marginTop: mt,
        color,
        fontFamily: THAI,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.14,
        letterSpacing: '-0.015em',
        whiteSpace: 'nowrap',
        opacity: p,
        filter: `blur(${((1 - p) * 9).toFixed(2)}px)`,
        transform: `translateX(${mix(-34, 0, p).toFixed(2)}px)`,
      }}
    >
      {children}
    </div>
  );
};
