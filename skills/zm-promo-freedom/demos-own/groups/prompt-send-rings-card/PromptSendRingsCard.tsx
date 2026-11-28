// 【镜头组】prompt-send-rings-card：黑底，App 首页一层层升起 → 其余淡掉只留输入框 → 推近输入框逐字打一句话（新字先紫色发虚再变清楚，框上沿一道紫橙光）→
//   镜头跟到右边发送键，整条框往右收进发送键 → 发送键外画出渐变圆环、键长成橙色胶囊、圆环一圈圈往外扩 → 胶囊变成生成好的音乐卡（013-C 一串，一句话生成）
// 学的动作（mnowakdesign · 音乐 App 10.0–17.1s，30fps 逐帧量过，2026-11-21）：
//   10.0 白底被黑圆吞掉；10.25–10.8 首页元素依次升起：标题 (553,316) 字号 ≈60、输入框 553–1363 × 486–600、两个小胶囊 y≈691、橙粉渐变卡 553–1363 × 791–1080
//   11.85–12.3 除输入框外都淡掉；12.33–12.5 推近 2.37 倍（框高 270），12.5–13.9 逐字打，光标钉在 x≈900 一带、字往左走
//   13.9–14.4 镜头跟到右端发送键（中心 1138,527，直径 ≈240）；14.4–15.15 整条框往右收（先慢后快，15.1 键左边还剩一小截），14.85 键在 (961,532) 直径 ≈200
//   15.0 外面出一圈渐变圆环（半径 365）；15.15–15.3 键长成橙色胶囊 548×184，两圈环半径 362 / 551；15.6 胶囊 977×210 变紫粉、环扩到 690 / 810 并淡掉
//   15.6–16.0 胶囊变成深灰音乐卡 1309×225（标题 + 时长 + 右边「刚刚 ···」），16.0–16.4 字从虚到清楚，停到 17.1
// 我们的内容：首页「首页 / 想做点什么」，输入「一段适合学习的 lo-fi 节拍」，卡片「学习用 lo-fi 节拍 · 06:45 · 音乐」，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 10.0;
const SANS = '"Inter","PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
const GRAD = 'linear-gradient(135deg, #ff8a3d 0%, #ff4f8b 50%, #8a3dff 100%)';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const lin = (t: number, K: number[][]) => {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * (t - a) / (b - a); }
  return K[K.length - 1][1];
};

export const PROMPT_RINGS_CONTRACT: GroupContract = {
  sourceDuration: 213 / 30,
  fps: 30,
  motion: [[0, 0.85], [1.85, 6.4]],
  holds: [{at: 1.3, maxExtra: 1.5}, {at: 6.7, maxExtra: 1.5}],
  landmarks: {home: 0.25, focus: 1.85, type: 2.5, send: 4.4, rings: 5.0, card: 5.6},
  sfx: [
    {at: 'home', type: '上升', note: '界面升起 swish', volume: 0.3},
    {at: 'type', type: '键盘', note: '一串打字', tail: 1.4, volume: 0.25},
    {at: 'send', type: '短甩', note: '收拢 swoosh', volume: 0.35},
    {at: 'rings', type: '闪光', note: '扩散 pulse', volume: 0.4},
    {at: 'card', type: '提示音', note: '完成 chime', volume: 0.35},
  ],
  inputs: {prompt: {maxChars: 16}, title: {maxChars: 12}},
};
export type PromptRingsInputs = {home: string; sub: string; placeholder: string; chips: string[]; promo: string; prompt: string; title: string; meta: string; note: string};
export const PROMPT_RINGS_DEFAULT_INPUTS: PromptRingsInputs = {home: '首页', sub: '想做点什么', placeholder: '输入你的想法、笔记或…', chips: ['文字转语音', '生成图片'], promo: '高级音效，更会讲故事', prompt: '一段适合学习的 lo-fi 节拍', title: '学习用 lo-fi 节拍', meta: '06:45 · 音乐', note: '虚构 · 仅作演示'};
export const checkPromptRingsInputs = (x: PromptRingsInputs) => checkInputs(PROMPT_RINGS_CONTRACT, {prompt: x.prompt, title: x.title});
export const planPromptRings = (sec: number) => planExtras(PROMPT_RINGS_CONTRACT, sec);
export const promptRingsFrames = (extras: number[]) => Math.round(outputDuration(PROMPT_RINGS_CONTRACT, extras) * FPS);
export const PROMPT_RINGS_DURATION = 213;

const SendIcon: React.FC<{d: number}> = ({d}) => (
  <div style={{width: d, height: d, borderRadius: '50%', background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 ${d * 0.3}px rgba(255,80,140,0.5)`}}>
    <svg width={d * 0.46} height={d * 0.46} viewBox="0 0 24 24"><path d="M12 4 C16 4 19 7 19 11 C19 15 16 18 12 18 L8 20 L9 16 C6 15 5 13 5 11 C5 7 8 4 12 4 Z" stroke="#fff" strokeWidth="2" fill="none" /><path d="M4 3 L5 5 M3 4 L5 4" stroke="#fff" strokeWidth="1.6" /></svg>
  </div>
);
const Ring: React.FC<{r: number; o: number; w?: number; rot?: number}> = ({r, o, w = 9, rot = 0}) => (
  <div style={{position: 'absolute', left: 961 - r, top: 532 - r, width: r * 2, height: r * 2, borderRadius: '50%', padding: w, background: 'conic-gradient(from ' + rot + 'deg, #ff7a2a, #ff3d8a, #3a46ff, #b03dff, #ff3d8a, #ff7a2a)', WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', opacity: o, boxSizing: 'border-box'}} />
);

export const PromptSendRingsCardGroup: React.FC<{inputs?: PromptRingsInputs; extras?: number[]}> = ({inputs: x = PROMPT_RINGS_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, PROMPT_RINGS_CONTRACT, extras) + S0;
  const els: React.ReactNode[] = [];
  // 10.0 白底被黑圆吞掉
  if (s < 10.15) { const r = lin(s, [[10.0, 600], [10.13, 1400]]); els.push(<div key="w" style={{position: 'absolute', inset: 0, background: '#fff', WebkitMaskImage: `radial-gradient(circle ${r}px at 50% 50%, transparent 99%, #000 100%)`, maskImage: `radial-gradient(circle ${r}px at 50% 50%, transparent 99%, #000 100%)`}} />); }
  if (s < 12.5) {
    // 首页
    const fade = 1 - clamp((s - 11.85) / 0.45), drift = (s - 10.8) * -6;
    const rise = (d: number) => { const k = eo((s - 10.25 - d) / 0.45); return {opacity: k * fade, transform: `translateY(${(1 - k) * 160 + drift}px)`}; };
    const zoom = lin(s, [[12.38, 1], [12.5, 2.37]]);
    els.push(<div key="home" style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '560px 543px', fontFamily: SANS}}>
      <div style={{position: 'absolute', left: 553, top: 130, width: 810, display: 'flex', justifyContent: 'space-between', color: '#ddd', fontSize: 30, ...rise(0)}}><span style={{marginLeft: 70}}>9:41</span><span style={{width: 280, height: 64, borderRadius: 32, background: '#151515', marginTop: -16}} /><span style={{marginRight: 40}}>▮▮ ◔</span></div>
      <div style={{position: 'absolute', left: 553, top: 280, fontSize: 62, fontWeight: 600, color: '#f2f2f2', ...rise(0.05)}}>{x.home}</div>
      <div style={{position: 'absolute', left: 553, top: 385, fontSize: 30, color: '#9a9a9a', ...rise(0.08)}}>{x.sub}</div>
      <div style={{position: 'absolute', left: 1263, top: 262, width: 96, height: 96, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #e9d8c8, #8a7563)', ...rise(0.05)}} />
      <div style={{position: 'absolute', left: 553, top: 486, width: 810, height: 114, borderRadius: 57, background: 'rgba(40,40,46,0.95)', border: '2px solid rgba(140,90,255,0.45)', display: 'flex', alignItems: 'center', paddingLeft: 44, boxSizing: 'border-box', color: '#b5b5bd', fontSize: 30, opacity: eo((s - 10.35) / 0.45), transform: `translateY(${(1 - eo((s - 10.35) / 0.45)) * 160 + drift * (1 - clamp((s - 11.85) / 0.45))}px)`}}>{x.placeholder}<div style={{position: 'absolute', right: 12, top: 12}}><SendIcon d={86} /></div></div>
      <div style={{position: 'absolute', left: 553, top: 655, display: 'flex', gap: 22, ...rise(0.14)}}>{x.chips.map((c, i) => <div key={i} style={{padding: '16px 28px', borderRadius: 40, background: '#2a2a30', color: '#ddd', fontSize: 28}}>{c}</div>)}</div>
      <div style={{position: 'absolute', left: 553, top: 791, width: 810, height: 300, borderRadius: 30, background: 'linear-gradient(180deg, #ff7a3d, #e8457a 70%, #9a3dc4)', ...rise(0.2)}}><div style={{position: 'absolute', left: 60, top: 70, fontSize: 52, color: '#fff', fontWeight: 500, width: 600, lineHeight: 1.3}}>{x.promo}</div></div>
    </div>);
  }
  if (s >= 12.5 && s < 15.15) {
    // 推近后的输入框：逐字打 → 镜头跟到发送键 → 框收进发送键
    const A = Array.from(x.prompt), n = Math.floor(clamp((s - 12.5) / 1.4) * A.length + 0.001);
    const F = 80, cw = (c: string) => (!/[\x00-\x7f]/.test(c) ? F : /[ilj.,'|!]/.test(c) ? F * 0.26 : /[-frt ]/.test(c) ? F * 0.36 : /[mwMW]/.test(c) ? F * 0.84 : F * 0.56); // 西文按比例宽（以前一律 0.55，lo-fi 被拉成 l o - f i）
    const typedW = A.slice(0, n).reduce((a, c) => a + cw(c), 0);
    const fullW = A.reduce((a, c) => a + cw(c), 0);
    const pillH = lin(s, [[12.5, 270], [13.4, 302], [14.4, 280], [14.85, 262]]);
    const textLeftNoPan = 560; // 打字开头的位置
    const pan = Math.max(0, textLeftNoPan + typedW - 900); // 光标过了 900 就往左跟
    const endPan = eio((s - 13.9) / 0.5);
    const pillW = fullW + 1100; // 推近后框比屏幕还长
    const btnD = lin(s, [[13.9, 240], [14.4, 240], [14.85, 200]]);
    // 框的右端在屏幕上的位置：打字时在画面外，13.9 起拉进来到 1258（键右沿），之后右端跟着键走
    const rightEnd0 = textLeftNoPan - 70 + pillW - pan;
    const rightEnd = rightEnd0 + (1258 - rightEnd0) * endPan;
    const collapse = Math.pow(clamp((s - 14.4) / 0.75), 1.6); // 先慢后快，15.1 还剩一小截
    const btnCx = lin(s, [[14.4, 1138], [14.85, 961]]);
    const pillRight = s < 14.4 ? rightEnd : btnCx + btnD / 2 + 18;
    const pillLeft = s < 14.4 ? rightEnd - pillW : pillRight - (pillW) * (1 - collapse) - btnD * collapse;
    const shift = rightEnd - rightEnd0; // 文字跟着框走
    const textX = textLeftNoPan - pan + (s < 14.4 ? shift : shift - (pillW - btnD) * collapse);
    // 第二轮（2026-11-23 用户：13 系列光影质感没学到）：输入框顶边是一条很亮的「粉 → 橙 → 蓝」光线，光往上方晕开一大片暖色雾（原片 13.5 最明显），
    //   以前只是框里一条 4px 的色带，被框裁掉、也没有往外晕
    const topY = 532 - pillH / 2, pw = pillRight - pillLeft;
    els.push(<div key="haze" style={{position: 'absolute', left: pillLeft + pw * 0.05, top: topY - 210, width: pw * 0.9, height: 260, borderRadius: '50%', background: 'radial-gradient(ellipse 50% 60% at 45% 85%, rgba(255,120,80,0.38) 0%, rgba(255,70,150,0.2) 40%, rgba(0,0,0,0) 75%)', filter: 'blur(18px)'}} />);
    els.push(<div key="edge" style={{position: 'absolute', left: pillLeft + pillH * 0.35, top: topY - 1, width: pw - pillH * 0.7, height: 3, borderRadius: 2, background: 'linear-gradient(90deg, rgba(255,90,170,0) 0%, #ff5aa8 12%, #ff8a3d 40%, #ff4f8b 62%, #6a6aff 85%, rgba(106,106,255,0) 100%)', boxShadow: '0 0 6px rgba(255,140,120,0.9), 0 0 18px rgba(255,90,160,0.7), 0 -10px 40px rgba(255,110,90,0.45)'}} />);
    els.push(<div key="pill" style={{position: 'absolute', left: pillLeft, top: 532 - pillH / 2, width: pillRight - pillLeft, height: pillH, borderRadius: pillH / 2, background: 'linear-gradient(180deg, rgba(48,46,56,0.96), rgba(28,27,33,0.96))', border: '2px solid rgba(165,115,255,0.9)', boxShadow: '0 0 10px rgba(140,90,255,0.55), 0 -6px 40px rgba(255,80,160,0.25), 0 0 80px rgba(120,60,255,0.22)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 4, background: 'linear-gradient(90deg, #8a3dff, #ff4f8b, #ff8a3d, #8a3dff)', opacity: 0.9}} />
      <div style={{position: 'absolute', left: textX - pillLeft, top: 0, height: pillH, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', fontFamily: SANS, fontSize: F, color: '#f2f2f2'}}>
        {A.slice(0, n).map((c, i) => { const tc = 12.5 + 1.4 * (i / A.length), k = clamp((s - tc) / 0.45); return <span key={i} style={{color: k < 1 ? `rgba(${Math.round(150 + 92 * k)},${Math.round(90 + 152 * k)},255,1)` : '#f2f2f2', filter: k < 1 ? `blur(${(1 - k) * 7}px)` : undefined, textShadow: k < 1 ? `0 0 ${18 * (1 - k)}px rgba(150,90,255,${0.9 * (1 - k)})` : undefined, display: 'inline-block', width: cw(c), textAlign: 'center'}}>{c}</span>; })}
        {s < 13.95 && <span style={{width: 4, height: F * 1.1, background: '#eee', marginLeft: 6}} />}
      </div>
    </div>);
    if (s >= 13.8) els.push(<div key="btn" style={{position: 'absolute', left: (s < 14.4 ? rightEnd - 18 - btnD / 2 : btnCx) - btnD / 2, top: 532 - btnD / 2}}><SendIcon d={btnD} /></div>);
  }
  if (s >= 15.0) {
    // 圆环 + 胶囊 → 音乐卡
    const r1 = lin(s, [[15.0, 340], [15.1, 365], [15.3, 362], [15.6, 690], [16.0, 900]]), r2 = lin(s, [[15.15, 380], [15.3, 551], [15.6, 810], [16.0, 1050]]);
    const ro = 1 - clamp((s - 15.6) / 0.4);
    els.push(<Ring key="r1" r={r1} o={ro} rot={s * 120} />);
    if (s > 15.15) els.push(<Ring key="r2" r={r2} o={ro * clamp((s - 15.15) / 0.05)} rot={-s * 90} />);
    const w = lin(s, [[15.0, 200], [15.15, 200], [15.3, 548], [15.6, 977], [16.0, 1309]]), h = lin(s, [[15.0, 200], [15.15, 200], [15.3, 184], [15.6, 210], [16.0, 225]]);
    const dark = clamp((s - 15.6) / 0.4);
    const bg = dark < 1 ? `linear-gradient(90deg, rgba(240,122,42,${1 - dark}) 0%, rgba(236,79,134,${1 - dark}) 42%, rgba(220,70,150,${1 - dark}) 58%, rgba(240,122,42,${1 - dark}) 100%), #2b2b31` : '#2b2b31'; // 原片胶囊两头橙、中间品红（不是橙 → 紫）
    // 胶囊中间原片有一团蓝紫色径向光斑（15.3–15.6），以前是干净的线性渐变
    const blob = (1 - dark) * clamp((s - 15.2) / 0.15);
    els.push(<div key="card" style={{position: 'absolute', left: 961 - w / 2, top: 532 - h / 2, width: w, height: h, borderRadius: h / 2 * (1 - dark * 0.45), background: (blob > 0 ? `radial-gradient(ellipse 32% 110% at 50% 80%, rgba(70,90,255,${0.95 * blob}) 0%, rgba(160,60,240,${0.75 * blob}) 30%, rgba(230,60,170,${0.6 * blob}) 55%, rgba(0,0,0,0) 85%), ` : '') + bg, overflow: 'hidden', fontFamily: SANS, boxShadow: '0 20px 60px rgba(0,0,0,0.5)'}}>
      {s < 15.15 ? <div style={{position: 'absolute', inset: 0}}><SendIcon d={w} /></div> : <>
        <div style={{position: 'absolute', left: h * 0.32, top: h / 2 - 28, fontSize: 52, color: dark > 0.5 ? '#ff4f8b' : '#fff'}}>♫</div>
        <div style={{position: 'absolute', left: h * 0.32 + 90, top: h / 2 - 48, fontSize: 42, color: '#f2f2f2', opacity: clamp((s - 15.4) / 0.2), whiteSpace: 'nowrap'}}>{Array.from(x.title).map((c, i) => { const k = clamp((s - 15.95 - i * 0.05) / 0.3); return <span key={i} style={{filter: k < 1 ? `blur(${(1 - k) * 9}px)` : undefined}}>{c}</span>; })}</div>
        <div style={{position: 'absolute', left: h * 0.32 + 90, top: h / 2 + 10, fontSize: 30, color: '#9a9aa2', opacity: clamp((s - 15.5) / 0.2), whiteSpace: 'nowrap'}}>{Array.from(x.meta).map((c, i) => { const k = clamp((s - 16.05 - i * 0.05) / 0.3); return <span key={i} style={{filter: k < 1 ? `blur(${(1 - k) * 9}px)` : undefined}}>{c}</span>; })}</div>
        <div style={{position: 'absolute', right: h * 0.3, top: h / 2 - 20, fontSize: 32, color: '#c8c8cf', opacity: clamp((s - 15.6) / 0.2)}}>刚刚 ···</div></>}
    </div>);
  }
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {els}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(PROMPT_RINGS_CONTRACT).length) throw new Error(checkContract(PROMPT_RINGS_CONTRACT).join('；'));
export const PromptSendRingsCard: React.FC = () => <PromptSendRingsCardGroup />;
