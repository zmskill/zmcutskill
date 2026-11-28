// 小零件：词拉开插进一把锁 · 原位换词（123 帧，4.1 秒）
// 整个镜头就是这一个动作：WordsSplitLockReplace 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/words-split-lock-replace/WordsSplitLockReplace.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {WordsSplitLockReplace as Source} from '../../groups/words-split-lock-replace/WordsSplitLockReplace'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WORDS_SPLIT_LOCK_REPLACE_DURATION = 123;
export const WordsSplitLockReplace_RANGE = [0, 123] as const; // 在原镜头里的起止帧

export const WordsSplitLockReplace: React.FC = () => (
  <Sequence from={-0} durationInFrames={123} layout="none">
    <Source />
  </Sequence>
);
