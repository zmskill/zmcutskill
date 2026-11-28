// 小零件：贴脸页面拉远成轮播 · 大字蹦进文字框（137 帧，4.6 秒）
// 整个镜头就是这一个动作：CarouselTypeSlots 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/carousel-type-slots/CarouselTypeSlots.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {CarouselTypeSlots as Source} from '../../groups/carousel-type-slots/CarouselTypeSlots'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const CAROUSEL_TYPE_SLOTS_DURATION = 137;
export const CarouselTypeSlots_RANGE = [0, 137] as const; // 在原镜头里的起止帧

export const CarouselTypeSlots: React.FC = () => (
  <Sequence from={-0} durationInFrames={137} layout="none">
    <Source />
  </Sequence>
);
