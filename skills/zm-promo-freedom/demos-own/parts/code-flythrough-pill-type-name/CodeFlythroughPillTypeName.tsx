// 小零件：穿过漂浮的代码 · 输入条打字 · 拉远出产品名（123 帧，4.1 秒）
// 只播 CodeFlythroughGenerate 的第 0–123 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/code-flythrough-generate/CodeFlythroughGenerate.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {CodeFlythroughGenerate as Source} from '../../groups/code-flythrough-generate/CodeFlythroughGenerate'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const CODE_FLYTHROUGH_PILL_TYPE_NAME_DURATION = 123;
export const CodeFlythroughPillTypeName_RANGE = [0, 123] as const; // 在原镜头里的起止帧

export const CodeFlythroughPillTypeName: React.FC = () => (
  <Sequence from={-0} durationInFrames={123} layout="none">
    <Source />
  </Sequence>
);
