// 【镜头组】stop-chat-drag-trash：「然后」居中 → 往左一甩，右边滑进一块黑色对话框，逐词打出「一到关键时刻，它们就停了」→
//   字退掉、对话框收成一条输入栏，右上冒出用户的一句问话，左边一条条弹出拒绝回复，越堆越高 → 整块往上让，下面升起程序坞 →
//   手套光标把 AI 图标从坞里拖出来：对话框缩成一根细条挂在图标后面，几条回复像一串尾巴跟着甩过去，一起被吸进垃圾桶（040-C 一拍，痛点 → 扔掉）
// 学的动作（SkaleSolutions · Aside 10.10–17.95s，29.97fps；网格大图逐点量过，时间表 （内部拆片记录，未随项目提供））：
//   11.3–11.75 字往左甩 −630、对话框从右边滑进到 592；12.5–12.8 再往左让（字出画，框 516 → 390 → 364）；
//   12.95–13.75 框的上沿 480 → 650 → 824，变成输入栏；14.25 起每 0.25s 弹一条回复；15.2–15.8 整块上移 250，程序坞 15.3 升起；
//   16.25 按住 AI 图标，16.55 拖起；框收成细条挂在图标后面；16.85 起回复按「最下面那条打头」排成一串，沿弧线甩到右边、竖着钻进垃圾桶（17.75 吸完）。
// 我们的内容：AI 工具一到要它干实事就推三阻四，干脆把它拖进垃圾桶（图标都是自己画的通用图形）。
//
// 拍表（源秒 = 原片秒 − 10.10，30fps，共 236 帧）
//   拍 1 然后 + 对话框打字        0.00–2.15   （停留点 2.20）
//   拍 2 收成输入栏 + 一串拒绝    2.25–5.00   （停留点 5.05）
//   拍 3 程序坞 + 拖进垃圾桶      5.10–7.75   （停留点 7.80）
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有 1：回复被吸走时是一条"尾巴"——最下面那条打头、沿同一条弧线一条跟一条，转角跟着弧线切线走
//   - 独有 2：拖走图标后，坞里那一格合拢、整条坞变窄居中
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {AppIcon, BG, Hand, IconKind, SANS, Trash, clamp, easeInOut, easeOut, mix, mk, mkv} from '../_kit/darkUiKit';

const FPS = 30;
const T0 = 10.1;

export const STOP_CHAT_DRAG_TRASH_CONTRACT: GroupContract = {
  sourceDuration: 7.85,
  fps: 30,
  motion: [[0, 2.15], [2.25, 5.0], [5.1, 7.75]],
  holds: [{at: 2.2, maxExtra: 1.0}, {at: 5.05, maxExtra: 1.0}, {at: 7.8, maxExtra: 1.0}],
  landmarks: {word: 0.2, swing: 1.2, type: 1.52, shrink: 2.85, ask: 3.55, reply1: 4.15, reply2: 4.4, reply3: 4.65, reply4: 4.9, dock: 5.4, grab: 6.15, lift: 6.45, suck: 6.75, drop: 7.2, gone: 7.65},
  sfx: [
    {at: 'word', type: '轻tick', note: '字出现 soft tick', volume: 0.25},
    {at: 'swing', type: '短甩', note: '横甩 whoosh', tail: 0.4, volume: 0.35},
    {at: 'type', type: '键盘', note: '键盘敲字（4 下）', tail: 0.5, volume: 0.35},
    {at: 'shrink', type: '短甩', note: '收起 soft swish', volume: 0.25},
    {at: 'reply1', type: '弹出', note: '消息弹出 blip', volume: 0.3},
    {at: 'reply2', type: '弹出', note: '消息弹出 blip', volume: 0.3},
    {at: 'reply3', type: '弹出', note: '消息弹出 blip', volume: 0.3},
    {at: 'reply4', type: '弹出', note: '消息弹出 blip', volume: 0.3},
    {at: 'dock', type: '上升', note: '升起 whoosh', volume: 0.3},
    {at: 'grab', type: '点击', note: '按住 click', volume: 0.35},
    {at: 'suck', type: '吸入', note: '一串 swoosh（吸走）', tail: 0.8, volume: 0.45},
    {at: 'drop', type: '落下', note: '丢进垃圾桶 clunk', volume: 0.45},
  ],
  inputs: {lead: {maxChars: 2}, line1: {maxChars: 7}, line2: {maxChars: 6}, placeholder: {maxChars: 6}, ask: {maxChars: 8}, replies: {count: 4, maxChars: 8}},
};

export type ScdtInputs = {
  lead: string; line1: [string, string]; line2: [string, string];
  placeholder: string; ask: string; replies: [string, string, string, string];
  dockIcons: [IconKind, IconKind, IconKind, IconKind]; // 第 3 个是被拖走的那个
};
export const SCDT_DEFAULT_INPUTS: ScdtInputs = {
  lead: '然后', line1: ['一到', '关键时刻，'], line2: ['它们', '就停了'],
  placeholder: '问 AI…', ask: '为什么停下了？',
  replies: ['这个我做不了', '请先批准操作', '我没法登录网站', '敏感操作做不了'],
  dockIcons: ['brand', 'qqbrowser', 'yuanbao', 'qqmail'],
};
export const checkScdtInputs = (x: ScdtInputs) => checkInputs(STOP_CHAT_DRAG_TRASH_CONTRACT, {lead: x.lead, line1: x.line1.join(''), line2: x.line2.join(''), placeholder: x.placeholder, ask: x.ask, replies: x.replies});
export const planScdt = (sec: number) => planExtras(STOP_CHAT_DRAG_TRASH_CONTRACT, sec);
export const scdtFrames = (extras: number[]) => Math.round(outputDuration(STOP_CHAT_DRAG_TRASH_CONTRACT, extras) * FPS);
export const STOP_CHAT_DRAG_TRASH_DURATION = 236;

// ── 量出来的（原片秒，屏幕坐标）──
const LEAD_R = [[11.25, 1096], [11.45, 956], [11.6, 640], [11.75, 500], [12.1, 462], [12.5, 426], [12.65, 270], [12.8, -90]]; // 「然后，」右沿
const PANEL_L = [[11.1, 1960], [11.3, 1900], [11.45, 1576], [11.55, 1050], [11.65, 760], [11.75, 592], [12.1, 528], [12.5, 516], [12.65, 450], [12.8, 390], [13.2, 364]];
const PANEL_TOP = [[12.95, 480], [13.2, 494], [13.45, 650], [13.75, 824], [14.3, 834]];
const SHIFT = [[15.2, 0], [15.4, -180], [15.8, -250], [16.4, -250]]; // 给程序坞让位
const DOCK_W = [[16.45, 1090], [16.75, 840]];
const SLOTS0 = [520, 724, 933, 1138, 1380]; // 坞里 4 个图标 + 垃圾桶的中心 x（拖走前）
const SLOTS1 = [657, 851, 0, 1046, 1275]; // 拖走之后
const ICON_PATH = [[16.3, 933, 915, 0, 1], [16.55, 930, 868, -5, 1.05], [16.8, 1132, 625, 6, 1.08], [17.1, 1277, 765, 0, 1.0], [17.3, 1275, 905, 0, 0.55]];
const BAR_PATH = [[16.62, 960, 677, 0], [16.8, 925, 695, -8], [17.1, 1200, 590, 35], [17.35, 1262, 712, 72], [17.5, 1272, 860, 88]]; // 收成细条后的中心、角度
const HAND = [[15.55, 650, 1010], [15.7, 585, 905], [15.85, 600, 925], [16.1, 930, 975], [16.25, 950, 968]];
const CHAIN = [[560, 250], [860, 175], [1050, 230], [1230, 470], [1290, 700], [1285, 880]]; // 回复被吸走走的弧线

const chainAt = (u: number): [number, number, number] => {
  const seg: number[] = [0];
  for (let i = 1; i < CHAIN.length; i++) seg.push(seg[i - 1] + Math.hypot(CHAIN[i][0] - CHAIN[i - 1][0], CHAIN[i][1] - CHAIN[i - 1][1]));
  const L = seg[seg.length - 1] * clamp(u);
  let i = 1; while (i < seg.length - 1 && seg[i] < L) i++;
  const k = (L - seg[i - 1]) / (seg[i] - seg[i - 1]);
  const x = mix(CHAIN[i - 1][0], CHAIN[i][0], k), y = mix(CHAIN[i - 1][1], CHAIN[i][1], k);
  // 切线角：前后各取一点，转角处顺滑
  const a0 = Math.atan2(CHAIN[i][1] - CHAIN[i - 1][1], CHAIN[i][0] - CHAIN[i - 1][0]);
  const j = Math.min(CHAIN.length - 1, i + 1);
  const a1 = j > i ? Math.atan2(CHAIN[j][1] - CHAIN[i][1], CHAIN[j][0] - CHAIN[i][0]) : a0;
  return [x, y, (mix(a0, a1, Math.max(0, k - 0.5) * 2 * 0.5) * 180) / Math.PI];
};

export const StopChatDragTrashGroup: React.FC<{inputs?: ScdtInputs; extras?: number[]}> = ({inputs = SCDT_DEFAULT_INPUTS, extras = [0, 0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, STOP_CHAT_DRAG_TRASH_CONTRACT, extras);
  const lag = t - s;
  const T = s + T0; // 原片秒
  const cam = 1 + 0.004 * lag;

  // ── 「然后，」──
  const leadW = [...inputs.lead].length * 130;
  const comma = T >= 11.68;
  const leadRight = T < 11.25 ? 960 + leadW / 2 : mk(T, LEAD_R) + (comma ? 0 : -50);
  const leadOp = clamp((T - 10.28) / 0.1);
  const lead = T < 12.85 && (
    <div style={{position: 'absolute', left: leadRight - leadW - (comma ? 130 : 0), top: 590 - 130 * 0.92, fontSize: 130, fontWeight: 600, lineHeight: '156px', color: '#f4f4f4', opacity: leadOp, filter: leadOp < 1 ? `blur(${6 * (1 - leadOp)}px)` : undefined, whiteSpace: 'pre'}}>
      {inputs.lead}{comma ? '，' : ''}
    </div>
  );

  // ── 对话框 / 输入栏 ──
  const shift = mk(T, SHIFT);
  const pl = mk(T, PANEL_L);
  const pw = 1192;
  const top0 = T < 12.95 ? 480 : mk(T, PANEL_TOP);
  const bottom = 1020 + shift;
  const top = top0 + shift;
  const collapse = clamp((T - 16.62) / 0.18); // 收成细条
  const panelOn = T >= 11.1 && T < 17.48;

  // 打字：四段，新段淡紫 → 白
  const chunkTimes = [11.62, 11.75, 11.9, 12.05];
  const chunks = [inputs.line1[0], inputs.line1[1], inputs.line2[0], inputs.line2[1]];
  const chunkEl = (i: number) => {
    const u = T - chunkTimes[i];
    if (u < 0) return null;
    const k = clamp((u - 0.08) / 0.25);
    return <span key={i} style={{color: `rgb(${mix(203, 246, k)},${mix(194, 246, k)},${mix(238, 246, k)})`}}>{chunks[i]}</span>;
  };
  const l1Fade = 1 - clamp((T - 12.98) / 0.15), l2Fade = 1 - clamp((T - 13.15) / 0.15);
  const typed = T < 13.32 && (
    <>
      <div style={{position: 'absolute', left: pl + 72, top: 620 - 120 * 0.92, fontSize: 120, fontWeight: 600, lineHeight: '144px', whiteSpace: 'pre', opacity: l1Fade}}>{chunkEl(0)}{chunkEl(1)}</div>
      <div style={{position: 'absolute', left: pl + 72, top: 760 - 120 * 0.92, fontSize: 120, fontWeight: 600, lineHeight: '144px', whiteSpace: 'pre', opacity: l2Fade}}>{chunkEl(2)}{chunkEl(3)}</div>
    </>
  );
  // 占位字 13.38 起逐字打出
  const ph = [...inputs.placeholder];
  const phN = Math.floor(clamp((T - 13.38) / 0.3) * ph.length + (T >= 13.38 ? 1 : 0));

  let panel: React.ReactNode = null;
  if (panelOn) {
    if (collapse <= 0) {
      panel = (
        <div style={{position: 'absolute', left: pl, top, width: pw, height: bottom - top, borderRadius: 32, background: '#1b1b1c', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.45)'}}>
          {T >= 13.38 && <div style={{position: 'absolute', left: 32, bottom: 96, fontSize: 46, color: '#8e8e8e', whiteSpace: 'pre'}}>{ph.slice(0, phN).join('')}</div>}
          <div style={{position: 'absolute', left: 22, bottom: 22, width: 32, height: 32, borderRadius: 16, background: '#2c2c2d', color: '#bbb', fontSize: 22, lineHeight: '32px', textAlign: 'center'}}>+</div>
          <div style={{position: 'absolute', right: 22, bottom: 22, width: 32, height: 32, borderRadius: 16, background: '#2c2c2d', color: '#ddd', fontSize: 20, lineHeight: '32px', textAlign: 'center'}}>↑</div>
        </div>
      );
    } else {
      // 收成细条，挂在图标后面
      const [bx, by, br] = mkv(T, BAR_PATH);
      const w = mix(pw, 230, easeOut(collapse)), h = mix(bottom - top, 46, easeOut(collapse));
      const cx = mix(pl + pw / 2, bx, easeOut(collapse)), cy = mix((top + bottom) / 2, by, easeOut(collapse));
      const into = clamp((T - 17.35) / 0.13);
      panel = (
        <div style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: mix(32, 12, collapse), background: '#1b1b1c', transform: `rotate(${br}deg) scale(${1 - 0.5 * into})`, opacity: 1 - into, boxShadow: '0 10px 30px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06)'}}>
          <div style={{position: 'absolute', left: 12, top: 8, fontSize: 14, color: '#8e8e8e', opacity: 1 - collapse * 0.3}}>{inputs.placeholder}</div>
        </div>
      );
    }
  }

  // ── 问话 + 回复 ──
  const replyT = [14.25, 14.5, 14.75, 15.0];
  const nShown = replyT.filter((x) => T >= x).length;
  // 堆叠：最新一条的下沿离输入栏上沿 48，往上每条 88
  const stackShift = replyT.reduce((acc, x, i) => acc + (i > 0 ? 88 * easeOut((T - x) / 0.15) : 0), 0);
  const baseBottom = top - 48; // 第 1 条的下沿（还没有后面几条时）
  const bubbleY = (i: number) => baseBottom - 76 - stackShift + i * 88; // 第 i 条的上沿
  const askBase = nShown === 0 ? top - 50 : mix(top - 50, bubbleY(0) - 56, easeOut((T - replyT[0]) / 0.15));
  const askOp = clamp((T - 13.62) / 0.12) * (1 - clamp((T - 15.9) / 0.15));
  const ask = T >= 13.62 && T < 16.1 && (
    <div style={{position: 'absolute', left: pl, width: pw, top: askBase - 46 + 8 * (1 - clamp((T - 13.62) / 0.12)), fontSize: 48, lineHeight: '58px', color: '#9b9b9b', textAlign: 'right', opacity: askOp, whiteSpace: 'pre'}}>{inputs.ask}</div>
  );
  const bubbles = inputs.replies.map((txt, i) => {
    if (T < replyT[i]) return null;
    const app = easeOut((T - replyT[i]) / 0.12);
    let x = pl + 10, y = bubbleY(i) + 20 * (1 - app), rot = 0, sc = 1, op = app;
    // 被吸走：最下面那条打头
    const order = 3 - i;
    const w = easeInOut((T - 16.6 - order * 0.05) / 0.35);
    const u = clamp((T - 16.85 - order * 0.075) / 0.72);
    if (w > 0) {
      const [cx, cy, ca] = chainAt(u);
      const tilt = (order === 0 ? -8 : -3 + order) * clamp((T - 16.55) / 0.25);
      x = mix(x, cx - 140, w); y = mix(y, cy - 38, w); rot = mix(tilt, ca, clamp(u * 3)) ;
      sc = u > 0.85 ? 1 - (u - 0.85) / 0.15 * 0.6 : 1;
      op = u > 0.9 ? 1 - (u - 0.9) / 0.1 : 1;
    }
    if (u >= 1) return null;
    return (
      <div key={i} style={{position: 'absolute', left: x, top: y, height: 76, padding: '0 22px', borderRadius: 12, background: 'rgba(66,66,68,0.92)', color: '#ececec', fontSize: 44, lineHeight: '76px', whiteSpace: 'pre', opacity: op, transform: `rotate(${rot}deg) scale(${sc})`, transformOrigin: '30% 50%', boxShadow: '0 6px 18px rgba(0,0,0,0.3)'}}>{txt}</div>
    );
  });

  // ── 程序坞 ──
  let dock: React.ReactNode = null;
  const dragging = T >= 16.3;
  if (T >= 15.5) {
    const app = easeOut((T - 15.5) / 0.25);
    const dw = mk(T, DOCK_W);
    const close = easeInOut((T - 16.45) / 0.3);
    const slots = SLOTS0.map((x0, i) => mix(x0, SLOTS1[i] || x0, close));
    const hand = T < 16.3 ? mkv(T, HAND) : null;
    const mag = (cx: number, i: number) => (hand && !dragging ? 1 + (i === 2 && T > 16.18 ? 0.04 : 0.17 * Math.exp(-Math.pow((hand[0] - cx) / 120, 2))) : 1);
    const dy = 100 * (1 - app);
    dock = (
      <>
        <div style={{position: 'absolute', left: 960 - dw / 2, top: 810 + dy, width: dw, height: 210, borderRadius: 58, background: 'rgba(40,40,42,0.85)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.08), 0 16px 50px rgba(0,0,0,0.4)', opacity: app}} />
        <div style={{position: 'absolute', left: mix(1264, 1178, close) - 1, top: 850 + dy, width: 2, height: 130, background: 'rgba(255,255,255,0.12)', opacity: app}} />
        {inputs.dockIcons.map((k, i) => {
          if (i === 2 && dragging) return null;
          const m = mag(slots[i], i);
          const sz = 164 * m;
          return <div key={i} style={{position: 'absolute', left: slots[i] - sz / 2, top: 915 + dy - sz / 2 - (m - 1) * 70, opacity: app}}><AppIcon kind={k} size={sz} /></div>;
        })}
        <div style={{position: 'absolute', left: slots[4] - 66, top: 852 + dy + (T > 17.3 && T < 17.5 ? 6 * Math.sin((T - 17.3) * 40) * (1 - (T - 17.3) / 0.2) : 0), opacity: app}}>
          <Trash w={132}>
            <div style={{position: 'absolute', left: 30, top: -6, width: 50, height: 40, borderRadius: 10, background: '#dfe6f2', transform: 'rotate(-12deg)'}} />
            <div style={{position: 'absolute', left: 62, top: -2, width: 46, height: 36, borderRadius: 10, background: '#e0715a', transform: 'rotate(14deg)'}} />
            {T > 17.3 && <div style={{position: 'absolute', left: 40, top: -14, width: 54, height: 48, borderRadius: 12, background: '#fff', transform: 'rotate(4deg)'}} />}
          </Trash>
        </div>
        {hand && <Hand x={hand[0]} y={hand[1]} h={150} opacity={clamp((T - 15.55) / 0.1)} press={T > 16.22 ? 1 : 0} />}
      </>
    );
  }
  // 被拖走的图标 + 手
  let drag: React.ReactNode = null;
  if (dragging && T < 17.42) {
    const [x, y, r, sc] = mkv(T, ICON_PATH);
    const sz = 164 * sc;
    const into = clamp((T - 17.22) / 0.2);
    drag = (
      <>
        <div style={{position: 'absolute', left: x - sz / 2, top: y - sz / 2, transform: `rotate(${r}deg)`, opacity: 1 - into, filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.45))'}}><AppIcon kind={inputs.dockIcons[2]} size={sz} /></div>
      </>
    );
  }
  const handDrag = dragging ? (() => { const [x, y] = mkv(Math.min(T, 17.3), ICON_PATH); return <Hand x={x + 25} y={y + 45} h={150} press={T < 17.28 ? 1 : 0} />; })() : null;

  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: '960px 540px'}}>
        {lead}
        {ask}
        {bubbles}
        {panel}
        {typed}
        {dock}
        {drag}
        {handDrag}
      </div>
      <Grain opacity={0.025} />
    </AbsoluteFill>
  );
};

if (checkContract(STOP_CHAT_DRAG_TRASH_CONTRACT).length) throw new Error(checkContract(STOP_CHAT_DRAG_TRASH_CONTRACT).join('；'));
export const StopChatDragTrash: React.FC = () => <StopChatDragTrashGroup />;
