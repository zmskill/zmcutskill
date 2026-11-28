// 读书会邀请：联系人卡片墙拉远推近 → 点"邀请" → 写邀请（流式生成）→ 全部发送 → 成功卡 → 三类回复卡 → 飞进聊天 App 全景（003-S4 整段）
// 学的动作（@bohdanmotion · Polar，003-S4 按 25fps 逐帧看过）：
//   用镜头推远/推近当剪辑：每个硬切都藏在最快的那一帧（急推、加速推近、失焦）里，切完立刻减速；
//   按钮四步：按下缩小 → 原字淡出 → 指针尖冒浅蓝液态泡往右扩、擦出新字 → 轻微回弹；
//   新东西都"先虚后实、先浅灰后深"；流式正文带 3–5 个词长的渐变尾巴、卡片变高、镜头跟写到的那一行；
//   指针在场景层里（跟镜头一起放大）、会转向、点击微缩；背景按段换光线；全程没有一帧停住。
// 我们的内容（中性日常）：帮你给 25 位读书会老朋友发周末聚会邀请。
//
// 时间表（30fps，共 476f；原片 25fps 15.88s 按秒换算 f = t×30）
//   A    0–101  单卡（林小满）一帧急拉远 → 多个指针各自漂 → 33 起二次加速拉远+平移，联系人卡片墙露出 →
//               62 起慢推近+右移，周以宁卡到中间 → 99–101 一帧急推（带模糊）
//   B  102–168  硬切干净大卡：信息逐行由浅灰模糊变深（102–113）；慢推；131–134 三帧顿推；
//               153 按"邀请" → 156 指针尖冒光泡往右擦出"已邀请" → 162 回弹；162 起往左下推
//   C  166–192  虚化转场：资料卡失焦放大变淡；178 消息卡从右上虚着进来往左下落定；背景换成彩色失焦色块
//   D  188–246  指针从左下飞进、点输入框（205）；209–236 正文流式生成（渐变尾巴），卡片变高，镜头往下跟再回推
//   E  243–283  按"全部发送"→ 光泡 → 变浅蓝"已发送"；250 语气下拉从卡后面滑出，选项每 1 帧出一项；
//               260–264 指针弧线飞到"轻松"，273 点选出蓝勾；276 起加速推近 → 硬切
//   F  283–328  成功卡：蓝勾从小点弹出 → 词逐个浅→深 → 4 个头像每 2 帧从小点弹出（110% 过冲、互相压、白描边）→ "+21"；往左漂
//   G  328–341  硬切暖白底：三词标题逐词先虚后实、整行一直居中、最后字距收紧
//   H  341–400  标题上移；三张回复卡从右下依次飞入（3D 透视、倾斜各不同、轻微阶梯），底部长出信息行/带勾头像；395 起失焦
//   I  400–476  硬切聊天 App（先虚后实）：三张卡成一串斜着飘进来 → 放平 → 散开 → 各自落位 → 依次扫光骨架 → 真实消息；
//               429 起拉远看全景；466 起窗口加速往左上甩出，带横向动态模糊
// 毛病清单（自查用）：
//   - 硬切前后速度要接上（101→102、283、328、400）；切点在最快那一帧
//   - 慢段也要漂（背景光带、镜头微推、指针布朗漂移），活动值不能有 0
//   - 按钮光泡四步不能少；语气下拉在消息卡后面；后一张成果卡压前一张；头像互相压带白描边
//   - 大卡慢推时文字不能抽动（--hq 渲染）
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {EASE, FONT, Grain, bezier, mix, ramp} from '../../../assets/lib/helpers/polish';

export const INVITE_WALL_TO_CHAT_DURATION = 476;

const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const INK = '#1f2328';
const SUB = '#6b7280';
const BLUE = '#2f6fe4';
const CHECK = '#1e6fe0';
type Ease = (t: number) => number;
const clamp = (x: number, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
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
// 单调三次样条：关键帧之间速度连续（不在每个关键帧停一下），不会冲过头
const sp = (f: number, K: [number, number][]) => {
  const n = K.length;
  if (f <= K[0][0]) return K[0][1];
  if (f >= K[n - 1][0]) return K[n - 1][1];
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((K[i + 1][1] - K[i][1]) / (K[i + 1][0] - K[i][0]));
  const m: number[] = new Array(n).fill(0);
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b;
    if (h > 9) { const t = 3 / Math.sqrt(h); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  let i = 0;
  while (i < n - 2 && f > K[i + 1][0]) i++;
  const [x0, y0] = K[i], [x1, y1] = K[i + 1];
  const h = x1 - x0, t = (f - x0) / h, t2 = t * t, t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * y0 + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * y1 + (t3 - t2) * h * m[i + 1];
};
// 浅灰 → 深炭灰
const ink = (k: number) => `rgb(${Math.round(mix(196, 31, k))},${Math.round(mix(200, 35, k))},${Math.round(mix(208, 40, k))})`;
// 弹出：0 → 110% → 100%
const popS = (f: number, a: number, dur = 5) => {
  if (f < a) return 0;
  const t = clamp((f - a) / dur);
  return t < 0.6 ? mix(0.12, 1.1, EASE.out(t / 0.6)) : mix(1.1, 1, EASE.smooth((t - 0.6) / 0.4));
};
// 先虚后实、先浅后深（整行用）
const rev = (f: number, a: number, dur = 4, blur = 5): React.CSSProperties => {
  if (f < a) return {opacity: 0};
  const k = ramp(f, a, dur, EASE.out);
  return {opacity: Math.min(1, 0.35 + k * 1.2), filter: k < 0.98 ? `blur(${((1 - k) * blur).toFixed(2)}px)` : undefined};
};
const LAND = bezier(0.25, 1.12, 0.5, 1);
void LAND;

// ───────── 指针：黑色箭头 + 白描边 + 投影；dir = 箭尖指向（度，0 = 朝右，90 = 朝下） ─────────
const Cursor: React.FC<{x: number; y: number; dir: number; size?: number; press?: number; opacity?: number}> = ({x, y, dir, size = 26, press = 0, opacity = 1}) => {
  const s = size * (1 - press * 0.14);
  const o = (2 * s) / 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" style={{position: 'absolute', left: x - o, top: y - o, transform: `rotate(${(dir + 135).toFixed(2)}deg)`, transformOrigin: `${o}px ${o}px`, overflow: 'visible', filter: `drop-shadow(${(s * 0.05).toFixed(1)}px ${(s * 0.1).toFixed(1)}px ${(s * 0.09).toFixed(1)}px rgba(0,0,0,0.3))`, opacity}}>
      <path d="M2 2 L21.5 9.2 L12 12 L9.2 21.5 Z" fill="#111" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
};

// ───────── 头像 / 横幅 ─────────
// 2026-11-17 第1轮补做：原片是真人头像 + 城市实景封面 → 换成真人照片（library/faces）和城市实景（library/photos/city，杭州西湖等），均来自免费图库，只作演示
const FACE: Record<string, string> = {满: 'f12', 小: 'f12', 以: 'f15', 哲: 'm14', 阿: 'm14', 可: 'f04', 舟: 'm03', 一: 'm03', 夏: 'f13', 念: 'f10', 果: 'f05', 远: 'm17', 晴: 'f07', 方: 'm06', 知: 'm06', 雨: 'f09', 冬: 'm19', 青: 'm09', 鹿: 'f11', 桃: 'f14', 陈: 'm13', 何: 'f16', 苏: 'f10', 唐: 'f05', 江: 'm17', 孟: 'f02', 韩: 'm19', 罗: 'm09'};
const CITY = ['city0', 'city6', 'city2', 'city9', 'city7', 'city1', 'city4', 'city8', 'city3'];
const PAL: [string, string][] = [['#ffb38a', '#f26b4f'], ['#93b9ff', '#4c72ea'], ['#8fe0c0', '#24a37c'], ['#c9a8ff', '#7f55e6'], ['#ffd46b', '#e9971c'], ['#ff9fc2', '#dc4f86'], ['#9fdcee', '#2797bd'], ['#cbd47c', '#86a032']];
const Avatar: React.FC<{ch: string; p: number; size: number; ring?: number; style?: React.CSSProperties}> = ({ch, p, size, ring = 0, style}) => {
  const [a, b] = PAL[p % PAL.length];
  const face = FACE[ch];
  if (face) return <Img src={staticFile(`library/faces/${face}.jpg`)} style={{width: size, height: size, borderRadius: '50%', objectFit: 'cover', boxShadow: ring ? `0 0 0 ${ring}px #fff` : undefined, flexShrink: 0, display: 'block', ...style}} />;
  return (
    <div style={{position: 'relative', width: size, height: size, borderRadius: '50%', background: `linear-gradient(135deg, ${a}, ${b})`, overflow: 'hidden', boxShadow: ring ? `0 0 0 ${ring}px #fff` : undefined, flexShrink: 0, ...style}}>
      <div style={{position: 'absolute', left: size * 0.46, top: size * 0.44, width: size * 0.9, height: size * 0.9, borderRadius: '50%', background: 'rgba(255,255,255,0.2)'}} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: size * 0.44, fontFamily: SANS}}>{ch}</div>
    </div>
  );
};
const BAN: [string, string, string][] = [['#ffd9c2', '#f3a9a0', '#b9a6e8'], ['#cfe7ff', '#8fbdf0', '#f2f8ff'], ['#d6f0d9', '#8fcb9c', '#f4f7d6'], ['#fde4b6', '#f4b47a', '#e6887f'], ['#dcd8ff', '#a8a1ee', '#ffdcee'], ['#c9f0ee', '#7cc5d4', '#eaf7ff']];
const Banner: React.FC<{p: number; h: number; r: number}> = ({p, h, r}) => {
  const [c1, c2, c3] = BAN[p % BAN.length];
  if (CITY.length) return (
    <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: h, borderRadius: `${r}px ${r}px 0 0`, overflow: 'hidden', background: c2}}>
      <Img src={staticFile(`library/photos/city/${CITY[p % CITY.length]}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
    </div>
  );
  return (
    <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: h, borderRadius: `${r}px ${r}px 0 0`, overflow: 'hidden', background: `radial-gradient(55% 120% at 18% 105%, ${c1} 0%, rgba(255,255,255,0) 70%), radial-gradient(45% 90% at 82% 15%, ${c3} 0%, rgba(255,255,255,0) 72%), linear-gradient(115deg, ${c2}, ${c1})`}}>
      <div style={{position: 'absolute', left: '-10%', bottom: -h * 0.55, width: '70%', height: h, borderRadius: '50%', background: 'rgba(255,255,255,0.28)'}} />
      <div style={{position: 'absolute', right: '-12%', bottom: -h * 0.6, width: '75%', height: h * 1.05, borderRadius: '50%', background: 'rgba(255,255,255,0.18)'}} />
      <div style={{position: 'absolute', left: '62%', top: h * 0.18, width: h * 0.3, height: h * 0.3, borderRadius: '50%', background: 'rgba(255,255,255,0.55)'}} />
    </div>
  );
};

// ───────── 联系人 ─────────
const PEOPLE = [
  {n: '林小满', bio: '爱读推理 · 最近在读《白夜行》', city: '上海 · 来过 9 次', org: '城南读书会', job: '产品设计'},
  {n: '周以宁', bio: '插画师 · 周末喜欢读小说', city: '杭州 · 来过 12 次', org: '城南读书会', job: '插画工作室'},
  {n: '陈阿哲', bio: '中学老师 · 历史书爱好者', city: '苏州 · 来过 7 次', org: '城南读书会', job: '实验中学'},
  {n: '许可可', bio: '在学日语 · 喜欢村上春树', city: '南京 · 来过 5 次', org: '城南读书会', job: '翻译社'},
  {n: '沈一舟', bio: '跑步 · 读科幻 · 养了两只猫', city: '上海 · 来过 11 次', org: '城南读书会', job: '软件工程'},
  {n: '何夏', bio: '咖啡店主 · 书架比菜单长', city: '杭州 · 来过 8 次', org: '城南读书会', job: '巷口咖啡'},
  {n: '苏念', bio: '博物馆讲解员 · 爱读传记', city: '宁波 · 来过 4 次', org: '城南读书会', job: '市博物馆'},
  {n: '唐果', bio: '大学生 · 正在读《百年孤独》', city: '上海 · 来过 3 次', org: '城南读书会', job: '中文系'},
  {n: '江远', bio: '摄影 · 喜欢旅行文学', city: '厦门 · 来过 6 次', org: '城南读书会', job: '自由摄影'},
  {n: '孟晴', bio: '护士 · 夜班前读两页诗', city: '上海 · 来过 10 次', org: '城南读书会', job: '社区医院'},
  {n: '方知', bio: '建筑师 · 收集旧书', city: '杭州 · 来过 9 次', org: '城南读书会', job: '设计院'},
  {n: '宋雨桐', bio: '编辑 · 每月读八本', city: '北京 · 来过 2 次', org: '城南读书会', job: '出版社'},
  {n: '韩冬', bio: '厨师 · 喜欢汪曾祺', city: '上海 · 来过 7 次', org: '城南读书会', job: '小馆子'},
  {n: '罗青', bio: '退休工程师 · 读史记', city: '无锡 · 来过 14 次', org: '城南读书会', job: '已退休'},
];
const first = (n: string) => Array.from(n)[n.length > 2 ? 1 : 0];

// 墙上的小资料卡（世界坐标里 520×312）
const CW = 520, CH = 312;
const WallCard: React.FC<{p: number}> = ({p}) => {
  const P = PEOPLE[p];
  return (
    <div style={{position: 'relative', width: CW, height: CH, borderRadius: 18, background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(242,246,251,0.9))', boxShadow: '0 22px 50px rgba(40,60,90,0.10), 0 0 0 1px rgba(40,60,90,0.05)', fontFamily: SANS}}>
      <Banner p={p + 1} h={112} r={18} />
      <Avatar ch={first(P.n)} p={p} size={92} ring={4} style={{position: 'absolute', left: 26, top: 62}} />
      <div style={{position: 'absolute', right: 24, top: 124, display: 'flex', gap: 10}}>
        <div style={{width: 18, height: 18, borderRadius: 4, background: '#e8b84a'}} />
        <div style={{width: 14, height: 16, borderRadius: '7px 7px 3px 3px', background: '#8b919c'}} />
      </div>
      <div style={{position: 'absolute', left: 28, top: 162, fontSize: 23, fontWeight: 700, color: INK}}>{P.n}<span style={{fontSize: 14, fontWeight: 400, color: SUB}}>  · 老成员</span></div>
      <div style={{position: 'absolute', left: 28, top: 196, fontSize: 15, color: '#3a3f47', width: 280, whiteSpace: 'nowrap', overflow: 'hidden'}}>{P.bio}</div>
      <div style={{position: 'absolute', left: 28, top: 218, fontSize: 13, color: SUB}}>{P.city}</div>
      <div style={{position: 'absolute', left: 28, top: 240, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: SUB}}>
        <Avatar ch="满" p={0} size={16} /><Avatar ch="哲" p={2} size={16} style={{marginLeft: -8}} />2 位共同书友
      </div>
      <div style={{position: 'absolute', left: 28, top: 266, display: 'flex', gap: 8}}>
        <div style={{padding: '5px 14px', borderRadius: 14, background: BLUE, color: '#fff', fontSize: 12, fontWeight: 600}}>＋ 邀请</div>
        <div style={{padding: '4px 12px', borderRadius: 14, border: `1.5px solid ${BLUE}`, color: BLUE, fontSize: 12}}>收藏</div>
        <div style={{padding: '4px 12px', borderRadius: 14, border: '1.5px solid #9aa0aa', color: '#5f6570', fontSize: 12}}>更多</div>
      </div>
      <div style={{position: 'absolute', left: 330, top: 166, fontSize: 13, color: '#3a3f47', lineHeight: '22px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}><div style={{width: 18, height: 18, borderRadius: 4, background: '#3fa37a'}} />{P.org}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 6}}><div style={{width: 18, height: 18, borderRadius: 4, background: PAL[(p + 3) % 8][1]}} />{P.job}</div>
      </div>
    </div>
  );
};

// 卡片墙：错位砖墙
const COLP = 780, ROWP = 400;
const ROWOFF: Record<string, number> = {'-2': -150, '-1': 250, '0': 0, '1': 330, '2': 80};
const WALL: {x: number; y: number; p: number}[] = [];
for (let r = -2; r <= 2; r++) {
  for (let c = -3; c <= 4; c++) {
    const x = c * COLP + ROWOFF[String(r)] + (r ? (hash(r, c) - 0.5) * 50 : 0);
    const y = r * ROWP + (r ? (hash(c, r) - 0.5) * 30 : 0);
    const p = r === 0 && c === 0 ? 0 : r === 0 && c === 1 ? 1 : 2 + (((r + 2) * 8 + c + 3) * 5) % (PEOPLE.length - 2);
    WALL.push({x, y, p});
  }
}

// ───────── 叶影（原片暖白底右上角是一枝树叶的影子：叶片清楚、边缘软，轻轻晃）─────────
const LEAVES = Array.from({length: 26}, (_, i) => ({t: i / 25, side: i % 2 ? 1 : -1, len: 70 + hash(i, 7) * 50, w: 26 + hash(i, 8) * 12}));
const LeafShadow: React.FC<{f: number; x: number; y: number; scale?: number; rot?: number; opacity?: number; blur?: number}> = ({f, x, y, scale = 1, rot = 0, opacity = 0.16, blur = 5}) => {
  const sway = Math.sin(f / 38) * 2.2 + Math.sin(f / 17) * 0.8;
  return (
    <svg width={900} height={900} viewBox="0 0 900 900" style={{position: 'absolute', left: x - 450, top: y - 450, opacity, filter: `blur(${blur}px)`, transform: `rotate(${(rot + sway).toFixed(2)}deg) scale(${scale})`, transformOrigin: '50% 50%'}}>
      {[0, 1].map((b) => {
        const sx = 820, sy = 60 + b * 120, ex = 120 + b * 160, ey = 520 + b * 220;
        const px = (t: number) => sx + (ex - sx) * t + Math.sin(t * 3) * 40, py = (t: number) => sy + (ey - sy) * t + Math.sin(t * 2.4) * 30;
        return (
          <g key={b} fill="#5b5650">
            <path d={`M${sx} ${sy} Q${(sx + ex) / 2 + 60} ${(sy + ey) / 2 - 40} ${ex} ${ey}`} stroke="#5b5650" strokeWidth={5} fill="none" />
            {LEAVES.filter((_, i) => i % 2 === b || b === 0).map((l, i) => {
              const t = 0.06 + l.t * 0.92, X = px(t), Y = py(t), a = Math.atan2(ey - sy, ex - sx) * 180 / Math.PI + l.side * (55 + Math.sin(f / 23 + i) * 5);
              return <ellipse key={i} cx={X} cy={Y} rx={l.len / 2} ry={l.w / 2} transform={`rotate(${a.toFixed(1)} ${X.toFixed(1)} ${Y.toFixed(1)}) translate(${(l.len / 2).toFixed(1)} 0)`} />;
            })}
          </g>
        );
      })}
    </svg>
  );
};

// ───────── 按钮 + 液态光泡（按下 → 原字淡出 → 光泡从指针尖往右扩、擦出新字 → 回弹） ─────────
const BubbleButton: React.FC<{f: number; t: number; w: number; h: number; tipX: number; before: React.ReactNode; after: React.ReactNode; bg0: string; bg1: string; fg1: string; fs: number}> = ({f, t, w, h, tipX, before, after, bg0, bg1, fg1, fs}) => {
  const press = ramp(f, t, 3, EASE.out);
  const scale = f < t ? 1 : f < t + 9 ? 1 - 0.05 * press : mix(0.95, 1, EASE.overshoot(clamp((f - t - 9) / 5)));
  const tb = t + 3;
  const r = f < tb ? 0 : 12 + ramp(f, tb, 6, EASE.out) * (w * 1.05);
  const bubA = f < tb ? 0 : 1 - ramp(f, tb + 6, 5, EASE.smooth);
  const done = f >= tb + 7;
  const inner = (content: React.ReactNode, color: string) => (
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: fs * 0.35, color, fontSize: fs, fontWeight: 600, fontFamily: SANS, whiteSpace: 'nowrap'}}>{content}</div>
  );
  return (
    <div style={{position: 'relative', width: w, height: h, borderRadius: h / 2, overflow: 'hidden', transform: `scale(${scale.toFixed(4)})`, background: done ? bg1 : bg0, boxShadow: done && bg1 !== bg0 ? 'inset 0 0 0 1.5px rgba(120,160,240,0.35)' : '0 4px 12px rgba(47,111,228,0.25)'}}>
      {!done && <div style={{position: 'absolute', inset: 0, opacity: 1 - ramp(f, t, 3, EASE.out)}}>{inner(before, '#fff')}</div>}
      {r > 0 && (
        <div style={{position: 'absolute', inset: 0, clipPath: done ? undefined : `circle(${r.toFixed(1)}px at ${tipX}px 50%)`}}>
          <div style={{position: 'absolute', inset: 0, background: bg1}} />
          {inner(after, fg1)}
        </div>
      )}
      {r > 0 && bubA > 0.01 && (
        <div style={{position: 'absolute', left: tipX - r, top: h / 2 - r, width: r * 2, height: r * 2, borderRadius: '50%', opacity: bubA, background: 'radial-gradient(circle at 38% 36%, rgba(255,255,255,0.6), rgba(205,228,255,0.38) 55%, rgba(170,205,255,0.3) 78%, rgba(255,255,255,0.55) 96%)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.85), inset 0 0 14px rgba(255,255,255,0.7)'}} />
      )}
    </div>
  );
};

// ───────── 背景 ─────────
const BgCool: React.FC<{f: number; warm: number}> = ({f, warm}) => (
  <AbsoluteFill style={{background: 'linear-gradient(165deg, #e6edf7 0%, #f4f7fb 45%, #e3eaf4 100%)', overflow: 'hidden'}}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{position: 'absolute', left: -300 + i * 760 + f * 0.9 + Math.sin(f / 70 + i) * 40, top: -800, width: 240 + i * 90, height: 2800, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.7), rgba(255,255,255,0))', transform: 'rotate(-30deg)'}} />
    ))}
    <AbsoluteFill style={{background: 'linear-gradient(165deg, #f7f1ea, #fbf8f3 50%, #f1ebe3)', opacity: warm}} />
    <LeafShadow f={f} x={1700} y={120} scale={1.2} rot={-14} opacity={0.08} blur={16} />
  </AbsoluteFill>
);
const blob = (x: number, y: number, rx: number, ry: number, c: string) => `radial-gradient(${rx}px ${ry}px at ${x.toFixed(0)}px ${y.toFixed(0)}px, ${c} 0%, rgba(255,255,255,0) 100%)`;
const BgBlobs: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: [
    blob(330 + Math.sin(f / 50) * 40, 170 + Math.cos(f / 60) * 30, 900, 650, 'rgba(246,196,182,0.95)'),
    blob(1640 + Math.cos(f / 55) * 40, 150, 850, 640, 'rgba(176,210,250,0.95)'),
    blob(900 + Math.sin(f / 65) * 50, 1180, 1200, 600, 'rgba(204,200,224,0.9)'),
    blob(960, 520, 700, 420, 'rgba(250,248,247,0.9)'),
    'linear-gradient(180deg, #f1eef0, #ebe9ef)'].join(', ')}} />
);
const BgWarm: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: 'linear-gradient(160deg, #f6f2ec, #fbf9f6 50%, #f2ede7)', overflow: 'hidden'}}>
    {/* 左边很淡的斜光 */}
    <div style={{position: 'absolute', left: -200 + Math.sin(f / 80) * 20, top: -600, width: 360, height: 2600, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.75), rgba(255,255,255,0))', transform: 'rotate(-28deg)'}} />
    {/* 右上角叶影（2026-11-17 用户指出原来没有叶影：原来是几团灰色失焦影） */}
    <LeafShadow f={f} x={1640} y={170} scale={1.05} rot={-8} opacity={0.15} blur={5} />
  </AbsoluteFill>
);

// ───────── 外圈深灰圆角画框 ─────────
const Bezel: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div style={{position: 'absolute', inset: 9, borderRadius: 40, boxShadow: '0 0 0 40px #3a3d43, inset 0 0 0 1.5px rgba(255,255,255,0.35)'}} />
    <div style={{position: 'absolute', inset: 0, borderRadius: 48, boxShadow: 'inset 0 0 0 2px #26282c'}} />
  </AbsoluteFill>
);

// 世界容器（相机）：屏幕 = (p - c) × s + 画面中心
const World: React.FC<{cx: number; cy: number; s: number; children: React.ReactNode; style?: React.CSSProperties}> = ({cx, cy, s, children, style}) => (
  <AbsoluteFill style={style}>
    <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${(960 - cx * s).toFixed(2)}px, ${(540 - cy * s).toFixed(2)}px) scale(${s.toFixed(5)})`}}>{children}</div>
  </AbsoluteFill>
);
const wob = (f: number, i: number, a = 12) => [a * Math.sin(f / 19 + i * 2.1) + a * 0.6 * Math.sin(f / 9.3 + i * 4.7), a * 0.8 * Math.cos(f / 23 + i * 1.3) + a * 0.5 * Math.sin(f / 11.7 + i * 3.1)];

// ═════════════ A：卡片墙 ═════════════
const SceneWall: React.FC<{f: number}> = ({f}) => {
  const s = sp(f, [[0, 3.4], [1, 2.25], [3, 2.04], [6, 1.95], [10, 1.89], [16, 1.83], [33, 1.72], [36, 1.66], [39, 1.45], [43, 1.24], [48, 1.1], [54, 1.03], [62, 1.0], [70, 1.03], [84, 1.13], [95, 1.24], [99, 1.32], [100, 1.5], [101, 1.8]]);
  const cx = sp(f, [[0, 60], [16, 48], [33, 40], [36, 70], [40, 160], [44, 240], [50, 300], [60, 330], [66, 350], [72, 410], [76, 500], [80, 600], [84, 680], [92, 750], [99, 775], [101, 785]]);
  const cy = sp(f, [[0, 40], [16, 30], [33, 18], [39, 45], [46, 95], [52, 118], [60, 92], [66, 55], [80, 22], [94, 8], [101, 4]]);
  const blur = f >= 100 ? (f >= 101 ? 7 : 3) : f < 1 ? 2 : 0;
  // 只画画面里看得见的卡
  const vis = WALL.filter((c) => Math.abs((c.x - cx) * s) < 960 + CW * s && Math.abs((c.y - cy) * s) < 540 + CH * s);
  const cursors: {x: number; y: number; dir: number; o: number}[] = [];
  const add = (i: number, bx: number, by: number, dir: number, o = 1, a = 12) => { const [dx, dy] = wob(f * 1.5, i, a * 1.7); cursors.push({x: bx + dx, y: by + dy, dir: dir + 14 * Math.sin(f / 31 + i), o}); };
  if (f >= 1) add(1, sp(f, [[1, -345], [12, -300], [17, -285]]), sp(f, [[1, -20], [17, -40]]), sp(f, [[1, -90], [10, -120], [17, -170], [33, -175]]), 1, 8);
  if (f >= 16) add(2, sp(f, [[16, 240], [19, 250], [22, 300]]), sp(f, [[16, -520], [19, -185], [22, -120]]), 0);
  if (f >= 24) add(3, sp(f, [[24, 430], [30, 200]]), sp(f, [[24, 420], [30, 190]]), -135);
  if (f >= 27) add(4, sp(f, [[27, -50], [33, -120]]), sp(f, [[27, 500], [33, 205]]), -100);
  add(5, 150, 340, -135, 1, 18); add(6, 1310, 440, 180, 1, 18); add(7, 80, -290, -135, 1, 18); add(8, 1180, -480, -45, 1, 18); add(9, -620, 380, -60, 1, 18); add(10, 1900, -60, -150, 1, 18);
  if (f >= 56) cursors.push({x: sp(f, [[56, 1140], [70, 1060], [82, 560], [92, 495], [101, 492]]) + Math.sin(f / 9) * 3, y: sp(f, [[56, 150], [70, 120], [82, 50], [92, 32], [101, 30]]), dir: sp(f, [[56, -160], [74, 180], [84, 30], [92, -10], [101, -20]]), o: 1});
  return (
    <World cx={cx} cy={cy} s={s} style={{filter: blur ? `blur(${blur}px)` : undefined}}>
      {vis.map((c, i) => <div key={i} style={{position: 'absolute', left: c.x - CW / 2, top: c.y - CH / 2}}><WallCard p={c.p} /></div>)}
      {cursors.map((c, i) => <Cursor key={i} x={c.x} y={c.y} dir={c.dir} size={30} opacity={c.o} />)}
    </World>
  );
};

// ═════════════ B：干净大卡（世界坐标 1100×730） ═════════════
const BigCard: React.FC<{f: number}> = ({f}) => {
  const row = (a: number) => rev(f, a, 3, 5);
  const col = (a: number) => ink(ramp(f, a, 4, EASE.out));
  return (
    <div style={{position: 'relative', width: 1100, height: 730, borderRadius: 28, background: 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(240,245,251,0.92))', boxShadow: '0 40px 90px rgba(40,60,90,0.12), 0 0 0 1px rgba(40,60,90,0.05)', fontFamily: SANS}}>
      <Banner p={2} h={250} r={28} />
      <Avatar ch="以" p={1} size={200} ring={7} style={{position: 'absolute', left: 64, top: 140}} />
      <div style={{position: 'absolute', right: 56, top: 282, display: 'flex', gap: 20, ...row(106)}}>
        <div style={{width: 36, height: 36, borderRadius: 7, background: '#e8b84a', color: '#fff', fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>书</div>
        <div style={{width: 26, height: 30, marginTop: 3, borderRadius: '13px 13px 5px 5px', background: '#7d838e'}} />
      </div>
      <div style={{position: 'absolute', left: 72, top: 352, display: 'flex', alignItems: 'center', gap: 12, ...row(101)}}>
        <span style={{fontSize: 50, fontWeight: 650, color: col(101)}}>周以宁</span>
        <svg width="30" height="34" viewBox="0 0 30 34" style={{opacity: f >= 104 ? 1 : 0}}><path d="M15 2 L27 7 V16 C27 24 21 30 15 32 C9 30 3 24 3 16 V7 Z" fill="none" stroke="#5f6570" strokeWidth="2.6" /><path d="M9.5 17 L13.5 21 L21 13" fill="none" stroke="#5f6570" strokeWidth="2.6" strokeLinecap="round" /></svg>
        <span style={{fontSize: 30, color: SUB, opacity: f >= 104 ? 1 : 0}}>· 老成员</span>
      </div>
      <div style={{position: 'absolute', left: 72, top: 428, fontSize: 32, color: col(107), ...row(107)}}>插画师 · 周末喜欢读小说</div>
      <div style={{position: 'absolute', left: 72, top: 478, fontSize: 27, color: SUB, ...row(108)}}>杭州 · 西湖区 · <span style={{color: BLUE, fontWeight: 600}}>联系方式</span></div>
      <div style={{position: 'absolute', left: 72, top: 524, fontSize: 27, color: SUB, ...row(111)}}><span style={{color: col(111), fontWeight: 600}}>参加过 12 次聚会</span> · 推荐过 3 本书</div>
      <div style={{position: 'absolute', left: 72, top: 570, display: 'flex', alignItems: 'center', gap: 10, fontSize: 26, color: '#4a4f58', ...row(109)}}>
        <Avatar ch="满" p={0} size={36} ring={2} /><Avatar ch="哲" p={2} size={36} ring={2} style={{marginLeft: -18}} />
        <span><b style={{fontWeight: 600}}>小满</b> 和 <b style={{fontWeight: 600}}>阿哲</b> 也在这个读书会</span>
      </div>
      <div style={{position: 'absolute', left: 72, top: 632, display: 'flex', alignItems: 'center', gap: 18, ...row(110)}}>
        <BubbleButton f={f} t={153} w={220} h={66} tipX={62} fs={27} bg0={BLUE} bg1={BLUE} fg1="#fff"
          before={<><span style={{fontSize: 30}}>＋</span>邀请</>}
          after={<><svg width="24" height="24" viewBox="0 0 24 24"><path d="M4 12.5 L9.5 18 L20 6.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>已邀请</>} />
        <div style={{width: 56, height: 56, borderRadius: 28, border: '2.5px solid #7d838e', color: '#5f6570', fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'}}>···</div>
      </div>
      <div style={{position: 'absolute', left: 740, top: 360, fontSize: 28, color: '#2f343c', lineHeight: '36px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, ...row(106)}}>
          <div style={{width: 44, height: 44, borderRadius: 22, background: '#3fa37a', color: '#fff', fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>城</div>
          {f < 110 ? <div style={{width: 150, height: 14, borderRadius: 7, background: '#e3e7ee'}} /> : <span style={rev(f, 110, 3, 4)}>城南读书会</span>}
        </div>
        <div style={{display: 'flex', alignItems: 'flex-start', gap: 14, marginTop: 22, ...row(106)}}>
          <div style={{width: 44, height: 44, borderRadius: 8, background: '#7f55e6', color: '#fff', fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>画</div>
          {f < 110 ? <div style={{width: 170, height: 14, marginTop: 15, borderRadius: 7, background: '#e3e7ee'}} /> : <span style={rev(f, 111, 3, 4)}>自由插画师<br />工作室</span>}
        </div>
      </div>
    </div>
  );
};
const bigCam = (f: number) => ({
  s: sp(f, [[102, 1.0], [103, 1.1], [104, 1.16], [106, 1.2], [109, 1.23], [112, 1.25], [116, 1.265], [130, 1.31], [131, 1.36], [132, 1.6], [133, 1.72], [135, 1.76], [150, 1.79], [160, 1.815], [166, 1.86], [170, 1.95], [175, 2.05], [180, 2.12], [192, 2.2], [216, 2.26]]),
  cx: sp(f, [[102, 550], [116, 548], [130, 545], [131, 530], [132, 470], [134, 434], [150, 420], [160, 414], [166, 408], [175, 440], [192, 480], [216, 500]]),
  cy: sp(f, [[102, 400], [116, 392], [130, 386], [131, 400], [132, 445], [134, 470], [150, 474], [160, 478], [166, 490], [175, 470], [192, 440], [216, 430]]),
});
const SceneBig: React.FC<{f: number}> = ({f}) => {
  const {s, cx, cy} = bigCam(f);
  const blur = sp(f, [[165, 0], [170, 2], [174, 8], [177, 15], [184, 20], [216, 26]]);
  const op = sp(f, [[168, 1], [176, 0.75], [190, 0.55], [216, 0]]);
  const cur = f < 168;
  const press = (f >= 153 && f < 158 ? ramp(f, 153, 2, EASE.out) : 0) * (1 - ramp(f, 156, 3, EASE.out));
  return (
    <World cx={cx} cy={cy} s={s} style={{filter: blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : undefined, opacity: op}}>
      <BigCard f={f} />
      {cur && <Cursor size={60} press={press}
        x={Math.sin(f / 7) * 4 + sp(f, [[102, 58], [124, 62], [128, 80], [131, 112], [134, 150], [146, 138], [153, 134]])}
        y={Math.cos(f / 9) * 4 + sp(f, [[102, 470], [124, 474], [128, 500], [131, 540], [134, 600], [146, 646], [153, 652]])}
        dir={sp(f, [[102, -40], [124, -30], [127, 20], [130, 70], [132, -20], [134, -100], [142, -125], [153, -132]])} />}
    </World>
  );
};

// ═════════════ C–E：写邀请（世界坐标，卡宽 880） ═════════════
const BODY = ['以宁，好久不见！', '这周六下午三点，读书会在老地方的二楼', '小院聚一聚，这次聊《额尔古纳河右岸》。', '没读完也没关系，来喝杯茶、聊聊近况就好。', '有空回我一声，我给你留个靠窗的位子。', '小满'];
const BODY_Y = [0, 66, 116, 166, 216, 284];
const BODY_TOP = 300;
const STARTS: number[] = [];
{ let acc = 0; for (const l of BODY) { STARTS.push(acc); acc += Array.from(l).length; } }
const NCH = STARTS[STARTS.length - 1] + 2;
const TAIL = 10, GHOST = 26;
const head = (f: number) => (f - 209) * 3.6;
const cardH = (f: number) => {
  const h = head(f);
  let b = BODY_Y[0] + 50;
  for (let i = 1; i < BODY.length; i++) b += (BODY_Y[i] - BODY_Y[i - 1]) * EASE.out(clamp((h - (STARTS[i] - GHOST)) / 12));
  return BODY_TOP + b + 132;
};
const msgCam = (f: number) => {
  // 镜头跟着正在写的那一行往下，写完往上回推（一条连续曲线，不来回抖）
  return {
    s: sp(f, [[176, 1.0], [209, 1.0], [236, 1.03], [250, 1.04], [256, 1.07], [260, 1.12], [264, 1.24], [270, 1.29], [276, 1.33], [280, 1.38], [283, 1.5]]),
    cx: sp(f, [[176, 580], [209, 585], [236, 590], [250, 600], [256, 640], [260, 690], [264, 735], [276, 760], [280, 772], [283, 795]]),
    cy: sp(f, [[176, 310], [209, 312], [213, 335], [219, 365], [225, 392], [231, 415], [236, 425], [241, 421], [246, 408], [256, 388], [264, 328], [276, 312], [280, 302], [283, 282]]),
  };
};
const TONES = ['轻松', '正式', '简短', '自定义…'];
const MsgCard: React.FC<{f: number}> = ({f}) => {
  const H = cardH(f);
  const h = head(f);
  const ph = 1 - ramp(f, 206, 3, EASE.out);
  const ring = ramp(f, 185, 8, EASE.out);
  let g = 0;
  return (
    <div style={{position: 'relative', width: 880, height: H, fontFamily: SANS}}>
      {/* 语气下拉：在消息卡后面，从右上角滑出来 */}
      {f >= 250 && (() => {
        const x = mix(540, 862, ramp(f, 250, 12, EASE.out));
        const sel = f >= 274;
        return (
          <div style={{position: 'absolute', left: x, top: 46, width: 330, height: 352, borderRadius: 22, background: 'linear-gradient(135deg, rgba(255,255,255,0.94), rgba(243,246,251,0.9))', boxShadow: '0 24px 60px rgba(40,60,90,0.12), 0 0 0 1px rgba(40,60,90,0.05)'}}>
            <div style={{position: 'absolute', left: 30, top: 26, display: 'flex', alignItems: 'center', gap: 10, fontSize: 21, color: '#8a909a', ...rev(f, 256, 3, 4)}}>
              <div style={{width: 18, height: 20, borderRadius: 3, border: '2px solid #8a909a'}} />语气
            </div>
            {TONES.map((t, i) => {
              const a = 256 + [0, 1, 2, 4][i];
              const k = ramp(f, a, 3, EASE.out);
              return (
                <div key={t} style={{position: 'absolute', left: 30, top: 78 + i * 64, fontSize: 30, fontWeight: i === 0 && sel ? 600 : 400, color: i === 0 && sel ? BLUE : `rgb(${Math.round(mix(205, 92, k))},${Math.round(mix(208, 98, k))},${Math.round(mix(214, 108, k))})`, ...rev(f, a, 3, 5)}}>{t}</div>
              );
            })}
            {f >= 274 && <div style={{position: 'absolute', left: 250, top: 82, width: 40, height: 40, borderRadius: 20, background: CHECK, transform: `scale(${popS(f, 274, 4).toFixed(3)})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <svg width="24" height="24" viewBox="0 0 24 24"><path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>}
          </div>
        );
      })()}
      {/* 卡面：半透明乳白 */}
      <div style={{position: 'absolute', inset: 0, borderRadius: 34, background: 'linear-gradient(135deg, rgba(255,255,255,0.93), rgba(244,247,252,0.86))', boxShadow: '0 40px 90px rgba(60,60,100,0.12), 0 0 0 1px rgba(40,60,90,0.05)'}} />
      {/* 双圆标志：黑点旁边长出空心圆环 */}
      <div style={{position: 'absolute', left: 56 - 20 * ring, top: 54 + 12 * ring, width: 28, height: 28, borderRadius: 14, border: '3.5px solid #16181c', boxSizing: 'border-box', opacity: ring, transform: `scale(${mix(0.4, 1, ring).toFixed(3)})`}} />
      <div style={{position: 'absolute', left: 56, top: 46, width: 28, height: 28, borderRadius: 14, background: '#16181c'}} />
      <div style={{position: 'absolute', left: 56, top: 104, fontSize: 40, fontWeight: 600, color: INK, letterSpacing: '-0.01em'}}>写一条邀请</div>
      <div style={{position: 'absolute', left: 56, top: 180, display: 'flex', alignItems: 'center', gap: 18}}>
        <Avatar ch="以" p={1} size={68} />
        <div><div style={{fontSize: 30, fontWeight: 650, color: INK}}>周以宁</div><div style={{fontSize: 22, color: SUB, ...rev(f, 182, 4, 4)}}>插画师 · 杭州 · 读书会老成员</div></div>
      </div>
      {ph > 0.01 && <div style={{position: 'absolute', left: 56, top: BODY_TOP, fontSize: 30, color: '#b8bdc6', opacity: ph * (f < 184 ? 0 : ramp(f, 184, 4, EASE.out))}}>比如：我们上次一起读了……</div>}
      {f >= 207 && BODY.map((line, li) => (
        <div key={li} style={{position: 'absolute', left: 56, top: BODY_TOP + BODY_Y[li], fontSize: 32, lineHeight: '46px', whiteSpace: 'pre', color: INK}}>
          {Array.from(line).map((ch, ci) => {
            const idx = STARTS[li] + ci; g++;
            const d = h - idx;
            if (d >= TAIL) return <span key={ci}>{ch}</span>;
            if (d >= 0) {
              const k = d / TAIL;
              const c = ink(0.2 + 0.8 * k);
              const b = (1 - k) * 3.2;
              return <span key={ci} style={b > 0.4 ? {color: 'transparent', textShadow: `0 0 ${b.toFixed(1)}px ${c}`} : {color: c}}>{ch}</span>;
            }
            const a = 0.18 * clamp(1 + d / GHOST);
            return <span key={ci} style={{color: 'transparent', textShadow: `0 0 5px rgba(150,156,168,${a.toFixed(3)})`}}>{ch}</span>;
          })}
        </div>
      ))}
      <div style={{position: 'absolute', left: 880 - 56 - 236, top: H - 56 - 66}}>
        <BubbleButton f={f} t={243} w={236} h={66} tipX={96} fs={27} bg0={BLUE} bg1="rgba(196,218,255,0.75)" fg1="#4c7fe8"
          before={<><svg width="24" height="24" viewBox="0 0 24 24"><path d="M3 11 L21 3 L14 21 L11 13 Z" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" /></svg>全部发送</>}
          after={<><svg width="24" height="24" viewBox="0 0 24 24"><path d="M3 11 L21 3 L14 21 L11 13 Z" fill="none" stroke="#4c7fe8" strokeWidth="2.4" strokeLinejoin="round" /></svg>已发送</>} />
      </div>
    </div>
  );
};
const SceneMsg: React.FC<{f: number}> = ({f}) => {
  const {s, cx, cy} = msgCam(f);
  // 入场：从右上虚着进来往左下落定
  const k = sp(f, [[178, 0], [179, 0.45], [180, 0.7], [182, 0.86], [186, 0.95], [194, 0.99], [200, 1]]);
  const dx = mix(800, 0, k), dy = mix(-300, 0, k), sc = mix(1.3, 1, k);
  const blur = mix(13, 0, clamp(k * 1.15));
  const op = mix(0.4, 1, clamp(k * 1.6));
  const H = cardH(f);
  const sendY = H - 56 - 33;
  let cur: React.ReactNode = null;
  if (f >= 188) {
    const press = (f >= 205 && f < 209 ? 1 - ramp(f, 207, 2) : 0) + (f >= 243 && f < 249 ? 1 - ramp(f, 246, 3) : 0) + (f >= 273 && f < 278 ? 1 - ramp(f, 276, 2) : 0);
    const x = sp(f, [[188, -360], [192, -120], [198, 60], [201, 110], [208, 112], [214, 200], [219, 270], [225, 330], [228, 420], [230, 880], [232, 740], [237, 712], [243, 700], [250, 706], [255, 760], [258, 880], [260, 960], [262, 1080], [264, 1150], [273, 1158], [283, 1170]]);
    const y = sp(f, [[188, 860], [192, 620], [198, 345], [201, 330], [208, 328], [214, 318], [219, 300], [225, 120], [228, 140], [230, sendY - 60], [232, sendY - 40], [237, sendY - 10], [243, sendY + 4], [250, sendY + 6], [255, sendY + 30], [258, sendY + 40], [260, 470], [262, 260], [264, 150], [273, 146], [283, 140]]);
    const dir = sp(f, [[188, -10], [192, -40], [198, -120], [201, -135], [209, -135], [219, -120], [225, -150], [227, -100], [229, 30], [231, 45], [236, -30], [240, -90], [250, -90], [255, 30], [258, 20], [260, -60], [264, -135], [283, -140]]);
    cur = <Cursor x={x} y={y} dir={dir} size={84} press={clamp(press)} />;
  }
  return (
    <World cx={cx} cy={cy} s={s}>
      <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${sc.toFixed(4)})`, filter: blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : undefined, opacity: op}}>
        <MsgCard f={f} />
      </div>
      {cur}
    </World>
  );
};

// ═════════════ F：成功卡（760×470） ═════════════
const SceneSuccess: React.FC<{f: number}> = ({f}) => {
  const s = sp(f, [[283, 1.12], [289, 1.06], [305, 1.03], [318, 1.0], [328, 0.96]]);
  const X = sp(f, [[283, 1380], [285, 1100], [287, 960], [289, 895], [305, 845], [318, 775], [328, 640]]);
  const Y = sp(f, [[283, 450], [289, 505], [328, 530]]);
  const cx = 400 - (X - 960) / s, cy = 305 - (Y - 540) / s;
  const word = (t: string, a: number) => {
    if (f < a) return <span style={{opacity: 0}}>{t}</span>;
    const k = ramp(f, a, 5, EASE.out);
    const b = (1 - k) * 6;
    const c = ink(k);
    return <span style={b > 0.4 ? {color: 'transparent', textShadow: `0 0 ${b.toFixed(1)}px ${c}`} : {color: c}}>{t}</span>;
  };
  const ck = f < 285 ? 0.12 : popS(f, 285, 4);
  return (
    <World cx={cx} cy={cy} s={s}>
      <div style={{position: 'relative', width: 800, height: 610, borderRadius: 40, background: 'linear-gradient(135deg, rgba(255,255,255,0.94), rgba(242,246,252,0.88))', boxShadow: '0 40px 90px rgba(40,60,100,0.12), 0 0 0 1px rgba(40,60,90,0.05)', fontFamily: SANS}}>
        <div style={{position: 'absolute', left: 56, top: 50, width: 116, height: 116, borderRadius: 58, background: CHECK, transform: `scale(${ck.toFixed(3)})`, boxShadow: '0 8px 20px rgba(30,111,224,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {f >= 286 && <svg width="62" height="62" viewBox="0 0 24 24"><path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </div>
        <div style={{position: 'absolute', left: 56, top: 192, fontSize: 104, fontWeight: 600, lineHeight: '124px', letterSpacing: '-0.02em', whiteSpace: 'pre'}}>
          <div>{word('已发出', 287)}{word(' 25 条', 290)}</div>
          <div>{word('读书会', 293)}{word('邀请', 296)}</div>
        </div>
        <div style={{position: 'absolute', left: 56, top: 462, display: 'flex', alignItems: 'center'}}>
          {['以', '哲', '可', '舟'].map((c, i) => {
            const p = popS(f, 294 + i * 2, 5);
            return <div key={c} style={{marginLeft: i ? -16 : 0, transform: `scale(${p.toFixed(3)})`, opacity: f < 294 + i * 2 ? 0 : 1, position: 'relative', zIndex: i}}><Avatar ch={c} p={[1, 2, 3, 4][i]} size={104} ring={5} /></div>;
          })}
          <div style={{marginLeft: 18, padding: '12px 22px', borderRadius: 32, background: '#eef1f5', fontSize: 44, fontWeight: 600, color: '#3b4048', transform: `scale(${popS(f, 302, 5).toFixed(3)})`, opacity: f < 302 ? 0 : 1}}>+21</div>
        </div>
      </div>
    </World>
  );
};

// ═════════════ G–H：三词标题 + 三张回复卡 ═════════════
const WORDS = ['老朋友。', '新朋友。', '读书会。'];
const WORD_AT = [328, 332, 336];
const TFS = 100;
const Title: React.FC<{f: number; y: number}> = ({f, y}) => {
  const ls = mix(0.07, -0.015, ramp(f, 336, 7, EASE.out));
  const cw = TFS * (1 + ls);
  const ww = 4 * cw;
  const gs = WORDS.map((_, i) => ramp(f, WORD_AT[i], 3, EASE.out));
  const T = gs.reduce((a, g) => a + g * ww, 0);
  const dark = ramp(f, 337, 5, EASE.smooth);
  let acc = 0;
  return (
    <>
      {WORDS.map((w, i) => {
        if (f < WORD_AT[i]) return null;
        const left = 960 - T / 2 + acc; acc += gs[i] * ww;
        const k = ramp(f, WORD_AT[i], 4, EASE.out);
        const c = ink(mix(0.55 * k, 1, dark));
        const b = (1 - k) * 8;
        return <div key={i} style={{position: 'absolute', left, top: y - TFS * 0.62, fontSize: TFS, fontWeight: 500, letterSpacing: `${ls.toFixed(4)}em`, whiteSpace: 'pre', fontFamily: SANS, color: b > 0.4 ? 'transparent' : c, textShadow: b > 0.4 ? `0 0 ${b.toFixed(1)}px ${c}` : undefined}}>{w}</div>;
      })}
    </>
  );
};
const RES = [
  {t: '我来！', n: '14 人回复'},
  {t: '带个朋友行吗', n: '3 人回复'},
  {t: '下次一定', n: '7 人回复'},
];
const Check: React.FC<{size: number}> = ({size}) => (
  <div style={{width: size, height: size, borderRadius: size / 2, background: '#dcf4e6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
    <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24"><path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke="#1f9a5a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </div>
);
const ResultCard: React.FC<{i: number; grow: number; content: number}> = ({i, grow, content}) => {
  const R = RES[i];
  const H = 136 + 104 * grow;
  const sk = content < 0.5;
  const cs: React.CSSProperties = {opacity: clamp(content * 1.4), filter: content < 0.98 ? `blur(${((1 - content) * 4).toFixed(2)}px)` : undefined};
  return (
    <div style={{position: 'relative', width: 500, height: H, borderRadius: 20, background: 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(244,247,250,0.92))', boxShadow: '0 26px 60px rgba(70,60,50,0.11), 0 0 0 1px rgba(70,60,50,0.05)', fontFamily: SANS, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 30, top: 36, display: 'flex', alignItems: 'center', gap: 22}}>
        <Check size={62} />
        <div><div style={{fontSize: 36, fontWeight: 500, color: INK, letterSpacing: '-0.01em', whiteSpace: 'nowrap'}}>{R.t}</div><div style={{fontSize: 20, color: SUB, marginTop: 2}}>{R.n}</div></div>
      </div>
      {grow > 0.02 && (
        <div style={{position: 'absolute', left: 30, top: 150, right: 30, opacity: clamp(grow * 2)}}>
          {i === 0 && [['以宁：周六见，我带点心', '确认'], ['阿哲：三点准时到', '确认']].map(([a, b], r) => (
            <div key={r} style={{display: 'flex', alignItems: 'center', gap: 12, height: 38, fontSize: 19, color: '#3a3f47'}}>
              <div style={{width: 24, height: 24, borderRadius: 6, background: '#5b8def', flexShrink: 0}} />
              {sk ? <div style={{width: 230, height: 12, borderRadius: 6, background: '#e5e8ed'}} /> : <span style={cs}>{a}</span>}
              <span style={{padding: '2px 10px', borderRadius: 10, background: '#dcf4e6', color: '#1f9a5a', fontSize: 15, opacity: sk ? 0.4 : 1}}>{b}</span>
            </div>
          ))}
          {i > 0 && (
            <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 8}}>
              {[0, 1, 2, 3].map((k) => (
                <div key={k} style={{position: 'relative'}}>
                  {sk ? <div style={{width: 52, height: 52, borderRadius: 26, background: '#e5e8ed'}} /> : <div style={cs}><Avatar ch={['鹿', '桃', '远', '晴', '方', '冬', '青', '雨'][k + (i - 1) * 4]} p={k + i * 3} size={52} /></div>}
                  {i === 1 && <div style={{position: 'absolute', right: -3, bottom: -3, width: 20, height: 20, borderRadius: 10, background: '#2fbf6f', border: '2.5px solid #fff', opacity: sk ? 0.3 : 1}} />}
                </div>
              ))}
              {i === 2 && <div style={{padding: '6px 14px', borderRadius: 16, background: '#eef1f5', fontSize: 18, color: '#4a4f58', opacity: sk ? 0.3 : 1}}>+3</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
const CARD_FINAL = [[520, 610, -2], [990, 660, -4], [1450, 712, -6]];
const SceneTitle: React.FC<{f: number}> = ({f}) => {
  const ty = sp(f, [[328, 470], [341, 467], [344, 425], [348, 362], [352, 322], [357, 300], [399, 262]]);
  const out = ramp(f, 391, 9, EASE.smooth);
  const grow = ramp(f, 357, 8, EASE.out);
  const content = ramp(f, 360, 9, EASE.out);
  const drift = 44 * ramp(f, 360, 40, EASE.linear);
  return (
    <AbsoluteFill style={{filter: out > 0.01 ? `blur(${(out * 9).toFixed(2)}px)` : undefined, opacity: 1 - out * 0.35, transform: `scale(${(1 + out * 0.03).toFixed(4)})`}}>
      <Title f={f} y={ty} />
      <AbsoluteFill style={{perspective: 1600, transform: `translateY(${drift.toFixed(2)}px)`}}>
        {[0, 1, 2].map((i) => {
          const a = 335 + i * 4;
          if (f < a) return null;
          const [fx, fy, fr] = CARD_FINAL[i];
          const q = sp(f, [[a, 0], [a + 2, 0.36], [a + 5, 0.74], [a + 9, 0.94], [a + 17, 1]]);
          const bump = f > a + 9 && f < a + 19 ? Math.sin(Math.PI * (f - a - 9) / 10) * 0.012 : 0;
          const x = mix(fx + 190, fx, q), y = mix(fy + 330, fy, q);
          const rz = mix(i === 2 ? fr + 8 : fr - 4, fr, q) + 1.3 * Math.sin(f / 13 + i * 1.7);
          const sc = mix(0.46, 1.08, q) + bump;
          const b = (1 - clamp(q * 1.3)) * 7;
          return (
            <div key={i} style={{position: 'absolute', left: x - 250, top: y - 68, transform: `rotateY(${(-12 - i * 3).toFixed(1)}deg) rotateX(5deg) rotateZ(${rz.toFixed(2)}deg) scale(${sc.toFixed(4)})`, transformOrigin: '50% 30%', opacity: mix(0.25, 1, clamp(q * 1.5)), filter: b > 0.3 ? `blur(${b.toFixed(1)}px)` : undefined}}>
              <ResultCard i={i} grow={grow} content={content} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═════════════ I：聊天 App（窗口 1720×1040） ═════════════
const SIDE = ['周末读书会', '家里人', '跑步小队', '楼下咖啡店', '大学室友', '周三羽毛球', '猫咪领养群', '楼栋邻居', '摄影小组'];
const RECENT = ['整理聚会名单', '订二楼小院', '挑下次读的书', '问问谁带茶点', '做一张签到表', '提醒交场地费', '推荐三本新书', '算一下 AA 费用', '给新朋友发路线', '整理上次的笔记', '准备开场话题', '统计到场人数', '查周六的天气', '借一台投影仪'];
const COLL = 630, COLR = 1390;
const AppWin: React.FC<{f: number}> = ({f}) => {
  const fade = (a: number, d = 6) => rev(f, a, d, 4);
  const bubble = (t: string, y: number, a: number) => f >= a && (
    <div style={{position: 'absolute', right: 1720 - COLR, top: y, padding: '10px 20px', borderRadius: 20, background: '#eef0f3', fontSize: 20, color: INK, transform: `scale(${popS(f, a, 4).toFixed(3)})`, transformOrigin: '100% 50%'}}>{t}</div>
  );
  const thought = (y: number, a: number, s: string) => f >= a && <div style={{position: 'absolute', left: COLL, top: y, fontSize: 16, color: '#9aa0aa', ...fade(a, 4)}}>{s} ›</div>;
  const sweep = (x: number, y: number, w: number, h: number, a: number, d = 8) => {
    if (f < a || f > a + d + 4) return null;
    const p = clamp((f - a) / d);
    const o = Math.min(ramp(f, a, 2, EASE.out), 1 - ramp(f, a + d - 1, 4, EASE.smooth));
    return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 12, opacity: o, background: `linear-gradient(90deg, #eaf1ff 0%, #b9d1ff ${(20 + p * 50).toFixed(0)}%, #5d8ff0 ${(45 + p * 55).toFixed(0)}%, #eaf1ff 100%)`}} />;
  };
  const blueOut = ramp(f, 441, 9, EASE.smooth);
  return (
    <div style={{position: 'relative', width: 1720, height: 1040, borderRadius: 24, background: '#ffffff', boxShadow: '0 50px 120px rgba(70,60,50,0.16), 0 0 0 1px rgba(60,50,40,0.08)', overflow: 'hidden', fontFamily: SANS}}>
      {/* 顶栏 */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 56, background: '#f6f7f9', borderBottom: '1px solid #eceef1', display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 24}}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />)}
        <div style={{marginLeft: 220, padding: '7px 16px', borderRadius: 9, background: '#fff', fontSize: 16, color: '#3b404c', boxShadow: '0 1px 2px rgba(0,0,0,0.06)'}}>周末读书会 · 25 人</div>
        <div style={{padding: '7px 16px', fontSize: 16, color: '#8a8f9c'}}>日程</div>
        <div style={{flex: 1}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 8, marginRight: 24, fontSize: 15, color: '#6b7280'}}><Avatar ch="满" p={0} size={26} />小满</div>
      </div>
      {/* 侧栏 */}
      <div style={{position: 'absolute', left: 0, top: 56, width: 300, bottom: 0, background: '#f4f5f7', borderRight: '1px solid #eceef1', padding: '18px 22px', boxSizing: 'border-box', fontSize: 17, color: '#3b404c'}}>
        {['＋ 新对话', '◷ 日程', '☺ 通讯录', '☆ 收藏'].map((t) => <div key={t} style={{height: 34}}>{t}</div>)}
        <div style={{fontSize: 14, color: '#9aa0ab', margin: '14px 0 6px'}}>群聊</div>
        {SIDE.map((t, i) => <div key={t} style={{height: 32, display: 'flex', alignItems: 'center', gap: 10, borderRadius: 8, padding: '0 8px', margin: '0 -8px', background: i === 0 ? '#e5e8ed' : undefined}}><div style={{width: 8, height: 8, borderRadius: 4, background: PAL[i % 8][1]}} />{t}</div>)}
        <div style={{fontSize: 14, color: '#9aa0ab', margin: '14px 0 6px'}}>最近</div>
        {RECENT.map((t) => <div key={t} style={{height: 30, fontSize: 15, color: '#5b616c'}}>{t}</div>)}
      </div>
      {/* 对话区 */}
      {bubble('谁会来？', 86, 426)}
      {thought(146, 428, '想了 3 秒')}
      {f >= 435 && <div style={{position: 'absolute', left: COLL, top: 176, width: 760}}>
        <div style={{fontSize: 21, color: INK, ...fade(435)}}>14 位老朋友确认周六到场，我按到场顺序排好了座位。</div>
        <div style={{marginTop: 14, height: 84, width: 600, borderRadius: 12, border: '1px solid #e6e8ec', background: `rgba(${Math.round(mix(226, 255, blueOut))},${Math.round(mix(236, 255, blueOut))},255,1)`, display: 'flex', alignItems: 'center', gap: 16, padding: '0 18px', boxSizing: 'border-box', ...fade(436)}}>
          <div style={{width: 44, height: 44, borderRadius: 10, background: blueOut > 0.5 ? '#16181c' : '#4c7fe8', color: '#fff', fontWeight: 700, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>聚</div>
          <div style={{flex: 1}}><div style={{fontSize: 18, fontWeight: 600, color: INK}}>周六 15:00 · 老地方二楼小院</div><div style={{fontSize: 15, color: SUB}}>14 人确认 · 3 人带朋友 · 茶点已分工</div></div>
          <div style={{fontSize: 22, color: '#9aa0aa'}}>›</div>
        </div>
        <div style={{marginTop: 14, fontSize: 18, color: '#4a4f58', ...fade(440)}}>以宁说会带点心，阿哲三点准时到。</div>
      </div>}
      {sweep(COLL, 222, 600, 84, 430)}
      {bubble('有人想带朋友吗？', 396, 434)}
      {thought(452, 436, '想了 2 秒')}
      {f >= 440 && <div style={{position: 'absolute', left: COLL, top: 480, fontSize: 21, color: INK, ...fade(440)}}>3 位老朋友想带新朋友来，名额已经留好了：</div>}
      {f >= 437 && [0, 1, 2].map((k) => {
        const a = 441 + k * 2;
        const sk = 1 - ramp(f, a, 6, EASE.smooth);
        const P = [['阿哲 +1', '带同事小鹿', 2], ['可可 +1', '带室友桃子', 3], ['老陈 +1', '带女儿远远', 5]][k];
        return (
          <div key={k} style={{position: 'absolute', left: COLL + k * 252, top: 524, width: 238, height: 104, borderRadius: 12, border: '1px solid #e6e8ec', overflow: 'hidden', opacity: ramp(f, 437 + k, 2, EASE.out), background: '#fff'}}>
            <div style={{position: 'absolute', inset: 0, opacity: sk, background: 'linear-gradient(110deg, #dfe9ff, #9fbff7 60%, #c7d8ff)'}} />
            {f >= a && <div style={{position: 'absolute', left: 16, top: 16, display: 'flex', gap: 12, ...rev(f, a, 5, 4)}}>
              <Avatar ch={first(String(P[0]))} p={Number(P[2])} size={44} />
              <div><div style={{fontSize: 17, fontWeight: 600, color: INK}}>{P[0]}</div><div style={{fontSize: 14, color: SUB}}>{P[1]}</div>
                <div style={{display: 'inline-block', marginTop: 4, padding: '1px 9px', borderRadius: 9, background: '#dcf4e6', color: '#1f9a5a', fontSize: 13}}>新朋友</div></div>
            </div>}
          </div>
        );
      })}
      {bubble('没空的人呢？', 664, 441)}
      {thought(720, 443, '想了 2 秒')}
      {f >= 447 && <div style={{position: 'absolute', left: COLL, top: 748}}>
        <div style={{fontSize: 21, color: INK, ...fade(447)}}>7 人说下次一定，我约了下个月再问问。</div>
        <div style={{marginTop: 12, width: 700, height: 56, borderRadius: 12, border: '1px solid #e6e8ec', display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px', boxSizing: 'border-box', ...fade(448)}}>
          <div style={{display: 'flex'}}>{['晴', '方', '冬', '青'].map((c, i) => <Avatar key={c} ch={c} p={i + 4} size={34} ring={2} style={{marginLeft: i ? -8 : 0}} />)}</div>
          <div style={{flex: 1, fontSize: 16, color: '#4a4f58'}}><b style={{fontWeight: 600}}>7 人</b> · 下次聚会再邀请</div>
          <div style={{fontSize: 20, color: '#9aa0aa'}}>›</div>
        </div>
      </div>}
      {sweep(COLL, 788, 700, 56, 442, 8)}
      {f >= 452 && <div style={{position: 'absolute', left: COLL, top: 870, display: 'flex', gap: 18, fontSize: 18, color: '#a0a6b0', ...fade(452)}}><span>♡</span><span>⧉</span><span>↻</span></div>}
      {/* 输入框 */}
      <div style={{position: 'absolute', left: COLL, top: 920, width: COLR - COLL, height: 90, borderRadius: 16, border: '1px solid #e3e6ea', background: '#fbfcfd', padding: '14px 20px', boxSizing: 'border-box'}}>
        <div style={{fontSize: 17, color: '#a3a8b3'}}>发消息，/ 调出命令，@ 提到某人</div>
        <div style={{position: 'absolute', left: 20, right: 16, bottom: 12, display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: '#6a707c'}}><span style={{fontSize: 20}}>＋</span><span>常规 ▾</span><span style={{flex: 1}} /><div style={{width: 30, height: 30, borderRadius: 15, background: '#7fd1d8'}} /></div>
      </div>
    </div>
  );
};
// 三张卡在 App 里的路线（窗口坐标）：一串斜着飘进来 → 放平 → 散开 → 落位
const MINI = [
  {at: 400, x: [[400, 860], [414, 905], [418, 930], [422, 860], [427, 790]], y: [[400, 250], [414, 228], [418, 235], [422, 250], [427, 262]], dis: 430},
  {at: 402, x: [[402, 985], [414, 1030], [418, 1060], [421, 1090], [424, 880], [427, 800]], y: [[402, 228], [414, 210], [418, 400], [421, 690], [424, 610], [427, 578]], dis: 437},
  {at: 404, x: [[404, 1110], [414, 1155], [418, 1180], [421, 1120], [424, 880], [427, 820]], y: [[404, 206], [414, 192], [418, 360], [421, 560], [424, 760], [427, 800]], dis: 442},
] as {at: number; x: [number, number][]; y: [number, number][]; dis: number}[];
const SceneApp: React.FC<{f: number}> = ({f}) => {
  const s = sp(f, [[400, 1.04], [412, 1.04], [429, 1.02], [434, 0.98], [440, 0.9], [446, 0.83], [452, 0.79], [466, 0.78], [469, 0.8], [472, 0.84], [476, 0.95]]);
  const cxF = (t: number) => sp(t, [[400, 894], [429, 892], [440, 888], [452, 880], [466, 912], [468, 918], [470, 950], [472, 1040], [474, 1240], [476, 1600]]);
  const cx = cxF(f);
  const cy = sp(f, [[400, 515], [406, 522], [412, 530], [429, 530], [452, 520], [466, 517], [470, 526], [476, 610]]);
  const v = Math.abs(cxF(f + 0.5) - cxF(f - 0.5)) * s;
  const mb = f >= 470 ? Math.min(70, Math.max(0, v - 6) * 0.3) : 0;
  const inBlur = mix(6, 0, ramp(f, 400, 5, EASE.out));
  const flat = ramp(f, 414, 11, EASE.out);
  return (
    <AbsoluteFill>
      <svg width="0" height="0" style={{position: 'absolute'}}><filter id="iwHB" x="-20%" y="-5%" width="140%" height="110%"><feGaussianBlur stdDeviation={`${mb.toFixed(1)} 0`} /></filter></svg>
      <World cx={cx} cy={cy} s={s} style={{filter: mb > 0.5 ? 'url(#iwHB)' : inBlur > 0.2 ? `blur(${inBlur.toFixed(1)}px)` : undefined}}>
        <AppWin f={f} />
        <div style={{position: 'absolute', left: 0, top: 0, width: 1720, height: 1040, perspective: 1400}}>
          {MINI.map((m, i) => {
            if (f < m.at || f > m.dis + 5) return null;
            const x = sp(f, m.x), y = sp(f, m.y);
            const sc = sp(f, [[m.at, 0.34], [414, 0.46], [418, 0.5], [427, 0.55]]) * (1 - 0.05 * ramp(f, m.dis, 4));
            const o = Math.min(ramp(f, m.at, 3, EASE.out), 1 - ramp(f, m.dis, 5, EASE.smooth));
            const rz = mix(-8, -2, flat) + Math.sin(f / 9 + i) * 1.2 * (1 - ramp(f, 424, 4));
            const ry = mix(-24, -6, flat);
            return (
              <div key={i} style={{position: 'absolute', left: x - 250, top: y - 120, transform: `rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${sc.toFixed(4)})`, transformOrigin: '50% 50%', opacity: o}}>
                <ResultCard i={i} grow={1} content={1} />
              </div>
            );
          })}
        </div>
      </World>
    </AbsoluteFill>
  );
};

// ═════════════ 主组件 ═════════════
export const InviteWallToChat: React.FC = () => {
  const f = useCurrentFrame();
  let body: React.ReactNode;
  if (f < 102) {
    body = <><BgCool f={f} warm={0.35 * ramp(f, 30, 60, EASE.smooth)} /><SceneWall f={f} /></>;
  } else if (f < 283) {
    const b2 = ramp(f, 166, 16, EASE.smooth);
    body = (
      <>
        <BgCool f={f} warm={0.35} />
        {b2 > 0 && <AbsoluteFill style={{opacity: b2}}><BgBlobs f={f} /></AbsoluteFill>}
        {f < 216 && <SceneBig f={f} />}
        {f >= 178 && <SceneMsg f={f} />}
      </>
    );
  } else if (f < 328) {
    body = <><BgCool f={f + 40} warm={0.9 * ramp(f, 312, 16, EASE.smooth)} /><SceneSuccess f={f} /></>;
  } else if (f < 400) {
    body = <><BgWarm f={f} /><SceneTitle f={f} /></>;
  } else {
    body = <><BgWarm f={f} /><SceneApp f={f} /></>;
  }
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS, background: '#f4f6f9'}}>
      {body}
      <Grain opacity={0.03} blend="overlay" />
      <Bezel />
    </AbsoluteFill>
  );
};
