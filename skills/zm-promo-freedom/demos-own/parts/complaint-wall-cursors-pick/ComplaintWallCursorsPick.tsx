// 小零件：吐槽墙整排滑入 · 三个光标各挑一条（99 帧，3.3 秒）
// 只播 ComplaintWallPick 的第 62–161 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/complaint-wall-pick/ComplaintWallPick.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {ComplaintWallPick as Source} from '../../ui-entrance/complaint-wall-pick/ComplaintWallPick'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const COMPLAINT_WALL_CURSORS_PICK_DURATION = 99;
export const ComplaintWallCursorsPick_RANGE = [62, 161] as const; // 在原镜头里的起止帧

export const ComplaintWallCursorsPick: React.FC = () => (
  <Sequence from={-62} durationInFrames={161} layout="none">
    <Source />
  </Sequence>
);
