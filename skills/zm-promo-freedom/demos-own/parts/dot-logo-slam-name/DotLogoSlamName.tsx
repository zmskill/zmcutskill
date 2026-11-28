// 小零件：小字缩成点 · Logo 砸下来 · 名字滑进（78 帧，2.6 秒）
// 只播 GiantWordLogoLockup 的第 48–126 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/giant-word-logo-lockup/GiantWordLogoLockup.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {GiantWordLogoLockup as Source} from '../../groups/giant-word-logo-lockup/GiantWordLogoLockup'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const DOT_LOGO_SLAM_NAME_DURATION = 78;
export const DotLogoSlamName_RANGE = [48, 126] as const; // 在原镜头里的起止帧

export const DotLogoSlamName: React.FC = () => (
  <Sequence from={-48} durationInFrames={126} layout="none">
    <Source />
  </Sequence>
);
