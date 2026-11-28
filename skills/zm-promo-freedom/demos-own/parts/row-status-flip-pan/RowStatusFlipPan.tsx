// 小零件：贴脸看一行 · 横滑 · 状态格整格换色（174 帧，5.8 秒）
// 整个镜头就是这一个动作：RowStatusFlipPan 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/row-status-flip-pan/RowStatusFlipPan.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {RowStatusFlipPan as Source} from '../../groups/row-status-flip-pan/RowStatusFlipPan'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const ROW_STATUS_FLIP_PAN_DURATION = 174;
export const RowStatusFlipPan_RANGE = [0, 174] as const; // 在原镜头里的起止帧

export const RowStatusFlipPan: React.FC = () => (
  <Sequence from={-0} durationInFrames={174} layout="none">
    <Source />
  </Sequence>
);
