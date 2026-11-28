// 【镜头组】activity-line-chain：白粉底，一张动态卡吊在一根从顶上垂下来的细线上展开 → 镜头往下跟，线弯下去接到第二张卡 → 再往右，线拐上去接到第三张卡，
//   卡上弹出「很喜欢！❤」小标签、撒一把彩纸 → 镜头拉远看到整条链 → 几条红色竖条从左扫过出场（038-G 一拍，连线动态流）
// 学的动作（NoorMalik · Teamflow 33.5–41s，30fps 逐帧量过）：
//   世界坐标以 36.6s 为准：卡1 (158,−162) 825×227（左红右黑）、卡2 (514,432) 823×225（左黑右红）、卡3 (1575,91) 810×218
//   镜头（左上角，倍数）33.4 (−384,−605) → 35.2 (−371,−592) → 35.8 (−99,−155) → 36.6 (0,0) → 37.9 (873,−315) → 38.9 (1078,−343) → 40.0–40.3 拉远到 0.65（−108,−627）
//   33.5–34.2 卡1 从吊线处往两边展开；35.6–36.2 线从卡1 底弯下去画到卡2 顶，卡2 从右边滑进；37.6–38.1 线从卡2 右边拐上去，卡3 落下来、0.8→1 放大
//   38.7 卡3 右边弹出小标签 + 彩纸；40.6 线从卡3 往右再伸一截；40.75–41 红色竖条（深红 / 红 / 粉 / 浅）从左往右扫过
// 我们的内容：小美 分享了一个设计方案 → 阿亮 做好了动效方向 → 客户 打开了文件「很喜欢！」，头像用素材库真人照片。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {Av, DrawPath, SANS, back, clamp, eio, eo, kf, mix} from '../card-line-flow/CardLineFlow';

const FPS = 30;
const S0 = 33.5;
export const ACTIVITY_LINE_CHAIN_CONTRACT: GroupContract = {
  sourceDuration: 225 / 30,
  fps: 30,
  motion: [[0, 1.6], [1.7, 6.1], [6.2, 225 / 30]],
  holds: [{at: 1.65, maxExtra: 1.5}, {at: 6.15, maxExtra: 1.5}],
  landmarks: {card1: 0, line2: 2.1, card2: 2.3, line3: 4.1, card3: 4.4, loved: 5.2, pull: 6.5, wipe: 7.25},
  sfx: [
    {at: 'card1', type: '短甩', note: '展开 swish', volume: 0.35},
    {at: 'line2', type: '短甩', note: '画线 swish', volume: 0.3},
    {at: 'line3', type: '短甩', note: '画线 swish', volume: 0.3},
    {at: 'loved', type: '彩纸', note: '彩纸 pop', volume: 0.45},
    {at: 'wipe', type: '运镜', note: '扫屏 whoosh', volume: 0.45},
  ],
  inputs: {},
};
export const planChain = (sec: number) => planExtras(ACTIVITY_LINE_CHAIN_CONTRACT, sec);
export const chainFrames = (extras: number[]) => Math.round(outputDuration(ACTIVITY_LINE_CHAIN_CONTRACT, extras) * FPS);
export const ACTIVITY_LINE_CHAIN_DURATION = 225;

const Act: React.FC<{w: number; h: number; face: string; name: string; text: string; flip?: boolean; icon?: string; children?: React.ReactNode}> = ({w, h, face, name, text, flip, icon = 'doc', children}) => (
  <div style={{position: 'relative', width: w, height: h, borderRadius: 18, background: flip ? 'linear-gradient(90deg, #220004 0%, #7a0008 55%, #d4000f 100%)' : 'linear-gradient(90deg, #d4000f 0%, #7a0008 55%, #220004 100%)', boxShadow: '0 16px 40px rgba(120,0,10,0.25)', fontFamily: SANS, color: '#fff', overflow: 'hidden'}}>
    <Av k={face} size={h * 0.66} style={{position: 'absolute', left: h * 0.15, top: h * 0.17}} />
    <div style={{position: 'absolute', left: h * 0.98, top: h * 0.22, fontSize: h * 0.18, fontWeight: 500}}>{name}</div>
    <div style={{position: 'absolute', left: h * 0.98, top: h * 0.5, fontSize: h * 0.19, whiteSpace: 'nowrap'}}>{text}</div>
    <div style={{position: 'absolute', right: h * 0.2, top: h * 0.16, width: h * 0.3, height: h * 0.3, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <svg width={h * 0.17} height={h * 0.17} viewBox="0 0 24 24">{icon === 'bell' ? <path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zM10 19a2 2 0 0 0 4 0" fill="#d4000f" /> : <><rect x={5} y={3} width={14} height={18} rx={2} fill="#d4000f" /><path d="M8 8h8M8 12h8M8 16h5" stroke="#fff" strokeWidth={1.8} /></>}</svg>
    </div>
    {children}
  </div>
);

export const ActivityLineChainGroup: React.FC<{extras?: number[]}> = ({extras = [0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, ACTIVITY_LINE_CHAIN_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  // 2026-11-19 镜头整段改成按原片逐帧跟踪（camtrack.py：特征点 + RANSAC 求每帧的缩放 / 平移，以 36.6 为基准）得到的路径，每 2 帧一个点：
  //   原片是「停 → 猛甩 → 停」，而且每张卡到位时镜头会推近 / 退远一点（34.5–34.9 推近 12%、36.65–36.95 退 11%、38.55–39.0 又推近）；
  //   之前我们的镜头一直在慢慢挪、从不停，也没有推拉，所以看着一卡一卡、不像原片那样有节奏
  const CAM: number[][] = [[33.550, 0.8878, 343.8, 527.7], [33.617, 0.8882, 344.1, 527.8], [33.683, 0.8884, 344.1, 527.8], [33.750, 0.8886, 344.1, 528.0], [33.817, 0.8886, 343.9, 528.0], [33.883, 0.8886, 343.9, 528.0], [33.950, 0.8896, 344.1, 528.7], [34.017, 0.8908, 344.5, 529.4], [34.083, 0.8912, 344.6, 529.6], [34.150, 0.8912, 344.5, 529.6], [34.217, 0.8914, 344.5, 529.7], [34.283, 0.8918, 344.5, 530.0], [34.350, 0.8926, 344.7, 530.4], [34.417, 0.8942, 345.0, 531.4], [34.483, 0.8972, 345.9, 533.1], [34.550, 0.9029, 347.7, 536.3], [34.617, 0.9148, 352.0, 543.1], [34.683, 0.9420, 361.4, 559.4], [34.750, 0.9756, 373.9, 579.1], [34.817, 0.9917, 379.7, 588.6], [34.883, 0.9997, 382.3, 593.3], [34.950, 1.0028, 383.0, 595.1], [35.017, 1.0045, 383.4, 596.1], [35.083, 1.0057, 383.6, 596.7], [35.150, 1.0064, 383.6, 597.1], [35.217, 1.0068, 383.5, 597.4], [35.283, 1.0069, 383.2, 597.4], [35.350, 1.0071, 380.7, 595.8], [35.417, 1.0062, 374.1, 589.6], [35.483, 1.0056, 365.6, 577.1], [35.550, 1.0055, 351.9, 557.1], [35.617, 1.0061, 330.3, 524.5], [35.683, 1.0060, 293.0, 464.4], [35.750, 1.0070, 210.7, 330.4], [35.817, 1.0068, 108.1, 163.1], [35.883, 1.0065, 61.5, 88.5], [35.950, 1.0054, 36.3, 49.3], [36.017, 1.0057, 21.1, 26.1], [36.083, 1.0078, 11.7, 12.2], [36.150, 1.0102, 6.1, 3.9], [36.217, 1.0086, 2.9, 0.2], [36.283, 1.0085, 2.2, -0.1], [36.350, 1.0083, 1.9, -0.0], [36.417, 1.0077, 1.6, -0.0], [36.483, 1.0064, 1.2, -0.0], [36.550, 1.0042, 0.6, -0.0], [36.617, 1.0000, 0.0, 0.0], [36.683, 0.9894, -0.7, 0.1], [36.750, 0.9593, -1.7, 0.1], [36.817, 0.9221, -2.6, 0.1], [36.883, 0.9063, -3.3, 0.1], [36.950, 0.8994, -4.0, 0.2], [37.017, 0.8957, -4.6, 0.2], [37.083, 0.8939, -5.0, 0.2], [37.150, 0.8932, -5.4, 0.3], [37.217, 0.8928, -5.7, 0.3], [37.283, 0.8926, -6.1, 0.4], [37.350, 0.8926, -10.5, 1.4], [37.417, 0.8922, -21.1, 4.6], [37.483, 0.8913, -40.0, 11.6], [37.550, 0.8914, -71.0, 22.4], [37.617, 0.8917, -121.7, 40.9], [37.683, 0.8917, -212.2, 74.7], [37.750, 0.8915, -413.1, 149.2], [37.817, 0.8915, -672.9, 245.5], [37.883, 0.8912, -790.6, 289.0], [37.950, 0.8915, -852.5, 312.0], [38.017, 0.8909, -889.2, 325.6], [38.083, 0.8915, -912.1, 334.2], [38.150, 0.8919, -925.9, 339.3], [38.217, 0.8914, -932.2, 340.2], [38.283, 0.8915, -933.4, 340.4], [38.350, 0.8918, -934.0, 340.5], [38.417, 0.8927, -935.3, 340.7], [38.483, 0.8942, -937.2, 341.0], [38.550, 0.8966, -940.1, 341.6], [38.617, 0.9006, -944.7, 343.1], [38.683, 0.9079, -953.0, 345.9], [38.750, 0.9211, -967.3, 351.0], [38.817, 0.9453, -993.4, 360.1], [38.883, 0.9792, -1029.4, 373.0], [38.950, 0.9985, -1050.7, 379.6], [39.017, 1.0079, -1061.5, 383.2], [39.083, 1.0123, -1067.6, 385.2], [39.150, 1.0156, -1072.0, 386.0], [39.217, 1.0174, -1074.5, 386.4], [39.283, 1.0184, -1075.9, 386.6], [39.350, 1.0186, -1076.5, 386.7], [39.417, 1.0182, -1076.2, 386.5], [39.483, 1.0163, -1072.0, 385.3], [39.550, 1.0106, -1059.7, 382.9], [39.617, 1.0001, -1037.1, 377.9], [39.683, 0.9836, -999.7, 369.8], [39.750, 0.9556, -935.5, 356.3], [39.817, 0.9032, -813.4, 331.3], [39.883, 0.7951, -564.4, 280.5], [39.950, 0.7255, -406.5, 248.2], [40.017, 0.6942, -336.7, 234.0], [40.083, 0.6768, -298.4, 225.8], [40.150, 0.6664, -275.6, 221.1], [40.217, 0.6604, -263.0, 218.4], [40.283, 0.6573, -256.5, 217.1], [40.350, 0.6562, -254.9, 216.7], [40.417, 0.6563, -256.8, 216.7], [40.483, 0.6565, -264.8, 216.8], [40.550, 0.6565, -279.2, 216.8], [40.617, 0.6566, -301.3, 216.8], [40.683, 0.6567, -332.9, 216.8]]; // [t, 缩放, 画面中心平移 x, y]
  const camAt = (t: number) => { if (t <= CAM[0][0]) return CAM[0]; const L = CAM[CAM.length - 1]; if (t >= L[0]) { const P = CAM[CAM.length - 2]; const v = (L[2] - P[2]) / (L[0] - P[0]); return [t, L[1], L[2] + v * (t - L[0]), L[3]]; } let i = 0; while (CAM[i + 1][0] < t) i++; const A = CAM[i], B = CAM[i + 1], u = (t - A[0]) / (B[0] - A[0]); return [t, A[1] + (B[1] - A[1]) * u, A[2] + (B[2] - A[2]) * u, A[3] + (B[3] - A[3]) * u]; };
  const [, camS, camTx, camTy] = camAt(s);
  const camHold = held * 2;
  const unfold = eo(clamp((s - 33.5) / 0.7));
  const c2in = eo(clamp((s - 35.5) / 0.7));
  const W3 = kf(s, [[37.62, 40], [37.72, 280], [37.8, 560], [37.9, 740], [37.97, 810]]);
  const loved = back(clamp((s - 38.55) / 0.22), 2); // 2026-11-19 逐帧：标签 38.6 已经在长、彩纸 38.62 起在标签周围炸开
  const wipe = clamp((s - 40.73) / 0.2); // 2026-11-19 逐帧：40.75 才开始，40.82 五条竖条已经铺满（半透明、还能看到卡），之后颜色越来越深
  const conf = s > 38.62 && s < 39.5 ? clamp((s - 38.62) / 0.85) : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 38%, #fbd3d8 70%, #f4909c 100%)', fontFamily: SANS}}>
      <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${960 + camTx - camHold}px, ${540 + camTy}px) scale(${camS}) translate(-960px, -540px)`}}>
        {/* 顶上垂下来的线 */}
        <div style={{position: 'absolute', left: 572, top: -2400, width: 2, height: 2238, background: '#2a2a2a'}} />
        <div style={{position: 'absolute', left: 566, top: -168, width: 14, height: 14, borderRadius: 7, background: '#111'}} />
        {/* 卡1：从吊线处往两边展开 */}
        <div style={{position: 'absolute', left: mix(573 - 168, 158, unfold), top: -162, width: mix(337, 825, unfold), height: 227, overflow: 'hidden', borderRadius: 18}}>
          <div style={{position: 'absolute', left: -mix(573 - 168 - 158, 0, unfold), top: 0}}><Act w={825} h={227} face="f01" name="小美" text="分享了一个设计方案" /></div>
        </div>
        <DrawPath d="M564 65 C564 200, 700 240, 820 270 S920 360, 920 432" k={clamp((s - 35.45) / 0.35)} stroke="#2a2a2a" w={2.5} />
        {/* 2026-11-19 逐帧量宽度：卡2 跟卡1 一样是从线接上的那一点往两边「展开」的（35.35 一条窄红边 → 35.7 宽 264 → 35.8 624 → 36.0 展完），不是滑进来 */}
        {s > 35.33 && (() => { const W2 = kf(s, [[35.33, 30], [35.6, 120], [35.7, 264], [35.8, 624], [35.9, 744], [36.0, 823]]); const L2 = 920 - W2 * (406 / 823); return <div style={{position: 'absolute', left: L2, top: 432, width: W2, height: 225, overflow: 'hidden', borderRadius: 18}}><div style={{position: 'absolute', left: 514 - L2, top: 0}}><Act w={823} h={225} face="f05" name="阿亮" text="做好了动效方向" flip /></div></div>; })()}
        <DrawPath d="M1337 540 C1550 545, 1800 520, 1977 309" k={clamp((s - 37.5) / 0.35)} stroke="#2a2a2a" w={2.5} />
        {s > 37.3 && (
          <div style={{position: 'absolute', left: 1977 - W3 * (402 / 810), top: 91, width: W3, height: 218, overflow: W3 < 809 ? 'hidden' : 'visible', borderRadius: 18}}>{/* 卡3 也是从线头那一点往两边展开（37.65–37.95），同时镜头往右上甩把它带进来 */}
           <div style={{position: 'absolute', left: 1575 - (1977 - W3 * (402 / 810)), top: 0, width: 810, height: 218}}>
            <Act w={810} h={218} face="m03" name="客户" text="打开了文件" flip icon="bell">
              {s > 38.55 && <div style={{position: 'absolute', left: 492, top: 84, height: 66, padding: '0 22px', borderRadius: 10, background: '#fff', color: '#222', fontSize: 30, display: 'flex', alignItems: 'center', gap: 10, transform: `scale(${loved})`}}>很喜欢！<span style={{color: '#e0001a', fontSize: 34}}>♥</span></div>}
              {conf > 0 && Array.from({length: 90}, (_, i) => { const e = 1 - Math.pow(1 - conf, 2.2); const a = (i / 90) * Math.PI * 2 + i * 1.7, r = 20 + e * (110 + (i % 9) * 26); const big = i % 3 === 0; return <div key={i} style={{position: 'absolute', left: 640 + Math.cos(a) * r, top: 112 + Math.sin(a) * r * 0.7 + conf * conf * 90, width: big ? 14 : 9, height: big ? 6 : 4, borderRadius: 1, background: ['#ffcc1a', '#e8102a', '#2fc65a', '#ff5a8a', '#ffffff', '#ffb000'][i % 6], transform: `rotate(${i * 47 + conf * 520}deg)`, opacity: conf < 0.7 ? 1 : (1 - conf) / 0.3}} />; })}
            </Act>
           </div>
          </div>
        )}
        <DrawPath d="M2385 200 L2660 200" k={clamp((s - 40.55) / 0.3)} stroke="#555" w={2.5} />
      </div>
      {wipe > 0 && [[0, 290, '#7a1e2a'], [290, 465, '#a2525e'], [755, 460, '#d9a3ab'], [1215, 450, '#f1dadd'], [1665, 300, '#f8eef0']].map(([x, w, c], i) => { const k = eo(clamp(wipe * 1.5 - i * 0.08)); return <div key={i} style={{position: 'absolute', top: 0, bottom: 0, left: mix(-(w as number) - 200, x as number, k), width: w as number, background: c as string, opacity: k * mix(0.45, 0.9, wipe)}} />; })}
    </AbsoluteFill>
  );
};

if (checkContract(ACTIVITY_LINE_CHAIN_CONTRACT).length) throw new Error(checkContract(ACTIVITY_LINE_CHAIN_CONTRACT).join('；'));
export const ActivityLineChain: React.FC = () => <ActivityLineChainGroup />;
