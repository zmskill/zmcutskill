// 【镜头组】feature-cards-social-wordmark：照片条往上推走，四张白色功能小卡从下面一张张顶上来铺满蓝底（数字一直在跳、滑块在走）→
//   卡片缩小让出中间一行标语 → 左边甩进一个大头像圆 → 硬切白底，一串头像圆像蛇一样从左上斜着游下来、绕到字标下面再从右边游走 → 停在字标（035-D 一拍，功能拼贴 + 收尾）
// 学的动作（Varcyyyy · Venmo 7.5–10.75s，30fps 逐帧量过，2026-11-21）：
//   照片条下沿 7.5 705 → 7.6 255 → 7.75 10；卡片从下往上顶：「预算」上沿 7.5 795 → 7.6 45，分期卡晚一点（7.6 195 → 7.75 105），AA 卡 7.6 900 → 7.75 645
//   四张卡的框（x,y,宽,高）：7.75 预算 (60,60,930,570) 分期 (1050,105,774,480) AA (66,645,870,500) 吃饭 (984,600,840,520)
//   → 7.9 (84,69,900,561) (1044,120,762,474) (90,675,846,480) (990,645,810,520) → 8.0 (186,69,684,420) (1161,108,579,357) (234,615,654,396) (1110,645,621,470)
//   → 8.3 (114,54,591,366) (1218,84,498,306) (231,654,564,342) (1179,651,537,430)；8.0 起中间标语淡进来（y 531）
//   数字：预算 26 → 44 → 72 → 92 → 103 → 135 → 153（7.5/7.6/7.75/7.9/8.0/8.3/8.5）；分期 78 → 123 → 154 → 171 → 216 → 257 → 305（7.6–8.65），滑块跟着走
//   8.45 左边甩进大头像圆（直径 480，8.5 中心 (360,315) → 8.65 (637,322)），后面跟一个淡蓝圆
//   8.8 硬切白底：头像圆（直径 ≈170）沿一条斜线游下来，8.82 头在 (853,525)，8.95 (1230,774)，9.1 绕到 (1755,780)，9.3 从右边出去；越靠前挨得越紧
//   8.95 字标出现在正中（y 534），9.3 之后只剩字标停住
// 我们的内容：中文功能卡（预算 / 再分 4 期 / AA 分账 / 吃饭），标语「让付款更有人情味」，字标「拼付」（虚构），头像用素材库真人照片（2026-11-23 用户要求，原片也是真人），照片用素材库街景。
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 7.5;
const BLUE = '#1296f2';
const NAVY = '#0e2a4f';
const SANS = '"Inter","PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const lin = (t: number, K: number[][], j = 1) => {
  if (t <= K[0][0]) return K[0][j];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const a = K[i - 1], b = K[i]; return a[j] + (b[j] - a[j]) * (t - a[0]) / (b[0] - a[0]); }
  return K[K.length - 1][j];
};
// 卡片框关键帧 [t, x, y, w, h]
const BUDGET = [[7.45, 66, 1100, 924, 570], [7.5, 66, 795, 924, 570], [7.6, 60, 45, 930, 570], [7.75, 60, 60, 930, 570], [7.9, 84, 69, 900, 561], [8.0, 186, 69, 684, 420], [8.3, 114, 54, 591, 366]];
const INST = [[7.5, 1047, 1200, 777, 480], [7.6, 1047, 195, 777, 480], [7.75, 1050, 105, 774, 480], [7.9, 1044, 120, 762, 474], [8.0, 1161, 108, 579, 357], [8.3, 1218, 84, 498, 306]];
const SPLIT = [[7.5, 66, 1300, 870, 500], [7.6, 66, 900, 870, 500], [7.75, 66, 645, 870, 500], [7.9, 90, 675, 846, 480], [8.0, 234, 615, 654, 396], [8.3, 231, 654, 564, 342]];
const EAT = [[7.6, 984, 1200, 840, 520], [7.75, 984, 600, 840, 520], [7.9, 990, 645, 810, 520], [8.0, 1110, 645, 621, 470], [8.3, 1179, 651, 537, 430]];
const PATH = [[-260, -260], [303, 78], [553, 262], [720, 412], [853, 525], [1000, 640], [1230, 774], [1450, 830], [1755, 780], [2300, 600]];
const PLEN = (() => { const L = [0]; for (let i = 1; i < PATH.length; i++) L.push(L[i - 1] + Math.hypot(PATH[i][0] - PATH[i - 1][0], PATH[i][1] - PATH[i - 1][1])); return L; })();
const onPath = (d: number) => {
  if (d <= 0) { const [a, b] = [PATH[0], PATH[1]]; const k = d / PLEN[1]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; }
  for (let i = 1; i < PATH.length; i++) if (d <= PLEN[i]) { const k = (d - PLEN[i - 1]) / (PLEN[i] - PLEN[i - 1]); return [PATH[i - 1][0] + (PATH[i][0] - PATH[i - 1][0]) * k, PATH[i - 1][1] + (PATH[i][1] - PATH[i - 1][1]) * k]; }
  const n = PATH.length - 1; return [PATH[n][0] + (d - PLEN[n]) * 0.95, PATH[n][1] - (d - PLEN[n]) * 0.3];
};
const at = (pt: number[]) => { let best = 0; for (let i = 0; i < PATH.length; i++) if (PATH[i][0] === pt[0] && PATH[i][1] === pt[1]) best = PLEN[i]; return best; };
// 头像用素材库真人照片（Pexels，见 library/faces/faces.json）——2026-11-23 用户：头像为什么不是真人头像
const AV = ['f11', 'm17', 'f03', 'm15', 'f08', 'm08', 'f15', 'm11', 'f19'];
const BIG_FACE = 'f11';

export const FEATURE_CARDS_CONTRACT: GroupContract = {
  sourceDuration: 98 / 30,
  fps: 30,
  motion: [[0, 1.85]],
  holds: [{at: 2.2, maxExtra: 3}],
  landmarks: {cards: 0, tagline: 0.5, face: 0.95, cut: 1.3, mark: 1.45, rest: 1.85},
  sfx: [
    {at: 'cards', type: '上升', note: '卡片升起 swish 一串', tail: 0.2, volume: 0.35},
    {at: 'tagline', type: '短甩', note: '轻 whoosh', volume: 0.25},
    {at: 'face', type: '弹出', note: '弹出 pop', volume: 0.35},
    {at: 'cut', type: '弹出', note: '一串 pop', tail: 0.4, volume: 0.3},
    {at: 'mark', type: '提示音', note: '品牌音 ding', volume: 0.4},
  ],
  inputs: {tagline: {maxChars: 10}, mark: {maxChars: 4}},
};
export type FeatureCardsInputs = {tagline: string; mark: string; budget: string; inst: string; split: string; eat: string; logo: string; note: string};
export const FEATURE_CARDS_DEFAULT_INPUTS: FeatureCardsInputs = {tagline: '让付款更有人情味', mark: '拼付', budget: '预算', inst: '再分 4 期', split: 'AA 分账', eat: '吃饭', logo: '拼', note: '虚构 · 仅作演示'};
export const checkFeatureCardsInputs = (x: FeatureCardsInputs) => checkInputs(FEATURE_CARDS_CONTRACT, {tagline: x.tagline, mark: x.mark});
export const planFeatureCards = (sec: number) => planExtras(FEATURE_CARDS_CONTRACT, sec);
export const featureCardsFrames = (extras: number[]) => Math.round(outputDuration(FEATURE_CARDS_CONTRACT, extras) * FPS);
export const FEATURE_CARDS_DURATION = 98;

const Card: React.FC<{K: number[][]; s: number; children: (k: number) => React.ReactNode}> = ({K, s, children}) => {
  const x = lin(s, K, 1), y = lin(s, K, 2), w = lin(s, K, 3), h = lin(s, K, 4);
  const k = w / K[K.length - 1][3]; // 相对 8.3 的缩放
  return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 30 * k, background: '#fff', overflow: 'hidden', fontFamily: SANS, color: NAVY}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: K[K.length - 1][3], height: K[K.length - 1][4] + 200, transform: `scale(${k})`, transformOrigin: '0 0'}}>{children(k)}</div>
  </div>;
};

export const FeatureCardsSocialWordmarkGroup: React.FC<{inputs?: FeatureCardsInputs; extras?: number[]}> = ({inputs: x = FEATURE_CARDS_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, FEATURE_CARDS_CONTRACT, extras) + S0;
  if (s < 8.8) {
    const bud = Math.round(lin(s, [[7.45, 20], [7.5, 26], [7.6, 44], [7.75, 72], [7.9, 92], [8.0, 103], [8.3, 135], [8.5, 153], [8.8, 168]]));
    const ins = Math.round(lin(s, [[7.5, 47], [7.6, 78], [7.75, 123], [7.9, 154], [8.0, 171], [8.3, 216], [8.5, 257], [8.65, 305], [8.8, 352]]));
    const knob = lin(s, [[7.5, 0.12], [7.75, 0.3], [8.0, 0.42], [8.3, 0.47], [8.65, 0.6], [8.8, 0.68]]);
    const photoB = lin(s, [[7.45, 1080], [7.5, 705], [7.6, 255], [7.75, 10], [7.8, -40]]);
    const tag = clamp((s - 8.0) / 0.25);
    const faceX = lin(s, [[8.43, -300], [8.5, 360], [8.65, 637], [8.8, 760]]), faceY = lin(s, [[8.43, 300], [8.5, 315], [8.65, 322], [8.8, 330]]);
    return (
      <AbsoluteFill style={{background: BLUE, overflow: 'hidden'}}>
        {photoB > 0 && <div style={{position: 'absolute', left: 0, top: photoB - 705, width: 1920, height: 705, overflow: 'hidden'}}>
          <Img src={staticFile('library/photos/city/city3.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          <div style={{position: 'absolute', left: 954 - 135, top: 534 - 135, width: 270, height: 270, borderRadius: '50%', background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: SANS, fontSize: 150, fontWeight: 800, fontStyle: 'italic'}}>{x.logo}</div>
        </div>}
        {tag > 0 && <div style={{position: 'absolute', left: 0, right: 0, top: 531, transform: `translateY(-50%) scale(${0.96 + 0.04 * eo(tag)})`, textAlign: 'center', fontFamily: SANS, fontSize: 100, fontWeight: 600, color: '#fff', opacity: tag}}>{x.tagline}</div>}
        <Card K={BUDGET} s={s}>{() => <>
          <div style={{position: 'absolute', left: 50, top: 28, fontSize: 80, fontWeight: 700}}>{x.budget}</div>
          <div style={{position: 'absolute', left: 50, top: 210, width: 76, height: 76, borderRadius: '50%', background: '#d6d6d6', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><div style={{width: 40, height: 10, borderRadius: 5, background: '#fff'}} /></div>
          <div style={{position: 'absolute', left: 140, width: 300, top: 180, textAlign: 'center', fontSize: 128, fontWeight: 600, letterSpacing: '-0.03em'}}>{bud}</div>
          <div style={{position: 'absolute', left: 464, top: 210, width: 76, height: 76, borderRadius: '50%', background: '#ee1d36', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 64, fontWeight: 700, lineHeight: 1}}>+</div>
        </>}</Card>
        <Card K={INST} s={s}>{() => <>
          <div style={{position: 'absolute', left: 42, top: 44, fontSize: 40, fontWeight: 500}}>{x.inst}</div>
          <div style={{position: 'absolute', left: 42, top: 96, fontSize: 84, fontWeight: 600, letterSpacing: '-0.02em'}}><span style={{fontSize: 44}}>¥</span>{ins}</div>
          <div style={{position: 'absolute', left: 42, top: 222, width: 410, height: 16, borderRadius: 8, background: '#e2e2e2'}} />
          <div style={{position: 'absolute', left: 42, top: 222, width: 410 * knob, height: 16, borderRadius: 8, background: '#ff5a0a'}} />
          <div style={{position: 'absolute', left: 42 + 410 * knob - 32, top: 198, width: 64, height: 64, borderRadius: '50%', background: '#ff5a0a'}} />
        </>}</Card>
        <Card K={SPLIT} s={s}>{() => <>
          <div style={{position: 'absolute', left: 44, top: 36, fontSize: 68, fontWeight: 700}}>{x.split}</div>
          {[['#7ef36a', 'rk'], ['#f04fe8', 'ss'], ['#9fe6f8', 'cr']].map(([c, t], i) => <div key={i} style={{position: 'absolute', left: 44 + i * 170, top: 170, width: 132, height: 132, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, fontWeight: 600, color: i === 1 ? '#fff' : NAVY}}>{t}<div style={{position: 'absolute', right: 6, bottom: 4, width: 26, height: 26, borderRadius: '50%', background: '#ee1d36', border: '4px solid #fff'}} /></div>)}
        </>}</Card>
        <Card K={EAT} s={s}>{() => <>
          <div style={{position: 'absolute', left: 36, top: 26, fontSize: 80, fontWeight: 700}}>{x.eat}</div>
          <div style={{position: 'absolute', left: 26, top: 150, width: 486, height: 400, borderRadius: 18, background: '#f6b928'}}><div style={{position: 'absolute', left: 30, top: 24, fontSize: 48, fontWeight: 600}}>50</div></div>
          <div style={{position: 'absolute', left: 90, top: 236, width: 422, height: 320, borderRadius: 14, background: '#f04fe8'}}><div style={{position: 'absolute', left: 26, top: 16, fontSize: 48, fontWeight: 600, color: '#fff'}}>30</div></div>
          <div style={{position: 'absolute', left: 166, top: 316, width: 346, height: 240, borderRadius: 12, background: '#9fe6f8'}}><div style={{position: 'absolute', left: 26, top: 12, fontSize: 48, fontWeight: 600}}>20</div></div>
        </>}</Card>
        {s > 8.43 && <>
          <div style={{position: 'absolute', left: faceX - 300 - 60, top: faceY - 240 + 60, width: 480, height: 480, borderRadius: '50%', background: 'rgba(160,210,255,0.85)'}} />
          <div style={{position: 'absolute', left: faceX - 240, top: faceY - 240, width: 480, height: 480, borderRadius: '50%', overflow: 'hidden', border: '10px solid #fff', boxSizing: 'border-box', background: '#ddd'}}><Img src={staticFile(`library/faces/${BIG_FACE}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
        </>}
        <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em'}}>{x.note}</div>
      </AbsoluteFill>
    );
  }
  // 白底：头像蛇 + 字标
  const headD = lin(s, [[8.8, at(PATH[3]) - 40], [8.82, at(PATH[4])], [8.95, at(PATH[6])], [9.1, at(PATH[8])], [9.3, at(PATH[8]) + 520]]);
  const gap = lin(s, [[8.8, 150], [8.95, 95], [9.1, 72], [9.3, 66]]); // 越靠前挨得越紧，互相压着
  const mark = clamp((s - 8.93) / 0.08);
  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 534, transform: `translateY(-50%) scale(${0.95 + 0.05 * eo(mark)})`, textAlign: 'center', fontFamily: SANS, fontSize: 110, fontWeight: 800, fontStyle: 'italic', color: BLUE, letterSpacing: '0.02em', opacity: mark}}>{x.mark}</div>
      {s < 9.5 && AV.map((fid, i) => {
        const spread = lin(s, [[8.8, 0.5], [8.95, 0.28], [9.1, 0.06]]); // 尾巴先拉得开，游着游着挤到一起
        const d = headD - i * gap * (1 + spread * i);
        const [px, py] = onPath(d);
        if (px > 2100 || py < -200) return null;
        return <div key={i} style={{position: 'absolute', left: px - 85, top: py - 85, width: 170, height: 170, borderRadius: '50%', overflow: 'hidden', background: '#ddd', border: '6px solid #fff', boxSizing: 'border-box', boxShadow: '0 4px 14px rgba(0,0,0,0.12)', zIndex: 20 - i}}><Img src={staticFile(`library/faces/${fid}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>;
      })}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(30,60,100,0.4)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(FEATURE_CARDS_CONTRACT).length) throw new Error(checkContract(FEATURE_CARDS_CONTRACT).join('；'));
export const FeatureCardsSocialWordmark: React.FC = () => <FeatureCardsSocialWordmarkGroup />;
