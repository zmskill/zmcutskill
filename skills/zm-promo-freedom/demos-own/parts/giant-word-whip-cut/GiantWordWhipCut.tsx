// 小零件：超大字越甩越快 · 硬切成一行小字（48 帧，1.6 秒）
// 只播 GiantWordLogoLockup 的第 0–48 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/giant-word-logo-lockup/GiantWordLogoLockup.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {GiantWordLogoLockup as Source} from '../../groups/giant-word-logo-lockup/GiantWordLogoLockup'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const GIANT_WORD_WHIP_CUT_DURATION = 48;
export const GiantWordWhipCut_RANGE = [0, 48] as const; // 在原镜头里的起止帧

export const GiantWordWhipCut: React.FC = () => (
  <Sequence from={-0} durationInFrames={48} layout="none">
    <Source />
  </Sequence>
);
