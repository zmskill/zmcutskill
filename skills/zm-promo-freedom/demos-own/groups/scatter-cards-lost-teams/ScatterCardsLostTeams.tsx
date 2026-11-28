// 【镜头组】scatter-cards-lost-teams：上一句被一片红 / 粉 / 灰的大方块像素闪掉 → 中间一个词一个词冒出「迷失在团队之间」，
//   四周飞进来六张歪着的白粉色卡片（聊天、名片、评论、待办、成员列表、聊天）慢慢漂 → 中间的词一个个没掉、卡片发灰 / 闪红，白闪一帧，全暗（038-B 一拍，痛点）
// 学的动作（NoorMalik · Teamflow 11.15–15.0s，30fps 逐帧量过，2026-11-21）：
//   11.15–11.4 像素方块（约 320×180 一格）红、粉、白、灰、黑每帧乱闪，从左往右清掉，上一句话在方块后面
//   11.4「Lost」灰色出现，11.47「between」、11.53「teams」各低一点出来，0.15s 升到同一行变白；字一行居中 y≈533，宽 ≈1080（字号 ≈100，细体）
//   11.53 起卡片从画外滑进来：左上聊天卡 (237,-40)-(909,266) 转 +5°、右上名片 (1180,-30)-(1847,220) 转 −4°、左边评论卡（只露右边）、
//       右边待办卡（只露左边）、左下成员列表 转 +5°、右下聊天卡 转 +4°；之后整体慢慢往外漂
//   14.3 卡片开始发灰、变半透明，左上 / 左下几张变成一片深红→亮红的渐变；14.47「between」没了，14.63「teams」没了，
//   14.83 整屏白闪一帧，之后卡片暗灰半透明一闪一闪，字全没了，15.0 接 038-C
//   第二轮（用户：第二三秒拖进、各种光闪烁、卡片移动细节）：12.97–13.17 中间的字缩到 0.84、卡片各自外挪、左右两张转开，13.9–14.12 转回；14.3 起每张卡各自蒙一层"左透右红"的渐变、强度每 2–3 帧换一档（不是整张全红 / 全白二选一），卡片半透明一明一暗
// 我们的内容：「迷失在团队之间」，卡片内容换成中文团队协作（小林、阿杰、小雨……），头像是淡色圆块（原片也是），右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {GlowSpot} from '../_kit/light';

const FPS = 30;
const S0 = 11.15;
const SANS = '"PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const SCATTER_LOST_CONTRACT: GroupContract = {
  sourceDuration: 115 / 30,
  fps: 30,
  motion: [[0, 1.0], [1.4, 115 / 30]],
  holds: [{at: 1.2, maxExtra: 3}],
  landmarks: {pixel: 0, w1: 0.25, cards: 0.38, drop: 3.32, flash: 3.68},
  sfx: [
    {at: 'pixel', type: '故障', note: '数码故障 glitch', volume: 0.45},
    {at: 'cards', type: '短甩', note: '卡片飞入 swish', volume: 0.35},
    {at: 'drop', type: '落版重击', note: '低沉 thud', volume: 0.35},
    {at: 'flash', type: '落版重击', note: '闪白 hit', volume: 0.45},
  ],
  inputs: {prev: {maxChars: 10}, words: {count: 3, maxChars: 4}},
};
export type ScatterLostInputs = {prev: string; words: string[]; note: string};
export const SCATTER_LOST_DEFAULT_INPUTS: ScatterLostInputs = {prev: '散落在各种文档里', words: ['迷失在', '团队', '之间'], note: '虚构 · 仅作演示'};
export const checkScatterLostInputs = (x: ScatterLostInputs) => checkInputs(SCATTER_LOST_CONTRACT, {prev: x.prev});
export const planScatterLost = (sec: number) => planExtras(SCATTER_LOST_CONTRACT, sec);
export const scatterLostFrames = (extras: number[]) => Math.round(outputDuration(SCATTER_LOST_CONTRACT, extras) * FPS);
export const SCATTER_LOST_DURATION = 115;

const Dot: React.FC<{s: number; c: string}> = ({s, c}) => <div style={{width: s, height: s, borderRadius: '50%', background: c, flex: 'none'}} />;
const Card: React.FC<{w: number; h: number; pink?: boolean; children: React.ReactNode}> = ({w, h, pink, children}) => (
  <div style={{width: w, height: h, borderRadius: 30, background: pink ? 'linear-gradient(120deg, #fbe7ea 0%, #f8dfe3 60%, #fff3f4 100%)' : '#ffffff', boxShadow: '0 20px 50px rgba(0,0,0,0.45)', overflow: 'hidden', fontFamily: SANS, color: '#22232a', position: 'relative'}}>{children}</div>
);
// 六张卡：最终位置（中心）、尺寸、角度、从哪个方向飞进来、什么时候进
// 每张卡在拖进时的位移 / 转角（原片量的）：[dx, dy, 转Y, 多转Z]
const PUSH = [[-88, 0, 0, 1.2], [24, -30, 0, -0.8], [-60, 0, 26, 0], [60, 0, -26, 0], [-20, 40, 0, 0.8], [60, 40, 0, 0.8]];
const CARDS = [
  {x: 573, y: 110, w: 680, h: 330, r: 5, from: [0, -420], t: 11.53},
  {x: 1514, y: 95, w: 680, h: 300, r: -4, from: [0, -400], t: 11.6},
  {x: 10, y: 530, w: 420, h: 400, r: 4, from: [-420, 0], t: 11.66},
  {x: 1890, y: 545, w: 420, h: 400, r: 4, from: [420, 0], t: 11.7},
  {x: 320, y: 1000, w: 680, h: 360, r: 5, from: [0, 420], t: 11.73},
  {x: 1700, y: 1030, w: 660, h: 340, r: 4, from: [0, 420], t: 11.8},
];
const cardBody = (i: number) => {
  switch (i) {
    case 0: return <Card w={680} h={330}><div style={{position: 'absolute', left: 40, top: -10, width: 600, height: 60, borderRadius: 18, background: '#efeff2'}} /><div style={{position: 'absolute', left: 150, top: 120, padding: '24px 34px', borderRadius: 22, background: '#efdfe1', fontSize: 30}}>好，那我放弃这个想法。</div><div style={{position: 'absolute', right: 50, top: 150}}><Dot s={70} c="#f1dfe2" /></div></Card>;
    case 1: return <Card w={680} h={300} pink><div style={{position: 'absolute', left: 0, right: 0, top: 70, height: 2, background: 'rgba(0,0,0,0.25)'}} /><div style={{position: 'absolute', left: 60, top: 130, display: 'flex', alignItems: 'center', gap: 40}}><Dot s={80} c="#f3dcc9" /><div><div style={{fontSize: 34, fontWeight: 600}}>阿杰</div><div style={{fontSize: 32, marginTop: 6}}>动效设计</div></div></div></Card>;
    case 2: return <Card w={420} h={400}><div style={{position: 'absolute', right: 30, top: 30, fontSize: 40, color: '#777', letterSpacing: 2}}>•••</div><div style={{position: 'absolute', left: 40, top: 70, fontSize: 30, fontStyle: 'italic', fontWeight: 600}}>小林</div><div style={{position: 'absolute', left: 40, top: 170, fontSize: 28, lineHeight: 1.6}}>编辑于 2 小时前<br />3 条评论</div></Card>;
    case 3: return <Card w={420} h={400} pink>{['博客草稿', '修改脚本', '审核文案'].map((t, k) => <div key={k} style={{position: 'absolute', left: 36, top: 50 + k * 104, width: 360, height: 80, borderRadius: 16, background: '#f0cfd5', display: 'flex', alignItems: 'center', gap: 22, paddingLeft: 30, fontSize: 28}}><div style={{width: 36, height: 36, borderRadius: '50%', border: `3px solid ${k === 0 ? '#39b54a' : '#888'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#39b54a', fontSize: 22, fontWeight: 700}}>{k === 0 ? '✓' : ''}</div>{t}</div>)}</Card>;
    case 4: return <Card w={680} h={360}><div style={{position: 'absolute', left: 50, top: 50, display: 'flex', alignItems: 'center', gap: 40}}><Dot s={80} c="#f1dfe2" /><div><div style={{fontSize: 32, fontWeight: 600}}>小雨</div><div style={{fontSize: 30, marginTop: 6}}>产品设计</div></div></div><div style={{position: 'absolute', right: 50, top: 60, fontSize: 40, color: '#777', letterSpacing: 2}}>•••</div><div style={{position: 'absolute', left: 0, right: 0, top: 190, height: 2, background: 'rgba(0,0,0,0.3)'}} /><div style={{position: 'absolute', left: 50, top: 230, display: 'flex', alignItems: 'center', gap: 40}}><Dot s={80} c="#e4dcf3" /><div style={{fontSize: 32, fontWeight: 600}}>小美</div></div></Card>;
    default: return <Card w={660} h={340}><div style={{position: 'absolute', left: 40, top: 70}}><Dot s={70} c="#f1dfe2" /></div><div style={{position: 'absolute', left: 140, top: 60, padding: '24px 34px', borderRadius: 22, background: '#efdfe1', fontSize: 30, whiteSpace: 'nowrap'}}>这个想法能不能再简单点？</div></Card>;
  }
};

export const ScatterCardsLostTeamsGroup: React.FC<{inputs?: ScatterLostInputs; extras?: number[]}> = ({inputs: x = SCATTER_LOST_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, SCATTER_LOST_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const f = Math.round(tt * FPS);
  const drift = 1 + 0.012 * Math.max(0, s - 11.6) + held * 0.01; // 卡片整体慢慢往外漂
  // 拖进：12.95–13.2 推进（字缩、卡片外散），13.85–14.1 退回
  // 拖进（第三轮，逐帧看原片 12.9–13.3 / 13.8–14.2）：12.97–13.17 字缩到 0.84、卡片各自往外挪、左右两张像门一样转开（rotateY ≈30°），
  //   之后一直保持这个状态，13.9–14.12 再转回来、字回到 0.96；没有中途回弹，也没有拖影
  const pin = eio((s - 12.97) / 0.2), pout = eio((s - 13.9) / 0.22);
  const push = pin * (1 - pout);
  const txtS = 1 - 0.16 * pin + 0.12 * pout;
  const end = s >= 14.3;
  const fl = (k: number) => hash(k * 13.1 + f * 7.7); // 每帧换的随机数（收尾闪烁用）
  const W = x.words;
  const wk = [11.45, 11.55, 11.62].map((t0) => eo((s - t0) / 0.18));
  const gone = [14.55, 14.55, 14.68];
  const showW = (i: number) => s < (i === 0 ? 14.83 : gone[i]);
  const flash = s >= 14.82 && s < 14.86;
  // 像素方块
  const pix = s < 11.62;
  const PAL = ['#e8102a', '#ef3349', '#ef4b5e', '#f26476', '#f58a98', '#f7c3ca', '#fbe3e6', '#ea1c33', '#f37a88', '#c9c4c6']; /* 原片方块以红 / 粉为主，黑灰少 */
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden', fontFamily: SANS}}>
      <GlowSpot x={700} y={330} rx={900} ry={600} rgb="110,0,0" a={0.5} />
      <GlowSpot x={1500} y={800} rx={700} ry={500} rgb="70,0,0" a={0.3} />
      {/* 卡片 */}
      {s > 11.5 && CARDS.map((c, i) => {
        const k = eo((s - c.t) / 0.4);
        if (k <= 0) return null;
        const sp = drift;
        const P = PUSH[i];
        const fx = Math.sin(s * 0.9 + i * 1.7) * 9, fy = Math.cos(s * 0.7 + i * 2.3) * 7, fr = Math.sin(s * 0.6 + i) * 0.6; // 每张卡自己轻轻浮动
        const dx = (c.x - 960) * (sp - 1) + fx + P[0] * push, dy = (c.y - 540) * (sp - 1) + fy + P[1] * push;
        let filt = 'none', op = 1, red = 0;
        if (end) {
          const u = clamp((s - 14.3) / 0.2);
          op = 1 - 0.15 * u;
          const step = Math.floor(f / 2) + Math.floor(f / 3); // 每 2–3 帧换一档
          red = [0, 0.35, 0.6, 1, 1, 0.5][Math.floor(hash(i * 7.3 + step * 1.31) * 6)] * clamp((s - 14.35) / 0.2);
          if (i === 0 || i === 4) red = Math.max(red, 0.45 * u);
          if (s > 14.45) op = 0.62 + 0.33 * hash(i * 3.9 + step * 0.77);
          if (s > 14.86) { op = 0.4 + 0.35 * fl(i + 9); red = fl(i) > 0.6 ? 1 : 0.3; }
          filt = `saturate(${1 - 0.4 * u}) brightness(${1 - 0.08 * u})`;
        }
        return (
          <div key={i} style={{position: 'absolute', left: c.x + c.from[0] * (1 - k) + dx, top: c.y + c.from[1] * (1 - k) + dy, transform: `translate(-50%,-50%) perspective(1400px) rotateY(${P[2] * push}deg) rotate(${c.r + P[3] * push + fr}deg) scale(${sp})`, opacity: op, filter: filt}}>
            {cardBody(i)}
            {red > 0 && <div style={{position: 'absolute', inset: 0, borderRadius: 30, background: `linear-gradient(105deg, rgba(110,0,10,${red >= 1 ? 0.95 : 0.12 * red}) 0%, rgba(205,0,22,${red >= 1 ? 0.97 : 0.5 * red}) 50%, rgba(238,12,34,${Math.min(1, red * 1.1)}) 100%)`}} />}
          </div>
        );
      })}
      {/* 字 */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 533, transform: `translateY(-50%) scale(${txtS})`, display: 'flex', justifyContent: 'center', gap: 26, fontSize: 104, fontWeight: 400, whiteSpace: 'nowrap'}}>
        {W.map((w, i) => <span key={i} style={{opacity: showW(i) ? clamp(wk[i] * 1.5) : 0, color: `rgb(${Math.round(150 + 105 * wk[i])},${Math.round(150 + 105 * wk[i])},${Math.round(150 + 105 * wk[i])})`, transform: `translateY(${(1 - wk[i]) * (18 + i * 10)}px)`, display: 'inline-block'}}>{w}</span>)}
      </div>
      {pix && Array.from({length: 36}, (_, i) => {
        const cx = i % 6, cy = Math.floor(i / 6);
        const clearAt = 11.3 + cx * 0.045 + hash(i * 3.1) * 0.06; // 从左往右清掉
        if (s > clearAt + 0.06) return null;
        const on = hash(i * 5.3 + f * 1.9) > (s < 11.2 ? 0.3 - (s - 11.15) * 6 : 0.04);
        if (!on) return null;
        return <div key={i} style={{position: 'absolute', left: cx * 320, top: cy * 180, width: 320, height: 180, background: PAL[Math.floor(hash(i * 2.7 + f * 3.3) * PAL.length)], opacity: 0.92}} />;
      })}
      {s < 11.55 && <div style={{position: 'absolute', left: 0, right: 0, top: 535, transform: 'translateY(-50%)', textAlign: 'center', fontSize: 100, fontWeight: 400, color: '#fff', WebkitMaskImage: `linear-gradient(90deg, transparent ${(s - 11.3) / 0.25 * 100}%, #000 ${(s - 11.3) / 0.25 * 100 + 10}%)`, maskImage: `linear-gradient(90deg, transparent ${(s - 11.3) / 0.25 * 100}%, #000 ${(s - 11.3) / 0.25 * 100 + 10}%)`}}>{x.prev}</div>}{/* 原片上一句话在方块上面，跟着方块从左往右一起清掉 */}
      {flash && <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 70% at 100% 0%, #f6c9d0 0%, #ffffff 60%)'}} />}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontSize: 20, color: 'rgba(255,220,220,0.4)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(SCATTER_LOST_CONTRACT).length) throw new Error(checkContract(SCATTER_LOST_CONTRACT).join('；'));
export const ScatterCardsLostTeams: React.FC = () => <ScatterCardsLostTeamsGroup />;
