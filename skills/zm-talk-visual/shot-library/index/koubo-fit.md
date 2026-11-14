# 这句话配哪个镜头：按句子类型查

按镜头排的那张表在本文件后半（《按镜头排的表》）。

**怎么用**：排对照表时，每一句先问"这句话在说哪一类事"，到下表找那一类，把查到的镜头写进对照表的"镜头库"一栏：用了哪个、取哪一段（加粗英文名的是现成的口播版组件；只有卡名的要写"照卡现做：取卡里的哪个动作"，并先读卡，路径见本文末尾）；或者"不用：……查过 xx、xx，为什么不合适"（必须点名查过哪个，人物满屏和只放真素材的行也一样）。排完跑 `python3 scripts/check_mapping_table.py <对照表.md>`，不通过不许开始做画面。

**为什么要这样**：做全片时很容易做到后面就不回来查镜头库，不是没有合适的，是没有回来查。库里的镜头原本是满屏、自己演一整段的，改成口播能用的要花功夫，一赶进度就会绕开它，只用通用卡片，结果后半段很平。所以有了"口播版"：已经改好、放进右边舞台就能用的，在 `remotion/projects/_koubo-kit/KouboShots.tsx`。

| 这句话在说 | 例句 | 镜头 | 口播版 | 取哪一段、怎么放 |
|---|---|---|---|---|
| 很多人在问、很多人在说 | "很多粉丝好奇""评论区都在问" | complaint-wall-pick | **QuestionWall** | 发牌段；人物满屏，卡片在身后 |
| 连着摆几样成绩、证据、案例 | "被电视台报道，还上了杂志" | curved-carousel-reel | **CurvedReel** | 整套外框，卡里放真截图；人物可以是其中一张卡 |
| 一个大数字 | "调试了五千多张""跟五千多人聊过""四百多名学员" | card-orbit-counter | **OrbitCounter** | 数字滚到终值的那一刻对在说出数字的那个词上；人物缩成窗 |
| 从一堆里挑、去搜、怎么选 | "去网上搜教程""挑一个案例""选哪个工具" | search-pick-shortlist | **PickWall** | 卡片交错滑入 → 光标点选 → 其余退成虚影；人物缩成窗 |
| 去问人、发消息、一个个联系 | "硬着头皮去私信博主""我去问了很多人" | invite-wall-to-chat | **DMWall** | 人物墙 → 推近一张按下按钮 → 拉回、一张张标上已发 → 多数没回、一个回了 |
| 不管什么时候 / 在哪，这件事都在；熬到很晚 | "凌晨两点啊""换了一个又一个还是不行" | notification-scene-cuts | **SceneCuts** | 中间钉一张卡，背后的场景硬切；只在舞台那一块里，不盖人物 |
| 结尾金句、对比的两句话 | "想，全是问题；做，都是答案" | benefit-lines-to-logo | **TwoLines** | 第一句逐词出、退到上面变小，第二句从下面出、关键词主色；每个词对在说出它的时刻 |
| 建议收藏、建议看完 | "这条视频我建议你看完" | bookmark-tap-check | **BookmarkTap** | 整段，很短 |
| 先……再……最后……；三连动作 | "下载安装，再到介绍功能，最后高级玩法" | task-card-three-verbs | 还没有 | 三个动词一个个亮；现在是用 Kit 的卡片现搭的 |
| 我只说了一句，它就做出来了；演示 AI 出结果 | "丢给 AI 翻译""让 AI 帮你做" | prompt-to-site-wall、agent-browse-match | 还没有 | 输入 + 出结果那一段 |
| 三连痛点再给解法 | "每天……太多，每天……太难" | pain-swirl-dot-logo | 还没有 | 三连痛点那一半 |
| 章节标题、隆重介绍 | "下一步就是上手""第二条路" | headline-input-to-page、prompt-pages-pill-reveal | 还没有 | 大字滑过那一段；现在章节开场用的是 Kit 的 PitOpen（地图推近）或一张路牌卡 |
| 数据好看、后台是这样的 | "数据是真的非常好看" | tilted-dashboard-pan-logo | 还没有 | 面板那一半 |
| 把很多东西变成一句话 | "把这些都变成……" | card-tunnel-tagline | 还没有 | 整段 |
| 以量取胜的提问（暗场） | "你每天被多少……追着跑" | message-ribbon-flow | 试跑过 | 全片只能有一段暗场，亮色片子里慎用 |

"还没有"口播版的，用到时现改，改完加进 KouboShots.tsx 并在这张表里登记。

**没有镜头可配的句子**也很多（讲道理的、过渡的），那就人物满屏、或用 Kit 的卡片配真素材，对照表里写"不用：人物满屏。查过 xx、xx，这句是……"。不是每句都要硬塞镜头；但每句都要查过。

---

## 按镜头排的表

库里的 20 个镜头和 4 个镜头组，是看着样片（每个 20–30 帧的联系表）和卡片填的。

用法：排对照表时先来这里找。找到后去读那张卡的"动效核心""参数表""已知坑"，动作和参数照卡片来，只换内容和这条片子的样子。

口播和宣传片不一样的地方：这些镜头原本是满屏的、自己演一整段的；口播里一句话只有 1–3 秒，所以多数时候只取其中一段，并且要决定人物这时候在哪（满屏、缩成一张卡、还是缩成窗）。

## 库里的镜头

| 镜头 | 它在演什么 | 适合口播里的什么句子 | 取哪一段 |
|---|---|---|---|
| complaint-wall-pick | 一墙评论卡发上斜墙 → 挑出几条 → 展开证据 → 收成清单 | "很多人问我 / 很多人说 / 评论区都在……"；"我看了几千条，挑出最……的三条" | 发牌段单独可用；挑选和收清单要 5 秒以上 |
| curved-carousel-reel | 一排卡片贴着弯曲的墙从右往左滑，中间平、两边拉高拖虚 | 连着摆几样东西：几项成绩、几个证据、几个工具、几个案例 | 外框整套可用，卡里放什么都行；人物可以是其中一张卡 |
| card-orbit-counter | 大数字每帧在跳，几十张卡绕着数字转，最后收进一个文件夹 | 一个大数字："做了几千张图""跟五千多人聊过""废了几十个账号" | 数字滚动 + 环绕；小卡片里放不下环绕，只用了数字滚动 |
| bookmark-tap-check | 点一下书签，打勾，一圈光晕 | "建议收藏 / 建议看完 / 记下来" | 整段（很短） |
| message-ribbon-flow | 一句提问 → 上百张消息卡像丝带一样流过 → 白光 | "你每天被多少……追着跑"这种以量取胜的提问；暗色，全片只能有一段暗场 | 提问 + 丝带；白光留给转场 |
| ribbon-podium-intro | 消息丝带 → 白光 → 展台上亮出主角和一句介绍 | "今天给大家介绍……""这就是……" | 展台那一半 |
| benefit-lines-to-logo | 两句话先后出现又离开，最后落成名字和一句话 | 结尾金句："想，全是问题；做，都是答案" | 整段 |
| pain-swirl-dot-logo（也是镜头组） | 三句痛点换着出，周围小卡片漂着 → "交给 XX" → 变成圆点 → 标志 | "每天……太多。每天……难写。"这种三连痛点，再给出解法 | 三连痛点那一半 |
| task-card-three-verbs | 一句标题 + 一张任务卡；三个动词一个个换着亮，卡片跟着演 | "先……再……最后……"三步；"排一排、改一改、勾一下"这种三连动作 | 三动词那一半 |
| invite-wall-to-chat | 一墙人物卡 → 推近一张 → 写一条消息发出去 → "已发出 25 条" | "我去私信了很多博主""我一个个去问" | 人物墙 + 推近 + 写消息 |
| search-pick-shortlist | 输入一句话 → 一墙候选 → 光标挑出几个 → 展开比较 → 收成名单 | "怎么选工具 / 怎么选方向""从一堆里挑出三个" | 挑选 + 收名单 |
| agent-browse-match | 输入任务 → AI 自己翻网页 → 挑出几家 → 逐条说为什么适合 | "不懂的就问 AI""让 AI 帮你找" | 输入 + 浏览 |
| prompt-to-site-wall | 输入一句话 → 生成一个网页 → 一墙作品 → 提交 | "我只说了一句话，它就做出来了"；演示 AI 出结果 | 输入 + 出结果 |
| prompt-pages-pill-reveal | 打字 → 页面铺开 → "一次全部看完"胶囊 → "隆重介绍" | "下一步就是上手""隆重介绍" | 打字段、"隆重介绍"大字段 |
| headline-input-to-page | 大字横着滑过 → 输入框 → 弹出产品页 | 章节标题 + 马上给东西 | 大字滑过那一段 |
| card-tunnel-tagline | 名字牌 → 两行标语，四周照片卡往镜头飞 | "把……都变成……"；作品很多、要一句话概括时 | 整段 |
| notification-scene-cuts | 同一条通知，背景连换五六个场景 | "不管你在哪 / 不管什么时候"；"凌晨两点啊" | 整段（短） |
| orb-relay-explainer | 暗场蓝色，一个光球接力讲完整个产品故事（40 秒） | 长段讲解；暗色，亮色的片子里要用得整段换样子 | 取其中的"资料库 / 助手"小段 |
| tilted-dashboard-pan-logo | 斜着的数据面板慢慢移过 → 标志 | "数据是真的好看""后台是这样的" | 面板那一半 |
| trail-dot-captions | 暗场，一条虚线上一个点在走，字幕一词一词出 | "一路走过来""一步一步" ；暗色 | 轨迹 + 字幕 |
| sticker-sphere-picker | 暗场，一个贴纸球，挑出几个 | 从很多里挑；暗色、内容小，口播里不太好用 | — |

镜头组（4 个）：card-rain-pixel-word（卡片下雨堆满 → 像素块变成大字）、itinerary-scroll-bookmark（长页面滚动 → 书签）、pain-swirl-dot-logo、tag-decode-ring-wave（标签乱码解开 → 排成环 → 声波）。它们各是 6–15 秒的一整段演出，口播里要找一段 6 秒以上、说的是同一件事的话才放得下。

## 库里还缺的

口播里常见、库里没有现成的：

- 人物两侧的侧卡（一张截图斜着滑进来）。
- 人物从满屏缩成窗、再放回来。
- "我的 / 你的"两列对照（一列实的，一列空的）。
- 一张笔记卡：真标题 + 章节名。
- 三行清单，说到哪行出哪行，最后一起打勾。
- 章节数字大卡 + 几张还没翻开的问号卡。

其中侧卡、人物缩放已经是 `_koubo-kit/Kit.tsx` 的零件（`SideL / SideR`、`Shell`）；其余的用到时现做，用户看过觉得好的，再拆成镜头卡入库。

## 镜头卡和代码在哪

名字就是对照表"镜头库"一栏要写的名字。用一个镜头前，读它的卡（动效核心、参数表、已知坑）；口播版（表里加粗的英文名）在 `remotion/projects/_koubo-kit/KouboShots.tsx`。

| 镜头 | 卡片 | 代码 |
|---|---|---|
| tilted-dashboard-pan-logo | `shot-library/own/cards/camera/tilted-dashboard-pan-logo.md` | `shot-library/demos-own/camera/tilted-dashboard-pan-logo/` |
| card-orbit-counter | `shot-library/own/cards/data/card-orbit-counter.md` | `shot-library/demos-own/data/card-orbit-counter/` |
| trail-dot-captions | `shot-library/own/cards/data/trail-dot-captions.md` | `shot-library/demos-own/data/trail-dot-captions/` |
| bookmark-tap-check | `shot-library/own/cards/interaction/bookmark-tap-check.md` | — |
| card-tunnel-tagline | `shot-library/own/cards/opening/card-tunnel-tagline.md` | `shot-library/demos-own/opening/card-tunnel-tagline/` |
| headline-input-to-page | `shot-library/own/cards/opening/headline-input-to-page.md` | `shot-library/demos-own/opening/headline-input-to-page/` |
| message-ribbon-flow | `shot-library/own/cards/opening/message-ribbon-flow.md` | `shot-library/demos-own/opening/message-ribbon-flow/` |
| notification-scene-cuts | `shot-library/own/cards/opening/notification-scene-cuts.md` | `shot-library/demos-own/opening/notification-scene-cuts/` |
| orb-relay-explainer | `shot-library/own/cards/opening/orb-relay-explainer.md` | `shot-library/demos-own/opening/orb-relay-explainer/` |
| pain-swirl-dot-logo | `shot-library/own/cards/opening/pain-swirl-dot-logo.md` | `shot-library/demos-own/opening/pain-swirl-dot-logo/` |
| prompt-pages-pill-reveal | `shot-library/own/cards/opening/prompt-pages-pill-reveal.md` | `shot-library/demos-own/opening/prompt-pages-pill-reveal/` |
| ribbon-podium-intro | `shot-library/own/cards/opening/ribbon-podium-intro.md` | `shot-library/demos-own/opening/ribbon-podium-intro/` |
| benefit-lines-to-logo | `shot-library/own/cards/outro/benefit-lines-to-logo.md` | `shot-library/demos-own/outro/benefit-lines-to-logo/` |
| curved-carousel-reel | `shot-library/own/cards/transition/curved-carousel-reel.md` | `shot-library/demos-own/transition/curved-carousel-reel/` |
| agent-browse-match | `shot-library/own/cards/ui-entrance/agent-browse-match.md` | `shot-library/demos-own/ui-entrance/agent-browse-match/` |
| complaint-wall-pick | `shot-library/own/cards/ui-entrance/complaint-wall-pick.md` | `shot-library/demos-own/ui-entrance/complaint-wall-pick/` |
| invite-wall-to-chat | `shot-library/own/cards/ui-entrance/invite-wall-to-chat.md` | `shot-library/demos-own/ui-entrance/invite-wall-to-chat/` |
| prompt-to-site-wall | `shot-library/own/cards/ui-entrance/prompt-to-site-wall.md` | `shot-library/demos-own/ui-entrance/prompt-to-site-wall/` |
| search-pick-shortlist | `shot-library/own/cards/ui-entrance/search-pick-shortlist.md` | `shot-library/demos-own/ui-entrance/search-pick-shortlist/` |
| sticker-sphere-picker | `shot-library/own/cards/ui-entrance/sticker-sphere-picker.md` | `shot-library/demos-own/ui-entrance/sticker-sphere-picker/` |
| task-card-three-verbs | `shot-library/own/cards/ui-entrance/task-card-three-verbs.md` | `shot-library/demos-own/ui-entrance/task-card-three-verbs/` |
| card-rain-pixel-word | `shot-library/own/groups/card-rain-pixel-word.md` | `shot-library/demos-own/groups/card-rain-pixel-word/` |
| itinerary-scroll-bookmark | `shot-library/own/groups/itinerary-scroll-bookmark.md` | `shot-library/demos-own/groups/itinerary-scroll-bookmark/` |
| pain-swirl-dot-logo | `shot-library/own/groups/pain-swirl-dot-logo.md` | `shot-library/demos-own/opening/pain-swirl-dot-logo/` |
| tag-decode-ring-wave | `shot-library/own/groups/tag-decode-ring-wave.md` | `shot-library/demos-own/groups/tag-decode-ring-wave/` |
