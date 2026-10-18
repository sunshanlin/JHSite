import sys, pymupdf
src, dst, dpi = sys.argv[1], sys.argv[2], int(sys.argv[3])
doc = pymupdf.open(src)
print(src, 'pages', doc.page_count, 'size', doc[0].rect)
pix = doc[0].get_pixmap(dpi=dpi, alpha=False)
pix.save(dst)
print(dst, pix.width, pix.height)
