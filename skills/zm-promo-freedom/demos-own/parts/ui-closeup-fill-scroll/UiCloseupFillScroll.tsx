// 小零件：硬切放大界面 · 表格一格格填好 · 往上滚（50 帧，1.7 秒）
// 只播 SmarterCardBoardTilt 的第 70–120 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/smarter-card-board-tilt/SmarterCardBoardTilt.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SmarterCardBoardTilt as Source} from '../../groups/smarter-card-board-tilt/SmarterCardBoardTilt'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const UI_CLOSEUP_FILL_SCROLL_DURATION = 50;
export const UiCloseupFillScroll_RANGE = [70, 120] as const; // 在原镜头里的起止帧

export const UiCloseupFillScroll: React.FC = () => (
  <Sequence from={-70} durationInFrames={120} layout="none">
    <Source />
  </Sequence>
);
