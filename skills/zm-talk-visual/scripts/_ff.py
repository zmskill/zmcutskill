"""找 ffmpeg：环境变量 FFMPEG → 系统 PATH → Python 包 imageio-ffmpeg（pip install imageio-ffmpeg，不需要管理员权限）。
其他脚本用 `from _ff import FFMPEG`。都找不到时报错，说清怎么装。"""
import os, shutil

def find_ffmpeg():
    p = os.environ.get('FFMPEG')
    if p and os.path.exists(p):
        return p
    p = shutil.which('ffmpeg')
    if p:
        return p
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return None

FFMPEG = find_ffmpeg() or 'ffmpeg'

def require():
    if not find_ffmpeg():
        raise SystemExit('找不到 ffmpeg。任选一种装上：pip install imageio-ffmpeg（不需要管理员权限）；Mac 上 brew install ffmpeg；或者设环境变量 FFMPEG=ffmpeg 的路径。')
    return FFMPEG
