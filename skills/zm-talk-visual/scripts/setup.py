#!/usr/bin/env python3
"""安装做片要用的东西（每样已经有了就跳过，断了重跑会接着装）。先跑 doctor.py 看缺什么，问过用户再跑这个。
用法：python3 scripts/setup.py [all|python|ffmpeg|remotion|browser|asr] [--work 工作区路径] [--in-skill]
- 工具是固定的，不换：Remotion（版本锁在 remotion/package-lock.json）和它自带的浏览器、SenseVoice 听写模型、ffmpeg。理由见 references/koubo-full-film.md《为什么用这几样工具》。
- Node.js 是系统软件，这里不装；缺了照 doctor 的提示装。
- 单条命令有时长上限的环境里，一样一样装（比如先 remotion，再 browser，再 asr）；被打断就再跑同一条，会接着来。"""
import argparse, os, shutil, subprocess, sys
SKILL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(SKILL, 'scripts'))
from _ff import find_ffmpeg

# 依赖装在哪：IN_SKILL = True 时装进 skill 自己的 remotion/；False 时在工作区搭一份副本（scripts/workdir.sh），
# 依赖、素材、片子代码都放那里，skill 文件夹保持干净。skill 文件夹是挂进来的（Cowork 这类环境）时一律用工作区。
IN_SKILL = False  # 开源版：默认装在工作区，skill 文件夹保持干净

ap = argparse.ArgumentParser()
ap.add_argument('what', nargs='?', default='all', choices=['all', 'python', 'ffmpeg', 'remotion', 'browser', 'asr', 'stage'])
ap.add_argument('--work', default=os.environ.get('ZM_WORK', os.path.expanduser('~/zm-work/zm-talk-visual')))
ap.add_argument('--in-skill', action='store_true', help='依赖直接装进 skill 文件夹（不建工作区）')
a = ap.parse_args()

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
                     f'被单条命令的时长上限打断的话，重跑同一条（python3 scripts/setup.py {cur[0]}），会接着来；别的报错照原文处理，处理不了就把原文告诉用户。')
    raise Failed(f'装不上：连不上 {host}（{why}要从这里下载）。工具是固定的，不换别的。'
                 f'照 references/setup-help.md《网站被拦了》带用户放行这个网站，放行后重跑：python3 scripts/doctor.py')

mounted = any(k in SKILL for k in ('/mnt/', '/sessions/'))   # Cowork 这类环境：用户文件夹是挂进来的
use_work = mounted or not (IN_SKILL or a.in_skill)
RDIR = os.path.join(a.work, 'remotion') if use_work else os.path.join(SKILL, 'remotion')
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
    return os.environ.get('CHROME') or next((g for p in pats for g in glob.glob(p)), None)

def step_python():
    miss = [p for m, p in (('numpy', 'numpy'), ('PIL', 'pillow'), ('scipy', 'scipy')) if not __import__('importlib').util.find_spec(m)]
    if not miss: print('Python 包：已经有了'); return
    pip_install(miss) or blocked('pypi.org', 'Python 包')

def step_ffmpeg():
    if find_ffmpeg(): print('ffmpeg：已经有了 ' + find_ffmpeg()); return
    # 装法不唯一，装出来的都是 ffmpeg：有 brew 用 brew，否则用 pip 装的 imageio-ffmpeg（不需要管理员权限）
    if shutil.which('brew') and run(['brew', 'install', 'ffmpeg']): return
    pip_install(['imageio-ffmpeg']) or blocked('pypi.org', 'ffmpeg')

def step_remotion():
    if use_work:
        run(['bash', os.path.join(SKILL, 'scripts', 'workdir.sh'), a.work])
    else:   # 在 skill 里直接渲染：风格自带的字体复制到 remotion/public/fonts/<风格>/（workdir.sh 那条路会自己复制）
        import glob
        for d in glob.glob(os.path.join(SKILL, 'styles', '*', 'fonts')):
            dst = os.path.join(RDIR, 'public', 'fonts', os.path.basename(os.path.dirname(d)))
            shutil.copytree(d, dst, dirs_exist_ok=True)
    if os.path.exists(os.path.join(RDIR, 'node_modules', '.bin', 'remotion')):
        print('Remotion 依赖：已经有了 ' + RDIR); return
    if not shutil.which('npm'):
        raise Failed('缺 Node.js（带 npm）。这是系统软件，照 references/setup-help.md《装 Node.js》装好再来。')
    run(['npm', 'ci', '--no-audit', '--no-fund'], cwd=RDIR) or blocked('registry.npmjs.org', 'Remotion 依赖')

def step_browser():
    if not os.path.exists(os.path.join(RDIR, 'node_modules', '.bin', 'remotion')):
        raise Failed('先装 Remotion 依赖：python3 scripts/setup.py remotion')
    b = existing_browser()
    if b: print('渲染用的浏览器：已经有了 ' + b); return   # 环境里预装的同一种无头浏览器（chrome-headless-shell），直接用
    run(['npx', 'remotion', 'browser', 'ensure'], cwd=RDIR) or blocked('remotion.media', 'Remotion 渲染用的浏览器')

def step_asr():
    run(['bash', os.path.join(SKILL, 'scripts', 'setup_asr.sh')]) or blocked('github.com', '听写模型')

def step_stage():
    # 舞台 / 空间效果才要：抠像（Robust Video Matting，GPL-3.0，只下载到用户电脑、不随 skill 分发）+ 人脸检测（OpenCV 自带的 haar 文件）
    miss = [p for m, p in (('onnxruntime', 'onnxruntime'), ('cv2', 'opencv-python-headless')) if not __import__('importlib').util.find_spec(m)]
    if miss: pip_install(miss) or blocked('pypi.org', '抠像用的 Python 包')
    d = os.environ.get('VK_STAGE_DIR', os.path.expanduser('~/.cache/zm-talk-visual/stage')); os.makedirs(d, exist_ok=True)
    import urllib.request
    for name, url, host in (('rvm_resnet50_fp32.onnx', 'https://github.com/PeterL1n/RobustVideoMatting/releases/download/v1.0.0/rvm_resnet50_fp32.onnx', 'github.com'),
                            ('haarcascade_frontalface_default.xml', 'https://raw.githubusercontent.com/opencv/opencv/4.x/data/haarcascades/haarcascade_frontalface_default.xml', 'raw.githubusercontent.com')):
        f = os.path.join(d, name)
        if os.path.exists(f) and os.path.getsize(f) > 100000: print(f'{name}：已经有了'); continue
        print(f'下载 {name}…', flush=True)
        try:
            urllib.request.urlretrieve(url, f + '.part'); os.replace(f + '.part', f)
        except Exception as e:
            print(e); blocked(host, '舞台的抠像模型' if name.endswith('onnx') else '人脸检测文件')
    print('舞台的模型：好了 ' + d)

steps = {'python': step_python, 'ffmpeg': step_ffmpeg, 'remotion': step_remotion, 'browser': step_browser, 'asr': step_asr, 'stage': step_stage}
done, cur = {}, ['']
for name in ([k for k in steps if k != 'stage'] if a.what == 'all' else [a.what]):   # stage 只在用舞台 / 空间效果时单独装
    cur[0] = name; print(f'\n── {name} ──', flush=True)
    try:
        steps[name](); done[name] = '好了'
    except Failed as e:
        done[name] = '没装上'; print('\n' + str(e))
        if name in ('remotion',) and a.what == 'all': break   # 后面的要靠它
print('\n── 汇总 ──')
for k, v in done.items(): print(f'  {k}：{v}')
if all(v == '好了' for v in done.values()):
    print('都装好了。再跑一次 python3 scripts/doctor.py 确认。')
    if use_work: print(f'做片在工作区里：{os.path.join(a.work, "remotion")}（素材放 public/<片子名>/，代码放 projects/<片子名>/；成片写回用户指定的文件夹）')
    sys.exit(0)
print('有没装上的（见上面）。不要跟用户说装好了。')
sys.exit(1)
