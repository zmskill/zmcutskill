// 小零件：光束放射 · 亮成标志 · 名字（125 帧，4.2 秒）
// 只播 WordInsertBeamLogo 的第 75–200 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/word-insert-beam-logo/WordInsertBeamLogo.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {WordInsertBeamLogo as Source} from '../../groups/word-insert-beam-logo/WordInsertBeamLogo'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const BEAM_BURST_LOGO_NAME_DURATION = 125;
export const BeamBurstLogoName_RANGE = [75, 200] as const; // 在原镜头里的起止帧

export const BeamBurstLogoName: React.FC = () => (
  <Sequence from={-75} durationInFrames={200} layout="none">
    <Source />
  </Sequence>
);
