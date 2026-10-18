# one.py <pdf-stem> <png-stem>: rasterize page 1 at 220 dpi, report TINs and changed bands vs the film's raster, save a top crop
import sys, pymupdf, numpy as np
from PIL import Image
S='C:/Users/Admin/AppData/Local/Temp/claude/d--BC-Project-JHCore/0e7a63b0-e8de-4298-bf9f-fce2e86e3c8b/scratchpad'
V='D:/Web/promote-site/_video'
pdf, png = sys.argv[1], sys.argv[2]
doc = pymupdf.open(f'{V}/capture/dec/pdf/{pdf}.pdf'); t = ''.join(p.get_text() for p in doc)
doc[0].get_pixmap(dpi=220, alpha=False).save(f'{S}/integ/{png}.png')
print(pdf, 'pages', doc.page_count, 'new TINs', [k for k in ['0105569902138', '0105562345675'] if k in t], 'stale', [k for k in ['0105560123454', '0105562345678', 'Within 30 Days', 'info463'] if k in t])
a = np.asarray(Image.open(f'{S}/integ/{png}.png').convert('L')).astype(int); b = np.asarray(Image.open(f'{S}/docs-old/{png}.png').convert('L')).astype(int)
if a.shape != b.shape: print('SIZE CHANGED', a.shape, b.shape)
else:
    d = np.abs(a - b) > 40; rows = np.nonzero(d.any(1))[0]
    if len(rows) == 0: print('identical')
    else:
        bands = []; s = rows[0]; p = rows[0]
        for y in rows[1:]:
            if y - p > 8: bands.append((s, p)); s = y
            p = y
        bands.append((s, p)); print('changed bands', [(round(x / a.shape[0], 3), round(y / a.shape[0], 3)) for x, y in bands])
h = a.shape[0]; w = a.shape[1]
Image.open(f'{S}/integ/{png}.png').crop((0, 0, w, int(h * 0.36))).resize((w // 2, int(h * 0.36) // 2)).save(f'{S}/integ/{png}_top.png')
