// 小零件：名单推到一边 · 「那你呢？」（75 帧，2.5 秒）
// 只播 SaasAdSearchAiCta 的第 285–360 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/saas-ad-search-ai-cta/SaasAdSearchAiCta.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SaasAdSearchAiCta as Source} from '../../groups/saas-ad-search-ai-cta/SaasAdSearchAiCta'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const LIST_SIDE_QUESTION_YOU_DURATION = 75;
export const ListSideQuestionYou_RANGE = [285, 360] as const; // 在原镜头里的起止帧

export const ListSideQuestionYou: React.FC = () => (
  <Sequence from={-285} durationInFrames={360} layout="none">
    <Source />
  </Sequence>
);
