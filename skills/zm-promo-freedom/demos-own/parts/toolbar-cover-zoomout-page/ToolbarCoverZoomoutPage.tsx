// 小零件：巨大工具栏盖进来 · 点一下 · 猛拉远原来是网页（78 帧，2.6 秒）
// 只播 EditFlashTypeToolbar 的第 123–201 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/edit-flash-type-toolbar/EditFlashTypeToolbar.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {EditFlashTypeToolbar as Source} from '../../groups/edit-flash-type-toolbar/EditFlashTypeToolbar'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const TOOLBAR_COVER_ZOOMOUT_PAGE_DURATION = 78;
export const ToolbarCoverZoomoutPage_RANGE = [123, 201] as const; // 在原镜头里的起止帧

export const ToolbarCoverZoomoutPage: React.FC = () => (
  <Sequence from={-123} durationInFrames={201} layout="none">
    <Source />
  </Sequence>
);
