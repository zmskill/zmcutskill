// 把 006 的每块面板渲染成 2 倍贴图（改了面板内容后要重跑）。在 remotion/ 里运行：
//   for id in brand ai top bias chart media side; do npx remotion still ../demos-own/camera/tilted-dashboard-pan-logo/bake-textures.tsx tex-$id public/textures/live/dash_$id.png --image-format=png; done
//   贴图就放在 remotion/public/textures/live/，镜头渲染时从那里读。
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {PANELS, PanelFace} from './TiltedDashboardPanLogo';

const Root: React.FC = () => (
  <>
    {PANELS.map((p) => (
      <Composition key={p.id} id={`tex-${p.id}`} component={() => <div style={{transform: 'scale(2)', transformOrigin: '0 0'}}><PanelFace p={p} f={0} /></div>} durationInFrames={1} fps={30} width={p.w * 2} height={p.h * 2} />
    ))}
  </>
);
registerRoot(Root);
