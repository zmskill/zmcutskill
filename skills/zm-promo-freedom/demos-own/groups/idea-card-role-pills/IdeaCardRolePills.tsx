// 【镜头组】idea-card-role-pills：白→粉渐变底，一张「新想法」卡从下面升上来，输入框弹出来（比卡还宽）逐字打一句话、再缩回卡里 →
//   硬切：四个头像左右交错一个个弹出来，每个头像后面拉出一条红色胶囊、写着角色名（038-E 一拍，团队协作）
// 学的动作（NoorMalik · Teamflow 25.5–29.75s，30fps 逐帧量过，2026-11-21）：
//   25.5 卡从下面升上来：卡左上 (608,446) → 25.85 (608,216)，卡宽 661；之后慢慢往上漂（26.9 y176）
//   25.75 输入框从卡里弹出来、比卡宽（532–1337，高 103），25.8–26.7 逐字打一句话；26.75–26.9 缩回卡里（632–1242，高 72），字变小
//   27.2 硬切到空白粉底；头像 27.22 / 27.55 / 27.95 / 28.4 一个个弹出来，各自晚 0.4s 从头像后面往右拉出胶囊（0.45s，缓出），字跟着露出来
//   四行：中心 y 218 / 421 / 626 / 834，左边 x 510 / 788 交错；胶囊 560×130，头像 108；第 1、3 行左红右黑，第 2、4 行左黑右红
// 我们的内容：新想法「重新设计新手引导」，四个角色（UI/UX 设计师、前端开发、产品经理、增长专家），头像用素材库真人照片，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 25.5;
const SANS = '"PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const back = (u: number) => { const x = clamp(u), c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const kf = (t: number, K: number[][], e: (u: number) => number = eio) => {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * e((t - a) / (b - a)); }
  return K[K.length - 1][1];
};
export const IDEA_ROLE_CONTRACT: GroupContract = {
  sourceDuration: 128 / 30,
  fps: 30,
  motion: [[0, 1.3], [1.45, 3.75]],
  holds: [{at: 1.38, maxExtra: 1.5}, {at: 4.0, maxExtra: 2}],
  landmarks: {card: 0, type: 0.3, done: 1.4, cut: 1.7, p1: 1.72, p2: 2.05, p3: 2.45, p4: 2.9},
  sfx: [
    {at: 'card', type: '上升', note: '卡片升起 swish', volume: 0.35},
    {at: 'type', type: '键盘', note: '一串打字', tail: 0.9, volume: 0.3},
    {at: 'p1', type: '弹出', note: '弹出 pop', volume: 0.35}, {at: 'p2', type: '弹出', note: '弹出 pop', volume: 0.35}, {at: 'p3', type: '弹出', note: '弹出 pop', volume: 0.35}, {at: 'p4', type: '弹出', note: '弹出 pop', volume: 0.35},
  ],
  inputs: {title: {maxChars: 10}, ask: {maxChars: 16}, roles: {count: 4, maxChars: 8}},
};
export type IdeaRoleInputs = {title: string; ask: string; roles: string[]; faces: string[]; note: string};
export const IDEA_ROLE_DEFAULT_INPUTS: IdeaRoleInputs = {title: '重新设计新手引导', ask: '要是能让新手引导毫不费力呢？', roles: ['UI/UX 设计师', '前端开发', '产品经理', '增长专家'], faces: ['f01', 'm06', 'f04', 'm15'], note: '虚构 · 仅作演示'};
export const checkIdeaRoleInputs = (x: IdeaRoleInputs) => checkInputs(IDEA_ROLE_CONTRACT, {title: x.title, ask: x.ask});
export const planIdeaRole = (sec: number) => planExtras(IDEA_ROLE_CONTRACT, sec);
export const ideaRoleFrames = (extras: number[]) => Math.round(outputDuration(IDEA_ROLE_CONTRACT, extras) * FPS);
export const IDEA_ROLE_DURATION = 128;

export const IdeaCardRolePillsGroup: React.FC<{inputs?: IdeaRoleInputs; extras?: number[]}> = ({inputs: x = IDEA_ROLE_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, IDEA_ROLE_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const bg = 'linear-gradient(180deg, #ffffff 0%, #ffffff 30%, #fbd3d8 62%, #f4919b 100%)';
  if (s < 27.2) {
    const cy = kf(s, [[25.45, 700], [25.6, 446], [25.85, 216], [26.4, 203], [26.9, 176], [27.2, 150]]) - held * 4;
    const sc = kf(s, [[25.45, 1.08], [25.85, 1.0]]);
    const pop = eo((s - 25.72) / 0.12), shrink = eio((s - 26.75) / 0.15);
    const A = Array.from(x.ask), n = Math.floor(clamp((s - 25.76) / 0.75) * A.length + 0.001);
    const ix0 = -76 + 100 * shrink, iw = 805 - 195 * shrink, ih = 103 - 31 * shrink, iy = 343 - 19 * shrink, ifs = 30 - 8 * shrink;
    return (
      <AbsoluteFill style={{background: bg, overflow: 'hidden', fontFamily: SANS}}>
        <div style={{position: 'absolute', left: 608, top: cy, width: 661, height: 640, transform: `scale(${sc})`, transformOrigin: '50% 0%', borderRadius: 16, background: '#fff', boxShadow: '0 18px 50px rgba(160,40,60,0.18)'}}>
          <div style={{position: 'absolute', left: 52, top: 56, display: 'flex', alignItems: 'center', gap: 20, fontSize: 32, color: '#2a2a30'}}><div style={{width: 50, height: 50, borderRadius: '50%', background: '#e6a3ad'}} />新想法</div>
          <div style={{position: 'absolute', left: 36, top: 150, width: 520, fontSize: 44, fontWeight: 600, color: '#1e1f25', lineHeight: 1.35}}>{x.title}</div>
          {pop > 0 && <div style={{position: 'absolute', left: ix0, top: iy, width: iw, height: ih, borderRadius: 16, background: '#fff', boxShadow: `0 8px 30px rgba(0,0,0,${0.12 * (1 - shrink) + 0.04})`, transform: `scale(${0.85 + 0.15 * pop})`, opacity: pop, display: 'flex', alignItems: 'center', justifyContent: shrink > 0.5 ? 'center' : 'flex-start', paddingLeft: shrink > 0.5 ? 0 : 70, fontSize: ifs, color: '#2a2a30', boxSizing: 'border-box', whiteSpace: 'nowrap'}}>{A.slice(0, n).join('')}{s < 26.75 && <span style={{width: 2, height: ifs + 4, background: '#2a2a30', marginLeft: 2, opacity: Math.floor(s * 4) % 2 ? 1 : 0.2}} />}</div>}
          <div style={{position: 'absolute', left: 54, top: 486, width: 550, height: 100, borderRadius: 10, background: 'linear-gradient(90deg, #c4000c 0%, #8a0008 55%, #2a0004 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 36, fontWeight: 500}}>分享想法</div>
        </div>
        <div style={{position: 'absolute', right: 36, bottom: 26, fontSize: 20, color: 'rgba(120,30,40,0.45)', letterSpacing: '0.06em'}}>{x.note}</div>
      </AbsoluteFill>
    );
  }
  const AV = [27.22, 27.55, 27.95, 28.4], PL = AV.map((a) => a + 0.45);
  const ROWY = [218, 421, 626, 834], ROWX = [510, 788, 510, 788];
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden', fontFamily: SANS}}>
      {x.roles.map((r, i) => {
        const a = back((s - AV[i]) / 0.28), p = eo((s - PL[i]) / 0.6); /* 原片胶囊拉得比较慢，字是跟着胶囊一个个露出来的 */
        if (s < AV[i]) return null;
        const W = 130 + (560 - 130) * p;
        const redLeft = i % 2 === 0;
        return (
          <div key={i} style={{position: 'absolute', left: ROWX[i], top: ROWY[i] - 65, height: 130}}>
            <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 130, borderRadius: 65, overflow: 'hidden', background: redLeft ? 'linear-gradient(90deg, #d0000f 0%, #8c0008 50%, #1f0003 100%)' : 'linear-gradient(90deg, #1f0003 0%, #8c0008 50%, #e0001a 100%)', boxShadow: '0 10px 26px rgba(120,0,10,0.25)', transform: `scale(${Math.min(1, a)})`, transformOrigin: '65px 65px'}}>
              <div style={{position: 'absolute', left: 150, top: 0, height: 130, display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', opacity: 1, WebkitMaskImage: `linear-gradient(90deg, #000 ${(W - 170)}px, transparent ${(W - 130)}px)`, maskImage: `linear-gradient(90deg, #000 ${(W - 170)}px, transparent ${(W - 130)}px)`}}>{r}</div>
            </div>
            <div style={{position: 'absolute', left: 11, top: 11, width: 108, height: 108, borderRadius: '50%', overflow: 'hidden', border: `4px solid ${redLeft ? '#e3101f' : '#2a0306'}`, boxSizing: 'border-box', transform: `scale(${a})`, background: '#eee'}}>
              <Img src={staticFile(`library/faces/${x.faces[i]}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontSize: 20, color: 'rgba(120,30,40,0.45)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(IDEA_ROLE_CONTRACT).length) throw new Error(checkContract(IDEA_ROLE_CONTRACT).join('；'));
export const IdeaCardRolePills: React.FC = () => <IdeaCardRolePillsGroup />;
