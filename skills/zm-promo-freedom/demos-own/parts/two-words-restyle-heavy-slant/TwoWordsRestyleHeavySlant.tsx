// 小零件：连着两个词换字体：变厚重、变倾斜（135 帧，4.5 秒）
// 只播 RichTextCursorStyles 的第 294–429 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/rich-text-cursor-styles/RichTextCursorStyles.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {RichTextCursorStyles as Source} from '../../groups/rich-text-cursor-styles/RichTextCursorStyles'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const TWO_WORDS_RESTYLE_HEAVY_SLANT_DURATION = 135;
export const TwoWordsRestyleHeavySlant_RANGE = [294, 429] as const; // 在原镜头里的起止帧

export const TwoWordsRestyleHeavySlant: React.FC = () => (
  <Sequence from={-294} durationInFrames={429} layout="none">
    <Source />
  </Sequence>
);
