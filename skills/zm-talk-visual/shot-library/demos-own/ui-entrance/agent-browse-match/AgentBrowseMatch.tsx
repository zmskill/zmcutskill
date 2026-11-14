// AI 助手打一句话 → 自己开网页翻帖子 → 帖子变成漂浮卡逐张看 → 详情页里把条件一个个对上（003-S2 整段）
// 学的动作（来自 @bohdanmotion · Polar 0:04–0:17，按 25fps 逐帧看过，逐元素时间表见 shot-lab/refs/003-S2/逐元素时间表.md）：
//   连续性剪辑——每次硬切都有一个东西从上一镜带到下一镜：输入框（远景↔特写）→ 同样 3 张帖子卡（网页里 → 漂浮）→
//   主角卡（漂浮卡 → 它的详情页）→ 左边大字换词和右边滚动、高亮在同一帧
//   光标一直"活"：跟着移动方向转身、跟着景别一起变大、忙时变等待图标、漂浮卡那段同时 3 个光标
//   猛动作只有 1–3 帧、落地不回弹；安静段也一直在漂（从没有一帧完全静止）
// 我们的内容（中性，不宣传产品）：让助手"找几家周末能安静写稿的咖啡馆"，条件"很安静""有插座 · 不限时"一条条对上
//
// 时间表（30fps，共 392f；原片 25fps 13.08s 按秒换算）
//   S1   0–38   远景慢推，侧栏一行行长出，标题逐词出（先浅灰再变深），光标从左下进场
//   S2  38–96   硬切输入框特写：光标指上 → 转身 → 打字 → 横冲向发送键、停 0.25s、按下 → 输入框从光标下面掉走
//   S3  96–133  硬切远景：消息已发、输入框沉底、等待光标转；129 右上弹出深灰小面板
//   S4 133–163  2 帧猛推近；面板 深灰→中灰→白底青辉光；左边状态行一行行出；152 面板 2 帧撑大、镜头往左带，侧栏出画
//   S5 163–221  面板里先骨架，177 起 3 张帖子卡带青色罩依次弹出；198 起 3 张卡各自左右错开（卡 2 越出面板）
//   S6 221–302  硬切粉蓝渐变：同样 3 张卡变半透明漂浮卡，标题逐词被卡片"揭开"；镜头上漂、新卡进场、3 个光标；
//               269 标题 3 帧左滑，主角卡往中间来，其他卡淡出，最后只剩一张卡 + 一个光标
//   S7 302–392  硬切详情页：左边大字逐词出，光标从右往左拖选"很安静"（浅蓝 → 深蓝 + 选框）；
//               352 一下滚到下一家，左边同一帧换成"有插座"，再补"不限时"；高亮跟上；最后继续往上滚
// 毛病清单（自查表通用项 + 本镜头独有）：
//   - 独有 1：硬切前后主角的位置要接上（输入框、三张卡的上下顺序、主角卡和光标的位置）
//   - 独有 2：滚动和左边换词必须同一帧
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, FONT, Grain, mix, ramp} from '../../../kit/polish';

export const AGENT_BROWSE_MATCH_DURATION = 392;

const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const INK = '#2c2f3c';
const CYAN = '#20c4e0';
const GLOW = '#88e6f4';
const SEL = '#52c3e6';
type Ease = (t: number) => number;
const clamp = (x: number) => Math.max(0, Math.min(1, x));
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
// 浅灰 → 墨色
const ink = (k: number) => `rgb(${Math.round(mix(186, 44, k))},${Math.round(mix(188, 47, k))},${Math.round(mix(196, 60, k))})`;

// ───────── 光标：经典箭头 / 导航三角 / 等待球；rot 顺时针度数（0 = 经典箭头的朝向） ─────────
const Cursor: React.FC<{x: number; y: number; rot?: number; size?: number; kind?: 'arrow' | 'nav' | 'wait'; f?: number; press?: number; opacity?: number}> = ({x, y, rot = 0, size = 26, kind = 'arrow', f = 0, press = 0, opacity = 1}) => {
  if (kind === 'wait') {
    return (
      <div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: '50%', background: `conic-gradient(from ${(f * 24) % 360}deg, #111 0 50%, #fff 50% 100%)`, boxShadow: '0 2px 5px rgba(0,0,0,0.3), inset 0 0 0 1.5px #111', opacity}} />
    );
  }
  const s = size * (1 - press * 0.12);
  return (
    <svg width={s} height={s * 1.2} viewBox="0 0 22 26" style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot.toFixed(1)}deg)`, transformOrigin: '2px 2px', overflow: 'visible', filter: 'drop-shadow(1.5px 2.5px 2px rgba(0,0,0,0.32))', opacity}}>
      {kind === 'arrow'
        ? <path d="M2 2 L2 20 L7 15.5 L10.5 23 L13.5 21.6 L10 14.3 L17 14 Z" fill="#111" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
        : <path d="M2 2 L8 20 L11 12 L19 9 Z" fill="#141418" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />}
    </svg>
  );
};

// ───────── 应用窗口（S1–S5 共用，窗口坐标 1600×1000） ─────────
const WW = 1600, WH = 1000, SIDE = 320;
const RECENTS = ['找周末能写稿的咖啡馆', '整理本周会议记录', '总结未读邮件', '订周五去杭州的车票', '把照片按地点分好', '写一份读书笔记', '比较三款降噪耳机', '规划下周的跑步计划', '回复房东的消息', '做一张家庭开支表', '翻译这篇文章', '找一部周末看的电影', '记下今天的灵感', '查明天的天气', '准备面试问题', '整理收藏的菜谱', '给妈妈挑生日礼物', '找附近的羽毛球馆', '列出搬家要买的东西', '学 20 个日语单词', '算一下这个月的花销', '找一家安静的自习室'];
const DOTS = ['#4f8cff', '#ff8a5b', '#2fbf8f', '#b37dff', '#f2c230'];

type WinState = {f: number; rows: number; titleWords: number; input: 'center' | 'bottom'; typed: string; sendOn: number; press: number; fall: number; bubble: boolean; status: number; panel: number; grow: number; panelContent: number};
const TITLE = ['你好，', '今天', '想让我', '帮你', '做点', '什么？'];
const TYPED = '帮我找几家周末能安静写稿的咖啡馆';
const STATUS = ['正在新建标签页…', '正在读取页面', '正在查看帖子', '思考了 1 秒', '正在跳转到探店网…', '等待中', '等待网络空闲'];

const PostCard: React.FC<{name: string; tone: string; line: string; w?: number; tint?: number; glass?: number}> = ({name, tone, line, w = 520, tint = 0, glass = 0}) => (
  <div style={{position: 'relative', width: w, height: 200, borderRadius: 12, overflow: 'hidden', background: `rgba(255,255,255,${(1 - glass * 0.55).toFixed(3)})`, backdropFilter: glass > 0.01 ? `blur(${(glass * 18).toFixed(1)}px)` : undefined, WebkitBackdropFilter: glass > 0.01 ? `blur(${(glass * 18).toFixed(1)}px)` : undefined, boxShadow: '0 6px 18px rgba(40,50,70,0.08), 0 0 0 1px rgba(40,50,70,0.06)', fontFamily: SANS, padding: 22, boxSizing: 'border-box'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
      <div style={{width: 52, height: 52, borderRadius: 26, background: tone, color: '#fff', fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{name[0]}</div>
      <div><div style={{fontSize: 24, fontWeight: 700, color: INK, opacity: 1 - glass * 0.4}}>{name}</div><div style={{fontSize: 17, color: '#8a8f9c'}}>3 天前 · 探店笔记</div></div>
    </div>
    <div style={{marginTop: 16, fontSize: 21, color: '#4a4f5c', lineHeight: 1.5, opacity: 1 - glass * 0.4}}>{line}</div>
    <div style={{marginTop: 12, display: 'flex', gap: 8}}>{[90, 60, 120].map((x, i) => <div key={i} style={{height: 12, width: x, borderRadius: 6, background: '#e5e8ee'}} />)}</div>
    {tint > 0.01 && <div style={{position: 'absolute', inset: 0, background: `rgba(102,216,214,${(tint * 0.55).toFixed(3)})`}} />}
  </div>
);
const POSTS = [
  {name: '白鸟咖啡', tone: '#ff8a5b', line: '二楼靠窗那排几乎没人说话，适合一个人待着。'},
  {name: '北窗书房', tone: '#4f8cff', line: '每个位子下面都有插座，坐一下午也不催。'},
  {name: '山茶咖啡', tone: '#2fbf8f', line: '音乐很轻，下午三点以后人最少。'},
];

const AppWindow: React.FC<{s: WinState}> = ({s}) => {
  const {f} = s;
  const panelColor = s.panel < 1 ? '#3a3a3a' : s.panel < 2 ? '#808080' : '#f7fbfc';
  // 面板位置：小（右上）→ 撑大（右边 2/3）
  const px = mix(1100, 560, s.grow), py = mix(180, 70, s.grow), pw = mix(330, 1000, s.grow), ph = mix(200, 870, s.grow);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: WW, height: WH, fontFamily: SANS}}>
      {/* 玻璃外框（双层圆角）+ 窗体 */}
      <div style={{position: 'absolute', inset: -10, borderRadius: 30, background: 'rgba(255,255,255,0.35)', boxShadow: '0 40px 90px rgba(60,50,40,0.14), inset 0 0 0 1.5px rgba(255,255,255,0.7)'}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: 20, overflow: 'hidden', background: 'linear-gradient(180deg, #f9fefc, #eef1f2)'}}>
        {/* 顶栏 */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 52, display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 22}}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />)}
          <div style={{marginLeft: 26, padding: '6px 16px', borderRadius: 8, background: '#ffffff', fontSize: 17, color: '#555b68', boxShadow: '0 1px 2px rgba(0,0,0,0.06)'}}>整理本周会议记录</div>
          {f > 20 && <div style={{padding: '6px 16px', borderRadius: 8, fontSize: 17, color: '#8a8f9c'}}>探店网 · 首页</div>}
        </div>
        {/* 侧栏：任务列表一行行长出来 */}
        <div style={{position: 'absolute', left: 0, top: 52, width: SIDE, bottom: 0, background: 'rgba(240,243,244,0.8)', padding: '18px 20px', boxSizing: 'border-box'}}>
          <div style={{fontSize: 20, color: INK, fontWeight: 600, marginBottom: 10}}>＋ 新任务</div>
          <div style={{fontSize: 20, color: '#555b68', marginBottom: 22}}>⚙ 工作流</div>
          <div style={{fontSize: 16, color: '#9aa0ab', marginBottom: 10}}>最近</div>
          {RECENTS.slice(0, s.rows).map((t, i) => (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 10, height: 36, fontSize: 18, color: '#3b404c', whiteSpace: 'nowrap', overflow: 'hidden'}}>
              {i % 3 === 1 && <div style={{width: 8, height: 8, borderRadius: 4, background: DOTS[i % 5], flexShrink: 0}} />}{t}
            </div>
          ))}
        </div>
        {/* 聊天区 */}
        <div style={{position: 'absolute', left: SIDE, top: 52, right: 0, bottom: 0}}>
          {s.input === 'center' && (
            <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontSize: 44, fontWeight: 400, letterSpacing: '-0.02em', whiteSpace: 'pre'}}>
              {TITLE.map((w, i) => { const a = 6 + i * 6; return <span key={i} style={{opacity: ramp(f, a, 4, EASE.out), color: ink(ramp(f, a + 2, 8, EASE.smooth))}}>{w}</span>; })}
            </div>
          )}
          {s.bubble && <div style={{position: 'absolute', right: 40, top: 40, padding: '12px 22px', borderRadius: 22, background: '#eceff2', fontSize: 20, color: INK}}>{TYPED}</div>}
          {s.status > 0 && (
            <div style={{position: 'absolute', left: 28, top: 110, fontSize: 18, color: '#8a8f9c', lineHeight: 2}}>
              {STATUS.slice(0, Math.floor(s.status)).map((t, i) => <div key={i} style={{opacity: clamp(s.status - i)}}>{i < 3 ? '⟳ ' : '· '}{t}</div>)}
            </div>
          )}
          {/* 输入框 */}
          {s.input === 'center' ? (
            <div style={{position: 'absolute', left: 960 - SIDE - 360, top: 453 + s.fall * 60, width: 720, transform: `scale(${mix(1, 0.92, s.fall)})`, transformOrigin: '50% 0%'}}>
              <div style={{position: 'absolute', left: 30, right: 30, top: 96, height: 62, borderRadius: 14, background: '#e9ecef', opacity: 1 - s.fall, display: 'flex', alignItems: 'flex-end', padding: '0 0 10px 20px', boxSizing: 'border-box', fontSize: 16, color: '#8a8f9c'}}>▢ 选择项目</div>
              <div style={{position: 'relative', height: 120, borderRadius: 16, background: '#fbfdfe', boxShadow: '0 18px 40px rgba(40,50,70,0.08), 0 0 0 1px rgba(40,50,70,0.08)', padding: '18px 22px', boxSizing: 'border-box'}}>
                <div style={{fontSize: 22, color: s.typed ? INK : '#a3a8b3', whiteSpace: 'nowrap', overflow: 'hidden'}}>{s.typed || '描述你的任务，/ 调出命令，@ 引用内容'}{s.typed && s.typed.length < TYPED.length + 1 && <span style={{opacity: Math.floor(f / 6) % 2 ? 0 : 1, color: CYAN}}>|</span>}</div>
                <div style={{position: 'absolute', left: 22, right: 22, bottom: 14, display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, color: '#6a707c'}}>
                  <span style={{fontSize: 22}}>＋</span><span style={{padding: '4px 10px', borderRadius: 8, background: '#f0f2f4'}}>标准 ▾</span><span style={{flex: 1}} /><span style={{fontSize: 18}}>🎙</span>
                  <div style={{width: 40, height: 40, borderRadius: 20, background: s.sendOn > 0.5 ? CYAN : '#baf3ff', boxShadow: `0 0 0 3px ${s.sendOn > 0.5 ? 'rgba(32,196,224,0.25)' : 'rgba(32,196,224,0.15)'}`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, transform: `scale(${1 - s.press * 0.1})`, opacity: 1 - s.press * 0.3}}>↑</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{position: 'absolute', left: (WW - SIDE) / 2 - 300, bottom: 40, width: 600, height: 64, borderRadius: 16, background: '#fbfdfe', boxShadow: '0 0 0 1px rgba(40,50,70,0.08)', display: 'flex', alignItems: 'center', padding: '0 18px', boxSizing: 'border-box', fontSize: 18, color: '#a3a8b3'}}>继续补充…</div>
          )}
          {/* 侧边浏览器面板 */}
          {s.panel >= 0 && (
            <div style={{position: 'absolute', left: px - SIDE, top: py, width: pw, height: ph, borderRadius: 12, overflow: 'visible'}}>
              <div style={{position: 'absolute', inset: 0, borderRadius: 12, overflow: 'hidden', background: panelColor, boxShadow: s.panel >= 2 ? `inset 0 0 ${mix(12, 22, s.grow)}px ${mix(4, 8, s.grow)}px ${GLOW}, 0 0 0 2px rgba(136,230,244,0.7), 0 0 24px rgba(136,230,244,0.45)` : '0 0 0 2px rgba(136,230,244,0.6), 0 0 16px rgba(136,230,244,0.35)'}}>
                <div style={{height: 26, display: 'flex', alignItems: 'center', gap: 5, paddingLeft: 10, fontSize: 12, color: s.panel >= 2 ? '#8a8f9c' : '#bbb'}}>{[0, 1, 2].map((k) => <div key={k} style={{width: 7, height: 7, borderRadius: 4, background: s.panel >= 2 ? '#d3d7dd' : '#666'}} />)}<span style={{marginLeft: 8}}>新标签页</span></div>
                {s.grow > 0.5 && <PanelSite f={f} content={s.panelContent} />}
              </div>
            </div>
          )}
        </div>
        {/* 玻璃斜向高光带 */}
        <div style={{position: 'absolute', left: -400, top: -300, width: 700, height: 1800, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))', transform: 'rotate(-32deg)', pointerEvents: 'none'}} />
      </div>
    </div>
  );
};

// 面板里的网页：骨架 → 3 张帖子卡弹出 → 各自错开（content = 当前帧，用来算卡片动作）
const PanelSite: React.FC<{f: number; content: number}> = ({f}) => {
  const skeleton = f >= 163 && f < 177;
  const cardsOn = f >= 177;
  const spread = (i: number) => {
    const p = ramp(f, 198 + i * 3, 23, EASE.smooth);
    return [[180, 0], [-280, 10], [70, -6]][i].map((v) => v * p);
  };
  return (
    <div style={{position: 'absolute', left: 0, top: 26, right: 0, bottom: 0, fontFamily: SANS}}>
      <div style={{height: 60, display: 'flex', alignItems: 'center', gap: 14, padding: '0 24px', borderBottom: '1px solid #e9ecef', opacity: skeleton ? 0.3 : 1}}>
        <div style={{width: 40, height: 40, borderRadius: 10, background: '#ff6b4a', color: '#fff', fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>探</div>
        <div style={{flex: 1, height: 36, borderRadius: 18, background: '#f0f2f4', display: 'flex', alignItems: 'center', paddingLeft: 16, fontSize: 17, color: '#6a707c'}}>安静 咖啡馆 写稿</div>
      </div>
      <div style={{display: 'flex', gap: 10, padding: '16px 24px'}}>
        {['咖啡馆', '最新', '本月'].map((t) => <div key={t} style={{padding: '6px 16px', borderRadius: 16, background: skeleton ? '#e9ecef' : '#21a591', color: skeleton ? 'transparent' : '#fff', fontSize: 16}}>{t}</div>)}
      </div>
      {f < 163 && [0, 1, 2, 3].map((i) => <div key={i} style={{margin: '0 24px 14px', height: 120, borderRadius: 10, background: '#f3f5f7', opacity: 0.8}} />)}
      {skeleton && [0, 1, 2].map((i) => <div key={i} style={{margin: '0 24px 14px', height: 150, borderRadius: 10, background: '#eef1f4', opacity: 0.6}} />)}
      {cardsOn && POSTS.map((p, i) => {
        const at = [177, 180, 186][i];
        const pop = ramp(f, at, 4, EASE.out);
        const tint = 1 - ramp(f, at + 2, 6, EASE.smooth);
        const [dx, dy] = spread(i);
        return (
          <div key={p.name} style={{position: 'absolute', left: 24 + dx, top: 130 + i * 230 + dy, transform: `scale(${mix(0.6, 1, pop).toFixed(3)})`, transformOrigin: '30% 50%', opacity: Math.min(1, pop * 2)}}>
            <PostCard {...p} tint={tint} />
          </div>
        );
      })}
    </div>
  );
};

// ───────── 背景 ─────────
const WarmBackdrop: React.FC<{f: number; bright: boolean}> = ({f, bright}) => (
  <AbsoluteFill style={{background: bright ? 'radial-gradient(ellipse 90% 80% at 50% 40%, #f6f2ec, #e8e2da)' : 'radial-gradient(ellipse 90% 80% at 60% 40%, #e4dcda, #cfc6c4)', overflow: 'hidden'}}>
    <AbsoluteFill style={{filter: 'blur(40px)', opacity: bright ? 0.22 : 0.3, transform: `translate(${(Math.sin(f / 40) * 20).toFixed(1)}px, ${(Math.cos(f / 50) * 10).toFixed(1)}px)`}}>
      {Array.from({length: 10}, (_, i) => <div key={i} style={{position: 'absolute', left: hash(i, 1) * 1900 - 200, top: hash(i, 2) * 1000 - 100, width: 300 + hash(i, 3) * 500, height: 60 + hash(i, 4) * 120, borderRadius: '50%', background: '#5d5048', transform: `rotate(${(-30 + hash(i, 5) * 20 + Math.sin(f / 25 + i) * 3).toFixed(1)}deg)`}} />)}
    </AbsoluteFill>
    {bright && <div style={{position: 'absolute', left: 1600, top: 90, width: 120, height: 40, borderRadius: 20, background: 'linear-gradient(90deg, rgba(255,120,120,0.35), rgba(255,230,120,0.35), rgba(120,230,170,0.35), rgba(120,170,255,0.35))', filter: 'blur(8px)'}} />}
  </AbsoluteFill>
);
const PastelBackdrop: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: '#f4f3f2', overflow: 'hidden'}}>
    <AbsoluteFill style={{filter: 'blur(90px)'}}>
      {[['#edd6cb', 200, 150, 900], ['#d0e8ff', 1500, 160, 900], ['#dfdee9', 250, 900, 900], ['#f7f2ed', 1500, 900, 800]].map(([c, x, y, r], i) => (
        <div key={i} style={{position: 'absolute', left: Number(x) - Number(r) / 2 + Math.sin(f / 60 + i) * 60, top: Number(y) - Number(r) / 2 + Math.cos(f / 70 + i) * 40, width: Number(r), height: Number(r), borderRadius: '50%', background: String(c)}} />
      ))}
    </AbsoluteFill>
  </AbsoluteFill>
);

// ───────── 详情页（S7） ─────────
const SHOPS = [
  {name: '白鸟咖啡', sub: '二楼靠窗 · 步行 8 分钟', tags: ['很安静', '人少', '有书架'], hues: ['#ffd7c2', '#ffb48f'], tone: '#ff8a5b'},
  {name: '北窗书房', sub: '整面落地窗 · 步行 12 分钟', tags: ['有插座', '不限时', '靠窗位'], hues: ['#cfe1ff', '#8fb6ff'], tone: '#4f8cff'},
  {name: '山茶咖啡', sub: '老洋房一楼 · 地铁 2 站', tags: ['音乐轻', '下午人少', '有长桌'], hues: ['#cdeedd', '#86d4ae'], tone: '#2fbf8f'},
];
const DetailCard: React.FC<{shop: typeof SHOPS[number]; sel: number; selDark: number; selCount: number; f: number}> = ({shop, sel, selDark, selCount, f}) => {
  const tagText = shop.tags.join(' · ');
  const selW = selCount === 1 ? Array.from(shop.tags[0]).length * 26 + 8 : (Array.from(shop.tags[0]).length + Array.from(shop.tags[1]).length) * 26 + 40;
  return (
    <div style={{position: 'relative', width: 760, borderRadius: 16, overflow: 'hidden', background: '#ffffff', boxShadow: '0 16px 40px rgba(60,60,90,0.10), 0 0 0 1px rgba(40,50,70,0.06)', fontFamily: SANS}}>
      <div style={{height: 170, background: `linear-gradient(120deg, ${shop.hues[0]}, ${shop.hues[1]})`, position: 'relative', overflow: 'hidden'}}>
        <svg width="760" height="170" style={{position: 'absolute'}}>
          <path d="M520 120 q0 -50 50 -50 h40 q20 0 20 20 v10 q0 20 -20 20 h-10" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="8" />
          <rect x="490" y="70" width="110" height="70" rx="18" fill="rgba(255,255,255,0.55)" />
          {[0, 1, 2].map((i) => <path key={i} d={`M${515 + i * 28} ${58 - Math.sin(f / 8 + i) * 4} q8 -14 0 -28`} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="5" strokeLinecap="round" />)}
        </svg>
        <div style={{position: 'absolute', left: 32, top: 30, fontSize: 30, fontWeight: 700, color: 'rgba(255,255,255,0.95)', maxWidth: 400, lineHeight: 1.3}}>{shop.sub.split(' · ')[0]}</div>
      </div>
      <div style={{position: 'absolute', left: 32, top: 116, width: 108, height: 108, borderRadius: 54, background: shop.tone, border: '5px solid #fff', color: '#fff', fontSize: 46, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{shop.name[0]}</div>
      <div style={{padding: '66px 32px 26px'}}>
        <div style={{fontSize: 34, fontWeight: 700, color: INK}}>{shop.name}</div>
        <div style={{position: 'relative', marginTop: 8, fontSize: 26, color: '#4a4f5c', height: 40, whiteSpace: 'pre'}}>
          {sel > 0 && (
            <div style={{position: 'absolute', left: -4 + (1 - sel) * (selW - 10), top: -2, width: Math.max(10, selW * sel), height: 42, borderRadius: 6, background: selDark > 0.5 ? SEL : '#cfe8fb', boxShadow: selDark > 0.5 ? `0 0 0 2px ${SEL}` : undefined}}>
              {selDark > 0.5 && [[-5, -5], [selW * sel - 3, -5], [-5, 39], [selW * sel - 3, 39]].map(([x, y], i) => <div key={i} style={{position: 'absolute', left: x, top: y, width: 8, height: 8, background: '#fff', border: `2px solid ${SEL}`}} />)}
            </div>
          )}
          <span style={{position: 'relative', color: selDark > 0.5 ? '#fff' : sel > 0 ? '#1e6fb8' : undefined}}>{selCount === 1 ? shop.tags[0] : `${shop.tags[0]} · ${shop.tags[1]}`}</span>
          <span style={{position: 'relative'}}>{selCount === 1 ? tagText.slice(shop.tags[0].length) : tagText.slice(shop.tags[0].length + shop.tags[1].length + 3)}</span>
        </div>
        <div style={{marginTop: 6, fontSize: 20, color: '#8a8f9c'}}>4.8 分 · 1.2k 人收藏 · {shop.sub.split(' · ')[1]}</div>
        <div style={{marginTop: 18, display: 'flex', gap: 12}}>
          <div style={{padding: '10px 30px', borderRadius: 22, background: '#1f6fd1', color: '#fff', fontSize: 20, fontWeight: 600}}>＋ 收藏</div>
          {['导航', '分享'].map((t) => <div key={t} style={{padding: '10px 26px', borderRadius: 22, border: '2px solid #1f6fd1', color: '#1f6fd1', fontSize: 20, fontWeight: 600}}>{t}</div>)}
        </div>
      </div>
    </div>
  );
};

export const AgentBrowseMatch: React.FC = () => {
  const f = useCurrentFrame();

  // ═════ S1–S5：应用窗口 + 镜头 ═════
  if (f < 221) {
    let cx: number, cy: number, s: number;
    if (f < 38) { const k = ramp(f, 0, 38, EASE.linear); s = mix(1.22, 1.32, k); cx = mix(700, 740, k); cy = mix(430, 440, k); }
    else if (f < 96) { s = kf(f, [[38, 1.85], [78, 1.95, EASE.linear], [96, 1.82, EASE.smooth]]); cx = kf(f, [[38, 950], [78, 975, EASE.linear], [96, 985]]); cy = kf(f, [[38, 560], [78, 552, EASE.linear], [96, 575, EASE.smooth]]); }
    else if (f < 133) { s = 0.9 + 0.01 * Math.sin((f - 96) / 14); cx = 800 - 10 * Math.sin((f - 96) / 20); cy = 500 - 22 * ramp(f, 96, 37, EASE.smooth); }
    else {
      const k = ramp(f, 133, 3, EASE.out); // 2 帧猛推近
      const g = ramp(f, 152, 2, EASE.linear) * 0.8 + ramp(f, 154, 9, EASE.out) * 0.2; // 面板撑大时镜头往左带
      s = mix(0.9, 1.3, k) + 0.03 * ramp(f, 136, 85, EASE.linear);
      cx = mix(800, 820, k) + 220 * g - 10 * ramp(f, 163, 58, EASE.linear);
      cy = mix(478, 408, k) + 14 * ramp(f, 136, 16, EASE.smooth) - 8 * ramp(f, 136, 85, EASE.linear);
    }
    const snapBlur = (f >= 133 && f < 136) || (f >= 152 && f < 155) ? 3 : 0;
    const typedN = f < 54 ? 0 : Math.min(Array.from(TYPED).length, Math.floor((f - 54) * 1.4));
    const st: WinState = {
      f, rows: f < 38 ? Math.min(RECENTS.length, Math.floor(f / 1.5) + 1) : RECENTS.length, titleWords: 6,
      input: f < 96 ? 'center' : 'bottom', typed: Array.from(TYPED).slice(0, typedN).join(''), sendOn: typedN > 10 ? 1 : 0,
      press: f >= 85 && f < 96 ? 1 - ramp(f, 90, 6, EASE.out) * 0.5 : 0, fall: ramp(f, 89, 7, EASE.smooth),
      bubble: f >= 96, status: f < 135 ? 0 : f < 152 ? 1 + (f - 135) / 8 : 3 + Math.min(4, (f - 152) / 3),
      panel: f < 129 ? -1 : f < 135 ? 0 : f < 137 ? 1 : 2, grow: f < 152 ? 0 : ramp(f, 152, 2, EASE.linear) * 0.85 + ramp(f, 154, 9, EASE.out) * 0.15, panelContent: f,
    };
    const screen = (x: number, y: number) => [(x - cx) * s + 960, (y - cy) * s + 540];
    // 光标（窗口坐标）
    let cur: React.ReactNode = null;
    if (f >= 21 && f < 38) {
      const x = kf(f, [[21, 120], [37, 520, EASE.linear]]), y = kf(f, [[21, 1030], [37, 760, EASE.linear]]);
      cur = <Cursor x={x} y={y} rot={0} size={24} />;
    } else if (f >= 38 && f < 96) {
      const x = kf(f, [[38, 770], [41, 800, EASE.out], [51, 832, EASE.smooth], [63, 860, EASE.smooth], [69, 1060, EASE.swift], [75, 1262, EASE.out], [96, 1262]]);
      const y = kf(f, [[38, 612], [41, 604, EASE.out], [51, 596, EASE.smooth], [63, 606, EASE.smooth], [69, 600, EASE.swift], [75, 588, EASE.out], [96, 588]]);
      const rot = kf(f, [[38, 20], [51, 40, EASE.smooth], [63, 62, EASE.smooth], [69, 100, EASE.smooth], [73, 112, EASE.out]]);
      cur = <Cursor x={x} y={y} rot={rot} size={22} press={f >= 85 && f < 89 ? 1 : 0} />;
    } else if (f >= 98 && f < 221) {
      const [x, y] = [kf(f, [[98, 430], [150, 440], [220, 440]]), kf(f, [[98, 230], [150, 250, EASE.linear]])];
      cur = <Cursor x={x} y={y} kind="wait" f={f} size={18} />;
    }
    // 面板里的代理小光标
    const agentCur = f >= 140 && f < 152 ? <Cursor x={kf(f, [[140, 1330], [151, 1340]])} y={kf(f, [[140, 260], [151, 360]])} kind="nav" size={16} /> : f >= 190 && f < 221 ? <Cursor x={kf(f, [[190, 1150], [219, 1300]])} y={kf(f, [[190, 400], [219, 420]])} kind="nav" size={20} /> : null;
    // 提示药丸："正在打开 探店网"
    const pill = f >= 137 && f < 212 ? (() => {
      const col = ramp(f, 204, 4, EASE.out);
      const [x, y] = f < 152 ? [1220, 330] : [kf(f, [[152, 1380], [163, 1420]]), kf(f, [[152, 760], [163, 790], [180, 620], [200, 560]])];
      return <div style={{position: 'absolute', left: x, top: y, height: 40, padding: '0 18px', borderRadius: 20, background: col > 0.5 ? '#c9ccd2' : '#1b1c20', color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', width: col > 0.5 ? mix(240, 120, col) : undefined, opacity: 1 - ramp(f, 207, 5)}}>{col < 0.5 ? '正在打开 www.tandian.com' : ''}</div>;
    })() : null;
    void screen;
    return (
      <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
        <WarmBackdrop f={f} bright={f >= 96} />
        <AbsoluteFill style={{filter: snapBlur ? `blur(${snapBlur}px)` : undefined}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: WW, height: WH, transformOrigin: '0 0', transform: `translate(${(960 - cx * s).toFixed(2)}px, ${(540 - cy * s).toFixed(2)}px) scale(${s.toFixed(4)})`}}>
            <AppWindow s={st} />
            {pill}
            {agentCur}
            {cur}
          </div>
        </AbsoluteFill>
        <Grain opacity={0.035} blend="overlay" />
      </AbsoluteFill>
    );
  }

  // ═════ S6：漂浮卡 ═════
  if (f < 302) {
    const gy = kf(f, [[221, 0], [228, 0], [240, -150, EASE.smooth], [256, -185, EASE.out], [302, -200, EASE.linear]]);
    const glass = 1 - ramp(f, 221, 22, EASE.smooth);
    const titleX = kf(f, [[221, 960], [269, 980, EASE.linear], [272, 520, EASE.smooth], [302, 330, EASE.linear]]);
    const TW = ['看看', '为什么', '适合', '你'];
    const cards = [
      {i: 0, x: kf(f, [[221, 1430], [256, 1410], [290, 1380]]), y: kf(f, [[221, 345], [256, 345], [285, 400]]), o: 1 - ramp(f, 286, 8)},
      {i: 1, x: kf(f, [[221, 470], [227, 340, EASE.out], [262, 360, EASE.linear], [270, 380]]), y: kf(f, [[221, 578], [262, 600], [272, 380, EASE.smooth], [300, 330]]), o: 1 - ramp(f, 292, 8)},
      {i: 2, x: kf(f, [[221, 1450], [250, 1470], [256, 1560, EASE.smooth], [270, 1540], [292, 960, EASE.smooth]]), y: kf(f, [[221, 900], [256, 960, EASE.smooth], [270, 950], [292, 720, EASE.smooth], [302, 715]]), o: 1},
    ];
    const extra = [
      {key: 'r', post: {name: '晴天咖啡', tone: '#b37dff', line: '小区里的店，工作日下午很空。'}, x: kf(f, [[234, 960], [250, 900, EASE.out], [280, 920], [296, 1250, EASE.smooth]]), y: kf(f, [[234, 1300], [250, 1010, EASE.out], [280, 990], [296, 1150, EASE.smooth]]), o: Math.min(1, ramp(f, 234, 6) * 1) * (1 - ramp(f, 286, 10)), on: f >= 234},
      {key: 'm', post: {name: '巷口咖啡', tone: '#f2a33a', line: '桌子很大，摊开电脑很舒服。'}, x: kf(f, [[240, -320], [256, 160, EASE.out], [268, 200]]), y: kf(f, [[240, 780], [256, 770], [268, 760]]), o: 1 - ramp(f, 266, 8), on: f >= 240},
    ];
    const tintOf = (i: number) => i === 1 ? ramp(f, 228, 3) * (1 - ramp(f, 236, 6)) : i === 2 ? ramp(f, 234, 3) * (1 - ramp(f, 238, 6)) : 0;
    const c2 = cards[1], c3 = cards[2];
    return (
      <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
        <PastelBackdrop f={f} />
        <AbsoluteFill style={{transform: `translateY(${gy.toFixed(1)}px)`}}>
          {/* 标题在卡片下面一层：被卡片挡住，卡片滑开才露出来 */}
          <div style={{position: 'absolute', left: titleX, top: 600, transform: 'translate(-50%, -50%)', fontSize: 96, fontWeight: 600, letterSpacing: '-0.03em', whiteSpace: 'pre'}}>
            {TW.map((w, i) => { const a = 222 + i * 4; return <span key={i} style={{opacity: ramp(f, a, 3, EASE.out), color: ink(ramp(f, a + 1, 6, EASE.smooth))}}>{w}</span>; })}
          </div>
          {extra.filter((e) => e.on).map((e) => <div key={e.key} style={{position: 'absolute', left: e.x - 260, top: e.y - 100, opacity: e.o}}><PostCard {...e.post} glass={0} /></div>)}
          {cards.map((c) => <div key={c.i} style={{position: 'absolute', left: c.x - 260, top: c.y - 100, opacity: c.o}}><PostCard {...POSTS[c.i]} glass={glass} tint={tintOf(c.i)} /></div>)}
          {/* 三个光标：A 跟着卡 2，最后去主角卡；B 在标题下面转；C 跟着第四张卡 */}
          {f >= 228 && <Cursor kind="nav" size={34} x={f < 268 ? kf(f, [[228, -40], [234, c2.x - 40, EASE.out]]) + (f >= 234 ? c2.x - 40 - kf(234, [[228, -40], [234, c2.x - 40]]) : 0) : kf(f, [[268, c2.x - 40], [282, c3.x - 10, EASE.smooth], [302, c3.x - 6]])} y={f < 268 ? (f < 234 ? kf(f, [[228, 1150], [234, c2.y + 20, EASE.out]]) : c2.y + 20) : kf(f, [[268, c2.y + 20], [282, c3.y + 10, EASE.smooth], [302, c3.y + 12]])} rot={kf(f, [[228, 10], [234, 0], [268, 0], [274, 40], [282, 0]])} />}
          {f >= 234 && f < 292 && <Cursor kind="nav" size={34} x={kf(f, [[234, -40], [246, 720, EASE.out], [262, 780], [276, 700], [290, 640]])} y={kf(f, [[234, 1180], [246, 720, EASE.out], [262, 700], [276, 740], [290, 760]])} rot={kf(f, [[234, 15], [246, 0], [262, -10], [276, 15]])} opacity={1 - ramp(f, 284, 8)} />}
          {f >= 258 && f < 296 && <Cursor kind="nav" size={34} x={extra[0].x + 40} y={extra[0].y - 10} rot={-8} opacity={Math.min(1, ramp(f, 258, 4)) * (1 - ramp(f, 286, 10))} />}
        </AbsoluteFill>
        <Grain opacity={0.03} blend="overlay" />
      </AbsoluteFill>
    );
  }

  // ═════ S7：详情页 + 筛选词同步 ═════
  const colX = kf(f, [[302, 700], [310, 600, EASE.out]]);
  const colY = kf(f, [[302, 230], [308, 160, EASE.out], [340, 150], [351, 120, EASE.smooth], [354, -440, EASE.linear], [358, -470, EASE.out], [363, -486, EASE.smooth], [377, -492], [392, -760, EASE.smooth]]);
  const snapBlur = f >= 352 && f < 355 ? 4 : 0;
  const leftSet = f < 352 ? [['很', 305], ['安静', 309]] : [['有插座', 352], ['，不限时', 357]];
  const sel1 = ramp(f, 321, 4, EASE.out), sel1d = f >= 329 ? 1 : 0;
  const sel2 = f >= 363 ? 1 : 0, sel2d = f >= 366 ? 1 : 0;
  const CARD_GAP = 600;
  // 光标（屏幕坐标）
  const curX = kf(f, [[302, 960], [315, 960], [321, colX + 32 + 3 * 30 + 6, EASE.smooth], [325, colX + 34, EASE.out], [334, colX + 40], [350, colX + 200, EASE.smooth], [352, colX + 200], [360, colX + 210], [364, colX + 32 + 7 * 30, EASE.smooth], [372, colX + 200], [380, colX + 120, EASE.smooth], [392, colX + 300]]);
  const curY = kf(f, [[302, 300], [315, 330], [321, colY + 290, EASE.smooth], [334, colY + 300], [350, colY + 560, EASE.smooth], [352, colY + CARD_GAP + 230], [360, colY + CARD_GAP + 230], [364, colY + CARD_GAP + 290, EASE.smooth], [372, colY + CARD_GAP + 300], [380, colY + CARD_GAP + 400, EASE.smooth], [392, colY + CARD_GAP + 420]]);
  const curRot = kf(f, [[302, 0], [321, 0], [325, -40], [334, 0], [346, -70], [352, -80], [360, -60], [364, 0], [380, -20]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      <PastelBackdrop f={f} />
      <div style={{position: 'absolute', left: 130, top: 470, fontSize: 92, fontWeight: 600, letterSpacing: '-0.03em', whiteSpace: 'pre', transform: `translateX(${(-60 * ramp(f, 380, 12, EASE.smooth)).toFixed(1)}px)`}}>
        {leftSet.map(([w, a], i) => <span key={`${f < 352 ? 'a' : 'b'}${i}`} style={{opacity: ramp(f, Number(a), 2, EASE.out), color: ink(ramp(f, Number(a) + 1, 6, EASE.smooth))}}>{w}</span>)}
      </div>
      <AbsoluteFill style={{filter: snapBlur ? `blur(${snapBlur}px)` : undefined, transform: 'scale(1.22)', transformOrigin: `${(colX + 220).toFixed(1)}px 0px`}}>
        {SHOPS.map((shop, i) => (
          <div key={shop.name} style={{position: 'absolute', left: colX + 220, top: colY + i * CARD_GAP}}>
            <DetailCard shop={shop} f={f} sel={i === 0 ? sel1 : i === 1 ? sel2 : 0} selDark={i === 0 ? sel1d : i === 1 ? sel2d : 0} selCount={i === 0 ? 1 : 2} />
            <div style={{marginTop: 18, fontSize: 20, color: '#7a7f8c'}}><span style={{display: 'inline-block', transform: `rotate(${(f * 12) % 360}deg)`}}>⟳</span> 助手正在看第 {i + 1} 家{'.'.repeat(1 + (Math.floor(f / 8) % 3))}</div>
          </div>
        ))}
        <Cursor kind="nav" size={30} x={curX + 220} y={curY} rot={curRot} />
      </AbsoluteFill>
      <Grain opacity={0.03} blend="overlay" />
    </AbsoluteFill>
  );
};
