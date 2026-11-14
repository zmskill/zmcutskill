// 打一句话找羽毛球搭子 → 卡片分行交错滑进来铺满 → 多光标点选 → 选中的 3 张展开详情 → 收成名单 → 三词标题 → 金句 → 再打一句、冲近点发送（003-S3 整段）
// 学的动作（Polar 003-S3，逐元素时间表见 shot-lab/refs/003-S3/逐元素时间表.md，原片 25fps 按秒换算到 30fps）：
//   一个连续的"镜头呼吸"：每拍 = 0.1–0.3 秒快动作 + 0.5–1.5 秒很慢但不停的漂；状态切换靠同一批元素自己变形
//   （搜索框被中间一排卡替换 → 选中的卡留下展开 → 缩成小条 → 落进表格变骨架 → 填字）；
//   硬切只有 3 处，都藏在失焦 / 后拉最快 / 冲近的那一帧里。光标转向移动方向、贴着内容走。
// 我们的内容（中性日常）：找周末一起打羽毛球的搭子；虚构平台"球友圈"（蓝色"圈"小标）；字母几何头像。
//
// 时间表（30fps，共 575f）
//   S0   0–66   上一镜头尾巴：左边筛选词换词（羽毛球 中级 → 周末有空），右边资料卡慢滚、38f 猛跳下一张，蓝色选中底刷过
//   S1  66–102  整屏失焦 0→15px、轻缩 3.5%；79f 硬切白墙背景（一出来就是虚的），搜索框 1.19→1 倍、透明→实、虚→清；91f 光标从底边进
//   S2 102–141  打字块状蹦出（每 3 帧 2–3 个字），发送键随字数变饱和；光标转身横移到发送键（120–134）、按下缩 8%
//   S3 141–180  后拉（1→0.646），上排从右往左、下排从左往右交错滑入（同排相差 4 帧）；163 搜索框 3 帧淡出、中间一排原地淡入；
//               176–179 第二次猛后拉 12% + 网格逆时针转 3.5°，上下多出两排、四周景深
//   S4 180–240  4 个光标错开点选：悬停浅蓝 → 按下深蓝内容变淡、微放大 → 松开浅蓝 + 角点选框；陈默选了又退选、顾小满只悬停
//   S5 237–339  237 小快动作（缩 6% 上移），没选中的从外圈/下面一层层退成背景虚影；倾斜归零；3 张摆正散开、字段每帧一行往下长
//               （周一航 253 → 许晴 262 → 林小禾 265），互相叠；300/306/312 "很合适"错开弹出；318 起光标依次离场
//   S6 339–411  虚影淡掉变白底；名单面板在卡后面淡入；字段从下往上收、卡缩成小条竖叠（364–377 停着慢漂）；
//               377/381/385 一条条落进表格 → 浅蓝骨架条斜边从中间擦出 → 拉长 → 斜向扫光填字 → 绿勾；408 面板下移让位
//   S7 411–461  "找到。看懂。约上。"逐词浮现（每词错开 6 帧、14 帧到位）；停住极慢后拉；450 起缓入加速后拉到 0.75 倍
//   S8 461–575  461 硬切（后拉最快那帧）白墙更近更亮；金句"找到对的人"逐词上浮；489 后拉、金句淡走，493 新搜索框从下冲上来轻微过冲；
//               501–525 打第二句 + 慢推；538 冲近发送键（硬切），光标带拖影冲过来、按下、松开出玻璃高光；569 起泛冷蓝
// 毛病清单（本镜头独有）：
//   - 卡片必须是"分行左右交错滑入"，不能放射炸开；搜索框被中间一排替换，不是飞走
//   - 光标贴着各自的卡（卡在漂，光标跟着漂），朝向只看"光标自己的移动"，不被镜头运动带偏
//   - 收名单的中间态（小条竖叠 → 落 → 骨架 → 扫光 → 勾）一步都不能省
//   - 整片没有一帧静止：每段都叠了慢推 / 慢漂
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, FONT, Grain, bezier, mix, ramp} from '../../../kit/polish';

export const SEARCH_PICK_SHORTLIST_DURATION = 575;

const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const INK = '#1d1f23';
const SUB = '#8d939d';
const CYAN = '#09caec';
const BRAND = '#2b7de9';
const GREEN = '#22a86a';
type Ease = (t: number) => number;
type V2 = [number, number];
const EOUT = bezier(0.33, 1, 0.68, 1);
const EIN = bezier(0.55, 0, 1, 0.45);
const EACC = bezier(0.6, 0, 1, 1);
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const sstep = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const hash = (i: number, n: number) => { const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };
const kf = (f: number, keys: [number, number, Ease?][]) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f1, v1, e] = keys[i];
    const [f0, v0] = keys[i - 1];
    if (f <= f1) return mix(v0, v1, (e ?? EASE.smooth)(clamp((f - f0) / (f1 - f0))));
  }
  return keys[keys.length - 1][1];
};
const lerp2 = (a: V2, b: V2, t: number): V2 => [mix(a[0], b[0], t), mix(a[1], b[1], t)];
const hexMix = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], clamp(t)))).join(',')})`;
};
const fx = (n: number) => n.toFixed(2);

// ───────── 光标：导航箭头（尖在原点），rot 0 = 指向正上，90 = 正右；速度大时拖残影 ─────────
const Cursor: React.FC<{x: number; y: number; rot: number; size?: number; press?: number; opacity?: number; vel?: V2; blur?: number}> = ({x, y, rot, size = 50, press = 0, opacity = 1, vel = [0, 0], blur = 0}) => {
  if (opacity <= 0.01) return null;
  const sp = Math.hypot(vel[0], vel[1]);
  const s = (size / 32) * (1 - press * 0.12);
  const ghosts = sp > 7 ? Math.min(9, Math.floor(sp / 5)) : 0;
  const one = (gx: number, gy: number, o: number, key: number) => (
    <svg key={key} width={40} height={40} viewBox="-20 -4 40 40" style={{position: 'absolute', left: gx - 20, top: gy + 4 - 8, overflow: 'visible', transform: `rotate(${fx(rot)}deg) scale(${fx(s)})`, transformOrigin: '20px 4px', opacity: o, filter: key === 0 ? `drop-shadow(1.5px 3px 2.5px rgba(0,0,0,0.3))${blur > 0.2 ? ` blur(${fx(blur)}px)` : ''}` : 'blur(3px)'}}>
      <path d="M0 0 L12.5 31 L0 23.5 L-12.5 31 Z" fill="#101114" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
    </svg>
  );
  return (
    <div style={{position: 'absolute', left: 0, top: 0, opacity}}>
      {Array.from({length: ghosts}, (_, i) => one(x - vel[0] * (i + 1) * 0.2, y - vel[1] * (i + 1) * 0.2, 0.3 * (1 - i / (ghosts + 1)), i + 1))}
      {one(x, y + 8, 1, 0)}
    </div>
  );
};

// ───────── 光标路径：关键帧之间混合"锚点"（锚点可以贴在卡上，随卡漂）；朝向只看光标自己的移动 ─────────
type Anchor = (fa: number) => V2;
type PathKey = [number, Anchor, Ease?];
const pathAt = (keys: PathKey[], fm: number, fa: number): V2 => {
  if (fm <= keys[0][0]) return keys[0][1](fa);
  for (let i = 1; i < keys.length; i++) {
    const [f1, a1, e] = keys[i];
    const [f0, a0] = keys[i - 1];
    if (fm <= f1) return lerp2(a0(fa), a1(fa), (e ?? EASE.smooth)(clamp((fm - f0) / (f1 - f0))));
  }
  return keys[keys.length - 1][1](fa);
};
const ownVel = (keys: PathKey[], g: number): V2 => { const a = pathAt(keys, g - 0.5, g), b = pathAt(keys, g + 0.5, g); return [b[0] - a[0], b[1] - a[1]]; };
const winVec = (keys: PathKey[], f: number): V2 => {
  let sx = 0, sy = 0;
  for (let k = 0; k < 6; k++) { const v = ownVel(keys, f - k); const w = Math.pow(0.72, k); sx += v[0] * w; sy += v[1] * w; }
  return [sx, sy];
};
const ang = (v: V2) => (Math.atan2(v[0], -v[1]) * 180) / Math.PI;
const angLerp = (a: number, b: number, t: number) => { let d = ((b - a + 540) % 360) - 180; return a + d * t; };
const headingAt = (keys: PathKey[], f: number, def: number, th: number) => {
  const cur = winVec(keys, f);
  const m = Math.hypot(cur[0], cur[1]);
  let prev = def;
  for (let g = f - 4; g > f - 90; g -= 2) {
    const v = winVec(keys, g);
    if (Math.hypot(v[0], v[1]) > th * 3) { prev = ang(v); break; }
  }
  return m < 1e-4 ? prev : angLerp(prev, ang(cur), sstep(th * 0.3, th * 3, m));
};

// ───────── 背景：虚焦白墙（暖白渐变 + 斜向光带/叶影 + 左边一团淡绿 + 陶罐 + 台面），cool = 提亮去色成冷白"空气" ─────────
const WallBg: React.FC<{f: number; z?: number; ox?: number; oy?: number; cool?: number; bright?: number; blur?: number}> = ({f, z = 1, ox = 0, oy = 0, cool = 0, bright = 0, blur = 0}) => {
  const sway = Math.sin(f / 46) * 16 + f * 0.12;
  return (
    <AbsoluteFill style={{background: '#ebe7e4', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: -240, top: -220, width: 2400, height: 1520, transform: `translate(${fx(ox)}px, ${fx(oy)}px) scale(${z.toFixed(4)})`, transformOrigin: '50% 50%', filter: blur > 0.3 ? `blur(${fx(blur)}px)` : undefined}}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(100deg, #e2dcd9 0%, #ece8e5 38%, #f3f1ef 70%, #efedeb 100%)'}} />
        {/* 斜向光带与叶影 */}
        {Array.from({length: 9}, (_, i) => (
          <div key={i} style={{position: 'absolute', left: 260 + i * 250 + sway * (1 + (i % 3) * 0.4), top: -500, width: 90 + hash(i, 1) * 150, height: 2700, background: i % 2 ? 'rgba(255,255,255,0.55)' : 'rgba(150,150,165,0.20)', transform: 'rotate(38deg)', filter: 'blur(30px)'}} />
        ))}
        {/* 竖向窗框影 */}
        <div style={{position: 'absolute', left: 470, top: 0, width: 110, height: 1520, background: 'rgba(160,158,160,0.16)', filter: 'blur(26px)'}} />
        {/* 绿植（很虚的淡绿团）+ 陶罐 */}
        <div style={{position: 'absolute', left: 60 + sway * 0.6, top: 640, width: 520, height: 420, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(95,150,80,0.85), rgba(130,175,110,0.45) 60%, rgba(150,190,130,0))', filter: 'blur(22px)'}} />
        <div style={{position: 'absolute', left: 250 + sway, top: 600, width: 220, height: 160, borderRadius: '50%', background: 'rgba(80,135,70,0.55)', filter: 'blur(22px)', transform: 'rotate(-25deg)'}} />
        <div style={{position: 'absolute', left: 140, top: 1010, width: 380, height: 330, borderRadius: '48%', background: 'radial-gradient(circle at 40% 35%, #fbfaf8, #e2ddd8 70%)', filter: 'blur(14px)'}} />
        {/* 右下台面 */}
        <div style={{position: 'absolute', left: 900, top: 1290, width: 1600, height: 260, borderRadius: 60, background: 'linear-gradient(180deg, #d8cfc5, #c9bfb4)', filter: 'blur(12px)'}} />
        {bright > 0 && <div style={{position: 'absolute', left: 1880, top: 690, width: 170, height: 60, borderRadius: 30, background: 'linear-gradient(90deg, rgba(255,140,140,0.5), rgba(255,230,130,0.5), rgba(130,230,170,0.5), rgba(130,180,255,0.5))', filter: 'blur(14px)', opacity: bright}} />}
      </div>
      {bright > 0 && <AbsoluteFill style={{background: 'rgba(255,255,255,0.18)', opacity: bright}} />}
      {cool > 0 && <AbsoluteFill style={{background: '#f5fbfe', opacity: cool}} />}
    </AbsoluteFill>
  );
};

// ───────── 搜索框（本地坐标 w×h；发送键中心 = (w-58, h-54)） ─────────
const SearchBox: React.FC<{w: number; h: number; text: string; placeholder: boolean; caret: boolean; sendOn: number; press: number; glass?: number; textO?: number}> = ({w, h, text, placeholder, caret, sendOn, press, glass = 0, textO = 1}) => {
  const sendBg = glass > 0.01 ? hexMix(CYAN, '#bff3fb', glass * 0.7) : hexMix('#c6eef6', CYAN, sendOn);
  return (
    <div style={{position: 'relative', width: w, height: h, borderRadius: 30, background: 'rgba(248,252,253,0.94)', boxShadow: '0 30px 80px rgba(70,95,125,0.10), 0 2px 6px rgba(70,95,125,0.05), inset 0 0 0 2px rgba(255,255,255,0.95)', fontFamily: SANS, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: w * 0.6, top: 0, width: w * 0.12, height: h, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.75), rgba(255,255,255,0))'}} />
      <div style={{position: 'absolute', left: 34, top: 30, right: 34, fontSize: 34, lineHeight: '44px', color: placeholder ? '#a9afb8' : INK, whiteSpace: 'nowrap', opacity: textO}}>
        {placeholder ? '描述你想找的人，/ 调出命令，@ 引用内容' : text}
        {caret && <span style={{display: 'inline-block', width: 3, height: 38, marginLeft: 3, verticalAlign: -6, background: INK}} />}
      </div>
      <div style={{position: 'absolute', left: 30, right: 26, bottom: 22, height: 64, display: 'flex', alignItems: 'center', gap: 20, fontSize: 28, color: '#7a808a', opacity: textO}}>
        <span style={{fontSize: 40, fontWeight: 300}}>+</span>
        <span>标准 ⌄</span>
        <span style={{flex: 1}} />
        <div style={{width: 30, height: 22, borderRadius: 5, border: '2.5px solid #8a909a'}} />
        <svg width={26} height={34} viewBox="0 0 26 34" style={{marginRight: 6}}><rect x={8} y={2} width={10} height={18} rx={5} fill="none" stroke="#8a909a" strokeWidth={2.5} /><path d="M3 15 a10 10 0 0 0 20 0 M13 25 V31" fill="none" stroke="#8a909a" strokeWidth={2.5} strokeLinecap="round" /></svg>
        <div style={{position: 'relative', width: 64, height: 64, borderRadius: 32, background: sendBg, transform: `scale(${fx(1 - press * 0.08)})`, filter: press > 0 ? `brightness(${fx(1 - press * 0.1)})` : undefined, boxShadow: glass > 0.01 ? `inset -3px -4px 0 rgba(255,255,255,${fx(glass * 0.85)}), 0 0 0 ${fx(3 * glass)}px rgba(255,255,255,${fx(glass * 0.7)})` : undefined}}>
          <svg width={64} height={64} viewBox="0 0 64 64" style={{position: 'absolute'}}><path d="M32 45 V20 M21 30 L32 19 L43 30" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          {glass > 0.01 && <div style={{position: 'absolute', inset: 0, borderRadius: 32, background: 'radial-gradient(circle at 30% 26%, rgba(255,255,255,0.95), rgba(255,255,255,0) 52%)', opacity: glass}} />}
        </div>
      </div>
    </div>
  );
};

// ───────── 人物数据 ─────────
type Person = {name: string; L: string; c1: string; c2: string; bio: string};
const HUES: [string, string][] = [['#ffd9c2', '#f39b6d'], ['#cfe1ff', '#7aa7f5'], ['#d4f0e0', '#6cc79a'], ['#eadcff', '#a98be8'], ['#fff0bf', '#e9b949'], ['#ffd6de', '#ee8aa0'], ['#d3f2f6', '#5fc4d6']];
const BIOS = ['打了 3 年 · 周末常在线', '刚入门 · 想找人一起练', '中级 · 喜欢双打', '工作日晚上 7 点后有空', '住城东 · 常去湖滨馆', '中高级 · 单打为主', '想找固定搭子 · 每周一次', '周日上午有空'];
const NAMES: Record<string, [string, string]> = {
  '-2,-2': ['温言', 'W'], '-2,-1': ['罗小北', 'L'], '-2,0': ['林小禾', 'L'], '-2,1': ['何以舟', 'H'], '-2,2': ['宋知夏', 'S'], '-2,3': ['秦朗', 'Q'],
  '-1,-2': ['白一', 'B'], '-1,-1': ['唐一鸣', 'T'], '-1,0': ['苏安', 'S'], '-1,1': ['周一航', 'Z'], '-1,2': ['江禾', 'J'], '-1,3': ['程橙', 'C'],
  '0,-2': ['方圆', 'F'], '0,-1': ['沈南', 'S'], '0,0': ['孟夏', 'M'], '0,1': ['叶川', 'Y'], '0,2': ['顾小满', 'G'], '0,3': ['陆离', 'L'],
  '1,-2': ['姜野', 'J'], '1,-1': ['白露', 'B'], '1,0': ['许晴', 'X'], '1,1': ['陈默', 'C'], '1,2': ['夏至', 'X'], '1,3': ['关山', 'G'],
  '2,-2': ['安然', 'A'], '2,-1': ['韩梅', 'H'], '2,0': ['李想', 'L'], '2,1': ['钟意', 'Z'], '2,2': ['乔木', 'Q'], '2,3': ['卫青', 'W'],
};
const PEOPLE: Record<string, Person> = {};
Object.entries(NAMES).forEach(([k, [name, L]], i) => { const h = HUES[(i * 3) % HUES.length]; PEOPLE[k] = {name, L, c1: h[0], c2: h[1], bio: BIOS[(i * 5) % BIOS.length]}; });
PEOPLE['-2,0'].bio = '中级 · 双打 · 周六有空';
PEOPLE['-1,1'].bio = '中高级 · 打了 6 年';
PEOPLE['1,0'].bio = '中级 · 混双 · 住城北';
const KEYS = Object.keys(NAMES);
const OLIVIA = '-2,0', LUCAS = '-1,1', HANNAH = '1,0', EMMA = '-1,0', JAMES = '1,1', GRACE = '0,2';
const FINALS = [OLIVIA, LUCAS, HANNAH];

type Row = [string, string];
const DETAIL: Record<string, {rows: Row[]; tag: number}> = {
  [OLIVIA]: {rows: [['水平', '中级 · 打了 4 年'], ['打法', '双打为主'], ['常去球馆', '星河体育馆'], ['', '城北羽毛球中心'], ['可约时间', '周六上午 9:00–11:00'], ['离你多远', '1.8 公里']], tag: 1},
  [LUCAS]: {rows: [['水平', '中高级 · 打了 6 年'], ['打法', '单打、双打都行'], ['常去球馆', '星河体育馆'], ['', '湖滨运动馆'], ['', '东区全民健身中心'], ['可约时间', '周六 / 周日下午'], ['离你多远', '3.2 公里']], tag: 6},
  [HANNAH]: {rows: [['水平', '中级 · 打了 3 年'], ['打法', '混双'], ['常去球馆', '城北羽毛球中心'], ['', '星河体育馆'], ['可约时间', '周六上午'], ['离你多远', '2.4 公里']], tag: 0},
};

// ───────── 头像 / 小标 ─────────
const Avatar: React.FC<{p: Person; d: number}> = ({p, d}) => (
  <div style={{position: 'relative', width: d, height: d, borderRadius: d / 2, overflow: 'hidden', background: `linear-gradient(140deg, ${p.c1}, ${p.c2})`, flexShrink: 0}}>
    <div style={{position: 'absolute', left: d * 0.52, top: d * 0.5, width: d * 0.7, height: d * 0.7, borderRadius: '50%', background: 'rgba(255,255,255,0.28)'}} />
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: d * 0.46, fontWeight: 700, fontFamily: FONT.sans}}>{p.L}</div>
  </div>
);
const PlatBadge: React.FC<{s: number}> = ({s}) => (
  <div style={{width: s, height: s, borderRadius: s * 0.22, background: BRAND, color: '#fff', fontSize: s * 0.62, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1}}>圈</div>
);
const Check: React.FC<{s: number; color?: string; bg?: string}> = ({s, color = '#fff', bg = BRAND}) => (
  <svg width={s} height={s} viewBox="0 0 20 20"><circle cx={10} cy={10} r={10} fill={bg} /><path d="M5.5 10.3 L8.6 13.2 L14.5 7.2" stroke={color} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

// ───────── 人物卡（世界坐标 1080×340，锚点 = 头部中心；详情字段往下长） ─────────
const CW = 1080, CH = 340, ROWH = 80;
type CardVis = {hover: number; press: number; sel: number; handles: number; expand: number; tag: number; bgA: number; bio: number};
const V0: CardVis = {hover: 0, press: 0, sel: 0, handles: 0, expand: 0, tag: 0, bgA: 1, bio: 1};
const PersonCard: React.FC<{k: string; v: CardVis}> = ({k, v}) => {
  const p = PEOPLE[k];
  const det = DETAIL[k];
  const rows = det ? det.rows : [];
  const vis = rows.map((_, i) => clamp(v.expand - i));
  const extra = vis.reduce((a, b) => a + b, 0) * ROWH + 40 * clamp(v.expand);
  const act = Math.max(v.hover, v.sel, v.press);
  const contentO = clamp(1 - v.press * 0.6 - v.sel * 0.3);
  return (
    <div style={{position: 'relative', width: CW, height: CH + extra, fontFamily: SANS, transform: v.press > 0.01 ? `scale(${fx(1 + v.press * 0.025)})` : undefined, transformOrigin: `${CW / 2}px ${CH / 2}px`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 34, background: `rgba(250,253,255,${fx(0.82 * v.bgA)})`, boxShadow: `0 26px 64px rgba(70,100,140,${fx(0.08 * v.bgA)}), inset 0 0 0 2px rgba(255,255,255,${fx(0.95 * v.bgA)})`}} />
      {act > 0.01 && <div style={{position: 'absolute', inset: 0, borderRadius: 34, background: `rgba(205,230,248,${fx(v.hover * 0.42 + v.sel * 0.78)})`, boxShadow: `inset 0 0 0 2.5px rgba(128,193,238,${fx(act)})`}} />}
      {v.press > 0.01 && <div style={{position: 'absolute', inset: 0, borderRadius: 34, background: `rgba(168,212,243,${fx(v.press * 0.95)})`}} />}
      <div style={{position: 'absolute', left: 40, top: 36, opacity: 0.4 + contentO * 0.6}}><PlatBadge s={54} /></div>
      <div style={{position: 'absolute', left: 130, top: 88, opacity: contentO}}><Avatar p={p} d={164} /></div>
      <div style={{position: 'absolute', left: 335, top: 92, fontSize: 76, fontWeight: 600, color: INK, letterSpacing: '-0.01em', whiteSpace: 'nowrap', opacity: contentO}}>{p.name}</div>
      <div style={{position: 'absolute', left: 338, top: 200, fontSize: 40, color: SUB, whiteSpace: 'nowrap', opacity: contentO * v.bio}}>{p.bio}</div>
      <div style={{position: 'absolute', right: 44, top: CH - 92, opacity: 0.5 + contentO * 0.5}}><Check s={48} /></div>
      {rows.map(([label, val], i) => {
        const o = vis[i];
        if (o <= 0.01) return null;
        const y = CH + 6 + rows.slice(0, i).reduce((a, _, j) => a + vis[j], 0) * ROWH;
        const isTag = det && det.tag === i;
        const t = v.tag;
        return (
          <div key={i} style={{position: 'absolute', left: 90, top: y, height: ROWH, display: 'flex', alignItems: 'center', fontSize: 42, whiteSpace: 'nowrap', opacity: o, transform: `translateY(${fx((1 - o) * -14)}px)`}}>
            <div style={{width: 30, height: 30, borderRadius: 8, border: `3px solid ${label ? '#7d838d' : 'transparent'}`, marginRight: 26}} />
            <div style={{width: 250, color: '#4b505a', fontWeight: 500}}>{label}</div>
            <div style={{color: label ? '#3a3f48' : '#6d727c'}}>{val}</div>
            {isTag && t > 0.01 && (
              <div style={{marginLeft: 26, padding: '6px 20px', borderRadius: 30, background: `rgba(225,247,235,${fx(t)})`, color: hexMix('#bfe8d2', '#1f9e62', t), fontSize: 40, fontWeight: 600, opacity: clamp(t * 1.6), transform: `scale(${fx(mix(0.88, 1, t))})`, filter: t < 0.98 ? `blur(${fx((1 - t) * 6)}px)` : undefined}}>很合适</div>
            )}
          </div>
        );
      })}
      {v.handles > 0.01 && (
        <div style={{position: 'absolute', left: -14, top: -14, right: -14, bottom: -14, border: `2.5px solid rgba(110,184,234,${fx(v.handles)})`, borderRadius: 6}}>
          {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, b], i) => <div key={i} style={{position: 'absolute', left: a ? undefined : -10, right: a ? -10 : undefined, top: b ? undefined : -10, bottom: b ? -10 : undefined, width: 18, height: 18, background: '#fff', border: `2.5px solid rgba(110,184,234,${fx(v.handles)})`}} />)}
        </div>
      )}
    </div>
  );
};

// ───────── 网格布局（世界坐标：搜索框中心 = 原点） ─────────
const PX = 1150, PY = 430;
const ROWOFF: Record<number, number> = {[-2]: 140, [-1]: 0, 0: -70, 1: 40, 2: -120};
const ENTRY: Record<string, number> = {
  '-1,-1': 142, '-1,0': 146, '-1,1': 150, '-1,2': 155, '-1,3': 160,
  '1,2': 141, '1,1': 145, '1,0': 149, '1,-1': 154, '1,-2': 159,
};
const parseK = (k: string) => k.split(',').map(Number) as [number, number];
const gridPos = (k: string, f: number): V2 => {
  const [r, c] = parseK(k);
  let x = (c - 0.5) * PX + ROWOFF[r];
  const t = Math.max(0, f - 141);
  if (r === -1) x -= t * 2.2;
  if (r === 1) x += t * 2.2;
  if (r === 0) x += Math.max(0, f - 163) * 0.7;
  if (r === -2) x -= Math.max(0, f - 170) * 1.1;
  if (r === 2) x += Math.max(0, f - 170) * 1.1;
  const e = ENTRY[k];
  if (e !== undefined) x += (r === -1 ? 2600 : -2600) * (1 - EASE.out(clamp((f - e - 3) / 19)));
  const y = r * PY + Math.sin(f / 40 + r) * 6;
  return [x, y];
};

// 3 张入选卡的位置 / 缩放（S5 详情 → S6 小条 → 落进表格）
const PANEL = {cx: -30, cy: -180, w: 2560, h: 820};
const pLeft = PANEL.cx - PANEL.w / 2, pTop = PANEL.cy - PANEL.h / 2;
const TITLE_Y = pTop + 100;
const rowCY = (i: number) => pTop + 310 + i * 160;
const FINAL = {
  [OLIVIA]: {start: 247, det: [-1010, -830] as V2, pre: [140, 90] as V2, stack: 0, row: 0, drop: 377, ex: 265},
  [LUCAS]: {start: 243, det: [1010, -860] as V2, pre: [-150, 90] as V2, stack: 1, row: 1, drop: 381, ex: 253},
  [HANNAH]: {start: 245, det: [90, -330] as V2, pre: [-120, -90] as V2, stack: 2, row: 2, drop: 385, ex: 262},
};
const panelDY = (f: number) => kf(f, [[392, 0], [402, -40, EASE.smooth], [408, -40], [417, 190, EASE.smooth]]);
const cardPose = (k: string, f: number): {p: V2; sc: number; o: number} => {
  const g = gridPos(k, f);
  const F = FINAL[k as keyof typeof FINAL];
  if (!F || f < F.start) return {p: g, sc: 1, o: 1};
  let det: V2 = [F.det[0] + (f - 265) * 0.25 * (k === LUCAS ? 1 : -0.6), F.det[1] + Math.sin(f / 30) * 4];
  if (k === HANNAH) det = [det[0] - 60 * ramp(f, 268, 12, EASE.smooth), det[1] - 60 * ramp(f, 268, 12, EASE.smooth)];
  const p0 = ramp(f, F.start, 22, EASE.swift);
  let p = lerp2(g, det, p0);
  let sc = mix(1, 1.05, p0);
  let o = 1;
  if (f >= 339) {
    const detAt: V2 = [F.det[0] + 74 * 0.25 * (k === LUCAS ? 1 : -0.6), F.det[1]];
    const d0: V2 = k === HANNAH ? [detAt[0] - 60, detAt[1] - 60] : detAt;
    const pre: V2 = [d0[0] + F.pre[0], d0[1] + F.pre[1]];
    const stack: V2 = [pLeft + 0.4 * PANEL.w + (F.stack - 1) * 20, TITLE_Y - F.stack * 230 - 60 * ramp(f, 360, 17, EASE.linear) + Math.sin(f / 9 + F.stack) * 6];
    const a = ramp(f, 339, 10, EASE.smooth);
    const b = ramp(f, 345, 19, EASE.smooth);
    p = lerp2(lerp2(d0, pre, a), stack, b);
    sc = kf(f, [[339, 1.05], [364, 0.6, EASE.smooth]]);
    if (f >= F.drop) {
      const d = ramp(f, F.drop, 4, EIN);
      p = lerp2(p, [pLeft + 330, rowCY(F.row)], d);
      sc = mix(0.6, 0.4, d);
      o = 1 - ramp(f, F.drop + 3, 3, EASE.linear);
    }
  }
  return {p, sc, o};
};

// 选中状态（帧号对原片 6.5–8.3s）
const selVis = (k: string, f: number): CardVis => {
  const v = {...V0};
  const R = (a: number, d = 3) => ramp(f, a, d, EASE.out);
  if (k === GRACE) v.hover = R(197) * (1 - R(212, 4));
  if (k === JAMES) { v.hover = R(201) * (1 - R(226, 6)); v.press = R(205, 2) * (1 - R(211, 3)); v.sel = R(211) * (1 - R(222, 5)); v.handles = v.sel; }
  if (k === EMMA) { v.hover = R(209) * (1 - R(247, 6)); v.press = R(213, 2) * (1 - R(219, 3)); v.sel = R(219) * (1 - R(247, 6)); v.handles = v.sel; }
  if (k === LUCAS) { v.hover = R(216) * (1 - R(245, 5)); v.press = R(219, 2) * (1 - R(226, 3)); v.sel = R(226) * (1 - R(240, 5)); v.handles = R(226) * (1 - R(243, 4)); }
  if (k === HANNAH) { v.hover = R(222) * (1 - R(252, 6)); v.press = R(224, 2) * (1 - R(229, 3)); v.sel = R(229) * (1 - R(244, 8)); v.handles = R(229) * (1 - R(250, 5)); }
  if (k === OLIVIA) { v.hover = R(231) * (1 - R(249, 6)); v.press = R(234, 2) * (1 - R(240, 4)); v.sel = R(240) * (1 - R(242, 8)); v.handles = R(240) * (1 - R(246, 5)); }
  const F = FINAL[k as keyof typeof FINAL];
  if (F) {
    const n = DETAIL[k].rows.length;
    v.expand = f < 349 ? Math.min(n, Math.max(0, (f - F.ex) * 0.75)) : Math.max(0, n * (1 - ramp(f, k === HANNAH ? 350 : 349, k === HANNAH ? 8 : 7, EASE.linear)));
    v.tag = ramp(f, k === LUCAS ? 300 : k === HANNAH ? 306 : 312, 7, EASE.out) * (1 - ramp(f, 347, 3, EASE.linear));
    v.bgA = 1 - ramp(f, 339, 12, EASE.smooth);
    v.bio = 1 - ramp(f, 345, 8, EASE.smooth);
  }
  return v;
};

// ───────── 世界镜头（S1–S7） ─────────
type Cam = {cx: number; cy: number; s: number; rot: number};
const worldCam = (f: number): Cam => {
  const s = kf(f, [[79, 0.982], [141, 1.022, EASE.linear], [144, 0.95, EIN], [148, 0.86, EASE.linear], [152, 0.78, EASE.linear], [157, 0.71, EASE.linear], [161, 0.66, EOUT], [176, 0.615, EASE.linear], [179, 0.545, EASE.linear], [200, 0.522, EOUT], [237, 0.512, EASE.linear], [240, 0.485, EOUT], [258, 0.5, EASE.smooth], [318, 0.535, EASE.linear], [324, 0.506, EASE.smooth], [339, 0.545, EASE.swift], [358, 0.575, EASE.linear], [364, 0.52, EASE.smooth], [408, 0.55, EASE.linear], [448, 0.575, EASE.linear], [451, 0.572, EASE.smooth], [454, 0.555, EIN], [460, 0.41, EACC]]);
  const cx = kf(f, [[79, -24], [141, 16, EASE.linear], [161, -60, EOUT], [176, -80, EASE.linear], [179, -20, EASE.linear], [200, 0, EOUT], [229, 40, EASE.linear], [237, 45, EASE.linear], [240, 45], [262, 0, EASE.smooth], [318, 10, EASE.linear], [324, -30, EASE.smooth], [339, -35, EASE.linear], [364, -30, EASE.smooth], [460, -30]]);
  const cy = kf(f, [[79, 12], [141, -10, EASE.linear], [161, 40, EOUT], [176, 60, EASE.linear], [179, 0, EASE.linear], [200, 0, EOUT], [229, 40, EASE.linear], [237, 75, EIN], [240, 160, EOUT], [262, -200, EASE.smooth], [318, -212, EASE.linear], [339, -220, EASE.linear], [364, -230, EASE.smooth], [378, -262, EASE.linear], [408, -235, EASE.smooth], [430, -150, EASE.smooth], [450, -140, EASE.linear], [460, -150]]);
  const rot = kf(f, [[176, 0], [179, -3.5, EASE.linear], [195, -3.6, EOUT], [240, -3.3, EASE.linear], [258, 0, EASE.smooth]]);
  return {cx: cx + Math.sin(f / 37) * 4, cy: cy + Math.cos(f / 43) * 3, s: s * (1 + Math.sin(f / 29) * 0.0015), rot};
};
const w2s = (cam: Cam, x: number, y: number): V2 => {
  const dx = (x - cam.cx) * cam.s, dy = (y - cam.cy) * cam.s, r = (cam.rot * Math.PI) / 180;
  return [960 + dx * Math.cos(r) - dy * Math.sin(r), 540 + dx * Math.sin(r) + dy * Math.cos(r)];
};

// 搜索框（世界）：1208×210，左上 (-604,-105)
const BW = 1208, BH = 210;
const onBox = (lx: number, ly: number): Anchor => () => [-BW / 2 + lx, -BH / 2 + ly];
const W = (x: number, y: number): Anchor => () => [x, y];
const onCard = (k: string, dx: number, dy: number): Anchor => (fa) => { const c = cardPose(k, fa); return [c.p[0] + dx * c.sc, c.p[1] + dy * c.sc]; };
const SEND: [number, number] = [BW - 58, BH - 54];

const CURSORS: {keys: PathKey[]; on: number; off: number; def: number; fadeOut: number}[] = [
  { // A：S2 那只，打字后去发送键 → 叶川 → 顾小满（只悬停）→ 右边出画
    on: 91, off: 224, fadeOut: 216, def: 10,
    keys: [[91, W(-560, 640)], [96, W(-445, 300), EOUT], [101, W(-392, 92), EOUT], [120, W(-386, 86), EASE.linear], [127, W(80, 18), EIN], [134, onBox(SEND[0] - 40, SEND[1] + 4), EOUT], [161, onBox(SEND[0] - 40, SEND[1] + 4), EASE.linear],
      [166, onCard('0,1', -150, -20), EOUT], [176, onCard('0,1', -170, -150), EASE.smooth], [195, onCard('1,1', 200, -150), EASE.smooth], [199, onCard(GRACE, -250, 40), EOUT], [212, onCard(GRACE, -238, 52), EASE.linear], [224, onCard(GRACE, 500, -260), EIN]],
  },
  { // B：右边分身出现 → 陈默（选了又退）→ 许晴（详情）
    on: 164, off: 332, fadeOut: 324, def: -80,
    keys: [[164, onCard('0,1', 540, 130)], [180, onCard('1,1', -420, -20), EASE.smooth], [195, onCard('2,1', -320, -70), EASE.smooth], [203, onCard(JAMES, -330, 20), EOUT], [220, onCard(JAMES, -325, 26), EASE.linear], [227, onCard(HANNAH, 240, 30), EASE.smooth], [262, onCard(HANNAH, 245, 34), EASE.linear],
      [292, onCard(HANNAH, 80, 320), EASE.smooth], [320, onCard(HANNAH, 96, 326), EASE.linear], [332, onCard(HANNAH, 700, 760), EIN]],
  },
  { // C：左中出现 → 苏安 → 林小禾（详情）
    on: 205, off: 338, fadeOut: 330, def: 30,
    keys: [[205, onCard('0,-1', 120, 80)], [211, onCard(EMMA, -200, 30), EOUT], [222, onCard(EMMA, -196, 34), EASE.linear], [232, onCard(OLIVIA, -170, 40), EASE.smooth], [262, onCard(OLIVIA, -165, 44), EASE.linear], [296, onCard(OLIVIA, -40, 300), EASE.smooth], [326, onCard(OLIVIA, -30, 306), EASE.linear], [338, onCard(OLIVIA, -560, 640), EIN]],
  },
  { // D：叶川右侧出现往上 → 周一航（详情，最早离场）
    on: 211, off: 324, fadeOut: 316, def: -20,
    keys: [[211, onCard('0,1', 600, 220)], [219, onCard(LUCAS, 250, 40), EOUT], [262, onCard(LUCAS, 256, 46), EASE.linear], [290, onCard(LUCAS, 230, 470), EASE.smooth], [314, onCard(LUCAS, 240, 476), EASE.linear], [324, onCard(LUCAS, 760, 980), EIN]],
  },
];
const PRESSES: [number, number][][] = [[[135, 141]], [[205, 211], [224, 229]], [[213, 219], [234, 240]], [[219, 226]]];

// ───────── 名单面板（世界坐标） ─────────
const LIST = [
  {k: OLIVIA, lvl: '中级 · 双打', why: '周六上午有空，离你 1.8 公里'},
  {k: LUCAS, lvl: '中高级 · 单双都行', why: '常去星河体育馆，周末可约'},
  {k: HANNAH, lvl: '中级 · 混双', why: '打法互补，离你 2.4 公里'},
];
const Shortlist: React.FC<{f: number}> = ({f}) => {
  const o = ramp(f, 345, 7, EASE.smooth);
  if (o <= 0) return null;
  const dy = panelDY(f);
  const L = pLeft, T = pTop + dy, Wd = PANEL.w;
  const colA = L + 0.4 * Wd, colB = L + 0.62 * Wd;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, fontFamily: SANS}}>
      <div style={{position: 'absolute', left: L, top: T, width: Wd, height: PANEL.h, borderRadius: 40, background: 'rgba(255,255,255,0.96)', boxShadow: '0 40px 110px rgba(70,95,130,0.08), inset 0 0 0 2px rgba(240,243,247,1)', opacity: o}} />
      <div style={{position: 'absolute', left: L + 70, top: T + 58, display: 'flex', alignItems: 'center', gap: 34, opacity: o}}>
        <svg width={70} height={70} viewBox="0 0 70 70"><circle cx={28} cy={40} r={20} fill="none" stroke={INK} strokeWidth={5} /><circle cx={42} cy={28} r={22} fill={INK} /></svg>
        <div style={{fontSize: 84, fontWeight: 600, color: INK, letterSpacing: '-0.01em', whiteSpace: 'nowrap'}}>候选搭子 · 3 人</div>
      </div>
      <div style={{position: 'absolute', left: L + 60, top: T + 165, width: Wd - 120, height: 2, background: '#eef0f3', opacity: o}} />
      {([['姓名', L + 160, 350], ['水平', colA, 356], ['为什么合适', colB, 356]] as [string, number, number][]).map(([t, x, a]) => (
        <div key={t} style={{position: 'absolute', left: x, top: T + 190, fontSize: 44, color: '#8a909a', whiteSpace: 'nowrap', opacity: o * ramp(f, a, 6, EASE.smooth)}}>{t}</div>
      ))}
      {LIST.map((r, i) => {
        const F = FINAL[r.k as keyof typeof FINAL];
        const t0 = F.drop + 3;
        const cy = rowCY(i) + dy;
        const wipe = 0.72 * ramp(f, t0, 5, EOUT) + 0.28 * ramp(f, 389, 6, EOUT);
        const skelO = 1 - ramp(f, 402 + i * 2, 8, EASE.smooth);
        const fill = ramp(f, 392 + i * 5, 8, EASE.smooth);
        const sheen = (f - (392 + i * 5)) / 11;
        const chk = ramp(f, 403 + i * 2, 5, EASE.overshoot);
        const sepO = ramp(f, 404, 8, EASE.smooth);
        const rl = L + 120, rr = L + Wd - 100, xc = (rl + rr) / 2, hw = ((rr - rl) / 2) * wipe, sl = 40;
        const p = PEOPLE[r.k];
        return (
          <React.Fragment key={r.k}>
            {i > 0 && <div style={{position: 'absolute', left: L + 60, top: cy - 75, width: Wd - 120, height: 2, background: '#f0f2f5', opacity: sepO}} />}
            {wipe > 0.001 && skelO > 0.001 && (
              <div style={{position: 'absolute', left: rl, top: cy - 50, width: rr - rl, height: 100, opacity: skelO, clipPath: `polygon(${fx(xc - rl - hw - sl)}px 100px, ${fx(xc - rl - hw + sl)}px 0px, ${fx(xc - rl + hw + sl)}px 0px, ${fx(xc - rl + hw - sl)}px 100px)`}}>
                <div style={{position: 'absolute', left: 0, top: 0, width: colA - rl - 60, height: 100, borderRadius: 18, background: '#e3f0fb'}} />
                <div style={{position: 'absolute', left: colA - rl - 20, top: 0, right: 0, height: 100, borderRadius: 18, background: '#e3f0fb'}} />
              </div>
            )}
            {fill > 0.001 && (
              <div style={{position: 'absolute', left: rl, top: cy - 50, width: rr - rl, height: 100, opacity: fill}}>
                <div style={{position: 'absolute', left: 24, top: 8}}><Avatar p={p} d={84} /></div>
                <div style={{position: 'absolute', left: 134, top: 18, fontSize: 52, fontWeight: 600, color: INK, whiteSpace: 'nowrap'}}>{p.name}</div>
                <div style={{position: 'absolute', left: colA - rl, top: 20, fontSize: 48, color: '#3e434c', whiteSpace: 'nowrap'}}>{r.lvl}</div>
                <div style={{position: 'absolute', left: colB - rl, top: 20, fontSize: 48, color: '#3e434c', whiteSpace: 'nowrap'}}>{r.why}</div>
              </div>
            )}
            {sheen > -0.1 && sheen < 1.1 && (
              <div style={{position: 'absolute', left: rl, top: cy - 50, width: rr - rl, height: 100, overflow: 'hidden', borderRadius: 18}}>
                <div style={{position: 'absolute', left: `${fx(sheen * 120 - 20)}%`, top: -40, width: 260, height: 180, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.9), rgba(255,255,255,0))', transform: 'skewX(-24deg)'}} />
              </div>
            )}
            {chk > 0.001 && <div style={{position: 'absolute', left: L + 52, top: cy - 26, transform: `scale(${fx(chk)})`}}><Check s={52} bg="#dff5e8" color={GREEN} /></div>}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ───────── S0：资料卡流（上一镜头尾巴） ─────────
const PROFILES = [
  {p: {name: '罗小北', L: 'L', c1: '#cfe1ff', c2: '#7aa7f5', bio: ''}, line: ['羽毛球 · 中级', ' · 打了 4 年'], line2: '城北 · 常去城北羽毛球中心', court: ['#7fc8a9', '#3f9b7a'], hl: 15},
  {p: {name: '顾小满', L: 'G', c1: '#ffd9c2', c2: '#f39b6d', bio: ''}, line: ['周末有空', ' · 双打 / 混双'], line2: '城东 · 离你 2 公里', court: ['#8fb7e8', '#4d7fc4'], hl: 54},
  {p: {name: '何以舟', L: 'H', c1: '#eadcff', c2: '#a98be8', bio: ''}, line: ['中高级', ' · 单打为主'], line2: '湖滨 · 常去湖滨运动馆', court: ['#e7b98a', '#c58450'], hl: 999},
];
const ProfileCard: React.FC<{d: typeof PROFILES[number]; f: number}> = ({d, f}) => {
  const h = ramp(f, d.hl, 7, EASE.smooth), deep = ramp(f, d.hl + 6, 4, EASE.smooth);
  return (
    <div style={{position: 'relative', width: 880, height: 560, borderRadius: 22, background: 'rgba(255,255,255,0.97)', boxShadow: '0 20px 50px rgba(80,90,130,0.10)', overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 210, background: `linear-gradient(120deg, ${d.court[0]}, ${d.court[1]})`}}>
        <svg width={880} height={210} style={{position: 'absolute'}}>
          <g stroke="rgba(255,255,255,0.75)" strokeWidth={4} fill="none"><rect x={330} y={30} width={500} height={150} /><line x1={580} y1={30} x2={580} y2={180} /><line x1={330} y1={60} x2={830} y2={60} /><line x1={330} y1={150} x2={830} y2={150} /><line x1={460} y1={60} x2={460} y2={150} /><line x1={700} y1={60} x2={700} y2={150} /></g>
          <line x1={580} y1={20} x2={580} y2={190} stroke="rgba(255,255,255,0.95)" strokeWidth={7} />
        </svg>
      </div>
      <div style={{position: 'absolute', left: 50, top: 130, borderRadius: 80, border: '7px solid #fff'}}><Avatar p={d.p} d={146} /></div>
      <div style={{position: 'absolute', left: 52, top: 306, display: 'flex', alignItems: 'center', gap: 14}}><span style={{fontSize: 40, fontWeight: 700, color: INK}}>{d.p.name}</span><PlatBadge s={34} /></div>
      <div style={{position: 'absolute', left: 52, top: 366, fontSize: 28, color: '#4a4f58', whiteSpace: 'pre'}}>
        <span style={{position: 'relative'}}>
          {h > 0.01 && <span style={{position: 'absolute', left: -4, top: -2, height: 40, width: `calc(${fx(h * 100)}% + 8px)`, borderRadius: 6, background: hexMix('#a9cdf6', BRAND, deep)}} />}
          <span style={{position: 'relative', color: deep > 0.5 ? '#fff' : undefined}}>{d.line[0]}</span>
        </span>
        {d.line[1]}
      </div>
      <div style={{position: 'absolute', left: 52, top: 412, fontSize: 24, color: SUB}}>{d.line2}</div>
      <div style={{position: 'absolute', left: 52, top: 470, display: 'flex', gap: 14}}>
        <div style={{padding: '10px 28px', borderRadius: 24, background: BRAND, color: '#fff', fontSize: 24, fontWeight: 600}}>＋ 关注</div>
        <div style={{padding: '8px 26px', borderRadius: 24, border: `2px solid ${BRAND}`, color: BRAND, fontSize: 24, fontWeight: 600}}>打个招呼</div>
        <div style={{padding: '8px 26px', borderRadius: 24, border: '2px solid #9aa0aa', color: '#6a707a', fontSize: 24}}>更多</div>
      </div>
      <div style={{position: 'absolute', left: 560, top: 300, fontSize: 24, color: '#4a4f58', lineHeight: '46px'}}>
        <div><span style={{display: 'inline-block', width: 18, height: 18, borderRadius: 5, background: '#f2a33a', marginRight: 12}} />周末球局群</div>
        <div><span style={{display: 'inline-block', width: 18, height: 18, borderRadius: 9, background: '#2fbf8f', marginRight: 12}} />城北羽毛球俱乐部</div>
      </div>
    </div>
  );
};
const S0: React.FC<{f: number}> = ({f}) => {
  const scroll = kf(f, [[0, 0], [38, -40, EASE.linear], [42, -560, EASE.linear], [52, -650, EOUT], [80, -700, EASE.linear]]);
  const blur = f >= 64 ? kf(f, [[64, 0], [70, 4, EIN], [75, 11, EASE.linear], [79, 18, EASE.linear]]) : f >= 38 && f < 43 ? 3 : 0;
  const sc = f >= 68 ? kf(f, [[68, 1], [79, 0.95, EIN]]) : 1;
  const tint = ramp(f, 70, 9, EASE.linear);
  const STRIDE = 650, top0 = 110;
  const swap = f >= 40;
  const wOut = ramp(f, 38, 3, EASE.linear);
  const wIn = ramp(f, 40, 6, EASE.out);
  const word2 = ramp(f, 2, 5, EASE.smooth);
  // 光标（内容坐标 → 屏幕：y + scroll）
  const ckeys: [number, number, number][] = [[0, 1010, top0 + 330], [6, 1020, top0 + 338], [14, 1090, top0 + 392], [24, 1100, top0 + 396], [34, 1430, top0 + 500], [38, 1432, top0 + 502], [46, 1180, top0 + STRIDE + 420], [52, 1150, top0 + STRIDE + 395], [80, 1160, top0 + STRIDE + 400]];
  const cx = kf(f, ckeys.map(([a, x]) => [a, x] as [number, number])), cyC = kf(f, ckeys.map(([a, , y]) => [a, y] as [number, number]));
  const cyPrev = kf(f - 1, ckeys.map(([a, , y]) => [a, y] as [number, number])), cxPrev = kf(f - 1, ckeys.map(([a, x]) => [a, x] as [number, number]));
  const rot = ang([cx - cxPrev, cyC - cyPrev]);
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      <AbsoluteFill style={{background: 'linear-gradient(110deg, #f6dfd6 0%, #ece0ea 38%, #dfe6f6 70%, #d3e6fb 100%)'}} />
      <AbsoluteFill style={{filter: 'blur(40px)'}}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: 200 + i * 420 + Math.sin(f / 50 + i) * 20, top: -300, width: 160, height: 1800, background: 'rgba(255,255,255,0.55)', transform: 'rotate(32deg)'}} />)}
      </AbsoluteFill>
      <AbsoluteFill style={{filter: blur > 0.2 ? `blur(${fx(blur)}px)` : undefined, transform: `scale(${sc.toFixed(4)})`}}>
        <div style={{position: 'absolute', left: 120, top: 505, fontSize: 48, fontWeight: 500, letterSpacing: '-0.01em', whiteSpace: 'pre', color: '#3a3d44'}}>
          {!swap ? (
            <span style={{opacity: 1 - wOut * 0.7, filter: wOut > 0 ? `blur(${fx(wOut * 6)}px)` : undefined}}>羽毛球<span style={{color: hexMix('#c4c7ce', '#3a3d44', word2), opacity: clamp(word2 * 2)}}> 中级</span></span>
          ) : (
            <span style={{opacity: wIn, color: hexMix('#c4c7ce', '#3a3d44', wIn), filter: wIn < 1 ? `blur(${fx((1 - wIn) * 5)}px)` : undefined}}>周末有空</span>
          )}
        </div>
        <div style={{position: 'absolute', left: 770, top: -40, width: 1000, height: 1160, borderRadius: 40, background: 'rgba(255,255,255,0.28)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.6)'}} />
        <div style={{position: 'absolute', left: 830, top: 0, transform: `translateY(${fx(scroll)}px)`}}>
          {PROFILES.map((d, i) => (
            <div key={i} style={{position: 'absolute', left: 0, top: top0 + i * STRIDE}}>
              <div style={{position: 'absolute', left: 0, top: -64, fontSize: 24, color: '#8a909a', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 12}}>
                <span style={{display: 'inline-block', width: 22, height: 22, borderRadius: 11, border: '3px solid #b0b5bd', borderTopColor: 'transparent', transform: `rotate(${(f * 14) % 360}deg)`}} />正在翻看 球友圈 上的资料…
              </div>
              <ProfileCard d={d} f={f} />
            </div>
          ))}
        </div>
        <Cursor x={cx} y={cyC + scroll} rot={rot} size={64} />
      </AbsoluteFill>
      {tint > 0 && <AbsoluteFill style={{background: '#e6eef8', opacity: tint * 0.45}} />}
      <Grain opacity={0.03} blend="overlay" />
    </AbsoluteFill>
  );
};

// ───────── S8 ─────────
const T2 = Array.from('每周六帮我约 2 个水平差不多的球友');
const T1 = Array.from('帮我找周末能一起打羽毛球的搭子');
const B2W = 820, B2H = 196;
const S8: React.FC<{f: number}> = ({f}) => {
  const cut = f >= 538;
  // 背景：比 S1 更近更亮；489 后拉露出更多植物，之后慢推；冲近后更近更虚
  const bz = cut ? kf(f, [[538, 1.5], [557, 1.52, EASE.linear], [567, 1.47, EASE.smooth], [575, 1.4, EIN]]) : kf(f, [[461, 1.12], [489, 1.07, EASE.linear], [493, 1.04, EIN], [497, 0.93, EASE.linear], [501, 0.91, EOUT], [537, 1.0, EASE.linear]]);
  const box = -kf(f, [[461, 0], [489, 30, EASE.linear]]) + (cut ? kf(f, [[557, 0], [567, 24, EASE.smooth], [575, 32, EASE.linear]]) : 0);
  // 金句
  const QW: [string, number][] = [['找到', 457], ['对的', 464], ['人', 468]];
  const qUp = kf(f, [[461, 6], [474, 0, EASE.linear], [489, -18, EASE.linear], [496, -60, EIN]]);
  const qSc = kf(f, [[474, 1], [489, 0.985, EASE.linear], [496, 0.95, EASE.smooth]]);
  const qO = 1 - ramp(f, 489, 8, EASE.smooth);
  // 搜索框 2
  let bx: number, by: number, bs: number, bb = 0, bo = 1;
  if (!cut) {
    bs = kf(f, [[493, 1.35], [497, 1.1, EOUT], [499, 1.1], [525, 1.52, EASE.linear], [537, 1.57, EOUT]]);
    const cyy = kf(f, [[493, 1200], [497, 586, EOUT], [499, 598, EASE.smooth], [525, 566, EASE.linear], [537, 560, EOUT]]);
    const cxx = kf(f, [[499, 960], [525, 932, EASE.linear], [537, 928, EOUT]]);
    bx = cxx - (B2W * bs) / 2; by = cyy - (B2H * bs) / 2;
    bb = kf(f, [[493, 10], [497, 4, EOUT], [501, 0, EASE.smooth]]);
    bo = kf(f, [[493, 0.55], [497, 1, EOUT]]);
  } else {
    bs = kf(f, [[538, 2.3], [557, 2.33, EASE.linear], [567, 2.24, EASE.smooth], [575, 2.1, EIN]]);
    bx = 950 - (B2W - 58) * bs + box; by = 545 - (B2H - 54) * bs + kf(f, [[538, 0], [575, 10, EASE.linear]]);
  }
  const n = f < 501 ? 0 : Math.min(T2.length, Math.floor((f - 501) / 3 + 1) * 2);
  const press = ramp(f, 546, 2, EASE.out) * (1 - ramp(f, 551, 3, EASE.out));
  const glass = ramp(f, 551, 3, EASE.out) * (1 - ramp(f, 556, 18, EASE.smooth));
  const sendX = bx + (B2W - 58) * bs, sendY = by + (B2H - 54) * bs;
  // 光标
  let cur: React.ReactNode = null;
  if (f >= 525 && !cut) {
    const x = kf(f, [[525, 360], [537, 420, EASE.linear]]), y = kf(f, [[525, 1120], [537, 930, EASE.out]]);
    cur = <Cursor x={x} y={y} rot={12} size={72} blur={3} opacity={0.85} vel={[0, -4]} />;
  } else if (cut) {
    const tx = sendX - 6, ty = sendY + 10;
    const arr = ramp(f, 538, 8, EOUT);
    const x = mix(560, tx, arr) + (f >= 571 ? 50 * ramp(f, 571, 4, EIN) : 0), y = mix(880, ty, arr);
    const xp = mix(560, tx, ramp(f - 1, 538, 8, EOUT)), yp = mix(880, ty, ramp(f - 1, 538, 8, EOUT));
    const rot = kf(f, [[538, 28], [546, 4, EOUT], [566, 2], [571, 45, EASE.smooth], [575, 90, EASE.smooth]]);
    cur = <Cursor x={x} y={y} rot={rot} size={96} press={press} vel={f < 546 ? [x - xp, y - yp] : [0, 0]} blur={f < 545 ? 2 * (1 - arr) : 0} />;
  }
  const tint = ramp(f, 571, 4, EIN);
  const shrink = 1 - 0.06 * tint;
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      <AbsoluteFill style={{transform: `scale(${fx(shrink)})`, filter: tint > 0 ? `contrast(${fx(1 - tint * 0.18)})` : undefined}}>
        <WallBg f={f} z={bz} ox={box * 0.3 + 90} oy={-qUp * 0.5 - 30 + (cut ? -120 : kf(f, [[489, 0], [493, -20, EIN], [497, -110, EASE.linear], [503, -120, EOUT]]))} bright={1} blur={cut ? 6 : 0} />
        {qO > 0.001 && (
          <div style={{position: 'absolute', left: 0, right: 0, top: 486 + qUp, textAlign: 'center', fontSize: 96, fontWeight: 500, letterSpacing: '-0.02em', whiteSpace: 'pre', transform: `scale(${fx(qSc)})`, opacity: qO, filter: f > 489 ? `blur(${fx(ramp(f, 489, 7) * 5)}px)` : undefined}}>
            {QW.map(([w, a], i) => { const q = ramp(f, a, 7, EASE.out); return <span key={i} style={{display: 'inline-block', opacity: clamp(q * 1.5), color: hexMix('#d2d3d7', '#6b6d73', q), transform: `translateY(${fx((1 - q) * 10)}px)`, filter: q < 0.98 ? `blur(${fx((1 - q) * 4)}px)` : undefined}}>{w}</span>; })}
          </div>
        )}
        {f >= 493 && (
          <div style={{position: 'absolute', left: bx, top: by, width: B2W, height: B2H, transform: `scale(${bs.toFixed(4)})`, transformOrigin: '0 0', opacity: bo, filter: bb > 0.2 ? `blur(${fx(bb)}px)` : undefined}}>
            <SearchBox w={B2W} h={B2H} text={T2.slice(0, n).join('')} placeholder={n === 0} caret={n > 0 && Math.floor(f / 8) % 2 === 0 && f < 546} sendOn={mix(0.55, 1, n / T2.length)} press={press} glass={glass} />
          </div>
        )}
        {cur}
      </AbsoluteFill>
      {tint > 0 && <AbsoluteFill style={{background: '#b8dcf2', opacity: tint * 0.5}} />}
      <Grain opacity={0.03} blend="overlay" />
    </AbsoluteFill>
  );
};

// ───────── 主组件 ─────────
export const SearchPickShortlist: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 79) return <S0 f={f} />;
  if (f >= 461) return <S8 f={f} />;

  const cam = worldCam(f);
  // 背景：S1–S2 白墙；S3 提亮去色成冷白；S6 起接近纯白
  const cool = kf(f, [[141, 0], [152, 0.72, EASE.smooth], [165, 0.86, EASE.smooth], [339, 0.86], [352, 0.94, EASE.smooth], [450, 0.94], [460, 0.8, EIN]]);
  const bgBlur = kf(f, [[79, 10], [92, 0, EOUT]]);
  // 搜索框（S1 对焦进场、S3 被中间一排替换）
  const b1 = ramp(f, 79, 11, EOUT), b2 = ramp(f, 90, 12, EASE.smooth);
  const boxSc = mix(1.19, 1, b1) * (1 - 0.03 * ramp(f, 160, 3, EASE.linear));
  const boxO = (mix(0.3, 0.7, b1) + 0.3 * b2) * (1 - ramp(f, 161, 3, EASE.linear));
  const boxBlur = mix(12, 4, b1) * (1 - b2);
  const typed = f < 111 ? 0 : Math.min(T1.length, [2, 4, 7, 9, 12, 15][Math.min(5, Math.floor((f - 111) / 3))]);
  const sendOn = clamp(typed / T1.length);
  const press1 = ramp(f, 135, 2, EASE.out) * (1 - ramp(f, 141, 4, EASE.out));
  // 卡片
  const midIn = ramp(f, 160, 4, EASE.out), outerIn = ramp(f, 173, 8, EASE.smooth);
  const camAt237 = worldCam(237);
  const cards = KEYS.map((k) => {
    const [r] = parseK(k);
    if (f < 141) return null;
    const pose = cardPose(k, f);
    let o = pose.o;
    let sc = pose.sc;
    if (r === 0) { o *= midIn; sc *= mix(0.95, 1, midIn); }
    if (Math.abs(r) === 2) o *= outerIn;
    if (o <= 0.003) return null;
    const isFinal = FINALS.includes(k);
    const [sx, sy] = w2s(cam, pose.p[0], pose.p[1]);
    const d = Math.max(Math.abs(sx - 960) / 1000, Math.abs(sy - 540) / 580);
    let blur = sstep(0.42, 1.05, d) * 8 + (Math.abs(r) === 2 ? (1 - outerIn) * 6 : 0) + (r === 0 ? (1 - midIn) * 4 : 0);
    let op = 1 - sstep(0.5, 1.1, d) * 0.45;
    if (isFinal) { const z = ramp(f, 240, 10, EASE.smooth); blur *= 1 - z; op = mix(op, 1, z); }
    else if (f >= 237) {
      const [gx, gy] = w2s(camAt237, gridPos(k, 237)[0], gridPos(k, 237)[1]);
      const outer = Math.max(Math.abs(gx - 960) / 960, Math.abs(gy - 540) / 540);
      const start = k === EMMA ? 249 : k === JAMES ? 245 : 237 + Math.round(clamp(1 - outer) * 7 + clamp(1 - gy / 1080) * 5);
      const g = ramp(f, start, 9, EASE.smooth);
      blur = mix(blur, 9, g);
      op = mix(op, 0.27, g) * (1 - ramp(f, 339, 12, EASE.smooth));
      // 318 背景虚卡往四周散开一点
      const spread = ramp(f, 318, 12, EASE.smooth) * 0.06;
      pose.p = [pose.p[0] + (pose.p[0] - cam.cx) * spread, pose.p[1] + (pose.p[1] - cam.cy) * spread];
    }
    if (op * o <= 0.003) return null;
    const z = isFinal ? (k === HANNAH ? 30 : k === LUCAS ? 20 : 10) : 0;
    return (
      <div key={k} style={{position: 'absolute', left: pose.p[0] - CW / 2, top: pose.p[1] - CH / 2, width: CW, height: CH, transform: `scale(${sc.toFixed(4)})`, transformOrigin: `${CW / 2}px ${CH / 2}px`, opacity: o * op, filter: blur > 0.25 ? `blur(${fx(blur / Math.max(0.3, cam.s))}px)` : undefined, zIndex: z}}>
        <PersonCard k={k} v={selVis(k, f)} />
      </div>
    );
  });
  // 标题（S7）
  const TW = ['找到。', '看懂。', '约上。'];
  const titleTop = pTop + 190 - 340;
  // 光标
  const curs = CURSORS.map((c, i) => {
    if (f < c.on || f > c.off) return null;
    const wp = pathAt(c.keys, f, f);
    const [x, y] = w2s(cam, wp[0], wp[1]);
    const prevCam = worldCam(f - 1);
    const pp = pathAt(c.keys, f - 1, f - 1);
    const [xp, yp] = w2s(prevCam, pp[0], pp[1]);
    const rot = headingAt(c.keys, f, c.def, 3) + cam.rot;
    const pr = PRESSES[i].reduce((a, [s0, s1]) => Math.max(a, ramp(f, s0, 2, EASE.out) * (1 - ramp(f, s1, 3, EASE.out))), 0);
    const op = ramp(f, c.on, 3, EASE.out) * (1 - ramp(f, c.fadeOut, c.off - c.fadeOut, EASE.smooth));
    const size = mix(70, 64, ramp(f, 141, 20, EASE.smooth));
    return <Cursor key={i} x={x} y={y} rot={rot} press={pr} opacity={op} size={size} vel={[x - xp, y - yp]} />;
  });
  const pullBlur = f >= 455 ? ramp(f, 455, 6, EIN) * 3 : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      <WallBg f={f} cool={cool} blur={bgBlur} ox={kf(f, [[79, 20], [141, -40, EASE.linear], [460, -160, EASE.linear]])} z={kf(f, [[79, 1.05], [141, 1.0, EASE.linear]])} />
      <AbsoluteFill style={{filter: pullBlur > 0.2 ? `blur(${fx(pullBlur)}px)` : undefined}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformOrigin: '0 0', transform: `translate(960px, 540px) rotate(${cam.rot.toFixed(3)}deg) scale(${cam.s.toFixed(5)}) translate(${fx(-cam.cx)}px, ${fx(-cam.cy)}px)`}}>
          <Shortlist f={f} />
          {boxO > 0.003 && (
            <div style={{position: 'absolute', left: -BW / 2, top: -BH / 2, width: BW, height: BH, transform: `scale(${boxSc.toFixed(4)})`, transformOrigin: '50% 50%', opacity: boxO, filter: boxBlur > 0.2 ? `blur(${fx(boxBlur)}px)` : undefined}}>
              <SearchBox w={BW} h={BH} text={T1.slice(0, typed).join('')} placeholder={f < 108} caret={f >= 108 && f < 141 && Math.floor(f / 7) % 2 === 0} sendOn={sendOn} press={press1} textO={1 - ramp(f, 160, 2, EASE.linear)} />
            </div>
          )}
          {cards}
          {f >= 408 && (
            <div style={{position: 'absolute', left: pLeft + 10, top: titleTop, fontSize: 240, fontWeight: 600, letterSpacing: '-0.03em', whiteSpace: 'pre', fontFamily: SANS, lineHeight: 1}}>
              {TW.map((w, i) => { const q = ramp(f, 411 + i * 6, 14, EASE.out); return <span key={i} style={{display: 'inline-block', opacity: clamp(q * 1.4), color: hexMix('#d5d8dd', '#15171b', q), transform: `translateY(${fx((1 - q) * 18)}px)`, filter: q < 0.98 ? `blur(${fx((1 - q) * 7)}px)` : undefined}}>{w}</span>; })}
            </div>
          )}
        </div>
        {curs}
      </AbsoluteFill>
      <Grain opacity={0.03} blend="overlay" />
    </AbsoluteFill>
  );
};
