import sys, numpy as np, soundfile as sf, librosa
src, out, cutA, joinB, xf = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5])
y, sr = librosa.load(src, sr=48000, mono=False)
if y.ndim == 1: y = np.stack([y, y])
a0, b0, h = int(round(cutA * sr)), int(round(joinB * sr)), int(round(xf * sr / 2))
A = y[:, : a0 + h]; B = y[:, b0 - h :]
n = 2 * h; t = np.linspace(0, 1, n)
gA, gB = np.cos(t * np.pi / 2), np.sin(t * np.pi / 2)
mid = A[:, -n:] * gA + B[:, :n] * gB
outv = np.concatenate([A[:, :-n], mid, B[:, n:]], axis=1)
sf.write(out, outv.T, sr, subtype='PCM_16')
import json; print('gain_needed?')
print('len', outv.shape[1] / sr, 'peak dB', 20 * np.log10(np.abs(outv).max()))
