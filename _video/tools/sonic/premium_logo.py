# JWIC sonic logo, "premium" direction (owner 2026-10-20: "มันต้องดู Premium"), synthesised from scratch, no samples.
# Restraint over busyness: one gesture per picture event of the outro (src/scenes/Outro.tsx, frames from its start, 30 fps).
#   f18-46  a reversed hall tail of the logo chord breathes in while the mark's outline is traced
#   f46     the bloom as the mark fills: Emaj9 (felt piano + warm pad) over a soft deep sub, a breath of air
#   f62     one quiet high note as the rose corner stands up
#   f98     the name is whole: a soft high dyad, the pad rings on under the hold and dies away by the end
# Usage: python premium_logo.py <out dir>   → premium-bloom.wav (felt piano + pad), premium-air (pad + glass, no piano)
import sys, pathlib
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
F = lambda f: f / 30
TRACE, HIT, FOLD, NAME, END = F(18), F(46), F(62), F(98), F(199) + 0.4
N = int(END * SR)
rng = np.random.default_rng(11)
hz = lambda n: 440.0 * 2 ** ((n - 69) / 12)
E1, E2, B2, GS3, DS4, FS4, B4, GS5, B5, E6 = 28, 40, 47, 56, 63, 66, 71, 80, 83, 88
CHORD = [E2, B2, GS3, DS4, FS4]  # Emaj9, open voicing

def taper(sig, k=0.3):
    n = min(int(k * SR), len(sig) // 3)
    sig = sig.copy()
    sig[-n:] *= 0.5 * (1 + np.cos(np.linspace(0, np.pi, n)))
    return sig

def place(buf, sig, t0, pan=0.0):
    i = int(round(t0 * SR))
    sig = taper(sig)
    if i < 0:
        sig, i = sig[-i:], 0
    sig = sig[: max(0, N - i)]
    buf[0, i:i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    buf[1, i:i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))

def felt_piano(f, dur, vel=1.0):
    """Two slightly detuned strings, stretched (inharmonic) partials, a soft felt attack, higher partials dying first."""
    t = np.arange(int(dur * SR)) / SR
    out = np.zeros(len(t))
    for detune in (-0.9, 0.9):
        fs = f * 2 ** (detune / 1200)
        for n in range(1, 14):
            fn = n * fs * np.sqrt(1 + 0.00035 * n * n)
            if fn > 15000:
                break
            amp = vel / n ** 1.35 * np.exp(-0.16 * n * (1.2 - vel))
            slow = 3.2 / (1 + 0.32 * (n - 1))
            env = 0.5 * np.exp(-t / (0.3 / (1 + 0.08 * n))) + 0.5 * np.exp(-t / slow)
            out += amp * env * np.sin(2 * np.pi * fn * t + rng.uniform(0, 2 * np.pi))
    out *= np.minimum(1, t / 0.006)
    thump = sosfilt(butter(2, 900, fs=SR, output='sos'), rng.standard_normal(len(t))) * np.exp(-t / 0.012) * 0.04
    return (out + thump) / 2

def glass(f, dur, vel=1.0):
    t = np.arange(int(dur * SR)) / SR
    parts = [(1.0, 1.0, 3.0), (2.01, 0.25, 1.4), (3.0, 0.08, 0.6), (5.4, 0.03, 0.25)]
    return vel * np.minimum(1, t / 0.01) * sum(a * np.exp(-t / d) * np.sin(2 * np.pi * f * r * t) for r, a, d in parts)

def warm_pad(notes, dur, attack=0.5):
    t = np.arange(int(dur * SR)) / SR
    out = np.zeros(len(t))
    for n in notes:
        for cents in (-8, -3, 3, 8):
            f = hz(n) * 2 ** (cents / 1200)
            ph = rng.uniform(0, 2 * np.pi)
            out += sum(np.sin(2 * np.pi * f * k * t + ph * k) / k for k in range(1, 9))
    out = sosfilt(butter(2, 1600, fs=SR, output='sos'), out)
    return out * np.minimum(1, t / attack) * np.exp(-t / 3.5) / (len(notes) * 4)

def sub(dur=2.2):
    t = np.arange(int(dur * SR)) / SR
    return (np.sin(2 * np.pi * hz(E1) * t) + 0.35 * np.sin(2 * np.pi * hz(E2) * t)) * np.minimum(1, t / 0.012) * np.exp(-t / 0.9)

def air(dur=1.6):
    t = np.arange(int(dur * SR)) / SR
    x = sosfilt(butter(2, [3500, 14000], btype='band', fs=SR, output='sos'), rng.standard_normal(len(t)))
    return x * np.minimum(1, t / 0.004) * np.exp(-t / 0.45)

def hall(length=4.0, decay=0.55, predelay=0.025):
    t = np.arange(int(length * SR)) / SR
    irs = []
    for _ in range(2):
        ir = rng.standard_normal(len(t)) * np.exp(-t / decay)
        ir = sosfilt(butter(2, [180, 7000], btype='band', fs=SR, output='sos'), ir)
        ir = np.concatenate([np.zeros(int(predelay * SR)), ir])
        irs.append(ir / np.sqrt((ir ** 2).sum()))
    return irs

IRS = hall()

def reverse_swell(voice_mix, length):
    """The logo chord's hall tail played backwards, ending on the hit: the sound breathes in before it blooms."""
    wet = fftconvolve(voice_mix, IRS[0])[: int(length * SR)]
    rev = wet[::-1].copy()
    rev *= np.linspace(0, 1, len(rev)) ** 1.6
    return rev / (np.abs(rev).max() + 1e-9)

def shimmer(notes, dur, attack=0.6):
    """A high, airy halo over the chord: sine voices with a slow chorus drift, high-passed — the polish on top."""
    t = np.arange(int(dur * SR)) / SR
    out = np.zeros(len(t))
    for n in notes:
        for k, cents in enumerate((-6, 6)):
            drift = 2 ** ((cents + 3 * np.sin(2 * np.pi * (0.23 + 0.07 * k) * t)) / 1200)
            out += np.sin(2 * np.pi * hz(n) * np.cumsum(drift) / SR)
    out = sosfilt(butter(2, 1800, btype='high', fs=SR, output='sos'), out)
    return out * np.minimum(1, t / attack) * np.exp(-t / 2.8) / (len(notes) * 2)

def render(name, piano=True):
    buf = np.zeros((2, N))
    bloom_len = END - HIT
    # the piano plays the chord an octave above the pad: the low end stays the pad's and the sub's, the piano carries the clarity
    chord = sum(felt_piano(hz(n + 12), bloom_len, 0.85) for n in CHORD) if piano else sum(glass(hz(n + 12), bloom_len, 0.5) for n in CHORD[2:])
    pad = warm_pad(CHORD, bloom_len + 0.2, attack=0.35)
    halo = shimmer([B5, DS4 + 24, FS4 + 24], bloom_len)
    place(buf, 0.22 * reverse_swell(chord + 2 * pad[: len(chord)] + halo, HIT - TRACE + 0.05), TRACE - 0.05)  # ends exactly on HIT
    place(buf, 0.32 * sub(), HIT)
    place(buf, 0.08 * air(), HIT, 0.2)
    place(buf, (0.55 if piano else 0.6) * chord, HIT)
    place(buf, 0.85 * pad, HIT - 0.05)
    place(buf, 0.3 * halo, HIT + 0.05, -0.1)
    note = felt_piano(hz(GS5), 3.0, 0.55) if piano else glass(hz(GS5), 3.0, 0.5)
    place(buf, 0.28 * note, FOLD, 0.25)
    top = (felt_piano(hz(B5), END - NAME, 0.5) + felt_piano(hz(E6), END - NAME, 0.45)) if piano else (glass(hz(B5), END - NAME, 0.5) + glass(hz(E6), END - NAME, 0.45))
    place(buf, 0.24 * top, NAME, -0.2)
    wet = np.stack([fftconvolve(buf[c], IRS[c])[:N] for c in range(2)])
    mix = buf + 0.38 * wet  # the hall IR is band-passed, so the sub stays dry and tight
    mix += 0.6 * np.stack([sosfilt(butter(1, 3500, btype='high', fs=SR, output='sos'), mix[c]) for c in range(2)])  # a gentle air shelf
    mix *= np.clip((END - np.arange(N) / SR) / 0.5, 0, 1)
    mix = np.tanh(1.2 * mix / np.abs(mix).max()) / np.tanh(1.2)  # a touch of tape-like glue on the peaks
    mix *= 10 ** (-3 / 20) / np.abs(mix).max()
    sf.write(pathlib.Path(sys.argv[1]) / f'premium-{name}.wav', mix.T.astype(np.float32), SR)
    print(name, 'ok')

render('bloom', piano=True)
render('air', piano=False)
