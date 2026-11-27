// 书桌风格的内容文件：换一条片子，只改这个文件（和 subs.json / subs_chars.json、public 里的素材）。
// 现在填的是一条假的示例（"开手账小店的第一个月"，24 秒）：没有口播视频（手机里是灰色人形占位），截图是下面 fakeChat 用代码画的假聊天，
// 不用放任何素材就能渲染（desk1、desk2），用来看这套样子长什么样、每种场怎么写。
// 真片子：
//   1. configure 的 video 写口播初剪在 public 里的路径（比如 'myfilm/src.mp4'），subs.json / subs_chars.json 换成 scripts/align_script.py 出的
//   2. 截图放进 public/<片子名>/img/，src 写 I('xxx.png')，iw / ih 写原图像素；pops 的 box 按原图像素量（放大加网格读，不目测）
//   3. 删掉 fakeChat 和下面的假截图
// 写法：时间一律用 w('字幕里的几个字') 取说到那几个字的秒数，再 ± 一点；坐标是竖屏 1080×1920 的像素。
import {configure, w} from './Kit';
import type {Segment} from './Scenes';
import SUBS from './subs.json';
import CHARS from './subs_chars.json';

configure({
  video: '',                                       // 口播初剪（public 里的路径）；空着就放占位
  subs: SUBS as [number, number, string][], chars: CHARS as number[][],
  extraText: '0123456789¥.“”—',                    // 画面上用到、字幕里没有的字（让字体先加载好）
});
// const I = (n: string) => `myfilm/img/${n}`;     // 真片子的素材目录
const RED = '#d9502e';

// ── 假截图：一张 1080×1920 的聊天界面，返回图和每个气泡在原图上的像素框（真片子不用这个）──
type Box = [number, number, number, number];
const fakeChat = (title: string, msgs: [('l' | 'r'), string][]) => {
  const iw = 1080, ih = 1920, boxes: Box[] = [], bubbles: Box[] = [];
  let y = 260, body = '';
  for (const [side, text] of msgs) {
    const tw = Math.min(700, 40 + [...text].length * 46), h = 110, x = side === 'l' ? 150 : iw - 150 - tw;
    const av = side === 'l' ? 40 : iw - 130;
    body += `<rect x="${av}" y="${y}" width="90" height="90" rx="14" fill="${side === 'l' ? '#c9b8a8' : '#9fb3c8'}"/>`;
    body += `<rect x="${x}" y="${y}" width="${tw}" height="${h}" rx="18" fill="${side === 'l' ? '#ffffff' : '#a9e88b'}"/>`;
    body += `<text x="${x + 22}" y="${y + 70}" font-size="46" font-family="Noto Sans CJK SC, PingFang SC, sans-serif" fill="#1d1d1d">${text}</text>`;
    boxes.push(side === 'l' ? [20, y - 20, x + tw + 20, y + h + 20] : [x - 20, y - 20, iw - 20, y + h + 20]);   // 连头像一起拿起来的那块
    bubbles.push([x, y, x + tw, y + h]);
    y += h + 70;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${iw}" height="${ih}"><rect width="100%" height="100%" fill="#ededed"/>` +
    `<rect width="100%" height="170" fill="#f7f7f7"/><text x="540" y="115" text-anchor="middle" font-size="48" font-family="Noto Sans CJK SC, PingFang SC, sans-serif" fill="#111">${title}</text>${body}</svg>`;
  return {img: {src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg), iw, ih}, boxes, bubbles};
};
// 红笔圈住一个气泡：中心 + 宽高，按原图像素
const around = (b: Box, at: number) => ({x: (b[0] + b[2]) / 2, y: (b[1] + b[3]) / 2, w: (b[2] - b[0]) + 40, h: (b[3] - b[1]) + 30, at});
const C1 = fakeChat('小鹿', [['l', '你好，这个手账本还有吗'], ['r', '有的，今天就能发'], ['l', '那我要两本！'], ['l', '能顺便帮我包装一下吗']]);
const C2 = fakeChat('阿晴', [['l', '看到你的视频来的'], ['l', '能不能便宜点呀'], ['r', '可以，给你算十五'], ['l', '好耶，马上拍']]);
const C3 = fakeChat('木木', [['l', '收到啦，好好看'], ['l', '下次还来你家买'], ['r', '谢谢喜欢～']]);
const C4 = fakeChat('一一', [['l', '回得好快'], ['l', '比别家快多了'], ['r', '一直在线的～']]);

// ── 段 1（0–12.4 秒）：开场 → 一张聊天 → 一组聊天落桌 → 拿起"便宜点" → 价签 ──
const t1 = {shouzhang: w('手账'), di1: w('第一天'), jilu: w('聊天记录'), pianyi: w('便宜'), n25: w('二十五'), n15: w('了十五') + 0.1};
const SEG1: Segment = {
  id: 'desk1', from: 0, to: 12.4,
  person: [[0, 'B'], [t1.shouzhang - 0.25, 'L'], [t1.di1 - 0.25, 'hideL'], [t1.n25 - 0.3, 'showL']], drift: {k: 0.025, dur: 1.8, until: t1.shouzhang},
  items: [
    {type: 'headline', at: t1.shouzhang - 0.05, out: t1.di1 - 0.3, x: 560, y: 720, text: '手账小店', size: 100},
    {type: 'small', at: t1.shouzhang + 0.2, out: t1.di1 - 0.3, x: 572, y: 860, text: '上个月开的'},
    // 一张证据：手机截图换上来，说到"要两本"把那条拿起来
    {type: 'shot', kind: 'phone', ...C1.img, x: 540, y: 880, w: 640, rot: 1, in: t1.di1 - 0.2, out: t1.jilu - 0.3,
      pops: [{box: C1.boxes[2], at: t1.di1 + 0.9, to: [540, 1180], k: 1.6, out: t1.jilu - 0.45}]},
    // 一组截图落在桌上
    {type: 'fan', out: t1.pianyi - 0.3, cards: [
      {...C2.img, x: 300, y: 1000, w: 380, rot: -8, at: t1.jilu - 0.1},
      {...C3.img, x: 540, y: 960, w: 380, rot: 2, at: t1.jilu + 0.15},
      {...C4.img, x: 780, y: 1010, w: 380, rot: 9, at: t1.jilu + 0.4},
    ]},
    {type: 'headline', at: t1.jilu, out: t1.pianyi - 0.3, x: 300, y: 330, text: '聊天记录', size: 120},
    // 冲印出来的一张，拿起"能不能便宜点"，红笔圈
    {type: 'shot', kind: 'print', ...C2.img, x: 540, y: 900, w: 600, rot: -1.5, in: t1.pianyi - 0.25, out: t1.n25 - 0.3,
      pops: [{box: C2.boxes[1], at: t1.pianyi, to: [540, 1250], k: 1.7, out: t1.n25 - 0.4, ring: around(C2.bubbles[1], t1.pianyi + 0.4)}]},
    // 价签：25 划掉、15 落下来
    {type: 'tag', at: t1.n25 - 0.1, out: 12.3, x: 790, y: 650, price: '25', label: '原价', crossAt: t1.n15 - 0.1},
    {type: 'tag', at: t1.n15, out: 12.3, x: 800, y: 1060, price: '15', label: '现在', big: true, red: true},
  ],
};

// ── 段 2（12.4–24.2 秒）：想法云 → 换词 → 人拉近 + 大数字 → 五步闭环 → 十个格子 ──
const t2 = {houlai: w('后来'), jiage: w('价格'), kuai: w('回得快'), meitian: w('每天'), n20: w('二十单'), xuqiu: w('需求'), huoyuan: w('货源'), huifu: w('回复'), haoping: w('好评'), huitou: w('回头客'), shici: w('十次')};
const SEG2: Segment = {
  id: 'desk2', from: 12.4, to: 24.2,
  person: [[12.4, 'L'], [t2.meitian - 0.15, 'F'], [t2.xuqiu - 0.4, 'hideL']],
  items: [
    {type: 'thought', x: 520, y: 520, w: 460, lines: [{text: '是价格？', at: t2.houlai + 0.2}], dots: [470, 860], dotsAt: t2.houlai, out: t2.kuai - 0.4},
    {type: 'headline', at: t2.kuai - 0.05, out: t2.meitian - 0.55, x: 600, y: 700, text: '回得快', size: 130, col: RED},
    {type: 'chip', at: t2.kuai + 0.3, out: t2.meitian - 0.55, text: '才是重点', x: 620, y: 880, bg: '#fbe7a6', rot: -3},
    // 人拉近到几乎满屏，数字用 Fraunces 斜体
    {type: 'headline', at: t2.n20 - 0.05, out: t2.xuqiu - 0.4, x: 130, y: 1180, text: '20', size: 240, col: RED, num: true},   // 人几乎满屏时字放在身上、不压脸
    {type: 'note', at: t2.n20 + 0.2, out: t2.xuqiu - 0.4, x: 440, y: 1290, text: '单 / 每天', size: 64},
    // 五个节点连成一个圈
    {type: 'loop', at: t2.xuqiu - 0.2, out: t2.shici - 0.3, closeAt: t2.huitou + 0.6,
      nodes: [{at: t2.xuqiu, label: '需求'}, {at: t2.huoyuan, label: '货源'}, {at: t2.huifu, label: '回复'}, {at: t2.haoping, label: '好评'}, {at: t2.huitou, label: '回头客'}]},
    {type: 'grid', at: t2.shici - 0.2, crossAt: t2.shici + 0.2, winAt: 23.2, win: '成功'},
  ],
};

export const SEGMENTS: Segment[] = [SEG1, SEG2];
