---
name: card-tunnel-tagline
一句话: 带厚边的品牌 Logo 卡转正缩小后溶掉，一块渐变色块从左往右把品牌名擦掉、把标语擦出来，热成像色卡片从画外飞上方形隧道四壁、逐张褪回原色，之后整个隧道一直匀速后退
适用: 开场（品牌 → 一句话主张）
时长: 约 6.9s（207f@30fps）
能量: 中（飞入是高点，之后平稳后退）
标签: opening、brand、typography、3d、transition
来源: MultipleOwners · AI 视频产品 Sizzle· 原视频_01 另一版开场 · 只学动作（Logo 卡厚边从中间先断、渐变色块擦字、方筒四壁落卡、热成像逐张褪色、匀速后退不停），逐帧看过；Logo 放我们的产品
样片: demos-own/opening/card-tunnel-tagline/preview.mp4
成熟度: 候选
---

## 动效核心
- Logo 卡第 0 帧就在转正、缩小、下移；卡面溶掉，黄-红-深灰厚边从中间先断、两端最后消失
- 粉-紫-青色块从左往右：品牌名逐字染色再擦掉，同时擦出第一行标语（先浅棕带虚、色块过后变黑），图标挪到居中
- 热成像卡从画外飞进方筒四壁（easeOutQuart，错开 0–8 帧），顶底几乎平躺；先到的先褪回原色；第二行和褪色叠着擦出
- 之后隧道匀速后退、四边冒新卡，中间 25–75% 一直留白给标语

## 怎么换内容
- Logo 卡（现在是"逐梦剪辑" + Mark）、两行标语；场景卡共用 data/card-orbit-counter/sceneCards.tsx

## 已知坑
- 开头 0.8s 没有原片热闹（原片有像素马在跑）；厚边是渐变假做的，不是真立体
- 热成像色比原片淡

## 参考实现
demos-own/opening/card-tunnel-tagline/CardTunnelTagline.tsx
