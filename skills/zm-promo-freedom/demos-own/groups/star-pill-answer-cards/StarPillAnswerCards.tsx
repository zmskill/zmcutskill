// 【镜头组】star-pill-answer-cards：一颗发光的蓝色四角星 → 外面长出一个圆、往左挪 → 右边撑开一条输入胶囊、逐字打一句提问 →
//   镜头拉远，四周依次弹出四张玻璃回答卡，轻轻漂（028-F 一拍，功能演示：提问 → 出结果）
// 学的动作（ArtemLysenko · DashSync 24.5–28.9s，30fps 逐帧量过）：
//   24.5 小星（618,498）→ 24.8 外面长出圆（直径≈180）→ 25.2–26.0 圆往左挪到 x342、y590；26.0 胶囊从圆右边撑开（高 183，到 26.4 宽 480..1476），同时打字
//   26.8 停在 圆 x360 / 胶囊 510..1470；26.9–27.3 镜头拉远到 0.74（圆到 x476，胶囊 592..1306）
//   27.0–27.6 四张回答卡依次弹出：左上（196..724，y140..320）、右上（1134..1810，y116..360）、左下（124..672，y740..934）、右下（1060..1600，y760..960），然后慢漂
// 我们的内容：提问「分析一下最新的营销趋势」，四张卡是中文回答摘要。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {MorphStar, NavyBg, SANS, Star4, clamp, eio, eo, kf, mix} from '../_kit/blueArcKit';
import {GlowSpot} from '../_kit/light';

const FPS = 30;
const S0 = 24.5;
export const STAR_PILL_ANSWER_CONTRACT: GroupContract = {
  sourceDuration: 141 / 30, // 2026-11-19 原片 29.2 才切到数字卡（之前当成 28.9），回答卡要多漂 0.3s
  fps: 30,
  motion: [[0, 2.35], [2.45, 141 / 30]],
  holds: [{at: 2.4, maxExtra: 1}],
  landmarks: {star: 0, ring: 0.3, pill: 1.15, type: 1.45, pull: 2.0, cards: 2.35},
  sfx: [
    {at: 'star', type: '提示音', note: '星光 ding', volume: 0.35},
    {at: 'pill', type: '短甩', note: '展开 swish', volume: 0.35},
    {at: 'type', type: '键盘', note: '打字', tail: 0.8, volume: 0.25},
    {at: 'cards', type: '弹出', note: '四下 pop', tail: 0.6, volume: 0.35},
  ],
  inputs: {ask: {maxChars: 14}},
};
export type PillInputs = {ask: string; answers: string[]};
export const PILL_DEFAULT_INPUTS: PillInputs = {
  ask: '分析一下最新的营销趋势',
  answers: [
    '跟踪各个数字渠道上新出现的营销趋势：消费者行为和品牌沟通方式正在怎样变化，哪些投放形式和创意做法效果最好，AI 工具怎样影响现在的营销流程。',
    '看看正在改变营销格局的最新趋势：消费者的偏好和数字互动方式在变，头部品牌用了哪些新的互动策略，哪些新技术在改变内容的制作和分发。给出能直接拿来改进营销效果的建议。',
    '分析社交媒体和数字平台上的营销趋势：观察受众行为和内容表现，找出竞品品牌常用的创意形式，评估 AI 对投放开发和个性化的影响。',
    '跟进新的营销趋势和受众期待变化：新兴平台、内容形式和互动策略，成功的数字投放和品牌发布背后的规律，以及自动化和 AI 在现代营销里的作用。',
  ],
};
export const checkPillInputs = (x: PillInputs) => checkInputs(STAR_PILL_ANSWER_CONTRACT, {ask: x.ask});
export const planPill = (sec: number) => planExtras(STAR_PILL_ANSWER_CONTRACT, sec);
export const pillFrames = (extras: number[]) => Math.round(outputDuration(STAR_PILL_ANSWER_CONTRACT, extras) * FPS);
export const STAR_PILL_ANSWER_DURATION = 141;

const AnswerCard: React.FC<{w: number; h: number; text: string; fs: number; n?: number}> = ({w, h, text, fs, n = 1e9}) => (
  <div style={{width: w, height: h, borderRadius: 8, background: 'radial-gradient(ellipse 70% 90% at 100% 100%, rgba(50,95,255,0.75) 0%, rgba(30,62,210,0.45) 45%, rgba(14,26,100,0.3) 100%), linear-gradient(100deg, rgba(10,18,70,0.55) 0%, rgba(24,48,180,0.4) 100%)', boxShadow: '0 0 0 1px rgba(120,150,255,0.1), 0 20px 50px rgba(0,0,30,0.45)', padding: `${h * 0.12}px ${w * 0.05}px ${h * 0.12}px ${w * 0.11}px`, boxSizing: 'border-box', position: 'relative', fontFamily: SANS, backdropFilter: 'blur(6px)'}}>
    <div style={{position: 'absolute', left: w * 0.035, top: h * 0.13}}><Star4 size={fs * 1.6} glow={0.4} /></div>
    <div style={{fontSize: fs, lineHeight: 1.5, color: '#c8d4ff'}}>{Array.from(text).map((c, j) => { const o = clamp((n - j) / 10); return o <= 0 ? null : <span key={j} style={{opacity: o}}>{c}</span>; })}</div>
    <div style={{position: 'absolute', right: w * 0.03, bottom: h * 0.08, width: fs * 1.6, height: fs * 1.6, borderRadius: '50%', boxShadow: '0 0 0 1.5px rgba(160,180,255,0.4)'}} />
  </div>
);

export const StarPillAnswerGroup: React.FC<{inputs?: PillInputs; extras?: number[]}> = ({inputs: x = PILL_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, STAR_PILL_ANSWER_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  // 2026-11-19 光流：原片 26.5–27.4 镜头是慢慢拉远（速度一直 ≈10px/帧），不是 26.9 一下拉；27.6–28.6 还在极慢地退；28.6 起整个画面往左加速滑走（接下一镜的硬切）
  const cam = kf(s, [[26.45, 1], [26.8, 0.95], [27.1, 0.83], [27.4, 0.765], [27.8, 0.742], [28.6, 0.73]]);
  const gz = kf(s, [[27.3, 1], [28.6, 0.975], [29.2, 0.97]]);
  const pan = s > 28.6 ? -500 * (s - 28.6) * (s - 28.6) : 0;
  const cx = kf(s, [[24.5, 618], [24.8, 612], [25.2, 612], [25.6, 492], [26.0, 342], [26.4, 330], [26.8, 360]]);
  const cy = kf(s, [[24.5, 498], [24.8, 600], [25.2, 588], [26.0, 590]]);
  // 2026-11-19 逐帧重量（原片 25.55–26.4）：圆先弹两下（24.85 小 → 25.0 大 → 25.15 小 → 25.3 回正），
  //   25.65 起胶囊像水滴一样从圆右边鼓出来、带着"颈"连在一起（metaball），25.95 前后断开；星在中间变成圆角方块再变回星
  const D = Math.max(0, kf(s, [[24.79, 0], [24.84, 160], [24.9, 207], [25.05, 191], [25.25, 181], [25.4, 190], [25.6, 180], [27.0, 180]])); // 2026-11-21 再量：圆 24.8 才一下弹出来（之前 24.7 就开始长、把星一起缩小了）
  const ring = clamp(D / 40);
  const pillR = kf(s, [[25.55, 540], [25.65, 590], [25.7, 617], [25.75, 645], [25.8, 750], [25.85, 812], [25.9, 932], [25.95, 987], [26.0, 1100], [26.1, 1242], [26.2, 1355], [26.4, 1480], [26.8, 1470]]);
  const pillL = kf(s, [[25.55, 500], [25.65, 470], [25.75, 445], [25.85, 455], [25.95, 465], [26.0, 470], [26.4, 480], [26.8, 510]]);
  const pillOn = s > 25.5;
  const A = Array.from(x.ask);
  const T0 = 25.95, CPS = 22; // 中文字宽是英文的两倍，按"每秒走过的像素"对齐原片的打字速度
  const pos = [{l: 198, t: 135, w: 520, h: 181, at: 26.82}, {l: 1136, t: 118, w: 682, h: 247, at: 26.86}, {l: 115, t: 744, w: 560, h: 214, at: 26.9}, {l: 1060, t: 760, w: 547, h: 200, at: 26.94}];
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      <NavyBg gx={0} gy={0} glow={0.45} side={0.2} drift={s} />{/* 2026-11-21 12×7 吸管格重量：原片最亮在左上角往右下渐暗（右上几乎全黑）、输入框左半那一行有一团蓝光、底部中间一条蓝带；之前是围着圆的一大团椭圆光 */}<GlowSpot x={mix(cx, cx + 380, clamp((s - 25.6) / 0.6))} y={600} rx={640} ry={230} rgb='28,78,220' a={0.75 * clamp((s - 24.6) / 0.5)} /><GlowSpot x={920} y={1080} rx={1000} ry={400} rgb='22,64,200' a={0.62} /><GlowSpot x={700} y={690} rx={700} ry={300} rgb='24,70,210' a={0.42} /><GlowSpot x={620} y={920} rx={950} ry={280} rgb='22,64,200' a={0.42} />{/* 吸管量：原片亮光是横穿输入框那一行（偏左），左上和底部都暗 */}
      <AbsoluteFill style={{transform: `translateX(${pan}px) scale(${gz})`, transformOrigin: '960px 560px'}}>
      {/* 回答卡（拉远后的屏幕坐标） */}
      {pos.map((p, i) => {
        // 2026-11-21 逐帧：四张卡 26.85 就从雾里淡出来（很糊、很透明，0.6s 才清楚），不往上弹；卡里的字是一行行"流"出来的（27.2 两行 → 28.0 写满），最新的几个字是一段渐隐的尾巴
        const k = eo(clamp((s - p.at) / 0.6));
        if (k <= 0) return null;
        const fl = Math.sin((s + held) * 1.2 + i) * 6;
        const all = Array.from(x.answers[i]); const nf = clamp((s - p.at - 0.15) / 0.85) * (all.length + 10);
        return <div key={i} style={{position: 'absolute', left: p.l, top: p.t + fl, opacity: k, filter: k < 1 ? `blur(${(1 - k) * 14}px)` : undefined}}><AnswerCard w={p.w} h={p.h} text={x.answers[i]} fs={p.w > 600 ? 15 : 13} n={nf} /></div>;
      })}
      <AbsoluteFill style={{transform: `scale(${cam})`, transformOrigin: '960px 592px'}}>
        {/* 圆 + 胶囊：同一团玻璃（白色形状 → 模糊 + 阈值 = 水滴融合），再从这团形状里取 填充 / 内辉光 / 亮边 / 外辉光 */}
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <defs>
            <filter id="spGoo" filterUnits="userSpaceOnUse" x={-200} y={-200} width={2320} height={1480}>
              <feGaussianBlur in="SourceGraphic" stdDeviation={10} result="b" />
              <feColorMatrix in="b" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 24 -11" result="goo" />
              <feGaussianBlur in="goo" stdDeviation={16} result="og" />
              <feFlood floodColor="rgb(50,90,255)" floodOpacity={0.35} /><feComposite in2="og" operator="in" /><feComposite in2="goo" operator="out" result="outer" />
              <feFlood floodColor="rgb(40,80,240)" floodOpacity={0.17} /><feComposite in2="goo" operator="in" result="fill" />
              <feMorphology in="goo" operator="erode" radius={12} result="e2" />
              <feComposite in="goo" in2="e2" operator="out" /><feGaussianBlur stdDeviation={7} /><feComposite in2="goo" operator="in" result="band" />
              <feFlood floodColor="rgb(70,110,255)" floodOpacity={0.45} /><feComposite in2="band" operator="in" result="inner" />
              <feMorphology in="goo" operator="erode" radius={3} result="e1" />
              <feComposite in="goo" in2="e1" operator="out" /><feGaussianBlur stdDeviation={1.1} result="edge" />
              <feFlood floodColor="rgb(80,122,255)" /><feComposite in2="edge" operator="in" result="rim" />
              <feGaussianBlur in="rim" stdDeviation={4} /><feComponentTransfer result="rimGlow"><feFuncA type="linear" slope={0.4} /></feComponentTransfer>
              <feMerge><feMergeNode in="outer" /><feMergeNode in="fill" /><feMergeNode in="inner" /><feMergeNode in="rimGlow" /><feMergeNode in="rim" /></feMerge>
            </filter>
            <filter id="spGooA" filterUnits="userSpaceOnUse" x={-200} y={-200} width={2320} height={1480}>
              <feGaussianBlur in="SourceGraphic" stdDeviation={10} />
              <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 24 -11" />
            </filter>
            <mask id="spMask" maskUnits="userSpaceOnUse" x={0} y={0} width={1920} height={1080}>
              <g filter="url(#spGooA)">
                {D > 1 && <circle cx={cx} cy={cy} r={D / 2} fill="#fff" />}
                {pillOn && <rect x={pillL} y={cy - 91} width={Math.max(0, pillR - pillL)} height={182} rx={91} fill="#fff" />}
              </g>
            </mask>
            <linearGradient id="spFadeG" gradientUnits="userSpaceOnUse" x1={cx - 100} y1={0} x2={Math.max(cx + 300, pillR + 40)} y2={0}>{/* 2026-11-21 原片胶囊左边亮、往右越来越暗（右端几乎透明）；分开后圆的边也比胶囊左段暗一点 */}
              <stop offset="0" stopColor="#fff" stopOpacity={pillR - pillL > 300 ? 0.72 : 1} /><stop offset={pillR - pillL > 300 ? 0.25 : 0.5} stopColor="#fff" stopOpacity={1} /><stop offset="1" stopColor="#fff" stopOpacity={pillR - pillL > 300 ? 0.4 : 1} />
            </linearGradient>
            <mask id="spFade" maskUnits="userSpaceOnUse" x={-200} y={-200} width={2320} height={1480}><rect x={-200} y={-200} width={2320} height={1480} fill="url(#spFadeG)" /></mask>
            <linearGradient id="spFillG" gradientUnits="userSpaceOnUse" x1={cx - 90} y1={0} x2={Math.max(cx + 200, pillR)} y2={0}>
              <stop offset="0" stopColor="rgb(80,120,255)" stopOpacity={0.45} />
              <stop offset="0.35" stopColor="rgb(40,75,230)" stopOpacity={0.2} />
              <stop offset="1" stopColor="rgb(14,28,110)" stopOpacity={0.05} />
            </linearGradient>
            <radialGradient id="spHi" gradientUnits="userSpaceOnUse" cx={pillL + 40} cy={cy - 30} r={420}>
              <stop offset="0" stopColor="rgb(140,170,255)" stopOpacity={0.22} /><stop offset="1" stopColor="rgb(140,170,255)" stopOpacity={0} />
            </radialGradient>
          </defs>
          <rect x={0} y={0} width={1920} height={1080} fill="url(#spFillG)" mask="url(#spMask)" />
          {pillOn && <rect x={0} y={0} width={1920} height={1080} fill="url(#spHi)" mask="url(#spMask)" />}
          <g mask="url(#spFade)"><g filter="url(#spGoo)">
            {D > 1 && <circle cx={cx} cy={cy} r={D / 2} fill="#fff" />}
            {pillOn && <rect x={pillL} y={cy - 91} width={Math.max(0, pillR - pillL)} height={182} rx={91} fill="#fff" />}
          </g></g>
        </svg>
        <MorphStar x={cx} y={cy} size={mix(1, 0.88 * D / 180, clamp((s - 24.8) / 0.1))} m={kf(s, [[25.45, 0], [25.6, 1], [25.72, 0.05], [25.88, 1], [26.0, 0.85], [26.1, 0.2], [26.2, 0], [27, 0]])} rot={0} />
        {/* 打字：逐字从模糊里浮出来（原片 25.95 起，每个字 ≈0.12s 由糊到清），前面有一团软光领着走 */}
        {pillOn && pillR - pillL > 200 && (
          <div style={{position: 'absolute', left: pillL, top: cy - 91, width: pillR - pillL, height: 182, borderRadius: 91, overflow: 'hidden', display: 'flex', alignItems: 'center', paddingLeft: 70, boxSizing: 'border-box'}}>
            {A.map((ch, i) => {
              const u = clamp((s - T0 - i / CPS) / 0.14);
              if (u <= 0) return null;
              return <span key={i} style={{fontSize: 58, color: '#f2f5ff', whiteSpace: 'pre', opacity: eo(u), filter: `blur(${(1 - eo(u)) * 9}px)`, transform: `translateX(${(1 - eo(u)) * 10}px)`, display: 'inline-block', textShadow: '0 0 14px rgba(150,180,255,0.75), 0 0 2px rgba(255,255,255,0.6)'}}>{ch}</span>;
            })}
            {(() => { const head = clamp((s - T0) * CPS / A.length); const k = head > 0 && head < 1 ? 1 : head >= 1 ? Math.max(0, 1 - (s - T0 - A.length / CPS) / 0.2) : 0; return k > 0 ? <span style={{width: 70, height: 70, marginLeft: 6, borderRadius: '50%', background: 'radial-gradient(circle, rgba(160,190,255,0.55), rgba(90,130,255,0) 70%)', filter: 'blur(6px)', opacity: k}} /> : null; })()}
          </div>
        )}
      </AbsoluteFill>
      </AbsoluteFill>
      <div style={{opacity: mix(0, 0, eio(0))}} />
    </AbsoluteFill>
  );
};

if (checkContract(STAR_PILL_ANSWER_CONTRACT).length) throw new Error(checkContract(STAR_PILL_ANSWER_CONTRACT).join('；'));
export const StarPillAnswerCards: React.FC = () => <StarPillAnswerGroup />;
