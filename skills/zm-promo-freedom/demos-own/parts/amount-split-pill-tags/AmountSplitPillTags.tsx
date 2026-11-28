// 小零件：超大金额 · 黄块铺满 · 数字拉开（52 帧，1.7 秒）
// 整个镜头就是这一个动作：AmountSplitPillTags 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/amount-split-pill-tags/AmountSplitPillTags.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {AmountSplitPillTags as Source} from '../../groups/amount-split-pill-tags/AmountSplitPillTags'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const AMOUNT_SPLIT_PILL_TAGS_DURATION = 52;
export const AmountSplitPillTags_RANGE = [0, 52] as const; // 在原镜头里的起止帧

export const AmountSplitPillTags: React.FC = () => (
  <Sequence from={-0} durationInFrames={52} layout="none">
    <Source />
  </Sequence>
);
