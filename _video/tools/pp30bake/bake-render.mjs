// bake-render.mjs <in.pdf> <out.png> [--font file.ttf] [--dpi 220]
//
// Renders a JHCore-filled RD AcroForm (ภ.พ.30: NeedAppearances, no appearance streams) the way
// Adobe Acrobat shows it: bakes an appearance stream into every text field with a Thai-capable
// font, then rasterises page 1 with MuPDF. The baked PDF is written next to the PNG
// (<out>.baked.pdf). Render-only: never hand the baked PDF to anyone as the filed form.
import fs from 'node:fs';
import {
  PDFDocument, PDFTextField, PDFName, PDFBool, PDFHexString, defaultTextFieldAppearanceProvider,
  rgb, cmyk, grayscale, beginMarkedContent, endMarkedContent, pushGraphicsState, popGraphicsState,
  rectangle, clip, endPath, beginText, endText, setFillingColor, setFontAndSize, setTextMatrix, showText,
} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import * as mupdf from 'mupdf';

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(k); return i < 0 ? d : argv.splice(i, 2)[1]; };
const fontPath = opt('--font', 'C:/Windows/Fonts/tahoma.ttf');
const dpi = Number(opt('--dpi', '220'));
const [inPath, outPath] = argv;
if (!inPath || !outPath) {
  console.error('usage: node bake-render.mjs <in.pdf> <out.png> [--font file.ttf] [--dpi 220]');
  process.exit(2);
}

const fontBytes = fs.readFileSync(fontPath);
const doc = await PDFDocument.load(fs.readFileSync(inPath));
doc.registerFontkit(fontkit);
// Full embed: the glyph ids written below are the font file's own (CIDToGIDMap /Identity).
const font = await doc.embedFont(fontBytes, { subset: false });
const fk = fontkit.create(fontBytes); // same file, used for shaping
const UPM = fk.unitsPerEm, ASC = fk.ascent / UPM, DESC = Math.abs(fk.descent) / UPM;
const form = doc.getForm();

// The template's "ล้างข้อมูล" push button is screen-only (no Print flag) and not part of the film.
const button = form.getFields().find((f) => f.getName() === 'Button1');
if (button) form.removeField(button);

// Shape with the font's OpenType tables, one positioned glyph per entry (em units). Each glyph
// gets its own text matrix: pdf-lib's /W only covers encoded glyphs, so the substituted Thai
// "high" tone marks would advance a full em (the gap in "ที่ทดสอบ") if shown as one string.
// fontkit has no Thai shaper, so do HarfBuzz's SARA AM step here: NIKHAHIT goes before the tone
// mark (ช่ำ = ช ํ ่ า), else the tone mark ends up under the nikhahit.
const shape = (s) => {
  const { glyphs, positions } = fk.layout(s.replace(/([\u0E48-\u0E4B]+)\u0E33/g, '\u0E4D$1\u0E32'));
  let pen = 0;
  const run = glyphs.map((g, i) => {
    const p = positions[i], at = { hex: g.id.toString(16).padStart(4, '0'), x: (pen + p.xOffset) / UPM, y: p.yOffset / UPM };
    pen += p.xAdvance;
    return at;
  });
  return { run, width: pen / UPM };
};

const daColor = (da) => {
  let m;
  if ((m = /([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+rg/.exec(da))) return rgb(+m[1], +m[2], +m[3]);
  if ((m = /([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+k/.exec(da))) return cmyk(+m[1], +m[2], +m[3], +m[4]);
  if ((m = /([\d.]+)\s+g\b/.exec(da))) return grayscale(+m[1]);
  return grayscale(0);
};

// Acrobat-like single-line layout. Auto size (0 Tf) = (h - 2) / 1.35, shrunk to fit the width
// (pdf.js's constant, calibrated against Acrobat); the font's ascent..descent box is centred
// vertically; 2pt side padding. Comb: MaxLen equal cells over the full width, each character
// centred in its cell, and /Q picks the cells (2 = rightmost, 1 = middle) as Acrobat and pdfium
// do. pdf-lib's own comb layout always starts at the left cell, which put 50000.00 under บาท
// with the สต. box empty.
const log = [];
const provider = (field, widget) => {
  if (field.isMultiline()) return defaultTextFieldAppearanceProvider(field, widget, font);
  const { width: w, height: h } = widget.getRectangle();
  const da = widget.getDefaultAppearance() ?? field.acroField.getDefaultAppearance() ?? '';
  const daSize = Number(/([\d.]+)\s+Tf/.exec(da)?.[1] ?? 0);
  const fit = (emWidth) => daSize || Math.min((h - 2) / 1.35, (w - 4) / (emWidth || 1));
  const text = (field.getText() ?? '').replace(/[\r\n]+/g, ' ');
  const q = field.getAlignment(); // TextAlignment: 0 left, 1 centre, 2 right (/Q)
  const n = field.isCombed() ? field.getMaxLength() ?? 0 : 0;
  const glyphs = [];
  let size;
  if (n) {
    const cells = [...text].slice(0, n).map(shape);
    size = fit(cells.reduce((a, c) => a + c.width, 0));
    const first = q === 2 ? n - cells.length : q === 1 ? Math.floor((n - cells.length) / 2) : 0;
    cells.forEach((c, i) => c.run.forEach((g) => glyphs.push({
      hex: g.hex, x: ((first + i + 0.5) * w) / n + (g.x - c.width / 2) * size, y: g.y * size,
    })));
  } else {
    const r = shape(text);
    size = fit(r.width);
    const x0 = q === 2 ? w - 2 - r.width * size : q === 1 ? (w - r.width * size) / 2 : 2;
    r.run.forEach((g) => glyphs.push({ hex: g.hex, x: x0 + g.x * size, y: g.y * size }));
  }
  const base = (h - (ASC + DESC) * size) / 2 + DESC * size;
  if (text) log.push(`${field.getName()} ${JSON.stringify(text)} ${size.toFixed(2)}pt${n ? ` comb${n} Q${q}` : ''}`);
  return [
    beginMarkedContent('Tx'), pushGraphicsState(), rectangle(1, 1, w - 2, h - 2), clip(), endPath(),
    beginText(), setFillingColor(daColor(da)), setFontAndSize(font.name, size),
    ...glyphs.flatMap((g) => [setTextMatrix(1, 0, 0, 1, g.x, base + g.y), showText(PDFHexString.of(g.hex))]),
    endText(), popGraphicsState(), endMarkedContent(),
  ];
};

for (const f of form.getFields()) if (f instanceof PDFTextField) f.updateAppearances(font, provider);
// The viewer must show the baked streams; with NeedAppearances on, MuPDF rebuilds its own
// (DA font, no Thai glyphs) and the Thai fields go blank again.
form.acroForm.dict.set(PDFName.of('NeedAppearances'), PDFBool.False);
const baked = await doc.save({ updateFieldAppearances: false });
const bakedPath = outPath.replace(/\.png$/i, '') + '.baked.pdf';
fs.writeFileSync(bakedPath, baked);

const page = mupdf.Document.openDocument(baked, 'application/pdf').loadPage(0);
const s = dpi / 72;
const pix = page.toPixmap(mupdf.Matrix.scale(s, s), mupdf.ColorSpace.DeviceRGB, false, true);
fs.writeFileSync(outPath, pix.asPNG());
console.log(log.join('\n'));
console.log(`${outPath} ${pix.getWidth()}x${pix.getHeight()} @${dpi}dpi, font ${fontPath}, baked ${bakedPath}`);
