# JWIC Consulting — สรุปโปรเจกต์ทั้งหมด

> ไฟล์นี้สร้างไว้อัปโหลดให้ Claude (claude.ai Project knowledge) เพื่อให้รู้จักงานทุกตัว
> อัปเดตล่าสุด: 2 ส.ค. 2026 — ถ้าโครงงานเปลี่ยน ให้สั่ง Claude Code regenerate ไฟล์นี้

## ธุรกิจ

JWIC Consulting — รับพัฒนา/วางระบบ **Microsoft Dynamics 365 Business Central (BC) Localization สำหรับธุรกิจไทย**
เจ้าของ: Jirapat Wichayapong (Sun) · jirapat.wi@outlook.com · โทร/LINE 084-148-7480
เว็บ: https://www.jwicconsulting.com/

กลุ่มลูกค้าเป้าหมาย (ICP): SMB ไทย สายเทรดเดอร์ (ซื้อมาขายไป/นำเข้า) เช่น เครื่องมือแพทย์ แล็บ เครื่องจักร — เน้น กทม.-ปริมณฑล ไม่เอามหาชน/ผู้ผลิต/บริษัทใหญ่/รพ./บริษัท IT

## โปรเจกต์ 4 ตัว

### 1. JHPresales (`d:\JHPresales`) — เด็ค PowerPoint presales
- ประกอบเด็คจาก Microsoft pitch deck ด้วยสคริปต์ PowerShell (COM) — ไม่แก้ .pptx มือ แก้ที่ `build\deck-core.json` แล้ว rerun
- ผลลัพธ์ `decks\JWIC-BC-Core.pptx`: 76 หน้า ฉายจริง 22 หน้า ที่เหลือซ่อนไว้ตอบ Q&A
- ราคาดึงจาก Excel (`JWIC-Proposal_3.xlsx` sheet Pricing) ตอน build — เสนอราคาลูกค้าใหม่ = แก้ Excel + rerun
- `verify.ps1` กันเนื้อหา Microsoft internal (DO NOT PRESENT ฯลฯ) หลุดไปหาลูกค้า

### 2. promote-site (`d:\Web\promote-site`) — เว็บ landing page
- Single-page TH/EN, ไฟล์เดียว `index.html` ไม่มี build step — deploy GitHub Pages อัตโนมัติ (repo sunshanlin/JHSite)
- Live: https://www.jwicconsulting.com/ (มี `poster.html` = โปสเตอร์ A4 print เป็น PDF)
- Bilingual ผ่าน dictionary `I18N` ท้ายไฟล์ — แก้ข้อความต้องอัปเดตคู่แปลด้วย

### 3. JHLinkedin (`d:\JHLinkedin`) — agent โพสต์ LinkedIn
- Claude gen draft จากบทความใน `sources/` + กติกาแบรนด์ `voice.md` → user approve ใน `queue/` → GitHub Actions ยิงโพสต์ผ่าน LinkedIn API อังคาร/พฤหัส 08:30 → เก็บเข้า `posted/` พร้อม metric
- ธีมเนื้อหา: บัญชี/ERP สำหรับ SMB ไทย เช่น การย้ายจากโปรแกรมบัญชีไป ERP

### 4. JHMail (`d:\JHMail`) — ระบบ cold mail หา lead
- คิว lead ใน `leads*.csv` (สถานะ pending → approved → drafted → sent → follow-up) + ฐานกันหาซ้ำ `contacted.txt`/`rejected.csv`
- ส่งผ่าน Outlook (ms-365-mcp-server, token อยู่บนเครื่อง PC เท่านั้น) จ–ศ เช้า: pull → สร้าง draft → ส่ง → follow-up
- Template ต่อ vertical: เครื่องมือแพทย์ แล็บ เครื่องจักร สำนักงานบัญชี ฯลฯ · เกณฑ์ PDPA: ใช้เฉพาะอีเมลที่บริษัทประกาศเองสาธารณะ

## ภาพรวม funnel

JHMail (cold mail) + JHLinkedin (content) → promote-site (landing) → JHPresales (เด็ค present/demo) → ปิดดีล BC implementation
