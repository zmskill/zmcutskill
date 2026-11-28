// 小零件：硬切斜放整页 · 上方换一句话 · 甩走（75 帧，2.5 秒）
// 只播 SmarterCardBoardTilt 的第 120–195 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/smarter-card-board-tilt/SmarterCardBoardTilt.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SmarterCardBoardTilt as Source} from '../../groups/smarter-card-board-tilt/SmarterCardBoardTilt'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const TILTED_PAGE_CAPTION_SWAP_DURATION = 75;
export const TiltedPageCaptionSwap_RANGE = [120, 195] as const; // 在原镜头里的起止帧

export const TiltedPageCaptionSwap: React.FC = () => (
  <Sequence from={-120} durationInFrames={195} layout="none">
    <Source />
  </Sequence>
);
