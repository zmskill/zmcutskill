// 小零件：照片飞快地换 · 最后一张鼓起来撑满（53 帧，1.8 秒）
// 整个镜头就是这一个动作：PhotoFlashBulge 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/photo-flash-bulge/PhotoFlashBulge.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PhotoFlashBulge as Source} from '../../groups/photo-flash-bulge/PhotoFlashBulge'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PHOTO_FLASH_BULGE_DURATION = 53;
export const PhotoFlashBulge_RANGE = [0, 53] as const; // 在原镜头里的起止帧

export const PhotoFlashBulge: React.FC = () => (
  <Sequence from={-0} durationInFrames={53} layout="none">
    <Source />
  </Sequence>
);
