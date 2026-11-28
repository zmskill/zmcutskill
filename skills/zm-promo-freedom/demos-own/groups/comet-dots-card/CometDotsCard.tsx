// 【镜头组】comet-dots-card：标题变虚散开 → 一道彩色流星线从右边那团橙光出发，一个点一个点地连过去、拐几个弯
//   （橙 → 品红 → 青 → 品红 → 橙）→ 中间那个点落到正中变成发光的紫色小方块，四周闪一圈淡紫方块 → 方块变成带紫边的白卡片（021-B 一拍，转场）
// 学的动作（mnowakdesign · Roamly 2.933–4.70s，30fps 逐帧量过；时间表 （内部拆片记录，未随项目提供））：
//   线头依次经过 6 个点（720p：1051,303 → 672,233 → 375,150 → 210,367 → 415,570 → 785,570 → 1094,298），
//   到达时间 2.85 / 3.05 / 3.17 / 3.27 / 3.36 / 3.47 / 3.77，尾巴长约 500px、最后缩到 230 并被终点吃掉（3.93）；颜色是"画在路径上"的渐变；
//   第二个点 3.4–3.67 往下落到 (640,335) 变成 25px 紫色发光方块 → 3.77 长到 120px、四周 12 个淡紫方块闪一下 → 3.87 变卡片 → 4.6 长到 326px。
// 我们的内容：接 021-A 的"早就安排好了。"
//
// 拍表（源秒 = 原片秒 − 2.933，30fps，共 53 帧）
//   拍 1 字散开、线出发   0.00–0.55   字变大变虚淡出；线连过前三个点
//   拍 2 拐弯           0.30–0.85   线拐到下面两个点再往右上冲
//   拍 3 方块 → 卡片     0.70–1.77   点落到正中变方块、闪一圈、变白卡片慢慢长大（停留点 1.30）
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有 1：线是沿着已有的点走的折线，不是随便一道光；颜色固定在路径上（线走到哪段就是哪段的颜色）
//   - 独有 2：中间的方块就是其中一个点落下来变的，不是凭空出现
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const kfl = (t: number, K: number[][]) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], (t - K[i][0]) / (K[i + 1][0] - K[i][0])); return K[K.length - 1][1]; };
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const T0 = 88 / 30; // 原片起点

export const COMET_DOTS_CARD_CONTRACT: GroupContract = {
  sourceDuration: 53 / 30,
  fps: 30,
  motion: [[0, 1.25], [1.35, 53 / 30]],
  holds: [{at: 1.3, maxExtra: 1.2}],
  landmarks: {blur: 0, comet: 0.0, corner: 0.33, rise: 0.54, square: 0.73, flash: 0.83, card: 0.93, exit: 53 / 30},
  sfx: [
    {at: 'comet', type: '电流', note: '细长 whoosh（流星线划过）', tail: 0.8, volume: 0.35},
    {at: 'square', type: '弹出', note: '柔和 blip', volume: 0.3},
    {at: 'card', type: '弹出', note: '轻 pop（卡片成形）', tail: 0.3, volume: 0.3},
  ],
  inputs: {phrase: {maxChars: 8}},
};

export type CometInputs = {phrase: string};
export const COMET_DEFAULT_INPUTS: CometInputs = {phrase: '早就安排 好了。'};
export const checkCometInputs = (x: CometInputs) => checkInputs(COMET_DOTS_CARD_CONTRACT, {phrase: x.phrase.replace(/\s/g, '')});
export const planComet = (sec: number) => planExtras(COMET_DOTS_CARD_CONTRACT, sec);
export const cometFrames = (extras: number[]) => Math.round(outputDuration(COMET_DOTS_CARD_CONTRACT, extras) * FPS);
export const COMET_DOTS_CARD_DURATION = 53;

// 路径（720p）与线头到达时间（原片秒）
const P = [[1051, 303], [672, 233], [375, 150], [210, 367], [415, 570], [785, 570], [1094, 298]];
const TA = [2.85, 2.99, 3.12, 3.22, 3.33, 3.45, 3.65];
const SEG = P.slice(1).map((p, i) => Math.hypot(p[0] - P[i][0], p[1] - P[i][1]));
const CUM = SEG.reduce((a, l) => [...a, a[a.length - 1] + l], [0]);
const TOTAL = CUM[CUM.length - 1];
const at = (d: number) => { const dd = clamp(d, 0, TOTAL); let i = 0; while (i < SEG.length - 1 && dd > CUM[i + 1]) i++; const k = (dd - CUM[i]) / SEG[i]; return [mix(P[i][0], P[i + 1][0], k), mix(P[i][1], P[i + 1][1], k)]; };
const headD = (t: number) => kfl(t, TA.map((tt, i) => [tt, CUM[i]]));
// 路径上的颜色（按走过的距离）：橙 → 品红 → 青（左边拐角）→ 品红（底边）→ 橙（最后往右上）
const COL: [number, number[]][] = [[0, [255, 170, 40]], [0.18, [240, 40, 200]], [0.42, [60, 200, 255]], [0.62, [235, 40, 210]], [0.86, [245, 60, 160]], [1, [255, 175, 40]]];
const colAt = (u: number) => { let i = 0; while (i < COL.length - 2 && u > COL[i + 1][0]) i++; const k = clamp((u - COL[i][0]) / (COL[i + 1][0] - COL[i][0])); return COL[i][1].map((v, j) => Math.round(mix(v, COL[i + 1][1][j], k))); };
// 其余点（720p）：会慢慢往外漂（接 021-A 的拉远），3.4–4.2 依次淡掉
const DOTS = [[380, 154, 3.95], [1051, 303, 4.25], [220, 363, 3.85], [420, 565, 4.15], [783, 565, 4.1], [1094, 298, 4.25]];

export const CometDotsCardGroup: React.FC<{inputs?: CometInputs; extras?: number[]}> = ({inputs = COMET_DEFAULT_INPUTS, extras = [0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, COMET_DOTS_CARD_CONTRACT, extras) + T0; // 换成原片秒，方便对数
  const lag = t - (s - T0);
  const zoomOut = mix(1, 0.92, clamp((s - T0) / 1.3)); // 接 A 的慢慢拉远
  // 字：变大、变虚、淡出（2.95–3.5）
  const tb = clamp((s - 2.95) / 0.38);
  // 流星线：线头 + 尾巴（长度 500 → 230），终点后尾巴被吃掉
  const hd = headD(s);
  const tailLen = s < 3.65 ? mix(450, 400, clamp((s - 3.27) / 0.38)) : Math.max(0, 400 * (1 - (s - 3.65) / 0.28));
  const td = s < 3.65 ? Math.max(0, hd - tailLen) : TOTAL - tailLen;
  const segs: React.ReactNode[] = [];
  if (s >= 2.85 && td < TOTAL - 1) {
    const N = 40;
    for (let k = 0; k < N; k++) {
      const d0 = mix(td, Math.min(hd, TOTAL), k / N), d1 = mix(td, Math.min(hd, TOTAL), (k + 1) / N);
      const [x0, y0] = at(d0), [x1, y1] = at(d1);
      const c = colAt(d1 / TOTAL);
      const a = (k + 1) / N; // 尾巴越往后越淡
      segs.push(<line key={k} x1={x0} y1={y0} x2={x1} y2={y1} stroke={`rgb(${c.join(',')})`} strokeOpacity={0.6 + 0.4 * a} strokeWidth={4} strokeLinecap="round" />);
    }
  }
  const [hx, hy] = at(Math.min(hd, TOTAL));
  const hc = colAt(Math.min(hd, TOTAL) / TOTAL);
  // 第二个点往下落到正中，变方块 → 卡片
  const fall = eo(s, 3.4, 3.667);
  const dx = mix(672, 640, fall), dy = mix(233, 335, fall);
  const sq = s < 3.6 ? 0 : s < 3.767 ? mix(30, 70, (s - 3.6) / 0.167) : s < 3.867 ? mix(70, 218, (s - 3.767) / 0.1) : kfl(s, [[3.867, 218], [4.067, 268], [4.267, 307], [4.367, 320], [4.567, 326], [4.7, 328]]);
  const cardK = clamp((s - 3.78) / 0.25); // 紫 → 白
  const cy = mix(335, 352, clamp((s - 3.767) / 0.5));
  const flash = s > 3.62 && s < 3.98 ? Math.sin(Math.PI * clamp((s - 3.62) / 0.36)) : 0;
  const GRID = [[236, 41], [562, 22], [898, 29], [1195, 51], [14, 348], [301, 348], [985, 348], [1267, 348], [87, 637], [384, 659], [724, 666], [1047, 653]]; // 720p 绝对坐标（原片 3.67s 量）
  const gsz = mix(42, 105, clamp((s - 3.62) / 0.3));

  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${1 + 0.004 * lag})`, transformOrigin: '960px 540px'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transform: 'scale(1.5)', transformOrigin: '0 0'}}>
          {/* 接上一镜的标题：变大变虚淡出 */}
          {tb < 1 && <div style={{position: 'absolute', left: 0, width: 1280, top: 368 - 34, textAlign: 'center', fontSize: 67, fontWeight: 700, letterSpacing: -1, color: '#000', lineHeight: 1, opacity: 1 - tb, filter: tb > 0 ? `blur(${tb * 16}px)` : undefined, transform: `scale(${1 + 0.35 * tb})`}}>{inputs.phrase}</div>}
          <div style={{position: 'absolute', inset: 0, transform: `scale(${zoomOut})`, transformOrigin: '660px 360px'}}>
            {/* 其余蓝点 */}
            {DOTS.map(([x, y, off], i) => { const op = 1 - clamp((s - off) / 0.15); return op > 0 ? <div key={i} style={{position: 'absolute', left: x - 4, top: y - 4, width: 8, height: 8, borderRadius: 4, background: '#2a10e8', opacity: op}} /> : null; })}
            {s < 3.7 && <div style={{position: 'absolute', left: dx - 4, top: dy - 4, width: 8, height: 8, borderRadius: 4, background: '#2a10e8'}} />}
            {/* 流星线 */}
            <svg width={1280} height={720} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
              <defs><filter id="cdc-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="16" /></filter></defs>
              <g filter="url(#cdc-glow)" opacity={0.9}>{segs}</g><g filter="url(#cdc-glow)" opacity={0.6}>{segs}</g>
              <g>{segs}</g>
              {s >= 2.85 && s < 3.9 && <circle cx={hx} cy={hy} r={4} fill={`rgb(${hc.join(',')})`} />}
            </svg>
            {/* 起点那团橙光（接 021-A），线走后慢慢散 */}
            <div style={{position: 'absolute', left: 1051 - 90, top: 303 - 90, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,160,40,0.9) 0%, rgba(255,190,110,0.4) 25%, rgba(255,220,180,0.1) 60%, rgba(255,255,255,0) 100%)', opacity: 1 - clamp((s - 2.95) / 0.4)}} />
            {/* 一圈淡紫方块闪一下 */}
            {flash > 0 && GRID.map(([gx, gy], i) => <div key={'g' + i} style={{position: 'absolute', left: gx - gsz / 2, top: gy - gsz / 2, width: gsz, height: gsz, borderRadius: 4, background: 'rgba(150,130,255,0.16)', backgroundImage: i % 3 === 1 ? 'radial-gradient(rgba(130,110,255,0.35) 1px, transparent 1.3px)' : undefined, backgroundSize: '5px 5px', filter: `blur(${clamp((s - 3.7) / 0.2) * 3}px)`, opacity: flash * (0.6 + 0.4 * ((i * 7) % 5) / 4)}} />)}
          </div>
          {/* 方块 → 卡片（不跟着拉远） */}
          {sq > 0 && (
            <div style={{position: 'absolute', left: 640 - sq / 2, top: cy - sq / 2, width: sq, height: sq, borderRadius: mix(4, 14, clamp(sq / 218)),
              background: s < 3.767 ? '#5040f0' : `rgb(${Math.round(mix(200, 255, cardK))},${Math.round(mix(192, 255, cardK))},${Math.round(mix(250, 255, cardK))})`,
              boxShadow: s < 3.767 ? `0 0 0 ${sq * 0.55}px rgba(195,180,255,0.75), 0 0 ${sq * 0.9}px rgba(170,140,255,0.5)` : `0 0 0 ${mix(10, 1, cardK)}px rgba(200,180,255,${mix(0.5, 0.6, cardK)}), 0 0 ${mix(34, 22, cardK)}px rgba(${cardK < 0.6 ? '150,220,255' : '215,180,255'},${mix(0.75, 0.3, clamp((s - 3.9) / 0.4))}), 0 12px 30px rgba(120,100,200,${0.08 * cardK})`}} />
          )}
          {s > 4.55 && s < 4.7 && (
            <div style={{position: 'absolute', left: 639, top: 458, width: 2, height: 22, background: '#1300f2', opacity: clamp((s - 4.55) / 0.04)}} />
          )}
        </div>
      </div>
      <Grain opacity={0.02} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(COMET_DOTS_CARD_CONTRACT).length) throw new Error(checkContract(COMET_DOTS_CARD_CONTRACT).join('；'));
export const CometDotsCard: React.FC = () => <CometDotsCardGroup />;
