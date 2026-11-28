// 【镜头组】dot-arc-card-stair：一颗紫色圆点滑过，一句话浮出来、圆点绕着字跑 → 字往右让开 → 照片卡从左下角开始沿一道弧线一张张排上去，像台阶，
//   弧线一路往右转，弧心下面的服务名跟着一个个换（029-E 一拍，功能 / 服务枚举）
// 学的动作（Rixlab · Nextel 22–28.9s，内容区 1600×900 放大到 1920×1080）：
//   22.0 大紫点（d≈170）从右下滑进、22.4 缩到 d36；字 95px 居中 y534 逐词浮上；圆点 22.6 (1158,312) → 23.0 (720,366) → 23.4 (468,420) → 23.8 (930,720)
//   24.2 字往右滑出；24.5 起卡片沿椭圆弧（圆心 960,900，rx800、ry660）排，每 15° 一张（340×230，基本保持竖直、往里斜 24°，像台阶），弧头 170°→250°（25.0）→290°→320°→350°（27.4）→375°（28.2）→385°
//   弧尾 27.4 前停在 165°，之后 275°（28.2）→315°（28.6）→340°；服务名（64px，y768）每 0.8s 换一个，换的时候由糊变清
// 我们的内容：「你需要的，都在这里」；服务：家庭光纤宽带 / 企业宽带 / 全屋智能 Wi-Fi / 云与数据 / 游戏与影音 / 网络安全方案；照片用素材库实拍。
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {FloatLine, PinkBg, SANS, clamp, eo, kf, mix} from '../words-float-photo-cloud/WordsFloatPhotoCloud';

const FPS = 30;
const S0 = 22.0;
export const DOT_ARC_CARD_STAIR_CONTRACT: GroupContract = {
  sourceDuration: 207 / 30,
  fps: 30,
  motion: [[0, 1.95], [2.05, 207 / 30]],
  holds: [{at: 2.0, maxExtra: 1.5}],
  landmarks: {dot: 0, text: 0.4, slide: 2.2, s1: 2.6, s2: 3.4, s3: 4.2, s4: 5.0, s5: 5.8, s6: 6.6},
  sfx: [
    {at: 'dot', type: '短甩', note: '滑入 swish', volume: 0.35},
    {at: 'text', type: '短甩', note: '轻 swoosh', volume: 0.3},
    {at: 's1', type: '轻tick', note: '卡片 tick', tail: 4.2, volume: 0.25},
  ],
  inputs: {},
};
export const planStair = (sec: number) => planExtras(DOT_ARC_CARD_STAIR_CONTRACT, sec);
export const stairFrames = (extras: number[]) => Math.round(outputDuration(DOT_ARC_CARD_STAIR_CONTRACT, extras) * FPS);
export const DOT_ARC_CARD_STAIR_DURATION = 207;

// 2026-11-19 卡片照片：去掉纯白空桌面（远看像空白卡），用家居 / 城市 / 用手机的人（和宽带、智能家居、影音相关）
const CARD_PICS = ['interior/interior00', 'shortvideo/sv04', 'interior/interior02', 'city/city3', 'shortvideo/sv07', 'interior/interior04', 'cafe/in2', 'shortvideo/sv46', 'interior/interior05', 'city/city6', 'shortvideo/sv06', 'interior/interior01', 'hz/hz04', 'shortvideo/sv48', 'interior/interior06', 'city/city1'];
const SERVICES = ['家庭光纤宽带', '企业宽带', '全屋智能 Wi-Fi', '云与数据', '游戏与影音', '网络安全方案'];
const ST = [24.45, 25.28, 26.08, 26.88, 27.58, 28.3]; // 2026-11-19 逐帧：每个服务名逐字从右下飘进来，27.8 / 28.6 已经打完

export const DotArcCardStairGroup: React.FC<{extras?: number[]}> = ({extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, DOT_ARC_CARD_STAIR_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const els: React.ReactNode[] = [];
  if (s < 24.75) {
    // 2026-11-18 每 0.2s 重新量了一遍圆点位置（原来少了 22.4 / 22.8 / 23.2 / 23.6 四个点，圆点也偏小）
    const dx = kf(s, [[22.0, 1250], [22.2, 1316], [22.4, 1530], [22.6, 1150], [22.8, 897], [23.0, 712], [23.2, 585], [23.4, 468], [23.6, 390], [23.8, 926], [24.0, 1300]]);
    const dy = kf(s, [[22.0, 1000], [22.2, 805], [22.4, 334], [22.6, 314], [22.8, 344], [23.0, 373], [23.2, 383], [23.4, 432], [23.6, 599], [23.8, 717], [24.0, 760]]);
    const dd = kf(s, [[22.0, 300], [22.2, 360], [22.35, 120], [22.5, 80], [23.6, 90], [23.8, 130], [24.0, 80]]);
    // 2026-11-19 逐帧：字 24.1 起往右滑、越滑越快越糊（24.3 +154、24.5 +540，24.5 还看得见，24.7 出画）；第一个词 22.3 已经糊糊地浮着了
    const sx = kf(s, [[23.5, 0], [24.1, 96], [24.3, 250], [24.5, 638], [24.75, 1250]]) /* 原片 23.6 起字就在极慢地往右漂（23.6→24.1 +96），之前 23.9–24.1 停住 */, sb = clamp((s - 24.15) / 0.3);
    els.push(<div key="t" style={{position: 'absolute', inset: 0, transform: `translateX(${sx}px)`, opacity: 1 - clamp((s - 24.5) / 0.25), filter: sb > 0 ? `blur(${sb * 9}px)` : undefined}}><FloatLine words={['你需要的，', '都在', '这里']} t0={22.2} s={s} y={534} fs={120} /></div>);
    if (s < 23.92) els.push(<div key="d" style={{position: 'absolute', left: dx - dd / 2, top: dy - dd / 2, width: dd, height: dd, borderRadius: '50%', background: 'radial-gradient(circle closest-side, #e070f0, #c44ae0)', opacity: 1 - clamp((s - 23.82) / 0.1)}} />);
  }
  if (s >= 24.45) {
    // 2026-11-19 按原片 24.6–28.6 每 0.4s 量卡片中心重做：卡片是一条「蛇」——领头那张（同一张照片）沿椭圆弧往前爬，后面每张落后 17°，
    //   从左下角一张张冒出来像台阶；卡片是平的（不歪不转），领头的压在最上面。椭圆圆心 (1000,1000)、rx760、ry640
    //   头：24.6 178° → 24.8 213° → 25.4 260° → 26.2 284° → 27.0 311° → 27.8 360° → 28.6 380°；尾：26.2 前 ≈178°，27.0 193° → 27.8 236° → 28.6 303°
    const head = kf(s, [[24.45, 160], [24.6, 178], [24.8, 213], [25.4, 260], [26.2, 284], [27.0, 311], [27.8, 360], [28.6, 382], [28.9, 392]]) + held * 2;
    const tail = kf(s, [[24.45, 150], [26.2, 176], [27.0, 193], [27.8, 236], [28.6, 303], [28.9, 330]]);
    const CX = 1000, CY = 1000, RX = 760, RY = 640, GAP = 17;
    for (let jj = 0; jj < 16; jj++) {
      const ang = head - jj * GAP;
      if (ang < tail - 5 || ang < 150) continue;
      const o = clamp((ang - tail + 5) / 5);
      const a = (ang * Math.PI) / 180;
      const x = CX + Math.cos(a) * RX, y = CY + Math.sin(a) * RY;
      els.push(<div key={jj} style={{position: 'absolute', left: x - 175, top: y - 114, width: 350, height: 228, opacity: o, zIndex: 40 - jj, transform: `translateY(${(1 - o) * 30}px)`}}>
        <Img src={staticFile(`library/photos/${CARD_PICS[jj % CARD_PICS.length]}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10, boxShadow: '0 10px 24px rgba(60,20,90,0.22)'}} />
      </div>);
    }
    let si = 0; for (let i = 0; i < ST.length; i++) if (s >= ST[i]) si = i;
    const chars = Array.from(SERVICES[si]);
    const per = Math.min(0.045, 0.32 / Math.max(1, chars.length));
    els.push(<div key="lab" style={{position: 'absolute', left: 0, right: 0, top: 768, transform: 'translateY(-50%)', textAlign: 'center', fontFamily: SANS, fontSize: 72, fontWeight: 600, color: '#141428', whiteSpace: 'pre', zIndex: 60}}>
      {chars.map((c, ci) => { const k = eo(clamp((s - ST[si] - ci * per) / 0.16)); return <span key={ci} style={{display: 'inline-block', opacity: k, transform: `translate(${(1 - k) * 46}px, ${(1 - k) * 34}px) rotate(${(1 - k) * 24}deg) scale(${0.7 + 0.3 * k})`, filter: k < 1 ? `blur(${(1 - k) * 4}px)` : undefined}}>{c}</span>; })}
    </div>); // 原片服务名是一个字一个字从右下沿弧线飘进来、边转边落位
    void mix;
  }
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <PinkBg variant="right" />
      {els}
    </AbsoluteFill>
  );
};

if (checkContract(DOT_ARC_CARD_STAIR_CONTRACT).length) throw new Error(checkContract(DOT_ARC_CARD_STAIR_CONTRACT).join('；'));
export const DotArcCardStair: React.FC = () => <DotArcCardStairGroup />;
