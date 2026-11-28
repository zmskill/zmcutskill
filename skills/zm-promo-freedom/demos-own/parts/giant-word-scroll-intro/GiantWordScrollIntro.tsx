// 小零件：超宽大字甩进来刹住 · 再甩走（96 帧，3.2 秒）
// 整个镜头就是这一个动作：GiantWordScrollIntro 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/giant-word-scroll-intro/GiantWordScrollIntro.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {GiantWordScrollIntro as Source} from '../../groups/giant-word-scroll-intro/GiantWordScrollIntro'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const GIANT_WORD_SCROLL_INTRO_DURATION = 96;
export const GiantWordScrollIntro_RANGE = [0, 96] as const; // 在原镜头里的起止帧

export const GiantWordScrollIntro: React.FC = () => (
  <Sequence from={-0} durationInFrames={96} layout="none">
    <Source />
  </Sequence>
);
