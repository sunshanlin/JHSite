import sys, json, numpy as np, librosa
wav, bd = sys.argv[1], json.load(open(sys.argv[2]))
y, sr = librosa.load(wav, sr=None, mono=True)
T, t0 = bd['T'], bd['t0']; dur = len(y)/sr
hop = 512
C = librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=hop)
M = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13, hop_length=hop)
ft = librosa.times_like(C, sr=sr, hop_length=hop)
def barfeat(b):
    a, e = t0 + b*4*T, t0 + (b+1)*4*T
    m = (ft >= a) & (ft < e)
    v = np.concatenate([C[:, m].mean(1), M[1:, m].mean(1)/40])
    return v/np.linalg.norm(v)
nb = int((dur - t0)/(4*T))
F = [barfeat(b) for b in range(nb)]
sim = lambda a, b: float(F[a] @ F[b])
rows = []
for gap in (int(g) for g in sys.argv[3].split(",")):
    for i in range(10, 40):
        j = i + gap
        if j >= nb - 1: continue
        s = (sim(i-1, j-1) + sim(i, j) + sim(i-2, j-2)) / 3
        L = (t0 + i*4*T) + (dur - (t0 + j*4*T))
        hit = (t0 + i*4*T) + (121.255 - (t0 + j*4*T))
        rows.append((s, i, j, gap, L, hit))
rows.sort(reverse=True)
print(" score   cutA(bar,t)    joinB(bar,t)   gap  videoLen  finalHit@")
for s, i, j, g, L, h in rows[:12]:
    print(f" {s:.4f}  {i:3d} {t0+i*4*T:6.2f}   {j:3d} {t0+j*4*T:7.2f}   {g}   {L:6.2f}   {h:6.2f}")
