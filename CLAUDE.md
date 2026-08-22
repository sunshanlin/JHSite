# promote-site

Landing page รับพัฒนา Microsoft Dynamics 365 Business Central Localization สำหรับธุรกิจไทย (JWIC Consulting, single-page, TH/EN)

- **Live: https://www.jwicconsulting.com/** — deploy อัตโนมัติด้วย GitHub Pages เมื่อ push ขึ้น `main` (repo sunshanlin/JHSite) ห้ามลบไฟล์ `CNAME` ที่ root ไม่งั้น custom domain พัง
- ไฟล์เดียว: `index.html` — HTML + CSS inline ทั้งหมด ไม่มี build step, ไม่มี dependency (`poster.html` = โปสเตอร์ A4 สั่ง print เป็น PDF)
- รัน/แคปหน้าจอ/ทดสอบ: ใช้ skill `/run-promote-site` (อย่าใช้ `python -m http.server` — python ในเครื่องนี้เป็น Store stub)
- ติดต่อ: jirapat.wi@outlook.com, โทร/LINE 084-148-7480 (Jirapat Wichayapong — Sun)
- สไตล์: แก้ CSS variables ใน `:root` ก่อนถ้าจะเปลี่ยนโทนสี
- Bilingual: dictionary `I18N` (selector → EN/TH) อยู่ท้าย `<script>` ใน index.html — เพิ่ม/ย้าย/แก้ข้อความบนหน้าแล้วต้องอัปเดตคู่แปลด้วย โดยเฉพาะ selector แบบ nth-child; `#articles` ไม่แปลโดยตั้งใจ

## โครงไฟล์ — ไฟล์ใหม่เข้าโฟลเดอร์ไหน

ทุกไฟล์ที่ commit จะถูกเสิร์ฟเป็น URL จริงบน jwicconsulting.com — **ห้ามย้าย/เปลี่ยนชื่อไฟล์ที่มีอยู่** ไม่งั้นลิงก์ที่แชร์ไปแล้วพัง

| ไฟล์แบบไหน | ไปไหน |
|---|---|
| บทความหน้าใหม่ | `articles/` |
| รูปที่ขึ้นหน้าเว็บ | `img/` (โลโก้/แบรนด์ → `img/brand/`, badge-ใบเซอร์ → `img/credentials/`) |
| รูปแม่ไม่มีลายน้ำ | `img/originals/` — gitignore แล้ว ห้าม commit ขึ้นโฮสต์ |
| PDF ใบเซอร์ตัวจริง | `credentials/` |
| CSS ที่ใช้ร่วมหลายหน้า | `css/` |
| หน้าเว็บ + ไฟล์ระบบ Pages (`index.html` `404.html` `CNAME` `robots.txt` `sitemap.xml` `llms.txt` `favicon.ico` `style.css` และหน้า print: `poster.html` `banner.html`) | root — เท่าที่มีอยู่ ห้ามเพิ่มไฟล์ root ใหม่ถ้าไม่ใช่หน้าเว็บจริง |
| ของชั่วคราวจากแคปหน้าจอ/ทดสอบ | `output/`, `.playwright-cli/` — gitignore แล้ว ลบทิ้งได้เสมอ |

## เครดิตรูปถ่าย

รูปถ่ายคนใน `#features` และ `#contact` มาจาก [Pexels](https://www.pexels.com/license/) — ใช้ฟรีเชิงพาณิชย์ ไม่ต้องให้เครดิต แต่ไล่ที่มาไว้กันลืม:

| ไฟล์ | Pexels ID |
|---|---|
| `feat-vat.webp` | 259139 |
| `feat-wht.webp` | 7054505 |
| `feat-stock.webp` | 4483941 |
| `feat-docs.webp` | 8470836 |
| `feat-api.webp` | 12899189 |
| `consult-meeting.webp` | 7643897 |
| `pricing-consultation.webp` | (ของเดิมในโปรเจกต์) |

ทุกไฟล์ผ่าน `ffmpeg -vf "eq=brightness=..:saturation=1.18.."` ให้สว่าง/สดขึ้นก่อนแปลงเป็น WebP
