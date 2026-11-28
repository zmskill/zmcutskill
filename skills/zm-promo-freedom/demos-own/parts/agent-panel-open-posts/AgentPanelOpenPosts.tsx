// 小零件：小面板弹出撑大 · 帖子卡依次弹出（125 帧，4.2 秒）
// 只播 AgentBrowseMatch 的第 96–221 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/agent-browse-match/AgentBrowseMatch.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {AgentBrowseMatch as Source} from '../../ui-entrance/agent-browse-match/AgentBrowseMatch'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const AGENT_PANEL_OPEN_POSTS_DURATION = 125;
export const AgentPanelOpenPosts_RANGE = [96, 221] as const; // 在原镜头里的起止帧

export const AgentPanelOpenPosts: React.FC = () => (
  <Sequence from={-96} durationInFrames={221} layout="none">
    <Source />
  </Sequence>
);
