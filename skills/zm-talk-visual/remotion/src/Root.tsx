import React from 'react';
import {Composition} from 'remotion';
// ── 口播成片（见 references/koubo-full-film.md）──
// 共用零件的样片和例子：kshots、nbtest、workbench-demo、desk1、desk2、resume-demo 不需要任何素材，先渲染 kshots 确认环境是好的；
// example 是一段的写法示例，要先在 public/demo/ 放 src.mp4 和 shot.png 才能渲染
import {KShotsTest, KSHOTS_FRAMES} from '../projects/_koubo-kit/KShotsTest';
import {NotebookTest, NBTEST_FRAMES} from '../projects/_koubo-kit/NotebookTest';   // 笔记本风格的录屏卡、手画圈、章节路线图
import {Example, EX_FRAMES} from '../projects/_koubo-kit/Example';
import {WorkbenchDemo, DEMO_FRAMES as ED_FRAMES} from '../projects/_style-workbench/Demo';   // 操作台风格的最小示例
import {DESK_SEGMENTS} from '../projects/_style-desk/Film';   // 书桌风格（竖屏）：现在是不需要素材的假示例 desk1、desk2；换成真片子只改 _style-desk/content.ts
import {Example as ResumeDemo, EX_FRAMES as RD_FRAMES} from '../projects/_style-resume/Example';   // 简历风格（竖屏）：23 秒假示例，人用灰色人形占位；换成真片子照 _style-resume/README.md
// 新片子：把自己的各段 import 进来，在下面照样加一行 K(...)

// 画幅默认横屏 1920×1080；竖屏写 K('id', 组件, 帧数, 1080, 1920)。注意 _koubo-kit 的布局是按横屏写的，竖屏要先改 Kit（见 koubo-full-film.md 第 1.5 步）
const K = (id: string, component: React.FC, n: number, width = 1920, height = 1080) => <Composition key={id} id={id} component={component} durationInFrames={n} fps={30} width={width} height={height} />;

export const Root: React.FC = () => (
  <>
    {K('kshots', KShotsTest, KSHOTS_FRAMES)}
    {K('nbtest', NotebookTest, NBTEST_FRAMES)}
    {K('example', Example, EX_FRAMES)}
    {K('workbench-demo', WorkbenchDemo, ED_FRAMES)}
    {DESK_SEGMENTS.map((s) => K(s.id, s.component, s.frames, 1080, 1920))}
    {K('resume-demo', ResumeDemo, RD_FRAMES, 1080, 1920)}
  </>
);
