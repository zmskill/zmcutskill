// 小零件：人像圆长出蓝圆挤成沙漏 · 收成一个词（87 帧，2.9 秒）
// 只播 CircleMorphListen 的第 0–87 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/circle-morph-listen/CircleMorphListen.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {CircleMorphListen as Source} from '../../groups/circle-morph-listen/CircleMorphListen'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PORTRAIT_CIRCLES_SQUEEZE_WORD_DURATION = 87;
export const PortraitCirclesSqueezeWord_RANGE = [0, 87] as const; // 在原镜头里的起止帧

export const PortraitCirclesSqueezeWord: React.FC = () => (
  <Sequence from={-0} durationInFrames={87} layout="none">
    <Source />
  </Sequence>
);
