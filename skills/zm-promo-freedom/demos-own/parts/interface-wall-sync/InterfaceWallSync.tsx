// 小零件：界面墙斜着浮出 · 两句好处 · 过曝到白（135 帧，4.5 秒）
// 整个镜头就是这一个动作：InterfaceWallSync 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/interface-wall-sync/InterfaceWallSync.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {InterfaceWallSync as Source} from '../../groups/interface-wall-sync/InterfaceWallSync'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const INTERFACE_WALL_SYNC_DURATION = 135;
export const InterfaceWallSync_RANGE = [0, 135] as const; // 在原镜头里的起止帧

export const InterfaceWallSync: React.FC = () => (
  <Sequence from={-0} durationInFrames={135} layout="none">
    <Source />
  </Sequence>
);
