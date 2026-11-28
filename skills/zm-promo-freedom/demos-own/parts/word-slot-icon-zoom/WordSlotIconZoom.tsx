// 小零件：像老虎机一样翻能力 · 图标放大铺满（110 帧，3.7 秒）
// 整个镜头就是这一个动作：WordSlotIconZoom 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/word-slot-icon-zoom/WordSlotIconZoom.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {WordSlotIconZoom as Source} from '../../groups/word-slot-icon-zoom/WordSlotIconZoom'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WORD_SLOT_ICON_ZOOM_DURATION = 110;
export const WordSlotIconZoom_RANGE = [0, 110] as const; // 在原镜头里的起止帧

export const WordSlotIconZoom: React.FC = () => (
  <Sequence from={-0} durationInFrames={110} layout="none">
    <Source />
  </Sequence>
);
