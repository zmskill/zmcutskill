// 【镜头组】notebook-ui-flow：发送后——软光渐变底上产品 Logo + 名字一闪 → 硬切进笔记本界面（玻璃边框大窗口，先略推远，
//   然后整块歪 12° 甩上去露出来源列表，三份文件逐个出现、勾选）→ 硬切到斜放的灰色对话面板：三张资料卡飞进来落成一条消息，
//   "思考完成"、回答一段字带紫色尾巴扫过、三张照片滑进来、再发一条消息（039-D 一拍，产品界面演示）
// 学的动作（MdMizanurRahman · NotebookLM 18.2–22.9s，30fps 逐帧量过）：
//   18.2 图标先单独弹出（≈850,590），18.4 左移成白砖 + 名字 0.1s 显出，之后整体往右上漂
//   18.85 硬切界面：窗口从 1.0 缩到 0.84（0.1s）再稳在 0.83；19.2–19.45 整块转到 −12°、往上甩 340px，之后慢慢回正到 −5°
//   19.45 起三份文件逐个打出来（字带抖动），19.55/19.7/19.8/19.9 四个勾依次打上，下面的提示字淡入
//   20.2 硬切灰面板（透视：底边更近、整体 −3°），三张资料卡 0.2s 从右边大尺寸飞进、落到右上，20.35 消息气泡弹出
//   21.0 "思考完成··"，21.2 回答整段先淡淡露出，21.35–22.65 一条紫色尾巴从头扫到尾、扫过变黑；21.6 三张照片依次滑进，21.9 第二条消息
// 我们的内容：主角产品 = 千问（坞里第 4 个图标），界面文字全部中文；界面是示意（右下角标"界面为示意 · 仅作演示"）。
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {INK, PURPLE, SANS, back, brand, clamp, eo, kf, mix, rs} from '../_kit/softAiKit';

const FPS = 30;
const S0 = 18.2;
export const NOTEBOOK_UI_FLOW_CONTRACT: GroupContract = {
  sourceDuration: 141 / 30,
  fps: 30,
  motion: [[0, 0.5], [0.6, 2.85], [2.95, 141 / 30]],
  holds: [{at: 0.55, maxExtra: 1}, {at: 2.9, maxExtra: 1.5}],
  landmarks: {logo: 0, word: 0.2, cut1: 0.65, swing: 1.0, files: 1.25, cut2: 2.0, bubble: 2.15, think: 2.8, answer: 3.15, photos: 3.25, bubble2: 3.7},
  sfx: [
    {at: 'logo', type: '闪光', note: '亮相 shimmer', volume: 0.4},
    {at: 'cut1', type: '短甩', note: '硬切 swish', volume: 0.35},
    {at: 'swing', type: '短甩', note: '甩 whoosh', volume: 0.4},
    {at: 'files', type: '短甩', note: '三下 tick', tail: 0.5, volume: 0.3},
    {at: 'cut2', type: '运镜', note: '卡片飞入 whoosh', volume: 0.4},
    {at: 'answer', type: '闪光', note: '轻 sparkle', volume: 0.3},
    {at: 'photos', type: '短甩', note: '滑入 swish', volume: 0.3},
  ],
  inputs: {name: {maxChars: 4}, ask1: {maxChars: 16}, answer: {maxChars: 70}, ask2: {maxChars: 14}},
};
export type NbInputs = {
  brandKey: string; name: string; notebook: string; files: string[]; ask1: string; answer: string; ask2: string;
  cards: {title: string; kind: 'video' | 'doc' | 'pdf'}[]; cardText: string; photos: string[]; cardPhoto: string;
};
export const NB_DEFAULT_INPUTS: NbInputs = {
  brandKey: 'qianwen', name: '千问', notebook: '未命名笔记本',
  files: ['第一版预览.pdf', '整体背景简报.png', '内容提示词.txt'],
  ask1: '参考视频和说明笔记都在这儿', answer: '我已经根据你的资料整理好一份 12 页的演示文稿大纲：背景、问题、方案、路线规划、费用和下一步，重点页都标成了"必讲"。',
  ask2: '这些是另外几份参考资料',
  cards: [{title: '参考视频', kind: 'video'}, {title: '说明笔记', kind: 'doc'}, {title: 'PDF 文本', kind: 'pdf'}],
  cardText: '一位学生想坐学校班车往返城里几个地方：能查路线、订座位、在线付款，还能看到班车到哪了。',
  photos: ['shortvideo/sv02', 'desk/desk02', 'travel/travel10'], cardPhoto: 'hz/hz04',
};
export const checkNbInputs = (x: NbInputs) => checkInputs(NOTEBOOK_UI_FLOW_CONTRACT, {name: x.name, ask1: x.ask1, answer: x.answer, ask2: x.ask2});
export const planNb = (sec: number) => planExtras(NOTEBOOK_UI_FLOW_CONTRACT, sec);
export const nbFrames = (extras: number[]) => Math.round(outputDuration(NOTEBOOK_UI_FLOW_CONTRACT, extras) * FPS);
export const NOTEBOOK_UI_FLOW_DURATION = 141;

const lin = (u: number) => u;
const NOTE: React.FC<{dark?: boolean}> = ({dark}) => (
  <div style={{position: 'absolute', right: 36, bottom: 26, fontSize: 20, color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(60,50,80,0.45)', fontFamily: SANS, letterSpacing: '0.06em'}}>界面为示意 · 仅作演示</div>
);
// 软光底：左蓝、右上粉、左下粉
const Glow: React.FC<{dx?: number}> = ({dx = 0}) => (
  <AbsoluteFill style={{background: '#f7f3f8', overflow: 'hidden'}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse 26% 40% at ${22 + dx}% 48%, rgba(120,170,255,0.95) 0%, rgba(150,190,255,0) 100%)`}} />
    <AbsoluteFill style={{background: `radial-gradient(ellipse 24% 34% at ${70 - dx}% 14%, rgba(214,130,246,0.9) 0%, rgba(220,150,246,0) 100%)`}} />
    <AbsoluteFill style={{background: `radial-gradient(ellipse 30% 30% at ${12 + dx}% 92%, rgba(214,140,246,0.85) 0%, rgba(220,150,246,0) 100%)`}} />
    <AbsoluteFill style={{background: `radial-gradient(ellipse 22% 30% at ${92 - dx}% 70%, rgba(170,180,255,0.6) 0%, rgba(180,190,255,0) 100%)`}} />
  </AbsoluteFill>
);
const Check: React.FC<{on: number; x: number; y: number}> = ({on, x, y}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 30, height: 30, borderRadius: 5, border: '2.5px solid #3b3b40', background: on > 0.5 ? '#3b3b40' : 'transparent', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    {on > 0.5 && <svg width={22} height={22} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{strokeDasharray: 24, strokeDashoffset: 24 * (1 - clamp((on - 0.5) * 2))}} /></svg>}
  </div>
);
const FileIcon: React.FC<{c: string; x: number; y: number}> = ({c, x, y}) => (
  <svg width={30} height={34} viewBox="0 0 20 24" style={{position: 'absolute', left: x, top: y}}><path d="M3 1h9l5 5v16H3z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round" /><path d="M12 1v5h5" fill="none" stroke={c} strokeWidth="1.8" /><rect x="6" y="11" width="8" height="6" rx="1" fill={c} opacity="0.85" /></svg>
);
// 抖动打字：已出的最后两个字往上下抖
const Jitter: React.FC<{text: string; n: number; s: number}> = ({text, n, s}) => (
  <>{Array.from(text).slice(0, n).map((c, i) => <span key={i} style={{display: 'inline-block', transform: i >= n - 2 && n < text.length ? `translateY(${Math.sin(s * 90 + i) * 6}px) rotate(${Math.sin(s * 70 + i) * 8}deg)` : undefined}}>{c}</span>)}</>
);

// 资料卡（对话里）
const RefCard: React.FC<{c: NbInputs['cards'][0]; text: string; photo: string; w: number}> = ({c, text, photo, w}) => {
  const ic = c.kind === 'video' ? '#e33' : c.kind === 'doc' ? '#2f6fe0' : '#e45a6e';
  return (
    <div style={{width: w, height: w * 0.9, borderRadius: w * 0.05, background: '#fff', boxShadow: '0 6px 18px rgba(60,50,80,0.12)', padding: w * 0.06, boxSizing: 'border-box', fontFamily: SANS, position: 'relative'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: w * 0.04, fontSize: w * 0.065, fontWeight: 600, color: INK}}>
        <div style={{width: w * 0.08, height: w * 0.06, borderRadius: 3, background: ic}} />{c.title}
      </div>
      {c.kind === 'video'
        ? <Img src={staticFile(`library/photos/${photo}.jpg`)} style={{marginTop: w * 0.05, width: '100%', height: w * 0.36, objectFit: 'cover', borderRadius: 4}} />
        : <div style={{marginTop: w * 0.05, height: w * 0.48, border: '1.5px solid #555', borderRadius: 4, padding: w * 0.035, fontSize: w * 0.045, lineHeight: 1.35, color: '#333', overflow: 'hidden', boxSizing: 'border-box'}}>{text}</div>}
      {c.kind === 'video' && <div style={{marginTop: w * 0.03, fontSize: w * 0.035, color: '#777', lineHeight: 1.3}}>可以一次添加多个链接，用空格隔开</div>}
      <div style={{position: 'absolute', right: w * 0.06, bottom: w * 0.05, width: w * 0.15, height: w * 0.05, borderRadius: w * 0.03, background: '#1a73e8'}} />
    </div>
  );
};

export const NotebookUiFlowGroup: React.FC<{inputs?: NbInputs; extras?: number[]}> = ({inputs: x = NB_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, NOTEBOOK_UI_FLOW_CONTRACT, extras) + S0;
  const held = tt - (s - S0);

  // ───── D1：Logo ─────
  if (s < 18.76) { // 原片逐帧：硬切在第 563 帧（18.767s），之前写的 18.85 晚了 2–3 帧
    const pop = rs(s, 18.2, 0.12, (u) => back(u, 2));
    const slide = rs(s, 18.36, 0.1, eo);
    const word = rs(s, 18.4, 0.1, lin);
    const NW = Array.from(x.name).length * 82;
    const gw = 104 + 40 + NW;
    const g0 = 960 - gw / 2; // 组左沿
    const iconX = mix(850 - 52, g0, slide), iconY = mix(590, 526, slide);
    const drift = clamp((s - 18.5) / 0.35) + held * 0.15;
    return (
      <AbsoluteFill style={{fontFamily: SANS}}>
        <Glow dx={(s - 18.2) * 4} />
        <AbsoluteFill style={{transform: `translate(${drift * 40}px, ${-drift * 50}px) scale(${1 - drift * 0.03})`}}>
          <div style={{position: 'absolute', left: iconX, top: iconY - 52, width: 104, height: 104, borderRadius: 24, background: `rgba(255,255,255,${slide})`, boxShadow: slide > 0 ? `0 4px 14px rgba(90,70,140,${0.1 * slide})` : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop})`}}>
            <Img src={brand(x.brandKey)} style={{width: 72, height: 72, borderRadius: 16}} />
          </div>
          <div style={{position: 'absolute', left: g0 + 144, top: 526, transform: 'translateY(-52%)', fontSize: 80, fontWeight: 500, color: '#1d1c22', letterSpacing: '0.02em', opacity: word, filter: word < 1 ? `blur(${(1 - word) * 8}px)` : undefined, whiteSpace: 'nowrap'}}>{x.name}</div>
        </AbsoluteFill>
        <Grain opacity={0.03} blend="multiply" />
      </AbsoluteFill>
    );
  }

  // ───── D2：笔记本界面 ─────
  if (s < 20.09) { // 原片硬切在第 603 帧（20.1s）
    const sc = kf(s, [[18.76, 1.0], [18.87, 0.84], [19.2, 0.833], [19.45, 0.85], [19.6, 0.83], [20.0, 0.77], [20.2, 0.75]], eo);
    const rot = kf(s, [[19.2, 0], [19.45, -13], [19.6, -11], [20.0, -8], [20.2, -7]], eo);
    const tx = kf(s, [[18.76, 0], [18.87, 40], [19.2, 62], [19.45, -46], [20.0, -59], [20.2, -62]], eo);
    const ty = kf(s, [[18.76, 0], [18.87, -70], [19.2, -160], [19.45, -500], [19.6, -542], [20.0, -567], [20.2, -580]], eo);
    const blur = s > 19.22 && s < 19.42 ? 6 * Math.sin(((s - 19.22) / 0.2) * Math.PI) : 0;
    const fileN = (i: number) => Math.floor(clamp((s - 19.45 - i * 0.08) / 0.22) * Array.from(x.files[i]).length + 0.001);
    const ticks = [19.55, 19.7, 19.8, 19.9].map((t) => clamp((s - t) / 0.08));
    const hint = rs(s, 19.5, 0.4, lin);
    const T = (t: string, l: number, top: number, fs: number, extra?: React.CSSProperties) => <div style={{position: 'absolute', left: l, top, fontSize: fs, color: INK, whiteSpace: 'nowrap', lineHeight: 1, ...extra}}>{t}</div>;
    return (
      <AbsoluteFill style={{fontFamily: SANS, overflow: 'hidden'}}>
        <Glow dx={(s - 18.85) * 3} />
        <AbsoluteFill style={{transformOrigin: '960px 540px', transform: `translate(${tx}px, ${ty}px) perspective(2400px) rotateY(${rot * -0.5}deg) rotate(${rot}deg) scale(${sc})`, filter: blur ? `blur(${blur}px)` : undefined}}>
          {/* 玻璃外框 + 内衬 */}
          <div style={{position: 'absolute', left: 630, top: 256, width: 1900, height: 1700, borderRadius: 96, background: 'rgba(255,255,255,0.38)', border: '2px solid rgba(255,255,255,0.75)', boxShadow: '0 20px 60px rgba(120,90,180,0.12)'}} />
          <div style={{position: 'absolute', left: 694, top: 290, width: 1820, height: 1640, borderRadius: 64, background: '#ece9fa'}} />
          {/* 标题 */}
          <div style={{position: 'absolute', left: 796, top: 388, width: 56, height: 56, borderRadius: 28, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Img src={brand(x.brandKey)} style={{width: 36, height: 36, borderRadius: 8}} /></div>
          {T(x.notebook, 898, 396, 40, {fontWeight: 500})}
          {/* 来源卡 */}
          <div style={{position: 'absolute', left: 694, top: 574, width: 826, height: 1300, borderRadius: 18, background: '#fff', boxShadow: '0 2px 10px rgba(80,60,140,0.06)'}} />
          {T('来源', 712, 612, 40)}
          <svg width={30} height={30} viewBox="0 0 24 24" style={{position: 'absolute', left: 1422, top: 606}}><rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="#444" strokeWidth="1.8" /><path d="M9 4v16" stroke="#444" strokeWidth="1.8" /></svg>
          <div style={{position: 'absolute', left: 694, top: 668, width: 770, height: 2, background: '#e6e6ea'}} />
          <div style={{position: 'absolute', left: 712, top: 698, width: 726, height: 52, borderRadius: 12, border: '2px solid #dcdce2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: INK, boxSizing: 'border-box'}}>＋ 添加来源</div>
          <div style={{position: 'absolute', left: 712, top: 780, width: 726, height: 140, borderRadius: 14, background: '#f0f0f3', border: '2px solid #e4e4e8', boxSizing: 'border-box'}} />
          {T('在网上搜索新来源', 732, 806, 24, {color: '#666'})}
          <div style={{position: 'absolute', left: 728, top: 862, height: 38, borderRadius: 19, border: '1.5px solid #d4d4da', padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: 20, color: INK, background: '#fff'}}>◍ 网页 ⌄</div>
          <div style={{position: 'absolute', left: 860, top: 862, height: 38, borderRadius: 19, border: '1.5px solid #d4d4da', padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: 20, color: INK, background: '#fff'}}>⌕ 快速研究 ⌄</div>
          <div style={{position: 'absolute', left: 1376, top: 860, width: 42, height: 42, borderRadius: 21, background: '#e2e2e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#555'}}>⌕</div>
          {/* 文件列表 */}
          {s > 19.4 && (
            <>
              {T('↻   ≡', 728, 978, 24, {color: '#555'})}
              <Check on={ticks[0]} x={1408} y={970} />
              {x.files.map((f, i) => (
                <React.Fragment key={i}>
                  {fileN(i) > 0 && <FileIcon c={['#e5534b', '#d9363e', '#3d6fd8'][i]} x={726} y={1036 + i * 72} />}
                  <div style={{position: 'absolute', left: 774, top: 1040 + i * 72, fontSize: 26, color: INK, whiteSpace: 'nowrap'}}><Jitter text={f} n={fileN(i)} s={s} /></div>
                  <Check on={ticks[i + 1]} x={1408} y={1040 + i * 72} />
                </React.Fragment>
              ))}
              <div style={{position: 'absolute', left: 712, width: 726, top: 1290, textAlign: 'center', fontSize: 22, color: '#555', lineHeight: 1.6, opacity: hint, filter: `blur(${(1 - hint) * 6}px)`}}>
                <div style={{fontSize: 34, marginBottom: 6}}>🗎</div>保存的来源会显示在这里<br />添加文件、网站等资料，然后就可以提问、生成内容<br />把文件拖进来，或者添加来源
              </div>
            </>
          )}
          {/* 右侧主区 */}
          <div style={{position: 'absolute', left: 1640, top: 580, width: 1100, height: 1300, borderRadius: 18, background: '#fff', boxShadow: '0 2px 10px rgba(80,60,140,0.06)'}} />
          <div style={{position: 'absolute', left: 1640, top: 660, width: 1100, height: 2, background: '#ececf0'}} />
          {T('开始你的笔记本吧', 1736, 918, 50, {fontWeight: 600})}
          {T('这里是一块空白画布，用来理解、创作，或者整理任何东西。', 1736, 1004, 21, {color: '#444'})}
          {T('我可以帮你开个头，你也可以直接开始。', 1736, 1036, 21, {color: '#444'})}
          {T('你希望这个笔记本帮你做什么？', 1736, 1098, 21, {color: '#444'})}
          {['了解一个新主题', '创作点新东西', '推进一个项目'].map((c, i) => <div key={c} style={{position: 'absolute', left: 1748, top: 1142 + i * 60, height: 44, borderRadius: 22, border: '2px solid #444', padding: '0 22px', display: 'flex', alignItems: 'center', fontSize: 20, color: INK, whiteSpace: 'nowrap', boxSizing: 'border-box'}}>{c}</div>)}
          <div style={{position: 'absolute', left: 1736, top: 1560, width: 900, height: 66, borderRadius: '24px 24px 0 0', background: '#3b3e44', color: '#fff', fontSize: 24, display: 'flex', alignItems: 'center', paddingLeft: 28}}>笔记功能升级了：试试让它分析你的数据</div>
          <div style={{position: 'absolute', left: 1736, top: 1626, width: 900, height: 110, borderRadius: '0 0 24px 24px', border: '2px solid #ddd', borderTop: 'none', fontSize: 26, color: '#888', display: 'flex', alignItems: 'center', paddingLeft: 28, boxSizing: 'border-box', background: '#fff'}}>提个问题，或者让它做点什么</div>
        </AbsoluteFill>
        <NOTE />
        <Grain opacity={0.025} blend="multiply" />
      </AbsoluteFill>
    );
  }

  // ───── D3：对话面板 ─────
  const zoom = kf(s, [[20.1, 1.28], [20.35, 1.0], [22.9, 0.94]], eo) - held * 0.005;
  const dy = kf(s, [[20.1, 80], [20.35, 40], [20.6, -10], [21.3, -90], [21.8, -150], [22.9, -170]], lin) - held * 4;
  const cardW = 214;
  const cardSlot = (i: number) => ({x: 1020 + i * 236, y: 100 + i * 4});
  const bubble = rs(s, 20.28, 0.16, (u) => back(u, 1.6));
  const think = rs(s, 21.0, 0.15, lin);
  const A = Array.from(x.answer);
  const ghost = rs(s, 21.2, 0.2, lin);
  const w = kf(s, [[21.35, 0], [22.65, A.length + 26]], lin);
  // 2026-11-19 逐帧（右下三张照片）：不是从右边一起淡着滑进来，而是一张一张"弹"出来——第一张 21.45 先出现，比最终大 ≈30%、很快回弹到原大；
  //   21.6 第二张、21.67 第三张同样弹出；每多一张，整排往左让一格（第一张从 +190 让到 0，22.0 停）
  const PT = [21.42, 21.56, 21.63];
  const photoIn = (i: number) => clamp((s - PT[i]) / 0.05);
  const photoSc = (i: number) => { const u = Math.max(0, s - PT[i]) / 0.3; return 1 + 0.32 * Math.exp(-5 * u) * Math.cos(7.5 * u); };
  const rowX = kf(s, [[21.42, 190], [21.56, 75], [21.63, 50], [21.8, 15], [22.0, 0]]);
  const bubble2 = rs(s, 21.9, 0.16, (u) => back(u, 1.6));
  const shimmerX = ((s - 21.0) * 600) % 700 - 100;
  return (
    <AbsoluteFill style={{fontFamily: SANS, overflow: 'hidden', background: '#fbfafc'}}>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 260, background: 'linear-gradient(180deg, rgba(240,210,246,0) 0%, rgba(232,196,246,0.8) 100%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 120, background: 'linear-gradient(180deg, rgba(200,215,255,0.55) 0%, rgba(220,225,255,0) 100%)'}} />
      <AbsoluteFill style={{transformOrigin: '960px 400px', transform: `translateY(${dy}px) perspective(2200px) rotateX(9deg) rotate(-3deg) scale(${zoom})`}}>
        <div style={{position: 'absolute', left: 60, top: 40, width: 1840, height: 1560, borderRadius: 64, background: '#efeff0', border: '2.5px solid #dfaaf0', boxSizing: 'border-box'}} />
        {/* 资料卡 */}
        {x.cards.map((c, i) => {
          const k = rs(s, 20.1 + i * 0.04, 0.22, eo);
          const sl = cardSlot(i);
          const cx = mix(2100 + i * 200, sl.x, k), cy = mix(sl.y + 120 + i * 40, sl.y, k), sc = mix(1.25, 1, k);
          return <div key={i} style={{position: 'absolute', left: cx, top: cy, transform: `scale(${sc}) rotate(${(1 - k) * 4 + (i - 1) * 1.2}deg)`, transformOrigin: '0 0'}}><RefCard c={c} text={x.cardText} photo={x.cardPhoto} w={cardW} /></div>;
        })}
        {/* 消息 1 */}
        <div style={{position: 'absolute', left: 1030, top: 340, width: 40, height: 40, borderRadius: 20, background: 'linear-gradient(135deg,#c9a27e,#8a6a52)', opacity: bubble}} />
        <div style={{position: 'absolute', left: 1086, top: 312, height: 96, borderRadius: 26, background: '#fff', boxShadow: '0 4px 14px rgba(60,50,80,0.08)', display: 'flex', alignItems: 'center', padding: '0 36px', fontSize: 34, color: INK, whiteSpace: 'nowrap', transform: `scale(${bubble})`, transformOrigin: '0 50%', opacity: clamp(bubble * 2)}}>{x.ask1}</div>
        {/* 思考完成 */}
        <div style={{position: 'absolute', left: 150, top: 450, fontSize: 28, display: 'flex', alignItems: 'center', gap: 12, opacity: think}}>
          <div style={{width: 24, height: 24, borderRadius: 12, border: '2px solid #888', boxSizing: 'border-box'}} />
          <span style={{backgroundImage: s < 22.0 ? `linear-gradient(90deg, #333 ${shimmerX - 60}px, #ccc ${shimmerX}px, #333 ${shimmerX + 60}px)` : 'linear-gradient(#333, #333)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>思考完成</span>
          {s < 22.2 && <span style={{color: '#666', letterSpacing: 4}}>{'··'.slice(0, 1 + (Math.floor(s * 6) % 2))}</span>}
        </div>
        {/* 回答 */}
        <div style={{position: 'absolute', left: 150, top: 504, width: 780, fontSize: 30, lineHeight: 1.45, opacity: ghost}}>
          {A.map((ch, i) => {
            const d = w - i;
            const col = d <= 0 ? 'rgba(60,60,70,0.12)' : d < 26 ? PURPLE : INK;
            return <span key={i} style={{color: col}}>{ch}</span>;
          })}
        </div>
        {/* 照片 */}
        {x.photos.map((p, i) => {
          const k = photoIn(i);
          return <Img key={i} src={staticFile(`library/photos/${p}.jpg`)} style={{position: 'absolute', left: 1080 + i * 222 + rowX, top: 652, width: 212, height: 190, objectFit: 'cover', borderRadius: 12, boxShadow: '0 8px 18px rgba(40,30,60,0.22)', opacity: k, transform: `scale(${photoSc(i)})`, transformOrigin: '50% 50%'}} />;
        })}
        {/* 消息 2 */}
        <div style={{position: 'absolute', left: 1060, top: 919, width: 36, height: 36, borderRadius: 18, background: 'linear-gradient(135deg,#c9a27e,#8a6a52)', opacity: bubble2}} />
        <div style={{position: 'absolute', left: 1110, top: 895, height: 90, borderRadius: 24, background: '#fff', boxShadow: '0 4px 14px rgba(60,50,80,0.08)', display: 'flex', alignItems: 'center', padding: '0 34px', fontSize: 31, color: INK, whiteSpace: 'nowrap', transform: `scale(${bubble2})`, transformOrigin: '0 50%', opacity: clamp(bubble2 * 2)}}>{x.ask2}</div>
      </AbsoluteFill>
      <NOTE />
      <Grain opacity={0.02} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(NOTEBOOK_UI_FLOW_CONTRACT).length) throw new Error(checkContract(NOTEBOOK_UI_FLOW_CONTRACT).join('；'));
export const NotebookUiFlow: React.FC = () => <NotebookUiFlowGroup />;
