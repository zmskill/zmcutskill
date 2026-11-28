// 小零件：只留一个词 · 输入框滑入 · 点眼睛变星号（134 帧，4.5 秒）
// 只播 DecodeWordPasswordField 的第 42–176 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/decode-word-password-field/DecodeWordPasswordField.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {DecodeWordPasswordField as Source} from '../../groups/decode-word-password-field/DecodeWordPasswordField'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const FIELD_SLIDE_EYE_STARS_DURATION = 134;
export const FieldSlideEyeStars_RANGE = [42, 176] as const; // 在原镜头里的起止帧

export const FieldSlideEyeStars: React.FC = () => (
  <Sequence from={-42} durationInFrames={176} layout="none">
    <Source />
  </Sequence>
);
