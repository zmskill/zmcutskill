// 小零件：漩涡卷走 · 转折句 · 蓝点吞满屏（52 帧，1.7 秒）
// 只播 PainSwirlDotLogo 的第 115–167 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/pain-swirl-dot-logo/PainSwirlDotLogo.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PainSwirlDotLogo as Source} from '../../opening/pain-swirl-dot-logo/PainSwirlDotLogo'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const SWIRL_TURN_DOT_FLOOD_DURATION = 52;
export const SwirlTurnDotFlood_RANGE = [115, 167] as const; // 在原镜头里的起止帧

export const SwirlTurnDotFlood: React.FC = () => (
  <Sequence from={-115} durationInFrames={167} layout="none">
    <Source />
  </Sequence>
);
