// 小零件：大字打出 · 猛拉远 · 句子中间插进一排图标（71 帧，2.4 秒）
// 只播 TypeIconsOrbitInput 的第 0–71 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/type-icons-orbit-input/TypeIconsOrbitInput.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {TypeIconsOrbitInput as Source} from '../../groups/type-icons-orbit-input/TypeIconsOrbitInput'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const BIG_TYPE_ZOOMOUT_INSERT_ICONS_DURATION = 71;
export const BigTypeZoomoutInsertIcons_RANGE = [0, 71] as const; // 在原镜头里的起止帧

export const BigTypeZoomoutInsertIcons: React.FC = () => (
  <Sequence from={-0} durationInFrames={71} layout="none">
    <Source />
  </Sequence>
);
