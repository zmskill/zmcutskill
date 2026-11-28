// 【镜头组】spawn-tree-rows-focus：镜头跟着一条细线走：一个大胶囊框里从左到右亮出「并行派出多个子代理」，镜头往右扫过去 →
//   框的右端伸出一个花括号，线拐弯往下，蓝色小圆点领着线往下跑，跑过的地方一行行分出子任务（灰字"已派出子代理" + 图标 + 黑字任务）→
//   镜头推近第一行，字从两头往中间消掉，只剩两个图标靠拢、再往前一推（040-F 一拍，功能演示：并行子任务）
// 学的动作（SkaleSolutions · Aside 42.95–47.55s，29.97fps；网格大图逐点量过，时间表 （内部拆片记录，未随项目提供））：
//   镜头横移：字头在屏幕 676（43.0）→ 90（43.5）→ 字尾 870（44.2）→ 166（44.8，同时往上 360）；线拐下后镜头跟着往下；
//   45.45 / 45.55 / 45.65 三行从右边滑进来（行距 198）；46.0–46.65 推近 1 → 1.57；46.45 起字从两头往中间消；46.85–47.0 两个图标靠拢；47.3 起再推 2.1。
// 我们的内容：通用的"派几个子代理并行查会员用量"（图标都是自己画的通用图形）。
//
// 拍表（源秒 = 原片秒 − 42.95，30fps，共 138 帧）
//   拍 1 胶囊 + 花括号 + 线往下 + 三行   0.00–2.90   （停留点 2.95）
//   拍 2 推近 + 字消 + 图标靠拢          3.00–4.05   （停留点 4.10）
//   拍 3 再往前推                        4.15–4.60
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有：镜头是"跟着线头走"——先横扫字、再跟着线拐弯往下，没有硬切
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {AppIcon, IconKind, SANS, clamp, easeInOut, easeOut, mix, mk} from '../_kit/darkUiKit';

const FPS = 30;
const T0 = 42.95;

export const SPAWN_TREE_ROWS_FOCUS_CONTRACT: GroupContract = {
  sourceDuration: 4.6,
  fps: 30,
  motion: [[0, 2.9], [3.0, 4.05], [4.15, 4.6]],
  holds: [{at: 2.95, maxExtra: 1.0}, {at: 4.1, maxExtra: 1.0}],
  landmarks: {line: 0.05, sweep: 0.5, brace: 1.5, down: 1.85, row1: 2.5, row2: 2.6, row3: 2.7, push: 3.05, dissolve: 3.5, gather: 3.9, push2: 4.35},
  sfx: [
    {at: 'line', type: '轻tick', note: '细线 tick', volume: 0.2},
    {at: 'sweep', type: '运镜', note: '横移 whoosh', tail: 0.5, volume: 0.3},
    {at: 'down', type: '下滑', note: '下滑 whoosh', tail: 0.4, volume: 0.3},
    {at: 'row1', type: '弹出', note: '弹出 blip', volume: 0.25},
    {at: 'row2', type: '弹出', note: '弹出 blip', volume: 0.25},
    {at: 'row3', type: '弹出', note: '弹出 blip', volume: 0.25},
    {at: 'push', type: '运镜', note: '推近 soft whoosh', volume: 0.25},
    {at: 'gather', type: '点击', note: '靠拢 click', volume: 0.3},
  ],
  inputs: {title: {maxChars: 11}, agent: {maxChars: 6}, tasks: {count: 3, maxChars: 10}},
};

export type StrfInputs = {title: string; agent: string; tasks: [string, string, string]; icons: [IconKind, IconKind, IconKind]};
export const STRF_DEFAULT_INPUTS: StrfInputs = {
  title: '并行派出多个子代理', agent: '已派出子代理',
  tasks: ['检查QQ音乐会员用量', '检查爱奇艺会员用量', '检查百度网盘会员用量'], icons: ['qqmusic', 'iqiyi', 'baidupan'],
};
export const checkStrfInputs = (x: StrfInputs) => checkInputs(SPAWN_TREE_ROWS_FOCUS_CONTRACT, {title: x.title, agent: x.agent, tasks: x.tasks});
export const planStrf = (sec: number) => planExtras(SPAWN_TREE_ROWS_FOCUS_CONTRACT, sec);
export const strfFrames = (extras: number[]) => Math.round(outputDuration(SPAWN_TREE_ROWS_FOCUS_CONTRACT, extras) * FPS);
export const SPAWN_TREE_ROWS_FOCUS_DURATION = 138;

const TS = 124; // 标题字号
const RS = 50; // 行字号
const W_REF = 1940; // 原片胶囊宽
// 镜头（屏幕 = 中心 + (世界 + 偏移 − 中心) × 缩放）
const OX = [[42.95, 660], [43.0, 636], [43.5, 50], [44.2, -1000], [44.8, -1704], [45.3, -1964], [45.6, -2026], [46.0, -2056], [46.4, -1920], [46.65, -1894], [47.6, -1894]];
const OY = [[42.95, 0], [43.5, 0], [44.2, -90], [44.8, -360], [45.3, -800], [45.6, -940], [46.0, -970], [46.4, -876], [46.65, -866], [47.6, -866]];
const ZOOM = [[46.0, 1], [46.4, 1.48], [46.65, 1.57], [47.3, 1.57], [47.55, 2.15]];
const VX = 2226; // 竖线的世界 x（原片）
const ROW_Y = [1400, 1598, 1796];
const DOT = [[44.45, 0], [44.75, 0.18], [45.3, 0.55], [45.6, 0.9], [45.9, 1.0]]; // 线头走过的比例

const Ghost: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round">
    <path d="M4 20V11a8 8 0 0 1 16 0v9z" /><path d="M10 10v2.5M14 10v2.5" strokeLinecap="round" />
  </svg>
);

export const SpawnTreeRowsFocusGroup: React.FC<{inputs?: StrfInputs; extras?: number[]}> = ({inputs = STRF_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, SPAWN_TREE_ROWS_FOCUS_CONTRACT, extras);
  const lag = t - s;
  const T = s + T0;
  const drift = 1 + 0.004 * lag;

  // 胶囊宽跟着字数走；右边的东西整体平移 dW
  const chars = [...inputs.title];
  const W = 40 + chars.length * TS + 80;
  const dW = W - W_REF;
  const ox = mk(T, OX) - dW * clamp((T - 43.5) / 0.7);
  const oy = mk(T, OY);
  const z = mk(T, ZOOM) * drift;
  const vx = VX + dW;

  // 线头路径：胶囊右端中点 → 往右 → 圆角 → 往下（世界坐标）
  const bx = W + 50, my = 535;
  const hookEnd = vx - 60;
  const pathLen = (hookEnd - bx) + 94 + 2000;
  const u = mk(T, DOT);
  const L = u * pathLen;
  let dot: [number, number];
  if (L < hookEnd - bx) dot = [bx + L, my];
  else if (L < hookEnd - bx + 94) { const a = (L - (hookEnd - bx)) / 94 * (Math.PI / 2); dot = [hookEnd + 60 * Math.sin(a), my + 60 - 60 * Math.cos(a)]; }
  else dot = [vx, my + 60 + (L - (hookEnd - bx) - 94)];
  const linePath = L <= 0 ? '' : L < hookEnd - bx ? `M ${bx} ${my} L ${dot[0]} ${dot[1]}` : `M ${bx} ${my} L ${hookEnd} ${my} Q ${vx} ${my} ${vx} ${my + 60} L ${dot[0]} ${Math.max(my + 60, dot[1])}`;
  const showDot = T > 44.45 && T < 45.95;

  // 三行
  const rowT = [45.45, 45.55, 45.65];
  const dissolve = T >= 46.42;
  const gather = easeInOut((T - 46.85) / 0.17);
  const rows = inputs.tasks.map((task, i) => {
    const ap = easeOut((T - rowT[i]) / 0.18);
    if (ap <= 0) return null;
    const y = ROW_Y[i];
    const slide = 95 * (1 - ap);
    const rowFade = i > 0 ? 1 - clamp((T - 46.45 - (i - 1) * 0.04) / 0.2) : 1;
    if (rowFade <= 0) return null;
    const agent = [...inputs.agent], tk = [...task];
    const gx0 = vx + 205, lx0 = vx + 775;
    const gx = i === 0 ? mix(gx0, 2762 + dW, gather) : gx0;
    const lx = i === 0 ? mix(lx0, 2876 + dW, gather) : lx0;
    return (
      <div key={i} style={{opacity: ap * rowFade}}>
        <svg style={{position: 'absolute', left: vx - 2, top: y - 120, overflow: 'visible'}} width={10} height={10}>
          <path d={`M 2 0 Q 2 120 60 120 L 150 120`} stroke="#e4e5e7" strokeWidth={2.5} fill="none" opacity={i === 0 ? 1 - gather : 1} />
        </svg>
        <div style={{position: 'absolute', left: gx + slide, top: y - 28}}><Ghost size={56} color="#b5b9bf" /></div>
        <div style={{position: 'absolute', left: vx + 290 + slide, top: y - RS * 0.62, fontSize: RS, lineHeight: `${RS * 1.2}px`, color: '#9c9fa4', whiteSpace: 'pre'}}>
          {agent.map((c, ci) => <span key={ci} style={{opacity: dissolve && i === 0 ? 1 - clamp((T - 46.45 - ci * 0.045) / 0.08) : 1}}>{c}</span>)}
        </div>
        <div style={{position: 'absolute', left: lx + slide, top: y - 28}}><AppIcon kind={inputs.icons[i]} size={56} /></div>
        <div style={{position: 'absolute', left: vx + 860 + slide, top: y - RS * 0.62, fontSize: RS, lineHeight: `${RS * 1.2}px`, color: '#141414', fontWeight: 600, whiteSpace: 'pre'}}>
          {tk.map((c, ci) => <span key={ci} style={{opacity: dissolve && i === 0 ? 1 - clamp((T - 46.45 - (tk.length - 1 - ci) * 0.04) / 0.08) : 1}}>{c}</span>)}
        </div>
      </div>
    );
  });

  const treeFade = 1 - clamp((T - 46.45) / 0.3);
  const world = (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1, height: 1, transformOrigin: '0 0', transform: `translate(960px,540px) scale(${z}) translate(${ox - 960}px,${oy - 540}px)`}}>
      {/* 进场的那根线 */}
      <div style={{position: 'absolute', left: -400, top: my - 1, width: mix(0, 400, clamp((T - 42.95) / 0.1)), height: 2, background: 'linear-gradient(90deg, rgba(225,227,230,0), #e2e4e7)'}} />
      {T < 43.3 && <div style={{position: 'absolute', left: -118, top: my - 8, width: 16, height: 16, borderRadius: 8, background: '#1f86d1', opacity: 1 - clamp((T - 43.15) / 0.12)}} />}
      {/* 胶囊框 + 标题 */}
      <div style={{position: 'absolute', left: 0, top: 410, width: W, height: 250, borderRadius: 60, boxShadow: 'inset 0 0 0 2px #ebecee', opacity: clamp((T - 42.98) / 0.25)}} />
      <div style={{position: 'absolute', left: 40, top: 590 - TS * 0.92, fontSize: TS, fontWeight: 500, lineHeight: `${TS * 1.2}px`, whiteSpace: 'pre'}}>
        {chars.map((c, i) => {
          const a = T - 43.0 - i * (1.0 / chars.length);
          const k = clamp((a - 0.12) / 0.3);
          return <span key={i} style={{color: a < 0 ? 'transparent' : `rgb(${mix(150, 168, k)},${mix(190, 170, k)},${mix(210, 172, k)})`, opacity: clamp(a / 0.1)}}>{c}</span>;
        })}
      </div>
      {/* 花括号 */}
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: clamp((T - 44.05) / 0.25) * treeFade}} width={10} height={10}>
        <path d={`M ${W - 30} 410 Q ${W + 20} 410 ${W + 20} 460 L ${W + 20} ${my - 40} Q ${W + 20} ${my} ${W + 50} ${my} Q ${W + 20} ${my} ${W + 20} ${my + 40} L ${W + 20} 610 Q ${W + 20} 660 ${W - 30} 660`} stroke="#e2e4e7" strokeWidth={2.5} fill="none" />
        {linePath && <path d={linePath} stroke="#e2e4e7" strokeWidth={2.5} fill="none" />}
        {showDot && (
          <>
            <line x1={dot[0]} y1={dot[1] - (dot[0] >= vx - 1 ? 140 : 0)} x2={dot[0] - (dot[0] < vx - 1 ? 140 : 0)} y2={dot[1]} stroke="#7fbde3" strokeWidth={3} opacity={0.7} />
            <circle cx={dot[0]} cy={dot[1]} r={8} fill="#1f86d1" stroke="#fff" strokeWidth={2.5} />
          </>
        )}
      </svg>
      <div style={{opacity: 1}}>{rows}</div>
    </div>
  );

  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden', fontFamily: SANS}}>
      {world}
      <Grain opacity={0.015} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(SPAWN_TREE_ROWS_FOCUS_CONTRACT).length) throw new Error(checkContract(SPAWN_TREE_ROWS_FOCUS_CONTRACT).join('；'));
export const SpawnTreeRowsFocus: React.FC = () => <SpawnTreeRowsFocusGroup />;
