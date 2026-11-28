// 【镜头组】folder-drop-chat：接上一拍拖着的玻璃文件夹——硬切米色底，聊天面板从右边滑进来接住它；边拖边打字（紫色），
//   文件夹缩小、"啪"地一下变成输入框里的小文件块（输入框闪一下粉紫），接着飞快打完需求，光标去点发送（039-C 一拍，功能演示）
// 学的动作（MdMizanurRahman · NotebookLM 15.27–18.2s，30fps 逐帧量过）：
//   15.27 硬切米色底（淡横线），下面还是那条程序坞（继续往左、往下沉）；面板从右上 0.6s 滑到位（横幅左沿 1700→320px，之后慢漂到 300）
//   文件夹一直停在画面中间偏左（≈950,505），面板从它底下滑过；边滑边打第一句（紫色，约 23 字/秒）
//   16.5–16.85 文件夹从 210 缩到 97px、摆正，16.85 变成行内小文件块；输入框底色 16.75 起变粉，16.9 最浓，17.25 退回白
//   普通字 16.75 变黑，关键词和第二句 17.25 变黑；第二句 16.78–17.17 飞快打完，第三句 17.2–17.5 换行黑字
//   17.3–17.7 光标滑到发送键，17.75 按下，17.95 发送键外圈亮一圈深色描边
// 我们的内容：横幅/建议/型号全中文；主角产品是坞里第 4 个图标「千问」（原片是坞里的 NotebookLM），下一拍出它的 Logo。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {INK, PURPLE, SANS, back, clamp, eo, kf, mix, rs} from '../_kit/softAiKit';
import {BlueFolder, DockTile, GlassFolder, GradCursor} from '../folder-type-dock/FolderTypeDock';

const FPS = 30;
const S0 = 15.27;
export const FOLDER_DROP_CHAT_CONTRACT: GroupContract = {
  sourceDuration: 88 / 30,
  fps: 30,
  motion: [[0, 2.22], [2.28, 88 / 30]],
  holds: [{at: 2.25, maxExtra: 1.5}],
  landmarks: {cut: 0, panel: 0.03, type: 0.08, drop: 1.58, type2: 1.51, type3: 1.93, press: 2.48, ring: 2.68},
  sfx: [
    {at: 'cut', type: '短甩', note: '硬切 swish', volume: 0.35},
    {at: 'type', type: '键盘', note: '一串打字', tail: 1.2, volume: 0.3},
    {at: 'drop', type: '轻落定', note: '放下 pop', volume: 0.45},
    {at: 'type2', type: '键盘', note: '快速打字', tail: 0.7, volume: 0.3},
    {at: 'press', type: '轻tick', note: '点击 tick', volume: 0.45},
  ],
  inputs: {seg1: {maxChars: 12}, seg2: {maxChars: 12}, seg3: {maxChars: 12}},
};
export type DropInputs = {seg1: string; hot: string; seg2: string; seg3: string; banner: string; tip: string; model: string; dock: string[]};
export const DROP_DEFAULT_INPUTS: DropInputs = {
  seg1: '这是我的资料文件夹。', hot: '资料文件夹', seg2: '帮我做一份演示文稿。', seg3: '交给千问来整理。',
  banner: '笔记功能升级了：试试让它分析你的数据、生成图表。', tip: '帮我理清一个问题', model: '快速',
  dock: ['deepseek', 'kimi', 'doubao', 'qianwen', 'yuanbao', 'wenxin'],
};
export const checkDropInputs = (x: DropInputs) => checkInputs(FOLDER_DROP_CHAT_CONTRACT, {seg1: x.seg1, seg2: x.seg2, seg3: x.seg3});
export const planDrop = (sec: number) => planExtras(FOLDER_DROP_CHAT_CONTRACT, sec);
export const dropFrames = (extras: number[]) => Math.round(outputDuration(FOLDER_DROP_CHAT_CONTRACT, extras) * FPS);
export const FOLDER_DROP_CHAT_DURATION = 88;

const BG = '#f0ebe7';
const lin = (u: number) => u;
const colAt = (s: number, at: number) => { const k = rs(s, at, 0.12, lin); return `rgb(${Math.round(mix(169, 42, k))},${Math.round(mix(75, 40, k))},${Math.round(mix(232, 48, k))})`; };

export const FolderDropChatGroup: React.FC<{inputs?: DropInputs; extras?: number[]}> = ({inputs: x = DROP_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, FOLDER_DROP_CHAT_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  // 面板（以横幅左上角为基准）
  const BL = kf(s, [[15.27, 1700], [15.3, 1640], [15.4, 1073], [15.5, 780], [15.6, 611], [15.7, 500], [15.9, 360], [16.1, 320], [18.2, 300]]) - held * 3;
  const BT = kf(s, [[15.27, 120], [15.3, 150], [15.4, 302], [15.5, 340], [15.6, 335], [15.7, 350], [16.1, 313], [18.2, 300]]);
  const BW = 1456;
  // 程序坞
  const dockL = kf(s, [[15.27, -200], [15.3, -230], [15.5, -524], [15.7, -604], [15.9, -636], [16.1, -664], [18.2, -700]]) - held * 3;
  const tileTop = kf(s, [[15.3, 880], [15.5, 920], [15.7, 960], [16.1, 1000], [18.2, 1020]]);
  const TILE = 208, GAP = 32;
  // 文件夹
  const DROP = 16.85;
  const fx = kf(s, [[15.27, 830], [15.4, 865], [15.6, 910], [16.0, 950], [16.3, 980], [16.5, 960], [16.7, 980], [DROP, 965]]);
  const fy = kf(s, [[15.27, 420], [15.4, 475], [15.6, 508], [16.0, 508], [16.3, 500], [16.7, 520], [DROP, 492]]);
  const fw = kf(s, [[15.27, 240], [16.0, 210], [16.5, 180], [16.75, 140], [DROP, 97]]);
  const frot = kf(s, [[15.27, -15], [16.0, -10], [16.7, -4], [DROP, 0]]);
  // 打字
  const S1 = Array.from(x.seg1), S2 = Array.from(x.seg2), S3 = Array.from(x.seg3);
  const n1 = Math.floor(kf(s, [[15.33, 0], [15.4, 0.11], [15.6, 0.25], [16.0, 0.75], [16.1, 0.86], [16.3, 0.96], [16.45, 1]]) * S1.length + 0.001);
  const n2 = Math.floor(clamp((s - 16.78) / 0.39) * S2.length + 0.001);
  const n3 = Math.floor(clamp((s - 17.2) / 0.3) * S3.length + 0.001);
  const hs = x.seg1.indexOf(x.hot);
  const caretOn = Math.floor(s * 3) % 2 === 0 || s < 17.55;
  // 输入框闪粉
  const pinkK = kf(s, [[16.72, 0], [16.8, 0.35], [16.9, 1], [17.0, 0.15], [17.25, 0]]);
  const pinkMix = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(mix(v, b[i], k))).join(',')})`;
  const inputBg = pinkMix([255, 255, 255], [236, 198, 244], clamp(pinkK));
  // 光标
  const cur = s < DROP ? {x: fx + 10, y: fy + 30} : {
    x: kf(s, [[DROP, 975], [17.1, 985], [17.3, 1140], [17.5, 1600], [17.7, BL + 1372], [18.02, BL + 1378], [18.2, BL + 1410]]),
    y: kf(s, [[DROP, 560], [17.1, 575], [17.3, 660], [17.5, 700], [17.7, BT + 366], [18.02, BT + 370], [18.2, BT + 420]]),
  };
  const press = s > 17.75 && s < 17.86 ? 1 : 0;
  const ring = rs(s, 17.92, 0.08, lin);
  const chipPop = rs(s, DROP, 0.14, (u) => back(u, 2.2));
  const FS = 46;
  const line1Y = BT + 188, line2Y = BT + 259;
  return (
    <AbsoluteFill style={{background: BG, fontFamily: SANS, overflow: 'hidden'}}>
      {/* 淡横线 */}
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(180deg, rgba(120,100,90,0) 0 83px, rgba(120,100,90,0.05) 83px 84px)'}} />
      {/* 程序坞 */}
      <div style={{position: 'absolute', left: dockL, top: tileTop - 32, height: TILE + 104, borderRadius: 110, border: '3px solid rgba(232,206,240,0.8)', display: 'flex', alignItems: 'flex-start', gap: GAP, padding: '32px 40px', boxSizing: 'border-box'}}>
        {x.dock.map((k, i) => <div key={k} style={{position: 'relative'}}><DockTile k={k} size={TILE} />{i === 2 && <div style={{position: 'absolute', left: TILE / 2 - 9, top: TILE + 14, width: 18, height: 18, borderRadius: 9, background: '#7a62d8'}} />}</div>)}
        <div style={{width: 3, height: TILE, background: '#eadcf6', margin: '0 10px'}} />
        <div style={{marginTop: 30}}><BlueFolder w={190} /></div>
      </div>
      {/* 「音效」文件夹往左出画 */}
      <div style={{position: 'absolute', left: kf(s, [[15.27, 860], [15.4, 665], [15.6, 490], [15.9, 50], [16.1, -300]]) - 100, top: kf(s, [[15.27, 60], [15.4, 97], [15.6, 120]])}}><BlueFolder w={200} label="音效" /></div>
      {/* 面板外壳 */}
      <div style={{position: 'absolute', left: BL - 76, top: BT - 420, width: BW + 153, height: 420 + 465 + 75, borderRadius: 36, background: '#f9f9fa', boxShadow: '0 8px 30px rgba(90,70,60,0.08), 0 0 0 1px rgba(0,0,0,0.03)'}} />
      {/* 建议气泡 */}
      <div style={{position: 'absolute', left: BL + 47, top: BT - 237, height: 140, borderRadius: 70, background: '#eff1f7', display: 'flex', alignItems: 'center', padding: '0 58px 0 44px', fontSize: 56, color: '#3a3940', gap: 22}}>
        <svg width={58} height={58} viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" fill="none" stroke="#5b7fe0" strokeWidth="1.7" strokeLinejoin="round" /><path d="M19 2.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" fill="#5b7fe0" /></svg>
        {x.tip}
      </div>
      {/* 深色横幅 */}
      <div style={{position: 'absolute', left: BL, top: BT, width: BW, height: 120, borderRadius: '26px 26px 0 0', background: '#3b3e44', color: '#fff', fontSize: 27, display: 'flex', alignItems: 'flex-start', padding: '28px 36px 0 36px', boxSizing: 'border-box', justifyContent: 'space-between'}}>
        <span>{x.banner}</span><span style={{fontSize: 30, lineHeight: 1}}>✕</span>
      </div>
      {/* 输入框 */}
      <div style={{position: 'absolute', left: BL, top: BT + 87, width: BW, height: 378, borderRadius: 26, background: inputBg, border: '2px solid #e2e2e6', boxSizing: 'border-box', boxShadow: '0 2px 6px rgba(0,0,0,0.04)'}} />
      {/* 文字 */}
      <div style={{position: 'absolute', left: BL + 86, top: line1Y - FS * 0.7, height: FS * 1.4, display: 'flex', alignItems: 'center', fontSize: FS, whiteSpace: 'nowrap'}}>
        {S1.slice(0, n1).map((c, i) => <span key={i} style={{color: colAt(s, hs >= 0 && i >= hs && i < hs + x.hot.length ? 17.25 : 16.75)}}>{c}</span>)}
        {s >= DROP && (
          <div style={{width: 97, height: 97, margin: '0 26px', borderRadius: 14, background: '#fff', boxShadow: '0 2px 8px rgba(80,60,120,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${chipPop})`, flex: 'none'}}>
            <GlassFolder w={64} fan={0.4} />
          </div>
        )}
        {S2.slice(0, n2).map((c, i) => <span key={i} style={{color: colAt(s, 17.25)}}>{c}</span>)}
        {n3 === 0 && caretOn && s < 17.2 && <span style={{width: 3, height: FS * 1.1, background: INK, marginLeft: 3}} />}
      </div>
      <div style={{position: 'absolute', left: BL + 86, top: line2Y - FS * 0.7, height: FS * 1.4, display: 'flex', alignItems: 'center', fontSize: FS, whiteSpace: 'nowrap', color: INK}}>
        {S3.slice(0, n3).join('')}
        {s >= 17.2 && caretOn && <span style={{width: 3, height: FS * 1.1, background: INK, marginLeft: 3}} />}
      </div>
      {/* 底栏 */}
      <div style={{position: 'absolute', left: BL + 52, top: BT + 374 - 30, fontSize: 60, color: INK, lineHeight: '60px'}}>+</div>
      <svg width={46} height={46} viewBox="0 0 24 24" style={{position: 'absolute', left: BL + 137, top: BT + 374 - 23}}><path d="M3 7h10M17 7h4M3 17h4M11 17h10" stroke={INK} strokeWidth="1.8" strokeLinecap="round" /><circle cx="15" cy="7" r="2.2" fill="none" stroke={INK} strokeWidth="1.8" /><circle cx="9" cy="17" r="2.2" fill="none" stroke={INK} strokeWidth="1.8" /></svg>
      <div style={{position: 'absolute', right: 1920 - (BL + 1185), top: BT + 374 - 30, fontSize: 46, color: INK, lineHeight: '60px', whiteSpace: 'nowrap'}}>{x.model} <span style={{fontSize: 30}}>⌄</span></div>
      <div style={{position: 'absolute', left: BL + 1248 - 43, top: BT + 374 - 43, width: 86, height: 86, borderRadius: 43, background: '#2c2c30', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4}}>
        {[10, 22, 30, 18, 26, 12].map((h, i) => <div key={i} style={{width: 4, height: h, borderRadius: 2, background: '#fff'}} />)}
      </div>
      <div style={{position: 'absolute', left: BL + 1380 - 43, top: BT + 374 - 43, width: 86, height: 86, borderRadius: 43, background: '#111114', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - press * 0.1})`, boxShadow: ring > 0 ? `0 0 0 ${4 * ring}px #fff, 0 0 0 ${8 * ring}px #2a2a2e` : undefined}}>
        <svg width={44} height={44} viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      {/* 拖着的文件夹 */}
      {s < DROP && (
        <div style={{position: 'absolute', left: fx - fw / 2, top: fy - fw * 0.575, transform: `rotate(${frot}deg)`}}><GlassFolder w={fw} fan={0.6} /></div>
      )}
      <GradCursor x={cur.x} y={cur.y} s={press ? 0.88 : 1} />
      <Grain opacity={0.025} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(FOLDER_DROP_CHAT_CONTRACT).length) throw new Error(checkContract(FOLDER_DROP_CHAT_CONTRACT).join('；'));
export const FolderDropChat: React.FC = () => <FolderDropChatGroup />;
// 未用
export const _p = PURPLE;
