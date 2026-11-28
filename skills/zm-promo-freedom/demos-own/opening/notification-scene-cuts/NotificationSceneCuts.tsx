// 一张通知卡不动，背后的世界每 0.4 秒换一个（004-S1）
// 学的动作（来自 @bohdanmotion · Astor 2.0 · 四宫格左上 0:00–0:02.7，按 5 张/秒看过）：
//   画面正中一张毛玻璃通知卡一直钉着不动；背后是全屏大场景，每 ~0.4 秒硬切一次（工厂 → 机械臂 → 城市夜景 → 火箭 → 风车）；
//   每个场景自己在慢慢推近；卡里的字先出 App 名，再逐字打出一句话；最后光标点一下卡，卡缩小退场
// 意思：不管你在哪、在干什么，这条消息都跟着你——"一直在身边"
// 我们的内容：场景用真照片（第4轮起）：工厂、机械臂、城市夜景、火箭、风车；
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
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {EASE, FONT, Grain, Vignette, mix, ramp} from '../../../assets/lib/helpers/polish';

export const NOTIFICATION_SCENE_CUTS_DURATION = 96;
// 第二版：按原片每 0.1 秒逐帧改——切点长短不一、卡先弹出字后打（0.4 秒打完）、光标从下方滑上来、
// 点下去一个液态玻璃泡鼓起扫过卡面、最后一个场景卡变透明并缩小虚掉

const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const hash = (i: number, n: number) => { const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };
const SCENE_LEN = 14;

// 2026-11-17 第4轮：原片是实拍大场景 → 换成真照片（library/photos/cine，Unsplash 免费授权，来源见 library/README）
//   工厂俯拍 → 机械臂特写 → 城市夜景俯拍 → 火箭发射 → 风车俯拍（最后两段是同一张风车，镜头接着推）
const PHOTO = ['cine00', 'cine02', 'cine05', 'cine08', 'cine13', 'cine13'];
const Photo: React.FC<{src: string}> = ({src}) => (
  <AbsoluteFill><Img src={staticFile(`library/photos/cine/${src}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} /></AbsoluteFill>
);

// 切点按原片：工厂 0–0.95s → 机械臂 0.95–1.0 → 城市 1.0–1.6 → 火箭 1.6–2.2 → 风车 2.2–
// 原片每个场景长短不一（0.5–0.95 秒），每个场景里镜头一直在推近 / 漂
const CUTS = [0, 17, 29, 47, 65, 84];

export const NotificationSceneCuts: React.FC = () => {
  const f = useCurrentFrame();
  let si = 0;
  for (let i = 0; i < CUTS.length; i++) if (f >= CUTS[i]) si = i;
  // 最后两段同一张风车：当成一段连续推
  const s0 = si === 5 ? CUTS[4] : CUTS[si];
  const t = f - s0;
  const len = (si >= 4 ? 96 : CUTS[si + 1]) - s0;
  const push = 1.02 + (t / len) * (si >= 4 ? 0.12 : 0.07);
  const drift = (t / len) * 30 * (si >= 4 ? -1 : si % 2 ? 1 : -1);

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
        <Photo src={PHOTO[si]} />
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
