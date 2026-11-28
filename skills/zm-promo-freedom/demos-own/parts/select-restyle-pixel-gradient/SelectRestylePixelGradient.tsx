// 小零件：再选一个词换字体 · 像素乱跳 · 变渐变色（121 帧，4.0 秒）
// 只播 RichTextCursorStyles 的第 173–294 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/rich-text-cursor-styles/RichTextCursorStyles.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {RichTextCursorStyles as Source} from '../../groups/rich-text-cursor-styles/RichTextCursorStyles'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const SELECT_RESTYLE_PIXEL_GRADIENT_DURATION = 121;
export const SelectRestylePixelGradient_RANGE = [173, 294] as const; // 在原镜头里的起止帧

export const SelectRestylePixelGradient: React.FC = () => (
  <Sequence from={-173} durationInFrames={294} layout="none">
    <Source />
  </Sequence>
);
