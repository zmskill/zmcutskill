// 小零件：图标弹出 · 六个功能小圆绕着转（135 帧，4.5 秒）
// 整个镜头就是这一个动作：LogoOrbitFeatures 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/logo-orbit-features/LogoOrbitFeatures.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {LogoOrbitFeatures as Source} from '../../groups/logo-orbit-features/LogoOrbitFeatures'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const LOGO_ORBIT_FEATURES_DURATION = 135;
export const LogoOrbitFeatures_RANGE = [0, 135] as const; // 在原镜头里的起止帧

export const LogoOrbitFeatures: React.FC = () => (
  <Sequence from={-0} durationInFrames={135} layout="none">
    <Source />
  </Sequence>
);
