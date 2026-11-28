// 【镜头组】subscription-icons-absorb-url：暗底，上一镜留下的图标 → 逐词打出「用你自己的 / 订阅」，前半句退、钥匙图标插到「订阅」前 →
//   钥匙换成一个小火花，字退掉，左边出现产品 App 图标，右边一排 AI 服务图标往左走、一个个被吸进 App 图标 → App 图标缩成标志，
//   旁边打出「Nimbo 一个浏览器 / 能替你」→ 只剩「替你 干活」，两个词往两边退开变暗，中间打出网址（040-L 一拍，收尾）
// 学的动作（SkaleSolutions · Aside 79.28–87.50s，29.97fps；网格大图逐点量过，时间表 （内部拆片记录，未随项目提供））：
//   80.08 图标换成字，80.11 / 80.18 / 80.25 逐词出、整段一直往左漂；80.42 第二行；80.85 钥匙插进来、80.88 第一行没了、第二行升到正中；81.22–81.3 钥匙淡、81.3 火花弹出；
//   81.75 App 图标（236，中心 968,538）+ 右边一排图标（间距约 235）匀速往左，到 App 图标右沿就缩没；82.85–83.2 图标底板缩没、只剩标志；
//   83.4 产品名、83.75 a browser、84.0 第二行；84.7 第一行退、第二行沉到正中；85.35 your work；85.75 两个词退到两边变暗、中间打网址；86.35 两边的词退。
// 我们的内容：通用的"自带订阅"收尾，产品名 Nimbo 和网址都是虚构的（.example 是国际上专门留给示例用的域名，不属于任何网站；画面上也备注了「虚构网址」），AI 服务图标是国内产品官方标志的白色剪影（DeepSeek、Kimi、千问、文心、元宝）。
//
// 拍表（源秒 = 原片秒 − 79.28，30fps，共 247 帧）
//   拍 1 订阅 + 钥匙                0.00–1.82   （停留点 1.87）
//   拍 2 图标吸进 App + 产品名两行   1.92–5.07   （停留点 5.12）
//   拍 3 替你 干活 + 网址            5.17–8.12   （停留点 8.17）
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有：一排图标先慢后快往左走、越近越小、钻到磨砂底板下面（还能看到一团糊影）才消失，每吸一个标志亮一档（2026-11-15 用户指出原来不够丝滑，按逐帧重量）；最后两个词往两边退开给网址让位
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {BG, SANS, clamp, easeInOut, easeOut, mix, mk} from '../_kit/darkUiKit';

const FPS = 30;
const T0 = 79.28;

export const SUBSCRIPTION_ICONS_ABSORB_URL_CONTRACT: GroupContract = {
  sourceDuration: 8.22,
  fps: 30,
  motion: [[0, 1.82], [1.92, 5.07], [5.17, 8.12]],
  holds: [{at: 1.87, maxExtra: 1.0}, {at: 5.12, maxExtra: 1.0}, {at: 8.17, maxExtra: 1.5}],
  landmarks: {words: 0.87, key: 1.52, spark: 2.1, app: 2.47, absorb: 2.9, logo: 3.75, name: 4.12, line2: 4.72, work: 6.07, url: 6.52},
  sfx: [
    {at: 'words', type: '轻tick', note: 'soft tick ×3', volume: 0.2},
    {at: 'key', type: '弹出', note: 'soft pop', volume: 0.25},
    {at: 'app', type: '运镜', note: '出现 soft whoosh', volume: 0.3},
    {at: 'absorb', type: '弹出', note: '吸入 pop 连串 ×5', tail: 0.6, volume: 0.35},
    {at: 'name', type: '落版重击', note: '落版 low hit', tail: 0.6, volume: 0.45},
    {at: 'url', type: '键盘', note: '键盘敲字', tail: 0.5, volume: 0.3},
  ],
  inputs: {l1: {count: 3, maxChars: 3}, sub: {maxChars: 3}, brand: {maxChars: 7}, tag: {maxChars: 5}, does: {maxChars: 3}, you: {maxChars: 2}, work: {maxChars: 2}, url: {maxChars: 14}},
};

export type SiauInputs = {l1: [string, string, string]; sub: string; brand: string; tag: string; does: string; you: string; work: string; url: string; urlNote?: string}; // urlNote：网址下面的小字备注（虚构网址要写明，空字符串 = 不显示）
export const SIAU_DEFAULT_INPUTS: SiauInputs = {l1: ['用你', '自己', '的'], sub: '订阅', brand: 'Nimbo', tag: '一个浏览器', does: '能', you: '替你', work: '干活', url: 'nimbo.example', urlNote: '虚构网址 · 仅作演示'};
export const checkSiauInputs = (x: SiauInputs) => checkInputs(SUBSCRIPTION_ICONS_ABSORB_URL_CONTRACT, x);
export const planSiau = (sec: number) => planExtras(SUBSCRIPTION_ICONS_ABSORB_URL_CONTRACT, sec);
export const siauFrames = (extras: number[]) => Math.round(outputDuration(SUBSCRIPTION_ICONS_ABSORB_URL_CONTRACT, extras) * FPS);
export const SUBSCRIPTION_ICONS_ABSORB_URL_DURATION = 247;

const FS = 132;
const LAT = 0.62; // 拉丁字母宽 / 字号

const Ico: React.FC<{k: string; size: number; color?: string}> = ({k, size, color = '#fff'}) => {
  const p = {fill: 'none', stroke: color, strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={size} height={size} viewBox="2 2 20 20">
      {k === 'eyeoff' && (<g {...p} strokeWidth={2.2}><path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /><path d="M4 3.5l16 17" /></g>)}
      {k === 'key' && (<g {...p}><circle cx="15" cy="9" r="5" /><path d="M11.3 12.7L4 20m2.5-2.5l2 2M9 15l2 2" /><circle cx="16" cy="8" r="1" /></g>)}
      {k === 'spark' && (<g fill={color}><path d="M12 3l1.6 6.4L20 12l-6.4 1.6L12 20l-1.6-6.4L4 12l6.4-2.6z" /></g>)}
      {k === 'hex' && (<g {...p} strokeWidth={2.2}><path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9z" /><path d="M12 8l3.5 2v4L12 16l-3.5-2v-4z" /></g>)}
      {k === 'tri' && (<g {...p} strokeWidth={2.2}><path d="M12 4l8.5 15h-17z" /><path d="M12 10.5l3 5.3H9z" /></g>)}
      {k === 'star4' && (<g><defs><linearGradient id="g4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8fb4ff" /><stop offset="1" stopColor="#5a6cff" /></linearGradient></defs><path d="M12 2.5c.8 5 3.5 7.7 9.5 9.5-6 1.8-8.7 4.5-9.5 9.5-.8-5-3.5-7.7-9.5-9.5 6-1.8 8.7-4.5 9.5-9.5z" fill="url(#g4)" /></g>)}
      {k === 'bot' && (<g {...p} strokeWidth={2}><rect x="4" y="7" width="16" height="12" rx="4" /><path d="M12 7V4" /><circle cx="9" cy="13" r="1.3" fill={color} /><circle cx="15" cy="13" r="1.3" fill={color} /></g>)}
      {k === 'petal' && (<g {...p} strokeWidth={1.6}>{[0, 60, 120].map((a) => <ellipse key={a} cx="12" cy="12" rx="3.4" ry="8.5" transform={`rotate(${a} 12 12)`} />)}</g>)}
    </svg>
  );
};
const Logo: React.FC<{size: number; color?: string}> = ({size, color = '#fff'}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={3.6} strokeLinecap="round">
    <circle cx="24" cy="24" r="20" /><path d="M10 38 L38 10" /><path d="M24 14 C25 21 27 23 34 24 C27 25 25 27 24 34 C23 27 21 25 14 24 C21 23 23 21 24 14 Z" fill={color} stroke="none" />
  </svg>
);
// 2026-11-17 第2轮：原片这排是 Claude、ChatGPT 等真实 AI 品牌的白色单色标志 → 换成国内 AI 产品官方图标抠出的白色剪影（library/brands/<名>/glyph_white.png）
const ROW = ['deepseek', 'kimi', 'qianwen', 'wenxin', 'yuanbao'];
const Glyph: React.FC<{k: string; size: number}> = ({k, size}) => <Img src={staticFile(`library/brands/${k}/glyph_white.png`)} style={{width: size, height: size, display: 'block'}} />;

export const SubscriptionIconsAbsorbUrlGroup: React.FC<{inputs?: SiauInputs; extras?: number[]}> = ({inputs = SIAU_DEFAULT_INPUTS, extras = [0, 0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, SUBSCRIPTION_ICONS_ABSORB_URL_CONTRACT, extras);
  const lag = t - s;
  const T = s + T0;
  const cam = 1 + 0.004 * lag;
  const txt: React.CSSProperties = {position: 'absolute', fontSize: FS, fontWeight: 600, lineHeight: `${FS * 1.2}px`, color: '#f6f6f6', whiteSpace: 'pre'};
  const W = (x: string) => [...x].reduce((a, c) => a + (/[\x00-\x7f]/.test(c) ? FS * LAT : FS), 0);
  const els: React.ReactNode[] = [];

  // 上一镜留下的图标：原样停着，80.08 一下换成字
  if (T < 80.08) els.push(<div key="eo" style={{position: 'absolute', left: 960 - 85, top: 540 - 85}}><Ico k="eyeoff" size={170} /></div>);

  // ── 拍 1：用你自己的 / 订阅 → 🔑 订阅 → 订阅 ✦ ──
  // 逐帧对过（80.05–81.71 每 2 帧一张）：整段字一直极慢往左漂（约 45px/s）；三个词逐词出（灰 → 白）；
  // 80.85 钥匙插进来，80.88 第一行一下没了、第二行 0.06s 升到正中；81.22–81.3 钥匙淡掉，81.3 火花整个弹出、字往左让。
  if (T >= 80.08 && T < 81.733) {
    const drift = -45 * (T - 80.1);
    const l1 = inputs.l1.join('');
    const twoLines = easeOut((T - 80.42) / 0.1);
    const keyK = easeOut((T - 80.82) / 0.08);
    const keyOut = clamp((T - 81.22) / 0.08);
    const l1Gone = clamp((T - 80.86) / 0.03);
    const merge = easeInOut((T - 80.86) / 0.07);
    const blockW = Math.max(W(l1), W(inputs.sub));
    const left = 960 - blockW / 2 + drift;
    // 第一行：逐词
    if (l1Gone < 1) {
      let x = left;
      const b1 = mix(580, 570, twoLines);
      inputs.l1.forEach((w, i) => {
        const u = T - (80.11 + i * 0.07);
        if (u >= 0) {
          const g = Math.round(mix(140, 246, clamp(u / 0.12)));
          els.push(<div key={`a${i}`} style={{...txt, left: x, top: b1 - FS * 0.92, color: `rgb(${g},${g},${g})`, opacity: clamp(u / 0.04) * (1 - l1Gone)}}>{w}</div>);
        }
        x += W(w);
      });
    }
    // 第二行（订阅 + 钥匙 / 火花）
    if (T >= 80.42) {
      const keyW = 130 * keyK * (1 - keyOut);
      const sparkK = easeOut((T - 81.29) / 0.04);
      const lineW = keyW + W(inputs.sub);
      const lxC = 960 - lineW / 2 + drift;
      // 火花出来时整行往左让，让火花中心最后落在 1356（原片位置，后面一排图标从这里起步）
      const lxSpark = 1356 - 64 - 90 - W(inputs.sub) + 45 * (81.733 - T);
      const lx = mix(mix(left, lxC, merge), lxSpark, easeInOut((T - 81.29) / 0.08));
      const b2 = mix(706, 580, merge);
      const op = clamp((T - 80.42) / 0.05);
      if (keyW > 1) els.push(<div key="ky" style={{position: 'absolute', left: lx, top: b2 - FS * 0.82, opacity: op * (1 - keyOut), transform: `scale(${keyK})`, transformOrigin: '50% 70%'}}><Ico k="key" size={128} /></div>);
      els.push(<div key="sb" style={{...txt, left: lx + keyW, top: b2 - FS * 0.92, opacity: op}}>{inputs.sub}</div>);
      if (sparkK > 0) els.push(<div key="sp" style={{position: 'absolute', left: lx + keyW + W(inputs.sub) + 90, top: b2 - FS * 0.8, opacity: op, transform: `scale(${sparkK})`}}><Ico k="spark" size={128} /></div>);
    }
  }

  // ── 拍 2：App 图标吸图标 → 标志 → 产品名 ──
  if (T >= 81.73 && T < 85.0) {
    // 原片逐帧量（81.70–83.07，每帧一张）：底板 81.733 出现在中心 1030，0.17s 内滑到 960；
    // 一排图标间距 230，整排位移 S(t) 先慢后快（最快约 3000px/s），最后一个时放慢；离底板越近越小（到边缘 0.62），钻到底板下面、隔着磨砂玻璃还能看见一团糊影，然后消失；
    // 每吸进一个，标志就亮一档；82.87–83.0 底板缩一下（236 → 208）就没了，只剩标志。
    const slideIn = easeOut((T - 81.733) / 0.17);
    const tileSz = T < 82.87 ? 236 : mk(T, [[82.87, 236], [82.97, 208], [83.0, 196]]);
    const tileBg = 1 - clamp((T - 82.97) / 0.04);
    const logoSz = T < 82.95 ? 186 : mk(T, [[82.95, 186], [83.03, 112]]);
    // 吸进的个数（连续值）：每个图标越过底板右沿 1090 后 0.06s 记满一个
    const S = mk(T, [[81.83, 0], [81.9, 6], [81.967, 14], [82.034, 28], [82.1, 48], [82.167, 76], [82.234, 112], [82.301, 164], [82.367, 232], [82.434, 316], [82.467, 374], [82.501, 442], [82.568, 609], [82.634, 812], [82.701, 986], [82.734, 1060], [82.768, 1120], [82.801, 1170], [82.834, 1216], [82.9, 1290]]);
    const X0 = 1356;
    const rowX = (i: number) => X0 + i * 230 - S;
    const absorbed = ROW.reduce((acc, _, i) => acc + clamp((1090 - rowX(i)) / 70), 0);
    const lum = Math.round(mix(140, 246, clamp(absorbed / ROW.length)));
    // 标志位置：先居中（960），83.35 起往左给产品名让位
    const brandW = W(inputs.brand), tagW = W(inputs.tag);
    const nameIn = easeInOut((T - 83.35) / 0.15);
    const tagIn = easeInOut((T - 83.72) / 0.18);
    const groupW = 112 + 34 + brandW * nameIn + (34 + tagW) * tagIn;
    const logoCx = mix(mix(1030, 960, slideIn), 960 - groupW / 2 + 56, nameIn);
    const line2 = easeOut((T - 84.0) / 0.2);
    const l1Out = clamp((T - 84.7) / 0.1);
    const b1 = 590;
    // 一排图标（画在底板下面）
    const behind: React.ReactNode[] = [];
    const glow: React.ReactNode[] = [];
    if (T < 82.95) {
      ROW.forEach((k, i) => {
        const x = rowX(i);
        if (x > 2100) return;
        const pop = i === 0 ? 1 : i <= 2 ? easeOut((T - (i === 1 ? 81.767 : 81.833)) / 0.1) : 1;
        if (pop <= 0) return;
        const near = x >= 1090 ? clamp(0.62 + 0.38 * (x - 1090) / 170, 0.62, 1) : 0.62 * clamp((x - 990) / 100);
        if (near <= 0.01) return;
        const sz = 132 * near * pop;
        const inside = clamp((1090 - x) / 100);
        behind.push(<div key={`r${i}`} style={{position: 'absolute', left: x - sz / 2, top: 538 - sz / 2, opacity: 1 - inside}}><Glyph k={k} size={sz} /></div>);
        if (inside > 0) glow.push(<div key={`g${i}`} style={{position: 'absolute', left: x - sz / 2 - (logoCx - tileSz / 2), top: 538 - sz / 2 - (538 - tileSz / 2), filter: 'blur(9px)', opacity: 0.75 * Math.sin(inside * Math.PI)}}><Glyph k={k} size={sz} /></div>);
      });
    }
    if (l1Out < 1) {
      els.push(<React.Fragment key="row">{behind}</React.Fragment>);
      els.push(
        <div key="ap" style={{position: 'absolute', left: logoCx - tileSz / 2, top: 538 - tileSz / 2, width: tileSz, height: tileSz, borderRadius: tileSz * 0.24, overflow: 'hidden', background: `rgba(29,29,31,${0.97 * tileBg})`, boxShadow: `inset 0 0 0 1.5px rgba(255,255,255,${0.06 * tileBg})`, opacity: 1 - l1Out}}>
          {tileBg > 0 && glow}
          <div style={{position: 'absolute', left: (tileSz - logoSz) / 2, top: (tileSz - logoSz) / 2}}>
            <Logo size={logoSz} color={`rgb(${lum},${lum},${lum + 2})`} />
          </div>
        </div>
      );
      if (nameIn > 0) {
        const nameN = Math.floor(clamp((T - 83.38) / 0.12) * [...inputs.brand].length + 1);
        els.push(<div key="nm" style={{...txt, left: logoCx + 56 + 34, top: b1 - FS * 0.92, opacity: 1 - l1Out, letterSpacing: -2}}>{[...inputs.brand].slice(0, nameN).join('')}</div>);
      }
      if (T >= 83.72) els.push(<div key="tg" style={{...txt, left: logoCx + 56 + 34 + brandW + 44, top: b1 - FS * 0.92 + 40 * (1 - easeOut((T - 83.72) / 0.2)), opacity: clamp((T - 83.72) / 0.1) * (1 - l1Out)}}>{inputs.tag}</div>);
    }
    // 第二行：能替你
    if (T >= 84.0) {
      const b2 = T < 84.7 ? 730 : mk(T, [[84.7, 730], [84.9, 630], [85.1, 590]]);
      const wDoes = W(inputs.does), wYou = W(inputs.you);
      const x0 = T < 84.7 ? logoCx + 56 + 34 : mix(logoCx + 56 + 34, 960 - (wDoes + wYou) / 2, easeInOut((T - 84.7) / 0.4));
      els.push(<div key="ds" style={{...txt, left: x0, top: b2 - FS * 0.92 + 40 * (1 - line2), opacity: line2}}>{inputs.does}{inputs.you}</div>);
    }
  }

  // ── 拍 3：替你 干活 → 退开 + 网址 ──
  if (T >= 85.0) {
    const wDoes = W(inputs.does), wYou = W(inputs.you), wWork = W(inputs.work);
    const doesOut = easeInOut((T - 85.22) / 0.15);
    const workIn = easeOut((T - 85.35) / 0.15);
    const gap = 40;
    const lineW = wDoes * (1 - doesOut) + wYou + (gap + wWork) * workIn;
    const x0 = 960 - lineW / 2;
    const split = easeInOut((T - 85.75) / 0.3);
    const sideOut = clamp((T - 86.35) / 0.15);
    const dim = Math.round(mix(246, 70, split));
    const youX = mix(x0 + wDoes * (1 - doesOut), 130, split);
    const workX = mix(x0 + wDoes * (1 - doesOut) + wYou + gap, 1780 - wWork, split);
    if (doesOut < 1) els.push(<div key="d3" style={{...txt, left: x0, top: 590 - FS * 0.92, opacity: 1 - doesOut}}>{inputs.does}</div>);
    if (sideOut < 1) {
      els.push(<div key="y3" style={{...txt, left: youX, top: 590 - FS * 0.92, color: `rgb(${dim},${dim},${dim})`, opacity: 1 - sideOut}}>{inputs.you}</div>);
      if (workIn > 0) els.push(<div key="w3" style={{...txt, left: workX, top: 590 - FS * 0.92 + 30 * (1 - workIn), color: `rgb(${dim},${dim},${dim})`, opacity: workIn * (1 - sideOut)}}>{inputs.work}</div>);
    }
    if (T >= 85.8) {
      const uc = [...inputs.url];
      const n = Math.floor(clamp((T - 85.8) / 0.55) * uc.length + 1);
      els.push(<div key="ul" style={{...txt, left: 960 - W(inputs.url) / 2, top: 590 - FS * 0.92, letterSpacing: -1}}>{uc.slice(0, n).join('')}</div>);
      // 2026-11-17 用户：网址是虚构的要备注，别像在给真网站打广告 → 打完字后在下面淡出一行小灰字
      const note = inputs.urlNote ?? SIAU_DEFAULT_INPUTS.urlNote;
      const nk = easeOut((T - 86.4) / 0.3);
      if (note && nk > 0) els.push(<div key="un" style={{position: 'absolute', left: 0, width: 1920, top: 640 + 10 * (1 - nk), textAlign: 'center', fontFamily: SANS, fontSize: 34, fontWeight: 500, color: '#8a8a8e', letterSpacing: 1, opacity: nk}}>{note}</div>);
    }
  }

  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: '960px 540px'}}>{els}</div>
      <Grain opacity={0.025} />
    </AbsoluteFill>
  );
};

if (checkContract(SUBSCRIPTION_ICONS_ABSORB_URL_CONTRACT).length) throw new Error(checkContract(SUBSCRIPTION_ICONS_ABSORB_URL_CONTRACT).join('；'));
export const SubscriptionIconsAbsorbUrl: React.FC = () => <SubscriptionIconsAbsorbUrlGroup />;
