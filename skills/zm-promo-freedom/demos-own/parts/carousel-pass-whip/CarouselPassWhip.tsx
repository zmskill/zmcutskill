// 小零件：弯曲轮播匀速滑 · 甩一下（180 帧，6.0 秒）
// 只播 CurvedCarouselReel 的第 300–480 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/transition/curved-carousel-reel/CurvedCarouselReel.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {CurvedCarouselReel as Source} from '../../transition/curved-carousel-reel/CurvedCarouselReel'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const CAROUSEL_PASS_WHIP_DURATION = 180;
export const CarouselPassWhip_RANGE = [300, 480] as const; // 在原镜头里的起止帧

export const CarouselPassWhip: React.FC = () => (
  <Sequence from={-300} durationInFrames={480} layout="none">
    <Source />
  </Sequence>
);
