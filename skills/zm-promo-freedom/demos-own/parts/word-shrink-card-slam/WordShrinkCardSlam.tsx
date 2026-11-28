// 小零件：大字越缩越快 · 白卡片砸下来 · 界面显出（70 帧，2.3 秒）
// 只播 SmarterCardBoardTilt 的第 0–70 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/smarter-card-board-tilt/SmarterCardBoardTilt.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SmarterCardBoardTilt as Source} from '../../groups/smarter-card-board-tilt/SmarterCardBoardTilt'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WORD_SHRINK_CARD_SLAM_DURATION = 70;
export const WordShrinkCardSlam_RANGE = [0, 70] as const; // 在原镜头里的起止帧

export const WordShrinkCardSlam: React.FC = () => (
  <Sequence from={-0} durationInFrames={70} layout="none">
    <Source />
  </Sequence>
);
