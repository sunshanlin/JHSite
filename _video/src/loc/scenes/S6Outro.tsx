// S6 ปิด — outro-group-photo-launch (demos/outro/outro-group-photo-launch/OutroGroupPhotoLaunch.tsx): everything the film showed
// flies back in from all sides and settles around the JW mark and the product name.
// Kept from the demo: 9 elements cued 3 f apart from f4, 12 f flights on bezier(0.34,1.4,0.44,1) (a real overshoot), rotation
// ×2 → settled (±5°), scale ×1.12 → 1, directional SpeedBlur 0.3 × px/f capped at 22, the landing press (shadow tightens +
// 1.5 % squeeze over cue+9 → 16), the cast "stepping back" (opacity −12 %, saturate −8 %) as the wordmark lands, crane
// perspective(1400) rotateX 4° → 0 + scale 1.06 → 1 over 40 f then a +0.035 push from f36, the opening light sweep (2–14 f),
// the stage light behind the wordmark (42 → 50 → 58), 20 deterministic dust motes + 6 bokeh, the mark 4 f ahead of the letters
// (delay 42 + i·1.8, 8 f letterpress), the rule 58–70 with 190 px extension lines, the tagline at 68, a sign-off hold.
// Adapted: the group is the film's pictograms and documents (not page crops), the dust is sand-gold on the sky ground, the
// wordmark is the JW mark + "JWIC Thai Localization", the tagline and URL arrive with VO line 15, and the end is a hold (no
// fade to black — the poster frame is the last frame).
import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from 'remotion';
import { EASE, SpeedBlur, mix, ramp, velocity } from '../../fx/Polish';
import { alpha } from '../../fx/Look';
import { C, THAI } from '../../theme';
import { JwMark } from '../../JwMark';
import { Ground } from '../Ground';
import { BuildingPicto, DocPicto, HandshakePicto, RocketPicto, ScreenPicto } from '../Picto';
import { useSceneFrame } from '../frame';
import { VO_LOCAL } from '../timeline';

const FLY_EASE = Easing.bezier(0.34, 1.4, 0.44, 1);
const CRANE_EASE = Easing.bezier(0.3, 0, 0.2, 1);
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const NAME = 'JWIC Thai Localization';

type El = { key: string; cx: number; cy: number; w: number; h: number; rot: number; dx: number; dy: number; cue: number; node: React.ReactNode };
const thumb = (src: string, w: number, h: number) => <Img src={staticFile(src)} style={{ width: w, height: h, display: 'block', borderRadius: 10, boxShadow: `inset 0 0 0 1px ${alpha(C.ink, 0.1)}` }} />;
// render order = cue order, later arrivals stack on top; the centre (x 560–1360, y 300–720) stays clear for the wordmark block
const ELS: El[] = [
  { key: 'screen', cx: 300, cy: 230, w: 220, h: 192, rot: -5, dx: -500, dy: 0, cue: 4, node: <ScreenPicto size={220} /> },
  { key: 'doc', cx: 1640, cy: 230, w: 170, h: 204, rot: 4, dx: 500, dy: 0, cue: 7, node: <DocPicto size={170} seal={1} /> },
  { key: 'inv', cx: 250, cy: 640, w: 180, h: 255, rot: 3, dx: -400, dy: 300, cue: 10, node: thumb('docs/tax-invoice.png', 180, 255) },
  { key: 'building', cx: 1670, cy: 620, w: 180, h: 180, rot: -3, dx: 450, dy: 260, cue: 13, node: <BuildingPicto size={180} /> },
  { key: 'hand', cx: 600, cy: 140, w: 170, h: 170, rot: -2, dx: 0, dy: -240, cue: 16, node: <HandshakePicto size={170} /> },
  { key: 'rocket', cx: 1320, cy: 140, w: 160, h: 160, rot: 2.5, dx: 0, dy: -240, cue: 19, node: <RocketPicto size={160} /> },
  { key: 'pp30', cx: 470, cy: 730, w: 160, h: 226, rot: 2, dx: 0, dy: 320, cue: 22, node: thumb('docs/pp30.png', 160, 226) },
  { key: 'bn', cx: 1450, cy: 730, w: 160, h: 226, rot: -2, dx: 380, dy: 0, cue: 25, node: thumb('docs/billing-note.png', 160, 226) },
  { key: 'wht', cx: 960, cy: 150, w: 150, h: 212, rot: 1.5, dx: 0, dy: -260, cue: 28, node: thumb('docs/wht-cert.png', 150, 212) },
];

const DUST = Array.from({ length: 20 }, (_, i) => ({
  x: (i * 439 + 137) % 1920, y0: (i * 613 + 271) % 1080, rise: 0.3 + (i % 5) * 0.11, swayAmp: 9 + (i % 4) * 5,
  swayFreq: 0.022 + (i % 3) * 0.008, phase: (i * 0.83) % (Math.PI * 2), size: 2.4 + (i % 3) * 0.9, opacity: 0.35 + ((i * 7) % 5) * 0.09,
}));
const BOKEH = Array.from({ length: 6 }, (_, i) => ({ x: (i * 701 + 260) % 1920, y0: (i * 389 + 640) % 1080, rise: 0.55 + (i % 3) * 0.2, size: 14 + (i % 3) * 7, opacity: 0.1 + (i % 2) * 0.06 }));

export const S6Outro: React.FC = () => {
  const { f, inOp } = useSceneFrame('s6');
  const T15 = VO_LOCAL[15];
  const craneT = interpolate(f, [0, 40], [0, 1], { ...clamp, easing: CRANE_EASE });
  const pushT = ramp(f, 36, 300, EASE.smooth);
  const camScale = 1.06 - 0.06 * craneT + 0.035 * pushT;
  const camTilt = 4 * (1 - craneT);
  const sweepX = interpolate(f, [2, 14], [-700, 2020], { ...clamp, easing: Easing.bezier(0.4, 0, 0.6, 1) });
  const sweepOp = interpolate(f, [2, 5, 11, 14], [0, 0.12, 0.12, 0], clamp);
  const stageLight = interpolate(f, [42, 50, 58], [0, 0.55, 0.32], clamp);
  const recede = interpolate(f, [42, 50], [0, 1], clamp);
  const rule = interpolate(f, [58, 70], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0, 0.2, 1) });
  const ruleExt = interpolate(f, [58, 66], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0, 0.2, 1) });
  const ruleExtFade = interpolate(f, [66, 72], [1, 0], clamp);
  const tag = ramp(f, 68, 12, EASE.out);
  const url = ramp(f, T15 + 6, 14, EASE.out);
  const wordSpacing = interpolate(f, [62, 66], [-0.01, 0.005], { ...clamp, easing: Easing.bezier(0.3, 0, 0.2, 1) });
  const markT = interpolate(f, [38, 46], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 0.75, 0.3, 1) });

  return (
    <AbsoluteFill style={{ opacity: inOp }}>
      <Ground />
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
            const shadow = land > 0.01
              ? `0 ${10 - 5 * land}px ${24 - 12 * land}px rgba(14,46,42,${0.14 + 0.06 * land})`
              : `0 ${10 + 26 * air}px ${24 + 46 * air}px rgba(14,46,42,${0.14 + 0.1 * air})`;
            return (
              <SpeedBlur key={el.key} vx={vx} vy={vy} amount={0.3} max={22}>
                <div style={{ position: 'absolute', left: el.cx - el.w / 2, top: el.cy - el.h / 2, width: el.w, height: el.h, transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale * (1 - 0.015 * land)})`, transformOrigin: 'center center', opacity: opacity * (1 - 0.12 * recede), filter: `saturate(${1 - 0.08 * recede}) drop-shadow(${shadow})` }}>
                  {el.node}
                </div>
              </SpeedBlur>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>

      {/* sand-gold dust and bokeh in front of the group */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        {DUST.map((d, i) => {
          const y = (((d.y0 - f * d.rise) % 1080) + 1080) % 1080;
          const x = d.x + Math.sin(f * d.swayFreq + d.phase) * d.swayAmp;
          const twinkle = 0.7 + 0.3 * Math.sin(f * 0.21 + d.phase * 3);
          return <div key={i} style={{ position: 'absolute', left: x, top: y, width: d.size, height: d.size, borderRadius: '50%', background: C.c5, opacity: d.opacity * twinkle, boxShadow: `0 0 ${d.size * 2.5}px ${d.size * 0.6}px ${alpha(C.c5, 0.6)}` }} />;
        })}
        {BOKEH.map((b, i) => {
          const y = (((b.y0 - f * b.rise) % 1180) + 1180) % 1180 - 50;
          return <div key={`b${i}`} style={{ position: 'absolute', left: b.x, top: y, width: b.size, height: b.size, borderRadius: '50%', background: `radial-gradient(circle, ${alpha(C.c5, 0.9)} 0%, ${alpha(C.c5, 0.35)} 55%, ${alpha(C.c5, 0)} 72%)`, opacity: b.opacity, filter: 'blur(2px)' }} />;
        })}
      </AbsoluteFill>

      {sweepOp > 0 && (
        <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'overlay' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: sweepX - 300, width: 600, background: 'linear-gradient(90deg, rgba(255,250,240,0), rgba(255,250,240,1) 50%, rgba(255,250,240,0))', opacity: sweepOp }} />
        </AbsoluteFill>
      )}
      {stageLight > 0 && <AbsoluteFill style={{ pointerEvents: 'none', background: 'radial-gradient(760px 380px at 960px 470px, rgba(255,255,255,0.95), rgba(255,255,255,0.35) 55%, rgba(255,255,255,0) 75%)', opacity: stageLight }} />}

      {/* wordmark sign-off */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
        <div style={{ textAlign: 'center', transform: 'translateY(-100px)' }}>
          <div style={{ fontFamily: THAI, fontSize: 96, fontWeight: 700, lineHeight: 1.2, color: C.green, letterSpacing: `${0.01 + wordSpacing}em`, display: 'flex', alignItems: 'center', justifyContent: 'center', textShadow: '0 1px 0 rgba(255,255,255,0.8), 0 14px 36px rgba(14,46,42,0.14)' }}>
            <div style={{ marginRight: 30, opacity: markT, transform: `translateY(${(1 - markT) * 28}px) scale(${1.35 - 0.35 * markT})`, filter: markT < 0.995 ? `blur(${(1 - markT) * 8}px)` : undefined }}>
              <JwMark size={120} id="jw-outro" />
            </div>
            {NAME.split('').map((ch, i) => {
              const delay = Math.round(42 + i * 1.8);
              const t = interpolate(f, [delay, delay + 8], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 0.75, 0.3, 1) });
              return <span key={i} style={{ opacity: t, transform: `translateY(${(1 - t) * 28}px) scale(${1.35 - 0.35 * t})`, filter: t < 0.995 ? `blur(${(1 - t) * 8}px)` : undefined, display: 'inline-block', whiteSpace: 'pre' }}>{ch}</span>;
            })}
          </div>
          <div style={{ position: 'relative', height: 6, width: 260, margin: '30px auto 0' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 3, background: C.c1, transform: `scaleX(${rule})` }} />
            {ruleExt > 0 && ruleExtFade > 0 && (
              <>
                <div style={{ position: 'absolute', top: 2.5, height: 1, right: '100%', width: 190 * ruleExt, background: C.c1, opacity: ruleExtFade }} />
                <div style={{ position: 'absolute', top: 2.5, height: 1, left: '100%', width: 190 * ruleExt, background: C.c1, opacity: ruleExtFade }} />
              </>
            )}
          </div>
          <div style={{ fontFamily: THAI, fontSize: 40, fontWeight: 500, color: C.muted, marginTop: 26, opacity: tag, transform: `translateY(${(1 - tag) * 6}px)` }}>
            Thai Localization สำหรับ Business Central
          </div>
          <div style={{ fontFamily: THAI, fontSize: 52, fontWeight: 700, color: C.green, marginTop: 14, opacity: url, transform: `translateY(${(1 - url) * 8}px)` }}>
            www.jwicconsulting.com
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
