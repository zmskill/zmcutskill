// 小零件：胶囊压成进度条 · 报告页一张张出（180 帧，6.0 秒）
// 整个镜头就是这一个动作：PillBarReportSlides 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/pill-bar-report-slides/PillBarReportSlides.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PillBarReportSlides as Source} from '../../groups/pill-bar-report-slides/PillBarReportSlides'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PILL_BAR_REPORT_SLIDES_DURATION = 180;
export const PillBarReportSlides_RANGE = [0, 180] as const; // 在原镜头里的起止帧

export const PillBarReportSlides: React.FC = () => (
  <Sequence from={-0} durationInFrames={180} layout="none">
    <Source />
  </Sequence>
);
