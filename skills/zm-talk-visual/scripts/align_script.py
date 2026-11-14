#!/usr/bin/env python3
# 把校对过的字幕稿对到听写出来的逐字时间上，输出每行字幕的起止时间。
#
# 用法：python3 scripts/align_script.py <tokens.json> <字幕稿.txt> <输出 subs.json>
#   tokens.json：听写结果，[[文字, 开始秒], …]（scripts/transcribe.py 出的逐字时间整理成这个样子）
#   字幕稿.txt：一行一条字幕，是用户校对过的文字（错字以它为准）
#   输出：[[开始秒, 结束秒, 文字], …]，画面里的 Subtitle 和 mkW() 都读它；
#   同时出 <输出名>_chars.json：每行每个字的秒数，mkW(SUBS, CHARS) 用它对到字
# 对不上的字（稿子和听写不一样的地方）按前后的时间插值，并逐处列出来：这些字的时间是猜的。
import json, re, difflib, sys
if len(sys.argv) < 4: print('用法：align_script.py <tokens.json> <字幕稿.txt> <输出 subs.json>'); sys.exit(2)
TOK, SCRIPT, OUT = sys.argv[1:4]
tok=json.load(open(TOK, encoding='utf-8'))
num={'零':'0','一':'1','二':'2','三':'3','四':'4','五':'5','六':'6','七':'7','八':'8','九':'9'}
asr=[];at=[]
for x,ts in tok:
    for ch in x.lower():
        if ch.strip(): asr.append(ch); at.append(ts)
lines=[l.strip() for l in open(SCRIPT, encoding='utf-8') if l.strip()]
keep=lambda s:[c for c in s.lower() if re.match(r'[0-9a-z一-鿿]',c)]
cor=[];owner=[]
for i,l in enumerate(lines):
    for c in keep(l): cor.append(c); owner.append(i)
sm=difflib.SequenceMatcher(None,''.join(cor),''.join(asr),autojunk=False)
ct=[None]*len(cor)
for a,b,n in sm.get_matching_blocks():
    for k in range(n): ct[a+k]=at[b+k]
# 先记下没对上的字（补时间之前）：稿子和听写不一样的地方，时间是猜的，要看一眼
miss=[i for i,v in enumerate(ct) if v is None]
runs=[]
for i in miss:
    if runs and i==runs[-1][1]+1: runs[-1][1]=i
    else: runs.append([i,i])
# 没对上的字用前后插值
known=[i for i,v in enumerate(ct) if v is not None]
for i in range(len(ct)):
    if ct[i] is None:
        p=max([k for k in known if k<i],default=None); n=min([k for k in known if k>i],default=None)
        if p is None: ct[i]=ct[n]
        elif n is None: ct[i]=ct[p]+0.12*(i-p)
        else: ct[i]=ct[p]+(ct[n]-ct[p])*(i-p)/(n-p)
for i in range(1,len(ct)): ct[i]=max(ct[i],ct[i-1])
CT=''.join(cor)
subs=[]
for i,l in enumerate(lines):
    idx=[k for k,o in enumerate(owner) if o==i]
    subs.append([round(ct[idx[0]],2),round(ct[idx[-1]]+0.3,2),l])
for i in range(len(subs)-1): subs[i][1]=round(min(subs[i][1],subs[i+1][0]-0.02),2)
json.dump(subs, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False)
# 每行每个字说出来的秒数（和字幕行里的字一一对应，标点和空格取后面那个字的时间），画面里 mkW(SUBS, CHARS) 用它对到字
chars=[]; k=0
for i,l in enumerate(lines):
    ts=[]; pend=0
    for c in l:
        if re.match(r'[0-9a-z一-鿿]',c.lower()):
            ts += [round(ct[k],3)]*(pend+1); pend=0; k+=1
        else: pend+=1
    ts += [ts[-1] if ts else subs[i][0]]*pend
    chars.append(ts)
CHARS_OUT=OUT[:-5]+'_chars.json' if OUT.endswith('.json') else OUT+'_chars.json'
json.dump(chars, open(CHARS_OUT, 'w', encoding='utf-8'))
print(f'{len(subs)} 行 → {OUT}（逐字时间 → {CHARS_OUT}）；稿子里没在听写中对上的字 {len(miss)} 个、{len(runs)} 处（时间是按前后猜的）；文字一致率 {round(sm.ratio(), 3)}（只比文字，不代表听写准不准、时间准不准）')
for r0,r1 in runs[:20]:
    ln=owner[r0]; print(f'  第 {ln+1} 行「{lines[ln]}」里的「{CT[r0:r1+1]}」：约 {ct[r0]:.2f} 秒')
if len(runs)>20: print(f'  …还有 {len(runs)-20} 处')
