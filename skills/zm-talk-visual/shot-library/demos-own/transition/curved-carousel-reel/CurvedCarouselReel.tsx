// 弯曲空间卡片轮播（005 整片，46 秒）
// 学的动作（来自 @Jerrythe2d · 多支发布片轮播 0:00–0:46，逐秒 + 测速看过）：
//   观众站在一个圆筒里面往外看：一排卡片贴着圆筒内壁一直从右往左滑；
//   正中的卡是平的，越往两边越被拉高、拉宽、横向拖虚，上下边缘出现青 / 紫 / 黄的色散；
//   每张卡底下的地面有一团同色的软影子；滑动大部分时间匀速（原片实测 ~180px/s），中间有几次"甩一下"的加速；
//   每张卡里面在演一个小场景（列表、改词、Logo、搜索框……），卡滑到中间时正好演到高潮。
// 原片是作品集（每张卡是别人的产品片）；我们只学外框和节奏，卡里换成"逐梦的剪辑 skills"的一条完整小故事：
//   痛点（剪辑台 / 需求列表）→ 要是能一句话？→ Logo 登场 → 一句话出片 → 工具全收进来 → 像素翻出 Logo
//   → 只要 10 分钟 → 打一句话出结果 → 不用一帧帧对 → 口播·字幕·包装飘带 → 找爆点 → 封面 → 一句话交给我 → 收尾 Logo（停住）
// 做法：真 3D——每张卡切成竖条，竖条贴在半径 R 的圆筒上（相机在圆心，R = 透视距离），
//   于是投影后中间 1:1、两边按 1/cosθ 自然变高（不是假的缩放）；色散用竖向 drop-shadow，横向拖虚用 SVG 单向模糊。
//
// 时间表（30fps，共 1380f）：
//   0–1230 匀速滑（~7.7px/f）+ 3 次甩动（f 380 / 620 / 880，峰值 +30px/f）
//   1230–1290 减速，最后一张 Logo 卡停在正中；1290–1380 停住 3 秒
// 毛病清单（自查表通用项 + 本镜头独有）：
//   - 独有 1：切条之间不能有缝（每条多盖 1.5px；模糊放在条内部的内容上，不放在条上，否则条边会透出竖线）
//   - 独有 2：卡里的小场景必须在卡经过正中那 3–4 秒里演完高潮，太早太晚都看不清
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, FONT, Grain, mix, ramp} from '../../../kit/polish';

export const CURVED_CAROUSEL_REEL_DURATION = 1380;

const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const SERIF = `"Songti SC", "Noto Serif SC", "Source Han Serif SC", serif`;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const typed = (s: string, lt: number, start: number, per = 3) => Array.from(s).slice(0, clamp(Math.floor((lt - start) / per), 0, s.length)).join('');
const H = 520;
const INK = '#16151c';
const ACCENT = '#5b5cf0';

type Variant = 1 | 2;
type Cfg = {P: number; bg: string; chroma: number; base: number};
const CFG: Record<Variant, Cfg> = {
  // 1：备选，照原片——浅灰空间、弯得比较深、色散明显
  1: {P: 900, bg: '#ececee', chroma: 1, base: 1},
  // 2：正式版（用户选的）——弯得浅一点、色散收一点，暖白空间，更"产品片"一些
  2: {P: 1150, bg: '#f1eee9', chroma: 0.6, base: 1},
};

// ───────── 小件 ─────────
const Mark: React.FC<{size: number; ink?: string; accent?: string; draw?: number; star?: number}> = ({size, ink = INK, accent = ACCENT, draw = 1, star = 1}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{display: 'block', overflow: 'visible'}}>
    <circle cx="50" cy="50" r="41" fill="none" stroke={ink} strokeWidth="8.5" strokeLinecap="round" strokeDasharray="257.6" strokeDashoffset={(257.6 * (1 - draw)).toFixed(1)} transform="rotate(-90 50 50)" />
    <g transform={`translate(50 50) scale(${star.toFixed(3)})`}>
      <path d="M0 -24 C3 -6 6 -3 24 0 C6 3 3 6 0 24 C-3 6 -6 3 -24 0 C-6 -3 -3 -6 0 -24 Z" fill={accent} />
    </g>
  </svg>
);
const Arrow: React.FC<{x: number; y: number; press?: number}> = ({x, y, press = 0}) => (
  <svg width="44" height="52" viewBox="0 0 22 26" style={{position: 'absolute', left: x, top: y, transform: `scale(${1 - press * 0.15})`, transformOrigin: '0 0', filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.25))'}}>
    <path d="M2 2 L2 20 L7 15.5 L10.5 23 L13.5 21.6 L10 14.3 L17 14 Z" fill="#111" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
const Caret: React.FC<{lt: number; color?: string; h?: number}> = ({lt, color = INK, h = 44}) => (
  <span style={{display: 'inline-block', width: 3, height: h, marginLeft: 3, background: color, verticalAlign: 'middle', opacity: Math.floor(lt / 14) % 2 ? 0.15 : 1}} />
);
const Scissors: React.FC<{s: number; c?: string}> = ({s, c = '#fff'}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" /></svg>
);
const hash = (i: number, n: number) => { const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };

// ───────── 卡里的小场景（lt = 卡进入中间区域起算的本地帧，0 时卡心在正中右边 450px） ─────────
type Scene = React.FC<{lt: number; w: number}>;

// 0 剪辑台：轨道上的片段一直往左走
const SceneTimeline: Scene = ({lt, w}) => {
  const rows = [['#5b5cf0', '#7c7df5'], ['#ff8a5b', '#ffb08f'], ['#2fbf8f', '#7fdcbc'], ['#e6c84f', '#f2dd8a']];
  return (
    <AbsoluteFill style={{background: '#0d0e16', padding: '70px 0'}}>
      <div style={{position: 'absolute', left: 48, top: 40, color: '#9a9cb5', fontFamily: SANS, fontSize: 32, fontWeight: 600}}>剪辑台 · 第 37 版</div>
      {rows.map((c, r) => (
        <div key={r} style={{position: 'absolute', left: 0, right: 0, top: 120 + r * 86, height: 62}}>
          {Array.from({length: 9}, (_, k) => {
            const cw = 120 + hash(k + r * 9, 1) * 180;
            const x = ((k * 230 + r * 70 - lt * (2.2 + r * 0.4)) % 2070 + 2070) % 2070 - 300;
            return <div key={k} style={{position: 'absolute', left: x, width: cw, top: 0, height: 62, borderRadius: 10, background: `linear-gradient(180deg, ${c[1]}, ${c[0]})`, opacity: 0.9}} />;
          })}
        </div>
      ))}
      <div style={{position: 'absolute', left: w * 0.46, top: 96, width: 4, height: 360, background: '#ff4d6a', boxShadow: '0 0 12px #ff4d6a'}} />
    </AbsoluteFill>
  );
};

// 1 需求列表一直往上滚，其中一条被高亮（005-01）
const NEEDS = ['字幕又没对齐', 'BGM 卡不上点', '口播剪了 3 小时', '封面不会做', '导出又失败', '素材找不到', '改稿改到半夜', '字幕又没对齐', 'BGM 卡不上点'];
const SceneNeeds: Scene = ({lt, w}) => {
  const y = 150 - (lt + 140) * 1.3;
  const hi = ramp(lt, 40, 14, EASE.overshoot);
  return (
    <AbsoluteFill style={{background: '#fffbe8', fontFamily: SANS}}>
      <svg width={w} height={H} style={{position: 'absolute'}}>
        {[180, 300, 420, 540].map((r) => <circle key={r} cx={w / 2} cy={H / 2} r={r} fill="none" stroke="#e8e0b8" strokeWidth="2" />)}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
        {NEEDS.map((t, i) => {
          const isHi = i === 2;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '12px 26px 12px 14px', border: '2.5px solid #222', borderRadius: 6, background: isHi ? `rgba(255,226,92,${hi})` : '#fff', fontSize: 40, fontWeight: 600, color: INK, transform: `scale(${isHi ? 1 + hi * 0.08 : 1})`, boxShadow: isHi ? `0 10px 24px rgba(160,120,0,${0.25 * hi})` : undefined}}>
              <div style={{width: 46, height: 46, borderRadius: 8, background: `hsl(${(i * 47) % 360} 60% 62%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 26}}>{t[0]}</div>
              {t}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 2 光标改词：要是剪辑，只要 [三小时 → 一句话]？（005-02）
const SceneChangeWord: Scene = ({lt}) => {
  const sel = ramp(lt, 44, 12, EASE.out);
  const del = lt >= 60;
  const word = del ? typed('一句话', lt, 64, 5) : '三小时';
  const mv = ramp(lt, 14, 28, EASE.smooth);
  return (
    <AbsoluteFill style={{background: '#ffffff', fontFamily: SERIF, color: INK, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{fontSize: 84, lineHeight: 1.3, textAlign: 'center'}}>
        <div>要是剪辑，</div>
        <div>
          只要
          <span style={{position: 'relative', display: 'inline-block', minWidth: 60, padding: '0 6px', color: del ? ACCENT : INK}}>
            {!del && <span style={{position: 'absolute', left: 0, top: 8, bottom: 8, width: `${sel * 100}%`, background: 'rgba(91,92,240,0.22)'}} />}
            <span style={{position: 'relative'}}>{word}</span>
            {del && lt < 100 && <Caret lt={lt} color={ACCENT} h={72} />}
            <Arrow x={mix(-360, 40, mv)} y={mix(180, 70, mv)} press={lt > 40 && lt < 46 ? 1 : 0} />
          </span>
          ？
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 3 Logo 一笔画出 → 品牌名擦出（005-03）
const SceneLogoDraw: Scene = ({lt}) => {
  const draw = ramp(lt, 8, 30, EASE.smooth);
  const star = ramp(lt, 32, 16, EASE.overshoot);
  const wipe = ramp(lt, 42, 26, EASE.out);
  return (
    <AbsoluteFill style={{background: '#ffffff', fontFamily: SANS, justifyContent: 'center', alignItems: 'center', gap: 30, flexDirection: 'row'}}>
      <Mark size={140} draw={draw} star={star} />
      <div style={{fontSize: 68, fontWeight: 700, color: INK, letterSpacing: '-0.02em', clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`, transform: `translateX(${(1 - wipe) * -30}px)`}}>逐梦的剪辑<br />skills</div>
    </AbsoluteFill>
  );
};

// 4 词中间插进一个图标：一句话 [✂] 出片（005-04）
const SceneInsertIcon: Scene = ({lt}) => {
  const open = ramp(lt, 30, 16, EASE.swift);
  const pop = ramp(lt, 36, 18, EASE.overshoot);
  const inT = ramp(lt, 4, 18, EASE.out);
  return (
    <AbsoluteFill style={{background: '#f2f5ff', fontFamily: SANS, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', fontSize: 104, fontWeight: 700, color: INK, letterSpacing: '-0.03em', opacity: inT, transform: `translateY(${(1 - inT) * 20}px)`}}>
        一句话
        <span style={{display: 'inline-flex', justifyContent: 'center', width: open * 150, overflow: 'visible'}}>
          <span style={{width: 110, height: 110, borderRadius: 30, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop}) rotate(${(1 - pop) * -30}deg)`, boxShadow: '0 14px 30px rgba(91,92,240,0.35)'}}><Scissors s={64} /></span>
        </span>
        出片
      </div>
    </AbsoluteFill>
  );
};

// 5 一圈工具图标收拢到中间（005-05）
const TOOLS: [string, string, string][] = [['剪', '#111', '#fff'], ['字', '#ff5a5f', '#fff'], ['音', '#1db954', '#fff'], ['Ae', '#00005b', '#9999ff'], ['Pr', '#2a0052', '#e0aaff'], ['封', '#ffb400', '#fff'], ['转', '#00a3ff', '#fff'], ['调', '#ff7a00', '#fff'], ['贴', '#7a5cff', '#fff'], ['导', '#22c55e', '#fff']];
const SceneConverge: Scene = ({lt, w}) => {
  const k = ramp(lt, 22, 44, EASE.smooth);
  const txt = ramp(lt, 48, 18, EASE.out);
  return (
    <AbsoluteFill style={{background: '#fff8ec', fontFamily: SANS}}>
      {TOOLS.map(([g, bg, fg], i) => {
        const a = (i / TOOLS.length) * Math.PI * 2 + lt * 0.012;
        const rx = mix(330, 250, k), ry = mix(200, 168, k);
        const s = mix(1, 0.86, k);
        return (
          <div key={i} style={{position: 'absolute', left: w / 2 + Math.cos(a) * rx - 40, top: H / 2 + Math.sin(a) * ry - 40, width: 80, height: 80, borderRadius: 22, background: bg, color: fg, fontSize: 34, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${s})`, boxShadow: '0 8px 18px rgba(0,0,0,0.14)'}}>{g}</div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: H / 2 - 34, textAlign: 'center', fontSize: 54, fontWeight: 700, color: '#d9822b', opacity: txt, transform: `scale(${mix(0.9, 1, txt)})`}}>全收进一个对话</div>
    </AbsoluteFill>
  );
};

// 6 像素格一格格翻过来 → Logo（005-07）
const SceneTiles: Scene = ({lt, w}) => {
  const C = 12, R = 8, tw = w / C, th = H / R;
  const logo = ramp(lt, 54, 18, EASE.overshoot);
  return (
    <AbsoluteFill style={{background: '#0c0d1a'}}>
      {Array.from({length: C * R}, (_, n) => {
        const i = n % C, j = Math.floor(n / C);
        const d = (i + j) * 1.6 + hash(n, 3) * 10;
        const p = ramp(lt, 6 + d, 12, EASE.smooth);
        const sx = Math.abs(Math.cos(p * Math.PI));
        const on = p > 0.5;
        return <div key={n} style={{position: 'absolute', left: i * tw + 2, top: j * th + 2, width: tw - 4, height: th - 4, borderRadius: 6, background: on ? `hsl(239 ${80 - hash(n, 5) * 14}% ${60 + hash(n, 6) * 8}%)` : '#1a1c33', transform: `scaleX(${Math.max(0.04, sx).toFixed(3)})`}} />;
      })}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 26, opacity: clamp(logo * 2), transform: `scale(${mix(0.8, 1, logo)})`, fontFamily: SANS}}>
        <Mark size={130} ink="#fff" accent="#ffd25a" />
        <div style={{fontSize: 72, fontWeight: 800, color: '#fff'}}>逐梦</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 7 衬线大字 + 手写涂线 + 数字往下滚到 10 分钟（005-09）
const SceneTenMin: Scene = ({lt, w}) => {
  const line = ramp(lt, 26, 20, EASE.smooth);
  const n = Math.round(mix(180, 10, ramp(lt, 40, 40, EASE.out)));
  const done = n === 10;
  return (
    <AbsoluteFill style={{background: '#f6efe3', fontFamily: SERIF, color: INK, alignItems: 'center', paddingTop: 70}}>
      <div style={{fontSize: 68}}>剪一条片子，只要</div>
      <svg width={w} height={60} style={{marginTop: -6}}>
        <path d={`M ${w / 2 - 250} 30 C ${w / 2 - 120} 6, ${w / 2 - 20} 52, ${w / 2 + 80} 24 S ${w / 2 + 210} 18, ${w / 2 + 250} 34`} fill="none" stroke="#1f9d55" strokeWidth="9" strokeLinecap="round" strokeDasharray="560" strokeDashoffset={560 * (1 - line)} />
      </svg>
      <div style={{fontSize: 170, lineHeight: 1, marginTop: 10, fontVariantNumeric: 'tabular-nums', color: done ? '#1f9d55' : INK, transform: `scale(${done ? 1 + 0.04 * (1 - ramp(lt, 80, 10, EASE.out)) : 1})`}}>
        {n}<span style={{fontSize: 70, marginLeft: 14}}>分钟</span>
      </div>
    </AbsoluteFill>
  );
};

// 8 打一句话 → 点发送 → 结果一条条弹出（005-10/11）
const SceneSearch: Scene = ({lt, w}) => {
  const q = typed('把这段口播剪成 60 秒', lt, -14, 2);
  const mv = ramp(lt, 8, 16, EASE.smooth);
  const press = lt >= 24 && lt < 30 ? 1 : 0;
  const res = ['去掉口误和停顿', '自动配好字幕', '套上包装模板'];
  return (
    <AbsoluteFill style={{background: '#ffffff', fontFamily: SANS, padding: '56px 60px'}}>
      <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 16, height: 96, padding: '0 20px 0 26px', borderRadius: 20, border: '2px solid #e3e6ef', boxShadow: '0 10px 30px rgba(30,40,80,0.08)', fontSize: 38, color: INK}}>
        <span style={{color: ACCENT, fontSize: 40}}>✦</span>
        <span style={{flex: 1}}>{q}{lt < 24 && <Caret lt={lt} h={40} />}</span>
        <div style={{width: 64, height: 64, borderRadius: 16, background: q.length > 10 ? ACCENT : '#d7dae6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 34, transform: `scale(${1 - press * 0.1})`}}>↑</div>
        <Arrow x={mix(w * 0.2, w - 160, mv)} y={mix(220, 40, mv)} press={press} />
      </div>
      <div style={{marginTop: 30, display: 'flex', flexDirection: 'column', gap: 16}}>
        {res.map((t, i) => {
          const p = ramp(lt, 32 + i * 8, 16, EASE.overshoot);
          return (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 16, height: 76, padding: '0 24px', borderRadius: 16, background: '#f5f6fb', fontSize: 36, color: INK, opacity: clamp(p * 1.5), transform: `translateY(${(1 - p) * 40}px)`}}>
              <span style={{width: 40, height: 40, borderRadius: 20, background: '#22c55e', color: '#fff', fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✓</span>{t}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 9 深色底 + 橙色弧形 + 胶囊字，小星币飞进来（005-12）
const ScenePill: Scene = ({lt, w}) => {
  const blob = ramp(lt, 0, 40, EASE.smooth);
  const txt = '不用再一帧一帧对';
  return (
    <AbsoluteFill style={{background: '#160a22', fontFamily: SANS, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: mix(w, w * 0.42, blob), top: -120, width: 900, height: 900, borderRadius: '50%', background: 'linear-gradient(160deg, #ffb347, #f0743e)'}} />
      <div style={{position: 'absolute', left: 60, right: 60, top: H / 2 - 48, height: 96, borderRadius: 48, background: '#1d0f2b', display: 'flex', alignItems: 'center', padding: '0 20px 0 40px', boxShadow: '0 20px 40px rgba(0,0,0,0.35)'}}>
        <div style={{flex: 1, fontSize: 46, fontWeight: 600, color: '#fff', letterSpacing: '0.04em'}}>
          {Array.from(txt).map((c, i) => <span key={i} style={{opacity: ramp(lt, 18 + i * 3, 10, EASE.out)}}>{c}</span>)}
        </div>
        <div style={{width: 66, height: 66, borderRadius: 33, background: '#f39a3d', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${ramp(lt, 46, 14, EASE.overshoot)})`}}><Scissors s={38} c="#1d0f2b" /></div>
      </div>
      {[0, 1, 2].map((i) => {
        const p = ramp(lt, 4 + i * 6, 30, EASE.smooth);
        return <div key={i} style={{position: 'absolute', left: mix(-80, w - 160 - i * 70, p), top: mix(60 + i * 40, H / 2 - 120 - Math.sin(p * Math.PI) * 60, p), width: 58, height: 58, borderRadius: 29, background: 'radial-gradient(circle at 35% 30%, #fff3a8, #f2c230 60%, #c98f12)', color: '#7a4b00', fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1 - ramp(lt, 40 + i * 4, 8)}}>✦</div>;
      })}
    </AbsoluteFill>
  );
};

// 10 卷曲飘带上的字一直流（005-13）
const SceneRibbon: Scene = ({lt, w}) => {
  const d = `M -60 330 C 160 110, 380 470, 600 250 S ${w - 60} 120, ${w + 80} 300`;
  const words = '口播 · 字幕 · 包装 · 封面 · 配乐 · '.repeat(4);
  return (
    <AbsoluteFill style={{background: '#ffffff'}}>
      <svg width={w} height={H} style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="rbg" x1="0" x2="1"><stop offset="0" stopColor="#4b1fa8" /><stop offset="0.5" stopColor="#7a3cff" /><stop offset="1" stopColor="#3a137f" /></linearGradient>
          <path id="rbp" d={d} />
        </defs>
        <path d={d} fill="none" stroke="#f0a43a" strokeWidth="128" strokeLinecap="butt" transform="translate(0 8)" opacity="0.9" />
        <path d={d} fill="none" stroke="url(#rbg)" strokeWidth="116" />
        <text fontFamily={SANS} fontSize="50" fontWeight="700" fill="#ffd36b" dy="17">
          <textPath href="#rbp" startOffset={-((lt * 5) % 640) - 40}>{words}</textPath>
        </text>
      </svg>
    </AbsoluteFill>
  );
};

// 11 选中文字，拖手柄（005-14）
const SceneSelect: Scene = ({lt}) => {
  const p = ramp(lt, 22, 30, EASE.smooth);
  const burst = ramp(lt, 54, 16, EASE.overshoot);
  return (
    <AbsoluteFill style={{background: '#faf8ff', fontFamily: SANS, justifyContent: 'center', alignItems: 'center', color: INK}}>
      <div style={{fontSize: 56, fontWeight: 500, color: '#5a5670'}}>AI 帮你找到每一个</div>
      <div style={{position: 'relative', fontSize: 150, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 6}}>
        <span style={{position: 'absolute', left: -8, top: 18, bottom: 18, width: `calc(${p * 100}% + 16px)`, background: 'rgba(122,92,255,0.25)'}} />
        <span style={{position: 'relative'}}>爆点</span>
        {[0, 1].map((k) => (
          <div key={k} style={{position: 'absolute', left: k === 0 ? -10 : `calc(${p * 100}% + 6px)`, top: 14, width: 4, height: 150, background: '#6b4dff'}}>
            <div style={{position: 'absolute', left: -9, [k === 0 ? 'top' : 'bottom']: -18, width: 22, height: 22, borderRadius: 11, background: '#6b4dff'}} />
          </div>
        ))}
        <svg width="90" height="90" viewBox="-50 -50 100 100" style={{position: 'absolute', right: -90, top: -30, transform: `scale(${burst}) rotate(${lt * 2}deg)`}}>
          <path d={Array.from({length: 16}, (_, i) => { const r = i % 2 ? 22 : 46; const a = (i / 16) * Math.PI * 2; return `${i ? 'L' : 'M'} ${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`; }).join(' ') + ' Z'} fill="#a855f7" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// 12 渐变大字"封面" + 弧形色带扫过（005-16）
const SceneThumbs: Scene = ({lt, w}) => {
  const rot = mix(-70, 40, ramp(lt, 0, 110, EASE.smooth));
  const t = ramp(lt, 16, 22, EASE.out);
  return (
    <AbsoluteFill style={{background: '#090b16', fontFamily: SANS, overflow: 'hidden', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{position: 'absolute', left: w / 2 - 700, top: H - 120, width: 1400, height: 1400, borderRadius: '50%', border: '70px solid transparent', borderTopColor: '#3b6cff', borderLeftColor: '#7a3cff', transform: `rotate(${rot}deg)`, filter: 'blur(14px)', opacity: 0.85}} />
      <div style={{fontSize: 190, fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #7fb2ff, #c6a2ff 50%, #ffffff)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', opacity: t, transform: `translateY(${(1 - t) * 30}px)`}}>封面</div>
      <div style={{fontSize: 38, color: '#aab4d6', marginTop: -10, opacity: ramp(lt, 30, 16)}}>一键出 3 版，挑一个就行</div>
    </AbsoluteFill>
  );
};

// 13 深色输入框打字（005-17）
const ScenePrompt: Scene = ({lt}) => {
  const q = typed('一句话，剩下的交给我', lt, 14, 3);
  const ready = q.length >= 10;
  const glow = ramp(lt, 46, 14, EASE.out);
  return (
    <AbsoluteFill style={{background: '#0d0c14', fontFamily: SANS, justifyContent: 'center', padding: '0 56px'}}>
      <div style={{height: 150, borderRadius: 26, background: '#17161f', border: '2px solid #2b2a38', display: 'flex', alignItems: 'center', padding: '0 24px 0 36px', gap: 20}}>
        <div style={{flex: 1, fontSize: 48, color: q ? '#f2f1f8' : '#5d5b70'}}>{q || '描述你想要的片子…'}{lt < 62 && <Caret lt={lt} color="#f2f1f8" h={48} />}</div>
        <div style={{width: 84, height: 84, borderRadius: 22, background: ready ? '#6b5cff' : '#2b2a38', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 42, boxShadow: `0 0 ${40 * glow}px rgba(107,92,255,${0.8 * glow})`, transform: `scale(${lt >= 62 && lt < 68 ? 0.9 : 1})`}}>↑</div>
      </div>
      <div style={{marginTop: 22, display: 'flex', gap: 14}}>
        {['口播精剪', '自动字幕', '包装模板'].map((t) => <div key={t} style={{padding: '10px 22px', borderRadius: 999, background: '#1f1e2a', color: '#9a98b0', fontSize: 32}}>{t}</div>)}
      </div>
    </AbsoluteFill>
  );
};

// 14 收尾：Logo + 名字 + 一句话 + 按钮（这张会停在正中）
const SceneEnd: Scene = ({lt}) => {
  const a = ramp(lt, 0, 22, EASE.overshoot);
  const b = ramp(lt, 10, 20, EASE.out);
  const c = ramp(lt, 22, 20, EASE.out);
  const d = ramp(lt, 34, 18, EASE.overshoot);
  return (
    <AbsoluteFill style={{background: '#ffffff', fontFamily: SANS, justifyContent: 'center', alignItems: 'center', color: INK}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
        <div style={{transform: `scale(${a}) rotate(${(1 - a) * -40}deg)`}}><Mark size={124} /></div>
        <div style={{fontSize: 84, fontWeight: 800, letterSpacing: '-0.03em', opacity: b, transform: `translateX(${(1 - b) * -30}px)`}}>逐梦的剪辑 skills</div>
      </div>
      <div style={{marginTop: 24, fontSize: 40, color: '#55536a', opacity: c, transform: `translateY(${(1 - c) * 16}px)`}}>口播 · 字幕 · 包装，一句话搞定</div>
      <div style={{marginTop: 34, padding: '18px 44px', borderRadius: 999, background: ACCENT, color: '#fff', fontSize: 36, fontWeight: 700, transform: `scale(${d})`, boxShadow: '0 14px 30px rgba(91,92,240,0.35)'}}>现在就试试 →</div>
    </AbsoluteFill>
  );
};

type Card = {w: number; bg: string; tint: string; Scene: Scene};
const CARDS: Card[] = [
  {w: 760, bg: '#0d0e16', tint: '#5b5cf0', Scene: SceneTimeline},
  {w: 820, bg: '#fffbe8', tint: '#e2cf6e', Scene: SceneNeeds},
  {w: 900, bg: '#ffffff', tint: '#c3c6d6', Scene: SceneChangeWord},
  {w: 840, bg: '#ffffff', tint: '#b4b7ff', Scene: SceneLogoDraw},
  {w: 900, bg: '#f2f5ff', tint: '#9fb4ff', Scene: SceneInsertIcon},
  {w: 840, bg: '#fff8ec', tint: '#f0bf7e', Scene: SceneConverge},
  {w: 780, bg: '#0c0d1a', tint: '#5b5cf0', Scene: SceneTiles},
  {w: 900, bg: '#f6efe3', tint: '#7fc79a', Scene: SceneTenMin},
  {w: 900, bg: '#ffffff', tint: '#c9d0e4', Scene: SceneSearch},
  {w: 860, bg: '#160a22', tint: '#f0913e', Scene: ScenePill},
  {w: 900, bg: '#ffffff', tint: '#8a55ff', Scene: SceneRibbon},
  {w: 840, bg: '#faf8ff', tint: '#c4b3ff', Scene: SceneSelect},
  {w: 800, bg: '#090b16', tint: '#3b6cff', Scene: SceneThumbs},
  {w: 900, bg: '#0d0c14', tint: '#6b5cff', Scene: ScenePrompt},
  {w: 1040, bg: '#ffffff', tint: '#8f90ff', Scene: SceneEnd},
];
const GAP = 80;
const CENTERS: number[] = (() => { let x = 0; return CARDS.map((c) => { const s = x + c.w / 2; x += c.w + GAP; return s; }); })();

// ───────── 滑动速度：匀速 + 3 次甩动 + 结尾减速停住 ─────────
const N = CURVED_CAROUSEL_REEL_DURATION;
const STOP = 1290;
const BURSTS = [380, 620, 880];
const env = (f: number) => 1 - ramp(f, 1222, STOP - 1222, EASE.smooth);
const burst = (f: number) => BURSTS.reduce((s, c) => s + 30 * Math.exp(-(((f - c) / 9) ** 2)), 0);
const SCROLL: number[] = (() => {
  // 先算"单位底速"和甩动各自走多远，再解出底速，让最后一张卡在 STOP 帧正好停在正中
  let A = 0, B = 0;
  for (let f = 0; f < STOP; f++) { A += env(f); B += burst(f) * env(f); }
  const start = CENTERS[1] + 250; // 开场：需求列表卡在正中偏左 250px
  const D = CENTERS[CENTERS.length - 1] - start;
  const base = (D - B) / A;
  const out: number[] = [];
  let s = start;
  for (let f = 0; f <= N; f++) { out.push(s); if (f < STOP) s += base * env(f) + burst(f) * env(f); }
  return out;
})();
const speedAt = (f: number) => Math.abs((SCROLL[Math.min(N, f + 1)] ?? 0) - (SCROLL[f] ?? 0));
// 每张卡的本地帧起点：卡心到正中右边 450px 的那一帧
const ENTER: number[] = CENTERS.map((c, i) => {
  if (i === CARDS.length - 1) return 1170; // 收尾卡：滑进来时就开始出 Logo，减速停住时刚好全部出齐
  for (let f = 0; f <= N; f++) if (c - SCROLL[f] <= 450) return f === 0 ? -Math.round((450 - (c - SCROLL[0])) / 7.5) : f;
  return N;
});

const BLUR_LV = [0, 3, 6, 10, 15, 22, 30];
const BlurDefs: React.FC = () => (
  <svg width="0" height="0" style={{position: 'absolute'}}>
    {BLUR_LV.map((v, i) => (
      <filter key={i} id={`hb${i}`} x="-20%" y="0" width="140%" height="100%"><feGaussianBlur stdDeviation={`${v} 0`} /></filter>
    ))}
  </svg>
);

// ───────── 一张卡：切成竖条贴在圆筒上 ─────────
const SLICE = 40;
const CurvedCard: React.FC<{card: Card; u: number; lt: number; cfg: Cfg; spd: number}> = ({card, u, lt, cfg, spd}) => {
  const {w, bg, Scene} = card;
  const n = Math.ceil(w / SLICE);
  const sw = w / n;
  const R = cfg.P;
  const extra = clamp((spd - 9) / 5, 0, 3); // 甩动时整体更虚
  const slices = [];
  for (let i = 0; i < n; i++) {
    const uc = u - w / 2 + (i + 0.5) * sw;
    const th = uc / R;
    if (Math.abs(th) > 1.08) continue;
    // 按屏幕位置算"离边多近"：中间 45% 宽是平的、清楚的，往外才开始拉高、拖虚、出色散（原片就是中间平、两边猛地翻起来）
    const edge = (t: number) => clamp((Math.abs(R * Math.tan(t)) / 960 - 0.45) / 0.55) ** 2;
    const a = edge(th);
    // 额外拉高要在条内连续变化（左右两边各算一次，用投影矩阵把条变成梯形），否则边缘会出现一级级台阶
    const fl0 = 1 + 0.6 * edge((uc - sw / 2) / R), fl1 = 1 + 0.6 * edge((uc + sw / 2) / R);
    const q = (fl0 - fl1) / (fl0 + fl1);
    const c = (2 * q) / (sw + 2.5);
    const fm = fl0 * (1 - q);
    const lv = Math.min(6, Math.round(a * 5 + extra));
    const ch = Math.sqrt(a) * cfg.chroma;
    const fl = ch > 0.02 ? `drop-shadow(0 ${(-24 * cfg.chroma).toFixed(1)}px 0 rgba(0,214,255,${(0.85 * ch).toFixed(2)})) drop-shadow(0 ${(24 * cfg.chroma).toFixed(1)}px 0 rgba(118,64,255,${(0.85 * ch).toFixed(2)})) drop-shadow(0 ${(-44 * cfg.chroma).toFixed(1)}px 0 rgba(255,214,90,${(0.5 * ch).toFixed(2)}))` : undefined;
    slices.push(
      <div key={i} style={{position: 'absolute', left: 960 - sw / 2 - 1.25, top: 540 - H / 2, width: sw + 2.5, height: H, overflow: 'hidden', transform: `translateZ(${R}px) rotateY(${(-th).toFixed(5)}rad) translateZ(${-R}px) matrix3d(1,0,0,${c.toFixed(7)},0,${fm.toFixed(5)},0,0,0,0,1,0,0,0,0,1)`, filter: fl, opacity: clamp(1.25 - Math.max(0, Math.abs(th) - 0.85) * 3)}}>
        <div style={{position: 'absolute', left: -i * sw + 1.25, top: 0, width: w, height: H, borderRadius: 26, overflow: 'hidden', background: bg, filter: lv ? `url(#hb${lv})` : undefined}}>
          <Scene lt={lt} w={w} />
        </div>
      </div>,
    );
  }
  return <>{slices}</>;
};

export const CurvedCarouselReelBase: React.FC<{variant: Variant}> = ({variant}) => {
  const f = useCurrentFrame();
  const cfg = CFG[variant];
  const scroll = SCROLL[Math.min(N, f)];
  const spd = speedAt(f);
  const R = cfg.P;
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 60% at 50% 45%, #ffffff 0%, ${cfg.bg} 75%)`, overflow: 'hidden'}}>
      <BlurDefs />
      {/* 地面上的同色软影子 */}
      {CARDS.map((c, i) => {
        const th = (CENTERS[i] - scroll) / R;
        if (Math.abs(th) > 1.1) return null;
        const x = 960 + R * Math.tan(th);
        const k = 1 / Math.cos(th);
        const ww = c.w * 0.82 * k;
        return <div key={i} style={{position: 'absolute', left: x - ww / 2, top: 930 + (k - 1) * 60, width: ww, height: 46 * k, borderRadius: '50%', background: c.tint, filter: `blur(${(26 * k).toFixed(0)}px)`, opacity: 0.5 / k}} />;
      })}
      <AbsoluteFill style={{perspective: `${R}px`, perspectiveOrigin: '960px 540px'}}>
        {CARDS.map((c, i) => {
          const u = CENTERS[i] - scroll;
          if (Math.abs(u) > R * 1.08 + c.w / 2) return null;
          return <CurvedCard key={i} card={c} u={u} lt={f - ENTER[i]} cfg={cfg} spd={spd} />;
        })}
      </AbsoluteFill>
      <Grain opacity={0.04} blend="overlay" />
    </AbsoluteFill>
  );
};

export const CurvedCarouselReel: React.FC = () => <CurvedCarouselReelBase variant={2} />;
