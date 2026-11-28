// 小零件：擦掉名字 · 原地换词停在转折词（44 帧，1.5 秒）
// 只播 GiantWordLogoLockup 的第 126–170 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/giant-word-logo-lockup/GiantWordLogoLockup.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {GiantWordLogoLockup as Source} from '../../groups/giant-word-logo-lockup/GiantWordLogoLockup'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const NAME_WIPE_WORD_SWAP_DURATION = 44;
export const NameWipeWordSwap_RANGE = [126, 170] as const; // 在原镜头里的起止帧

export const NameWipeWordSwap: React.FC = () => (
  <Sequence from={-126} durationInFrames={170} layout="none">
    <Source />
  </Sequence>
);
