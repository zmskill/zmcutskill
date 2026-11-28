// 小零件：满屏照片缩进透镜 · 缩成一根光标（129 帧，4.3 秒）
// 整个镜头就是这一个动作：PhotoLensCursorType 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/photo-lens-cursor-type/PhotoLensCursorType.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PhotoLensCursorType as Source} from '../../groups/photo-lens-cursor-type/PhotoLensCursorType'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PHOTO_LENS_CURSOR_TYPE_DURATION = 129;
export const PhotoLensCursorType_RANGE = [0, 129] as const; // 在原镜头里的起止帧

export const PhotoLensCursorType: React.FC = () => (
  <Sequence from={-0} durationInFrames={129} layout="none">
    <Source />
  </Sequence>
);
