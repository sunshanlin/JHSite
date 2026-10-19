# promote-site

Landing page รับพัฒนา Microsoft Dynamics 365 Business Central Localization สำหรับธุรกิจไทย (JWIC Consulting, single-page, TH/EN)

- **Live: https://www.jwicconsulting.com/** — deploy อัตโนมัติด้วย GitHub Pages เมื่อ push ขึ้น `main` (repo sunshanlin/JHSite) ห้ามลบไฟล์ `CNAME` ที่ root ไม่งั้น custom domain พัง
- ไฟล์เดียว: `index.html` — HTML + CSS inline ทั้งหมด ไม่มี build step, ไม่มี dependency (`poster.html` = โปสเตอร์ A4 สั่ง print เป็น PDF)
- รัน/แคปหน้าจอ/ทดสอบ: ใช้ skill `/run-promote-site` (อย่าใช้ `python -m http.server` — python ในเครื่องนี้เป็น Store stub)
- ติดต่อ: โทร/LINE 084-148-7480 (Jirapat Wichayapong — Sun) · อีเมล **`jirapat.wi@outlook.co.th`** — ใช้ตัวนี้ในทุกไฟล์ของ repo นี้ (หน้าเว็บ 8 จุด, JSON-LD, บทความ, PRODUCT.md) `@outlook.com` ก็ส่งถึงเหมือนกัน (LinkedIn ใช้ตัวนั้น) แต่หน้าเว็บให้คงเป็น `.co.th` ตัวเดียวทั้งไฟล์ อย่าสลับไปมา — schema กับ Google Business Profile ควรตรงกัน
- สไตล์: อ่าน DESIGN.md ก่อนแก้ — design token ทั้งหมดอยู่ใน `:root` **บล็อกเดียว**ต้น `<style>` (รวมจาก 6 บล็อกเมื่อ 23 ก.ย. 2026 ค่าเท่าเดิมทุกตัว) token ใหม่เพิ่มในบล็อกนั้น ห้ามเปิด `:root` บล็อกใหม่ · `--ui-muted: #516661` กับ `--brand-pink-soft: #EFA9BB` มาจากรอบไล่ WCAG AA ห้ามย้อน · ชื่อรุ่นเก่า (`--navy` `--accent` `--muted` ฯลฯ) ยังถูกเรียกจาก rule ต้นไฟล์ ชี้เข้าแบรนด์แล้ว
- Bilingual: dictionary `I18N` (selector → EN/TH) อยู่ท้าย `<script>` ใน index.html — เพิ่ม/ย้าย/แก้ข้อความบนหน้าแล้วต้องอัปเดตคู่แปลด้วย โดยเฉพาะ selector แบบ nth-child; `#articles` ไม่แปลโดยตั้งใจ · `aria-label` / `alt` / `title` ภาษาไทยต้องมีคู่ใน `I18N_ATTR` (ใช้ `querySelector` ตัวแรกตัวเดียว selector ต้องไม่ซ้ำ) ยกเว้นปุ่มที่ป้ายเปลี่ยนตามสถานะ ให้สลับภาษาในสคริปต์ของมันเอง — CI ตรวจให้

## โครงไฟล์ — ไฟล์ใหม่เข้าโฟลเดอร์ไหน

ทุกไฟล์ที่ commit จะถูกเสิร์ฟเป็น URL จริงบน jwicconsulting.com — **ห้ามย้าย/เปลี่ยนชื่อไฟล์ที่มีอยู่** ไม่งั้นลิงก์ที่แชร์ไปแล้วพัง

| ไฟล์แบบไหน | ไปไหน |
|---|---|
| บทความหน้าใหม่ | `articles/` |
| รูปที่ขึ้นหน้าเว็บ | `img/` (โลโก้/แบรนด์ → `img/brand/`, badge-ใบเซอร์ → `img/credentials/`) |
| รูปแม่ไม่มีลายน้ำ | `img/originals/` — gitignore แล้ว ห้าม commit ขึ้นโฮสต์ |
| PDF ใบเซอร์ตัวจริง | `credentials/` |
| CSS ที่ใช้ร่วมหลายหน้า | `css/` |
| ฟอนต์ (woff2 self-host + `OFL.txt`) | `css/fonts/` — ชุดเดียวกับที่ Google Fonts เสิร์ฟ ประกาศ `@font-face` ต้น `<style>` ของ index.html และต้น `css/article.css` |
| JS ที่ใช้ร่วมหลายหน้า (ตอนนี้มีแค่ `js/article.js` = แถบคุกกี้ + GA ของบทความ) | `js/` |
| ภาพแชร์ og:image ของบทความ 1200×630 | `img/og/` — สร้างด้วย `node .claude/skills/run-promote-site/og.mjs` |
| ภาพแชร์ og:image ของหน้าแรก 1200×630 | `img/og/home.png` — เรนเดอร์จาก `.claude/skills/run-promote-site/og-home.html` (คำสั่งอยู่หัวไฟล์) og.mjs ไม่แตะไฟล์นี้ · `img/jh-poster.png` เลิกเป็นภาพแชร์แล้ว แต่ห้ามลบ (ลิงก์เก่ายังชี้อยู่) |
| หน้าเว็บ + ไฟล์ระบบ Pages (`index.html` `404.html` `CNAME` `robots.txt` `sitemap.xml` `llms.txt` `favicon.ico` `style.css` และหน้า print: `poster.html` `banner.html` `flyer-overview.html` `flyer-implementation.html`) | root — เท่าที่มีอยู่ ห้ามเพิ่มไฟล์ root ใหม่ถ้าไม่ใช่หน้าเว็บจริง |
| งาน presales (เด็ค PowerPoint + สคริปต์ประกอบ) | **ไม่อยู่ใน repo นี้แล้ว** — ย้ายไป `D:\BC\Project\JHCore\docs\Presentation` (9 ต.ค. 2026) |
| แผนงาน/บันทึกประเมินหน้าเว็บ (ไม่ขึ้นเว็บ) | `_plans/` — ขึ้นต้นด้วย `_` เพราะ Jekyll ไม่เสิร์ฟ (ดูหัวข้อ `.nojekyll` ข้างล่าง) ล่าสุด `_plans/2026-09-improvement-plan.md` |
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

`img/credentials/dbd-registered.png` = สำเนาป้าย DBD ใช้ในสไลด์ และเป็น**ตัวสำรองตอนเซิร์ฟเวอร์ DBD ล่ม** (`onerror` บน `<img>` ของ `.dbd`) — **หน้าเว็บต้อง hotlink จาก `dbdregistered.dbd.go.th` เป็นตัวหลักต่อไป** ห้ามสลับให้สำเนาเป็นตัวหลัก ลิงก์ของป้ายต้องชี้หน้าตรวจสอบของ DBD เสมอ

## โฟลเดอร์ขึ้นต้นด้วย `_` — ไม่ขึ้นเว็บ

**Jekyll ของ GitHub Pages ไม่เสิร์ฟโฟลเดอร์ที่ขึ้นต้นด้วย `_`** — ของใน `_plans/` จึงไม่กลายเป็น URL สาธารณะ
⚠ **ห้ามเพิ่มไฟล์ `.nojekyll` ที่ root** มันปิด Jekyll ทั้งตัว แล้วโฟลเดอร์ `_` ทั้งหมดจะโหลดได้จาก jwicconsulting.com ทันที
งาน presales (`_presales/` เดิม) ย้ายไป `D:\BC\Project\JHCore\docs\Presentation` แล้ว (9 ต.ค. 2026) — สคริปต์ที่นั่นยังอ่านรูปจาก `img/` ของ repo นี้ (`imgRoot` ใน `build/deck-core.json`) ย้ายหรือเปลี่ยนชื่อรูปใน `img/` ต้องตามไปแก้ด้วย

## worker/ — ตัวกลางเรียก VAT Service ของกรมสรรพากร (Cloudflare Worker `jwic-vat`)

- `#vat-service` บนเว็บจริงเรียก `https://api.jwicconsulting.com/vat` (custom domain ของ worker ใน `worker/wrangler.toml`) แบบข้ามโดเมน พึ่ง CORS ใน `vat-proxy.js` · รันในเครื่อง (localhost) เรียก `https://jwic-vat.jwic.workers.dev` แทน (หรือ `?vat=<url>`) · CSP `connect-src` ต้องมีทั้งสองโฮสต์
- ⚠ **record `www` และ apex ใน Cloudflare ต้องเป็นเมฆเทา (DNS only) เสมอ** — GitHub Pages ต่อ cert Let's Encrypt ได้ก็ต่อเมื่อ DNS ชี้ตรงมาที่มัน · เดิมผูก route `www.jwicconsulting.com/api/vat*` ซึ่งต้องเปิดเมฆส้มให้ www ผลคือ cert ต่ออายุไม่ได้ (สถานะ `bad_authz`) หมดอายุ 18 ต.ค. 2026 แล้ว Cloudflare Full (strict) ตอบ 526 ทั้งเว็บ จึงย้ายมาใช้ subdomain `api` แทน
- เช็กสถานะ cert ฝั่ง GitHub: `gh api repos/sunshanlin/JHSite/pages --jq .https_certificate` · เช็ก worker: `curl -s "https://api.jwicconsulting.com/vat?tin=0105558000123"` ได้ JSON ขึ้นต้น `{"ok"` = ทำงาน
- จำกัด 20 ครั้ง/นาที/IP (`[[unsafe.bindings]]` ชื่อ RL) · บัญชีกรมสรรพากรใส่ผ่าน `npx wrangler secret put RD_USER` ห้ามเขียนลงโค้ด — ทุกไฟล์ใน `worker/` เป็น URL สาธารณะ

## CI

- `links.yml` — ลิงก์/รูปภายในไม่ 404 (lychee offline) · เพิ่มลิงก์ `/#section` ใหม่ในบทความต้องเติมชื่อ section ใน `--exclude`
- `page-checks.yml` — html-validate (กฎใน `.github/htmlvalidate.json`) + เปิดหน้าใน Chrome จริงด้วย `.github/scripts/page-checks.mjs`: console/CSP error, หน้าเลื่อนข้าง, แถบเมนูตกสองแถว, I18N selector ตาย, ข้อความไทยหรือ aria-label/alt ไทยค้างในโหมด EN, ข้อความ #pricing ล้นหรือต้องพึ่ง `.wrap-rescue`, ปุ่มเล็กกว่า 24px, ความยาวหน้ามือถือ, CTA/บทความอื่นในทุกบทความ, จำนวนหน้าตอนพิมพ์ — รันในเครื่อง: `npm i --no-save --prefix .github/scripts playwright-core && node .github/scripts/page-checks.mjs`
