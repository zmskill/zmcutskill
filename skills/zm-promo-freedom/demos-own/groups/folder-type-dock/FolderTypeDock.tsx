// 【镜头组】folder-type-dock：「从 [文件夹砖] 文件夹」一句话 → 硬切白底：文件夹散在四周、底下程序坞升上来，光标点中一个 AI 图标 →
//   输入框滑进来逐字打一句需求（关键词紫色）→ 光标去抓上面的玻璃文件夹、拖着往下走，镜头一直往右慢摇，最后整体往左甩走（039-B 一拍，功能演示）
// 学的动作（MdMizanurRahman · NotebookLM 8.77–15.27s，30fps 逐帧看过）：
//   8.77 文件夹砖带 8° 歪斜弹出、0.1s 摆正，8.82 左词浮现，8.88 右词先粗后细地出现；里面的纸往上扇开一点；两边词慢慢往外漂
//   9.95 硬切白底：程序坞从下面 0.25s 升上来（图标砖 208px、整条粉紫描边），光标斜着飞来点第 3 个图标，下面亮一个小圆点
//   10.75 灰色输入框从右边滑进（高 240px、字 66px），10.85–12.1 逐字打字，后半句紫色
//   13.3 光标上去按住玻璃文件夹，14.3 起拖着它斜着往左下走、文件夹歪 12°；镜头全程往右慢摇（坞的左沿 570→314px），15.2 起整体往左甩
// 我们的内容：从 / 文件夹；需求"用这些参考资料帮我做一份演示文稿"；程序坞是国内 AI 产品官方图标；文件夹自己画（不用系统图标）。
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {INK, PAPER, PURPLE, SANS, back, brand, clamp, eio, eo, kf, mix, rs} from '../_kit/softAiKit';

const FPS = 30;
const S0 = 8.77; // 原片起点
export const FOLDER_TYPE_DOCK_CONTRACT: GroupContract = {
  sourceDuration: 195 / 30,
  fps: 30,
  motion: [[0, 1.1], [1.2, 3.4], [3.5, 195 / 30]],
  holds: [{at: 1.15, maxExtra: 1}, {at: 3.45, maxExtra: 1.5}],
  landmarks: {tile: 0, word: 0.05, cut: 1.18, dock: 1.2, click: 1.36, bar: 1.98, type: 2.08, grab: 4.55, drag: 5.55, exit: 6.45},
  sfx: [
    {at: 'tile', type: '弹出', note: '轻 pop', volume: 0.35},
    {at: 'cut', type: '短甩', note: '硬切 swish', volume: 0.35},
    {at: 'click', type: '轻tick', note: '点击 tick', volume: 0.4},
    {at: 'type', type: '键盘', note: '一串打字', tail: 1.2, volume: 0.3},
    {at: 'grab', type: '点击', note: '拾起 click', volume: 0.35},
    {at: 'exit', type: '短甩', note: '硬切 swish', volume: 0.45},
  ],
  inputs: {wordL: {maxChars: 2}, wordR: {maxChars: 4}, prompt: {maxChars: 18}},
};
export type FolderInputs = {wordL: string; wordR: string; prompt: string; hot: string; dock: string[]};
export const FOLDER_DEFAULT_INPUTS: FolderInputs = {
  wordL: '从', wordR: '文件夹', prompt: '用这些参考资料帮我做一份演示文稿', hot: '这些参考资料',
  dock: ['deepseek', 'kimi', 'doubao', 'qianwen', 'yuanbao', 'wenxin'],
};
export const checkFolderInputs = (x: FolderInputs) => checkInputs(FOLDER_TYPE_DOCK_CONTRACT, {wordL: x.wordL, wordR: x.wordR, prompt: x.prompt});
export const planFolder = (sec: number) => planExtras(FOLDER_TYPE_DOCK_CONTRACT, sec);
export const folderFrames = (extras: number[]) => Math.round(outputDuration(FOLDER_TYPE_DOCK_CONTRACT, extras) * FPS);
export const FOLDER_TYPE_DOCK_DURATION = 195;

// ───────── 零件 ─────────
// 蓝色文件夹（自己画）
export const BlueFolder: React.FC<{w: number; label?: string}> = ({w, label}) => {
  const h = w * 0.78;
  return (
    <div style={{position: 'relative', width: w, height: h + (label ? 34 : 0), fontFamily: SANS}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: w * 0.42, height: h * 0.2, borderRadius: `${w * 0.05}px ${w * 0.08}px 0 0`, background: '#4ea4d8'}} />
      <div style={{position: 'absolute', left: 0, top: h * 0.1, width: w, height: h * 0.9, borderRadius: w * 0.06, background: 'linear-gradient(180deg, #6cc0ec 0%, #4aa6dc 100%)', boxShadow: `inset 0 ${w * 0.02}px 0 rgba(255,255,255,0.45), 0 ${w * 0.03}px ${w * 0.06}px rgba(30,90,140,0.18)`}} />
      {label && <div style={{position: 'absolute', left: 0, right: 0, top: h + 6, textAlign: 'center', fontSize: 24, color: '#333', letterSpacing: '0.04em'}}>{label}</div>}
    </div>
  );
};
// 玻璃文件夹：后面几张纸（带小照片）往上扇开，前面一片半透明淡紫
export const GlassFolder: React.FC<{w: number; fan?: number}> = ({w, fan = 1}) => {
  const h = w * 1.15;
  const PH = ['travel/travel10', 'food/food13', 'hz/hz04'];
  return (
    <div style={{position: 'relative', width: w, height: h}}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: w * (0.12 + i * 0.04), top: h * (0.0 + (2 - i) * 0.05) - fan * h * 0.05 * (2 - i), width: w * 0.74, height: h * 0.74, borderRadius: w * 0.04, background: '#fff', boxShadow: '0 2px 6px rgba(60,60,90,0.18)', transform: `rotate(${(i - 1) * 4 - 6}deg)`, overflow: 'hidden'}}>
          <div style={{margin: `${w * 0.04}px ${w * 0.05}px`, height: w * 0.035, width: '40%', borderRadius: 3, background: i === 2 ? '#e34' : '#cfd3dc'}} />
          <Img src={staticFile(`library/photos/${PH[i]}.jpg`)} style={{position: 'absolute', left: w * 0.05, right: w * 0.05, top: w * 0.13, height: h * 0.4, width: '90%', objectFit: 'cover', borderRadius: 3}} />
        </div>
      ))}
      <div style={{position: 'absolute', left: w * 0.04, top: h * 0.4, width: w * 0.92, height: h * 0.58, borderRadius: w * 0.08, background: 'linear-gradient(170deg, rgba(228,230,255,0.5), rgba(196,202,252,0.66))', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.7), 0 6px 16px rgba(100,100,190,0.18)'}} />
    </div>
  );
};
// 紫色渐变光标
export const GradCursor: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => (
  <svg width={84 * s} height={84 * s} viewBox="0 0 24 24" style={{position: 'absolute', left: x, top: y, opacity: o, overflow: 'visible', filter: 'drop-shadow(0 4px 8px rgba(120,80,200,0.35))'}}>
    <defs><linearGradient id="gc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7b6cff" /><stop offset="1" stopColor="#e07af0" /></linearGradient></defs>
    <path d="M3 3 L20 10.5 L12.5 12.5 L10.5 20 Z" fill="url(#gc)" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);
// 自己画的彩色四角星（输入框左边的 AI 标）
export const Spark: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><defs><linearGradient id="sp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff6a8a" /><stop offset="0.45" stopColor="#7a5cff" /><stop offset="1" stopColor="#2fc3a0" /></linearGradient></defs>
    <path d="M12 1.5 C13 8 16 11 22.5 12 C16 13 13 16 12 22.5 C11 16 8 13 1.5 12 C8 11 11 8 12 1.5 Z" fill="url(#sp)" /></svg>
);
export const DockTile: React.FC<{k: string; size: number}> = ({k, size}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.17, background: '#fff', border: '2px solid #eadcf6', boxShadow: '0 4px 12px rgba(120,90,170,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>
    <Img src={brand(k)} style={{width: size * 0.56, height: size * 0.56, borderRadius: size * 0.11}} />
  </div>
);

export const FolderTypeDockGroup: React.FC<{inputs?: FolderInputs; extras?: number[]}> = ({inputs: x = FOLDER_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, FOLDER_TYPE_DOCK_CONTRACT, extras) + S0; // 用原片秒写动作
  const held = tt - (s - S0);
  // ── 拍 1：一句话 ──
  if (s < 9.95) {
    const pop = rs(s, 8.75, 0.12, (u) => back(u, 2));
    const L = rs(s, 8.8, 0.08), Rw = rs(s, 8.86, 0.08);
    const bold = 1 - rs(s, 8.9, 0.12);
    // 原片：9.25–9.55 两个词往两边各让开 ≈135px，中间字重一闪一闪（右词 8.93 / 9.40 / 9.93，左词 9.27–9.33）—— 不是静止的
    const drift = 135 * eio(rs(s, 9.25, 0.3)) + (s - 8.8) * 10 + held * 6;
    const flash = (a: number, b: number) => (s >= a && s < b ? 1 : 0);
    const boldR = Math.max(bold, flash(9.38, 9.44), flash(9.9, 9.95)), boldL = flash(9.25, 9.36);
    const zoom = 1 - 0.03 * clamp((s - 8.8) / 1.1) + 0.006 * held;
    return (
      <AbsoluteFill style={{background: PAPER, fontFamily: SANS}}>
        <AbsoluteFill style={{transform: `scale(${zoom})`}}>
          <div style={{position: 'absolute', left: 920 - 218, top: 551 - 218, width: 436, height: 436, borderRadius: 34, background: '#fff', boxShadow: '0 4px 14px rgba(90,80,120,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop}) rotate(${(1 - rs(s, 8.75, 0.15)) * 8}deg)`}}>
            <GlassFolder w={250} fan={rs(s, 8.92, 0.2)} />
          </div>
          <div style={{position: 'absolute', right: 1920 - 702 + 128 + drift, top: 551, transform: 'translateY(-55%)', fontSize: 96, fontWeight: boldL ? 700 : 500, color: INK, opacity: L, whiteSpace: 'nowrap'}}>{x.wordL}</div>
          <div style={{position: 'absolute', left: 1139 + 120 + drift, top: 551, transform: 'translateY(-50%)', fontSize: 96, fontWeight: Math.round(mix(500, 700, boldR)), color: INK, opacity: Rw, whiteSpace: 'nowrap'}}>{x.wordR}</div>
        </AbsoluteFill>
        <Grain opacity={0.03} blend="multiply" />
      </AbsoluteFill>
    );
  }
  // ── 拍 2–3：白底 + 坞 + 输入框 + 拖文件夹 ──
  const pan = kf(s, [[9.95, 30], [10.2, 0], [11.6, -40], [13.0, -90], [13.5, -105], [14.4, -150], [14.8, -222], [15.0, -290], [15.2, -438], [15.5, -900]], (u) => u);
  const whip = 0;
  const dockIn = rs(s, 9.97, 0.25, eo);
  const TILE = 208, GAP = 32;
  const dockX = 510 + pan, dockY = 700 + (1 - dockIn) * 420;
  const sel = 2;
  const barIn = rs(s, 10.72, 0.2, eo);
  const P = Array.from(x.prompt);
  const n = Math.floor(clamp((s - 10.85) / 1.25) * P.length + 0.001);
  const hs = x.prompt.indexOf(x.hot);
  // 光标路径
  const tile3 = {x: dockX + 40 + sel * (TILE + GAP) + TILE * 0.35, y: dockY + 32 + TILE * 0.45};
  const grab = rs(s, 13.15, 0.25, eio);
  const drag = clamp((s - 14.4) / 0.8);
  const dd = drag * drag;
  const gf = {x: 800 - dd * 60 + Math.max(0, s - 15.2) * 300, y: -10 + dd * 120 + Math.max(0, s - 15.2) * 500, rot: dd * -15, sc: 1 + dd * 0.15};
  const cur = (() => {
    const p0 = {x: 980, y: 700}, p1 = tile3;
    if (s < 10.15) { const u = eo((s - 9.97) / 0.18); return {x: mix(p0.x, p1.x, u), y: mix(p0.y, p1.y, u)}; }
    if (s < 13.15) return {x: p1.x + Math.sin(s * 1.3) * 6, y: p1.y + Math.cos(s * 1.1) * 4};
    const g = {x: gf.x + 95, y: gf.y + 110};
    return {x: mix(p1.x, g.x, grab), y: mix(p1.y, g.y, grab)};
  })();
  const click = s > 10.12 && s < 10.24;
  return (
    <AbsoluteFill style={{background: '#fff', fontFamily: SANS, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translateX(${-whip * 0}px) scale(${1 + 0.004 * held})`, filter: whip > 0.2 ? `blur(${whip * 10}px)` : undefined}}>
        {/* 四周的文件夹 */}
        <div style={{position: 'absolute', left: 1500 + pan, top: -40}}><BlueFolder w={200} label="音效" /></div>
        <div style={{position: 'absolute', left: 180 + pan, top: 270}}><BlueFolder w={210} label="动图" /></div>
        {/* 输入框 */}
        <div style={{position: 'absolute', left: 405 + pan + (1 - barIn) * 900, top: 356, width: 1760, height: 240, borderRadius: 64, background: '#ececee', opacity: barIn, display: 'flex', alignItems: 'center', paddingLeft: 82, boxSizing: 'border-box', boxShadow: '0 2px 0 rgba(255,255,255,0.8) inset'}}>
          <Spark size={104} />
          <div style={{marginLeft: 38, fontSize: 64, color: INK, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center'}}>
            {P.slice(0, n).map((c, i) => <span key={i} style={{color: hs >= 0 && i >= hs && i < hs + x.hot.length ? PURPLE : INK}}>{c}</span>)}
            {s < 12.4 && <span style={{width: 4, height: 70, background: PURPLE, marginLeft: 4, opacity: Math.floor(s * 3) % 2 ? 1 : 0.2}} />}
          </div>
        </div>
        {/* 程序坞 */}
        <div style={{position: 'absolute', left: dockX, top: dockY, height: TILE + 64 + 40, borderRadius: 110, background: '#fff', border: '3px solid #f0d8f6', boxShadow: '0 10px 30px rgba(190,140,220,0.12)', display: 'flex', alignItems: 'flex-start', gap: GAP, padding: '32px 40px', boxSizing: 'border-box'}}>
          {x.dock.map((k, i) => <div key={k} style={{position: 'relative'}}><DockTile k={k} size={TILE} />{i === sel && s > 10.15 && <div style={{position: 'absolute', left: TILE / 2 - 9, top: TILE + 14, width: 18, height: 18, borderRadius: 9, background: '#7a62d8'}} />}</div>)}
          <div style={{width: 3, height: TILE, background: '#eadcf6', margin: '0 10px'}} />
          <div style={{marginTop: 30}}><BlueFolder w={190} /></div>
        </div>
        {/* 玻璃文件夹（会被拖走） */}
        <div style={{position: 'absolute', left: gf.x, top: gf.y, transform: `rotate(${gf.rot}deg) scale(${gf.sc + grab * 0.04})`}}><GlassFolder w={210} fan={0.6} /></div>
        {/* 光标 */}
        <GradCursor x={cur.x} y={cur.y} s={click ? 0.88 : 1} o={rs(s, 9.97, 0.06)} />
      </AbsoluteFill>
      <Grain opacity={0.02} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(FOLDER_TYPE_DOCK_CONTRACT).length) throw new Error(checkContract(FOLDER_TYPE_DOCK_CONTRACT).join('；'));
export const FolderTypeDock: React.FC = () => <FolderTypeDockGroup />;
// eio 留给拖拽曲线
export const _e = eio;
