// 小零件：图标砖散开 · 一甩 · 白线画到下一张卡（101 帧，3.4 秒）
// 只播 CardLineFlow 的第 0–101 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/card-line-flow/CardLineFlow.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {CardLineFlow as Source} from '../../groups/card-line-flow/CardLineFlow'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const ICON_TILES_WHIP_LINE_CARDS_DURATION = 101;
export const IconTilesWhipLineCards_RANGE = [0, 101] as const; // 在原镜头里的起止帧

export const IconTilesWhipLineCards: React.FC = () => (
  <Sequence from={-0} durationInFrames={101} layout="none">
    <Source />
  </Sequence>
);
