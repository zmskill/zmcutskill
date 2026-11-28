// 小零件：画完最后一个字 · 拉远成整个字标填实（78 帧，2.6 秒）
// 只播 GlyphConstructWordmark 的第 114–192 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/glyph-construct-wordmark/GlyphConstructWordmark.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {GlyphConstructWordmark as Source} from '../../groups/glyph-construct-wordmark/GlyphConstructWordmark'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const LAST_GLYPH_WORDMARK_SOLID_DURATION = 78;
export const LastGlyphWordmarkSolid_RANGE = [114, 192] as const; // 在原镜头里的起止帧

export const LastGlyphWordmarkSolid: React.FC = () => (
  <Sequence from={-114} durationInFrames={192} layout="none">
    <Source />
  </Sequence>
);
