// 小零件：三个带图标的词错落滑进 · 浏览器显出来（90 帧，3.0 秒）
// 只播 IntroGenieWordmarkBrowser 的第 152–242 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/intro-genie-wordmark-browser/IntroGenieWordmarkBrowser.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {IntroGenieWordmarkBrowser as Source} from '../../groups/intro-genie-wordmark-browser/IntroGenieWordmarkBrowser'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WORDS_STAGGER_BROWSER_REVEAL_DURATION = 90;
export const WordsStaggerBrowserReveal_RANGE = [152, 242] as const; // 在原镜头里的起止帧

export const WordsStaggerBrowserReveal: React.FC = () => (
  <Sequence from={-152} durationInFrames={242} layout="none">
    <Source />
  </Sequence>
);
