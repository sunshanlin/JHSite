// Subtitles: every VO line on screen while it is spoken (feeds autoplay muted; Q11 >= 5 % of the frame height).
// Latin product names stay Latin, Thai tax terms as on the RD forms (jhthai) — the text is loc/script.md's "ซับบนจอ" column.
import React from 'react';
import { EASE, ramp } from '../fx/Polish';
import { useAuthorFrame } from '../rate';
import { C, THAI } from '../theme';

export const SUBS: Record<number, string> = {
  1: 'Localization คือชุดฟังก์ชันที่ทำให้ระบบทำงานตามข้อกำหนดของประเทศที่ใช้งาน',
  2: 'เป็นเรื่องของการทำงานตามกฎของประเทศนั้น มากกว่าเรื่องภาษาที่แสดงบนหน้าจอ',
  3: 'ตัวอย่างใกล้ตัวที่สุด คือใบกำกับภาษี',
  4: 'Business Central สร้างใบแจ้งหนี้ให้ แล้ว Localization เติมรายการที่กรมสรรพากรกำหนดให้ครบ ทั้งเลขประจำตัวผู้เสียภาษี สาขา และลำดับเลขที่ที่ตรวจสอบย้อนหลังได้',
  5: 'Microsoft แบ่ง Localization เป็น 3 หมวด ตามที่มาของข้อบังคับ',
  6: 'หมวดแรก Regulatory คือข้อกำหนดตามกฎหมาย',
  7: 'เช่น ภาษีมูลค่าเพิ่มและสาขาภาษี รายงานภาษีซื้อและภาษีขาย ใบกำกับภาษี รวมถึงภาษีหัก ณ ที่จ่าย',
  8: 'หมวดที่สอง National standards คือมาตรฐานที่ทั้งประเทศใช้ร่วมกัน',
  9: 'ใบวางบิลคือตัวอย่างที่ชัดที่สุด เป็นวิธีปฏิบัติทางการค้าที่คู่ค้าจำนวนมากใช้ร่วมกัน และรับชำระตามรอบวางบิล',
  10: 'หมวดที่สาม Market คือฟังก์ชันที่ช่วยให้ทำงานสะดวกขึ้น เช่น ทะเบียนทรัพย์สิน',
  11: 'รายงานภาษีซื้อและภาษีขายแยกตามสาขา แล้วรวมเป็น ภ.พ.30 พร้อมยื่น',
  12: 'จ่ายเงินผู้ขายแล้ว ระบบออกหนังสือรับรอง 50 ทวิ และเตรียมไฟล์ ภ.ง.ด. สำหรับ RD Prep จากรายการจ่ายจริง',
  13: 'ส่วนใบวางบิล วางตามรอบของลูกค้าแต่ละราย จาก Billing Board ในหน้าจอเดียว',
  14: 'JWIC Thai Localization คือ app ที่ทำหน้าที่นี้บน Business Central สำหรับธุรกิจไทย',
  15: 'และดูแลต่อเนื่องเมื่อข้อกำหนดเปลี่ยน',
};

// A line longer than two rows at 54 px (≈ 110 Thai characters) is shown as sequential segments, split evenly over the
// spoken length (review 2026-10-18: a three-row box reached y 787 and covered the S3 tags).
export const SEGMENTS: Record<number, string[]> = {
  4: ['Business Central สร้างใบแจ้งหนี้ให้ แล้ว Localization เติมรายการที่กรมสรรพากรกำหนดให้ครบ', 'ทั้งเลขประจำตัวผู้เสียภาษี สาขา และลำดับเลขที่ที่ตรวจสอบย้อนหลังได้'],
};

// Mounted in a Sequence that starts at the line's VO_AT and lasts speechFrames + SUB_OUT.
export const SUB_OUT = 10;
export const Subtitle: React.FC<{ no: number; dur: number }> = ({ no, dur }) => {
  const f = useAuthorFrame();
  const segs = SEGMENTS[no] ?? [SUBS[no]];
  const segLen = (dur - SUB_OUT) / segs.length;
  const k = Math.min(segs.length - 1, Math.floor(f / segLen));
  const segStart = k * segLen;
  const segEnd = k === segs.length - 1 ? dur : (k + 1) * segLen;
  const i = ramp(f, segStart, 8, EASE.out);
  const o = 1 - ramp(f, segEnd - 8, 8, EASE.out);
  return (
    <div
      style={{
        position: 'absolute', left: 0, right: 0, bottom: 54, display: 'flex', justifyContent: 'center', pointerEvents: 'none',
        opacity: i * o, transform: `translateY(${(1 - i) * 10}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 1700, padding: '14px 34px', borderRadius: 22, background: 'rgba(255,255,255,0.8)',
          border: '1.5px solid rgba(255,255,255,0.95)', backdropFilter: 'blur(18px)', boxShadow: '0 12px 36px rgba(14,46,42,0.12)',
          fontFamily: THAI, fontWeight: 600, fontSize: 54, lineHeight: 1.3, color: C.green, textAlign: 'center',
        }}
      >
        {segs[k]}
      </div>
    </div>
  );
};
