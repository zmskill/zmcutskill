// 【镜头组】intro-genie-wordmark-browser：程序坞上方打出「隆重介绍」→ 手点产品图标，图标像精灵一样从坞里往上喷开、撑满全屏（竖条纹蓝绿渐变）→
//   产品名逐个字母从虚到实浮出、一直慢慢变大 → 整屏洗白 → 白底上产品标志 + 四行字由灰变黑（背后一条蓝色细线沿着浏览器窗口的边描出来）→
//   字退掉，「横跨」+ 三个带图标的词从两边错落滑进来 → 淡出、背后的浏览器界面整个显出来（040-D 一拍，产品登场）
// 学的动作（SkaleSolutions · Aside 17.95–26.00s，29.97fps；网格大图逐点量过，时间表 （内部拆片记录，未随项目提供））：
//   18.8–19.1 精灵：下沿贴着图标、上沿 695 → 225 → 出画，两边是往里收的弧；19.2 起产品名逐字母出，字高 100（19.3）→ 230（19.9）→ 290（20.6）；
//   20.9–21.3 洗白；21.35 标志 + 第一行灰着出，21.9 起逐行补齐、整块上移，22.3–22.9 由灰变黑；21.85 起蓝线从左下沿窗口边往上、再沿上边往右描到 1616；
//   23.1–23.25 字退成浅灰消失；23.3 横跨 浅蓝 → 深；24.05 三个词从两边滑进（0.25s），25.3 起淡出，背后浏览器界面显出。
// 我们的内容：产品名用虚构的 Nimbo，列表、界面全是通用内容（侧栏、任务卡的图都是自己画的）。
//
// 拍表（源秒 = 原片秒 − 17.95，30fps，共 242 帧）
//   拍 1 隆重介绍 + 精灵 + 产品名     0.00–2.75   （停留点 2.80）
//   拍 2 洗白 + 标志 + 四行字         2.85–5.00   （停留点 5.05）
//   拍 3 横跨 + 三个词                5.10–7.25   （停留点 7.30）
//   拍 4 浏览器界面显出               7.35–7.95   （停留点 8.00）
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有 1：精灵的下沿一直贴着图标、上沿先往右长，两边是往里凹的弧（macOS 精灵效果），不是方块放大
//   - 独有 2：四行字是「整块灰着出、再从左到右逐词变黑」，不是逐字打
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {AppIcon, BG, BRAND_GRAD, BRAND_STREAKS, Hand, IconKind, SANS, Trash, clamp, easeInOut, easeOut, mix, mk, mkv} from '../_kit/darkUiKit';

const FPS = 30;
const T0 = 17.95;

export const INTRO_GENIE_WORDMARK_BROWSER_CONTRACT: GroupContract = {
  sourceDuration: 8.05,
  fps: 30,
  motion: [[0, 2.75], [2.85, 5.0], [5.1, 7.25], [7.35, 7.95]],
  holds: [{at: 2.8, maxExtra: 1.0}, {at: 5.05, maxExtra: 1.2}, {at: 7.3, maxExtra: 1.2}, {at: 8.0, maxExtra: 1.5}],
  landmarks: {type: 0.02, click: 0.8, genie: 0.85, name: 1.25, wash: 2.95, logo: 3.4, line: 3.9, fade: 5.15, across: 5.35, items: 6.1, ui: 7.35},
  sfx: [
    {at: 'type', type: '键盘', note: '键盘敲字（4 下）', tail: 0.4, volume: 0.3},
    {at: 'click', type: '点击', note: '点击 click', volume: 0.4},
    {at: 'genie', type: '上升', note: '精灵展开 whoosh（上扬）', tail: 0.5, volume: 0.5},
    {at: 'name', type: '落版重击', note: '低频 boom + 闪光 shimmer', tail: 1.2, volume: 0.5},
    {at: 'name', type: '闪光', note: '低频 boom + 闪光 shimmer', tail: 1.2, volume: 0.5},
    {at: 'wash', type: '上扬铺垫', note: '亮起 swell', tail: 0.4, volume: 0.3},
    {at: 'line', type: '轻tick', note: '细线 tick', volume: 0.2},
    {at: 'items', type: '短甩', note: '三下 swish', tail: 0.3, volume: 0.3},
    {at: 'ui', type: '运镜', note: '界面出现 soft whoosh', volume: 0.25},
  ],
  inputs: {intro: {maxChars: 5}, name: {maxChars: 6}, lines: {count: 4, maxChars: 6}, across: {maxChars: 3}, items: {count: 3, maxChars: 4}},
};

export type IgwbInputs = {
  intro: string; name: string; lines: [string, string, string, string]; across: string;
  items: [string, string, string]; dockIcons: [IconKind, IconKind, IconKind]; // 第 1 个是产品图标（被点开的那个）
};
export const IGWB_DEFAULT_INPUTS: IgwbInputs = {
  intro: '隆重介绍', name: 'Nimbo', lines: ['一个浏览器', '能把复杂的', '工作', '真正做完'], across: '横跨',
  items: ['网站', '账号', '历史记录'], dockIcons: ['brand', 'qqbrowser', 'qqmail'],
};
export const checkIgwbInputs = (x: IgwbInputs) => checkInputs(INTRO_GENIE_WORDMARK_BROWSER_CONTRACT, {intro: x.intro, name: x.name, lines: x.lines, across: x.across, items: x.items});
export const planIgwb = (sec: number) => planExtras(INTRO_GENIE_WORDMARK_BROWSER_CONTRACT, sec);
export const igwbFrames = (extras: number[]) => Math.round(outputDuration(INTRO_GENIE_WORDMARK_BROWSER_CONTRACT, extras) * FPS);
export const INTRO_GENIE_WORDMARK_BROWSER_DURATION = 242;

// ── 量出来的（原片秒，屏幕坐标）──
// 精灵外形：上沿 y、上沿左 x、上沿右 x、下沿左 x、下沿右 x、下沿 y
const GENIE = [[18.8, 790, 560, 756, 560, 756, 996], [18.88, 695, 405, 905, 555, 750, 1040], [18.96, 225, 10, 1300, 480, 820, 1040], [19.03, -120, -300, 2000, 300, 1050, 1060], [19.1, -400, -800, 2700, -200, 2100, 1300]];
const NAME_H = [[19.2, 70], [19.3, 100], [19.6, 175], [19.9, 230], [20.3, 270], [20.6, 290], [21.0, 296]]; // 大写字高
const LINE_DOT = [[21.85, 244, 1000], [21.95, 244, 600], [22.05, 244, 250], [22.12, 290, 140], [22.3, 860, 140], [22.8, 1412, 140], [23.2, 1544, 140], [23.6, 1604, 140], [24.02, 1616, 140]];
const BLOCK_Y = [[21.35, 630], [21.9, 510], [22.15, 400], [22.3, 380], [22.8, 360]]; // 第一行基线
const ACROSS_Y = [[23.3, 660], [23.6, 660], [24.02, 620], [24.2, 480], [24.6, 440]];

const GenieShape: React.FC<{s: number}> = ({s}) => {
  const [ty, tl, tr, bl, br, by] = mkv(s, GENIE);
  const arch = (tr - tl) * 0.06;
  const r = Math.min(40, (br - bl) * 0.2);
  const d = `M ${tl} ${ty + arch} Q ${(tl + tr) / 2} ${ty - arch} ${tr} ${ty + arch} C ${tr - (tr - br) * 0.15} ${ty + (by - ty) * 0.45}, ${br} ${ty + (by - ty) * 0.55}, ${br} ${by - r} Q ${br} ${by} ${br - r} ${by} L ${bl + r} ${by} Q ${bl} ${by} ${bl} ${by - r} C ${bl} ${ty + (by - ty) * 0.55}, ${tl + (bl - tl) * 0.15} ${ty + (by - ty) * 0.45}, ${tl} ${ty + arch} Z`;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))'}} width={1920} height={1080}>
      <defs>
        <clipPath id="genieClip"><path d={d} /></clipPath>
      </defs>
      <foreignObject x={0} y={0} width={1920} height={1080} clipPath="url(#genieClip)">
        <div style={{width: 1920, height: 1080, background: BRAND_GRAD, position: 'relative'}}><div style={{position: 'absolute', inset: 0, background: BRAND_STREAKS}} /></div>
      </foreignObject>
    </svg>
  );
};

const LineIcon: React.FC<{i: number; size: number}> = ({i, size}) => {
  const p = {fill: 'none', stroke: '#111', strokeWidth: 2.3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{marginRight: size * 0.12}}>
      {i === 0 && (<g {...p}><circle cx="12" cy="12" r="9.5" /><ellipse cx="12" cy="12" rx="4.2" ry="9.5" /><path d="M2.5 12h19" /></g>)}
      {i === 1 && (<g {...p}><circle cx="15" cy="9" r="5.5" /><path d="M11 13 L3.5 20.5 M6 18 l2 2 M8.5 15.5 l2 2" /><circle cx="16" cy="8" r="1.2" /></g>)}
      {i === 2 && (<g {...p}><path d="M4 12a8 8 0 1 0 2.4-5.7" /><path d="M4 4v4h4" /><path d="M12 8v4.5l3 2" /></g>)}
    </svg>
  );
};
const Logo: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round">
    <circle cx="24" cy="24" r="20" />
    <path d="M10 38 L38 10" />
    <path d="M24 14 C25 21 27 23 34 24 C27 25 25 27 24 34 C23 27 21 25 14 24 C21 23 23 21 24 14 Z" fill={color} stroke="none" />
  </svg>
);

/** 浏览器界面（白底；sidebar 的条目、任务卡全是通用内容） */
const BrowserUI: React.FC<{reveal: number; frame: number}> = ({reveal, frame}) => {
  const f = clamp(frame), r = clamp(reveal);
  const side = ['个人', '书签', '产品', '设计稿', '代码库', '标签页', '新标签页', '对话', '代理标签页', '邮件', '社交'];
  return (
    <div style={{position: 'absolute', left: 250, top: 140, width: 1610, height: 1000, borderRadius: 40, boxShadow: `inset 0 0 0 1.5px rgba(0,0,0,${0.08 * f})`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 310, height: 1000, background: `rgba(246,246,247,${0.9 * r})`, borderRight: `1.5px solid rgba(0,0,0,${0.05 * f})`}} />
      {/* 侧栏里先浮出的三条（任务 / 例行 / 自定义） */}
      {['任务', '例行', '自定义'].map((x, i) => (
        <div key={x} style={{position: 'absolute', left: 26, top: 262 + i * 54, fontSize: 21, color: '#6c7076', opacity: 0.55 * f * (1 - r)}}>◌ {x}</div>
      ))}
      {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: 26, top: 450 + i * 45, width: [130, 110, 125, 90][i], height: 10, borderRadius: 5, background: '#e9eaec', opacity: f * (1 - r)}} />)}
      {/* 显出后的完整界面 */}
      <div style={{position: 'absolute', inset: 0, opacity: r}}>
        {[['#ff5f57', 0], ['#febc2e', 26], ['#28c840', 52]].map(([c, x]) => <div key={String(c)} style={{position: 'absolute', left: 22 + Number(x), top: 26, width: 15, height: 15, borderRadius: 8, background: String(c)}} />)}
        {side.map((x, i) => <div key={x} style={{position: 'absolute', left: 30, top: 92 + i * 46, fontSize: 19, color: i === 1 || i === 5 ? '#9a9ea4' : '#2c2f33'}}>{i === 1 || i === 5 ? '' : '▪ '}{x}</div>)}
        <div style={{position: 'absolute', left: 400, top: 22, fontSize: 18, color: '#7b7f85'}}>搜索或输入网址</div>
        <div style={{position: 'absolute', left: 1020, top: 196, width: 64, height: 64, opacity: 0.25}}><Logo size={64} color="#556" /></div>
        <div style={{position: 'absolute', left: 660, top: 294, width: 770, height: 58, borderRadius: 14, boxShadow: 'inset 0 0 0 1.5px #e3e4e7', fontSize: 19, color: '#8a8e94', lineHeight: '58px', paddingLeft: 22}}>让 AI 做件事，用 @ 加上下文</div>
        <div style={{position: 'absolute', left: 590, top: 440, fontSize: 20, color: '#2c2f33', fontWeight: 600}}>进行中的任务</div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{position: 'absolute', left: 590 + i * 320, top: 480, width: 290, height: 380, borderRadius: 18, background: '#fff', boxShadow: '0 0 0 1.5px #eceef0, 0 10px 30px rgba(0,0,0,0.05)'}}>
            <div style={{position: 'absolute', left: 16, top: 16, fontSize: 15, color: '#9a9ea4'}}>{['已工作 3 分钟', '一小时前', '每天 9 点'][i]}</div>
            <div style={{position: 'absolute', left: 16, top: 42, fontSize: 18, color: '#222', fontWeight: 600}}>{['找网站设计参考', '整理周末路线', '每日简报'][i]}</div>
            {[0, 1, 2].map((j) => <div key={j} style={{position: 'absolute', left: 16, top: 84 + j * 22, width: [220, 180, 200][j], height: 9, borderRadius: 5, background: '#eef0f2'}} />)}
            <div style={{position: 'absolute', left: 16, top: 170, width: 258, height: 190, borderRadius: 12, background: ['linear-gradient(135deg,#ffd36b,#ff7a59 60%,#6b4bff)', 'linear-gradient(180deg,#9fd3ff,#4f9a6a 55%,#2f6a46)', 'linear-gradient(180deg,#f4f6f8,#dfe5ea)'][i]}}>
              {i === 2 && [0, 1, 2, 3].map((j) => <div key={j} style={{position: 'absolute', left: 14, top: 16 + j * 24, width: [200, 150, 180, 120][j], height: 8, borderRadius: 4, background: '#c7cfd6'}} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const IntroGenieWordmarkBrowserGroup: React.FC<{inputs?: IgwbInputs; extras?: number[]}> = ({inputs = IGWB_DEFAULT_INPUTS, extras = [0, 0, 0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, INTRO_GENIE_WORDMARK_BROWSER_CONTRACT, extras);
  const lag = t - s;
  const T = s + T0;
  const cam = 1 + 0.004 * lag;

  // ═ 拍 1：暗底，隆重介绍 + 坞 + 精灵 ═
  let dark: React.ReactNode = null;
  if (T < 19.12) {
    const intro = [...inputs.intro];
    const n = Math.min(intro.length, Math.floor((T - 17.95) / 0.09) + 1);
    const slots = [657, 851, 1046, 1275];
    const hand = mkv(T, [[17.95, 1300, 870], [18.3, 1230, 905], [18.55, 700, 920], [18.75, 660, 925], [19.0, 660, 925]]);
    const hover = clamp((T - 18.45) / 0.2) * (T < 18.82 ? 1 : 0);
    dark = (
      <AbsoluteFill style={{background: BG}}>
        <div style={{position: 'absolute', left: 0, width: 1920, top: 580 - 130 * 0.92, textAlign: 'center', fontSize: 130, fontWeight: 600, lineHeight: '156px', color: '#f4f4f4', whiteSpace: 'pre'}}>{intro.slice(0, Math.max(0, n)).join('')}</div>
        <div style={{position: 'absolute', left: 540, top: 810, width: 840, height: 210, borderRadius: 58, background: 'rgba(40,40,42,0.85)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.08), 0 16px 50px rgba(0,0,0,0.4)'}} />
        <div style={{position: 'absolute', left: 1177, top: 850, width: 2, height: 130, background: 'rgba(255,255,255,0.12)'}} />
        {inputs.dockIcons.map((k, i) => {
          if (i === 0 && T >= 18.8) return null;
          const m = i === 0 ? 1 + 0.2 * hover : 1;
          const sz = 164 * m;
          return <div key={i} style={{position: 'absolute', left: slots[i] - sz / 2, top: 915 - sz / 2 - (m - 1) * 70}}><AppIcon kind={k} size={sz} /></div>;
        })}
        <div style={{position: 'absolute', left: slots[3] - 66, top: 852}}><Trash w={132}><div style={{position: 'absolute', left: 36, top: -10, width: 54, height: 44, borderRadius: 12, background: '#fff', transform: 'rotate(4deg)'}} /></Trash></div>
        {T >= 18.8 && <GenieShape s={T} />}
        {T < 18.95 && <Hand x={hand[0]} y={hand[1]} h={150} press={T > 18.72 ? 1 : 0} />}
      </AbsoluteFill>
    );
  }

  // ═ 产品名（满屏渐变上）═
  let brand: React.ReactNode = null;
  if (T >= 19.08 && T < 21.32) {
    const h = mk(T, NAME_H);
    const fs = h / 0.72;
    const letters = [...inputs.name];
    const wash = clamp((T - 20.9) / 0.38);
    brand = (
      <AbsoluteFill>
        <div style={{position: 'absolute', inset: 0, background: BRAND_GRAD}} />
        <div style={{position: 'absolute', inset: 0, background: BRAND_STREAKS}} />
        <div style={{position: 'absolute', left: 0, width: 1920, top: mix(590, 690, clamp((T - 19.3) / 1.3)) - fs * 0.9, textAlign: 'center', fontSize: fs, fontWeight: 700, lineHeight: `${fs * 1.1}px`, letterSpacing: -fs * 0.02, whiteSpace: 'pre'}}>
          {letters.map((ch, i) => {
            const u = clamp((T - 19.2 - i * 0.09) / 0.3);
            return <span key={i} style={{color: `rgba(206,224,233,${0.92 * u})`, filter: u < 1 ? `blur(${10 * (1 - u)}px)` : undefined, display: 'inline-block'}}>{ch}</span>;
          })}
        </div>
        {/* 洗白：从下往上一层灰白盖上来，再整屏变白 */}
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(235,242,246,${clamp(wash * 1.6 - 0.2)}), rgba(205,205,210,${clamp(wash * 1.4)}))`}} />
        <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: clamp((wash - 0.55) / 0.45)}} />
      </AbsoluteFill>
    );
  }

  // ═ 白底：标志 + 四行 → 横跨 + 三个词 → 浏览器 ═
  let light: React.ReactNode = null;
  if (T >= 21.3) {
    const frameOn = clamp((T - 22.0) / 0.3);
    const uiOn = clamp((T - 25.3) / 0.35);
    const dot = T >= 21.85 ? mkv(T, LINE_DOT) : null;
    const by = mk(T, BLOCK_Y);
    const lineStart = [21.35, 21.85, 22.05, 22.15];
    const blockFade = clamp((T - 23.08) / 0.17);
    const darkAt = (li: number, ci: number, n: number) => 22.3 + li * 0.08 + (ci / Math.max(1, n)) * 0.08;
    const block = T < 23.26 && (
      <>
        <div style={{position: 'absolute', left: 586, top: mk(T, [[21.35, 470], [21.9, 510], [22.8, 514]]) - 68, opacity: clamp((T - 21.35) / 0.15) * (1 - blockFade)}}>
          <Logo size={136} color={`rgb(${mix(120, 17, clamp((T - 22.3) / 0.4))},${mix(140, 17, clamp((T - 22.3) / 0.4))},${mix(150, 17, clamp((T - 22.3) / 0.4))})`} />
        </div>
        {inputs.lines.map((ln, li) => {
          const ap = clamp((T - lineStart[li]) / 0.15);
          if (ap <= 0) return null;
          const chars = [...ln];
          return (
            <div key={li} style={{position: 'absolute', left: 760, top: by + li * 135 - 120 * 0.92, fontSize: 120, fontWeight: 600, lineHeight: '144px', whiteSpace: 'pre', opacity: ap}}>
              {chars.map((ch, ci) => {
                const k = clamp((T - darkAt(li, ci, chars.length)) / 0.2);
                const g = mix(160, 17, k);
                const fadeG = mix(g, 225, blockFade);
                return <span key={ci} style={{color: `rgba(${fadeG},${fadeG},${fadeG + (1 - k) * 8},${1 - clamp((blockFade - 0.7) / 0.3)})`}}>{ch}</span>;
              })}
            </div>
          );
        })}
      </>
    );
    // 横跨 + 三个词
    const itemsOn = T >= 24.02;
    const itemX = [[1030, 920], [570, 664], [1170, 1136]];
    const itemY = [590, 722, 868];
    const listFade = clamp((T - 25.3) / 0.25);
    const acrossK = clamp((T - 23.3) / 0.3);
    const list = T >= 23.3 && T < 25.6 && (
      <div style={{opacity: 1 - listFade}}>
        <div style={{position: 'absolute', left: 664, top: mk(T, ACROSS_Y) - 120 * 0.92, fontSize: 120, fontWeight: 600, lineHeight: '144px', color: `rgb(${mix(150, 26, acrossK)},${mix(200, 36, acrossK)},${mix(225, 44, acrossK)})`, opacity: clamp(acrossK * 3)}}>{inputs.across}</div>
        {itemsOn && inputs.items.map((it, i) => {
          const u = easeOut((T - 24.02 - i * 0.03) / 0.6);
          const x = mix(itemX[i][0], itemX[i][1], u);
          return (
            <div key={i} style={{position: 'absolute', left: x, top: itemY[i] - 120 * 0.92, height: 144, display: 'flex', alignItems: 'center', fontSize: 120, fontWeight: 600, color: '#111', opacity: clamp((T - 24.02 - i * 0.03) / 0.08), whiteSpace: 'pre'}}>
              <LineIcon i={i} size={122} />{it}
            </div>
          );
        })}
      </div>
    );
    light = (
      <AbsoluteFill style={{background: '#fff'}}>
        <BrowserUI reveal={uiOn} frame={frameOn} />
        {dot && T < 25.95 && (() => {
          // 已描过的线：左边一段 + 上边一段，尾巴越远越淡
          const [dx, dy] = dot;
          const onTop = dy <= 141;
          return (
            <svg style={{position: 'absolute', left: 0, top: 0, opacity: 1 - uiOn * 0.8}} width={1920} height={1080}>
              <defs><linearGradient id="tail" x1={onTop ? dx - 420 : 0} y1={onTop ? 0 : dy + 420} x2={dx} y2={dy} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#1a86c8" stopOpacity="0" /><stop offset="1" stopColor="#1a86c8" stopOpacity="0.9" /></linearGradient></defs>
              <path d={onTop ? `M 250 300 L 250 180 Q 250 140 290 140 L ${dx} 140` : `M 244 1080 L ${dx} ${dy}`} stroke="url(#tail)" strokeWidth={2.4} fill="none" />
              <circle cx={dx} cy={dy} r={7} fill="#1a86c8" stroke="#fff" strokeWidth={2} />
            </svg>
          );
        })()}
        {block}
        {list}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: '960px 540px'}}>
        {light}
        {brand}
        {dark}
      </div>
      <Grain opacity={0.02} />
    </AbsoluteFill>
  );
};

if (checkContract(INTRO_GENIE_WORDMARK_BROWSER_CONTRACT).length) throw new Error(checkContract(INTRO_GENIE_WORDMARK_BROWSER_CONTRACT).join('；'));
export const IntroGenieWordmarkBrowser: React.FC = () => <IntroGenieWordmarkBrowserGroup />;
