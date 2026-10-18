// The seven operating shots. One component, seven configs — every shot is the same thing (a BC
// window on the dark ground, a caption band, a burgundy cursor that moves and clicks), so it is
// described as data rather than written seven times.
//
// Capture rects come from capture/demo-billing-layout.json (measured, not eyeballed); they are in
// CSS px of the 1920x1080 capture and converted to stage px by onStage().

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { EASE, mix, ramp } from '../fx/Polish';
import { E } from '../fx/Motion';
import {
  BcWindow,
  Box,
  CaptionBand,
  Callout,
  CalloutSpec,
  Cursor,
  DemoStage,
  JwTag,
  LockRing,
  Ripple,
  onStage,
} from './Look';
import { ShotId, t } from './timeline';

type Way = { at: number; x: number; y: number };
type Click = { at: number; target: Box };

export type ShotCfg = {
  id: ShotId;
  src: string;
  src2?: string;
  swapAt?: number;
  crop: Box;
  box: Box;
  chrome?: boolean;
  caption: { main: string; sub?: string; at: number };
  tagAt?: number;
  callouts?: {
    label: string;
    target: Box;
    lx: number;
    ly: number;
    at: number;
    anchor?: 'left' | 'centre';
    route?: 'below' | 'right';
  }[];
  cursor?: { path: Way[]; clicks?: Click[] };
  /** slow push to the shot's end — a frozen hold reads as a stalled player */
  push?: number;
};

const lerpWay = (path: Way[], f: number) => {
  if (f <= path[0].at) return { x: path[0].x, y: path[0].y };
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1];
    const c = path[i];
    if (f < c.at) {
      const t = E.inOutCubic(Math.max(0, Math.min(1, (f - a.at) / (c.at - a.at))));
      return { x: mix(a.x, c.x, t), y: mix(a.y, c.y, t) };
    }
  }
  const last = path[path.length - 1];
  return { x: last.x, y: last.y };
};

export const Shot: React.FC<{ cfg: ShotCfg; dur: number }> = ({ cfg, dur }) => {
  const f = useCurrentFrame();
  const barH = cfg.chrome === false ? 0 : 40;

  const inP = ramp(f, 0, t(14), EASE.smooth);
  const outP = ramp(f, dur - t(10), t(10), EASE.out);
  const push = 1 + (cfg.push ?? 0.02) * ramp(f, 0, dur, EASE.linear);

  const capP = ramp(f, cfg.caption.at, t(14), EASE.out);
  const capOut = ramp(f, dur - t(8), t(8), EASE.out);

  const swapped = cfg.swapAt !== undefined && f >= cfg.swapAt;
  const src = swapped && cfg.src2 ? cfg.src2 : cfg.src;
  const swapP = cfg.swapAt !== undefined ? ramp(f, cfg.swapAt, t(8), EASE.smooth) : 0;

  const cur = cfg.cursor ? lerpWay(cfg.cursor.path, f) : null;
  const clicks = cfg.cursor?.clicks ?? [];
  const press = clicks.reduce(
    (m, c) =>
      Math.max(m, ramp(f, c.at - t(3), t(3), EASE.out) * (1 - ramp(f, c.at + t(1), t(6), EASE.out))),
    0,
  );

  return (
    <DemoStage>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: inP * (1 - outP * 0.0),
          transform: `scale(${push.toFixed(4)})`,
          transformOrigin: '50% 46%',
        }}
      >
        <BcWindow
          src={src}
          crop={cfg.crop}
          box={cfg.box}
          p={inP}
          chrome={cfg.chrome !== false}
        >
          {/* a dialog arriving inside the window gets its own quick dissolve */}
          {swapP > 0 && swapP < 1 ? null : null}
        </BcWindow>

        {cfg.tagAt !== undefined && (
          <JwTag
            x={cfg.box.x}
            y={cfg.box.y - 62}
            p={ramp(f, cfg.tagAt, t(12), (q: number) => E.outBack(q))}
          />
        )}

        {(cfg.callouts ?? []).map((c, i) => {
          const spec: CalloutSpec = {
            label: c.label,
            target: onStage(c.target, cfg.crop, cfg.box, barH),
            label_x: c.lx,
            label_y: c.ly,
            at: c.at,
            anchor: c.anchor,
            route: c.route,
          };
          return <Callout key={i} c={spec} f={f} out={ramp(f, dur - t(26), t(10), EASE.out)} />;
        })}

        {clicks.map((c, i) => {
          const r = onStage(c.target, cfg.crop, cfg.box, barH);
          const lock = ramp(f, c.at - t(16), t(11), EASE.snappy);
          const fade = 1 - ramp(f, c.at + t(14), t(10), EASE.out);
          const k = ramp(f, c.at, t(14), EASE.out);
          return (
            <React.Fragment key={i}>
              {lock > 0.001 && fade > 0.001 && (
                <LockRing r={r} p={lock * fade} press={press} />
              )}
              <Ripple
                cx={r.x + r.w / 2}
                cy={r.y + r.h / 2}
                k={k * (1 - ramp(f, c.at + t(16), t(6), EASE.out))}
              />
            </React.Fragment>
          );
        })}

        {cur && <Cursor x={cur.x} y={cur.y} press={press} o={ramp(f, t(2), t(10), EASE.out)} />}
      </div>

      <CaptionBand main={cfg.caption.main} sub={cfg.caption.sub} p={capP} out={capOut} />
    </DemoStage>
  );
};

// ---------------------------------------------------------------------------
// Configs. Local frame 0 = the shot's own start. Every `at` is written at 30 fps and converted by
// t(), so changing FPS in timeline.ts re-times the whole film without touching a number here.

/** board + click share one capture and one framing, so the click grows out of what we just read */
const BOARD_CROP: Box = { x: 60, y: 56, w: 1800, h: 790 };
const BOARD_BOX: Box = { x: 108, y: 96, w: 1704, h: 748 };

// The board's rects were measured from inside the add-in iframe, which is itself nested in the
// designer-client-frame at y 48 — so every y below carries that +48 the measurement pass missed.
/** the chip the cursor goes for — 11 Dec, บริษัท เอเชียเทรดดิ้ง จำกัด, 2 entries */
const CHIP: Box = { x: 1317.8, y: 381, w: 224.4, h: 22 };
const KPI_TO_BILL: Box = { x: 118, y: 185.6, w: 159.5, h: 31 };

const WL_CROP: Box = { x: 396, y: 56, w: 1128, h: 400 };
const WL_BOX: Box = { x: 180, y: 200, w: 1560, h: 553 };
const WL_CREATE: Box = { x: 1177.4, y: 227.4, w: 163.8, h: 38 };

const CARD_CROP: Box = { x: 396, y: 56, w: 1128, h: 600 };
const CARD_BOX: Box = { x: 270, y: 108, w: 1380, h: 734 };
const CARD_RELEASE: Box = { x: 712.4, y: 210.4, w: 112.4, h: 38 };

const DOC_CROP: Box = { x: 622, y: 58, w: 724, h: 900 };
const DOC_BOX: Box = { x: 630, y: 70, w: 660, h: 820 };

export const SHOT_CFG: Record<Exclude<ShotId, 'cover' | 'outro'>, ShotCfg> = {
  board: {
    id: 'board',
    src: 'screens/demo-board.png',
    crop: BOARD_CROP,
    box: BOARD_BOX,
    tagAt: t(10),
    caption: { main: 'รอบวางบิลของทุกลูกค้าในหน้าเดียว', sub: 'Billing Board', at: t(16) },
    // Two, not three. The trailer's third callout (วันหยุดจาก ธปท.) is dropped: the owner had
    // already said to replace it next time the board was touched, and two ties keep the month
    // readable. The caption carries what the board is; the ties only point at the two things a
    // viewer would otherwise miss.
    callouts: [
      {
        label: 'ยอดที่ต้องวางบิล',
        target: KPI_TO_BILL,
        lx: 300,
        ly: 352,
        route: 'below',
        at: t(24),
      },
      {
        label: 'รอบวางบิลของลูกค้า',
        target: CHIP,
        lx: 1545,
        ly: 600,
        route: 'right',
        at: t(56),
      },
    ],
  },

  click: {
    id: 'click',
    src: 'screens/demo-board.png',
    crop: BOARD_CROP,
    box: BOARD_BOX,
    tagAt: 0,
    caption: { main: 'เปิดรอบวางบิลของลูกค้ารายนี้', sub: '11 ธ.ค. 2569', at: t(10) },
    cursor: {
      // lands on the chip's centre; the arrow's hot point is ~5 px in from its top-left
      path: [
        { at: t(0), x: 900, y: 740 },
        { at: t(40), x: 1448, y: 478 },
        { at: t(56), x: 1400, y: 449 },
        { at: t(125), x: 1400, y: 449 },
      ],
      clicks: [{ at: t(62), target: CHIP }],
    },
  },

  worklist: {
    id: 'worklist',
    src: 'screens/demo-worklist.png',
    crop: WL_CROP,
    box: WL_BOX,
    tagAt: t(12),
    caption: { main: 'ใบแจ้งหนี้ที่ถึงรอบวางบิลแล้ว', sub: 'Billing Worklist', at: t(18) },
  },

  create: {
    id: 'create',
    src: 'screens/demo-worklist.png',
    src2: 'screens/demo-created-dialog.png',
    swapAt: t(96),
    crop: WL_CROP,
    box: WL_BOX,
    tagAt: 0,
    caption: { main: 'สร้างใบวางบิลจากรายการของรอบนี้', at: t(12) },
    cursor: {
      path: [
        { at: t(0), x: 1452, y: 406 },
        { at: t(44), x: 1690, y: 470 },
        { at: t(58), x: 1662, y: 452 },
        { at: t(188), x: 1662, y: 452 },
      ],
      clicks: [{ at: t(64), target: WL_CREATE }],
    },
  },

  card: {
    id: 'card',
    src: 'screens/demo-note-open.png',
    crop: CARD_CROP,
    box: CARD_BOX,
    tagAt: t(12),
    caption: { main: 'ใบวางบิลฉบับร่างพร้อมตรวจ', sub: 'SBN26120005 · 45,442.90', at: t(18) },
  },

  release: {
    id: 'release',
    src: 'screens/demo-note-open.png',
    src2: 'screens/demo-note-released.png',
    swapAt: t(92),
    crop: CARD_CROP,
    box: CARD_BOX,
    tagAt: 0,
    caption: { main: 'ใบวางบิลได้เลขถาวร', sub: 'Released', at: t(100) },
    cursor: {
      path: [
        { at: t(0), x: 1200, y: 560 },
        { at: t(40), x: 1010, y: 360 },
        { at: t(54), x: 1032, y: 342 },
        { at: t(187), x: 1032, y: 342 },
      ],
      clicks: [{ at: t(60), target: CARD_RELEASE }],
    },
  },

  print: {
    id: 'print',
    src: 'screens/demo-print-preview.png',
    crop: DOC_CROP,
    box: DOC_BOX,
    chrome: false,
    tagAt: t(14),
    caption: { main: 'ใบวางบิลภาษาไทยพร้อมส่งลูกค้า', at: t(22) },
    push: 0.02,
  },
};
