// 【镜头组 4.0】task-card-three-verbs：由 demos-own/ui-entrance/task-card-three-verbs 镜头卡改成镜头组（2026-11-14）
// 和镜头卡版的区别只有两处，动作代码一行没改：
//   1. 文字从 props.inputs 传入（TaskVerbsInputs），先过 checkTaskVerbsInputs —— 超字数 / 项数不对直接拒绝；
//   2. 时间走合同时钟：props.extras 只在 3 个停留点加时间，动作区永远原速；停留时整体极慢推近（不冻）。
// 合同：TASK_CARD_THREE_VERBS_CONTRACT（组卡 references/groups-own/task-card-three-verbs.md 的数字从这里抄）
//
// 按钮撑开成新建卡 → 输入一句话自动出标签 → 同一张卡变成列表 → 甩糊换成三词竖滚「排一排 / 改一改 / 勾一下」，
// 下面还是那张列表：拖动排序 → 侧卡改时间 → 打勾 + 彩纸 + 「已完成」胶囊 → 甩糊出场（023-C，一串四拍）
// 学的动作（来自 baseTOP × Taskly 功能一串 13.55–26.0s，60fps 逐帧看过）：
//   开头 0.2s 真静止（只有蓝胶囊 + 光标），然后大字逐字"从下面浮上来 + 由灰变黑 + 去虚"，两行重叠打、左边缘固定；
//   光标从右下飞来（快段有拖影），按钮按下 0.93× → 回弹 → 卡片从按钮身后撑开（上沿基本不动，往左右和下方长，前 0.12s 到 90%、长尾巴补完），按钮压在卡上淡出；
//   输入框普通打字（不浮），竖线光标闪两下熄灭；三个标签每 0.17s 一个从 0.5× 长到 1.0（无过冲）；
//   点"加入列表"：按下 0.92× → 水波圈 → 卡吸一口气（略缩、下沿先冲到 86% 再收回）→ 旧内容和列表交叉溶解 → 三行从下往上依次浮入，新行再从右往左滑一点 → 计数 2→3 与青柠绿描边同一帧；
//   第一次换场 = 整个前景放大 1.08× + 横向运动模糊 + 淡出，中间 1 帧几乎全空，三词带糊从下往上落位，列表回到完全相同的位置（背景不糊）；
//   排：拿起 2 帧（变宽 + 投影）→ 停 0.3s → 0.5s 拖到顶（中段最快、被拖行最上层、被越过的行依次让开）→ 放下；
//   改：词先滚（0.17s，位置/大小/颜色同步），侧卡晚半拍从右边带横糊滑入（长尾 ease-out）→ 时间字段聚焦 → 点 → 旧值上浮淡出、新值淡入 → 已保存；
//   勾：侧卡 ease-in 加速滑出，还剩 1/3 时词就开始滚；"勾一下"从淡紫变品牌蓝；按下 → 实心蓝 + 水波圈 + 彩纸从左上喷出 → 白勾 → 删除线左往右划 → 胶囊弹出；
//   出场和第一次换场同一个甩糊，最后几帧只剩背景。
// 我们的内容：大字"随口一句话，/ 几秒建好一件事。"；输入"周六上午10点 取干洗的衣服" → 识别出「周六 10:00」「生活」「普通」；
//   列表"这周要做"：给房东转房租 / 买一袋猫粮 / 取干洗的衣服；三词"排一排。/ 改一改。/ 勾一下。"；完成胶囊"已完成"。
// 原片穿帮我们做对了：改成 11:30 后列表那一行同步变（22.8s）；完成后计数 3→2（胶囊同一帧）。
//
// 拍表（30fps，共 378f；f = (原片秒 − 13.55) × 30，所有轨道直接用原片秒 + 单调三次样条）
//   拍 1 新建  0–173   0–7 真静止；8–35 大字逐字；14–32 光标飞；35–38 按下；38–51 卡撑开；54–100 输入打字；107/112/117 三个标签；
//                      124–135 光标去按钮；139 按下；145–155 卡变列表、三行浮入；162 计数 2→3 + 绿框
//   拍 2 排    173–234 173–189 甩糊换词（180 最空）；189–191 光标落到第 3 行；197 拿起；207–224 拖到顶；228 放下
//   拍 3 改    234–296 234–239 滚词；238–254 侧卡滑入；266 聚焦；269 点；272 新值；278 已保存 + 列表同步
//   拍 4 勾    296–378 289–300 侧卡滑出（拍 3 尾就开始，叠着）；296–302 滚词变蓝；315 按下；316 实心 + 彩纸；318 白勾；320–323 删除线；
//                      325–331 胶囊 + 计数 3→2；335–366 彩纸飘落淡出；370–376 出场甩糊；376–377 只剩背景
// 毛病清单（自查表通用项 + 本镜头独有）：
//   - 独有 1：卡框始终是同一个容器（按钮→新建卡→列表），换内容靠交叉溶解，不能两张卡一出一进
//   - 独有 2：甩糊是横向运动模糊 + 放大，背景不糊；甩完列表必须回到原来的像素位置
//   - 独有 3：三词滚动"字先动、界面晚半拍"，详情卡滑出"界面先收、字再翻"，两者叠着不留空
//   - 独有 4：打字 / 填标签段活动曲线很低是正常的（原片也这样），但每 0.1s 都有字或标签在长，不许真停
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {FONT, Grain, Vignette, mix} from '../../../assets/lib/helpers/polish';

export const TASK_CARD_THREE_VERBS_ORIG_DURATION = 378;
// 每一拍的起止帧（单拿一拍用：<TaskCardBeat from={..} to={..} />，或直接用下面四个拍组件）
export const BEAT_CREATE = [0, 173] as const;
export const BEAT_PLAN = [173, 234] as const;
export const BEAT_EDIT = [234, 296] as const;
export const BEAT_DONE = [296, 378] as const;

const T0 = 13.55;
const tOf = (f: number) => T0 + f / 30;

const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const INK = '#141826';
const BLUE = '#2a42f4';
const LIME = '#d3f454';
const GRAY = '#8b8e9a';

// 原片 1400×1200 的百分比 → 我们 1920×1080 的像素（整体平移后以画面中心放大 1.1×）
const fx = (p: number) => 960 + (p * 14 - 700) * 1.1;
const fy = (p: number) => 540 + (p * 12 - 600) * 1.1;
const PX = 15.4, PY = 13.2; // 每 1% 对应的像素

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = clamp(x); return c * c * (3 - 2 * c); };
const rp = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const eio = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };

type P = [number, number][];
const trk = (t: number, pts: P) => {
  const n = pts.length;
  if (t <= pts[0][0]) return pts[0][1];
  if (t >= pts[n - 1][0]) return pts[n - 1][1];
  const d: number[] = [];
  for (let k = 0; k < n - 1; k++) d.push((pts[k + 1][1] - pts[k][1]) / (pts[k + 1][0] - pts[k][0]));
  const m: number[] = [d[0]];
  for (let k = 1; k < n - 1; k++) m.push(d[k - 1] * d[k] <= 0 ? 0 : (d[k - 1] + d[k]) / 2);
  m.push(d[n - 2]);
  for (let k = 0; k < n - 1; k++) {
    if (d[k] === 0) { m[k] = 0; m[k + 1] = 0; continue; }
    const a = m[k] / d[k], b = m[k + 1] / d[k], s = a * a + b * b;
    if (s > 9) { const tau = 3 / Math.sqrt(s); m[k] = tau * a * d[k]; m[k + 1] = tau * b * d[k]; }
  }
  let i = 0;
  while (t > pts[i + 1][0]) i++;
  const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
  const h = x1 - x0, u = (t - x0) / h, u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * y0 + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * y1 + (u3 - u2) * h * m[i + 1];
};
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mixc = (a: string, b: string, k: number) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], clamp(k)))).join(',')})`; };
const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// 方向模糊（SVG feGaussianBlur 分 x/y 两个方向）：sx 横向、sy 竖向，≈0 时不加滤镜
const DBlur: React.FC<{sx: number; sy?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({sx, sy = 0, style, children}) => {
  const id = 'db' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const on = sx + sy > 0.3;
  return (
    <div style={{position: 'absolute', inset: 0, ...style}}>
      {on && (
        <svg width={0} height={0} style={{position: 'absolute'}} aria-hidden>
          <filter id={id} x="-30%" y="-40%" width="160%" height="180%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation={`${sx.toFixed(2)} ${sy.toFixed(2)}`} />
          </filter>
        </svg>
      )}
      <div style={{position: 'absolute', inset: 0, filter: on ? `url(#${id})` : undefined}}>{children}</div>
    </div>
  );
};

// ───────── 甩糊（两次：19.30 换词、25.88 出场）─────────
const whipUI = (t: number) => t < 22
  ? {
    s: trk(t, [[19.3, 1], [19.33, 1.004], [19.4, 1.03], [19.45, 1.05], [19.5, 1.08], [19.57, 1.08], [19.62, 1.07], [19.7, 1.036], [19.75, 1.02], [19.8, 1.006], [19.86, 1]]),
    op: trk(t, [[19.3, 1], [19.42, 0.95], [19.45, 0.8], [19.5, 0.6], [19.53, 0.35], [19.55, 0.18], [19.57, 0.25], [19.6, 0.5], [19.65, 0.75], [19.7, 0.95], [19.75, 1]]),
    bx: trk(t, [[19.3, 0], [19.37, 3], [19.45, 12], [19.5, 20], [19.57, 20], [19.65, 10], [19.72, 3], [19.8, 0]]),
  }
  : {
    s: trk(t, [[25.8, 1], [25.87, 1.003], [25.9, 1.025], [25.93, 1.04], [25.97, 1.06], [26.0, 1.08], [26.08, 1.09]]),
    op: trk(t, [[25.88, 1], [25.93, 0.9], [25.95, 0.8], [25.97, 0.6], [26.0, 0.35], [26.03, 0.15], [26.06, 0]]),
    bx: trk(t, [[25.86, 0], [25.9, 4], [25.95, 12], [26.0, 20]]),
  };

// ───────── 背景：浅紫蓝渐变 + 右上长春花紫光 + 左下青柠雾，极慢漂移 ─────────
const Backdrop: React.FC<{t: number}> = ({t}) => {
  const dr = (t - T0) * 0.32; // %/s
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: 'linear-gradient(180deg, #e2e6fa 0%, #e6eafb 38%, #eef1fb 68%, #f5f7f6 100%)'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 34% 46% at ${82 - dr}% 9%, rgba(184,192,250,0.95) 0%, rgba(197,204,251,0.55) 45%, rgba(197,204,251,0) 100%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 22% 30% at ${6 + dr * 0.4}% 14%, rgba(206,210,248,0.7) 0%, rgba(206,210,248,0) 100%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 40% 42% at 10% 96%, rgba(226,243,190,0.95) 0%, rgba(233,244,205,0.55) 45%, rgba(233,244,205,0) 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 38% 36% at 92% 96%, rgba(250,252,253,0.95) 0%, rgba(250,252,253,0) 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 50% 40% at 50% 48%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%)'}} />
      <Vignette strength={0.1} color="#3a3f6a" inner={0.5} />
      <Grain opacity={0.035} />
    </AbsoluteFill>
  );
};

// ───────── 大字：逐字"从下浮上来 + 由灰变黑 + 去虚"，左边缘固定 ─────────
let L1 = '随口一句话，';
let L2 = '几秒建好一件事。';
const HF = 104;
const charT = (line: number, i: number) => (line === 0 ? 13.8 + i * 0.065 : 14.1 + i * 0.068);
const Headline: React.FC<{t: number}> = ({t}) => {
  const line = (s: string, li: number, cy: number, col: string) => (
    <div style={{position: 'absolute', left: 0, right: 0, top: cy - HF * 0.66, textAlign: 'center', fontSize: HF, lineHeight: `${HF * 1.32}px`, fontWeight: 600, fontFamily: SANS, letterSpacing: '-0.01em', whiteSpace: 'pre'}}>
      {Array.from(s).map((ch, i) => {
        const k = clamp((t - charT(li, i)) / 0.1);
        const e = 1 - Math.pow(1 - k, 3);
        return (
          <span key={i} style={{display: 'inline-block', opacity: t < charT(li, i) ? 0 : 0.2 + 0.8 * e,
            transform: `translateY(${(HF * 0.3 * (1 - e)).toFixed(2)}px)`, color: mixc('#c4c8dc', col, e),
            filter: k < 0.98 ? `blur(${(4.5 * (1 - e)).toFixed(2)}px)` : undefined}}>{ch}</span>
        );
      })}
    </div>
  );
  return (
    <>
      {line(L1, 0, 164, INK)}
      {line(L2, 1, 278, BLUE)}
    </>
  );
};

// ───────── 三词竖滚：当前词最大、上一个灰 0.73×、下一个淡紫 0.73×；"勾一下"当前时变品牌蓝 ─────────
let VERBS = ['排一排。', '改一改。', '勾一下。'];
const VF = 116;
const verbState = (t: number) => eio(t, 21.35, 21.52) + eio(t, 23.43, 23.62);
const VerbStack: React.FC<{t: number}> = ({t}) => {
  const s = verbState(t);
  const ds = (verbState(t + 1 / 60) - verbState(t - 1 / 60)) * 15; // 每帧走多少"格"
  const sy = Math.min(7, Math.abs(ds) * 132 * 0.22);
  return (
    <DBlur sx={0} sy={sy}>
      {VERBS.map((w, i) => {
        const d = i - s;
        if (Math.abs(d) > 1.5) return null;
        const a = Math.min(1, Math.abs(d));
        const y = d <= 0 ? (d >= -1 ? mix(203, 91, -d) : 91 + (d + 1) * 110) : (d <= 1 ? mix(203, 335, d) : 335 + (d - 1) * 120);
        const size = VF * (1 - 0.27 * a) * (i === 2 ? mix(1, 1.06, 1 - a) : 1);
        const cur = i === 2 ? BLUE : INK;
        const col = d < 0 ? mixc(cur, '#adb2cb', a) : mixc(cur, i === 2 ? '#bbc2fa' : '#b6bbd4', a);
        const op = Math.abs(d) <= 1 ? 1 : 1 - (Math.abs(d) - 1) / 0.45;
        // 第一次出现时：下面那个词晚 2 帧（60fps）
        const born = d > 0.5 ? 19.6 : 19.57;
        const inK = rp(t, born, born + 0.14);
        const dropY = 54 * (1 - eo(t, 19.55, 19.82));
        if (inK <= 0) return null;
        return (
          <div key={w} style={{position: 'absolute', left: 0, right: 0, top: y + dropY - size * 0.66, textAlign: 'center', fontSize: size,
            lineHeight: `${size * 1.32}px`, fontWeight: 600, fontFamily: SANS, color: col, opacity: op * inK, letterSpacing: '-0.01em',
            textShadow: i === 2 ? `0 0 ${(size * 0.35).toFixed(0)}px rgba(42,66,244,${(0.22 * (1 - a)).toFixed(3)})` : undefined}}>{w}</div>
        );
      })}
    </DBlur>
  );
};

// 文字层：两次甩糊里各自放大 + 上移 + 横糊
const TextLayer: React.FC<{t: number}> = ({t}) => {
  let sc = 1, up = 0, bx = 0, op = 1;
  if (t < 19.56) {
    sc = trk(t, [[19.3, 1], [19.4, 1.015], [19.5, 1.04], [19.56, 1.05]]);
    up = trk(t, [[19.3, 0], [19.4, 6], [19.5, 26], [19.56, 32]]);
    bx = trk(t, [[19.3, 0], [19.37, 3], [19.45, 12], [19.5, 20]]);
    op = trk(t, [[19.3, 1], [19.42, 0.95], [19.45, 0.8], [19.5, 0.5], [19.53, 0.2], [19.56, 0]]);
  } else if (t < 22) {
    bx = trk(t, [[19.57, 18], [19.65, 9], [19.72, 3], [19.79, 0]]);
  } else {
    sc = trk(t, [[25.86, 1], [25.93, 1.02], [26.0, 1.05], [26.06, 1.06]]);
    up = trk(t, [[25.86, 0], [25.93, 8], [26.0, 32], [26.06, 38]]);
    bx = trk(t, [[25.86, 0], [25.9, 4], [25.95, 12], [26.0, 22]]);
    op = trk(t, [[25.88, 1], [25.93, 0.85], [25.97, 0.55], [26.0, 0.3], [26.03, 0.12], [26.06, 0]]);
  }
  if (op <= 0.003) return null;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: op, transform: `translateY(${-up}px) scale(${sc})`, transformOrigin: '960px 220px', willChange: 'transform'}}>
      <DBlur sx={bx} sy={bx * 0.08}>
        {t < 19.56 ? <Headline t={t} /> : <VerbStack t={t} />}
      </DBlur>
    </div>
  );
};

// ───────── 小件 ─────────
const Dot: React.FC<{c: string; s?: number}> = ({c, s = 9}) => <span style={{display: 'inline-block', width: s, height: s, borderRadius: s, background: c, marginRight: 8, flex: 'none'}} />;
const Pill: React.FC<{bg: string; fg: string; dot: string; children: React.ReactNode; fs?: number; h?: number}> = ({bg, fg, dot, children, fs = 19, h = 34}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', height: h, padding: `0 ${Math.round(h * 0.42)}px`, borderRadius: h, background: bg, color: fg, fontSize: fs, fontWeight: 500, whiteSpace: 'nowrap'}}>
    <Dot c={dot} s={Math.round(fs * 0.42)} />{children}
  </div>
);
const Ripple: React.FC<{t: number; x: number; y: number; t0: number; d0: number; d1: number; dur: number}> = ({t, x, y, t0, d0, d1, dur}) => {
  const u = (t - t0) / dur;
  if (u < 0 || u > 1) return null;
  const d = mix(d0, d1, 1 - Math.pow(1 - u, 2.4));
  const op = 0.55 * clamp(u / 0.12) * (1 - sm((u - 0.35) / 0.65));
  return <div style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: d, border: `1.6px solid rgba(70,84,236,${op.toFixed(3)})`, background: `rgba(120,132,250,${(op * 0.08).toFixed(3)})`}} />;
};
const CARD_SHADOW = '0 1px 0 rgba(255,255,255,0.9) inset, 0 2px 6px rgba(50,60,150,0.06), 0 22px 46px rgba(60,70,160,0.11)';

// ───────── 按钮 ─────────
const AddButton: React.FC<{t: number}> = ({t}) => {
  if (t > 14.96) return null;
  const s = trk(t, [[14.7, 1], [14.75, 0.93], [14.8, 0.95], [14.82, 1]]);
  const lighten = rp(t, 14.79, 14.86);
  const op = 1 - rp(t, 14.83, 14.95);
  const w = 262, h = 76;
  return (
    <div style={{position: 'absolute', left: 960 - w / 2, top: fy(53) - h / 2, width: w, height: h, borderRadius: h, opacity: op,
      transform: `scale(${s})`, background: mixc('#2a43f7', '#7d86f0', lighten), boxShadow: `0 8px 20px rgba(42,67,247,${(0.35 * op).toFixed(3)}), inset 0 1px 0 rgba(255,255,255,0.25)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#fff', fontFamily: SANS, fontSize: 28, fontWeight: 600}}>
      <svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /></svg>
      新建任务
    </div>
  );
};

// ───────── 卡框（按钮 → 新建卡 → 列表，始终同一个容器）─────────
const cardBox = (t: number) => {
  if (t < 18.38) {
    const hw = trk(t, [[14.82, 12], [14.85, 17], [14.88, 23], [14.9, 26], [14.92, 27.5], [14.95, 30.5], [14.97, 31.5], [15.0, 35], [15.08, 35.45], [15.25, 35.6]]);
    return {l: 50 - hw, r: 50 + hw, top: trk(t, [[14.82, 48.9], [14.9, 47.7], [15.05, 47.9], [15.25, 48.3]]),
      bot: trk(t, [[14.82, 57], [14.85, 64], [14.88, 67], [14.9, 69], [14.92, 70], [14.95, 72], [15.0, 75], [15.08, 76.5], [15.25, 77.4]])};
  }
  const hw = trk(t, [[18.38, 35.6], [18.43, 35.0], [18.5, 34.7], [18.57, 35.2], [18.7, 35.7]]);
  return {l: 50 - hw, r: 50 + hw, top: trk(t, [[18.38, 48.3], [18.42, 48.9], [18.52, 50.0], [18.57, 50.3], [18.63, 49.7], [18.7, 48.8], [18.85, 48.3]]),
    bot: trk(t, [[18.38, 77.4], [18.42, 77.0], [18.47, 82], [18.52, 86], [18.6, 84.6], [18.7, 82.5], [18.85, 81.3]])};
};

// 新建卡内容（卡本地坐标，终态宽 1096）
let NEW_TIME = '周六 11:30';
let INPUT = '周六上午10点 取干洗的衣服';
let TAGS = [
  {txt: '周六 10:00', bg: '#eef0ff', fg: '#2f43f0', dot: BLUE, t0: 17.12},
  {txt: '生活', bg: '#f2f3f6', fg: '#4c515b', dot: '#7c86f6', t0: 17.28},
  {txt: '普通', bg: '#f1f8d6', fg: '#5f7a0e', dot: '#9dc031', t0: 17.45},
];
const NewTaskForm: React.FC<{t: number}> = ({t}) => {
  const n = Array.from(INPUT).length;
  const typed = Array.from(INPUT).filter((_, i) => t >= 15.38 + (i * (16.86 - 15.38)) / (n - 1)).join('');
  const caret = t >= 15.3 && (t < 16.95 || (t >= 17.07 && t < 17.47));
  const ab = trk(t, [[18.18, 1], [18.22, 0.92], [18.3, 1]]);
  const abLight = rp(t, 18.38, 18.45);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1096, height: 384, fontFamily: SANS}}>
      <div style={{position: 'absolute', left: 51, top: 62 - 18, height: 36, lineHeight: '36px', fontSize: 26, fontWeight: 600, color: INK}}>新建任务</div>
      <div style={{position: 'absolute', right: 51, top: 62 - 15, height: 30, padding: '0 10px', borderRadius: 7, border: '1.5px solid #e3e4ec', color: '#9a9cab', fontSize: 16, lineHeight: '27px', boxShadow: '0 1px 0 #e3e4ec'}}>Esc</div>
      <div style={{position: 'absolute', left: 49, top: 102, width: 998, height: 86, borderRadius: 16, background: '#f4f5fe', border: '2px solid #4a58e6', boxShadow: '0 0 0 4px rgba(74,88,230,0.08)'}}>
        <div style={{position: 'absolute', left: 30, top: 30, width: 24, height: 24, borderRadius: 24, border: '2px solid #b9bcd0'}} />
        <div style={{position: 'absolute', left: 72, top: 0, height: 82, display: 'flex', alignItems: 'center', fontSize: 30, color: INK, whiteSpace: 'pre'}}>
          {typed}
          {caret && <span style={{display: 'inline-block', width: 2.5, height: 34, background: BLUE, marginLeft: 2, borderRadius: 2}} />}
        </div>
      </div>
      <div style={{position: 'absolute', left: 51, top: 214, height: 40, display: 'flex', gap: 12}}>
        {TAGS.map((g) => {
          if (t < g.t0) return null;
          const k = eo(t, g.t0, g.t0 + 0.2);
          return (
            <div key={g.txt} style={{opacity: 0.3 + 0.7 * rp(t, g.t0, g.t0 + 0.1), transform: `scale(${0.5 + 0.5 * k})`, filter: k < 0.97 ? `blur(${(3 * (1 - k)).toFixed(2)}px)` : undefined}}>
              <Pill bg={g.bg} fg={g.fg} dot={g.dot} fs={20} h={38}>{g.txt}</Pill>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 280, height: 1, background: '#eeeff4'}} />
      <div style={{position: 'absolute', left: 53, top: 316, height: 34, display: 'flex', alignItems: 'center', fontSize: 19, color: GRAY}}>
        <Dot c="#a6c936" s={10} />智能识别已开启
      </div>
      <div style={{position: 'absolute', left: 846, top: 302, width: 200, height: 62, borderRadius: 62, transform: `scale(${ab})`,
        background: mixc('#2a42f4', '#5664f2', abLight), color: '#fff', fontSize: 23, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 6px 16px rgba(42,66,244,0.28)'}}>加入列表</div>
    </div>
  );
};

// 列表内容（卡本地坐标，终态宽 1100；行的 y 用画面 %）
type RowD = {name: string; tag: string; dot: string; time: string};
let ROWS: RowD[] = [
  {name: '给房东转房租', tag: '账单', dot: '#835ff4', time: '周五 20:00'},
  {name: '买一袋猫粮', tag: '家里', dot: '#8fb52a', time: '周五 18:30'},
  {name: '取干洗的衣服', tag: '生活', dot: BLUE, time: '周六 10:00'},
];
const rowY = (i: number, t: number) => {
  if (i === 0) return trk(t, [[20.5, 59], [20.57, 59.6], [20.63, 61.6], [20.7, 64.3], [20.77, 66.2], [20.83, 66.8], [20.97, 67]]);
  if (i === 1) return trk(t, [[20.5, 67], [20.57, 67.3], [20.63, 68.6], [20.7, 70.8], [20.77, 72.6], [20.83, 73.9], [20.9, 74.6], [20.97, 75]]);
  return trk(t, [[20.13, 75], [20.43, 74.5], [20.5, 73.4], [20.57, 71.7], [20.63, 68.2], [20.7, 63.8], [20.77, 61.4], [20.83, 60.2], [20.9, 59.4], [20.97, 59.1], [21.03, 59.0]]);
};
const ENTRY = [{t0: 18.53, dy: 2.6, dx: 0, d: 0.2}, {t0: 18.6, dy: 5.6, dx: 0, d: 0.33}, {t0: 18.72, dy: 3.0, dx: 1.2, d: 0.21}];
const rowEntry = (i: number, t: number) => {
  const e = ENTRY[i];
  const k = eo(t, e.t0, e.t0 + e.d);
  return {op: rp(t, e.t0, e.t0 + 0.15), dy: e.dy * (1 - k), dx: e.dx * (1 - eo(t, e.t0, e.t0 + 0.08))};
};

const ListContent: React.FC<{t: number}> = ({t}) => {
  const head = rp(t, 18.45, 18.62);
  const count = t < 18.95 ? 2 : t < 24.4 ? 3 : 2;
  const green = rp(t, 18.95, 19.0) * (1 - rp(t, 19.42, 19.62));
  const lift = trk(t, [[20.1, 0], [20.14, 1], [21.1, 1], [21.17, 0]]);
  // 打勾
  const press = rp(t, 24.05, 24.08) * (1 - rp(t, 24.08, 24.12));
  const solid = rp(t, 24.08, 24.11);
  const tick = rp(t, 24.15, 24.21);
  const strike = eo(t, 24.22, 24.34);
  const hover = rp(t, 24.6, 24.66) * (1 - rp(t, 24.85, 24.92));
  const newTime = rp(t, 22.8, 22.95);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1100, height: 436, fontFamily: SANS}}>
      <div style={{position: 'absolute', left: 35, top: 53 - 19, height: 38, display: 'flex', alignItems: 'center', gap: 12, opacity: head}}>
        <span style={{fontSize: 27, fontWeight: 600, color: INK}}>这周要做</span>
        <span style={{minWidth: 30, height: 28, borderRadius: 8, background: '#eceefe', color: '#3f43ee', fontSize: 18, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontVariantNumeric: 'tabular-nums'}}>{count}</span>
      </div>
      {[0, 1, 2].sort((a, b) => (a === 2 ? 1 : b === 2 ? -1 : a - b)).map((i) => {
        const r = ROWS[i];
        const en = rowEntry(i, t);
        if (en.op <= 0) return null;
        const yc = (rowY(i, t) + en.dy - 48.3) * PY;
        const isC = i === 2;
        const lf = isC ? lift : 0;
        const done = isC ? solid : 0;
        const hv = i === 0 ? hover : 0;
        const pr = isC ? press : 0;
        return (
          <div key={r.name} style={{position: 'absolute', left: 37 + en.dx * PX, top: yc - 46, width: 1026, height: 92, borderRadius: 16, background: '#fff', opacity: en.op,
            border: isC && green > 0.01 ? `2px solid rgba(201,236,58,${green.toFixed(3)})` : '1.5px solid #eceef3',
            boxShadow: `0 ${(1 + lf * 10).toFixed(1)}px ${(2 + lf * 22).toFixed(1)}px rgba(40,44,110,${(0.03 + lf * 0.15).toFixed(3)})${isC && green > 0.01 ? `, 0 0 0 3px rgba(214,244,80,${(green * 0.35).toFixed(3)})` : ''}`,
            transform: `scale(${1 + 0.03 * lf})`, boxSizing: 'border-box'}}>
            {/* 勾选圈 */}
            <div style={{position: 'absolute', left: 51 - 14, top: 46 - 14, width: 28, height: 28, borderRadius: 28, boxSizing: 'border-box',
              border: done > 0.5 ? 'none' : `2px solid ${pr > 0.1 ? '#8e98f6' : '#c9cad3'}`, transform: `scale(${1 - 0.12 * pr})`,
              background: done > 0 ? mixc('#aab2fb', '#2643f5', done) : pr > 0 ? `rgba(120,135,250,${(0.4 * pr).toFixed(3)})` : hv > 0 ? `rgba(214,244,80,${(0.55 * hv).toFixed(3)})` : 'transparent'}}>
              {tick > 0 && isC && (
                <svg width="28" height="28" viewBox="0 0 28 28" style={{position: 'absolute', left: 0, top: 0}}>
                  <path d="M8.5 14.5 L12.5 18.3 L19.8 10.2" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="20" strokeDashoffset={20 * (1 - tick)} />
                </svg>
              )}
            </div>
            <div style={{position: 'absolute', left: 91, top: 0, height: 92, display: 'flex', alignItems: 'center', fontSize: 28, color: isC ? mixc(INK, '#8a8d98', strike) : INK, whiteSpace: 'nowrap'}}>
              <span style={{position: 'relative'}}>
                {r.name}
                {isC && strike > 0 && <span style={{position: 'absolute', left: -2, top: '54%', height: 2, width: `calc(${(strike * 100).toFixed(1)}% + 4px)`, background: '#7d808c'}} />}
              </span>
            </div>
            <div style={{position: 'absolute', right: 168, top: 46 - 17}}>
              <Pill bg="#f3f4f7" fg="#4c515b" dot={r.dot} fs={18} h={34}>{r.tag}</Pill>
            </div>
            <div style={{position: 'absolute', right: 28, top: 0, height: 92, width: 130, fontSize: 21, color: '#8f9096', fontVariantNumeric: 'tabular-nums'}}>
              {isC ? (
                <>
                  <span style={{position: 'absolute', right: 0, top: 30, opacity: 1 - newTime, transform: `translateY(${(-6 * newTime).toFixed(2)}px)`}}>{r.time}</span>
                  {newTime > 0 && <span style={{position: 'absolute', right: 0, top: 30, opacity: newTime, color: mixc('#2f43f0', '#8f9096', rp(t, 23.1, 23.5))}}>{NEW_TIME}</span>}
                </>
              ) : <span style={{position: 'absolute', right: 0, top: 30}}>{r.time}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TaskCard: React.FC<{t: number}> = ({t}) => {
  if (t < 14.815) return null;
  const b = cardBox(t);
  const left = fx(b.l), top = fy(b.top), w = (b.r - b.l) * PX, h = (b.bot - b.top) * PY;
  const formOp = t < 18.4 ? rp(t, 14.84, 14.98) : 1 - rp(t, 18.42, 18.57);
  const formScale = Math.min(1, w / 1096);
  const listOn = t >= 18.44;
  const blur = trk(t, [[14.82, 8], [14.9, 5], [14.97, 2], [15.03, 0]]);
  const ghost = rp(t, 18.44, 18.52) * (1 - rp(t, 18.62, 18.72)); // 新卡框浮现那几帧略带半透明
  return (
    <div style={{position: 'absolute', left, top, width: w, height: h, borderRadius: 22, background: '#fdfdfe', boxShadow: CARD_SHADOW,
      border: '1px solid rgba(40,50,120,0.06)', overflow: 'hidden', opacity: rp(t, 14.815, 14.86) * (1 - 0.35 * ghost),
      filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined}}>
      {formOp > 0.003 && (
        <div style={{position: 'absolute', left: (w - 1096 * formScale) / 2, top: 0, width: 1096, height: 384, transform: `scale(${formScale})`, transformOrigin: '0 0', opacity: formOp}}>
          <NewTaskForm t={t} />
        </div>
      )}
      {listOn && (
        <div style={{position: 'absolute', left: (w - 1100 * Math.min(1, w / 1100)) / 2, top: 0, width: 1100, height: 436, transform: `scale(${Math.min(1, w / 1100)})`, transformOrigin: '0 0'}}>
          <ListContent t={t} />
        </div>
      )}
    </div>
  );
};

// ───────── 详情侧卡 ─────────
const K_OFF = 1.51; // 我们画面更宽：滑入/滑出的行程按比例拉长，起止都在画外
const detailX = (t: number) => {
  const p = t < 22.5
    ? trk(t, [[21.48, 100], [21.5, 92], [21.53, 85], [21.57, 80], [21.6, 75], [21.63, 72], [21.67, 69], [21.7, 66.7], [21.73, 65], [21.77, 63], [21.8, 62], [21.83, 61], [21.87, 60], [21.9, 59.6], [21.93, 59.2], [22.0, 58.8]])
    : trk(t, [[23.13, 58.8], [23.17, 59.5], [23.23, 60.4], [23.27, 61.5], [23.3, 63], [23.33, 65], [23.37, 68], [23.4, 71.5], [23.43, 77], [23.47, 84], [23.5, 93], [23.53, 100], [23.56, 106]]);
  return fx(58.8 + (p - 58.8) * K_OFF);
};
const DetailCard: React.FC<{t: number}> = ({t}) => {
  if (t < 21.47 || t > 23.56) return null;
  const x = detailX(t);
  const v = Math.abs(detailX(t + 1 / 60) - detailX(t - 1 / 60)) * 15; // px/帧
  const bx = Math.min(26, v * 0.3);
  const focus = rp(t, 22.38, 22.43);
  const oldV = 1 - rp(t, 22.5, 22.6);
  const newV = rp(t, 22.57, 22.64);
  const newInk = rp(t, 22.62, 22.72);
  const saved = rp(t, 22.8, 22.9);
  const top = fy(40), h = fy(89.4) - fy(40);
  const fld = (label: string, y: number, node: React.ReactNode) => (
    <>
      <div style={{position: 'absolute', left: 42, top: y - 16, height: 32, lineHeight: '32px', fontSize: 21, color: '#91919c'}}>{label}</div>
      <div style={{position: 'absolute', left: 211, top: y - 20, height: 40, display: 'flex', alignItems: 'center'}}>{node}</div>
    </>
  );
  return (
    <DBlur sx={bx} sy={0}>
      <div style={{position: 'absolute', left: x, top, width: 588, height: h, borderRadius: 22, background: '#fff', border: '1px solid rgba(40,50,120,0.06)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 3px 8px rgba(50,60,150,0.07), 0 26px 52px rgba(60,70,160,0.15)', fontFamily: SANS}}>
        <div style={{position: 'absolute', left: 42, top: 42, fontSize: 18, color: GRAY, letterSpacing: '0.06em'}}>任务详情</div>
        <div style={{position: 'absolute', left: 42, top: 92, fontSize: 32, fontWeight: 600, color: INK}}>{ROWS[2].name}</div>
        <div style={{position: 'absolute', left: 42, right: 42, top: 165, height: 1, background: '#eeeff4'}} />
        <div style={{position: 'absolute', left: 197, top: 206, width: 352, height: 54, borderRadius: 12, boxSizing: 'border-box',
          background: mixc('#f3f4fd', '#ffffff', focus), border: `2px solid ${focus > 0 ? `rgba(74,88,230,${focus.toFixed(3)})` : 'transparent'}`,
          boxShadow: focus > 0 ? `0 0 0 4px rgba(74,88,230,${(0.08 * focus).toFixed(3)})` : undefined}} />
        {fld('时间', 233, (
          <div style={{position: 'relative', width: 300, height: 40, fontSize: 23, color: INK}}>
            <span style={{position: 'absolute', left: 8, top: 4, opacity: oldV, transform: `translateY(${(-7 * (1 - oldV)).toFixed(2)}px)`, filter: oldV < 0.98 ? `blur(${(2.5 * (1 - oldV)).toFixed(2)}px)` : undefined}}>{TAGS[0].txt}</span>
            {newV > 0 && <span style={{position: 'absolute', left: 8, top: 4, opacity: newV * mix(0.55, 1, newInk), color: mixc('#9a9db0', INK, newInk)}}>{NEW_TIME}</span>}
          </div>
        ))}
        {fld('重要程度', 321, <Pill bg="#f1f8d6" fg="#5f7a0e" dot="#9dc031" fs={19} h={36}>{TAGS[2].txt}</Pill>)}
        {fld('清单', 409, <Pill bg="#f2f3f6" fg="#4c515b" dot={BLUE} fs={19} h={36}>{TAGS[1].txt}</Pill>)}
        {fld('提醒', 496, <span style={{fontSize: 22, color: INK}}>提前 30 分钟</span>)}
        <div style={{position: 'absolute', left: 42, right: 42, top: 561, height: 1, background: '#eeeff4'}} />
        <div style={{position: 'absolute', left: 42, top: 590, height: 34, display: 'flex', alignItems: 'center', fontSize: 20, color: '#2ea769', opacity: saved}}>
          <Dot c="#2ea769" s={10} />已保存
        </div>
      </div>
    </DBlur>
  );
};

// ───────── 彩纸（hash 伪随机；上冲 0.3s → 悬停 → 翻转飘落 → 淡出）─────────
const CONF = Array.from({length: 42}, (_, i) => {
  const h = (k: number) => hash(i * 13 + k * 7.31);
  const left = h(1) < 0.8;
  const a = ((left ? mix(100, 168, h(2)) : mix(48, 100, h(2))) * Math.PI) / 180;
  const R = mix(150, 400, Math.pow(h(3), 0.8));
  const c = h(4);
  return {
    dx: Math.cos(a) * R * 0.85, dy: -Math.sin(a) * R, vt: mix(200, 330, h(5)), sw: mix(8, 22, h(6)), swf: mix(4, 8, h(7)), ph: h(8) * 6.28,
    fl: mix(7, 15, h(9)), rot0: h(10) * 360, rv: (h(11) < 0.5 ? -1 : 1) * mix(90, 260, h(12)), w: mix(15, 26, h(13)), hh: mix(8, 13, h(14)),
    col: c < 0.5 ? BLUE : c < 0.75 ? 'rgba(142,147,240,0.85)' : '#c9ec3a', fade: mix(1.2, 1.45, h(15)), td: h(16) * 0.03,
  };
});
const Confetti: React.FC<{t: number}> = ({t}) => {
  const u0 = t - 24.1;
  if (u0 < 0 || u0 > 1.8) return null;
  const ex = fx(18.4), ey = fy(57.2);
  return (
    <AbsoluteFill>
      {CONF.map((c, i) => {
        const u = u0 - c.td;
        if (u < 0) return null;
        const rise = 1 - Math.exp(-u / 0.1);
        const v = u - 0.4;
        const fall = v <= 0 ? 0 : v < 0.3 ? (c.vt * v * v) / 0.6 : c.vt * (v - 0.15);
        const sway = c.sw * Math.sin(c.swf * u + c.ph) * rp(u, 0.25, 0.6);
        const x = ex + c.dx * rise + sway;
        const y = ey + c.dy * rise + fall;
        const op = (1 - rp(u, c.fade, c.fade + 0.3)) * clamp(u / 0.03);
        const flip = Math.cos(c.ph + c.fl * u);
        const streak = u < 0.08 ? 1 + 1.6 * (1 - u / 0.08) : 1; // 刚喷出那两帧拉长一点 = 运动模糊
        return (
          <div key={i} style={{position: 'absolute', left: x - c.w / 2, top: y - c.hh / 2, width: c.w, height: c.hh, borderRadius: 2, background: c.col, opacity: op,
            transform: `rotate(${(c.rot0 + c.rv * u).toFixed(1)}deg) scale(${streak.toFixed(3)}, ${Math.max(0.22, Math.abs(flip)).toFixed(3)})`}} />
        );
      })}
    </AbsoluteFill>
  );
};

// ───────── 已完成胶囊 ─────────
const DoneCapsule: React.FC<{t: number}> = ({t}) => {
  if (t < 24.4) return null;
  const k = eo(t, 24.4, 24.6);
  const w = 300, h = 66;
  return (
    <div style={{position: 'absolute', left: 960 - w / 2, top: fy(86) - h / 2, width: w, height: h, borderRadius: h, background: LIME,
      opacity: rp(t, 24.4, 24.5), transform: `scale(${0.55 + 0.45 * k})`, boxShadow: '0 10px 30px rgba(196,236,60,0.55), 0 2px 6px rgba(120,150,20,0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontFamily: SANS, fontSize: 27, fontWeight: 600, color: INK}}>
      <svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="17" fill="#141826" /><path d="M10.5 17.5 L15 21.8 L23.5 12.6" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      已完成
    </div>
  );
};

// ───────── 光标（不转身；快时带拖影）─────────
const CUR: [number, number, number][] = [
  [13.55, 83, 86], [14.0, 83, 86], [14.1, 80.5, 82.5], [14.2, 72, 75], [14.3, 62, 65], [14.4, 55.5, 59], [14.5, 52.6, 57.2], [14.6, 52.2, 56.6], [14.98, 52.2, 56.6],
  [15.06, 59, 66], [15.12, 70, 77], [15.18, 78, 82.5], [15.3, 83, 84.5], [17.7, 83, 84.5], [17.8, 81.2, 81], [17.9, 78.4, 76.6], [18.0, 77, 74.6], [18.8, 77, 74.6],
  [18.9, 79.5, 86], [19.0, 84, 99], [19.1, 88, 112], [19.6, 90, 112], [19.65, 86, 101], [19.7, 83.5, 97], [19.75, 80, 95], [19.79, 70, 91.5], [19.83, 50, 85],
  [19.87, 31, 79.5], [19.9, 24.3, 76.6],
];
const CUR2: [number, number, number][] = [
  [21.3, 24.3, 60.6], [21.55, 24.3, 60.6], [21.6, 29, 61.6], [21.67, 42, 61.2], [21.73, 55, 61], [21.8, 65.5, 61.4], [21.87, 75.5, 60.4], [21.93, 79.8, 58.6], [22.0, 81, 58.2],
  [22.3, 83.6, 59.8], [22.6, 84, 60.2], [22.75, 82.6, 60.8], [22.95, 80.5, 61], [23.1, 79, 61], [23.17, 69, 59.4], [23.23, 61, 59.2], [23.3, 49, 61], [23.37, 38, 61],
  [23.43, 30.5, 61], [23.5, 27, 60.8], [23.57, 25.5, 60.4], [23.7, 21.4, 60], [23.85, 20.5, 59.7], [24.4, 20.5, 59.7], [24.5, 20.6, 63.5], [24.6, 20.5, 67.6],
  [24.85, 20.5, 67.6], [24.95, 25.5, 69], [25.1, 34, 86], [25.2, 38, 98], [25.3, 41, 112],
];
const pick = (arr: [number, number, number][], t: number, j: 1 | 2) => trk(t, arr.map((p) => [p[0], p[j]] as [number, number]));
const cursorAt = (t: number): [number, number] => {
  if (t < 19.9) return [fx(pick(CUR, t, 1)), fy(pick(CUR, t, 2))];
  if (t < 21.3) return [fx(24.3), fy(rowY(2, t) + 1.6)];
  return [fx(pick(CUR2, t, 1)), fy(pick(CUR2, t, 2))];
};
const Arrow: React.FC<{x: number; y: number; op?: number}> = ({x, y, op = 1}) => (
  <svg width="40" height="56" viewBox="-2 -2 30 42" style={{position: 'absolute', left: x - 2.7, top: y - 2.7, opacity: op, overflow: 'visible', filter: op > 0.5 ? 'drop-shadow(0 3px 4px rgba(20,24,60,0.3))' : undefined}}>
    <path d="M0 0 L0 30 L7.2 23.4 L12 34.2 L16.6 32.2 L11.9 21.6 L21.6 21.6 Z" fill="#111" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);
const Cursor: React.FC<{t: number}> = ({t}) => {
  const [x, y] = cursorAt(t);
  if (y > 1120) return null;
  const [px, py] = cursorAt(t - 1 / 30);
  const sp = Math.hypot(x - px, y - py);
  const ghosts = sp > 18 ? 5 : 0;
  return (
    <>
      {Array.from({length: ghosts}, (_, k) => {
        const f = (k + 1) / (ghosts + 1);
        return <Arrow key={k} x={mix(x, px, f)} y={mix(y, py, f)} op={0.22 * (1 - f) * clamp((sp - 18) / 30)} />;
      })}
      <Arrow x={x} y={y} />
    </>
  );
};

// ───────── 整场（t = 原片秒）─────────
export const TaskCardScene: React.FC<{t: number}> = ({t}) => {
  const w = whipUI(t);
  const drift = 1 + 0.0008 * Math.max(0, t - 13.78);
  const cb = (p: number, q: number): [number, number] => [fx(p), fy(q)];
  const [r1x, r1y] = cb(52.2, 56.6), [r2x, r2y] = cb(77, 74.6), [r3x, r3y] = cb(84, 60.2);
  const cbx = fx(14.3) + 37 + 51, cby = fy(59);
  return (
    <AbsoluteFill style={{background: '#e6eafb'}}>
      <Backdrop t={t} />
      <AbsoluteFill style={{transform: `scale(${drift})`, transformOrigin: '960px 560px'}}>
        {w.op > 0.003 && (
          <AbsoluteFill style={{opacity: w.op, transform: `scale(${w.s})`, transformOrigin: `960px ${fy(48)}px`, willChange: 'transform'}}>
            <DBlur sx={w.bx} sy={w.bx * 0.06}>
              <TaskCard t={t} />
              <AddButton t={t} />
              <DetailCard t={t} />
              <DoneCapsule t={t} />
              <Ripple t={t} x={r1x} y={r1y} t0={14.85} d0={44} d1={96} dur={0.3} />
              <Ripple t={t} x={r2x} y={r2y} t0={18.33} d0={52} d1={84} dur={0.32} />
              <Ripple t={t} x={r3x} y={r3y} t0={22.5} d0={50} d1={82} dur={0.3} />
              <Ripple t={t} x={cbx} y={cby} t0={24.1} d0={56} d1={88} dur={0.24} />
              <Confetti t={t} />
            </DBlur>
          </AbsoluteFill>
        )}
        <TextLayer t={t} />
        <Cursor t={t} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 单拿一拍：从 from 帧开始播，到 to 帧停住
export const TaskCardBeat: React.FC<{from: number; to: number}> = ({from, to}) => {
  const f = useCurrentFrame();
  return <TaskCardScene t={tOf(Math.min(to, from + f))} />;
};
export const BeatCreate: React.FC = () => <TaskCardBeat from={BEAT_CREATE[0]} to={BEAT_CREATE[1]} />;
export const BeatPlan: React.FC = () => <TaskCardBeat from={BEAT_PLAN[0]} to={BEAT_PLAN[1]} />;
export const BeatEdit: React.FC = () => <TaskCardBeat from={BEAT_EDIT[0]} to={BEAT_EDIT[1]} />;
export const BeatDone: React.FC = () => <TaskCardBeat from={BEAT_DONE[0]} to={369} />; // 单用时停在胶囊 + 勾一下，不甩出

export const TaskCardThreeVerbsOrig: React.FC = () => {
  const f = useCurrentFrame();
  return <TaskCardScene t={tOf(f)} />;
};

// ═════════ 合同（源秒 = 原片秒 − 13.55，30fps）═════════
export const TASK_CARD_THREE_VERBS_CONTRACT: GroupContract = {
  sourceDuration: 378 / 30,
  fps: 30,
  motion: [[0, 5.6], [5.7, 9.4], [9.47, 12.25], [12.3, 378 / 30]],
  holds: [
    {at: 5.65, maxExtra: 1.5}, // 列表 + 新行绿框（读"新建好了"）
    {at: 9.433, maxExtra: 1.0}, // 改完时间、已保存
    {at: 12.27, maxExtra: 1.0}, // 已完成胶囊、彩纸落完，甩出之前
  ],
  landmarks: {headline: 0.27, press: 1.17, card: 1.27, typing: 1.8, tags: 3.57, add: 4.63, list: 4.83, whip: 5.77, pick: 6.57, verb2: 7.8, detail: 7.93, saved: 9.27, verb3: 9.87, check: 10.53, done: 10.83, exit: 12.33},
  sfx: [
    {at: 'headline', type: '键盘', note: '极轻打字滴答（可省）', tail: 0.6, volume: 0.2},
    {at: 'press', type: '点击', note: '短 click', volume: 0.35},
    {at: 'card', type: '上升', note: '轻 whoosh-up（卡撑开）', tail: 0.3, volume: 0.3},
    {at: 'typing', type: '键盘', note: '键盘连击', tail: 1.5, volume: 0.25},
    {at: 'tags', type: '弹出', note: 'pop × 3（音高递增）', tail: 0.4, volume: 0.3},
    {at: 'add', type: '点击', note: 'click', volume: 0.35},
    {at: 'whip', type: '短甩', note: '短 swoosh（甩糊换词）', tail: 0.3, volume: 0.35},
    {at: 'pick', type: '轻落定', note: 'pick → soft drop', tail: 1.0, volume: 0.3},
    {at: 'detail', type: '短甩', note: 'swoosh（侧卡滑入）', tail: 0.4, volume: 0.3},
    {at: 'saved', type: '提示音', note: '轻提示音', volume: 0.3},
    {at: 'check', type: '点击', note: 'click + 彩纸 confetti pop', tail: 0.6, volume: 0.45},
    {at: 'check', type: '彩纸', note: 'click + 彩纸 confetti pop', tail: 0.6, volume: 0.45},
    {at: 'done', type: '提示音', note: 'success chime', tail: 0.6, volume: 0.4},
    {at: 'exit', type: '短甩', note: '短 swoosh（甩出）', tail: 0.3, volume: 0.35},
  ],
  inputs: {line1: {maxChars: 8}, line2: {maxChars: 10}, verbs: {count: 3, maxChars: 4}, input: {maxChars: 16}, tagTime: {maxChars: 8}, tagList: {maxChars: 3}, tagLevel: {maxChars: 3}, task: {maxChars: 8}, others: {count: 2, maxChars: 8}, newTime: {maxChars: 8}},
};

export type TaskVerbsInputs = {line1: string; line2: string; verbs: [string, string, string]; input: string; tagTime: string; tagList: string; tagLevel: string; task: string; others: [string, string]; newTime: string};
export const TASK_VERBS_DEFAULT_INPUTS: TaskVerbsInputs = {
  line1: '随口一句话，', line2: '几秒建好一件事。', verbs: ['排一排。', '改一改。', '勾一下。'],
  input: '周六上午10点 取干洗的衣服', tagTime: '周六 10:00', tagList: '生活', tagLevel: '普通',
  task: '取干洗的衣服', others: ['给房东转房租', '买一袋猫粮'], newTime: '周六 11:30',
};
export const checkTaskVerbsInputs = (x: TaskVerbsInputs) => checkInputs(TASK_CARD_THREE_VERBS_CONTRACT, x);
export const planTaskVerbs = (sec: number) => planExtras(TASK_CARD_THREE_VERBS_CONTRACT, sec);
export const taskVerbsFrames = (extras: number[]) => Math.round(outputDuration(TASK_CARD_THREE_VERBS_CONTRACT, extras) * 30);
export const TASK_CARD_THREE_VERBS_GROUP_DURATION = 378;

const applyTaskInputs = (x: TaskVerbsInputs) => {
  L1 = x.line1; L2 = x.line2; VERBS = [...x.verbs]; INPUT = x.input; NEW_TIME = x.newTime;
  TAGS = [{...TAGS[0], txt: x.tagTime}, {...TAGS[1], txt: x.tagList}, {...TAGS[2], txt: x.tagLevel}];
  ROWS = [{...ROWS[0], name: x.others[0]}, {...ROWS[1], name: x.others[1]}, {...ROWS[2], name: x.task, tag: x.tagList, time: x.tagTime}];
};

// 整组：按合同时钟演（停留时画面整体极慢推近，R7）
export const TaskCardThreeVerbsGroup: React.FC<{inputs?: TaskVerbsInputs; extras?: number[]}> = ({inputs = TASK_VERBS_DEFAULT_INPUTS, extras = [0, 0, 0]}) => {
  const t = useCurrentFrame() / 30;
  const s = toSource(t, TASK_CARD_THREE_VERBS_CONTRACT, extras);
  const lag = t - s;
  applyTaskInputs(inputs);
  return (
    <AbsoluteFill style={{transform: `scale(${1 + 0.004 * lag})`, transformOrigin: '960px 560px', overflow: 'hidden'}}>
      <TaskCardScene t={13.55 + s} />
    </AbsoluteFill>
  );
};
export const TaskCardThreeVerbs: React.FC = () => <TaskCardThreeVerbsGroup />;
if (checkContract(TASK_CARD_THREE_VERBS_CONTRACT).length) throw new Error(checkContract(TASK_CARD_THREE_VERBS_CONTRACT).join('; '));
