// 一张通知卡不动，背后的世界每 0.4 秒换一个（004-S1）
// 学的动作（来自 @bohdanmotion · Astor 2.0 · 四宫格左上 0:00–0:02.7，按 5 张/秒看过）：
//   画面正中一张毛玻璃通知卡一直钉着不动；背后是全屏大场景，每 ~0.4 秒硬切一次（工厂 → 机械臂 → 城市夜景 → 火箭 → 风车）；
//   每个场景自己在慢慢推近；卡里的字先出 App 名，再逐字打出一句话；最后光标点一下卡，卡缩小退场
// 意思：不管你在哪、在干什么，这条消息都跟着你——"一直在身边"
// 我们的内容：场景用画的（不假装实拍，自查表 10）：城市夜景俯瞰、日出云海、海面、极光、田野、雪山；
//   通知是日常内容（日程 App："你的周报已经整理好了"）
//
// 时间表（30fps，共 96f）
//   0–84   6 个场景，每个 14f，硬切；每个场景内 1.00→1.06 慢推
//   4–16   卡弹入；10 起 App 名；18–56 逐字打出那句话
//   58–70  光标从右下滑来；72 点下（卡压一下）
//   80–96  卡缩小淡出（交给下一镜）
// 毛病清单（自查表通用项 + 本镜头独有）：
//   - 独有 1：卡要始终清楚——背景越花，卡的毛玻璃越要实（背后模糊 + 白底 85%）
//   - 独有 2：硬切不加任何过渡，切点之间场景自己要在动，否则像幻灯片
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, FONT, Grain, Vignette, mix, ramp} from '../../../kit/polish';

export const NOTIFICATION_SCENE_CUTS_DURATION = 96;
// 第二版：按原片每 0.1 秒逐帧改——切点长短不一、卡先弹出字后打（0.4 秒打完）、光标从下方滑上来、
// 点下去一个液态玻璃泡鼓起扫过卡面、最后一个场景卡变透明并缩小虚掉

const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const hash = (i: number, n: number) => { const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };
const SCENE_LEN = 14;

// ───────── 6 个画出来的大场景（t = 场景内本地帧） ─────────
const City: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, #1b2440, #070a14 75%)'}}>
    {/* 街道：橙色光带 */}
    {[260, 610, 980, 1350, 1700].map((x, i) => <div key={i} style={{position: 'absolute', left: x, top: 0, width: 10, height: 1080, background: 'linear-gradient(180deg, rgba(255,170,70,0), rgba(255,170,70,0.75), rgba(255,170,70,0))', filter: 'blur(2px)'}} />)}
    {[180, 460, 760, 1020].map((y, i) => <div key={i} style={{position: 'absolute', left: 0, top: y, width: 1920, height: 8, background: 'rgba(255,190,110,0.6)', filter: 'blur(2px)'}} />)}
    {/* 楼顶：一块块深色方块 + 亮窗点 */}
    {Array.from({length: 120}, (_, i) => {
      const x = hash(i, 1) * 1880, y = hash(i, 2) * 1040, w = 40 + hash(i, 3) * 120, h = 40 + hash(i, 4) * 120;
      return (
        <div key={i} style={{position: 'absolute', left: x, top: y, width: w, height: h, background: '#10162a', boxShadow: '0 0 0 1px rgba(255,255,255,0.04)'}}>
          {Array.from({length: 6}, (_, k) => <div key={k} style={{position: 'absolute', left: hash(i * 7 + k, 5) * (w - 6), top: hash(i * 7 + k, 6) * (h - 6), width: 5, height: 5, borderRadius: 1, background: hash(i * 7 + k, 7) > 0.6 ? '#ffd58a' : '#9fc4ff', opacity: 0.55 + 0.45 * Math.sin(t / 3 + i + k)}} />)}
        </div>
      );
    })}
  </AbsoluteFill>
);
const Sunrise: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #243b6b 0%, #c8607a 38%, #ffa45c 58%, #ffd9a0 70%, #ffe7c4 100%)'}}>
    <div style={{position: 'absolute', left: 960 - 220, top: 560 - 220 - t * 2, width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle, #fff7e0 0%, rgba(255,220,150,0.6) 30%, rgba(255,200,120,0) 70%)'}} />
    {Array.from({length: 14}, (_, i) => <div key={i} style={{position: 'absolute', left: -200 + hash(i, 1) * 2000 - t * (1 + i * 0.2), top: 640 + hash(i, 2) * 380, width: 500 + hash(i, 3) * 500, height: 120 + hash(i, 4) * 120, borderRadius: '50%', background: i % 2 ? '#f4c8a6' : '#e8a98c', filter: 'blur(18px)', opacity: 0.9}} />)}
  </AbsoluteFill>
);
const Sea: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #0b3a4f 0%, #0f5b6e 50%, #083042 100%)'}}>
    {Array.from({length: 26}, (_, i) => <div key={i} style={{position: 'absolute', left: -100 + ((i * 137 + t * 6) % 300), top: i * 42, width: 2200, height: 6, borderRadius: 3, background: 'rgba(180,240,255,0.18)', transform: `skewY(-2deg) translateX(${Math.sin(i + t / 4) * 20}px)`}} />)}
    {Array.from({length: 40}, (_, i) => <div key={i} style={{position: 'absolute', left: hash(i, 1) * 1920, top: hash(i, 2) * 1080, width: 18, height: 4, borderRadius: 2, background: '#e9fdff', opacity: Math.max(0, Math.sin(t / 2 + i * 1.7))}} />)}
  </AbsoluteFill>
);
const Aurora: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #050816 0%, #0b1530 60%, #101a2c 100%)'}}>
    {Array.from({length: 80}, (_, i) => <div key={i} style={{position: 'absolute', left: hash(i, 1) * 1920, top: hash(i, 2) * 700, width: 3, height: 3, borderRadius: 2, background: '#fff', opacity: 0.3 + hash(i, 3) * 0.6}} />)}
    {[['#3dffb0', 300, -10], ['#7b5cff', 420, 8], ['#38e1ff', 220, -4]].map(([c, y, r], i) => (
      <div key={i} style={{position: 'absolute', left: -200, top: Number(y) + Math.sin(t / 5 + i) * 20, width: 2400, height: 220, borderRadius: '50%', background: `linear-gradient(90deg, rgba(0,0,0,0), ${c}, rgba(0,0,0,0))`, filter: 'blur(40px)', opacity: 0.55, transform: `rotate(${r}deg)`}} />
    ))}
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 260, background: '#05070d', clipPath: 'polygon(0 40%, 12% 10%, 26% 45%, 40% 0, 55% 50%, 70% 15%, 85% 45%, 100% 20%, 100% 100%, 0 100%)'}} />
  </AbsoluteFill>
);
const Field: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: '#4f8a3a', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: -600, top: -600, width: 3200, height: 2400, transform: `rotate(-24deg) translateX(${-t * 3}px)`}}>
      {Array.from({length: 40}, (_, i) => <div key={i} style={{position: 'absolute', left: 0, top: i * 60, width: 3200, height: 30, background: i % 2 ? '#5f9a44' : '#467d33'}} />)}
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, background: 'radial-gradient(ellipse 60% 50% at 70% 30%, rgba(255,250,200,0.35), rgba(0,0,0,0) 70%)'}} />
    <div style={{position: 'absolute', left: 1180, top: -100, width: 60, height: 1300, background: '#c9b58a', transform: 'rotate(18deg)', opacity: 0.8}} />
  </AbsoluteFill>
);
const Snow: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #a9c7e8 0%, #dfeaf6 55%, #f4f7fb 100%)'}}>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 700, background: 'linear-gradient(180deg, #ffffff, #c9d6e6)', clipPath: 'polygon(0 70%, 18% 30%, 30% 52%, 48% 0, 62% 40%, 76% 18%, 100% 60%, 100% 100%, 0 100%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 700, background: 'rgba(90,120,160,0.35)', clipPath: 'polygon(48% 0, 62% 40%, 55% 100%, 44% 100%)'}} />
    {Array.from({length: 60}, (_, i) => <div key={i} style={{position: 'absolute', left: (hash(i, 1) * 1920 + t * 3) % 1920, top: (hash(i, 2) * 1080 + t * (4 + hash(i, 3) * 4)) % 1080, width: 6, height: 6, borderRadius: 3, background: '#fff', opacity: 0.8}} />)}
  </AbsoluteFill>
);

// 切点按原片：工厂 0–0.95s → 机械臂 0.95–1.0 → 城市 1.0–1.6 → 火箭 1.6–2.2 → 风车 2.2–
// 原片每个场景长短不一（0.5–0.95 秒），每个场景里镜头一直在推近 / 漂
const CUTS = [0, 17, 29, 47, 65, 84];
const SCENE_ORDER = [City, Sunrise, Sea, Aurora, Field, Snow];

export const NotificationSceneCuts: React.FC = () => {
  const f = useCurrentFrame();
  let si = 0;
  for (let i = 0; i < CUTS.length; i++) if (f >= CUTS[i]) si = i;
  const t = f - CUTS[si];
  const len = (CUTS[si + 1] ?? 96) - CUTS[si];
  const S = SCENE_ORDER[si];
  const push = 1 + (t / len) * 0.07;
  const drift = (t / len) * 30 * (si % 2 ? 1 : -1);

  // 卡片：0.2s 从虚到实弹出（卡先出、字后出）；最后一个场景里卡一边缩小一边虚掉
  const cardIn = ramp(f, 5, 8, EASE.out);
  const cardOut = ramp(f, 84, 12, EASE.smooth);
  const app = ramp(f, 9, 6, EASE.out);
  const MSG = '你的周报已经整理好了。';
  const tw = ramp(f, 11, 12, EASE.linear); // 0.4 秒内打完（原片 0.3–0.7s）
  const n = Math.floor(tw * Array.from(MSG).length);
  // 光标：1.5s 从卡下方滑上来，停在卡下沿；2.0s 点下，一个液态玻璃泡在点击处鼓起来、扫过卡面
  const cur = ramp(f, 44, 12, EASE.out);
  const press = ramp(f, 60, 4, EASE.out) * (1 - ramp(f, 64, 6, EASE.out));
  const bubble = ramp(f, 60, 14, EASE.out);
  const bubbleOut = ramp(f, 72, 8, EASE.smooth);
  const scale = mix(0.9, 1, cardIn) * mix(1, 0.62, cardOut) * (1 - press * 0.03);
  const cardBlur = (1 - cardIn) * 14 + cardOut * 3;
  const glassy = ramp(f, 84, 4, EASE.smooth); // 风车场景里卡变得更透（原片最后一张卡是透明玻璃）

  return (
    <AbsoluteFill style={{fontFamily: SANS, overflow: 'hidden', background: '#000'}}>
      <AbsoluteFill style={{transform: `translateX(${drift.toFixed(1)}px) scale(${push.toFixed(4)})`}}>
        <S t={t} />
      </AbsoluteFill>
      <Vignette strength={0.3} color="#000" inner={0.45} />

      {/* 通知卡：毛玻璃，钉在正中 */}
      <div style={{position: 'absolute', left: 960 - 500, top: 540 - 95, width: 1000, height: 190, borderRadius: 40, overflow: 'hidden', transform: `scale(${scale.toFixed(4)})`, opacity: Math.min(1, cardIn * 1.5) * (1 - ramp(f, 92, 4)), filter: cardBlur > 0.3 ? `blur(${cardBlur.toFixed(1)}px)` : undefined, boxShadow: '0 30px 70px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 0 0 2px rgba(255,255,255,0.35)'}}>
        <div style={{position: 'absolute', inset: 0, backdropFilter: `blur(${mix(26, 8, glassy)}px) saturate(1.4)`, WebkitBackdropFilter: `blur(${mix(26, 8, glassy)}px) saturate(1.4)`, background: `rgba(255,255,255,${mix(0.82, 0.3, glassy).toFixed(3)})`}} />
        {/* 液态玻璃泡：从点击处鼓起、往右上扫过卡面 */}
        {bubble > 0 && bubbleOut < 1 && (
          <div style={{position: 'absolute', left: 430 - 40 + bubble * 120, top: 120 - bubble * 70, width: 80 + bubble * 220, height: 80 + bubble * 220, marginLeft: -bubble * 110, marginTop: -bubble * 110, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.55), rgba(160,210,220,0.35) 45%, rgba(40,90,100,0.45) 75%, rgba(255,255,255,0.7) 92%, rgba(255,255,255,0) 100%)', opacity: 1 - bubbleOut, backdropFilter: 'blur(2px) saturate(1.6)', WebkitBackdropFilter: 'blur(2px) saturate(1.6)'}} />
        )}
        <div style={{position: 'relative', display: 'flex', alignItems: 'center', height: '100%', padding: '0 44px', gap: 30}}>
          <div style={{width: 104, height: 104, borderRadius: 26, background: glassy > 0.5 ? '#ffffff' : 'linear-gradient(160deg, #ff8a5b, #ff5a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)', flexShrink: 0}}>
            <svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke={glassy > 0.5 ? '#ff5a5f' : '#fff'} strokeWidth="2" strokeLinecap="round"><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
          </div>
          <div style={{flex: 1, minWidth: 0}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 34, color: glassy > 0.5 ? '#f2f6f2' : '#6a6874', opacity: app}}><span style={{fontWeight: 600}}>日程</span><span>刚刚</span></div>
            <div style={{fontSize: 48, fontWeight: 600, color: glassy > 0.5 ? '#ffffff' : '#17161c', marginTop: 6, whiteSpace: 'nowrap', textShadow: glassy > 0.5 ? '0 1px 6px rgba(0,0,0,0.35)' : undefined}}>
              {Array.from(MSG).map((c, i) => { const p = Math.max(0, Math.min(1, tw * Array.from(MSG).length - i)); return <span key={i} style={{opacity: i < n ? 1 : p, color: i >= n - 2 && n < Array.from(MSG).length ? '#8a8896' : undefined}}>{c}</span>; })}
            </div>
          </div>
        </div>
      </div>
      {/* 光标：从卡下方滑上来 */}
      {f >= 44 && f < 90 && (
        <svg width="60" height="70" viewBox="0 0 22 26" style={{position: 'absolute', left: mix(900, 860, cur) + bubble * 10 + (f > 66 ? (f - 66) * 2.5 : 0), top: mix(760, 600, cur) - (f > 66 ? (f - 66) * 1.2 : 0), transform: `scale(${(1 - press * 0.15) * mix(1, 0.62, cardOut)})`, transformOrigin: '0 0', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.35))', opacity: Math.min(1, cur * 2) * (1 - ramp(f, 82, 8))}}>
          <path d="M2 2 L2 20 L7 15.5 L10.5 23 L13.5 21.6 L10 14.3 L17 14 Z" fill="#2a2a30" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      )}
      <Grain opacity={0.05} blend="overlay" />
    </AbsoluteFill>
  );
};
