// 小零件：整页升起 · 后面冒出大字 · 字和表一起换（65 帧，2.2 秒）
// 只播 PageTiltScroll 的第 0–65 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/page-tilt-scroll/PageTiltScroll.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PageTiltScroll as Source} from '../../groups/page-tilt-scroll/PageTiltScroll'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PAGE_RISE_BIG_WORD_SWAP_DURATION = 65;
export const PageRiseBigWordSwap_RANGE = [0, 65] as const; // 在原镜头里的起止帧

export const PageRiseBigWordSwap: React.FC = () => (
  <Sequence from={-0} durationInFrames={65} layout="none">
    <Source />
  </Sequence>
);
