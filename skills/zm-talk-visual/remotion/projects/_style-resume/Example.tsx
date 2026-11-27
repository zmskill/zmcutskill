// 简历风格的示例：23 秒，不需要任何素材（人用灰色人形占位，内容是虚构的）。
// 换成自己的片子：照这个文件的写法，一段一个文件（几十秒一段），段里先写这几秒人在哪、表上写什么，再写高点现做的东西。
import React from 'react';
import {Shell, W, P, Ctx, EASE, c01} from './Kit';
import {FX, PAST, FormFrame, HeadFill, Page, RowTable, tagPos, Connect, Note, Thought, Stamp, Col, Row} from './Base';

export const EX_FRAMES = 690;
const T0 = 0;

const COLS: Col[] = [{title: '阶段', w: 190}, {title: '做了什么', w: 400}, {title: '练出来的本事', w: 370}];

export const Example: React.FC = () => {
  const reveal = W('每天') - 0.1, toFull = W('所以') - 0.15, back = W('可能是') - 0.1;
  const rows: Row[] = [
    {cells: [['兼职', W('每天')], ['摇奶茶 收银', W('摇奶茶')]]},
    {cells: [['顺手', W('顺手')], ['管排班', W('排班')]], tags: [['排班', W('排班') + 0.3]]},
    {cells: [['后来', W('后来')], ['对接外卖平台', W('对接')]], tags: [['对接平台', W('外卖平台') + 0.4]]},
  ];
  const hit = W('全都用上');
  return (
    <Shell t0={T0} keys={[[0, 'full'], [reveal, 'photo'], [toFull, 'full'], [back, 'photo']]}
      under={(c) => (
        <>
          <FormFrame c={c} at={reveal + 0.1} />
          <div style={{position: 'absolute', left: 640, top: 210, fontFamily: P.sans, fontWeight: 700, fontSize: 24, color: P.grey2, opacity: c.R(reveal + 0.4, 10, EASE.out)}}>示例 · 内容均为虚构</div>
          <HeadFill c={c} cells={[
            {text: '小林', at: reveal + 0.45},
            {text: '多干的活亏不亏？', at: reveal + 0.6, col: P.orange},
            [{label: '还在打工', show: reveal + 0.7, tick: reveal + 1.1}, {label: '有点迷茫', show: reveal + 0.8, tick: reveal + 1.3}],
            {text: '开了自己的小店', at: W('现在回头')},
          ]} />
          <Page c={c}>
            <RowTable c={c} title="工作经历" sub="奶茶店" cols={COLS} rows={rows} hl={[[1, W('额外'), W('现在回头')], [2, W('额外'), W('现在回头')]]} glow={c.R(hit, 10, EASE.out)} />
          </Page>
          <div style={{position: 'absolute', inset: 0, zIndex: 20}}>
          {/* ★ 高点：两枚本事拉线连到表头"现在"那一格，再盖一枚"全用上了" */}
          <Connect c={c} at={W('这些本事')} to={[FX.lab + 250, FX.rows[3] + 70]}
            from={[1, 2].map((ri) => { const [x, y] = tagPos(COLS, ri, 0); return [FX.L + x + 10, FX.head + y + 20] as [number, number]; })} out={toFull - 0.1} />
          {c.t > hit && <div style={{position: 'absolute', left: FX.lab + 6, top: FX.rows[3] + 8, width: FX.photoL - FX.lab - 12, height: FX.rows[4] - FX.rows[3] - 16, border: `6px solid ${P.orange}`, borderRadius: 10, opacity: c.R(hit, 8, EASE.out)}} />}
          <Stamp c={c} at={hit + 0.2} x={FX.lab + 330} y={FX.rows[3] + 26} text="全用上了" size={40} rot={-8} />
          {/* 收尾：在下半张上盖一枚大章 */}
          <Stamp c={c} at={W("攒本事")} x={540} y={1450} text="攒下来了" size={130} rot={-12} />
          </div>
        </>
      )}
      over={(c: Ctx) => (
        <>
          <Note c={c} at={0.2} out={reveal - 0.1} x={90} y={1230} w={520} lines={[['兼职 · 奶茶店', 0.4]]} />
          <Thought c={c} at={W('当时觉得') - 0.1} out={W('现在回头') - 0.1} x={380} y={1420} w={560} text="这都是额外的活" />
          <Note c={c} at={W('所以') - 0.05} out={back - 0.05} x={90} y={1200} w={640} lines={[['多干的活', W('多干')], ['不一定是吃亏', W('不一定'), P.orange]]} />
        </>
      )} />
  );
};
