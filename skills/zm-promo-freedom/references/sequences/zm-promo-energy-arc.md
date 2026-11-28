---
name: zm-promo-energy-arc
一句话: 介绍整个产品时，全片能量怎么走——痛点钩子 → 品牌登场 → 一个主角站稳 → 功能一个个爬升（中间用大字卡喘气）→ 合影式收尾冲到最高
适用: 介绍整个产品（多个功能）的宣传片，30–45 秒为主（最长 60 秒）；分镜阶段先按它把时间分好，再挑镜头
段数: 5 段 + 每个功能前一张大字卡
---

## 为什么要这条骨架

介绍整个产品最容易做成"功能流水账"：每个镜头一样快、一样满，看到一半就累了。
这条骨架把节奏起伏（关键信息读得完、开场单主角站稳、高低能量交替、同种展示手法不重复、结尾合影推至峰值）排成一条能直接填数的能量弧线。
它是默认做法，不是死规定：某条片子要偏离，在设计 spec 里写清为什么。只讲一个功能时不用它，用 `zm-single-feature-five-beats.md`。

## 有歌时：音乐定结构（先读 `core-principles.md` 和 `music-and-beats.md`）

下面表里的"长度""能量"是**没有歌时的默认**。有歌时：先跑 `zm_music.py` 出音乐结构表和档位，每一段占几小节、放在歌的哪一段由它定——满的小节放事件最密的内容（登场、功能、证据、列举），要停下来看的（成果特写、落版）放在歌收住的地方；安静的小节超过档位上限就剪歌。每个镜头占几拍、每小节几个画面事件按档位（燃 / 中 / 松）。分镜写成总谱；拍子上放镜头最快的那一刻、切的那一帧、进场鼓包的顶点（`motion-and-camera.md`）。

## 五段

| 段 | 占多长 | 能量 | 这一段干什么 | 候选零件 |
|---|---|---|---|---|
| ⓪ 痛点钩子 | **至少 5 秒**（不按比例） | 低 → 中 | 一个最痛的真实场景 + 一句大字，大字来自产品简报里的吐槽原话（`story-and-copy.md`）；单独看也懂；**前 5 秒不出产品名** | 见文末"每一拍的候选零件" |
| ① 品牌登场 | 30 秒的片子占 8–12% | 低 | 产品名 / 标志落定，**保留 ≥1 秒可读时间**（镜头微推），再交给产品页面 | 见文末"每一拍的候选零件" |
| ② 一个主角站稳 | 12–15%（① + ② 合起来最多到 20%） | 中；质感最高、节奏从容 | 只给一个主角、演完一整个动作弧（≥3 秒），让观众先认清"这个产品最核心的价值是什么" | 见文末"每一拍的候选零件" |
| ③ 功能爬升 | 55–65% | 中高和低交替 | 一个镜头只讲一个功能，一种展示手法全片只当一次主角；每个功能前一张大字卡 | 见文末"每一拍的候选零件" |
| ④ 合影收尾 | 13–16% | 全片最高 | 前面出现过的功能各派一个代表元素，围住品牌字标；落定后保留 ≥1 秒可读时间 | 见文末"每一拍的候选零件" |

**大字卡**：每个功能出场前一张，写"功能名 + 具体好处"（`story-and-copy.md`），张数 = 功能数，每张约 50–55 帧（1.8 秒）。
功能多、片子短时，可以把大字直接压在功能镜头上（同样写"功能名 + 好处"、同样留够阅读时间），但不能省。

上表只是起点：这些镜头里的界面是演示内容，挑之前看样片图，确认它的动作能套到目标产品的真实画面上（`visual-and-parts.md`）。

## 怎么填

1. 列出必展功能清单，数出功能镜头有 N 个。
2. 按上表分总帧数：先扣掉 ⓪①②④ 和大字卡，剩下的平分给 ③。
   每个镜头**先划出阅读与呼吸时间**（关键信息落定可读 ≥30 帧，镜头保持慢推不冻帧），剩下的再排动作；不是排完动作再找空隙。
3. ③ 里高能量的镜头（连打、堆叠、飞镜）和稳的镜头（交互、读字）交替排；信息最密的镜头（文档、报告类）放在收尾前倒数第 2–3 个。
4. 每个空位从 `parts-own/INDEX.md` 挑（一拍一个零件，单个镜头不超过 6 秒），选中的读卡全文和卡上那份代码。
5. 镜头排好后，逐个接缝定转场（飞过去 / 速度接力硬切 / 同物接续），写进总谱和 `## 镜头怎么接`。

## 已知坑

- 把比例当死规定硬套：短片可以合并段落，但 ⓪ 痛点钩子、① 品牌可读 ≥1 秒、④ 最高点不能省。
- ③ 全是高能量镜头：连着都很猛，观众只觉得吵。高低交替和大字卡本身就是节奏。
- 大字卡写成第二遍口号：和收尾口号重复就删一个。

## 三条必做（`visual-and-parts.md`）

- 全片一套皮：底色最多两种，只换一次。
- 魔法瞬间之后至少一个镜头是真实成果的特写（占画面 60% 以上，可读 ≥1 秒且期间镜头慢推不冻帧，字读得清）。
- 零件按原速一口气播完，不停留、不慢放；时间不够就加零件。钩子的头 2 秒里要有东西在动。

## 每一拍的候选零件

按这一拍的职责，去下面这几类用途里挑（名字后面是秒数；全部零件见 `parts-own/INDEX.md`）。候选要打开样片图看过再定。
接缝怎么接见 `motion-and-camera.md`。

- **⓪ 痛点钩子** → **痛点**：text-wall-rows-swap（2.0s）、word-whip-chatbox-type（2.2s）、icons-toss-into-trash（2.2s）、list-side-question-you（2.5s）、dock-drag-into-trash（2.8s）、refusals-stack-up（2.9s）、complaint-wall-cursors-pick（3.3s）、icon-tiles-whip-line-cards（3.4s）、searchbar-punch-type-icons（3.5s）、pain-lines-retype-cards（3.8s）、scatter-cards-lost-teams（3.8s）、ai-chat-ask-list（4.5s）、message-ribbon-flow（5.0s）、red-bubbles-roll-big-lines（5.1s）、complaints-to-top3（5.8s）、ring-window-questions（5.8s）；**钩子**：phone-rush-toss（1.0s）、giant-word-whip-cut（1.6s）、pixel-cursors-gather-caret（1.9s）、filter-words-profile-roll（2.2s）、type-lines-converge（2.2s）、big-type-zoomout-insert-icons（2.4s）、orb-toggle-pop（2.7s）、type-swap-headline（2.9s）、tags-decode-orbit（2.9s）、portrait-circles-squeeze-word（2.9s）、giant-word-lens-ovals（3.0s）、notification-scene-cuts（3.2s）、giant-word-scroll-intro（3.2s）、quote-new-search-push（3.8s）、planet-glow-title-cut（3.9s）、logo-card-dissolve-tunnel（4.0s）、search-type-click-customers（4.0s）、code-flythrough-pill-type-name（4.1s）、trash-to-dock-button-swarm（4.2s）、words-float-photo-cloud（4.5s）、dot-burst-sphere（4.8s）
- **① 品牌登场** → **品牌落版**：dot-logo-slam-name（2.6s）、last-glyph-wordmark-solid（2.6s）、logo-letters-tagline（2.7s）、dock-type-genie-burst-name（2.8s）、star-spin-wordmark-arcs（3.0s）、two-words-part-url（3.1s）、halftone-ear-to-logo（3.1s）、arc-sweep-wordmark（3.2s）、icons-absorbed-logo-name（3.3s）、feature-cards-social-wordmark（3.3s）、light-shift-logo-letters（3.5s）、mark-shrink-wordmark（3.5s）、sky-logo-grow-name（3.6s）、pills-split-logo-thumbs-cta（3.6s）、wordmark-orb-period（3.7s）、overexpose-focus-logo-podium（3.7s）、white-rise-logo-letters（3.7s）、beam-burst-logo-name（4.2s）、dive-spin-icon-wordmark（4.4s）、star-intro-name-lockup（4.7s）、strip-pixel-endcard（4.7s）、glow-word-trace-logo（4.8s）、pixel-cursors-merge-logo（5.0s）、star-icon-headline-cta（5.0s）、logo-check-build-cta（5.4s）、cube-invert-name-url（5.4s）、carousel-settle-logo（6.0s）
- **② 一个主角站稳** → **结果登场**：form-card-build（1.4s）、app-home-rise-focus-input（1.8s）、pill-type-click-card-open（1.9s）、orb-to-button-card（2.0s）、send-rings-result-card（2.1s）、page-rise-big-word-swap（2.2s）、word-shrink-card-slam（2.3s）、cards-to-shortlist-table（2.4s）、cards-fly-into-app（2.5s）、toolbar-cover-zoomout-page（2.6s）、words-stagger-browser-reveal（3.0s）、panels-assemble-low-drift（3.1s）、result-page-tilt-scroll（3.2s）、pages-pop-fan-out（3.2s）、glow-line-to-list（3.2s）、dots-reveal-cards（3.2s）、rays-panel-wave-strobe（3.7s）、headline-input-to-page（4.0s）、route-to-search-box（4.5s）、headline-swap-dashboard-rise（4.6s）、notebook-ui-flow（4.7s）、progress-tilt-editor（4.9s）、glass-dashboard-arc（5.9s）；**功能演示**：ui-closeup-fill-scroll（1.7s）、card-hang-line-unfold（1.7s）、pullback-table-insert（1.9s）、whip-word-drag-sort（2.0s）、highlight-erase-retype（2.0s）、word-roll-side-card-edit（2.1s）、list-grow-toggles（2.2s）、comet-route-grid（2.4s）、circle-to-progress-bar（2.6s）、tilt-row-drawer-open（2.6s）、file-cards-swallow（2.7s）、blur-swap-stream-write（2.7s）、floating-cards-cursors（2.7s）、board-rise-push-bell-toast（2.9s）、folder-drop-chat（2.9s）、push-select-word-stretch-crowd（3.0s）、search-phrase-dropdown（3.3s）、picked-cards-expand（3.4s）、toggle-autopilot-cards（3.5s）、kanban-rise-drag-twice（3.8s）、line-avatars-roles-zoom（3.9s）、type-pan-select-restyle（3.9s）、dots-scatter-cards-rise（4.0s）、select-restyle-pixel-gradient（4.0s）、agent-panel-open-posts（4.2s）、field-slide-eye-stars（4.5s）、two-words-restyle-heavy-slant（4.5s）、spawn-tree-rows-focus（4.6s）、sphere-search-filter（4.8s）、word-ring-tools（4.8s）、page-tilt-dive-flicks（5.0s）、capsule-type-avatar-panel（5.3s）、bead-ring-picker（5.5s）、button-grow-sphere-spin（5.5s）、button-expand-create-card（5.8s）、row-status-flip-pan（5.8s）、type-button-slides（6.0s）
- **③ 功能爬升** → **功能演示**：ui-closeup-fill-scroll（1.7s）、card-hang-line-unfold（1.7s）、pullback-table-insert（1.9s）、whip-word-drag-sort（2.0s）、highlight-erase-retype（2.0s）、word-roll-side-card-edit（2.1s）、list-grow-toggles（2.2s）、comet-route-grid（2.4s）、circle-to-progress-bar（2.6s）、tilt-row-drawer-open（2.6s）、file-cards-swallow（2.7s）、blur-swap-stream-write（2.7s）、floating-cards-cursors（2.7s）、board-rise-push-bell-toast（2.9s）、folder-drop-chat（2.9s）、push-select-word-stretch-crowd（3.0s）、search-phrase-dropdown（3.3s）、picked-cards-expand（3.4s）、toggle-autopilot-cards（3.5s）、kanban-rise-drag-twice（3.8s）、line-avatars-roles-zoom（3.9s）、type-pan-select-restyle（3.9s）、dots-scatter-cards-rise（4.0s）、select-restyle-pixel-gradient（4.0s）、agent-panel-open-posts（4.2s）、field-slide-eye-stars（4.5s）、two-words-restyle-heavy-slant（4.5s）、spawn-tree-rows-focus（4.6s）、sphere-search-filter（4.8s）、word-ring-tools（4.8s）、page-tilt-dive-flicks（5.0s）、capsule-type-avatar-panel（5.3s）、bead-ring-picker（5.5s）、button-grow-sphere-spin（5.5s）、button-expand-create-card（5.8s）、row-status-flip-pan（5.8s）、type-button-slides（6.0s）；**证据**：success-card-avatars-pop（1.5s）、counter-roll-graph（1.5s）、amount-split-pill-tags（1.7s）、glass-number-cards（2.0s）、check-confetti-done（2.5s）、tilted-page-caption-swap（2.5s）、detail-drag-select-match（3.0s）、rank-first-card-map-pin（3.0s）、ai-recommend-percent-fill（3.0s）、phone-booking-toast-node-graph（3.5s）、revenue-line-dashboard（3.5s）、giant-word-dot-rings-faces（3.7s）、card-orbit-counter（3.8s）、pills-out-progress-dashboard（3.8s）、trail-dot-captions（4.3s）、glow-bar-benchmark（4.3s）、dots-word-perspective-list（4.3s）、giant-word-stack-faces（4.8s）、ray-burst-counter（5.9s）、pill-bar-report-slides（6.0s）；**列举**：two-circles-questions-swap（2.0s）、task-list-ticker（2.1s）、card-rain-pile-up（2.1s）、palette-steps-list（2.1s）、line-bend-second-card（2.4s）、card-wall-swap-submit（2.6s）、rows-slide-multi-cursor-pick（3.3s）、wall-pullback-pushin（3.4s）、line-turn-third-card-pull（3.4s）、icon-word-tint（3.7s）、word-slot-icon-zoom（3.7s）、tag-ring-spin-dive（4.2s）、dot-adapters-balls（4.2s）、orb-split-three-one-app（4.3s）、interface-wall-sync（4.5s）、logo-orbit-features（4.5s）、word-ten-fonts-grid-blob（4.7s）、star-lead-word-roll（4.9s）、photo-cards-arc-stair（4.9s）、connect-word-icon-reel（5.0s）、line-unfold-card-corridor（5.4s）、carousel-pass-whip（6.0s）；**输入**：input-closeup-send-drop（1.9s）、icons-orbit-input-type（2.1s）、input-grow-type-chase（2.2s）、dock-rise-click-ai-type（2.3s）、defocus-cut-searchbar-type（2.5s）、input-glow-type-send（3.2s）、big-type-zoomout-send（4.3s）、idea-card-role-pills（4.3s）、circle-to-button-ask-rings（4.6s）、star-pill-answer-cards（4.7s）；**点击确认**：send-tone-dropdown（1.3s）、pullback-cursor-click（1.5s）、triple-click-insert（1.5s）、button-press-rings（1.8s）、big-card-liquid-invite（2.2s）、bookmark-tap-check（2.3s）、clock-check-card（2.4s）、generate-button-press-dot-wave（2.9s）
- **大字卡** → **字卡**：neon-word-everywhere（1.0s）、sentence-folder-tile（1.2s）、pills-slide-words-light（1.4s）、scramble-decode-word（1.4s）、small-words-drop（1.4s）、words-append-line（1.5s）、name-wipe-word-swap（1.5s）、big-lines-slam-exit（1.7s）、three-words-title（1.7s）、word-card-rise（1.9s）、type-shrink-glow-line（1.9s）、type-phrase-key-insert（1.9s）、dot-orbit-sentence（2.0s）、words-burst-whip-swap（2.1s）、word-swap-orbit（2.3s）、wash-white-logo-lines（2.3s）、title-reply-cards-fly（2.4s）、orange-circle-ovals-turn-blue（2.4s）、words-morph-line（2.5s）、sentence-grows-around-icon（2.5s）、small-type-pixel-word-gradient（2.8s）、benefit-lines-word-by-word（2.9s）、rings-blue-line-url（2.9s）、glitch-blocks-grow-word（3.0s）、outline-word-to-heat-gradient（3.1s）、words-in-dot-rings-frames（3.3s）、words-fly-pill-open（3.6s）、condensed-tall-lines-reweight（3.6s）、glyphs-drawn-one-by-one（3.8s）、mixed-glyph-type-glitch（4.0s）、words-split-lock-replace（4.1s）、carousel-type-slots（4.6s）、blue-poster-card-type-fonts（4.9s）、lines-keep-word-swap-brand（5.3s）、cards-leave-dots-form-word（5.6s）
- **④ 合影收尾** → **品牌落版**：dot-logo-slam-name（2.6s）、last-glyph-wordmark-solid（2.6s）、logo-letters-tagline（2.7s）、dock-type-genie-burst-name（2.8s）、star-spin-wordmark-arcs（3.0s）、two-words-part-url（3.1s）、halftone-ear-to-logo（3.1s）、arc-sweep-wordmark（3.2s）、icons-absorbed-logo-name（3.3s）、feature-cards-social-wordmark（3.3s）、light-shift-logo-letters（3.5s）、mark-shrink-wordmark（3.5s）、sky-logo-grow-name（3.6s）、pills-split-logo-thumbs-cta（3.6s）、wordmark-orb-period（3.7s）、overexpose-focus-logo-podium（3.7s）、white-rise-logo-letters（3.7s）、beam-burst-logo-name（4.2s）、dive-spin-icon-wordmark（4.4s）、star-intro-name-lockup（4.7s）、strip-pixel-endcard（4.7s）、glow-word-trace-logo（4.8s）、pixel-cursors-merge-logo（5.0s）、star-icon-headline-cta（5.0s）、logo-check-build-cta（5.4s）、cube-invert-name-url（5.4s）、carousel-settle-logo（6.0s）
- **段和段之间** → **转场**：pill-rows-slide-claims（0.8s）、swirl-turn-dot-flood（1.7s）、comet-dots-card（1.8s）、photo-flash-bulge（1.8s）、big-line-pixel-drop-out（1.9s）、glow-flood-panel-reveal（2.9s）、form-tilt-road（3.1s）、iso-cube-rings（3.2s）、tags-ring-implode（3.3s）、photo-lens-cursor-type（4.3s）；**过渡动作**：jelly-orb-around-title（1.7s）、drawer-close-table-slide（1.7s）、sphere-collapse-back（1.9s）、cards-dissolve-to-dots-back（2.3s）、dots-sphere-cube-wire（2.6s）、generating-studio（2.7s）、zoomout-whole-sentence-cursors（2.7s）、word-to-dots-gather（2.9s）、dock-grab-folder-drag（3.0s）
