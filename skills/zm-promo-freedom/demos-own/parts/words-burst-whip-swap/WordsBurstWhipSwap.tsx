// 小零件：词各自冲到原位 · 甩出画换下一个词（62 帧，2.1 秒）
// 只播 EditFlashTypeToolbar 的第 0–62 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/edit-flash-type-toolbar/EditFlashTypeToolbar.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {EditFlashTypeToolbar as Source} from '../../groups/edit-flash-type-toolbar/EditFlashTypeToolbar'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WORDS_BURST_WHIP_SWAP_DURATION = 62;
export const WordsBurstWhipSwap_RANGE = [0, 62] as const; // 在原镜头里的起止帧

export const WordsBurstWhipSwap: React.FC = () => (
  <Sequence from={-0} durationInFrames={62} layout="none">
    <Source />
  </Sequence>
);
