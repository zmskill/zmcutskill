// 小零件：三张玻璃数字卡 · 数字滚着涨（60 帧，2.0 秒）
// 整个镜头就是这一个动作：GlassNumberCards 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/glass-number-cards/GlassNumberCards.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {GlassNumberCards as Source} from '../../groups/glass-number-cards/GlassNumberCards'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const GLASS_NUMBER_CARDS_DURATION = 60;
export const GlassNumberCards_RANGE = [0, 60] as const; // 在原镜头里的起止帧

export const GlassNumberCards: React.FC = () => (
  <Sequence from={-0} durationInFrames={60} layout="none">
    <Source />
  </Sequence>
);
