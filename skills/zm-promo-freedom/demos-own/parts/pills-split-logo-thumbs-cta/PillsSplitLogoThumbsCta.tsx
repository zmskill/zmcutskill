// 小零件：胶囊甩开 · 标志弹出 · 截图弹进飞走 · 按钮（108 帧，3.6 秒）
// 只播 PillPairLogoScatter 的第 42–150 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/pill-pair-logo-scatter/PillPairLogoScatter.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PillPairLogoScatter as Source} from '../../groups/pill-pair-logo-scatter/PillPairLogoScatter'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PILLS_SPLIT_LOGO_THUMBS_CTA_DURATION = 108;
export const PillsSplitLogoThumbsCta_RANGE = [42, 150] as const; // 在原镜头里的起止帧

export const PillsSplitLogoThumbsCta: React.FC = () => (
  <Sequence from={-42} durationInFrames={150} layout="none">
    <Source />
  </Sequence>
);
