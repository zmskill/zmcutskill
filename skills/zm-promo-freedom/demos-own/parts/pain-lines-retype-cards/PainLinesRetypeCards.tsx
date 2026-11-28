// 小零件：痛点句重打三次 · 小卡围过来（115 帧，3.8 秒）
// 只播 PainSwirlDotLogo 的第 0–115 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/pain-swirl-dot-logo/PainSwirlDotLogo.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PainSwirlDotLogo as Source} from '../../opening/pain-swirl-dot-logo/PainSwirlDotLogo'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PAIN_LINES_RETYPE_CARDS_DURATION = 115;
export const PainLinesRetypeCards_RANGE = [0, 115] as const; // 在原镜头里的起止帧

export const PainLinesRetypeCards: React.FC = () => (
  <Sequence from={-0} durationInFrames={115} layout="none">
    <Source />
  </Sequence>
);
