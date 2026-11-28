// 打一句话找下一位销售负责人 → 脉脉资料卡分行交错滑进来铺满 → 多光标点选 → 选中的 3 张展开详情 → 收成候选人名单 → 三词标题 → 金句 → 再打一句、冲近点发送（003-S3 整段）
// 学的动作（Polar 003-S3；2026-11-16 按新标准逐帧重量）：
//   一个连续的"镜头呼吸"：每拍 = 0.1–0.3 秒快动作 + 0.5–1.5 秒很慢但不停的漂；状态切换靠同一批元素自己变形
//   （搜索框被中间一排卡挤走 → 选中的卡留下展开 → 缩成小条 → 落进表格变骨架 → 填字）；
//   硬切只有 3 处，都藏在失焦 / 后拉最快 / 冲近的那一帧里。光标转向移动方向、贴着内容走。
// 2026-11-16 重做（10 条细节标准）：
//   - 内容本地化成脉脉找人：真人头像（library/faces，每张不同）、左上角脉脉官方图标、姓名后浅蓝灰「V」认证标、
//     第一行「职位 · 公司」、第二行「城市 | 工作年限 | 学历」（公司名是虚构的）
//   - 网格按原片逐帧量：卡片 600×222（7.05s 时屏幕像素）、列距 641、行距 245、整体逆时针 4.75°；四周虚、中间清；
//     每张卡有前后层（大小 0.93–1.0、后层更虚更淡、投影压到下面的卡）
//   - 镜头按原片量：5.0–5.87 卡片层几乎不缩放（行距 212→218），只有搜索框自己缩窄；5.88–5.97 是"转 4.75° + 推近 12%"，
//     不是后拉；6.0–7.9 用 ECC 逐帧测的相似变换；每一排的横向位移（整排一起走）也按逐帧检测到的卡片位置拟合
//   - 背景：冷白柔光 + 斜向布纹光影；卡片半透明磨砂玻璃
//
// 时间表（30fps，共 575f）
//   S0   0–66   上一镜头尾巴：左边筛选词换词（企业服务 → 企业服务 SaaS → 上海），右边脉脉资料卡慢滚、38f 猛跳下一张，蓝色选中底刷过
//   S1  66–102  整屏失焦 0→15px、轻缩 3.5%；79f 硬切白墙背景（一出来就是虚的），搜索框 1.19→1 倍、透明→实、虚→清；91f 光标从底边进
//   S2 102–141  打字块状蹦出，发送键随字数变饱和；光标转身横移到发送键（120–134）、按下缩 8%
//   S3 141–180  搜索框缩小（4.7–5.0 整体缩到 0.82，5.1–5.43 右边往回收），上排整排从右往左、下排从左往右"嗖"地滑进（5.27–5.37 最快、5.4 急停后慢漂）；
//               5.44 搜索框被中间一排从右边挤走、淡掉；176–179 转 4.75° + 推近，上下两排从两侧滑进
//   S4 180–240  4 个光标错开点选：悬停浅蓝 → 按下深蓝内容变淡、微放大 → 松开浅蓝 + 角点选框；马骏选了又退选、何欣只悬停
//   S5 237–339  没选中的从外圈/下面一层层退成背景虚影；倾斜归零；3 张摆正散开、字段每帧一行往下长；"高度匹配"错开弹出；光标依次离场
//   S6 339–411  虚影淡掉变白底；名单面板在卡后面淡入；字段从下往上收、卡缩成小条竖叠；一条条落进表格 → 浅蓝骨架条 → 扫光填字 → 绿勾
//   S7 411–461  "找到。看懂。约上。"逐词浮现；停住极慢后拉；450 起缓入加速后拉
//   S8 461–575  硬切白墙；金句"找到对的人"逐词上浮；新搜索框从下冲上来；打第二句 + 慢推；冲近发送键（硬切）、按下、玻璃高光；泛冷蓝
// 毛病清单（本镜头独有）：
//   - 卡片必须是"整排左右交错滑入"，不能放射炸开；搜索框被中间一排挤走，不是原地淡出
//   - 光标贴着各自的卡（卡在漂，光标跟着漂），朝向只看"光标自己的移动"，不被镜头运动带偏
//   - 收名单的中间态（小条竖叠 → 落 → 骨架 → 扫光 → 勾）一步都不能省
//   - 整片没有一帧静止：每段都叠了慢推 / 慢漂
//   - 头像每张不同、名字和脸一一对应；素材只用 library 里合适的，不凑合
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {EASE, FONT, Grain, bezier, mix, ramp} from '../../../assets/lib/helpers/polish';
import {mk} from '../../groups/_kit/darkUiKit';

export const SEARCH_PICK_SHORTLIST_DURATION = 575;

const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const INK = '#1d1f23';
const SUB = '#8d939d';
const CYAN = '#09caec';
const MM = '#0052ff'; // 脉脉主色（官方图标取色）
const MM_V = '#a9b6dc'; // 脉脉「V」认证标的浅蓝灰
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
      {cool > 0 && (
        <AbsoluteFill style={{opacity: cool, overflow: 'hidden'}}>
          {/* 冷白底上的柔和布纹光影：几道很宽的斜向亮带 / 暗带 + 极淡的织纹 */}
          {Array.from({length: 6}, (_, i) => (
            <div key={i} style={{position: 'absolute', left: -300 + i * 420 + sway * 0.8, top: -600, width: 150 + hash(i, 5) * 160, height: 2400, background: i % 2 ? 'rgba(255,255,255,0.7)' : 'rgba(176,190,214,0.16)', transform: 'rotate(34deg)', filter: 'blur(46px)'}} />
          ))}
          <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(34deg, rgba(150,165,190,0.035) 0px, rgba(150,165,190,0.035) 1.5px, transparent 1.5px, transparent 7px), repeating-linear-gradient(-56deg, rgba(150,165,190,0.025) 0px, rgba(150,165,190,0.025) 1.5px, transparent 1.5px, transparent 9px)'}} />
        </AbsoluteFill>
      )}
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

// ───────── 人物数据（脉脉找人：真人头像 + 职位 · 公司 + 城市 | 年限 | 学历；公司名虚构） ─────────
type Person = {name: string; face: string; title: string; co: string; city: string; yrs: number; edu: string};
const P = (name: string, face: string, title: string, co: string, city: string, yrs: number, edu = '本科'): Person => ({name, face, title, co, city, yrs, edu});
const PEOPLE: Record<string, Person> = {
  '-2,-1': P('周敏', 'f13', '客户成功负责人', '青橙云', '上海', 6),
  '-2,0': P('林嘉怡', 'f03', '销售总监', '星图数据', '上海', 9, '硕士'),
  '-2,1': P('陈浩', 'm17', '解决方案销售', '数联智能', '深圳', 5),
  '-2,2': P('王思远', 'm07', '销售副总裁', '北辰软件', '北京', 15, '硕士'),
  '-1,-1': P('张伟', 'm01', '商务拓展总监', '远航信息', '杭州', 10),
  '-1,0': P('李静', 'f07', '渠道销售经理', '汇智云', '上海', 7),
  '-1,1': P('赵子轩', 'm11', '大客户经理', '云帆科技', '杭州', 7),
  '-1,2': P('孙悦', 'f10', 'SaaS 销售', '拓扑云', '广州', 4),
  '0,-1': P('刘洋', 'm12', '销售运营经理', '方舟科技', '北京', 6),
  '0,0': P('吴雪', 'f11', '区域销售经理', '澜海科技', '上海', 8),
  '0,1': P('黄磊', 'm13', '行业销售总监', '天穹数据', '北京', 12, '硕士'),
  '0,2': P('何欣', 'f04', '销售主管', '知行软件', '深圳', 5),
  '1,-1': P('郑凯', 'm14', '销售工程师', '晨曦智能', '杭州', 4),
  '1,0': P('许晴', 'f08', '区域销售负责人', '极光云', '上海', 6),
  '1,1': P('马骏', 'm15', '大客户销售', '纵横网络', '上海', 8),
  '1,2': P('高敏', 'f01', '销售总监', '领航互联', '北京', 11),
  '2,-1': P('罗晨', 'm03', '客户经理', '万象云', '广州', 3),
  '2,0': P('唐薇', 'f15', '商务经理', '卓越企服', '深圳', 5),
  '2,1': P('冯涛', 'm04', '销售经理', '博越软件', '上海', 7),
  '2,2': P('曹琳', 'f06', '销售顾问', '深蓝智造', '杭州', 4),
};
const KEYS = Object.keys(PEOPLE);
const OLIVIA = '-2,0', LUCAS = '-1,1', HANNAH = '1,0', EMMA = '-1,0', JAMES = '1,1', GRACE = '0,2';
const FINALS = [OLIVIA, LUCAS, HANNAH];
const faceSrc = (id: string) => staticFile(`library/faces/${id}.jpg`);
const MM_ICON = staticFile('library/brands/maimai/app-icon_1024.png');

type Row = [string, string];
const DETAIL: Record<string, {rows: Row[]; tag: number}> = {
  [OLIVIA]: {rows: [['当前职位', '销售总监 · 星图数据'], ['工作年限', '9 年'], ['任职经历', '星图数据 2021–至今'], ['', '数联智能 2017–2021'], ['所在城市', '上海'], ['擅长', '大客户 · 企业服务']], tag: 1},
  [LUCAS]: {rows: [['当前职位', '大客户经理 · 云帆科技'], ['工作年限', '7 年'], ['任职经历', '云帆科技 2022–至今'], ['', '博越软件 2019–2022'], ['', '远航信息 2017–2019'], ['所在城市', '杭州'], ['擅长', '金融行业客户']], tag: 6},
  [HANNAH]: {rows: [['当前职位', '区域销售负责人 · 极光云'], ['工作年限', '6 年'], ['任职经历', '极光云 2020–至今'], ['', '汇智云 2018–2020'], ['所在城市', '上海'], ['擅长', '渠道拓展 · 带团队']], tag: 0},
};

// ───────── 头像 / 小标（尺寸都按"卡片本地像素"，卡片 600×222） ─────────
const Avatar: React.FC<{face: string; d: number; ring?: number; online?: boolean}> = ({face, d, ring = 0, online = false}) => (
  <div style={{position: 'relative', width: d, height: d, flexShrink: 0}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', background: '#e9edf3', boxShadow: ring ? `0 0 0 ${ring}px rgba(255,255,255,0.95), 0 6px 16px rgba(60,80,120,0.16)` : undefined}}>
      <Img src={faceSrc(face)} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
    </div>
    {online && <div style={{position: 'absolute', right: d * 0.04, bottom: d * 0.04, width: d * 0.16, height: d * 0.16, borderRadius: '50%', background: '#22b866', boxShadow: `0 0 0 ${Math.max(2, d * 0.03)}px #fff`}} />}
  </div>
);
const MmIcon: React.FC<{s: number}> = ({s}) => (
  <Img src={MM_ICON} style={{width: s, height: s, borderRadius: s * 0.225, display: 'block', boxShadow: '0 2px 6px rgba(0,60,200,0.18)'}} />
);
const VMark: React.FC<{s: number}> = ({s}) => (
  <svg width={s} height={s} viewBox="0 0 20 20" style={{display: 'inline-block', flexShrink: 0}}><rect x={0.5} y={0.5} width={19} height={19} rx={4.5} fill={MM_V} /><path d="M5.6 6.2 L10 14.2 L14.4 6.2" stroke="#fff" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Check: React.FC<{s: number; color?: string; bg?: string}> = ({s, color = '#fff', bg = MM}) => (
  <svg width={s} height={s} viewBox="0 0 20 20"><circle cx={10} cy={10} r={10} fill={bg} /><path d="M5.5 10.3 L8.6 13.2 L14.5 7.2" stroke={color} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Sep: React.FC = () => <span style={{display: 'inline-block', width: 1.5, height: '0.8em', background: '#d3d7de', margin: '0 0.55em', verticalAlign: '-0.05em'}} />;

// ───────── 人物卡（本地 600×222 像素，放进世界时整体乘 K；详情字段往下长） ─────────
const K = 1.3467; // 世界单位 / 7.05s 屏幕像素（7.05s 时镜头 s = 1/K）
const CWs = 600, CHs = 222, ROWHs = 40;
const CW = CWs * K, CH = CHs * K;
type CardVis = {hover: number; press: number; sel: number; handles: number; expand: number; tag: number; bgA: number; bio: number};
const V0: CardVis = {hover: 0, press: 0, sel: 0, handles: 0, expand: 0, tag: 0, bgA: 1, bio: 1};
const PersonCard: React.FC<{k: string; v: CardVis}> = ({k, v}) => {
  const p = PEOPLE[k];
  const det = DETAIL[k];
  const rows = det ? det.rows : [];
  const vis = rows.map((_, i) => clamp(v.expand - i));
  const extra = vis.reduce((a, b) => a + b, 0) * ROWHs + 22 * clamp(v.expand);
  const act = Math.max(v.hover, v.sel, v.press);
  const contentO = clamp(1 - v.press * 0.6 - v.sel * 0.3);
  return (
    <div style={{position: 'relative', width: CWs, height: CHs + extra, fontFamily: SANS, transform: v.press > 0.01 ? `scale(${fx(1 + v.press * 0.025)})` : undefined, transformOrigin: `${CWs / 2}px ${CHs / 2}px`}}>
      {/* 磨砂玻璃：半透明白 + 顶部高光 + 1.5px 白描边 + 往下压的柔投影 */}
      <div style={{position: 'absolute', inset: 0, borderRadius: 18, background: `linear-gradient(180deg, rgba(255,255,255,${fx(0.8 * v.bgA)}) 0%, rgba(250,252,255,${fx(0.62 * v.bgA)}) 100%)`, boxShadow: `0 22px 44px rgba(64,88,130,${fx(0.12 * v.bgA)}), 0 4px 10px rgba(64,88,130,${fx(0.05 * v.bgA)}), inset 0 0 0 1.5px rgba(255,255,255,${fx(0.95 * v.bgA)}), inset 0 1.5px 0 rgba(255,255,255,${fx(v.bgA)})`}} />
      <div style={{position: 'absolute', left: CWs * 0.58, top: 0, width: 70, height: CHs, background: `linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,${fx(0.45 * v.bgA)}), rgba(255,255,255,0))`, borderRadius: 18}} />
      {act > 0.01 && <div style={{position: 'absolute', inset: 0, borderRadius: 18, background: `rgba(205,226,252,${fx(v.hover * 0.45 + v.sel * 0.8)})`, boxShadow: `inset 0 0 0 1.5px rgba(120,170,240,${fx(act)})`}} />}
      {v.press > 0.01 && <div style={{position: 'absolute', inset: 0, borderRadius: 18, background: `rgba(160,198,248,${fx(v.press * 0.95)})`}} />}
      <div style={{position: 'absolute', left: 25, top: 23, opacity: 0.4 + contentO * 0.6}}><MmIcon s={40} /></div>
      <div style={{position: 'absolute', left: 64, top: 59, opacity: contentO}}><Avatar face={p.face} d={130} ring={4} /></div>
      <div style={{position: 'absolute', left: 224, top: 42, display: 'flex', alignItems: 'center', gap: 10, opacity: contentO, whiteSpace: 'nowrap'}}>
        <span style={{fontSize: 44, lineHeight: '56px', fontWeight: 600, color: INK, letterSpacing: '0.01em'}}>{p.name}</span>
        <VMark s={25} />
      </div>
      <div style={{position: 'absolute', left: 226, top: 98, fontSize: 27, lineHeight: '34px', color: '#3e434c', whiteSpace: 'nowrap', opacity: contentO * v.bio}}>{p.title} · {p.co}</div>
      <div style={{position: 'absolute', left: 226, top: 140, fontSize: 23, lineHeight: '30px', color: '#959ba5', whiteSpace: 'nowrap', opacity: contentO * v.bio}}>{p.city}<Sep />工作 {p.yrs} 年<Sep />{p.edu}</div>
      <div style={{position: 'absolute', left: CWs - 33, top: CHs - 52, opacity: 0.5 + contentO * 0.5}}><Check s={30} /></div>
      {rows.map(([label, val], i) => {
        const o = vis[i];
        if (o <= 0.01) return null;
        const y = CHs - 4 + rows.slice(0, i).reduce((a, _, j) => a + vis[j], 0) * ROWHs;
        const isTag = det && det.tag === i;
        const t = v.tag;
        return (
          <div key={i} style={{position: 'absolute', left: 64, top: y, height: ROWHs, display: 'flex', alignItems: 'center', fontSize: 22, whiteSpace: 'nowrap', opacity: o, transform: `translateY(${fx((1 - o) * -8)}px)`}}>
            <div style={{width: 16, height: 16, borderRadius: 5, border: `2px solid ${label ? '#9aa1ac' : 'transparent'}`, marginRight: 16}} />
            <div style={{width: 118, color: '#6b717c', fontWeight: 500}}>{label}</div>
            <div style={{color: label ? '#2f343c' : '#5d636d'}}>{val}</div>
            {isTag && t > 0.01 && (
              <div style={{marginLeft: 16, padding: '3px 12px', borderRadius: 16, background: `rgba(224,246,234,${fx(t)})`, color: hexMix('#bfe8d2', '#1f9e62', t), fontSize: 21, fontWeight: 600, opacity: clamp(t * 1.6), transform: `scale(${fx(mix(0.88, 1, t))})`, filter: t < 0.98 ? `blur(${fx((1 - t) * 4)}px)` : undefined}}>高度匹配</div>
            )}
          </div>
        );
      })}
      {v.handles > 0.01 && (
        <div style={{position: 'absolute', left: -8, top: -8, right: -8, bottom: -8, border: `1.5px solid rgba(110,170,236,${fx(v.handles)})`, borderRadius: 4}}>
          {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, b], i) => <div key={i} style={{position: 'absolute', left: a ? undefined : -6, right: a ? -6 : undefined, top: b ? undefined : -6, bottom: b ? -6 : undefined, width: 10, height: 10, background: '#fff', border: `1.5px solid rgba(110,170,236,${fx(v.handles)})`}} />)}
        </div>
      )}
    </div>
  );
};

// ───────── 网格（世界坐标；7.05s 时镜头中心 = 原点）：列距 863、行距 329，第 0 列中心 x = -374 ─────────
const PX = 863, PY = 329, X0 = -374;
const parseK = (k: string) => k.split(',').map(Number) as [number, number];
// 每一排整排的横向位移（世界单位），按原片逐帧检测到的徽标位置拟合（t = 秒）
const ROW_D: Record<number, number[][]> = {
  [-1]: [[4.7, 3000], [4.8, 2753], [4.867, 2720], [4.933, 2653], [4.967, 2589], [5.0, 2518], [5.067, 2429], [5.1, 2327], [5.133, 2204], [5.167, 2058], [5.2, 1882], [5.267, 1339], [5.333, 643], [5.367, 243], [5.4, 233], [5.467, 182], [5.533, 117], [5.6, 67], [5.667, 53], [5.7, 40], [5.733, 29], [5.767, 19], [5.8, 16], [5.867, 10], [5.9, 4], [5.933, 4], [6.0, 9], [6.1, 8], [6.2, 4], [6.3, 2], [6.4, 0]],
  1: [[4.7, -3050], [4.8, -2950], [4.9, -2900], [5.0, -2625], [5.1, -2424], [5.133, -2299], [5.167, -2149], [5.2, -1964], [5.267, -1410], [5.333, -702], [5.367, -309], [5.4, -296], [5.467, -242], [5.5, -205], [5.533, -178], [5.6, -140], [5.667, -116], [5.7, -103], [5.733, -95], [5.767, -89], [5.8, -84], [5.867, -77], [5.9, -70], [5.933, -59], [5.967, -36], [6.0, -28], [6.067, -22], [6.1, -18], [6.133, -17], [6.2, -12], [6.267, -10], [6.3, -8], [6.333, -4], [6.4, -1.3], [6.5, -0.5], [6.6, 0]],
  0: [[5.433, 2700], [5.5, 2600], [5.533, 625], [5.567, 318], [5.6, 231], [5.667, 180], [5.7, 142], [5.733, 110], [5.767, 92], [5.8, 74], [5.867, 59], [5.9, 48], [5.933, 46], [6.067, 37], [6.133, 29], [6.2, 21], [6.267, 18], [6.333, 11], [6.4, 10], [6.467, 4], [6.6, 2], [7.0, 0]],
  2: [[5.867, 1300], [5.933, 600], [5.967, 339], [6.0, 256], [6.067, 207], [6.1, 172], [6.133, 145], [6.167, 124], [6.2, 107], [6.267, 92], [6.3, 80], [6.333, 70], [6.367, 63], [6.4, 55], [6.467, 44], [6.5, 39], [6.533, 34], [6.567, 29], [6.6, 25], [6.7, 20], [6.8, 16], [7.0, 14]],
};
ROW_D[-2] = ROW_D[2].map(([t, d]) => [t, -d]);
// 每张卡的前后层（用户要的错落 / 前后层次）：0 前、1 中、2 后；选中的几张都在前层
const DEPTH: Record<string, number> = {};
KEYS.forEach((k, i) => { const h = hash(i, 7); DEPTH[k] = [OLIVIA, LUCAS, HANNAH, EMMA, JAMES, GRACE].includes(k) ? 0 : h < 0.4 ? 0 : h < 0.75 ? 1 : 2; });
const DEPTH_SC = [1, 0.965, 0.93];
const JIT_Y: Record<string, number> = {};
KEYS.forEach((k, i) => { JIT_Y[k] = FINALS.includes(k) ? 0 : (hash(i, 3) - 0.5) * 22; });
const gridPos = (k: string, f: number): V2 => {
  const [r, c] = parseK(k);
  const t = f / 30;
  const D = mk(t, ROW_D[r]);
  return [X0 + c * PX + D, r * PY + JIT_Y[k] + Math.sin(f / 40 + r) * 3];
};

// ───────── 镜头 ─────────
type Cam = {cx: number; cy: number; s: number; rot: number};
// 旧镜头（S1–S2 用；S5 之后的世界坐标也沿用它，经 Q / DX / DY 换算进新世界）
const oldCam = (f: number, wobble = true): Cam => {
  const s = kf(f, [[79, 0.982], [141, 1.022, EASE.linear], [144, 0.95, EIN], [148, 0.86, EASE.linear], [152, 0.78, EASE.linear], [157, 0.71, EASE.linear], [161, 0.66, EOUT], [176, 0.615, EASE.linear], [179, 0.545, EASE.linear], [200, 0.522, EOUT], [237, 0.512, EASE.linear], [240, 0.485, EOUT], [258, 0.5, EASE.smooth], [318, 0.535, EASE.linear], [324, 0.506, EASE.smooth], [339, 0.545, EASE.swift], [358, 0.575, EASE.linear], [364, 0.52, EASE.smooth], [408, 0.55, EASE.linear], [448, 0.575, EASE.linear], [451, 0.572, EASE.smooth], [454, 0.555, EIN], [460, 0.41, EACC]]);
  const cx = kf(f, [[79, -24], [141, 16, EASE.linear], [161, -60, EOUT], [176, -80, EASE.linear], [179, -20, EASE.linear], [200, 0, EOUT], [229, 40, EASE.linear], [237, 45, EASE.linear], [240, 45], [262, 0, EASE.smooth], [318, 10, EASE.linear], [324, -30, EASE.smooth], [339, -35, EASE.linear], [364, -30, EASE.smooth], [460, -30]]);
  const cy = kf(f, [[79, 12], [141, -10, EASE.linear], [161, 40, EOUT], [176, 60, EASE.linear], [179, 0, EASE.linear], [200, 0, EOUT], [229, 40, EASE.linear], [237, 75, EIN], [240, 160, EOUT], [262, -200, EASE.smooth], [318, -212, EASE.linear], [339, -220, EASE.linear], [364, -230, EASE.smooth], [378, -262, EASE.linear], [408, -235, EASE.smooth], [430, -150, EASE.smooth], [450, -140, EASE.linear], [460, -150]]);
  if (!wobble) return {cx, cy, s, rot: 0};
  return {cx: cx + Math.sin(f / 37) * 4, cy: cy + Math.cos(f / 43) * 3, s: s * (1 + Math.sin(f / 29) * 0.0015), rot: 0};
};
// 原片逐帧测的镜头：141–178 卡片层（行距算缩放、行斜率算转角）；179–258 ECC（相对 7.05s 帧的相似变换）
const PRE_S = [[4.7, 0.85], [4.8, 0.8], [4.933, 0.713], [4.967, 0.676], [5.0, 0.667], [5.1, 0.659], [5.2, 0.652], [5.4, 0.646], [5.533, 0.646], [5.6, 0.65], [5.7, 0.653], [5.8, 0.657], [5.867, 0.6626], [5.9, 0.6705], [5.933, 0.6927]];
const PRE_R = [[5.0, 0], [5.5, -0.1], [5.6, -0.25], [5.667, -0.45], [5.733, -0.7], [5.8, -0.9], [5.867, -1.1], [5.9, -1.5], [5.933, -2.3]];
const ECC: number[][] = [[5.933, 0.6927, -2.3, 11, -10], [5.967, 0.718, -3.22, 11.2, -10.0],[6.0, 0.7261, -3.709, 7.5, -8.1],[6.067, 0.73, -3.943, 5.3, -7.0],[6.1, 0.7326, -4.096, 4.0, -6.0],[6.133, 0.7346, -4.209, 2.9, -5.2],[6.167, 0.7363, -4.302, 2.4, -4.5],[6.2, 0.7376, -4.377, 1.8, -3.9],[6.267, 0.7387, -4.446, 1.3, -3.3],[6.3, 0.7396, -4.505, 0.9, -2.8],[6.333, 0.7404, -4.562, 0.5, -2.3],[6.367, 0.7412, -4.598, 0.3, -2.0],[6.4, 0.7418, -4.626, 0.2, -1.7],[6.467, 0.7424, -4.642, 0.2, -1.6],[6.533, 0.743, -4.663, 0.1, -1.3],[6.6, 0.7436, -4.682, 0.0, -1.1],[6.8, 0.7436, -4.692, -0.0, -0.9],[6.9, 0.7433, -4.703, -0.1, -0.6],[6.933, 0.7431, -4.714, -0.1, -0.5],[6.967, 0.7429, -4.729, -0.1, -0.3],[7.0, 0.7428, -4.742, -0.0, -0.1],[7.1, 0.7424, -4.762, 0.0, 0.1],[7.267, 0.7418, -4.758, 0.4, 0.7],[7.3, 0.7414, -4.759, 0.8, 1.1],[7.333, 0.7412, -4.761, 1.4, 1.5],[7.367, 0.741, -4.763, 2.2, 2.0],[7.4, 0.7407, -4.752, 3.1, 2.8],[7.467, 0.7405, -4.736, 4.0, 3.6],[7.5, 0.7402, -4.714, 5.1, 4.8],[7.533, 0.7398, -4.685, 6.5, 6.0],[7.567, 0.7394, -4.647, 8.1, 7.5],[7.6, 0.7388, -4.604, 10.2, 9.2],[7.667, 0.738, -4.558, 12.6, 11.1],[7.7, 0.7371, -4.498, 15.7, 13.4],[7.733, 0.736, -4.432, 19.4, 16.0],[7.767, 0.7346, -4.349, 23.9, 19.1],[7.8, 0.733, -4.246, 29.4, 23.0],[7.867, 0.7309, -4.12, 36.3, 27.6],[7.9, 0.7282, -3.953, 45.9, 34.2],[7.933, 0.7235, -3.652, 60.1, 45.5],[7.967, 0.7137, -2.896, 84.6, 69.5],[8.0, 0.7042, -2.288, 106.0, 89.4],[8.067, 0.7016, -2.094, 115.7, 91.7],[8.1, 0.7019, -1.986, 121.7, 87.7],[8.133, 0.704, -1.951, 125.4, 80.0],[8.167, 0.7048, -1.92, 126.8, 74.8],[8.2, 0.7046, -1.853, 127.5, 71.3],[8.267, 0.7047, -1.768, 126.6, 66.7],[8.3, 0.7048, -1.625, 125.8, 63.3],[8.333, 0.7053, -1.486, 123.3, 59.5],[8.367, 0.7064, -1.363, 119.1, 55.9],[8.4, 0.7073, -1.262, 113.3, 51.9],[8.467, 0.7081, -1.178, 105.4, 47.0],[8.5, 0.7088, -1.11, 94.2, 40.5],[8.533, 0.7099, -1.055, 75.9, 30.5],[8.567, 0.7093, -1.066, 52.6, 11.1],[8.6, 0.7086, -1.086, 28.1, -6.4]];
const measCam = (f: number): Cam => {
  const t = f / 30;
  if (t < 5.933) return {s: mk(t, PRE_S), rot: mk(t, PRE_R), cx: 11, cy: -10};
  const col = (j: number) => mk(t, ECC.map((r) => [r[0], r[j]]));
  return {s: col(1), rot: col(2), cx: col(3), cy: col(4)};
};
// S5 之后：旧世界 → 新世界的换算（在 258f 处让两边的镜头完全重合）
const M258 = measCam(258), O258 = oldCam(258, false);
const Q = O258.s / M258.s;
const DX = M258.cx - O258.cx * Q, DY = M258.cy - O258.cy * Q;
const o2n = (p: V2): V2 => [p[0] * Q + DX, p[1] * Q + DY];
const worldCam = (f: number): Cam => {
  if (f < 141) return oldCam(f);
  if (f <= 258) { const m = measCam(f); return {...m, cx: m.cx + Math.sin(f / 37) * 1.5, cy: m.cy + Math.cos(f / 43) * 1.2}; }
  const o = oldCam(f);
  const n: Cam = {s: o.s / Q, cx: o.cx * Q + DX, cy: o.cy * Q + DY, rot: 0};
  const b = ramp(f, 258, 10, EASE.smooth);
  const m = measCam(258);
  return {s: mix(m.s, n.s, b), cx: mix(m.cx, n.cx, b), cy: mix(m.cy, n.cy, b), rot: mix(m.rot, 0, b)};
};
const w2s = (cam: Cam, x: number, y: number): V2 => {
  const dx = (x - cam.cx) * cam.s, dy = (y - cam.cy) * cam.s, r = (cam.rot * Math.PI) / 180;
  return [960 + dx * Math.cos(r) - dy * Math.sin(r), 540 + dx * Math.sin(r) + dy * Math.cos(r)];
};
const s2w = (cam: Cam, x: number, y: number): V2 => {
  const dx = x - 960, dy = y - 540, r = (cam.rot * Math.PI) / 180;
  return [cam.cx + (dx * Math.cos(r) + dy * Math.sin(r)) / cam.s, cam.cy + (-dx * Math.sin(r) + dy * Math.cos(r)) / cam.s];
};

// 3 张入选卡的位置 / 缩放（S5 详情 → S6 小条 → 落进表格；坐标沿用旧世界，经 o2n 换算）
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
const SC_OLD = (1080 * Q) / CW; // 旧卡片缩放 → 新卡片缩放（让屏幕上的大小一致）
// 详情阶段（入选 3 张卡从网格飞出、展开、摆正）：卡面是一块有透视倾斜的平面，按原片逐帧量——
//   以 11.4s（已摆正）为模板，每帧 SIFT 特征匹配 + RANSAC 求单应矩阵（去掉 25→30fps 重复帧、±0.1s 局部二次拟合去抖），换算成"卡片本地 600×222 矩形 → 屏幕"的四个角（下面 QUADS）
//   渲染时用 matrix3d 把整张卡（含往下长的详情字段）按这块透视平面贴上去；光标也按同一个透视映射贴在卡上
const QUADS: Record<string, number[][]> = {
  [OLIVIA]: [[8.467,456,-32,934,-54,925,119,430,134],[8.533,484,7,943,-13,933,150,467,166],[8.6,517,53,966,34,956,196,500,210],[8.667,534,79,980,61,970,224,517,236],[8.733,540,94,984,78,977,238,523,250],[8.8,540,101,989,84,975,245,525,257],[8.867,539,106,989,89,975,252,523,263],[8.933,534,113,981,97,972,260,517,270],[9.0,524,121,971,105,961,267,507,277],[9.1,483,138,928,122,918,284,465,294],[9.167,410,164,853,150,841,313,391,322],[9.267,367,180,809,166,796,329,347,337],[9.333,352,184,795,170,781,334,332,342],[9.4,340,185,784,171,771,336,320,344],[9.5,326,183,774,170,760,336,305,343],[9.567,292,173,752,159,736,330,270,338],[9.667,255,162,727,146,711,322,232,331],[9.733,248,159,723,144,706,320,224,329],[9.8,243,157,719,142,703,319,219,328],[9.9,240,157,717,141,701,318,215,328],[10.0,237,156,715,140,699,318,213,327],[10.1,236,155,715,139,699,318,212,327],[10.2,235,155,714,139,698,318,211,327],[10.333,233,154,714,139,698,318,209,327],[10.4,232,153,713,138,697,318,208,327],[10.5,229,153,712,138,697,318,206,327],[10.567,225,152,711,137,697,319,204,327],[10.633,222,151,710,136,696,319,201,327],[10.7,216,149,707,135,695,320,196,327],[10.767,198,144,703,132,693,322,184,328],[10.867,167,137,695,131,691,329,162,332],[10.933,158,136,694,131,692,332,155,334],[11.0,153,135,694,132,692,333,152,335],[11.1,151,135,694,132,693,335,150,336],[11.167,151,135,697,133,696,336,151,337],[11.267,155,135,702,134,701,337,155,338],[11.333,164,136,710,136,710,339,164,339],[11.4,179,139,725,139,725,341,179,341]],
  [LUCAS]: [[7.667,981,173,1566,134,1578,344,1006,389],[7.733,977,170,1562,129,1573,341,1002,387],[7.8,981,170,1554,129,1586,341,995,383],[7.867,985,169,1545,129,1594,339,984,379],[7.933,968,151,1532,119,1539,319,978,353],[8.0,963,135,1513,109,1510,304,965,326],[8.067,956,128,1499,106,1516,298,954,317],[8.133,950,123,1504,104,1511,295,951,312],[8.2,960,121,1509,103,1518,301,943,314],[8.267,961,122,1507,105,1530,302,944,315],[8.333,966,121,1521,104,1527,300,959,312],[8.4,980,124,1527,108,1538,301,964,313],[8.467,991,126,1541,109,1545,302,979,313],[8.533,1041,131,1583,114,1585,304,1033,313],[8.6,1135,137,1657,122,1660,303,1128,312],[8.7,1186,143,1698,128,1702,304,1181,313],[8.767,1203,146,1711,131,1715,307,1198,315],[8.867,1213,148,1718,134,1722,308,1208,317],[8.933,1218,150,1721,135,1726,309,1213,317],[9.0,1221,151,1724,137,1728,310,1216,318],[9.1,1223,152,1725,138,1730,311,1218,319],[9.333,1223,152,1725,138,1730,312,1217,320],[9.4,1222,151,1727,136,1732,311,1216,319],[9.5,1219,147,1729,133,1734,309,1214,317],[9.567,1212,134,1736,119,1741,300,1206,309],[9.633,1205,123,1742,107,1748,292,1199,302],[9.7,1203,120,1745,103,1750,290,1197,299],[9.767,1201,116,1747,99,1753,288,1195,297],[9.867,1200,114,1748,97,1754,287,1194,296],[9.933,1199,113,1748,96,1754,285,1193,296],[10.067,1198,112,1748,96,1754,285,1192,295],[10.133,1198,112,1750,95,1755,285,1192,295],[10.233,1198,112,1749,95,1755,285,1192,295],[10.3,1198,112,1749,95,1755,285,1193,295],[10.4,1198,111,1749,95,1754,286,1192,295],[10.5,1197,111,1749,96,1755,287,1192,296],[10.667,1197,111,1749,96,1755,289,1194,297],[10.733,1197,110,1749,97,1755,291,1195,299],[10.8,1198,110,1750,101,1756,299,1198,304],[10.867,1202,112,1752,106,1756,307,1202,310],[10.933,1205,114,1754,111,1757,313,1206,315],[11.0,1207,115,1755,114,1757,315,1207,317],[11.1,1208,116,1756,115,1757,318,1208,318],[11.2,1209,117,1756,116,1756,319,1209,319],[11.3,1207,117,1754,117,1754,319,1207,319],[11.367,1202,117,1748,117,1748,319,1202,319],[11.4,1198,117,1744,117,1744,319,1198,319]],
  [HANNAH]: [[7.667,374,709,1008,654,988,883,409,936],[7.733,379,707,985,657,1002,880,395,933],[7.8,376,698,978,652,996,875,388,924],[7.933,357,664,952,627,964,845,367,882],[8.033,344,591,904,577,910,792,331,800],[8.1,345,577,896,568,900,781,328,783],[8.167,349,566,893,560,882,770,333,769],[8.267,364,566,881,563,871,764,347,759],[8.333,370,566,883,564,877,765,350,759],[8.4,376,566,895,564,882,766,354,760],[8.5,394,572,913,571,899,773,373,765],[8.567,443,597,939,598,940,795,419,786],[8.633,483,618,966,620,968,811,462,801],[8.7,508,619,993,621,983,808,490,799],[8.767,550,610,1034,612,1024,797,532,788],[8.867,673,551,1160,551,1152,734,657,728],[8.933,764,506,1253,505,1248,687,750,682],[9.0,794,494,1284,491,1279,673,780,669],[9.1,810,487,1300,485,1296,666,796,662],[9.167,820,482,1310,480,1307,662,806,657],[9.267,825,480,1317,477,1313,659,812,655],[9.333,826,478,1320,475,1316,658,813,654],[9.4,825,477,1321,474,1317,657,812,653],[9.5,820,476,1319,473,1316,658,807,654],[9.567,801,473,1314,470,1311,660,787,655],[9.667,779,469,1309,466,1305,662,764,658],[9.733,775,468,1308,465,1304,663,760,658],[9.8,771,468,1307,464,1303,663,756,658],[9.9,769,467,1306,464,1302,663,754,658],[10.0,768,467,1306,464,1302,663,752,659],[10.3,767,468,1307,463,1303,664,752,660],[10.4,767,468,1307,464,1304,665,753,661],[10.467,767,469,1308,465,1305,666,753,661],[10.533,768,470,1309,466,1306,667,754,663],[10.6,768,470,1309,467,1306,669,755,664],[10.7,768,472,1310,470,1309,672,757,668],[10.767,770,478,1314,476,1314,679,762,676],[10.867,775,490,1322,489,1323,693,773,691],[10.933,777,494,1324,494,1325,698,776,696],[11.0,778,497,1325,496,1326,700,778,699],[11.133,779,499,1326,498,1326,702,779,701],[11.2,780,500,1326,500,1327,702,780,702],[11.367,780,500,1328,499,1327,702,780,702],[11.4,780,498,1326,498,1326,700,780,700]],
};
const quadAt = (k: string, f: number): number[] => { const K8 = QUADS[k]; return [1, 2, 3, 4, 5, 6, 7, 8].map((j) => mk(f / 30, K8.map((r) => [r[0], r[j]]))); };
// 单应矩阵：本地 (0,0)-(CWs,CHs) → 屏幕四角 q
const homFromQuad = (q: number[]): number[] => {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2, sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / den, h = (dx1 * sy - sx * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + h * x3, c = x0, d = y1 - y0 + g * y1, e = y3 - y0 + h * y3, ff = y0;
  // 单位方形 → 四角；再左乘本地缩放的逆
  return [a / CWs, b / CHs, c, d / CWs, e / CHs, ff, g / CWs, h / CHs, 1];
};
const homApply = (H: number[], u: number, v: number): V2 => { const w = H[6] * u + H[7] * v + H[8]; return [(H[0] * u + H[1] * v + H[2]) / w, (H[3] * u + H[4] * v + H[5]) / w]; };
const homCss = (H: number[]) => `matrix3d(${[H[0], H[3], 0, H[6], H[1], H[4], 0, H[7], 0, 0, 1, 0, H[2], H[5], 0, H[8]].map((x) => x.toFixed(7)).join(',')})`;
const TRACK0: Record<string, number> = {[OLIVIA]: 254, [LUCAS]: 243, [HANNAH]: 245};
// 网格里那张卡此刻在屏幕上的四角（平的）
const gridQuad = (k: string, f: number): number[] => {
  const cam = worldCam(f); const g = gridPos(k, f);
  return [[0, 0], [CWs, 0], [CWs, CHs], [0, CHs]].flatMap(([u, v]) => w2s(cam, g[0] + (u - CWs / 2) * K, g[1] + (v - CHs / 2) * K));
};
// 入选卡在 [start, 338] 帧内的透视映射（之前是网格、之后是 S6 的平面路径）
const selHom = (k: string, f: number): number[] | null => {
  const F = FINAL[k as keyof typeof FINAL];
  if (!F || f < F.start || f > 338) return null;
  const b = EASE.smooth(clamp((f - F.start) / Math.max(7, TRACK0[k] + 2 - F.start)));
  const gq = gridQuad(k, f), tq = quadAt(k, Math.max(f, TRACK0[k]));
  return homFromQuad(gq.map((v, i) => mix(v, tq[i], b)));
};
const cardPose = (k: string, f: number): {p: V2; sc: number; o: number} => {
  const g = gridPos(k, f);
  const F = FINAL[k as keyof typeof FINAL];
  if (!F || f < F.start) return {p: g, sc: 1, o: 1};
  const cam = worldCam(Math.min(f, 338));
  if (f <= 338) {
    const H = selHom(k, f)!;
    const c = homApply(H, CWs / 2, CHs / 2), r = homApply(H, CWs, CHs / 2);
    return {p: s2w(cam, c[0], c[1]), sc: (Math.hypot(r[0] - c[0], r[1] - c[1]) * 2) / (CW * cam.s), o: 1};
  }
  // S6：从 338 帧那块（已摆正的）卡出发，收成小条 → 落进表格
  const H338 = selHom(k, 338)!;
  const c3 = homApply(H338, CWs / 2, CHs / 2), r3 = homApply(H338, CWs, CHs / 2);
  const d0 = s2w(cam, c3[0], c3[1]);
  const sc0 = (Math.hypot(r3[0] - c3[0], r3[1] - c3[1]) * 2) / (CW * cam.s);
  const pre: V2 = [d0[0] + F.pre[0] * Q, d0[1] + F.pre[1] * Q];
  const stack = o2n([pLeft + 0.4 * PANEL.w + (F.stack - 1) * 20, TITLE_Y - F.stack * 230 - 60 * ramp(f, 360, 17, EASE.linear) + Math.sin(f / 9 + F.stack) * 6]);
  const a = ramp(f, 339, 10, EASE.smooth);
  const bb = ramp(f, 345, 19, EASE.smooth);
  let p = lerp2(lerp2(d0, pre, a), stack, bb);
  let sc = mix(sc0, 0.6 * SC_OLD, ramp(f, 339, 25, EASE.smooth));
  let o = 1;
  if (f >= F.drop) {
    const d = ramp(f, F.drop, 4, EIN);
    p = lerp2(p, o2n([pLeft + 330, rowCY(F.row)]), d);
    sc = mix(0.6, 0.4, d) * SC_OLD;
    o = 1 - ramp(f, F.drop + 3, 3, EASE.linear);
  }
  return {p, sc, o};
};

// 详情阶段光标：按原片逐帧找到的箭头尖，用该帧的卡面单应矩阵换回卡片本地坐标（再换成旧单位偏移）
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

// ───────── 搜索框（S1–S3）：141f 之前跟旧镜头；之后按原片逐帧量的屏幕矩形（左边几乎不动、右边往回收，5.44 被中间一排挤到左边淡掉） ─────────
const BW = 1208, BH = 210;
const BOX_K = [[4.7, 352, 1570, 214, 543], [4.767, 356, 1556, 214, 543], [4.9, 366, 1540, 204, 542], [5.1, 424, 1452, 184, 542], [5.3, 410, 1380, 180, 540], [5.433, 400, 1250, 176, 540], [5.467, 166, 836, 178, 540], [5.5, 150, 800, 178, 540]];
const boxRect = (f: number): {l: number; w: number; h: number; cy: number} => {
  const oc = oldCam(f);
  const c = w2s(oc, 0, 0);
  const old = {l: c[0] - (BW * oc.s) / 2, w: BW * oc.s, h: BH * oc.s, cy: c[1]};
  if (f <= 136) return old;
  const t = Math.max(4.7, f / 30);
  const col = (j: number) => mk(t, BOX_K.map((r) => [r[0], r[j]]));
  const m = {l: col(1), w: col(2) - col(1), h: col(3), cy: col(4)};
  if (f >= 141) return m;
  const b = EASE.smooth(clamp((f - 136) / 5));
  const o141 = (() => { const oc2 = oldCam(141); const c2 = w2s(oc2, 0, 0); return {l: c2[0] - (BW * oc2.s) / 2, w: BW * oc2.s, h: BH * oc2.s, cy: c2[1]}; })();
  const mm = {l: BOX_K[0][1], w: BOX_K[0][2] - BOX_K[0][1], h: BOX_K[0][3], cy: BOX_K[0][4]};
  return {l: mix(old.l, mix(o141.l, mm.l, b), b), w: mix(old.w, mix(o141.w, mm.w, b), b), h: mix(old.h, mix(o141.h, mm.h, b), b), cy: mix(old.cy, mix(o141.cy, mm.cy, b), b)};
};
// 发送键在屏幕上的位置（搜索框本地：右 58、下 54，随框缩放）
const sendScreen = (f: number, ox = 0, oy = 0): V2 => {
  const b = boxRect(f);
  const sc = b.h / BH;
  return [b.l + b.w - (58 - ox) * sc, b.cy - b.h / 2 + (BH - 54 + oy) * sc];
};

// ───────── 光标路径 ─────────
const W = (x: number, y: number): Anchor => () => [x, y];
const onBox = (lx: number, ly: number): Anchor => () => [-BW / 2 + lx, -BH / 2 + ly];
const onScr = (x: number, y: number): Anchor => (fa) => s2w(worldCam(fa), x, y);
const onSend = (ox: number, oy: number): Anchor => (fa) => { const s = sendScreen(fa, ox, oy); return s2w(worldCam(fa), s[0], s[1]); };
// 旧卡片 1080×340 世界单位上的偏移 → 新卡片（宽 ×0.748、卡内高 ×0.88、详情行 80→59）
const mapX = (dx: number) => dx * (CW / 1080);
const mapY = (dy: number) => (dy <= 170 ? dy * (CH / 340) : 170 * (CH / 340) + (dy - 170) * ((ROWHs * K) / 80));
const onCard = (k: string, dx: number, dy: number): Anchor => (fa) => {
  const H = selHom(k, fa);
  if (H) { const sp = homApply(H, CWs / 2 + mapX(dx) / K, CHs / 2 + mapY(dy) / K); return s2w(worldCam(fa), sp[0], sp[1]); }
  const c = cardPose(k, fa); return [c.p[0] + mapX(dx) * c.sc, c.p[1] + mapY(dy) * c.sc];
};
const SEND: [number, number] = [BW - 58, BH - 54];

const CURSORS: {keys: PathKey[]; on: number; off: number; def: number; fadeOut: number}[] = [
  { // A：S2 那只，打字后去发送键 → 黄磊 → 何欣（只悬停）→ 右边出画
    on: 91, off: 224, fadeOut: 216, def: 10,
    keys: [[91, W(-560, 640)], [96, W(-445, 300), EOUT], [101, W(-392, 92), EOUT], [120, W(-386, 86), EASE.linear], [127, W(80, 18), EIN], [134, onBox(SEND[0] - 40, SEND[1] + 4), EOUT], [140, onSend(-40, 4), EASE.linear], [161, onSend(-40, 4), EASE.linear],
      [164, onScr(936, 570), EOUT], [165, onScr(930, 564), EASE.linear], [166, onCard('0,-1', 87, 26), EASE.linear], [168, onCard('0,-1', -306, -28), EASE.linear], [176, onCard('0,-1', -330, -170), EASE.smooth], [195, onCard('1,1', 200, -150), EASE.smooth], [199, onCard(GRACE, -250, 40), EOUT], [212, onCard(GRACE, -238, 52), EASE.linear], [224, onCard(GRACE, 500, -260), EIN]],
  },
  { // B：右边分身出现 → 马骏（选了又退）→ 许晴（详情）
    on: 164, off: 332, fadeOut: 324, def: -80,
    keys: [[164, onCard('0,1', 540, 130)], [180, onCard('1,1', -420, -20), EASE.smooth], [195, onCard('2,1', -320, -70), EASE.smooth], [203, onCard(JAMES, -330, 20), EOUT], [220, onCard(JAMES, -325, 26), EASE.linear], [227, onCard(HANNAH, 240, 30), EASE.smooth], [252, onCard(HANNAH, 335, 109), EASE.smooth], [258, onCard(HANNAH, 275, 14), EASE.linear], [264, onCard(HANNAH, 266, 41), EASE.linear], [270, onCard(HANNAH, -36, 224), EASE.linear], [276, onCard(HANNAH, -72, 252), EASE.linear], [282, onCard(HANNAH, -77, 258), EASE.linear], [288, onCard(HANNAH, -49, 258), EASE.linear],
      [294, onCard(HANNAH, 126, 260), EASE.linear], [300, onCard(HANNAH, 310, 268), EASE.linear], [306, onCard(HANNAH, 335, 268), EASE.linear], [312, onCard(HANNAH, 353, 270), EASE.linear], [318, onCard(HANNAH, 443, 270), EASE.linear], [322, onCard(HANNAH, 480, 280), EASE.linear], [332, onCard(HANNAH, 900, 760), EIN]],
  },
  { // C：左中出现 → 李静 → 林嘉怡（详情）
    on: 205, off: 338, fadeOut: 330, def: 30,
    keys: [[205, onCard('0,-1', 120, 80)], [211, onCard(EMMA, -200, 30), EOUT], [222, onCard(EMMA, -196, 34), EASE.linear], [232, onCard(OLIVIA, -170, 40), EASE.smooth], [262, onCard(OLIVIA, -195, 60), EASE.smooth], [264, onCard(OLIVIA, -202, 72), EASE.linear], [270, onCard(OLIVIA, -207, 113), EASE.linear], [276, onCard(OLIVIA, -153, 312), EASE.linear], [282, onCard(OLIVIA, -126, 338), EASE.linear], [288, onCard(OLIVIA, -113, 348), EASE.linear], [300, onCard(OLIVIA, -86, 358), EASE.linear],
      [306, onCard(OLIVIA, 13, 374), EASE.linear], [312, onCard(OLIVIA, 29, 378), EASE.linear], [318, onCard(OLIVIA, 41, 376), EASE.linear], [324, onCard(OLIVIA, 72, 326), EASE.linear], [330, onCard(OLIVIA, 144, 118), EASE.linear], [338, onCard(OLIVIA, 600, -400), EIN]],
  },
  { // D：黄磊右侧出现往上 → 赵子轩（详情，最早离场）
    on: 211, off: 324, fadeOut: 316, def: -20,
    keys: [[211, onCard('0,1', 600, 220)], [219, onCard(LUCAS, 250, 40), EOUT], [252, onCard(LUCAS, 243, 112), EASE.smooth], [258, onCard(LUCAS, -43, 416), EASE.linear], [264, onCard(LUCAS, -103, 554), EASE.linear], [270, onCard(LUCAS, -119, 586), EASE.linear], [276, onCard(LUCAS, -110, 596), EASE.linear], [282, onCard(LUCAS, -67, 604), EASE.linear],
      [300, onCard(LUCAS, 250, 640), EASE.smooth], [312, onCard(LUCAS, 349, 658), EASE.smooth], [318, onCard(LUCAS, 355, 660), EASE.linear], [324, onCard(LUCAS, 900, 980), EIN]],
  },
];
const PRESSES: [number, number][][] = [[[135, 141]], [[205, 211], [224, 229]], [[213, 219], [234, 240]], [[219, 226]]];

// ───────── 名单面板（旧世界坐标，整体经 Q / DX / DY 放进新世界） ─────────
const LIST = [
  {k: OLIVIA, role: '销售总监', why: '9 年 SaaS 大客户经验'},
  {k: LUCAS, role: '大客户经理', why: '金融行业客户资源多'},
  {k: HANNAH, role: '区域销售负责人', why: '带过 10 人销售团队'},
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
        <div style={{fontSize: 84, fontWeight: 600, color: INK, letterSpacing: '-0.01em', whiteSpace: 'nowrap'}}>候选人 · 3 位</div>
      </div>
      <div style={{position: 'absolute', left: L + 60, top: T + 165, width: Wd - 120, height: 2, background: '#eef0f3', opacity: o}} />
      {([['姓名', L + 160, 350], ['当前职位', colA, 356], ['匹配理由', colB, 356]] as [string, number, number][]).map(([t, x, a]) => (
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
                <div style={{position: 'absolute', left: 0, top: 0, width: colA - rl - 60, height: 100, borderRadius: 18, background: '#e3edfd'}} />
                <div style={{position: 'absolute', left: colA - rl - 20, top: 0, right: 0, height: 100, borderRadius: 18, background: '#e3edfd'}} />
              </div>
            )}
            {fill > 0.001 && (
              <div style={{position: 'absolute', left: rl, top: cy - 50, width: rr - rl, height: 100, opacity: fill}}>
                <div style={{position: 'absolute', left: 24, top: 8}}><Avatar face={p.face} d={84} /></div>
                <div style={{position: 'absolute', left: 134, top: 18, display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap'}}><span style={{fontSize: 52, fontWeight: 600, color: INK}}>{p.name}</span><VMark s={34} /></div>
                <div style={{position: 'absolute', left: colA - rl, top: 20, fontSize: 48, color: '#3e434c', whiteSpace: 'nowrap'}}>{r.role}</div>
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

// ───────── S0：脉脉资料卡流（上一镜头尾巴） ─────────
type Prof = {face: string; name: string; title: string; co: string; city: string; sex: string; yrs: number; edu: string; ind: string; tags: string[]; mutual: number; friends: string[]; hl: number; hlCity: boolean};
const PROFILES: Prof[] = [
  {face: 'f09', name: '宋雨桐', title: '销售总监', co: '天穹数据', city: '上海', sex: '女', yrs: 10, edu: '硕士', ind: '企业服务 SaaS', tags: ['大客户销售', '团队管理', '解决方案'], mutual: 12, friends: ['f02', 'm05', 'f12'], hl: 15, hlCity: false},
  {face: 'm02', name: '韩冬', title: '大客户销售总监', co: '远航信息', city: '上海', sex: '男', yrs: 13, edu: '本科', ind: '企业服务 SaaS', tags: ['政企客户', '渠道拓展', '商务谈判'], mutual: 8, friends: ['m08', 'f14', 'm10'], hl: 54, hlCity: true},
  {face: 'm06', name: '杜明', title: '销售经理', co: '拓扑云', city: '杭州', sex: '男', yrs: 6, edu: '本科', ind: '云计算', tags: ['电销转型', 'KA 客户'], mutual: 5, friends: ['f16', 'm16', 'm18'], hl: 999, hlCity: false},
];
const Chip: React.FC<{t: string}> = ({t}) => <span style={{display: 'inline-block', padding: '3px 12px', borderRadius: 8, background: '#f1f3f7', color: '#7d838e', fontSize: 24, marginRight: 14}}>{t}</span>;
const HL: React.FC<{t: string; h: number; deep: number}> = ({t, h, deep}) => (
  <span style={{position: 'relative', display: 'inline-block'}}>
    {h > 0.01 && <span style={{position: 'absolute', left: -5, top: -1, bottom: -1, width: `calc(${fx(h * 100)}% + 10px)`, borderRadius: 6, background: hexMix('#a9c4fb', MM, deep)}} />}
    <span style={{position: 'relative', color: deep > 0.5 ? '#fff' : undefined}}>{t}</span>
  </span>
);
const ProfileCard: React.FC<{d: Prof; f: number}> = ({d, f}) => {
  const h = ramp(f, d.hl, 7, EASE.smooth), deep = ramp(f, d.hl + 6, 4, EASE.smooth);
  return (
    <div style={{position: 'relative', width: 880, height: 540, borderRadius: 26, background: 'rgba(255,255,255,0.97)', boxShadow: '0 20px 50px rgba(80,90,130,0.10), inset 0 0 0 1.5px rgba(255,255,255,1)', overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', left: 50, top: 48}}><Avatar face={d.face} d={150} online /></div>
      <div style={{position: 'absolute', left: 232, top: 50, display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap'}}><span style={{fontSize: 46, lineHeight: '60px', fontWeight: 700, color: INK}}>{d.name}</span><VMark s={30} /></div>
      <div style={{position: 'absolute', left: 232, top: 120, fontSize: 30, lineHeight: '40px', color: '#2c3038', whiteSpace: 'nowrap'}}>{d.title} · {d.co}<span style={{marginLeft: 10, verticalAlign: '-3px'}}><VMark s={24} /></span></div>
      <div style={{position: 'absolute', left: 232, top: 170, fontSize: 26, lineHeight: '36px', color: '#8a909a', whiteSpace: 'nowrap'}}>
        {d.hlCity ? <HL t={d.city} h={h} deep={deep} /> : d.city}<Sep />{d.sex}<Sep />工作 {d.yrs} 年<Sep />{d.edu}
      </div>
      <div style={{position: 'absolute', left: 52, top: 238, fontSize: 26, lineHeight: '40px', color: '#4a4f58', whiteSpace: 'nowrap'}}><Chip t="公司" />{d.co} · {d.title}</div>
      <div style={{position: 'absolute', left: 52, top: 296, fontSize: 26, lineHeight: '40px', color: '#4a4f58', whiteSpace: 'nowrap'}}><Chip t="行业" />{d.hlCity ? d.ind : <HL t={d.ind} h={h} deep={deep} />}</div>
      <div style={{position: 'absolute', left: 52, top: 354, fontSize: 26, lineHeight: '40px', color: '#4a4f58', whiteSpace: 'nowrap'}}><Chip t="职业标签" />{d.tags.map((t, i) => <React.Fragment key={t}>{i > 0 && <Sep />}{t}</React.Fragment>)}</div>
      <div style={{position: 'absolute', left: 52, top: 430, display: 'flex', alignItems: 'center', fontSize: 24, color: '#5d636d', whiteSpace: 'nowrap'}}>
        <div style={{display: 'flex', marginRight: 14}}>{d.friends.map((fc, i) => <div key={fc} style={{marginLeft: i ? -12 : 0, filter: 'blur(1.2px)'}}><Avatar face={fc} d={44} ring={2} /></div>)}</div>
        <span style={{padding: '4px 14px', borderRadius: 8, background: '#f1f3f7', marginRight: 12}}>{d.mutual} 个共同好友</span>
        <span style={{padding: '4px 14px', borderRadius: 8, background: '#f1f3f7', marginRight: 12}}>前同事</span>
        <span style={{padding: '4px 14px', borderRadius: 8, background: '#f1f3f7'}}>近期有动向</span>
      </div>
      <div style={{position: 'absolute', left: 612, top: 64, width: 64, height: 64, borderRadius: 32, background: '#eef1f6', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={34} height={34} viewBox="0 0 24 24"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4 3.5V16h0.5A2.5 2.5 0 0 1 4 13.5z" fill="#2a2e35" /><path d="M8.5 9h7M8.5 12h4.5" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" /></svg>
      </div>
      <div style={{position: 'absolute', left: 692, top: 64, width: 150, height: 64, borderRadius: 32, background: MM, color: '#fff', fontSize: 28, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>加好友</div>
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
  const ckeys: [number, number, number][] = [[0, 1000, top0 + 250], [6, 1012, top0 + 258], [14, 1076, top0 + 330], [24, 1088, top0 + 334], [34, 1430, top0 + 462], [38, 1432, top0 + 464], [46, 1150, top0 + STRIDE + 230], [52, 1088, top0 + STRIDE + 198], [80, 1098, top0 + STRIDE + 202]];
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
            <span style={{opacity: 1 - wOut * 0.7, filter: wOut > 0 ? `blur(${fx(wOut * 6)}px)` : undefined}}>企业服务<span style={{color: hexMix('#c4c7ce', '#3a3d44', word2), opacity: clamp(word2 * 2)}}> SaaS</span></span>
          ) : (
            <span style={{opacity: wIn, color: hexMix('#c4c7ce', '#3a3d44', wIn), filter: wIn < 1 ? `blur(${fx((1 - wIn) * 5)}px)` : undefined}}>上海</span>
          )}
        </div>
        <div style={{position: 'absolute', left: 770, top: -40, width: 1000, height: 1160, borderRadius: 40, background: 'rgba(255,255,255,0.28)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.6)'}} />
        <div style={{position: 'absolute', left: 830, top: 0, transform: `translateY(${fx(scroll)}px)`}}>
          {PROFILES.map((d, i) => (
            <div key={i} style={{position: 'absolute', left: 0, top: top0 + i * STRIDE}}>
              <div style={{position: 'absolute', left: 0, top: -64, fontSize: 24, color: '#8a909a', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 12}}>
                <span style={{display: 'inline-block', width: 22, height: 22, borderRadius: 11, border: '3px solid #b0b5bd', borderTopColor: 'transparent', transform: `rotate(${(f * 14) % 360}deg)`}} />正在翻看 脉脉 上的资料…
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
const T2 = Array.from('每天帮我给行业里 25 位专家发好友申请');
const T1 = Array.from('帮我找下一位销售负责人');
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
  const t = f / 30;
  // 背景：S1–S2 白墙；S3 提亮去色成冷白（保留斜向布纹光影）；S6 起接近纯白
  const cool = kf(f, [[141, 0], [152, 0.6, EASE.smooth], [165, 0.7, EASE.smooth], [339, 0.72], [352, 0.9, EASE.smooth], [450, 0.9], [460, 0.78, EIN]]);
  const bgBlur = kf(f, [[79, 10], [92, 0, EOUT]]);
  // 搜索框（S1 对焦进场；S3 缩窄、被中间一排挤到左边淡掉）——屏幕坐标
  const b1 = ramp(f, 79, 11, EOUT), b2 = ramp(f, 90, 12, EASE.smooth);
  const box = boxRect(f);
  const sc0 = box.h / BH, zoom = f < 141 ? mix(1.19, 1, b1) : 1;
  const boxSc = sc0 * zoom;
  const boxFade = t < 5.433 ? 1 : mk(t, [[5.433, 1], [5.467, 0.75], [5.5, 0.35], [5.533, 0]]);
  const boxO = (mix(0.3, 0.7, b1) + 0.3 * b2) * boxFade;
  const boxBlur = mix(12, 4, b1) * (1 - b2) + (t > 5.44 ? mk(t, [[5.44, 0], [5.467, 2], [5.5, 4]]) : 0);
  const typed = f < 111 ? 0 : Math.min(T1.length, [2, 4, 6, 8, 10, 11][Math.min(5, Math.floor((f - 111) / 3))]);
  const sendOn = clamp(typed / T1.length);
  const press1 = ramp(f, 135, 2, EASE.out) * (1 - ramp(f, 141, 4, EASE.out));
  const boxW = box.w / sc0, boxH = BH;
  // 卡片
  const camAt237 = worldCam(237);
  const order = [...KEYS].sort((a, b) => DEPTH[b] - DEPTH[a]); // 后层先画
  const persp: React.ReactNode[] = [];
  const cards = order.map((k) => {
    const [r] = parseK(k);
    if (f < 141) return null;
    const pose = cardPose(k, f);
    let o = pose.o;
    let sc = pose.sc;
    if (r === 0) o *= t < 5.52 ? 0 : 1;
    if (Math.abs(r) === 2) o *= mk(t, [[5.9, 0], [5.967, 0.85], [6.05, 1]]);
    if (o <= 0.003) return null;
    const isFinal = FINALS.includes(k);
    const dep = DEPTH[k];
    sc *= mix(DEPTH_SC[dep], 1, isFinal ? ramp(f, 237, 10, EASE.smooth) : 0);
    const [sx, sy] = w2s(cam, pose.p[0], pose.p[1]);
    const dX = Math.abs(sx - 960) / 960, dY = Math.abs(sy - 540) / 540;
    // 景深（原片：左右两列明显虚、淡，上下两排只轻微软）；后层再虚一点、淡一点
    let blur = sstep(0.5, 1.0, dX) * 7 + sstep(0.7, 1.1, dY) * 2.5 + dep * 1.0 + (Math.abs(r) === 2 ? mk(t, [[5.9, 6], [6.1, 0]]) : 0);
    let op = (1 - sstep(0.55, 1.05, dX) * 0.5 - sstep(0.75, 1.1, dY) * 0.15) * (1 - dep * 0.07);
    if (isFinal) { const z = ramp(f, 240, 10, EASE.smooth); blur *= 1 - z; op = mix(op, 1, z); }
    else if (f >= 237) {
      const g0 = gridPos(k, 237);
      const [gx, gy] = w2s(camAt237, g0[0], g0[1]);
      const outer = Math.max(Math.abs(gx - 960) / 960, Math.abs(gy - 540) / 540);
      const start = k === EMMA ? 245 : k === JAMES ? 245 : 237 + Math.round(clamp(1 - outer) * 7 + clamp(1 - gy / 1080) * 5);
      const g = ramp(f, start, 9, EASE.smooth);
      blur = mix(blur, 9, g);
      op = mix(op, 0.27, g) * (1 - ramp(f, 339, 12, EASE.smooth));
      const spread = ramp(f, 318, 12, EASE.smooth) * 0.06;
      pose.p = [pose.p[0] + (pose.p[0] - cam.cx) * spread, pose.p[1] + (pose.p[1] - cam.cy) * spread];
    }
    if (op * o <= 0.003) return null;
    const z = isFinal ? (k === HANNAH ? 30 : k === LUCAS ? 20 : 10) : 3 - dep;
    const H = isFinal ? selHom(k, f) : null;
    if (H) {
      // 详情阶段：整张卡按原片测出来的透视平面贴到屏幕上
      persp.push(
        <div key={k} style={{position: 'absolute', left: 0, top: 0, width: CWs, height: CHs, transformOrigin: '0 0', transform: homCss(H), opacity: o * op, filter: blur > 0.25 ? `blur(${fx(blur)}px)` : undefined, zIndex: z}}>
          <PersonCard k={k} v={selVis(k, f)} />
        </div>,
      );
      return null;
    }
    return (
      <div key={k} style={{position: 'absolute', left: pose.p[0] - CW / 2, top: pose.p[1] - CH / 2, width: CW, height: CH, transform: `scale(${sc.toFixed(4)})`, transformOrigin: `${CW / 2}px ${CH / 2}px`, opacity: o * op, filter: blur > 0.25 ? `blur(${fx(blur / Math.max(0.3, cam.s))}px)` : undefined, zIndex: z}}>
        <div style={{transform: `scale(${K})`, transformOrigin: '0 0', width: CWs, height: CHs}}><PersonCard k={k} v={selVis(k, f)} /></div>
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
        {boxO > 0.003 && (
          <div style={{position: 'absolute', left: box.l + box.w / 2 - (boxW * boxSc) / 2, top: box.cy - (boxH * boxSc) / 2, width: boxW, height: boxH, transform: `scale(${boxSc.toFixed(4)})`, transformOrigin: '0 0', opacity: boxO, filter: boxBlur > 0.2 ? `blur(${fx(boxBlur)}px)` : undefined}}>
            <SearchBox w={boxW} h={boxH} text={T1.slice(0, typed).join('')} placeholder={f < 108} caret={f >= 108 && f < 141 && Math.floor(f / 7) % 2 === 0} sendOn={sendOn} press={press1} textO={1 - ramp(f, 164, 3, EASE.linear)} />
          </div>
        )}
        <div style={{position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformOrigin: '0 0', transform: `translate(960px, 540px) rotate(${cam.rot.toFixed(3)}deg) scale(${cam.s.toFixed(5)}) translate(${fx(-cam.cx)}px, ${fx(-cam.cy)}px)`}}>
          <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${fx(DX)}px, ${fx(DY)}px) scale(${Q.toFixed(5)})`, transformOrigin: '0 0'}}>
            <Shortlist f={f} />
          </div>
          {cards}
          {f >= 408 && (
            <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${fx(DX)}px, ${fx(DY)}px) scale(${Q.toFixed(5)})`, transformOrigin: '0 0', zIndex: 40}}>
              <div style={{position: 'absolute', left: pLeft + 10, top: titleTop, fontSize: 240, fontWeight: 600, letterSpacing: '-0.03em', whiteSpace: 'pre', fontFamily: SANS, lineHeight: 1}}>
                {TW.map((w, i) => { const q = ramp(f, 411 + i * 6, 14, EASE.out); return <span key={i} style={{display: 'inline-block', opacity: clamp(q * 1.4), color: hexMix('#d5d8dd', '#15171b', q), transform: `translateY(${fx((1 - q) * 18)}px)`, filter: q < 0.98 ? `blur(${fx((1 - q) * 7)}px)` : undefined}}>{w}</span>; })}
              </div>
            </div>
          )}
        </div>
        <AbsoluteFill style={{zIndex: 0}}>{persp}</AbsoluteFill>
        {curs}
      </AbsoluteFill>
      <Grain opacity={0.03} blend="overlay" />
    </AbsoluteFill>
  );
};
