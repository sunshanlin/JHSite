// Breath — paper-title-card (demos/typography/paper-title-card/PaperTitleCard.tsx) in the explainer's own skin.
// Kept from the demo: per-word letterpress entry (delay 4 + i·4, 9 f, bezier(0.2,0.75,0.3,1), scale 1.28 → 1 + blur 7 → 0 +
// opacity), one accent word per card, 220×6 accent underline scaleX 0 → 1 over f16–34, the whole card fades the last 8 f.
// Adapted: Thai words set tight (no word gap — Thai joins its words), Noto Sans Thai instead of the serif, the accent is
// jade + weight 700 (synthetic italics mangle Thai), the ground is the shared sky with a warm centre light, no DigitRoll
// sub-line (the VO carries the numbers), and the card fades IN over TAIL frames on top of the outgoing scene (frame.ts); it
// does not fade out — the next scene fades in over it.
import React from 'react';
import { AbsoluteFill, Easing, interpolate } from 'remotion';
import { C, THAI } from '../../theme';
import { Ground } from '../Ground';
import { useSceneFrame } from '../frame';
import type { LocId } from '../timeline';

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

export const Breath: React.FC<{ id: LocId; words: string; accent: string }> = ({ id, words, accent }) => {
  const { f, inOp } = useSceneFrame(id); // mounted TAIL frames early, fades in on top of the outgoing scene (frame.ts)
  const parts = words.split('|');
  const underline = interpolate(f, [16, 34], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0, 0.2, 1) });
  return (
    <AbsoluteFill style={{ opacity: inOp }}>
      <Ground />
      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(1100px 750px at 50% 42%, rgba(255,252,246,0.85), transparent 65%)' }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 1500 }}>
          <div style={{ fontFamily: THAI, fontSize: 116, fontWeight: 600, lineHeight: 1.3, color: C.ink, display: 'flex', justifyContent: 'center' }}>
            {parts.map((w, i) => {
              const delay = 4 + i * 4;
              const t = interpolate(f, [delay, delay + 9], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 0.75, 0.3, 1) });
              const isAccent = w === accent;
              return (
                <span
                  key={i}
                  style={{
                    opacity: t, transform: `scale(${1.28 - 0.28 * t})`, filter: t < 0.999 ? `blur(${((1 - t) * 7).toFixed(2)}px)` : undefined,
                    display: 'inline-block', color: isAccent ? C.c1 : undefined, fontWeight: isAccent ? 700 : 600,
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
          <div style={{ height: 6, width: 220, margin: '26px auto 0', borderRadius: 3, background: C.c1, transform: `scaleX(${underline})` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
