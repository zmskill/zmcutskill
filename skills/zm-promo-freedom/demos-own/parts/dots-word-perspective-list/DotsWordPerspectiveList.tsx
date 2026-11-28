// 小零件：彩点飞来拼成字 · 整句让开出透视清单（129 帧，4.3 秒）
// 整个镜头就是这一个动作：DotsWordPerspectiveList 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/dots-word-perspective-list/DotsWordPerspectiveList.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {DotsWordPerspectiveList as Source} from '../../groups/dots-word-perspective-list/DotsWordPerspectiveList'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const DOTS_WORD_PERSPECTIVE_LIST_DURATION = 129;
export const DotsWordPerspectiveList_RANGE = [0, 129] as const; // 在原镜头里的起止帧

export const DotsWordPerspectiveList: React.FC = () => (
  <Sequence from={-0} durationInFrames={129} layout="none">
    <Source />
  </Sequence>
);
