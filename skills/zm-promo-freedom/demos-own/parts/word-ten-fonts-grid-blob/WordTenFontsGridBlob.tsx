// 小零件：同一个词十种字体铺满屏 · 像素团吞掉（141 帧，4.7 秒）
// 只播 WordStretchStyleGrid 的第 174–315 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/word-stretch-style-grid/WordStretchStyleGrid.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {WordStretchStyleGrid as Source} from '../../groups/word-stretch-style-grid/WordStretchStyleGrid'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WORD_TEN_FONTS_GRID_BLOB_DURATION = 141;
export const WordTenFontsGridBlob_RANGE = [174, 315] as const; // 在原镜头里的起止帧

export const WordTenFontsGridBlob: React.FC = () => (
  <Sequence from={-174} durationInFrames={315} layout="none">
    <Source />
  </Sequence>
);
