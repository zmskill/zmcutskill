// 小零件：从下往上淡成白 · Logo 逐字出（110 帧，3.7 秒）
// 只播 TiltedDashboardPanLogo 的第 90–200 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/camera/tilted-dashboard-pan-logo/TiltedDashboardPanLogo.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {TiltedDashboardPanLogo as Source} from '../../camera/tilted-dashboard-pan-logo/TiltedDashboardPanLogo'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WHITE_RISE_LOGO_LETTERS_DURATION = 110;
export const WhiteRiseLogoLetters_RANGE = [90, 200] as const; // 在原镜头里的起止帧

export const WhiteRiseLogoLetters: React.FC = () => (
  <Sequence from={-90} durationInFrames={200} layout="none">
    <Source />
  </Sequence>
);
