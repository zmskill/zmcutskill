// 小零件：逐字打字 · 镜头甩 · 选中一个词换字体（117 帧，3.9 秒）
// 只播 RichTextCursorStyles 的第 56–173 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/rich-text-cursor-styles/RichTextCursorStyles.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {RichTextCursorStyles as Source} from '../../groups/rich-text-cursor-styles/RichTextCursorStyles'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const TYPE_PAN_SELECT_RESTYLE_DURATION = 117;
export const TypePanSelectRestyle_RANGE = [56, 173] as const; // 在原镜头里的起止帧

export const TypePanSelectRestyle: React.FC = () => (
  <Sequence from={-56} durationInFrames={173} layout="none">
    <Source />
  </Sequence>
);
