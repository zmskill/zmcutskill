// 【镜头组】rich-text-cursor-styles：浅灰底，几个像素小光标（带名字标签）从四处聚到中间变成输入光标 → 一个字一个字打出一句话，
//   镜头跟着光标走（每打完一段猛地横移一下、带拖影，顺便推拉）→ 有人用名字光标选中一个词，换成另一种字体 / 字重 / 像素字 / 渐变 / 加粗 / 斜窄 / 拉开字距（031-A 一串，开场钩子）
// 学的动作（stephenhaney · Paper 0–17.0s，原片 1080×1080，30fps 逐帧量过，按 x+420 放进 1920×1080，2026-11-21）：
//   0–1.6 像素小光标从四处往中间聚（0.6 两个黑白像素块在 (349,416)(540,540)，1.2 三个，1.6 挤成一团），1.7 变成输入光标
//   1.85–2.9 第一句（字号 ≈230，光标钉在 x≈800 不动、字往左长）；2.95–3.2 镜头猛横移 + 拉远（带拖影）
//   每段打字时镜头不动、光标往右走；这一段的开头放在 x≈70（原片坐标）；字号：第二段 155 → 第三段 113 → 第五段 119 → 第六段 169 → 14.3–14.6 拉远到 56
//   选词：浅蓝底高亮出现 → 0.25s 后换样式 → 高亮再停 0.2s 消失；名字光标（圆点 + 彩色名牌）的轨迹全部逐帧量（见 TAGS，第三轮）
//   4.25 选中 → 4.5 换花体；5.5 出现选框和尺寸标签 0.25s；6.7 选中 → 7.0 粗斜体；8.45–9.4 像素字在框里乱跳再定住，9.6 变渐变色（蓝 → 紫）
//   11.6 选中 → 12.0 超粗；13.7 选中 → 14.0 窄斜粗；14.75 起小字号打最后一句，字距拉得很开；16.75 起往下一段横移
// 我们的内容：「来认识一下 富文本」「为 你 和你的 智能体」「让它 厚重」「让它 倾斜」「让它 舒展」，字体用素材库里的中文艺术字体（草书 / 行书 / 小薇衬线 / 得意黑 / 黄油体，第二轮换上），名字光标是虚构的人名，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {LIB, useLibFonts} from '../_kit/libFonts';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 0;
const OX = 420; // 原片 1080 宽 → 放进 1920 中间
const BG = '#e6e6e6';
const SANS = '"Noto Sans CJK SC","PingFang SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const hash = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const lin = (t: number, K: number[][]) => {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * (t - a) / (b - a); }
  return K[K.length - 1][1];
};

type Style = 'base' | 'serif' | 'boldit' | 'pixel' | 'heavy' | 'lean' | 'wide';
type Tok = {text: string; t0: number; t1: number; style?: Style; at?: number; sel?: number; who?: number; gap?: number};
// 每段：打字起止、换样式时刻、选中时刻
const BEATS = [
  {t0: 1.85, scale: 2.3, anchor: -1, toks: [{text: '来认识一下', t0: 1.85, t1: 2.9}]},
  {t0: 3.25, scale: 1.55, anchor: 70, toks: [{text: '富文本', t0: 3.25, t1: 4.15, style: 'serif' as Style, at: 4.5, sel: 4.22, who: 0}]},
  {t0: 6.05, scale: 1.13, anchor: 90, toks: [{text: '为', t0: 6.05, t1: 6.3}, {text: '你', t0: 6.35, t1: 6.6, style: 'boldit' as Style, at: 7.0, sel: 6.72, who: 1, gap: 0.12}, {text: '和你的', t0: 7.25, t1: 8.1, gap: 0.3}]},
  {t0: 8.45, scale: 1.13, anchor: 112, toks: [{text: '智能体', t0: 8.45, t1: 8.75, style: 'pixel' as Style, at: 8.45, who: 1}]},
  {t0: 10.05, scale: 1.19, anchor: 67, toks: [{text: '让它变得', t0: 10.05, t1: 10.9}, {text: '厚重', t0: 11.0, t1: 11.45, style: 'heavy' as Style, at: 12.0, sel: 11.6, who: 5, gap: 0.3}]},
  {t0: 12.5, scale: 1.69, anchor: 67, toks: [{text: '让它', t0: 12.5, t1: 12.95}, {text: '倾斜', t0: 13.1, t1: 13.55, style: 'lean' as Style, at: 14.0, sel: 13.7, who: 7, gap: 0.3}]},
  {t0: 14.75, scale: 0.56, anchor: 95, toks: [{text: '让它', t0: 14.75, t1: 15.1}, {text: '舒展', t0: 15.45, t1: 16.25, style: 'wide' as Style, at: 15.45, who: 2, gap: 0.3}]},
] as {t0: number; scale: number; anchor: number; toks: Tok[]}[];
const PANS = [[2.95, 3.2], [5.9, 6.1], [8.22, 8.42], [9.9, 10.05], [12.22, 12.45], [14.3, 14.6], [16.75, 17.05]];
const PIXEL_SIZE = 2.4; // 像素字比正文大
const WHO = [['小林', '#e0442c', '#fff'], ['阿杰', '#1f9d5a', '#fff'], ['思思', '#7a3fc4', '#fff'], ['老王', '#f2b51b', '#222'], ['豆豆', '#e8691d', '#fff'], ['浩然', '#4b45a8', '#fff'], ['东东', '#b5e05a', '#222'], ['小斯', '#d63d8f', '#fff'], ['雨果', '#12988c', '#fff']];
const POOL = '码字像素点阵格方块乱跳数据流光标选中变换字体';

export const RICH_TEXT_CONTRACT: GroupContract = {
  sourceDuration: 510 / 30,
  fps: 30,
  motion: [[0, 5.7], [5.85, 9.75], [9.85, 16.4], [16.6, 17.0]],
  holds: [{at: 5.78, maxExtra: 1}, {at: 9.8, maxExtra: 1}, {at: 16.5, maxExtra: 1.5}],
  landmarks: {gather: 0, type1: 1.85, pan1: 2.95, sel1: 4.22, style1: 4.5, sel2: 6.72, style2: 7.0, pixel: 8.45, grad: 9.6, sel3: 11.6, style3: 12.0, sel4: 13.7, style4: 14.0, zoomout: 14.3, wide: 15.45},
  sfx: [
    {at: 'type1', type: '键盘', note: '一串打字', tail: 1.0, volume: 0.25},
    {at: 'pan1', type: '短甩', note: '甩动 whoosh', volume: 0.3},
    {at: 'style1', type: '弹出', note: '换字体 pop', volume: 0.35},
    {at: 'style2', type: '弹出', note: '换字体 pop', volume: 0.35},
    {at: 'pixel', type: '故障', note: '数码乱跳 glitch', tail: 0.9, volume: 0.3},
    {at: 'style3', type: '轻落定', note: '重击 thump', volume: 0.4},
    {at: 'style4', type: '弹出', note: '换字体 pop', volume: 0.35},
    {at: 'zoomout', type: '运镜', note: '拉远 whoosh', volume: 0.3},
  ],
  inputs: {lines: {count: 7, maxChars: 6}},
};
export type RichTextInputs = {note: string};
export const RICH_TEXT_DEFAULT_INPUTS: RichTextInputs = {note: '虚构 · 仅作演示'};
export const checkRichTextInputs = (_x: RichTextInputs) => checkInputs(RICH_TEXT_CONTRACT, {lines: BEATS.map((b) => b.toks.map((t) => t.text).join(''))});
export const planRichText = (sec: number) => planExtras(RICH_TEXT_CONTRACT, sec);
export const richTextFrames = (extras: number[]) => Math.round(outputDuration(RICH_TEXT_CONTRACT, extras) * FPS);
export const RICH_TEXT_DURATION = 510;

// 版面：字号 100 的基准单位里每个字占多宽
const charW = (st: Style | undefined, styled: boolean) => !styled ? 100 : st === 'pixel' ? 100 * PIXEL_SIZE : st === 'heavy' ? 112 : st === 'lean' ? 78 : st === 'wide' ? 190 : st === 'serif' ? 106 : 100;
type Placed = {ch: string; x: number; w: number; tok: Tok; beat: number; idx: number; tc: number};
const layout = (s: number) => {
  const out: Placed[] = []; let x = 0; const beatStart: number[] = [];
  BEATS.forEach((b, bi) => {
    x += bi === 0 ? 0 : 30; beatStart.push(x);
    b.toks.forEach((tok) => {
      x += (tok.gap ?? 0) * 100;
      const chars = Array.from(tok.text);
      chars.forEach((ch, i) => {
        const tc = tok.t0 + (tok.t1 - tok.t0) * (i / Math.max(1, chars.length - 1));
        const styled = !!tok.style && s >= (tok.at ?? 99);
        const w = charW(tok.style, styled);
        out.push({ch, x, w, tok, beat: bi, idx: i, tc});
        x += w;
      });
    });
  });
  return {out, beatStart};
};

// 被名字光标拖着的小图块：用我们自己的像素标志图形（和 031-E 落版同一个，不用原片的标志），带半色调网点质感；被拖的那块外面有一圈名字颜色的选框（原片如此）
const PIXM = ['111100', '122100', '122111', '111221', '000221', '000111'];
const PixelBlock: React.FC<{x: number; y: number; size: number; pal: [string, string]; frame?: string; dots?: boolean}> = ({x, y, size, pal, frame, dots}) => (
  <div style={{position: 'absolute', left: x, top: y, width: size, height: size}}>
    <div style={{position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', ...(dots ? {WebkitMaskImage: 'radial-gradient(circle, #000 55%, transparent 62%)', WebkitMaskSize: '5px 5px', maskImage: 'radial-gradient(circle, #000 55%, transparent 62%)', maskSize: '5px 5px'} : {})}}>
      {PIXM.join('').split('').map((v, i) => <div key={i} style={{background: v === '1' ? pal[0] : v === '2' ? pal[1] : 'transparent'}} />)}
    </div>
    {frame && <div style={{position: 'absolute', left: -8, top: -8, right: -8, bottom: -8, border: `3px solid ${frame}`}} />}
  </div>
);
// 名字光标的轨迹：从原片逐帧量的（每 2 帧一个点，原片 1080 坐标、标签左上角），2026-11-23 第三轮
// 用户："这种小东西多流畅不如人家"——以前是淡入淡出 + 直线缓动；原片是真人鼠标录屏：直接出现、带弧线加速减速、停住时几乎不动、镜头甩走时跟着字一起被甩走
const TAGS: {w: number; t0: number; p: number[][]}[] = [
  {w: 0, t0: 0.167, p: [[571,556], [563,604], [555,599], [525,579], [482,552], [435,523], [391,495], [365,479], [357,474], [357,474], [357,474], [360,472], [379,454], [425,413], [495,349], [580,262], [666,157], [737,50]]},
  {w: 1, t0: 0.667, p: [[596,568], [562,601], [570,600], [599,592], [648,582], [703,567], [751,556], [778,549], [788,547], [788,548], [788,548], [792,545], [820,528], [885,485], [970,423]]},
  {w: 2, t0: 1.167, p: [[606,594], [561,601], [560,609], [555,641], [550,688], [545,715], [556,716], [652,721], [843,722]]},
  {w: 3, t0: 1.533, p: [[560,602], [587,633], [687,741], [832,875], [999,985]]},
  {w: 0, t0: 2.233, p: [[983,1035], [945,1032], [898,1017], [838,986], [772,945], [681,898], [574,856], [480,822], [411,799], [356,784], [324,778], [304,775], [278,775], [203,775]]},
  {w: 0, t0: 4.167, p: [[0,766], [184,770], [372,755], [532,732], [647,711], [722,707], [737,702], [734,700], [732,699], [731,698], [730,698], [729,698], [729,698], [729,697], [728,697], [728,697], [728,697], [728,697], [723,695], [724,696], [723,695], [724,695], [724,695], [724,695], [724,695], [724,695], [704,694]]},
  {w: 1, t0: 6.233, p: [[476,590], [474,588], [462,580], [444,565], [419,544], [387,522], [352,500], [318,484], [290,472], [270,464], [262,462], [259,460], [251,455], [252,456], [254,457], [254,458], [254,458], [254,459], [254,459], [254,459], [254,459], [254,459], [252,459], [252,459], [252,459], [252,459], [252,459], [252,459], [252,459], [252,459], [252,459], [252,459], [252,459]]},
  {w: 1, t0: 9.667, p: [[588,340], [588,340], [588,340], [556,343]]},
  {w: 4, t0: 10.3, p: [[348,650], [386,624], [359,640], [359,640], [358,641], [358,641], [358,641], [358,641], [357,642], [357,642], [357,642], [356,642], [356,642], [356,643], [356,643], [356,643], [355,644], [355,644], [355,644], [355,644], [355,645], [354,645], [354,645], [355,645], [355,645], [352,646], [342,646], [340,650], [338,649], [347,647], [349,647], [326,650]]},
  {w: 5, t0: 11.367, p: [[1018,302], [962,364], [932,400], [922,410], [924,408], [930,404], [930,404], [930,404], [930,404], [934,401], [943,394], [938,396], [936,398], [934,400], [934,400]]},
  {w: 7, t0: 12.667, p: [[232,693], [161,678], [198,691], [204,691], [238,692], [285,692], [320,692], [348,692], [375,693], [395,693], [415,693], [446,694], [516,694], [553,694], [600,694], [646,695], [709,695], [771,695], [822,695], [822,696], [834,704], [834,693], [846,613], [845,486], [818,380], [810,345], [811,359], [811,359]]},
  {w: 6, t0: 13.167, p: [[0,264], [115,320], [198,352], [216,364], [206,358], [198,352], [198,352], [198,352], [196,352], [196,352], [196,350], [196,350], [194,350], [166,336], [180,344], [180,342], [178,342], [190,342], [184,346], [190,346], [190,348]]},
  {w: 3, t0: 14.567, p: [[862,398], [844,400], [844,400], [843,400], [844,400], [844,400], [844,400], [844,400], [845,400], [845,399], [846,399], [845,399], [846,400], [846,400], [848,398], [848,398], [848,398], [848,398], [848,398], [848,396], [849,397], [850,397], [850,397], [850,396], [803,398], [729,424], [728,425], [728,424], [727,426], [732,423], [730,425], [728,424], [728,424], [728,424], [728,424], [708,418]]},
  {w: 8, t0: 15.0, p: [[0,912], [104,835], [195,748], [263,670], [305,617], [321,603], [318,605], [310,611], [310,611], [316,611], [330,611], [354,611], [376,611], [410,611], [444,611], [489,611], [534,612], [579,612], [624,612], [669,612], [715,612], [748,612], [805,612], [827,612], [839,612], [851,612], [851,612], [850,612], [830,613]]}
];
// 在 t 时刻某条轨迹的位置（Catmull-Rom，点之间也是顺的）；不在时间段里返回 null
const tagAt = (g: {t0: number; p: number[][]}, t: number) => {
  const u = (t - g.t0) * 15, n = g.p.length;
  if (u < 0 || u > n - 1) return null;
  const i = Math.min(n - 2, Math.floor(u)), f = u - i, P = (k: number) => g.p[Math.max(0, Math.min(n - 1, k))];
  const c = (d: number) => { const p0 = P(i - 1)[d], p1 = P(i)[d], p2 = P(i + 1)[d], p3 = P(i + 2)[d]; return 0.5 * (2 * p1 + (-p0 + p2) * f + (2 * p0 - 5 * p1 + 4 * p2 - p3) * f * f + (-p0 + 3 * p1 - 3 * p2 + p3) * f * f * f); };
  return [c(0), c(1)];
};
/** x, y = 标签左上角（原片 1080 坐标已加 OX）；原片标签高 40、圆点直径 16，在标签左上方 12px；速度快时沿运动方向糊一点 */
const NameTag: React.FC<{x: number; y: number; who: number; blur?: number}> = ({x, y, who, blur = 0}) => {
  const [n, c, tc] = WHO[who % WHO.length];
  return <div style={{position: 'absolute', left: x, top: y, filter: blur > 0.6 ? `blur(${blur.toFixed(1)}px)` : undefined}}>
    <div style={{position: 'absolute', left: -20, top: -20, width: 16, height: 16, borderRadius: '50%', background: c}} />
    <div style={{position: 'absolute', left: 0, top: 0, height: 40, lineHeight: '40px', padding: '0 12px', borderRadius: 5, background: c, color: tc, fontFamily: SANS, fontSize: 23, fontWeight: 600, whiteSpace: 'nowrap'}}>{n}</div>
  </div>;
};

export const RichTextCursorStylesGroup: React.FC<{inputs?: RichTextInputs; extras?: number[]}> = ({inputs: x = RICH_TEXT_DEFAULT_INPUTS, extras = [0, 0, 0]}) => {
  useLibFonts(['cao', 'xing', 'xiaowei', 'smiley', 'huangyou']);
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, RICH_TEXT_CONTRACT, extras) + S0;
  const {out, beatStart} = layout(s);
  const typed = out.filter((p) => s >= p.tc);
  const last = typed[typed.length - 1];
  const caretB = last ? last.x + last.w : beatStart[0];
  // 当前段 & 镜头
  const camAt = (q: number) => {
    const L = layout(q), ty = L.out.filter((p) => q >= p.tc), lt = ty[ty.length - 1], cB = lt ? lt.x + lt.w : L.beatStart[0];
    let bi = 0; BEATS.forEach((b, i) => { if (q >= PANS[Math.max(0, i - 1)][0] && i > 0) bi = i; });
    const camOf = (i: number) => ({scale: BEATS[i].scale, ax: i === 0 ? cB : L.beatStart[i], tx: (i === 0 ? 800 : BEATS[i].anchor) + OX});
    let c = camOf(bi), bl = 0;
    if (bi > 0) {
      const [p0, p1] = PANS[bi - 1];
      if (q < p1) {
        const k = eio((q - p0) / (p1 - p0)), A = camOf(bi - 1), B = camOf(bi);
        if (bi - 1 === 0) A.ax = L.out.filter((p) => p.beat === 0).slice(-1).map((p) => p.x + p.w)[0];
        c = {scale: A.scale + (B.scale - A.scale) * k, ax: A.ax + (B.ax - A.ax) * k, tx: A.tx + (B.tx - A.tx) * k};
        bl = Math.sin(Math.PI * clamp((q - p0) / (p1 - p0))) * 14;
      }
    }
    if (q > PANS[6][0]) { const k = eio((q - PANS[6][0]) / 0.3); c = {...c, ax: c.ax + 900 * k}; bl = Math.sin(Math.PI * clamp((q - PANS[6][0]) / 0.3)) * 14; }
    return {...c, blur: bl};
  };
  const cam = camAt(s), blur = cam.blur;
  const sx = (bx: number) => cam.tx + (bx - cam.ax) * cam.scale;
  const F = 100 * cam.scale, Y = 540;
  const els: React.ReactNode[] = [];
  // 0–1.7 像素小光标聚拢
  if (s < 1.75) {
    const P = [[[292, 360], [286, 360], [440, 470]], [[484, 484], [484, 484], [500, 520]], [[620, 140], [709, 427], [560, 455]], [[200, 700], [620, 560], [540, 560]]];
    P.forEach((p, i) => {
      if (s < i * 0.25) return;
      const k1 = clamp(s / 0.6), k2 = clamp((s - 0.6) / 0.6), k3 = eo((s - 1.2) / 0.4);
      const px = p[0][0] + (p[1][0] - p[0][0]) * k2 + (p[2][0] - p[1][0]) * k3, py = p[0][1] + (p[1][1] - p[0][1]) * k2 + (p[2][1] - p[1][1]) * k3;
      const o = (s >= i * 0.25 && s < 1.66 && k1 > 0) ? 1 : 0; // 原片图块是直接出现 / 消失，不淡入淡出
      const tg = i < 3 ? TAGS.find((g) => g.w === i && g.t0 < 1.8 && tagAt(g, s)) : undefined, tp = tg ? tagAt(tg, s) : null; // 带名字的三个像素块跟着名字光标走
      const PAL: [string, string][] = [['#3c5f9a', '#9db6e3'], ['#7aa6e8', '#e6e6e6'], ['#c2a07a', '#efe6da'], ['#1d1d1f', '#e6e6e6']];
      els.push(<div key={'pc' + i} style={{opacity: o}}><PixelBlock x={tp ? tp[0] - 70 + OX : px + OX} y={tp ? tp[1] - 80 : py} size={i === 3 ? 124 : 110} pal={PAL[i]} dots={i === 0} frame={tp && i === 1 ? WHO[1][1] : undefined} /></div>);
    });
  }
  // 一行字
  const line: React.ReactNode[] = [];
  typed.forEach((p, i) => {
    const tok = p.tok, styled = !!tok.style && s >= (tok.at ?? 99);
    const st: React.CSSProperties = {position: 'absolute', left: sx(p.x), top: Y, height: 0, width: p.w * cam.scale, display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', fontFamily: SANS, fontSize: F, fontWeight: 400, color: '#1d1d1f', lineHeight: 1};
    let ch = p.ch, inner: React.CSSProperties = {};
    if (styled) {
      // 第二轮（2026-11-23 用户：字体偏艺术、要学内核）：内核是「字义 = 字形」——富文本用花体 / 行书混排、你 用斜粗、厚重 用超粗方块体、
      //   倾斜 用超窄斜体、舒展 用细衬线拉开字距；以前只有思源黑 / 宋，换了字重也看不出设计。字体都来自素材库 library/fonts（OFL）。
      if (tok.style === 'serif') { const k = p.idx; if (k === 0) { st.fontFamily = LIB.cao; inner = {transform: 'scale(1.45) translate(-4%, -6%)'}; } else if (k === 2) { st.fontFamily = LIB.xing; inner = {transform: 'scale(1.18)'}; } else { st.fontFamily = LIB.xiaowei; inner = {transform: 'scale(1.05)'}; } }
      if (tok.style === 'boldit') { st.fontFamily = LIB.smiley; inner = {transform: 'scale(1.12)', WebkitTextStroke: `${F * 0.012}px #1d1d1f`}; }
      if (tok.style === 'heavy') { st.fontFamily = LIB.huangyou; inner = {transform: 'skewX(-9deg) scale(1.08)'}; }
      if (tok.style === 'lean') { st.fontFamily = LIB.smiley; inner = {transform: 'scaleX(0.6) scaleY(1.22)', WebkitTextStroke: `${F * 0.03}px #1d1d1f`}; }
      if (tok.style === 'wide') { st.fontFamily = LIB.xiaowei; inner = {transform: 'scaleX(1.25)'}; }
      if (tok.style === 'pixel') {
        st.fontSize = F * PIXEL_SIZE * 0.92; st.fontWeight = 700;
        const settle = 9.4, gk = clamp((s - 9.6) / 0.15);
        if (s < settle) ch = POOL[Math.floor(hash(p.idx * 11 + Math.floor(s * 15)) * POOL.length)];
        const grad = ['#3d6ff0', '#6e5be6', '#a04ad8'][p.idx % 3];
        st.color = gk > 0 ? grad : '#86aaf0';
        const dot = F * PIXEL_SIZE * 0.075;
        inner = {WebkitMaskImage: `radial-gradient(circle, #000 52%, transparent 58%)`, WebkitMaskSize: `${dot}px ${dot}px`, maskImage: `radial-gradient(circle, #000 52%, transparent 58%)`, maskSize: `${dot}px ${dot}px`, display: 'inline-block', padding: '0.05em 0'};
      }
    }
    line.push(<div key={'c' + i} style={st}><span style={{display: 'inline-block', ...inner}}>{ch}</span></div>);
  });
  // 选中高亮 + 名字光标 + 选框
  BEATS.forEach((b, bIdx) => b.toks.forEach((tok, ti) => {
    if (!tok.style) return;
    const ps = out.filter((p) => p.tok === tok);
    const x0 = sx(ps[0].x), x1 = sx(ps[ps.length - 1].x + ps[ps.length - 1].w);
    const hh = (tok.style === 'pixel' ? PIXEL_SIZE : 1) * F * 0.62;
    if (tok.sel !== undefined && s >= tok.sel && s < (tok.at ?? 0) + 0.18) {
      const w = clamp((s - tok.sel) / 0.1);
      els.push(<div key={`hl${bIdx}_${ti}`} style={{position: 'absolute', left: x0, top: Y - hh, width: (x1 - x0) * w, height: hh * 2, background: 'rgba(120,160,240,0.6)'}} />);
    }
    if (tok.style === 'pixel' && s >= 8.42 && s < 9.92) els.push(<div key="pbox" style={{position: 'absolute', left: x0 - F * 0.25, top: Y - hh * 1.25, width: x1 - x0 + F * 0.5, height: hh * 2.5, border: '2px solid #8fb1ef'}} />);
    if (tok.style === 'serif' && s >= 5.48 && s < 5.75) {
      els.push(<div key="sbox" style={{position: 'absolute', left: x0 - 20, top: Y - hh * 1.15, width: x1 - x0 + 40, height: hh * 2.3, border: '2px solid #6f9ef0'}}>{[[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, c], j) => <div key={j} style={{position: 'absolute', left: a ? 'calc(100% - 5px)' : -5, top: c ? 'calc(100% - 5px)' : -5, width: 10, height: 10, background: '#fff', border: '2px solid #6f9ef0', boxSizing: 'border-box'}} />)}</div>);
      els.push(<div key="slab" style={{position: 'absolute', left: x0 + 40, top: Y + hh * 1.15 + 14, padding: '4px 12px', borderRadius: 4, background: '#4f86ee', color: '#fff', fontFamily: SANS, fontSize: 22}}>自适应 {Math.round((x1 - x0) * 1.4)} × 自适应 {Math.round(hh * 3.1)}</div>);
    }
  }));
  // 输入光标
  const blink = last && s - last.tc > 0.25 ? (Math.floor(s * 2.2) % 2 === 0 ? 1 : 0) : 1;
  if (s >= 1.7 && blur < 3) els.push(<div key="caret" style={{position: 'absolute', left: sx(caretB) + F * 0.04, top: Y - F * 0.62, width: Math.max(2, F * 0.025), height: F * 1.24, background: '#222', opacity: blink}} />);
  // 名字光标：全部按原片逐帧轨迹走；轨迹结束时如果正好赶上镜头甩动，就钉在字上跟着一起甩走（带同样的拖影）
  TAGS.forEach((g, i) => {
    let p = tagAt(g, s), bl = 0;
    const tEnd = g.t0 + (g.p.length - 1) / 15;
    if (p) { const q = tagAt(g, Math.max(g.t0, s - 1 / 30)); if (q) bl = Math.min(10, Math.hypot(p[0] - q[0], p[1] - q[1]) * 0.12); }
    else if (s > tEnd) {
      const pan = PANS.find(([p0, p1]) => tEnd > p0 - 0.15 && tEnd < p1 && s < p1 + 0.02);
      if (pan) { const ce = camAt(tEnd), last = g.p[g.p.length - 1]; const bx = (last[0] + OX - ce.tx) / ce.scale + ce.ax, by = (last[1] - 540) / ce.scale; p = [sx(bx) - OX, 540 + by * cam.scale]; bl = blur; }
    }
    if (p) els.push(<NameTag key={'tg' + i} x={p[0] + OX} y={p[1]} who={g.w} blur={bl} />);
  });
  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, filter: blur > 0.5 ? `blur(${blur}px)` : undefined}}>{line}</div>
      {els}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(60,60,60,0.4)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(RICH_TEXT_CONTRACT).length) throw new Error(checkContract(RICH_TEXT_CONTRACT).join('；'));
export const RichTextCursorStyles: React.FC = () => <RichTextCursorStylesGroup />;
