# Measures public/audio/vo/loc-NN.mp3 (any source: edge-tts scratch, the Botnoi files, the cloned voice) -> loc/vo-durations.json.
# Run `node loc/gen-vo.mjs` afterwards. Speech end = start of the trailing silence (-38 dB, >= 0.25 s), else the file end.
# segs = the speech runs the word cues are placed on (gen-vo.mjs): 10 ms frames above (p90 - 35 dB), gaps under 80 ms bridged,
# only runs that reach p90 - 15 dB — a breath or a click between phrases counts as pause — each cut to its frames at p90 - 20 dB
# or more, so a breath that runs into the next word does not move the word earlier. Same rule as D:/TTS/scripts/make_vo.py.
import io, json, pathlib, re, subprocess
import numpy as np
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'public' / 'audio' / 'vo'
lines = [l.rstrip('\n').split('\t') for l in io.open(HERE / 'vo-botnoi.txt', encoding='utf-8')]

def speech_runs(mp3):
    x = np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(mp3), '-f', 'f32le', '-ac', '1', '-ar', '16000', '-']), dtype=np.float32)
    n = len(x) // 160
    db = 10 * np.log10(np.mean(x[:n * 160].reshape(n, 160) ** 2, axis=1) + 1e-12)
    ref = np.percentile(db, 90)
    runs = []
    for i in np.flatnonzero(db > ref - 35):
        if runs and i - runs[-1][1] < 8:
            runs[-1][1] = i + 1
        else:
            runs.append([i, i + 1])
    core = lambda a, b: a + np.flatnonzero(db[a:b] >= ref - 20)[[0, -1]] + [0, 1]
    cores = [core(a, b) for a, b in runs if db[a:b].max() >= ref - 15]
    return [[c[0] / 100, c[1] / 100] for c in cores if c[1] - c[0] >= 6]  # a core under 60 ms is a click, not a syllable

meta = []
for no, text in lines:
    mp3 = OUT / f'loc-{no}.mp3'
    d = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(mp3)]).decode().strip())
    sd = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(mp3), '-af', 'silencedetect=noise=-38dB:d=0.25', '-f', 'null', '-'], capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', sd)]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', sd)]
    speech_end = starts[-1] if starts and len(ends) < len(starts) else d
    speech_start = ends[0] if ends and starts and starts[0] < 0.05 else 0.0
    segs = speech_runs(mp3)
    meta.append({'no': no, 'sec': round(d, 3), 'speechStart': round(speech_start, 3), 'speechEnd': round(speech_end, 3), 'segs': segs, 'text': text})
    print(no, f'{d:6.2f}s speech {speech_start:4.2f}-{speech_end:5.2f}  runs ' + ' '.join(f'{a:.2f}-{b:.2f}' for a, b in segs))
json.dump(meta, io.open(HERE / 'vo-durations.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('TOTAL', round(sum(m['sec'] for m in meta), 1), 's ->', HERE / 'vo-durations.json')
