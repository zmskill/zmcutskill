// 小零件：Logo 卡转正溶掉 · 色块擦出标语 · 卡片飞进隧道（120 帧，4.0 秒）
// 只播 CardTunnelTagline 的第 0–120 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/card-tunnel-tagline/CardTunnelTagline.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {CardTunnelTagline as Source} from '../../opening/card-tunnel-tagline/CardTunnelTagline'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const LOGO_CARD_DISSOLVE_TUNNEL_DURATION = 120;
export const LogoCardDissolveTunnel_RANGE = [0, 120] as const; // 在原镜头里的起止帧

export const LogoCardDissolveTunnel: React.FC = () => (
  <Sequence from={-0} durationInFrames={120} layout="none">
    <Source />
  </Sequence>
);
