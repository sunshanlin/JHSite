# promote-site

Landing page รับพัฒนา Microsoft Dynamics 365 Business Central Localization สำหรับธุรกิจไทย (JWIC Consulting, single-page, TH/EN)

- **Live: https://www.jwicconsulting.com/** — deploy อัตโนมัติด้วย GitHub Pages เมื่อ push ขึ้น `main` (repo sunshanlin/JHSite) ห้ามลบไฟล์ `CNAME` ที่ root ไม่งั้น custom domain พัง
- ไฟล์เดียว: `index.html` — HTML + CSS inline ทั้งหมด ไม่มี build step, ไม่มี dependency (`poster.html` = โปสเตอร์ A4 สั่ง print เป็น PDF)
- รัน/แคปหน้าจอ/ทดสอบ: ใช้ skill `/run-promote-site` (อย่าใช้ `python -m http.server` — python ในเครื่องนี้เป็น Store stub)
- ติดต่อ: โทร/LINE 084-148-7480 (Jirapat Wichayapong — Sun) · อีเมล **`jirapat.wi@outlook.co.th`** — ใช้ตัวนี้ในทุกไฟล์ของ repo นี้ (หน้าเว็บ 8 จุด, JSON-LD, บทความ, PRODUCT.md) `@outlook.com` ก็ส่งถึงเหมือนกัน (LinkedIn ใช้ตัวนั้น) แต่หน้าเว็บให้คงเป็น `.co.th` ตัวเดียวทั้งไฟล์ อย่าสลับไปมา — schema กับ Google Business Profile ควรตรงกัน
- สไตล์: อ่าน DESIGN.md ก่อนแก้ — ไฟล์มี `:root` 6 บล็อก (บรรทัด 203, 816, 1597, 2150 กับบล็อกบรรทัดเดียวที่ 2970, 2984) ตัวที่ประกาศทีหลังชนะเสมอ ที่มีผลจริงคือ 1597 (สีแบรนด์ 34 ตัว ชนะทั้งหมด) · 2150 (`--ui-*` ทับ body/heading/ปุ่ม ชนะ 8 จาก 9) · 2970 กับ 2984 (`--ui-muted: #516661` `--brand-pink-soft: #EFA9BB` มาจากรอบไล่ WCAG AA ห้ามย้อน) ส่วน 203 เหลือ `--bg` กับ `--card` ที่ยังชนะอยู่ (ถูกใช้ 8 จุด) และ 816 ตายสนิท ไม่ชนะสักตัว · เลขบรรทัดเลื่อนทุกครั้งที่แก้ไฟล์ ให้ค้น `:root` เอาแทนการเชื่อเลข
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
| งาน presales (เด็ค PowerPoint + สคริปต์ประกอบ) | `_presales/` — ไม่ขึ้นเว็บ อ่าน `_presales/README.md` |
| ของชั่วคราวจากแคปหน้าจอ/ทดสอบ | `output/`, `.playwright-cli/` — gitignore แล้ว ลบทิ้งได้เสมอ |

## เครดิตรูปถ่าย

รูปถ่ายคนใน `#features` และ `#contact` มาจาก [Pexels](https://www.pexels.com/license/) และ [Unsplash](https://unsplash.com/license) — ทั้งคู่ใช้ฟรีเชิงพาณิชย์ ไม่ต้องให้เครดิต แต่ไล่ที่มาไว้กันลืม

หมายเหตุ: รูป Unsplash ที่เป็น Unsplash+ (Getty) จะโหลดไม่ได้ (403) — ถือเป็นตัวกรองลิขสิทธิ์ในตัว:

| ไฟล์ | ที่มา |
|---|---|
| `feat-vat.webp` | Pexels 259139 |
| `feat-wht.webp` | Pexels 8111853 |
| `feat-stock.webp` | Pexels 4483941 |
| `feat-docs.webp` | Unsplash `7b_9cHdKgFg` |
| `feat-messenger.webp` | ผู้ใช้จัดหามาเอง (ยืนยันมีสิทธิ์ใช้แล้ว) |
| `why-person.webp` | ผู้ใช้จัดหามาเอง (ยืนยันมีสิทธิ์ใช้แล้ว) |
| `feat-api.webp` | Pexels 36706460 |
| `consult-meeting.webp` | Pexels 7643897 |
| `pricing-consultation.webp` | (ของเดิมในโปรเจกต์) |

ทุกไฟล์ผ่าน `ffmpeg -vf "eq=brightness=..:saturation=1.18.."` ให้สว่าง/สดขึ้นก่อนแปลงเป็น WebP

`img/credentials/dbd-registered.png` = สำเนาป้าย DBD ไว้ใช้ในสไลด์เท่านั้น — **หน้าเว็บต้อง hotlink จาก `dbdregistered.dbd.go.th` ต่อไป** ป้ายที่ DBD ออกให้ต้องเสิร์ฟจากเขาถึงจะกดไปหน้าตรวจสอบได้

## _presales/ — งาน presales ที่รวมมาจาก repo JHPresales (4 ก.ย. 2026)

โฟลเดอร์ขึ้นต้นด้วย `_` **เพราะ Jekyll ของ GitHub Pages ไม่เสิร์ฟโฟลเดอร์แบบนี้** — สคริปต์/JSON เนื้อหาสไลด์จึงไม่กลายเป็น URL สาธารณะ
⚠ **ห้ามเพิ่มไฟล์ `.nojekyll` ที่ root** มันปิด Jekyll ทั้งตัว แล้ว `_presales/` ทั้งโฟลเดอร์จะโหลดได้จาก jwicconsulting.com ทันที
`decks/` (ตัว .pptx 292MB) กับไฟล์เสียง gitignore ไว้ที่ `_presales/.gitignore` เหมือนเดิม · path ต้นแบบอยู่ที่ `_presales/build/deck-core.json` คีย์ `master`/`out`
