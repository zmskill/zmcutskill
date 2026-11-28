// 消息飘带：问句 + 一条流动的通知飘带
// 学的动作（来自 @bohdanmotion · Polar 0:00–0:05）：问句先出 → 一大片卡片从镜头前右侧飞过、落到一条弯曲的 3D 飘带上
//   （飞过时挡住问句、问句跟着虚一下）→ 飘带一直横向流动、结尾加速 → 中间亮起一个光点、整屏失焦过曝转场。
//   运动参数按原片逐帧实测（流动每帧 ~12px、结尾加速到 ~28px），见 tools/shot-lab/measure_motion.py。
// 我们自己的内容和设计（不抄原片画面）：
//   - 用途：痛点开场——"每天被多少条消息追着跑？"
//   - 卡片：各种 App 的通知卡（图标、App 名、标题、一句内容、时间、未读数），不是截图缩略图
//   - 配色（2026-11-17 用户定 #34 改回亮色，照原片）：暖白亮场 + 窗光斜影 / 叶影；卡片是白色毛玻璃，带一小张真照片缩略图；
//     字是深墨、关键词用蓝（原片两处蓝字）；未读角标缩小、不发光
//   - 光：飘带下方一层发白的柔光；出场的光点是白球（旧版深色见 git 前的 _to_delete 备份）
// 时间表（30fps，共 150f）
//   0–40 问句逐词出；48–84 卡片从右前方飞过落位（问句 58–82 虚一下）；60 起飘带横向流动，118 起加速
//   110–126 中间光点亮起；118–146 整屏失焦 + 过曝；146–150 纯白（接下一镜）
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {EASE, FONT, Grain, Vignette, mix, ramp, softShadow} from '../../../assets/lib/helpers/polish';

export const MESSAGE_RIBBON_FLOW_DURATION = 150;

const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const INK = '#1d2233';
const BLUE = '#1f6fe5';
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const rnd = (i: number) => {
  const x = Math.sin(i * 91.17 + 7.3) * 43758.5453;
  return x - Math.floor(x);
};

const LINE1: {t: string; hot?: boolean}[] = [{t: '你每天被'}, {t: '多少条消息', hot: true}];
const LINE2: {t: string; hot?: boolean}[] = [{t: '追着跑', hot: true}, {t: '？'}];

const COLS = 44;
const ROWS = 4;
const CW = 118;
const CH = 86;
const GX = 128;
const GY = 98;
const TINTS = ['#9fc6e8', '#e9c98f', '#b9a6e6', '#8fd1c0', '#f0b0a8', '#a9c0f2'];

const APPS = [['微信', '#22c55e', '项目群', '@你 明天上午能交初稿吗？'], ['邮件', '#3b82f6', '客户反馈', '第三版还要再改一下开头'], ['飞书', '#6366f1', '周会提醒', '10:30 产品评审，别迟到'],
  ['日历', '#f97316', '日程冲突', '14:00 有两个会议重叠'], ['钉钉', '#0ea5e9', '审批待办', '你有 6 条审批未处理'], ['短信', '#a3e635', '验证码', '你的验证码是 482913'],
  ['小红书', '#ff2442', '新评论', '这个教程第 3 步看不懂'], ['抖音', '#f43f5e', '私信', '老师，能出个进阶版吗']] as const;
const THUMBS = ['travel/travel10', 'food/food01', 'city/city4', 'coffee/coffee13', 'travel/travel14', 'hz/hz04', 'food/food13', 'interior/interior04', 'concert/concert03', 'travel/travel00', 'market/market06', 'city/city8'];
const MiniShot: React.FC<{i: number}> = ({i}) => {
  const [app, col, title, body] = APPS[i % APPS.length];
  const unread = 1 + Math.floor(rnd(i + 3) * 27);
  return (
    <div style={{position: 'relative', width: CW, height: CH, borderRadius: 14, padding: '9px 10px', boxSizing: 'border-box', fontFamily: SANS,
      background: 'linear-gradient(180deg, rgba(255,255,255,0.94), rgba(246,248,252,0.9))', border: '1px solid rgba(255,255,255,0.95)',
      boxShadow: 'inset 0 1px 0 #fff, 0 8px 18px rgba(60,70,100,0.13), 0 1px 3px rgba(60,70,100,0.08)'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
        <div style={{width: 18, height: 18, borderRadius: 5, background: `linear-gradient(160deg, ${col}, rgba(0,0,0,0.25))`}} />
        <span style={{fontSize: 10, fontWeight: 700, color: '#3a4054'}}>{app}</span>
        <span style={{marginLeft: 'auto', fontSize: 8, color: '#9aa0b0'}}>{1 + Math.floor(rnd(i) * 59)} 分钟前</span>
      </div>
      <div style={{display: 'flex', gap: 6, marginTop: 6}}>
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{fontSize: 11, fontWeight: 700, color: '#1d2233', whiteSpace: 'nowrap'}}>{title}</div>
          <div style={{fontSize: 9, color: '#6b7183', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{body}</div>
        </div>
        {/* 原片卡里有一块照片 → 一小张真照片缩略图 */}
        <Img src={staticFile(`library/photos/${THUMBS[i % THUMBS.length]}.jpg`)} style={{width: 30, height: 30, borderRadius: 5, objectFit: 'cover', flex: 'none'}} />
      </div>
      <div style={{position: 'absolute', right: -6, top: -6, minWidth: 20, height: 20, borderRadius: 10, background: '#ff4d5e', color: '#fff', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px', boxSizing: 'border-box', boxShadow: '0 2px 4px rgba(255,77,94,0.25)', transform: 'scale(0.8)'}}>{unread}</div>
    </div>
  );
};

const Word: React.FC<{w: {t: string; hot?: boolean}; start: number}> = ({w, start}) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, 12, EASE.out);
  return (
    <span style={{display: 'inline-block', whiteSpace: 'pre', opacity: p, filter: `blur(${((1 - p) * 12).toFixed(1)}px)`, transform: `translateY(${((1 - p) * 16).toFixed(1)}px)`, color: w.hot ? BLUE : INK, fontWeight: w.hot ? 700 : 500}}>
      {w.t}
    </span>
  );
};

// 窗光斜影：几道宽窄不一的斜条 + 一簇叶影，都大模糊、低不透明度，只落在左上大半面墙
const LEAF = Array.from({length: 22}, (_, i) => ({x: 120 + rnd(i * 3 + 1) * 900, y: 40 + rnd(i * 3 + 2) * 520, w: 70 + rnd(i * 5) * 140, h: 26 + rnd(i * 7) * 50, r: rnd(i * 11) * 180, ph: rnd(i * 13) * 6.28}));
const WindowShadow: React.FC<{t: number}> = ({t}) => {
  const sway = Math.sin(t * 0.9) * 10 + Math.sin(t * 2.3 + 1) * 3;
  const mask = 'radial-gradient(ellipse 80% 90% at 25% 15%, #000 30%, rgba(0,0,0,0.35) 65%, transparent 92%)';
  return (
    <AbsoluteFill style={{WebkitMaskImage: mask, maskImage: mask}}>
      <div style={{position: 'absolute', left: -700, top: -600, width: 3200, height: 2300, transform: `rotate(-34deg) translateX(${(sway * 0.4).toFixed(1)}px)`, filter: 'blur(30px)', opacity: 0.11}}>
        {[[560, 170], [860, 50], [1010, 170], [1360, 60], [1500, 120]].map(([x, w], i) => <div key={i} style={{position: 'absolute', left: x, top: 0, width: w, height: 2300, background: '#4a4136'}} />)}
      </div>
      <div style={{position: 'absolute', inset: 0, filter: 'blur(18px)', opacity: 0.09, transform: `translate(${sway.toFixed(1)}px, ${(sway * 0.35).toFixed(1)}px)`}}>
        {LEAF.map((l, i) => <div key={i} style={{position: 'absolute', left: l.x, top: l.y, width: l.w, height: l.h, borderRadius: '50%', background: '#4a4136', transform: `rotate(${(l.r + Math.sin(t * 1.7 + l.ph) * 6).toFixed(1)}deg)`}} />)}
      </div>
    </AbsoluteFill>
  );
};

export const MessageRibbonFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const f = frame;
  const t = f / 30;

  const up = ramp(f, 52, 22, EASE.smooth);
  // 卡片飞过问句前面那一段：问句虚化 + 变淡（峰值在 62f），然后在上方清楚回来
  const pass = Math.sin(clamp(ramp(f, 58, 24, EASE.linear)) * Math.PI);
  const upBlur = pass * 9;
  const textScale = mix(1, 1.12, ramp(f, 66, 70, EASE.smooth));
  const push = mix(1, 1.06, ramp(f, 66, 70, EASE.smooth));
  // 出场：先亮一个小光点，再整体失焦过曝
  const orb = ramp(f, 110, 16, EASE.out);
  const haze = ramp(f, 118, 28, EASE.smooth);
  const white = ramp(f, 142, 6, EASE.linear);

  const g = Math.max(0, f - 60);
  const g2 = Math.max(0, f - 118);
  const flow = -(9 * g + 0.04 * g * g + 0.45 * g2 * g2);
  const cards: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      // 横向流动：每帧 ~9→13px，118f 后再加速（按原片实测）；首尾相接
      const SPAN = COLS * GX;
      const x0 = (c - (COLS - 1) / 2) * GX + (r % 2 ? GX / 2 : 0) + flow;
      const x = ((((x0 + SPAN / 2) % SPAN) + SPAN) % SPAN) - SPAN / 2;
      // 两层正弦：大波沿 x 传播，小波按行错开 → 像旗子起伏
      const wave = (xx: number) => Math.sin(xx * 0.0042 - t * 1.6) * 60 + Math.sin(xx * 0.011 + r * 0.9 - t * 2.3) * 18;
      const y = (r - (ROWS - 1) / 2) * GY + wave(x);
      const z = -0.00042 * x * x;
      const slope = (wave(x + 10) - wave(x - 10)) / 20;
      const ry = Math.atan(-0.00084 * x) * (180 / Math.PI); // 沿弯曲方向转
      const rx = Math.atan(slope) * (180 / Math.PI) * 0.6;
      // 右边的先到（order 0 = 最右），每张飞 26f，缓出落位
      const order = (COLS - 1 - c) / (COLS - 1);
      const appear = ramp(f, 48 + order * 18 + r * 1.2, 26, EASE.out);
      const rest = 1 - appear;
      const slide = rest * 1500;
      const nearZ = rest * 1100;
      const flyBlur = rest * 18;
      cards.push(
        <div
          key={i}
          style={{
            position: 'absolute', left: x - CW / 2, top: y - CH / 2,
            transform: `translate3d(${slide.toFixed(1)}px,${(rest * 160).toFixed(1)}px,${(z + nearZ).toFixed(1)}px) rotateY(${(ry - rest * 35).toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`,
            opacity: Math.min(1, appear * 3) * mix(1, 0.4, Math.min(1, Math.abs(x) / 3000)),
            filter: (() => { const b = flyBlur + (Math.abs(x) > 700 ? Math.min(4, (Math.abs(x) - 700) / 450) : 0); return b > 0.3 ? `blur(${b.toFixed(1)}px)` : undefined; })(),
          }}
        >
          <MiniShot i={i} />
        </div>,
      );
    }
  }

  return (
    <AbsoluteFill style={{fontFamily: SANS, overflow: 'hidden', background: 'linear-gradient(180deg, #f3f4f7 0%, #f1f0ee 60%, #ebe8e3 100%)'}}>
     <AbsoluteFill style={{filter: haze > 0.01 ? `blur(${(haze * 16).toFixed(1)}px) brightness(${(1 + haze * 0.18).toFixed(3)})` : undefined}}>
      {/* 窗光斜影 + 叶影（原片左上投进来的柔影，慢慢晃） */}
      <WindowShadow t={t} />
      {/* 飘带下方一层发白的柔光 */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 30% at 50% 70%, rgba(255,255,255,0.85), rgba(255,255,255,0) 70%)'}} />
      {/* 卡片飘带 */}
      {f >= 52 && (
        <AbsoluteFill style={{perspective: 1300, perspectiveOrigin: '50% 40%', transform: `scale(${push.toFixed(4)})`}}>
          <div style={{position: 'absolute', left: 960, top: 660, width: 0, height: 0, transformStyle: 'preserve-3d', transform: 'rotateX(18deg) translateZ(140px)'}}>
            {cards}
          </div>
        </AbsoluteFill>
      )}

      {/* 问句 */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start'}}>
        <div
          style={{
            marginTop: mix(460, 190, up), textAlign: 'center', fontSize: 84, letterSpacing: '-0.01em', lineHeight: 1.25,
            transform: `scale(${textScale.toFixed(4)})`, filter: upBlur > 0.3 ? `blur(${upBlur.toFixed(1)}px)` : undefined, opacity: 1 - pass * 0.45,
          }}
        >
          <div>{LINE1.map((w, k) => <Word key={k} w={w} start={2 + k * 5} />)}</div>
          <div>{LINE2.map((w, k) => <Word key={k} w={w} start={17 + k * 5} />)}</div>
        </div>
      </AbsoluteFill>

      {/* 飘带中间的小光点 */}
      {orb > 0 && (
        <>
          {/* 光晕 */}
          <div style={{position: 'absolute', left: 960 - 260, top: 640 - 260, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 25%, rgba(255,255,255,0) 60%)', transform: `scale(${(0.3 + orb * 0.7 + haze * 1.8).toFixed(3)})`, opacity: orb}} />
          {/* 小白球（像产品 logo 的那颗点）：有体积、有投影 */}
          <div style={{position: 'absolute', left: 960 - 70, top: 640 - 70, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #f4f6fa 38%, #dde3ec 72%, #c9d1dd 100%)', boxShadow: '0 18px 40px rgba(40,50,80,0.22), 0 0 60px rgba(255,255,255,0.9)', transform: `scale(${(0.2 + 0.8 * orb).toFixed(3)})`, opacity: orb}} />
        </>
      )}
     </AbsoluteFill>
      <Vignette strength={0.12} color="#6a6f80" inner={0.5} />
      <Grain opacity={0.04} blend="soft-light" />
      {/* 过曝变白 */}
      <AbsoluteFill style={{background: '#eef2ff', opacity: Math.min(1, haze * 0.8 + white)}} />
    </AbsoluteFill>
  );
};
