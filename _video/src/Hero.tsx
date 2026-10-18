// Hero cut 4:5 (1080×1350, silent loop, ≈33 s) for `.hero-doc` on www.jwicconsulting.com.
// Rendered natively (final review 2026-10-13, Q2/Q9): each segment mounts the master's own scene component at a
// scene-local time and crops it in page space, so text is sharp (no re-encoded master upscaled 1.5×), the corner
// calendar and the master's titles never leak into a crop, and breaths are drawn from the breath layer alone.
// A native title band carries the copy (Q11: ≥ 5 % of 1350 = 68 px). Segments dissolve over OV frames; the
// loop point passes through the stage colour. Every segment is full-frame opaque on the hero's own ground, so the
// outgoing one never shows through the band during a dissolve (final review 2026-10-13: 8 flickers per loop), and a
// scene window's top 24 px feather into that ground (it was a hard tone step at y 330).
import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { rf, useAuthorFrame } from './rate';
import { EASE, mix, ramp } from './fx/Polish';
import { C, THAI, gradText } from './theme';
import { FlowHeroBreath, FlowMini, STEPS } from './Flow';
import { BN_CLICK_BEAT, BREATHS, SHOTS, localBeat, type ShotId } from './timeline';
import { BreathGround, SCENES } from './Main';
import { PND_FORM } from './data/pnd';
import { HIT as PO_HIT } from './scenes/PurchaseOrder';
import { CLICK as WHT_CLICK } from './scenes/WhtCert';
import { PORTAL } from './scenes/TaxInvoice';
import { HeroMode } from './heroMode';
import { Preload } from './Preload';

const W = 1080, H = 1350;
const BAND = 330;
const OV = 6; // dissolve between segments
const GROUND = `linear-gradient(180deg, #F7FAF9 0%, #EEF3F1 55%, #E3EBE8 100%)`; // the hero's own stage colour
const FEATHER = 'linear-gradient(180deg, transparent 0px, #000 24px)';
type Crop = { x: number; y: number; w: number; h: number };
type CropAt = Crop | ((f: number) => Crop);

// visual area below the band is 1080 × 1020 → crops keep that aspect unless full-frame
const A = W / (H - BAND);
const crop = (x: number, y: number, w: number): Crop => ({ x, y, w, h: w / A });

type Seg =
  | { kind: 'scene'; id: ShotId; src: number; dur: number; crop: CropAt; title: string[]; day?: number }
  | { kind: 'breath'; id: ShotId; dur: number }
  | { kind: 'outro'; src: number; dur: number };

const BREATH_SRC = 7; // breath ground is opaque from its 7th frame
const breath = (id: ShotId): Seg => ({ kind: 'breath', id, dur: 36 });

// scene-local frames (a scene's local 0 = nominal start − 8, the opening's = 0)
// crops re-framed after the documents moved down to y 116 (tags out of the top safe margin, final review 2026-10-13):
// each document's top sits ~40 px under the band, below the window's 24 px feather
const SEGS: Seg[] = [
  // every crop keeps y + h ≤ 1080 (a crop past the frame showed the stage edge as a seam, final review r2 M1)
  // the fan narrowed in HeroMode (openGeom TX_HERO; any narrower and the cards cover the chips) seen through a
  // 1080 px window centred on it, so both outer chips sit inside the crop
  { kind: 'scene', id: 'open', src: 100, dur: 90, crop: crop(415, 60, 1080), title: ['ครบทั้งเดือน', 'ในระบบเดียว'] },
  breath('b1'),
  // from the form's landing (PO_HIT − 40 now falls inside its pop)
  { kind: 'scene', id: 'po', src: PO_HIT - 30, dur: 84, crop: crop(890, 76, 1000), title: ['สร้าง', 'ใบสั่งซื้อ'], day: 0 },
  breath('b2'),
  // BC's Direct WHT Info → Generate and Print Certificate → the 50 ทวิ and its traced total; the hero skips the
  // journal (WhtCert in HeroMode) and frames the dialog, then the certificate
  {
    kind: 'scene', id: 'wht', src: localBeat('wht', 33) - 4, dur: 100, title: ['ออกหนังสือรับรอง', 'การหักภาษี ณ ที่จ่าย'], day: 1,
    crop: (f) => { const t = ramp(f, WHT_CLICK + 6, 18, EASE.smooth); return crop(mix(875, 890, t), mix(60, 76, t), mix(1040, 1000, t)); },
  },
  breath('b3'),
  // the portal from Print... (the crop pans 410 → 480 with it, so the button and the window's edge start well inside
  // the frame), then the centred tax invoice with room above and below
  {
    kind: 'scene', id: 'inv', src: PORTAL.from, dur: 75, title: ['ออก', 'ใบกำกับภาษี'], day: 2,
    crop: (f) => crop(mix(410, 480, ramp(f, PORTAL.from, PORTAL.to - PORTAL.from, EASE.smooth)), 74, 960),
  },
  breath('b4'),
  { kind: 'scene', id: 'bn', src: localBeat('bn', BN_CLICK_BEAT) + 30, dur: 80, crop: crop(930, 96, 980), title: ['สร้าง', 'ใบวางบิล'], day: 3 }, // the whole sheet's top: rows, amounts, bank account
  breath('b5'),
  { kind: 'scene', id: 'rct', src: 20, dur: 80, crop: crop(850, 80, 1000), title: ['สร้าง', 'ใบเสร็จรับเงิน'], day: 4 },
  breath('b6'),
  { kind: 'scene', id: 'txt', src: localBeat('txt', 120) + 10, dur: 80, crop: crop(300, 80, 840), title: ['ส่งออกไฟล์', PND_FORM], day: 5 },
  // ends before the master's exit (everything going back into the folder), crop right of the tie lines (r2 M7);
  // 48 f longer (taken from the outro) so the finished tie-out with its three chips holds ~2 s
  { kind: 'scene', id: 'pp30', src: localBeat('pp30', 140) - 22 + 42, dur: 128, crop: crop(975, 80, 900), title: ['ภ.พ.30', 'พร้อมยื่น'], day: 5 },
  // from the mark's outline two-thirds drawn (src 40: the folder has faded out by src 44, so only its last wisp dissolves
  // in) through the fill, the corner fold and the name's wipe, to the whole name; no URL (owner 2026-10-13). Ends where
  // the flip-bloom cut ended (src 134); the wipe is whole at src 106 (Draw + Wipe, owner 2026-10-14)
  { kind: 'outro', src: 40, dur: 94 },
];

export const HERO_TOTAL = SEGS.reduce((n, s) => n + s.dur, 0);

// a scene component, mounted at scene-local time `src`, seen through a crop
const SceneWindow: React.FC<{ id: ShotId; src: number; crop: CropAt; top: number; height: number }> = ({ id, src, crop: c0, top, height }) => {
  const f = useAuthorFrame();
  const c = typeof c0 === 'function' ? c0(f + src) : c0;
  const k = W / c.w;
  const S = SCENES[id]!;
  return (
    <div style={{ position: 'absolute', left: 0, top, width: W, height, overflow: 'hidden', maskImage: FEATHER, WebkitMaskImage: FEATHER }}>
      <div style={{ position: 'absolute', left: -c.x * k, top: -c.y * k + (height - c.h * k) / 2, width: 1920, height: 1080, transform: `scale(${k.toFixed(5)})`, transformOrigin: '0 0' }}>
        <Sequence from={-rf(src)} name={`${id}@${src}`}>
          <HeroMode.Provider value><S /></HeroMode.Provider>
        </Sequence>
      </div>
    </div>
  );
};

// breath: the sky, and the process flow drawn vertically for 4:5 (FlowBig geo 'v'), held for the whole segment
const BreathWindow: React.FC<{ id: ShotId }> = ({ id }) => {
  const k = H / 1080;
  const b = SHOTS[id];
  return (
    <>
      <div style={{ position: 'absolute', left: W / 2 - 960 * k, top: 0, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: '0 0' }}>
        <Sequence from={-rf(BREATH_SRC)}><BreathGround dur={b.dur} /></Sequence>
      </div>
      <Sequence from={-rf(BREATH_SRC)}><FlowHeroBreath k={BREATHS.indexOf(id)} /></Sequence>
    </>
  );
};

const Band: React.FC<{ title: string[]; day?: number }> = ({ title, day }) => {
  const f = useAuthorFrame();
  const q = (k: number) => ramp(f, 2 + k * 5, 18, EASE.out);
  const d = day !== undefined && day < STEPS.length;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: BAND, fontFamily: THAI }}>
      {d && (
        <div style={{ position: 'absolute', left: 40, top: 34, transform: 'scale(0.95)', transformOrigin: '0 0' }}>
          <FlowMini k={day!} compact />
        </div>
      )}
      <div style={{ position: 'absolute', left: d ? 270 : 0, right: d ? 40 : 0, top: 52, textAlign: d ? 'left' : 'center', fontWeight: 700, fontSize: 84, lineHeight: 1.2, color: C.ink }}>
        {title.map((line, k) => (
          <div key={k} style={{
            whiteSpace: 'nowrap', opacity: q(k), transform: `translateY(${((1 - q(k)) * 24).toFixed(2)}px)`,
            filter: q(k) >= 0.999 ? undefined : `blur(${((1 - q(k)) * 8).toFixed(2)}px)`, ...(k === 1 ? gradText : null),
            fontSize: line.length > 14 ? 70 : 84,
          }}>{line}</div>
        ))}
      </div>
    </div>
  );
};

const Fade: React.FC<{ dur: number; first: boolean; last: boolean; children: React.ReactNode }> = ({ dur, first, last, children }) => {
  const f = useAuthorFrame();
  const inn = first ? ramp(f, 0, 8, EASE.out) : ramp(f, 0, OV, EASE.out);
  const out = last ? 1 - ramp(f, dur - 10, 10, EASE.out) : 1;
  return <AbsoluteFill style={{ opacity: inn * out, background: GROUND }}>{children}</AbsoluteFill>;
};

export const Hero: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{ background: GROUND, overflow: 'hidden' }}>
      <Preload />
      {SEGS.map((s, i) => {
        const from = at;
        at += s.dur;
        const last = i === SEGS.length - 1;
        return (
          // each segment starts OV frames before the previous one ends, so it dissolves over it
          <Sequence key={i} from={Math.max(0, rf(from - (i ? OV : 0)))} durationInFrames={rf(s.dur + (i && !last ? OV : 0) + (i ? OV : 0))} name={s.kind === 'outro' ? 'outro' : s.id}>
            <Fade dur={s.dur + (i ? OV : 0)} first={i === 0} last={last}>
              {s.kind === 'breath' ? (
                <BreathWindow id={s.id} />
              ) : s.kind === 'outro' ? (
                <SceneWindow id="outro" src={s.src} crop={{ x: 300, y: 250, w: 1320, h: 580 }} top={(H - 580 * (W / 1320)) / 2 - 80} height={580 * (W / 1320)} />
              ) : (
                <>
                  <SceneWindow id={s.id} src={s.src} crop={s.crop} top={BAND} height={H - BAND} />
                  <Band title={s.title} day={s.day} />
                </>
              )}
            </Fade>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
