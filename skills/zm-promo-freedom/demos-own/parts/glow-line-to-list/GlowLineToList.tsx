// 小零件：彩字缩淡 · 小标题和两行推荐擦出来（96 帧，3.2 秒）
// 只播 TypeGlowList 的第 57–153 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/type-glow-list/TypeGlowList.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {TypeGlowList as Source} from '../../groups/type-glow-list/TypeGlowList'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const GLOW_LINE_TO_LIST_DURATION = 96;
export const GlowLineToList_RANGE = [57, 153] as const; // 在原镜头里的起止帧

export const GlowLineToList: React.FC = () => (
  <Sequence from={-57} durationInFrames={153} layout="none">
    <Source />
  </Sequence>
);
