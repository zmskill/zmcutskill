// 小零件：整块高亮 · 删掉重打一句（61 帧，2.0 秒）
// 只播 EditFlashTypeToolbar 的第 62–123 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/edit-flash-type-toolbar/EditFlashTypeToolbar.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {EditFlashTypeToolbar as Source} from '../../groups/edit-flash-type-toolbar/EditFlashTypeToolbar'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const HIGHLIGHT_ERASE_RETYPE_DURATION = 61;
export const HighlightEraseRetype_RANGE = [62, 123] as const; // 在原镜头里的起止帧

export const HighlightEraseRetype: React.FC = () => (
  <Sequence from={-62} durationInFrames={123} layout="none">
    <Source />
  </Sequence>
);
