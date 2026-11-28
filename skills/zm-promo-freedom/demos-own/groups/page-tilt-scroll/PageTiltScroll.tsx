// 【镜头组】page-tilt-scroll：蓝底中间浮着一整页任务表（玻璃边框）→ 页面后面升起一行巨大的白字"进行中" →
//   白字一换成"全部任务"、表里的内容淡出再换成按月份分组的全部任务 → 页面猛地斜过来、镜头扎进去 →
//   贴着斜放的表格一下一下往下翻（6月 → 5月 → 4月 → 3月），每一下先加速再慢慢停（018-G 一拍，功能演示）
// 学的动作（HSAji · Tonomo 35.40–42.567s，30fps 逐帧量过；时间表 （内部拆片记录，未随项目提供））：
//   页面 0.6 秒从下往上升 79px 到位；0.37–0.75 白字淡入、往上升 45px；1.667 白字直接换；1.70–1.95 表格内容淡出又淡入；
//   推镜用"同形变换"逐帧量：2.2–2.6 用整页做逐帧配准，2.7 / 2.93 用 22 个点（头像、日历图标、编号）手工拟合，
//   之后镜头再放大 1 → 1.33（以左上为准），内容往上滚三下（峰值 3.63 / 4.80 / 6.07 秒，最快每帧 55px，之后指数减速）。
// 我们的内容：「小周」全家任务页，6 月 / 5 月 / 4 月 / 3 月的家务、接送、缴费。
//
// 拍表（源秒 = 原片秒 − 35.40，30fps，共 215 帧）
//   拍 1 升起        0.00–0.95   页面升到位、白字升起来（停留点 1.20）
//   拍 2 换视图      1.60–2.00   白字直接换、表格内容淡出淡入（停留点 2.07）
//   拍 3 扎进去      2.15–2.93   页面斜过来、镜头扎到表格上
//   拍 4 往下翻      2.93–7.17   三下翻页，各自先加速后减速；最后接 018-H 的拉远
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有 1：白字在页面后面，下半截被页面挡住，自上而下渐隐
//   - 独有 2：斜放靠真正的透视（matrix3d），近处的行明显比远处大，不是 2D 旋转
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {Avatar, INK, Icon, KIND, LINK, Mark, SANS, Thumb} from '../_kit/familyBoard';
import {G_CORNERS, G_F0, G_SCROLL} from './track';

const FPS = 30;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const kfl = (t: number, K: number[][]) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], (t - K[i][0]) / (K[i + 1][0] - K[i][0])); return K[K.length - 1][1]; };

export const PAGE_TILT_SCROLL_CONTRACT: GroupContract = {
  sourceDuration: 215 / 30, // 7.167s
  fps: 30,
  motion: [[0, 0.95], [1.6, 2.0], [2.15, 215 / 30]],
  holds: [{at: 1.2, maxExtra: 1.5}, {at: 2.07, maxExtra: 1.0}],
  landmarks: {rise: 0, word: 0.37, swap: 1.667, refill: 1.85, dive: 2.2, flick1: 3.4, flick2: 4.65, flick3: 5.85, exit: 215 / 30},
  sfx: [
    {at: 'word', type: '上扬铺垫', note: '低沉 swell（大字升起）', tail: 0.4, volume: 0.3},
    {at: 'swap', type: '点击', note: '轻 click（切换视图）', volume: 0.3},
    {at: 'dive', type: '运镜', note: '快速推镜 whoosh', tail: 0.4, volume: 0.4},
    {at: 'flick1', type: '翻页', note: '纸张快速翻动 / 滚动 tick', tail: 0.5, volume: 0.25},
    {at: 'flick2', type: '翻页', note: '纸张快速翻动 / 滚动 tick', tail: 0.5, volume: 0.25},
    {at: 'flick3', type: '翻页', note: '纸张快速翻动 / 滚动 tick', tail: 0.5, volume: 0.25},
  ],
  inputs: {big1: {maxChars: 4}, big2: {maxChars: 4}, title: {maxChars: 6}},
};

export type TiltInputs = {big1: string; big2: string; title: string};
export const TILT_DEFAULT_INPUTS: TiltInputs = {big1: '进行中', big2: '全部任务', title: '全家任务'};
export const checkTiltInputs = (x: TiltInputs) => checkInputs(PAGE_TILT_SCROLL_CONTRACT, x);
export const planTilt = (sec: number) => planExtras(PAGE_TILT_SCROLL_CONTRACT, sec);
export const tiltFrames = (extras: number[]) => Math.round(outputDuration(PAGE_TILT_SCROLL_CONTRACT, extras) * FPS);
export const PAGE_TILT_SCROLL_DURATION = 215;

// ── 同形变换：平面页面四角 (408,251)(1621,251)(1621,932)(408,932) → 画面四角 ──
const Q = [[408, 251], [1621, 251], [1621, 932], [408, 932]];
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
    const [x, y] = Q[i], u = dst[i * 2], v = dst[i * 2 + 1];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
  }
  const h = solve(A, b); // h11 h12 h13 h21 h22 h23 h31 h32
  // CSS matrix3d 是列优先
  return `matrix3d(${h[0]},${h[3]},0,${h[6]},${h[1]},${h[4]},0,${h[7]},0,0,1,0,${h[2]},${h[5]},0,1)`;
};
const trackAt = (n: number) => {
  const i = clamp(n - G_F0, 0, G_CORNERS.length - 1), i0 = Math.floor(i), i1 = Math.min(G_CORNERS.length - 1, i0 + 1), k = i - i0;
  return {corners: G_CORNERS[i0].map((v, j) => mix(v, G_CORNERS[i1][j], k)), scroll: mix(G_SCROLL[i0], G_SCROLL[i1], k)};
};

// ── 页面里的数据（平面坐标 px，照原片 37.0s 量的列宽）──
const COLS = [
  {k: 'chk', x: 476, w: 22, t: ''}, {k: 'id', x: 498, w: 75, t: '编号', i: 'list'}, {k: 'place', x: 573, w: 127, t: '地点', i: 'pin'},
  {k: 'who', x: 700, w: 100, t: '负责人', i: 'users'}, {k: 'start', x: 800, w: 100, t: '开始', i: 'cal'}, {k: 'due', x: 900, w: 100, t: '截止', i: 'cal'},
  {k: 'kind', x: 1000, w: 100, t: '类别', i: 'bag'}, {k: 'helper', x: 1100, w: 100, t: '帮手', i: 'card'}, {k: 'lead', x: 1200, w: 100, t: '跟进人', i: 'card'},
  {k: 'tags', x: 1300, w: 102, t: '标签', i: 'tag'}, {k: 'status', x: 1402, w: 98, t: '状态', i: 'trend'}, {k: 'pay', x: 1500, w: 98, t: '费用', i: 'money'},
];
const ST: Record<string, [string, string]> = {进行中: ['#4c42db', '#fff'], 待开始: ['#e6e6e8', INK], 推迟: ['#f3a947', '#fff'], 已完成: ['#25daa3', '#fff'], 已付: ['#25daa3', '#fff'], 未付: ['#e9434a', '#fff'], 付了一半: ['#fbe7a1', '#e3851f'], 待报销: ['#8a35e0', '#fff']};
const PLACES = [['花家地小学', '东门 校车站'], ['望京西园', '三区 4 号楼', '交物业费'], ['社区医院', '二楼 内科', '外婆复查'], ['生鲜超市 酒仙桥', '周末食材'], ['4S 店 朝阳北路', '车辆保养'], ['家里 书房', '检查数学作业'], ['图书馆 朝阳分馆', '还书 续借'], ['宠物医院', '猫咪打疫苗'], ['少年宫', '三楼 钢琴课'], ['小区 南门', '快递柜取件'], ['银行 望京支行', '办社保卡'], ['奥森公园', '南门 跑步'], ['游泳馆', '二号池 体验课'], ['眼镜店 凯德', '配近视镜']];
const PEOPLE = ['妈妈', '爸爸', '外婆', '爷爷', '奶奶', '哥哥', '姑姑', '小雨'];
const KINDS = [['缴费'], ['接送', '线上'], ['采购'], ['体检', '线上'], ['接送'], ['缴费', '采购', '线上']];
type R = {id: string; place: string[]; who: number; start: string; due: string; kinds: string[]; helper: number; lead: number; tags?: boolean; st: string; pay: string; h: number; th: number};
const mkRows = (n: number, month: number, id0: number, seed: number, sts: [string, string][], hs: number[]): R[] =>
  Array.from({length: n}, (_, i) => {
    const q = (seed * 7 + i * 5) % 97;
    const d1 = 28 - ((i * 3 + seed) % 20), d2 = Math.min(30, d1 + 1 + (q % 6));
    return {id: `#${String(id0 - i).padStart(5, '0')}`, place: PLACES[(seed + i * 3) % PLACES.length], who: (seed + i) % 8, start: `${month}月${d1}日 ${9 + (q % 9)}:00`, due: `${month}月${d2}日 ${10 + (q % 8)}:00`,
      kinds: KINDS[(seed + i * 2) % KINDS.length], helper: (seed + i * 3 + 2) % 8, lead: (seed + i * 5 + 4) % 8, st: sts[i % sts.length][0], pay: sts[i % sts.length][1], h: hs[i % hs.length], th: (seed + i) % 8};
  });
// "进行中" 视图（原片 36.6s）
const ACTIVE = mkRows(9, 6, 6868, 1, [['已完成', '已付'], ['进行中', '已付'], ['进行中', '付了一半'], ['推迟', '已付'], ['待开始', '未付'], ['进行中', '付了一半'], ['待开始', '待报销'], ['进行中', '付了一半'], ['已完成', '已付']], [47, 46, 49, 62, 52, 50, 56, 50, 52]);
// "全部任务" 视图：按月分组（行高照原片 37.0s 的 5 月组）
const JUN = mkRows(8, 6, 6942, 3, [['待开始', '未付'], ['待开始', '未付'], ['进行中', '未付'], ['进行中', '未付'], ['进行中', '未付'], ['进行中', '未付'], ['进行中', '付了一半'], ['已完成', '已付']], [48, 61, 84, 51, 55, 49, 49, 61]);
JUN[2].tags = true;
const GROUPS: {label: string; n: number; rows: R[]}[] = [
  {label: '6月', n: 20, rows: JUN},
  {label: '5月', n: 26, rows: mkRows(5, 5, 6923, 5, [['进行中', '已付'], ['已完成', '已付'], ['进行中', '付了一半'], ['已完成', '已付'], ['进行中', '已付']], [55])},
  {label: '4月', n: 19, rows: mkRows(8, 4, 6907, 9, [['已完成', '已付'], ['已完成', '已付'], ['进行中', '已付'], ['已完成', '付了一半']], [56])},
  {label: '3月', n: 12, rows: mkRows(9, 3, 6888, 13, [['已完成', '已付'], ['已完成', '已付'], ['已完成', '待报销']], [51])},
];
const TAG_CHIPS: [string, string, string][] = [['重点关注', '#d00a64', '#fff'], ['每周一次', '#fdf4bf', '#b4470e'], ['已提醒', '#26dba4', '#183a2f'], ['加急', '#fde4ee', '#b3121f']];

const FS = 7.6;
const SS = 4; // 排版放大倍数
const Row: React.FC<{r: R; y: number; ri: number}> = ({r, y, ri}) => {
  const cell = (k: string): React.ReactNode => {
    switch (k) {
      case 'chk': return <div style={{width: 7, height: 7, borderRadius: 2, border: '0.8px solid #d6d8de', background: '#f6f7f9'}} />;
      case 'id': return <span style={{color: LINK, fontSize: FS}}>{r.id}</span>;
      case 'place': return <div style={{display: 'flex', alignItems: 'center', gap: 5}}><Thumb w={44} h={28} i={r.th} place={r.place.join('')} /><div style={{fontSize: FS, lineHeight: 1.45, color: INK}}>{r.place.map((l, i) => <div key={i}>{l}</div>)}</div></div>;
      case 'who': return <div style={{display: 'flex', alignItems: 'center', gap: 5, fontSize: FS, color: INK}}><Avatar name={PEOPLE[r.who]} size={17} i={r.who} />{PEOPLE[r.who]}</div>;
      case 'start': case 'due': return <div style={{display: 'flex', alignItems: 'center', gap: 4, fontSize: FS, color: INK, whiteSpace: 'nowrap'}}><Icon k="cal" s={7.5} />{k === 'start' ? r.start : r.due}</div>;
      case 'kind': return <div style={{display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start'}}>{r.kinds.map((t) => <span key={t} style={{display: 'inline-flex', alignItems: 'center', gap: 3, background: KIND[t].bg, color: KIND[t].fg, fontSize: 6.4, padding: '2px 4px', borderRadius: 2}}><span style={{width: 5, height: 5, border: `0.8px solid ${KIND[t].fg}`, borderRadius: 1}} />{t}</span>)}</div>;
      case 'helper': case 'lead': { const p = k === 'helper' ? r.helper : r.lead; return <div style={{display: 'flex', alignItems: 'center', gap: 5, fontSize: FS, color: INK}}><Avatar name={PEOPLE[p]} size={17} i={p + 2} photo />{PEOPLE[p]}</div>; }
      case 'tags': return r.tags
        ? <div style={{display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start'}}>{TAG_CHIPS.map(([t, bg, fg]) => <span key={t} style={{background: bg, color: fg, fontSize: 5.6, fontWeight: 700, padding: '1.5px 3px', borderRadius: 1.5}}>{t} ×</span>)}<span style={{fontSize: 5.4, color: LINK}}>+ 添加</span></div>
        : <span style={{fontSize: 6.6, color: '#9a9ea8'}}>+ 添加标签…</span>;
      default: return null;
    }
  };
  return (
    <div style={{position: 'absolute', left: 476, top: y, width: 1122, height: r.h, background: '#fff', borderBottom: '0.8px solid #ececf0'}}>
      {COLS.map((c) => {
        const x = c.x - 476;
        if (c.k === 'status' || c.k === 'pay') {
          const v = c.k === 'status' ? r.st : r.pay; const [bg, fg] = ST[v];
          return <div key={c.k} style={{position: 'absolute', left: x, top: 0, width: c.w, height: r.h, background: bg, color: fg, fontSize: 6.8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 -0.8px 0 rgba(255,255,255,0.7), inset -0.8px 0 0 rgba(255,255,255,0.7)'}}>{v}</div>;
        }
        return <div key={c.k} style={{position: 'absolute', left: x, top: 0, width: c.w, height: r.h, borderRight: '0.8px solid #efeff2', boxSizing: 'border-box', display: 'flex', alignItems: 'center', paddingLeft: c.k === 'chk' ? 7 : 7, overflow: 'hidden'}}>{cell(c.k)}</div>;
      })}
      {ri < 0 && null}
    </div>
  );
};
const ColHead: React.FC<{y: number}> = ({y}) => (
  <div style={{position: 'absolute', left: 476, top: y, width: 1122, height: 19, background: '#f6f6f8', borderBottom: '0.8px solid #e8e9ee'}}>
    {COLS.map((c) => <div key={c.k} style={{position: 'absolute', left: c.x - 476, top: 0, width: c.w, height: 19, display: 'flex', alignItems: 'center', gap: 3, paddingLeft: 7, fontSize: 6.2, fontWeight: 600, color: '#3a3d46', borderRight: '0.8px solid #ececf0', boxSizing: 'border-box'}}>{c.i && <Icon k={c.i} s={6} c="#3a3d46" />}{c.t}</div>)}
  </div>
);
const GroupLabel: React.FC<{y: number; label: string; n: number; color: string; month?: boolean}> = ({y, label, n, color, month}) => (
  <div style={{position: 'absolute', left: 476, top: y - 6, display: 'flex', alignItems: 'center', gap: 4, fontSize: 8.6, fontWeight: 700, color}}>
    {month ? <Icon k="cal" s={8} c={INK} /> : <span style={{width: 8, height: 8, borderRadius: 1.5, background: '#4c42db'}} />}{label}<span style={{color: '#8a8e99', fontWeight: 500}}>（{n}）</span><span style={{fontSize: 6}}>▲</span>
  </div>
);
const groupBlock = (rows: R[], y0: number, keyp: string) => {
  const els: React.ReactNode[] = [<ColHead key={keyp + 'h'} y={y0 + 11} />];
  let y = y0 + 30;
  rows.forEach((r, i) => { els.push(<Row key={keyp + i} r={r} y={y} ri={i} />); y += r.h; });
  return {els, end: y};
};

// 整页（平面坐标：玻璃外框在 (408,251)，1213×681）；018-H 也拿它当轮播里的一张卡
export const FamilyPage: React.FC<{swap: boolean; oldOp?: number; newOp?: number; scroll?: number; ext?: number; rise?: number; title?: string; startGroup?: number}> = ({swap, oldOp = 0, newOp = 1, scroll = 0, ext = 0, rise = 0, title = '全家任务', startGroup = 0}) => {
  // 全部任务：分组排版
  let y = 435; const allEls: React.ReactNode[] = [];
  GROUPS.slice(startGroup).forEach((g, gi) => {
    allEls.push(<GroupLabel key={'gl' + gi} y={y} label={g.label} n={g.n} color={INK} month />);
    const b = groupBlock(g.rows, y, 'g' + gi);
    allEls.push(...b.els);
    y = b.end + 22;
  });
  const act = groupBlock(ACTIVE, 435, 'a');

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${rise}px)`}}>
      {/* 玻璃边框 */}
      <div style={{position: 'absolute', left: 408, top: 251, width: 1213, height: 681 + ext, borderRadius: 28, background: 'rgba(196,224,252,0.55)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.8), 0 30px 70px rgba(8,50,140,0.22)'}} />
      <div style={{position: 'absolute', left: 420, top: 262, width: 1190, height: 660 + ext, borderRadius: 16, overflow: 'hidden', background: '#d6e8fc'}}>
        <div style={{position: 'absolute', left: -420, top: -262, width: 1920, height: 4000, transform: `translateY(${scroll}px)`, fontFamily: SANS}}>
          {/* 左侧图标栏 */}
          <div style={{position: 'absolute', left: 420, top: 262, width: 38, height: 3600, background: '#cfe0f4'}} />
          <div style={{position: 'absolute', left: 428, top: 271}}><Mark h={20} c="#111" /></div>
          {['cal', 'users', 'card', 'bag', 'cal', 'list', 'card', 'bag', 'users', 'cal', 'money', 'trend', 'tag', 'pin', 'bell'].map((k, i) => <div key={i} style={{position: 'absolute', left: 433, top: 309 + i * 25.5 + (i >= 4 ? 10 : 0)}}><Icon k={k} s={10} c="#2f3340" /></div>)}
          <div style={{position: 'absolute', left: 1470, top: 275, display: 'flex', alignItems: 'center', gap: 6, fontSize: 7, color: INK}}><Icon k="bell" s={9} /><Avatar name="妈妈" size={14} i={5} photo />妈妈 ⌄</div>
          <div style={{position: 'absolute', left: 1499, top: 306, width: 80, height: 20, borderRadius: 10, background: '#3d7cf2', color: '#fff', fontSize: 6.5, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>＋ 新任务</div>
          <div style={{position: 'absolute', left: 470, top: 306, fontSize: 12, fontWeight: 700, color: INK}}>{title}</div>
          <div style={{position: 'absolute', left: 470, top: 327, fontSize: 5.6, color: '#5b606c'}}>这里是全家所有的待办：可以新建任务、查看细节、跟进进度，也能看费用有没有付。</div>
          <div style={{position: 'absolute', left: 468, top: 358, height: 21, display: 'flex', alignItems: 'center', gap: 0, background: '#eef3fb', borderRadius: 11, boxShadow: '0 0 0 1.5px #fff', fontSize: 6.4, fontWeight: 700, color: INK, overflow: 'hidden'}}>
            {[['#4c42db', '进行中（8）'], ['#f5a524', '推迟（4）'], ['#e5323e', '需要处理（3）'], ['', '全部任务（480）']].map(([c, tx], i) => (
              <span key={i} style={{display: 'flex', alignItems: 'center', gap: 4, height: 21, padding: '0 8px', background: (swap ? i === 3 : i === 0) ? '#b9d4f6' : 'transparent'}}>{c ? <span style={{width: 7, height: 7, borderRadius: 1.5, background: c}} /> : <Icon k="cal" s={8} />}{tx}</span>
            ))}
          </div>
          <div style={{position: 'absolute', left: 470, top: 390, display: 'flex', gap: 8, fontSize: 5.6, color: INK}}>
            {['今天的事', '明天的事', '这周的事', '新成员'].map((x) => <span key={x} style={{background: '#fff', borderRadius: 8, padding: '3px 8px'}}>{x}</span>)}
          </div>
          <div style={{position: 'absolute', left: 1306, top: 364, display: 'flex', gap: 5, fontSize: 5, color: '#4a4e5a', alignItems: 'center'}}>按 <span style={{background: '#fff', borderRadius: 2, padding: '2px 4px'}}>开始日期 ⌄</span> 在 <span style={{background: '#fff', borderRadius: 2, padding: '2px 4px'}}>6月1–7日 ⌄</span><span style={{background: '#fff', borderRadius: 2, padding: '2px 4px'}}>由早到晚</span></div>
          {['pin', 'list', 'tag'].map((k, i) => <div key={k} style={{position: 'absolute', left: 1515 + i * 26, top: 393}}><Icon k={k} s={8} c="#2f3340" /></div>)}
          {/* 表格（左边一道竖色条） */}
          {!swap || oldOp > 0 ? (
            <div style={{opacity: swap ? oldOp : 1}}>
              <GroupLabel y={435} label="进行中" n={8} color="#4c42db" />
              <div style={{position: 'absolute', left: 473, top: 446, width: 2.5, height: act.end - 446, background: '#4c42db'}} />
              {act.els}
            </div>
          ) : null}
          {swap && newOp > 0 && (
            <div style={{opacity: newOp}}>
              <div style={{position: 'absolute', left: 473, top: 446, width: 2.5, height: 3000, background: '#30333c'}} />
              {allEls}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const PageTiltScrollGroup: React.FC<{inputs?: TiltInputs; extras?: number[]}> = ({inputs = TILT_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, PAGE_TILT_SCROLL_CONTRACT, extras);
  const lag = t - s;
  const n = 1062 + s * 30;
  const rise = kfl(s, [[0, 79], [0.1, 52], [0.2, 32], [0.3, 19], [0.4, 11], [0.5, 5], [0.6, 3], [0.7, 1], [0.8, 0]]);
  const drift = 1 + 0.004 * lag; // 停留时整体极慢推近
  const tr = trackAt(n);
  const H = n >= G_F0 ? homography(tr.corners) : undefined;
  const scroll = n >= G_F0 ? tr.scroll : 0;
  const ext = n >= 1143 ? 1600 : 0; // 扎进去以后页面底边早已出画，把页面往下接长
  const swap = s >= 1.667;
  const oldOp = 1 - clamp((s - 1.7) / 0.1), newOp = clamp((s - 1.85) / 0.1);
  const wordOp = clamp((s - 0.37) / 0.38), wordY = 45 * (1 - eo(s, 0.37, 0.8));
  const word = swap ? inputs.big2 : inputs.big1;

  const page = <FamilyPage swap={swap} oldOp={oldOp} newOp={newOp} scroll={scroll} ext={ext} rise={rise} title={inputs.title} />;

  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      {/* 背景（照原片 36.5s 取色）：左上浅蓝、右边深蓝 */}
      <AbsoluteFill style={{background: 'linear-gradient(104deg, #b2d7fd 0%, #93c6f8 14%, #66acf2 30%, #2f8ef3 52%, #0f7ef0 70%, #0778ea 86%, #0d7ff2 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 700px 420px at 1900px 1100px, rgba(80,165,250,0.85), rgba(80,165,250,0) 70%)'}} />
      <AbsoluteFill style={{transform: `scale(${drift})`, transformOrigin: '960px 560px'}}>
        {/* 大白字（在页面后面，自上而下渐隐） */}
        <div style={{position: 'absolute', left: 0, width: 1920, top: 58 + wordY + rise * 0.6, textAlign: 'center', fontSize: 226, fontWeight: 800, lineHeight: 1, letterSpacing: 4, opacity: wordOp,
          backgroundImage: 'linear-gradient(180deg, rgba(252,253,255,1) 0%, rgba(240,247,255,0.97) 38%, rgba(214,234,255,0.8) 62%, rgba(170,210,250,0.35) 82%, rgba(150,200,250,0.1) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', marginLeft: swap ? -40 : 60}}>{word}</div>
        {/* 页面按 4 倍尺寸排版再缩回去：贴脸时字才清楚（浏览器按排版尺寸栅格化） */}
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920 * SS, height: 1080 * SS, transformOrigin: '0 0', transform: `${H ?? ''} scale(${1 / SS})`}}>
          <div style={{zoom: SS, width: 1920, height: 1080, position: 'relative'}}>{page}</div>
        </div>
      </AbsoluteFill>
      <Grain opacity={0.03} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(PAGE_TILT_SCROLL_CONTRACT).length) throw new Error(checkContract(PAGE_TILT_SCROLL_CONTRACT).join('；'));
export const PageTiltScroll: React.FC = () => <PageTiltScrollGroup />;
