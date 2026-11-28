// 小零件：句子从小图标两边一截截长出来（75 帧，2.5 秒）
// 只播 WordInsertBeamLogo 的第 0–75 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/word-insert-beam-logo/WordInsertBeamLogo.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {WordInsertBeamLogo as Source} from '../../groups/word-insert-beam-logo/WordInsertBeamLogo'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const SENTENCE_GROWS_AROUND_ICON_DURATION = 75;
export const SentenceGrowsAroundIcon_RANGE = [0, 75] as const; // 在原镜头里的起止帧

export const SentenceGrowsAroundIcon: React.FC = () => (
  <Sequence from={-0} durationInFrames={75} layout="none">
    <Source />
  </Sequence>
);
