// 小零件：词挪开 · 乱码从左到右解成一个词（42 帧，1.4 秒）
// 只播 DecodeWordPasswordField 的第 0–42 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/decode-word-password-field/DecodeWordPasswordField.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {DecodeWordPasswordField as Source} from '../../groups/decode-word-password-field/DecodeWordPasswordField'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const SCRAMBLE_DECODE_WORD_DURATION = 42;
export const ScrambleDecodeWord_RANGE = [0, 42] as const; // 在原镜头里的起止帧

export const ScrambleDecodeWord: React.FC = () => (
  <Sequence from={-0} durationInFrames={42} layout="none">
    <Source />
  </Sequence>
);
