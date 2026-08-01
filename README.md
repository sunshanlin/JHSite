# JHPresales

Workspace สำหรับทำ PowerPoint presales และเตรียม present

เด็คประกอบขึ้นจาก pitch deck ของ Microsoft ด้วยสคริปต์ ไม่ได้แก้มือ
เพราะ Microsoft ออกเด็คใหม่ทุก release wave พอมีของใหม่ก็ rerun ทับได้เลย

## Build

```
powershell -File build\build.ps1              # ประกอบเด็ค
powershell -File build\verify.ps1             # ตรวจว่าไม่มีอะไรที่ห้ามโชว์ลูกค้าหลุดออกไป
powershell -File build\shots.ps1 1 2 26 29    # export หน้าที่ระบุเป็น PNG ไว้ดูด้วยตา
```

ได้ `decks\JWIC-BC-Core.pptx` : 76 หน้า ฉายจริง 22 หน้า ที่เหลือซ่อนไว้ กด go-to-slide เอาตอน Q&A

## โครงสร้าง

| ที่ | อะไร |
|---|---|
| `build\deck-core.json` | เนื้อหาทั้งหมด : หน้าไหนเอา หน้าไหนสร้างใหม่ speaker notes ไทย ภาพ โลโก้ |
| `build\build.ps1` | ขับ PowerPoint COM ประกอบไฟล์ ตัวสคริปต์เป็น ASCII ล้วน |
| `build\verify.ps1` | assert หลัง build ล้มแล้ว exit 1 |
| `decks\` | ผลลัพธ์ ไม่เข้า git |
| `outline\` | ร่าง / สคริปต์พูด |

**แก้เนื้อหาให้แก้ที่ `deck-core.json` แล้ว rerun** อย่าแก้ .pptx มือ เพราะ build รอบหน้าทับหมด

## แหล่งข้อมูล

| อะไร | อยู่ที่ |
|---|---|
| Microsoft pitch deck | `C:\Users\Admin\OneDrive\Other\My Knowledge\Slide` (เปิดอ่านอย่างเดียว ไม่เคยถูกแก้) |
| ราคา | `C:\Users\Admin\OneDrive\Desktop\JWIC-Proposal_3.xlsx` sheet `Pricing` |
| ภาพหน้าจอ BC + โลโก้ | `D:\Web\promote-site\img` |

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
