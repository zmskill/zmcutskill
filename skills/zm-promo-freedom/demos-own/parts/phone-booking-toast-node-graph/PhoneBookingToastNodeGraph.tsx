// 小零件：手机弹出预约通知 · 咨询汇成节点图（105 帧，3.5 秒）
// 只播 SaasAdSearchAiCta 的第 540–645 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/saas-ad-search-ai-cta/SaasAdSearchAiCta.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SaasAdSearchAiCta as Source} from '../../groups/saas-ad-search-ai-cta/SaasAdSearchAiCta'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PHONE_BOOKING_TOAST_NODE_GRAPH_DURATION = 105;
export const PhoneBookingToastNodeGraph_RANGE = [540, 645] as const; // 在原镜头里的起止帧

export const PhoneBookingToastNodeGraph: React.FC = () => (
  <Sequence from={-540} durationInFrames={645} layout="none">
    <Source />
  </Sequence>
);
