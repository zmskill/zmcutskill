// 小零件：空卡片里表单一样样长出来（43 帧，1.4 秒）
// 整个镜头就是这一个动作：FormCardBuild 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/form-card-build/FormCardBuild.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {FormCardBuild as Source} from '../../groups/form-card-build/FormCardBuild'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const FORM_CARD_BUILD_DURATION = 43;
export const FormCardBuild_RANGE = [0, 43] as const; // 在原镜头里的起止帧

export const FormCardBuild: React.FC = () => (
  <Sequence from={-0} durationInFrames={43} layout="none">
    <Source />
  </Sequence>
);
