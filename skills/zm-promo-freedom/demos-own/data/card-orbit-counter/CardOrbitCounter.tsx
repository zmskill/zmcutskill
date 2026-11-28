// 3D 卡片环绕大数字 + 甩镜头 + 收进相册（011 A 段：原视频_02.mp4 16.6–20.4s）
// 学的动作：几十张照片卡贴在围着中心数字的椭圆筒上，镜头绕中心转（前景卡往左上变大、远景卡往右上变小、两侧转成竖窄条），
//   数字每帧线性滚到终值、停的那一刻正好是甩镜头最快；甩 = 匀速 → 三次加速 → 峰值每帧约 7% 画宽 → 双指数长尾（不停死）；
//   离场全部变虚往中心收，切进毛玻璃"相册"文件夹，两张卡从文件夹口露出往里沉。
// 我们的内容：你一年拍下的照片 → "1,286 张照片，躺在相册里"；卡片是代码画的场景缩略图（sceneCards.tsx，和镜头 B 共用）。
//
// 时间表（30fps，共 114f；原片秒 t → 帧 (t−16.6)×30）
//   0–8     前情 1："视频"——大卡片，热成像色 → 原色，慢推
//   9–26    9 硬切 前情 2："截图"——右侧文件列表匀速上滚、纸飞机光标往下漂
//   27      硬切进卡片云：已经在转；首帧虚 10px → 28 虚 3px → 29 清晰
//   27–78   数字 floor(1286·(f−27)/51) 每帧都变；28 / 31 / 34 逐词出"张照片，/躺在/相册里"（浅灰虚 → 黑）
//   27–60   匀速转（前景约 10px/帧）
//   60–75   三次加速；66–75 前景大卡（咖啡）从右下擦过数字正前方、整段挡住
//   75–79   峰值（前景 ~145px/帧）；78 数字到 1,286 定住
//   79–97   双指数长尾减速（60 → 33 → 15 → 10px/帧），到离场仍在漂
//   97–102  全部变虚 0→9px + 往中心收成一团；98 起纸飞机光标从左上飘进
//   103     切：毛玻璃"相册"文件夹；两张卡从口里露出往下沉，文件夹微缩 3%；标签 浅灰 → 墨 → 棕橙
// 毛病清单（自查表通用项 + 本镜头独有）：
//   - 独有 1：数字和卡片在同一个 preserve-3d 场景里，卡片有的在数字前（挡住）、有的在后（被数字压着）
//   - 独有 2：前后两层反向运动（前景左上 / 远景右上），侧边卡转成竖窄条；只做平移就是幻灯片
//   - 独有 3：数字终值那一帧要落在甩速峰值里；减速是长尾，离场时还在动
//   - 独有 4：数字等宽、始终居中，位数变多整体左让；渐变两端橙中间黑、越往后越艳
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, FONT, Grain, mix} from '../../../assets/lib/helpers/polish';
import {SCENE_KINDS, SceneCard} from './sceneCards';

export const CARD_ORBIT_COUNTER_DURATION = 114;

const SANS = `"SF Pro Display", "PingFang SC", "Noto Sans CJK SC", ${FONT.sans}`;
type Ease = (t: number) => number;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const hash = (i: number, n: number) => { const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };
const kf = (f: number, keys: [number, number, Ease?][]) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f1, v1, e] = keys[i];
    const [f0, v0] = keys[i - 1];
    if (f <= f1) return mix(v0, v1, (e ?? EASE.smooth)(clamp((f - f0) / (f1 - f0))));
  }
  return keys[keys.length - 1][1];
};
const lin: Ease = (t) => t;
const easeIn3: Ease = (t) => t * t * t;

// ───────── 时间点 ─────────
const CUT = 27; // 硬切进卡片云
const N_END = 78; // 数字到终值
const PEAK_END = 79; // 峰值结束、开始长尾
const EXIT = 97; // 开始虚化收拢
const FOLDER = 103; // 切文件夹
const TOTAL = 1286;

// ───────── 镜头角速度（度/帧）→ 积分成角度 φ ─────────
const omega = (f: number) => {
  if (f < 60) return 0.47;
  if (f < PEAK_END) return kf(f, [[60, 0.47], [66, 1.4, easeIn3], [71, 3.8, lin], [74, 6.4, lin], [76, 6.7, lin], [PEAK_END, 6.4, lin]]);
  const d = f - PEAK_END;
  return 6.4 * (0.75 * Math.exp(-d / 2.5) + 0.25 * Math.exp(-d / 14)) + 0.06;
};
const STEP = 0.05;
const PHI: number[] = (() => { const a = [0]; for (let s = 1; s * STEP <= CARD_ORBIT_COUNTER_DURATION + 4; s++) a.push(a[s - 1] + omega((s - 0.5) * STEP) * STEP); return a; })();
const phiAt = (f: number) => { const x = clamp(f, 0, (PHI.length - 1) * STEP) / STEP; const i = Math.floor(x); const t = x - i; return mix(PHI[i], PHI[Math.min(i + 1, PHI.length - 1)], t); };

// ───────── 3D 舞台参数 ─────────
const P = 1200; // perspective
const C = 1000; // 中心（数字）离屏幕的深度
const RX = 1350, RZ = 900; // 椭圆筒半径
const THN = (-8 * Math.PI) / 180; // 离镜头最近的方位（偏左 → 前景卡往左上走时还在变大）
const KD = 760; // 每弧度往上漂多少（螺旋上升：前景左上、远景右上）
const YW = 1600; // 竖向循环范围 ±YW（换位置时都在画外）

type Card = {kind: number; th0: number; y0: number; r: number; w: number; pitch: number; roll: number; tw: number};
const N = 40;
const rad = (d: number) => (d * Math.PI) / 180;
// 三张主角卡：在指定帧正好经过数字正前方（f 交叉时 θ_rel = 0、y = 0）
const hero = (fx: number, yOff: number, kind: number, w: number, r: number): Card => {
  const ph = rad(phiAt(fx));
  return {kind, th0: ph, y0: KD * ph + yOff, r, w, pitch: -4, roll: 3, tw: 0};
};
const CARDS: Card[] = [
  ...Array.from({length: N}, (_, i): Card => ({
    kind: (i * 5 + Math.floor(i / SCENE_KINDS.length) * 3) % SCENE_KINDS.length,
    th0: rad(i * (360 / N) + (hash(i, 1) - 0.5) * 6),
    y0: -YW + ((i * 0.6180339 + hash(i, 2) * 0.12) % 1) * 2 * YW,
    r: 0.55 + hash(i, 3) * 0.7,
    w: 450 + hash(i, 4) * 190,
    pitch: (hash(i, 5) - 0.5) * 26,
    roll: (hash(i, 6) - 0.5) * 22,
    tw: (hash(i, 7) - 0.5) * 36,
  })),
  hero(70, 40, 1, 600, 1.18), // 咖啡：66–75 擦过数字正前方
  hero(76, 10, 8, 560, 1.14), // 地铁：峰值时盖住数字左半
  hero(81, -30, 2, 580, 1.1), // 海边：甩完新前景，最后停在数字上方
];

const wrap = (y: number) => { const L = 2 * YW; return ((((y + YW) % L) + L) % L) - YW; };

// 某帧某张卡的 3D 位置（pull = 离场时往中心收的进度）
const place = (c: Card, f: number, pull: number) => {
  const th = c.th0 - rad(phiAt(f));
  let x = RX * c.r * Math.sin(th);
  let z = RZ * c.r * Math.cos(th - THN);
  let y = wrap(c.y0 - KD * rad(phiAt(f)));
  const k = 1 - pull * 0.9;
  x *= k; y *= k; z *= k;
  const face = 38 * Math.sin(th) + c.tw * (0.4 + 0.6 * Math.abs(Math.sin(th))); // 正面朝镜头、两侧转成竖窄条
  return {x, y, z, face};
};

// 落定段（f86–97）数字要重新露出来：挡在数字正前方的普通卡往上 / 下挪开
const clearNumber = (c: Card, idx: number) => {
  const frames: number[] = [];
  for (let f = 30; f <= 60; f += 2) frames.push(f); // 匀速段：数字基本露着（只有主角卡来挡）
  for (let f = 86; f <= 97; f += 1.5) frames.push(f); // 落定段：数字重新露出来
  for (let k = 0; k < 8; k++) {
    let hit = false;
    for (const f of frames) {
      const q = place(c, f, 0);
      if (q.z < -520 && f < 80) continue; // 匀速段：在数字后面够远就没关系；落定段后面的深色卡也会吃字，一并挪开
      const s = P / (P - (q.z - C));
      const hw = (c.w * s) / 2, hh = (c.w * 9 / 16 * s) / 2;
      if (Math.abs(q.x * s) < 300 + hw && Math.abs(q.y * s) < 150 + hh) { hit = true; break; }
    }
    if (!hit) return;
    c.y0 += (idx % 2 ? 1 : -1) * 380;
  }
};
CARDS.slice(0, N).forEach((c, i) => clearNumber(c, i));

// ───────── 前情：大卡 / 文件列表 ─────────
const PreRoll: React.FC<{f: number}> = ({f}) => {
  if (f < 9) {
    const th = clamp(1 - f / 7);
    return (
      <AbsoluteFill style={{background: '#fdfdfd'}}>
        <div style={{position: 'absolute', left: 150, top: 500, fontSize: 64, fontWeight: 500, color: `rgb(${Math.round(mix(214, 24, clamp(f / 5)))},${Math.round(mix(120, 24, clamp(f / 5)))},${Math.round(mix(160, 28, clamp(f / 5)))})`, fontFamily: SANS}}>视频</div>
        <div style={{position: 'absolute', left: 620, top: 230, transform: `scale(${(1 + f * 0.004).toFixed(4)})`, transformOrigin: '50% 50%'}}>
          <SceneCard kind="concert" uid="pre0" w={1060} thermal={th} radius={36} />
        </div>
        <div style={{position: 'absolute', left: 500, top: 120, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,170,220,0.5), rgba(232,170,220,0) 70%)', opacity: th, filter: 'blur(30px)'}} />
      </AbsoluteFill>
    );
  }
  const lf = f - 9;
  const rowH = 122;
  const scroll = lf * 3.2;
  const names = ['IMG_2041.PNG', 'IMG_2042.PNG', '周末计划.PNG', 'IMG_2050.PNG', '车票截图.PNG', 'IMG_2063.PNG', '菜谱.PNG', 'IMG_2071.PNG', '快递单号.PNG', 'IMG_2080.PNG'];
  return (
    <AbsoluteFill style={{background: '#fdfdfd', fontFamily: SANS}}>
      <div style={{position: 'absolute', left: 150, top: 500, fontSize: 64, fontWeight: 500, color: '#18181c'}}>截图</div>
      <div style={{position: 'absolute', left: 600, top: 0, width: 740, height: 1080, overflow: 'hidden', WebkitMaskImage: 'linear-gradient(180deg, transparent 4%, #000 26%, #000 74%, transparent 96%)'}}>
        {names.map((n, i) => {
          const y = 40 + i * rowH - scroll;
          return (
            <div key={i} style={{position: 'absolute', left: 0, top: y, width: 740, height: 104, borderRadius: 26, background: '#f2f2f3', boxShadow: '0 2px 6px rgba(20,20,30,0.05)', display: 'flex', alignItems: 'center', gap: 26, paddingLeft: 26, boxSizing: 'border-box'}}>
              <div style={{width: 60, height: 60, borderRadius: 16, overflow: 'hidden'}}><SceneCard kind={SCENE_KINDS[(i * 5) % SCENE_KINDS.length]} uid={`row${i}`} w={107} radius={0} style={{marginLeft: -23}} /></div>
              <div><div style={{fontSize: 34, color: '#2c2f3c'}}>{n}</div><div style={{fontSize: 26, color: '#9a9ca6', marginTop: 4}}>{(1.2 + hash(i, 9) * 3).toFixed(1)} MB</div></div>
            </div>
          );
        })}
      </div>
      <Plane x={mix(520, 545, lf / 18)} y={mix(640, 860, lf / 18)} rot={200} />
    </AbsoluteFill>
  );
};

// 纸飞机光标（白色小三棱锥 + 黄→红发光边）
const Plane: React.FC<{x: number; y: number; rot: number; s?: number; o?: number}> = ({x, y, rot, s = 1, o = 1}) => (
  <svg width={70 * s} height={70 * s} viewBox="0 0 70 70" style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, opacity: o, overflow: 'visible', filter: 'drop-shadow(4px 8px 7px rgba(0,0,0,0.26))'}}>
    <defs><linearGradient id="pl-edge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd84a" /><stop offset="1" stopColor="#e8342a" /></linearGradient>
      <linearGradient id="pl-face" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#e9e9ee" /></linearGradient></defs>
    <path d="M35 4 L62 60 L35 50 Z" fill="url(#pl-face)" stroke="#d9d9e0" strokeWidth="1" />
    <path d="M35 4 L8 60 L35 50 Z" fill="#e2e2e8" stroke="#d9d9e0" strokeWidth="1" />
    <path d="M35 4 L35 50" stroke="url(#pl-edge)" strokeWidth="3.2" strokeLinecap="round" />
  </svg>
);

// ───────── 数字 + 标签（3D 场景中心的一块牌子，始终正对镜头） ─────────
const fmt = (n: number) => n.toLocaleString('en-US');
const Counter: React.FC<{f: number}> = ({f}) => {
  const n = Math.floor((TOTAL * clamp((f - CUT) / (N_END - CUT))) + 1e-6);
  const sat = clamp((f - CUT) / (N_END - CUT)) ** 0.8; // 越到后面两端越艳
  const o = (a: number, b: number, c: number) => `rgb(${Math.round(mix(26, a, sat))},${Math.round(mix(20, b, sat))},${Math.round(mix(22, c, sat))})`;
  const S = (C + P) / P; // 抵消透视缩小
  const words: [string, number][] = [['张照片，', 28], ['躺在', 31], ['相册里', 34]];
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformStyle: 'preserve-3d', transform: `translate3d(0px, 0px, ${-C}px) scale(${S})`}}>
      <div style={{position: 'absolute', left: -560, top: -150, width: 1120, textAlign: 'center', fontFamily: SANS, fontSize: 208, fontWeight: 400, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
        backgroundImage: `linear-gradient(90deg, ${o(242, 126, 89)} 22%, ${o(214, 88, 60)} 30%, #141012 41%, #121012 58%, ${o(150, 52, 50)} 68%, ${o(240, 112, 78)} 78%)`,
        WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{fmt(n)}</div>
      <div style={{position: 'absolute', left: -560, top: 92, width: 1120, textAlign: 'center', fontFamily: SANS, fontSize: 54, fontWeight: 500, whiteSpace: 'pre'}}>
        {words.map(([w, a], i) => {
          const p = clamp((f - a) / 3);
          if (f < a) return null;
          return <span key={i} style={{display: 'inline-block', color: `rgb(${Math.round(mix(196, 20, p))},${Math.round(mix(196, 20, p))},${Math.round(mix(202, 26, p))})`, filter: p < 1 ? `blur(${((1 - p) * 4).toFixed(1)}px)` : undefined}}>{w}</span>;
        })}
      </div>
    </div>
  );
};

// ───────── 文件夹 ─────────
const Folder: React.FC<{f: number}> = ({f}) => {
  const lf = f - FOLDER;
  const sink = kf(lf, [[0, 0], [4, 22, EASE.out], [11, 34, lin]]);
  const tilt = kf(lf, [[0, 10], [4, 3, EASE.out], [11, 1, lin]]);
  const sc = kf(lf, [[0, 1.0], [11, 0.97, lin]]);
  const dx = kf(lf, [[0, 0], [11, -10, EASE.smooth]]);
  const ink = kf(lf, [[0, 0], [3, 1, EASE.out], [7, 1], [11, 0.4, lin]]);
  const lab = lf < 7 ? `rgb(${Math.round(mix(160, 40, ink))},${Math.round(mix(160, 40, ink))},${Math.round(mix(164, 44, ink))})` : `rgb(${Math.round(mix(171, 40, ink))},${Math.round(mix(115, 40, ink))},${Math.round(mix(77, 44, ink))})`;
  return (
    <AbsoluteFill style={{background: '#fdfdfd'}}>
      <div style={{position: 'absolute', left: 755 + dx, top: 300, width: 420, height: 410, transform: `scale(${sc})`, transformOrigin: '50% 60%'}}>
        {/* 后片（带耳朵） */}
        <div style={{position: 'absolute', left: 0, top: 40, width: 420, height: 330, borderRadius: 30, background: 'linear-gradient(180deg,#e4e2e6,#d9d7dc)'}} />
        <div style={{position: 'absolute', left: 0, top: 18, width: 170, height: 60, borderRadius: '22px 22px 0 0', background: '#e4e2e6'}} />
        {/* 插在里面的两张卡 */}
        <div style={{position: 'absolute', left: 30, top: -14 + sink, transform: `rotate(${-tilt}deg)`, transformOrigin: '50% 100%'}}><SceneCard kind="concert" uid="fd1" w={250} /></div>
        <div style={{position: 'absolute', left: 150, top: 34 + sink * 0.8, transform: `rotate(${tilt * 0.4}deg)`}}><SceneCard kind="sea" uid="fd2" w={250} /></div>
        {/* 毛玻璃前片：后面的卡糊着透出来 */}
        <div style={{position: 'absolute', left: 0, top: 110, width: 420, height: 290, borderRadius: 30, overflow: 'hidden', boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.9), 0 18px 40px rgba(30,30,50,0.10)'}}>
          <div style={{position: 'absolute', inset: -40, filter: 'blur(22px)'}}>
            <div style={{position: 'absolute', left: 60, top: -30, width: 260, height: 150, borderRadius: 30, background: '#2a2048'}} />
            <div style={{position: 'absolute', left: 190, top: 0, width: 260, height: 150, borderRadius: 30, background: '#5ec2c8'}} />
            <div style={{position: 'absolute', left: 20, top: 150, width: 180, height: 150, borderRadius: 60, background: '#f08a6a'}} />
            <div style={{position: 'absolute', left: 120, top: 120, width: 200, height: 160, borderRadius: 60, background: '#f0c8a8'}} />
          </div>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(246,245,248,0.52))'}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 735, textAlign: 'center', fontFamily: SANS, fontSize: 60, fontWeight: 500, color: lab}}>相册</div>
    </AbsoluteFill>
  );
};

export const CardOrbitCounter: React.FC = () => {
  const f = useCurrentFrame();
  const cursor = f >= 98 ? <Plane x={kf(f, [[98, 70], [103, 190, lin], [114, 160, EASE.out]])} y={kf(f, [[98, 30], [103, 180, lin], [114, 470, lin]])} rot={kf(f, [[98, 150], [108, 205], [114, 215]])} s={1.6} /> : null;
  if (f < CUT) return <AbsoluteFill style={{background: '#fdfdfd', overflow: 'hidden'}}><PreRoll f={f} /></AbsoluteFill>;
  if (f >= FOLDER) return <AbsoluteFill style={{overflow: 'hidden'}}><Folder f={f} />{cursor}<Grain opacity={0.025} /></AbsoluteFill>;

  const pull = EASE.exit(clamp((f - EXIT) / (FOLDER - EXIT)));
  const blur = f < CUT + 3 ? [10, 3, 0][f - CUT] : f >= EXIT ? mix(0, 10, clamp((f - EXIT + 1) / (FOLDER - EXIT))) : 0;
  const counterPull = 1 - pull * 0.45;
  return (
    <AbsoluteFill style={{background: '#fdfdfd', overflow: 'hidden'}}>
      <AbsoluteFill style={{filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined}}>
        <div style={{position: 'absolute', inset: 0, perspective: P, perspectiveOrigin: '50% 50%'}}>
          <div style={{position: 'absolute', left: 960, top: 540, width: 0, height: 0, transformStyle: 'preserve-3d'}}>
            <div style={{position: 'absolute', transformStyle: 'preserve-3d', transform: `scale(${counterPull})`}}><Counter f={f} /></div>
            {CARDS.map((c, i) => {
              const q = place(c, f, pull);
              // 画外的不画（性能）
              const s = P / (P - (q.z - C));
              const sx = q.x * s, sy = q.y * s;
              const half = (c.w * s) / 2 + 40;
              if (Math.abs(sx) - half > 1000 || Math.abs(sy) - half * 0.7 > 600) return null;
              const h = (c.w * 9) / 16;
              const fade = pull > 0 ? clamp(1 - pull * (0.4 + hash(i, 11) * 1.2)) : 1;
              return (
                <div key={i} style={{position: 'absolute', left: -c.w / 2, top: -h / 2, transform: `translate3d(${q.x.toFixed(2)}px, ${q.y.toFixed(2)}px, ${(q.z - C).toFixed(2)}px) rotateY(${q.face.toFixed(2)}deg) rotateX(${c.pitch.toFixed(1)}deg) rotateZ(${c.roll.toFixed(1)}deg) scale(${(1 - pull * 0.35).toFixed(3)})`, backfaceVisibility: 'hidden', opacity: fade}}>
                  <SceneCard kind={SCENE_KINDS[c.kind]} uid={`o${i}`} w={c.w} variant={i} />
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
      {cursor}
      <Grain opacity={0.025} />
    </AbsoluteFill>
  );
};
