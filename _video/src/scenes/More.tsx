// "มาพร้อมฟังก์ชันอีกมากมาย" — the month folder opens once more and twelve feature cards burst out of it into a 4 × 3
// wall, hold so every name can be read, then fly back in and the folder closes for the outro's flip
// (owner 2026-10-13: "เพิ่มฟังก์ชั่นอื่นๆ แบบเร็วๆ ตาม Highlight Feature แบบเห็นพร้อมกัน").
// Cards = features the film has not shown, grouped and coloured like the site's Highlight Feature tabs.
// Motion: list-reveal grammar (each card springs to its slot, soft back, ~1.5 f stagger) out of a shared origin,
// reversed on the way back (EASE.exit, stagger from the last card); the heading rises with blur-slide.
// Hand-off (final review 2026-10-13): the scene fades in over 4 f once PP30's folder is closed and centred, instead of
// cutting in its opaque stage over PP30's exit; heading + tag + wall sit centred on the frame, the tag centred under
// the heading with room above the cards.
import React from 'react';
import { AbsoluteFill, spring } from 'remotion';
import { useAuthorFrame } from '../rate';
import { EASE, mix, ramp, softShadow } from '../fx/Polish';
import { Stage, alpha } from '../fx/Look';
import { C, L, THAI, gradText } from '../theme';
import { Folder, FOLDER_H, FOLDER_W } from '../Folder';
import { TAIL, localBeat } from '../timeline';
import { TAG_H, Tag } from '../Tag';

type Group = { name: string; c: string; ink: string; icon: string };
const G: Record<string, Group> = {
  vat: { name: 'ภาษีมูลค่าเพิ่ม', c: C.c1, ink: '#fff', icon: 'M5 4h14v16H5z M8 8h8 M8 12h8 M8 16h5' },
  wht: { name: 'ภาษีหัก ณ ที่จ่าย', c: C.c3, ink: '#fff', icon: 'M12 3v18 M7 8h8a3 3 0 0 1 0 6H9' },
  stock: { name: 'สต็อกและทรัพย์สิน', c: C.c5, ink: C.ink, icon: 'M3 9l9-5 9 5v10H3z M9 19v-6h6v6' },
  acct: { name: 'บัญชี', c: C.c4, ink: C.ink, icon: 'M4 20V11 M10 20V5 M16 20v-6 M3 20h18' },
  api: { name: 'API', c: C.c6, ink: C.ink, icon: 'M8 7l-5 5 5 5 M16 7l5 5-5 5 M13 5l-2 14' },
  doc: { name: 'เอกสารไทย', c: C.green, ink: '#fff', icon: 'M6 3h9l4 4v14H6z M15 3v4h4 M9 12h7 M9 16h7' },
};
// owner 2026-10-13 (grilling rounds 1–3): six picks + six of the agent's, Thai names where the owner gave them,
// the system's English names kept for Cost Traceability / VAT Service / TH / EN
const CARDS: { t: string; g: keyof typeof G }[] = [
  { t: 'ภ.พ.36', g: 'vat' }, { t: 'สาขาภาษี', g: 'vat' }, { t: 'ภาษีไม่ถึงกำหนดชำระ', g: 'vat' }, { t: 'ใบแทนใบกำกับภาษี', g: 'vat' },
  { t: 'ภ.ง.ด.54', g: 'wht' }, { t: 'สต็อกการ์ด', g: 'stock' }, { t: 'ทะเบียนทรัพย์สิน', g: 'stock' }, { t: 'Cost Traceability', g: 'stock' },
  { t: 'งบการเงินไทย', g: 'acct' }, { t: 'VAT Service', g: 'api' }, { t: 'BOT อัตราแลกเปลี่ยน', g: 'api' }, { t: 'TH / EN', g: 'doc' },
];
// the name runs under the icon row across the whole card, so the long Thai names fit at one size
const CW = 404, CH = 156, GX = 22, GY = 24, COLS = 4;
const GRID_W = COLS * CW + (COLS - 1) * GX;
const X0 = (1920 - GRID_W) / 2, Y0 = 372; // block (heading → wall) centred on the frame: it sat ~51 px high
const slot = (i: number) => ({ x: X0 + (i % COLS) * (CW + GX), y: Y0 + Math.floor(i / COLS) * (CH + GY) });
const FC = { x: 960, y: 540 }; // the folder sits where ภ.พ.30 left it and where the outro picks it up

const BURST = localBeat('more', 153); // cards leave the folder on beat 153 (re-time: was 157, the wall holds longer)
const BACK = localBeat('more', 162.5); // and fly back in
const sp = (f: number, s: number, damping = 14, stiffness = 120) => (f < s ? 0 : spring({ frame: f - s, fps: 30, config: { damping, stiffness, mass: 1 } }));

export const More: React.FC = () => {
  const f = useAuthorFrame();
  const open = ramp(f, BURST - 10, 12, EASE.swift) * (1 - ramp(f, BACK + 22, 12, EASE.swift));
  const head = ramp(f, BURST + 8, 22, EASE.out) * (1 - ramp(f, BACK - 4, 10, EASE.out));
  return (
    <AbsoluteFill style={{ fontFamily: THAI, overflow: 'hidden', opacity: ramp(f, TAIL, 4, EASE.linear) }}>
      <Stage look={L} keyLight={{ x: 0.5, y: 0.2 }} fill={{ x: 0.1, y: 0.9 }} grain={0.035} />

      {/* heading */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 160, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: head, transform: `translateY(${((1 - head) * 30).toFixed(2)}px)`, filter: head >= 0.999 ? undefined : `blur(${((1 - head) * 10).toFixed(2)}px)` }}>
        <div style={{ display: 'flex', fontWeight: 700, fontSize: 96, lineHeight: 1.3, color: C.ink, whiteSpace: 'nowrap' }}>
          <span>มาพร้อม</span><span style={gradText}>ฟังก์ชันอีกมากมาย</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 296, height: TAG_H, display: 'flex', justifyContent: 'center' }}>
        <Tag kind="jw" f={f} at={BURST + 16} out={BACK - 4} id="jw-more" style={{ position: 'relative' }} />
      </div>

      {/* the month folder, centred */}
      <div style={{ position: 'absolute', left: FC.x - FOLDER_W / 2, top: FC.y - FOLDER_H / 2, opacity: 1 - ramp(f, BURST + 4, 10, EASE.out) + ramp(f, BACK + 8, 10, EASE.out) }}>
        <Folder open={open} />
      </div>

      {/* feature cards */}
      {CARDS.map((card, i) => {
        const g = G[card.g];
        const out = sp(f, BURST + i * 1.5);
        const back = f < BACK ? 0 : ramp(f, BACK + (CARDS.length - 1 - i) * 1.2, 14, EASE.exit);
        const p = out * (1 - back);
        if (p <= 0.001) return null;
        const s = slot(i);
        const x = mix(FC.x - CW / 2, s.x, p), y = mix(FC.y - CH / 2, s.y, p);
        return (
          <div key={i} style={{
            position: 'absolute', left: x, top: y, width: CW, height: CH, borderRadius: 22, background: '#fff', overflow: 'hidden',
            boxShadow: `inset 0 1px 0 #fff, 0 0 0 1px ${alpha(g.c, 0.25)}, ${softShadow(12, { color: '#0E2E2A', strength: 1 })}`,
            transform: `scale(${mix(0.3, 1, Math.min(1, p)).toFixed(4)})`, opacity: Math.min(1, p * 2.5),
          }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 10, background: g.c }} />
            <div style={{ position: 'absolute', left: 30, top: 24, width: 52, height: 52, borderRadius: 15, background: g.c, display: 'grid', placeItems: 'center' }}>
              <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={g.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={g.icon} /></svg>
            </div>
            <div style={{ position: 'absolute', left: 98, top: 31, right: 16, fontWeight: 600, fontSize: 28, color: C.muted, whiteSpace: 'nowrap' }}>{g.name}</div>
            <div style={{ position: 'absolute', left: 30, top: 86, right: 18, fontWeight: 700, fontSize: 38, lineHeight: 1.3, color: C.ink, whiteSpace: 'nowrap' }}>{card.t}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
