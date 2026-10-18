// Intro option B: the product itself, tilted in space.
//
// The research the owner asked for (14 Oct) pointed away from abstract 3D for B2B software and
// toward real product UI as the hero — and this clip's one advantage over every competitor is that
// it shows the actual Billing Board. So the product IS the form: the captured board on a plane in
// space, lit, with a shadow, turning toward the camera. When it reaches face-on it is already the
// first content shot, so the intro and the demo are one move rather than a card and then a cut.
//
// Deliberately NOT three.js. A texture on a flat plane is the one case where three buys nothing —
// and it cost a round of blank-white stills to loading/crossOrigin trouble. A CSS 3D transform
// renders the same geometry exactly, with no asset loading in the way; the light across the glass
// is a gradient overlay driven by the same turn value.

import React from 'react';
import { Img, staticFile } from 'remotion';
import { mix } from '../fx/Polish';

export const ScreenSolid: React.FC<{
  width: number;
  height: number;
  /** path under public/, e.g. 'screens/demo-board.png' */
  src: string;
  /** 1 = angled away, 0 = face-on */
  turn: number;
  /** crop of the 1920x1080 capture to show, in capture px */
  crop?: { x: number; y: number; w: number; h: number };
}> = ({ width, height, src, turn, crop = { x: 60, y: 56, w: 1800, h: 790 } }) => {
  const ry = mix(0, -42, turn);
  const rx = mix(0, 9, turn);
  const rz = mix(0, 1.8, turn);
  const s = width / crop.w;

  return (
    <div style={{ width, height, perspective: 2100, perspectiveOrigin: '42% 50%' }}>
      <div
        style={{
          position: 'relative',
          width,
          height: crop.h * s,
          top: (height - crop.h * s) / 2,
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(
            2,
          )}deg)`,
          borderRadius: 14,
          overflow: 'hidden',
          background: '#DCE7E3',
          boxShadow: `0 ${(44 + 30 * turn).toFixed(0)}px ${(110 + 50 * turn).toFixed(
            0,
          )}px -30px rgba(0,0,0,${(0.62 + 0.14 * turn).toFixed(2)}), 0 0 0 1px rgba(255,255,255,0.14)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${staticFile(src)})`,
            backgroundSize: `${(1920 * s).toFixed(1)}px ${(1080 * s).toFixed(1)}px`,
            backgroundPosition: `${(-crop.x * s).toFixed(1)}px ${(-crop.y * s).toFixed(1)}px`,
          }}
        />
        {/* the key light raking across the glass as it turns */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(${mix(104, 96, turn).toFixed(
              1,
            )}deg, rgba(255,255,255,${(0.3 * turn).toFixed(
              3,
            )}) 0%, rgba(255,255,255,0) 38%, rgba(6,22,17,${(0.26 * turn).toFixed(3)}) 100%)`,
          }}
        />
      </div>
      {/* keeps the PNG in Remotion's render wait — a CSS background alone is invisible to it */}
      <Img src={staticFile(src)} style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }} />
    </div>
  );
};
