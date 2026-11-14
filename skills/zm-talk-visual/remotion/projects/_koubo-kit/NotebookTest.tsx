// Notebook.tsx 三样零件的样片（约 10 秒）：章节开场 → 人缩到左下角、录屏卡进来、画圈 → 走到终点。灰块代表人物，录屏用灰色网格代替。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {LK, R_MINI, R_WIN, SANS, cardShadow, mk} from './Kit';
import {ChapterOpen, HRing, RecCard, RouteMap, Stop} from './Notebook';
export const NBTEST_FRAMES = 300;
const STOPS: Stop[] = [{u: 0.2, n: '01', s: '第一站'}, {u: 0.5, n: '02', s: '第二站'}, {u: 0.78, n: '03', s: '第三站'}];
const Person: React.FC<{r: number[]}> = ({r}) => <div style={{position: 'absolute', left: r[0], top: r[1], width: r[2], height: r[3], borderRadius: 28, background: '#ddd6ca', boxShadow: cardShadow(20, 0.5), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 800, color: '#9c9a98'}}>人物</div>;
export const NotebookTest: React.FC = () => {
  const c = mk(0, useCurrentFrame());
  const m = c.R(3.6, 15), mini = R_WIN.map((v, i) => v + (R_MINI[i] - v) * m) as number[];
  const back = c.R(7.6, 15), walk = Math.min(1, Math.max(0, (c.t - 7.9) / 1.0));
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 60% at 50% 45%, #ffffff 0%, #f3efe8 78%)', fontFamily: SANS}}>
      <Person r={c.t < 7.6 ? mini : R_MINI.map((v, i) => v + (R_WIN[i] - v) * back)} />
      <ChapterOpen c={c} at={0.2} out={3.4} i={1} stops={STOPS} goal="终点" title="第二章 " hi="换成你的" done={[1, 0, 0]} />
      <RecCard c={c} t0={0} src="" clips={[]} zoom={[[0, 960, 540, 1], [5.6, 1200, 400, 1.6]]} at={3.7} out={7.4}>
        {Array.from({length: 48}, (_, i) => <div key={i} style={{position: 'absolute', left: 60 + (i % 8) * 230, top: 60 + Math.floor(i / 8) * 160, width: 200, height: 120, borderRadius: 14, background: i === 13 ? '#fff' : '#d6dce6'}} />)}
        <HRing c={c} at={4.5} out={7.2} r={[1210, 210, 200, 120]} label="说到的地方" />
      </RecCard>
      {c.t > 7.6 && <div style={{position: 'absolute', left: 1130, top: 168, width: 740, height: 660, opacity: back}}>
        <div style={{position: 'absolute', left: 0, top: 80, width: 740, height: 660, transform: 'scale(0.92)', transformOrigin: '50% 40%'}}>
          <RouteMap stops={STOPS} goal="终点" tokenU={0.78 + 0.22 * walk} done={[1, 1, walk > 0.1 ? 1 : 0]} glow={0.78 + 0.22 * walk} flagHit={c.R(9.1, 12)} />
        </div>
      </div>}
      <div style={{position: 'absolute', left: 56, top: 86, padding: '10px 24px', borderRadius: 999, background: '#fffdf9', boxShadow: cardShadow(10, 0.5), fontSize: 32, fontWeight: 800, color: LK.ink}}>Notebook.tsx · {c.t < 3.5 ? 'ChapterOpen 章节开场' : c.t < 7.5 ? "RecCard + HRing（人物 'mini'）" : 'RouteMap 走到终点'}</div>
    </AbsoluteFill>
  );
};
