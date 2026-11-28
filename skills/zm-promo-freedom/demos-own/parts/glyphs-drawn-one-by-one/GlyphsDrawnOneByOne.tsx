// 小零件：参考线 → 描边 → 填实，逐字画出（114 帧，3.8 秒）
// 只播 GlyphConstructWordmark 的第 0–114 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/glyph-construct-wordmark/GlyphConstructWordmark.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {GlyphConstructWordmark as Source} from '../../groups/glyph-construct-wordmark/GlyphConstructWordmark'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const GLYPHS_DRAWN_ONE_BY_ONE_DURATION = 114;
export const GlyphsDrawnOneByOne_RANGE = [0, 114] as const; // 在原镜头里的起止帧

export const GlyphsDrawnOneByOne: React.FC = () => (
  <Sequence from={-0} durationInFrames={114} layout="none">
    <Source />
  </Sequence>
);
