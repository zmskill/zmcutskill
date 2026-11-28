// 【镜头组】toggle-autopilot-cards：一颗超大开关在白底上浮出，"啪"地打开变绿；四周十几张助手卡片从画外飞进来围住它，
//   开关一边缩小一边往右让，露出后面的大字"自动安排"；卡片慢慢往外漂，最后整团一起缩远（034-D 一拍）
// 学的动作（ana_momin · Pond AI 19.67–23.10s，30fps 逐帧看过；时间表 （内部拆片记录，未随项目提供））：
//   白底；开关从浅灰、略小浮出，长到 720×348（关着）；圆钮滑到右边、底色同时变绿，外面一圈绿光；
//   卡片从四周画外沿径向飞进来（错开，长尾巴落位），远近不同、大小不同；开关缩到 165×78、移到大字右边，大字本来就在那，被开关挡着，开关让开才露出来；
//   落定后整团卡片绕着大字顺时针转（椭圆轨道，约 20°/秒，卡片本身不转、一直正着），每张还各自轻轻浮；最后整团 0.25 秒缩到 0.55（接下一镜）。
// 我们的内容：待办 App「小周」。大字"自动安排"；卡片是小周的各种家庭助手（账单、日程、接送、家务……）。
//
// 拍表（源秒，30fps）
//   拍 1 开关浮出     0.13–0.37   浅灰浮出、长大（停留点 0.33：看关着的开关）
//   拍 2 打开         0.37–0.55   圆钮滑动 + 变绿 + 绿光
//   拍 3 卡片飞入     0.67–1.10   卡片错开飞入；开关 0.77–1.00 缩小右移露出大字
//   拍 4 漂 + 缩远    1.10–3.45   一直慢漂（停留点 2.40：看全景）；3.20–3.45 整团缩到 0.55
// 毛病清单：
//   - 通用：画面永远不停（卡片一直漂）；动作叠着走；--hq 渲染；确定性
//   - 独有 1：大字不是"出现"，是开关让开后露出来的（大字本来就在开关后面）
//   - 独有 2：卡片有远近，大小不同；整团绕大字顺时针转（用户第一版指出"没有转起来"）
//   - 独有 3：圆钮滑动和变绿同时发生，绿光晚一点到最亮
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {FONT, mix} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const INK = '#0d0f1a';
const GREEN = '#1fb85f';

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const eo5 = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 5); };
const eio = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mixc = (a: string, b: string, k: number) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], clamp(k)))).join(',')})`; };

// ═════════ 合同 ═════════
export const TOGGLE_AUTOPILOT_CARDS_CONTRACT: GroupContract = {
  sourceDuration: 103.5 / 30, // 3.45s
  fps: 30,
  motion: [[0, 0.3], [0.36, 2.3], [2.5, 3.45]],
  holds: [
    {at: 0.33, maxExtra: 0.8}, // 关着的开关停住看
    {at: 2.4, maxExtra: 2.5}, // 卡片围着大字，慢漂看全景
  ],
  landmarks: {toggle: 0.13, flip: 0.37, cards: 0.67, reveal: 0.77, settle: 1.1, zoomOut: 3.2, exit: 103.5 / 30},
  sfx: [
    {at: 'toggle', type: '弹出', note: '轻柔 pop（开关浮出）', volume: 0.25},
    {at: 'flip', type: '点击', note: '开关咔嗒 + 上扬提示音', tail: 0.3, volume: 0.4},
    {at: 'flip', type: '提示音', note: '开关咔嗒 + 上扬提示音', tail: 0.3, volume: 0.4},
    {at: 'cards', type: '短甩', note: '一串 whoosh（卡片飞入）', tail: 0.5, volume: 0.35},
    {at: 'zoomOut', type: '运镜', note: '拉远 whoosh', tail: 0.3, volume: 0.35},
  ],
  inputs: {label: {maxChars: 4}, cards: {count: 14, maxChars: 5}, subs: {count: 14, maxChars: 10}},
};

export type AutopilotInputs = {label: string; cards: string[]; subs: string[]; icons?: string[]}; // icons：library/brands 下的品牌名（国内产品官方图标），按卡片内容配
export const AUTOPILOT_DEFAULT_INPUTS: AutopilotInputs = {
  label: '自动安排',
  cards: ['账单助手', '日程助手', '接送提醒', '家务分配', '购物清单', '体检预约', '生日提醒', '作业检查', '快递追踪', '水电缴费', '周末计划', '药品提醒', '宠物喂食', '旅行打包'],
  icons: ['alipay', 'feishu', 'amap', 'wechat', 'meituan', 'dianping', 'qqmail', 'dingtalk', 'alipay', 'wechat', 'xiaohongshu', 'meituan', 'doubao', 'feishu'],
  subs: ['本月已缴 3 笔', '今天 4 件事', '17:30 接小雨', '本周轮到爸爸', '还差 5 样', '周六 9:00', '外婆 6 月 2 日', '数学已检查', '2 件今天到', '电费已自动缴', '去郊外野餐', '每晚 8 点', '早晚各一次', '清单已备好'],
};
export const checkAutopilotInputs = (x: AutopilotInputs) => checkInputs(TOGGLE_AUTOPILOT_CARDS_CONTRACT, {label: x.label, cards: x.cards, subs: x.subs});
export const planAutopilot = (sec: number) => planExtras(TOGGLE_AUTOPILOT_CARDS_CONTRACT, sec);
export const autopilotFrames = (extras: number[]) => Math.round(outputDuration(TOGGLE_AUTOPILOT_CARDS_CONTRACT, extras) * FPS);
export const TOGGLE_AUTOPILOT_CARDS_DURATION = 104;

// ═════════ 卡片 ═════════
// 位置照原片 23.0s 那一帧量（1920×1080），kind: 0 蓝 / 1 紫 / 2 白 / 3 只有字的标签；d 远近（1 近 … 0.5 远）
type Spot = {x: number; y: number; w: number; kind: number; d: number; t0: number};
const SPOTS: Spot[] = [
  {x: 495, y: 160, w: 300, kind: 2, d: 0.8, t0: 0.72},
  {x: 204, y: 330, w: 360, kind: 1, d: 1.0, t0: 0.67},
  {x: 150, y: 640, w: 310, kind: 0, d: 0.9, t0: 0.74},
  {x: 1332, y: 140, w: 306, kind: 0, d: 0.85, t0: 0.69},
  {x: 1662, y: 275, w: 324, kind: 1, d: 0.95, t0: 0.71},
  {x: 1780, y: 520, w: 300, kind: 2, d: 0.9, t0: 0.76},
  {x: 585, y: 980, w: 360, kind: 2, d: 0.95, t0: 0.73},
  {x: 1012, y: 1010, w: 320, kind: 1, d: 0.9, t0: 0.78},
  {x: 1425, y: 1000, w: 330, kind: 0, d: 0.95, t0: 0.7},
  {x: 120, y: 950, w: 260, kind: 2, d: 0.7, t0: 0.8},
  {x: 1840, y: 860, w: 240, kind: 1, d: 0.7, t0: 0.82},
  {x: 860, y: 165, w: 0, kind: 3, d: 0.6, t0: 0.75},
  {x: 380, y: 815, w: 0, kind: 3, d: 0.6, t0: 0.8},
  {x: 1700, y: 760, w: 0, kind: 3, d: 0.6, t0: 0.84},
];
const APP_ICON = ['M5 12.5l4.5 4.5L19 7.5', 'M4 6h16v14H4zM4 10h16M9 3v4M15 3v4', 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0', 'M3 4h2.5l2.2 10.5h10.6L20.5 7H7', 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4', 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2'];
const ICON_C = ['#2a42f4', '#1fb85f', '#f59e5b', '#e8487a', '#7b5cff', '#0ea5e9'];
// 2026-11-17 第2轮：原片卡片角上是 WhatsApp、Gmail、Notion 等真实图标 → 换成国内产品官方图标（App Store 原图，iOS 圆角）
//   原片的样子：白色圆角小底板（和原来一样）+ 里面一个品牌标志，标志约占底板 62%；所以这里是白底板里放一个缩小的官方 App 图标
const BrandTile: React.FC<{name: string; size: number; bare?: boolean}> = ({name, size, bare}) => {
  const ic = bare ? size : size * 0.62;
  const icon = <div style={{width: ic, height: ic, borderRadius: ic * 0.225, overflow: 'hidden', boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.08)'}}><Img src={staticFile(`library/brands/${name}/app-icon_1024.png`)} style={{width: '100%', height: '100%', display: 'block'}} /></div>;
  if (bare) return icon;
  return <div style={{width: size, height: size, borderRadius: size * 0.26, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.08)'}}>{icon}</div>;
};
const AgentCard: React.FC<{sp: Spot; i: number; title: string; sub: string; icon?: string}> = ({sp, i, title, sub, icon}) => {
  if (sp.kind === 3) {
    return (
      <div style={{transform: 'translate(-50%,-50%)', whiteSpace: 'nowrap'}}>
        {icon ? <div style={{marginBottom: 8}}><BrandTile name={icon} size={26} bare /></div> : <div style={{width: 22, height: 22, borderRadius: 6, background: ICON_C[i % 6], marginBottom: 8}} />}
        <div style={{fontSize: 30, fontWeight: 700, color: INK}}>{title}</div>
        <div style={{fontSize: 15, color: '#8b8e9a', marginTop: 4}}>{sub}</div>
      </div>
    );
  }
  const w = sp.w, h = w * 1.06;
  const bg = sp.kind === 0 ? 'linear-gradient(160deg, #3d8bff 0%, #2a5cf4 55%, #3236d8 100%)' : sp.kind === 1 ? 'linear-gradient(160deg, #5b3df0 0%, #3a1fc4 55%, #241a8c 100%)' : 'linear-gradient(160deg, #f4f6ff 0%, #e6ebff 60%, #dde2fb 100%)';
  const fg = sp.kind === 2 ? INK : '#fff';
  const k = w / 320;
  return (
    <div style={{position: 'relative', width: w, height: h, transform: 'translate(-50%,-50%)', borderRadius: 18 * k, background: bg, boxShadow: `0 ${14 * k}px ${36 * k}px rgba(40,50,140,${sp.kind === 2 ? 0.12 : 0.28})`, overflow: 'hidden'}}>
      {icon ? <div style={{position: 'absolute', left: 24 * k, top: 24 * k}}><BrandTile name={icon} size={54 * k} /></div> : (
      <div style={{position: 'absolute', left: 24 * k, top: 24 * k, width: 54 * k, height: 54 * k, borderRadius: 14 * k, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.08)'}}>
        <svg width={30 * k} height={30 * k} viewBox="0 0 24 24"><path d={APP_ICON[i % 6]} stroke={ICON_C[i % 6]} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>)}
      <div style={{position: 'absolute', right: 22 * k, top: 30 * k, fontSize: 13 * k, fontWeight: 600, color: sp.kind === 2 ? '#1fb85f' : '#8ff0b4', display: 'flex', alignItems: 'center', gap: 5 * k}}><span style={{width: 7 * k, height: 7 * k, borderRadius: 4 * k, background: sp.kind === 2 ? '#1fb85f' : '#5fe39a'}} />运行中</div>
      <div style={{position: 'absolute', left: 24 * k, bottom: 52 * k, fontSize: 32 * k, fontWeight: 700, color: fg, whiteSpace: 'nowrap'}}>{title}</div>
      <div style={{position: 'absolute', left: 24 * k, bottom: 26 * k, fontSize: 15 * k, color: sp.kind === 2 ? '#7c7f8c' : 'rgba(255,255,255,0.72)', whiteSpace: 'nowrap'}}>{sub}</div>
    </div>
  );
};

const Cards: React.FC<{s: number; t: number; x: AutopilotInputs}> = ({s, t, x}) => (
  <>
    {SPOTS.map((sp, i) => {
      if (s < sp.t0) return null;
      const dx = sp.x - 960, dy = sp.y - 540;
      const len = Math.hypot(dx, dy) || 1;
      const fly = 1 - eo5(s, sp.t0, sp.t0 + 0.42);
      const far = 1100;
      // 原片整团卡片绕着大字顺时针转（逐帧跟踪 4 张卡：椭圆 横 1.5 : 竖 1，约 20°/秒，同时略往里收）
      const ot = Math.max(0, t - 0.67);
      const ex = dx / 1.5, ey = dy;
      const r0 = Math.hypot(ex, ey), th0 = Math.atan2(ey, ex);
      const th = th0 + (20 * Math.PI / 180) * ot;
      const rr = r0 * (1 - 0.05 * ot);
      const ox = rr * Math.cos(th) * 1.5, oy = rr * Math.sin(th);
      const fx = 960 + ox + (dx / len) * far * fly + Math.sin(t * 1.1 + i) * 6 * sp.d;
      const fy = 540 + oy + (dy / len) * far * fly + Math.cos(t * 0.95 + i * 1.7) * 6 * sp.d;
      const v = far * Math.abs(eo5(s + 1 / 60, sp.t0, sp.t0 + 0.42) - eo5(s - 1 / 60, sp.t0, sp.t0 + 0.42)); // px / 帧
      return (
        <div key={i} style={{position: 'absolute', left: fx, top: fy, zIndex: Math.round(sp.d * 10), filter: v > 40 ? `blur(${Math.min(5, (v - 40) * 0.04).toFixed(2)}px)` : undefined}}>
          <AgentCard sp={sp} i={i} title={x.cards[i]} sub={x.subs[i]} icon={(x.icons ?? AUTOPILOT_DEFAULT_INPUTS.icons)?.[i]} />
        </div>
      );
    })}
  </>
);

// ═════════ 开关 + 大字 ═════════
const LF = 140;
const Toggle: React.FC<{s: number; hd1: number; x: AutopilotInputs}> = ({s, hd1, x}) => {
  const lw = Array.from(x.label).length * LF * 1.0;
  const smallW = 165, smallH = 78, gap = 24;
  const groupW = lw + gap + smallW;
  const labelL = 960 - groupW / 2;
  const smallCx = labelL + lw + gap + smallW / 2;
  const appear = eo(s, 0.13, 0.33);
  const grow = mix(0.82, 1, appear) * (1 + 0.08 * hd1); // 停住看开关时慢慢长大一点（之后保持，不回跳）
  const on = eio(s, 0.37, 0.52);
  const glow = clamp((s - 0.45) / 0.12) * (1 - clamp((s - 0.9) / 0.4));
  const red = eo(s, 0.77, 1.0); // 0 大 → 1 小
  const W = mix(720 * grow, smallW, red), H = mix(348 * grow, smallH, red);
  const cx = mix(960, smallCx, red);
  const pad = H * 0.06, kd = H - pad * 2;
  const knobX = mix(pad, W - pad - kd, on);
  const track = s < 0.37 ? mixc('#e9eaee', '#c4c8cf', appear) : mixc('#c4c8cf', GREEN, on);
  return (
    <>
      <div style={{position: 'absolute', left: labelL, top: 540, transform: 'translateY(-52%)', fontSize: LF, fontWeight: 700, color: INK, whiteSpace: 'nowrap', letterSpacing: '-0.01em', lineHeight: 1, opacity: s < 0.75 ? 0 : 1}}>{x.label}</div>
      {s >= 0.13 && (
        <div style={{position: 'absolute', left: cx - W / 2, top: 540 - H / 2, width: W, height: H, borderRadius: H / 2, background: track, opacity: clamp(appear * 1.6), boxShadow: `0 0 ${(40 * glow * H / 348).toFixed(1)}px ${(10 * glow * H / 348).toFixed(1)}px rgba(31,184,95,${(0.45 * glow).toFixed(3)})`}}>
          <div style={{position: 'absolute', left: knobX, top: pad, width: kd, height: kd, borderRadius: kd / 2, background: '#fff', boxShadow: `0 ${H * 0.02}px ${H * 0.06}px rgba(0,0,0,0.12)`}} />
        </div>
      )}
    </>
  );
};

// ═════════ 整组 ═════════
export type AutopilotProps = {inputs?: AutopilotInputs; extras?: number[]};
export const ToggleAutopilotCardsGroup: React.FC<AutopilotProps> = ({inputs = AUTOPILOT_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const C = TOGGLE_AUTOPILOT_CARDS_CONTRACT;
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, C, extras);
  // 卡片漂用"去掉第一个停留"的输出秒：第一个停留时卡片还没出来
  const t2 = t - (extras[0] ?? 0);
  const out = eio(s, 3.2, 3.45);
  const zoom = mix(1, 0.55, out);
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS, background: '#f8f8fa'}}>
      <AbsoluteFill style={{transform: `scale(${zoom.toFixed(5)})`}}>
        <Cards s={s} t={t2} x={inputs} />
        <div style={{position: 'absolute', inset: 0, zIndex: 9}}><Toggle s={s} hd1={clamp(t - s, 0, extras[0] ?? 0)} x={inputs} /></div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export const ToggleAutopilotCards: React.FC = () => <ToggleAutopilotCardsGroup />;

if (checkContract(TOGGLE_AUTOPILOT_CARDS_CONTRACT).length) throw new Error(checkContract(TOGGLE_AUTOPILOT_CARDS_CONTRACT).join('; '));
