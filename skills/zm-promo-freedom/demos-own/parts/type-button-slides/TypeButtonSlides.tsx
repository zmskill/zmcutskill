// 小零件：超大字逐字打 · 拉远成按钮 · 出幻灯片（179 帧，6.0 秒）
// 整个镜头就是这一个动作：TypeButtonSlides 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/type-button-slides/TypeButtonSlides.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {TypeButtonSlides as Source} from '../../groups/type-button-slides/TypeButtonSlides'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const TYPE_BUTTON_SLIDES_DURATION = 179;
export const TypeButtonSlides_RANGE = [0, 179] as const; // 在原镜头里的起止帧

export const TypeButtonSlides: React.FC = () => (
  <Sequence from={-0} durationInFrames={179} layout="none">
    <Source />
  </Sequence>
);
