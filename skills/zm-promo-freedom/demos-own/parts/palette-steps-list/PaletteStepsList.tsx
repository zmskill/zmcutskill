// 小零件：竖色条长成台阶 · 铺成一行行色带（63 帧，2.1 秒）
// 整个镜头就是这一个动作：PaletteStepsList 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/palette-steps-list/PaletteStepsList.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PaletteStepsList as Source} from '../../groups/palette-steps-list/PaletteStepsList'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PALETTE_STEPS_LIST_DURATION = 63;
export const PaletteStepsList_RANGE = [0, 63] as const; // 在原镜头里的起止帧

export const PaletteStepsList: React.FC = () => (
  <Sequence from={-0} durationInFrames={63} layout="none">
    <Source />
  </Sequence>
);
