// 小零件：蓝色海报卡 · 逐行打字换字体（147 帧，4.9 秒）
// 只播 CondensedLinesPosterCard 的第 108–255 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/condensed-lines-poster-card/CondensedLinesPosterCard.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {CondensedLinesPosterCard as Source} from '../../groups/condensed-lines-poster-card/CondensedLinesPosterCard'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const BLUE_POSTER_CARD_TYPE_FONTS_DURATION = 147;
export const BluePosterCardTypeFonts_RANGE = [108, 255] as const; // 在原镜头里的起止帧

export const BluePosterCardTypeFonts: React.FC = () => (
  <Sequence from={-108} durationInFrames={255} layout="none">
    <Source />
  </Sequence>
);
