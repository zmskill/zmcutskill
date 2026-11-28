"""Measure a music track before animating to it: tempo, beats, downbeats, loudness per bar, quiet spots and the drop.

usage: python3 beats.py song.mp3 [--out beats.json] [--start 0 --dur 30] [--near 116]
Writes beats.json:
  {"bpm":..., "beats":[...], "downbeats":[...], "bars":[{"t":..,"db":..}], "drop": t, "quiet":[[a,b],...], "hits":[...]}
How to use it: state changes on beats, cuts and big moments on downbeats, the magic moment on the drop (or the
first downbeat after a quiet spot), clicks and whooshes on "hits" (the strongest transients).
Numbers come from measurement only — check them against the music by listening (the person, not the AI).
Needs: ffmpeg, numpy.
"""
import argparse, json, subprocess
import numpy as np

ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('--out', default='beats.json')
ap.add_argument('--near', type=float, default=120, help='expected tempo if you know it roughly (sparse music can fool the detector)')
ap.add_argument('--start', type=float, default=0); ap.add_argument('--dur', type=float, default=0)
a = ap.parse_args()
SR = 22050
cmd = ['ffmpeg', '-v', 'error', '-ss', str(a.start)] + (['-t', str(a.dur)] if a.dur else []) + ['-i', a.src, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-']
x = np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, '<i2').astype(np.float32) / 32768
if len(x) < SR * 4: raise SystemExit('ERROR: need at least 4 seconds of audio')
hop = 256; win = 1024; fps = SR / hop
fr = np.lib.stride_tricks.sliding_window_view(x, win)[::hop] * np.hanning(win)
S = np.log1p(np.abs(np.fft.rfft(fr, axis=1)) * 10)
flux = np.maximum(0, np.diff(S, axis=0)).sum(1); flux = np.r_[0, flux]
low = np.maximum(0, np.diff(S[:, :12], axis=0)).sum(1); low = np.r_[0, low]          # < ~260 Hz: kick
on = flux - np.convolve(flux, np.ones(16) / 16, 'same'); on = np.maximum(on, 0)

# tempo: autocorrelation of the onset curve, 70–180 BPM, mild preference around 120
ac = np.correlate(on, on, 'full')[len(on) - 1:]
lags = np.arange(len(ac)); bpm_of = 60 * fps / np.maximum(lags, 1)
m = (bpm_of >= 70) & (bpm_of <= 180)
score = ac * np.exp(-0.5 * (np.log2(bpm_of / a.near) / (1.0 if a.near == 120 else .3)) ** 2)
lag = int(lags[m][np.argmax(score[m])])
# refine lag with parabolic peak
if 1 <= lag < len(ac) - 1:
    y0, y1, y2 = ac[lag - 1], ac[lag], ac[lag + 1]; lag_f = lag + 0.5 * (y0 - y2) / (y0 - 2 * y1 + y2 + 1e-9)
else: lag_f = lag
bpm = 60 * fps / lag_f; period = lag_f

# beat phase: comb that best lines up with onsets
best = (-1, 0)
for ph in range(int(period)):
    idx = np.arange(ph, len(on), period).astype(int); s = on[idx].sum()
    if s > best[0]: best = (s, ph)
beats = np.arange(best[1], len(on), period) / fps
# downbeat: which of the 4 phases has the strongest low-end onsets
bi = (beats * fps).astype(int); bi = bi[bi < len(low)]
k = int(np.argmax([low[bi[j::4]].sum() for j in range(4)])) if len(bi) >= 8 else 0
downs = beats[k::4]

rms = np.sqrt(np.convolve(x ** 2, np.ones(hop) / hop, 'same')[::hop] + 1e-12)
def db(a0, a1):
    i0, i1 = int(a0 * fps), max(int(a0 * fps) + 1, int(a1 * fps)); return float(20 * np.log10(rms[i0:i1].mean() + 1e-9))
bars = [{'t': round(float(t), 3), 'db': round(db(t, t + 4 * period / fps), 1)} for t in downs if t + 4 * period / fps <= len(x) / SR]
drop = None
if len(bars) >= 3:
    jumps = [bars[i]['db'] - min(bars[max(0, i - 2)]['db'], bars[i - 1]['db']) for i in range(1, len(bars))]
    i = int(np.argmax(jumps)) + 1
    if jumps[i - 1] > 3: drop = bars[i]['t']
# quiet spots: 0.4 s+ more than 12 dB below the median
lvl = 20 * np.log10(rms + 1e-9); med = np.median(lvl); quiet = []; s = None
for i, v in enumerate(list(lvl < med - 12) + [False]):
    if v and s is None: s = i
    if not v and s is not None:
        if (i - s) / fps >= 0.4: quiet.append([round(s / fps + a.start, 2), round(i / fps + a.start, 2)])
        s = None
hits = np.argsort(on)[::-1]; picked = []
for h in hits:
    if all(abs(h - p) > fps * 0.25 for p in picked): picked.append(h)
    if len(picked) >= 16: break
res = {'bpm': round(float(bpm), 2), 'beats': [round(float(t) + a.start, 3) for t in beats],
       'downbeats': [round(float(t) + a.start, 3) for t in downs], 'bars': [{**b, 't': round(b['t'] + a.start, 3)} for b in bars],
       'drop': None if drop is None else round(drop + a.start, 3), 'quiet': quiet,
       'hits': sorted(round(float(h / fps) + a.start, 3) for h in picked)}
json.dump(res, open(a.out, 'w'), indent=1)
print(f"bpm {res['bpm']}  beats {len(res['beats'])}  first downbeat {res['downbeats'][0] if res['downbeats'] else '-'} s")
print('bar loudness:', ' '.join(f"{b['t']:.1f}:{b['db']:.0f}" for b in res['bars']))
print('drop:', res['drop'], ' quiet:', res['quiet'])
print('ok', a.out)
