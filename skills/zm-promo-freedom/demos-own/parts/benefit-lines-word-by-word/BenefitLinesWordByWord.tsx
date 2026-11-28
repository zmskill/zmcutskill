// 小零件：两句好处逐词出 · 拖影退场（86 帧，2.9 秒）
// 只播 BenefitLinesToLogo 的第 0–86 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/outro/benefit-lines-to-logo/BenefitLinesToLogo.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {BenefitLinesToLogo as Source} from '../../outro/benefit-lines-to-logo/BenefitLinesToLogo'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const BENEFIT_LINES_WORD_BY_WORD_DURATION = 86;
export const BenefitLinesWordByWord_RANGE = [0, 86] as const; // 在原镜头里的起止帧

export const BenefitLinesWordByWord: React.FC = () => (
  <Sequence from={-0} durationInFrames={86} layout="none">
    <Source />
  </Sequence>
);
