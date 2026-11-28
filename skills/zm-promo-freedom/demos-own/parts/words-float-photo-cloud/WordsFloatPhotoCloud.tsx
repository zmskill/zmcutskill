// 小零件：词高低错落浮上来 · 照片云（135 帧，4.5 秒）
// 整个镜头就是这一个动作：WordsFloatPhotoCloud 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/words-float-photo-cloud/WordsFloatPhotoCloud.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {WordsFloatPhotoCloud as Source} from '../../groups/words-float-photo-cloud/WordsFloatPhotoCloud'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WORDS_FLOAT_PHOTO_CLOUD_DURATION = 135;
export const WordsFloatPhotoCloud_RANGE = [0, 135] as const; // 在原镜头里的起止帧

export const WordsFloatPhotoCloud: React.FC = () => (
  <Sequence from={-0} durationInFrames={135} layout="none">
    <Source />
  </Sequence>
);
