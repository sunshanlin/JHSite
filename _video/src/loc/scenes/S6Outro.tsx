// S6 ปิด — outro-group-photo-launch (demos/outro/outro-group-photo-launch/OutroGroupPhotoLaunch.tsx): everything the film showed
// flies back in from all sides and settles around the JW mark and the product name.
// Kept from the demo: 9 elements cued 3 f apart from f4, 12 f flights on bezier(0.34,1.4,0.44,1) (a real overshoot), rotation
// ×2 → settled (±5°), scale ×1.12 → 1, directional SpeedBlur 0.3 × px/f capped at 22, the landing press (shadow tightens +
// 1.5 % squeeze over cue+9 → 16), the cast "stepping back" (opacity −12 %, saturate −8 %) as the wordmark lands, crane
// perspective(1400) rotateX 4° → 0 + scale 1.06 → 1 over 40 f then a +0.035 push from f36, the opening light sweep (2–14 f),
// the stage light behind the wordmark (42 → 50 → 58), 20 deterministic dust motes + 6 bokeh, the mark 4 f ahead of the letters
// (delay 42 + i·1.8, 8 f letterpress), the rule 58–70 with 190 px extension lines, the tagline at 68, a sign-off hold.
// Adapted: the group is the film's pictograms and documents (not page crops) with hard ink shadows, the wordmark is the JW mark
// + "JWIC Thai Localization", and the end is a short hold before the JWIC Consulting outro (Loc.tsx 'end', the month clip's
// outro), which carries the URL — owner 2026-10-19. Skin (owner 2026-10-19, skin.ts): the month clip's light sweep, stage light,
// sand-gold dust and bokeh are gone; a rose rule replaces them.
import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from 'remotion';
import { EASE, SpeedBlur, ramp, velocity } from '../../fx/Polish';
import { THAI } from '../../theme';
import { JwMark } from '../../JwMark';
import { Ground } from '../Ground';
import { BuildingPicto, DocPicto, FlagsPicto, RocketPicto, ScreenPicto } from '../Picto';
import { useSceneFrame } from '../frame';
import { FONT, M } from '../skin';

const FLY_EASE = Easing.bezier(0.34, 1.4, 0.44, 1);
const CRANE_EASE = Easing.bezier(0.3, 0, 0.2, 1);
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const NAME = 'JWIC Thai Localization';
const lerpHex = (a: string, b: string, t: number) => {
  const n = (h: string, k: number) => parseInt(h.slice(1 + k * 2, 3 + k * 2), 16);
  return '#' + [0, 1, 2].map((k) => Math.round(n(a, k) + (n(b, k) - n(a, k)) * t).toString(16).padStart(2, '0')).join('');
};

type El = { key: string; cx: number; cy: number; w: number; h: number; rot: number; dx: number; dy: number; cue: number; node: React.ReactNode };
const thumb = (src: string, w: number, h: number) => <Img src={staticFile(src)} style={{ width: w, height: h, display: 'block', borderRadius: 12 }} />;
// render order = cue order, later arrivals stack on top; the centre (x 560–1360, y 300–720) stays clear for the wordmark block
const ELS: El[] = [
  { key: 'screen', cx: 250, cy: 190, w: 220, h: 192, rot: -5, dx: -500, dy: 0, cue: 4, node: <ScreenPicto size={220} /> },
  { key: 'doc', cx: 1700, cy: 190, w: 170, h: 204, rot: 4, dx: 500, dy: 0, cue: 7, node: <DocPicto size={170} seal={1} /> },
  { key: 'inv', cx: 250, cy: 640, w: 180, h: 255, rot: 3, dx: -400, dy: 300, cue: 10, node: thumb('docs/tax-invoice.png', 180, 255) },
  { key: 'building', cx: 1670, cy: 620, w: 180, h: 180, rot: -3, dx: 450, dy: 260, cue: 13, node: <BuildingPicto size={180} /> },
  { key: 'hand', cx: 600, cy: 140, w: 170, h: 170, rot: -2, dx: 0, dy: -240, cue: 16, node: <FlagsPicto size={170} /> },
  { key: 'rocket', cx: 1320, cy: 140, w: 160, h: 160, rot: 2.5, dx: 0, dy: -240, cue: 19, node: <RocketPicto size={160} /> },
  { key: 'pp30', cx: 470, cy: 730, w: 160, h: 226, rot: 2, dx: 0, dy: 320, cue: 22, node: thumb('docs/pp30.png', 160, 226) },
  { key: 'bn', cx: 1450, cy: 730, w: 160, h: 226, rot: -2, dx: 380, dy: 0, cue: 25, node: thumb('docs/billing-note.png', 160, 226) },
  { key: 'wht', cx: 960, cy: 150, w: 150, h: 212, rot: 1.5, dx: 0, dy: -260, cue: 28, node: thumb('docs/wht-cert.png', 150, 212) },
];

export const S6Outro: React.FC = () => {
  const { f, inOp } = useSceneFrame('s6');
  const craneT = interpolate(f, [0, 40], [0, 1], { ...clamp, easing: CRANE_EASE });
  const pushT = ramp(f, 36, 300, EASE.smooth);
  const camScale = 1.06 - 0.06 * craneT + 0.035 * pushT;
  const camTilt = 4 * (1 - craneT);
  const recede = interpolate(f, [42, 50], [0, 1], clamp);
  const rule = interpolate(f, [58, 70], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0, 0.2, 1) });
  const ruleExt = interpolate(f, [58, 66], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0, 0.2, 1) });
  const ruleExtFade = interpolate(f, [66, 72], [1, 0], clamp);
  const wordSpacing = interpolate(f, [62, 66], [-0.01, 0.005], { ...clamp, easing: Easing.bezier(0.3, 0, 0.2, 1) });
  const markT = interpolate(f, [38, 46], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 0.75, 0.3, 1) });

  return (
    <AbsoluteFill style={{ opacity: inOp }}>
      <Ground field="pink" />
      <AbsoluteFill style={{ transform: `perspective(1400px) rotateX(${camTilt}deg) scale(${camScale})`, transformOrigin: '50% 45%' }}>
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          {ELS.map((el) => {
            if (f < el.cue) return null;
            const t = interpolate(f, [el.cue, el.cue + 12], [0, 1], { ...clamp, easing: FLY_EASE });
            const opacity = interpolate(f, [el.cue, el.cue + 3], [0, 1], clamp);
            const x = el.dx * (1 - t), y = el.dy * (1 - t);
            const rot = el.rot * (2 - t);
            const scale = 1.12 - 0.12 * t;
            const air = Math.max(0, 1 - t);
            const posAt = (fr: number) => {
              const tt = interpolate(fr, [el.cue, el.cue + 12], [0, 1], { ...clamp, easing: FLY_EASE });
              return [el.dx * (1 - tt), el.dy * (1 - tt)];
            };
            const vx = velocity((fr) => posAt(fr)[0], f);
            const vy = velocity((fr) => posAt(fr)[1], f);
            const land = interpolate(f, [el.cue + 9, el.cue + 12, el.cue + 16], [0, 1, 0], clamp);
            const d = 7 + 12 * air - 3 * land; // the soft shadow lifts while the piece is in the air and tightens as it lands
            return (
              <SpeedBlur key={el.key} vx={vx} vy={vy} amount={0.3} max={22}>
                <div style={{ position: 'absolute', left: el.cx - el.w / 2, top: el.cy - el.h / 2, width: el.w, height: el.h, transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale * (1 - 0.015 * land)})`, transformOrigin: 'center center', opacity: opacity * (1 - 0.12 * recede), filter: `drop-shadow(0 ${(d * 1.4).toFixed(1)}px ${(d * 1.8).toFixed(1)}px rgba(70,76,120,0.26))` }}>
                  {el.node}
                </div>
              </SpeedBlur>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>

      {/* wordmark sign-off */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
        <div style={{ textAlign: 'center', transform: 'translateY(-40px)' }}>
          <div style={{ fontFamily: FONT, fontSize: 84, fontWeight: 800, lineHeight: 1.2, color: M.ink, letterSpacing: `${0.0 + wordSpacing}em`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ marginRight: 26, opacity: markT, transform: `translateY(${(1 - markT) * 28}px) scale(${1.35 - 0.35 * markT})`, filter: markT < 0.995 ? `blur(${(1 - markT) * 8}px)` : undefined }}>
              <JwMark size={108} id="jw-outro" />
            </div>
            {NAME.split('').map((ch, i) => {
              const delay = Math.round(42 + i * 1.8);
              const t = interpolate(f, [delay, delay + 8], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 0.75, 0.3, 1) });
              return <span key={i} style={{ color: lerpHex('#2A8A7C', '#59C0AE', i / (NAME.length - 1)), opacity: t, transform: `translateY(${(1 - t) * 28}px) scale(${1.35 - 0.35 * t})`, filter: t < 0.995 ? `blur(${(1 - t) * 8}px)` : undefined, display: 'inline-block', whiteSpace: 'pre' }}>{ch}</span>;
            })}
          </div>
          <div style={{ position: 'relative', height: 8, width: 260, margin: '30px auto 0' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 4, background: M.gradRose, transform: `scaleX(${rule})` }} />
            {ruleExt > 0 && ruleExtFade > 0 && (
              <>
                <div style={{ position: 'absolute', top: 3, height: 2, right: '100%', width: 190 * ruleExt, background: M.gradRose, opacity: ruleExtFade }} />
                <div style={{ position: 'absolute', top: 3, height: 2, left: '100%', width: 190 * ruleExt, background: M.gradRose, opacity: ruleExtFade }} />
              </>
            )}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
