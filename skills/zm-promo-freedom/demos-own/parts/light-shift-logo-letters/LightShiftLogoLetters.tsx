// 小零件：换光 · Logo 逐字由浅变深 · 两行小字（106 帧，3.5 秒）
// 只播 BenefitLinesToLogo 的第 80–186 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/outro/benefit-lines-to-logo/BenefitLinesToLogo.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {BenefitLinesToLogo as Source} from '../../outro/benefit-lines-to-logo/BenefitLinesToLogo'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const LIGHT_SHIFT_LOGO_LETTERS_DURATION = 106;
export const LightShiftLogoLetters_RANGE = [80, 186] as const; // 在原镜头里的起止帧

export const LightShiftLogoLetters: React.FC = () => (
  <Sequence from={-80} durationInFrames={186} layout="none">
    <Source />
  </Sequence>
);
