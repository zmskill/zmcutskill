// 小零件：AI 也推荐你 · 百分比涨到 100（90 帧，3.0 秒）
// 只播 SaasAdSearchAiCta 的第 450–540 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/saas-ad-search-ai-cta/SaasAdSearchAiCta.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SaasAdSearchAiCta as Source} from '../../groups/saas-ad-search-ai-cta/SaasAdSearchAiCta'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const AI_RECOMMEND_PERCENT_FILL_DURATION = 90;
export const AiRecommendPercentFill_RANGE = [450, 540] as const; // 在原镜头里的起止帧

export const AiRecommendPercentFill: React.FC = () => (
  <Sequence from={-450} durationInFrames={540} layout="none">
    <Source />
  </Sequence>
);
