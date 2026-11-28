// 小零件：卡片往后倒 · 镜头扎进去变成一条路（93 帧，3.1 秒）
// 整个镜头就是这一个动作：FormTiltRoad 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/form-tilt-road/FormTiltRoad.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {FormTiltRoad as Source} from '../../groups/form-tilt-road/FormTiltRoad'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const FORM_TILT_ROAD_DURATION = 93;
export const FormTiltRoad_RANGE = [0, 93] as const; // 在原镜头里的起止帧

export const FormTiltRoad: React.FC = () => (
  <Sequence from={-0} durationInFrames={93} layout="none">
    <Source />
  </Sequence>
);
