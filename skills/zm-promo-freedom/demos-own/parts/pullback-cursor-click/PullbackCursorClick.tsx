// 小零件：拉回 · 鼠标冲过来点发送（46 帧，1.5 秒）
// 只播 PromptToSiteWall 的第 77–123 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/prompt-to-site-wall/PromptToSiteWall.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PromptToSiteWall as Source} from '../../ui-entrance/prompt-to-site-wall/PromptToSiteWall'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PULLBACK_CURSOR_CLICK_DURATION = 46;
export const PullbackCursorClick_RANGE = [77, 123] as const; // 在原镜头里的起止帧

export const PullbackCursorClick: React.FC = () => (
  <Sequence from={-77} durationInFrames={123} layout="none">
    <Source />
  </Sequence>
);
