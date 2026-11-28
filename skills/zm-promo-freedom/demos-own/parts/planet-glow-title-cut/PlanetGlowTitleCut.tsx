// 小零件：星球上沿亮起沉下去 · 标题逐词由糊变清（117 帧，3.9 秒）
// 整个镜头就是这一个动作：PlanetGlowTitleCut 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/planet-glow-title-cut/PlanetGlowTitleCut.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PlanetGlowTitleCut as Source} from '../../groups/planet-glow-title-cut/PlanetGlowTitleCut'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PLANET_GLOW_TITLE_CUT_DURATION = 117;
export const PlanetGlowTitleCut_RANGE = [0, 117] as const; // 在原镜头里的起止帧

export const PlanetGlowTitleCut: React.FC = () => (
  <Sequence from={-0} durationInFrames={117} layout="none">
    <Source />
  </Sequence>
);
