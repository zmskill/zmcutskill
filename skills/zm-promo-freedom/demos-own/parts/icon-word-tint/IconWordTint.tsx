// 小零件：图标飞进一个词 · 把它染成自己的颜色（110 帧，3.7 秒）
// 整个镜头就是这一个动作：IconWordTint 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/icon-word-tint/IconWordTint.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {IconWordTint as Source} from '../../groups/icon-word-tint/IconWordTint'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const ICON_WORD_TINT_DURATION = 110;
export const IconWordTint_RANGE = [0, 110] as const; // 在原镜头里的起止帧

export const IconWordTint: React.FC = () => (
  <Sequence from={-0} durationInFrames={110} layout="none">
    <Source />
  </Sequence>
);
