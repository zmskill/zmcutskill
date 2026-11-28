// 小零件：球缩回按钮（56 帧，1.9 秒）
// 只播 StickerSpherePicker 的第 429–485 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/sticker-sphere-picker/StickerSpherePicker.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {StickerSpherePicker as Source} from '../../ui-entrance/sticker-sphere-picker/StickerSpherePicker'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const SPHERE_COLLAPSE_BACK_DURATION = 56;
export const SphereCollapseBack_RANGE = [429, 485] as const; // 在原镜头里的起止帧

export const SphereCollapseBack: React.FC = () => (
  <Sequence from={-429} durationInFrames={485} layout="none">
    <Source />
  </Sequence>
);
