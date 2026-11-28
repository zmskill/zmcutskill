// 小零件：AI 聊天框提问 · 出一串推荐名单（135 帧，4.5 秒）
// 只播 SaasAdSearchAiCta 的第 150–285 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/saas-ad-search-ai-cta/SaasAdSearchAiCta.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SaasAdSearchAiCta as Source} from '../../groups/saas-ad-search-ai-cta/SaasAdSearchAiCta'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const AI_CHAT_ASK_LIST_DURATION = 135;
export const AiChatAskList_RANGE = [150, 285] as const; // 在原镜头里的起止帧

export const AiChatAskList: React.FC = () => (
  <Sequence from={-150} durationInFrames={285} layout="none">
    <Source />
  </Sequence>
);
