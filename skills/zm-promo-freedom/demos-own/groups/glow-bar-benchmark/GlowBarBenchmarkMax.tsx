// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {GBB_DEFAULT_INPUTS, GLOW_BAR_BENCHMARK_CONTRACT, GbbInputs, GlowBarBenchmarkGroup, gbbFrames, planGbb} from './GlowBarBenchmark';

const R = GBB_DEFAULT_INPUTS.rows;
export const GBB_MAX_INPUTS: GbbInputs = {
  title: '浏览智能体能力评测榜', sub: '在线网页任务 · 300 项 · 含不可能完成的任务',
  rows: [
    {...R[0], name: 'Nimbo 2', note: '智能体专业'},
    {...R[1], name: 'Orbit Pro', note: '浏览助手'},
    {...R[2], name: 'Kestrel 2', note: '| 电脑操作'},
    {...R[3], name: 'Fennel', note: 'Pro 推理版'},
    {...R[4], name: 'Wavely', note: 'AI 浏览器'},
  ],
};
const C = GLOW_BAR_BENCHMARK_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planGbb(FULL);
export const GLOW_BAR_BENCHMARK_MAX_DURATION = gbbFrames(EXTRAS);
export const GlowBarBenchmarkMax: React.FC = () => <GlowBarBenchmarkGroup inputs={GBB_MAX_INPUTS} extras={EXTRAS} />;
