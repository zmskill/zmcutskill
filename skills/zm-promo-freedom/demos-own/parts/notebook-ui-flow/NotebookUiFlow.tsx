// 小零件：Logo 一闪 · 硬切进笔记本界面（141 帧，4.7 秒）
// 整个镜头就是这一个动作：NotebookUiFlow 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/notebook-ui-flow/NotebookUiFlow.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {NotebookUiFlow as Source} from '../../groups/notebook-ui-flow/NotebookUiFlow'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const NOTEBOOK_UI_FLOW_DURATION = 141;
export const NotebookUiFlow_RANGE = [0, 141] as const; // 在原镜头里的起止帧

export const NotebookUiFlow: React.FC = () => (
  <Sequence from={-0} durationInFrames={141} layout="none">
    <Source />
  </Sequence>
);
