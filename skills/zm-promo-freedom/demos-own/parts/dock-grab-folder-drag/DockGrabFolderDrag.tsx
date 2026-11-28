// 小零件：抓起文件夹拖走（91 帧，3.0 秒）
// 只播 FolderTypeDock 的第 104–195 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/folder-type-dock/FolderTypeDock.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {FolderTypeDock as Source} from '../../groups/folder-type-dock/FolderTypeDock'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const DOCK_GRAB_FOLDER_DRAG_DURATION = 91;
export const DockGrabFolderDrag_RANGE = [104, 195] as const; // 在原镜头里的起止帧

export const DockGrabFolderDrag: React.FC = () => (
  <Sequence from={-104} durationInFrames={195} layout="none">
    <Source />
  </Sequence>
);
