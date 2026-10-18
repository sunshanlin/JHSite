# Back-test of a render (sound-design §4.6): output audio offset, beat landings, SFX probes.
# usage: backtest2.py master.mp4 nobgm.mp4 bgm-edit.wav sfx_targets.json
import sys, json, numpy as np, librosa, scipy.signal as ss
mp, np_, bgm, tj = sys.argv[1:5]
SR = 48000
ym, _ = librosa.load(mp, sr=SR, mono=True)
yn, _ = librosa.load(np_, sr=SR, mono=True)
yb, _ = librosa.load(bgm, sr=SR, mono=True)
n = min(len(ym), len(yn))
res = ym[:n] - yn[:n]  # = BGM × 0.4 (identical SFX cancel)
# 1) output offset: residual vs the BGM file, 10–30 s window
a, b = SR * 10, SR * 30
c = ss.correlate(res[a:b], yb[a:b], mode='full', method='fft')
lag = int(np.argmax(c) - (b - a - 1))
off = lag / SR
gain = float(np.sum(res[a:b] * np.roll(yb, lag)[a:b]) / np.sum(np.roll(yb, lag)[a:b] ** 2))
print(f"output offset {lag} samples = {off*1000:.2f} ms ({off*30:.2f} f), BGM gain {gain:.3f}")
OFFSET_SEC = 0.0423
T0, T = 0.2163, 0.52176
beatF = lambda k: round((T0 + OFFSET_SEC + k * T) * 30)
print("beats: heard frame (BGM grid + measured offset) vs picture frame beatF")
for name, k in [('b1', 16), ('b2', 36), ('b3', 56), ('b4', 84), ('b5', 104), ('splice', 120), ('b6', 124), ('final hit', 168)]:
    heard = (T0 + k * T + off) * 30
    print(f"  {name:9s} beat {k:3d}  picture f{beatF(k):5d}  heard f{heard:8.2f}  err {heard - beatF(k):+.2f} f")
# 3) SFX probes on the SFX-only master
env = np.convolve(np.abs(yn), np.ones(int(SR * 0.010)) / int(SR * 0.010), 'same')
e2 = np.convolve(np.abs(yn), np.ones(int(SR * 0.020)) / int(SR * 0.020), 'same')
J = json.load(open(tj, encoding='utf-8'))
print("SFX probes: heard peak vs intended picture frame (window ±10 f)")
for t in J['targets']:
    if any(k in t['src'] for k in ('keyboard', 'marker')):
        continue
    f0 = t['target']
    lo, hi = int((f0 - 10) / 30 * SR), int((f0 + 10) / 30 * SR)
    lo = max(lo, 0)
    ip = lo + int(np.argmax(env[lo:hi]))
    d = np.diff(e2[lo:ip + 1]) if ip > lo + 1 else np.array([0.0])
    ia = lo + int(np.argmax(d))
    lvl = 20 * np.log10(np.sqrt(np.mean(yn[max(0, ip - int(SR * .075)): ip + int(SR * .075)] ** 2)) + 1e-12)
    bl = 20 * np.log10(np.sqrt(np.mean(res[max(0, ip - int(SR * .075)): ip + int(SR * .075)] ** 2)) + 1e-12)
    print(f"  f{f0:5d} {t['src']:28s} peak {ip/SR*30 - f0:+5.2f} f  attack {ia/SR*30 - f0:+5.2f} f  SFX {lvl:6.1f} dB  BGM {bl:6.1f} dB  ({t['note'][:40]})")
