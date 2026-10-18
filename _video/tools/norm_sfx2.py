# Level-match with headroom: iterate gain so the 150 ms window RMS around the perceived peak hits the target while a
# latency-compensated limiter holds sample peaks at LIMIT (−6 dBFS), so SFX + BGM (≈ −8 dBFS peaks) cannot clip.
import sys, subprocess, numpy as np, librosa, os
src_dir, out_dir = sys.argv[1], sys.argv[2]
os.makedirs(out_dir, exist_ok=True)
LIMIT = 0.5
T = {  # name: (target dB at volume 1, trim start s, trim len s)
    'paper-page-turn': (-20.7, 0, None), 'paper-page-turn-big': (-20.7, 0, None), 'paper-slide': (-20.3, 0, None),
    'paper-move-quick': (-17.4, 0, None), 'keyboard': (-22.9, 2.0, 4.0), 'marker-pen-line': (-20.0, 0, None),
}
def rms_at_peak(y, sr, whole=False):
    if whole: return 20 * np.log10(np.sqrt(np.mean(y ** 2)) + 1e-12), 0.0
    a = np.abs(y); w = int(sr * 0.010); env = np.convolve(a, np.ones(w) / w, 'same'); ip = int(np.argmax(env))
    seg = y[max(0, ip - int(sr * 0.075)): ip + int(sr * 0.075)]
    return 20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-12), ip / sr
for name, (tgt, ts, tl) in T.items():
    p, out = f'{src_dir}/{name}.mp3', f'{out_dir}/{name}.wav'
    whole = name == 'keyboard'
    trim = f'atrim=start={ts}:duration={tl},asetpts=PTS-STARTPTS,afade=t=out:st={tl-0.4}:d=0.4,' if tl else ''
    y0, _ = librosa.load(p, sr=48000, mono=True, offset=ts, duration=tl)
    g = tgt - rms_at_peak(y0, 48000, whole)[0]
    for _ in range(5):
        subprocess.run(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-i', p, '-af',
                        f'{trim}volume={g:.2f}dB,alimiter=limit={LIMIT}:attack=2:release=40:level=false:latency=true',
                        '-ar', '48000', '-ac', '2', out], check=True)
        y, _ = librosa.load(out, sr=48000, mono=True)
        r, pk = rms_at_peak(y, 48000, whole)
        if abs(r - tgt) < 0.3: break
        g += (tgt - r)
    print(f'{name:22s} gain {g:+5.1f} dB -> {r:6.1f} dB (target {tgt})  peak@{pk:.3f}s  max {20*np.log10(np.abs(y).max()):5.1f} dBFS')
