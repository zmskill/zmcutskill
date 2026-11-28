// 【镜头组】smarter-card-board-tilt：白底超大渐变字"聪明多了"（字从上往下显出来、先放大再加速缩小）→ 一张空白卡片"砸"到画面上缩小，
//   四条边延长成参考线；卡片上方逐词出"终于，你能看清"，卡片里从左上往右下显出整页任务板 →
//   硬切放大的任务板（蓝色头部），表格一格一格填进来（新填的格子先是蓝字），镜头往上滚 →
//   硬切斜放的整页任务板，上面一句话逐词出、换一句，整页慢慢转、最后往左甩（018-C 一拍，产品登场 → 证据）
// 学的动作（HSAji · Tonomo 11.467–17.967s，30fps 逐帧量过；时间表 （内部拆片记录，未随项目提供））
// 我们的内容：「小周」全家任务板（零件在 demos-own/groups/_kit/familyBoard.tsx，018 一组共用）。
//
// 拍表（源秒 = 原片秒 − 11.467，30fps）
//   拍 1 大字        0.00–0.867   超大渐变字，从上往下显出，先放大再加速缩小（停留点 0.45）
//   拍 2 卡片        0.867–2.333  卡片缩小落定、参考线；逐词出一句；卡片里显出界面（停留点 2.00）
//   拍 3 放大界面    2.333–4.000  从右滑进、表格逐格填入（停留点 3.15）；往上滚、加速
//   拍 4 斜放整页    4.000–6.500  一句 → 换一句（停留点 5.00、5.85），整页慢转、最后往左甩
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染（斜放界面里的小字）；确定性
//   - 独有 1：卡片落定时四条边延长成贯穿画面的细白线，角上有小点
//   - 独有 2：表格不是一下出现，是一格一格填进来，新填的字先是蓝色
//   - 独有 3：斜放那段的字跟页面在同一个平面上（一起转）
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {COLS, ColKey, GlassFrame, HeroBg, HeroBoard, PageBoard, SANS} from '../_kit/familyBoard';

const FPS = 30;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const kf = (t: number, K: number[][]) => {
  const n = K.length;
  if (t <= K[0][0]) return K[0][1];
  if (t >= K[n - 1][0]) return K[n - 1][1];
  const d: number[] = [], m: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((K[i + 1][1] - K[i][1]) / (K[i + 1][0] - K[i][0]));
  m.push(d[0]);
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
  m.push(d[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b;
    if (h > 9) { const q = 3 / Math.sqrt(h); m[i] = q * a * d[i]; m[i + 1] = q * b * d[i]; }
  }
  let i = 0; while (t > K[i + 1][0]) i++;
  const h = K[i + 1][0] - K[i][0], u = (t - K[i][0]) / h, u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * K[i][1] + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * K[i + 1][1] + (u3 - u2) * h * m[i + 1];
};

// ═════════ 合同 ═════════
export const SMARTER_CARD_BOARD_TILT_CONTRACT: GroupContract = {
  sourceDuration: 6.5, // 原片 17.967 硬切
  fps: 30,
  motion: [[0, 0.4], [0.5, 1.95], [2.05, 3.1], [3.2, 4.95], [5.05, 5.8], [5.9, 6.5]],
  holds: [
    {at: 0.45, maxExtra: 1.0}, // 大字
    {at: 2.0, maxExtra: 1.2}, // 卡片 + 一句话
    {at: 3.15, maxExtra: 1.5}, // 表格填好
    {at: 5.0, maxExtra: 1.5}, // 斜放整页 + 第一句
    {at: 5.85, maxExtra: 1.2}, // 第二句
  ],
  landmarks: {word: 0, card: 0.867, line: 1.333, hero: 2.333, fill: 2.63, scroll: 3.25, tilt: 4.0, cap1: 4.08, cap2: 5.43, exit: 6.5},
  sfx: [
    {at: 'word', type: '上扬铺垫', note: '上扬 swell（大字）', tail: 0.8, volume: 0.35},
    {at: 'card', type: '轻落定', note: '低沉 thud（卡片落定）', tail: 0.4, volume: 0.45},
    {at: 'line', type: '轻tick', note: '轻 tick × 4（逐词）', volume: 0.25},
    {at: 'hero', type: '运镜', note: 'whoosh（滑进界面）', volume: 0.35},
    {at: 'fill', type: '键盘', note: '一串很轻的键盘 / tick（逐格填入）', tail: 1.0, volume: 0.25},
    {at: 'tilt', type: '运镜', note: '柔和 whoosh（斜放）', volume: 0.3},
  ],
  inputs: {word: {maxChars: 4}, line: {count: 4, maxChars: 3}, cap1: {maxChars: 9}, cap2: {maxChars: 9}},
};

export type SmarterInputs = {word: string; line: string[]; cap1: [string, string]; cap2: [string, string]};
// line：逐词出的四段，最后一段是蓝色；cap：[前半, 蓝色后半]
export const SMARTER_DEFAULT_INPUTS: SmarterInputs = {word: '聪明多了', line: ['终于，', '你', '能', '看清'], cap1: ['你的眼睛', '还是一样'], cap2: ['只是看得', '更清楚']};
export const checkSmarterInputs = (x: SmarterInputs) => checkInputs(SMARTER_CARD_BOARD_TILT_CONTRACT, {word: x.word, line: x.line, cap1: x.cap1.join(''), cap2: x.cap2.join('')});
export const planSmarter = (sec: number) => planExtras(SMARTER_CARD_BOARD_TILT_CONTRACT, sec);
export const smarterFrames = (extras: number[]) => Math.round(outputDuration(SMARTER_CARD_BOARD_TILT_CONTRACT, extras) * FPS);
export const SMARTER_CARD_BOARD_TILT_DURATION = 195;

// ═════════ 原片量的曲线 ═════════
const WORD_W = [[0, 1742], [0.033, 1831], [0.067, 1866], [0.1, 1925], [0.133, 1902], [0.167, 1872], [0.2, 1848], [0.233, 1828], [0.267, 1811], [0.3, 1796], [0.333, 1783], [0.367, 1771], [0.4, 1760], [0.433, 1749], [0.467, 1738], [0.5, 1726], [0.533, 1713], [0.567, 1696], [0.6, 1673], [0.633, 1644], [0.667, 1606], [0.7, 1557], [0.733, 1493], [0.767, 1406], [0.8, 1280], [0.833, 1090], [0.867, 860]];
const WORD_REVEAL = [[0, 0.62], [0.1, 0.75], [0.2, 0.86], [0.4, 1], [0.867, 1]]; // 字从上往下显出来（可见到字高的几成）
const CX0 = [[0.867, 235], [0.9, 264], [0.933, 290], [0.967, 312], [1.0, 332], [1.033, 348], [1.067, 361], [1.1, 372], [1.133, 381], [1.4, 420], [1.933, 440], [2.333, 428]];
const CX1 = [[0.867, 1684], [0.9, 1655], [0.933, 1629], [0.967, 1607], [1.0, 1587], [1.033, 1572], [1.067, 1558], [1.1, 1547], [1.133, 1538], [1.4, 1505], [1.933, 1495], [2.333, 1482]];
const CY0 = [[0.867, 140], [0.9, 156], [0.933, 171], [0.967, 183], [1.0, 194], [1.033, 202], [1.067, 210], [1.1, 216], [1.133, 220], [1.4, 234], [1.933, 242], [2.333, 244]];
const CY1 = [[0.867, 938], [0.9, 922], [0.933, 908], [0.967, 895], [1.0, 885], [1.033, 876], [1.067, 869], [1.1, 863], [1.133, 858], [1.4, 842], [1.933, 832], [2.333, 828]];
const HERO_X = [[2.333, 171], [2.4, 128], [2.467, 93], [2.533, 52], [2.6, 32], [2.667, 16], [2.8, 11], [2.933, 3], [3.133, 0]];
const HERO_SCROLL = [[3.2, 0], [3.267, 1], [3.333, 4], [3.4, 10], [3.467, 21], [3.533, 41], [3.6, 74], [3.667, 123], [3.733, 191], [3.8, 265], [3.867, 345], [3.933, 430], [4.0, 520]];
const PAGE_X = [[4.0, 961], [4.8, 958], [5.6, 940], [6.0, 885], [6.3, 805], [6.5, 730]];
const PAGE_RY = [[4.0, 1.5], [4.8, -3.5], [5.5, -9], [6.0, -13], [6.3, -17], [6.5, -20]];

export const SmarterCardBoardTiltGroup: React.FC<{inputs?: SmarterInputs; extras?: number[]}> = ({inputs = SMARTER_DEFAULT_INPUTS, extras = [0, 0, 0, 0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const C = SMARTER_CARD_BOARD_TILT_CONTRACT;
  const s = toSource(t, C, extras);
  const lag = t - s;
  const cam = 1 + 0.006 * lag;

  // ── 拍 1：大字 ──
  if (s < 0.867) {
    const n = Array.from(inputs.word).length;
    const fs = 1760 / n; // 0.4s 时整行宽 1760（原片）
    const sc = kf(s, WORD_W) / 1760;
    const rev = kf(s, WORD_REVEAL);
    return (
      <AbsoluteFill style={{background: '#fff', overflow: 'hidden', fontFamily: SANS}}>
        <div style={{position: 'absolute', left: 960, top: 540, transform: `translate(-50%,-50%) scale(${sc * cam})`, whiteSpace: 'nowrap', fontSize: fs, fontWeight: 700, lineHeight: 1,
          backgroundImage: 'linear-gradient(180deg, #2f8fdc 0%, #3aa2e6 40%, #7cc4f2 70%, rgba(200,232,252,0.6) 88%, rgba(255,255,255,0) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          WebkitMaskImage: `linear-gradient(180deg, #000 ${rev * 100 - 18}%, transparent ${rev * 100}%)`, maskImage: `linear-gradient(180deg, #000 ${rev * 100 - 18}%, transparent ${rev * 100}%)`}}>
          {inputs.word}
        </div>
      </AbsoluteFill>
    );
  }

  // ── 拍 2：卡片 + 参考线 + 逐词 ──
  if (s < 2.333) {
    const x0 = kf(s, CX0), x1 = kf(s, CX1), y0 = kf(s, CY0), y1 = kf(s, CY1);
    const w = x1 - x0, h = y1 - y0;
    const reveal = clamp((s - 1.0) / 0.95); // 界面从左上往右下显出
    const wash = Math.sin(Math.PI * clamp((s - 1.2) / 0.75)) * 0.75; // 原片 1.2s 卡片还是白的，1.5s 最蓝 // 显出时先罩一层蓝色渐变
    const lineAt = [1.3, 1.42, 1.48, 1.7];
    const gap = mix(26, 0, eo(s, 1.5, 2.0));
    const L = (k: number) => clamp((s - lineAt[k]) / 0.12);
    return (
      <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #eef0f3 0%, #e9edf3 30%, #cfe0f5 62%, #74aeee 85%, #3c8ce8 100%)'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 560px 760px at -40px 760px, rgba(25,115,235,0.9), rgba(25,115,235,0) 70%), radial-gradient(ellipse 600px 700px at 1990px 700px, rgba(25,115,235,0.8), rgba(25,115,235,0) 72%), radial-gradient(ellipse 700px 260px at 700px 1080px, rgba(20,95,215,0.75), rgba(20,95,215,0) 75%)'}} />
        <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`}}>
          {/* 参考线 + 角点 */}
          {[x0, x1].map((xx, i) => <div key={'v' + i} style={{position: 'absolute', left: xx - 0.75, top: 0, width: 1.5, height: 1080, background: 'rgba(255,255,255,0.75)'}} />)}
          {[y0, y1].map((yy, i) => <div key={'h' + i} style={{position: 'absolute', left: 0, top: yy - 0.75, width: 1920, height: 1.5, background: 'rgba(255,255,255,0.75)'}} />)}
          {/* 卡片 */}
          <div style={{position: 'absolute', left: x0, top: y0, width: w, height: h, background: '#fff', overflow: 'hidden', boxShadow: '0 20px 50px rgba(20,70,160,0.12)'}}>
            <div style={{position: 'absolute', left: 0, top: 0, width: 1600, height: 920, transform: `scale(${w / 1600}, ${h / 920})`, transformOrigin: '0 0',
              WebkitMaskImage: `linear-gradient(135deg, #000 ${reveal * 130 - 30}%, transparent ${reveal * 130}%)`, maskImage: `linear-gradient(135deg, #000 ${reveal * 130 - 30}%, transparent ${reveal * 130}%)`}}>
              <PageBoard empty />
            </div>
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(40,130,240,0.95) 0%, rgba(90,165,245,0.6) 45%, rgba(255,255,255,0) 85%)', opacity: wash}} />
          </div>
          {[[x0, y0], [x1, y0], [x0, y1], [x1, y1]].map(([a, b], i) => <div key={'d' + i} style={{position: 'absolute', left: a - 3.5, top: b - 3.5, width: 7, height: 7, borderRadius: 7, background: '#fff'}} />)}
          {/* 一句话：贴着卡片左上，逐词从右滑进，词间距收拢 */}
          <div style={{position: 'absolute', left: x0 + 10, top: y0 - 62, display: 'flex', alignItems: 'baseline', whiteSpace: 'nowrap', fontSize: 40, fontWeight: 600, color: '#13213f'}}>
            {inputs.line.map((wd, k) => (
              <span key={k} style={{display: 'inline-block', marginLeft: k ? gap : 0, opacity: L(k), transform: `translateX(${(1 - eo(s, lineAt[k], lineAt[k] + 0.25)) * 30}px)`, color: k === inputs.line.length - 1 ? '#2f74e0' : k === inputs.line.length - 2 ? '#2a5fb8' : undefined}}>{wd}</span>
            ))}
          </div>
        </div>
        <Grain opacity={0.03} blend="multiply" />
      </AbsoluteFill>
    );
  }

  // ── 拍 3：放大界面，逐格填入，往上滚 ──
  if (s < 4.0) {
    const shift = kf(s, HERO_X) - 10;
    const scroll = kf(s, HERO_SCROLL);
    const fill = (ri: number, k: ColKey) => {
      const ci = COLS.findIndex((c) => c.k === k);
      if (k === 'chk') return 1;
      const a = 2.633 + ri * 0.14 + (ci - 1) * 0.045;
      return clamp((s - a) / 0.18);
    };
    return (
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <HeroBg y={scroll} />
        <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`}}>
          <HeroBoard x={-shift} y={137 + scroll} fill={fill} showNew bodyScroll={1.4 * scroll} />
        </div>
        <Grain opacity={0.03} blend="multiply" />
      </AbsoluteFill>
    );
  }

  // ── 拍 4：斜放整页 + 两句话 ──
  const PW = 1600, PH = 920, K = 0.74; // 整页在画面里约 1218 宽（原片 15.47s）
  const cap = s < 5.43 ? inputs.cap1 : inputs.cap2;
  const capAt = s < 5.43 ? 4.08 : 5.43;
  const words = [...Array.from(cap[0]), '|', ...Array.from(cap[1])];
  const blueFade = eo(s, capAt + 0.35, capAt + 0.75); // 蓝色后半句慢慢变回深色
  const cx = kf(s, PAGE_X), ry = kf(s, PAGE_RY);
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #edf0f4 0%, #e3e9f2 32%, #b7d0f1 62%, #4d90ea 88%, #2f7fe6 100%)'}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 560px 760px at -60px 820px, rgba(25,115,235,0.85), rgba(25,115,235,0) 70%), radial-gradient(ellipse 560px 760px at 1980px 760px, rgba(25,115,235,0.8), rgba(25,115,235,0) 70%)'}} />
      <div style={{position: 'absolute', inset: 0, perspective: 2200, perspectiveOrigin: '960px 540px', transform: `scale(${cam})`}}>
        <div style={{position: 'absolute', left: cx - 960, top: 0, width: 1920, height: 1080, transformStyle: 'preserve-3d', transform: `translateZ(${kf(s, [[5.6, 0], [6.5, 170]])}px) rotateY(${ry}deg) rotateX(6deg)`, transformOrigin: '960px 560px', willChange: 'transform'}}>
          {/* 话和页面在同一个平面上 */}
          <div style={{position: 'absolute', left: 0, right: 0, top: 122, textAlign: 'center', fontSize: 42, fontWeight: 600, color: '#13213f', whiteSpace: 'nowrap'}}>
            {words.map((c, i) => {
              if (c === '|') return <span key={i} style={{display: 'inline-block', width: 12}} />;
              const blue = i > Array.from(cap[0]).length;
              const a = capAt + i * 0.035;
              return <span key={i} style={{display: 'inline-block', opacity: clamp((s - a) / 0.1), transform: `translateY(${(1 - eo(s, a, a + 0.25)) * 14}px)`, color: blue ? `rgb(${Math.round(mix(47, 19, blueFade))},${Math.round(mix(116, 33, blueFade))},${Math.round(mix(224, 63, blueFade))})` : undefined}}>{c}</span>;
            })}
          </div>
          <div style={{position: 'absolute', left: 960 - (PW * K) / 2 - 16, top: 232}}>
            <GlassFrame w={PW * K} h={PH * K} r={30} pad={16}>
              <div style={{transform: `scale(${K})`, transformOrigin: '0 0'}}><PageBoard /></div>
            </GlassFrame>
          </div>
        </div>
      </div>
      <Grain opacity={0.03} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(SMARTER_CARD_BOARD_TILT_CONTRACT).length) throw new Error(checkContract(SMARTER_CARD_BOARD_TILT_CONTRACT).join('；'));
export const SmarterCardBoardTilt: React.FC = () => <SmarterCardBoardTiltGroup />;
