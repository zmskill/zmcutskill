// 小零件：图标绕着输入框转 · 框里打字（63 帧，2.1 秒）
// 只播 TypeIconsOrbitInput 的第 71–134 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/type-icons-orbit-input/TypeIconsOrbitInput.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {TypeIconsOrbitInput as Source} from '../../groups/type-icons-orbit-input/TypeIconsOrbitInput'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const ICONS_ORBIT_INPUT_TYPE_DURATION = 63;
export const IconsOrbitInputType_RANGE = [71, 134] as const; // 在原镜头里的起止帧

export const IconsOrbitInputType: React.FC = () => (
  <Sequence from={-71} durationInFrames={134} layout="none">
    <Source />
  </Sequence>
);
