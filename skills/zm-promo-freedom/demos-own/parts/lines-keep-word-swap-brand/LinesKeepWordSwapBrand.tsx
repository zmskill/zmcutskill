// 小零件：三行字只留一个词 · 原位换成产品名（158 帧，5.3 秒）
// 整个镜头就是这一个动作：LinesKeepWordSwapBrand 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/lines-keep-word-swap-brand/LinesKeepWordSwapBrand.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {LinesKeepWordSwapBrand as Source} from '../../groups/lines-keep-word-swap-brand/LinesKeepWordSwapBrand'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const LINES_KEEP_WORD_SWAP_BRAND_DURATION = 158;
export const LinesKeepWordSwapBrand_RANGE = [0, 158] as const; // 在原镜头里的起止帧

export const LinesKeepWordSwapBrand: React.FC = () => (
  <Sequence from={-0} durationInFrames={158} layout="none">
    <Source />
  </Sequence>
);
