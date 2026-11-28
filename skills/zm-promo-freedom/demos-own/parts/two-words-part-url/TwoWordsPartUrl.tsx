// 小零件：两个词往两边退开 · 中间打出网址（93 帧，3.1 秒）
// 只播 SubscriptionIconsAbsorbUrl 的第 154–247 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/subscription-icons-absorb-url/SubscriptionIconsAbsorbUrl.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SubscriptionIconsAbsorbUrl as Source} from '../../groups/subscription-icons-absorb-url/SubscriptionIconsAbsorbUrl'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const TWO_WORDS_PART_URL_DURATION = 93;
export const TwoWordsPartUrl_RANGE = [154, 247] as const; // 在原镜头里的起止帧

export const TwoWordsPartUrl: React.FC = () => (
  <Sequence from={-154} durationInFrames={247} layout="none">
    <Source />
  </Sequence>
);
