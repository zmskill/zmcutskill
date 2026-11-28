// 【镜头组】word-slot-icon-zoom：「产品名 / 能帮你」→ 产品名淡掉，「能帮你」往左让 → 右边像老虎机一样一项项往上翻：图标 + 一个能做的事（下面一列暗字是还没轮到的）越翻越快 →
//   停在最后一项，前半句淡掉，最后一项的字从尾巴一个个删掉，只剩图标滑到正中、由线稿变实心，然后猛地放大铺满画面（040-I 单个镜头，功能枚举 + 转场）
// 学的动作（SkaleSolutions · Aside 62.95–66.60s，29.97fps；网格大图逐点量过，时间表 （内部拆片记录，未随项目提供））：
//   63.05–63.2 产品名淡；63.35–63.48 前半句右沿挪到 780；63.5 / 63.9 / 64.1 / 64.3 / 64.5 / 64.6 / 64.66 / 64.72 依次换到下一项（每次往上翻一格、0.06s）；
//   65.0 前半句淡；65.0–65.42 从尾巴删字；65.42–65.5 图标滑到中心；65.55–65.65 线稿 → 实心；边长 110 → 124 → 170（65.85）→ 650（66.1）→ 784（66.5）。
// 我们的内容：通用的"能帮你做的事"清单，产品名用虚构的 Nimbo。
//
// 拍表（源秒 = 原片秒 − 62.95，30fps，共 110 帧）
//   拍 1 产品名退 + 第一项     0.00–0.70   （停留点 0.75）
//   拍 2 一项项往上翻          0.80–1.85   （停留点 1.90）
//   拍 3 删字 + 图标放大       1.95–3.55   （停留点 3.60）
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有：换项越来越快（0.4s → 0.2s → 0.1s → 0.06s），不是匀速；最后图标放大前先变实心
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {BG, SANS, clamp, easeInOut, easeOut, mix, mk} from '../_kit/darkUiKit';

const FPS = 30;
const T0 = 62.95;

export const WORD_SLOT_ICON_ZOOM_CONTRACT: GroupContract = {
  sourceDuration: 3.65,
  fps: 30,
  motion: [[0, 0.7], [0.8, 1.85], [1.95, 3.55]],
  holds: [{at: 0.75, maxExtra: 1.0}, {at: 1.9, maxExtra: 1.0}, {at: 3.6, maxExtra: 0.8}],
  landmarks: {fade: 0.1, slide: 0.4, item1: 0.55, spin: 0.95, last: 1.77, del: 2.05, center: 2.5, fill: 2.62, zoom: 2.92},
  sfx: [
    {at: 'slide', type: '短甩', note: '横移 soft swish', volume: 0.25},
    {at: 'item1', type: '轻tick', note: '翻牌 tick', volume: 0.3},
    {at: 'spin', type: '轻tick', note: '翻牌 tick 连串（越来越快）', tail: 0.8, volume: 0.35},
    {at: 'del', type: '键盘', note: '退格 tick ×6', tail: 0.4, volume: 0.25},
    {at: 'zoom', type: '运镜', note: '放大 whoosh（重）', tail: 0.5, volume: 0.5},
  ],
  inputs: {brand: {maxChars: 7}, lead: {maxChars: 4}, items: {count: 8, maxChars: 5}},
};

export type WsizInputs = {brand: string; lead: string; items: [string, string, string, string, string, string, string, string]};
export const WSIZ_DEFAULT_INPUTS: WsizInputs = {
  brand: 'Nimbo', lead: '能帮你',
  items: ['登录网站', '收发消息', '用内部工具', '付款', '看视频', '写文档', '做表格', '做演示'],
};
export const checkWsizInputs = (x: WsizInputs) => checkInputs(WORD_SLOT_ICON_ZOOM_CONTRACT, x);
export const planWsiz = (sec: number) => planExtras(WORD_SLOT_ICON_ZOOM_CONTRACT, sec);
export const wsizFrames = (extras: number[]) => Math.round(outputDuration(WORD_SLOT_ICON_ZOOM_CONTRACT, extras) * FPS);
export const WORD_SLOT_ICON_ZOOM_DURATION = 110;

const FS = 132;
const ITEM_T = [63.5, 63.9, 64.1, 64.3, 64.5, 64.6, 64.66, 64.72];
const PITCH = 140;

/** 8 个线稿图标（白），最后一个"演示"另有实心版 */
const LineIcon: React.FC<{i: number; size: number; fill?: number}> = ({i, size, fill = 0}) => {
  const p = {fill: 'none', stroke: '#fff', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {i === 0 && (<g {...p}><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" /><path d="M3 12h11M10 8l4 4-4 4" /></g>)}
      {i === 1 && (<g {...p}><path d="M4 5h13a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3v-3H4z" /><path d="M21 9v8l-2-1.5" /></g>)}
      {i === 2 && (<g {...p}><rect x="3.5" y="8" width="17" height="12" rx="2.5" /><path d="M8 8V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V8M3.5 13h17" /></g>)}
      {i === 3 && (<g {...p}><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="M3 10h18M7 15h4" /></g>)}
      {i === 4 && (<g {...p}><rect x="3" y="6" width="13" height="12" rx="2.5" /><path d="M16 10.5l5-3v9l-5-3" /></g>)}
      {i === 5 && (<g {...p}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></g>)}
      {i === 6 && (<g {...p}><rect x="3.5" y="4" width="17" height="16" rx="2" /><path d="M3.5 9.5h17M3.5 15h17M10 4v16" /></g>)}
      {i === 7 && (
        <g>
          <g {...p} opacity={1 - fill}><path d="M3 5h12M4.5 5v10h7" /><path d="M9.5 3v2" /><circle cx="16.5" cy="13" r="2.4" /><path d="M12.5 21c0-2.6 1.8-4.2 4-4.2s4 1.6 4 4.2z" /></g>
          <g opacity={fill}>
            <rect x="3" y="4.6" width="13.6" height="12.6" rx="0.8" fill="#fff" />
            <rect x="2.1" y="3.9" width="15.4" height="1.9" rx="0.95" fill="#fff" />
            <rect x="2.1" y="16.3" width="6.5" height="1.9" rx="0.95" fill="#fff" />
            <circle cx="9.8" cy="3.4" r="1.15" fill="#fff" />
            <circle cx="16.8" cy="16.2" r="6.3" fill={BG} />
            <circle cx="16.8" cy="13.4" r="2.7" fill="#fff" />
            <path d="M11.6 21.3c0-2.9 2.3-4.9 5.2-4.9s5.2 2 5.2 4.9a1 1 0 0 1-1 1h-8.4a1 1 0 0 1-1-1z" fill="#fff" />
          </g>
        </g>
      )}
    </svg>
  );
};

export const WordSlotIconZoomGroup: React.FC<{inputs?: WsizInputs; extras?: number[]}> = ({inputs = WSIZ_DEFAULT_INPUTS, extras = [0, 0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, WORD_SLOT_ICON_ZOOM_CONTRACT, extras);
  const lag = t - s;
  const T = s + T0;
  const cam = 1 + 0.004 * lag;

  const leadW = [...inputs.lead].length * FS;
  const slide = easeInOut((T - 63.35) / 0.13);
  const leadL = mix(960 - leadW / 2, 780 - leadW, slide);
  const leadOp = 1 - clamp((T - 65.0) / 0.1);
  const brandOp = 1 - clamp((T - 63.05) / 0.15);

  // 当前项（含翻格的小数部分）
  let cur = 0;
  for (let i = 0; i < ITEM_T.length; i++) if (T >= ITEM_T[i]) cur = i;
  const roll = ITEM_T.reduce((acc, ti, i) => acc + (i > 0 ? easeOut((T - ti) / 0.06) : 0), 0); // 已翻过的格数（连续）
  const listOn = T >= 63.48 ? clamp((T - 63.48) / 0.08) : 0;

  // 删字 + 图标
  const items = inputs.items.map((x) => [...x]);
  const last = items[items.length - 1];
  const delN = Math.floor(clamp((T - 65.0) / 0.42) * (last.length + 0.999));
  const toCenter = easeInOut((T - 65.42) / 0.09);
  const fill = clamp((T - 65.55) / 0.1);
  const iconSz = T < 65.55 ? 110 : mk(T, [[65.55, 110], [65.65, 124], [65.85, 170], [66.1, 650], [66.5, 784], [66.6, 800]]);
  const iconCx = mix(863, 960, toCenter), iconCy = 550;

  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: '960px 540px'}}>
        {brandOp > 0 && (
          <div style={{position: 'absolute', left: 0, width: 1920, top: 440 - FS * 0.92, height: FS * 1.2, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: brandOp}}>
            <svg width={114} height={114} viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth={3.6} strokeLinecap="round" style={{marginRight: 46, marginTop: FS * 0.12}}><circle cx="24" cy="24" r="20" /><path d="M10 38 L38 10" /><path d="M24 14 C25 21 27 23 34 24 C27 25 25 27 24 34 C23 27 21 25 14 24 C21 23 23 21 24 14 Z" fill="#fff" stroke="none" /></svg>
            <span style={{fontSize: FS * 1.02, fontWeight: 600, color: '#f6f6f6', letterSpacing: -2}}>{inputs.brand}</span>
          </div>
        )}
        {leadOp > 0 && <div style={{position: 'absolute', left: leadL, top: 590 - FS * 0.92, fontSize: FS, fontWeight: 600, lineHeight: `${FS * 1.2}px`, color: '#f6f6f6', opacity: leadOp, whiteSpace: 'pre'}}>{inputs.lead}</div>}
        {/* 老虎机：当前项白，后面的暗 */}
        {listOn > 0 && T < 65.45 && (
          <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden', opacity: listOn}}>
            {items.map((it, i) => {
              const y = 590 + (i - roll) * PITCH;
              if (i < cur - 0 && y < 560) return null; // 翻过去的不再显示
              if (y > 1200) return null;
              const isCur = i === cur;
              const k = isCur ? clamp((T - ITEM_T[i]) / 0.05) : 0;
              const txt = i === items.length - 1 && T >= 65.0 ? it.slice(0, Math.max(0, it.length - delN)) : it;
              const g = Math.round(mix(54, 246, k));
              return (
                <div key={i} style={{position: 'absolute', left: 960, top: y - FS * 0.92, fontSize: FS, fontWeight: 600, lineHeight: `${FS * 1.2}px`, color: `rgb(${g},${g},${g})`, whiteSpace: 'pre'}}>{txt.join('')}</div>
              );
            })}
          </div>
        )}
        {/* 当前项的图标（换项时一起换） */}
        {listOn > 0 && (
          <div style={{position: 'absolute', left: iconCx - iconSz / 2, top: iconCy - iconSz / 2 + (1 - toCenter) * 0, opacity: listOn}}>
            <LineIcon i={T >= 65.0 ? 7 : cur} size={iconSz} fill={fill} />
          </div>
        )}
      </div>
      <Grain opacity={0.025} />
    </AbsoluteFill>
  );
};

if (checkContract(WORD_SLOT_ICON_ZOOM_CONTRACT).length) throw new Error(checkContract(WORD_SLOT_ICON_ZOOM_CONTRACT).join('；'));
export const WordSlotIconZoom: React.FC = () => <WordSlotIconZoomGroup />;
