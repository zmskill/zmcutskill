// 小零件：营收折线一路往上 · 后台看板（105 帧，3.5 秒）
// 只播 SaasAdSearchAiCta 的第 645–750 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/saas-ad-search-ai-cta/SaasAdSearchAiCta.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SaasAdSearchAiCta as Source} from '../../groups/saas-ad-search-ai-cta/SaasAdSearchAiCta'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const REVENUE_LINE_DASHBOARD_DURATION = 105;
export const RevenueLineDashboard_RANGE = [645, 750] as const; // 在原镜头里的起止帧

export const RevenueLineDashboard: React.FC = () => (
  <Sequence from={-645} durationInFrames={750} layout="none">
    <Source />
  </Sequence>
);
