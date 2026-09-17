# jwic-thai / kode-thai — ของที่ยกมาจากต้นทาง

| | |
|---|---|
| ต้นทาง | [chakrit/kien-thai](https://github.com/chakrit/kien-thai) |
| ref ที่ก๊อปมา | `3695c889a23538e97ddae45c53e8b894730b41f5` (2026-07-27) |
| วันที่ลง | 2026-09-17 |
| License | MIT © Chakrit Wichian — ไฟล์ `LICENSE` ต้องอยู่ในโฟลเดอร์นี้ตลอด |

ต้นทางขยับเมื่อ `git ls-remote https://github.com/chakrit/kien-thai HEAD` ขึ้น sha อื่น

## ที่ไม่ได้เอามา

| ทิ้ง | เพราะ |
|---|---|
| `skills/kien-thai/scripts/` | `thai-route.sh` + `thai-native-draft.py` ต้องมี ollama ที่ pull Typhoon-2 / SEA-LION / OpenThaiGPT ไว้ในเครื่อง เราไม่มี ดึงกลับได้ทันทีถ้าวันหน้าลง ollama |
| `corpus/` `workspace/` `tests/` `docs/` `ace.toml` `.lowfat` | เป็นของโปรเจกต์ต้นทางเอง (คลังตัวอย่าง, รอบ iteration, pytest harness) skill ไม่ได้อ่าน |

## ที่แก้จากต้นฉบับ — resync แล้วต้องใส่กลับ

| ไฟล์ | แก้อะไร |
|---|---|
| `SKILL.md` | หัวข้อ "Best output: draft with a Thai-native model" — แทนบล็อกคำสั่ง `thai-route.sh` ด้วยหมายเหตุว่าเราไม่ได้เอา scripts มา |
| `SKILL.md` | Workflow ตัดข้อ 0 (Route first) ทิ้ง เพราะเรียกสคริปต์ที่ไม่มี |
| `SKILL.md` | เติมตัวชี้ไป `references/jwic-house.md` สองจุด (ท้าย Stylistic conventions + หัว References) |
| `kode-thai/SKILL.md` | ข้อ 1 ให้โหลด `jwic-house.md` ด้วย |
| `kode-thai/SKILL.md` | หัวข้อ "Best input" — ตัดทางที่ให้รัน `thai-route.sh` ออก ด้วยเหตุผลเดียวกัน |
| `kode-thai/SKILL.md` | ข้อ 1 ชี้มาที่ `../jwic-thai/` และตัดวงเล็บเรื่อง pytest harness ของโปรเจกต์ต้นทางออก |

`SKILL.md` ของ `jwic-thai` **ไม่ใช่ไฟล์ของต้นทาง** — เป็นของเรา ประกอบจากกฎบ้านเรา (เขียนเองทั้งหมด)
ต่อด้วยหัวข้อ Why / 7 frame / Person deixis / Workflow ที่ยกมาจาก `kien-thai/SKILL.md` แล้วตัดส่วน
native-model route ออก · resync ให้เอาเฉพาะ `references/` ทับ แล้วไล่ดูว่า 7 frame ของต้นทางขยับไหม
ห้ามทับ `SKILL.md` ทั้งไฟล์

รวมสองสกิลเป็นตัวเดียวชื่อ `jwic-thai` เมื่อ 17 ก.ย. 2026 — เดิมเป็น `kien-thai` (ต้นทาง) +
`references/jwic-house.md` (ของเรา) ตอนนี้กฎบ้านเราอยู่ในตัว `SKILL.md` แล้ว
