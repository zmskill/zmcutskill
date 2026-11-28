// 素材库里的中文艺术字体（2026-11-23 入库，全部 SIL OFL 1.1 可免费商用，清单见 public/library/README.md「fonts/」一节）。
// 用法：组件里先 useLibFonts(['smiley', 'brush'])，再在样式里写 fontFamily: LIB.smiley 。
// 为什么要有：031（Paper 字体工具宣传片）的内核是「字体本身就是设计」——花体、超窄长体、超粗黑、毛笔、手写混排；
//   以前我们只有思源黑体一种字，排出来没有设计感（2026-11-23 用户："现在的审美不行，要学习内核"）。
import {useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

export const LIB_FONT_FILES = {
  smiley: ['LibSmiley', 'library/fonts/smiley-sans-oblique.ttf'],       // 得意黑：窄长、自带斜，最像西文 condensed grotesk
  huangyou: ['LibHuangYou', 'library/fonts/zcool-qingke-huangyou.ttf'], // 站酷庆科黄油体：方块超粗，像 black / ultra
  kuaile: ['LibKuaiLe', 'library/fonts/zcool-kuaile.ttf'],             // 站酷快乐体：圆润俏皮
  xiaowei: ['LibXiaoWei', 'library/fonts/zcool-xiaowei.ttf'],          // 站酷小薇：细衬线、粗细对比强，像 Didone
  brush: ['LibBrush', 'library/fonts/ma-shan-zheng.ttf'],              // 马善政毛笔楷书
  xing: ['LibXing', 'library/fonts/zhi-mang-xing.ttf'],                // 志莽行书：行书，带飞白
  cao: ['LibCao', 'library/fonts/liu-jian-mao-cao.ttf'],               // 刘建毛草：草书，最像西文花体 swash
  hand: ['LibHand', 'library/fonts/long-cang.ttf'],                    // 龙藏体：手写
  wenkai: ['LibWenKai', 'library/fonts/lxgw-wenkai-bold.ttf'],         // 霞鹜文楷 粗
  serif: ['LibSerif', 'library/fonts/noto-serif-sc-vf.ttf'],           // 思源宋体可变字重 200–900
} as const;
export type LibFontKey = keyof typeof LIB_FONT_FILES;
export const LIB: Record<LibFontKey, string> = Object.fromEntries(Object.entries(LIB_FONT_FILES).map(([k, [fam]]) => [k, `"${fam}","Noto Sans CJK SC",sans-serif`])) as Record<LibFontKey, string>;

const loading: Partial<Record<LibFontKey, Promise<void>>> = {};
const loadOne = (k: LibFontKey) => {
  if (!loading[k]) {
    const [fam, file] = LIB_FONT_FILES[k];
    const face = new FontFace(fam, `url(${staticFile(file)})`, k === 'serif' ? {weight: '200 900'} : {});
    loading[k] = face.load().then((f) => { (document.fonts as FontFaceSet & {add: (x: FontFace) => void}).add(f); });
  }
  return loading[k] as Promise<void>;
};
export const useLibFonts = (keys: LibFontKey[]) => {
  useState(() => {
    const h = delayRender('lib fonts ' + keys.join(','));
    Promise.all(keys.map(loadOne)).then(() => continueRender(h)).catch((e) => { console.error(e); continueRender(h); });
    return 0;
  });
};
