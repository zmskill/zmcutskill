"""Cut a song down to the film's length on bar lines, so every edit lands on a downbeat and nothing sounds chopped.

step 1  python3 cut_song.py song.mp3 --beats beats.json --list
        prints every bar: start time, loudness, and marks the drop (音乐炸开) and quiet bars (安静段).
step 2  python3 cut_song.py song.mp3 --beats beats.json --take 0-2,12-20 --out audio/music.wav [--fade 0.8]
        keeps bars 0–1 and 12–19 (end bar not included), joined at downbeats with a 25 ms crossfade, and writes
        audio/music.wav plus audio/music.beats.json (the beat grid of the CUT version — use this one for the film).
Bars count from 0 = the first downbeat in beats.json. Run beats.py on the song first.
Tips: keep 1–2 bars before the drop so the film can breathe in; put the magic moment on the drop's first beat;
a quiet bar is the place for the hush before it. The person listens to the cut — the AI cannot hear it.
Needs: ffmpeg, numpy.
"""
import argparse, json, subprocess, wave
import numpy as np

ap = argparse.ArgumentParser(); ap.add_argument('song'); ap.add_argument('--beats', required=True)
ap.add_argument('--list', action='store_true'); ap.add_argument('--take', default=''); ap.add_argument('--out', default='music.wav')
ap.add_argument('--fade', type=float, default=0.8, help='fade-out at the end, seconds (0 = none)')
a = ap.parse_args()
B = json.load(open(a.beats)); beats = np.array(B['beats']); P = float(np.median(np.diff(beats)))
dn = np.array(B['downbeats'])
SR = 48000
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', a.song, '-ac', '2', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
X = np.frombuffer(raw, '<i2').reshape(-1, 2).astype(np.float32) / 32768
dur = len(X) / SR
bars = list(dn) + [dn[-1] + 4 * P * k for k in range(1, 4)]
bars = [b for b in bars if b <= dur + 1e-3]

def db(s, e):
    seg = X[int(s * SR):int(e * SR)]; return 20 * np.log10(np.sqrt((seg ** 2).mean()) + 1e-9) if len(seg) else -99

if a.list or not a.take:
    lv = [db(bars[i], bars[i + 1]) for i in range(len(bars) - 1)]; med = np.median(lv)
    jumps = [lv[i] - min(lv[max(0, i - 2):i]) if i else 0 for i in range(len(lv))]; drop = int(np.argmax(jumps))
    print(f'{60 / P:.1f} BPM · bar = {4 * P:.2f} s · {len(lv)} full bars')
    for i, v in enumerate(lv):
        tag = ' ← 炸开 drop' if i == drop and jumps[i] > 3 else (' · 安静 quiet' if v < med - 6 else '')
        print(f'bar {i:3d}  {bars[i]:7.2f}s  {v:6.1f} dB  {"█" * max(0, int((v - med + 12) / 1.5))}{tag}')
    if not a.take: raise SystemExit(0)

segs = []
for part in a.take.split(','):
    s, e = map(int, part.split('-'))
    if not (0 <= s < e < len(bars)): raise SystemExit(f'ERROR: bars {part} out of range (0–{len(bars) - 1})')
    segs.append((s, e))
xf = int(.025 * SR); out = np.zeros((0, 2), np.float32); new_beats = []; cursor = 0.0
for s, e in segs:
    t0, t1 = bars[s], bars[e]; seg = X[int(t0 * SR):int(t1 * SR) + xf].copy()
    for b in beats[(beats >= t0 - 1e-3) & (beats < t1 - 1e-3)]: new_beats.append(round(float(cursor + b - t0), 4))
    if len(out):
        r = np.linspace(0, 1, xf)[:, None]
        out[-xf:] = out[-xf:] * np.cos(r * np.pi / 2) + seg[:xf] * np.sin(r * np.pi / 2); seg = seg[xf:]
    out = np.vstack([out, seg]); cursor += t1 - t0
out = out[:int(cursor * SR)]
if a.fade > 0:
    n = int(a.fade * SR); out[-n:] *= np.linspace(1, 0, n)[:, None]
with wave.open(a.out, 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((np.clip(out, -1, 1) * 32767).astype('<i2').tobytes())
nb = np.array(new_beats); nd = [float(nb[i]) for i in range(0, len(nb), 4)]
meta = {'bpm': B['bpm'], 'beats': new_beats, 'downbeats': nd, 'source': a.song, 'take': a.take, 'duration': round(cursor, 3)}
bj = a.out.rsplit('.', 1)[0] + '.beats.json'; json.dump(meta, open(bj, 'w'), indent=1)
print(f'ok {a.out}  {cursor:.2f} s · {len(new_beats)} beats · {len(nd)} bars · grid → {bj}')
