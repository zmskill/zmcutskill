// capture-template.mjs — 有源码的产品（用户自己的产品）用这份采集真实页面"三件套"：
//   1. 每个页面一张全页截图（2 倍，贴进 3D 斜面不糊）           → <页面名>-full.png
//   2. 单个元素的抠图（可透明底，做"浮起来的界面块"）           → <名字>.png / <名字>1.png …
//   3. layout.json：每个元素在整页上的位置和大小（动画按真实版式摆） → LAYOUT_JSON
// 没有源码的产品（别家线上产品、要登录）用 capture-live.mjs，产出完全一样。
//
// 用之前：
//   1. 把产品在本地跑起来（BASE 能打开）；
//   2. 先灌好假数据：页面上是"虚构但像真的"内容。空页面、乱码占位截出来没法用，真实客户数据不能出片；
//   3. npm i puppeteer，然后 node capture-template.mjs。
// 只改下面的 CONFIG：PAGES 里一条 = 一个页面；boxes 只记位置，cutouts 记位置并存图。

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CONFIG = {
  BASE: 'http://localhost:3000', // 本地产品地址
  OUT_DIR: '../../public/textures/live', // 截图放哪（相对本脚本；一般是片子 Remotion 工程的 public/textures/live）
  LAYOUT_JSON: '../../src/live-layout.json', // 位置表放哪
  VIEWPORT: { width: 1920, height: 1080, deviceScaleFactor: 2 },
  SETTLE_MS: 600, // 每个页面打开后再等多久（等字体和异步数据）
  PAGES: [
    {
      name: 'home', // 文件名前缀，也是 layout.json 里的键
      path: '/',
      // waitMs: 1500,                                  // 这一页额外再等
      boxes: [{ key: 'sections', selector: 'main h2', all: true }], // all：记所有匹配的，否则只记第一个
      cutouts: [
        { name: 'nav', selector: 'header, [role="banner"]' },
        { name: 'card', selector: 'article', all: true, max: 12 }, // card1.png、card2.png……
        { name: 'float-search', selector: 'input', parent: true, omitBackground: true }, // parent：截它外面那层；omitBackground：透明底
        { name: 'float-filter', selector: 'main button', omitBackground: true },
      ],
      hideForEmptyPlate: 'article', // 把这些元素藏起来再截一张 <name>-empty.png，给"元素飞进来"的镜头当空底板
    },
    {
      name: 'detail',
      path: '/customers/demo-0001', // 详情页写一条假数据的 id
      boxes: [{ key: 'rows', selector: 'table tbody tr, [role="row"]', all: true, max: 8 }],
      cutouts: [],
      // 截完之后在页面里做一下操作（比如点开一个标签页），等 interactWaitMs 再补一张 <name>-after.png
      interact: () => {
        const tab = [...document.querySelectorAll('button, [role="tab"], a')].find((el) => /订单/.test(el.textContent ?? ''));
        if (!tab) return false;
        tab.click();
        return true;
      },
      interactWaitMs: 800,
    },
    {
      name: 'reports',
      path: '/reports/weekly',
      waitMs: 1500,
      boxes: [{ key: 'paras', selector: '.ProseMirror > p', all: true }],
      cutouts: [],
    },
  ],
};

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, CONFIG.OUT_DIR);
const layoutFile = path.resolve(here, CONFIG.LAYOUT_JSON);
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.dirname(layoutFile), { recursive: true });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport(CONFIG.VIEWPORT);

// 元素在整页上的位置（和全页截图同一个坐标）
const boxOf = (el) => el.evaluate((e) => {
  const r = e.getBoundingClientRect();
  return { x: r.x + window.scrollX, y: r.y + window.scrollY, w: r.width, h: r.height };
});
const pick = (list, spec) => (spec.all ? list.slice(0, spec.max ?? list.length) : list.slice(0, 1));
const fullShot = (file) => page.screenshot({ path: path.join(outDir, file), fullPage: true });
const pageHeight = () => page.evaluate(() => document.documentElement.scrollHeight);

const layout = { pageW: CONFIG.VIEWPORT.width };
for (const pg of CONFIG.PAGES) {
  await page.goto(CONFIG.BASE + pg.path, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready); // 字体到了再截，免得截到替代字体或骨架屏
  await wait(CONFIG.SETTLE_MS);
  if (pg.waitMs) await wait(pg.waitMs);

  const rec = { pageH: await pageHeight(), boxes: {}, cutouts: [] };
  layout[pg.name] = rec;
  await fullShot(`${pg.name}-full.png`);
  console.log(`captured ${pg.name}-full`, rec.pageH);

  for (const b of pg.boxes ?? []) {
    const found = [];
    for (const el of pick(await page.$$(b.selector), b)) found.push(await boxOf(el));
    rec.boxes[b.key] = b.all ? found : found[0] ?? null;
    console.log(`  boxes.${b.key}:`, found.length);
  }

  for (const c of pg.cutouts ?? []) {
    let els = await page.$$(c.selector);
    if (c.parent) {
      const outer = [];
      for (const el of els) {
        const p = (await el.evaluateHandle((e) => e.parentElement)).asElement();
        if (p) outer.push(p);
      }
      els = outer;
    }
    const chosen = pick(els, c);
    if (!chosen.length) console.log(`  cutout miss ${c.name} (no match: ${c.selector})`);
    for (let i = 0; i < chosen.length; i++) {
      const file = c.all ? `${c.name}${i + 1}.png` : `${c.name}.png`;
      const box = await boxOf(chosen[i]);
      try {
        await chosen[i].screenshot({ path: path.join(outDir, file), omitBackground: !!c.omitBackground });
      } catch (err) {
        console.log(`  cutout miss ${file}:`, err.message);
        continue;
      }
      rec.cutouts.push({ file, ...box });
      console.log(`  captured ${file}`, box);
    }
  }

  if (pg.interact && (await page.evaluate(pg.interact))) {
    await wait(pg.interactWaitMs ?? 800);
    await fullShot(`${pg.name}-after.png`);
    rec.afterPageH = await pageHeight();
    console.log(`captured ${pg.name}-after`);
  }

  if (pg.hideForEmptyPlate) {
    const setHidden = (sel, v) => document.querySelectorAll(sel).forEach((el) => { el.style.visibility = v; });
    await page.evaluate(setHidden, pg.hideForEmptyPlate, 'hidden');
    await fullShot(`${pg.name}-empty.png`);
    console.log(`captured ${pg.name}-empty`);
    await page.evaluate(setHidden, pg.hideForEmptyPlate, '');
  }
}

fs.writeFileSync(layoutFile, JSON.stringify(layout, null, 1));
console.log('wrote', layoutFile);
await browser.close();
