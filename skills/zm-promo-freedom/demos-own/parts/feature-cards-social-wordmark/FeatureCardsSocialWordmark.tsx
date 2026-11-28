// 小零件：功能小卡一张张顶上来 · 收成字标（98 帧，3.3 秒）
// 整个镜头就是这一个动作：FeatureCardsSocialWordmark 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/feature-cards-social-wordmark/FeatureCardsSocialWordmark.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {FeatureCardsSocialWordmark as Source} from '../../groups/feature-cards-social-wordmark/FeatureCardsSocialWordmark'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const FEATURE_CARDS_SOCIAL_WORDMARK_DURATION = 98;
export const FeatureCardsSocialWordmark_RANGE = [0, 98] as const; // 在原镜头里的起止帧

export const FeatureCardsSocialWordmark: React.FC = () => (
  <Sequence from={-0} durationInFrames={98} layout="none">
    <Source />
  </Sequence>
);
