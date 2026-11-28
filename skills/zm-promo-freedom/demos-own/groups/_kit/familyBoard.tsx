// 公用零件：「小周」全家任务板（018 Tonomo 一组镜头共用：018-C / E / F / G / H）
// 照原片订单后台的版式量出来的：列宽、行高、标签颜色、状态格颜色都是原片的；内容换成我们的家庭待办。
// 三种用法：
//   <HeroBoard>  蓝色渐变头部 + 大标题 + 胶囊筛选条 + 白色表格卡（原片 13.8s、20.5s 那种放大的样子）
//   <PageBoard>  带左侧图标栏的整页（原片 15.5s 起斜放的那种），1600×920 设计尺寸
//   <RowCard>    只有一行的大卡片（原片 29.6s 起状态格变色的特写）
// 每个格子都可以"正在填入"：fill(row, col) 返回 0–1，<1 时字是蓝色、略虚（原片新填进来的格子先是蓝字）。
import React from 'react';
import {Img, staticFile} from 'remotion';
import {FONT} from '../../../assets/lib/helpers/polish';

export const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
export const INK = '#16181f';
export const LINK = '#2f6fe8';

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));

// ── 颜色（照原片取色）──
export const STATUS: Record<string, {bg: string; fg: string}> = {
  进行中: {bg: '#4a3fd8', fg: '#fff'},
  推迟: {bg: '#efa64d', fg: '#fff'},
  待开始: {bg: '#ececef', fg: INK},
  已完成: {bg: '#3eeea8', fg: '#fff'},
  已付: {bg: '#3eeea8', fg: '#fff'},
  付了一半: {bg: '#f7ee96', fg: '#e0862a'},
  未付: {bg: '#d9434d', fg: '#fff'},
  待报销: {bg: '#8a2be2', fg: '#fff'},
};
export const KIND: Record<string, {bg: string; fg: string}> = {
  缴费: {bg: '#fff1c4', fg: '#f08a00'},
  接送: {bg: '#f2e6ff', fg: '#a24de0'},
  采购: {bg: '#dcf8ea', fg: '#1fae68'},
  线上: {bg: '#e6e9ff', fg: '#3d47c9'},
  体检: {bg: '#ffe9c2', fg: '#f07c00'},
};
export const TAGC: Record<string, {bg: string; fg: string}> = {
  重点关注: {bg: '#c8185a', fg: '#fff'},
  每周一次: {bg: '#fff3bf', fg: '#e0700a'},
  已提醒: {bg: '#2fe3a4', fg: '#0b3b2a'},
  加急: {bg: '#ffe0ea', fg: '#c81d55'},
  外婆: {bg: '#3640c8', fg: '#fff'},
};
const AVA = ['#3d7cf2', '#f5a623', '#4a3fd8', '#2fd38a', '#f2994a', '#e94e8a', '#8a5cf6', '#22c1c3'];

export type Row = {
  id: string; place: string[]; who: string; start: string; due: string; kinds: string[];
  helper: string; lead: string; tags: string[]; status: string; pay: string; thumb: number;
};

export const ROWS: Row[] = [
  {id: '#06867', place: ['花家地小学', '东门', '接小雨放学'], who: '妈妈', start: '6月25日 9:00', due: '6月25日 13:00', kinds: ['缴费', '线上'], helper: '爸爸', lead: '外婆', tags: [], status: '进行中', pay: '已付', thumb: 0},
  {id: '#06866', place: ['望京西园', '三区 4 号楼', '交物业费'], who: '爸爸', start: '6月25日 11:00', due: '6月25日 17:00', kinds: ['接送'], helper: '哥哥', lead: '妈妈', tags: [], status: '进行中', pay: '付了一半', thumb: 1},
  {id: '#06865', place: ['社区医院', '二楼 内科', '外婆复查'], who: '外婆', start: '6月25日 10:00', due: '6月26日 9:00', kinds: ['缴费'], helper: '爸爸', lead: '外婆', tags: [], status: '推迟', pay: '已付', thumb: 2},
  {id: '#06864', place: ['生鲜超市 酒仙桥', '周末食材'], who: '哥哥', start: '6月25日 13:00', due: '6月26日 11:00', kinds: ['采购', '体检'], helper: '小雨', lead: '爸爸', tags: [], status: '待开始', pay: '未付', thumb: 3},
  {id: '#06863', place: ['4S 店 朝阳北路', '车辆保养'], who: '姑姑', start: '6月25日 12:00', due: '6月25日 18:00', kinds: ['缴费'], helper: '爸爸', lead: '哥哥', tags: [], status: '进行中', pay: '付了一半', thumb: 4},
  {id: '#06862', place: ['家里 书房', '检查数学作业'], who: '小雨', start: '6月25日 9:00', due: '6月25日 16:00', kinds: ['缴费'], helper: '妈妈', lead: '外婆', tags: [], status: '待开始', pay: '待报销', thumb: 5},
  {id: '#06861', place: ['图书馆 朝阳分馆', '还书 续借'], who: '爷爷', start: '6月25日 14:00', due: '6月26日 12:00', kinds: ['采购', '体检'], helper: '外婆', lead: '爸爸', tags: [], status: '进行中', pay: '付了一半', thumb: 6},
  {id: '#06860', place: ['宠物医院', '猫咪打疫苗'], who: '妈妈', start: '6月25日 10:00', due: '6月25日 15:00', kinds: ['采购', '体检'], helper: '外婆', lead: '哥哥', tags: [], status: '已完成', pay: '已付', thumb: 7},
];
// 新来的那一条（原片 22.6s 的"新订单"）
export const NEW_ROW: Row = {id: '#06868', place: ['花家地小学', '东门 校车站'], who: '奶奶', start: '6月26日 10:00', due: '6月26日 16:00', kinds: ['接送', '线上'], helper: '姑姑', lead: '外婆', tags: ['重点关注', '每周一次', '已提醒', '加急', '外婆'], status: '待开始', pay: '推迟', thumb: 0}; // 2026-11-17：地点是花家地小学，照片和第一行同一所学校（原来误用了超市那张）

// ── 小零件 ──
// 2026-11-17 第3轮：原片是真人头像 + 房子照片 → 换成真人照片（library/faces，一家人 f17–f21 / m20–m22）和实景照片（library/photos/places）
//   照片均来自 Unsplash（可免费商用），只作演示，不代表任何人为产品背书
export const FAMILY_FACE: Record<string, string> = {妈妈: 'f19', 爸爸: 'm20', 外婆: 'f17', 奶奶: 'f18', 爷爷: 'm21', 哥哥: 'm22', 小雨: 'f21', 姑姑: 'f20'};
export const Avatar: React.FC<{name: string; size: number; i?: number; photo?: boolean}> = ({name, size, i = 0}) => {
  const f = FAMILY_FACE[name];
  if (f) return <Img src={staticFile(`library/faces/${f}.jpg`)} style={{width: size, height: size, borderRadius: size, flex: 'none', objectFit: 'cover', display: 'block'}} />;
  return <div style={{width: size, height: size, borderRadius: size, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: size * 0.42, fontWeight: 600, background: AVA[i % AVA.length]}}>{Array.from(name)[0]}</div>;
};
// 地点照片：thumb 序号 → 实景照片（按每行地点配）
export const PLACE_PHOTO = ['school', 'resid', 'hosp', 'market', 'car', 'study', 'lib', 'vet'];
// 第4轮：传了地点文字（place）就按关键词配照片，避免"游泳馆配图书馆照片"这种错位；没匹配上再按序号轮换
const PLACE_KEY: [RegExp, string][] = [
  [/游泳|体育|球馆|健身/, 'places/school'],
  [/宠物|动物/, 'places/vet'], [/医院|诊所|门诊|卫生/, 'places/hosp'], [/图书|书店|阅览/, 'places/lib'], [/书房|写作业|作业/, 'places/study'],
  [/小学|中学|学校|幼儿园|少年宫|培训|课/, 'places/school'], [/超市|市场|菜场|生鲜|食材|买菜/, 'places/market'], [/车|站|停车|加油/, 'places/car'],
  [/公园|湖|河边|跑步|散步/, 'hz/hz04'], [/咖啡/, 'cafe/in1'], [/小区|家里|楼|快递|物业|门口/, 'places/resid'],
];
export const Thumb: React.FC<{w: number; h: number; i: number; place?: string}> = ({w, h, i, place}) => {
  const hit = place ? PLACE_KEY.find(([re]) => re.test(place)) : undefined;
  const src = hit ? hit[1] : `places/${PLACE_PHOTO[i % PLACE_PHOTO.length]}`;
  return (
    <div style={{width: w, height: h, borderRadius: 4, overflow: 'hidden', flex: 'none', background: '#dfe6ee'}}>
      <Img src={staticFile(`library/photos/${src}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
    </div>
  );
};
export const Pill: React.FC<{text: string; c: {bg: string; fg: string}; fs: number; x?: boolean}> = ({text, c, fs, x}) => (
  <span style={{display: 'inline-flex', alignItems: 'center', gap: fs * 0.35, background: c.bg, color: c.fg, fontSize: fs, fontWeight: x ? 700 : 500, lineHeight: 1, padding: `${fs * 0.32}px ${fs * 0.42}px`, borderRadius: fs * 0.18, whiteSpace: 'nowrap'}}>
    {!x && <span style={{width: fs * 0.82, height: fs * 0.82, borderRadius: fs * 0.18, border: `${Math.max(1, fs * 0.1)}px solid ${c.fg}`, boxSizing: 'border-box'}} />}
    {text}{x && <span style={{fontWeight: 400, marginLeft: fs * 0.15}}>×</span>}
  </span>
);
// 线条小图标（日历 / 列表 / 定位 / 人 / 包 / 名片 / 标签 / 趋势 / 钱）
export const Icon: React.FC<{k: string; s: number; c?: string}> = ({k, s, c = INK}) => {
  const p: Record<string, React.ReactNode> = {
    cal: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
    list: <path d="M8 6h13M8 12h13M8 18h13M3 6h1M3 12h1M3 18h1" />,
    pin: <><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
    users: <><circle cx="9" cy="8" r="3.5" /><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6M16 4.5a3.5 3.5 0 0 1 0 7M22 20c0-3-2-5-5-5.7" /></>,
    bag: <><rect x="4" y="7" width="16" height="14" rx="2" /><path d="M9 7V5a3 3 0 0 1 6 0v2" /></>,
    card: <><rect x="4" y="3" width="16" height="18" rx="2" /><circle cx="12" cy="10" r="3" /><path d="M7 18c1-2.5 3-3.5 5-3.5s4 1 5 3.5" /></>,
    tag: <path d="M3 6v6l8 8 9-9-8-8H5a2 2 0 0 0-2 2z" />,
    trend: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
    money: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M12 8v8M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2s1.1 1.6 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1 0-2-.5-2.5-1.5" /></>,
    bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 21h4" /></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" style={{flex: 'none', display: 'block'}}>{p[k]}</svg>;
};
// 我们的 logo（方点 + 勾）
export const Mark: React.FC<{h: number; c?: string}> = ({h, c = '#fff'}) => (
  <svg width={h} height={h} viewBox="-20 -20 140 140" style={{display: 'block', flex: 'none'}}>
    <rect x={8} y={8} width={26} height={26} rx={4} fill={c} />
    <path d="M20 58 L42 80 L90 30" stroke={c} strokeWidth={19} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// ── 列（放大版 HeroBoard 的尺寸，照原片 13.8s / 20.6s 量）──
export type ColKey = 'chk' | 'id' | 'place' | 'who' | 'start' | 'due' | 'kind' | 'helper' | 'lead' | 'tags' | 'status' | 'pay';
export const COLS: {k: ColKey; w: number; title: string; icon?: string}[] = [
  {k: 'chk', w: 65, title: ''},
  {k: 'id', w: 215, title: '编号', icon: 'list'},
  {k: 'place', w: 378, title: '地点', icon: 'pin'},
  {k: 'who', w: 281, title: '负责人', icon: 'users'},
  {k: 'start', w: 281, title: '开始', icon: 'cal'},
  {k: 'due', w: 281, title: '截止', icon: 'cal'},
  {k: 'kind', w: 284, title: '类别', icon: 'bag'},
  {k: 'helper', w: 262, title: '帮手', icon: 'card'},
  {k: 'lead', w: 262, title: '跟进人', icon: 'card'},
  {k: 'tags', w: 420, title: '标签', icon: 'tag'},
  {k: 'status', w: 300, title: '状态', icon: 'trend'},
  {k: 'pay', w: 300, title: '费用', icon: 'money'},
];
export const colX = (k: ColKey) => { let x = 0; for (const c of COLS) { if (c.k === k) return x; x += c.w; } return x; };
export const TABLE_W = COLS.reduce((a, c) => a + c.w, 0);

// 一个格子的内容（放大版尺寸，字号 23）
export const Cell: React.FC<{row: Row; k: ColKey; ri: number; fs?: number; fill?: number; statusOverride?: string; payOverride?: string}> = ({row, k, ri, fs = 23, fill = 1, statusOverride, payOverride}) => {
  const fresh = fill < 1; // 正在填入：蓝字、略透明
  const col = fresh ? LINK : INK;
  const op = clamp(fill * 3);
  const base: React.CSSProperties = {fontSize: fs, color: col, lineHeight: 1.38, opacity: op, whiteSpace: 'nowrap'};
  switch (k) {
    case 'chk': return <div style={{width: fs * 0.8, height: fs * 0.8, borderRadius: 4, border: '1.5px solid #d6d8de', background: '#f6f7f9'}} />;
    case 'id': return <div style={{...base, color: LINK}}>{row.id}</div>;
    case 'place': return (
      <div style={{display: 'flex', alignItems: 'center', gap: fs * 0.5, opacity: op}}>
        <Thumb w={fs * 5.6} h={fs * 3.7} i={row.thumb} place={row.place.join('')} />
        <div style={{fontSize: fs, color: col, lineHeight: 1.38}}>{row.place.map((l, i) => <div key={i}>{l}</div>)}</div>
      </div>
    );
    case 'who': return <div style={{display: 'flex', alignItems: 'center', gap: fs * 0.48, ...base}}><Avatar name={row.who} size={fs * 2.6} i={ri} /><span>{row.who}</span></div>;
    case 'start': case 'due': return <div style={{display: 'flex', alignItems: 'center', gap: fs * 0.45, ...base}}><Icon k="cal" s={fs} c={col} />{k === 'start' ? row.start : row.due}</div>;
    case 'kind': return <div style={{display: 'flex', flexDirection: 'column', gap: fs * 0.4, alignItems: 'flex-start', opacity: op}}>{row.kinds.map((t) => <Pill key={t} text={t} c={KIND[t]} fs={fs * 0.86} />)}</div>;
    case 'helper': case 'lead': return <div style={{display: 'flex', alignItems: 'center', gap: fs * 0.45, ...base}}><Avatar name={k === 'helper' ? row.helper : row.lead} size={fs * 2.2} i={ri + (k === 'lead' ? 4 : 2)} photo />{k === 'helper' ? row.helper : row.lead}</div>;
    case 'tags': {
      const t = row.tags;
      return (
        <div style={{display: 'flex', flexWrap: 'wrap', gap: fs * 0.5, width: COLS[9].w * (fs / 23) - fs * 1.6, opacity: op}}>
          {t.map((x) => <Pill key={x} text={x} c={TAGC[x]} fs={fs * 1.05} x />)}
        </div>
      );
    }
    case 'status': case 'pay': return null; // 状态格是整格上色，在行里单独画
  }
};

// ── 放大版：蓝色头部 + 表格 ──
// 坐标就是原片放大时的屏幕坐标（1920 宽）；y 是整页往上滚的量，x 是整页往左平移的量，zoom 以 (ox, oy) 为中心缩放
export const HeroBoard: React.FC<{
  rows?: Row[]; y?: number; x?: number; zoom?: number; ox?: number; oy?: number;
  fill?: (ri: number, k: ColKey) => number; title?: string; user?: string; counts?: number[]; group?: string;
  bellDot?: number; insertNew?: number; newRow?: Row; showNew?: boolean; bodyScroll?: number; tableX?: number; newBlur?: number;
}> = ({tableX = 0, newBlur = 0, bodyScroll = 0, showNew = false, rows = ROWS, y = 0, x = 0, zoom = 1, ox = 960, oy = 540, fill, title = '全家任务', user = '妈妈', counts = [6, 4, 3, 480], group = '进行中', bellDot = 0, insertNew = 0, newRow = NEW_ROW}) => {
  const TOP = 663; // 表格卡顶（照原片 20.6s）
  const ROW_H = 136, HEAD_H = 88;
  const groupLabel = (txt: string, n: number, ty: number) => (
    <div style={{position: 'absolute', left: 160, top: ty, display: 'flex', alignItems: 'center', gap: 12, color: '#fff', fontSize: 28, fontWeight: 600}}>
      <div style={{width: 27, height: 27, borderRadius: 4, background: txt === '待开始' ? '#d3e6ff' : '#4a3fd8'}} />{txt}<span style={{fontWeight: 500, letterSpacing: '0.12em'}}>（{n}）</span><span style={{fontSize: 16}}>▲</span>
    </div>
  );
  const table = (rs: Row[], ty: number, fillOffset: number, keyp: string, bs = 0) => (
    <div style={{position: 'absolute', left: 110 + tableX, top: ty, width: TABLE_W + 40, borderRadius: keyp === 'r' ? '62px 62px 0 0' : 62, padding: keyp === 'r' ? '16px 0 0 16px' : '16px 0 16px 16px', background: 'rgba(205,228,255,0.5)', boxShadow: 'inset 0 0 0 2.5px rgba(255,255,255,0.85), 0 18px 40px rgba(10,50,140,0.14)'}}>
      <div style={{background: '#fff', borderRadius: keyp === 'r' ? '48px 48px 0 0' : 48, overflow: 'hidden'}}>
        <div style={{display: 'flex', height: HEAD_H, background: '#f4f4f5', borderBottom: '1.5px solid #e6e6ea'}}>
          {COLS.map((c) => (
            <div key={c.k} style={{width: c.w, flex: 'none', display: 'flex', alignItems: 'center', gap: 14, paddingLeft: c.k === 'chk' ? 22 : 22, borderRight: '1.5px solid #e6e6ea', fontSize: 23, color: '#3a3d46', fontWeight: 500}}>
              {c.k === 'chk' ? <div style={{width: 18, height: 18, borderRadius: 4, border: '1.5px solid #d6d8de', background: '#f6f7f9'}} /> : <><Icon k={c.icon!} s={25} c="#3a3d46" />{c.title}</>}
            </div>
          ))}
        </div>
        <div style={{height: keyp === 'r' ? 2400 : undefined, overflow: 'hidden'}}><div style={{transform: `translateY(${-bs}px)`}}>
        {rs.map((r, ri) => {
          const h = r.place.length >= 3 ? ROW_H + 6 : ROW_H;
          return (
            <div key={keyp + ri} style={{display: 'flex', height: h, borderBottom: '1.5px solid #ececef'}}>
              {COLS.map((c) => {
                const f = fill ? fill(ri + fillOffset, c.k) : 1;
                if (c.k === 'status' || c.k === 'pay') {
                  const v = c.k === 'status' ? r.status : r.pay;
                  const sc = STATUS[v];
                  return <div key={c.k} style={{width: c.w, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: sc.bg, color: sc.fg, fontSize: 24, fontWeight: 700, opacity: clamp(f * 3), borderRight: '1.5px solid #fff'}}>{v}</div>;
                }
                return (
                  <div key={c.k} style={{width: c.w, flex: 'none', display: 'flex', alignItems: 'center', paddingLeft: c.k === 'chk' ? 22 : 22, borderRight: '1.5px solid #ececef', boxSizing: 'border-box'}}>
                    {f > 0 && <Cell row={r} k={c.k} ri={ri} fill={f} />}
                  </div>
                );
              })}
            </div>
          );
        })}
        </div></div>
      </div>
    </div>
  );
  const ins = clamp(insertNew);
  const shift = ins * 360; // 新插进来的一组把下面往下推
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${-x}px, ${-y}px) scale(${zoom})`, transformOrigin: `${ox + x}px ${oy + y}px`, fontFamily: SANS}}>
      {/* 头部 */}
      <div style={{position: 'absolute', left: 133, top: 226, display: 'flex', alignItems: 'center', gap: 16, color: '#fff'}}>
        <Mark h={52} /><span style={{fontSize: 50, fontWeight: 800, letterSpacing: '0.02em'}}>小周</span>
      </div>
      <div style={{position: 'absolute', left: 1492, top: 228, display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{width: 54, height: 54, borderRadius: 54, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
          <Icon k="bell" s={28} c="#111" />
          {bellDot > 0 && <div style={{position: 'absolute', right: 13, top: 11, width: 12 * bellDot, height: 12 * bellDot, borderRadius: 12, background: '#e5323e', transform: 'translate(50%,-50%)'}} />}
        </div>
        <Avatar name={user} size={54} i={5} photo />
        <span style={{fontSize: 26, color: '#2a2d36', marginLeft: 6}}>{user}</span><span style={{fontSize: 20, color: '#2a2d36'}}>⌄</span>
      </div>
      <div style={{position: 'absolute', left: 131, top: 346, fontSize: 68, fontWeight: 600, color: '#fff', lineHeight: 1}}>{title}</div>
      {showNew && <div style={{position: 'absolute', left: 1574, top: 352, width: 224, height: 54, borderRadius: 54, background: '#3d7cf2', color: '#fff', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxShadow: '0 14px 30px rgba(30,90,200,0.22)'}}><span style={{fontSize: 30, fontWeight: 300}}>＋</span>新任务</div>}
      {/* 胶囊筛选条（玻璃边） */}
      <div style={{position: 'absolute', left: 110, top: 455, width: 974, height: 100, borderRadius: 60, background: 'rgba(255,255,255,0.35)', boxShadow: 'inset 0 0 0 3px rgba(255,255,255,0.8), 0 6px 20px rgba(20,60,160,0.12)'}}>
        <div style={{position: 'absolute', left: 14, top: 12, right: 14, bottom: 12, borderRadius: 48, background: '#eef3fb', display: 'flex', alignItems: 'center', paddingLeft: 36, gap: 40, fontSize: 21, fontWeight: 600, color: '#1d2030'}}>
          {[['#4a3fd8', '进行中'], ['#f5a524', '推迟'], ['#e5323e', '需要处理'], ['', '全部任务']].map(([c, t], i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16}}>
              {c ? <div style={{width: 27, height: 27, borderRadius: 4, background: c}} /> : <Icon k="cal" s={30} c="#1d2030" />}
              {t}<span style={{fontWeight: 500, letterSpacing: '0.1em'}}>（{counts[i]}）</span>
            </div>
          ))}
        </div>
      </div>
      {ins > 0 && (
        <div style={{opacity: clamp(newBlur > 0 ? 1 - newBlur * 0.6 : 1), filter: newBlur > 0.02 ? `blur(${newBlur * 8}px)` : undefined}}>
          {groupLabel('待开始', 1, 612)}
          {table([newRow], 650, 100, 'n')}
        </div>
      )}
      {groupLabel(group, rows.length, 612 + shift)}
      {table(rows, TOP + shift, 0, 'r', bodyScroll)}
    </div>
  );
};

// ── 整页（斜放用）：1600×920，白底，左侧图标栏 ──
export const PageBoard: React.FC<{rows?: Row[]; title?: string; user?: string; extraGroups?: {label: string; rows: Row[]}[]; empty?: boolean}> = ({rows = ROWS, title = '全家任务', user = '妈妈', extraGroups = [], empty = false}) => {
  const W = 1600;
  const cols: {k: ColKey; w: number; title: string; icon?: string}[] = [
    {k: 'chk', w: 30, title: ''}, {k: 'id', w: 88, title: '编号', icon: 'list'}, {k: 'place', w: 140, title: '地点', icon: 'pin'}, {k: 'who', w: 112, title: '负责人', icon: 'users'},
    {k: 'start', w: 104, title: '开始', icon: 'cal'}, {k: 'due', w: 104, title: '截止', icon: 'cal'}, {k: 'kind', w: 104, title: '类别', icon: 'bag'}, {k: 'helper', w: 104, title: '帮手', icon: 'card'},
    {k: 'lead', w: 104, title: '跟进人', icon: 'card'}, {k: 'tags', w: 100, title: '标签', icon: 'tag'}, {k: 'status', w: 92, title: '状态', icon: 'trend'}, {k: 'pay', w: 92, title: '费用', icon: 'money'},
  ];
  const tw = cols.reduce((a, c) => a + c.w, 0);
  const FS = 11;
  const rowH = (r: Row) => (r.place.length >= 3 ? 80 : 72); // 8 行刚好铺到页面底（原片整页里表格占下面七成）
  const tbl = (rs: Row[], key: string) => (
    <div style={{width: tw, border: '1px solid #e8e9ee', borderLeft: '3px solid #4a3fd8', background: '#fff'}}>
      <div style={{display: 'flex', height: 28, background: '#f6f6f8', borderBottom: '1px solid #e8e9ee'}}>
        {cols.map((c) => <div key={c.k} style={{width: c.w, flex: 'none', display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 7, fontSize: 10, fontWeight: 600, color: '#3a3d46', borderRight: '1px solid #ececf0', boxSizing: 'border-box'}}>{c.icon && <Icon k={c.icon} s={9} c="#3a3d46" />}{c.title}</div>)}
      </div>
      {rs.map((r, ri) => (
        <div key={key + ri} style={{display: 'flex', height: rowH(r), borderBottom: '1px solid #efeff2'}}>
          {cols.map((c) => {
            if (empty) return <div key={c.k} style={{width: c.w, flex: 'none', borderRight: '1px solid #f0f0f3'}} />;
            if (c.k === 'status' || c.k === 'pay') {
              const v = c.k === 'status' ? r.status : r.pay; const sc = STATUS[v];
              return <div key={c.k} style={{width: c.w, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: sc.bg, color: sc.fg, fontSize: 10, fontWeight: 700, borderRight: '1px solid #fff', borderBottom: '1px solid #fff'}}>{v}</div>;
            }
            return <div key={c.k} style={{width: c.w, flex: 'none', display: 'flex', alignItems: 'center', paddingLeft: 7, borderRight: '1px solid #f0f0f3', boxSizing: 'border-box', overflow: 'hidden'}}><Cell row={r} k={c.k} ri={ri} fs={FS} /></div>;
          })}
        </div>
      ))}
    </div>
  );
  return (
    <div style={{width: W, height: 920, position: 'relative', background: '#fff', fontFamily: SANS, overflow: 'hidden'}}>
      {/* 左侧图标栏 */}
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 66, background: '#fafbfc', borderRight: '1px solid #eceef2', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 22, gap: 26}}>
        <Mark h={32} c="#111" />
        {['cal', 'users', 'card', 'bag', 'list', 'cal', 'card', 'bag', 'users', 'money', 'trend', 'tag', 'pin', 'bell'].map((k, i) => <Icon key={i} k={k} s={17} c="#3a3d46" />)}
      </div>
      <div style={{position: 'absolute', left: 1330, top: 22, display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#2a2d36'}}><Icon k="bell" s={15} c="#2a2d36" /><Avatar name={user} size={24} i={5} photo />{user} ⌄</div>
      <div style={{position: 'absolute', left: 1360, top: 70, background: '#3d7cf2', color: '#fff', fontSize: 11, padding: '7px 26px', borderRadius: 20}}>＋ 新任务</div>
      <div style={{position: 'absolute', left: 96, top: 68}}>
        <div style={{fontSize: 21, fontWeight: 700, color: INK}}>{title}</div>
        <div style={{fontSize: 9.5, color: '#6b6f7a', marginTop: 6}}>这里是全家所有的待办：可以新建任务、查看细节、跟进进度，也能看费用有没有付。</div>
      </div>
      <div style={{position: 'absolute', left: 92, top: 132, display: 'flex', gap: 18, alignItems: 'center', background: '#f1f4fa', borderRadius: 20, padding: '8px 16px', fontSize: 10.5, fontWeight: 600, color: INK}}>
        {[['#4a3fd8', '进行中（8）'], ['#f5a524', '推迟（4）'], ['#e5323e', '需要处理（3）'], ['', '全部任务（480）']].map(([c, t], i) => (
          <span key={i} style={{display: 'flex', alignItems: 'center', gap: 6}}>{c ? <span style={{width: 11, height: 11, borderRadius: 2, background: c}} /> : <Icon k="cal" s={12} />}{t}</span>
        ))}
      </div>
      <div style={{position: 'absolute', left: 92, top: 172, display: 'flex', gap: 10, fontSize: 9.5, color: INK}}>
        {['今天的事', '明天的事', '这周的事', '新成员'].map((t) => <span key={t} style={{border: '1px solid #e2e4ea', borderRadius: 14, padding: '6px 14px', background: '#fff'}}>{t}</span>)}
      </div>
      <div style={{position: 'absolute', left: 1080, top: 140, display: 'flex', gap: 10, fontSize: 9, color: '#4a4e5a', alignItems: 'center'}}>按 <span style={{border: '1px solid #e2e4ea', borderRadius: 4, padding: '3px 8px'}}>开始日期 ⌄</span> 在 <span style={{border: '1px solid #e2e4ea', borderRadius: 4, padding: '3px 8px'}}>6月1–7日 ⌄</span><span style={{border: '1px solid #e2e4ea', borderRadius: 4, padding: '3px 8px'}}>由早到晚</span></div>
      <div style={{position: 'absolute', left: 96, top: 226, display: 'flex', flexDirection: 'column', gap: 14}}>
        <div>
          <div style={{display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, fontWeight: 700, color: '#4a3fd8', marginBottom: 6}}><span style={{width: 12, height: 12, borderRadius: 2, background: '#4a3fd8'}} />进行中 <span style={{color: '#8a8e99', fontWeight: 500}}>（{rows.length}）</span> ▴</div>
          {tbl(rows, 'a')}
        </div>
        {extraGroups.map((g, gi) => (
          <div key={gi}>
            <div style={{display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, fontWeight: 700, color: INK, marginBottom: 6}}>{g.label} <span style={{color: '#8a8e99', fontWeight: 500}}>（{g.rows.length}）</span> ▴</div>
            {tbl(g.rows, 'g' + gi)}
          </div>
        ))}
      </div>
    </div>
  );
};

// 页面外面那圈玻璃边框（原片斜放的界面有一圈半透明的白边、圆角）
export const GlassFrame: React.FC<{w: number; h: number; r?: number; pad?: number; children: React.ReactNode}> = ({w, h, r = 34, pad = 16, children}) => (
  <div style={{width: w + pad * 2, height: h + pad * 2, borderRadius: r, padding: pad, boxSizing: 'border-box', background: 'rgba(255,255,255,0.32)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.75), 0 30px 60px rgba(10,50,140,0.18)', position: 'relative'}}>
    <div style={{width: w, height: h, borderRadius: r - pad + 4, overflow: 'hidden'}}>{children}</div>
  </div>
);

// 放大版的背景：左边亮蓝、右上偏白的斜向渐变（照原片 20.6s 取色）
export const HeroBg: React.FC<{y?: number}> = ({y = 0}) => (
  <>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(118deg, #0a63e0 0%, #1176ea 34%, #4b9cf0 52%, #b7d6fa 68%, #e2eefc 84%, #eef4fd 100%)'}} />
    <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse 900px 520px at 1500px ${180 - y * 0.3}px, rgba(255,255,255,0.55), rgba(255,255,255,0) 70%)`}} />
  </>
);
// 浅色背景（斜放界面那几镜：上浅灰白、下偏蓝，左右两边蓝光）
export const SoftBg: React.FC = () => (
  <>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #eef0f4 0%, #e6ebf3 40%, #b9d2f2 72%, #5d9ae8 100%)'}} />
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 520px 700px at -60px 820px, rgba(20,110,230,0.75), rgba(20,110,230,0) 70%), radial-gradient(ellipse 520px 700px at 1980px 760px, rgba(20,110,230,0.7), rgba(20,110,230,0) 70%)'}} />
  </>
);

// 右侧滑出的任务详情（原片 27.0s：深色头部 + 右上地图 + 左栏费用明细 + 右栏截止 / 负责人 / 备注）
export const TaskDrawer: React.FC<{row?: Row}> = ({row = NEW_ROW}) => {
  const card: React.CSSProperties = {background: '#fff', borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.04)'};
  const L = (a: string, b: string) => <div style={{display: 'flex', gap: 40, fontSize: 13, marginTop: 14}}><span style={{width: 98, color: '#6b6f7a'}}>{a}</span><span style={{fontWeight: 600, color: INK}}>{b}</span></div>;
  const item = (name: string, money: string, st: string, stc: {bg: string; fg: string}) => (
    <div style={{padding: '16px 0 4px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 600, color: INK}}><span>{name}</span><span style={{fontWeight: 500}}>{money}  ✎</span></div>
      <div style={{fontSize: 12.5, color: '#6b6f7a', marginTop: 8}}>6月26日 10:00 – 16:00　<span style={{color: LINK}}>▣ 改时间</span></div>
      <div style={{display: 'flex', gap: 10, marginTop: 12}}><span style={{background: stc.bg, color: stc.fg, fontSize: 12.5, padding: '5px 9px', borderRadius: 4}}>{st} ⌃</span><span style={{border: '1px solid #e2e4ea', fontSize: 12.5, padding: '4px 9px', borderRadius: 4, color: '#3a3d46'}}>⚙ <b style={{background: '#3d7cf2', color: '#fff', padding: '0 4px', borderRadius: 3, fontWeight: 600}}>姑</b> 姑姑</span></div>
    </div>
  );
  return (
    <div style={{width: 1020, height: 1080, background: '#f6f7f9', fontFamily: SANS, position: 'relative', overflow: 'hidden', boxShadow: '-20px 0 60px rgba(0,0,0,0.25)'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 628, height: 212, background: '#06182c', color: '#fff', padding: '62px 0 0 42px', boxSizing: 'border-box'}}>
        <div style={{fontSize: 14, textDecoration: 'underline', opacity: 0.9}}>任务 {row.id}</div>
        <div style={{fontSize: 30, fontWeight: 700, marginTop: 12}}>{row.place.join(' ')}</div>
        <div style={{fontSize: 16, opacity: 0.85, marginTop: 10}}>朝阳区 · 负责人 {row.who}</div>
      </div>
      {/* 地图：浅色街区 + 绿地 + 红色定位针 */}
      <div style={{position: 'absolute', left: 628, top: 0, width: 392, height: 212, background: '#e6e8ec', overflow: 'hidden'}}>
        {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{position: 'absolute', left: -40 + i * 78, top: -20, width: 10, height: 260, background: '#fff', transform: 'rotate(14deg)'}} />)}
        {[0, 1, 2].map((i) => <div key={'h' + i} style={{position: 'absolute', left: -20, top: 40 + i * 70, width: 440, height: 9, background: '#fff', transform: 'rotate(-6deg)'}} />)}
        <div style={{position: 'absolute', left: 52, top: 38, width: 120, height: 140, background: '#9fd49a', transform: 'rotate(8deg)'}} />
        <div style={{position: 'absolute', left: 168, top: 88, width: 26, height: 26, borderRadius: '50% 50% 50% 0', background: '#d8262f', transform: 'rotate(-45deg)'}} />
      </div>
      <div style={{position: 'absolute', left: 44, top: 240, fontSize: 21, fontWeight: 700, color: '#2a2d36'}}>费用与付款</div>
      <div style={{...card, position: 'absolute', left: 44, top: 282, width: 550, height: 776, padding: '22px 20px', boxSizing: 'border-box'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}><span style={{fontSize: 19, fontWeight: 700}}>账单 #1204</span><span style={{background: '#fff2c4', color: '#d67a00', fontSize: 12.5, padding: '4px 8px', borderRadius: 4}}>推迟 ⌃</span><span style={{marginLeft: 'auto', border: '1px solid #e2e4ea', borderRadius: 6, fontSize: 13, padding: '7px 14px', fontWeight: 600}}>▤ 查看账单 ▾</span></div>
        {item('校车费', '¥200.00', '推迟', {bg: '#fff2c4', fg: '#d67a00'})}
        {item('午餐费', '¥150.00', '进行中', {bg: '#e3ebff', fg: '#2f5fd0'})}
        <div style={{borderTop: '1px solid #eceef2', marginTop: 16, padding: '14px 0', display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 600}}><span>优惠<div style={{fontSize: 12.5, color: '#6b6f7a', fontWeight: 400}}>2026 年 6 月</div></span><span style={{color: '#1fa363'}}>-¥80.00  ✎</span></div>
        <div style={{borderTop: '1px solid #eceef2', padding: '14px 0', display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 600}}><span>手续费<div style={{fontSize: 12.5, color: '#6b6f7a', fontWeight: 400}}>2026 年 6 月</div></span><span style={{color: '#d0303c'}}>¥40.00  ✎</span></div>
        <div style={{display: 'flex', gap: 10, marginTop: 8}}>{['＋ 加一项', '＋ 加一组', '自定义 ▾'].map((x) => <span key={x} style={{flex: 1, background: '#e3ebfa', color: '#2f6fe8', fontSize: 13.5, textAlign: 'center', padding: '9px 0', borderRadius: 4}}>{x}</span>)}</div>
        <div style={{textAlign: 'right', fontSize: 15, fontWeight: 700, marginTop: 26, lineHeight: 1.9}}>小计　　¥310.00<br />合计　　¥310.00</div>
        <div style={{borderTop: '1px solid #eceef2', marginTop: 12, paddingTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 13.5}}><span>▭ <b>银行卡付款（*1049）</b><div style={{fontSize: 12.5, color: '#6b6f7a', marginLeft: 26}}>6月26日 周五 14:17</div></span><span>¥310.00<div style={{color: '#d0303c', fontSize: 12.5, marginTop: 14, fontWeight: 600}}>退款</div></span></div>
        <div style={{borderTop: '1px solid #eceef2', marginTop: 14, paddingTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 40, fontSize: 15, fontWeight: 700}}><span>待付余额</span><span style={{fontWeight: 500}}>¥0.00</span></div>
        <div style={{display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16}}>{['付款明细', '复制账单链接'].map((x) => <span key={x} style={{border: '1px solid #e2e4ea', fontSize: 13, padding: '10px 12px', borderRadius: 4, fontWeight: 600}}>{x}</span>)}<span style={{background: '#3d7cf2', color: '#fff', fontSize: 13, padding: '10px 26px', borderRadius: 4}}>⤓ 下载账单</span></div>
      </div>
      <div style={{position: 'absolute', left: 630, top: 282, width: 356}}>
        <div style={{...card, padding: '24px 18px 20px'}}><div style={{fontSize: 20, fontWeight: 600, color: '#2a2d36'}}>截止 <span style={{float: 'right', fontSize: 12}}>✎</span></div>{L('截止日期', '2026 年 6 月 26 日')}{L('截止时间', '16:00')}</div>
        <div style={{...card, padding: '10px 18px 18px', marginTop: 22}}>{L('创建时间', '2026 年 6 月 24 日')}{L('来源', '全家共享清单')}</div>
        <div style={{...card, padding: '22px 18px 20px', marginTop: 22}}>
          <div style={{fontSize: 20, fontWeight: 600, color: '#2a2d36', display: 'flex', justifyContent: 'space-between'}}>负责人<span style={{fontSize: 12.5, border: '1px solid #e2e4ea', padding: '6px 10px', borderRadius: 4, fontWeight: 600}}>换个人</span></div>
          <div style={{marginLeft: 56, marginTop: 14, fontSize: 13.5, lineHeight: 1.75, color: '#3a3d46'}}><b style={{color: INK}}>{row.who}</b><br />▣ 花家地小区 3 号楼<br />☏ 138-0013-6268<br />✉ nainai@xiaozhou.cn</div>
        </div>
        <div style={{...card, padding: '22px 18px 30px', marginTop: 34}}>
          <div style={{fontSize: 20, fontWeight: 600, color: '#2a2d36', display: 'flex', justifyContent: 'space-between'}}>备注<span style={{fontSize: 12.5, border: '1px solid #e2e4ea', padding: '6px 10px', borderRadius: 4, fontWeight: 600}}>查看全部</span></div>
          <div style={{fontSize: 13, color: '#6b6f7a', marginTop: 16}}>接送提醒</div><div style={{fontSize: 14, color: INK, marginTop: 4}}>放学前 15 分钟到东门校车站</div>
          <div style={{fontSize: 13, color: '#6b6f7a', marginTop: 16}}>备用联系人</div><div style={{fontSize: 14, color: INK, marginTop: 4}}>姑姑 139-0013-8862</div>
        </div>
      </div>
    </div>
  );
};

// 铃铛下面弹出的通知卡（原片 22.6s：小圆点 → 小胶囊 → 往左撑开成卡片，玻璃质感）
export const Toast: React.FC<{w: number; h: number; text: number; title?: string; sub?: string; time?: string}> = ({w, h, text, title = '收到新任务', sub = '外婆 · 任务 #06868', time = '刚刚'}) => (
  <div style={{width: w, height: h, borderRadius: Math.min(h / 2, 12), background: 'rgba(255,255,255,0.78)', boxShadow: '0 10px 26px rgba(20,70,170,0.18), inset 0 0 0 1px rgba(255,255,255,0.9)', fontFamily: SANS, padding: '12px 14px', boxSizing: 'border-box', overflow: 'hidden', backdropFilter: 'blur(6px)'}}>
    <div style={{opacity: text, whiteSpace: 'nowrap'}}>
      <div style={{fontSize: 14, fontWeight: 700, color: '#1d2030'}}>{title}</div>
      <div style={{fontSize: 12.5, color: '#3a3d46', marginTop: 4}}>{sub}</div>
      <div style={{fontSize: 11, color: '#8a8e99', marginTop: 3}}>{time}</div>
    </div>
  </div>
);
