// 操作台的最小示例：用 content.ts 里的假内容跑 12 秒。用来确认两件事：
// 1. 换了内容，还是操作台的样子；2. 镜头库的镜头（这里是 PickWall 一墙里挑）放进监视器，会读操作台的值，变成深色卡片。
import React from 'react';
import {DESK, DeskShell, MON, Rect, Timeline} from './Desk';
import {CodePanel, D, Panel, RIGHT, W, big, on, S} from './Parts';
import {PickWall} from '../_koubo-kit/KouboShots';

export const DEMO_FRAMES = 12 * 30;
const T = {jy: W('一句话'), mb: W('三个模板'), xz: W('中间这个'), pq: W('跑起来')};
const CAM: [number, Rect][] = [[0, DESK], [T.mb - 0.4, MON], [T.pq - 0.3, DESK]];

export const WorkbenchDemo: React.FC = () => (
  <DeskShell t0={0} subs={S} cam={CAM} deskIn={0.2}
    monAt={() => MON} pip={(c) => c.R(T.mb - 0.3, 14) * (1 - c.R(T.pq, 14))}
    monInner={(c) => c.t >= T.mb - 0.3 && c.t < T.pq + 0.4 ? (
      <div style={{position: 'absolute', inset: 0, background: D.bg}}>
        <PickWall c={c} at={T.mb - 0.2} pickAt={[T.xz + 0.2]} picks={[4]} recedeAt={T.pq - 0.4} rows={2} cols={4}
          item={(i, picked) => <div style={{position: 'absolute', inset: 12, ...big(26, picked ? '#fff' : D.dim), display: 'flex', alignItems: 'flex-end'}}>模板 {i + 1}</div>} />
      </div>) : null}
    left={(c) => <CodePanel c={c} title="我说的那一句" file="prompt.md" at={T.jy} lines={[['帮我写一个记账小程序', D.text], ['先给我三个模板挑', D.dim]]} />}
    right={(c) => <Panel r={RIGHT} title="检查器" glow={on(c, T.pq, 12)}><div style={{position: 'absolute', left: 16, top: 16, ...big(28)}}>运行</div>{c.t >= T.pq && <div style={{position: 'absolute', left: 16, top: 64, ...big(30, D.green)}}>✓ 5 分钟跑起来</div>}</Panel>}
    tl={(c) => <Timeline c={c} zoom={0} subs={S} v2={[]} checks={{}} hl={{}} born={0.4} a2name="配乐" a2={[]} />}
  />
);
