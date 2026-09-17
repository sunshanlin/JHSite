# kien-thai / kode-thai — ของ vendor มา

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
| `kien-thai/SKILL.md` | หัวข้อ "Best output: draft with a Thai-native model" — แทนบล็อกคำสั่ง `thai-route.sh` ด้วยหมายเหตุว่าเราไม่ได้เอา scripts มา |
| `kien-thai/SKILL.md` | Workflow ตัดข้อ 0 (Route first) ทิ้ง เพราะเรียกสคริปต์ที่ไม่มี |
| `kien-thai/SKILL.md` | เติมตัวชี้ไป `references/jwic-house.md` สองจุด (ท้าย Stylistic conventions + หัว References) |
| `kode-thai/SKILL.md` | ข้อ 1 ให้โหลด `jwic-house.md` ด้วย |
| `kode-thai/SKILL.md` | หัวข้อ "Best input" — ตัดทางที่ให้รัน `thai-route.sh` ออก ด้วยเหตุผลเดียวกัน |

`references/jwic-house.md` เป็นของเราทั้งไฟล์ ไม่ใช่ของต้นทาง — resync ห้ามทับ
