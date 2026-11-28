// 小零件：像素小光标聚到中间变成输入光标（56 帧，1.9 秒）
// 只播 RichTextCursorStyles 的第 0–56 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/rich-text-cursor-styles/RichTextCursorStyles.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {RichTextCursorStyles as Source} from '../../groups/rich-text-cursor-styles/RichTextCursorStyles'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PIXEL_CURSORS_GATHER_CARET_DURATION = 56;
export const PixelCursorsGatherCaret_RANGE = [0, 56] as const; // 在原镜头里的起止帧

export const PixelCursorsGatherCaret: React.FC = () => (
  <Sequence from={-0} durationInFrames={56} layout="none">
    <Source />
  </Sequence>
);
