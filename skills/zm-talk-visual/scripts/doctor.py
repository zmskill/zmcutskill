#!/usr/bin/env python3
"""开工体检：一条命令查清做片要的东西有没有、这个环境有什么限制、依赖该装在哪。
用法：python3 scripts/doctor.py [--work 工作区路径] [--in-skill]
只查不装。按最后的"建议"去做；每样要装的东西，装之前先问用户。"""
import argparse, glob, os, subprocess, sys, tempfile

SKILL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(SKILL, 'scripts'))
from _ff import find_ffmpeg

# 依赖装在哪：IN_SKILL = True 时装进 skill 自己的 remotion/；False 时在工作区搭一份副本（scripts/workdir.sh），
# 依赖、素材、片子代码都放那里，skill 文件夹保持干净。skill 文件夹是挂进来的（Cowork 这类环境）时一律用工作区。
IN_SKILL = False  # 开源版：默认装在工作区，skill 文件夹保持干净

ap = argparse.ArgumentParser()
ap.add_argument('--work', default=os.environ.get('ZM_WORK', os.path.expanduser('~/zm-work/zm-talk-visual')))
ap.add_argument('--in-skill', action='store_true')
a = ap.parse_args()
ASR = os.environ.get('VK_ASR_DIR', os.path.expanduser('~/.cache/zm-talk-visual/asr'))
rows, todo = [], []

def row(name, ok, detail):
    rows.append((('有' if ok else '缺') if ok is not None else '—', name, detail))

def ver(cmd):
    try:
        return subprocess.run(cmd, capture_output=True, text=True, timeout=20).stdout.strip().splitlines()[0]
    except Exception:
        return None

# ── 环境本身 ──
mounted = any(k in SKILL for k in ('/mnt/', '/sessions/'))
row('skill 文件夹是挂进来的（Cowork 这类环境）', None, '是' if mounted else '看起来不是')

def reach(host):
    # 走和真实下载一样的路（会用 HTTPS_PROXY 等代理设置）；服务器回了任何状态码都算连得上
    import urllib.request, urllib.error
    try:
        urllib.request.urlopen(urllib.request.Request(f'https://{host}/', method='HEAD'), timeout=8); return True
    except urllib.error.HTTPError:
        return True
    except Exception:
        return False
net = {h: reach(h) for h in ('registry.npmjs.org', 'remotion.media', 'github.com', 'pypi.org')}
for h, ok in net.items():
    row(f'能连上 {h}', ok, {'registry.npmjs.org': 'npm install 用', 'remotion.media': 'Remotion 第一次渲染时下载浏览器', 'github.com': '下载听写模型', 'pypi.org': 'pip 装小库'}[h])

# ── 工具 ──
py = sys.version.split()[0]
row('Python 3.9+', sys.version_info >= (3, 9), py)
for mod, pipname in (('numpy', 'numpy'), ('PIL', 'pillow'), ('scipy', 'scipy')):
    try:
        __import__(mod); row(f'Python 包 {pipname}', True, '')
    except Exception:
        row(f'Python 包 {pipname}', False, 'python3 scripts/setup.py python'); todo.append('装 Python 包：python3 scripts/setup.py python')
ff = find_ffmpeg()
row('ffmpeg', bool(ff), ff or 'python3 scripts/setup.py ffmpeg')
if not ff: todo.append('装 ffmpeg：python3 scripts/setup.py ffmpeg')
nv = ver(['node', '-v'])
row('Node.js', bool(nv), nv or '系统软件，见 references/setup-help.md《装 Node.js》')
if not nv: todo.append('装 Node.js：照 references/setup-help.md《装 Node.js》，问过用户再装')

# ── Remotion 依赖装在哪 ──
use_work = mounted or not (IN_SKILL or a.in_skill)
rdir = os.path.join(a.work, 'remotion') if use_work else os.path.join(SKILL, 'remotion')
has_nm = os.path.exists(os.path.join(rdir, 'node_modules', '.bin', 'remotion'))
row('Remotion 依赖', has_nm, rdir)
if not has_nm:
    if use_work:
        todo.append(f'装 Remotion 依赖（装在工作区 {rdir}，不进 skill 文件夹）：python3 scripts/setup.py remotion')
    else:
        todo.append(f'装 Remotion 依赖（装在 {rdir}）：python3 scripts/setup.py remotion')

# ── 工作区里的代码是不是和 skill 一样新（skill 更新后，工作区那份副本不会自己变）──
if use_work and has_nm:
    import filecmp
    stale = []
    for top in ('remotion/projects', 'shot-library', 'styles'):
        for dp, dn, fn in os.walk(os.path.join(SKILL, top)):
            dn[:] = [d for d in dn if d not in ('node_modules', '__pycache__')]
            for f in fn:
                if f.endswith(('.mp4', '.pyc')) or f == '.DS_Store': continue
                s = os.path.join(dp, f); w = os.path.join(a.work, os.path.relpath(s, SKILL))
                if not os.path.exists(w) or not filecmp.cmp(s, w, shallow=False): stale.append(os.path.relpath(s, SKILL))
    row('工作区的代码和 skill 一样新', not stale, '一样' if not stale else f'有 {len(stale)} 个文件和 skill 里的不一样（比如 {stale[0]}）')
    if stale: todo.append('skill 更新过，工作区里那份代码还是旧的：python3 scripts/setup.py remotion（只换代码，不重装依赖，不动 Root.tsx 里登记过的片子）')

# 浏览器：已有的无头浏览器，或 Remotion 自己下载过的
pats = ['/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell',
        os.path.expanduser('~/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell'),
        os.path.expanduser('~/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell'),
        os.path.join(rdir, 'node_modules', '.remotion', '*', '*', 'chrome-headless-shell*')]
br = os.environ.get('CHROME') or next((g for p in pats for g in glob.glob(p)), None)
if br:
    row('渲染用的浏览器', True, br)
elif net['remotion.media']:
    row('渲染用的浏览器', False, '还没有')
    todo.append('装渲染用的浏览器（Remotion 自带的，从 remotion.media 下载）：python3 scripts/setup.py browser')
else:
    row('渲染用的浏览器', False, '没有，而且连不上 remotion.media')
    todo.append('渲染用的浏览器装不上：remotion.media 被拦了。照 references/setup-help.md《网站被拦了》带用户放行，放行后 python3 scripts/setup.py browser')

# ── 听写 ──
has_asr = os.path.isdir(os.path.join(ASR, 'runtime')) and bool(glob.glob(os.path.join(ASR, 'sherpa-onnx-sense-voice-*')))
row('离线听写模型（下载约 670 MB，装好占约 2.1 GB）', has_asr, ASR)
if not has_asr:
    todo.append('装听写模型（下载约 670 MB，装好占约 2.1 GB 硬盘）：python3 scripts/setup.py asr；被命令时长上限打断就再跑一次，会接着下（不要放后台）')

w = max(len(r[1]) for r in rows)
print('体检结果\n')
for s, n, d in rows:
    print(f'  [{s}] {n.ljust(w)}  {d}')
blk=[h for h,ok in net.items() if not ok and h != 'remotion.media']
if blk: todo.append('这些网站连不上：' + '、'.join(blk) + '。要用到时照 references/setup-help.md《网站被拦了》带用户放行')
print('\n建议：' + (('依赖装在工作区 ' + a.work + '（skill 文件夹是挂进来的用户文件夹，不往里装东西）。' if mounted else '依赖、素材、片子代码都放工作区 ' + a.work + '，skill 文件夹保持干净。') if use_work else '依赖直接装在 skill 文件夹里。'))
if todo:
    print('还缺（每样装之前先问用户）：')
    for t in todo: print('  - ' + t)
else:
    print('都齐了，可以开工。')
