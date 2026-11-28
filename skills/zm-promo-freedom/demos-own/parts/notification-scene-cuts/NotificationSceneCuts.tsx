// 小零件：通知卡钉在正中 · 背后场景硬切（96 帧，3.2 秒）
// 整个镜头就是这一个动作：NotificationSceneCuts 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/notification-scene-cuts/NotificationSceneCuts.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {NotificationSceneCuts as Source} from '../../opening/notification-scene-cuts/NotificationSceneCuts'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const NOTIFICATION_SCENE_CUTS_DURATION = 96;
export const NotificationSceneCuts_RANGE = [0, 96] as const; // 在原镜头里的起止帧

export const NotificationSceneCuts: React.FC = () => (
  <Sequence from={-0} durationInFrames={96} layout="none">
    <Source />
  </Sequence>
);
