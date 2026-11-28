// 「热力渐变填字」（2026-11-23，013-G「limits」那种）：字里面不是一条线性渐变，而是按「离字边多远」上色——
//   边上蓝紫、往里品红、最厚的芯是橙色，像热成像 / 火焰；再叠一层慢慢流动的低频噪声让橙色团在字里游走，最上面一层细颗粒和一圈粉色细描边。
// 做法（合成里叫 gradient map / 渐变映射，AE 的 Colorama、PS 的渐变映射同理）：
//   SourceAlpha 高斯模糊 → 得到近似"距离场"（越靠里越亮）→ 加噪声 → feComponentTransfer 按亮度查表映射成 蓝→紫→品红→橙 → 只留在字形里面。
import React from 'react';

export const HeatText: React.FC<{text: string; x: number; y: number; size: number; weight?: number; family: string; id: string; t: number; o?: number; blur?: number; rim?: boolean}> = ({text, x, y, size, weight = 800, family, id, t, o = 1, blur, rim = true}) => {
  const sd = blur ?? size * 0.05;
  const flow = t * 60; // 噪声每秒往右上流 60px
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: o, overflow: 'visible'}}>
      <defs>
        <filter id={id} x="-10%" y="-30%" width="120%" height="160%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation={sd} result="b" />
          <feColorMatrix in="b" type="matrix" values="0 0 0 1.25 0  0 0 0 1.25 0  0 0 0 1.25 0  0 0 0 0 1" result="ba" />
          <feTurbulence x={-3000} y={-2000} width={8000} height={5000} type="fractalNoise" baseFrequency="0.0035 0.006" numOctaves="2" seed={11} result="t0" />
          <feOffset in="t0" dx={flow} dy={-flow * 0.4} result="t" />
          <feColorMatrix in="t" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="tg" />
          <feComposite in="ba" in2="tg" operator="arithmetic" k1="0" k2="0.75" k3="0.65" k4="-0.58" result="field" />
          <feComponentTransfer in="field" result="col">
            <feFuncR type="table" tableValues="0.32 0.42 0.66 0.90 1 1 1" />
            <feFuncG type="table" tableValues="0.12 0.10 0.12 0.16 0.30 0.46 0.62" />
            <feFuncB type="table" tableValues="0.92 0.96 0.86 0.62 0.30 0.16 0.12" />
            <feFuncA type="table" tableValues="1 1" />
          </feComponentTransfer>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={4} result="gn" />
          <feColorMatrix in="gn" type="saturate" values="0" result="gg" />
          <feBlend in="col" in2="gg" mode="soft-light" result="cg" />
          <feComposite in="cg" in2="SourceAlpha" operator="in" />
        </filter>
      </defs>
      <text x={x} y={y} textAnchor="middle" fontFamily={family} fontSize={size} fontWeight={weight} fill="#fff" filter={`url(#${id})`}>{text}</text>
      {rim && <text x={x} y={y} textAnchor="middle" fontFamily={family} fontSize={size} fontWeight={weight} fill="none" stroke="rgba(255,110,200,0.5)" strokeWidth={Math.max(1.5, size * 0.006)}>{text}</text>}
    </svg>
  );
};
