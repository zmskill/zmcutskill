// 小零件：天空里长出 Logo · 名字抽出 · 标语（109 帧，3.6 秒）
// 只播 PainSwirlDotLogo 的第 167–276 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/pain-swirl-dot-logo/PainSwirlDotLogo.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PainSwirlDotLogo as Source} from '../../opening/pain-swirl-dot-logo/PainSwirlDotLogo'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const SKY_LOGO_GROW_NAME_DURATION = 109;
export const SkyLogoGrowName_RANGE = [167, 276] as const; // 在原镜头里的起止帧

export const SkyLogoGrowName: React.FC = () => (
  <Sequence from={-167} durationInFrames={276} layout="none">
    <Source />
  </Sequence>
);
