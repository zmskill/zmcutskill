// 小零件：通知卡飞过 · 落到飘带上一直流（150 帧，5.0 秒）
// 整个镜头就是这一个动作：MessageRibbonFlow 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/message-ribbon-flow/MessageRibbonFlow.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {MessageRibbonFlow as Source} from '../../opening/message-ribbon-flow/MessageRibbonFlow'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const MESSAGE_RIBBON_FLOW_DURATION = 150;
export const MessageRibbonFlow_RANGE = [0, 150] as const; // 在原镜头里的起止帧

export const MessageRibbonFlow: React.FC = () => (
  <Sequence from={-0} durationInFrames={150} layout="none">
    <Source />
  </Sequence>
);
