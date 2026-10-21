# JWIC sonic logo, "Atmos surround" direction (owner 2026-10-21: "Atmos Surround เอาแนวนี้"), on the premium cut's timing
# (premium_logo.py, 2026-10-20). Stereo, made to feel like a room of speakers: every layer has an azimuth (equal-power level,
# up to 0.35 ms interaural delay, the far ear shadowed, a source behind darker), what flies overhead gets a height lift,
# the hall is decorrelated per ear and wide, the low end stays mono. Outro events (src/scenes/Outro.tsx, 30 fps):
#   f0-46  voices circle the listener faster and faster and land together as the mark fills (f46), a whoosh flies over
#   f62    one glass note crosses overhead as the rose corner stands up
#   f98    the name is whole: a rain of high glass notes falls all around, the chord drifts on and dies by the end
# Usage: python atmos_logo.py <wav dir>  → atmos-cinema.wav (a cluster glides onto the chord), atmos-halo.wav (felt piano + halo)
import sys, pathlib
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
F = lambda f: f / 30
HIT, FOLD, NAME, END = F(46), F(62), F(98), F(199) + 0.4
N = int(END * SR)
T = np.arange(N) / SR
hz = lambda n: 440.0 * 2 ** ((n - 69) / 12)
E1, E2, B2, E3, GS3, B3, DS4, FS4, GS4, B4, E5 = 28, 40, 47, 52, 56, 59, 63, 66, 68, 71, 76
GS5, B5, DS6, E6, FS6, GS6, B6 = 80, 83, 87, 88, 90, 92, 95
CHORD = [E2, B2, GS3, DS4, FS4]  # Emaj9, open voicing
CLUSTER = [E2, B2, E3, GS3, B3, DS4, FS4, GS4, B4, E5]
RAIN = [B5, DS6, E6, FS6, GS6, B6]

sos = lambda order, f, btype='low': butter(order, f, btype=btype, fs=SR, output='sos')
LP_SHADOW, LP_REAR, HEIGHT = sos(1, 2800), sos(2, 2200), sos(2, [6000, 9500], 'band')
smooth = lambda x: x * x * (3 - 2 * x)
rng = np.random.default_rng(0)

def taper(sig, k=0.3):
    n = min(int(k * SR), len(sig) // 3)
    sig = sig.copy()
    sig[-n:] *= 0.5 * (1 + np.cos(np.linspace(0, np.pi, n)))
    return sig

def place(buf, sig, t0, az=0.0, elev=0.0):
    """Put sig at t0 seconds from azimuth az (radians, 0 = front, + = right; a number or one per sample)."""
    i = int(round(t0 * SR))
    sig = taper(sig)
    az = np.broadcast_to(np.asarray(az, float), sig.shape)
    if i < 0:
        sig, az, i = sig[-i:], az[-i:], 0
    sig, az = sig[: max(0, N - i)], az[: max(0, N - i)]
    s, rear = np.sin(az), np.clip(-np.cos(az), 0, 1) * 0.75
    x = sig * (1 - rear) + sosfilt(LP_REAR, sig) * rear
    if elev:
        x = x + elev * sosfilt(HEIGHT, x)
    dark = sosfilt(LP_SHADOW, x)
    n = np.arange(len(x))
    for ch, side in ((0, -1), (1, 1)):
        far = np.clip(-side * s, 0, 1)
        delay = np.maximum(-side * s, 0) * 0.00035 * SR
        near_x, far_x = np.interp(n - delay, n, x, left=0), np.interp(n - delay, n, dark, left=0)
        buf[ch, i:i + len(x)] += np.sqrt(0.5 * (1 + side * s)) * (near_x * (1 - 0.6 * far) + far_x * 0.6 * far)

def orbit(t0, spin, settle=0.06):
    """An azimuth path from t0: a slow circle that speeds up to `spin` rev/s at HIT, then eases to a drift."""
    tt = T[int(t0 * SR):]
    rise = np.clip((tt - t0) / (HIT - t0), 0, 1)
    speed = np.where(tt < HIT, 0.12 + spin * rise ** 1.5, settle + (0.12 + spin - settle) * np.exp(-(tt - HIT) / 0.35))
    return rng.uniform(-np.pi, np.pi) + rng.choice([-1, 1]) * 2 * np.pi * np.cumsum(speed) / SR

def crescendo(t0, decay):
    tt = T[int(t0 * SR):]
    return np.where(tt < HIT, np.clip((tt - t0) / (HIT - t0), 0, 1) ** 2.2, np.exp(-(tt - HIT) / decay))

def glide_voice(target, t0):
    """A soft band-limited saw that wanders round a random pitch, then glides onto its chord note to land on HIT;
    it brightens with the crescendo and mellows after."""
    tt = T[int(t0 * SR):]
    wander = rng.uniform(170, 400) * 2 ** (0.25 * np.sin(2 * np.pi * rng.uniform(0.3, 0.8) * tt + rng.uniform(0, 6.3)))
    w = smooth(np.clip((tt - (HIT - 1.0)) / 1.0, 0, 1))
    f = np.exp((1 - w) * np.log(wander) + w * np.log(hz(target) * 2 ** (rng.uniform(-4, 4) / 1200)))
    ph = 2 * np.pi * np.cumsum(f) / SR + rng.uniform(0, 6.3)
    bright = np.where(tt < HIT, 0.55 - 0.4 * np.clip((tt - t0) / (HIT - t0), 0, 1), 0.15 + 0.3 * (1 - np.exp(-(tt - HIT) / 1.2)))
    return sum(np.sin(k * ph) / k * np.exp(-k * bright) for k in range(1, 13)) * crescendo(t0, 2.6)

def rising_halo(target, t0):
    """A sine voice with a little chorus that rises a fifth onto its note by HIT."""
    tt = T[int(t0 * SR):]
    w = smooth(np.clip((tt - t0) / (HIT - t0), 0, 1))
    f = hz(target) * 2 ** ((w - 1) * 7 / 12 + 4 * np.sin(2 * np.pi * rng.uniform(0.2, 0.4) * tt) / 1200)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)) * crescendo(t0, 2.2)

def felt_piano(f, dur, vel=1.0):
    """Two slightly detuned strings, stretched partials, a soft felt attack, higher partials dying first."""
    t = np.arange(int(dur * SR)) / SR
    out = np.zeros(len(t))
    for detune in (-0.9, 0.9):
        fs = f * 2 ** (detune / 1200)
        for n in range(1, 14):
            fn = n * fs * np.sqrt(1 + 0.00035 * n * n)
            if fn > 15000:
                break
            amp = vel / n ** 1.35 * np.exp(-0.16 * n * (1.2 - vel))
            env = 0.5 * np.exp(-t / (0.3 / (1 + 0.08 * n))) + 0.5 * np.exp(-t / (3.2 / (1 + 0.32 * (n - 1))))
            out += amp * env * np.sin(2 * np.pi * fn * t + rng.uniform(0, 2 * np.pi))
    out *= np.minimum(1, t / 0.006)
    return (out + sosfilt(sos(2, 900), rng.standard_normal(len(t))) * np.exp(-t / 0.012) * 0.04) / 2

def glass(f, dur, vel=1.0):
    t = np.arange(int(dur * SR)) / SR
    parts = [(1.0, 1.0, 3.0), (2.01, 0.25, 1.4), (3.0, 0.08, 0.6), (5.4, 0.03, 0.25)]
    return vel * np.minimum(1, t / 0.01) * sum(a * np.exp(-t / d) * np.sin(2 * np.pi * f * r * t) for r, a, d in parts)

def warm_pad(notes, dur, attack=0.5):
    t = np.arange(int(dur * SR)) / SR
    out = np.zeros(len(t))
    for n in notes:
        for cents in (-8, -3, 3, 8):
            f, ph = hz(n) * 2 ** (cents / 1200), rng.uniform(0, 2 * np.pi)
            out += sum(np.sin(2 * np.pi * f * k * t + ph * k) / k for k in range(1, 9))
    return sosfilt(sos(2, 1600), out) * np.minimum(1, t / attack) * np.exp(-t / 3.5) / (len(notes) * 4)

def shimmer(notes, dur, attack=0.6):
    t = np.arange(int(dur * SR)) / SR
    out = np.zeros(len(t))
    for n in notes:
        for k, cents in enumerate((-6, 6)):
            drift = 2 ** ((cents + 3 * np.sin(2 * np.pi * (0.23 + 0.07 * k) * t)) / 1200)
            out += np.sin(2 * np.pi * hz(n) * np.cumsum(drift) / SR)
    return sosfilt(sos(2, 1800, 'high'), out) * np.minimum(1, t / attack) * np.exp(-t / 2.8) / (len(notes) * 2)

def boom(drop=5, decay=1.4):
    """The sub on HIT: E1 falling from a few semitones above, kept mono."""
    t = np.arange(int(2.6 * SR)) / SR
    f = hz(E1) * 2 ** (drop * np.exp(-t / 0.05) / 12)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) + 0.35 * np.sin(2 * ph)) * np.minimum(1, t / 0.008) * np.exp(-t / decay)

def sub_swell(length=0.9):
    t = np.arange(int(length * SR)) / SR
    return np.sin(2 * np.pi * hz(E1) * t) * (t / length) ** 3

def whoosh(dur=0.8, peak=0.5):
    """Noise whose energy climbs from low to high bands and peaks at `peak` s."""
    t = np.arange(int(dur * SR)) / SR
    noise = rng.standard_normal(len(t))
    bands = [(250, 800), (800, 2200), (2200, 5500), (5500, 12000)]
    out = sum(sosfilt(sos(2, b, 'band'), noise) * np.exp(-((t - peak * (0.6 + 0.12 * k)) / 0.18) ** 2) * (0.7 + 0.1 * k)
              for k, b in enumerate(bands))
    return out * np.where(t < peak, (t / peak) ** 2.5, np.exp(-(t - peak) / 0.12))

def flyover(length, a0, a1, travel):
    """An azimuth path from a0 to a1 over `travel` s, then still."""
    t = np.arange(int(length * SR)) / SR
    return a0 + (a1 - a0) * smooth(np.clip(t / travel, 0, 1))

def hall(length=4.5, decay=0.85, predelay=0.03):
    t = np.arange(int(length * SR)) / SR
    irs = []
    for _ in range(2):
        ir = sosfilt(sos(2, [180, 7000], 'band'), rng.standard_normal(len(t)) * np.exp(-t / decay))
        ir = np.concatenate([np.zeros(int(predelay * SR)), ir])
        irs.append(ir / np.sqrt((ir ** 2).sum()))
    return irs

def rain(buf, t0, count, span, vel):
    for _ in range(count):
        note = RAIN[rng.integers(len(RAIN))]
        place(buf, vel * rng.uniform(0.4, 1) * glass(hz(note), 1.6), t0 + span * rng.uniform(0, 1) ** 1.4,
              az=rng.uniform(-1.9, 1.9), elev=0.8)

def render(name, seed):
    global rng
    rng = np.random.default_rng(seed)
    buf = np.zeros((2, N))
    bloom = END - HIT
    if name == 'cinema':
        t0 = 0.12
        for k, n in enumerate(CLUSTER):
            place(buf, (0.16 if n < E3 else 0.1) * glide_voice(n, t0), t0, az=orbit(t0, 1.1) * (0.3 if n < E3 else 1))
        place(buf, 0.28 * sub_swell(), HIT - 0.9)
        place(buf, 0.5 * boom(), HIT)
        place(buf, 0.6 * warm_pad(CHORD, bloom + 0.2, 0.25), HIT - 0.05, az=-0.8)
        place(buf, 0.6 * warm_pad(CHORD, bloom + 0.2, 0.25), HIT - 0.05, az=0.8)
        place(buf, 0.28 * shimmer([B5, DS6, FS6], bloom), HIT + 0.05, az=2 * np.pi * 0.12 * np.arange(int(bloom * SR)) / SR)
        top = glass(hz(B5), END - NAME, 0.5) + glass(hz(E6), END - NAME, 0.45)
        rain_vel, wet_amt = 0.09, 0.45
    else:
        t0 = 0.3
        for n in [GS4, B4, DS4 + 12, FS4 + 12, B5]:
            place(buf, 0.09 * rising_halo(n, t0), t0, az=orbit(t0, 0.8, settle=0.08), elev=0.4)
        place(buf, 0.32 * boom(drop=2, decay=0.9), HIT)
        for k, n in enumerate(CHORD):
            place(buf, 0.55 * felt_piano(hz(n + 12), bloom, 0.85), HIT, az=-0.8 + 0.4 * k)
        place(buf, 0.75 * warm_pad(CHORD, bloom + 0.2, 0.35), HIT - 0.05, az=-0.8)
        place(buf, 0.75 * warm_pad(CHORD, bloom + 0.2, 0.35), HIT - 0.05, az=0.8)
        place(buf, 0.3 * shimmer([B5, DS4 + 24, FS4 + 24], bloom), HIT + 0.05, az=2 * np.pi * 0.1 * np.arange(int(bloom * SR)) / SR)
        top = felt_piano(hz(B5), END - NAME, 0.5) + felt_piano(hz(E6), END - NAME, 0.45)
        rain_vel, wet_amt = 0.07, 0.42
    w = whoosh()
    place(buf, 0.09 * w, HIT - 0.5, az=flyover(len(w) / SR, -2.6, 0.7, 0.6), elev=1.2)
    note = glass(hz(GS5), 3.0, 0.5)
    place(buf, 0.3 * note, FOLD, az=flyover(len(note) / SR, -1.2, 1.0, 0.9), elev=1.0)
    place(buf, 0.22 * top, NAME, az=-0.25)
    rain(buf, NAME + 0.05, 14, 1.1, rain_vel)
    irs = hall()
    mix = buf + wet_amt * np.stack([fftconvolve(buf[c], irs[c])[:N] for c in range(2)])
    low = np.stack([sosfilt(sos(2, 120), mix[c]) for c in range(2)])
    hi = mix - low
    mid, side = (hi[0] + hi[1]) / 2, (hi[0] - hi[1]) / 2  # mono low end
    mix = np.stack([low.mean(0) + mid + side, low.mean(0) + mid - side])
    mix += 0.5 * np.stack([sosfilt(sos(1, 3500, 'high'), mix[c]) for c in range(2)])
    mix *= np.clip((END - T) / 0.5, 0, 1) * np.clip(T / 0.05, 0, 1)
    mix = np.tanh(1.2 * mix / np.abs(mix).max()) / np.tanh(1.2)
    mix *= 10 ** (-3 / 20) / np.abs(mix).max()
    sf.write(pathlib.Path(sys.argv[1]) / f'atmos-{name}.wav', mix.T.astype(np.float32), SR)
    print(name, 'ok')

if __name__ == '__main__':
    render('cinema', 21)
    render('halo', 22)
