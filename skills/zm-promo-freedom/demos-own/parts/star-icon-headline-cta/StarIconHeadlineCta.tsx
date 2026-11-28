// 小零件：星标图标亮起 · 标题 · 行动按钮（150 帧，5.0 秒）
// 只播 SaasAdSearchAiCta 的第 795–945 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/saas-ad-search-ai-cta/SaasAdSearchAiCta.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SaasAdSearchAiCta as Source} from '../../groups/saas-ad-search-ai-cta/SaasAdSearchAiCta'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const STAR_ICON_HEADLINE_CTA_DURATION = 150;
export const StarIconHeadlineCta_RANGE = [795, 945] as const; // 在原镜头里的起止帧

export const StarIconHeadlineCta: React.FC = () => (
  <Sequence from={-795} durationInFrames={945} layout="none">
    <Source />
  </Sequence>
);
