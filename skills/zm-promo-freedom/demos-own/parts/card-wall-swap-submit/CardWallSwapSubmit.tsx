// 小零件：卡片墙到位 · 中心卡换稿 · 点提交（79 帧，2.6 秒）
// 只播 PromptToSiteWall 的第 276–355 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/prompt-to-site-wall/PromptToSiteWall.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PromptToSiteWall as Source} from '../../ui-entrance/prompt-to-site-wall/PromptToSiteWall'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const CARD_WALL_SWAP_SUBMIT_DURATION = 79;
export const CardWallSwapSubmit_RANGE = [276, 355] as const; // 在原镜头里的起止帧

export const CardWallSwapSubmit: React.FC = () => (
  <Sequence from={-276} durationInFrames={355} layout="none">
    <Source />
  </Sequence>
);
