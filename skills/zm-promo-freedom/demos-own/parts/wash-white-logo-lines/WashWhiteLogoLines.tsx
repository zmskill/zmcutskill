// 小零件：整屏洗白 · 标志和四行定位由灰变黑（68 帧，2.3 秒）
// 只播 IntroGenieWordmarkBrowser 的第 84–152 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/intro-genie-wordmark-browser/IntroGenieWordmarkBrowser.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {IntroGenieWordmarkBrowser as Source} from '../../groups/intro-genie-wordmark-browser/IntroGenieWordmarkBrowser'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WASH_WHITE_LOGO_LINES_DURATION = 68;
export const WashWhiteLogoLines_RANGE = [84, 152] as const; // 在原镜头里的起止帧

export const WashWhiteLogoLines: React.FC = () => (
  <Sequence from={-84} durationInFrames={152} layout="none">
    <Source />
  </Sequence>
);
