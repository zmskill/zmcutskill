// 小零件：输入框长大 · 追着打字（66 帧，2.2 秒）
// 只播 PromptToSiteWall 的第 12–78 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/prompt-to-site-wall/PromptToSiteWall.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PromptToSiteWall as Source} from '../../ui-entrance/prompt-to-site-wall/PromptToSiteWall'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const INPUT_GROW_TYPE_CHASE_DURATION = 66;
export const InputGrowTypeChase_RANGE = [12, 78] as const; // 在原镜头里的起止帧

export const InputGrowTypeChase: React.FC = () => (
  <Sequence from={-12} durationInFrames={78} layout="none">
    <Source />
  </Sequence>
);
