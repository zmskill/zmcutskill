// 小零件：逐字打字 · 每个字不停换字体（120 帧，4.0 秒）
// 整个镜头就是这一个动作：MixedGlyphTypeGlitch 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/mixed-glyph-type-glitch/MixedGlyphTypeGlitch.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {MixedGlyphTypeGlitch as Source} from '../../groups/mixed-glyph-type-glitch/MixedGlyphTypeGlitch'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const MIXED_GLYPH_TYPE_GLITCH_DURATION = 120;
export const MixedGlyphTypeGlitch_RANGE = [0, 120] as const; // 在原镜头里的起止帧

export const MixedGlyphTypeGlitch: React.FC = () => (
  <Sequence from={-0} durationInFrames={120} layout="none">
    <Source />
  </Sequence>
);
