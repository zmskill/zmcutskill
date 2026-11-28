// 小零件：像素块闪掉上一句 · 词冒出 · 卡片散在四周（115 帧，3.8 秒）
// 整个镜头就是这一个动作：ScatterCardsLostTeams 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/scatter-cards-lost-teams/ScatterCardsLostTeams.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {ScatterCardsLostTeams as Source} from '../../groups/scatter-cards-lost-teams/ScatterCardsLostTeams'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const SCATTER_CARDS_LOST_TEAMS_DURATION = 115;
export const ScatterCardsLostTeams_RANGE = [0, 115] as const; // 在原镜头里的起止帧

export const ScatterCardsLostTeams: React.FC = () => (
  <Sequence from={-0} durationInFrames={115} layout="none">
    <Source />
  </Sequence>
);
