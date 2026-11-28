// 【镜头组】logo-check-build-cta：白闪后硬切品牌色，毛玻璃方块里一笔笔"长"出标志（横条拉出 → 往右上长成勾 → 一颗点从左上落进来），
//   图标缩小左移、名字从图标后面抽出来，标语逐字打出、按钮弹出、网址打出；光标滑进来点一下按钮，两圈描边往外扩；品牌落版静看（023-I 一拍，收尾）
// 学的动作（baseTOP × Taskly 52.55–58.00s，60fps 逐帧看过；时间表 （内部拆片记录，未随项目提供））：
//   开头白 → 品牌蓝底 + 一团很虚的白方块光，0.1s 内收成毛玻璃方块；方块里的白色笔画像液体一样一段段长出来（先横拉、再往下 / 往外鼓出、最后一颗点从画外落进来）；
//   四周零星青柠色四角星一闪一灭；图标缩到一半、往左让，名字从图标后面逐字往右抽出；标语逐字，强调词青柠斜体；按钮从小弹出，网址逐字；
//   光标从下方滑进来停在按钮上 → 按下 → 两圈白色描边圈依次往外扩、变淡 → 光标淡出；落版静看。
//   标志本身是我们自己设计的"勾 + 点"（原片是它家的 T 形标，不照抄）；要放真产品时用 logo 输入换掉。
// 我们的内容：名字"小周"、标语"把事情，做完。"、按钮"免费试用"、网址 xiaozhou.app。
//
// 拍表（源秒，30fps）
//   拍 1 标志长出      0.00–0.75   白 → 品牌蓝 0.00–0.08；横条 0.10–0.25；长臂 0.30–0.55；点落进来 0.60–0.75
//   拍 2 名字 + 标语   1.00–2.05   图标缩小左移 + 名字 1.00–1.30；标语 1.30–1.55；按钮 1.55–1.70；网址 1.75–2.05
//   拍 3 点按钮        2.20–3.70   光标进 2.20–2.45；按下 2.60；描边圈 2.65–3.35；光标淡出 3.35–3.70
//   拍 4 落版          3.70–5.45   （停留点 4.50：品牌落版）
// 毛病清单：
//   - 通用：画面永远不停（背景光慢漂、全程极慢推近）；--hq 渲染；确定性
//   - 独有 1：笔画是"长"出来的（描边长度 + 端头圆滴），不是淡入
//   - 独有 2：名字从图标后面抽出，被图标右沿裁住，不是从空中淡入
//   - 独有 3：两圈描边圈晚 0.12s 依次扩，越往外越淡
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, Grain, Vignette, mix} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const LIME = '#d3f454';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const sm = (x: number) => { const c = clamp(x); return c * c * (3 - 2 * c); };
const rp = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const eob = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); const k = 1.6; return 1 + (k + 1) * Math.pow(c - 1, 3) + k * Math.pow(c - 1, 2); }; // 带一点回弹
const fx = (p: number) => 960 + (p * 14 - 700) * 1.1;
const fy = (p: number) => 540 + (p * 12 - 600) * 1.1;

// ═════════ 合同 ═════════
export const LOGO_CHECK_BUILD_CTA_CONTRACT: GroupContract = {
  sourceDuration: 163 / 30, // 5.433s
  fps: 30,
  motion: [[0, 3.7]],
  holds: [{at: 4.5, maxExtra: 2.5}], // 品牌落版
  landmarks: {cut: 0, bar: 0.1, arm: 0.3, dot: 0.6, logo: 0.75, name: 1.0, tagline: 1.3, button: 1.55, url: 1.75, cursor: 2.2, press: 2.6, ring: 2.65, settle: 3.7, exit: 163 / 30},
  sfx: [
    {at: 'cut', type: '落版重击', note: '低频 thump + 闪光（硬切品牌色）', tail: 0.4, volume: 0.45},
    {at: 'cut', type: '闪光', note: '低频 thump + 闪光（硬切品牌色）', tail: 0.4, volume: 0.45},
    {at: 'bar', type: '环境', note: '液体拉伸 / 黏连的轻声（笔画长出）', tail: 0.5, volume: 0.3},
    {at: 'dot', offset: 0.12, type: '弹出', note: '轻 pop（点落进来）', volume: 0.35},
    {at: 'name', type: '短甩', note: '轻 whoosh（名字抽出）', volume: 0.3},
    {at: 'tagline', type: '轻tick', note: '轻柔 tick 串（逐字）', tail: 0.4, volume: 0.2},
    {at: 'button', type: '弹出', note: '轻 pop（按钮弹出）', volume: 0.3},
    {at: 'press', type: '点击', note: '鼠标点击', volume: 0.35},
    {at: 'ring', type: '提示音', note: '上扬 chime（描边圈扩开）', tail: 0.8, volume: 0.3},
  ],
  inputs: {
    name: {maxChars: 4},
    tagA: {maxChars: 4},
    tagB: {maxChars: 4},
    button: {maxChars: 4},
    url: {maxChars: 16},
  },
};
export type LogoCtaInputs = {
  name: string; // 产品名
  tagA: string; tagB: string; // 标语前半（白）+ 后半（强调色斜体）
  button: string; url: string;
  brandColor?: string; // 底色（品牌深色，冷暖都行，白字要看得清）
  accent?: string; // 强调色（标语后半、按钮、星星），默认青柠
  logo?: React.ReactNode; // 换真标志：画在 0–100 的方框里，白色；不给就用"勾 + 点"
};
export const LOGO_CTA_DEFAULT_INPUTS: LogoCtaInputs = {name: '小周', tagA: '把事情，', tagB: '做完。', button: '免费试用', url: 'xiaozhou.app'};
export function checkLogoCtaInputs(x: LogoCtaInputs): string[] {
  return checkInputs(LOGO_CHECK_BUILD_CTA_CONTRACT, {name: x.name, tagA: x.tagA, tagB: x.tagB, button: x.button, url: x.url});
}
export const planLogoCta = (sec: number) => planExtras(LOGO_CHECK_BUILD_CTA_CONTRACT, sec);
export const logoCtaFrames = (extras: number[]) => Math.round(outputDuration(LOGO_CHECK_BUILD_CTA_CONTRACT, extras) * FPS);
export const LOGO_CHECK_BUILD_CTA_DURATION = 163;

// ═════════ 背景：品牌蓝 + 中间亮光 + 底部几道斜向淡光，按输出秒慢漂 ═════════
const Brand: React.FC<{t: number; c: string}> = ({t, c}) => (
  <AbsoluteFill style={{overflow: 'hidden', background: c}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse 55% 60% at ${50 + Math.sin(t * 0.4) * 2}% 40%, rgba(150,160,255,0.55) 0%, rgba(120,130,250,0.2) 50%, rgba(0,0,0,0) 80%)`}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,20,120,0.35) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(20,20,90,0.25) 100%)'}} />
    {[0, 1, 2].map((i) => (
      <div key={i} style={{position: 'absolute', left: `${-10 + i * 30 + t * 0.8}%`, top: `${58 + i * 8}%`, width: '60%', height: '22%', borderRadius: '50%', transform: 'rotate(-14deg)',
        background: 'radial-gradient(ellipse at center, rgba(170,180,255,0.16) 0%, rgba(170,180,255,0) 70%)'}} />
    ))}
    <Vignette strength={0.22} color="#0b0f4a" inner={0.45} />
    <Grain opacity={0.05} />
  </AbsoluteFill>
);

// ═════════ 标志：勾 + 点（0–100 方框）═════════
// 短臂 A(26,54) → 拐点 B(42,70)；长臂 B → C(76,34)；点 D(30,28)
const seg = (u: number, a: [number, number], b: [number, number]): [number, number] => [mix(a[0], b[0], u), mix(a[1], b[1], u)];
const Mark: React.FC<{s: number}> = ({s}) => {
  const A: [number, number] = [26, 54], B: [number, number] = [42, 70], Cc: [number, number] = [76, 34];
  // 横条：从拐点处一颗小圆往左上拉出（端头带圆滴）
  const ua = eo(s, 0.1, 0.25);
  const ub = eo(s, 0.3, 0.55);
  const pa = seg(ua, B, A);
  const pb = seg(ub, B, Cc);
  const blobA = s >= 0.1 && ua < 0.98 ? 1.25 - 0.25 * ua : 1; // 拉的时候端头鼓一点
  const blobB = s >= 0.3 && ub < 0.98 ? 1.3 - 0.3 * ub : 1;
  // 点：从左上画外落进来（越来越实）
  const ud = eo(s, 0.6, 0.75);
  const dx = mix(-30, 30, ud), dy = mix(-60, 28, eob(s, 0.6, 0.75));
  const dop = clamp((s - 0.6) / 0.08);
  const W = 15;
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" style={{overflow: 'visible'}}>
      {s >= 0.1 && <line x1={B[0]} y1={B[1]} x2={pa[0]} y2={pa[1]} stroke="#fff" strokeWidth={W} strokeLinecap="round" />}
      {s >= 0.1 && <circle cx={pa[0]} cy={pa[1]} r={(W / 2) * blobA} fill="#fff" />}
      {s >= 0.3 && <line x1={B[0]} y1={B[1]} x2={pb[0]} y2={pb[1]} stroke="#fff" strokeWidth={W} strokeLinecap="round" />}
      {s >= 0.3 && <circle cx={pb[0]} cy={pb[1]} r={(W / 2) * blobB} fill="#fff" />}
      {s >= 0.6 && <circle cx={dx} cy={dy} r={8.5} fill="#fff" opacity={dop} style={{filter: ud < 0.9 ? `blur(${(2 * (1 - ud)).toFixed(2)}px)` : undefined}} />}
    </svg>
  );
};

const Sparkle: React.FC<{x: number; y: number; t0: number; s: number; size?: number; c: string}> = ({x, y, t0, s, size = 16, c}) => {
  const u = (s - t0) / 0.45;
  if (u < 0 || u > 1) return null;
  const k = Math.sin(Math.PI * u);
  return (
    <svg width={size} height={size} viewBox="-10 -10 20 20" style={{position: 'absolute', left: x - size / 2, top: y - size / 2, opacity: k, transform: `scale(${(0.4 + 0.6 * k).toFixed(3)}) rotate(${(u * 40).toFixed(1)}deg)`}}>
      <path d="M0 -10 L2 -2 L10 0 L2 2 L0 10 L-2 2 L-10 0 L-2 -2 Z" fill={c} />
    </svg>
  );
};
const Arrow: React.FC<{x: number; y: number; op?: number}> = ({x, y, op = 1}) => (
  <svg width="40" height="56" viewBox="-2 -2 30 42" style={{position: 'absolute', left: x - 2.7, top: y - 2.7, opacity: op, overflow: 'visible', filter: 'drop-shadow(0 3px 4px rgba(10,14,60,0.35))'}}>
    <path d="M0 0 L0 30 L7.2 23.4 L12 34.2 L16.6 32.2 L11.9 21.6 L21.6 21.6 Z" fill="#111" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

// ═════════ 布局 ═════════
const ICON_BIG = 330, ICON_SMALL = 176;
const LOGO_Y = fy(38), GROUP_Y = fy(39.5);
const NAME_F = 132, GAP = 30;
const TAG_Y = fy(55.5), TAG_F = 54;
const BTN_Y = fy(68.4), BTN_H = 66;
const wOf = (s: string, px: number) => Array.from(s).reduce((a, c) => a + (/[\u0000-ÿ]/.test(c) ? 0.56 : 1) * px, 0);

export type LogoCtaProps = {inputs?: LogoCtaInputs; extras?: number[]};
export const LogoCheckBuildCtaGroup: React.FC<LogoCtaProps> = ({inputs = LOGO_CTA_DEFAULT_INPUTS, extras = [0]}) => {
  const C = LOGO_CHECK_BUILD_CTA_CONTRACT;
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, C, extras);
  const hd = Math.max(0, t - s);
  const bg = inputs.brandColor ?? '#3340d8';
  const acc = inputs.accent ?? LIME;
  // 开头：白 → 品牌色
  const white = 1 - eo(s, 0.0, 0.14); // 白闪退得有尾巴
  // 图标
  const iconIn = eo(s, 0.03, 0.22);
  const iconBlur = 18 * (1 - iconIn);
  const shrink = eo(s, 1.05, 1.35);
  const nameW = wOf(inputs.name, NAME_F);
  const groupW = ICON_SMALL + GAP + nameW;
  const smallCx = 960 - groupW / 2 + ICON_SMALL / 2;
  const iconSize = mix(ICON_BIG, ICON_SMALL, shrink);
  const iconCx = mix(960, smallCx, shrink), iconCy = mix(LOGO_Y, GROUP_Y, shrink);
  const nameLeft = smallCx + ICON_SMALL / 2 + GAP;
  // 名字：从图标后面逐字往右抽出（被图标右沿裁住）
  const nameChars = Array.from(inputs.name);
  // 标语
  const tagChars = [...Array.from(inputs.tagA).map((c) => ({c, em: false})), ...Array.from(inputs.tagB).map((c) => ({c, em: true}))];
  const tagW = wOf(inputs.tagA, TAG_F) + wOf(inputs.tagB, TAG_F);
  const tagLeft = 960 - tagW / 2;
  // 按钮 + 网址
  const btnW = wOf(inputs.button, 28) + 64;
  const urlW = wOf(inputs.url, 24);
  const rowW = btnW + 26 + urlW;
  const btnL = 960 - rowW / 2;
  const btnIn = eob(s, 1.55, 1.7);
  const press = s < 2.6 ? 1 : s < 2.66 ? mix(1, 0.94, (s - 2.6) / 0.06) : mix(0.94, 1, eo(s, 2.66, 2.8));
  const urlChars = Array.from(inputs.url);
  // 光标
  const cp = eo(s, 2.2, 2.45);
  const curX = mix(fx(52), btnL + btnW * 0.62, cp) + 3 * rp(s, 3.35, 3.7);
  const curY = mix(fy(92), BTN_Y + 10, cp) + 18 * rp(s, 3.35, 3.7);
  const curOp = clamp((s - 2.2) / 0.08) * (1 - rp(s, 3.35, 3.7));
  const push = 1 + 0.004 * t + 0.01 * hd;
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      <Brand t={t} c={bg} />
      <AbsoluteFill style={{transform: `scale(${push.toFixed(5)})`, transformOrigin: '960px 540px'}}>
        {/* 星星 */}
        <Sparkle s={s} x={fx(28)} y={fy(30)} t0={0.85} c={acc} />
        <Sparkle s={s} x={fx(71)} y={fy(33)} t0={1.15} c={acc} size={14} />
        <Sparkle s={s} x={fx(39)} y={fy(49)} t0={1.35} c={acc} size={12} />
        <Sparkle s={s} x={fx(68)} y={fy(47)} t0={1.6} c={acc} size={12} />
        {/* 名字（在图标下层，被图标盖住的部分看不见） */}
        {s >= 1.0 && (
          <div style={{position: 'absolute', left: nameLeft, top: GROUP_Y - NAME_F * 0.62, height: NAME_F * 1.3, overflow: 'visible', whiteSpace: 'pre', fontSize: NAME_F, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em'}}>
            {nameChars.map((ch, i) => {
              const t0 = 1.02 + i * (0.22 / Math.max(1, nameChars.length));
              const k = eo(s, t0, t0 + 0.18);
              return <span key={i} style={{display: 'inline-block', opacity: clamp((s - t0) / 0.06), transform: `translateX(${(-90 * (1 - k)).toFixed(2)}px)`, filter: k < 0.95 ? `blur(${(3 * (1 - k)).toFixed(2)}px)` : undefined}}>{ch}</span>;
            })}
          </div>
        )}
        {/* 图标：毛玻璃方块 */}
        <div style={{position: 'absolute', left: iconCx - iconSize / 2, top: iconCy - iconSize / 2, width: iconSize, height: iconSize, borderRadius: iconSize * 0.24,
          background: `linear-gradient(160deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.14) 100%)`, border: '1.5px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)',
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.45), 0 20px 50px rgba(10,15,90,0.25), 0 0 ${(80 * (1 - iconIn)).toFixed(0)}px rgba(255,255,255,${(0.6 * (1 - iconIn)).toFixed(3)})`,
          opacity: iconIn, filter: iconBlur > 0.3 ? `blur(${iconBlur.toFixed(2)}px)` : undefined, transform: `scale(${mix(1.15, 1, iconIn).toFixed(4)})`}}>
          <div style={{position: 'absolute', inset: '17%'}}>{inputs.logo ?? <Mark s={s} />}</div>
        </div>
        {/* 标语 */}
        <div style={{position: 'absolute', left: tagLeft, top: TAG_Y - TAG_F * 0.66, fontSize: TAG_F, lineHeight: `${TAG_F * 1.32}px`, fontWeight: 500, whiteSpace: 'pre'}}>
          {tagChars.map(({c, em}, i) => {
            const t0 = 1.3 + i * (0.25 / Math.max(1, tagChars.length));
            if (s < t0) return <span key={i} style={{display: 'inline-block', opacity: 0}}>{c}</span>;
            const k = eo(s, t0, t0 + 0.1);
            return <span key={i} style={{display: 'inline-block', color: em ? acc : 'rgba(255,255,255,0.95)', opacity: 0.3 + 0.7 * k, transform: `translateY(${(8 * (1 - k)).toFixed(2)}px)${em ? ' skewX(-9deg)' : ''}`}}>{c}</span>;
          })}
        </div>
        {/* 按钮 */}
        {s >= 1.55 && (
          <div style={{position: 'absolute', left: btnL, top: BTN_Y - BTN_H / 2, width: btnW, height: BTN_H, borderRadius: BTN_H, background: acc, transform: `scale(${(Math.max(0, btnIn) * press).toFixed(4)})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#1d2405', whiteSpace: 'pre', boxShadow: '0 10px 26px rgba(20,30,10,0.25)', opacity: clamp((s - 1.55) / 0.06)}}>{inputs.button}</div>
        )}
        {/* 描边圈 ×2 */}
        {[0, 1].map((i) => {
          const u = (s - 2.65 - i * 0.12) / 0.6;
          if (u < 0 || u > 1) return null;
          const g = 6 + 34 * eo(u, 0, 1) + i * 6;
          return <div key={i} style={{position: 'absolute', left: btnL - g, top: BTN_Y - BTN_H / 2 - g, width: btnW + g * 2, height: BTN_H + g * 2, borderRadius: BTN_H + g * 2,
            border: `2px solid rgba(255,255,255,${((0.75 - 0.25 * i) * (1 - sm(u))).toFixed(3)})`}} />;
        })}
        <Sparkle s={s} x={btnL + btnW + 4} y={BTN_Y - BTN_H / 2 - 10} t0={2.8} c={acc} size={14} />
        {/* 网址 */}
        <div style={{position: 'absolute', left: btnL + btnW + 26, top: BTN_Y - 16, fontSize: 24, fontWeight: 500, color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre'}}>
          {urlChars.map((c, i) => <span key={i} style={{opacity: s >= 1.75 + i * (0.3 / Math.max(1, urlChars.length)) ? 1 : 0}}>{c}</span>)}
        </div>
        {curOp > 0.01 && <Arrow x={curX} y={curY} op={curOp} />}
      </AbsoluteFill>
      {white > 0.003 && <AbsoluteFill style={{background: '#fff', opacity: white}} />}
    </AbsoluteFill>
  );
};
export const LogoCheckBuildCta: React.FC = () => <LogoCheckBuildCtaGroup />;

if (checkContract(LOGO_CHECK_BUILD_CTA_CONTRACT).length) throw new Error(checkContract(LOGO_CHECK_BUILD_CTA_CONTRACT).join('; '));
