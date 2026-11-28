// 小零件：猛拉远 · 整句变小 · 名字光标散在四周（81 帧，2.7 秒）
// 只播 RichTextCursorStyles 的第 429–510 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/rich-text-cursor-styles/RichTextCursorStyles.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {RichTextCursorStyles as Source} from '../../groups/rich-text-cursor-styles/RichTextCursorStyles'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const ZOOMOUT_WHOLE_SENTENCE_CURSORS_DURATION = 81;
export const ZoomoutWholeSentenceCursors_RANGE = [429, 510] as const; // 在原镜头里的起止帧

export const ZoomoutWholeSentenceCursors: React.FC = () => (
  <Sequence from={-429} durationInFrames={510} layout="none">
    <Source />
  </Sequence>
);
