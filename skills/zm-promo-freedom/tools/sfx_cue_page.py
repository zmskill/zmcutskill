#!/usr/bin/env python3
"""按片子的音效清单（audio/音效清单.json，格式见 references/sound-and-sfx.md）出一个逐条试听页，交片时一起给用户。
用户不用每条都回；听到哪条不对，在页面上选一下、写一句，点按钮复制发回来，再写进清单的「用户反馈」。

  python3 tools/sfx_cue_page.py <音效清单.json> <音效库文件夹> <输出.html>

「文件」写库里的相对路径（如 补缺/20_短甩/长刀挥过_….wav）；不在库里的（Freesound 新下载的）写相对清单所在文件夹的路径。
页面用相对路径引用音频，生成后别单独挪走 html。"""
import html, json, os, sys
sheet_p, lib, out = [os.path.abspath(os.path.expanduser(a)) for a in sys.argv[1:4]]
sh = json.load(open(sheet_p, encoding='utf-8'))
rec = {}
p = os.path.join(lib, '音效库记录.json')
if os.path.exists(p): rec = {r['文件']: r for r in json.load(open(p, encoding='utf-8'))['音效']}
base = os.path.dirname(out); rows = []; miss = []
for i, c in enumerate(sorted(sh['音效'], key=lambda c: c['时间']), 1):
    f = c.get('文件', ''); r = rec.get(f)
    path = os.path.join(lib, f) if r else os.path.join(os.path.dirname(sheet_p), f)
    if not os.path.exists(path): miss.append(f)
    src = os.path.relpath(path, base)
    what = (r['分类'] + '：' + r['描述']) if r else '（不在库里）'
    synth = '合成' in (r or {}).get('材质', '') or '合成' in json.dumps((r or {}).get('来源', {}), ensure_ascii=False)
    rows.append('<tr><td>%d</td><td><b>%.2f s</b><br><span class=d>%s</span></td><td>%s<br><span class=d>为什么配：%s · %s</span></td>'
                '<td>%s%s<br><span class=d>%s</span><br><audio controls preload="none" src="%s"></audio></td>'
                '<td><select id="r%d"><option></option><option>好</option><option>不对</option><option>太响</option><option>太轻</option></select>'
                '<input id="n%d" placeholder="一句话（可空）"></td></tr>'
                % (i, c['时间'], html.escape(str(c.get('对着', ''))), html.escape(c.get('画面', '')), html.escape(c.get('为什么配', '')), html.escape(c.get('类别', '')),
                   '<span class=t>合成</span>' if synth else '', html.escape(os.path.basename(f)), html.escape(what), html.escape(src), i, i))
H = ['<!doctype html><meta charset="utf-8"><title>音效试听 · %s</title>' % html.escape(sh['片子']),
     '<style>body{font:14px/1.5 -apple-system,"PingFang SC",sans-serif;max-width:1150px;margin:24px auto;padding:0 16px;color:#222}'
     'table{border-collapse:collapse;width:100%}td{border-bottom:1px solid #eee;padding:8px 6px;vertical-align:top}.d{color:#888;font-size:12px}'
     '.t{font-size:11px;background:#eef3ff;color:#3355aa;border-radius:8px;padding:0 6px;margin-right:4px}audio{width:260px;height:30px;margin-top:4px}'
     'input{width:150px;margin-top:4px}button{font-size:15px;padding:8px 14px;margin:18px 0}textarea{width:100%;height:120px}</style>',
     '<h1>音效试听 · %s</h1><p>一共 %d 下。时间是成片里的秒（画面那一刻）。不用每条都回：听到不对的选一下、写一句，最后点按钮复制发回来。</p>' % (html.escape(sh['片子']), len(rows)),
     '<table><tr><td>#</td><td>时间</td><td>画面</td><td>用的音效</td><td>你的反应</td></tr>', *rows, '</table>',
     '<button onclick="go()">生成我的反应</button><textarea id="o" readonly></textarea>',
     '<script>const T=%s;function go(){let s="音效反应 · %s：\\n";T.forEach((t,i)=>{const r=document.getElementById("r"+(i+1)).value,n=document.getElementById("n"+(i+1)).value;if(r||n)s+="#"+(i+1)+" "+t+" 秒："+r+(n?"，"+n:"")+"\\n"});document.getElementById("o").value=s;navigator.clipboard&&navigator.clipboard.writeText(s)}</script>'
     % (json.dumps([round(c['时间'], 2) for c in sorted(sh['音效'], key=lambda c: c['时间'])]), html.escape(sh['片子']))]
os.makedirs(base, exist_ok=True); open(out, 'w', encoding='utf-8').write('\n'.join(H))
print('试听页：', out, '，', len(rows), '条' + ('；找不到文件：' + '、'.join(miss) if miss else ''))
