// 小零件：五行蓝胶囊左右猛滑再刹住（23 帧，0.8 秒）
// 整个镜头就是这一个动作：PillRowsSlideClaims 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/pill-rows-slide-claims/PillRowsSlideClaims.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PillRowsSlideClaims as Source} from '../../groups/pill-rows-slide-claims/PillRowsSlideClaims'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PILL_ROWS_SLIDE_CLAIMS_DURATION = 23;
export const PillRowsSlideClaims_RANGE = [0, 23] as const; // 在原镜头里的起止帧

export const PillRowsSlideClaims: React.FC = () => (
  <Sequence from={-0} durationInFrames={23} layout="none">
    <Source />
  </Sequence>
);
