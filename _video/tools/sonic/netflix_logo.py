# JWIC sonic logo, "streaming studio" direction (owner 2026-10-21: "ผมอยากได้แนวของ Netflix"): the two-hit "ta-dum" idea —
# a short muffled knock, then one deep boom that rings on as a dark chord — written fresh in JWIC's key (E), not a copy of
# anyone's sound mark. Same outro timing as premium_logo.py / atmos_logo.py (src/scenes/Outro.tsx, 30 fps):
#   f33   "ta": the knock, while the mark's outline closes
#   f46   "dum": the boom as the mark fills, a struck-metal body and a low chord that hums on
#   f62   classic: a faint glint on the rose corner · epic: the strings and brass start to swell
#   f98   classic: a soft high dyad on the name · epic: the swell peaks on the name with a second, smaller boom
# Usage: python netflix_logo.py <wav dir>  → netflix-classic.wav, netflix-epic.wav (helpers from atmos_logo.py)
import sys, pathlib
import numpy as np, soundfile as sf
from scipy.signal import sosfilt, fftconvolve
import atmos_logo as A
from atmos_logo import SR, N, T, HIT, FOLD, NAME, END, hz, sos, place, glass, warm_pad, hall

TA = HIT - 0.42
E1, B1, E2, B2, E3, GS3, B3, E4, GS4, B4, DS5, GS5, B5, E6 = 28, 35, 40, 47, 52, 56, 59, 64, 68, 71, 75, 80, 83, 88

def secs(dur):
    return np.arange(int(dur * SR)) / SR

def knock():
    """"ta": a low tom-like body falling a fourth in 30 ms, a woody mid partial and a short click, all muffled."""
    t = secs(0.6)
    f = hz(E2) * 2 ** (5 * np.exp(-t / 0.03) / 12)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.09)
    wood = np.sin(2 * np.pi * 180 * t) * np.exp(-t / 0.05) * 0.35
    click = sosfilt(sos(2, [1000, 4000], 'band'), A.rng.standard_normal(len(t))) * np.exp(-t / 0.008) * 0.15
    return sosfilt(sos(2, 2500), (body + wood + click) * np.minimum(1, t / 0.002))

def boom(dur, drop=7, decay=1.6):
    """"dum": the sub, E1 falling a fifth in 50 ms, plus a short low noise thud."""
    t = secs(dur)
    f = hz(E1) * 2 ** (drop * np.exp(-t / 0.05) / 12)
    ph = 2 * np.pi * np.cumsum(f) / SR
    thud = sosfilt(sos(2, 300), A.rng.standard_normal(len(t))) * np.exp(-t / 0.03) * 0.5
    return ((np.sin(ph) + 0.3 * np.sin(2 * ph)) * np.exp(-t / decay) + thud) * np.minimum(1, t / 0.004)

def struck(f, dur, vel=1.0):
    """A struck metal bar: inharmonic partials, the high ones dying first — the ring inside the boom."""
    t = secs(dur)
    parts = [(1.0, 1.0, 2.5), (2.0, 0.5, 1.8), (2.76, 0.35, 1.2), (4.07, 0.2, 0.8), (5.4, 0.12, 0.5)]
    return vel * np.minimum(1, t / 0.003) * sum(a * np.exp(-t / d) * np.sin(2 * np.pi * f * r * t + A.rng.uniform(0, 6.3))
                                               for r, a, d in parts)

def hum(notes, dur, decay=3.0):
    """The low chord the boom leaves behind: detuned saws, dark, with slow beating."""
    return sosfilt(sos(2, 1200), warm_pad(notes, dur, attack=0.02)) * np.exp(-secs(dur) / decay) / np.exp(-secs(dur) / 3.5)

def section(notes, dur, peak, spread=12, bright_lo=0.6, bright_hi=0.12):
    """A string or brass section: six detuned saws a note, a little vibrato, the tone opening as it swells to `peak` s,
    then dying away."""
    t = secs(dur)
    rise = np.clip(t / peak, 0, 1)
    env = np.where(t < peak, rise ** 1.8, np.exp(-(t - peak) / 1.6))
    bright = bright_lo - (bright_lo - bright_hi) * env
    out = np.zeros(len(t))
    for n in notes:
        for k in range(6):
            cents = spread * (k / 2.5 - 1) + 4 * np.sin(2 * np.pi * A.rng.uniform(4.6, 5.4) * t + A.rng.uniform(0, 6.3))
            ph = 2 * np.pi * np.cumsum(hz(n) * 2 ** (cents / 1200)) / SR + A.rng.uniform(0, 6.3)
            out += sum(np.sin(h * ph) / h * np.exp(-h * bright) for h in range(1, 16) if h * hz(n) < 14000)
    return out * env / (len(notes) * 6)

def reverse_cymbal(length):
    """Swells to its peak at `length` s and cuts off there; the 0.3 s after it is only for place()'s end taper."""
    t = secs(length + 0.3)
    env = np.where(t < length, (t / length) ** 3, np.exp(-(t - length) / 0.015))
    return sosfilt(sos(2, 5000, 'high'), A.rng.standard_normal(len(t))) * env

def render(name, seed):
    A.rng = np.random.default_rng(seed)
    buf, dry = np.zeros((2, N)), np.zeros((2, N))  # dry: the sub stays out of the hall
    tail = END - HIT
    place(buf, 0.45 * knock(), TA)
    place(dry, 0.62 * boom(tail), HIT)
    place(buf, 0.26 * struck(hz(E2), tail), HIT)
    place(buf, 0.1 * struck(hz(B3), tail, 0.8), HIT, az=0.15)
    hum_decay = 3.0 if name == 'classic' else 1.4  # epic: the hum makes way for the swell
    place(buf, 0.5 * hum([E2, B2, E3, B3], tail, hum_decay), HIT, az=-0.35)
    place(buf, 0.5 * hum([E2, B2, E3, B3], tail, hum_decay), HIT, az=0.35)
    place(buf, 0.05 * glass(hz(B5), 2.5, 0.6), HIT + 0.02, az=0.2, elev=0.6)
    if name == 'classic':
        place(buf, 0.1 * glass(hz(GS5), 2.5, 0.5), FOLD, az=0.3, elev=0.6)
        place(buf, 0.14 * (glass(hz(B5), END - NAME, 0.5) + glass(hz(E6), END - NAME, 0.45)), NAME, az=-0.2)
        wet_amt = 0.35
    else:
        swell = END - FOLD
        place(buf, 1.6 * section([E3, B3, E4, GS4, B4, DS5], swell, NAME - FOLD), FOLD, az=-0.45)
        place(buf, 1.6 * section([E3, B3, E4, GS4, B4, DS5], swell, NAME - FOLD), FOLD, az=0.45)
        place(buf, 1.6 * section([E2, B2, E3, GS3], swell, NAME - FOLD, spread=6, bright_lo=0.9, bright_hi=0.2), FOLD)
        place(buf, 0.08 * reverse_cymbal(NAME - FOLD), FOLD, elev=0.8)
        place(dry, 0.55 * boom(END - NAME, drop=4, decay=1.2), NAME)
        place(buf, 0.16 * struck(hz(E2), END - NAME, 0.8), NAME)
        place(buf, 0.12 * (glass(hz(B5), END - NAME, 0.5) + glass(hz(E6), END - NAME, 0.45)), NAME, az=-0.2, elev=0.6)
        wet_amt = 0.4
    irs = hall(length=4.0, decay=0.9)
    mix = dry + buf + wet_amt * np.stack([fftconvolve(buf[c], irs[c])[:N] for c in range(2)])
    low = np.stack([sosfilt(sos(2, 120), mix[c]) for c in range(2)])
    mix = mix - low + low.mean(0)  # mono low end
    mix += 0.3 * np.stack([sosfilt(sos(1, 3500, 'high'), mix[c]) for c in range(2)])
    mix *= np.clip((END - T) / 0.5, 0, 1)
    mix = np.tanh(1.3 * mix / np.abs(mix).max()) / np.tanh(1.3)
    mix *= 10 ** (-3 / 20) / np.abs(mix).max()
    sf.write(pathlib.Path(sys.argv[1]) / f'netflix-{name}.wav', mix.T.astype(np.float32), SR)
    print(name, 'ok')

render('classic', 31)
render('epic', 32)
