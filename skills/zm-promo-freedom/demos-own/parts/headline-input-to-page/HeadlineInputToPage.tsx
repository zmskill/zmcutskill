// 小零件：发光大字横移 · 输入条长成网页（120 帧，4.0 秒）
// 整个镜头就是这一个动作：HeadlineInputToPage 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/headline-input-to-page/HeadlineInputToPage.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {HeadlineInputToPage as Source} from '../../opening/headline-input-to-page/HeadlineInputToPage'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const HEADLINE_INPUT_TO_PAGE_DURATION = 120;
export const HeadlineInputToPage_RANGE = [0, 120] as const; // 在原镜头里的起止帧

export const HeadlineInputToPage: React.FC = () => (
  <Sequence from={-0} durationInFrames={120} layout="none">
    <Source />
  </Sequence>
);
