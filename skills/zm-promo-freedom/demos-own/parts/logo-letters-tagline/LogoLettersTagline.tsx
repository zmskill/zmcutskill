// 小零件：Logo 一帧一字长出 · 标语（80 帧，2.7 秒）
// 只播 PromptToSiteWall 的第 355–435 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/prompt-to-site-wall/PromptToSiteWall.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PromptToSiteWall as Source} from '../../ui-entrance/prompt-to-site-wall/PromptToSiteWall'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const LOGO_LETTERS_TAGLINE_DURATION = 80;
export const LogoLettersTagline_RANGE = [355, 435] as const; // 在原镜头里的起止帧

export const LogoLettersTagline: React.FC = () => (
  <Sequence from={-355} durationInFrames={435} layout="none">
    <Source />
  </Sequence>
);
