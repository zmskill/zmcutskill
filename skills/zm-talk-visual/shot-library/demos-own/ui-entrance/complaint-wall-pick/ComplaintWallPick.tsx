// 吐槽墙 → 多光标挑痛点 → 展开看证据 → 收成"最痛的 3 条"
// 学的动作（来自 @bohdanmotion · Polar 0:23–0:36）：一面斜放的卡片墙铺满画面 → 几个光标同时点选 →
//   选中的展开看细节 → 分三拍收成一张清单（表头先出 → 缩成名牌阶梯排开 → 一个个落进行里）。
// 我们自己的内容和设计（不抄原片画面）：
//   - 用途：宣传片开头的"真实用户痛点"——AI 从一大堆用户评论里挑出最痛的 3 条
//   - 卡片：评论卡（平台、星级、一句吐槽、点赞数），不是人物卡
//   - 光标：三个带名字的彩色光标（AI·情绪 / AI·频次 / AI·影响），像多人协作
//   - 配色：暖纸色底 + 墨色字 + 朱红强调（原片是冷白蓝）；光：顶部柔光 + 一道慢慢扫过的光带（原片是窗光树影）
//   - 选中态：卡片外一圈强调色描边 + 吐槽里的关键词被荧光笔划出来
// 质感要求（按 tools/shot-lab/自查表.md 和用户意见）：斜机位、卡片大且整齐、四周起雾、颗粒暗角、
//   转场分拍、每一拍都看得清。
// 时间表（30fps，共 300f）
//   0–76    卡片从右下一张张"发"到斜墙上（越来越快），左上计数"正在读 x 条用户评论"从 0 跑到 2,317
//   76–124  三个彩色光标进场，分别在 96 / 104 / 114 点中一张卡：描边亮起、关键词被划出、弹出小标签
//   124–196 其余卡退成背景虚影，三张卡飞到前面展开成"证据卡"（提到次数 / 差评占比 / 来源），数字往上滚
//   196–252 收：① 196 左边先出表头"最痛的 3 条"、斜墙摆正 ② 200–222 证据收起、缩成名牌阶梯排到表头右边
//           ③ 226–248 名牌一个接一个落进行里，那一行先出骨架再填内容
//   256–300 标题"读完。挑出。说中。"逐词出，停住
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, FONT, Grain, Vignette, mix, ramp, softShadow} from '../../../kit/polish';
import {PAPER, alpha} from '../../../kit/paper';

export const COMPLAINT_WALL_PICK_DURATION = 300;

const L = PAPER;
const ACC = L.accent; // 朱红
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const rnd = (i: number) => {
  const x = Math.sin(i * 61.37 + 9.13) * 43758.5453;
  return x - Math.floor(x);
};
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

// ── 内容：做视频的人对剪辑工具的吐槽（占位，换产品时换掉）──
const QUOTES = [
  '客户一句"再改改"我就崩溃', '字幕每句都要手动对轴', '模板一看就是模板', '找首合适的 BGM 能翻一下午', '调色调到眼睛花',
  '素材一多就卡成幻灯片', '导出一次要等二十分钟', '转场永远就那几个', '改一个字就得重新渲染', '封面做得比视频还久',
  '口播剪气口剪到凌晨', '横屏改竖屏全部重排', '一个镜头试了 8 种做法', '时间线一长就找不到东西', '多人协作全靠微信传文件',
  '配音对不上嘴型', '字体版权说不清', '想要的效果搜不到教程', '渲染到 99% 崩了', '同一套片头用了半年',
  '动效全靠关键帧手 K', '素材库找图比剪片还累', '每次都从空白工程开始', '品牌色每次都要重新吸', '剪完发现分辨率不对',
];
const PLATFORM = [['小红书', '#ff2442'], ['App Store', '#0a84ff'], ['抖音', '#111111'], ['知乎', '#0066ff'], ['B 站', '#fb7299']] as const;
// 被挑中的 3 条：关键词（会被荧光笔划出来）+ 证据数据
const PICKS = [
  {i: 6, at: 96, key: '二十分钟', who: 'AI · 频次', col: '#e5432d', n: 412, neg: 63, src: '小红书 · App Store'},
  {i: 8, at: 104, key: '重新渲染', who: 'AI · 情绪', col: '#d97706', n: 287, neg: 71, src: '抖音 · B 站'},
  {i: 17, at: 114, key: '搜不到教程', who: 'AI · 影响', col: '#0f766e', n: 196, neg: 58, src: '知乎 · 小红书'},
] as const;

// 世界坐标：5 列 × 5 行，隔列错半格
const CW = 470;
const CH = 150;
const CARDS = QUOTES.map((q, i) => {
  const c = i % 5;
  const r = Math.floor(i / 5);
  return {q, x: 960 + (c - 2) * 520, y: 540 + (r - 2) * 210 + (c % 2) * 105};
});
const ZMAX = 1.22;
const toWorld = (sx: number, sy: number) => ({x: 960 + (sx - 960) / ZMAX, y: 540 + (sy - 540) / ZMAX});
const DETAIL_AT = [toWorld(130, 170), toWorld(1250, 130), toWorld(690, 540)];

type Key = [number, number, number];
const pathAt = (keys: Key[], f: number) => {
  if (f <= keys[0][0]) return {x: keys[0][1], y: keys[0][2]};
  for (let k = 0; k < keys.length - 1; k++) {
    const [f0, x0, y0] = keys[k];
    const [f1, x1, y1] = keys[k + 1];
    if (f <= f1) {
      const t = ramp(f, f0, f1 - f0, EASE.swift);
      return {x: mix(x0, x1, t), y: mix(y0, y1, t) - Math.sin(t * Math.PI) * 24};
    }
  }
  const l = keys[keys.length - 1];
  return {x: l[1], y: l[2]};
};

// 带名字的彩色光标（多人协作风格）
const NamedCursor: React.FC<{x: number; y: number; o: number; col: string; name: string; down?: boolean}> = ({x, y, o, col, name, down}) => (
  <div style={{position: 'absolute', left: x, top: y, opacity: o, transform: `scale(${down ? 0.88 : 1})`, transformOrigin: '0 0', zIndex: 60, filter: 'drop-shadow(0 6px 10px rgba(40,25,10,0.25))'}}>
    <svg width="44" height="50" viewBox="0 0 22 25"><path d="M3 2 L3 21 L8.2 16.6 L11.6 23.6 L14.8 22.2 L11.6 15.2 L18.6 15 Z" fill={col} stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg>
    <div style={{position: 'absolute', left: 34, top: 38, whiteSpace: 'nowrap', background: col, color: '#fff', fontSize: 22, fontWeight: 700, padding: '6px 14px', borderRadius: 999, fontFamily: SANS}}>{name}</div>
  </div>
);

const Stars: React.FC<{n: number}> = ({n}) => (
  <span style={{letterSpacing: 2, fontSize: 20}}>
    {[0, 1, 2, 3, 4].map((k) => <span key={k} style={{color: k < n ? '#f59e0b' : 'rgba(23,19,15,0.15)'}}>★</span>)}
  </span>
);

const Card: React.FC<{i: number; sel?: number; mark?: number; col?: string; keyword?: string}> = ({i, sel = 0, mark = 0, col = ACC, keyword}) => {
  const [pf, pc] = PLATFORM[i % PLATFORM.length];
  const q = QUOTES[i];
  const k = keyword && q.includes(keyword) ? q.indexOf(keyword) : -1;
  return (
    <div style={{position: 'relative', width: CW, height: CH, borderRadius: 24, padding: '20px 24px', boxSizing: 'border-box', background: 'linear-gradient(180deg, #fffdf9, #faf6ef)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: `inset 0 1px 0 #fff, ${softShadow(14, {color: L.shadow, strength: 0.45})}`, fontFamily: SANS}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, color: L.ink3}}>
        <span style={{width: 10, height: 10, borderRadius: 5, background: pc}} />
        <span style={{fontWeight: 600, color: L.ink2}}>{pf}</span>
        <Stars n={1 + (i % 2)} />
        <span style={{marginLeft: 'auto'}}>{1 + Math.floor(rnd(i) * 23)} 小时前</span>
      </div>
      <div style={{fontSize: 30, fontWeight: 650, color: L.ink, marginTop: 14, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden'}}>
        {k < 0 ? (
          `"${q}"`
        ) : (
          <>
            "{q.slice(0, k)}
            <span style={{position: 'relative', display: 'inline-block'}}>
              {/* 荧光笔：从左往右划出来 */}
              <span style={{position: 'absolute', left: -4, right: -4, bottom: 2, height: '46%', background: alpha(col, 0.28), transformOrigin: 'left center', transform: `scaleX(${mark.toFixed(3)})`, borderRadius: 4}} />
              <span style={{position: 'relative'}}>{keyword}</span>
            </span>
            {q.slice(k + (keyword ?? '').length)}"
          </>
        )}
      </div>
      <div style={{position: 'absolute', left: 24, bottom: 16, fontSize: 17, color: L.ink3}}>👍 {120 + Math.floor(rnd(i + 5) * 2400)} · 回复 {8 + Math.floor(rnd(i + 6) * 90)}</div>
      {sel > 0.01 && <div style={{position: 'absolute', inset: -8, borderRadius: 30, border: `3px solid ${alpha(col, 0.9 * sel)}`, boxShadow: `0 0 0 ${(8 * sel).toFixed(1)}px ${alpha(col, 0.1 * sel)}`}} />}
    </div>
  );
};

export const ComplaintWallPick: React.FC = () => {
  const f = useCurrentFrame();

  // 斜世界：一开始就斜，收拢时摆正
  const tilt = 1 - ramp(f, 196, 26, EASE.smooth);
  const z = mix(1.08, ZMAX, ramp(f, 0, 90, EASE.out));
  const drift = mix(40, -40, ramp(f, 0, 200, EASE.linear));
  const worldT = `translateX(${(drift * tilt).toFixed(1)}px) scale(${z.toFixed(4)}) rotateX(${(10 * tilt).toFixed(2)}deg) rotateY(${(8 * tilt).toFixed(2)}deg) rotateZ(${(4 * tilt).toFixed(2)}deg)`;

  const recede = ramp(f, 124, 20, EASE.out);
  const sel = (i: number) => {
    const p = PICKS.find((q) => q.i === i);
    return p ? ramp(f, p.at, 8, EASE.out) : 0;
  };
  const mark = (i: number) => {
    const p = PICKS.find((q) => q.i === i);
    return p ? ramp(f, p.at + 4, 12, EASE.out) : 0;
  };

  // 计数
  const count = Math.round(mix(0, 2317, ramp(f, 4, 76, EASE.out)));
  const countOut = ramp(f, 124, 10, EASE.exit);

  const ROW_Y = (k: number) => 560 + k * 104;
  const TBL_X = 300;
  const TBL_W = 1320;
  const tableIn = ramp(f, 196, 12, EASE.out);
  const HEAD = ['读完。', '挑出。', '说中。'];
  const endPush = mix(1, 1.02, ramp(f, 270, 30, EASE.smooth));
  const sweep = ((f * 6) % 3200) - 900; // 慢慢扫过的光带

  return (
    <AbsoluteFill style={{fontFamily: SANS, overflow: 'hidden', background: `linear-gradient(180deg, ${L.bg[0]}, ${L.bg[2]})`}}>
      {/* 顶部柔光 */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 55% at 50% 0%, rgba(255,250,240,0.95), rgba(255,250,240,0) 70%)'}} />

      {/* ── 斜世界 ── */}
      {f < 262 && (
        <AbsoluteFill style={{perspective: 2600}}>
          <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: worldT}}>
            {/* 其余卡 */}
            <AbsoluteFill style={{opacity: (1 - recede * 0.75) * (1 - ramp(f, 200, 18, EASE.linear)), filter: recede > 0.01 ? `blur(${(recede * 8).toFixed(1)}px)` : undefined}}>
              {CARDS.map((cd, i) => {
                if (PICKS.some((q) => q.i === i) && f >= 124) return null;
                // 发牌：按"离右下角的距离"排顺序，越来越快
                const order = Math.hypot(cd.x - 2000, cd.y - 1200) / 2600;
                const st = 4 + Math.pow(order, 0.8) * 60;
                const p = ramp(f, st, 18, EASE.snappy);
                const fromX = cd.x + 380;
                const fromY = cd.y + 300;
                const pk = PICKS.find((q) => q.i === i);
                return (
                  <div key={i} style={{position: 'absolute', left: mix(fromX, cd.x, p) - CW / 2, top: mix(fromY, cd.y, p) - CH / 2 + Math.sin(f / 34 + i) * 3, opacity: clamp01(p * 2.2), transform: `rotate(${((1 - p) * (rnd(i) - 0.5) * 18).toFixed(2)}deg)`}}>
                    <Card i={i} sel={sel(i)} mark={mark(i)} col={pk?.col} keyword={pk?.key} />
                  </div>
                );
              })}
            </AbsoluteFill>

            {/* 被挑中的 3 张：展开成证据卡 → 收起 → 名牌阶梯 → 落进行里 */}
            {f >= 124 &&
              PICKS.map((p, k) => {
                const from = CARDS[p.i];
                const go = ramp(f, 124 + k * 4, 22, EASE.swift);
                const open = ramp(f, 138 + k * 4, 16, EASE.snappy) * (1 - ramp(f, 200, 12, EASE.smooth));
                const gather = ramp(f, 204 + k * 3, 18, EASE.swift);
                const stack = toWorld(TBL_X + 520 + k * 40, 380 + k * 70);
                const drop = ramp(f, 226 + k * 7, 14, EASE.swift);
                const row = toWorld(TBL_X + 60, ROW_Y(k) + 4);
                const dx = mix(mix(mix(from.x - CW / 2, DETAIL_AT[k].x, go), stack.x, gather), row.x, drop);
                const dy = mix(mix(mix(from.y - CH / 2, DETAIL_AT[k].y, go), stack.y, gather), row.y, drop);
                const sc = mix(mix(mix(1, 0.92, go), 0.5, gather), 0.46, drop);
                const num = Math.round(mix(0, p.n, ramp(f, 146 + k * 4, 30, EASE.out)));
                const neg = Math.round(mix(0, p.neg, ramp(f, 150 + k * 4, 30, EASE.out)));
                return (
                  <div key={k} style={{position: 'absolute', left: dx, top: dy, transform: `scale(${sc.toFixed(3)})`, transformOrigin: '0 0', opacity: 1 - ramp(f, 236 + k * 7, 8, EASE.linear), zIndex: 50}}>
                    <Card i={p.i} sel={1 - gather} mark={1} col={p.col} keyword={p.key} />
                    <div style={{width: CW, height: open * 210, overflow: 'hidden', marginTop: 10 * open, borderRadius: 22, background: 'linear-gradient(180deg,#fffdf9,#f8f3eb)', boxShadow: softShadow(12, {color: L.shadow, strength: 0.4}), boxSizing: 'border-box', padding: open > 0.02 ? '18px 24px' : 0, fontFamily: SANS}}>
                      <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
                        <span style={{fontSize: 22, color: L.ink3}}>提到次数</span>
                        <span style={{fontSize: 52, fontWeight: 800, color: p.col, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em'}}>{num}</span>
                        <span style={{fontSize: 22, color: L.ink3}}>次</span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 10}}>
                        <span style={{fontSize: 22, color: L.ink3, width: 92}}>差评占比</span>
                        <div style={{flex: 1, height: 12, borderRadius: 6, background: 'rgba(23,19,15,0.08)'}}>
                          <div style={{width: `${neg}%`, height: '100%', borderRadius: 6, background: p.col}} />
                        </div>
                        <span style={{fontSize: 24, fontWeight: 700, color: L.ink, fontVariantNumeric: 'tabular-nums', width: 54, textAlign: 'right'}}>{neg}%</span>
                      </div>
                      <div style={{fontSize: 22, color: L.ink2, marginTop: 14}}>主要来源：{p.src}</div>
                    </div>
                  </div>
                );
              })}

            {/* 三个带名字的光标 */}
            {f >= 76 && f < 196 &&
              PICKS.map((p, k) => {
                const tgt = CARDS[p.i];
                const start: [number, number][] = [[-200, 300], [2200, 200], [900, 1400]];
                const keys: Key[] = [[76 + k * 4, start[k][0], start[k][1]], [p.at - 2, tgt.x + 60, tgt.y + 10], [p.at + 26, tgt.x + 90, tgt.y + 40], [196, tgt.x + 200, tgt.y + 140]];
                const pos = pathAt(keys, f);
                return <NamedCursor key={k} {...pos} col={p.col} name={p.who} o={ramp(f, 76 + k * 4, 8, EASE.linear) * (1 - ramp(f, 150, 10, EASE.linear))} down={f >= p.at && f < p.at + 5} />;
              })}
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* 左上计数（屏幕层，不斜） */}
      <div style={{position: 'absolute', left: 90, top: 70, opacity: ramp(f, 2, 10, EASE.out) * (1 - countOut), display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,253,248,0.85)', backdropFilter: 'blur(10px)', padding: '14px 24px', borderRadius: 999, boxShadow: softShadow(10, {color: L.shadow, strength: 0.35}), zIndex: 70}}>
        <div style={{width: 14, height: 14, borderRadius: 7, background: ACC, opacity: 0.5 + 0.5 * Math.sin(f / 4)}} />
        <span style={{fontSize: 30, color: L.ink2}}>正在读</span>
        <span style={{fontSize: 36, fontWeight: 800, color: L.ink, fontVariantNumeric: 'tabular-nums'}}>{count.toLocaleString('en-US')}</span>
        <span style={{fontSize: 30, color: L.ink2}}>条用户评论</span>
      </div>

      {/* 清单（摆正后的屏幕坐标） */}
      {f >= 196 && (
        <div style={{position: 'absolute', left: TBL_X, top: 470, width: TBL_W, opacity: tableIn, transform: `translateY(${((1 - tableIn) * 18 + mix(0, 26, ramp(f, 256, 20, EASE.smooth))).toFixed(1)}px) scale(${endPush})`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 32, fontWeight: 700, color: L.ink}}>
            <div style={{width: 12, height: 32, borderRadius: 3, background: ACC}} />最痛的 3 条
            <span style={{fontSize: 22, fontWeight: 500, color: L.ink3}}>· 来自 2,317 条评论</span>
          </div>
          {PICKS.map((p, k) => {
            const sk = ramp(f, 232 + k * 7, 8, EASE.out);
            const fill = ramp(f, 240 + k * 7, 12, EASE.out);
            return (
              <div key={k} style={{position: 'absolute', left: 0, top: ROW_Y(k) - 470, width: TBL_W, height: 88, display: 'flex', alignItems: 'center', borderBottom: `1px solid ${L.line}`}}>
                <div style={{position: 'absolute', left: 60, top: 26, width: TBL_W - 120, height: 36, borderRadius: 10, background: alpha(ACC, 0.1), opacity: sk * (1 - fill)}} />
                <div style={{display: 'flex', alignItems: 'center', gap: 24, opacity: fill, width: '100%'}}>
                  <span style={{width: 44, fontSize: 40, fontWeight: 800, color: p.col, textAlign: 'center'}}>{k + 1}</span>
                  <span style={{fontSize: 34, fontWeight: 650, color: L.ink, flex: 1}}>"{QUOTES[p.i]}"</span>
                  <span style={{fontSize: 30, fontWeight: 700, color: p.col, fontVariantNumeric: 'tabular-nums'}}>{p.n} 次</span>
                  <span style={{fontSize: 24, color: L.ink3, width: 230, textAlign: 'right'}}>{p.src}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {f >= 254 && (
        <div style={{position: 'absolute', left: TBL_X - 6, top: 270, fontSize: 136, fontWeight: 800, letterSpacing: '-0.03em', transform: `scale(${endPush})`, transformOrigin: '0 0'}}>
          {HEAD.map((w, k) => {
            const p = ramp(f, 256 + k * 7, 14, EASE.out);
            return <span key={k} style={{display: 'inline-block', opacity: p, filter: `blur(${((1 - p) * 10).toFixed(1)}px)`, transform: `translateY(${((1 - p) * 20).toFixed(1)}px)`, color: k === 2 ? ACC : L.ink}}>{w}</span>;
          })}
        </div>
      )}

      {/* 慢慢扫过的光带（压在一切之上） */}
      <div style={{position: 'absolute', top: -200, left: sweep, width: 420, height: 1500, transform: 'rotate(18deg)', background: 'linear-gradient(90deg, rgba(255,248,232,0), rgba(255,248,232,0.45), rgba(255,248,232,0))', mixBlendMode: 'screen', filter: 'blur(30px)', pointerEvents: 'none'}} />
      {/* 四周起雾 */}
      <AbsoluteFill style={{background: `radial-gradient(ellipse 74% 70% at 50% 50%, ${alpha(L.bg[1], 0)} 56%, ${alpha(L.bg[1], 0.8)} 100%)`}} />
      <Vignette strength={0.18} color="#2a1d10" inner={0.5} />
      <Grain opacity={0.06} blend="overlay" />
    </AbsoluteFill>
  );
};
