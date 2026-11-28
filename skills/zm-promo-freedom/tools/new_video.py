#!/usr/bin/env python3
"""new_video.py — 给一条新片子搭 Remotion 工程（片子文件夹里的 video/）。
用法：python3 $SKILL/tools/new_video.py <片子文件夹> [--work 工作区路径]

- 代码从 $SKILL/remotion 复制（src、配置、贴图、素材库）；依赖不每条片子重装，node_modules 链到装好的那一份（先跑 tools/setup.py remotion）。
- 片子文件夹是挂进来的用户文件夹时（Cowork 这类环境），video/ 搭在工作区 <工作区>/films/<片名>/video，
  成片、封面、静帧照样写回片子文件夹的 out/。
- video/ 已经有了就不动（不覆盖片子代码）。
"""
import argparse, os, shutil, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _where

ap = argparse.ArgumentParser(); ap.add_argument('film'); ap.add_argument('--work', default=_where.DEFAULT_WORK)
a = ap.parse_args()
film = os.path.abspath(os.path.expanduser(a.film)); os.makedirs(film, exist_ok=True)
rdir = _where.remotion_dir(a.work)
film_mounted = '/mnt/' in film   # 片子文件夹是挂进来的用户文件夹（Cowork 里在 ~/mnt/ 下）
if not _where.has_deps(rdir):
    sys.exit(f'渲染环境还没装好（{rdir}）。先跑 python3 {_where.SKILL}/tools/doctor.py，问过用户后 python3 {_where.SKILL}/tools/setup.py')
video = os.path.join(a.work, 'films', os.path.basename(film), 'video') if film_mounted else os.path.join(film, 'video')
if os.path.exists(os.path.join(video, 'src')):
    sys.exit(f'video/ 已经有了：{video}（不覆盖片子代码）')
src = os.path.join(_where.SKILL, 'remotion')
shutil.copytree(src, video, ignore=shutil.ignore_patterns('node_modules', 'out', '.DS_Store', 'shotlab-root.tsx', 'README.md'), dirs_exist_ok=True)
link = os.path.join(video, 'node_modules')
try:
    os.symlink(os.path.join(rdir, 'node_modules'), link)
    how = f'依赖链到 {rdir}/node_modules'
except OSError:   # 有的系统（比如没开开发者模式的 Windows）不让建链接
    how = f'没法建链接：在 {video} 里跑 npm ci 装一份依赖（先问用户）'
print(f'片子的 Remotion 工程：{video}\n{how}')
print('要用的组件从 $SKILL/assets/lib 复制进 src/；镜头组 / 镜头卡的代码从 $SKILL/demos-own 复制进 src/ 再改。')
if film_mounted:
    print(f'片子文件夹是挂进来的，工程搭在工作区；成片、封面、静帧写回 {os.path.join(film, "out")}。')
