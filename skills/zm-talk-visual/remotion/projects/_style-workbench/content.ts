// 这条片子的内容。换片子只改这个文件，素材放进 remotion/public/<DIR>/。
// 现在填的是一条假的示例（"用 Cursor 写一个小程序"，12 秒，没有人物视频、没有配乐），用来确认外壳换了内容还是操作台的样子。
// 真片子：
//   SUBS   字幕 [[开始秒, 结束秒, 文字], …]，用 scripts/align_script.py 对出来的 subs.json：import SUBS_J from './subs.json'
//   WAVE   时间线上的真波形，每秒 30 个 0–1 的数：python3 make_wave.py <初剪.mp4> wave.json，再 import
//   MUSIC  有背景音乐时的频谱和重拍（见 references/bgm.md）；不放背景音乐就写 null，顶栏显示"配乐 · 停"
export const DIR = 'style-demo';                 // public 里的文件夹
export const FILE = '用Cursor写一个小程序.mp4';    // 顶栏上的文件名
export const VIDEO: string | null = null;        // 口播初剪，比如 'src.mp4'；null 时监视器里放灰色占位
export const BG_VIDEO: string | null = null;     // 背后那层虚化的画面，一般就用初剪（可以先转一个小的 bg_blur.mp4）
export const THUMBS: string | null = null;      // 时间线"口播"轨上每 2 秒一张缩略图的前缀，比如 'th/p'（p001.jpg 起）。做法：ffmpeg -i src.mp4 -vf fps=0.5,scale=-1:84 th/p%03d.jpg（时间线会读到第 ceil(片长/2)+1 张，ffmpeg 有时少出一张，缺了就复制最后一张补上，否则渲染报 404）
export const TL_LEN = 12;                        // 全片秒数（时间线 zoom=1 时铺满）
export const STATUS = 'AI 剪辑中';               // 顶栏文件名后面的状态字，按这条片子的内容改（比如"正在调色"）

export const SUBS: [number, number, string][] = [
  [0.3, 2.2, '今天用 Cursor 写一个小程序'],
  [2.4, 4.6, '我只说了一句话'],
  [4.8, 7.0, '它自己挑了三个模板'],
  [7.2, 9.4, '我选了中间这个'],
  [9.6, 11.8, '五分钟就跑起来了'],
];
// 每章一个颜色；第 0 章是开头，不出章节卡
export const CHAPTERS: {at: number; n: string; title: string; col: string}[] = [
  {at: 0, n: '00', title: '开头', col: '#4c8dff'},
  {at: 4.8, n: '01', title: '让它挑模板', col: '#9b7bff'},
  {at: 9.6, n: '02', title: '跑起来', col: '#3ecf8e'},
];
// 字幕里要点亮的词
export const KEYS: string[] = ['Cursor', '一句话', '三个模板', '五分钟'];

const fake = (n: number, seed: number) => Array.from({length: n}, (_, i) => { const t = i / 30, on = SUBS.some(([a, b]) => t >= a && t < b); return on ? 0.35 + 0.5 * Math.abs(Math.sin(i * 0.37 + seed) * Math.sin(i * 0.11)) : 0.02; });
export const WAVE: Record<string, number[]> = {voice: fake(TL_LEN * 30, 1)};
export const MUSIC: {bands: number[][]; downbeats: number[]; songs: [number, number, string][]} | null = null;
