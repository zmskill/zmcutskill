// 小零件：一排图标被吸进去 · 缩成标志 · 产品名（98 帧，3.3 秒）
// 只播 SubscriptionIconsAbsorbUrl 的第 56–154 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/subscription-icons-absorb-url/SubscriptionIconsAbsorbUrl.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SubscriptionIconsAbsorbUrl as Source} from '../../groups/subscription-icons-absorb-url/SubscriptionIconsAbsorbUrl'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const ICONS_ABSORBED_LOGO_NAME_DURATION = 98;
export const IconsAbsorbedLogoName_RANGE = [56, 154] as const; // 在原镜头里的起止帧

export const IconsAbsorbedLogoName: React.FC = () => (
  <Sequence from={-56} durationInFrames={154} layout="none">
    <Source />
  </Sequence>
);
