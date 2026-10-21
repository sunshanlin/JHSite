// No-voice timing (owner 2026-10-21 "เอาแบบไม่พากย์") → loc/beats.json, in loc/vo-durations.json's shape, so `node loc/gen-vo.mjs
// --beats` turns it into src/loc/vo.ts and timeline.ts and every cue() work as before. A line stays on screen as long as its text
// takes to read — its caption (src/loc/subs.json) plus what the scene itself shows meanwhile (SCREEN: headline, chips, slide tags) —
// or as long as its pictures take to land (PER_CUE a cue), whichever is longer. Its cues spread by syllable over CUE_SPAN of that
// time (one speech run from 10 % to 70 %), so the last chip still has a third of the line to be read. timeline.ts then puts every
// cut on a half-bar of the BGM.
import fs from 'node:fs';

const READ0 = 0.9, CPS = 11; // seconds to find the text, then Thai base characters a second (vowel and tone marks not counted)
const PICTURE0 = 1.2, PER_CUE = 0.55, MIN = 1.8, CUE_SPAN = [0.1, 0.7];
const SCREEN = {
  1: 'ทำไมต้องมี Localization',
  4: 'Localization คือ การปรับระบบ ตามกฎของประเทศ',
  6: 'Business Central Invoice', // the pills on the BC page and the invoice card
  8: 'สามหมวด',
  10: 'ภาษีซื้อ · ภาษีขาย แยกสาขา ใบกำกับภาษี ใบลดหนี้ · ใบเพิ่มหนี้ หัก ณ ที่จ่าย รายงานเคลื่อนไหวสินค้า ทะเบียนทรัพย์สิน',
  12: 'ใบวางบิล รอบวางบิล ที่อยู่แบบไทย เอกสารไทย / อังกฤษ งบการเงินไทย',
  13: 'รายงานวิเคราะห์ยอดขาย BOT อัตราแลกเปลี่ยน',
  14: 'รายงานภาษีขาย · แยกสาขา ภ.พ.30 พร้อมยื่น',
  15: 'จ่ายผู้ขาย · หัก ณ ที่จ่าย หนังสือรับรอง 50 ทวิ · ไฟล์ ภ.ง.ด.',
  16: 'Billing Board · รอบวางบิลของลูกค้า',
  17: 'JWIC Thai Localization',
};

const here = (p) => new URL(p, import.meta.url);
const lines = fs.readFileSync(here('./vo-botnoi.txt'), 'utf8').split('\n').filter((l) => l.trim()).map((l) => l.replace(/\r$/, '').split('\t'));
const subs = JSON.parse(fs.readFileSync(here('../src/loc/subs.json'), 'utf8'));
const cues = JSON.parse(fs.readFileSync(here('./vo-cues.json'), 'utf8')).cues;
const base = (s) => [...s.replace(/[\s\n·—…]/g, '')].filter((ch) => !/[ัิ-ฺ็-๎]/.test(ch)).length;
const cuesOf = (no) => Object.values(cues).flat().filter(([n]) => n === no).length;

const out = lines.map(([no, text]) => {
  const n = Number(no), shown = `${subs[n] ?? ''} ${SCREEN[n] ?? ''}`.trim();
  const read = shown ? READ0 + base(shown) / CPS : 0;
  const picture = PICTURE0 + PER_CUE * cuesOf(n);
  const sec = Math.round(Math.max(read, picture, MIN) * 100) / 100;
  console.log(`${no}  ${sec.toFixed(2)}s  read ${read.toFixed(2)}  picture ${picture.toFixed(2)}  ${shown.replace(/\n/g, ' ')}`);
  const segs = [CUE_SPAN.map((k) => Math.round(k * sec * 100) / 100)];
  return { no, sec, speechStart: 0, speechEnd: sec, segs, text };
});
fs.writeFileSync(here('./beats.json'), JSON.stringify(out, null, 1) + '\n');
console.log('TOTAL', out.reduce((a, l) => a + l.sec, 0).toFixed(1), 's of lines -> loc/beats.json');
