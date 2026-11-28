// 【镜头组】form-card-build：白卡片在正中慢慢长大，里面的表单一样一样长出来：先是灰色占位，按钮从一个小圆点横着撑开成长条、出字 →
//   出发/到达的图标、日期和人数的下拉、标签页依次从虚到实冒出来；四周是一排排别的表单卡片（点阵按钮 + 很淡的字），排在往外鼓的面上、外侧往外斜（021-C 一拍，产品登场）
// 学的动作（mnowakdesign · Roamly 4.70–6.133s，30fps 逐帧量过；时间表 （内部拆片记录，未随项目提供））：
//   按钮宽 54 → 139 → 203 → 243 → 271 → 295 → 311 → 327 → 339 → 350 → 355（每 1/15 秒，720p），高 45 → 51；
//   卡片宽 333 → 420（0.9 秒）；之后整体慢推 1 → 1.06（接 021-D 的倾倒）；内容出现顺序：按钮字 0.13 → 出发图标 0.27 → 下拉 0.4 → 日期字逐字 0.53 → 第一个标签 0.67 → 第二个标签 0.8。
// 我们的内容：「小周」周末出行表单（开车 / 公交、出发、到达、日期、人数、规划行程）。
//
// 拍表（源秒 = 原片秒 − 4.70，30fps，共 43 帧）
//   拍 1 按钮撑开     0.00–0.60
//   拍 2 内容长出     0.13–0.95   （停留点 1.00）
//   拍 3 慢推         1.05–1.433  接下一镜
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有 1：一开始就有灰色占位，内容是"填进去"的，不是整张卡淡入
//   - 独有 2：每样东西都是先虚后实（带一点模糊），文字是逐字出
//   - 独有 3：卡片一直在慢慢往后仰（上窄下宽，宽度比 1 → 1.075），给下一镜的倾倒起势（2026-11-14 返工补量）
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const kfl = (t: number, K: number[][]) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], (t - K[i][0]) / (K[i + 1][0] - K[i][0])); return K[K.length - 1][1]; };

export const FORM_CARD_BUILD_CONTRACT: GroupContract = {
  sourceDuration: 43 / 30,
  fps: 30,
  motion: [[0, 0.95], [1.05, 43 / 30]],
  holds: [{at: 1.0, maxExtra: 1.5}],
  landmarks: {grow: 0, label: 0.13, icons: 0.27, fields: 0.4, date: 0.53, tabA: 0.67, tabB: 0.8, push: 1.05, exit: 43 / 30},
  sfx: [
    {at: 'grow', type: '短甩', note: '轻 swoosh（按钮撑开）', tail: 0.3, volume: 0.3},
    {at: 'icons', type: '弹出', note: '一串很轻的 pop（内容长出）', tail: 0.6, volume: 0.25},
    {at: 'date', type: '键盘', note: '打字 tick', tail: 0.2, volume: 0.2},
  ],
  inputs: {tabA: {maxChars: 3}, tabB: {maxChars: 3}, from: {maxChars: 3}, to: {maxChars: 3}, date: {maxChars: 7}, people: {maxChars: 3}, cta: {maxChars: 5}},
};

export type FormInputs = {tabA: string; tabB: string; from: string; to: string; date: string; people: string; cta: string};
export const FORM_DEFAULT_INPUTS: FormInputs = {tabA: '开车', tabB: '公交', from: '出发', to: '到达', date: '6月8日 周六', people: '2人', cta: '规划行程'};
export const checkFormInputs = (x: FormInputs) => checkInputs(FORM_CARD_BUILD_CONTRACT, {...x, date: x.date.replace(/\s/g, '')});
export const planForm = (sec: number) => planExtras(FORM_CARD_BUILD_CONTRACT, sec);
export const formFrames = (extras: number[]) => Math.round(outputDuration(FORM_CARD_BUILD_CONTRACT, extras) * FPS);
export const FORM_CARD_BUILD_DURATION = 43;

const BTN_W = [[0, 54], [0.067, 139], [0.133, 203], [0.2, 243], [0.267, 271], [0.333, 295], [0.4, 311], [0.467, 327], [0.533, 339], [0.6, 350], [0.733, 358], [0.9, 368]];
const CARD_W = [[0, 310], [0.2, 330], [0.4, 352], [0.6, 375], [0.9, 395]];
const PUSH = [[1.0, 1], [1.433, 1.06]];
// 四周是一排排别的表单卡片（只看得见它们的点阵按钮和很淡的字），排在一个往外鼓的面上：
// 上排整体往左走、往上收，下排往两边散开；外侧的按钮往外斜（上排外端往下、下排外端往上）。逐帧量（帧号, 中心 x, y, 宽, 高, 角度°）
const CHIP_TRACKS: number[][][] = [
  [[141, 44, 140, 30, 30, -2.8], [145, 41, 134, 84, 32, -2.8], [152, -60, 124, 200, 32, -2.8], [160, -140, 118, 260, 32, -2.8]],
  [[141, 370, 120, 36, 30, -1.2], [145, 347, 118, 167, 35, -1.4], [152, 292, 109, 241, 35, -1.9], [160, 212, 98, 262, 35, -2.4], [171, 127, 104, 285, 31, -2.7], [182, 4, 100, 290, 28, -2.3], [184, -20, 99, 290, 28, -2.3]],
  [[141, 746, 118, 36, 30, 0.9], [145, 725, 114, 175, 36, 0.9], [152, 684, 103, 259, 34, 0], [160, 629, 89, 291, 35, 0], [171, 550, 92, 289, 32, -0.6], [182, 463, 87, 291, 30, -1.0], [184, 447, 86, 291, 30, -1.0]],
  [[141, 1100, 130, 36, 30, 2.6], [145, 1088, 124, 153, 34, 2.6], [152, 1069, 112, 232, 35, 2.7], [160, 1049, 97, 267, 35, 2.2], [171, 992, 97, 273, 32, 1.8], [182, 933, 89, 283, 29, 1.5], [184, 922, 88, 283, 29, 1.5]],
  [[160, 1480, 100, 290, 32, 2.0], [171, 1405, 111, 290, 31, 2.0], [182, 1382, 104, 290, 29, 1.8], [184, 1378, 103, 290, 29, 1.8]],
  [[141, 265, 470, 36, 34, 1.5], [145, 256, 472, 168, 37, 1.5], [152, 230, 476, 249, 40, 1.3], [160, 184, 481, 286, 41, 1.0], [171, 147, 478, 296, 41, 0.9], [182, 108, 478, 296, 39, 0.8], [184, 101, 478, 296, 39, 0.8]],
  [[141, 1015, 470, 36, 34, -1.6], [145, 1023, 472, 167, 37, -1.6], [152, 1052, 476, 247, 39, -1.2], [160, 1093, 482, 288, 41, -0.9], [171, 1130, 479, 297, 41, -0.7], [182, 1170, 478, 297, 40, -1.1], [184, 1177, 478, 297, 40, -1.1]],
  // 下一排的卡片：按钮在画面外，只露出上面几行淡字
  [[141, 330, 900, 290, 40, 0], [184, 250, 905, 290, 40, 0]],
  [[141, 880, 900, 290, 40, 0], [184, 930, 905, 290, 40, 0]],
];
// 相对按钮中心的淡字 / 淡图标（照主卡片的版式：标签页、出发、到达、日期人数）
const GHOST: number[][] = [[-75, -271, 46, 9], [70, -271, 40, 9], [-118, -221, 14, 14], [-80, -224, 30, 6], [-118, -159, 14, 14], [-80, -164, 26, 6], [-120, -83, 14, 14], [-88, -80, 54, 8], [35, -83, 14, 14], [68, -80, 20, 8], [120, -83, 12, 7], [130, -190, 16, 14]];

const show = (s: number, t0: number, d = 0.12) => clamp((s - t0) / d);
const ink = (o: number): React.CSSProperties => ({opacity: o, filter: o < 0.98 ? `blur(${(1 - o) * 4}px)` : undefined});

// 卡片一直在慢慢往后仰（上窄下宽，为下一镜的倾倒起势）：逐帧量卡片在 y=250 / 450 两行的宽度比
const KEY_R = [[141, 1.0], [150, 1.017], [156, 1.033], [162, 1.048], [171, 1.061], [178, 1.074], [184, 1.075]];

export const FormCardBuildGroup: React.FC<{inputs?: FormInputs; extras?: number[]; noTilt?: boolean}> = ({inputs = FORM_DEFAULT_INPUTS, extras = [0], noTilt = false}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, FORM_CARD_BUILD_CONTRACT, extras);
  const lag = t - s;
  const bw = kfl(s, BTN_W), bh = mix(45, 51, clamp(s / 0.6));
  const cw = kfl(s, CARD_W), ch = 337;
  const z = kfl(s, PUSH) * (1 + 0.004 * lag);
  const keyR = kfl(141 + s * 30, KEY_R), keyK = (keyR - 1) / (85 + 115 * keyR);
  const dateChars = Array.from(inputs.date);
  const nDate = Math.floor(clamp((s - 0.5) / 0.3) * dateChars.length);
  const icon = (k: string, sz = 16, c = '#111') => {
    const p: Record<string, React.ReactNode> = {
      target: <><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2.5" fill={c} /></>,
      pin: <><path d="M12 21s-6-5.5-6-10a6 6 0 0 1 12 0c0 4.5-6 10-6 10z" fill={c} /><circle cx="12" cy="11" r="2.2" fill="#fff" /></>,
      swap: <path d="M8 4v15M4 8l4-4 4 4M16 20V5M12 16l4 4 4-4" />,
      cal: <><rect x="3" y="5" width="18" height="16" rx="2" fill={c} /><path d="M3 10h18" stroke="#fff" /><path d="M8 3v4M16 3v4" /></>,
      users: <><circle cx="9" cy="8" r="3.5" fill={c} /><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6z" fill={c} /><circle cx="17" cy="9" r="2.6" fill={c} /></>,
      car: <path d="M4 15l2-6h12l2 6v4H4zM7 19v2M17 19v2" fill={c} />,
      bus: <><rect x="5" y="4" width="14" height="14" rx="2" fill={c} /><path d="M5 11h14" stroke="#fff" /></>,
      down: <path d="M6 9l6 6 6-6" />,
      search: <><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></>,
    };
    return <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{display: 'block', flex: 'none'}}>{p[k]}</svg>;
  };
  const tabA = show(s, 0.67), tabB = show(s, 0.8), iconO = show(s, 0.27, 0.2), fieldO = show(s, 0.4, 0.15), toIcon = show(s, 0.67);
  const L = 640 - cw / 2, T = 365 - ch / 2, k = (cw - 333) / 87; // 卡片内部按宽度插值摆位

  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transform: 'scale(1.5)', transformOrigin: '0 0'}}>
        {/* 四周的卡片是逐帧量的画面坐标（已经含了推镜），放在推镜层外面 */}
        {/* 四周别的卡片：点阵按钮（逐帧量的位置、宽度、外斜角度）+ 很淡的字 */}
        {CHIP_TRACKS.map((tr, i) => {
          const n = 141 + s * 30;
          const [cx, cy, w, h, ang] = [1, 2, 3, 4, 5].map((j) => kfl(n, tr.map((r) => [r[0], r[j]])));
          const ghostO = 0.3 * clamp((s - 0.25) / 0.4);
          const gs = Math.max(w, 250) / 370; // 别的卡片比主卡片小一圈（按钮约 290 宽 vs 主卡 370）
          const dof = Math.abs(cx - 640) / 640; // 离中间越远越糊
          return (
            <div key={i} style={{position: 'absolute', left: cx, top: cy, transform: `rotate(${ang}deg)`}}>
              {cy < 720 && <div style={{position: 'absolute', left: -w / 2, top: -h / 2, width: w, height: h, borderRadius: Math.min(h / 2, 9), background: 'rgba(205,195,255,0.12)', backgroundImage: 'radial-gradient(rgba(132,108,255,0.62) 1.45px, transparent 1.85px)', backgroundSize: '4.2px 4.2px', filter: `blur(${0.5 + dof * 1.6}px)`, boxShadow: '0 0 12px rgba(170,150,255,0.18)'}} />}
              {cy < 720 && w > 150 && <div style={{position: 'absolute', left: -32, top: -4, width: 64, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.55)', filter: 'blur(1.5px)', opacity: clamp((w - 150) / 100)}} />}
              {ghostO > 0 && GHOST.map(([gx, gy, gw, gh], j) => <div key={j} style={{position: 'absolute', left: gx * gs - gw / 2, top: gy * gs - gh / 2, width: gw, height: gh, borderRadius: Math.min(gw, gh) / 2, background: j === 11 ? 'rgba(120,100,240,0.6)' : 'rgba(150,150,160,0.75)', opacity: ghostO, filter: 'blur(3.2px)'}} />)}
            </div>
          );
        })}
        <div style={{position: 'absolute', inset: 0, transformOrigin: '640px 365px', transform: noTilt ? undefined : `matrix3d(1,0,0,0,0,1,0,${-keyK},0,0,1,0,0,0,0,1)`}}>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '640px 365px'}}>
          {/* 卡片 */}
          <div style={{position: 'absolute', left: L, top: T, width: cw, height: ch, borderRadius: 22, background: '#fff', boxShadow: '0 0 0 1px rgba(225,220,255,0.7), 0 18px 40px rgba(110,90,220,0.13), 0 0 30px rgba(170,150,255,0.15)'}}>
            {/* 标签页：先是灰色占位条 */}
            <div style={{position: 'absolute', left: 18, right: 18, top: 12, height: 34, borderRadius: 17, background: '#f2f2f4'}} />
            <div style={{position: 'absolute', left: 22, top: 15, width: (cw - 44) / 2, height: 28, borderRadius: 14, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, fontSize: 16, fontWeight: 700, color: '#111', ...ink(tabA)}}>{icon('car', 21)}{inputs.tabA}</div>
            <div style={{position: 'absolute', left: 22 + (cw - 44) / 2, top: 15, width: (cw - 44) / 2, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, fontSize: 16, fontWeight: 700, color: '#111', ...ink(tabB)}}>{icon('bus', 20)}{inputs.tabB}</div>
            {/* 出发 / 到达 */}
            <div style={{position: 'absolute', left: 20, top: 63, width: 33, height: 33, borderRadius: 17, background: '#f3f3f5', display: 'flex', alignItems: 'center', justifyContent: 'center', ...ink(iconO)}}>{icon('target', 21)}</div>
            <div style={{position: 'absolute', left: 36, top: 103, width: 2, height: 16, backgroundImage: 'repeating-linear-gradient(180deg, #bbb 0 4px, transparent 4px 7px)', opacity: iconO}} />
            <div style={{position: 'absolute', left: 20, top: 125, width: 33, height: 33, borderRadius: 17, background: '#f3f3f5', display: 'flex', alignItems: 'center', justifyContent: 'center', ...ink(toIcon)}}>{icon('pin', 21)}</div>
            <div style={{position: 'absolute', left: 77, top: 70, fontSize: 12, color: '#888'}}>{inputs.from}</div>
            <div style={{position: 'absolute', left: 77, top: 118, right: 80, height: 1, background: '#eee'}} />
            <div style={{position: 'absolute', left: 77, top: 140, fontSize: 12, color: '#888'}}>{inputs.to}</div>
            <div style={{position: 'absolute', right: 20, top: 97, width: 40, height: 36, borderRadius: 12, background: '#f4f4f7', display: 'flex', alignItems: 'center', justifyContent: 'center', ...ink(show(s, 0.4))}}>{icon('swap', 18, '#1a10e0')}</div>
            {/* 日期 / 人数 */}
            {[0, 1].map((j) => (
              <div key={j} style={{position: 'absolute', left: j === 0 ? 14 : cw / 2 + 4, top: 192, width: cw / 2 - 18, height: 50, borderRadius: 12, border: '1px solid #f0f0f2', boxShadow: '0 1px 4px rgba(0,0,0,0.03)'}}>
                <div style={{position: 'absolute', left: 12, top: 15, ...ink(fieldO)}}>{icon(j === 0 ? 'cal' : 'users', 22)}</div>
                <div style={{position: 'absolute', left: 42, top: 8, fontSize: 11, color: '#888', ...ink(fieldO)}}>{j === 0 ? '日期' : '人数'}</div>
                <div style={{position: 'absolute', left: 42, top: 23, fontSize: 16, fontWeight: 700, color: '#111', whiteSpace: 'nowrap'}}>{j === 0 ? dateChars.slice(0, nDate).join('') : <span style={ink(fieldO)}>{inputs.people}</span>}</div>
                <div style={{position: 'absolute', right: 10, top: 15, ...ink(fieldO)}}>{icon('down', 18)}</div>
              </div>
            ))}
            {/* 按钮：从小圆点横着撑开 */}
            <div style={{position: 'absolute', left: cw / 2 - bw / 2, top: 268 + (51 - bh) / 2, width: bw, height: bh, borderRadius: bh / 2, background: '#1200ee', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#fff', fontSize: 16.5, overflow: 'hidden', whiteSpace: 'nowrap'}}>
              <span style={ink(show(s, 0.13, 0.25))}>{inputs.cta}</span><span style={ink(show(s, 0.4, 0.2))}>{icon('search', 18, '#fff')}</span>
            </div>
          </div>
          {k < 0 && null}
        </div>
        </div>
      </div>
      <Grain opacity={0.02} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(FORM_CARD_BUILD_CONTRACT).length) throw new Error(checkContract(FORM_CARD_BUILD_CONTRACT).join('；'));
export const FormCardBuild: React.FC = () => <FormCardBuildGroup />;
