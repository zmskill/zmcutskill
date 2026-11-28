// 标志缩小成字标 + 小字标语（030-F 单个镜头，收尾落版）
// 学的动作（ab_workss · PulseIt 41.73–45.20s，30fps 逐帧看过；时间表 （内部拆片记录，未随项目提供））：
//   硬切进来：深藏青底（底部一团蓝光），一个超大的白色标志在正中（高约 400px）；
//   0.13 秒内猛地缩到 110px，之后慢慢再缩到字高；0.57s 起名字的字从标志右边一个个浮出（先灰、虚、字距很开），
//   字距收拢、标志往左让，整组居中；字由灰变白；1.2s 整组往上挪一点，标语在下面淡入；之后静止落版（只有极慢推近和底光呼吸）。
// 我们的内容：「小周」的"勾 + 点"标志（白色线条版）、名字"小周"、标语"全家人的待办清单"。
//
// 时间表（源秒，30fps，共 105 帧）
//   0.00–0.13  标志 400 → 110px（猛缩）；0.13–0.60 慢缩到 92px
//   0.57–0.85  名字逐字浮出（每字晚 0.06s），字距 0.5em → 0.04em；0.85–1.10 字由灰变白
//   1.20–1.35  整组上移 26px；1.25–1.65 标语淡入
//   1.65–3.50  落版静止（推近 1%/秒）
// 毛病清单：
//   - 通用：画面永远不停（推近 + 底光呼吸）；--hq 渲染；确定性
//   - 独有 1：第一下缩得极快（4 帧），后面慢慢缩，不是一条匀速曲线
//   - 独有 2：名字出来时字距是开的，再收拢，不是直接排好
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, Grain, mix} from '../../../assets/lib/helpers/polish';

export const MARK_SHRINK_WORDMARK_DURATION = 105;
const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;

// 可替换：name ≤4 字(实测)，tagline ≤14 字(实测)
export const WORDMARK_INPUTS = {name: '小周', tagline: '全家人的待办清单'};

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const eio = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const cw = (c: string) => (/[\x00-\x7f]/.test(c) ? 0.58 : 1.0);

const Mark: React.FC<{h: number}> = ({h}) => (
  <svg width={h} height={h} viewBox="0 0 100 100" style={{display: 'block'}}>
    <path d="M18 56 L40 78 L84 30" stroke="#fff" strokeWidth={17} strokeLinecap="square" strokeLinejoin="miter" fill="none" />
    <rect x={12} y={14} width={20} height={20} fill="#fff" />
  </svg>
);

export const MarkShrinkWordmark: React.FC<{inputs?: typeof WORDMARK_INPUTS}> = ({inputs = WORDMARK_INPUTS}) => {
  const s = useCurrentFrame() / FPS;
  const NF = 100;
  const chars = Array.from(inputs.name);
  const markH = s < 0.13 ? mix(400, 110, eo(s, 0, 0.13)) : mix(110, 92, eio(s, 0.13, 0.6));
  const track = mix(0.5, 0.04, eo(s, 0.6, 1.05)); // 字距（em）
  const gap = mix(0, 26, eo(s, 0.57, 0.95));
  const nameW = chars.reduce((a, c) => a + cw(c) * NF, 0) + track * NF * (chars.length - 1);
  const show = s >= 0.57;
  const groupW = markH + (show ? gap + nameW : 0);
  const left = 960 - groupW / 2;
  const lift = -26 * eio(s, 1.2, 1.35);
  const push = 1 + 0.012 * s; // 全程极慢推近（原片画面从没停住）
  const glow = 0.72 + 0.28 * Math.sin(s * 2.2);
  const tag = eo(s, 1.25, 1.65);
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS, background: 'linear-gradient(180deg, #04060c 0%, #060a16 55%, #081430 100%)'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 72% 32% at 50% 106%, rgba(40,130,255,${(0.95 * glow).toFixed(3)}) 0%, rgba(20,80,210,${(0.38 * glow).toFixed(3)}) 45%, rgba(0,0,0,0) 100%)`}} />
      {/* 零星小光点慢慢往上飘（原片底上有很淡的颗粒在动） */}
      {Array.from({length: 80}, (_, i) => {
        const r1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1, r2 = Math.abs(Math.sin(i * 78.233) * 12543.21) % 1;
        const x = r1 * 1920, y = ((r2 * 1180 - s * (30 + 50 * r1)) % 1180 + 1180) % 1180 - 50;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 2 + r2 * 2, height: 2 + r2 * 2, borderRadius: 2, background: '#9fb8ff', opacity: 0.25 + 0.4 * r2 * (0.6 + 0.4 * Math.sin(s * 3 + i))}} />;
      })}
      <AbsoluteFill style={{transform: `scale(${push.toFixed(5)})`}}>
        <div style={{position: 'absolute', left, top: 520 + lift - markH / 2}}><Mark h={markH} /></div>
        {show && (
          <div style={{position: 'absolute', left: left + markH + gap, top: 520 + lift, transform: 'translateY(-50%)', display: 'flex', whiteSpace: 'nowrap'}}>
            {chars.map((c, i) => {
              const k = eo(s, 0.57 + i * 0.06, 0.57 + i * 0.06 + 0.22);
              const w = eo(s, 0.85 + i * 0.03, 1.1 + i * 0.03);
              const g = Math.round(mix(110, 255, w));
              return <span key={i} style={{display: 'inline-block', width: cw(c) * NF, marginRight: i < chars.length - 1 ? track * NF : 0, fontSize: NF, fontWeight: 800, lineHeight: 1, color: `rgb(${g},${g},${Math.min(255, g + 6)})`, opacity: k, filter: k < 0.98 ? `blur(${(6 * (1 - k)).toFixed(2)}px)` : undefined}}>{c}</span>;
            })}
          </div>
        )}
        <div style={{position: 'absolute', left: 0, right: 0, top: 600 + lift * 0.4, textAlign: 'center', fontSize: 26, letterSpacing: '0.12em', color: 'rgba(205,214,235,0.85)', opacity: tag, filter: tag < 0.98 ? `blur(${(4 * (1 - tag)).toFixed(2)}px)` : undefined}}>{inputs.tagline}</div>
      </AbsoluteFill>
      <Grain opacity={0.03} />
    </AbsoluteFill>
  );
};
