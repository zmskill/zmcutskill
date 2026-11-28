// 小零件：一句话中间嵌一块文件夹砖（35 帧，1.2 秒）
// 只播 FolderTypeDock 的第 0–35 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/folder-type-dock/FolderTypeDock.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {FolderTypeDock as Source} from '../../groups/folder-type-dock/FolderTypeDock'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const SENTENCE_FOLDER_TILE_DURATION = 35;
export const SentenceFolderTile_RANGE = [0, 35] as const; // 在原镜头里的起止帧

export const SentenceFolderTile: React.FC = () => (
  <Sequence from={-0} durationInFrames={35} layout="none">
    <Source />
  </Sequence>
);
