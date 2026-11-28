// 小零件：标志一笔笔长出 · 名字 · 按钮被按下（163 帧，5.4 秒）
// 整个镜头就是这一个动作：LogoCheckBuildCta 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/logo-check-build-cta/LogoCheckBuildCta.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {LogoCheckBuildCta as Source} from '../../groups/logo-check-build-cta/LogoCheckBuildCta'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const LOGO_CHECK_BUILD_CTA_DURATION = 163;
export const LogoCheckBuildCta_RANGE = [0, 163] as const; // 在原镜头里的起止帧

export const LogoCheckBuildCta: React.FC = () => (
  <Sequence from={-0} durationInFrames={163} layout="none">
    <Source />
  </Sequence>
);
