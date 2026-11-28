// 【镜头组】row-status-flip-pan：贴脸看任务表的一行，整条横着滑；滑到最右边时"费用""状态"两格整格换色
//   （推迟 → 已付，待开始 → 进行中）→ 整条快速滑回左边看帮手、跟进人 → 再滑回来，"进行中"变"已完成" → 整个画面往上走（018-F 一拍，功能演示）
// 学的动作（HSAji · Tonomo 29.60–35.40s，30fps 逐帧量过；时间表 （内部拆片记录，未随项目提供））：
//   进来时镜头从 0.853 倍 0.9 秒缓出到 1（以画面中心为准），同时整条接着上一镜的惯性往左滑、减速停住；
//   内容本身没有拖影；下面的滚动条滑块比内容慢半拍，快滑时被拉长（406 → 528）；
//   换色是整格颜色直接过渡（0.2 秒左右），字在过渡中间换掉；最后 0.5 秒整个画面加速往上（最后一帧走 28px）。
// 我们的内容：「小周」任务 #06868（奶奶发起的校车接送），标签、帮手姑姑、跟进人外婆。
//
// 拍表（源秒 = 原片秒 − 29.60，30fps，共 174 帧）
//   拍 1 进来        0.00–0.90   镜头推到 1、整条滑到最右停住
//   拍 2 换色        1.00–1.40   费用 推迟 → 已付（1.00），状态 待开始 → 进行中（1.23）（停留点 1.55）
//   拍 3 滑回左边    1.70–2.60   快滑、带拖影（停留点 3.30）
//   拍 4 滑回右边    4.00–4.90   快滑；4.83 进行中 → 已完成（停留点 5.15）
//   拍 5 往上走      5.27–5.80   整个画面加速往上，接 018-G
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有 1：横滑的是表格这一条（连同外框），上面那排小字、竖线、虚线和下面的滚动条轨道不动，只有滑块跟着走
//   - 独有 2：换色是整格底色过渡，不是在格子里放个小标签
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {Avatar, INK, Icon, KIND, NEW_ROW, SANS} from '../_kit/familyBoard';

const FPS = 30;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const kfl = (t: number, K: number[][]) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], (t - K[i][0]) / (K[i + 1][0] - K[i][0])); return K[K.length - 1][1]; };
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixc = (a: string, b: string, k: number) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], k))).join(',')})`; };

export const ROW_STATUS_FLIP_PAN_CONTRACT: GroupContract = {
  sourceDuration: 174 / 30, // 5.8s
  fps: 30,
  motion: [[0, 1.42], [1.62, 2.62], [3.95, 5.07], [5.22, 174 / 30]],
  holds: [{at: 1.55, maxExtra: 1.5}, {at: 3.3, maxExtra: 1.5}, {at: 5.15, maxExtra: 1.2}],
  landmarks: {enter: 0, pay: 1.0, status: 1.233, back: 1.7, forth: 4.0, done: 4.833, rise: 5.27, exit: 174 / 30},
  sfx: [
    {at: 'pay', type: '轻tick', note: '轻 tick（换色）', volume: 0.3},
    {at: 'status', type: '轻tick', note: '轻 tick（换色）', volume: 0.3},
    {at: 'back', type: '短甩', note: '快速横滑 whoosh', tail: 0.3, volume: 0.35},
    {at: 'forth', type: '短甩', note: '快速横滑 whoosh', tail: 0.3, volume: 0.35},
    {at: 'done', type: '提示音', note: '完成提示音（清脆）', volume: 0.4},
    {at: 'rise', type: '上升', note: '上升 whoosh', tail: 0.3, volume: 0.3},
  ],
  inputs: {stA: {maxChars: 4}, stB: {maxChars: 4}, stC: {maxChars: 4}, payA: {maxChars: 4}, payB: {maxChars: 4}, id: {maxChars: 10}, by: {maxChars: 8}},
};

export type FlipInputs = {stA: string; stB: string; stC: string; payA: string; payB: string; id: string; by: string};
export const FLIP_DEFAULT_INPUTS: FlipInputs = {stA: '待开始', stB: '进行中', stC: '已完成', payA: '推迟', payB: '已付', id: '任务 #06868', by: '发起人 奶奶'};
export const checkFlipInputs = (x: FlipInputs) => checkInputs(ROW_STATUS_FLIP_PAN_CONTRACT, x);
export const planFlip = (sec: number) => planExtras(ROW_STATUS_FLIP_PAN_CONTRACT, sec);
export const flipFrames = (extras: number[]) => Math.round(outputDuration(ROW_STATUS_FLIP_PAN_CONTRACT, extras) * FPS);
export const ROW_STATUS_FLIP_PAN_DURATION = 174;

// 这一条"帮手"列左沿的屏幕 x（镜头放大到 1 时；逐帧互相关量的，内容本身没有拖影）
const STRIP = [[0, 129], [0.033, -35], [0.067, -173], [0.1, -289], [0.133, -386], [0.167, -468], [0.2, -537], [0.233, -595], [0.267, -643], [0.3, -684], [0.333, -718], [0.367, -746], [0.4, -769], [0.433, -788], [0.467, -804], [0.5, -817], [0.533, -827], [0.567, -835], [0.6, -842], [0.633, -847], [0.667, -851], [0.7, -854], [0.733, -856], [0.767, -857], [0.8, -858], [0.833, -859],
  [1.6, -859], [1.633, -853], [1.667, -843], [1.7, -829], [1.733, -810], [1.767, -783], [1.8, -745], [1.833, -691], [1.867, -607], [1.9, -458], [1.933, -201], [1.967, -3], [2.0, 112], [2.033, 189], [2.067, 246], [2.1, 289], [2.133, 323], [2.167, 351], [2.2, 374], [2.233, 393], [2.267, 408], [2.3, 420], [2.333, 430], [2.367, 438], [2.4, 444], [2.433, 448], [2.467, 451], [2.5, 453],
  [3.967, 453], [4.0, 447], [4.033, 437], [4.067, 423], [4.1, 404], [4.133, 377], [4.167, 339], [4.2, 285], [4.233, 201], [4.267, 52], [4.3, -205], [4.333, -403], [4.367, -518], [4.4, -595], [4.433, -652], [4.467, -695], [4.5, -730], [4.533, -758], [4.567, -781], [4.6, -800], [4.633, -815], [4.667, -827], [4.7, -837], [4.733, -845], [4.767, -851], [4.8, -855], [4.833, -858], [4.867, -859]];
// 滚动条滑块：左沿 + 宽度（滑块比内容慢半拍，快滑时会被拉长到 528）
const TL = [[0, 782], [0.033, 813], [0.067, 848], [0.1, 881], [0.133, 914], [0.167, 947], [0.233, 1010], [0.267, 1041], [0.3, 1068], [0.333, 1095], [0.367, 1121], [0.4, 1143], [0.433, 1163], [0.467, 1183], [0.5, 1201], [0.567, 1231], [0.6, 1244], [0.633, 1256], [0.667, 1265], [0.7, 1273], [0.733, 1280], [0.767, 1286], [0.8, 1291], [0.833, 1294], [0.867, 1296], [0.9, 1298],
  [1.6, 1298], [1.633, 1296], [1.667, 1294], [1.7, 1290], [1.733, 1283], [1.767, 1274], [1.8, 1260], [1.833, 1240], [1.867, 1208], [1.9, 1149], [1.933, 1047], [1.967, 967], [2.0, 921], [2.033, 889], [2.067, 866], [2.1, 849], [2.133, 835], [2.167, 823], [2.2, 814], [2.233, 807], [2.267, 800], [2.3, 796], [2.333, 791], [2.367, 788], [2.4, 786], [2.433, 784], [2.467, 783], [2.5, 782],
  [4.0, 782], [4.067, 785], [4.1, 788], [4.133, 794], [4.167, 803], [4.2, 816], [4.233, 834], [4.267, 862], [4.3, 912], [4.333, 1005], [4.367, 1096], [4.4, 1149], [4.433, 1183], [4.467, 1208], [4.5, 1227], [4.533, 1242], [4.567, 1254], [4.6, 1263], [4.633, 1271], [4.667, 1278], [4.7, 1283], [4.733, 1287], [4.767, 1290], [4.8, 1293], [4.833, 1295], [4.867, 1297], [4.9, 1298]];
const TW = [[1.6, 406], [1.633, 409], [1.7, 411], [1.733, 415], [1.767, 418], [1.8, 423], [1.833, 431], [1.867, 444], [1.9, 475], [1.933, 528], [1.967, 514], [2.0, 469], [2.033, 448], [2.067, 437], [2.1, 429], [2.133, 424], [2.2, 419], [2.267, 415], [2.333, 412], [2.4, 409], [2.5, 407], [2.533, 406],
  [3.967, 406], [4.0, 408], [4.033, 410], [4.067, 412], [4.1, 415], [4.133, 419], [4.167, 423], [4.2, 431], [4.233, 445], [4.267, 475], [4.3, 527], [4.333, 514], [4.367, 469], [4.4, 448], [4.433, 437], [4.467, 429], [4.5, 424], [4.567, 418], [4.633, 415], [4.7, 412], [4.767, 411], [4.833, 409], [4.9, 406]];
// 镜头放大（以 (960,543) 为中心）
const ZOOM = [[0, 0.853], [0.033, 0.873], [0.067, 0.89], [0.1, 0.907], [0.133, 0.923], [0.167, 0.936], [0.233, 0.958], [0.267, 0.968], [0.3, 0.974], [0.333, 0.98], [0.367, 0.985], [0.4, 0.988], [0.433, 0.992], [0.5, 0.995], [0.567, 0.999], [0.7, 1]];
// 最后整个画面往上
const RISE = [[5.267, 0], [5.333, -1], [5.4, -2], [5.433, -4], [5.467, -6], [5.5, -9], [5.533, -12], [5.567, -17], [5.6, -24], [5.633, -34], [5.667, -48], [5.7, -65], [5.733, -87], [5.767, -115], [5.8, -145]];

// 这一条的列（u：帮手列左沿 = 0）
const COLW = {due: 470, kind: 470, helper: 525, lead: 525, tags: 633, status: 477, pay: 472};
const U = {due: -940, kind: -470, helper: 0, lead: 525, tags: 1050, status: 1683, pay: 2160, end: 2632};
const TOP = 296, HEAD = 159, ROWH = 330; // 表头 296–455，行 455–785
const C = {head: '#f5f5f5', line: '#e3e3e3', gray: '#ededed', purple: '#4c42db', green: '#25daa3', orange: '#f3a947'};
const CHIP: Record<string, {bg: string; fg: string}> = {
  重点关注: {bg: '#d00a64', fg: '#fff'}, 每周一次: {bg: '#fdf4bf', fg: '#b4470e'}, 已提醒: {bg: '#26dba4', fg: '#183a2f'},
  加急: {bg: '#fde4ee', fg: '#b3121f'}, 外婆: {bg: '#4137c3', fg: '#fff'},
};

const Chip: React.FC<{t: string; fs?: number}> = ({t, fs = 38}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', height: 72, padding: '0 14px', gap: 18, borderRadius: 5, background: CHIP[t].bg, color: CHIP[t].fg, fontSize: fs, fontWeight: 700, whiteSpace: 'nowrap', boxShadow: CHIP[t].bg.startsWith('#fd') ? 'inset 0 0 0 1.5px rgba(0,0,0,0.04)' : undefined}}>
    {t}<span style={{fontWeight: 400, fontSize: fs * 0.95}}>×</span>
  </div>
);

export const RowStatusFlipPanGroup: React.FC<{inputs?: FlipInputs; extras?: number[]}> = ({inputs = FLIP_DEFAULT_INPUTS, extras = [0, 0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, ROW_STATUS_FLIP_PAN_CONTRACT, extras);
  const lag = t - s;
  const z = kfl(s, ZOOM) * (1 + 0.004 * lag);
  const dy = kfl(s, RISE);
  const th = kfl(s, TL), tw = kfl(s, TW);
  const shift = kfl(s, STRIP); // 帮手列左沿的屏幕 x
  const X = (u: number) => shift + u;

  // 换色
  const payK = clamp((s - 1.0) / 0.2);
  const payBg = mixc(C.orange, C.green, payK);
  const payTxt = s < 1.1 ? inputs.payA : inputs.payB;
  const stK1 = clamp((s - 1.233) / 0.167), stK2 = clamp((s - 4.833) / 0.167);
  const stBg = s < 4.8 ? mixc(C.gray, C.purple, stK1) : mixc(C.purple, C.green, stK2);
  const stTxt = s < 1.3 ? inputs.stA : s < 4.9 ? inputs.stB : inputs.stC;
  const stCol = s < 1.3 ? INK : '#fff';
  const swapOp = (a: number) => 1 - 0.6 * Math.sin(Math.PI * clamp((s - a + 0.05) / 0.1)); // 换字那一下轻闪

  const headCell = (u: number, w: number, icon: string, title: string) => (
    <div key={title} style={{position: 'absolute', left: u, top: 0, width: w, height: HEAD, borderRight: `2px solid ${C.line}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', paddingLeft: 40, gap: 26}}>
      <Icon k={icon} s={42} />
      <span style={{fontSize: 37, fontWeight: 700, color: INK}}>{title}</span>
    </div>
  );
  const bodyCell = (u: number, w: number, child: React.ReactNode, bg = '#fff', key = '') => (
    <div key={key + u} style={{position: 'absolute', left: u, top: HEAD, width: w, height: ROWH, background: bg, borderRight: `2px solid ${C.line}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center'}}>{child}</div>
  );
  const person = (name: string, i: number) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 22, paddingLeft: 40}}>
      <div style={{position: 'relative'}}>
        <Avatar name={name} size={110} i={i} photo />
        <div style={{position: 'absolute', left: 79, top: 72, width: 38, height: 38, borderRadius: 19, background: '#2bd99f', boxShadow: '0 0 0 4px #fff'}} />
      </div>
      <span style={{fontSize: 42, color: INK}}>{name}</span>
    </div>
  );

  const W = U.end - U.due;
  const strip = (
    <div style={{position: 'absolute', left: X(U.due), top: TOP - 24, width: W + 24, height: HEAD + ROWH + 48}}>
      {/* 玻璃外框（右端圆角） */}
      <div style={{position: 'absolute', left: -60, top: 0, right: 0, bottom: 0, borderRadius: '0 52px 52px 0', background: 'rgba(214,232,252,0.55)', boxShadow: 'inset 0 0 0 2.5px rgba(255,255,255,0.85), 0 24px 50px rgba(10,60,150,0.16)'}} />
      <div style={{position: 'absolute', left: 0, top: 24, width: W, height: HEAD + ROWH, borderRadius: '0 30px 30px 0', overflow: 'hidden', background: '#fff'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: HEAD, background: C.head, borderBottom: `2px solid ${C.line}`, boxSizing: 'border-box'}} />
        {[[U.due, COLW.due, 'cal', '截止'], [U.kind, COLW.kind, 'bag', '类别'], [U.helper, COLW.helper, 'card', '帮手'], [U.lead, COLW.lead, 'card', '跟进人'], [U.tags, COLW.tags, 'tag', '标签'], [U.status, COLW.status, 'trend', '状态'], [U.pay, COLW.pay, 'money', '费用']].map(([u, w, ic, ti]) => headCell((u as number) - U.due, w as number, ic as string, ti as string))}
        {bodyCell(U.due - U.due, COLW.due, <div style={{display: 'flex', alignItems: 'center', gap: 18, paddingLeft: 40, fontSize: 40, color: INK}}><Icon k="cal" s={40} />{NEW_ROW.due}</div>)}
        {bodyCell(U.kind - U.due, COLW.kind, (
          <div style={{display: 'flex', flexDirection: 'column', gap: 22, paddingLeft: 40}}>
            {NEW_ROW.kinds.map((k) => (
              <div key={k} style={{display: 'inline-flex', alignItems: 'center', gap: 12, alignSelf: 'flex-start', height: 58, padding: '0 14px', borderRadius: 7, background: KIND[k].bg, color: KIND[k].fg, fontSize: 36, fontWeight: 500}}>
                <span style={{width: 28, height: 28, borderRadius: 6, border: `3px solid ${KIND[k].fg}`, boxSizing: 'border-box'}} />{k}
              </div>
            ))}
          </div>
        ))}
        {bodyCell(U.helper - U.due, COLW.helper, person(NEW_ROW.helper, 5))}
        {bodyCell(U.lead - U.due, COLW.lead, person(NEW_ROW.lead, 2))}
        {bodyCell(U.tags - U.due, COLW.tags, (
          <div style={{display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 36}}>
            <div style={{display: 'flex', gap: 13}}><Chip t="重点关注" /></div>
            <div style={{display: 'flex', gap: 13}}><Chip t="每周一次" /><Chip t="已提醒" /></div>
            <div style={{display: 'flex', gap: 13}}><Chip t="加急" /><Chip t="外婆" /></div>
          </div>
        ))}
        {bodyCell(U.status - U.due, COLW.status, <div style={{width: '100%', textAlign: 'center', fontSize: 41, fontWeight: 700, color: stCol, opacity: swapOp(1.3) * swapOp(4.9)}}>{stTxt}</div>, stBg, 's')}
        {bodyCell(U.pay - U.due, COLW.pay, <div style={{width: '100%', textAlign: 'center', fontSize: 41, fontWeight: 700, color: '#fff', opacity: swapOp(1.1)}}>{payTxt}</div>, payBg, 'p')}
      </div>
    </div>
  );

  const dim = 'rgba(255,255,255,0.62)';
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      {/* 背景（照原片 30.6s 取色）：上面左蓝右白，下面中间蓝、两边亮 */}
      <AbsoluteFill style={{background: 'linear-gradient(97deg, #0776e8 0%, #1680ec 14%, #2b8aeb 26%, #4699ef 40%, #6db0f3 52%, #a6cffa 66%, #bddbfb 80%, #c5dffe 100%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, #95c4f5 0%, #5aa2ec 13%, #2a86e5 26%, #207fe2 40%, #2682e0 55%, #4a93e0 68%, #6aa5e4 82%, #8fbdee 100%)', WebkitMaskImage: 'linear-gradient(180deg, transparent 0px, transparent 640px, #000 860px)', maskImage: 'linear-gradient(180deg, transparent 0px, transparent 640px, #000 860px)'}} />
      <AbsoluteFill style={{transform: `translateY(${dy}px) scale(${z})`, transformOrigin: '960px 543px'}}>
        {/* 上面那排：图标、竖线、虚线、小字、右边的用户 */}
        <div style={{position: 'absolute', left: 159, top: -400, width: 1.5, height: 1900, background: 'rgba(255,255,255,0.45)'}} />
        <div style={{position: 'absolute', left: 90, top: 174, opacity: 0.62}}><Icon k="list" s={30} c="#fff" /></div>
        <div style={{position: 'absolute', left: 159, top: 221, width: 1800, height: 2, backgroundImage: `repeating-linear-gradient(90deg, ${dim} 0 14px, transparent 14px 25px)`}} />
        <div style={{position: 'absolute', left: 194, top: 175, fontSize: 18, color: dim, whiteSpace: 'nowrap'}}>{inputs.id}</div>
        <div style={{position: 'absolute', left: 352, top: 175, fontSize: 18, color: dim, whiteSpace: 'nowrap'}}>{inputs.by}</div>
        <div style={{position: 'absolute', left: 1622, top: 172, display: 'flex', alignItems: 'center', gap: 12, opacity: 0.4}}>
          <Avatar name="妈妈" size={28} i={0} /><span style={{fontSize: 18, color: '#fff'}}>妈妈 ⌄</span>
        </div>
        {strip}
        {/* 滚动条 */}
        <div style={{position: 'absolute', left: 204, top: 861, width: 1512, height: 25, borderRadius: 13, background: 'rgba(255,255,255,0.56)', boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.5)'}} />
        <div style={{position: 'absolute', left: th, top: 870, width: tw, height: 6, borderRadius: 3, background: '#fff'}} />
      </AbsoluteFill>
      <Grain opacity={0.03} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(ROW_STATUS_FLIP_PAN_CONTRACT).length) throw new Error(checkContract(ROW_STATUS_FLIP_PAN_CONTRACT).join('；'));
export const RowStatusFlipPan: React.FC = () => <RowStatusFlipPanGroup />;
