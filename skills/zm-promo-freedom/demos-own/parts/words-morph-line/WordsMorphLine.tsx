// 小零件：同一句话里换几个字 · 整行飘走（76 帧，2.5 秒）
// 整个镜头就是这一个动作：WordsMorphLine 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/words-morph-line/WordsMorphLine.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {WordsMorphLine as Source} from '../../groups/words-morph-line/WordsMorphLine'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WORDS_MORPH_LINE_DURATION = 76;
export const WordsMorphLine_RANGE = [0, 76] as const; // 在原镜头里的起止帧

export const WordsMorphLine: React.FC = () => (
  <Sequence from={-0} durationInFrames={76} layout="none">
    <Source />
  </Sequence>
);
