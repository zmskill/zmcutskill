// 小零件：打"隆重介绍" · 图标喷开满屏 · 产品名浮出（84 帧，2.8 秒）
// 只播 IntroGenieWordmarkBrowser 的第 0–84 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/intro-genie-wordmark-browser/IntroGenieWordmarkBrowser.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {IntroGenieWordmarkBrowser as Source} from '../../groups/intro-genie-wordmark-browser/IntroGenieWordmarkBrowser'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const DOCK_TYPE_GENIE_BURST_NAME_DURATION = 84;
export const DockTypeGenieBurstName_RANGE = [0, 84] as const; // 在原镜头里的起止帧

export const DockTypeGenieBurstName: React.FC = () => (
  <Sequence from={-0} durationInFrames={84} layout="none">
    <Source />
  </Sequence>
);
