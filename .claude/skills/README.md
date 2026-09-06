# สกิลที่ลงไว้ในโปรเจกต์นี้

สกิลงาน presales / งานขาย ที่ก๊อปมาจาก repo สาธารณะ (MIT ทั้งหมด) ลงวันที่ 6 ก.ย. 2026
โฟลเดอร์นี้ **ไม่ขึ้นเว็บ** — Jekyll ของ GitHub Pages ไม่เสิร์ฟโฟลเดอร์ที่ขึ้นต้นด้วย `.`
(อย่าเพิ่ม `.nojekyll` ที่ root เด็ดขาด — เหตุผลเดียวกับ `_presales/` ดู CLAUDE.md)

| สกิล | ใช้ตอนไหน | ที่มา | License |
|---|---|---|---|
| `sales-enablement` | เด็ค presales, one-pager, demo script, objection doc, proposal, ROI calculator | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) v2.0.1 | MIT © Corey Haines |
| `cold-email` | เมลแนะนำตัวหาลูกค้าใหม่ + ซีเควนซ์ตาม | เดียวกัน v2.0.0 | MIT © Corey Haines |
| `emails` | ซีเควนซ์เมลแบบ nurture / lifecycle (คนที่คุยอยู่แล้ว) | เดียวกัน | MIT © Corey Haines |
| `negotiation` | เจรจาต่อรอง — tactical empathy, calibrated question, Ackerman (Chris Voss) | [wondelai/skills](https://github.com/wondelai/skills) v1.2.0 | MIT © Wondel.ai |
| `pricing-negotiation` | ตั้งรับคำขอส่วนลด, ปกป้องราคา, ต่อรองกับ procurement | [louisblythe/Sales-Skills](https://github.com/louisblythe/Sales-Skills) | MIT (ประกาศใน README ไม่มีไฟล์ LICENSE) |
| `run-promote-site` | ของเดิมในโปรเจกต์ — รัน/แคปหน้าเว็บ | — | — |

### เคยลงแล้วตัดออก (6 ก.ย. 2026)

ลงไปรอบแรก 8 ตัว แล้วตัดเหลือ 5 — เก็บไว้เตือนความจำว่าทำไมไม่ต้องลงซ้ำ

| ตัดออก | เหตุผล |
|---|---|
| `pitch-deck-mastery` | เป็นเด็ค**ระดมทุนจากนักลงทุน** (TAM/SAM/SOM, use of funds, the Ask) JWIC ไม่ได้ระดมทุน · เด็คขายลูกค้าใช้ `sales-enablement` ที่มีโครง 10-12 สไลด์อยู่แล้ว |
| `written-communication` | เนื้อในเป็น cold email template + follow-up + proposal = ซ้ำกับ `cold-email` (ลึกกว่า มี reference 5 ไฟล์) และหัวข้อ Proposal Templates ใน `sales-enablement` · ทับ trigger กันด้วย |
| `presentation-skills` | ส่วนใหญ่เป็นทักษะ**คนพูด** (น้ำเสียง ภาษากาย ซ้อมเดโม) ที่ agent ทำแทนไม่ได้ · ส่วน Slide Design ซ้ำกับ `sales-enablement` |

## หมายเหตุ

- **ตัวสร้างไฟล์จริง** ยังเป็นสกิล `pptx` ตัวเดิม — สกิลพวกนี้คุมแค่ *เนื้อหา/โครงสไลด์* ไม่ได้เขียน .pptx เอง
- สกิลจาก marketingskills จะมองหา `.agents/product-marketing.md` (เอกสาร positioning/ลูกค้า/จุดขาย) ก่อนทำงาน — ยังไม่มีในโปรเจกต์นี้ ถ้าไม่สร้าง มันจะถามคำถามเดิมซ้ำทุกครั้ง
- **compliance ในสกิลพวกนี้เป็น US/EU/แคนาดา ไม่มี PDPA ไทย** — กติกาหา lead / เก็บอีเมล ให้ยึด `JHMail/CLAUDE.md` เป็นหลักเสมอ
- benchmark และเครื่องมือที่มันแนะนำ (Apollo, ZoomInfo, Clay ฯลฯ) อิงตลาด B2B SaaS อเมริกา ใช้กับ SMB ไทยตรง ๆ ไม่ได้
- ปรับแก้ไฟล์ในโฟลเดอร์นี้ได้ตามใจ — เป็นสำเนา ไม่ได้ผูก submodule กับต้นทาง (แลกกับว่าไม่ได้อัปเดตตามเขาเอง)
