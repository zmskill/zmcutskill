# demos-own/ — 镜头库代码

Remotion，30fps，1920×1080；每个文件 `export const <文件名>: React.FC` 并导出 `<大写蛇形>_DURATION`；
全部是帧的纯函数（不用 Math.random / Date）。

共享件在 `assets/lib/`，例如：

```tsx
import { EASE, SpeedBlur } from '../../../assets/lib/helpers/polish';
import { land, trackOn } from '../../../assets/lib/helpers/beatLand';
```

目录：镜头卡 `demos-own/<类>/<卡名>/<组件名>.tsx`，镜头组 `demos-own/groups/<组名>/`；入库的样片放同目录 `preview.mp4`。
渲染环境在 `remotion/`；CI 和 `assets/scripts/smoke-render-demos.py` 会检查 `demos-own/`。
