# Measures public/audio/vo/loc-NN.mp3 (any source: edge-tts scratch or the Botnoi files) -> loc/vo-durations.json.
# Run `node loc/gen-vo.mjs` afterwards. Speech end = start of the trailing silence (-38 dB, >= 0.25 s), else the file end.
import io, json, pathlib, re, subprocess
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'public' / 'audio' / 'vo'
lines = [l.rstrip('\n').split('\t') for l in io.open(HERE / 'vo-botnoi.txt', encoding='utf-8')]
meta = []
for no, text in lines:
    mp3 = OUT / f'loc-{no}.mp3'
    d = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(mp3)]).decode().strip())
    sd = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(mp3), '-af', 'silencedetect=noise=-38dB:d=0.25', '-f', 'null', '-'], capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', sd)]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', sd)]
    speech_end = starts[-1] if starts and len(ends) < len(starts) else d
    speech_start = ends[0] if ends and starts and starts[0] < 0.05 else 0.0
    meta.append({'no': no, 'sec': round(d, 3), 'speechStart': round(speech_start, 3), 'speechEnd': round(speech_end, 3), 'text': text})
    print(no, f'{d:6.2f}s speech {speech_start:4.2f}-{speech_end:5.2f}')
json.dump(meta, io.open(HERE / 'vo-durations.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('TOTAL', round(sum(m['sec'] for m in meta), 1), 's ->', HERE / 'vo-durations.json')
