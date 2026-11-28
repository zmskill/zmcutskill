// 【镜头组】generating-studio：软光底中间一个渐变描边的大按钮「✧ 生成中···」（字带紫色流光逐个显出、外圈发光一呼一吸）→
//   硬切：整个笔记本界面从右上远处歪着飞过来、转正、变大，镜头再推进到右边"工作室"栏，三块渐变占位板依次显影成生成好的演示文稿封面（039-F 一拍）
// 学的动作（MdMizanurRahman · NotebookLM 27.7–30.4s，30fps 逐帧量过）：
//   27.7 按钮 ≈980×290、描边 6px 蓝→紫，字 80px 从左往右淡入（亮紫流光扫过），点一个一个跳；按钮轻微漂（y 528→560）
//   28.6 硬切：界面先在右上（宽≈680、歪约 10°、强透视）→ 28.8 宽 1040 → 28.95 宽 1240 → 29.1 宽 1360 → 29.25 宽 1600 摆正
//   29.25–29.4 镜头推到 1.5 倍，对准工作室栏，之后慢慢往上漂；29.55 三块板是紫色渐变，29.7/29.85/30.0 依次变成封面
// 我们的内容：按钮"生成中"；界面全中文（主角 千问）；封面是自己排的三页：校园班车出行方案 / 路线与站点 / 费用与下一步（真照片）。
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {INK, PURPLE, SANS, brand, clamp, eio, eo, kf, mix, rs} from '../_kit/softAiKit';

const FPS = 30;
const S0 = 27.7;
export const GENERATING_STUDIO_CONTRACT: GroupContract = {
  sourceDuration: 81 / 30,
  fps: 30,
  motion: [[0, 0.55], [0.65, 2.45], [2.55, 81 / 30]],
  holds: [{at: 0.6, maxExtra: 1}, {at: 2.5, maxExtra: 1.5}],
  landmarks: {button: 0, cut: 0.9, settle: 1.55, push: 1.6, reveal: 2.0},
  sfx: [
    {at: 'button', type: '闪光', note: '亮起 shimmer', volume: 0.4},
    {at: 'cut', type: '运镜', note: '飞入 whoosh', volume: 0.45},
    {at: 'reveal', type: '闪光', note: '三下 sparkle', tail: 0.4, volume: 0.35},
  ],
  inputs: {label: {maxChars: 5}},
};
export type GenInputs = {label: string; brandKey: string; name: string; covers: {title: string; sub: string; photo: string}[]; files: string[]; ask1: string; ask2: string; answer: string};
export const GEN_DEFAULT_INPUTS: GenInputs = {
  label: '生成中', brandKey: 'qianwen', name: '千问',
  covers: [
    {title: '校园班车出行方案', sub: '让每一次通勤都更省心', photo: 'city/city3'},
    {title: '路线与站点规划', sub: '6 条线路 · 24 个站点', photo: 'travel/travel05'},
    {title: '费用与下一步', sub: '预算 · 时间表 · 分工', photo: 'desk/desk03'},
  ],
  files: ['第一版预览.pdf', '整体背景简报.png', '内容提示词.txt'],
  ask1: '参考视频和说明笔记都在这儿', ask2: '这些是另外几份参考资料',
  answer: '我已经根据你的资料整理好一份 12 页的演示文稿大纲：背景、问题、方案、路线规划、费用和下一步，重点页都标成了"必讲"。',
};
export const checkGenInputs = (x: GenInputs) => checkInputs(GENERATING_STUDIO_CONTRACT, {label: x.label});
export const planGen = (sec: number) => planExtras(GENERATING_STUDIO_CONTRACT, sec);
export const genFrames = (extras: number[]) => Math.round(outputDuration(GENERATING_STUDIO_CONTRACT, extras) * FPS);
export const GENERATING_STUDIO_DURATION = 81;

const lin = (u: number) => u;
const Bg: React.FC<{s: number}> = ({s}) => (
  <AbsoluteFill style={{background: '#f7f3f8', overflow: 'hidden'}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse 30% 34% at ${38 + (s - 27.7) * 3}% 92%, rgba(110,160,255,0.9) 0%, rgba(150,190,255,0) 100%)`}} />
    <AbsoluteFill style={{background: `radial-gradient(ellipse 26% 40% at ${84 - (s - 27.7) * 2}% 40%, rgba(214,120,246,0.85) 0%, rgba(220,150,246,0) 100%)`}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 30% 30% at 8% 96%, rgba(214,140,246,0.7) 0%, rgba(220,150,246,0) 100%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 24% 30% at 62% 8%, rgba(214,150,246,0.55) 0%, rgba(220,160,246,0) 100%)'}} />
  </AbsoluteFill>
);
const Sparkle: React.FC<{size: number; c: string}> = ({size, c}) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M10 4 C10.8 9 13 11.2 18 12 C13 12.8 10.8 15 10 20 C9.2 15 7 12.8 2 12 C7 11.2 9.2 9 10 4 Z" fill="none" stroke={c} strokeWidth={1.6} strokeLinejoin="round" /><path d="M18.5 2 C18.8 3.6 19.4 4.2 21 4.5 C19.4 4.8 18.8 5.4 18.5 7 C18.2 5.4 17.6 4.8 16 4.5 C17.6 4.2 18.2 3.6 18.5 2 Z" fill="none" stroke={c} strokeWidth={1.3} /></svg>
);

// 完整笔记本界面（本地坐标 1600×900）
const NotebookFull: React.FC<{x: GenInputs; s: number}> = ({x, s}) => {
  const tile = (i: number) => rs(s, 29.62 + i * 0.15, 0.25, lin);
  const T = (t: string, l: number, top: number, fs: number, st?: React.CSSProperties) => <div style={{position: 'absolute', left: l, top, fontSize: fs, color: INK, whiteSpace: 'nowrap', lineHeight: 1.2, ...st}}>{t}</div>;
  const panel = (l: number, w: number) => <div style={{position: 'absolute', left: l, top: 90, width: w, height: 790, borderRadius: 12, background: '#fff', boxShadow: '0 1px 4px rgba(80,60,140,0.06)'}} />;
  const chips = [['#aab0f6', '音频概览'], ['#eeece3', '演示文稿'], ['#dbefdf', '视频概览'], ['#f1e4eb', '思维导图'], ['#efe9dc', '报告'], ['#f6dfe2', '闪卡'], ['#d8ecf6', '测验'], ['#e2dcef', '信息图'], ['#e4e6f6', '数据表']];
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1600, height: 900, fontFamily: SANS}}>
      <div style={{position: 'absolute', inset: -22, borderRadius: 54, background: 'rgba(255,255,255,0.4)', border: '2px solid rgba(255,255,255,0.8)', boxShadow: '0 20px 60px rgba(120,90,180,0.14)'}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: 36, background: '#ece9fa'}} />
      <div style={{position: 'absolute', left: 30, top: 28, width: 34, height: 34, borderRadius: 17, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Img src={brand(x.brandKey)} style={{width: 22, height: 22, borderRadius: 5}} /></div>
      {T('未命名笔记本', 76, 32, 20, {fontWeight: 500})}
      <div style={{position: 'absolute', right: 30, top: 28, display: 'flex', gap: 10}}>
        <div style={{height: 30, borderRadius: 15, background: '#1d1c22', color: '#fff', fontSize: 14, padding: '0 14px', display: 'flex', alignItems: 'center'}}>＋ 新建笔记本</div>
        {['分析', '分享', '设置'].map((t) => <div key={t} style={{height: 30, borderRadius: 15, border: '1.5px solid #ccc', fontSize: 14, padding: '0 12px', display: 'flex', alignItems: 'center', color: INK}}>{t}</div>)}
      </div>
      {/* 来源 */}
      {panel(24, 290)}
      {T('来源', 40, 104, 18)}
      <div style={{position: 'absolute', left: 40, top: 140, width: 258, height: 26, borderRadius: 7, border: '1.5px solid #ddd', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: INK}}>＋ 添加来源</div>
      <div style={{position: 'absolute', left: 40, top: 176, width: 258, height: 60, borderRadius: 8, background: '#f0f0f3'}} />
      {x.files.map((f, i) => <React.Fragment key={f}>
        <div style={{position: 'absolute', left: 50, top: 286 + i * 32, width: 12, height: 14, borderRadius: 2, border: `1.5px solid ${['#e5534b', '#d9363e', '#3d6fd8'][i]}`}} />
        {T(f, 72, 284 + i * 32, 13)}
        <div style={{position: 'absolute', left: 278, top: 286 + i * 32, width: 14, height: 14, borderRadius: 3, background: '#3b3b40'}} />
      </React.Fragment>)}
      <div style={{position: 'absolute', left: 278, top: 256, width: 14, height: 14, borderRadius: 3, background: '#3b3b40'}} />
      {T('保存的来源会显示在这里', 92, 420, 12, {color: '#777'})}
      {/* 对话 */}
      {panel(330, 900)}
      {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 760 + i * 78, top: 150, width: 70, height: 62, borderRadius: 5, background: '#fff', boxShadow: '0 2px 6px rgba(60,50,80,0.14)', overflow: 'hidden'}}>
        {i === 0 ? <Img src={staticFile('library/photos/hz/hz04.jpg')} style={{width: '100%', height: 30, objectFit: 'cover', marginTop: 12}} /> : <div style={{margin: '14px 6px', height: 34, border: '1px solid #666', borderRadius: 2}} />}
      </div>)}
      <div style={{position: 'absolute', left: 780, top: 222, height: 30, borderRadius: 9, background: '#fff', boxShadow: '0 1px 4px rgba(60,50,80,0.1)', fontSize: 12, padding: '0 12px', display: 'flex', alignItems: 'center', color: INK}}>{x.ask1}</div>
      {T('◌ 思考完成', 380, 286, 11, {color: '#444'})}
      <div style={{position: 'absolute', left: 380, top: 306, width: 300, fontSize: 11, lineHeight: 1.45, color: INK}}>{x.answer}</div>
      {['shortvideo/sv02', 'desk/desk02', 'travel/travel10'].map((p, i) => <Img key={p} src={staticFile(`library/photos/${p}.jpg`)} style={{position: 'absolute', left: 820 + i * 72, top: 360, width: 68, height: 58, objectFit: 'cover', borderRadius: 4}} />)}
      <div style={{position: 'absolute', left: 828, top: 430, height: 26, borderRadius: 8, background: '#fff', boxShadow: '0 1px 4px rgba(60,50,80,0.1)', fontSize: 11, padding: '0 10px', display: 'flex', alignItems: 'center', color: INK}}>{x.ask2}</div>
      <div style={{position: 'absolute', left: 350, top: 760, width: 860, height: 26, borderRadius: '10px 10px 0 0', background: '#3b3e44', color: '#fff', fontSize: 11, display: 'flex', alignItems: 'center', paddingLeft: 12}}>笔记功能升级了：试试让它分析你的数据、生成图表。</div>
      <div style={{position: 'absolute', left: 350, top: 786, width: 860, height: 48, borderRadius: '0 0 10px 10px', border: '1.5px solid #ddd', borderTop: 'none', boxSizing: 'border-box', fontSize: 12, color: '#888', display: 'flex', alignItems: 'center', paddingLeft: 12, background: '#fff'}}>提个问题，或者让它做点什么</div>
      <div style={{position: 'absolute', left: 1178, top: 798, width: 24, height: 24, borderRadius: 12, background: '#1d1c22'}} />
      {/* 工作室 */}
      {panel(1246, 330)}
      {T('工作室', 1262, 104, 18)}
      {chips.map(([c, t], i) => <div key={t} style={{position: 'absolute', left: 1260 + (i % 3) * 102, top: 140 + Math.floor(i / 3) * 44, width: 98, height: 38, borderRadius: 8, background: c, fontSize: 12, display: 'flex', alignItems: 'flex-end', padding: '0 0 5px 8px', boxSizing: 'border-box', color: '#333'}}>{t}</div>)}
      {x.covers.map((cv, i) => {
        const k = tile(i);
        return (
          <div key={i} style={{position: 'absolute', left: 1260, top: 290 + i * 190, width: 302, height: 172, borderRadius: 10, overflow: 'hidden'}}>
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #e7c8f4 0%, #b79cf2 60%, #9b8cf0 100%)'}} />
            <div style={{position: 'absolute', inset: 0, opacity: k}}>
              <Img src={staticFile(`library/photos/${cv.photo}.jpg`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
              <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(236,226,248,0.95) 0%, rgba(226,212,246,0.85) 48%, rgba(190,160,240,0.25) 100%)'}} />
              <div style={{position: 'absolute', left: 18, top: 30, fontSize: 26, fontWeight: 800, color: '#4b3a7a', lineHeight: 1.1, width: 180}}>{cv.title}</div>
              <div style={{position: 'absolute', left: 18, bottom: 22, fontSize: 13, color: '#6a58a0'}}>{cv.sub}</div>
            </div>
            <div style={{position: 'absolute', inset: 0, background: '#a080f0', opacity: k > 0 && k < 1 ? 0.35 * (1 - k) : 0, mixBlendMode: 'multiply'}} />
          </div>
        );
      })}
    </div>
  );
};

export const GeneratingStudioGroup: React.FC<{inputs?: GenInputs; extras?: number[]}> = ({inputs: x = GEN_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, GENERATING_STUDIO_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  if (s < 28.66) {
    const L = Array.from(x.label);
    const k = clamp((s - 27.72) / 0.35);
    const by = kf(s, [[27.7, 528], [28.2, 548], [28.6, 562]], lin) + held * 4;
    const glow = 0.5 + 0.5 * Math.sin((s - 27.7) * 7 + held * 4);
    const sweep = ((s - 27.7) * 900 + held * 600) % 1400 - 300;
    const dotN = 1 + (Math.floor((s + held) * 5) % 3);
    return (
      <AbsoluteFill style={{fontFamily: SANS}}>
        <Bg s={s} />
        <div style={{position: 'absolute', left: 960 - 492, top: by - 145, width: 984, height: 290, borderRadius: 54, padding: 8, boxSizing: 'border-box', background: 'linear-gradient(100deg, #5a8cf0 0%, #8b7cf2 50%, #6e7ff0 100%)', boxShadow: `0 0 ${30 + glow * 40}px rgba(170,150,250,${0.35 + glow * 0.3}), 0 0 0 ${10 + glow * 8}px rgba(255,255,255,${0.25 + glow * 0.2})`, transform: `rotate(${kf(s, [[28.3, 0], [28.66, 2.5]], eio)}deg) scale(${1 - 0.02 * Math.sin((s - 27.7) * 5) + rs(s, 28.3, 0.36, eio) * 0.03})`}}>
          <div style={{width: '100%', height: '100%', borderRadius: 48, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 34}}>
            <div style={{opacity: rs(s, 27.7, 0.1, lin)}}><Sparkle size={92} c="#2a2830" /></div>
            <div style={{fontSize: 92, fontWeight: 500, whiteSpace: 'nowrap', display: 'flex', alignItems: 'baseline', minWidth: 400}}>
              {L.map((c, i) => {
                const a = clamp(k * L.length * 1.2 - i);
                return <span key={i} style={{opacity: a, backgroundImage: `linear-gradient(90deg, #2a2830 ${sweep - 160}px, ${PURPLE} ${sweep}px, #8fb0ff ${sweep + 60}px, #2a2830 ${sweep + 200}px)`, backgroundPosition: `${-i * 84}px 0`, backgroundSize: '1400px 100%', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{c}</span>;
              })}
              <span style={{width: 100, letterSpacing: 6, color: INK, opacity: k >= 1 ? 1 : 0}}>{'·'.repeat(dotN)}</span>
            </div>
          </div>
        </div>
        <Grain opacity={0.03} blend="multiply" />
      </AbsoluteFill>
    );
  }
  // 界面飞入 → 推进工作室
  const E = eio;
  const W = kf(s, [[28.66, 640], [28.8, 1040], [28.95, 1240], [29.1, 1360], [29.31, 1640], [29.46, 2400], [30.4, 2400]], eo);
  const sc = W / 1600;
  const cx = kf(s, [[28.66, 1720], [28.8, 960], [28.95, 980], [29.1, 960], [29.25, 880]], eo);
  const cy = kf(s, [[28.66, 380], [28.8, 480], [28.95, 520], [29.1, 520], [29.25, 460]], eo);
  const ryD = kf(s, [[28.66, 30], [28.8, 6], [28.95, 3], [29.1, 1], [29.25, 0]], eo);
  const rxD = kf(s, [[28.66, 45], [28.8, 14], [28.95, 6], [29.25, 0]], eo);
  const rz = kf(s, [[28.66, 10], [28.8, 3], [28.95, 2], [29.25, 0]], eo);
  const push = rs(s, 29.31, 0.15, E);
  const left = mix(cx - 800 * sc, -718, push);
  const top = mix(cy - 450 * sc, kf(s, [[29.46, -220], [29.58, -280], [30.0, -309], [30.4, -319]], lin) - held * 6, push);
  return (
    <AbsoluteFill style={{fontFamily: SANS, overflow: 'hidden'}}>
      <Bg s={s} />
      <div style={{position: 'absolute', left, top, width: 1600, height: 900, transformOrigin: '0 0', transform: `scale(${sc})`}}>
        <div style={{position: 'absolute', inset: 0, transformOrigin: '50% 50%', transform: `perspective(1800px) rotateX(${rxD}deg) rotateY(${ryD}deg) rotate(${rz}deg)`}}>
          <NotebookFull x={x} s={s} />
        </div>
      </div>
      <div style={{position: 'absolute', right: 36, bottom: 26, fontSize: 20, color: 'rgba(60,50,80,0.45)', letterSpacing: '0.06em'}}>界面为示意 · 仅作演示</div>
      <Grain opacity={0.025} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(GENERATING_STUDIO_CONTRACT).length) throw new Error(checkContract(GENERATING_STUDIO_CONTRACT).join('；'));
export const GeneratingStudio: React.FC = () => <GeneratingStudioGroup />;
