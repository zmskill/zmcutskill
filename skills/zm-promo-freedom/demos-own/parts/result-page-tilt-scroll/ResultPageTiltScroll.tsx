// 小零件：结果页斜着进来 · 页内滚动（97 帧，3.2 秒）
// 只播 PromptToSiteWall 的第 123–220 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/prompt-to-site-wall/PromptToSiteWall.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PromptToSiteWall as Source} from '../../ui-entrance/prompt-to-site-wall/PromptToSiteWall'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const RESULT_PAGE_TILT_SCROLL_DURATION = 97;
export const ResultPageTiltScroll_RANGE = [123, 220] as const; // 在原镜头里的起止帧

export const ResultPageTiltScroll: React.FC = () => (
  <Sequence from={-123} durationInFrames={220} layout="none">
    <Source />
  </Sequence>
);
