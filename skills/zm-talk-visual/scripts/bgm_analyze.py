#!/usr/bin/env python3
# 量背景音乐：速度（每分钟多少拍）、重拍（每小节第一拍）的时间、突然变响的地方、打击乐占比。
# 用来对拍子、找"炸开"，不用来判断好不好听（AI 听不到，歌由创作者用耳朵挑，见 references/bgm.md）。
#
# 用法：python3 scripts/bgm_analyze.py <歌1> [歌2 …] [--out 结果.json]（不写 --out 只打印，不写文件；要存就写到项目的中间稿文件夹里，别写进用户放素材的地方）
# 别的脚本可以 import：from bgm_analyze import analyze
import subprocess,numpy as np,sys,json
from scipy.ndimage import median_filter
import os as _os, sys as _sys; _sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__))); from _ff import FFMPEG
SR=22050
def load(p): return np.frombuffer(subprocess.run([FFMPEG,'-v','error','-i',p,'-f','f32le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout,np.float32)
def analyze(p):
    x=load(p); hop=512;n=2048; fps=SR/hop
    fr=np.lib.stride_tricks.sliding_window_view(x,n)[::hop]*np.hanning(n); S=np.abs(np.fft.rfft(fr,axis=1))
    H=median_filter(S,size=(17,1)); P=median_filter(S,size=(1,17)); perc=(P**2).sum()/((H**2).sum()+(P**2).sum())
    f=np.fft.rfftfreq(n,1/SR)
    flux=np.maximum(0,np.diff(np.log1p(S),axis=0)).sum(1); flux=np.concatenate([[0],flux]); flux=(flux-flux.mean())/(flux.std()+1e-9)
    low=np.log1p(S[:,f<150].sum(1)); lowf=np.maximum(0,np.diff(low,prepend=low[0]))
    ac=np.correlate(flux,flux,'full')[len(flux)-1:]; lags=np.arange(len(ac)); bpm=60*fps/np.maximum(lags,1); m=(bpm>70)&(bpm<180)
    lag=lags[m][np.argmax(ac[m])]; period=lag/fps
    # refine phase: sum flux at beat positions
    best=(-1,0)
    for ph in np.arange(0,period,1/fps):
        idx=((ph+np.arange(0,len(x)/SR-period,period))*fps).astype(int).clip(0,len(flux)-1); sc=flux[idx].sum()
        if sc>best[0]: best=(sc,ph)
    ph=best[1]; beats=ph+np.arange(0,len(x)/SR-0.01-ph,period)
    # downbeat: which of 4 offsets has most low-freq onset
    sc=[lowf[(beats[k::4]*fps).astype(int).clip(0,len(lowf)-1)].sum() for k in range(4)]
    db=beats[int(np.argmax(sc))::4]
    sec=[20*np.log10(np.sqrt((x[i:i+SR]**2).mean())+1e-9) for i in range(0,len(x)-SR,SR)]
    jumps=sorted(range(1,len(sec)),key=lambda i:-(sec[i]-sec[i-1]))[:3]
    return dict(file=p,dur=round(len(x)/SR,1),bpm=round(60/period,1),perc=round(float(perc),2),downbeats=[round(float(v),3) for v in db],jumps=[(int(j),float(round(float(sec[j]-sec[j-1]),1))) for j in jumps])
def main(argv):
    args=list(argv); out=None
    if '--out' in args: i=args.index('--out'); out=args[i+1]; del args[i:i+2]
    if not args: print('用法：python3 scripts/bgm_analyze.py <歌1> [歌2 …] [--out 结果.json]'); return 2
    res={}
    for p in args:
        r=analyze(p); res[p]=r; print(f"{p.split('/')[-1][:30]:30s} {r['dur']}s BPM {r['bpm']} 打击乐占比 {r['perc']} 第一小节 {r['downbeats'][:2]} 突然变响 {r['jumps']}")
    if out: json.dump(res,open(out,'w',encoding='utf-8'),ensure_ascii=False); print('写到', out)
if __name__=='__main__': sys.exit(main(sys.argv[1:]))
