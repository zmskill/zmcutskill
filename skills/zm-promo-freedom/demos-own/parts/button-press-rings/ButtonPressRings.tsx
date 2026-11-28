// 小零件：按钮扫进来摆正 · 按下光环荡开（54 帧，1.8 秒）
// 整个镜头就是这一个动作：ButtonPressRings 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/button-press-rings/ButtonPressRings.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {ButtonPressRings as Source} from '../../groups/button-press-rings/ButtonPressRings'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const BUTTON_PRESS_RINGS_DURATION = 54;
export const ButtonPressRings_RANGE = [0, 54] as const; // 在原镜头里的起止帧

export const ButtonPressRings: React.FC = () => (
  <Sequence from={-0} durationInFrames={54} layout="none">
    <Source />
  </Sequence>
);
