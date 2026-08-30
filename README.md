# JHPresales

Workspace สำหรับทำ PowerPoint presales และเตรียม present

**ต้นแบบคือ `decks\JWIC-BC-Core.pptx`** แก้ในไฟล์นี้ด้วยมือได้เลย ตัวเดียวกับ `C:\Users\Admin\OneDrive\JWIC-BC-Core.pptx`
เดิมประกอบขึ้นจาก pitch deck ของ Microsoft ด้วย `build.ps1` ตอนนี้ build เป็นแค่ทางออกฉุกเฉิน
ไว้ตั้งต้นใหม่ตอน Microsoft ออกเด็คใหม่ทุก release wave แล้วค่อยยกงานมือตามมา

## Build

```
powershell -File build\verify.ps1             # ตรวจต้นแบบว่าไม่มีอะไรที่ห้ามโชว์ลูกค้าหลุดออกไป
powershell -File build\shots.ps1 1 2 26 29    # export หน้าที่ระบุจากต้นแบบเป็น PNG ไว้ดูด้วยตา
powershell -File build\build.ps1              # ประกอบใหม่จาก JSON -> decks\JWIC-BC-Core-rebuild.pptx
powershell -File build\verify.ps1 -Path decks\JWIC-BC-Core-rebuild.pptx
```

ต้นแบบ : 76 หน้า ฉายจริง 22 หน้า ที่เหลือซ่อนไว้ กด go-to-slide เอาตอน Q&A

## โครงสร้าง

| ที่ | อะไร |
|---|---|
| `decks\JWIC-BC-Core.pptx` | **ต้นแบบ** ไม่เข้า git (90 MB) สำรองอยู่บน OneDrive |
| `build\deck-core.json` | เนื้อหาตอนประกอบครั้งแรก : หน้าไหนเอา หน้าไหนสร้างใหม่ speaker notes ไทย ภาพ โลโก้ |
| `build\build.ps1` | ขับ PowerPoint COM ประกอบไฟล์ ตัวสคริปต์เป็น ASCII ล้วน |
| `build\verify.ps1` | assert ก่อนไปเจอลูกค้า ล้มแล้ว exit 1 |
| `build\add-methodology.ps1` | สร้าง 2 หน้า Fast Implement (ไทม์ไลน์ 10 สัปดาห์ + คำอธิบาย) แทรกหลังหน้า Success by Design · รันซ้ำได้ ลบของเดิมที่ตัวเองสร้างก่อน (รู้จักจากชื่อ shape `fim*`) |
| `build\methodology-notes.json` | speaker notes ไทยของ 2 หน้านั้น (ไทยห้ามอยู่ใน .ps1) |
| `outline\` | ร่าง / สคริปต์พูด |

**แก้เนื้อหาให้แก้ที่ต้นแบบโดยตรง แล้วรัน `verify.ps1`** — `build.ps1` เขียนลง `-rebuild.pptx` ทับต้นแบบไม่ได้
งานมือที่ทำหลังจากนี้ไม่มีใน `deck-core.json` ถ้า rebuild ต้องยกตามเอง

## Fast Implement (หน้า 94-95)

เนื้อหามาจาก `D:\BC\Project\JHCore\docs\Methodology\FastImplement-SME.html` — แก้เอกสารแล้วต้องยกมาที่สคริปต์เอง ไม่ได้อ่านอัตโนมัติ
`powershell -File build\add-methodology.ps1` แล้วดูด้วยตา `build\shots.ps1 94 95`
`build\fix-payment.ps1` = เขียนตาราง Payment Schedule (หน้า 97) ใหม่ให้ตรง Gate 1–5 (30/15/20/20/15 · Gate 4+5 รวมงวดเดียว · Hypercare แยกบรรทัด) แก้เปอร์เซ็นต์ที่ `$rows` ในสคริปต์
แถบเฟสวาดชนกัน (2/3/6/10/14) ทั้งที่แผนจริงคาบเกี่ยวกันสัปดาห์หนึ่งตอนส่งไม้ — แถวกิจกรรมด้านล่างเป็นตัวบอกรายละเอียดจริง

## แหล่งข้อมูล

| อะไร | อยู่ที่ |
|---|---|
| Microsoft pitch deck | `C:\Users\Admin\OneDrive\Other\My Knowledge\Slide` (เปิดอ่านอย่างเดียว ไม่เคยถูกแก้) |
| ราคา | `C:\Users\Admin\OneDrive\Desktop\JWIC-Proposal_3.xlsx` sheet `Pricing` |
| ภาพหน้าจอ BC + โลโก้ | `D:\Web\promote-site\img` |
| รูปคนบนหน้าปก `JWIC-BC-Core` | ผู้ใช้จัดหามาเอง (29 ส.ค. 2026 · ที่มายังไม่ได้จด) — แทนรูปสต็อกที่มากับ deck ของ Microsoft ห้ามใช้ซ้ำ · ตัวเลือกสำรองที่คัดไว้แล้ว: Pexels 7964413, 7430331 |

**ราคาอ่านจาก Excel ตอน build** ไม่ได้ก๊อปตัวเลขมาแปะ แก้ราคาใน Excel แล้ว rerun สไลด์อัปเดตตาม
เสนอราคาลูกค้ารายใหม่ = แก้ Excel + rerun ไม่ต้องแตะสไลด์

## สิ่งที่ verify.ps1 กันไว้

หลุดข้อไหนคือเอาของภายในไปโชว์ลูกค้า ทุกข้อล้มแล้ว exit 1

- ไม่มี `PARTNER & SELLER GUIDANCE ONLY` / `DO NOT PRESENT` / กล่อง `Note to Sellers`
- ไม่มี `Classified as Microsoft Confidential` (อยู่บน slide master พิมพ์ทุกหน้ารวมหน้าราคา)
- ไม่มี customer success ของ Microsoft
- จำนวนหน้าที่ฉายจริง speaker notes ไทยครบ และหน้าปิดมีแถบ JWIC

## กับดักที่เจอมาแล้ว

- **`rd` เป็น alias ของ `Remove-Item`** ห้ามตั้งชื่อฟังก์ชันว่า `RD` ใน PowerShell เพราะ alias ชนะ function
- **PowerShell 5.1 อ่านไฟล์ .ps1 เป็น ANSI** ข้อความไทยในสคริปต์จะเพี้ยน ให้อยู่ใน JSON เท่านั้น (อ่านด้วย `-Encoding UTF8`)
- **`notesSlideN.xml` ไม่ตรงกับ `slideN.xml`** ต้องเขียน notes ผ่าน COM ห้ามแก้ XML ตรง ๆ
- **PowerPoint ไม่ reflow จนกว่าจะ render** อ่าน `Table.Height` หลังลด font ได้ค่าเก่า ต้องตั้ง `Rows.Item(r).Height` ตรง ๆ แล้วอ่านกลับ และ `TextFrame2.AutoSize` ก็ไม่ทำงาน ต้องคำนวณขนาดฟอนต์เอง
- **`Group()` ใช้กับ range ที่มีตารางไม่ได้** ต้องขยับทีละ shape

<!-- ponytail: ยังไม่ทำ deck เจาะ vertical แยก (Finance-only / Manufacturing-only)
     ถ้าจะทำ ใช้ build.ps1 ตัวเดิม เปลี่ยนแค่ JSON -->
