// 小零件：玻璃文件夹拖进聊天面板 · 边拖边打字（88 帧，2.9 秒）
// 整个镜头就是这一个动作：FolderDropChat 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/folder-drop-chat/FolderDropChat.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {FolderDropChat as Source} from '../../groups/folder-drop-chat/FolderDropChat'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const FOLDER_DROP_CHAT_DURATION = 88;
export const FolderDropChat_RANGE = [0, 88] as const; // 在原镜头里的起止帧

export const FolderDropChat: React.FC = () => (
  <Sequence from={-0} durationInFrames={88} layout="none">
    <Source />
  </Sequence>
);
