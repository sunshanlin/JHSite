# สำรอง: Highlight Feature 3 · `#web-quote` (ขอใบเสนอราคาผ่าน LIFF)

ถอดออกจากหน้าเว็บ 1 ต.ค. 2026 เพื่อให้ช่อง Highlight Feature 3 เป็น Cost Traceability (`#cost-trace`)
ตอนถอด section นี้ทำงานครบแล้ว ไม่ใช่ร่าง · หน้าเต็มตอนที่ยังมี section นี้อยู่คือคอมมิต `3eb9201`

## ในโฟลเดอร์นี้ (ยกจาก `index.html` @ `3eb9201` ตามตัวอักษร)

| ไฟล์ | มีอะไร |
|---|---|
| `section.html` | `<section id="web-quote">` ทั้งก้อน รวม symbol ไอคอน `wqi-*` |
| `style.css` | กฎ Horizon Glow ของ section + CSS `.wq-*` ทั้งบล็อก — หัวไฟล์บอกว่าแต่ละส่วนไปไว้ตรงไหน |
| `script.js` | IIFE ของเดโม (`window.renderWebQuote`) + บรรทัดเดี่ยว 5 จุดที่ต้องคืนตามที่: hook ใน `applyLang`, `I18N_ATTR` 3 แถว, รายการ `demo_use`, รายการซ่อนใน `@media print` |

ภาพยังอยู่ใน `img/` ไม่ได้ลบ: `bc-liff-form.webp`, `bc-liff-quote.webp`, `tech/business-central.svg`

## ของที่ยังอยู่ในหน้า เพราะ #billing-flow ใช้ร่วม

- CSS `.wq-doc*` `.wq-sum*` `.wq-baht` `@keyframes wqDoc` — คงไว้ที่เดิมตามตัวอักษร (บล็อกเล็กตรงตำแหน่ง CSS ของ `#web-quote` เดิม)
- `bahtText()` — อยู่ที่เดิมในสคริปต์

`page-checks.mjs` กับ DESIGN.md ไม่ได้แตะตอนถอด ยังมีชื่อ `#web-quote` อยู่ตามเดิม

## กู้คืน

1. วาง `section.html` ในช่องที่ต้องการ แล้วแก้ kicker (`Highlight Feature N`) ทั้งใน HTML และ `T.kicker` ใน `script.js`
2. CSS ตามหัวไฟล์ `style.css` — ส่วนที่ 2 วางทับบล็อก `.wq-doc` ที่คงไว้ ไม่ใช่วางซ้ำ
3. JS ตามหัวไฟล์ `script.js`
