import type React from 'react';
// Motion workbench manifest (video-shotcraft references/workbench.md §2). Every table is imported from the
// render code — nothing is copied by hand. Scenes keep their timing constants fixed (the tuned "rhythm" values);
// the manifest lets the workbench split the film into tracks and re-time clips.
import { Main, TAIL } from './Main';
import { BREATHS, SHOTS, TOTAL, type ShotId } from './timeline';
import { SFX } from './sfx';
import { Opening } from './scenes/Opening';
import { PurchaseOrder } from './scenes/PurchaseOrder';
import { More } from './scenes/More';
import { BillingNote } from './scenes/BillingNote';
import { TaxInvoice } from './scenes/TaxInvoice';
import { Receipt } from './scenes/Receipt';
import { WhtCert } from './scenes/WhtCert';
import { TextFile } from './scenes/TextFile';
import { PP30 } from './scenes/PP30';
import { Outro } from './scenes/Outro';
import { FlowLayer } from './Flow';

const SCENE: Partial<Record<ShotId, { c: React.FC; label: string; card: string }>> = {
  open: { c: Opening, label: 'S1 เปิด · card-stack', card: 'card-stack' },
  po: { c: PurchaseOrder, label: 'S2 ใบสั่งซื้อ (แบบฟอร์มไทย)', card: 'draw-svg-trace' },
  wht: { c: WhtCert, label: 'S3 จ่ายผู้ขาย 50 ทวิ · BC Direct WHT → trace', card: 'draw-svg-trace' },
  inv: { c: TaxInvoice, label: 'S4 ใบกำกับภาษี · multiplane → portal → doc-park', card: 'doc-park-left-pill-deal' },
  bn: { c: BillingNote, label: 'S5 ใบวางบิล · row-embed', card: 'row-embed' },
  rct: { c: Receipt, label: 'S6 ใบเสร็จรับเงิน · progressive-assemble', card: 'product-card-progressive-assemble' },
  txt: { c: TextFile, label: 'S7 ไฟล์ ภ.ง.ด.53 · typewriter', card: 'document-typewriter-reveal' },
  pp30: { c: PP30, label: 'S8 ปิดงวด รายงานภาษี → ภ.พ.30 · converge-merge', card: 'bezier-source-converge-merge' },
  more: { c: More, label: 'S9 ฟังก์ชันอีกมากมาย · feature wall', card: 'list-reveal' },
  outro: { c: Outro, label: 'S10 Outro · icon-flip-bloom', card: 'ui-to-brand-morph' },
};

export const WORKBENCH = {
  name: 'JWIC · ครบทั้งเดือน',
  fps: 30, width: 1920, height: 1080,
  total: TOTAL,
  background: '#F3F6F5',
  // same Sequence windows as Main.tsx: scenes wake TAIL frames early and stay TAIL frames late
  shots: (Object.keys(SCENE) as ShotId[]).map((id) => {
    const s = SHOTS[id];
    const lead = id === 'open' ? 0 : TAIL;
    return { id, label: SCENE[id]!.label, from: s.from - lead, duration: s.dur + lead + TAIL, component: SCENE[id]!.c, cardId: SCENE[id]!.card };
  }),
  transitions: BREATHS.map((id, k) => ({ id, label: `Flow ขั้นที่ ${k + 1}`, from: SHOTS[id].from, duration: SHOTS[id].dur + TAIL, cardId: 'timeline-travel' })),
  captions: [],
  overlays: [{ id: 'flow', label: 'เส้น Flow (กลางจอ / มุมซ้าย)', from: 0, duration: TOTAL, component: FlowLayer, props: { hideAfter: SHOTS.more.from } }],
  sfx: SFX.map((s) => ({ from: s.from, duration: s.dur ?? 90, src: `audio/sfx/${s.src}`, volume: s.volume })),
  bgm: [{ from: 0, duration: TOTAL, src: 'audio/bgm-edit.wav', volume: 0.4 }],
  order: ['transitions', 'captions', 'overlays'],
  original: Main,
};
