import sys, glob, os, numpy as np, librosa
# perceived hit = max of a 10 ms smoothed |y| envelope; attack = steepest rise of a 20 ms envelope before it
for p in sorted(glob.glob(sys.argv[1] + '/*.*')):
    y, sr = librosa.load(p, sr=44100, mono=True)
    a = np.abs(y)
    w = int(sr * 0.010); env = np.convolve(a, np.ones(w) / w, 'same')
    ip = int(np.argmax(env))
    w2 = int(sr * 0.020); e2 = np.convolve(a, np.ones(w2) / w2, 'same')
    d = np.diff(e2[: ip + 1]) if ip > 1 else np.array([0])
    ia = int(np.argmax(d)) if len(d) else 0
    lufs_like = 20 * np.log10(np.sqrt(np.mean(y[max(0, ip - int(sr*0.075)): ip + int(sr*0.075)] ** 2)) + 1e-9)
    print(f"{os.path.basename(p):28s} peak={ip/sr:.3f}s attack={ia/sr:.3f}s  rms150ms@peak={lufs_like:6.1f} dB")
