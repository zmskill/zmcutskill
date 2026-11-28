// 小零件：满屏一行行大字墙 · 中间一行换词（59 帧，2.0 秒）
// 只播 TypeIconsOrbitInput 的第 134–193 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/type-icons-orbit-input/TypeIconsOrbitInput.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {TypeIconsOrbitInput as Source} from '../../groups/type-icons-orbit-input/TypeIconsOrbitInput'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const TEXT_WALL_ROWS_SWAP_DURATION = 59;
export const TextWallRowsSwap_RANGE = [134, 193] as const; // 在原镜头里的起止帧

export const TextWallRowsSwap: React.FC = () => (
  <Sequence from={-134} durationInFrames={193} layout="none">
    <Source />
  </Sequence>
);
