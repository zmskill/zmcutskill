// 散开的面板拼成一整面 → 切低角度慢漂 → 从下往上淡成白 → Logo 收尾（006 整段，第三版）
// 学的动作（来自 @BlahomyrPopok · 金融科技仪表盘 0:00–0:08，按每 0.1 秒一帧、960px 大图逐帧看过）：
//   镜头 A（0–1.25s）：低角度、整体微虚；面板一开始是散开的（中间有大片空台面），镜头往右上移的同时，
//     各块面板各走各的路线拼到一起——环形图那块从左上滑进来先叠在折线图上再落位，"媒体"那块从右边靠过来
//   1.25s 硬切 镜头 B：更低、更近、透视更强，近处（下）和远处（上）都虚；整面一直往左上慢漂，从不停
//   3.2s 起整面从下往上淡成白（下面的先没）；面板还没淡完 Logo 就开始出：图形先出，名字一个字一个字由淡变实，Logo 全程极慢地漂
// 用户对前两版的意见："一动都没动"（第一版）；"卡片会拆解、会移动""细节差了很多"（第二版——面板从来没分开过）
// 我们的内容：普通的"本周数据"面板（中文标签），收尾 Logo 位放产品（逐梦的剪辑 skills）
//
// 时间表（30fps，共 240f）
//   0–37    镜头 A：camera 一直移动（EASE.out 从快到慢）；面板 0–33 各自从散开位置拼回（错开、长尾巴）
//   38      硬切镜头 B
//   38–128  镜头 B 匀速慢漂
//   94–110  从下往上淡成白（遮罩往上推）
//   100–124 Logo 图形 + 名字逐字出；132 标语；156 底部小字；Logo 全程放大 3%、左移 8px
// 毛病清单（自查表通用项 + 本镜头独有）：
//   - 独有 1：面板拼回要各走各的（方向、时间、距离都不同），不能整体一起平移
//   - 独有 2：转场是"从下往上淡"+ Logo 同时出，中间不能有空白白场
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {EASE, FONT, Grain, mix, ramp} from '../../../kit/polish';

export const TILTED_DASHBOARD_PAN_LOGO_DURATION = 240;

const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const INK = '#17161c';
const ACCENT = '#5b5cf0';
const CUT = 38;

const Mark: React.FC<{size: number; star: number}> = ({size, star}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{display: 'block', overflow: 'visible'}}>
    <circle cx="50" cy="50" r="41" fill="none" stroke={INK} strokeWidth="8.5" />
    <g transform={`translate(50 50) scale(${star.toFixed(3)})`}><path d="M0 -24 C3 -6 6 -3 24 0 C6 3 3 6 0 24 C-3 6 -6 3 -24 0 C-6 -3 -3 -6 0 -24 Z" fill={ACCENT} /></g>
  </svg>
);

// ───────── 面板里的东西 ─────────
const Bars: React.FC<{n: number; w: number}> = ({n, w}) => (
  <div>
    {Array.from({length: n}, (_, i) => (
      <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22}}>
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" fill="#8b7cf6" /></svg>
        {[0.32, 0.18, 0.26, 0.14].map((k, j) => <div key={j} style={{height: 14, width: w * k * (0.7 + ((i * 7 + j * 3) % 5) * 0.08), borderRadius: 7, background: '#d5dcd8'}} />)}
      </div>
    ))}
  </div>
);
const Ring: React.FC<{size: number; segs: [string, number][]; f: number}> = ({size, segs, f}) => {
  const r = size / 2 - 26, C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width={size} height={size} style={{transform: `rotate(${(-90 + f * 0.15).toFixed(2)}deg)`}}>
      {segs.map(([c, v], i) => { const el = <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={c} strokeWidth="46" strokeDasharray={`${(C * v).toFixed(1)} ${C}`} strokeDashoffset={(-C * acc).toFixed(1)} />; acc += v; return el; })}
    </svg>
  );
};
const Legend: React.FC<{items: [string, string][]}> = ({items}) => (
  <div style={{fontSize: 24, color: '#4a4f5c', lineHeight: 1.9}}>
    {items.map(([c, t]) => <div key={t}><span style={{display: 'inline-block', width: 14, height: 14, marginRight: 10, background: c}} />{t}</div>)}
  </div>
);
const Chart: React.FC<{f: number}> = ({f}) => {
  const W = 1250, H = 420;
  // 线故意画到面板右边外面去（原片也是），像数据一直延伸
  const S: [string, number[]][] = [
    ['#cfd3da', [0.28, 0.34, 0.62, 0.58, 0.45, 1.0, 0.55, 0.5]],
    ['#8fb6e0', [0.08, 0.1, 0.2, 0.18, 0.28, 0.75, 0.38, 0.3]],
    ['#ef7c96', [0.08, 0.14, 0.27, 0.2, 0.38, 0.55, 0.42, 0.36]],
    ['#cc1f45', [0.06, 0.24, 0.16, 0.22, 0.46, 0.4, 0.3, 0.22]],
    ['#1f6fd1', [0.0, 0.05, 0.09, 0.12, 0.17, 0.2, 0.24, 0.28]],
  ];
  const X = (i: number) => 70 + i * 205;
  const Y = (v: number) => H - 30 - v * (H - 60);
  return (
    <svg width={W} height={H} style={{overflow: 'visible'}}>
      {[0, 5, 10, 15, 20, 25].map((v, i) => (
        <g key={v}><text x="0" y={Y(i / 5) + 8} fontSize="24" fill="#707684" fontFamily={SANS}>{v}</text><line x1="50" x2={W + 300} y1={Y(i / 5)} y2={Y(i / 5)} stroke="#eef0f3" strokeWidth="2" /></g>
      ))}
      {S.map(([c, pts], k) => (
        <g key={k}>
          <path d={pts.map((p, i) => `${i ? 'L' : 'M'}${X(i)} ${Y(p).toFixed(1)}`).join(' ')} fill="none" stroke={c} strokeWidth="4" strokeLinejoin="round" />
          {pts.map((p, i) => <circle key={i} cx={X(i)} cy={Y(p)} r={i === 5 && k === 3 ? 9 + Math.sin(f / 6) * 2 : 8} fill={c} />)}
        </g>
      ))}
    </svg>
  );
};

export type P = {id: string; x: number; y: number; w: number; h: number; z: number; from: [number, number, number]; at: number; dur: number; body: (f: number) => React.ReactNode; title?: string};
export const PANELS: P[] = [
  {id: 'brand', x: 40, y: 40, w: 420, h: 330, z: 0, from: [-260, -220, 0], at: 2, dur: 26, title: '', body: () => (
    <div>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, color: '#3b3f4a', fontWeight: 600}}><div style={{width: 26, height: 26, borderRadius: 8, background: '#2fae6a'}} />数据中心</div>
      <div style={{marginTop: 26, height: 44, borderRadius: 10, border: '2px solid #e3e7ea', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8}}><div style={{width: 30, height: 30, borderRadius: 8, background: '#2fae6a'}} /></div>
      <div style={{marginTop: 30, fontSize: 20, color: '#8a909c'}}>本月额度 · 95/100</div>
      <div style={{marginTop: 10, height: 10, borderRadius: 5, background: '#e9eeeb'}}><div style={{width: '82%', height: '100%', borderRadius: 5, background: '#2fae6a'}} /></div>
    </div>
  )},
  {id: 'ai', x: 500, y: 40, w: 1000, h: 330, z: 0, from: [-340, -300, 0], at: 6, dur: 26, title: 'AI 洞察', body: () => <Bars n={4} w={900} />},
  {id: 'top', x: 1540, y: 40, w: 640, h: 330, z: 0, from: [520, -360, 0], at: 4, dur: 28, title: '来源 Top 8', body: (f) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
      <Ring f={f} size={250} segs={[['#1fd1a4', 0.3], ['#1e4fd8', 0.2], ['#f5b51c', 0.14], ['#27b34a', 0.1], ['#e84cd8', 0.08], ['#8b2a1a', 0.06], ['#7a5cff', 0.06], ['#ff3d7f', 0.06]]} />
      <Legend items={[['#1e4fd8', '搜索'], ['#f5b51c', '推荐'], ['#27b34a', '分享'], ['#e84cd8', '社群']]} />
    </div>
  )},
  // 访客来源：从左上滑进来，先叠在折线图上面，再落到自己的位置（原片 0.5–0.8s）
  {id: 'bias', x: 40, y: 410, w: 620, h: 560, z: 40, from: [-160, -560, 70], at: 9, dur: 29, title: '访客来源', body: (f) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 20}}>
      <Ring f={f} size={300} segs={[['#1f6fd1', 0.02], ['#8fb6e0', 0.18], ['#cc1f45', 0.18], ['#ef7c96', 0.22], ['#d7d9de', 0.4]]} />
      <Legend items={[['#1f6fd1', '新访客'], ['#8fb6e0', '老访客'], ['#cfd3da', '直接打开'], ['#ef7c96', '外部链接'], ['#cc1f45', '广告']]} />
    </div>
  )},
  {id: 'chart', x: 700, y: 410, w: 1480, h: 560, z: 20, from: [0, 0, 0], at: 0, dur: 1, title: '本周访问', body: (f) => <Chart f={f} />},
  // 媒体：从右边靠过来（原片右下那块）
  {id: 'media', x: 40, y: 1010, w: 2140, h: 380, z: 0, from: [980, 260, 0], at: 3, dur: 35, title: '提到我们的媒体', body: () => (
    <div style={{display: 'flex', gap: 40, marginTop: 10}}>
      {['城市周刊', '生活方式日报', '每日设计'].map((t, i) => (
        <div key={t} style={{flex: 1}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 26, color: '#30333c', fontWeight: 600}}><div style={{width: 40, height: 40, borderRadius: 20, background: ['#e84c5b', '#3b82f6', '#22a06b'][i]}} />{t}</div>
          <div style={{marginTop: 22, display: 'flex', gap: 10}}>{[120, 70, 90, 60].map((w, j) => <div key={j} style={{height: 14, width: w, borderRadius: 7, background: '#dfe3e6'}} />)}</div>
          <div style={{marginTop: 16, display: 'flex', gap: 10, alignItems: 'center'}}><div style={{height: 14, width: 40, borderRadius: 3, background: '#e84c5b'}} /><div style={{fontSize: 20, color: '#9aa0ab'}}>热度 · {[92, 87, 81][i]}</div></div>
        </div>
      ))}
    </div>
  )},
];

// 面板外观（平面、不带 3D）：先用它把每块面板渲染成 2 倍大的贴图，3D 场景里只移动贴图
// 原因：浏览器在 3D 变换里每帧重新排版文字、对齐像素，文字会一格格地跳（"数字抽动"）；贴图是一张图，移动时是平滑重采样
export const PanelFace: React.FC<{p: P; f: number}> = ({p, f}) => (
  <div style={{width: p.w, height: p.h, borderRadius: 18, background: '#ffffff', padding: 30, boxSizing: 'border-box', fontFamily: SANS, overflow: 'hidden'}}>
    {p.title ? <div style={{fontSize: 30, fontWeight: 700, color: '#2a2d36', marginBottom: 18}}>{p.title}</div> : null}
    {p.body(f)}
  </div>
);
const USE_TEXTURE = true;
const Board: React.FC<{f: number; assemble: boolean}> = ({f, assemble}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 2220, height: 1430, transformStyle: 'preserve-3d'}}>
    <div style={{position: 'absolute', left: -1400, top: -1200, width: 5000, height: 4000, background: '#eef1f0'}} />
    {PANELS.map((p) => {
      const k = assemble ? ramp(f, p.at, p.dur, EASE.out) : 1;
      const [fx, fy, fz] = p.from;
      return (
        <div key={p.id} style={{position: 'absolute', left: p.x, top: p.y, width: p.w, height: p.h, borderRadius: 18, background: '#ffffff', padding: USE_TEXTURE ? 0 : 30, boxSizing: 'border-box', fontFamily: SANS, overflow: 'visible',
          transform: `translate3d(${(fx * (1 - k)).toFixed(1)}px, ${(fy * (1 - k)).toFixed(1)}px, ${(p.z + fz * (1 - k)).toFixed(1)}px)`,
          boxShadow: `0 ${18 + p.z * 0.5}px ${40 + p.z}px rgba(40,60,50,0.10), 0 1px 3px rgba(0,0,0,0.05)`}}>
          {USE_TEXTURE ? <Img src={staticFile(`textures/live/dash_${p.id}.png`)} style={{position: 'absolute', inset: 0, width: p.w, height: p.h, borderRadius: 18}} /> : (<>
            {p.title ? <div style={{fontSize: 30, fontWeight: 700, color: '#2a2d36', marginBottom: 18}}>{p.title}</div> : null}
            {p.body(f)}
          </>)}
        </div>
      );
    })}
  </div>
);

export const TiltedDashboardPanLogo: React.FC = () => {
  const f = useCurrentFrame();
  const shotB = f >= CUT;
  // 镜头 A：一直在移动（从快到慢），看的是散开的面板拼起来
  const a = 0.55 * ramp(f, 0, CUT, EASE.linear) + 0.45 * ramp(f, 0, CUT, EASE.out); // 不减到 0：一直走到硬切那一帧
  // 镜头 B：匀速慢漂，一直漂到面板淡没以后
  const b = ramp(f, CUT, 90, EASE.linear);
  const cam = shotB
    ? `translate(${(500 - 130 * b).toFixed(1)}px, ${(-120 - 70 * b).toFixed(1)}px) scale(${(1.3 + 0.04 * b).toFixed(4)}) rotateX(62deg) rotateZ(-9deg)`
    : `translate(${(520 - 300 * a).toFixed(1)}px, ${(150 - 190 * a).toFixed(1)}px) scale(${(0.9 + 0.06 * a).toFixed(4)}) rotateX(52deg) rotateZ(-12deg)`;
  const wipe = ramp(f, 94, 16, EASE.smooth); // 从下往上淡
  const mask = `linear-gradient(0deg, transparent ${(wipe * 115 - 15).toFixed(1)}%, #000 ${(wipe * 115 + 10).toFixed(1)}%)`;

  const pop = ramp(f, 100, 16, EASE.out);
  const star = ramp(f, 104, 16, EASE.overshoot);
  const NAME = Array.from('逐梦的剪辑 skills');
  const tag = ramp(f, 132, 18, EASE.out);
  const foot = ramp(f, 156, 18, EASE.out);
  const drift = ramp(f, 100, 140, EASE.linear);

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#fbfcfc', fontFamily: SANS}}>
      {/* 仪表盘 */}
      {f < 112 && (
        <AbsoluteFill style={{WebkitMaskImage: mask, maskImage: mask}}>
          <AbsoluteFill style={{perspective: shotB ? '1500px' : '2400px', perspectiveOrigin: shotB ? '40% 10%' : '50% 20%', filter: shotB ? undefined : 'blur(1.6px)'}}>
            <div style={{position: 'absolute', left: 960 - 1110, top: 540 - 715, width: 2220, height: 1430, transformStyle: 'preserve-3d', transform: cam}}>
              <Board f={f} assemble={!shotB} />
            </div>
          </AbsoluteFill>
          {/* 景深：远处（上）虚，镜头 B 近处（下）也虚 */}
          <AbsoluteFill style={{backdropFilter: 'blur(9px)', WebkitBackdropFilter: 'blur(9px)', WebkitMaskImage: 'linear-gradient(180deg, #000 0%, rgba(0,0,0,0.4) 16%, transparent 34%)', maskImage: 'linear-gradient(180deg, #000 0%, rgba(0,0,0,0.4) 16%, transparent 34%)'}} />
          {shotB && <AbsoluteFill style={{backdropFilter: 'blur(7px)', WebkitBackdropFilter: 'blur(7px)', WebkitMaskImage: 'linear-gradient(0deg, #000 0%, rgba(0,0,0,0.5) 14%, transparent 30%)', maskImage: 'linear-gradient(0deg, #000 0%, rgba(0,0,0,0.5) 14%, transparent 30%)'}} />}
        </AbsoluteFill>
      )}
      {/* 左下角绿色柔光（全程都在，慢慢漂） */}
      <div style={{position: 'absolute', left: -320 + Math.sin(f / 50) * 40, top: 640, width: 900, height: 700, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(70,205,130,0.42), rgba(70,205,130,0) 65%)', filter: 'blur(30px)'}} />
      <div style={{position: 'absolute', left: -300, top: -200 + Math.cos(f / 60) * 30, width: 700, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(70,205,130,0.18), rgba(70,205,130,0) 65%)', filter: 'blur(30px)'}} />

      {/* Logo：面板还没淡完就开始出 */}
      {f >= 100 && (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 28, marginTop: -40, transform: `translateX(${(-8 * drift).toFixed(1)}px) scale(${(1 + 0.03 * drift).toFixed(4)})`}}>
            <div style={{opacity: pop, transform: `scale(${mix(0.85, 1, pop).toFixed(3)})`, filter: pop < 0.98 ? `blur(${((1 - pop) * 8).toFixed(1)}px)` : undefined}}><Mark size={120} star={star} /></div>
            <div style={{fontSize: 104, fontWeight: 800, color: INK, letterSpacing: '-0.03em', whiteSpace: 'pre'}}>
              {NAME.map((c, i) => { const p = ramp(f, 106 + i * 1.6, 9, EASE.out); return <span key={i} style={{display: 'inline-block', opacity: p, filter: p < 0.98 ? `blur(${((1 - p) * 6).toFixed(1)}px)` : undefined}}>{c}</span>; })}
            </div>
          </div>
          <div style={{marginTop: 26, fontSize: 42, color: '#3d3c48', opacity: tag, transform: `translateY(${((1 - tag) * 12).toFixed(1)}px)`}}>口播 · 字幕 · 包装，一句话搞定</div>
          <div style={{position: 'absolute', bottom: 70, fontSize: 32, color: '#7a7a88', opacity: foot}}>搜索「逐梦的剪辑 skills」</div>
        </AbsoluteFill>
      )}
      <Grain opacity={0.04} blend="overlay" />
    </AbsoluteFill>
  );
};
