// 小零件：排第一的结果卡 · 地图上也找得到（90 帧，3.0 秒）
// 只播 SaasAdSearchAiCta 的第 360–450 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/saas-ad-search-ai-cta/SaasAdSearchAiCta.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SaasAdSearchAiCta as Source} from '../../groups/saas-ad-search-ai-cta/SaasAdSearchAiCta'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const RANK_FIRST_CARD_MAP_PIN_DURATION = 90;
export const RankFirstCardMapPin_RANGE = [360, 450] as const; // 在原镜头里的起止帧

export const RankFirstCardMapPin: React.FC = () => (
  <Sequence from={-360} durationInFrames={450} layout="none">
    <Source />
  </Sequence>
);
