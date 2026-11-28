// 小零件：大开关打开 · 卡片从四周飞来围着大字转（104 帧，3.5 秒）
// 整个镜头就是这一个动作：ToggleAutopilotCards 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/toggle-autopilot-cards/ToggleAutopilotCards.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {ToggleAutopilotCards as Source} from '../../groups/toggle-autopilot-cards/ToggleAutopilotCards'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const TOGGLE_AUTOPILOT_CARDS_DURATION = 104;
export const ToggleAutopilotCards_RANGE = [0, 104] as const; // 在原镜头里的起止帧

export const ToggleAutopilotCards: React.FC = () => (
  <Sequence from={-0} durationInFrames={104} layout="none">
    <Source />
  </Sequence>
);
