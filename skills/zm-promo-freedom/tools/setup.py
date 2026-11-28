#!/usr/bin/env python3
"""安装做片要用的东西（每样已经有了就跳过，断了重跑会接着装）。先跑 doctor.py 看缺什么，问过用户再跑这个。
用法：python3 tools/setup.py [all|python|ffmpeg|remotion|browser|cv] [--work 工作区路径] [--in-skill]
- 工具是固定的，不换：Remotion（版本锁在 remotion/package-lock.json）和它自带的浏览器、ffmpeg。镜头库的效果是在这套工具上调出来的。
- Node.js 是系统软件，这里不装；缺了照 doctor 的提示装。
- cv（opencv-python）只在自建镜头、复刻参考片时用，all 不装它。
- 单条命令有时长上限的环境里，一样一样装（先 remotion，再 browser）；被打断就再跑同一条，会接着来。"""
import argparse, importlib.util, os, shutil, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _ff import find_ffmpeg
import _where

ap = argparse.ArgumentParser()
ap.add_argument('what', nargs='?', default='all', choices=['all', 'python', 'ffmpeg', 'remotion', 'browser', 'cv'])
ap.add_argument('--work', default=_where.DEFAULT_WORK)
ap.add_argument('--in-skill', action='store_true', help='依赖直接装进 skill 的 remotion/（不建工作区）')
a = ap.parse_args()
SKILL = _where.SKILL

def run(cmd, cwd=None):
    print('$ ' + ' '.join(cmd), flush=True)
    return subprocess.run(cmd, cwd=cwd).returncode == 0

# 环境走代理时（Cowork 这类），Node 默认不读 HTTPS_PROXY，下载浏览器会报 EAI_AGAIN；打开这个开关让它走代理（Node 22.21+ / 24 起支持，旧版会忽略）
if any(os.environ.get(k) for k in ('HTTPS_PROXY', 'https_proxy', 'HTTP_PROXY', 'http_proxy')): os.environ.setdefault('NODE_USE_ENV_PROXY', '1')

class Failed(Exception): pass

def reach(host):
    import urllib.request, urllib.error
    try:
        urllib.request.urlopen(urllib.request.Request(f'https://{host}/', method='HEAD'), timeout=8); return True
    except urllib.error.HTTPError:
        return True
    except Exception:
        return False

def blocked(host, why):
    # 先看网站到底连不连得上：连得上就不是被拦，多半是下载太慢被打断、磁盘满了、权限不够，看上面的报错原文
    if reach(host):
        raise Failed(f'{why}没装完。{host} 是连得上的，不是网站被拦。看上面的报错原文：'
                     f'被单条命令的时长上限打断的话，重跑同一条（python3 tools/setup.py {cur[0]}），会接着来；别的报错照原文处理，处理不了就把原文告诉用户。')
    raise Failed(f'装不上：连不上 {host}（{why}要从这里下载）。工具是固定的，不换别的。'
                 f'照 references/setup-help.md《网站被拦了》带用户放行这个网站，放行后重跑：python3 tools/doctor.py')

uw = _where.use_work(a.in_skill)
RDIR = _where.remotion_dir(a.work, a.in_skill)

def pip_install(pkgs):
    base = [sys.executable, '-m', 'pip', 'install', '--user', '--quiet']
    # 有的 Python（比如 Mac 上 Homebrew 装的）不让直接装，要加 --break-system-packages
    return run(base + pkgs) or run(base + ['--break-system-packages'] + pkgs)

def existing_browser():
    import glob
    pats = ['/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell',
            os.path.expanduser('~/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell'),
            os.path.expanduser('~/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell'),
            os.path.join(RDIR, 'node_modules', '.remotion', 'chrome-headless-shell', '*', '*', 'chrome-headless-shell*')]
    return os.environ.get('REMOTION_BROWSER') or next((g for p in pats for g in glob.glob(p)), None)

def step_python():
    miss = [p for m, p in (('numpy', 'numpy'), ('PIL', 'pillow')) if not importlib.util.find_spec(m)]
    if not miss: print('Python 包：已经有了'); return
    pip_install(miss) or blocked('pypi.org', 'Python 包')

def step_cv():
    if importlib.util.find_spec('cv2'): print('opencv：已经有了'); return
    pip_install(['opencv-python-headless']) or blocked('pypi.org', 'opencv')

def step_ffmpeg():
    if find_ffmpeg(): print('ffmpeg：已经有了 ' + find_ffmpeg()); return
    # 装法不唯一，装出来的都是 ffmpeg：有 brew 用 brew，否则用 pip 装的 imageio-ffmpeg（不需要管理员权限）
    if shutil.which('brew') and run(['brew', 'install', 'ffmpeg']): return
    pip_install(['imageio-ffmpeg']) or blocked('pypi.org', 'ffmpeg')

def step_remotion():
    if uw:
        run(['bash', os.path.join(SKILL, 'tools', 'workdir.sh'), os.path.dirname(RDIR)])
    if _where.has_deps(RDIR):
        print('Remotion 依赖：已经有了 ' + RDIR); return
    if not shutil.which('npm'):
        raise Failed('缺 Node.js（带 npm）。这是系统软件，照 references/setup-help.md《装 Node.js》装好再来。')
    run(['npm', 'ci', '--no-audit', '--no-fund'], cwd=RDIR) or blocked('registry.npmjs.org', 'Remotion 依赖')

def step_browser():
    if not _where.has_deps(RDIR):
        raise Failed('先装 Remotion 依赖：python3 tools/setup.py remotion')
    b = existing_browser()
    if b: print('渲染用的浏览器：已经有了 ' + b); return   # 环境里预装的同一种无头浏览器（chrome-headless-shell），直接用
    run(['npx', 'remotion', 'browser', 'ensure'], cwd=RDIR) or blocked('remotion.media', 'Remotion 渲染用的浏览器')

steps = {'python': step_python, 'ffmpeg': step_ffmpeg, 'remotion': step_remotion, 'browser': step_browser, 'cv': step_cv}
order = ['python', 'ffmpeg', 'remotion', 'browser'] if a.what == 'all' else [a.what]
done, cur = {}, ['']
for name in order:
    cur[0] = name; print(f'\n── {name} ──', flush=True)
    try:
        steps[name](); done[name] = '好了'
    except Failed as e:
        done[name] = '没装上'; print('\n' + str(e))
        if name == 'remotion' and a.what == 'all': break   # 后面的要靠它
print('\n── 汇总 ──')
for k, v in done.items(): print(f'  {k}：{v}')
if all(v == '好了' for v in done.values()):
    print('都装好了。再跑一次 python3 tools/doctor.py 确认。')
    print(f'渲染环境：{RDIR}。新片子用 python3 tools/new_video.py <片子文件夹> 搭 video/。')
    sys.exit(0)
print('有没装上的（见上面）。不要跟用户说装好了。')
sys.exit(1)
