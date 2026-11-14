// 镜头库里 8 个镜头的口播版，只换内容，动作照原镜头的"动效核心"。
// 前 5 个放在舞台里用（大小读风格卡的 stage：笔记本是右边舞台 740 × 660，操作台是节目监视器 1040 × 585）；后 3 个（提问墙、弯曲轮播、书签）是从一条口播的开头拆出来的，成片被认可。
// 原镜头是满屏、自己演一整段的；这里每个只取口播用得上的那一段，时间由调用的人按"说到哪个词"给。
// 原镜头的完整做法和毛病清单在 shot-library/demos-own/<分类>/<名字>/ 的源码开头。
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Ctx, EASE, Ico, c01, mix, rnd} from './Kit';
import {softShadow} from '../../../shot-library/kit/polish';
import {SV} from '../../../styles/current';

// 颜色、字体、舞台大小都读当前风格卡（styles/current.ts）：放进哪套风格的外壳，就长成哪套的样子
const LK = SV;
const cardShadow = (e = 14, s = 0.5) => `${SV.cardEdge}, ${softShadow(e, {color: SV.shadow, strength: s})}`;
const SW = () => SV.stage.w, SH = () => SV.stage.h;

const big = (size: number, col = LK.ink): React.CSSProperties => ({fontSize: size, fontWeight: 900, color: col, whiteSpace: 'nowrap', lineHeight: 1.15});

// ── 1. card-orbit-counter：大数字在滚，小卡片绕着它转；数字落定那一刻转得最快，之后长尾减速不停死 ──
// 用在：一个大数字（"调试了五千多张""跟五千多人聊过""四百多名学员"）
export const OrbitCounter: React.FC<{c: Ctx; at: number; land: number; to: number; suffix?: string; unit: string; lead?: string; n?: number; card?: (i: number) => React.ReactNode}> = ({c, at, land, to, suffix = '+', unit, lead, n = 14, card}) => {
  const p = c.R(at, 10, EASE.out);
  if (p <= 0) return null;
  const k = c01((c.t - at) / (land - at));
  const num = Math.floor(to * k);
  // 转过的角度：匀速 → 落定前三次加速 → 落定后双指数长尾
  const tt = c.t - at, L = land - at;
  const rot = tt < L ? 0.55 * tt + 1.5 * Math.pow(c01((tt - L * 0.45) / (L * 0.55)), 3) : 0.55 * L + 1.5 + 1.1 * (1 - Math.exp(-(tt - L) / 0.45)) + 0.12 * (tt - L);
  const speed = tt < L ? c01((tt - L * 0.45) / (L * 0.55)) ** 2 : Math.exp(-(tt - L) / 0.45);
  const cards = Array.from({length: n}, (_, i) => {
    const th = (i / n) * Math.PI * 2 + rot + rnd(i) * 0.25, depth = Math.sin(th);   // depth > 0 在数字前面
    const sc = 0.62 + 0.42 * (depth * 0.5 + 0.5);
    return {i, depth, x: SW() / 2 + SW() * 0.446 * Math.cos(th), y: SH() * 0.455 + SH() * 0.326 * depth + (rnd(i + 9) - 0.5) * 50, sc, side: Math.abs(Math.cos(th))};   // 远的在数字上面、近的在数字下面，数字本身一直看得清
  }).sort((a, b) => a.depth - b.depth);
  const Cardlet = ({d}: {d: (typeof cards)[0]}) => (
    <div style={{position: 'absolute', left: d.x - 70, top: d.y - 52, width: 140, height: 104, borderRadius: 16, overflow: 'hidden', background: SV.surface, boxShadow: cardShadow(8 + 8 * d.sc, 0.5), border: `1px solid ${SV.cardBorder}`, transform: `scale(${d.sc * (0.5 + 0.5 * p)}) scaleX(${0.35 + 0.65 * (1 - d.side * 0.75)})`, opacity: p * (d.depth < 0 ? 0.7 : 1), filter: `blur(${(speed * 5 + (d.depth < 0 ? 1.2 : 0)).toFixed(1)}px)`}}>
      {card ? card(d.i) : <div style={{position: 'absolute', inset: 8, borderRadius: 10, background: `${SV.tints[d.i % 7]}26`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ico n={d.i % 2 ? 'image' : 'chat'} size={44} color={SV.tints[d.i % 7]} /></div>}
    </div>
  );
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: SW(), height: SH()}}>
      {cards.filter((d) => d.depth < 0).map((d) => <Cardlet key={d.i} d={d} />)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 168, textAlign: 'center', opacity: p}}>
        {lead && <div style={big(36, LK.ink2)}>{lead}</div>}
        <div style={{...big(170, LK.accent), fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em', textShadow: `0 6px 0 rgba(${SV.surfaceRGB},0.9)`}}>{num.toLocaleString()}{k >= 1 ? suffix : ''}</div>
        <div style={big(44)}>{unit}</div>
      </div>
      {cards.filter((d) => d.depth >= 0).map((d) => <Cardlet key={d.i} d={d} />)}
    </div>
  );
};

// ── 2. search-pick-shortlist：卡片分行、左右交错滑进来铺满 → 光标点选几张 → 没选中的退成虚影 ──
// 用在："去网上搜教程""从一堆里挑出一个 / 几个""怎么选"
export const PickWall: React.FC<{c: Ctx; at: number; pickAt: number[]; picks: number[]; recedeAt: number; item: (i: number, picked: boolean) => React.ReactNode; rows?: number; cols?: number; cw?: number; ch?: number}> = ({c, at, pickAt, picks, recedeAt, item, rows = 3, cols = 3, cw = 226, ch = 150}) => {
  if (c.t < at - 0.1) return null;
  const rec = c.R(recedeAt, 16, EASE.swift), gx = (SW() - cols * cw) / (cols + 1), gy = 22;
  const pos = (i: number): [number, number] => [gx + (i % cols) * (cw + gx), 20 + Math.floor(i / cols) * (ch + gy)];
  // 光标：依次飞到每张要选的卡上，点一下
  let cur: [number, number] = [760, 640], click = 0;
  picks.forEach((pi, k) => { const m = c.R(pickAt[k] - 0.45, 13, EASE.swift), [x, y] = pos(pi); if (m > 0) { cur = [mix(cur[0], x + cw * 0.62, m), mix(cur[1], y + ch * 0.6, m)]; click = Math.max(click, Math.sin(Math.PI * c01((c.t - pickAt[k]) / 0.2 + 0.5)) * (c.t > pickAt[k] - 0.1 && c.t < pickAt[k] + 0.1 ? 1 : 0)); } });
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: SW(), height: SH()}}>
      {Array.from({length: rows * cols}, (_, i) => {
        const r = Math.floor(i / cols), col = i % cols, dir = r % 2 ? -1 : 1;   // 上排从右往左、下排从左往右，交错
        const p = c.R(at + (dir > 0 ? col : cols - 1 - col) * 0.13 + r * 0.05, 14), k = picks.indexOf(i), sel = k >= 0 ? c.R(pickAt[k], 8, EASE.out) : 0;
        const [x, y] = pos(i), out = k >= 0 ? 0 : rec;
        return (
          <div key={i} style={{position: 'absolute', left: x + (1 - p) * dir * 520, top: y + out * 10, width: cw, height: ch, borderRadius: 20, overflow: 'hidden', background: SV.cardBg, border: `1px solid ${SV.cardBorder}`, boxShadow: sel > 0 ? `0 0 0 ${5 * sel}px ${LK.accent}, ${cardShadow(14, 0.6)}` : cardShadow(8, 0.45), opacity: c01(p * 2) * (1 - 0.72 * out), filter: p < 1 ? `blur(${(1 - p) * 8}px)` : out > 0 ? `blur(${out * 3}px) saturate(${1 - 0.8 * out})` : undefined, transform: `scale(${(1 - 0.06 * out) * (1 + 0.06 * sel) * (1 - 0.05 * (sel > 0 && sel < 1 ? Math.sin(Math.PI * sel) : 0))})`, zIndex: k >= 0 ? 3 : 1}}>
            {item(i, sel > 0.5)}
            {sel > 0 && <div style={{position: 'absolute', right: 10, top: 10, width: 38, height: 38, borderRadius: '50%', background: LK.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${sel})`}}><svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 12.5 L10 18 L20 6.5" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" /></svg></div>}
          </div>
        );
      })}
      {c.t > pickAt[0] - 0.5 && <svg width="44" height="44" viewBox="0 0 24 24" style={{position: 'absolute', left: cur[0], top: cur[1], zIndex: 9, transform: `scale(${1 - 0.18 * click})`, filter: 'drop-shadow(0 3px 5px rgba(58,42,24,0.35))', opacity: 1 - rec}}><path d="M5 3 L5 19 L9.5 15 L12.5 21.5 L15 20.3 L12 14 L18 14 Z" fill={LK.ink} stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" /></svg>}
    </div>
  );
};

// ── 3. invite-wall-to-chat：一墙人物卡 → 镜头推近其中一张 → 按下按钮（按下、换字、回弹）→ 拉回全景，一张张标上"已发" ──
// 用在："我去私信了很多博主""一个个去问""硬着头皮去联系"
export const DMWall: React.FC<{c: Ctx; at: number; pushAt: number; sendAt: number; backAt: number; btn?: [string, string]; n?: number; focus?: number; replyAt?: number; reply?: number; noAt?: number; noText?: string; yesText?: string}> = ({c, at, pushAt, sendAt, backAt, btn = ['私信', '已发送'], n = 12, focus = 5, replyAt, reply = 7, noAt, noText = '没有回复', yesText = '回复了'}) => {
  if (c.t < at - 0.1) return null;
  const cols = 4, cw = 168, ch = 190, gx = (SW() - cols * cw) / (cols + 1), gy = 20;
  const pos = (i: number): [number, number] => [gx + (i % cols) * (cw + gx), 16 + Math.floor(i / cols) * (ch + gy)];
  const push = c.R(pushAt, 12, EASE.swift) * (1 - c.R(backAt, 13, EASE.swift)), [fx, fy] = pos(focus);
  const z = 1 + 1.5 * push, press = c.t > sendAt - 0.08 && c.t < sendAt + 0.12 ? Math.sin(Math.PI * c01((c.t - sendAt + 0.08) / 0.2)) : 0, sent = c.R(sendAt + 0.05, 9, EASE.out);
  const drift = Math.sin(c.f * 0.03) * 5;   // 慢段也在漂
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: SW(), height: SH(), overflow: 'hidden', borderRadius: 26}}>
      <div style={{position: 'absolute', inset: 0, transformOrigin: `${fx + cw / 2}px ${fy + ch / 2}px`, transform: `translate(${(SW() / 2 - fx - cw / 2) * push + drift * (1 - push)}px, ${(330 - fy - ch / 2) * push}px) scale(${z})`, filter: push > 0.02 && push < 0.98 ? `blur(${Math.sin(Math.PI * push) * 5}px)` : undefined}}>
        {Array.from({length: n}, (_, i) => {
          const p = c.R(at + ((i % cols) + Math.floor(i / cols)) * 0.07, 12, EASE.overshoot), [x, y] = pos(i), me = i === focus;
          const done = me ? sent : c.R(backAt + 0.25 + (i * 0.618 % 1) * 0.9, 8, EASE.out), no = noAt != null && i !== reply ? c.R(noAt + (i % 5) * 0.1, 10, EASE.out) : 0, yes = replyAt != null && i === reply ? c.R(replyAt, 11, EASE.overshoot) : 0;
          return (
            <div key={i} style={{position: 'absolute', left: x, top: y, width: cw, height: ch, borderRadius: 20, background: SV.cardBg, border: `1px solid ${SV.cardBorder}`, boxShadow: yes > 0 ? `0 0 0 ${5 * yes}px ${LK.accent}, ${cardShadow(14, 0.6)}` : cardShadow(8, 0.45), opacity: c01(p * 2) * (1 - 0.5 * no), transform: `scale(${(0.5 + 0.5 * p) * (1 + 0.07 * yes)})`, filter: no > 0 ? `saturate(${1 - 0.8 * no})` : undefined, zIndex: yes > 0 ? 3 : 1}}>
              <div style={{position: 'absolute', left: cw / 2 - 34, top: 18, width: 68, height: 68, borderRadius: '50%', background: SV.tints[i % 7], opacity: 0.8}} />
              <div style={{position: 'absolute', left: 34, top: 98, width: 100, height: 9, borderRadius: 5, background: 'rgba(40,30,20,0.2)'}} />
              <div style={{position: 'absolute', left: 50, top: 114, width: 68, height: 7, borderRadius: 4, background: 'rgba(40,30,20,0.1)'}} />
              <div style={{position: 'absolute', left: 24, top: 138, width: 120, height: 38, borderRadius: 19, background: yes > 0.5 ? LK.accent : done > 0.5 ? (no > 0.5 ? SV.line : '#dfeaf8') : LK.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: yes > 0.5 ? '#fff' : done > 0.5 ? (no > 0.5 ? LK.ink3 : LK.blue) : '#fff', transform: `scale(${me ? 1 - 0.1 * press + 0.06 * Math.sin(Math.PI * c01(sent)) : 1})`}}>{yes > 0.5 ? yesText : done > 0.5 ? (no > 0.5 ? noText : btn[1]) : btn[0]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── 4. notification-scene-cuts：一张卡钉在中间不动，背后的场景每 0.4 秒硬切一个，每个场景自己在慢推 ──
// 用在："不管在哪 / 不管什么时候，这件事都在""凌晨两点啊""换了一个又一个，它还是没变"
const SCENES: [string, string, (k: number) => React.ReactNode][] = [
  ['linear-gradient(180deg,#f7d9b0,#f2b98a)', '傍晚', () => <circle cx="560" cy="150" r="62" fill="#fff3d6" opacity="0.9" />],
  ['linear-gradient(180deg,#8ea3c9,#c9b6c8)', '入夜', () => <>{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={60 + i * 130} y={330 - (i % 3) * 60} width="90" height="400" rx="6" fill="#5d6c93" opacity="0.55" />)}</>],
  ['linear-gradient(180deg,#3d4a73,#6a6f9b)', '深夜', () => <>{Array.from({length: 18}, (_, i) => <circle key={i} cx={40 + (i * 97) % 680} cy={30 + (i * 53) % 260} r={2 + (i % 3)} fill="#fff" opacity="0.8" />)}</>],
  ['linear-gradient(180deg,#27314f,#444a78)', '凌晨', () => <path d="M610 96 A62 62 0 1 1 540 30 A50 50 0 0 0 610 96 Z" fill="#fff3d6" />],
  ['linear-gradient(180deg,#2d3558,#55507a)', '还醒着', () => <>{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={90 + i * 100} y={380} width="56" height="56" rx="6" fill={i === 2 ? '#ffdc7a' : '#3a4168'} />)}</>],
];
export const SceneCuts: React.FC<{c: Ctx; at: number; out: number; every?: number; h?: number; labels?: string[]; children: React.ReactNode}> = ({c, at, out, every = 0.42, h = 520, labels, children}) => {
  if (c.t < at - 0.05 || c.t > out + 0.4) return null;
  const p = c.R(at, 10, EASE.out), q = c.R(out, 9, EASE.exit), k = Math.min(SCENES.length - 1, Math.floor(Math.max(0, c.t - at) / every)), into = c.t - at - k * every;
  const [bg, name, draw] = SCENES[k];
  return (
    <div style={{position: 'absolute', left: 0, top: 30, width: SW(), height: h, borderRadius: 30, overflow: 'hidden', boxShadow: cardShadow(18, 0.6), opacity: c01(p * 2) * (1 - q), transform: `scale(${0.94 + 0.06 * p})`}}>
      <div style={{position: 'absolute', inset: 0, background: bg, transform: `scale(${1 + 0.06 * Math.min(1.5, into / every)})`}}><svg width={SW()} height={h} style={{position: 'absolute', left: 0, top: 0}}>{draw(k)}</svg></div>
      <div style={{position: 'absolute', left: 24, top: 20, padding: '6px 18px', borderRadius: 999, background: `rgba(${SV.surfaceRGB},0.85)`, fontSize: 26, fontWeight: 800, color: LK.ink}}>{labels?.[k] ?? name}</div>
      {/* 钉住的那张卡：背景越花，卡越要实 */}
      <div style={{position: 'absolute', left: (SW() - Math.min(560, SW() - 180)) / 2, top: h / 2 - 110, width: Math.min(560, SW() - 180), height: 220, borderRadius: 28, background: `rgba(${SV.surfaceRGB},0.94)`, boxShadow: cardShadow(20, 0.7), backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
    </div>
  );
};

// ── 5. benefit-lines-to-logo：第一句逐词出（浅灰、带虚、从右滑进，慢慢变黑，整行一直居中）→ 虚掉退场 → 第二句从下面稍大、虚着出来，关键词是主色 ──
// 用在：结尾金句、对比式的两句话（"想，全是问题；做，都是答案"）
export const TwoLines: React.FC<{c: Ctx; a: [string, number][]; b: [string, number][]; swapAt: number; accentA?: number; accentB?: number; size?: number; y?: number; keepA?: boolean}> = ({c, a, b, swapAt, accentA = -1, accentB = -1, size = 104, y = 200, keepA = true}) => {
  if (c.t < a[0][1] - 0.1) return null;
  const swap = c.R(swapAt, 12, EASE.swift);
  const Line = ({ws, acc, second}: {ws: [string, number][]; acc: number; second?: boolean}) => (
    <div style={{display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'}}>
      {ws.map(([w, at], i) => {
        const p = c.R(at, 9, EASE.out), ink = c.R(at + 0.05, 18, EASE.out);
        if (p <= 0) return null;   // 没出的词不占位置，所以整行会随着词数重新居中
        const h2 = (h: string) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16)), c0 = h2(LK.ink3), c1 = h2(LK.ink);   // 从浅灰显影成正文色（读风格卡：笔记本是深字，操作台是浅字）
        const col = i === acc ? LK.accent : `rgb(${c0.map((v, k) => Math.round(mix(v, c1[k], ink))).join(',')})`;
        return <span key={i} style={{...big(size, col), display: 'inline-block', opacity: c01(p * 1.5), filter: p < 1 ? `blur(${(1 - p) * 9}px)` : undefined, transform: second ? `translateY(${(1 - p) * 34}px) scale(${1 + 0.1 * (1 - p)})` : `translateX(${(1 - p) * 40}px)`}}>{w}</span>;
      })}
    </div>
  );
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: SW(), height: SH()}}>
      <div style={{position: 'absolute', left: -200, right: -200, top: y - (keepA ? swap * size * 0.62 : 0), opacity: keepA ? 1 - 0.55 * swap : 1 - swap, filter: swap > 0 ? `blur(${swap * (keepA ? 1.5 : 9)}px)` : undefined, transform: `scale(${1 - (keepA ? 0.34 : 0.06) * swap})`}}><Line ws={a} acc={accentA} /></div>
      <div style={{position: 'absolute', left: -200, right: -200, top: y + (keepA ? size * 0.5 : 0)}}><Line ws={b} acc={accentB} second /></div>
      <div style={{position: 'absolute', left: SW() / 2 - 150 * c.R(b[b.length - 1][1] + 0.3, 16, EASE.out), top: y + size * (keepA ? 1.85 : 1.35), width: 300 * c.R(b[b.length - 1][1] + 0.3, 16, EASE.out), height: 8, borderRadius: 4, background: LK.accent}} />
    </div>
  );
};

// ── 6. complaint-wall-pick（发牌段）：一墙提问卡从右下角发上一面斜墙，越发越快；退场时反着飞回去 ──
// 用在："很多人问我""评论区都在问""很多粉丝好奇"。整屏的；要它在人物身后，得有抠出来的人物层（预先把人物抠成图层），
// 没有抠像时，放在人物缩成窗的那几秒里（写在 Shell 的 stage 里，它在人物窗下面）。
// 卡片上只写问题本身，不画点赞数、时间这类"仿真数据"；有真评论截图就换成真的。
export const QuestionWall: React.FC<{c: Ctx; at: number; out: number; questions: string[]; cols?: number}> = ({c, at, out, questions, cols = 5}) => {
  const f = c.F(c.t) - c.F(at), fo = c.F(out) - c.F(at);
  if (f < -8 || f > fo + 16) return null;
  const R = (st: number, d: number, e = EASE.snappy) => e(c01((f - st) / d));
  const CW = 470, CH = 124, z = mix(1.02, 1.1, R(0, 40, EASE.out)), drift = mix(30, -10, R(0, 50, EASE.linear));
  const rows = Math.ceil(questions.length / cols);
  return (
    <AbsoluteFill style={{perspective: 2600, fontFamily: SV.font}}>
      <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `translateX(${drift}px) scale(${z}) rotateX(10deg) rotateY(8deg) rotateZ(4deg)`}}>
        {questions.map((q, i) => {
          const col = i % cols, r = Math.floor(i / cols), cx = 960 + (col - (cols - 1) / 2) * 520, cy = 500 + (r - (rows - 1) / 2) * 210 + (col % 2) * 105;
          const order = Math.hypot(cx - 2000, cy - 1200) / 2600;   // 离右下角越远，越晚发到
          const p = R(-7 + Math.pow(order, 0.8) * 22, 14), o = R(fo + (1 - order) * 6, 10, EASE.exit);
          if (p <= 0 || o >= 1) return null;
          const x = mix(mix(cx + 380, cx, p), cx - 520, o), y = mix(mix(cy + 300, cy, p), cy - 260, o);
          return (
            <div key={i} style={{position: 'absolute', left: x - CW / 2, top: y - CH / 2 + Math.sin(f / 34 + i) * 3, opacity: c01(p * 2.2) * (1 - o), transform: `rotate(${((1 - p) * (rnd(i) - 0.5) * 18).toFixed(2)}deg)`}}>
              <div style={{width: CW, height: CH, borderRadius: 24, padding: '0 30px', boxSizing: 'border-box', background: SV.cardBg, border: `1px solid ${SV.cardBorder}`, boxShadow: cardShadow(14, 0.5), display: 'flex', alignItems: 'center', gap: 18}}>
                <div style={{width: 54, height: 54, borderRadius: '50%', flex: 'none', background: ['rgba(240,103,42,0.14)', 'rgba(47,109,181,0.13)'][i % 2], color: [LK.accent, LK.blue][i % 2], fontSize: 34, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>?</div>
                <div style={{fontSize: 34, fontWeight: 700, color: LK.ink, whiteSpace: 'nowrap', overflow: 'hidden'}}>{q}</div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── 7. curved-carousel-reel：一排卡贴着弯曲的墙从右往左滑，中间平、两边拉高拖虚；每说到一样甩到那一张，停着时也在慢慢漂 ──
// 用在：连着摆几样成绩、证据、案例、工具（"被电视台报道，还上了杂志，还被母校聘为导师"）。
// box：这排卡占的区域 [左, 上, 宽, 高]（整屏就是 [0, 0, 1920, 1080]；只用右边舞台就是 [SX, SY, 740, 660]）。
// cards：每张的宽度和内容；stops：[开始秒, 结束秒, 第几张]，开始前一点甩过去。卡里放真截图最好。
// 想让人物也成为其中一张卡：那几帧人物要预先抽成图片（切条后直接放视频会把渲染撑爆）。
const BLUR_LV = [0, 3, 6, 10, 15, 22, 30];
export const CurvedReel: React.FC<{c: Ctx; box: [number, number, number, number]; h?: number; gap?: number; cards: {w: number; bg?: string; tint?: string; render: (c: Ctx) => React.ReactNode}[]; stops: [number, number, number][]; inAt: number; outAt: number}> = ({c, box, h = 440, gap = 60, cards, stops, inAt, outAt}) => {
  if (c.t < inAt - 0.1 || c.t > outAt + 0.5) return null;
  const [bx, by, bw, bh] = box, cx = bw / 2, cy = bh / 2, RP = Math.max(700, bw * 0.6), SLICE = 40;
  const centers: number[] = []; let acc = 0;
  cards.forEach((cd, i) => { if (i > 0) acc += cards[i - 1].w / 2 + gap + cd.w / 2; centers.push(acc); });
  const keys: [number, number][] = [];
  stops.forEach(([a, b, i]) => { keys.push([a, centers[i] - 14]); if (b > a) keys.push([b, centers[i] + 14]); });
  const scrollAt = (t: number) => {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 0; i < keys.length - 1; i++) { const [t0, x0] = keys[i], [t1, x1] = keys[i + 1]; if (t <= t1) { const k = c01((t - t0) / (t1 - t0)); return mix(x0, x1, Math.abs(x1 - x0) > 40 ? EASE.swift(k) : k); } }
    return keys[keys.length - 1][1];
  };
  const scroll = scrollAt(c.t), spd = Math.abs(scrollAt(c.t + 1 / 30) - scroll), extra = c01((spd - 9) / 5, 0, 3);
  const p = c.R(inAt, 13, EASE.out), q = c.R(outAt, 9, EASE.exit);
  const edge = (t: number) => c01((Math.abs(RP * Math.tan(t)) / cx - 0.45) / 0.55) ** 2;
  return (
    <div style={{position: 'absolute', left: bx, top: by, width: bw, height: bh, overflow: 'hidden', opacity: c01(p * 1.6) * (1 - q), fontFamily: SV.font}}>
      <svg width="0" height="0" style={{position: 'absolute'}}>{BLUR_LV.map((v, i) => <filter key={i} id={`kreel${i}`} x="-20%" y="0" width="140%" height="100%"><feGaussianBlur stdDeviation={`${v} 0`} /></filter>)}</svg>
      {cards.map((cd, i) => { const th = (centers[i] - scroll) / RP; if (Math.abs(th) > 1.1) return null; const kk = 1 / Math.cos(th), ww = cd.w * 0.82 * kk; return <div key={i} style={{position: 'absolute', left: cx + RP * Math.tan(th) - ww / 2, top: cy + h / 2 + 40 + (kk - 1) * 60, width: ww, height: 40 * kk, borderRadius: '50%', background: cd.tint ?? '#c9b8a6', filter: `blur(${(24 * kk).toFixed(0)}px)`, opacity: 0.45 / kk}} />; })}
      <div style={{position: 'absolute', inset: 0, perspective: `${RP}px`, perspectiveOrigin: `${cx}px ${cy}px`}}>
        {cards.map((cd, ci) => {
          const u = centers[ci] - scroll;
          if (Math.abs(u) > RP * 1.08 + cd.w / 2) return null;
          const n = Math.ceil(cd.w / SLICE), sw = cd.w / n, out: React.ReactNode[] = [];
          for (let i = 0; i < n; i++) {
            const uc = u - cd.w / 2 + (i + 0.5) * sw, th = uc / RP;
            if (Math.abs(th) > 1.08) continue;
            const a = edge(th), fl0 = 1 + 0.6 * edge((uc - sw / 2) / RP), fl1 = 1 + 0.6 * edge((uc + sw / 2) / RP), qq = (fl0 - fl1) / (fl0 + fl1), cc = (2 * qq) / (sw + 2.5), fm = fl0 * (1 - qq), lv = Math.min(6, Math.round(a * 1.2 + extra));
            out.push(
              <div key={i} style={{position: 'absolute', left: cx - sw / 2 - 1.25, top: cy - h / 2, width: sw + 2.5, height: h, overflow: 'hidden', transform: `translateZ(${RP}px) rotateY(${(-th).toFixed(5)}rad) translateZ(${-RP}px) matrix3d(1,0,0,${cc.toFixed(7)},0,${fm.toFixed(5)},0,0,0,0,1,0,0,0,0,1)`, opacity: c01(1.25 - Math.max(0, Math.abs(th) - 0.85) * 3)}}>
                <div style={{position: 'absolute', left: -i * sw + 1.25, top: 0, width: cd.w, height: h, borderRadius: 26, overflow: 'hidden', background: cd.bg ?? SV.cardBg, filter: lv ? `url(#kreel${lv})` : undefined}}>
                  {cd.render(c)}
                  <div style={{position: 'absolute', inset: 0, borderRadius: 26, boxShadow: 'inset 0 0 0 2px rgba(70,50,30,0.09)'}} />
                </div>
              </div>,
            );
          }
          return <React.Fragment key={ci}>{out}</React.Fragment>;
        })}
      </div>
    </div>
  );
};

// ── 8. bookmark-tap-check：一个书签按钮冒出来 → 点一下（按下、填色、打勾、一圈光晕散开）──
// 用在："建议收藏""建议你看完""记下来"。很短，放在一张卡的角上或舞台里都行。
export const BookmarkTap: React.FC<{c: Ctx; at: number; tapAt: number; size?: number}> = ({c, at, tapAt, size = 96}) => {
  const p = c.R(at, 10, EASE.overshoot), bm = c.R(tapAt, 10, EASE.out), press = Math.sin(Math.PI * c01((c.F(c.t) - c.F(tapAt) + 3) / 8));
  if (p <= 0) return null;
  return (
    <div style={{position: 'relative', width: size, height: size, borderRadius: '50%', background: SV.surface, boxShadow: cardShadow(12, 0.55), display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: c01(p * 2), transform: `scale(${(0.6 + 0.4 * p) * (1 - 0.12 * press)})`}}>
      <div style={{position: 'absolute', inset: -10 - 30 * bm, borderRadius: '50%', border: `4px solid ${LK.accent}`, opacity: bm > 0 ? (1 - bm) * 0.7 : 0}} />
      <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24"><path d="M6 3.5 h12 v17 l-6 -4.6 l-6 4.6 z" fill={bm > 0.3 ? LK.accent : 'none'} stroke={bm > 0.3 ? LK.accent : LK.ink} strokeWidth="2.2" strokeLinejoin="round" /><path d="M8.6 10.4 L11.2 13 L15.6 8.2" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12" strokeDashoffset={12 * (1 - c.R(tapAt + 0.1, 8, EASE.out))} /></svg>
    </div>
  );
};

