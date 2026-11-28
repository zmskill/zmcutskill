#!/usr/bin/env python3
"""开工体检：一条命令查清做片要的东西有没有、这个环境有什么限制、依赖装在哪。
用法：python3 tools/doctor.py [--work 工作区路径] [--in-skill]
只查不装。按最后的"建议"去做；每样要装的东西，装之前先问用户。"""
import argparse, filecmp, glob, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _ff import find_ffmpeg
import _where

ap = argparse.ArgumentParser()
ap.add_argument('--work', default=_where.DEFAULT_WORK)
ap.add_argument('--in-skill', action='store_true', help='依赖直接用 skill 自己的 remotion/')
a = ap.parse_args()
SKILL = _where.SKILL
rows, todo = [], []

def row(name, ok, detail):
    rows.append((('有' if ok else '缺') if ok is not None else '—', name, detail))

def ver(cmd):
    try:
        return subprocess.run(cmd, capture_output=True, text=True, timeout=20).stdout.strip().splitlines()[0]
    except Exception:
        return None

def reach(host):
    # 走和真实下载一样的路（会用 HTTPS_PROXY 等代理设置）；服务器回了任何状态码都算连得上
    import urllib.request, urllib.error
    try:
        urllib.request.urlopen(urllib.request.Request(f'https://{host}/', method='HEAD'), timeout=8); return True
    except urllib.error.HTTPError:
        return True
    except Exception:
        return False

# ── 环境本身 ──
mounted = _where.mounted()
row('skill 文件夹是挂进来的（Cowork 这类环境）', None, '是' if mounted else '看起来不是')
USES = {'registry.npmjs.org': 'npm 装 Remotion 依赖', 'remotion.media': 'Remotion 第一次渲染时下载浏览器',
        'pypi.org': 'pip 装 Python 小包、ffmpeg', 'freesound.org': '音效库里没有合适的时，去 Freesound 搜（可选）'}
net = {h: reach(h) for h in USES}
for h, ok in net.items(): row(f'能连上 {h}', ok, USES[h])

# ── 工具 ──
row('Python 3.9+', sys.version_info >= (3, 9), sys.version.split()[0])
for mod, pipname, need in (('numpy', 'numpy', True), ('PIL', 'pillow', True), ('cv2', 'opencv-python', False)):
    try:
        __import__(mod); row(f'Python 包 {pipname}', True, '')
    except Exception:
        if need:
            row(f'Python 包 {pipname}', False, 'python3 tools/setup.py python'); todo.append('装 Python 包：python3 tools/setup.py python')
        else:
            row(f'Python 包 {pipname}（只在自建镜头、复刻时用）', False, '要自建镜头时：python3 tools/setup.py cv')
ff = find_ffmpeg()
row('ffmpeg', bool(ff), ff or 'python3 tools/setup.py ffmpeg')
if not ff: todo.append('装 ffmpeg：python3 tools/setup.py ffmpeg')
nv = ver(['node', '-v'])
row('Node.js', bool(nv), nv or '系统软件，见 references/setup-help.md《装 Node.js》')
if not nv: todo.append('装 Node.js：照 references/setup-help.md《装 Node.js》，问过用户再装')

# ── Remotion 依赖装在哪 ──
uw = _where.use_work(a.in_skill)
rdir = _where.remotion_dir(a.work, a.in_skill)
has_nm = _where.has_deps(rdir)
row('Remotion 依赖', has_nm, rdir)
if not has_nm:
    todo.append(f'装 Remotion 依赖（装在{"工作区 " if uw else " "}{rdir}{"，不进 skill 文件夹" if uw else ""}）：python3 tools/setup.py remotion')

# 工作区里的代码是不是和 skill 一样新（skill 更新后，工作区那份副本不会自己变）
if uw and has_nm:
    stale = []
    for dp, dn, fn in os.walk(os.path.join(SKILL, 'remotion')):
        dn[:] = [d for d in dn if d not in ('node_modules', 'out', '__pycache__')]
        for f in fn:
            if f in ('.DS_Store', 'shotlab-root.tsx'): continue
            s = os.path.join(dp, f); w = os.path.join(os.path.dirname(rdir), os.path.relpath(s, SKILL))
            if not os.path.exists(w) or not filecmp.cmp(s, w, shallow=False): stale.append(os.path.relpath(s, SKILL))
    row('工作区的渲染环境和 skill 一样新', not stale, '一样' if not stale else f'有 {len(stale)} 个文件不一样（比如 {stale[0]}）')
    if stale: todo.append('skill 更新过，工作区里那份还是旧的：python3 tools/setup.py remotion（只换代码和素材，不重装依赖）')

# 浏览器：已有的无头浏览器，或 Remotion 自己下载过的
pats = ['/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell',
        os.path.expanduser('~/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell'),
        os.path.expanduser('~/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell'),
        os.path.join(rdir, 'node_modules', '.remotion', '*', '*', 'chrome-headless-shell*')]
br = os.environ.get('REMOTION_BROWSER') or next((g for p in pats for g in glob.glob(p)), None)
if br:
    row('渲染用的浏览器', True, br)
elif net['remotion.media']:
    row('渲染用的浏览器', False, '还没有')
    todo.append('装渲染用的浏览器（Remotion 自带的，从 remotion.media 下载）：python3 tools/setup.py browser')
else:
    row('渲染用的浏览器', False, '没有，而且连不上 remotion.media')
    todo.append('渲染用的浏览器装不上：remotion.media 被拦了。照 references/setup-help.md《网站被拦了》带用户放行，放行后 python3 tools/setup.py browser')

w = max(len(r[1]) for r in rows)
print('体检结果\n')
for s, n, d in rows: print(f'  [{s}] {n.ljust(w)}  {d}')
blk = [h for h, ok in net.items() if not ok and h not in ('remotion.media', 'freesound.org')]
if blk: todo.append('这些网站连不上：' + '、'.join(blk) + '。要用到时照 references/setup-help.md《网站被拦了》带用户放行')
if not net['freesound.org']: print('\n提示：连不上 freesound.org 不影响做片，只是库里没有合适的音效时没法去现搜。')
print('\n建议：' + (('依赖装在工作区 ' + a.work + '（skill 文件夹是挂进来的用户文件夹，不往里装东西）。' if mounted else
                   '依赖装在工作区 ' + a.work + '，skill 文件夹保持干净。') if uw else '依赖直接装在 skill 的 remotion/ 里。'))
print('截真实页面（素材入口）用的 puppeteer 在用户的产品项目里装，见 references/capture-and-build.md。')
if todo:
    print('还缺（每样装之前先问用户）：')
    for t in todo: print('  - ' + t)
else:
    print('都齐了，可以开工。')
