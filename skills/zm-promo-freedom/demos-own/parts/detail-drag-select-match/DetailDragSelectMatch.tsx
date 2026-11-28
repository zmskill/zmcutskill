// 小零件：详情页 · 拖选关键词 · 条件一条条对上（90 帧，3.0 秒）
// 只播 AgentBrowseMatch 的第 302–392 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/agent-browse-match/AgentBrowseMatch.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {AgentBrowseMatch as Source} from '../../ui-entrance/agent-browse-match/AgentBrowseMatch'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const DETAIL_DRAG_SELECT_MATCH_DURATION = 90;
export const DetailDragSelectMatch_RANGE = [302, 392] as const; // 在原镜头里的起止帧

export const DetailDragSelectMatch: React.FC = () => (
  <Sequence from={-302} durationInFrames={392} layout="none">
    <Source />
  </Sequence>
);
