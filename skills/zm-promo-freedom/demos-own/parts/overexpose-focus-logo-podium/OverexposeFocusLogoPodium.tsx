// 小零件：过曝退去对焦 · Logo 落到石台回弹（112 帧，3.7 秒）
// 只播 RibbonPodiumIntro 的第 146–258 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/ribbon-podium-intro/RibbonPodiumIntro.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {RibbonPodiumIntro as Source} from '../../opening/ribbon-podium-intro/RibbonPodiumIntro'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const OVEREXPOSE_FOCUS_LOGO_PODIUM_DURATION = 112;
export const OverexposeFocusLogoPodium_RANGE = [146, 258] as const; // 在原镜头里的起止帧

export const OverexposeFocusLogoPodium: React.FC = () => (
  <Sequence from={-146} durationInFrames={258} layout="none">
    <Source />
  </Sequence>
);
