// Subtitles: a white capsule on a soft shadow (skin.ts). With no voice (owner 2026-10-21 "เอาแบบไม่พากย์") the captions and the
// pictures carry the story between them: subs.json (gen-beats.mjs reads it too, to time each line) captions only where the picture
// alone does not say it, eight words or so; an empty caption shows nothing where the headline, the chips or the slide already say it
// (lines 4, 6, 10, 12 — the definition headline, the breath card, the category chips). The owner approved the set on 2026-10-21.
// A backslash-n is a hand-placed row break (whiteSpace pre-line): left alone, Thai wraps mid-phrase.
// Q11: 58 px (≥ 56). Latin product names stay Latin, Thai tax terms as on the RD forms.
import React from 'react';
import { EASE, ramp } from '../fx/Polish';
import { useAuthorFrame } from '../rate';
import { FONT, M, soft } from './skin';
import subs from './subs.json';

export const SUBS: Record<number, string> = Object.fromEntries(Object.entries(subs).map(([no, text]) => [Number(no), text]));

// Mounted in a Sequence that starts at the line's VO_AT and lasts speechFrames + SUB_OUT.
export const SUB_OUT = 10;
export const Subtitle: React.FC<{ no: number; dur: number }> = ({ no, dur }) => {
  const f = useAuthorFrame();
  const text = SUBS[no];
  if (!text) return null;
  const i = ramp(f, 0, 8, EASE.out);
  const o = 1 - ramp(f, dur - 8, 8, EASE.out);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 54, display: 'flex', justifyContent: 'center', pointerEvents: 'none', opacity: i * o, transform: `translateY(${(1 - i) * 10}px)` }}>
      <div style={{ maxWidth: 1700, padding: '12px 46px 16px', borderRadius: 44, background: '#fff', boxShadow: soft(18, 0.2), fontFamily: FONT, fontWeight: 600, fontSize: 58, lineHeight: 1.3, color: M.ink, textAlign: 'center', whiteSpace: 'pre-line' }}>
        {text}
      </div>
    </div>
  );
};
