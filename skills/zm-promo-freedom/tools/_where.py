"""渲染环境（装了 Remotion 依赖的那份 remotion/）在哪：doctor / setup / render_shot / new_video 共用。

- 环境变量 ZM_PROMO_REMOTION 指定的优先；
- IN_SKILL = False 且 skill 文件夹不是挂进来的：就用 skill 自己的 remotion/；
- 否则用工作区（默认 ~/zm-work/zm-promo-freedom，环境变量 ZM_PROMO_WORK 或 --work 可以换）里的副本，skill 文件夹保持干净。
"""
import os
SKILL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IN_SKILL = False  # 自用版：依赖装在 skill 自己的 remotion/（导出开源版时改成 False）
DEFAULT_WORK = os.environ.get('ZM_PROMO_WORK', os.path.expanduser('~/zm-work/zm-promo-freedom'))

def mounted(path=SKILL):
    """Cowork 这类环境里，用户的文件夹是挂进来的：不往里装依赖。"""
    return any(k in os.path.abspath(path) for k in ('/mnt/', '/sessions/'))

def use_work(in_skill=False):
    return mounted() or not (IN_SKILL or in_skill)

def remotion_dir(work=None, in_skill=False):
    if os.environ.get('ZM_PROMO_REMOTION'): return os.environ['ZM_PROMO_REMOTION']
    return os.path.join(work or DEFAULT_WORK, 'remotion') if use_work(in_skill) else os.path.join(SKILL, 'remotion')

def has_deps(rdir):
    return os.path.exists(os.path.join(rdir, 'node_modules', '.bin', 'remotion'))
