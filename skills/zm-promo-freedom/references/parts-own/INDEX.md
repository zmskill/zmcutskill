# 小零件总表（自动生成，别手改）

一个零件 = 一个动作，1–6 秒。共 238 个，来自 120 个镜头：长的按动作切开，短的整个就是一个零件。动画还是原镜头的，只是可以单独取用。
选的时候按"用途"找，看样片图（12 格抽帧）确认，再读零件卡。一条片子里同一种动作只当一次主角。

## 痛点（16 个）

| 零件 | 做什么 | 秒 | 样片图 |
|---|---|---|---|
| text-wall-rows-swap | 满屏一行行大字墙 · 中间一行换词：输入框收掉，切到满屏一行行横着滚的大字墙，中间一行的词换一次 | 2.0 | `demos-own/parts/text-wall-rows-swap/preview-sheet.jpg` |
| word-whip-chatbox-type | 一个词往左一甩 · 黑色对话框滑进来打字：一个词居中，往左一甩，黑色对话框滑进来，逐词打出一句话 | 2.2 | `demos-own/parts/word-whip-chatbox-type/preview-sheet.jpg` |
| icons-toss-into-trash | 图标被抛起 · 翻着掉进垃圾桶：硬切：图标被抛起、翻着掉进升上来的垃圾桶，上面一行行亮出字 | 2.2 | `demos-own/parts/icons-toss-into-trash/preview-sheet.jpg` |
| list-side-question-you | 名单推到一边 · 「那你呢？」：名单推到左边变暗，右边出一句斜体的反问 | 2.5 | `demos-own/parts/list-side-question-you/preview-sheet.jpg` |
| dock-drag-into-trash | 程序坞升起 · 把图标连对话一起拖进垃圾桶：整块往上让，下面升起程序坞；光标把图标拖出来，对话框缩成细条、那串回复像尾巴一样跟着甩过去，一起被吸进垃圾桶 | 2.8 | `demos-own/parts/dock-drag-into-trash/preview-sheet.jpg` |
| refusals-stack-up | 问一句 · 拒绝回复一条条越堆越高：字退掉，框收成输入栏；用户问一句，左边一条条冒出拒绝回复，越堆越高 | 2.9 | `demos-own/parts/refusals-stack-up/preview-sheet.jpg` |
| complaint-wall-cursors-pick | 吐槽墙整排滑入 · 三个光标各挑一条：评论卡整排左右交错滑进来铺满斜墙，三个带名字的彩色光标各挑中一条吐槽 | 3.3 | `demos-own/parts/complaint-wall-cursors-pick/preview-sheet.jpg` |
| icon-tiles-whip-line-cards | 图标砖散开 · 一甩 · 白线画到下一张卡：黑红底，红色图标砖和通知卡散开，镜头一甩，跟着一条弯曲白线从一张卡画到下一张卡 | 3.4 | `demos-own/parts/icon-tiles-whip-line-cards/preview-sheet.jpg` |
| searchbar-punch-type-icons | 搜索栏被点中 · 两下猛推打字 · 图标滑进来：搜索栏被光标点中，镜头分两下猛推，打出一句话；图标一个个滑进栏里，镜头一下一下往右摇 | 3.5 | `demos-own/parts/searchbar-punch-type-icons/preview-sheet.jpg` |
| pain-lines-retype-cards | 痛点句重打三次 · 小卡围过来：浅色柔光底上痛点句逐词出现，八张琐碎小卡从四周滑进来各自漂；整行重打三次，旧句变灰上飘、新句逐词升上来 | 3.8 | `demos-own/parts/pain-lines-retype-cards/preview-sheet.jpg` |
| scatter-cards-lost-teams | 像素块闪掉上一句 · 词冒出 · 卡片散在四周：上一句被一片红 / 粉 / 灰的大方块像素闪掉 → 中间一个词一个词冒出「迷失在团队之间」， | 3.8 | `demos-own/parts/scatter-cards-lost-teams/preview-sheet.jpg` |
| ai-chat-ask-list | AI 聊天框提问 · 出一串推荐名单：聊天框里打出一个问题，AI 一条条回答出推荐名单，名单里没有你 | 4.5 | `demos-own/parts/ai-chat-ask-list/preview-sheet.jpg` |
| message-ribbon-flow | 通知卡飞过 · 落到飘带上一直流：问句先出，一大片通知卡从镜头前飞过、落到一条弯曲的 3D 飘带上一直流动，最后中间亮起光点、整屏失焦过曝转场 | 5.0 | `demos-own/parts/message-ribbon-flow/preview-sheet.jpg` |
| red-bubbles-roll-big-lines | 红气泡交错弹出 · 像滚轮一样滚 · 大字压上：一串红色聊天气泡左右交错地一个个弹出来、带着未读数，整串像滚轮一样连续往上滚，大字一句句压在上面 | 5.1 | `demos-own/parts/red-bubbles-roll-big-lines/preview-sheet.jpg` |
| complaints-to-top3 | 挑中的展开 · 收成"最痛的 3 条"：没挑中的退成虚影，挑中的三条展开成证据卡，再缩成小条落进清单、扫光填字 | 5.8 | `demos-own/parts/complaints-to-top3/preview-sheet.jpg` |
| ring-window-questions | 圆环像窗一样打开 · 露出一团问题气泡：黑底里一道蓝光画出圆环，圆环侧过来张开光锥，露出一团贴着球面在转的问题气泡；随后圆环甩回来把问题收走，转一圈缩没 | 5.8 | `demos-own/parts/ring-window-questions/preview-sheet.jpg` |

## 钩子（21 个）

| 零件 | 做什么 | 秒 | 样片图 |
|---|---|---|---|
| phone-rush-toss | 手机冲到镜头前 · 抛起落下：斜着的小手机 3 帧内冲到镜头前转正，取景框收紧套住它，到最高点后越落越快掉出画面 | 1.0 | `demos-own/parts/phone-rush-toss/preview-sheet.jpg` |
| giant-word-whip-cut | 超大字越甩越快 · 硬切成一行小字：超大白字一半埋在蓝光里，往左越甩越快，硬切成一行小字，最后一个词擦出 | 1.6 | `demos-own/parts/giant-word-whip-cut/preview-sheet.jpg` |
| pixel-cursors-gather-caret | 像素小光标聚到中间变成输入光标：浅灰底，几个带名字标签的像素小光标从四处聚到中间，合成一根输入光标 | 1.9 | `demos-own/parts/pixel-cursors-gather-caret/preview-sheet.jpg` |
| filter-words-profile-roll | 左边换筛选词 · 右边资料卡滚：左边筛选词原地换三次，右边资料卡慢滚、猛跳下一张，蓝色选中底刷过 | 2.2 | `demos-own/parts/filter-words-profile-roll/preview-sheet.jpg` |
| type-lines-converge | 斜面上打一句话 · 四条彩色虚线汇过来：一行字在斜放的平面上被打出来，四条彩色虚线从画面外画进来，汇到句末的那个圈 | 2.2 | `demos-own/parts/type-lines-converge/preview-sheet.jpg` |
| big-type-zoomout-insert-icons | 大字打出 · 猛拉远 · 句子中间插进一排图标：大字逐字打出，猛拉远成一行小字，句子中间撑开、插进一排 AI 图标 | 2.4 | `demos-own/parts/big-type-zoomout-insert-icons/preview-sheet.jpg` |
| orb-toggle-pop | 句中开关 · 句尾光球弹出：一句话中间嵌一个开关，句尾弹出一颗光球（过冲再回落），3D 光标过来点亮开关 | 2.7 | `demos-own/parts/orb-toggle-pop/preview-sheet.jpg` |
| type-swap-headline | 大字打出一个问题 · 原地改写成回答：白底上一行大黑字打出来，镜头推近、平移，前半句掉下去淡掉，只留后半个词，再换成两个词「早就安排 / 好了。」，四周散开几颗彩色小点 | 2.9 | `demos-own/parts/type-swap-headline/preview-sheet.jpg` |
| tags-decode-orbit | 两个标签框乱码解码 · 相机绕着转：黑底，巨大的渐变框里是乱码；相机后拉、一帧跳机位、快速环绕两个框，两个词都解码完，最后绕竖轴加速甩 | 2.9 | `demos-own/parts/tags-decode-orbit/preview-sheet.jpg` |
| portrait-circles-squeeze-word | 人像圆长出蓝圆挤成沙漏 · 收成一个词：米白底，圆形人像照片上长出两个蓝色大圆、挤成沙漏，合成一个带字的蓝圆、左右挤出一排椭圆，椭圆收掉只剩一个词，再缩成黑圆、出标志和名字 | 2.9 | `demos-own/parts/portrait-circles-squeeze-word/preview-sheet.jpg` |
| giant-word-lens-ovals | 超大字滑过线描透镜 · 两边挤出椭圆：超大字横着滑过，中间一个线描圆像透镜（圆里看不到字）、两边挤出椭圆，圆里出一句小字 | 3.0 | `demos-own/parts/giant-word-lens-ovals/preview-sheet.jpg` |
| notification-scene-cuts | 通知卡钉在正中 · 背后场景硬切：一张毛玻璃通知卡钉在正中，背后的大场景长短不一地硬切；卡先弹出字再打，光标从下方滑上来点一下，一个液态玻璃泡鼓起扫过卡面 | 3.2 | `demos-own/parts/notification-scene-cuts/preview-sheet.jpg` |
| giant-word-scroll-intro | 超宽大字甩进来刹住 · 再甩走：黑底暗红光斑，一行比屏幕还宽的超大白字从右边甩进来、刹住慢慢漂、再甩出去 → | 3.2 | `demos-own/parts/giant-word-scroll-intro/preview-sheet.jpg` |
| quote-new-search-push | 金句 · 新搜索框冲上来再打一句：硬切白底，金句逐词上浮；新搜索框从下冲上来，打第二句同时慢推，冲近发送键按下，玻璃高光 | 3.8 | `demos-own/parts/quote-new-search-push/preview-sheet.jpg` |
| planet-glow-title-cut | 星球上沿亮起沉下去 · 标题逐词由糊变清：暗底下一颗星球的上沿亮起来、越来越白越来越大地沉下去，标题逐词由糊变清（最后一个词先蓝后白）→ | 3.9 | `demos-own/parts/planet-glow-title-cut/preview-sheet.jpg` |
| logo-card-dissolve-tunnel | Logo 卡转正溶掉 · 色块擦出标语 · 卡片飞进隧道：带厚边的 Logo 卡转正缩小后溶掉，渐变色块从左往右把品牌名擦掉、把标语擦出来；热成像色卡片从画外飞上方形隧道四壁、逐张褪回原色 | 4.0 | `demos-own/parts/logo-card-dissolve-tunnel/preview-sheet.jpg` |
| search-type-click-customers | 搜索框打字点搜索 · 「你的客户正在搜」：暗底荧光绿，搜索框逐字打字、点搜索，结果列表滑出来，一句话点明客户正在搜 | 4.0 | `demos-own/parts/search-type-click-customers/preview-sheet.jpg` |
| code-flythrough-pill-type-name | 穿过漂浮的代码 · 输入条打字 · 拉远出产品名：镜头穿过漂浮的绿色代码关键词和霓虹四角星（有景深），中间浮出深色玻璃输入条逐字打一句提问，拉远出产品名 | 4.1 | `demos-own/parts/code-flythrough-pill-type-name/preview-sheet.jpg` |
| trash-to-dock-button-swarm | 桶长成程序坞 · 点一下变按钮 · 按钮满屏飞：桶外长出底板、撑开成程序坞，新图标一个个弹进来；一点，坞变成一个按钮，按钮复制成一摞满屏乱飞，再一下子收走 | 4.2 | `demos-own/parts/trash-to-dock-button-swarm/preview-sheet.jpg` |
| words-float-photo-cloud | 词高低错落浮上来 · 照片云：粉白渐变底，一句话的词高低错落、带着糊从下面浮上来（两行接力）→ 一张糊掉的白卡从镜头前擦过 → | 4.5 | `demos-own/parts/words-float-photo-cloud/preview-sheet.jpg` |
| dot-burst-sphere | 大圆缩成点 · 点阵迎面炸开聚成球：黑底一个大圆（灰→白）越缩越小成一个点，背景浮出点阵 → 点"炸开"迎面飞来、聚成右边一颗转动的点阵球， | 4.8 | `demos-own/parts/dot-burst-sphere/preview-sheet.jpg` |

## 输入（10 个）

| 零件 | 做什么 | 秒 | 样片图 |
|---|---|---|---|
| input-closeup-send-drop | 输入框特写 · 打字 · 横冲点发送：硬切输入框特写，光标指上、转身、打字，横冲向发送键停 0.25 秒按下，输入框从光标下面掉走 | 1.9 | `demos-own/parts/input-closeup-send-drop/preview-sheet.jpg` |
| icons-orbit-input-type | 图标绕着输入框转 · 框里打字：切到一个白色输入框，AI 图标绕着它转，框里逐字打一句话 | 2.1 | `demos-own/parts/icons-orbit-input-type/preview-sheet.jpg` |
| input-grow-type-chase | 输入框长大 · 追着打字：输入框虚着从中间长大，4 帧推到特写，逐字越打越快、镜头追着字走，最新几个字是浅色尾巴 | 2.2 | `demos-own/parts/input-grow-type-chase/preview-sheet.jpg` |
| dock-rise-click-ai-type | 程序坞升起 · 点中 AI 图标 · 输入条打字：硬切白底：文件夹散在四周、底下程序坞升上来，光标点中一个 AI 图标，上方撑开输入条逐字打一句话 | 2.3 | `demos-own/parts/dock-rise-click-ai-type/preview-sheet.jpg` |
| defocus-cut-searchbar-type | 失焦硬切到搜索框 · 打字点发送：整屏失焦轻缩，硬切到白底搜索框（一出来就是虚的），字一块块蹦出，光标转身横移到发送键按下 | 2.5 | `demos-own/parts/defocus-cut-searchbar-type/preview-sheet.jpg` |
| input-glow-type-send | 推近输入框 · 发光打字 · 点发送：推近输入框逐字打一句话（新字先紫色发虚再变清楚，框上沿一道紫橙光），镜头跟到发送键，点下去 | 3.2 | `demos-own/parts/input-glow-type-send/preview-sheet.jpg` |
| big-type-zoomout-send | 大字拉远成输入框 · 点发送被吸进去：一句需求从 4.5 倍大字开始打，拉远成输入框，字流式冒出变实；发送钮点亮，手形光标按下，输入框往中心吸进去 | 4.3 | `demos-own/parts/big-type-zoomout-send/preview-sheet.jpg` |
| idea-card-role-pills | 想法卡升起 · 输入框弹出打一句话再缩回：白→粉渐变底，一张「新想法」卡从下面升上来，输入框弹出来（比卡还宽）逐字打一句话、再缩回卡里 → | 4.3 | `demos-own/parts/idea-card-role-pills/preview-sheet.jpg` |
| circle-to-button-ask-rings | 圆缩成按钮 · 输入框打问题 · 点发送起涟漪：蓝圆缩成一个小按钮，旁边撑开输入框逐字打一个问题，点发送，按钮外面一圈圈涟漪，然后蓝圆又长大 | 4.6 | `demos-own/parts/circle-to-button-ask-rings/preview-sheet.jpg` |
| star-pill-answer-cards | 四角星长出输入胶囊 · 打一句提问 · 出答案卡：一颗发光的蓝色四角星 → 外面长出一个圆、往左挪 → 右边撑开一条输入胶囊、逐字打一句提问 → | 4.7 | `demos-own/parts/star-pill-answer-cards/preview-sheet.jpg` |

## 点击确认（8 个）

| 零件 | 做什么 | 秒 | 样片图 |
|---|---|---|---|
| send-tone-dropdown | 全部发送 · 下拉选语气：按"全部发送"出光泡变"已发送"；语气下拉从卡后面滑出，选项一帧一项，指针弧线飞过去点选出蓝勾 | 1.3 | `demos-own/parts/send-tone-dropdown/preview-sheet.jpg` |
| pullback-cursor-click | 拉回 · 鼠标冲过来点发送：镜头慢起步拉回全景，带拖影的鼠标 3 帧冲到发送键，点下去冒一团光，停一拍 | 1.5 | `demos-own/parts/pullback-cursor-click/preview-sheet.jpg` |
| triple-click-insert | 连点三下插入：小手悬停放大，连点三下，每下"按下 → 猛弹 → 回位"，输入框里瞬间多一个 | 1.5 | `demos-own/parts/triple-click-insert/preview-sheet.jpg` |
| button-press-rings | 按钮扫进来摆正 · 按下光环荡开：一个超近、斜着、离焦的淡紫按钮扫进来，镜头拉远摆正；按下一帧变深蓝，外面一圈圈光环荡开，缩一点、发光，松开变浅 | 1.8 | `demos-own/parts/button-press-rings/preview-sheet.jpg` |
| big-card-liquid-invite | 大卡信息逐行变实 · 点"邀请"出光泡：硬切到干净大卡，信息逐行由浅灰模糊变深；慢推，点"邀请"，液态光泡擦出"已邀请" | 2.2 | `demos-own/parts/big-card-liquid-invite/preview-sheet.jpg` |
| bookmark-tap-check | 按钮点下 · 光环 · 白勾写出：特写里一个白色圆按钮上的描边书签被点下：按钮一缩、书签变实心渐变，光环外扩加整屏淡紫柔光一闪，按钮放大，渐变慢慢流动，白勾写出，柔光轻轻呼吸 | 2.3 | `demos-own/parts/bookmark-tap-check/preview-sheet.jpg` |
| clock-check-card | 照片缩成时钟 · 一晃变对勾 · 卡片甩走：鼓起的照片缩成一个圆，圆原地变成行程卡片里的时钟；镜头贴着它斜着、转着往后拉，露出整张卡片；时钟一晃变成绿对勾，卡片带动态模糊往上甩走 | 2.4 | `demos-own/parts/clock-check-card/preview-sheet.jpg` |
| generate-button-press-dot-wave | 「生成」按钮特写按下 · 点阵波纹：切到「生成」按钮的特写，按下去，背景点阵一圈圈波纹荡开 | 2.9 | `demos-own/parts/generate-button-press-dot-wave/preview-sheet.jpg` |

## 结果登场（23 个）

| 零件 | 做什么 | 秒 | 样片图 |
|---|---|---|---|
| form-card-build | 空卡片里表单一样样长出来：白卡片在正中长大，按钮从小圆点撑开，表单内容一样样由虚到实填进去；卡片一直慢慢往后仰（上窄下宽），四周是一排排别的表单卡片（点阵按钮 + 淡字） | 1.4 | `demos-own/parts/form-card-build/preview-sheet.jpg` |
| app-home-rise-focus-input | App 首页一层层升起 · 只留输入框：黑底，App 首页一层层升起，其余淡掉只留输入框 | 1.8 | `demos-own/parts/app-home-rise-focus-input/preview-sheet.jpg` |
| pill-type-click-card-open | 胶囊长出 · 大字两行打 · 点一下撑成项目卡：白胶囊从小长出，大字两行叠着从下浮上来；光标飞过去按下、水波圈，项目卡从胶囊处撑开，停住看卡 | 1.9 | `demos-own/parts/pill-type-click-card-open/preview-sheet.jpg` |
| orb-to-button-card | 光球变按钮再变卡片：玻璃球从底部升起，投影光晕、冲击光环，变成圆角方块再变按钮，冷却成卡片、长出输入框打字 | 2.0 | `demos-own/parts/orb-to-button-card/preview-sheet.jpg` |
| send-rings-result-card | 发送键圆环扩散 · 出成品卡：发送键缩成一个亮点，圆环一圈圈扩散，胶囊撑开变成成品卡，停住 | 2.1 | `demos-own/parts/send-rings-result-card/preview-sheet.jpg` |
| page-rise-big-word-swap | 整页升起 · 后面冒出大字 · 字和表一起换：蓝底上一整页任务表升起，页面后面冒出巨大白字；大字一换，表格内容也换一批 | 2.2 | `demos-own/parts/page-rise-big-word-swap/preview-sheet.jpg` |
| word-shrink-card-slam | 大字越缩越快 · 白卡片砸下来 · 界面显出：大字先冲上来再越缩越快，一张白卡片砸下来、四边拉出参考线；一句话逐词出，卡片里从左上显出界面（先蓝后清） | 2.3 | `demos-own/parts/word-shrink-card-slam/preview-sheet.jpg` |
| cards-to-shortlist-table | 卡缩成小条落进名单：卡的字段从下往上收、缩成小条竖叠，一条条落进表格 → 浅蓝骨架条 → 扫光填字 → 绿勾 | 2.4 | `demos-own/parts/cards-to-shortlist-table/preview-sheet.jpg` |
| cards-fly-into-app | 三张卡飘进应用界面落位：硬切到聊天应用（先虚后实），三张卡成一串斜着飘进来、放平、散开、各自落位，扫光骨架变成真实消息 | 2.5 | `demos-own/parts/cards-fly-into-app/preview-sheet.jpg` |
| toolbar-cover-zoomout-page | 巨大工具栏盖进来 · 点一下 · 猛拉远原来是网页：巨大的工具栏从左边滑进来盖住字，光标点"评论"；镜头 0.2 秒从 4.5 倍拉到 1 倍，工具栏原来是网页下沿的工具条，评论栏从右边滑进来 | 2.6 | `demos-own/parts/toolbar-cover-zoomout-page/preview-sheet.jpg` |
| words-stagger-browser-reveal | 三个带图标的词错落滑进 · 浏览器显出来："横跨"加三个带图标的词错落滑进，淡出后浏览器界面显出 | 3.0 | `demos-own/parts/words-stagger-browser-reveal/preview-sheet.jpg` |
| panels-assemble-low-drift | 散开的面板拼回一整面 · 硬切低角度慢漂：斜躺的仪表盘面板一开始是散开的，镜头一边移一边各自拼回一整面；硬切到低角度一直匀速慢漂 | 3.1 | `demos-own/parts/panels-assemble-low-drift/preview-sheet.jpg` |
| result-page-tilt-scroll | 结果页斜着进来 · 页内滚动：失焦硬切，结果页斜着虚着进来 0.32 秒摆正（图片先马赛克再变清楚），推近的同时页内滚到底再滚回 | 3.2 | `demos-own/parts/result-page-tilt-scroll/preview-sheet.jpg` |
| pages-pop-fan-out | 页面从一个点弹出 · 散成四页：首页从输入框的中心弹出，慢推；三张页面从身后抽出散开，静漂，再冲进去 | 3.2 | `demos-own/parts/pages-pop-fan-out/preview-sheet.jpg` |
| glow-line-to-list | 彩字缩淡 · 小标题和两行推荐擦出来：彩字缩小淡掉，小标题和两行推荐由糊变清地擦出来，错落上浮，然后上滑走 | 3.2 | `demos-own/parts/glow-line-to-list/preview-sheet.jpg` |
| dots-reveal-cards | 点里显出卡片 · 函数名收走：函数名打出来，点里显出三张线框卡片，最后只剩一对括号 | 3.2 | `demos-own/parts/dots-reveal-cards/preview-sheet.jpg` |
| rays-panel-wave-strobe | 射线图 · 面板推进来 · 声波柱流动 · 频闪：一帧换成射线图，彩色小方块沿射线往中心流；白底面板从右推进来，面板上的短划涨成波形往右流，最后频闪冲出 | 3.7 | `demos-own/parts/rays-panel-wave-strobe/preview-sheet.jpg` |
| headline-input-to-page | 发光大字横移 · 输入条长成网页：巨大的发光字第 1 帧就在横移后退、揭出整句（新词先偏青发虚再变白）→ 变玻璃字上移 → 玻璃长条升起、身后撑开面板长成整个网页 → 网页缩小上移、标题反向下沉 | 4.0 | `demos-own/parts/headline-input-to-page/preview-sheet.jpg` |
| route-to-search-box | 第二条线走到第二站 · 线头变成搜索框打字：镜头转正成俯视，紫粉线拐两个弯到第二个地点；镜头扎近，线头鼓成胶囊、变成搜索框，框里打字；搜索框缩小往后一翻 | 4.5 | `demos-own/parts/route-to-search-box/preview-sheet.jpg` |
| headline-swap-dashboard-rise | 一句话换词四次 · 产品面板升起：一句话逐词打出、句尾的词在原地换三次，换完产品面板从下面升起，目标卡浮出放大分身、左下弹出"已完成"，停住看；弹出收掉、字淡走，镜头推进右上角的"新建任务"按钮，最后只剩这颗按钮 | 4.6 | `demos-own/parts/headline-swap-dashboard-rise/preview-sheet.jpg` |
| notebook-ui-flow | Logo 一闪 · 硬切进笔记本界面：发送后——软光渐变底上产品 Logo + 名字一闪 → 硬切进笔记本界面（玻璃边框大窗口，先略推远， | 4.7 | `demos-own/parts/notebook-ui-flow/preview-sheet.jpg` |
| progress-tilt-editor | 进度条跳着涨 · 代码编辑器斜着升起：产品图标 + 发光进度条跳着涨（几道绿色流光绕着飞）→ 一块霓虹描边的代码编辑器从画面底下斜着升起来、 | 4.9 | `demos-own/parts/progress-tilt-editor/preview-sheet.jpg` |
| glass-dashboard-arc | 玻璃面板浮起 · 弧光升起 · 界面一层层显出：一块空的玻璃面板浮起来、长高 → 下面升起一道蓝色弧光（行星边缘）→ 界面一层层显出来（顶栏、标题、AI 助手、柱状图、折线、环形图）→ | 5.9 | `demos-own/parts/glass-dashboard-arc/preview-sheet.jpg` |

## 功能演示（37 个）

| 零件 | 做什么 | 秒 | 样片图 |
|---|---|---|---|
| ui-closeup-fill-scroll | 硬切放大界面 · 表格一格格填好 · 往上滚：硬切放大界面从右滑进，表格一格一格填好，再往上滚 | 1.7 | `demos-own/parts/ui-closeup-fill-scroll/preview-sheet.jpg` |
| card-hang-line-unfold | 动态卡吊在细线上展开：白粉底，一张动态卡吊在一根从顶上垂下来的细线上展开 | 1.7 | `demos-own/parts/card-hang-line-unfold/preview-sheet.jpg` |
| pullback-table-insert | 拉回 · 表格里插进新的一组：镜头拉回，表格上插进新的一组（先虚后实） | 1.9 | `demos-own/parts/pullback-table-insert/preview-sheet.jpg` |
| whip-word-drag-sort | 甩糊换词 · 拖一行到顶：大字甩糊换成下一个词，光标拿起列表第三行拖到顶放下 | 2.0 | `demos-own/parts/whip-word-drag-sort/preview-sheet.jpg` |
| highlight-erase-retype | 整块高亮 · 删掉重打一句：整块蓝色高亮、字同一帧放大；字删掉只剩光标，逐字打出新的一句，整句始终居中 | 2.0 | `demos-own/parts/highlight-erase-retype/preview-sheet.jpg` |
| word-roll-side-card-edit | 滚词 · 侧卡滑入改一个值：大字竖向滚到下一个词，侧卡晚半拍带横糊滑入；点时间字段，旧值上浮淡出、新值淡入，列表同步 | 2.1 | `demos-own/parts/word-roll-side-card-edit/preview-sheet.jpg` |
| list-grow-toggles | 卡片长成列表 · 关掉两行开关：卡片长成文件列表，光标关掉其中两行的开关 | 2.2 | `demos-own/parts/list-grow-toggles/preview-sheet.jpg` |
| comet-route-grid | 彗星线沿格子地图冲进来 · 拐到第一站：斜俯视的格子地图上，蓝色彗星线沿格子冲进来、拐上去到第一个地点，身后的格子亮起来 | 2.4 | `demos-own/parts/comet-route-grid/preview-sheet.jpg` |
| circle-to-progress-bar | 圆被擀成进度条：圆 → 透镜 → 胶囊 → 细条，进度条缓出走满、冒光点，卡片前后摆一下 | 2.6 | `demos-own/parts/circle-to-progress-bar/preview-sheet.jpg` |
| tilt-row-drawer-open | 斜着压近看一行 · 右边滑出详情：镜头斜着压过去看这一行再回正，右边滑出详情面板 | 2.6 | `demos-own/parts/tilt-row-drawer-open/preview-sheet.jpg` |
| file-cards-swallow | 文件卡升起被圆吞掉：资料库卡慢推，三张文件卡从底下升起、顶端渐隐，被上方的圆吞进去 | 2.7 | `demos-own/parts/file-cards-swallow/preview-sheet.jpg` |
| blur-swap-stream-write | 虚化换场 · 流式写出一段话：资料卡失焦放大变淡，消息卡从右上虚着进来落定；正文流式生成带渐变尾巴，卡片变高，镜头跟着写到的那一行 | 2.7 | `demos-own/parts/blur-swap-stream-write/preview-sheet.jpg` |
| floating-cards-cursors | 卡片变漂浮卡 · 几个光标逐张看：硬切渐变底，三张卡变半透明漂浮卡，标题逐词被卡片揭开；镜头上漂、新卡进场，三个光标各看各的 | 2.7 | `demos-own/parts/floating-cards-cursors/preview-sheet.jpg` |
| board-rise-push-bell-toast | 任务板升起 · 猛推到铃铛 · 红点变成通知卡：任务板升上来，镜头猛推到铃铛，红点掉下来变白、撑开成斜着的通知卡 | 2.9 | `demos-own/parts/board-rise-push-bell-toast/preview-sheet.jpg` |
| folder-drop-chat | 玻璃文件夹拖进聊天面板 · 边拖边打字：接上一拍拖着的玻璃文件夹——硬切米色底，聊天面板从右边滑进来接住它；边拖边打字（紫色）， | 2.9 | `demos-own/parts/folder-drop-chat/preview-sheet.jpg` |
| push-select-word-stretch-crowd | 猛推到一个词框选 · 字被拖出好多个 · 冒出像素小人：镜头猛推到最后一个词、框选，一个字被拖出好多个挤成一排，缝里冒出像素小人 | 3.0 | `demos-own/parts/push-select-word-stretch-crowd/preview-sheet.jpg` |
| search-phrase-dropdown | "在找什么" · 标题拉开成下拉 · 露出结果：白底一个历史图标转一下、逐词冒出"在找什么"；退掉后换成灰色「信用卡 ⌄」，箭头一路折成 ⌃、标题和箭头往两边拉开成下拉栏，往上一走露出找到的三条记录 | 3.3 | `demos-own/parts/search-phrase-dropdown/preview-sheet.jpg` |
| picked-cards-expand | 没选中的退成虚影 · 选中的展开详情：没选中的卡一层层退成背景虚影，倾斜归零；选中的三张摆正散开，字段每帧一行往下长，"高度匹配"错开弹出 | 3.4 | `demos-own/parts/picked-cards-expand/preview-sheet.jpg` |
| toggle-autopilot-cards | 大开关打开 · 卡片从四周飞来围着大字转：一颗超大开关在白底上浮出、"啪"地打开变绿，十几张助手卡片从四周飞进来围住它；开关缩小右移，露出后面的大字"自动安排"；整团卡片绕着大字顺时针转，最后整团缩远 | 3.5 | `demos-own/parts/toggle-autopilot-cards/preview-sheet.jpg` |
| kanban-rise-drag-twice | 看板浮上来 · 拖卡两次 · 绿勾：项目卡缩小上移，三列看板错开浮上来，进度一路涨；卡片被拿起、横移、落下两次，落进"已完成"后长出绿勾 | 3.8 | `demos-own/parts/kanban-rise-drag-twice/preview-sheet.jpg` |
| line-avatars-roles-zoom | 白线接着走 · 头像角色冒出 · 推近进度：白线继续往右：协调人小卡、三个头像冒出来，角色标签出现，线接到项目卡，最后推近 | 3.9 | `demos-own/parts/line-avatars-roles-zoom/preview-sheet.jpg` |
| type-pan-select-restyle | 逐字打字 · 镜头甩 · 选中一个词换字体：一个字一个字打出一句话，镜头跟着往右甩，名字光标框选一个词，这个词换成艺术字体 | 3.9 | `demos-own/parts/type-pan-select-restyle/preview-sheet.jpg` |
| dots-scatter-cards-rise | 点阵球散开 · 卡片从点里升起：点阵球散成几团小球，函数名打出来，三张线框卡片从点里斜着升起 | 4.0 | `demos-own/parts/dots-scatter-cards-rise/preview-sheet.jpg` |
| select-restyle-pixel-gradient | 再选一个词换字体 · 像素乱跳 · 变渐变色：接着打字，又一个词被选中换字体，一个词像素乱跳后变成渐变色大字 | 4.0 | `demos-own/parts/select-restyle-pixel-gradient/preview-sheet.jpg` |
| agent-panel-open-posts | 小面板弹出撑大 · 帖子卡依次弹出：消息发出后右上弹出深灰小面板，2 帧猛推近，面板变亮、撑大，里面先骨架再弹出三张帖子卡，各自左右错开 | 4.2 | `demos-own/parts/agent-panel-open-posts/preview-sheet.jpg` |
| field-slide-eye-stars | 只留一个词 · 输入框滑入 · 点眼睛变星号：换一句话，中间的词退掉只剩一个；右边滑进一个大输入框，镜头跟着往右摇；手点框尾的眼睛，眼睛划掉、字变星号 | 4.5 | `demos-own/parts/field-slide-eye-stars/preview-sheet.jpg` |
| two-words-restyle-heavy-slant | 连着两个词换字体：变厚重、变倾斜：继续打字，两个词先后被选中，一个变厚重、一个变倾斜 | 4.5 | `demos-own/parts/two-words-restyle-heavy-slant/preview-sheet.jpg` |
| spawn-tree-rows-focus | 线扫过标题 · 分出三行子任务 · 推近第一行：镜头跟着一根细线横扫过大标题，标题右端伸出花括号、线拐弯往下，蓝点领着跑出三行子任务；推近第一行，字从两头消掉，只剩两个图标靠拢 | 4.6 | `demos-own/parts/spawn-tree-rows-focus/preview-sheet.jpg` |
| sphere-search-filter | 打字筛选 · 不匹配的原地变暗：弯曲的搜索胶囊沿球外圈打字变长，不匹配的原地变暗；上下键切换时计数先变、球滞后才转到结果 | 4.8 | `demos-own/parts/sphere-search-filter/preview-sheet.jpg` |
| word-ring-tools | 状态词删了重打 · 工具图标围成环：画面中间一个状态词在打字（思考中··· → 连接中··· → 分析中···，旧词从头往后删掉、新词打出来）， | 4.8 | `demos-own/parts/word-ring-tools/preview-sheet.jpg` |
| page-tilt-dive-flicks | 页面斜过来 · 镜头扎进去 · 三下往下翻：页面猛地斜过来、镜头扎进去，贴着斜放的表格三下往下翻 | 5.0 | `demos-own/parts/page-tilt-dive-flicks/preview-sheet.jpg` |
| capsule-type-avatar-panel | 胶囊打字变宽 · 头像长成对话面板：胶囊被虚线夹住、描边亮光绕一圈；打字变宽；头像球从一个点长出，变成 3D 倾斜的对话面板，上滑出画 | 5.3 | `demos-own/parts/capsule-type-avatar-panel/preview-sheet.jpg` |
| bead-ring-picker | 串珠成环 · 光标挨个悬停选一个：小球冒出串成一圈珠子，3D 光标翻转着挨个悬停，选中一个，环先撑大再吸回卡片 | 5.5 | `demos-own/parts/bead-ring-picker/preview-sheet.jpg` |
| button-grow-sphere-spin | 按钮长成 3D 球 · 拖着转：点按钮，图标淡掉，玻璃小球从按钮里冒出来边转边长大飞到输入框上方；光标拖着球横转、反转、斜翻 | 5.5 | `demos-own/parts/button-grow-sphere-spin/preview-sheet.jpg` |
| button-expand-create-card | 按钮撑开成新建卡 · 打字出标签：大字逐字出，光标点按钮，按钮原地撑开成新建卡；输入一句话自动出三个标签，点确定后卡变成列表 | 5.8 | `demos-own/parts/button-expand-create-card/preview-sheet.jpg` |
| row-status-flip-pan | 贴脸看一行 · 横滑 · 状态格整格换色：贴脸看任务表的一行，整条横着滑到最右，费用、状态两格整格换色；快滑回左边看人，再滑回来状态变"已完成"，整个画面往上走 | 5.8 | `demos-own/parts/row-status-flip-pan/preview-sheet.jpg` |
| type-button-slides | 超大字逐字打 · 拉远成按钮 · 出幻灯片：黑底超大字逐字打「直接看演示文稿」（镜头从一个字的特写一路拉远，刚打的字是紫色、过一会变白）→ | 6.0 | `demos-own/parts/type-button-slides/preview-sheet.jpg` |

## 证据（20 个）

| 零件 | 做什么 | 秒 | 样片图 |
|---|---|---|---|
| success-card-avatars-pop | 成功卡 · 头像一个个弹出：蓝勾从小点弹出，词逐个由浅变深，四个头像每 2 帧从小点弹出（过冲、互相压着），最后是"+21" | 1.5 | `demos-own/parts/success-card-avatars-pop/preview-sheet.jpg` |
| counter-roll-graph | 数字滚着涨 · 旁边折线图：左边数字滚着往上涨，右边一张折线图，下面一句话 | 1.5 | `demos-own/parts/counter-roll-graph/preview-sheet.jpg` |
| amount-split-pill-tags | 超大金额 · 黄块铺满 · 数字拉开：白底超大金额 → 亮黄方块一格格铺满、数字一边缩小一边拉开 → 黄底褪成浅黄再褪白 → | 1.7 | `demos-own/parts/amount-split-pill-tags/preview-sheet.jpg` |
| glass-number-cards | 三张玻璃数字卡 · 数字滚着涨：三张玻璃数字卡（营收 / 时长 / 点击）在画面里漂，数字一格格往上滚着涨，节奏错开（028-G 一拍，数据证明核心） | 2.0 | `demos-own/parts/glass-number-cards/preview-sheet.jpg` |
| check-confetti-done | 打勾 · 彩纸 · "已完成"胶囊：滚词变蓝，光标按下变实心加彩纸，白勾写出、删除线划过，胶囊和计数跟着变，彩纸飘落淡出 | 2.5 | `demos-own/parts/check-confetti-done/preview-sheet.jpg` |
| tilted-page-caption-swap | 硬切斜放整页 · 上方换一句话 · 甩走：硬切到斜放的整页，上方一句话、换一句，整页慢慢转过去、往左甩走 | 2.5 | `demos-own/parts/tilted-page-caption-swap/preview-sheet.jpg` |
| detail-drag-select-match | 详情页 · 拖选关键词 · 条件一条条对上：硬切详情页，左边大字逐词出，光标从右往左拖选关键词（浅蓝变深蓝加选框），页面滚动和左边换词同一帧 | 3.0 | `demos-own/parts/detail-drag-select-match/preview-sheet.jpg` |
| rank-first-card-map-pin | 排第一的结果卡 · 地图上也找得到：一张排名第一的搜索结果卡亮出来，下面一句话；切到地图定位点和地图结果列表 | 3.0 | `demos-own/parts/rank-first-card-map-pin/preview-sheet.jpg` |
| ai-recommend-percent-fill | AI 也推荐你 · 百分比涨到 100：AI 回答里出现你的名字并被高亮，切到一个大百分比数字一路涨到 100%、右边进度条填满 | 3.0 | `demos-own/parts/ai-recommend-percent-fill/preview-sheet.jpg` |
| phone-booking-toast-node-graph | 手机弹出预约通知 · 咨询汇成节点图：手机锁屏上弹出预约通知，切到一张节点图：左右两排来源卡用曲线汇到中间 | 3.5 | `demos-own/parts/phone-booking-toast-node-graph/preview-sheet.jpg` |
| revenue-line-dashboard | 营收折线一路往上 · 后台看板：一条荧光绿折线从左下画到右上，切到白色后台看板 | 3.5 | `demos-own/parts/revenue-line-dashboard/preview-sheet.jpg` |
| giant-word-dot-rings-faces | 超大字 · 小词轮换 · 点阵环炸开成人脸：名字猛放大成撑满屏的超大字，换成一个个小词，小词外面长出一圈圈点阵环，最后炸开成一大片人脸圆点 | 3.7 | `demos-own/parts/giant-word-dot-rings-faces/preview-sheet.jpg` |
| card-orbit-counter | 卡片绕大数字转 · 数字滚到终值：一圈 3D 场景卡片贴在圆筒上绕着中间的大数字转（前景卡往左上变大、远景卡往右上变小、前景卡会擦过把数字挡住），数字线性滚到终值的那一刻正好镜头甩得最快，长尾减速后所有卡收进文件夹 | 3.8 | `demos-own/parts/card-orbit-counter/preview-sheet.jpg` |
| pills-out-progress-dashboard | 胶囊一条条甩出去 · 进度卡清单打勾：上一拍的四条角色胶囊一条条往左甩出去 → 一张「项目进度」卡从右边滑到中间，清单一项项打勾、进度条往前涨 → | 3.8 | `demos-own/parts/pills-out-progress-dashboard/preview-sheet.jpg` |
| trail-dot-captions | 绿点拖虚线前进 · 带角标的字幕接力：黑底网格 HUD 上一颗绿点拖着虚线前进、镜头跟随（速度会"呼吸"但从不停），像素块硬闪、像素小蛇逐格爬，1 帧马赛克换场后，带四角角标框的字幕一帧一个词接力三句 | 4.3 | `demos-own/parts/trail-dot-captions/preview-sheet.jpg` |
| glow-bar-benchmark | 发光条伸出 · 灰条长出 · 对比图成形：深色圆吞掉上一镜，一根发光青条伸出、镜头贴着推近；推到最近时灰条依次长出，镜头慢慢后退，名字、数值逐位、标题依次打出，成为一张完整的对比图 | 4.3 | `demos-own/parts/glow-bar-benchmark/preview-sheet.jpg` |
| dots-word-perspective-list | 彩点飞来拼成字 · 整句让开出透视清单：黑底先出半句，后半句的字从四散的彩色小点飞过来拼上 → 整句往上让开 → | 4.3 | `demos-own/parts/dots-word-perspective-list/preview-sheet.jpg` |
| giant-word-stack-faces | 撑满屏的大字滑过 · 第二个词两行挤进来：米白底一个小圈 → 撑满整屏的超大字（带一点重影抖动）往左越滑越快地滑过去 → 第二个词两行错开从右边挤进来 → | 4.8 | `demos-own/parts/giant-word-stack-faces/preview-sheet.jpg` |
| ray-burst-counter | 蓝圆炸成放射线 · 数字跳三次：米白底中间一个蓝圆，两边小字说明 → 蓝圆缩小、外面围一圈点（几颗是人脸）→ 点连成放射线、炸开成一圈长短不一的线，右边数字 340→363→380 跳 → | 5.9 | `demos-own/parts/ray-burst-counter/preview-sheet.jpg` |
| pill-bar-report-slides | 胶囊压成进度条 · 报告页一张张出：米白底一个细线小胶囊撑大 → 蓝色圆从左边滚进来填成蓝胶囊 → 上下夹着两个标签词、整条压扁成一根进度条 → | 6.0 | `demos-own/parts/pill-bar-report-slides/preview-sheet.jpg` |

## 列举（22 个）

| 零件 | 做什么 | 秒 | 样片图 |
|---|---|---|---|
| two-circles-questions-swap | 两个蓝圆并排 · 里面的问题换两次：两个蓝色大圆并排，圆里的问题换两次，最后收走 | 2.0 | `demos-own/parts/two-circles-questions-swap/preview-sheet.jpg` |
| task-list-ticker | 任务短句转盘：白底上一圈很大的任务短句像转盘一样转，每行左沿排在一条往右弯的弧上，每 0.28 秒往上转一行，正中那行变黑、左边一颗发光蓝球，长句被画面右沿裁掉 | 2.1 | `demos-own/parts/task-list-ticker/preview-sheet.jpg` |
| card-rain-pile-up | 上百张小卡从天而降 · 堆满整屏：画面顶上掉下一堆小卡片，有重力、落地滑行、后来的盖在上面，堆成小山，2.5 秒填满整屏 | 2.1 | `demos-own/parts/card-rain-pile-up/preview-sheet.jpg` |
| palette-steps-list | 竖色条长成台阶 · 铺成一行行色带：硬切黑底，一根竖色条（几种品牌色上下叠）往两边长成金字塔台阶（越下面越宽），再一下铺满成一行行全宽色带， | 2.1 | `demos-own/parts/palette-steps-list/preview-sheet.jpg` |
| line-bend-second-card | 线弯下去接到第二张卡：镜头往下跟，线弯下去接到第二张卡 | 2.4 | `demos-own/parts/line-bend-second-card/preview-sheet.jpg` |
| card-wall-swap-submit | 卡片墙到位 · 中心卡换稿 · 点提交：卡片墙从纵深退后到位，中心卡被三层斜边色块连换几版，四周空位错开滑入补满；推近中心卡点"提交"，黑边同一帧压入 | 2.6 | `demos-own/parts/card-wall-swap-submit/preview-sheet.jpg` |
| rows-slide-multi-cursor-pick | 资料卡整排交错滑入 · 多个光标点选：搜索框缩小被中间一排卡挤走，上排从右、下排从左"嗖"地滑进铺满，急停后慢漂；四个光标错开点选，有一个选了又退选 | 3.3 | `demos-own/parts/rows-slide-multi-cursor-pick/preview-sheet.jpg` |
| wall-pullback-pushin | 单卡急拉远成墙 · 慢推到下一张：一张卡一帧急拉远，露出整面联系人卡片墙，几个指针各自漂；慢推右移到另一张卡，最后一帧急推 | 3.4 | `demos-own/parts/wall-pullback-pushin/preview-sheet.jpg` |
| line-turn-third-card-pull | 线拐上去接第三张卡 · 拉远擦掉：镜头往右，线拐上去接到第三张卡，卡上出标记，最后拉远、整屏擦掉 | 3.4 | `demos-own/parts/line-turn-third-card-pull/preview-sheet.jpg` |
| icon-word-tint | 图标飞进一个词 · 把它染成自己的颜色：斜放的平面上打出一个短词，换成一整句，四周四个线条小图标弹出来；前半句往左甩走，最后一个词居中放大，图标一个个飞进去、词跟着换成图标的颜色 | 3.7 | `demos-own/parts/icon-word-tint/preview-sheet.jpg` |
| word-slot-icon-zoom | 像老虎机一样翻能力 · 图标放大铺满：产品名退掉、半句话往左让，右边像老虎机一样一项项往上翻（图标 + 能做的事）越翻越快；停在最后一项，字从尾巴删掉，只剩图标滑到正中、变实心、猛地放大铺满 | 3.7 | `demos-own/parts/word-slot-icon-zoom/preview-sheet.jpg` |
| tag-ring-spin-dive | 3D 标签环狂转倒下 · 俯冲穿过：硬切成 3D 标签环：侧立的窄环狂转，同时倒下、拉远，标签越冒越多；平躺慢转、俯冲、一帧翻转，近景沿蓝色光带慢漂，推近甩出 | 4.2 | `demos-own/parts/tag-ring-spin-dive/preview-sheet.jpg` |
| dot-adapters-balls | 点云聚成四颗点阵球 · 各带名字：点线卡片散成点云 → 聚成一大三小四颗转动的点阵球，球下面各有一个小图标 + 名字，左边一行大字；最后球又化成点云（033-C 一拍，枚举） | 4.2 | `demos-own/parts/dot-adapters-balls/preview-sheet.jpg` |
| orb-split-three-one-app | 小球分成三个功能图标 · 再合成一个应用：黑底一颗渐变小球 + 下面一个词，四周彩色小点漂 → 球往两边分出两颗、变成三个功能图标（各自换色、下面各有名字）→ | 4.3 | `demos-own/parts/orb-split-three-one-app/preview-sheet.jpg` |
| interface-wall-sync | 界面墙斜着浮出 · 两句好处 · 过曝到白：一整面斜铺的产品界面墙从虚里浮出来、往左上滑、一路减速慢漂，上方两句好处逐词出现；最后整个画面猛地变虚过曝到白 | 4.5 | `demos-own/parts/interface-wall-sync/preview-sheet.jpg` |
| logo-orbit-features | 图标弹出 · 六个功能小圆绕着转：App 图标斜着弹出、带光晕轻晃，两行大字逐词出现；6 颗功能小圆在图标四周的轨道上顺时针依次弹出，整圈慢慢转，最后整画面变虚淡掉 | 4.5 | `demos-own/parts/logo-orbit-features/preview-sheet.jpg` |
| word-ten-fonts-grid-blob | 同一个词十种字体铺满屏 · 像素团吞掉：同一个词用十种字体一行行铺满整屏、各行横着滑，一行彩色字扫过，最后一团黑色像素从右边吞掉画面 | 4.7 | `demos-own/parts/word-ten-fonts-grid-blob/preview-sheet.jpg` |
| star-lead-word-roll | 小蓝星引着引导词 · 右边词槽竖着滚：小蓝星一边转一边往右靠、引导词往左靠，两者靠拢成一组 → 整组往左让位，右边一个词槽竖着滚： | 4.9 | `demos-own/parts/star-lead-word-roll/preview-sheet.jpg` |
| photo-cards-arc-stair | 照片卡沿弧线一张张排成台阶：字往右让开，照片卡从左下角开始沿一道弧线一张张排上去，像台阶，每排一张下面换一个名字 | 4.9 | `demos-own/parts/photo-cards-arc-stair/preview-sheet.jpg` |
| connect-word-icon-reel | 固定大词 · 图标方块转轮换小词：暗紫底，左边一个固定大词 + 下面一行小词轮换；右边一串紫色图标方块斜着排成转轮， | 5.0 | `demos-own/parts/connect-word-icon-reel/preview-sheet.jpg` |
| line-unfold-card-corridor | 竖线展开成卡 · 走廊里一张张换到中间：黑底蓝图风，一根竖线从右边滑进来在中间展开成一张霓虹像素卡，左右灰色卡从它背后滑出来排成走廊，之后右边的卡一张张飞到中间变彩色，整排一直慢慢往左漂 | 5.4 | `demos-own/parts/line-unfold-card-corridor/preview-sheet.jpg` |
| carousel-pass-whip | 弯曲轮播匀速滑 · 甩一下：一排卡贴在圆筒内壁上从右往左滑，中间平、两边拉高拖虚带色散，中途"甩一下"加速 | 6.0 | `demos-own/parts/carousel-pass-whip/preview-sheet.jpg` |

## 字卡（35 个）

| 零件 | 做什么 | 秒 | 样片图 |
|---|---|---|---|
| neon-word-everywhere | 荧光大字斜着冲过：一个荧光绿的斜体大字带着拖影冲过画面 | 1.0 | `demos-own/parts/neon-word-everywhere/preview-sheet.jpg` |
| sentence-folder-tile | 一句话中间嵌一块文件夹砖：米色底，一块文件夹砖落定，左右各出一个词，拼成一句话 | 1.2 | `demos-own/parts/sentence-folder-tile/preview-sheet.jpg` |
| pills-slide-words-light | 两颗胶囊滑进来 · 字逐个亮：黑胶囊从右边高速滑进来、长尾巴减速，字一个个从灰变白；渐变胶囊跟进来，字从浅变黑；两颗停住 | 1.4 | `demos-own/parts/pills-slide-words-light/preview-sheet.jpg` |
| scramble-decode-word | 词挪开 · 乱码从左到右解成一个词：一个词挪到左边，右边一串乱码从左到右解码成另一个词 | 1.4 | `demos-own/parts/scramble-decode-word/preview-sheet.jpg` |
| small-words-drop | 一句小字一个词一个词落出来：黑底暗红光，一句小字一个词一个词落出来 | 1.4 | `demos-own/parts/small-words-drop/preview-sheet.jpg` |
| words-append-line | 逐词追加 · 整行一直居中：一行字一个词一个词往后加，整行始终居中，新词从远处深灰靠拢变白 | 1.5 | `demos-own/parts/words-append-line/preview-sheet.jpg` |
| name-wipe-word-swap | 擦掉名字 · 原地换词停在转折词：从左擦掉名字，副标题居中，原地换词，最后换成一个转折词停住 | 1.5 | `demos-own/parts/name-wipe-word-swap/preview-sheet.jpg` |
| big-lines-slam-exit | 两行大字缩小落定 · 猛推出画：两行大字从 1.4 倍带长尾巴缩小落定，停住，再 2–3 帧猛推出画 | 1.7 | `demos-own/parts/big-lines-slam-exit/preview-sheet.jpg` |
| three-words-title | 三词标题逐词浮现："找到。看懂。约上。"三个词逐个浮现，停住极慢后拉，再加速后拉切走 | 1.7 | `demos-own/parts/three-words-title/preview-sheet.jpg` |
| word-card-rise | 逐词字卡 · 词浮上来变实：缩小失焦硬切到字卡：词一个个偏低、发虚、竖向拉伸着浮上来变实，重点词底下一块高亮从左擦出，最后失焦切走 | 1.9 | `demos-own/parts/word-card-rise/preview-sheet.jpg` |
| type-shrink-glow-line | 大黑字打出 · 缩小变灰 · 彩字糊入：一行大黑字边打边滑上来，缩小、变灰、淡掉；第二句渐变彩字逐字糊入，带柔光、颜色流动 | 1.9 | `demos-own/parts/type-shrink-glow-line/preview-sheet.jpg` |
| type-phrase-key-insert | 打出短语 · 钥匙插到词前面：上一镜的图标缩掉，打出一个短语；前半句退掉，一把钥匙插到关键词前面 | 1.9 | `demos-own/parts/type-phrase-key-insert/preview-sheet.jpg` |
| dot-orbit-sentence | 圆点滑过 · 一句话浮出 · 圆点绕着字跑：一颗紫色圆点滑过，一句话浮出来，圆点绕着字跑 | 2.0 | `demos-own/parts/dot-orbit-sentence/preview-sheet.jpg` |
| words-burst-whip-swap | 词各自冲到原位 · 甩出画换下一个词：每个词各自从很小冲到原位，停一下，整句被甩出画（横糊），第二个词从右边甩进来长尾巴停到正中 | 2.1 | `demos-own/parts/words-burst-whip-swap/preview-sheet.jpg` |
| word-swap-orbit | 原地换词三次 · 光球绕字：句子里一个词原地硬切换三次，两颗光球绕着字越转越小越亮 | 2.3 | `demos-own/parts/word-swap-orbit/preview-sheet.jpg` |
| wash-white-logo-lines | 整屏洗白 · 标志和四行定位由灰变黑：整屏洗白，白底上标志和四行字由灰变黑，背后一条蓝线沿窗口边描出来 | 2.3 | `demos-own/parts/wash-white-logo-lines/preview-sheet.jpg` |
| title-reply-cards-fly | 三词标题 · 三张回复卡飞入：硬切暖白底，三词标题逐词先虚后实、整行居中；标题上移，三张回复卡从右下依次 3D 飞入，各自倾斜不同 | 2.4 | `demos-own/parts/title-reply-cards-fly/preview-sheet.jpg` |
| orange-circle-ovals-turn-blue | 橙圆里冒字 · 挤出椭圆串变蓝：米白底，橙色大圆里一行行冒出字，圆往左让、右边挤出一串越来越窄的椭圆，颜色从右往左换成蓝 | 2.4 | `demos-own/parts/orange-circle-ovals-turn-blue/preview-sheet.jpg` |
| words-morph-line | 同一句话里换几个字 · 整行飘走：一句话补上最后一个词滑到正中，前后的词逐字溶掉换成新词，中间不变的词变大挪位，补一个字后整行加速往上飘走 | 2.5 | `demos-own/parts/words-morph-line/preview-sheet.jpg` |
| sentence-grows-around-icon | 句子从小图标两边一截截长出来：一个小图标停在画面中间，句子从它左边一截截长出来（新词插在图标前、整句一直居中），最后一个词接在图标后面 | 2.5 | `demos-own/parts/sentence-grows-around-icon/preview-sheet.jpg` |
| small-type-pixel-word-gradient | 小字接着打 · 一个词像素乱跳变渐变色：小字号接着打完一句，中间一个词像素乱跳、再变成渐变色 | 2.8 | `demos-own/parts/small-type-pixel-word-gradient/preview-sheet.jpg` |
| benefit-lines-word-by-word | 两句好处逐词出 · 拖影退场：第一句逐词出（浅灰带虚滑进来再变墨、整行一直居中），虚掉退场；第二句逐词出，往左拖影退场 | 2.9 | `demos-own/parts/benefit-lines-word-by-word/preview-sheet.jpg` |
| rings-blue-line-url | 收成同心圆 · 蓝色一句话逐词出：椭圆收成一圈圈同心圆，同心圆淡掉，一句蓝色的话逐词出来，下面一行网址 | 2.9 | `demos-own/parts/rings-blue-line-url/preview-sheet.jpg` |
| glitch-blocks-grow-word | 卡片一张张消失 · 白块长成一个大字：卡片一张张一帧消失、故障色块乱跳，背景变纯黑；几块白块原地停住长成笔画，拼出一个大字，整词推近 | 3.0 | `demos-own/parts/glitch-blocks-grow-word/preview-sheet.jpg` |
| outline-word-to-heat-gradient | 描边大字 · 最后一个词热力渐变放大：描边大字套在大圆里，换成小字，最后一个词变成红粉渐变的大字、四周彩点闪 | 3.1 | `demos-own/parts/outline-word-to-heat-gradient/preview-sheet.jpg` |
| words-in-dot-rings-frames | 一个词换一种外框：点阵环、虚线圆：黑底一句话拆成几个词一个个出，每个词换一种外框：小字、两三圈彩色点阵环绕着转往里收、虚线圆加细方框 | 3.3 | `demos-own/parts/words-in-dot-rings-frames/preview-sheet.jpg` |
| words-fly-pill-open | 大字飞来 · 柔边擦掉 · 胶囊撑开一句话：三块大字先后从中心飞来减速停住，柔边擦除，胶囊从中线撑开、三组字浮起，停住读完，胶囊缩回 | 3.6 | `demos-own/parts/words-fly-pill-open/preview-sheet.jpg` |
| condensed-tall-lines-reweight | 三行超窄高字打出 · 选中换粗细：黑底一团字符画漩涡，三行超窄超细的高字一行行打出来，被选中后变宽、变粗、变成满版齐行 | 3.6 | `demos-own/parts/condensed-tall-lines-reweight/preview-sheet.jpg` |
| glyphs-drawn-one-by-one | 参考线 → 描边 → 填实，逐字画出：墨绿底 + 构造网格，品牌名一个字一个字"画"出来：先出虚线参考线和锚点、再描边、再填实，镜头推近一下又拉远换下一个字（前三个字） | 3.8 | `demos-own/parts/glyphs-drawn-one-by-one/preview-sheet.jpg` |
| mixed-glyph-type-glitch | 逐字打字 · 每个字不停换字体：浅灰底 + 淡淡的字符画漩涡，一句话一个字一个字打出来、每个字都在不停换字体（花体 / 超粗 / 描边 / 键帽框 / 等宽）、框选着 → | 4.0 | `demos-own/parts/mixed-glyph-type-glitch/preview-sheet.jpg` |
| words-split-lock-replace | 词拉开插进一把锁 · 原位换词：白底打出一句话，词与词拉开、第一个词消失、中间插进一把锁；「锁 + 词」斜着往上让，下面浮出新一行；再在原位把词一个个换掉，浮出最后一行 | 4.1 | `demos-own/parts/words-split-lock-replace/preview-sheet.jpg` |
| carousel-type-slots | 贴脸页面拉远成轮播 · 大字蹦进文字框：贴脸的斜放任务页猛地拉远摆正，变成横向轮播里的一张卡；轮播一下下往左甩，文字框里大字逐个蹦出"一眼看清 / 全家的"，再甩到第二框"大事 / 小事" | 4.6 | `demos-own/parts/carousel-type-slots/preview-sheet.jpg` |
| blue-poster-card-type-fonts | 蓝色海报卡 · 逐行打字换字体：推近到一张蓝色海报卡，卡里逐行打字，每行换一种字体和字号，数字特别大 | 4.9 | `demos-own/parts/blue-poster-card-type-fonts/preview-sheet.jpg` |
| lines-keep-word-swap-brand | 三行字只留一个词 · 原位换成产品名：暗底逐行打出三行字，最后一行带地球图标；其余的字退掉、只留「🌐 关键词」升到正中，在原位一下换成产品标志 + 产品名，再往上让、下面浮出一句话 | 5.3 | `demos-own/parts/lines-keep-word-swap-brand/preview-sheet.jpg` |
| cards-leave-dots-form-word | 卡片离开 · 点聚成大字 · 字变形：卡片斜着离开，点聚成一个大词，函数名换掉，大词里的字一个个变形换掉 | 5.6 | `demos-own/parts/cards-leave-dots-form-word/preview-sheet.jpg` |

## 转场（10 个）

| 零件 | 做什么 | 秒 | 样片图 |
|---|---|---|---|
| pill-rows-slide-claims | 五行蓝胶囊左右猛滑再刹住：硬切满屏五行蓝色胶囊（长胶囊写乱码货币符号、圆胶囊里一个箭头），一行往左一行往右猛滑再刹住， | 0.8 | `demos-own/parts/pill-rows-slide-claims/preview-sheet.jpg` |
| swirl-turn-dot-flood | 漩涡卷走 · 转折句 · 蓝点吞满屏：漩涡把小卡卷进中心、标题缩没，品牌色转折句斜着逐词浮出停一下；句心长出同色圆点，指数长大吞满屏 | 1.7 | `demos-own/parts/swirl-turn-dot-flood/preview-sheet.jpg` |
| comet-dots-card | 流星线把点串起来 · 变成白卡片：几条彩色流星线沿着弯路径把散开的小点连起来，汇到中间变成一个小方块，方块撑成白卡片、按钮出现 | 1.8 | `demos-own/parts/comet-dots-card/preview-sheet.jpg` |
| photo-flash-bulge | 照片飞快地换 · 最后一张鼓起来撑满：按钮拉成两道光带分开，中间冒出小照片，背景铺开像素格；照片一张接一张飞快地换、边换边变大、越来越霓虹，最后一张四边内凹、鼓起来撑满画面 | 1.8 | `demos-own/parts/photo-flash-bulge/preview-sheet.jpg` |
| big-line-pixel-drop-out | 最后一句大字 · 像素块闪掉：气泡甩走，最后一句大字单独停一下，被红粉色大像素块闪掉 | 1.9 | `demos-own/parts/big-line-pixel-drop-out/preview-sheet.jpg` |
| glow-flood-panel-reveal | 光晕胀满屏 · 面板从光里显出来：一个词的光晕胀大到满屏变白，退光时面板从光里显影；面板换角度、里面的小球依次亮 | 2.9 | `demos-own/parts/glow-flood-panel-reveal/preview-sheet.jpg` |
| form-tilt-road | 卡片往后倒 · 镜头扎进去变成一条路：表单卡片往后倒下去、镜头贴着它冲过去，卡片变成一条往前延伸的路，"开车"选中块滑下来变成分道线，几段分道线从下往上冲过 | 3.1 | `demos-own/parts/form-tilt-road/preview-sheet.jpg` |
| iso-cube-rings | 线框立方体 · 拉远成方块地板换色：黑底上一个线框立方体转着填色、缩小，镜头一下拉远成斜俯视的方块地板，一圈圈蓝白方块从外往里换色，最后拉远转正成俯视 | 3.2 | `demos-own/parts/iso-cube-rings/preview-sheet.jpg` |
| tags-ring-implode | 两个标签画环 · 吸进光团爆亮：两个标签之间上半圈虚线、下半圈实线带流光画成环，往外撑一下再急吸进中心光团，光团爆亮到近满屏 | 3.3 | `demos-own/parts/tags-ring-implode/preview-sheet.jpg` |
| photo-lens-cursor-type | 满屏照片缩进透镜 · 缩成一根光标：满屏照片缩进一个大玻璃透镜、一路缩成一根白色光标 → 光标往左滑到头，一道蓝色彗星光从左边追上来 → | 4.3 | `demos-own/parts/photo-lens-cursor-type/preview-sheet.jpg` |

## 过渡动作（9 个）

| 零件 | 做什么 | 秒 | 样片图 |
|---|---|---|---|
| jelly-orb-around-title | 果冻球绕标题一圈冲出去：一颗果冻球从底边冲上来绕标题一圈，挤开词缝冲出顶部，最后一整帧全黑 | 1.7 | `demos-own/parts/jelly-orb-around-title/preview-sheet.jpg` |
| drawer-close-table-slide | 详情收回 · 表格横滑出场：详情面板收回，表格横滑接下一镜 | 1.7 | `demos-own/parts/drawer-close-table-slide/preview-sheet.jpg` |
| sphere-collapse-back | 球缩回按钮：按两次 Esc：搜索清空全部亮回，球缩小变玻璃飞回按钮，图标重现 | 1.9 | `demos-own/parts/sphere-collapse-back/preview-sheet.jpg` |
| cards-dissolve-to-dots-back | 卡片化成点 · 再聚回来：卡片化成一片点散开，又聚回卡片 | 2.3 | `demos-own/parts/cards-dissolve-to-dots-back/preview-sheet.jpg` |
| dots-sphere-cube-wire | 点云 → 点阵球 → 立方体 → 线框：点云聚成点阵球，变成点阵立方体，再变成白色线框立方体转到顶点朝前 | 2.6 | `demos-own/parts/dots-sphere-cube-wire/preview-sheet.jpg` |
| generating-studio | 「生成中」大按钮 · 流光一呼一吸：软光底中间一个渐变描边的大按钮「✧ 生成中···」（字带紫色流光逐个显出、外圈发光一呼一吸）→ | 2.7 | `demos-own/parts/generating-studio/preview-sheet.jpg` |
| zoomout-whole-sentence-cursors | 猛拉远 · 整句变小 · 名字光标散在四周：镜头猛拉远，整句话缩成一小行，几个名字光标散在四周 | 2.7 | `demos-own/parts/zoomout-whole-sentence-cursors/preview-sheet.jpg` |
| word-to-dots-gather | 大字散成点 · 点重新聚拢：大字淡掉散成点，点慢慢重新聚拢 | 2.9 | `demos-own/parts/word-to-dots-gather/preview-sheet.jpg` |
| dock-grab-folder-drag | 抓起文件夹拖走：光标抓起一个文件夹（变成玻璃质感），拖着往右走出画面 | 3.0 | `demos-own/parts/dock-grab-folder-drag/preview-sheet.jpg` |

## 品牌落版（27 个）

| 零件 | 做什么 | 秒 | 样片图 |
|---|---|---|---|
| dot-logo-slam-name | 小字缩成点 · Logo 砸下来 · 名字滑进：小字加速缩成一个点，大 Logo 砸下来缩小、两块合拢；Logo 往左让，名字字母一个个滑进来，副标题跟上 | 2.6 | `demos-own/parts/dot-logo-slam-name/preview-sheet.jpg` |
| last-glyph-wordmark-solid | 画完最后一个字 · 拉远成整个字标填实：画出最后一个字，镜头拉远，四个字排成字标，一起填实 | 2.6 | `demos-own/parts/last-glyph-wordmark-solid/preview-sheet.jpg` |
| logo-letters-tagline | Logo 一帧一字长出 · 标语：失焦硬切后 Logo 一帧一个字从左往右虚着长出，黑边撤掉、Logo 上移，标语逐词阶梯浮出，胶囊按钮先字后底，停住 | 2.7 | `demos-own/parts/logo-letters-tagline/preview-sheet.jpg` |
| dock-type-genie-burst-name | 打"隆重介绍" · 图标喷开满屏 · 产品名浮出：程序坞上方打出"隆重介绍"，手点开产品图标，图标像精灵一样喷开撑满全屏，产品名逐字母浮出变大 | 2.8 | `demos-own/parts/dock-type-genie-burst-name/preview-sheet.jpg` |
| star-spin-wordmark-arcs | 四角星收走上一句 · 转两下出字标：上一句话被一个内凹四角星「收」进去 → 星变小、变亮、往左走，转两下（转的时候鼓成圆角方块）→ | 3.0 | `demos-own/parts/star-spin-wordmark-arcs/preview-sheet.jpg` |
| two-words-part-url | 两个词往两边退开 · 中间打出网址：只剩两个词，往两边退开变暗，中间打出网址 | 3.1 | `demos-own/parts/two-words-part-url/preview-sheet.jpg` |
| halftone-ear-to-logo | 网点耳朵变成标志 · 落定：网点拼成一只耳朵，再变成标志，落定停住 | 3.1 | `demos-own/parts/halftone-ear-to-logo/preview-sheet.jpg` |
| arc-sweep-wordmark | 蓝色弧光扫过 · 星标和名字由糊变清：一道蓝色弧光从右上扫过去 → 顶上一条暗弧、底下一圈行星边缘的光 → 中间星标 + 名字从左往右由糊变清，定住（028-H 单个镜头，收尾） | 3.2 | `demos-own/parts/arc-sweep-wordmark/preview-sheet.jpg` |
| icons-absorbed-logo-name | 一排图标被吸进去 · 缩成标志 · 产品名：钥匙换成小火花，App 图标出现，右边一排图标往左走、一个个被吸进去；App 图标缩成标志，打出产品名和一句定位 | 3.3 | `demos-own/parts/icons-absorbed-logo-name/preview-sheet.jpg` |
| feature-cards-social-wordmark | 功能小卡一张张顶上来 · 收成字标：照片条往上推走，四张白色功能小卡从下面一张张顶上来铺满蓝底（数字一直在跳、滑块在走）→ | 3.3 | `demos-own/parts/feature-cards-social-wordmark/preview-sheet.jpg` |
| light-shift-logo-letters | 换光 · Logo 逐字由浅变深 · 两行小字：第二句退场的同时背景换光，Logo 图形和名字逐字由浅变深，整组上移，两行小字收尾，停住 | 3.5 | `demos-own/parts/light-shift-logo-letters/preview-sheet.jpg` |
| mark-shrink-wordmark | 大标志猛缩 · 名字逐字浮出：深藏青底上一个超大白色标志猛地缩小，名字的字从它右边一个个浮出、字距收拢，下面淡入一行小字标语，静止落版 | 3.5 | `demos-own/parts/mark-shrink-wordmark/preview-sheet.jpg` |
| sky-logo-grow-name | 天空里长出 Logo · 名字抽出 · 标语：硬切深蓝天空，Logo 方块从小点边转边长出、三圈白线外扩；Logo 往左甩，名字从后面逐字抽出，标语逐词浮现，停住 | 3.6 | `demos-own/parts/sky-logo-grow-name/preview-sheet.jpg` |
| pills-split-logo-thumbs-cta | 胶囊甩开 · 标志弹出 · 截图弹进飞走 · 按钮：两颗胶囊往两边甩出画，标志从一个点弹大，名字从后面抽出来，四周界面截图错开弹进来又飞走；标志缩小让位，一颗圆点撑成按钮 | 3.6 | `demos-own/parts/pills-split-logo-thumbs-cta/preview-sheet.jpg` |
| wordmark-orb-period | 光球绕字标落成句点：硬切到字标，光球绕字标一圈越跑越小，顶进字缝变成方形句点，扫光从落点往左 | 3.7 | `demos-own/parts/wordmark-orb-period/preview-sheet.jpg` |
| overexpose-focus-logo-podium | 过曝退去对焦 · Logo 落到石台回弹：全白停住，过曝退去、整场从虚里对焦出来；Logo 由灰变墨落到圆台上回弹一次，两行字逐词出，停住时光影还在晃 | 3.7 | `demos-own/parts/overexpose-focus-logo-podium/preview-sheet.jpg` |
| white-rise-logo-letters | 从下往上淡成白 · Logo 逐字出：低角度慢漂的画面从下往上淡成白，同时 Logo 图形和名字逐字出，标语和底部小字跟上 | 3.7 | `demos-own/parts/white-rise-logo-letters/preview-sheet.jpg` |
| beam-burst-logo-name | 光束放射 · 亮成标志 · 名字：句子一甩淡掉，图标射出一圈绿色光束，光束里亮出标志，变白，下面出名字，落定 | 4.2 | `demos-own/parts/beam-burst-logo-name/preview-sheet.jpg` |
| dive-spin-icon-wordmark | 扑向圆圈越转越快 · 变成图标 · 擦出品牌字：字淡掉，镜头扑向那个圈、越转越快，线缩回蓝团，蓝团变成 App 图标；图标往左让位，右边擦出品牌字，定格 | 4.4 | `demos-own/parts/dive-spin-icon-wordmark/preview-sheet.jpg` |
| star-intro-name-lockup | "隆重介绍" · 冲进字缝 · 产品名升起：星纹从胶囊背后长出旋转，"隆重介绍"两帧一字打出，慢推后冲进字缝；产品名三帧一个字从底下升起，硬切到 Logo 落版 | 4.7 | `demos-own/parts/star-intro-name-lockup/preview-sheet.jpg` |
| strip-pixel-endcard | 卡里打字变宽 · 变成横贯全屏的黑条：鲜艳渐变底 + 白色辅助线框住一张淡紫卡，卡里打一句话、卡跟着字变宽 → 一下变成横贯全屏的黑色长条， | 4.7 | `demos-own/parts/strip-pixel-endcard/preview-sheet.jpg` |
| glow-word-trace-logo | 蓝光沿标志描一圈 · 变成实心标志：黑底中间一个渐变小字暗暗亮着 → 一束蓝光沿着标志的形状描一圈，小字随之淡掉 → 光描完变成实心白色字形标志，停住（013-H 单个镜头，收尾） | 4.8 | `demos-own/parts/glow-word-trace-logo/preview-sheet.jpg` |
| pixel-cursors-merge-logo | 像素小光标四处冒 · 合成标志：浅灰底 + 淡字符画漩涡，七八个像素小光标（蓝 / 米色 / 黑白 / 带照片的）四处冒出来晃一会儿， | 5.0 | `demos-own/parts/pixel-cursors-merge-logo/preview-sheet.jpg` |
| star-icon-headline-cta | 星标图标亮起 · 标题 · 行动按钮：一个白色星标图标亮起来缩小上移，名字、两行标题、输入条式的行动按钮依次出来，停住 | 5.0 | `demos-own/parts/star-icon-headline-cta/preview-sheet.jpg` |
| logo-check-build-cta | 标志一笔笔长出 · 名字 · 按钮被按下：白闪后硬切品牌色，毛玻璃方块里一笔笔"长"出标志（横条拉出 → 长成勾 → 一颗点落进来），图标缩小左移、名字从图标后面抽出，标语、按钮、网址依次出现；光标点一下按钮、两圈描边往外扩，品牌落版静看 | 5.4 | `demos-own/parts/logo-check-build-cta/preview-sheet.jpg` |
| cube-invert-name-url | 圆撑开底色反转 · 立方体缩成标志 · 名字网址：一个浅色圆从中心撑开、底色反转（线变蓝），立方体缩小上移成标志，名字、网址、命令一行行出来，停住 | 5.4 | `demos-own/parts/cube-invert-name-url/preview-sheet.jpg` |
| carousel-settle-logo | 轮播减速 · Logo 卡停在正中：轮播减速，最后一张 Logo 卡停在正中，停住 | 6.0 | `demos-own/parts/carousel-settle-logo/preview-sheet.jpg` |
