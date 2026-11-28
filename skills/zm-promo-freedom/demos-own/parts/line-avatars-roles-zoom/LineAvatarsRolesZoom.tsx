// 小零件：白线接着走 · 头像角色冒出 · 推近进度（118 帧，3.9 秒）
// 只播 CardLineFlow 的第 101–219 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/card-line-flow/CardLineFlow.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {CardLineFlow as Source} from '../../groups/card-line-flow/CardLineFlow'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const LINE_AVATARS_ROLES_ZOOM_DURATION = 118;
export const LineAvatarsRolesZoom_RANGE = [101, 219] as const; // 在原镜头里的起止帧

export const LineAvatarsRolesZoom: React.FC = () => (
  <Sequence from={-101} durationInFrames={219} layout="none">
    <Source />
  </Sequence>
);
