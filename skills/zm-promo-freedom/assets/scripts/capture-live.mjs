// capture-live.mjs — 没有源码的产品（别家线上产品、需要登录）用这份采集真实页面三件套
// 与 capture-template.mjs 产出完全相同：全页 2x 截图、元素抠图、layout.json，后续流程不变。
//
// 和 capture-template 的区别：
//   1. 打开一个"有界面"的浏览器窗口，使用独立的浏览器资料目录（PROFILE_DIR）；
//      第一次运行时由【用户本人】在窗口里登录，登录状态会保存在该目录，下次不用再登。
//      AI 绝不替用户输入账号密码、不绕过验证码。
//   2. 终端里按回车后才开始采集——给用户时间登录、把页面准备成想要的状态
//      （例如先跑一次产品功能，让结果页面出现）。
//   3. 线上页面一直有网络请求，导航用 networkidle2 并额外等待。
//   4. 别家产品无法注入假数据：用专门的演示账号、中性的演示内容；
//      页面上残留的个人信息用 REDACT 规则在截图前替换文字或打码。
//
// 用法：
//   npm i puppeteer
//   node capture-live.mjs            # 弹出窗口 → 用户登录并准备页面 → 回到终端按回车 → 自动采集
//
// 采集前检查（materials 清单）：账号额度够用；页面上没有真实个人信息、账号历史、手机号邮箱；
// 演示结果是产品真实生成的，并已另存原图。

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// ======================================================================
// CONFIG — 按目标产品修改
// ======================================================================
const CONFIG = {
  // 产品线上地址（不带结尾斜杠）
  BASE: 'https://example-ai-product.com',

  // 登录状态保存在这里（本项目目录下，不要提交到 git，不要分享）
  PROFILE_DIR: './.capture-profile',

  OUT_DIR: '../../public/textures/live',
  LAYOUT_JSON: '../../src/live-layout.json',

  VIEWPORT: { width: 1920, height: 1080, deviceScaleFactor: 2 },
  SETTLE_MS: 1500, // 线上页面多等一会儿

  // 截图前在每个页面执行的打码 / 替换（可选）
  // text：把匹配元素的文字换成中性内容；blur：直接模糊
  REDACT: [
    // { selector: '.user-name', text: '演示用户' },
    // { selector: '.avatar img', blur: 12 },
  ],

  // 路由清单：写法与 capture-template.mjs 相同（boxes / cutouts / hideForEmptyPlate / interact）
  PAGES: [
    {
      name: 'home',
      path: '/',
      boxes: [],
      cutouts: [
        // { name: 'input', selector: 'textarea', parent: true, omitBackground: true },
      ],
    },
    // 需要停在"结果已经生成"的状态时：path 写 null，脚本不跳转，直接截当前窗口里的页面
    // { name: 'result', path: null, cutouts: [] },
  ],
};
// ======================================================================
// 以下为通用采集逻辑，一般无需修改
// ======================================================================

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, CONFIG.OUT_DIR);
const layoutPath = path.resolve(here, CONFIG.LAYOUT_JSON);
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.dirname(layoutPath), { recursive: true });

const browser = await puppeteer.launch({
  headless: false,
  userDataDir: path.resolve(here, CONFIG.PROFILE_DIR),
  defaultViewport: null,
  args: [`--window-size=${CONFIG.VIEWPORT.width},${CONFIG.VIEWPORT.height + 120}`],
});
const page = (await browser.pages())[0] ?? (await browser.newPage());
await page.goto(CONFIG.BASE, { waitUntil: 'networkidle2' }).catch(() => {});
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
await new Promise((r) => rl.question('\n请在弹出的浏览器窗口里【自己】登录，并把页面准备好（需要的结果已生成）。\n准备好后回到这里按回车开始采集……', () => { rl.close(); r(); }));
await page.setViewport(CONFIG.VIEWPORT);

// 等字体加载完再静置片刻——避免截到 FOUT/骨架屏
const settle = async () => {
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, CONFIG.SETTLE_MS));
};

// 元素 bbox 换算到整页坐标系（fullPage 截图的坐标系）
const pageBox = (el) =>
  el.evaluate((e) => {
    const r = e.getBoundingClientRect();
    return { x: r.x + window.scrollX, y: r.y + window.scrollY, w: r.width, h: r.height };
  });

const layout = { pageW: CONFIG.VIEWPORT.width };

for (const pg of CONFIG.PAGES) {
  if (pg.path !== null && pg.path !== undefined) {
    await page.goto(`${CONFIG.BASE}${pg.path}`, { waitUntil: 'networkidle2' });
  }
  await settle();
  // 打码 / 替换个人信息
  await page.evaluate((rules) => {
    for (const r of rules) {
      document.querySelectorAll(r.selector).forEach((el) => {
        if (r.text !== undefined) el.textContent = r.text;
        if (r.blur) el.style.filter = `blur(${r.blur}px)`;
      });
    }
  }, CONFIG.REDACT);
  if (pg.waitMs) await new Promise((r) => setTimeout(r, pg.waitMs));

  const entry = { pageH: await page.evaluate(() => document.documentElement.scrollHeight) };
  layout[pg.name] = entry;

  // ---- 1. 全页 2x 截图 ----
  await page.screenshot({ path: `${outDir}/${pg.name}-full.png`, fullPage: true });
  console.log(`captured ${pg.name}-full`, entry.pageH);

  // ---- 2. boxes：只记坐标 ----
  entry.boxes = {};
  for (const b of pg.boxes ?? []) {
    const els = await page.$$(b.selector);
    const picked = b.all ? els.slice(0, b.max ?? els.length) : els.slice(0, 1);
    const boxes = [];
    for (const el of picked) boxes.push(await pageBox(el));
    entry.boxes[b.key] = b.all ? boxes : boxes[0] ?? null;
    console.log(`  boxes.${b.key}:`, boxes.length);
  }

  // ---- 3. cutouts：元素 PNG + bbox ----
  entry.cutouts = [];
  for (const c of pg.cutouts ?? []) {
    let els = await page.$$(c.selector);
    if (c.parent) {
      // 取匹配元素的父容器（如 input 的圆角外壳）
      const parents = [];
      for (const el of els) {
        const h = await el.evaluateHandle((e) => e.parentElement);
        const p = h.asElement();
        if (p) parents.push(p);
      }
      els = parents;
    }
    const picked = c.all ? els.slice(0, c.max ?? els.length) : els.slice(0, 1);
    for (let i = 0; i < picked.length; i++) {
      const file = c.all ? `${c.name}${i + 1}.png` : `${c.name}.png`;
      const bb = await pageBox(picked[i]);
      try {
        await picked[i].screenshot({
          path: `${outDir}/${file}`,
          omitBackground: !!c.omitBackground,
        });
      } catch (e) {
        console.log(`  cutout miss ${file}:`, e.message);
        continue;
      }
      entry.cutouts.push({ file, ...bb });
      console.log(`  captured ${file}`, bb);
    }
    if (picked.length === 0) console.log(`  cutout miss ${c.name} (no match: ${c.selector})`);
  }

  // ---- 4. 页内交互后的补充全页图（可选） ----
  if (pg.interact) {
    const did = await page.evaluate(pg.interact);
    if (did) {
      await new Promise((r) => setTimeout(r, pg.interactWaitMs ?? 800));
      await page.screenshot({ path: `${outDir}/${pg.name}-after.png`, fullPage: true });
      entry.afterPageH = await page.evaluate(() => document.documentElement.scrollHeight);
      console.log(`captured ${pg.name}-after`);
    }
  }

  // ---- 5. 空底板（可选）：隐藏元素后再截一张，供飞入镜头 ----
  if (pg.hideForEmptyPlate) {
    await page.evaluate((sel) => {
      document.querySelectorAll(sel).forEach((el) => { el.style.visibility = 'hidden'; });
    }, pg.hideForEmptyPlate);
    await page.screenshot({ path: `${outDir}/${pg.name}-empty.png`, fullPage: true });
    console.log(`captured ${pg.name}-empty`);
    // 复原，避免影响同页后续步骤（当前实现里本步骤已是该页最后一步）
    await page.evaluate((sel) => {
      document.querySelectorAll(sel).forEach((el) => { el.style.visibility = ''; });
    }, pg.hideForEmptyPlate);
  }
}

fs.writeFileSync(layoutPath, JSON.stringify(layout, null, 1));
console.log('wrote', layoutPath);
await browser.close();
