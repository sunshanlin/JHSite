# ถอดเสียงที่ TTS สร้าง กลับเป็นข้อความด้วย Whisper ไทย เพื่อดูว่าอ่านครบไหม
# run: d:\JHLinkedin\.venv\Scripts\python.exe verify-tts.py <ไฟล์.wav> [...]
# ponytail: พิมพ์ข้อความที่ถอดได้เฉย ๆ ให้คนอ่านเทียบเอง — ไม่คำนวณ WER
import sys

import numpy as np
import soundfile as sf
import torch
from scipy.signal import resample_poly
from transformers import pipeline

asr = pipeline(
    task="automatic-speech-recognition",
    model="biodatlab/whisper-th-large-v3-combined",
    chunk_length_s=30,
    device=0 if torch.cuda.is_available() else "cpu",
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
)

for path in sys.argv[1:]:
    audio, sr = sf.read(path, dtype="float32", always_2d=True)
    audio = audio.mean(axis=1)  # -> mono
    if sr != 16000:
        audio = resample_poly(audio, 16000, sr).astype(np.float32)
    text = asr(
        {"array": audio, "sampling_rate": 16000},
        generate_kwargs={"language": "<|th|>", "task": "transcribe"},
    )["text"]
    print(f"\n=== {path} ({len(audio) / 16000:.1f}s)")
    print(text)
