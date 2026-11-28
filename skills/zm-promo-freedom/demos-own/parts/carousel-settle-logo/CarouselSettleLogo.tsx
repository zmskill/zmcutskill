// 小零件：轮播减速 · Logo 卡停在正中（180 帧，6.0 秒）
// 只播 CurvedCarouselReel 的第 1200–1380 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/transition/curved-carousel-reel/CurvedCarouselReel.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {CurvedCarouselReel as Source} from '../../transition/curved-carousel-reel/CurvedCarouselReel'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const CAROUSEL_SETTLE_LOGO_DURATION = 180;
export const CarouselSettleLogo_RANGE = [1200, 1380] as const; // 在原镜头里的起止帧

export const CarouselSettleLogo: React.FC = () => (
  <Sequence from={-1200} durationInFrames={1380} layout="none">
    <Source />
  </Sequence>
);
