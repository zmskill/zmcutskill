// 一段的样子：照着改。一段 = 一个文件 = 一个 composition。
// 时间都按"说到哪几个字"写：W('字幕里的几个字') 返回全片秒数；R(at, 帧数) 是从那一刻开始走完的进度。
import React from 'react';
import {Card, Ctx, LK, Pill, Pop, Rise, Shell, Shot, SideR, Stage, mkW} from './Kit';
import {OrbitCounter} from './KouboShots';
import SUBS from './example_subs.json';   // [[开始秒, 结束秒, 文字], …]，由字幕稿对齐出来

export const EX_T0 = 0, EX_FRAMES = 300;   // 这一段从全片第几秒开始、共多少帧；各段首尾相接、帧数加起来等于全片
const W = mkW(SUBS);
const big = (size: number, col = LK.ink): React.CSSProperties => ({fontSize: size, fontWeight: 900, color: col, whiteSpace: 'nowrap', lineHeight: 1.15});

// 人物缩成窗时，右边舞台（740 × 660）里放什么
const stage = (c: Ctx) => (
  <>
    <Stage c={c} at={3.0} out={6.4}>
      <Shot src="demo/shot.png" x={10} y={0} w={330} h={600} p={c.R(3.1, 14)} from={[-50, 0]} />
      <div style={{position: 'absolute', left: 362, top: 20}}><Rise c={c} at={W('第一句')} style={big(48)}>说到这句时出现的字</Rise></div>
      <div style={{position: 'absolute', left: 362, top: 120}}><Pop c={c} at={W('关键词')} hard><Pill text="重点" solid size={34} /></Pop></div>
    </Stage>
    <Stage c={c} at={6.5} out={10}>
      <OrbitCounter c={c} at={6.6} land={W('五千')} to={5000} unit="张图" lead="前前后后调试了" />
    </Stage>
  </>
);
// 人物满屏时，两侧放什么
const over = (c: Ctx) => (
  <SideR c={c} at={0.6} out={2.9} h={260}>
    <div style={{position: 'absolute', left: 30, top: 30, ...big(44)}}>满屏时<br />放在旁边的卡</div>
  </SideR>
);
export const Example: React.FC = () => <Shell video="demo/src.mp4" t0={EX_T0} subs={SUBS} start="full" sw={[[3.0, false]]} labels={[[0, '第 1 章', '章节名']]} stage={stage} over={over} />;
