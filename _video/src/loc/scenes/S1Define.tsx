// S1 นิยาม — lead-word-zoom-assemble (demos/typography/lead-word-zoom-assemble/LeadWordZoomAssemble.tsx) then
// marker-underline-title (demos/typography/marker-underline-title/MarkerUnderlineTitle.tsx), with the first pictogram pair.
// Kept from the lead-word demo: 2.3× lead word, 6 f intro with 8 px → 0 defocus, 12 f hold with a 6 % push (PUSH_EASE),
// recede 12 f and slide 24 f on ONE curve (ZOOM_EASE), later words pushed in from 0.5 em (delay 6, stagger 4, 12 f, 2 f fade),
// pivot measured at mount (lead-word centre % + baseline px from a zero-size ruler), delayRender until measured, speed blur
// on the recede, lift −56 px over f32–46, crash-zoom the last 12 f (scale 1.2, blur 9, opacity 0.45) into the breath card.
// Kept from the marker demo: 10 f left-to-right clip reveal, variable-width wobbling stroke with the dry-brush filter,
// drawn 4–8 f after the headline settles. Adapted: the stroke is level (upright Thai, "正体字则水平微抖"), its length is the
// measured word width, and it is drawn when VO line 1 ends (the word it underlines is the one the line just defined).
// Pictograms (own): the screen with a TH | EN toggle and the document; on line 2 the document gets its jade seal
// ("การทำงานตามกฎของประเทศ") and the screen settles back ("มากกว่าเรื่องภาษาบนหน้าจอ") — no strike-through (owner: avoid negative).
import React, { Fragment, useEffect, useId, useRef, useState } from 'react';
import { AbsoluteFill, Easing, continueRender, delayRender, interpolate } from 'remotion';
import { useAuthorFrame } from '../../rate';
import { EASE, ramp } from '../../fx/Polish';
import { springAt } from '../../fx/Look';
import { C, THAI } from '../../theme';
import { Ground } from '../Ground';
import { DocPicto, ScreenPicto } from '../Picto';
import { SHOTS, VO_END_LOCAL, VO_LOCAL, speechFrames } from '../timeline';

const WORDS = ['Localization', 'คือ', 'ชุดฟังก์ชัน', 'ตามกฎของประเทศ'];
const MARK_WORD = 2; // index of the underlined word
const FONT_SIZE = 88;
const INITIAL_SCALE = 2.3;
const INTRO = 6, HOLD = 12, RECEDE = 12, ASSEMBLE = 24, WORD_DELAY = 6, WORD_STAGGER = 4, WORD_DUR = 12, WORD_PUSH = 0.5, WORD_FADE = 2;
const PUSH_SCALE = 1.06;
const LIFT: [number, number] = [32, 46];
const LIFT_Y = -170; // the title moves up to make room for the pictograms (demo: −56; here a row of icons follows)
const CRASH = 12;

const PUSH_EASE = Easing.bezier(0.25, 1, 0.5, 1);
const ZOOM_EASE = Easing.bezier(0.5, 0, 0.05, 1);
const WORD_EASE = Easing.bezier(0.22, 0.8, 0.36, 1);
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

const lineScale = (f: number) =>
  interpolate(f, [0, HOLD], [INITIAL_SCALE, INITIAL_SCALE * PUSH_SCALE], { ...clamp, easing: PUSH_EASE }) +
  interpolate(f, [HOLD, HOLD + RECEDE], [0, 1 - INITIAL_SCALE * PUSH_SCALE], { ...clamp, easing: ZOOM_EASE });

// marker stroke (from the demo's buildStroke): wobbling centre line + varying width, level for upright type
const mulberry32 = (a: number) => () => {
  let t = (a += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const buildStroke = (len: number, seed: number) => {
  const rand = mulberry32(seed);
  const N = 40;
  const top: string[] = [];
  const bot: string[] = [];
  const wob = Array.from({ length: N + 1 }, () => rand() - 0.5);
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = t * len;
    const mid = 19 + Math.sin(t * Math.PI * 1.6 + 0.4) * 2.2 + wob[i] * 1.6;
    const wBase = 14 + Math.sin(t * Math.PI) * 6 - Math.max(0, t - 0.86) * 46 - Math.max(0, 0.06 - t) * 70;
    const w = Math.max(2.2, wBase + wob[i] * 3);
    top.push(`${x.toFixed(1)},${(mid - w / 2).toFixed(1)}`);
    bot.push(`${x.toFixed(1)},${(mid + w / 2).toFixed(1)}`);
  }
  return `M${top.join('L')}L${bot.reverse().join('L')}Z`;
};
const MARKER_INK = '#1b1916';

const Marker: React.FC<{ len: number; draw: number }> = ({ len, draw }) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const drawE = 1 - Math.pow(1 - draw, 2.2);
  const path = React.useMemo(() => buildStroke(len, 77), [len]);
  return (
    <svg width={len} height={44} viewBox={`0 0 ${len} 44`} style={{ position: 'absolute', left: 0, bottom: -16, overflow: 'visible', mixBlendMode: 'multiply' }}>
      <defs>
        <clipPath id={`rv-${uid}`}><rect x={0} y={-20} width={drawE * (len + 6)} height={60} /></clipPath>
        <filter id={`dry-${uid}`} x="-5%" y="-40%" width="110%" height="180%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.09 0.5" numOctaves={2} seed={7} result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale={1.8} xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.9" numOctaves={2} seed={19} result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -16 11.4" result="holes" />
          <feComposite in="rough" in2="holes" operator="in" />
        </filter>
      </defs>
      {draw > 0 && (
        <g clipPath={`url(#rv-${uid})`}>
          <path d={path} fill={MARKER_INK} fillOpacity={0.9} filter={`url(#dry-${uid})`} />
        </g>
      )}
    </svg>
  );
};

const Title: React.FC<{ f: number; markAt: number }> = ({ f, markAt }) => {
  const lineRef = useRef<HTMLSpanElement>(null);
  const leadRef = useRef<HTMLSpanElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const baselineRef = useRef<HTMLSpanElement>(null);
  const [handle] = useState(() => delayRender('S1: measure title'));
  const [m, setM] = useState<{ lineWidth: number; leadRatio: number; baseline: number; markLen: number } | null>(null);
  useEffect(() => {
    // measure after Noto Sans Thai is in (theme.ts loads it from Google Fonts): fallback-font metrics would pin the pivot and
    // the marker length to the wrong widths (review 2026-10-18)
    let alive = true;
    document.fonts.ready.then(() => {
      if (!alive) return;
      const line = lineRef.current, lead = leadRef.current;
      if (!line || !lead) { continueRender(handle); return; }
      setM({
        lineWidth: line.offsetWidth,
        leadRatio: (lead.offsetLeft + lead.offsetWidth / 2) / line.offsetWidth,
        baseline: baselineRef.current?.offsetTop ?? line.offsetHeight * 0.8,
        markLen: markRef.current?.offsetWidth ?? 300,
      });
    });
    return () => { alive = false; };
  }, [handle]);
  useEffect(() => { if (m) continueRender(handle); }, [m, handle]);

  const ready = m !== null;
  const leadRatio = m?.leadRatio ?? 0.2;
  const lineWidth = m?.lineWidth ?? 1400;
  const baseline = m?.baseline ?? FONT_SIZE * 0.88;
  const slide = lineWidth * (0.5 - leadRatio);
  const introBlur = interpolate(f, [0, INTRO], [8 / INITIAL_SCALE, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const v = Math.abs(lineScale(f + 0.5) - lineScale(f - 0.5));
  const blur = Math.min(3.5, v * 10) + introBlur;
  const draw = interpolate(f, [markAt, markAt + 10], [0, 1], clamp);

  return (
    <span
      ref={lineRef}
      style={{
        position: 'relative', display: 'inline-block', fontSize: FONT_SIZE, fontWeight: 700, color: C.ink, letterSpacing: '-0.01em', lineHeight: 1.25,
        whiteSpace: 'nowrap', fontFamily: THAI, transformOrigin: `${leadRatio * 100}% ${baseline}px`, scale: String(lineScale(f)),
        filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
        translate: `${interpolate(f, [HOLD, HOLD + ASSEMBLE], [slide, 0], { ...clamp, easing: ZOOM_EASE })}px`,
        opacity: ready ? 1 : 0, textRendering: 'geometricPrecision',
      }}
    >
      {WORDS.map((w, i) => {
        const isLead = i === 0;
        const pushStart = HOLD + WORD_DELAY + (i - 1) * WORD_STAGGER;
        const opacity = isLead ? interpolate(f, [0, INTRO], [0, 1], clamp) : interpolate(f, [pushStart, pushStart + WORD_FADE], [0, 1], clamp);
        return (
          <Fragment key={i}>
            <span
              ref={isLead ? leadRef : i === MARK_WORD ? markRef : undefined}
              style={{
                display: 'inline-block', position: 'relative', opacity, color: isLead ? C.green : undefined,
                translate: isLead ? undefined : `${interpolate(f, [pushStart, pushStart + WORD_DUR], [WORD_PUSH * FONT_SIZE, 0], { ...clamp, easing: WORD_EASE })}px`,
              }}
            >
              {w}
              {i === MARK_WORD && m && <Marker len={m.markLen + 8} draw={draw} />}
            </span>
            {i < WORDS.length - 1 ? ' ' : null}
          </Fragment>
        );
      })}
      <span ref={baselineRef} style={{ display: 'inline-block', width: 0, height: 0 }} />
    </span>
  );
};

export const S1Define: React.FC = () => {
  const f = useAuthorFrame();
  const dur = SHOTS.s1.dur;
  const markAt = VO_END_LOCAL(1) + 6; // the underline lands as line 1 finishes defining the word
  const sealAt = VO_LOCAL[2] + 14; // "เป็นเรื่องของการทำงานตามกฎของประเทศนั้น"
  const dimAt = VO_LOCAL[2] + Math.round(speechFrames(2) * 0.6); // "…มากกว่าเรื่องภาษาที่แสดงบนหน้าจอ"
  const lift = interpolate(f, LIFT, [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const crash = interpolate(f, [dur - CRASH, dur - 1], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const pScreen = springAt(f, 44, { damping: 14, stiffness: 140 });
  const pDoc = springAt(f, 50, { damping: 14, stiffness: 140 });
  const dim = ramp(f, dimAt, 14, EASE.out);
  const seal = springAt(f, sealAt, { damping: 11, stiffness: 180 });
  return (
    <AbsoluteFill>
      <Ground />
      <AbsoluteFill style={{ transform: `scale(${1 + crash * 0.2})`, filter: crash > 0.01 ? `blur(${crash * 9}px)` : undefined, opacity: 1 - crash * 0.55 }}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `translateY(${lift * LIFT_Y}px)` }}>
          <Title f={f} markAt={markAt} />
        </AbsoluteFill>
        {/* pictogram row: the screen (language) and the document (rules) */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', gap: 220, alignItems: 'flex-end', opacity: lift }}>
          <div style={{ opacity: (1 - dim * 0.4) * pScreen, transform: `translateY(${(1 - pScreen) * 40}px) scale(${0.9 + 0.1 * pScreen})`, filter: dim > 0 ? `grayscale(${dim})` : undefined }}>
            <ScreenPicto size={250} />
          </div>
          <div style={{ opacity: pDoc, transform: `translateY(${(1 - pDoc) * 40}px) scale(${0.9 + 0.1 * pDoc})` }}>
            <DocPicto size={200} seal={Math.min(1.15, seal)} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
