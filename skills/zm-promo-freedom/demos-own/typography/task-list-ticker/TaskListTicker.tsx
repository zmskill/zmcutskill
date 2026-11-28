// 一长串任务词竖着滚，中间一个高亮（034-E 单个镜头）
// 学的动作（ana_momin · Pond AI 23.13–25.30s，30fps 逐帧看过；时间表 （内部拆片记录，未随项目提供））：
//   白底；一圈很大的任务短句（字高约 150px），每行左沿排在一条往右弯的弧上（中线那行最靠左 x≈944），长的句子直接被画面右沿裁掉；
//   正中那一行是黑色、左边一个蓝点，上下的行是浅灰、离中间越远越淡；
//   每 0.28 秒整圈往上转一行（0.1 秒走完、长尾巴），每行沿着弧走（往上走的同时左右移），旧的一行变灰、新的一行变黑；两次之间还在极慢地转。
// 我们的内容：「小周」帮全家办的事（交水电费、接孩子放学……）。
//
// 时间表（源秒，30fps，共 64 帧；原 66 帧里最后 2 帧是原片下一镜，已删）
//   0.00       硬切进来
//   0.05 + 0.28k（k = 0…6）  换行：整列上移一行（0.10s，ease-out），高亮交接
// 毛病清单：
//   - 通用：画面永远不停（两次换行之间也在慢漂）；--hq 渲染；确定性
//   - 独有 1：高亮行固定在画面中线；不是竖直一列，是弧（像转盘），走的时候字沿着弧移动
//   - 独有 1b：蓝点是有高光的小球 + 外发光，不是平的圆点
//   - 独有 2：故意让长句被右沿裁掉（原片就是这样，显得"多到放不下"）
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, mix} from '../../../assets/lib/helpers/polish';

export const TASK_LIST_TICKER_DURATION = 64; // 2026-11-17 第2轮：原片 64 帧起已切到下一镜（输入框 + 图标），用户说结尾那两帧删掉，这一镜只到 63 帧
const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;

// 可替换：items 至少 16 条，7–9 字为宜（原片就是长句被右沿裁掉，显得多到放不下）；accent 蓝点颜色
export const TICKER_INPUTS = {
  items: ['续交今年物业费', '整理全家换季衣柜', '提醒外婆按时吃药', '交这个月水电费', '下午接孩子放学', '预约全家年度体检', '买周末要做的菜', '给车做五千公里保养', '准备妈妈生日礼物', '检查小雨数学作业', '订周六晚上餐厅', '安排周日大扫除', '续借图书馆的书', '带猫去打疫苗', '规划暑假出游路线', '退换网购的衣服', '缴下学期学费', '换客厅坏的灯泡'],
  accent: '#2f6bff',
};

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const STEP0 = 0.05, PER = 0.28, STEPS = 7, MOVE = 0.1; // 2026-11-17：原片 64 帧内只换 7 次（第 8 次在切镜之后），原来写 8 次会在最后几帧多走半步
const LH = 168, FS = 140, LEFT = 944, START = 3; // 一开始高亮第 3 条
const ARC: [number, number][] = [[0, 0], [1, 36], [2, 105], [3, 192], [4, 290], [5, 400]];
const arcX = (ad: number) => { const q = Math.min(4, Math.floor(ad)); const u = ad - q; return mix(ARC[q][1], ARC[q + 1][1], u); };

export const TaskListTicker: React.FC<{inputs?: typeof TICKER_INPUTS}> = ({inputs = TICKER_INPUTS}) => {
  const s = useCurrentFrame() / FPS;
  // 列的位置：已走的行数（整数 + 当前这一步的进度）
  let pos = 0;
  for (let k = 0; k < STEPS; k++) pos += eo(s, STEP0 + k * PER, STEP0 + k * PER + MOVE);
  const creep = s * 0.12; // 两次之间也在慢漂（行 / 秒），抵消在步长里：每步少走一点
  const cur = START + pos;
  const items = inputs.items;
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS, background: '#fbfbfd'}}>
      {items.map((txt, i) => {
        const d = i - cur - creep + Math.floor((s - STEP0) / PER + 1) * PER * 0.12 * (s > STEP0 ? 1 : 0); // 离中线几行（带小数，走动时连续）
        const ad = Math.abs(d);
        if (ad > 4.3) return null;
        // 原片不是一列竖直的字：每行左沿排在一条往右弯的弧上（逐帧量：中线 944 → ±1 行 980 → ±2 行 1049 → ±3 行 1136）
        const x = LEFT + arcX(ad);
        const y = 562 + d * LH;
        const hi = clamp(1 - ad * 1.6); // 0 灰 → 1 黑
        const g = Math.round(mix(206, 20, hi));
        const sc = mix(0.965, 1, hi); // 中间那行略大一点
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, transform: `translateY(-58%) scale(${sc.toFixed(4)})`, transformOrigin: '0 50%', fontSize: FS, fontWeight: 500, lineHeight: 1, whiteSpace: 'nowrap', letterSpacing: '-0.02em', color: `rgb(${g},${Math.round(g * 1.01)},${Math.min(255, g + 12)})`, opacity: clamp(4.3 - ad)}}>{txt}</div>
        );
      })}
      {/* 蓝点：有高光的小球 + 外发光（原片直径约 52px，中心 x=878） */}
      <div style={{position: 'absolute', left: 878 - 26, top: 540 - 26, width: 52, height: 52, borderRadius: 26, background: `radial-gradient(circle at 38% 32%, #9cc4ff 0%, ${inputs.accent} 45%, #1b47d6 100%)`, boxShadow: `0 0 22px ${inputs.accent}aa, 0 0 6px ${inputs.accent}`, opacity: 0.5 + 0.5 * clamp(Math.abs(((pos % 1) + 1) % 1 - 0.5) * 2.4)}} />
    </AbsoluteFill>
  );
};
