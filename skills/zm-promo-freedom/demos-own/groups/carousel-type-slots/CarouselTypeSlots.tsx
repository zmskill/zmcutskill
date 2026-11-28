// 【镜头组】carousel-type-slots：贴脸的斜放任务页猛地拉远、摆正，变成一排横向轮播里的一张卡 →
//   轮播一下一下往左甩（每下先加速再刹住）→ 中间空出一个"文字框"（上面有 logo、参考线、四角小方块），
//   大字一个一个蹦进来"一眼看清"、右下角升起"全家的" → 继续甩 → 第二个文字框打出"大事"、升起大字"小事"（018-H 一拍，口号收尾）
// 学的动作（HSAji · Tonomo 42.567–47.133s，30fps 逐帧量过；时间表 （内部拆片记录，未随项目提供））：
//   拉远用页面卡四角逐帧量（前 6 帧接 018-G 的同形变换串配准，1284/1286/1290/1300 手工量四角，单调三次插值）；
//   轮播横移逐帧互相关（±260px）+ 文字框竖线校正：甩一下峰值每帧 121–127px，之间慢慢漂（每帧 8–40px）；
//   文字框出现后先从 52px 撑到全宽（0.7 秒），框右边的卡跟着被推开；字一个个上下交错蹦进来（每个 0.2 秒，带回弹）。
// 我们的内容：「小周」——"一眼看清 全家的 大事 小事"；轮播里是日程、任务页、周末去哪儿、概览、相册等界面。
//
// 拍表（源秒 = 原片秒 − 42.567，30fps，共 137 帧）
//   拍 1 拉远摆正    0.00–1.00   页面卡从贴脸拉远、透视摆正
//   拍 2 甩两下      1.00–1.80   轮播往左甩，第一个文字框进画
//   拍 3 第一句      1.77–2.45   大字蹦进来、右下角小字升起（停留点 2.30）
//   拍 4 甩 + 第二句 2.45–3.95   再甩两下，第二个文字框：小字打出来、大字升起（停留点 3.95）
//   拍 5 甩出去      4.00–4.57   最后加速往左甩，硬切 logo
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有 1：参考线、虚线、logo 都在轮播平面里，跟着一起透视、一起甩
//   - 独有 2：远离画面中间的卡有景深虚化
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {Avatar, INK, Icon, Mark, SANS} from '../_kit/familyBoard';
import {FamilyPage} from '../page-tilt-scroll/PageTiltScroll';
import {H_CORNERS, H_F0, H_X, H_X0} from './track';

const FPS = 30;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const kfl = (t: number, K: number[][]) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], (t - K[i][0]) / (K[i + 1][0] - K[i][0])); return K[K.length - 1][1]; };

export const CAROUSEL_TYPE_SLOTS_CONTRACT: GroupContract = {
  sourceDuration: 137 / 30, // 4.567s
  fps: 30,
  motion: [[0, 2.25], [2.35, 3.9], [4.0, 137 / 30]],
  holds: [{at: 2.3, maxExtra: 1.5}, {at: 3.95, maxExtra: 1.5}],
  landmarks: {pull: 0, swing1: 0.9, swing2: 1.5, word1: 1.77, small1: 2.15, swing3: 2.85, small2: 3.33, word2: 3.7, out: 4.3, exit: 137 / 30},
  sfx: [
    {at: 'pull', type: '运镜', note: '拉远 whoosh（反向）', tail: 0.4, volume: 0.35},
    {at: 'swing1', type: '短甩', note: '快速横甩 swish', volume: 0.3},
    {at: 'swing2', type: '短甩', note: '快速横甩 swish', volume: 0.3},
    {at: 'word1', type: '弹出', note: '一串轻 pop（逐字蹦出）', tail: 0.4, volume: 0.3},
    {at: 'swing3', type: '短甩', note: '快速横甩 swish', volume: 0.3},
    {at: 'small2', type: '键盘', note: '打字 tick', tail: 0.2, volume: 0.25},
    {at: 'word2', type: '落版重击', note: '低沉 thump（大字落定）', volume: 0.35},
    {at: 'out', type: '短甩', note: '加速甩出 whoosh', tail: 0.3, volume: 0.35},
  ],
  inputs: {big1: {maxChars: 4}, small1: {maxChars: 3}, small2: {maxChars: 3}, big2: {maxChars: 3}, brand: {maxChars: 4}},
};

export type SlotInputs = {big1: string; small1: string; small2: string; big2: string; brand: string};
export const SLOT_DEFAULT_INPUTS: SlotInputs = {big1: '一眼看清', small1: '全家的', small2: '大事', big2: '小事', brand: '小周'};
export const checkSlotInputs = (x: SlotInputs) => checkInputs(CAROUSEL_TYPE_SLOTS_CONTRACT, x);
export const planSlots = (sec: number) => planExtras(CAROUSEL_TYPE_SLOTS_CONTRACT, sec);
export const slotFrames = (extras: number[]) => Math.round(outputDuration(CAROUSEL_TYPE_SLOTS_CONTRACT, extras) * FPS);
export const CAROUSEL_TYPE_SLOTS_DURATION = 137;

// ── 同形变换：页面卡 R=(581,332)-(1325,750) → 画面四角 ──
const RQ = [[581, 332], [1325, 332], [1325, 750], [581, 750]];
const solve = (A: number[][], b: number[]) => {
  const n = b.length; const M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  return M.map((r, i) => r[n] / r[i]);
};
const homography = (dst: number[]) => {
  const A: number[][] = [], b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = RQ[i], u = dst[i * 2], v = dst[i * 2 + 1];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
  }
  const h = solve(A, b);
  return `matrix3d(${h[0]},${h[3]},0,${h[6]},${h[1]},${h[4]},0,${h[7]},0,0,1,0,${h[2]},${h[5]},0,1)`;
};
const xAt = (n: number) => { const i = clamp(n - H_X0, 0, H_X.length - 1), i0 = Math.floor(i), i1 = Math.min(H_X.length - 1, i0 + 1); return mix(H_X[i0], H_X[i1], i - i0); };
const cornersAt = (n: number) => {
  const last = H_F0 + H_CORNERS.length - 1;
  if (n > last) { const x = xAt(n); return [581 + x, 332, 1325 + x, 332, 1325 + x, 750, 581 + x, 750]; }
  const i = clamp(n - H_F0, 0, H_CORNERS.length - 1), i0 = Math.floor(i), i1 = Math.min(H_CORNERS.length - 1, i0 + 1);
  return H_CORNERS[i0].map((v, j) => mix(v, H_CORNERS[i1][j], i - i0));
};

// ── 卡片外壳（玻璃边 + 白卡），内容按"整页 1213×681"的尺寸排，再缩到卡高 418 ──
const K = 418 / 681;
const Shell: React.FC<{x: number; w: number; blur: number; children: React.ReactNode}> = ({x, w, blur, children}) => {
  const W = w / K;
  return (
    <div style={{position: 'absolute', left: x, top: 332, width: w, height: 418, filter: blur > 0.3 ? `blur(${blur}px)` : undefined}}>
      <div style={{width: W, height: 681, transform: `scale(${K})`, transformOrigin: '0 0', position: 'relative'}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 28, background: 'rgba(214,232,252,0.6)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.85), 0 26px 60px rgba(20,70,160,0.18)'}} />
        <div style={{position: 'absolute', left: 12, top: 11, right: 12, bottom: 11, borderRadius: 16, overflow: 'hidden', background: '#fff'}}>{children}</div>
      </div>
    </div>
  );
};
const EV = ['#a35cf0', '#f05ab4', '#2bb2f0', '#f5a524'];
const TopBar: React.FC<{w: number; dark?: string; title?: string}> = ({w, dark, title}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: w, height: 46, display: 'flex', alignItems: 'center'}}>
    {dark && <div style={{width: 130, height: 46, background: '#111', color: '#fff', display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 18, fontSize: 13, fontWeight: 700}}><Mark h={16} />{dark}</div>}
    {title && <div style={{marginLeft: 22, fontSize: 17, fontWeight: 700, color: INK}}>{title}</div>}
    <div style={{marginLeft: 'auto', marginRight: 22, display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: INK}}><Icon k="bell" s={13} /><Avatar name="妈妈" size={20} i={5} photo />妈妈 ⌄</div>
  </div>
);
// 周视图（日程）
const WeekGrid: React.FC<{x: number; y: number; w: number; h: number; seed: number}> = ({x, y, w, h, seed}) => {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const cw = w / 7;
  const blocks = [[1, 0.42, 0.25, 0], [2, 0.3, 0.42, 1], [2.55, 0.4, 0.35, 1], [3, 0.05, 0.3, 2], [4, 0.2, 0.55, 2], [4.5, 0.42, 0.45, 3], [0.2, 0.62, 0.25, 0], [5.4, 0.9, 0.08, 0]];
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
      {days.map((d, i) => <div key={d} style={{position: 'absolute', left: i * cw, top: 0, width: cw, textAlign: 'center', fontSize: 10, color: '#6b6f7a'}}>{d}<div style={{fontSize: 12, color: INK, marginTop: 3}}>{6 + i}</div></div>)}
      {days.map((d, i) => <div key={'l' + d} style={{position: 'absolute', left: i * cw, top: 40, width: 1, height: h - 40, background: '#eef0f4'}} />)}
      {blocks.map(([c, t, hh, k], i) => (
        <div key={i} style={{position: 'absolute', left: ((c + seed * 0.0) % 7) * cw + 4, top: 40 + t * (h - 40), width: cw * 0.82, height: hh * (h - 40), background: EV[(k + seed) % 4], borderRadius: 4, padding: 5, boxSizing: 'border-box', color: '#fff', fontSize: 8, lineHeight: 1.3}}>
          <div style={{width: 12, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.7)', marginBottom: 3}} />{['接小雨放学', '交物业费', '外婆复查', '周末买菜'][i % 4]}
        </div>
      ))}
    </div>
  );
};
const WeekCard: React.FC<{w: number}> = ({w}) => (
  <>
    <TopBar w={w} />
    <div style={{position: 'absolute', left: 22, top: 58, fontSize: 18, fontWeight: 700, color: INK}}>6月 第 2 周</div>
    <div style={{position: 'absolute', right: 26, top: 60, display: 'flex', gap: 8, fontSize: 10}}>{['日', '周', '月'].map((t, i) => <span key={t} style={{padding: '4px 10px', borderRadius: 4, background: i === 1 ? '#e6efff' : '#f4f5f7'}}>{t}</span>)}</div>
    <WeekGrid x={60} y={100} w={w - 90} h={540} seed={0} />
  </>
);
const ScheduleCard: React.FC<{w: number}> = ({w}) => (
  <>
    <TopBar w={w} dark="小周" />
    <div style={{position: 'absolute', left: 0, top: 46, width: 28, bottom: 0, background: '#f4f6fa'}} />
    <div style={{position: 'absolute', left: 50, top: 66, fontSize: 18, fontWeight: 700, color: INK}}>日程 <span style={{fontSize: 10, color: '#888', fontWeight: 400, marginLeft: 10}}>6月 6–12 日</span></div>
    <div style={{position: 'absolute', left: 50, top: 104, width: 250}}>
      <div style={{border: '1px solid #e2e5ea', borderRadius: 4, padding: '5px 8px', fontSize: 9, color: '#555'}}>🔍 花家地</div>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{marginTop: 16, borderLeft: `3px solid ${EV[i % 4]}`, paddingLeft: 8, fontSize: 9.5, lineHeight: 1.5, color: INK}}>
          <b>花家地小学 东门 校车站</b><div style={{color: '#666'}}>6月{6 + i}日 · 接小雨放学</div><div style={{color: EV[i % 4]}}>● {['姑姑', '奶奶', '爸爸', '外婆', '妈妈'][i]}</div>
        </div>
      ))}
    </div>
    <WeekGrid x={330} y={100} w={w - 360} h={540} seed={1} />
  </>
);
// 2026-11-17 第4轮：原片卡里是真实室内照片 → 换成真照片（library/photos/interior，Unsplash 免费授权）
const Photo: React.FC<{w: number; h: number; warm?: boolean}> = ({w, h, warm}) => (
  <Img src={staticFile(`library/photos/interior/${warm ? 'interior02' : 'interior05'}.jpg`)} style={{width: w, height: h, objectFit: 'cover', display: 'block'}} />
);
const DarkCard: React.FC<{w: number}> = ({w}) => (
  <>
    <div style={{position: 'absolute', left: 0, top: 0, width: 150, bottom: 0, background: '#fff', borderRight: '1px solid #eee'}}>
      <div style={{background: '#111', color: '#fff', height: 46, display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 16, fontSize: 13, fontWeight: 700}}><Mark h={16} />小周</div>
      {['个人资料', '全家日程', '新建任务', '概览', '收件箱', '任务管理', '相册', '成员', '日程', '记账', '提醒', '设置'].map((t, i) => <div key={t} style={{margin: '10px 12px', fontSize: 10, color: i === 2 ? '#fff' : '#333', background: i === 2 ? '#3d7cf2' : 'transparent', borderRadius: 4, padding: '4px 8px'}}>{t}</div>)}
    </div>
    <div style={{position: 'absolute', left: 150, top: 46}}><Photo w={(w - 150) * 0.48} h={635} warm /></div>
    <div style={{position: 'absolute', left: 150 + (w - 150) * 0.48, top: 46, right: 0, bottom: 0, background: '#0d0d0f', color: '#fff', padding: 22, boxSizing: 'border-box'}}>
      <div style={{fontSize: 30, fontWeight: 800}}>周末去哪儿</div>
      <div style={{fontSize: 10, color: '#aaa', marginTop: 6}}>全家一起挑，投票最多的就定了</div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 22}}>
        {[['湖边公园', 'hz/hz04'], ['古镇水乡', 'hz/hz02'], ['海边', 'travel/travel10'], ['山里', 'travel/travel14']].map(([t, ph]) => (
          <div key={t} style={{position: 'relative', height: 150, borderRadius: 6, overflow: 'hidden', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
            <Img src={staticFile(`library/photos/${ph}.jpg`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55))'}} />
            <b style={{position: 'relative', fontSize: 15}}>{t}</b><span style={{position: 'relative', fontSize: 8, color: '#ddd'}}>去看看</span></div>
        ))}
      </div>
    </div>
  </>
);
const Spark: React.FC<{w: number; h: number; seed: number}> = ({w, h, seed}) => {
  const pts = Array.from({length: 24}, (_, i) => `${(i / 23) * w},${h * (0.55 + 0.3 * Math.sin(i * 0.9 + seed) * Math.cos(i * 0.31 + seed * 2) - i * 0.012)}`).join(' ');
  return <svg width={w} height={h}><polyline points={pts} fill="none" stroke="#2f6fe8" strokeWidth={2} /></svg>;
};
const OverviewCard: React.FC<{w: number}> = ({w}) => (
  <>
    <TopBar w={w} dark="小周" />
    <div style={{position: 'absolute', left: 0, top: 46, width: 130, bottom: 0, background: '#f6f7fa', fontSize: 9.5, color: '#333', paddingTop: 10}}>{['概览', '个人资料', '全家日程', '新建任务', '收件箱', '任务管理', '相册', '成员', '日程', '记账', '提醒', '设置'].map((t) => <div key={t} style={{margin: '9px 14px'}}>{t}</div>)}</div>
    <div style={{position: 'absolute', left: 150, top: 64, right: 24}}>
      <div style={{fontSize: 18, fontWeight: 700, color: INK}}>概览</div>
      <div style={{fontSize: 10, color: '#666', marginTop: 6}}>这个月 6月1日 – 6月12日</div>
      <div style={{display: 'flex', marginTop: 12, width: 470, border: '1px solid #e8eaf0', borderRadius: 6}}>{[['4', '新任务'], ['3', '待处理'], ['3', '新成员'], ['3', '新提醒']].map(([a, b], i) => <div key={b} style={{flex: 1, padding: '10px 14px', borderLeft: i ? '1px solid #e8eaf0' : undefined}}><div style={{fontSize: 16, color: '#2f6fe8', fontWeight: 700}}>{a}</div><div style={{fontSize: 8.5, color: '#666'}}>{b}</div></div>)}</div>
      <div style={{fontSize: 11, fontWeight: 700, marginTop: 20, color: INK}}>花费一览</div>
      <div style={{display: 'flex', gap: 14, marginTop: 10}}>{[['总花费', '¥12,958'], ['任务数', '24'], ['平均每件', '¥1,020']].map(([a, b], i) => <div key={a} style={{flex: 1, border: '1px solid #e8eaf0', borderRadius: 6, padding: 10}}><div style={{fontSize: 9, color: '#444'}}>{a}</div><div style={{fontSize: 15, fontWeight: 700, color: INK}}>{b}</div><Spark w={200} h={50} seed={i} /></div>)}</div>
      <div style={{display: 'flex', gap: 14, marginTop: 18}}>
        <div style={{flex: 2, border: '1px solid #e8eaf0', borderRadius: 6, padding: 10, fontSize: 9, color: '#333'}}>
          <b style={{fontSize: 10}}>成员任务</b>
          {['妈妈', '爸爸', '外婆', '哥哥', '小雨'].map((p, i) => <div key={p} style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 9}}><Avatar name={p} size={16} i={i} />{p}<span style={{marginLeft: 'auto'}}>{12 - i * 2} 件</span></div>)}
        </div>
        <div style={{flex: 1, border: '1px solid #e8eaf0', borderRadius: 6, padding: 10, fontSize: 9, color: '#333'}}>
          <b style={{fontSize: 10}}>按类别</b>
          <div style={{display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', margin: '10px 0'}}>{['#2bb2f0', '#f59a24', '#a35cf0', '#f5c524', '#e9434a'].map((c, i) => <div key={c} style={{flex: 5 - i, background: c}} />)}</div>
          {['接送', '缴费', '采购', '体检', '其他'].map((t, i) => <div key={t} style={{display: 'flex', marginTop: 7}}><span style={{color: ['#2bb2f0', '#f59a24', '#a35cf0', '#f5c524', '#e9434a'][i]}}>●</span>&nbsp;{t}<span style={{marginLeft: 'auto'}}>{[50, 23, 10, 4, 3][i]}%</span></div>)}
        </div>
      </div>
    </div>
  </>
);
const MediaCard: React.FC<{w: number}> = ({w}) => (
  <>
    <div style={{position: 'absolute', left: 0, top: 0, width: w, height: 46, display: 'flex', alignItems: 'center'}}><div style={{width: 120, height: 46, background: '#111', color: '#fff', display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 14, fontSize: 13, fontWeight: 700}}><span style={{width: 18, height: 18, borderRadius: 9, background: '#e9434a'}} />相册</div></div>
    <div style={{position: 'absolute', left: 0, top: 46, width: 30, bottom: 0, background: '#f4f6fa'}} />
    <div style={{position: 'absolute', left: 50, top: 66}}><Photo w={w * 0.78} h={590} /></div>
    <div style={{position: 'absolute', left: 80, top: 360, color: '#fff', fontSize: 50, fontWeight: 900, lineHeight: 1.12, textShadow: '0 2px 10px rgba(0,0,0,0.3)'}}>列出来。<br />分下去。<br />做完它。</div>
    <div style={{position: 'absolute', left: w * 0.62, top: 120, width: w * 0.3, height: 430, background: '#fff', borderRadius: 8, boxShadow: '0 10px 30px rgba(0,0,0,0.25)', padding: 16, boxSizing: 'border-box', fontSize: 10, color: INK}}>
      <div style={{width: 22, height: 22, borderRadius: 11, background: '#e9434a'}} /><div style={{fontWeight: 700, marginTop: 10}}>欢迎回来</div><div style={{color: '#777', marginTop: 4}}>把这周的照片整理一下吧</div>
      <div style={{marginTop: 40, height: 22, borderRadius: 4, background: '#e9434a'}} />
    </div>
  </>
);
const PageCard: React.FC<{w: number; swap: boolean; scroll: number; startGroup: number}> = ({swap, scroll, startGroup}) => (
  <div style={{position: 'absolute', left: -420, top: -262}}>
    <FamilyPage swap={swap} scroll={scroll} startGroup={startGroup} />
  </div>
);

// ── 文字框 ──
const SS = 3; // 排版放大倍数
const FS1 = 170, FS1s = 150, FS2s = 112, FS2 = 230;
const cw = (s: string, fs: number) => Array.from(s).reduce((a, c) => a + (/[\x00-\x7f]/.test(c) ? 0.56 : 1) * fs, 0);
const Dot: React.FC<{x: number; y: number}> = ({x, y}) => <div style={{position: 'absolute', left: x - 8, top: y - 8, width: 16, height: 16, borderRadius: 8, background: '#fff', boxShadow: '0 0 6px rgba(255,255,255,0.8)'}} />;
const Handle: React.FC<{x: number; y: number}> = ({x, y}) => <div style={{position: 'absolute', left: x - 6, top: y - 6, width: 12, height: 12, background: '#fff'}} />;
// 一个字：从上 / 下错开蹦进来，带回弹
const pop = (t: number, t0: number, dir: number) => {
  const u = clamp((t - t0) / 0.2);
  if (u <= 0) return {o: 0, dy: 70 * dir};
  const e = 1 - Math.pow(1 - u, 3);
  const over = Math.sin(Math.PI * u) * 0.12;
  return {o: clamp(u * 4), dy: 70 * dir * (1 - e) - 70 * dir * over * (1 - u)};
};

export const CarouselTypeSlotsGroup: React.FC<{inputs?: SlotInputs; extras?: number[]}> = ({inputs = SLOT_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, CAROUSEL_TYPE_SLOTS_CONTRACT, extras);
  const lag = t - s;
  const n = 1277 + s * 30;
  const H = homography(cornersAt(n));
  const X = n >= H_X0 ? xAt(n) : 0;
  const pageScroll = mix(-2.7, 0, clamp((n - 1277) / 13));
  const guideOp = clamp((n - 1283) / 5);

  // 文字框宽度（按我们的字宽撑开）
  const w1f = cw(inputs.big1, FS1) + 32;
  const w2f = Math.max(cw(inputs.small2, FS2s) + 40, 80 + cw(inputs.big2, FS2)) + 32;
  const g1 = kfl(n, [[1320, 0], [1327, 0.505], [1329, 0.745], [1331, 0.878], [1335, 0.968], [1340, 0.995], [1342, 1]]);
  const g2 = kfl(n, [[1374, 0], [1380, 0.4], [1386, 0.78], [1392, 0.957], [1396, 1]]);
  const w1 = 52 + (w1f - 52) * g1, w2 = 52 + (w2f - 52) * g2;
  const slot1On = clamp((n - 1314) / 4), slot2On = clamp((n - 1366) / 4);

  // 轮播排布（轮播坐标）
  const S1 = 2839;
  const cards: {x: number; w: number; el: (w: number) => React.ReactNode}[] = [
    {x: -39, w: 560, el: (w) => <WeekCard w={w / K} />},
    {x: 581, w: 744, el: () => <PageCard w={744} swap scroll={pageScroll} startGroup={3} />},
    {x: 1400, w: 582, el: (w) => <DarkCard w={w / K} />},
    {x: 2040, w: 744, el: () => <PageCard w={744} swap={false} scroll={0} startGroup={0} />},
  ];
  const c4 = S1 + w1 + 48;
  const c5 = c4 + 570 + 55;
  const S2 = c5 + 580 + 51;
  const c6 = S2 + w2 + 51;
  cards.push({x: c4, w: 570, el: (w) => <ScheduleCard w={w / K} />}, {x: c5, w: 580, el: (w) => <OverviewCard w={w / K} />}, {x: c6, w: 580, el: (w) => <MediaCard w={w / K} />}, {x: c6 + 638, w: 744, el: () => <PageCard w={744} swap scroll={0} startGroup={1} />});
  const flatNow = n >= 1300;
  const dof = (x: number, w: number) => { if (!flatNow) return x + w / 2 + X < 300 ? 3 : 0; const c = x + w / 2 + X; return clamp((Math.abs(c - 960) - 560) / 45, 0, 9); };

  // 字
  const big1 = Array.from(inputs.big1), small1 = Array.from(inputs.small1), small2 = Array.from(inputs.small2), big2 = Array.from(inputs.big2);
  const tq = n / 30;
  const slotEls: React.ReactNode[] = [];
  // 第一个文字框
  if (slot1On > 0) {
    const x0 = S1;
    slotEls.push(
      <div key="s1" style={{opacity: slot1On}}>
        <div style={{position: 'absolute', left: x0 - 0.75, top: -600, width: 1.5, height: 2400, background: 'rgba(255,255,255,0.75)'}} />
        <div style={{position: 'absolute', left: x0, top: 174, width: 4000, height: 2, background: 'rgba(255,255,255,0.8)'}} />
        <div style={{position: 'absolute', left: x0 + 36, top: 104, display: 'flex', alignItems: 'center', gap: 12, color: '#fff', fontSize: 50, fontWeight: 700, whiteSpace: 'nowrap'}}><Mark h={54} />{inputs.brand}</div>
        <Dot x={x0} y={175} /><Dot x={x0} y={291} /><Dot x={x0} y={790} />
        <div style={{position: 'absolute', left: x0, top: 336, width: w1, height: 410, boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.85)', overflow: 'hidden'}}>
          {big1.map((c, i) => { const p = pop(tq, 1330 / 30 + i * 0.1, i % 2 ? 1 : -1); return <span key={i} style={{position: 'absolute', left: cw(big1.slice(0, i).join(''), FS1), top: 92 + p.dy, fontSize: FS1, fontWeight: 800, lineHeight: 1, color: '#fff', opacity: p.o}}>{c}</span>; })}
          {small1.map((c, i) => { const u = clamp((tq - (1342 / 30 + i * 0.067)) / 0.25); const e = 1 - Math.pow(1 - u, 3); return <span key={'m' + i} style={{position: 'absolute', left: w1 - 16 - cw(small1.slice(i).join(''), FS1s), top: 262 + 180 * (1 - e), fontSize: FS1s, fontWeight: 800, lineHeight: 1, color: '#fff', opacity: clamp(u * 3)}}>{c}</span>; })}
        </div>
        <Handle x={x0} y={336} /><Handle x={x0 + w1} y={336} /><Handle x={x0} y={746} /><Handle x={x0 + w1} y={746} />
      </div>,
    );
  }
  if (slot2On > 0) {
    const x0 = S2;
    slotEls.push(
      <div key="s2" style={{opacity: slot2On}}>
        <div style={{position: 'absolute', left: x0 - 0.75, top: -600, width: 1.5, height: 2400, background: 'rgba(255,255,255,0.75)'}} />
        <div style={{position: 'absolute', left: x0 - 4000, top: 174, width: 4000, height: 2, background: 'rgba(255,255,255,0.8)'}} />
        <Dot x={x0} y={175} /><Dot x={x0} y={291} /><Dot x={x0} y={790} />
        <div style={{position: 'absolute', left: x0, top: 336, width: w2, height: 410, boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.85)', overflow: 'hidden'}}>
          {small2.map((c, i) => { const t0 = 1377 / 30 + i * 0.067; const on = tq >= t0; const u = clamp((tq - t0) / 0.1); return on ? <span key={'s' + i} style={{position: 'absolute', left: 30 + cw(small2.slice(0, i).join(''), FS2s), top: 40, fontSize: FS2s, fontWeight: 700, lineHeight: 1, color: '#fff', opacity: 0.4 + 0.6 * u, transform: `scale(${0.9 + 0.1 * u})`, transformOrigin: '50% 100%'}}>{c}</span> : null; })}
          {big2.map((c, i) => { const t0 = 1388 / 30 + i * 0.133; const u = clamp((tq - t0) / 0.2); const e = 1 - Math.pow(1 - u, 3); return u > 0 ? <span key={'b' + i} style={{position: 'absolute', left: 80 + cw(big2.slice(0, i).join(''), FS2), top: 186 + 120 * (1 - e), fontSize: FS2, fontWeight: 800, lineHeight: 1, opacity: clamp(u * 2.5),
            backgroundImage: `linear-gradient(180deg, #fff ${40 + 60 * e}%, rgba(255,255,255,${0.2 + 0.8 * e}) 100%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{c}</span> : null; })}
        </div>
        <Handle x={x0} y={336} /><Handle x={x0 + w2} y={336} /><Handle x={x0} y={746} /><Handle x={x0 + w2} y={746} />
      </div>,
    );
  }

  const cam = 1 + 0.006 * lag;
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS, background: '#eef2f7'}}>
      {/* 两团大蓝光（照原片 43.5–46s：左上大、右下小，边缘极虚） */}
      <div style={{position: 'absolute', left: 640 - 520, top: 430 - 520, width: 1040, height: 1040, borderRadius: '50%', background: 'radial-gradient(circle, #0d74ec 0%, #1a7ff0 45%, rgba(40,140,245,0.75) 62%, rgba(120,185,250,0.25) 80%, rgba(238,242,247,0) 100%)', filter: 'blur(30px)'}} />
      <div style={{position: 'absolute', left: 1390 - 460, top: 770 - 460, width: 920, height: 920, borderRadius: '50%', background: 'radial-gradient(circle, #0b70ea 0%, #1a7ff0 45%, rgba(40,140,245,0.7) 62%, rgba(120,185,250,0.22) 80%, rgba(238,242,247,0) 100%)', filter: 'blur(30px)'}} />
      <AbsoluteFill style={{transform: `scale(${cam})`, transformOrigin: '960px 540px'}}>
        {/* 轮播平面：同形变换里已经含了横移 X；按 SS 倍排版再缩回去，拉远前贴脸时字才清楚 */}
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920 * SS, height: 1080 * SS, transformOrigin: '0 0', transform: `${H} scale(${1 / SS})`}}>
          <div style={{zoom: SS, position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}}>
            <div style={{position: 'absolute', left: -4000, top: 290, width: 12000, height: 2, opacity: guideOp, backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.85) 0 26px, transparent 26px 46px)'}} />
            <div style={{position: 'absolute', left: -4000, top: 789, width: 12000, height: 2, opacity: guideOp, backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.85) 0 26px, transparent 26px 46px)'}} />
            {cards.map((c, i) => (
              <Shell key={i} x={c.x} w={c.w} blur={dof(c.x, c.w)}>{c.el(c.w)}</Shell>
            ))}
            {slotEls}
          </div>
        </div>
      </AbsoluteFill>
      <Grain opacity={0.025} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(CAROUSEL_TYPE_SLOTS_CONTRACT).length) throw new Error(checkContract(CAROUSEL_TYPE_SLOTS_CONTRACT).join('；'));
export const CarouselTypeSlots: React.FC = () => <CarouselTypeSlotsGroup />;
