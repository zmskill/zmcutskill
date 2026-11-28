// polish.tsx：镜头库共用的基础小工具（宣传片 skill 和口播 skill 用同一份，逐梦自己写的版本）。
// 里面是：缓动曲线 EASE / bezier、时间进度 ramp、插值 mix、字体 FONT、软阴影 softShadow、
// 胶片颗粒 Grain、压边 Vignette、运动模糊 SpeedBlur。
// 都只依赖当前帧和传入的参数，不用随机数和系统时间，任意一帧单独渲染结果都一样。
import React from 'react';
import {useCurrentFrame} from 'remotion';

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

// ── 缓动 ──
// 和 CSS 的 cubic-bezier(p1x, p1y, p2x, p2y) 含义相同：给 0–1 的时间，返回 0–1 的进度（y 可以冲出 0–1，做回拉和过冲）。
// 先用牛顿迭代从 x 反求曲线参数，收敛不了再用二分。
export function bezier(p1x: number, p1y: number, p2x: number, p2y: number): (t: number) => number {
  if (p1x === p1y && p2x === p2y) return (t) => clamp(t);
  // 三次贝塞尔写成多项式：B(s) = ((a s + b) s + c) s
  const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx;
  const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
  const curveX = (s: number) => ((ax * s + bx) * s + cx) * s;
  const curveY = (s: number) => ((ay * s + by) * s + cy) * s;
  const slopeX = (s: number) => (3 * ax * s + 2 * bx) * s + cx;
  const paramFor = (x: number) => {
    let s = x;
    for (let k = 0; k < 8; k++) {
      const diff = curveX(s) - x;
      if (Math.abs(diff) < 1e-7) return s;
      const d = slopeX(s);
      if (Math.abs(d) < 1e-6) break;
      s -= diff / d;
    }
    let lo = 0, hi = 1;
    s = x;
    for (let k = 0; k < 40; k++) {
      const v = curveX(s);
      if (Math.abs(v - x) < 1e-7) break;
      if (v < x) lo = s; else hi = s;
      s = (lo + hi) / 2;
    }
    return s;
  };
  return (t) => (t <= 0 ? 0 : t >= 1 ? 1 : curveY(paramFor(t)));
}

// 常用的几条曲线
export const EASE = {
  snappy: bezier(0.16, 1, 0.3, 1),       // 很急的减速：入场、推近后落定
  out: bezier(0.22, 1, 0.36, 1),         // 柔一点的减速：次要元素进场、跟随
  smooth: bezier(0.65, 0, 0.35, 1),      // 两头慢中间快：换位、镜头平移
  swift: bezier(0.4, 0, 0.2, 1),         // 起步稍快、落点很软：一般的移动
  exit: bezier(0.7, 0, 0.84, 0),         // 越走越快：出场、甩出画面
  anticip: bezier(0.5, -0.32, 0.25, 1),  // 先往回拉一点再冲出去
  overshoot: bezier(0.34, 1.45, 0.64, 1), // 冲过头再回来：弹出、落座
  linear: (t: number) => clamp(t),
};

// 当前帧在 [start, start + dur] 里走到哪了（0–1），再套一条缓动
export const ramp = (frame: number, start: number, dur: number, ease: (t: number) => number = EASE.snappy) =>
  ease(clamp((frame - start) / Math.max(1e-6, dur)));

// 从 a 到 b 按 t 插值（t 不截断，方便过冲曲线）
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// ── 字体 ──
export const FONT = {
  sans: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Inter, Arial, sans-serif',
  mono: '"SF Mono", "JetBrains Mono", Menlo, monospace',
};

// "#rrggbb" 或 "#rgb" → "r,g,b"
export const rgbTriplet = (hex: string) => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const v = parseInt(h.slice(0, 6), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255].join(',');
};
export const alpha = (hex: string, a: number) => `rgba(${rgbTriplet(hex)},${a})`;
const oneDecimal = (v: number) => Math.round(v * 10) / 10;

// ── 软阴影 ──
// 两层：贴近物体的一层小而实（抬得越高越淡），远处的一层大而虚（抬得越高越大越深）。
// lift 是物体离地多高（像素）：0 贴地、4 卡片放着、16 浮起、48 以上在飞。
export const softShadow = (lift: number, opts: {color?: string; strength?: number} = {}) => {
  const e = Math.max(0, lift);
  const col = rgbTriplet(opts.color ?? '#10121a');
  const k = opts.strength ?? 1;
  const nearA = (0.12 * k) / (1 + e / 24);
  const farA = (0.08 + 0.22 * (Math.min(e, 64) / 64)) * k;
  const near = `0 ${oneDecimal(0.5 + 0.06 * e)}px ${oneDecimal(1 + 0.18 * e)}px rgba(${col},${nearA.toFixed(3)})`;
  const far = `0 ${oneDecimal(0.55 * e)}px ${oneDecimal(1.3 * e)}px ${oneDecimal(-0.22 * e)}px rgba(${col},${farA.toFixed(3)})`;
  return `${near}, ${far}`;
};

// ── 胶片颗粒 ──
// 一层铺满父级的灰色噪点，每隔 step 帧换一张纹理、挪一下位置。
// 噪点图是 SVG 滤镜画的小方块，做成 data URI 缓存起来，浏览器只画一次。
const noiseCache: Record<string, string> = {};
const noiseTile = (seedIndex: number, size: number, freq: number) => {
  const key = `${seedIndex}|${size}|${freq}`;
  if (noiseCache[key]) return noiseCache[key];
  const gain = `type='linear' slope='2.4' intercept='-0.7'`;
  const svg = [
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>`,
    `<filter id='g' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>`,
    `<feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='2' seed='${seedIndex * 17 + 3}' stitchTiles='stitch'/>`,
    `<feColorMatrix type='matrix' values='0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 0 1'/>`,
    `<feComponentTransfer><feFuncR ${gain}/><feFuncG ${gain}/>`,
    `<feFuncB ${gain}/></feComponentTransfer></filter>`,
    `<rect width='100%' height='100%' filter='url(#g)'/></svg>`,
  ].join('');
  return (noiseCache[key] = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`);
};
// 由整数得到 0–1 之间固定的伪随机数
const pseudo = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
// 亮场 opacity 0.04–0.08，暗场 0.06–0.12；放在要盖住的内容后面（上层）。
export const Grain: React.FC<{
  opacity?: number; step?: number; scale?: number; freq?: number;
  blend?: React.CSSProperties['mixBlendMode']; style?: React.CSSProperties;
}> = ({opacity = 0.06, step = 2, scale = 1, freq = 0.85, blend = 'overlay', style}) => {
  const n = Math.floor(useCurrentFrame() / Math.max(1, step));
  const size = 256;
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', opacity, mixBlendMode: blend,
      backgroundImage: noiseTile(n % 6, size, freq), backgroundSize: `${size * scale}px ${size * scale}px`,
      backgroundPosition: `${Math.floor(pseudo(3 * n + 1) * size)}px ${Math.floor(pseudo(7 * n + 2) * size)}px`, ...style,
    }} />
  );
};

// ── 压边 ──
// 铺满父级的径向渐变，四角压一点颜色。strength 是四角最深的不透明度，inner 是中间完全透明的半径（0–1）。
export const Vignette: React.FC<{
  strength?: number; inner?: number; color?: string; cx?: number; cy?: number; style?: React.CSSProperties;
}> = ({strength = 0.35, inner = 0.5, color = '#0b0c12', cx = 0.5, cy = 0.46, style}) => {
  const c = rgbTriplet(color);
  const at = `${cx * 100}% ${cy * 100}%`;
  const middle = inner + 0.55 * (1 - inner);
  const first = `radial-gradient(ellipse 72% 72% at ${at}, rgba(${c},0) ${inner * 100}%, ` +
    `rgba(${c},${(0.32 * strength).toFixed(3)}) ${(middle * 100).toFixed(1)}%, rgba(${c},${strength.toFixed(3)}) 100%)`;
  const second = `radial-gradient(ellipse 100% 100% at ${at}, rgba(${c},0) 60%, rgba(${c},${(0.6 * strength).toFixed(3)}) 100%)`;
  return <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: `${first}, ${second}`, ...style}} />;
};

// ── 运动模糊 ──
// 按速度（像素/帧）沿运动方向拉出拖影；速度很小就不加滤镜。
// 做法：外层转到运动方向，只在横向做高斯模糊，里层再转回来，所以任何方向都对。
export const SpeedBlur: React.FC<{
  vx: number; vy?: number; amount?: number; max?: number; children: React.ReactNode; style?: React.CSSProperties;
}> = ({vx, vy = 0, amount = 0.45, max = 36, children, style}) => {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const full: React.CSSProperties = {position: 'absolute', inset: 0};
  const blur = Math.min(max, Math.hypot(vx, vy) * amount);
  if (blur < 0.35) return <div style={{...full, ...style}}>{children}</div>;
  const angle = (Math.atan2(vy, vx) * 180) / Math.PI;
  const filterId = `speedblur-${uid}`;
  return (
    <div style={{...full, ...style}}>
      <svg width={0} height={0} style={{position: 'absolute'}} aria-hidden>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation={`${blur.toFixed(2)} 0`} edgeMode="none" />
        </filter>
      </svg>
      <div style={{...full, transform: `rotate(${angle}deg)`, filter: `url(#${filterId})`}}>
        <div style={{...full, transform: `rotate(${-angle}deg)`}}>{children}</div>
      </div>
    </div>
  );
};
