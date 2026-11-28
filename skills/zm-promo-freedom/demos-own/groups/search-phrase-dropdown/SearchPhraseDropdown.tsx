// 【镜头组】search-phrase-dropdown：白底，一个历史记录图标转一下 → 后面逐词冒出「在 浏览 记录里 找」（新词先青后黑，整行一直居中）→
//   逐词退成浅灰消失 → 灰蓝色「信用卡 ⌄」淡入 → 箭头转成「›」、再折成一个直角、变成「⌃」，同时标题往左、箭头往右拉开成一条下拉栏 →
//   整条往上走，下面一行行露出搜到的三条记录（040-E 单个镜头，功能演示：从"在找什么"到"找到了"）
// 学的动作（SkaleSolutions · Aside 31.70–34.95s，29.97fps；网格大图逐点量过，时间表 （内部拆片记录，未随项目提供））：
//   31.75 图标出现（中心 536,535，约 85px）；31.8 / 31.9 / 32.0 / 32.2 逐词出，整行居中（基线 570，字高 82）；32.9–33.1 逐词退；
//   33.2 标题 + ⌄ 淡入（左 576，基线 590）；34.05–34.38 箭头 ⌄ → › → ┐ → ⌃，标题 524 → 276 → 196、箭头 1380 → 1600 → 1686；
//   34.45–34.85 整条上移到基线 260，三行记录（基线 530 / 640 / 756）依次显出。
// 我们的内容：通用的"在浏览记录里找银行卡"（银行名「北辰银行」和网址 bank.example 都是虚构的，画面上备注了「均为虚构 · 仅作演示」）。
//
// 拍表（源秒 = 原片秒 − 31.70，30fps，共 99 帧）
//   拍 1 图标 + 逐词      0.00–0.85   （停留点 0.90）
//   拍 2 退场 + 标题出    0.95–1.85   （停留点 1.90）
//   拍 3 下拉展开         1.95–3.20   （停留点 3.25）
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有：箭头不是直接翻转，是 ⌄ → › → 直角 → ⌃ 一路折过去，同时和标题往两边拉开
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {SANS, clamp, easeInOut, easeOut, mix, mk} from '../_kit/darkUiKit';

const FPS = 30;
const T0 = 31.7;

export const SEARCH_PHRASE_DROPDOWN_CONTRACT: GroupContract = {
  sourceDuration: 3.3,
  fps: 30,
  motion: [[0, 0.85], [0.95, 1.85], [1.95, 3.2]],
  holds: [{at: 0.9, maxExtra: 1.0}, {at: 1.9, maxExtra: 1.0}, {at: 3.25, maxExtra: 1.5}],
  landmarks: {icon: 0.05, words: 0.1, fade: 1.2, title: 1.5, morph: 2.35, open: 2.75},
  sfx: [
    {at: 'icon', type: '轻tick', note: '轻 tick', volume: 0.25},
    {at: 'words', type: '轻tick', note: '逐词 soft tick ×4', tail: 0.4, volume: 0.25},
    {at: 'title', type: '上扬铺垫', note: '淡入 soft swell', volume: 0.2},
    {at: 'morph', type: '点击', note: '展开 click', volume: 0.35},
    {at: 'open', type: '短甩', note: '列表 swish', tail: 0.3, volume: 0.25},
  ],
  inputs: {words: {count: 4, maxChars: 4}, title: {maxChars: 5}, rows: {count: 3, maxChars: 26}},
};

export type SpdRow = {name: string; note: string; right: string};
export type SpdInputs = {words: [string, string, string, string]; title: string; rows: [SpdRow, SpdRow, SpdRow]; disclaimer?: string}; // disclaimer：记录下面的小字备注（银行名 / 网址是虚构的要写明，空字符串 = 不显示）
export const SPD_DEFAULT_INPUTS: SpdInputs = {
  words: ['在', '浏览', '记录里', '找'], title: '信用卡',
  rows: [
    {name: '卡片概览 | 北辰银行', note: 'bank.example', right: '3 天前'},
    {name: '记忆.md', note: '用户的开户行和信用卡都在北辰银行', right: '8 天前'},
    {name: '我的北辰卡', note: '通行密钥', right: '密码'},
  ],
  disclaimer: '北辰银行、bank.example 均为虚构 · 仅作演示',
};
export const checkSpdInputs = (x: SpdInputs) => checkInputs(SEARCH_PHRASE_DROPDOWN_CONTRACT, {words: x.words, title: x.title, rows: x.rows.map((r) => r.name + r.note)});
export const planSpd = (sec: number) => planExtras(SEARCH_PHRASE_DROPDOWN_CONTRACT, sec);
export const spdFrames = (extras: number[]) => Math.round(outputDuration(SEARCH_PHRASE_DROPDOWN_CONTRACT, extras) * FPS);
export const SEARCH_PHRASE_DROPDOWN_DURATION = 99;

const FS = 112; // 第一句字号
const TS = 120; // 标题字号

const HistoryIcon: React.FC<{size: number; color: string; spin: number}> = ({size, color, spin}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12a8 8 0 1 0 2.4-5.7" /><path d="M4 4v4h4" />
    <g transform={`rotate(${spin} 12 12)`}><path d="M12 8v4.5l3 2" /></g>
  </svg>
);
const RowIcon: React.FC<{i: number}> = ({i}) => (
  <svg width={46} height={46} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    {i === 0 && (<><rect x="3" y="3" width="18" height="18" rx="5" fill="#1f6fd1" /><path d="M7 12h10M12 7v10" stroke="#fff" strokeWidth={2.4} /></>)}
    {i === 1 && (<><rect x="2.5" y="5" width="19" height="14" rx="3" fill="#6b6f75" /><path d="M6 15V9l2 2.5L10 9v6M14 9v6m0 0l-1.5-1.8M14 15l1.5-1.8" stroke="#fff" strokeWidth={1.5} /></>)}
    {i === 2 && (<g stroke="#5c6066" strokeWidth={1.8}><circle cx="15" cy="9" r="5" /><path d="M11.3 12.7L4 20m2.5-2.5l2 2M9 15l2 2" /></g>)}
  </svg>
);
/** 箭头：k ∈ [0,1] 依次 ⌄ → › → ┐ → ⌃（两段线，绕中心转 + 张角变化） */
const Chevron: React.FC<{x: number; y: number; k: number; color: string; size?: number}> = ({x, y, k, color, size = 100}) => {
  // 角度：⌄ 指下 90° → › 指右 0° → ┐ 直角（−45° 方向、张角 90°）→ ⌃ 指上 −90°
  const dir = k < 0.33 ? mix(90, 0, k / 0.33) : k < 0.66 ? mix(0, -45, (k - 0.33) / 0.33) : mix(-45, -90, (k - 0.66) / 0.34);
  const open = k < 0.33 ? 92 : k < 0.66 ? mix(92, 90, (k - 0.33) / 0.33) : mix(90, 92, (k - 0.66) / 0.34);
  const L = size * 0.42;
  const a1 = ((dir + 180 - open / 2) * Math.PI) / 180, a2 = ((dir + 180 + open / 2) * Math.PI) / 180;
  // 直角那一下两条边不等长（原片 ┐ 是一长一短）
  const l2 = k > 0.4 && k < 0.8 ? L * 1.25 : L;
  return (
    <svg style={{position: 'absolute', left: x - size, top: y - size}} width={size * 2} height={size * 2} viewBox={`${-size} ${-size} ${size * 2} ${size * 2}`}>
      <path d={`M ${L * Math.cos(a1)} ${L * Math.sin(a1)} L 0 0 L ${l2 * Math.cos(a2)} ${l2 * Math.sin(a2)}`} stroke={color} strokeWidth={size * 0.075} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const SearchPhraseDropdownGroup: React.FC<{inputs?: SpdInputs; extras?: number[]}> = ({inputs = SPD_DEFAULT_INPUTS, extras = [0, 0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, SEARCH_PHRASE_DROPDOWN_CONTRACT, extras);
  const lag = t - s;
  const T = s + T0;
  const cam = 1 + 0.004 * lag;

  // ── 第一句：图标 + 逐词，整行居中 ──
  const wordT = [31.76, 31.87, 31.98, 32.18];
  const iconW = 104, gap = 22, sp = 22;
  const widths = inputs.words.map((w) => [...w].length * FS);
  const shownW = (tt: number) => widths.reduce((acc, w, i) => acc + (tt >= wordT[i] ? (w + sp) * easeOut((tt - wordT[i]) / 0.12) : 0), 0);
  const lineW = iconW + gap + shownW(T);
  const x0 = 960 - lineW / 2;
  let phrase: React.ReactNode = null;
  if (T >= 31.75 && T < 33.12) {
    let cx = x0 + iconW + gap;
    phrase = (
      <>
        <div style={{position: 'absolute', left: x0, top: 570 - 86, opacity: clamp((T - 31.75) / 0.06) * (1 - clamp((T - 32.9) / 0.1))}}>
          <HistoryIcon size={iconW} color={`rgba(17,17,17,${1 - 0.8 * clamp((T - 32.9) / 0.1)})`} spin={-360 * easeOut((T - 31.75) / 0.4)} />
        </div>
        {inputs.words.map((w, i) => {
          if (T < wordT[i]) return null;
          const u = T - wordT[i];
          const k = clamp((u - 0.05) / 0.2);
          const fade = clamp((T - 32.92 - i * 0.04) / 0.12);
          const g = mix(17, 220, fade);
          const col = fade > 0 ? `rgba(${g},${g},${g},${1 - clamp((fade - 0.7) / 0.3)})` : `rgb(${mix(79, 17, k)},${mix(170, 17, k)},${mix(205, 17, k)})`;
          const left = cx; cx += (widths[i] + sp) * easeOut(u / 0.12);
          return <div key={i} style={{position: 'absolute', left, top: 570 - FS * 0.92, fontSize: FS, fontWeight: 600, lineHeight: `${FS * 1.2}px`, color: col, opacity: clamp(u / 0.06), whiteSpace: 'pre'}}>{w}</div>;
        })}
      </>
    );
  }

  // ── 标题 + 箭头 → 下拉 ──
  let drop: React.ReactNode = null;
  if (T >= 33.18) {
    const ap = clamp((T - 33.18) / 0.2);
    const morph = clamp((T - 34.05) / 0.33);
    const spread = easeInOut((T - 34.12) / 0.26);
    const up = easeInOut((T - 34.45) / 0.4);
    const tw = [...inputs.title].length * TS;
    const tx = mix(mix(576, 524, clamp((T - 33.4) / 0.6)), 196, spread) - (T > 34.4 ? 12 * clamp((T - 34.4) / 0.2) : 0);
    const base = mix(590, 260, up);
    const chevX = mix(tx + tw + 110, 1686, spread);
    const darkK = clamp((T - 34.0) / 0.35);
    const g0 = [138, 163, 179], g1 = [17, 17, 17];
    const col = `rgb(${mix(g0[0], g1[0], darkK)},${mix(g0[1], g1[1], darkK)},${mix(g0[2], g1[2], darkK)})`;
    drop = (
      <>
        {T > 34.5 && <div style={{position: 'absolute', left: 108, top: base - 56, width: 16, height: 16, borderRadius: 8, background: '#1f86d1', opacity: clamp((T - 34.5) / 0.1), boxShadow: '0 0 0 4px rgba(31,134,209,0.15)'}} />}
        <div style={{position: 'absolute', left: tx, top: base - TS * 0.92, fontSize: TS, fontWeight: 600, lineHeight: `${TS * 1.2}px`, color: col, opacity: ap, whiteSpace: 'pre'}}>{inputs.title}</div>
        <div style={{opacity: ap}}><Chevron x={chevX} y={base - 44} k={morph} color={col} /></div>
        {inputs.rows.map((r, i) => {
          const u = clamp((T - 34.62 - i * 0.07) / 0.18);
          if (u <= 0) return null;
          const y = [530, 640, 756][i] + (base - 260);
          return (
            <div key={i} style={{opacity: u}}>
              <div style={{position: 'absolute', left: 168, top: y - 38}}><RowIcon i={i} /></div>
              <div style={{position: 'absolute', left: 236, top: y - 46, fontSize: 46, lineHeight: '56px', color: '#141414', whiteSpace: 'pre'}}>{r.name} <span style={{color: '#9a9ea3'}}>{r.note}</span></div>
              <div style={{position: 'absolute', right: 1920 - 1734, top: y - 46, fontSize: 46, lineHeight: '56px', color: '#141414'}}>{r.right}</div>
            </div>
          );
        })}
        {(() => {
          // 2026-11-17 用户：虚构的银行名 / 网址要备注，别像在给真机构打广告 → 三行记录出完后，下面淡入一行小灰字
          const note = inputs.disclaimer ?? SPD_DEFAULT_INPUTS.disclaimer;
          const nk = easeOut((T - 34.8) / 0.15); // 跟着第三行一起出（这一镜 35.0 就结束，停留点会把它拉长）
          if (!note || nk <= 0) return null;
          return <div style={{position: 'absolute', left: 168, top: 836 + (base - 260) + 10 * (1 - nk), fontSize: 30, fontWeight: 500, color: '#a3a6ab', letterSpacing: 1, opacity: nk, whiteSpace: 'pre'}}>{note}</div>;
        })()}
      </>
    );
  }

  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: '960px 540px'}}>
        {phrase}
        {drop}
      </div>
      <Grain opacity={0.015} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(SEARCH_PHRASE_DROPDOWN_CONTRACT).length) throw new Error(checkContract(SEARCH_PHRASE_DROPDOWN_CONTRACT).join('；'));
export const SearchPhraseDropdown: React.FC = () => <SearchPhraseDropdownGroup />;
