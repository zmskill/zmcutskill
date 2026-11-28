// 小零件：打字筛选 · 不匹配的原地变暗（144 帧，4.8 秒）
// 只播 StickerSpherePicker 的第 186–330 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/sticker-sphere-picker/StickerSpherePicker.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {StickerSpherePicker as Source} from '../../ui-entrance/sticker-sphere-picker/StickerSpherePicker'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const SPHERE_SEARCH_FILTER_DURATION = 144;
export const SphereSearchFilter_RANGE = [186, 330] as const; // 在原镜头里的起止帧

export const SphereSearchFilter: React.FC = () => (
  <Sequence from={-186} durationInFrames={330} layout="none">
    <Source />
  </Sequence>
);
