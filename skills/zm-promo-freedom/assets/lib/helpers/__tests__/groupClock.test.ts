import { describe, expect, it } from 'vitest';
import { GroupContract, checkContract, checkInputs, landmarkAt, outputDuration, planExtras, sfxCues, toOutput, toSource } from '../groupClock';

const C: GroupContract = {
  sourceDuration: 6, fps: 30,
  motion: [[0, 1.8], [2.6, 3.4]],
  holds: [{ at: 3.4, maxExtra: 2 }, { at: 2.0, maxExtra: 3 }],
  landmarks: { title: 0.4, cards: 1.6, result: 3.2, end: 5.0 },
  sfx: [{ at: 'cards', type: '落版重击', tail: 0.4 }, { at: 'end', offset: -0.1, type: '运镜' }],
  inputs: { title: { maxChars: 12 }, items: { count: 3, maxChars: 8 } },
};

describe('groupClock', () => {
  it('合同本身通过检查；停留点落进动作区会报出来', () => {
    expect(checkContract(C)).toEqual([]);
    expect(checkContract({ ...C, holds: [{ at: 1.0, maxExtra: 1 }] }).length).toBe(1);
  });
  it('音效类别不在表里会报出来（类别表见 references/sfx-kinds.md）', () => {
    const bad = { ...C, sfx: [{ at: 'cards', type: 'impact' }] } as unknown as GroupContract;
    expect(checkContract(bad)).toEqual(['音效类别不在表里：impact（见 references/sfx-kinds.md）']);
  });
  it('不延长时输出 = 源', () => {
    expect(toSource(2.5, C, [0, 0])).toBeCloseTo(2.5);
    expect(outputDuration(C, [0, 0])).toBe(6);
  });
  it('停留期间源时钟停住，动作区保持原速', () => {
    const ex = [1, 0.5]; // 2.0s 停 1s，3.4s 停 0.5s
    expect(toSource(1.0, C, ex)).toBeCloseTo(1.0);
    expect(toSource(2.5, C, ex)).toBeCloseTo(2.0);
    expect(toSource(3.0, C, ex)).toBeCloseTo(2.0);
    expect(toSource(3.6, C, ex)).toBeCloseTo(2.6); // 动作区 2.6–3.4 从输出 3.6 开始
    expect(toSource(4.4, C, ex) - toSource(3.6, C, ex)).toBeCloseTo(0.8); // 原速
    expect(toSource(5.0, C, ex)).toBeCloseTo(3.5);
    expect(outputDuration(C, ex)).toBeCloseTo(7.5);
  });
  it('落点和音效跟着动作移动', () => {
    const ex = [1, 0.5];
    expect(landmarkAt('cards', C, ex)).toBeCloseTo(1.6);
    expect(landmarkAt('result', C, ex)).toBeCloseTo(4.2);
    expect(toOutput(5.0, C, ex)).toBeCloseTo(6.5);
    const cues = sfxCues(C, ex);
    expect(cues[0].t).toBeCloseTo(1.6);
    expect(cues[1].t).toBeCloseTo(6.4);
  });
  it('planExtras 按上限比例分配；太短或太长都报错', () => {
    const ex = planExtras(C, 8.5);
    expect(ex[0] + ex[1]).toBeCloseTo(2.5);
    expect(ex[0]).toBeCloseTo(1.5); // 上限 3 : 2
    expect(() => planExtras(C, 5)).toThrow(/换更短的组/);
    expect(() => planExtras(C, 12)).toThrow(/拆段或换组/);
  });
  it('planExtras 结果是整帧，总长不变', () => {
    const ex = planExtras(C, 7.77); // 需要 1.77s = 53.1 帧 → 53 帧，按 3:2 分
    ex.forEach((e) => expect(Math.abs(e * 30 - Math.round(e * 30))).toBeLessThan(1e-9));
    expect(Math.round((ex[0] + ex[1]) * 30)).toBe(53);
  });
  it('超上限的 extras 直接拒绝', () => {
    expect(() => toSource(1, C, [4, 0])).toThrow(/超过上限/);
  });
  it('checkInputs：数量不对、超字数都报出来', () => {
    expect(checkInputs(C, { title: '一句话说清卖点', items: ['快', '准', '省'] })).toEqual([]);
    const bad = checkInputs(C, { title: '这是一个明显超过十二个字的标题文案', items: ['快', '准'] });
    expect(bad.length).toBe(2);
  });
});
