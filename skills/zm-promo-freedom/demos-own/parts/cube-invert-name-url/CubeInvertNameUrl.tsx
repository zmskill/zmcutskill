// 小零件：圆撑开底色反转 · 立方体缩成标志 · 名字网址（162 帧，5.4 秒）
// 只播 DotCubeLogo 的第 78–240 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/dot-cube-logo/DotCubeLogo.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {DotCubeLogo as Source} from '../../groups/dot-cube-logo/DotCubeLogo'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const CUBE_INVERT_NAME_URL_DURATION = 162;
export const CubeInvertNameUrl_RANGE = [78, 240] as const; // 在原镜头里的起止帧

export const CubeInvertNameUrl: React.FC = () => (
  <Sequence from={-78} durationInFrames={240} layout="none">
    <Source />
  </Sequence>
);
