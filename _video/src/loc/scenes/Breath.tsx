// Breath — paper-title-card (demos/typography/paper-title-card/PaperTitleCard.tsx) in the explainer's modern skin.
// Kept from the demo: per-word letterpress entry (delay 4 + i·4, 9 f, bezier(0.2,0.75,0.3,1), scale 1.28 → 1 + blur 7 → 0 +
// opacity), one accent word per card, 220×6 accent underline scaleX 0 → 1 over f16–34.
// Adapted: Thai words set tight (no word gap — Thai joins its words), Prompt 800 in navy with the accent word in the headline
// gradient and a rose underline, its own pastel field (skin.ts), no DigitRoll sub-line (the VO carries the numbers); the card is
// revealed by the iris (Loc.tsx) over the outgoing scene and does not fade out — the next scene's iris opens over it.
import React from 'react';
import { AbsoluteFill, Easing, interpolate } from 'remotion';
import { Ground } from '../Ground';
import { FONT, M, type Field } from '../skin';
import { useSceneFrame } from '../frame';
import type { LocId } from '../timeline';

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

export const Breath: React.FC<{ id: LocId; words: string; accent: string; field?: Field }> = ({ id, words, accent, field }) => {
  const { f } = useSceneFrame(id);
  const parts = words.split('|');
  const underline = interpolate(f, [16, 34], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0, 0.2, 1) });
  return (
    <AbsoluteFill>
      <Ground field={field} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 1500 }}>
          <div style={{ fontFamily: FONT, fontSize: 116, fontWeight: 800, lineHeight: 1.3, color: M.ink, display: 'flex', justifyContent: 'center' }}>
            {parts.map((w, i) => {
              const delay = 4 + i * 4;
              const t = interpolate(f, [delay, delay + 9], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 0.75, 0.3, 1) });
              return (
                <span
                  key={i}
                  style={{
                    opacity: t, transform: `scale(${1.28 - 0.28 * t})`, filter: t < 0.999 ? `blur(${((1 - t) * 7).toFixed(2)}px)` : undefined, display: 'inline-block',
                    ...(w === accent ? { background: M.grad, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' } : {}),
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
          <div style={{ height: 6, width: 220, margin: '26px auto 0', borderRadius: 3, background: M.gradRose, transform: `scaleX(${underline})` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
