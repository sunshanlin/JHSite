# promote-site

Landing page รับพัฒนา Microsoft Dynamics 365 Business Central Localization สำหรับธุรกิจไทย (JWIC Consulting, single-page, TH/EN)

- **Live: https://www.jwicconsulting.com/** — deploy อัตโนมัติด้วย GitHub Pages เมื่อ push ขึ้น `main` (repo sunshanlin/JHSite) ห้ามลบไฟล์ `CNAME` ที่ root ไม่งั้น custom domain พัง
- ไฟล์เดียว: `index.html` — HTML + CSS inline ทั้งหมด ไม่มี build step, ไม่มี dependency (`poster.html` = โปสเตอร์ A4 สั่ง print เป็น PDF)
- รัน/แคปหน้าจอ/ทดสอบ: ใช้ skill `/run-promote-site` (อย่าใช้ `python -m http.server` — python ในเครื่องนี้เป็น Store stub)
- ติดต่อ: jirapat.wi@outlook.com, โทร/LINE 084-148-7480 (Jirapat Wichayapong — Sun)
- สไตล์: แก้ CSS variables ใน `:root` ก่อนถ้าจะเปลี่ยนโทนสี
- Bilingual: dictionary `I18N` (selector → EN/TH) อยู่ท้าย `<script>` ใน index.html — เพิ่ม/ย้าย/แก้ข้อความบนหน้าแล้วต้องอัปเดตคู่แปลด้วย โดยเฉพาะ selector แบบ nth-child; `#articles` ไม่แปลโดยตั้งใจ
