# Blank the PromptPay QR on a document raster (owner 2026-10-13: "เอา QR ในเอกสารออก"): find it with OpenCV's QR
# detector, paint its bounding box (plus a margin) in page white. Usage: mask_qr.py in.png [out.png]
import sys, cv2, numpy as np
src = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else src
im = cv2.imread(src)
ok, pts = cv2.QRCodeDetector().detect(im)
if not ok or pts is None:
    print('no QR found in', src); sys.exit(1)
p = pts.reshape(-1, 2)
x0, y0 = p.min(0); x1, y1 = p.max(0)
m = int(0.12 * (x1 - x0)) + 6
x0, y0, x1, y1 = int(x0) - m, int(y0) - m, int(x1) + m, int(y1) + m
cv2.rectangle(im, (x0, y0), (x1, y1), (255, 255, 255), thickness=-1)
cv2.imwrite(out, im)
H, W = im.shape[:2]
print(f'{src}: QR {x0},{y0}–{x1},{y1} ({x0/W:.3f},{y0/H:.3f} – {x1/W:.3f},{y1/H:.3f}) blanked')
