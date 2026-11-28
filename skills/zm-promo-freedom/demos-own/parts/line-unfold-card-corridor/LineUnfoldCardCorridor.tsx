// 小零件：竖线展开成卡 · 走廊里一张张换到中间（162 帧，5.4 秒）
// 整个镜头就是这一个动作：LineUnfoldCardCorridor 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/line-unfold-card-corridor/LineUnfoldCardCorridor.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {LineUnfoldCardCorridor as Source} from '../../groups/line-unfold-card-corridor/LineUnfoldCardCorridor'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const LINE_UNFOLD_CARD_CORRIDOR_DURATION = 162;
export const LineUnfoldCardCorridor_RANGE = [0, 162] as const; // 在原镜头里的起止帧

export const LineUnfoldCardCorridor: React.FC = () => (
  <Sequence from={-0} durationInFrames={162} layout="none">
    <Source />
  </Sequence>
);
