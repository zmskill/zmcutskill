// 小零件：按钮长成 3D 球 · 拖着转（164 帧，5.5 秒）
// 只播 StickerSpherePicker 的第 22–186 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/sticker-sphere-picker/StickerSpherePicker.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {StickerSpherePicker as Source} from '../../ui-entrance/sticker-sphere-picker/StickerSpherePicker'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const BUTTON_GROW_SPHERE_SPIN_DURATION = 164;
export const ButtonGrowSphereSpin_RANGE = [22, 186] as const; // 在原镜头里的起止帧

export const ButtonGrowSphereSpin: React.FC = () => (
  <Sequence from={-22} durationInFrames={186} layout="none">
    <Source />
  </Sequence>
);
