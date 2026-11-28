// 小零件：卡片变漂浮卡 · 几个光标逐张看（81 帧，2.7 秒）
// 只播 AgentBrowseMatch 的第 221–302 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/agent-browse-match/AgentBrowseMatch.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {AgentBrowseMatch as Source} from '../../ui-entrance/agent-browse-match/AgentBrowseMatch'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const FLOATING_CARDS_CURSORS_DURATION = 81;
export const FloatingCardsCursors_RANGE = [221, 302] as const; // 在原镜头里的起止帧

export const FloatingCardsCursors: React.FC = () => (
  <Sequence from={-221} durationInFrames={302} layout="none">
    <Source />
  </Sequence>
);
