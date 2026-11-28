// 小零件：页面斜过来 · 镜头扎进去 · 三下往下翻（150 帧，5.0 秒）
// 只播 PageTiltScroll 的第 65–215 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/page-tilt-scroll/PageTiltScroll.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PageTiltScroll as Source} from '../../groups/page-tilt-scroll/PageTiltScroll'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PAGE_TILT_DIVE_FLICKS_DURATION = 150;
export const PageTiltDiveFlicks_RANGE = [65, 215] as const; // 在原镜头里的起止帧

export const PageTiltDiveFlicks: React.FC = () => (
  <Sequence from={-65} durationInFrames={215} layout="none">
    <Source />
  </Sequence>
);
