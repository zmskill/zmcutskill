// 小零件：搜索框打字点搜索 · 「你的客户正在搜」（120 帧，4.0 秒）
// 只播 SaasAdSearchAiCta 的第 0–120 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/saas-ad-search-ai-cta/SaasAdSearchAiCta.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SaasAdSearchAiCta as Source} from '../../groups/saas-ad-search-ai-cta/SaasAdSearchAiCta'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const SEARCH_TYPE_CLICK_CUSTOMERS_DURATION = 120;
export const SearchTypeClickCustomers_RANGE = [0, 120] as const; // 在原镜头里的起止帧

export const SearchTypeClickCustomers: React.FC = () => (
  <Sequence from={-0} durationInFrames={120} layout="none">
    <Source />
  </Sequence>
);
