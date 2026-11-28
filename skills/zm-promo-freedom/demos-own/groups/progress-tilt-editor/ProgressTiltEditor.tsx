// 【镜头组】progress-tilt-editor：产品图标 + 发光进度条跳着涨（几道绿色流光绕着飞）→ 一块霓虹描边的代码编辑器从画面底下斜着升起来、
//   一点点立起来，代码一行行打出来（刚打的那段是绿的）（036-B 一拍，产品演示）
// 学的动作（Varcyyyy · BLACKBOX 7.15–12.05s，30fps 逐帧量过）：
//   7.15 图标（≈168px）在（960,582）、进度条 1050 宽在 y798，百分比在右上；7.3–8.5 图标上移到 y480、条到 y744，百分比 52→66→73→78→81
//   8.45 编辑器从底下升起：顶边 y 1150→510（8.8）→370（9.4）→300（10.0）→240（10.6）→140（11.5）→120；
//   倾角（底边朝镜头）75°→72→64→56→48→36→33；平面转角 −2°（9.4）→0（10.3）→+4°（11.5）；左边青绿、右边蓝的霓虹边
//   9.0–11.8 一行行打代码，最后打的一截是绿色高亮
// 我们的内容：标签「AI 代码补全引擎」，最后一行调用里是我们那句提问；图标是虚构「码匣」的。
import React from 'react';
import {FilmGrain, GlowSpot, Streak, hotBox, hotText} from '../_kit/light';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {BoxLogo, GREEN, MONO, SANS, TealBg, clamp, eio, eo, hash, kf} from '../_kit/codeGlowKit';

const FPS = 30;
const S0 = 7.15;
export const PROGRESS_TILT_EDITOR_CONTRACT: GroupContract = {
  sourceDuration: 147 / 30,
  fps: 30,
  motion: [[0, 1.2], [1.3, 147 / 30]],
  holds: [{at: 1.25, maxExtra: 1.5}],
  landmarks: {logo: 0, rise: 1.3, code: 1.85, done: 4.6},
  sfx: [
    {at: 'logo', type: '上扬铺垫', note: '充能 riser', tail: 1.2, volume: 0.4},
    {at: 'rise', type: '上升', note: '升起 whoosh', volume: 0.45},
    {at: 'code', type: '键盘', note: '键盘打字', tail: 2.6, volume: 0.25},
  ],
  inputs: {tab: {maxChars: 10}},
};
export type EditorInputs = {tab: string; lines: [number, string][]};
export const EDITOR_DEFAULT_INPUTS: EditorInputs = {
  tab: 'AI 代码补全引擎',
  lines: [[1, 'class CodeSynth {'], [2, '  constructor(model) {'], [3, '    this.model = model'], [7, '  async generate(prompt) {'], [8, '    const tokens = await this.model.run(prompt)'], [12, '  optimize(tokens) {'], [13, '    return tokens'], [14, '      .filter(t => t.confidence > 0.8)'], [20, 'const engine = new CodeSynth(aiModel)'], [21, 'engine.generate("这段代码怎么优化？")']],
};
export const checkEditorInputs = (x: EditorInputs) => checkInputs(PROGRESS_TILT_EDITOR_CONTRACT, {tab: x.tab});
export const planEditor = (sec: number) => planExtras(PROGRESS_TILT_EDITOR_CONTRACT, sec);
export const editorFrames = (extras: number[]) => Math.round(outputDuration(PROGRESS_TILT_EDITOR_CONTRACT, extras) * FPS);
export const PROGRESS_TILT_EDITOR_DURATION = 147;

export const ProgressTiltEditorGroup: React.FC<{inputs?: EditorInputs; extras?: number[]}> = ({inputs: x = EDITOR_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, PROGRESS_TILT_EDITOR_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const pct = Math.round(kf(s, [[7.15, 46], [7.3, 52], [7.6, 66], [7.9, 73], [8.2, 78], [8.5, 81], [8.8, 84]], eo) + held * 0);
  const ly = kf(s, [[7.15, 582], [7.6, 510], [7.9, 480]]);
  const barY = kf(s, [[7.15, 798], [7.6, 750], [7.9, 744]]);
  const fill = pct / 100;
  // 编辑器
  // 2026-11-19 编辑器的透视按原片 9.6–11.9 每 0.4s 量的四个角，用 3D 变换反解出来（fit36b.py）：原片一直是「右边远一点、往右偏」的（rotateY≈−7°、右移 60–100），
  //   11.2 之后才转成右边近、左边远（rotateY 到 +12°、rotate −8°）；之前我们只有前后仰（rotateX），没有左右转，所以角度怎么都对不上
  const topY = kf(s, [[8.3, 1150], [8.45, 900], [8.6, 650], [8.8, 520], [9.2, 410], [9.6, 358], [10.0, 318], [10.4, 288], [10.8, 266], [11.2, 210], [11.9, 170], [12.05, 166]]);
  const rx = kf(s, [[8.45, 75], [8.8, 73], [9.2, 72], [9.6, 71], [10.0, 66], [10.4, 62], [10.8, 58], [11.2, 49], [11.9, 51], [12.05, 51]]);
  const ry = kf(s, [[8.45, -6], [9.6, -6.3], [10.0, -7.2], [10.4, -7.8], [10.8, -8.5], [11.2, -0.7], [11.9, 10.5], [12.05, 11.5]]);
  const tx = kf(s, [[8.45, 60], [9.6, 60], [10.0, 78], [10.4, 90], [10.8, 76], [11.2, 27], [11.9, 11], [12.05, 9]]);
  const esc = kf(s, [[8.45, 1], [9.6, 0.99], [10.0, 0.95], [10.4, 0.94], [10.8, 0.9], [11.2, 0.93], [11.9, 0.94], [12.05, 0.95]]);
  const whip = eio(clamp((s - 11.88) / 0.17)); // 2026-11-18 原片 11.88 起编辑器往左后方一甩、带糊，接下一镜（之前停住到切）
  const rz = kf(s, [[8.45, 4], [9.6, 3.9], [10.0, 4.2], [10.4, 3], [10.8, 3], [11.2, 2], [11.9, -7.8], [12.05, -8.2]]);
  const W = 1100, H = 830;
  // 打字：总字符按时间铺开

  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      {/* 2026-11-19 光影按原片吸管量的颜色重做：整幅是青绿色的光场（左上偏蓝绿、右上一大团亮青、左下偏绿），不是黑底加一点点光 */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #0a2630 0%, #0d3134 40%, #12392d 70%, #0e2a20 100%)'}} />
      <GlowSpot x={1860} y={170} rx={950} ry={620} rgb="40,140,145" a={0.62} />
      <GlowSpot x={140} y={760} rx={820} ry={520} rgb="30,110,72" a={0.42} />
      <GlowSpot x={700} y={120} rx={760} ry={420} rgb="22,92,104" a={0.32} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 80% at 45% 40%, rgba(0,0,0,0) 55%, rgba(0,8,6,0.55) 100%)'}} />
      {s < 9.2 && <GlowSpot x={446 + 1034 * fill} y={barY} rx={600} ry={320} rgb="120,230,190" a={0.5 * (1 - clamp((s - 8.6) / 0.6))} />}
      {s < 9.2 && <GlowSpot x={446 + 1034 * fill - 60} y={barY} rx={260} ry={120} rgb="210,255,238" a={0.55 * (1 - clamp((s - 8.6) / 0.6))} />}
      {/* 图标 + 进度条（编辑器升起后被挡住） */}
      {s < 9.4 && <><div style={{position: 'absolute', left: 960 - 120, top: ly - 120, filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8)) drop-shadow(0 0 18px rgba(120,255,200,0.55)) drop-shadow(0 0 50px rgba(80,220,170,0.3))', transform: `rotate(${(s - 7.15) * 20}deg)`}}><BoxLogo size={240} stroke={2} /></div>
      <div style={{position: 'absolute', left: 1360, top: barY - 92, fontSize: 52, color: '#f2fbf8', fontWeight: 600, textShadow: '0 0 6px rgba(255,255,255,0.55), 0 0 22px rgba(120,240,200,0.35)'}}>{pct}%</div>
      <div style={{position: 'absolute', left: 438, top: barY - 28, width: 1050, height: 56, borderRadius: 28, background: 'rgba(0,10,8,0.55)', boxShadow: 'inset 0 0 0 2px rgba(90,230,180,0.6), 0 0 14px rgba(80,220,170,0.35)'}}>
        <div style={{position: 'absolute', left: 8, top: 8, height: 40, width: (1050 - 16) * fill, borderRadius: 20, background: 'linear-gradient(90deg, rgba(40,200,140,0.1), #3fe0a0 35%, #5ff8e0 65%, #e8fffb 88%, #ffffff)', boxShadow: hotBox('95,245,176', 0.75)}} />
      </div></>}
      {/* 2026-11-19 逐帧（放大看）：原片不是一圈绕着转的大月牙，而是零星的细小绿光片从中间往外飞过镜头（像穿过一片光粒子），
          每片只活 0.2–0.3s、越飞越大越快；偶尔一片白色大的从画面边上掠过（7.25 右上、7.65 左边）。同时只有 2–4 片 */}
      {s < 8.9 && Array.from({length: 18}, (_, i) => {
        const born = 7.1 + i * 0.095 + hash(i * 3.7) * 0.06, life = 0.22 + hash(i * 5.1) * 0.12, u = (s - born) / life;
        if (u <= 0 || u >= 1) return null;
        const white = i === 1 || i === 6 || i === 13;
        const a = hash(i * 9.3) * Math.PI * 2, r0 = 120 + hash(i * 2.2) * 260, r = r0 + u * u * (white ? 560 : 420);
        const cx = 960 + Math.cos(a) * r * 1.5, cy = 520 + Math.sin(a) * r * 0.85;
        const len = (white ? 260 : 70 + hash(i * 4.4) * 70) * (0.6 + u * 0.9);
        return <Streak key={i} x={cx} y={cy} len={len} th={white ? 9 : 5} bend={0.22} angle={(a * 180) / Math.PI + 90 + (hash(i) - 0.5) * 40} rgb={white ? '235,255,248' : '70,240,150'} o={Math.sin(Math.PI * u) * (white ? 0.95 : 0.9)} />;
      })}
      {/* 编辑器 */}
      {s > 8.28 && (
        <div style={{position: 'absolute', left: 940 - W / 2, top: topY, width: W, height: H, transformOrigin: '50% 0%', transform: `translateX(${tx - 60 * whip}px) perspective(1500px) rotateX(${rx}deg) rotateY(${ry + 14 * whip}deg) rotate(${rz}deg) scale(${esc * (1 - 0.06 * whip)})`, filter: whip > 0.02 ? `blur(${whip * 3.5}px)` : undefined}}>
          {/* 原片的边框是渐变的：左边 / 下边亮绿，往右上过渡成蓝紫，外面一圈同色辉光 */}
          {/* 2026-11-21 原片编辑器的边是一条细亮线（≈3px），颜色沿边明显渐变：一侧亮绿 → 青 → 另一侧亮蓝，而且渐变一直在慢慢绕（9.4 左绿右蓝 → 10.6 右边转成绿 → 11.8 左上转成蓝）；之前是一圈很粗的青色雾光，看不出渐变 */}
          <div style={{position: 'absolute', inset: -4.5, borderRadius: 60, background: `conic-gradient(from ${kf(s, [[8.8, 260], [9.4, 250], [10.0, 225], [10.6, 120], [11.2, 105], [11.8, 40], [12.1, 30]])}deg at 50% 50%, #2cff7a 0deg, #34f59a 45deg, #2bd8cc 95deg, #2f86ff 150deg, #3b5cff 185deg, #2f86ff 220deg, #2bd8cc 275deg, #34f59a 320deg, #2cff7a 360deg)`, filter: 'drop-shadow(0 0 3px rgba(220,255,245,0.7)) drop-shadow(0 0 14px rgba(70,220,190,0.6)) drop-shadow(0 0 40px rgba(60,170,220,0.3))'}} />
          {/* 2026-11-21 用户：边框是有渐变的「光线」——除了颜色渐变，边上还有两段特别亮的高光沿着边在走（10.6 右边一大段亮绿、左下角亮），叠在渐变上 */}
          <div style={{position: 'absolute', inset: -6, borderRadius: 62, background: `conic-gradient(from ${-40 + (s - 8.8) * 95}deg at 50% 50%, rgba(255,255,255,0) 0deg, rgba(225,255,240,0.95) 26deg, rgba(150,255,200,0.6) 48deg, rgba(255,255,255,0) 80deg, rgba(255,255,255,0) 175deg, rgba(200,225,255,0.85) 205deg, rgba(255,255,255,0) 240deg, rgba(255,255,255,0) 360deg)`, mixBlendMode: 'screen', filter: 'blur(1.5px) drop-shadow(0 0 8px rgba(160,255,215,0.6))'}} />
          <div style={{position: 'absolute', inset: 0, borderRadius: 56, background: 'linear-gradient(180deg, #050909 0%, #071010 100%)'}} />
          <div style={{position: 'absolute', left: 92, top: 0, bottom: 0, width: 2, background: 'rgba(120,200,180,0.35)'}} />
          {['◯', '＋', '↺', '☁', '⌄', '⚷'].map((c, i) => <div key={i} style={{position: 'absolute', left: 30, top: 50 + i * 60, fontSize: 26, color: '#cfe0dc'}}>{c}</div>)}
          <div style={{position: 'absolute', left: 130, top: 40, fontSize: 30, color: '#cfe0dc', letterSpacing: 4}}>⠿</div>
          <div style={{position: 'absolute', left: 180, top: 36, height: 38, borderRadius: 19, border: '2px solid #9fb8b2', padding: '0 16px', display: 'flex', alignItems: 'center', fontSize: 22, color: '#e8f2f0'}}>{x.tab} ✕</div>
          {Array.from({length: 21}, (_, i) => <div key={i} style={{position: 'absolute', left: 100, width: 60, textAlign: 'right', top: 92 + i * 34, fontFamily: MONO, fontSize: 23, color: 'rgba(200,215,212,0.7)'}}>{i + 1}</div>)}
          {x.lines.map(([ln, txt], i) => {
            const st = ln === 21 ? 11.1 : 8.5 + i * 0.04, rate = ln === 21 ? 16 : 15; const k = Math.min(txt.length, Math.floor(Math.max(0, s - st) * rate)); // 2026-11-19 逐帧：原片每行一起慢慢打（第 20 行 9.3 起打、11.2 才打完），最后一行 11.1 才开始；之前 0.9s 就全打完了
            if (k <= 0) return null;
            const hot = Math.max(0, k - 8);
            /* 2026-11-21 用户：字也是渐变的光——原片刚打出的字是一段渐变尾巴（白 → 浅绿 → 亮绿、越靠近光标越亮越发光），不是一刀切的白 / 绿两段 */
            const T = 10, h0 = Math.max(0, k - T);
            return <div key={i} style={{position: 'absolute', left: 190, top: 90 + (ln - 1) * 34, fontFamily: MONO, fontSize: 25, color: '#f2f7f5', whiteSpace: 'pre', textShadow: '0 0 6px rgba(255,255,255,0.3)'}}>{txt.slice(0, h0)}{Array.from(txt.slice(h0, k)).map((c, j, arr) => { const u = Math.pow((j + 1) / arr.length, 0.6); const r = Math.round(242 - 165 * u), g = Math.round(247 + 8 * u), b = Math.round(245 - 107 * u); return <span key={j} style={{color: `rgb(${r},${g},${b})`, textShadow: `0 0 ${3 + 6 * u}px rgba(90,255,150,${0.35 + 0.6 * u}), 0 0 ${8 + 18 * u}px rgba(67,240,138,${0.2 + 0.7 * u}), 0 0 ${30 * u}px rgba(67,240,138,${0.45 * u})`}}>{c}</span>; })}</div>;
          })}
        </div>
      )}
      <FilmGrain o={0.07} />
      <div style={{position: 'absolute', right: 36, bottom: 26, fontSize: 20, color: 'rgba(200,230,220,0.45)', letterSpacing: '0.06em'}}>虚构 · 仅作演示</div>
    </AbsoluteFill>
  );
};

if (checkContract(PROGRESS_TILT_EDITOR_CONTRACT).length) throw new Error(checkContract(PROGRESS_TILT_EDITOR_CONTRACT).join('；'));
export const ProgressTiltEditor: React.FC = () => <ProgressTiltEditorGroup />;
