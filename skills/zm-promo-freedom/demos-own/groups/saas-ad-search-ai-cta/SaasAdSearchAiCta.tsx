// 【镜头组】saas-ad-search-ai-cta：30 秒完整产品广告（暗底 + 荧光绿）：搜索框打字点搜索 → 客户在搜 → 大字「无处不在」→ AI 聊天提问 →
//   一堆卡片飞过 → 竞争对手列表「那你呢？」→ 你排第一 → 地图上也有 → AI 也推荐你 → 100% → 手机来预约 → 各渠道连到中心 → 营收曲线往上长 → 后台截图 → 数字跳到一万 → logo → 结尾标语 + 按钮（037-A 一串，30 秒产品片结构）
// 学的动作（baseTOP · AI vs Human SaaS Demo，原视频_01 右侧人工版裁出放大，30fps 逐帧量过，2026-11-21）：
//   钩子 0–5：0–0.5 小搜索框在中间，0.4 起打字，0.5–1.2 镜头推近到按钮（≈2.6 倍），1.5 光标到按钮、1.6 点下去，2.0 切；2.0–4.0 搜索框缩进手机顶上，左下大字；4.0–5.0 荧光绿斜体大字带残影从左滑进
//   问题 5–11：5.0 聊天气泡从右边长出来、5.5–6.0 逐字打、6.5 打字点点；8.0–9.5 一堆卡片带景深飞过 + 中间一颗星；9.5–11.0 左边竞争对手列表、右边大字「那你呢？」，10.5 最后一行高亮
//   方案 11–19.5：12.0 第一名结果卡在上、下面一句；13.5 地图钉 + 右边列表；15.0 左边 AI 聊天面板、推荐那行高亮、右边三行字；16.5 大百分比 82 → 100 + 右边列表；18.0 手机 10:12 弹出预约通知、旁边小胶囊往上飘
//   结果 19.5–28：19.5 中心 logo 圆、左 5 张右 4 张卡片用曲线连进来；21.5 大字 + 折线从左下往右上画（21.8–23.0）；23.5 浅色后台截图；25.0 数字 55 → 9998+ + 右边小图表；26.5–28 一颗光点变成 logo
//   号召 28–31.5：logo + 字标在上，两行大标语，下面一个带绿色箭头圆的按钮
//   每一幕进场：放大 1.06 → 1、虚化 8 → 0（0.25s）；强调词一律荧光绿斜体；背景暗灰 + 一团绿光（位置每幕不同）
// 我们的内容：虚构的营销公司「星引营销」，全部中文；logo 自己画（圆角方块里一颗四角星），右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 0;
const LIME = '#c6f24e';
const BG = '#0d0e0c';
const SANS = '"Inter","PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const lin = (t: number, K: number[][]) => {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * (t - a) / (b - a); }
  return K[K.length - 1][1];
};
const SC = [0, 2.0, 4.0, 5.0, 8.0, 9.5, 11.0, 12.0, 13.5, 15.0, 16.5, 18.0, 19.5, 21.5, 23.5, 25.0, 26.5, 28.0, 31.5];

export const SAAS_AD_CONTRACT: GroupContract = {
  sourceDuration: 945 / 30,
  fps: 30,
  motion: [[0, 31.5]],
  holds: [],
  landmarks: {hook: 0, click: 1.6, everywhere: 4.0, problem: 5.0, youq: 9.5, solution: 12.0, maps: 13.5, ai: 15.0, pct: 16.5, booking: 18.0, results: 19.5, revenue: 21.5, dash: 23.5, count: 25.0, logo: 26.5, cta: 28.0},
  sfx: [
    {at: 'hook', type: '键盘', note: '一串打字', tail: 1.2, volume: 0.25},
    {at: 'click', type: '点击', note: '点击 click', volume: 0.4},
    {at: 'everywhere', type: '短甩', note: '甩动 whoosh', volume: 0.4},
    {at: 'problem', type: '弹出', note: '消息 pop', volume: 0.3},
    {at: 'solution', type: '落版重击', note: '轻 hit', volume: 0.35},
    {at: 'pct', type: '轻tick', note: '数字滚动 tick', tail: 0.8, volume: 0.25},
    {at: 'booking', type: '提示音', note: '通知 ding', volume: 0.35},
    {at: 'revenue', type: '上扬铺垫', note: '上扬 riser', tail: 1.5, volume: 0.3},
    {at: 'count', type: '轻tick', note: '数字滚动 tick', tail: 1.0, volume: 0.25},
    {at: 'logo', type: '闪光', note: '品牌音 shimmer', volume: 0.4},
  ],
  inputs: {brand: {maxChars: 4}, cta: {maxChars: 14}},
};
export type SaasAdInputs = {brand: string; cta: string; note: string};
export const SAAS_AD_DEFAULT_INPUTS: SaasAdInputs = {brand: '星引营销', cta: '免费 SEO & GEO 诊断', note: '虚构 · 仅作演示'};
export const checkSaasAdInputs = (x: SaasAdInputs) => checkInputs(SAAS_AD_CONTRACT, {brand: x.brand, cta: x.cta});
export const planSaasAd = (sec: number) => planExtras(SAAS_AD_CONTRACT, sec);
export const saasAdFrames = (extras: number[]) => Math.round(outputDuration(SAAS_AD_CONTRACT, extras) * FPS);
export const SAAS_AD_DURATION = 945;

const Em: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{color: LIME, fontStyle: 'italic', fontWeight: 700}}>{children}</span>;
const Card: React.FC<{style: React.CSSProperties; children?: React.ReactNode}> = ({style, children}) => <div style={{position: 'absolute', background: 'linear-gradient(160deg, rgba(40,42,38,0.92), rgba(22,23,21,0.94))', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 22, boxShadow: '0 30px 80px rgba(0,0,0,0.5)', color: '#e9ecef', fontFamily: SANS, ...style}}>{children}</div>;
const Bar: React.FC<{x: number; y: number; w: number; o?: number}> = ({x, y, w, o = 0.18}) => <div style={{position: 'absolute', left: x, top: y, width: w, height: 12, borderRadius: 6, background: `rgba(255,255,255,${o})`}} />;
const Logo: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 100 100"><rect x="4" y="4" width="92" height="92" rx="24" fill="#f4f6f0" /><path d="M50 14 C54 38 62 46 86 50 C62 54 54 62 50 86 C46 62 38 54 14 50 C38 46 46 38 50 14 Z" fill="#111" /><circle cx="76" cy="24" r="7" fill={LIME} /></svg>
);
const Sparkle: React.FC<{x: number; y: number; r: number; o?: number}> = ({x, y, r, o = 1}) => <svg width={r * 2} height={r * 2} viewBox="-50 -50 100 100" style={{position: 'absolute', left: x - r, top: y - r, opacity: o, filter: `drop-shadow(0 0 ${r * 0.4}px ${LIME})`}}><path d="M0 -50 C4 -10 10 -4 50 0 C10 4 4 10 0 50 C-4 10 -10 4 -50 0 C-10 -4 -4 -10 0 -50 Z" fill={LIME} /></svg>;
const Caption: React.FC<{x: number; y: number; size?: number; children: React.ReactNode; center?: boolean; o?: number}> = ({x, y, size = 64, children, center, o = 1}) => <div style={{position: 'absolute', left: center ? 0 : x, right: center ? 0 : undefined, top: y, transform: 'translateY(-50%)', textAlign: center ? 'center' : 'left', fontFamily: SANS, fontSize: size, fontWeight: 700, color: '#f2f3ef', letterSpacing: '-0.01em', whiteSpace: 'nowrap', opacity: o, textShadow: '0 4px 30px rgba(0,0,0,0.5)'}}>{children}</div>;

export const SaasAdSearchAiCtaGroup: React.FC<{inputs?: SaasAdInputs; extras?: number[]}> = ({inputs: x = SAAS_AD_DEFAULT_INPUTS, extras = []}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, SAAS_AD_CONTRACT, extras) + S0;
  let k = 0; for (let i = 0; i < SC.length - 1; i++) if (s >= SC[i]) k = i;
  const u = s - SC[k];
  const inK = eo(u / 0.25);
  const wrap: React.CSSProperties = {position: 'absolute', inset: 0, transform: `scale(${1.06 - 0.06 * inK})`, filter: inK < 0.98 ? `blur(${8 * (1 - inK)}px)` : undefined, opacity: 0.3 + 0.7 * inK};
  const glow = [[70, 80], [65, 75], [30, 85], [20, 90], [50, 60], [75, 80], [55, 55], [60, 90], [40, 85], [75, 70], [30, 70], [55, 80], [60, 95], [80, 40], [50, 90], [70, 85], [50, 60], [55, 85]][k] ?? [60, 80];
  let scene: React.ReactNode = null;
  switch (k) {
    case 0: { // 搜索框打字 → 推近按钮 → 点击
      const Z = lin(s, [[0, 1], [0.5, 1], [1.2, 2.6], [2.0, 2.75]]);
      const q = '你的行业 + 你的城市', n = Math.floor(clamp((s - 0.2) / 1.1) * Array.from(q).length);
      const btnX = 1231, btnY = 586;
      const press = s > 1.6 && s < 1.72 ? 0.92 : 1;
      scene = <div style={{position: 'absolute', inset: 0, transform: `scale(${Z})`, transformOrigin: `${btnX}px ${btnY}px`}}>
        <div style={{position: 'absolute', left: 560, top: btnY - 45, width: 760, height: 90, borderRadius: 45, background: 'rgba(30,32,28,0.95)', border: '1.5px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', paddingLeft: 40, gap: 18, fontFamily: SANS, fontSize: 40, color: '#e8eae4', boxSizing: 'border-box'}}>
          <div style={{width: 26, height: 26, borderRadius: '50%', border: '4px solid #8a8f86', boxSizing: 'border-box'}} />
          <span>{Array.from(q).slice(0, n).join('')}</span><span style={{width: 2, height: 36, background: '#ddd', opacity: Math.floor(s * 3) % 2 ? 1 : 0.2}} />
          <div style={{position: 'absolute', right: 14, top: 14, width: 150, height: 62, borderRadius: 31, background: LIME, color: '#141414', fontSize: 28, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${press})`, boxShadow: `0 0 30px rgba(198,242,78,0.45)`}}>搜索</div>
        </div>
        {s > 1.1 && <svg width={40} height={52} viewBox="0 0 24 30" style={{position: 'absolute', left: lin(s, [[1.1, 1300], [1.55, 1236]]), top: lin(s, [[1.1, 650], [1.55, 596]]), transform: `scale(${s > 1.6 && s < 1.72 ? 0.85 : 1})`}}><path d="M2 2 L2 24 L8 18 L12 28 L16 26 L12 17 L20 17 Z" fill="#fff" stroke="#111" strokeWidth={1.4} /></svg>}
        <Sparkle x={1620} y={250} r={18} o={0.8} />
      </div>;
      break;
    }
    case 1: { // 客户在搜：搜索胶囊缩进手机
      const up = eio(u / 1.8);
      scene = <>
        <div style={{position: 'absolute', left: 1020, top: 380 - up * 60, width: 360, height: 680, borderRadius: 54, background: 'linear-gradient(180deg,#1b1c1a,#121311)', border: '6px solid #2a2b28', boxShadow: '0 40px 90px rgba(0,0,0,0.6)'}}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <Bar key={i} x={40} y={110 + i * 62} w={i % 2 ? 200 : 260} o={0.14} />)}
        </div>
        <div style={{position: 'absolute', left: 748 + up * 140, top: 300 - up * 60, width: 872 - up * 280, height: 96, borderRadius: 48, background: 'rgba(35,37,33,0.96)', border: '1.5px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', paddingLeft: 36, fontFamily: SANS, fontSize: 34 - up * 6, color: '#e8eae4', boxSizing: 'border-box', filter: u > 1.5 ? `blur(${(u - 1.5) * 8}px)` : undefined}}>你的行业 + 你的城市</div>
        <Caption x={100} y={904} size={92} o={0.5 + 0.5 * clamp(u / 0.5)}>你的客户正在搜</Caption>
      </>;
      break;
    }
    case 2: { // 无处不在：带残影从左滑进
      const xx = lin(u, [[0, -300], [0.25, 340], [1.0, 380]]);
      scene = <>{[0.18, 0.32, 0.5].map((o, i) => <div key={i} style={{position: 'absolute', left: xx - (3 - i) * 140 * (1 - clamp(u / 0.6)) - (3 - i) * 30, top: 500, transform: 'translateY(-50%) skewX(-10deg)', fontFamily: SANS, fontSize: 300, fontWeight: 900, color: LIME, opacity: o * 0.6, filter: 'blur(6px)'}}>无处不在</div>)}
        <div style={{position: 'absolute', left: xx, top: 500, transform: 'translateY(-50%) skewX(-10deg)', fontFamily: SANS, fontSize: 300, fontWeight: 900, color: LIME, textShadow: '0 0 40px rgba(198,242,78,0.4)'}}>无处不在</div></>;
      break;
    }
    case 3: { // AI 聊天提问
      const q = '我们城市里，你推荐哪家公司？', n = Math.floor(clamp((u - 0.5) / 0.6) * Array.from(q).length);
      const grow = eo(u / 0.4);
      scene = <>
        <div style={{position: 'absolute', left: 30, top: 56, display: 'flex', alignItems: 'center', gap: 16, fontFamily: SANS, fontSize: 40, color: '#9a9d96'}}><div style={{width: 46, height: 46, borderRadius: '50%', background: '#3a3c37'}} />AI 助手</div>
        <div style={{position: 'absolute', right: 60, top: 268, width: 1280 * grow, height: 272, borderRadius: 36, background: '#3b3d39', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 50px', boxSizing: 'border-box', fontFamily: SANS, fontSize: 52, color: '#eee', whiteSpace: 'nowrap'}}>{Array.from(q).slice(0, n).join('')}</div>
        {u > 1.5 && <div style={{position: 'absolute', left: 140, top: 704, display: 'flex', gap: 20, alignItems: 'center'}}><div style={{width: 64, height: 64, borderRadius: '50%', background: '#a7e0b0', opacity: 0.6}} />{[0, 1, 2].map((i) => <div key={i} style={{width: 26, height: 26, borderRadius: '50%', background: LIME, opacity: 0.4 + 0.6 * Math.abs(Math.sin(s * 5 + i))}} />)}</div>}
        {[0, 1, 2].map((i) => <Bar key={i} x={130} y={800 + i * 60} w={1100 - i * 200} o={0.06} />)}
      </>;
      break;
    }
    case 4: { // 卡片飞过 + 星
      const items = [[120, 220, 420, 'blur'], [420, 280, 560, ''], [1300, 220, 380, ''], [1100, 820, 300, 'blur'], [560, 820, 560, ''], [180, 600, 320, 'blur'], [1500, 520, 420, 'blur']] as [number, number, number, string][];
      scene = <>{items.map(([cx, cy, w, b], i) => { const dx = (u - 0.75) * (i % 2 ? -120 : 140), sc = 1 + u * 0.12; return <Card key={i} style={{left: cx + dx, top: cy, width: w * sc, height: w * 0.32 * sc, filter: b ? 'blur(5px)' : undefined, opacity: b ? 0.6 : 0.9, transform: `rotate(${(i % 3 - 1) * 4}deg)`}}><Bar x={24} y={24} w={w * 0.5} o={0.25} /><Bar x={24} y={50} w={w * 0.7} o={0.12} /></Card>; })}
        <Card style={{left: 560, top: 830, width: 560, height: 190}}><div style={{position: 'absolute', left: 24, top: 18, fontSize: 24, color: '#ccc'}}>AI 助手</div><div style={{position: 'absolute', left: 24, top: 60, fontSize: 26, color: '#ddd'}}>我们城市里，你推荐哪家公司？</div></Card>
        <Sparkle x={960} y={540} r={36 + Math.sin(s * 8) * 4} /></>;
      break;
    }
    case 5: { // 竞争对手列表 + 那你呢
      const hl = clamp((u - 1.0) / 0.2);
      scene = <><Card style={{left: 80, top: 60, width: 980, height: 940}}>
        {['竞争对手 A — 在线预约', '竞争对手 B — 就在本地', '竞争对手 C — 优惠活动', '本地服务商 — 比价', '竞争对手 D — 联系与路线', '竞争对手 E — 关于我们', '竞争对手 F — 服务项目'].map((t, i) => <div key={i} style={{position: 'absolute', left: 50, top: 50 + i * 112, fontSize: 30, color: '#cfd2cb', display: 'flex', gap: 22, alignItems: 'center'}}><div style={{width: 22, height: 22, borderRadius: '50%', background: '#555'}} /><div><div style={{fontSize: 18, color: '#777'}}>shop-{i + 1}.cn</div>{t}</div></div>)}
        <div style={{position: 'absolute', left: 30, top: 830, width: 920, height: 80, borderRadius: 14, border: `2px solid rgba(198,242,78,${0.2 + 0.8 * hl})`, background: `rgba(198,242,78,${0.08 * hl})`, display: 'flex', alignItems: 'center', paddingLeft: 30, fontSize: 30, color: hl > 0.5 ? LIME : '#888'}}>你的公司 — 就在本地</div>
      </Card><Caption x={1120} y={460} size={150}>那<Em>你呢？</Em></Caption></>;
      break;
    }
    case 6: scene = <Sparkle x={960 + (u - 0.5) * 80} y={540} r={10 + u * 6} o={0.9} />; break;
    case 7: { // 第一名
      scene = <><Card style={{left: 248, top: 112, width: 1420, height: 280, borderRadius: 26}}>
        <div style={{position: 'absolute', left: 50, top: 60, width: 160, height: 160, borderRadius: 24, background: LIME, color: '#111', fontSize: 110, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>1</div>
        <div style={{position: 'absolute', left: 260, top: 48, fontSize: 24, color: '#999'}}>your-company.cn</div>
        <div style={{position: 'absolute', left: 260, top: 86, fontSize: 52, fontWeight: 700}}>你的公司 — 就在本地</div>
        <div style={{position: 'absolute', left: 260, top: 170, fontSize: 26, color: LIME}}>★★★★★ <span style={{color: '#aaa'}}>4.9 · 312 条评价 · 营业中</span></div>
        <div style={{position: 'absolute', right: 50, top: 180, padding: '12px 26px', borderRadius: 30, background: LIME, color: '#111', fontSize: 26, fontWeight: 700}}>立即预约</div>
      </Card>{[0, 1, 2].map((i) => <Bar key={i} x={248} y={500 + i * 60} w={1420 - i * 300} o={0.06} />)}
      <Caption x={0} y={912} center size={84}>你在搜索里排<Em>第一</Em></Caption></>;
      break;
    }
    case 8: { // 地图
      const pin = eo(u / 0.3);
      scene = <>
        <div style={{position: 'absolute', left: 852 - 40, top: 452 - 90 * pin, width: 80, height: 110, transform: `scale(${pin})`, transformOrigin: '50% 100%'}}><svg viewBox="0 0 40 55" width={80} height={110}><path d="M20 0 C31 0 40 9 40 20 C40 34 20 55 20 55 C20 55 0 34 0 20 C0 9 9 0 20 0 Z" fill={LIME} /><circle cx="20" cy="20" r="8" fill="#111" /></svg></div>
        <div style={{position: 'absolute', left: 712, top: 300, padding: '10px 18px', borderRadius: 12, background: 'rgba(20,21,19,0.95)', border: '1px solid rgba(255,255,255,0.1)', color: '#ddd', fontFamily: SANS, fontSize: 22, opacity: pin}}>你的公司 ★ 4.9</div>
        <Card style={{left: 1220, top: 80, width: 640, height: 480}}><div style={{position: 'absolute', left: 30, top: 24, fontSize: 24, color: '#ccc'}}>附近的商家</div>
          <div style={{position: 'absolute', left: 24, top: 74, width: 590, height: 120, borderRadius: 16, border: `2px solid ${LIME}`, background: 'rgba(198,242,78,0.06)'}}><div style={{position: 'absolute', left: 24, top: 20, fontSize: 26, color: '#eee'}}>你的公司</div><div style={{position: 'absolute', left: 24, top: 62, fontSize: 20, color: '#999'}}>4.9 · 0.8 公里</div><div style={{position: 'absolute', right: 20, top: 66, padding: '6px 14px', borderRadius: 20, background: LIME, color: '#111', fontSize: 18}}>预约</div></div>
          {[0, 1].map((i) => <div key={i} style={{position: 'absolute', left: 48, top: 230 + i * 100, fontSize: 24, color: '#888'}}>竞争对手 {i ? 'B' : 'A'}</div>)}</Card>
        <Caption x={80} y={932} size={84}><Em>地图上</Em>也找得到</Caption></>;
      break;
    }
    case 9: { // AI 也推荐你
      scene = <><Card style={{left: 60, top: 120, width: 980, height: 880}}>
        <div style={{position: 'absolute', left: 40, top: 30, fontSize: 26, color: '#bbb'}}>AI 助手</div>
        <div style={{position: 'absolute', right: 40, top: 100, padding: '18px 26px', borderRadius: 20, background: '#3a3c38', fontSize: 26, color: '#ddd'}}>我们城市里，你推荐哪家公司？</div>
        <div style={{position: 'absolute', left: 40, top: 240, fontSize: 26, color: '#ccc'}}>本地我推荐：</div>
        <div style={{position: 'absolute', left: 30, top: 300, width: 900, height: 150, borderRadius: 18, border: `3px solid ${LIME}`, background: 'rgba(198,242,78,0.06)'}}><div style={{position: 'absolute', left: 30, top: 34, width: 44, height: 44, borderRadius: '50%', background: LIME, color: '#111', fontSize: 26, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>1</div><div style={{position: 'absolute', left: 100, top: 30, fontSize: 34, fontWeight: 600}}>你的公司</div><div style={{position: 'absolute', left: 100, top: 82, fontSize: 22, color: '#9a9'}}>4.9 · 本地 · 可在线预约</div><div style={{position: 'absolute', right: 30, top: 40, padding: '10px 20px', borderRadius: 24, background: LIME, color: '#111', fontSize: 22, fontWeight: 700}}>✦ 推荐</div></div>
        {[0, 1].map((i) => <div key={i} style={{position: 'absolute', left: 40, top: 500 + i * 80, fontSize: 24, color: '#666'}}>{i + 2}　竞争对手 {i ? 'B' : 'A'} · 4.{6 - i}</div>)}
      </Card><div style={{position: 'absolute', left: 1148, top: 540, transform: 'translateY(-50%)', fontFamily: SANS, fontSize: 116, fontWeight: 700, color: '#f2f3ef', lineHeight: 1.1}}>AI 也会<br />推荐<br /><Em>你</Em></div></>;
      break;
    }
    case 10: { // 82 → 100 %
      const v = Math.round(lin(u, [[0, 82], [0.45, 100]]));
      scene = <><div style={{position: 'absolute', left: 80, top: 360, padding: '6px 16px', borderRadius: 16, background: 'rgba(198,242,78,0.15)', color: LIME, fontFamily: SANS, fontSize: 22}}>AI 能见度</div>
        <div style={{position: 'absolute', left: 80, top: 510, transform: 'translateY(-50%)', fontFamily: SANS, fontSize: 300, fontWeight: 500, color: LIME, letterSpacing: '-0.03em'}}>{v} %</div>
        <div style={{position: 'absolute', left: 84, top: 680, fontFamily: SANS, fontSize: 36, color: '#ddd'}}>AI 回答里都提到了你</div>
        <Card style={{left: 1120, top: 80, width: 720, height: 680}}><div style={{position: 'absolute', left: 36, top: 30, fontSize: 28}}>AI 怎么说你</div>
          {['AI 助手', 'AI 搜索', '问答搜索', '大模型 B'].map((t, i) => <div key={i} style={{position: 'absolute', left: 36, right: 36, top: 100 + i * 82, height: 64, borderRadius: 12, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', fontSize: 24, color: '#ccc'}}>{t}<span style={{padding: '4px 12px', borderRadius: 12, background: 'rgba(198,242,78,0.15)', color: LIME, fontSize: 18}}>已推荐</span></div>)}
          <div style={{position: 'absolute', left: 36, top: 470, fontSize: 22, color: '#999'}}>你的公司</div><div style={{position: 'absolute', left: 36, top: 506, width: 640 * v / 100, height: 10, borderRadius: 5, background: LIME}} />
          {[0, 1].map((i) => <Bar key={i} x={36} y={560 + i * 50} w={640 * (0.4 - i * 0.12)} o={0.2} />)}
        </Card></>;
      break;
    }
    case 11: { // 手机预约通知
      const pop = eo((u - 0.2) / 0.3);
      scene = <><div style={{position: 'absolute', left: 740, top: 140, width: 420, height: 860, borderRadius: 60, background: '#121311', border: '6px solid #2a2b28', boxShadow: '0 40px 100px rgba(0,0,0,0.7)'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: SANS, fontSize: 92, fontWeight: 600, color: '#f2f2f2'}}>10:12</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 180, textAlign: 'center', fontFamily: SANS, fontSize: 22, color: '#888'}}>星期四 10月24日</div>
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 80, height: 90, borderRadius: 22, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', paddingLeft: 24, gap: 14, fontFamily: SANS, fontSize: 22, color: '#ccc'}}>✦ 12 条新预约</div>
      </div>
        <Card style={{left: 580, top: 448, width: 700, height: 160, borderRadius: 24, transform: `scale(${0.8 + 0.2 * pop})`, opacity: pop}}><div style={{position: 'absolute', left: 30, top: 44, width: 72, height: 72, borderRadius: 18, background: LIME}} /><div style={{position: 'absolute', left: 126, top: 34, fontSize: 20, color: '#999'}}>预约系统 · 刚刚</div><div style={{position: 'absolute', left: 126, top: 66, fontSize: 38, fontWeight: 700}}>新的预约</div><div style={{position: 'absolute', left: 126, top: 116, fontSize: 20, color: '#aaa'}}>周四 10月24日 · 14:00</div><div style={{position: 'absolute', right: 36, top: 58, width: 44, height: 44, borderRadius: '50%', background: LIME}} /></Card>
        {[[1320, 700], [1300, 760], [1280, 820], [1250, 880]].map(([cx, cy], i) => <div key={i} style={{position: 'absolute', left: cx, top: cy - u * 120 - i * 12, padding: '8px 18px', borderRadius: 20, background: 'rgba(198,242,78,0.85)', color: '#111', fontFamily: SANS, fontSize: 18, opacity: clamp((u - 0.3 - i * 0.12) / 0.2)}}>+ 预约</div>)}</>;
      break;
    }
    case 12: { // 各渠道连到中心
      const L = ['搜索引擎', '地图', 'AI 助手', '问答搜索', 'AI 模式'], R = ['预约', '新咨询', '来电', '订单'];
      const draw = eo(u / 0.8);
      scene = <><svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {L.map((_, i) => { const y = 90 + i * 132; return <path key={'l' + i} d={`M500 ${y + 40} C 700 ${y + 40}, 700 440, 820 440`} stroke={LIME} strokeOpacity={0.55} strokeWidth={3} fill="none" strokeDasharray="600" strokeDashoffset={600 * (1 - draw)} />; })}
        {R.map((_, i) => { const y = 80 + i * 132; return <path key={'r' + i} d={`M1080 440 C 1200 440, 1200 ${y + 40}, 1340 ${y + 40}`} stroke={LIME} strokeOpacity={0.55} strokeWidth={3} fill="none" strokeDasharray="600" strokeDashoffset={600 * (1 - draw)} />; })}
      </svg>
        {L.map((t, i) => <Card key={'L' + i} style={{left: 40, top: 90 + i * 132, width: 460, height: 82, borderRadius: 14, display: 'flex', alignItems: 'center', paddingLeft: 24, fontSize: 26, boxSizing: 'border-box', opacity: clamp((u - i * 0.05) / 0.2)}}>{t}<span style={{position: 'absolute', right: 20, padding: '2px 10px', borderRadius: 8, background: 'rgba(198,242,78,0.2)', color: LIME, fontSize: 16}}>已收录</span></Card>)}
        {R.map((t, i) => <Card key={'R' + i} style={{left: 1340, top: 80 + i * 132, width: 500, height: 82, borderRadius: 14, display: 'flex', alignItems: 'center', paddingLeft: 24, gap: 16, fontSize: 26, boxSizing: 'border-box', opacity: clamp((u - 0.3 - i * 0.08) / 0.2)}}><div style={{width: 40, height: 40, borderRadius: 10, background: 'rgba(198,242,78,0.25)'}} />{t}</Card>)}
        <div style={{position: 'absolute', left: 820, top: 300, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, #262824, #151614)', border: `2px solid rgba(198,242,78,0.4)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 0 60px rgba(198,242,78,0.2)'}}><Logo size={96} /><div style={{fontFamily: SANS, fontSize: 20, color: '#ccc'}}>你的公司</div></div>
        <Caption x={0} y={1000} center size={84}>每天都有<Em>新咨询</Em></Caption></>;
      break;
    }
    case 13: { // 营收曲线
      const d = eio((u - 0.3) / 1.4);
      const pts = Array.from({length: 26}, (_, i) => { const t = i / 25; return [t * 1900, 960 - (Math.pow(t, 1.7) * 760) + Math.sin(i * 1.7) * 30 * (1 - t)]; });
      const path = 'M' + pts.map((p) => p.join(' ')).join(' L');
      scene = <><svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><defs><linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={LIME} stopOpacity="0.25" /><stop offset="1" stopColor={LIME} stopOpacity="0" /></linearGradient></defs>
        <path d={path} stroke={LIME} strokeWidth={6} fill="none" strokeDasharray="3200" strokeDashoffset={3200 * (1 - d)} style={{filter: `drop-shadow(0 0 10px ${LIME})`}} /></svg>
        {d > 0.98 && <div style={{position: 'absolute', left: 1600, top: 140, padding: '10px 18px', borderRadius: 12, background: 'rgba(20,21,19,0.95)', border: '1px solid rgba(255,255,255,0.1)', color: '#ddd', fontFamily: SANS, fontSize: 22}}>+23.8% 同比</div>}
        <Caption x={140} y={420} size={100}>你的<Em>营收</Em>在增长</Caption></>;
      break;
    }
    case 14: { // 后台截图
      scene = <><div style={{position: 'absolute', left: 340, top: 180, width: 1244, height: 532, borderRadius: 10, background: '#eceee9', boxShadow: '0 40px 100px rgba(0,0,0,0.6)', overflow: 'hidden', transform: `rotate(${-1 + u * 0.6}deg)`}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 200, bottom: 0, background: '#e2e4df'}}>{[0, 1, 2, 3, 4, 5].map((i) => <Bar key={i} x={24} y={40 + i * 46} w={120} o={0.0} />)}</div>
        {[[240, 40, '¥3,233'], [640, 40, '1,170'], [240, 290, '30'], [640, 290, '¥3,233']].map(([cx, cy, v], i) => <div key={i} style={{position: 'absolute', left: cx as number, top: cy as number, width: 360, height: 210, borderRadius: 12, background: '#fff', fontFamily: SANS, color: '#222'}}><div style={{position: 'absolute', left: 20, top: 16, fontSize: 18, color: '#888'}}>{['营收', '访问', '新咨询', '订单额'][i]}</div><div style={{position: 'absolute', left: 20, top: 46, fontSize: 40, fontWeight: 700}}>{v}</div><svg width="320" height="100" style={{position: 'absolute', left: 20, top: 100}}><path d={`M0 80 Q 80 ${40 + i * 10} 160 60 T 320 ${20 + i * 8}`} stroke="#7dbd2a" strokeWidth="3" fill="none" /></svg></div>)}
        <div style={{position: 'absolute', left: 1050, top: 40, width: 170, height: 460, borderRadius: 12, background: '#fff'}} />
        <div style={{position: 'absolute', left: 280, top: 70, width: 520, height: 200, borderRadius: 14, background: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.25)', fontFamily: SANS, transform: `translateY(${-(1 - eo(u / 0.4)) * 30}px)`}}><div style={{position: 'absolute', left: 24, top: 20, fontSize: 18, color: '#888'}}>本月营收</div><div style={{position: 'absolute', left: 24, top: 50, fontSize: 46, fontWeight: 800, color: '#111'}}>¥3,233</div><div style={{position: 'absolute', left: 24, top: 120, padding: '4px 10px', borderRadius: 8, background: '#dff5b0', color: '#3a6a00', fontSize: 16}}>+23.8%</div></div>
      </div><Caption x={0} y={952} center size={84}>一切都在后台<Em>实时</Em>可见</Caption></>;
      break;
    }
    case 15: { // 数字跳到一万
      const v = Math.round(lin(u, [[0.2, 55], [0.95, 9998], [1.3, 10000]]));
      scene = <><div style={{position: 'absolute', left: 100, top: 412, transform: 'translateY(-50%)', fontFamily: SANS, fontSize: 120, fontWeight: 500, color: LIME, display: 'flex', alignItems: 'center', gap: 26}}><span style={{color: '#666'}}>55</span><span style={{fontSize: 60}}>→</span>{v.toLocaleString('en-US')}+</div>
        <Card style={{left: 1180, top: 120, width: 660, height: 460}}><div style={{position: 'absolute', left: 30, top: 26, fontSize: 24}}>自然点击</div><div style={{position: 'absolute', right: 30, top: 26, padding: '2px 10px', borderRadius: 8, background: 'rgba(198,242,78,0.2)', color: LIME, fontSize: 16}}>实时</div>
          <svg width="600" height="340" style={{position: 'absolute', left: 30, top: 90}}><path d="M0 300 C 150 290, 260 260, 360 190 S 520 60, 600 20" stroke={LIME} strokeWidth="4" fill="none" strokeDasharray="800" strokeDashoffset={800 * (1 - eio(u / 1.2))} /></svg></Card>
        <Caption x={0} y={848} center size={84}>真客户，<Em>真结果</Em></Caption></>;
      break;
    }
    case 16: { // 光点 → logo
      const lk = eo((u - 0.7) / 0.5);
      scene = <>{u < 0.9 && <Sparkle x={lin(u, [[0, 820], [0.7, 940]])} y={lin(u, [[0, 640], [0.7, 520]])} r={12 + u * 20} />}
        {u > 0.7 && <div style={{position: 'absolute', left: 940 - 250, top: 520 - 250, transform: `scale(${0.4 + 0.6 * lk}) rotate(${(1 - lk) * -20}deg)`, opacity: lk}}><Logo size={500} /></div>}</>;
      break;
    }
    default: { // 结尾
      const a = eo(u / 0.4), b = eo((u - 0.3) / 0.4);
      scene = <><div style={{position: 'absolute', left: 0, right: 0, top: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, opacity: a}}><Logo size={120} /><div style={{fontFamily: SANS, fontSize: 52, fontWeight: 700, color: '#f2f3ef', lineHeight: 1}}>{x.brand}</div></div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 400, textAlign: 'center', fontFamily: SANS, fontSize: 116, fontWeight: 700, color: '#f2f3ef', lineHeight: 1.15, opacity: a}}>从搜索和 AI<br />带来更多<Em>营收</Em></div>
        <div style={{position: 'absolute', left: 540, top: 760, width: 840, height: 120, borderRadius: 60, background: 'rgba(30,32,28,0.95)', border: `1.5px solid rgba(198,242,78,0.35)`, display: 'flex', alignItems: 'center', paddingLeft: 50, fontFamily: SANS, fontSize: 40, color: '#eee', boxSizing: 'border-box', opacity: b, transform: `translateY(${(1 - b) * 30}px)`}}>{x.cta}<div style={{position: 'absolute', right: 18, top: 18, width: 84, height: 84, borderRadius: '50%', background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, color: '#111'}}>→</div></div></>;
    }
  }
  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse 55% 60% at ${glow[0]}% ${glow[1]}%, rgba(120,160,30,0.55) 0%, rgba(70,95,20,0.25) 40%, rgba(13,14,12,0) 75%)`}} />
      <div style={wrap}>{scene}</div>
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(SAAS_AD_CONTRACT).length) throw new Error(checkContract(SAAS_AD_CONTRACT).join('；'));
export const SaasAdSearchAiCta: React.FC = () => <SaasAdSearchAiCtaGroup />;
