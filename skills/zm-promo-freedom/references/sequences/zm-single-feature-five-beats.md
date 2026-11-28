---
name: zm-single-feature-five-beats
一句话: 讲一个功能的全片骨架——真实痛点钩子 → 演出问题 → 魔法瞬间登场（落在音乐炸开）→ 一个证据 → 收尾
适用: 只讲一个功能 / 一次更新的宣传片，15–30s；先有歌，按小节排
段数: 5 拍
---

## 意图

一条片子只回答观众最大的那一个疑问（讲法见 `story-and-copy.md`）。
与核心原则配合使用：关键信息留够阅读时间（期间镜头慢推不死停）、节奏松紧有度、整屏特效全片 ≤3 处、开场聚焦单一主角。这是默认骨架，若需偏离可在设计 spec 中说明理由。

## 有歌时：音乐定结构（先读 `core-principles.md` 和 `music-and-beats.md`）

下面表里的"长度""能量"是**没有歌时的默认**。有歌时：先跑 `zm_music.py` 出音乐结构表和档位，每一段占几小节、放在歌的哪一段由它定——满的小节放事件最密的内容（登场、功能、证据、列举），要停下来看的（成果特写、落版）放在歌收住的地方；安静的小节超过档位上限就剪歌。每个镜头占几拍、每小节几个画面事件按档位（燃 / 中 / 松）。分镜写成总谱；拍子上放镜头最快的那一刻、切的那一帧、进场鼓包的顶点（`motion-and-camera.md`）。

## 段位表（按小节写，120 拍的歌一小节 2 秒）

| 拍 | 默认长度 | 能量（轻重线 0–3） | 职责 | 候选零件 |
|---|---|---|---|---|
| ① 钩子 | 1–2 小节 | 1 | 真实痛点场景 + 一句大字，单独看也能懂；前 5 秒不出产品名 | 见文末"每一拍的候选零件" |
| ② 问题 | 2 小节 | 1–2 | 把烦演出来（堆积、等待、重复劳动）+ 一句大字点破；音乐还没满 | 见文末"每一拍的候选零件" |
| ③ 登场 | 2–3 小节 | **3（全片唯一）** | 产品名 + 魔法瞬间；落在音乐炸开的第一拍，之前安静半拍到一拍；主体动作 ≥3 秒 | 见文末"每一拍的候选零件" |
| ④ 证据 | 2–3 小节 | 2 | 一个能一眼看懂的数字或前后对比，配大字；音乐最满 | 见文末"每一拍的候选零件" |
| ⑤ 收尾 | 1–2 小节 | 1–2 | 产品名 + 入口 + 行动句；品牌落定保留 ≥1 秒可读时间 | 见文末"每一拍的候选零件" |

时长需要拉长到 30 秒时，多出来的小节给②和④，不加新内容。歌的结构和五拍对不上时
（比如炸开来得太晚），换一段歌或在小节线上剪歌，不要为了迁就歌加内容。

## 填空流程

1. 拆歌：按 `music-and-beats.md` 分析节奏并校验反拍，标出炸开和安静的小节。
2. 按五拍选小节，剪成片长；③登场的第一拍 = 炸开的第一拍。
3. 写总谱：每行一个画面事件，写清音乐、画面、接法、音效与层数。
   换场与大变化落在小节首拍或最强重拍，小动作落在拍上。
4. 每拍标轻重线 0–3：画面的轻重跟着音乐走；③是唯一的 3，它前面至少半拍是 0 或 1。
5. 逐拍从 `parts-own/INDEX.md` 挑零件（一拍一个零件，单个镜头不超过 6 秒），选中的读卡全文 + 准确代码。
6. 先划出阅读时间（落版 ≥30 帧、关键字读得完；这时镜头慢推着，不是冻帧），再排动作。

## 已知坑

- 每一拍都要大动：读作嘈杂、看不清（不要机械逐拍全屏跳动）。
- 魔法瞬间前一样忙：魔法瞬间就不突出，爆发前必须留蓄力反差。
- 只演不说：观众不知道在演什么——问题、登场、证据三拍都要有一句大字。

## 三条必做（`visual-and-parts.md`）

- 全片一套皮：底色最多两种，只换一次。
- 魔法瞬间之后至少一个镜头是真实成果的特写（占画面 60% 以上，可读 ≥1 秒且期间镜头慢推不冻帧，字读得清）。
- 零件按原速一口气播完，不停留、不慢放；时间不够就加零件。钩子的头 2 秒里要有东西在动。

## 每一拍的候选零件

按这一拍的职责，去下面这几类用途里挑（名字后面是秒数；全部零件见 `parts-own/INDEX.md`）。候选要打开样片图看过再定。
接缝怎么接见 `motion-and-camera.md`。

- **① 钩子** → **钩子**：phone-rush-toss（1.0s）、giant-word-whip-cut（1.6s）、pixel-cursors-gather-caret（1.9s）、filter-words-profile-roll（2.2s）、type-lines-converge（2.2s）、big-type-zoomout-insert-icons（2.4s）、orb-toggle-pop（2.7s）、type-swap-headline（2.9s）、tags-decode-orbit（2.9s）、portrait-circles-squeeze-word（2.9s）、giant-word-lens-ovals（3.0s）、notification-scene-cuts（3.2s）、giant-word-scroll-intro（3.2s）、quote-new-search-push（3.8s）、planet-glow-title-cut（3.9s）、logo-card-dissolve-tunnel（4.0s）、search-type-click-customers（4.0s）、code-flythrough-pill-type-name（4.1s）、trash-to-dock-button-swarm（4.2s）、words-float-photo-cloud（4.5s）、dot-burst-sphere（4.8s）；**痛点**：text-wall-rows-swap（2.0s）、word-whip-chatbox-type（2.2s）、icons-toss-into-trash（2.2s）、list-side-question-you（2.5s）、dock-drag-into-trash（2.8s）、refusals-stack-up（2.9s）、complaint-wall-cursors-pick（3.3s）、icon-tiles-whip-line-cards（3.4s）、searchbar-punch-type-icons（3.5s）、pain-lines-retype-cards（3.8s）、scatter-cards-lost-teams（3.8s）、ai-chat-ask-list（4.5s）、message-ribbon-flow（5.0s）、red-bubbles-roll-big-lines（5.1s）、complaints-to-top3（5.8s）、ring-window-questions（5.8s）
- **② 问题** → **痛点**：text-wall-rows-swap（2.0s）、word-whip-chatbox-type（2.2s）、icons-toss-into-trash（2.2s）、list-side-question-you（2.5s）、dock-drag-into-trash（2.8s）、refusals-stack-up（2.9s）、complaint-wall-cursors-pick（3.3s）、icon-tiles-whip-line-cards（3.4s）、searchbar-punch-type-icons（3.5s）、pain-lines-retype-cards（3.8s）、scatter-cards-lost-teams（3.8s）、ai-chat-ask-list（4.5s）、message-ribbon-flow（5.0s）、red-bubbles-roll-big-lines（5.1s）、complaints-to-top3（5.8s）、ring-window-questions（5.8s）；**列举**：two-circles-questions-swap（2.0s）、task-list-ticker（2.1s）、card-rain-pile-up（2.1s）、palette-steps-list（2.1s）、line-bend-second-card（2.4s）、card-wall-swap-submit（2.6s）、rows-slide-multi-cursor-pick（3.3s）、wall-pullback-pushin（3.4s）、line-turn-third-card-pull（3.4s）、icon-word-tint（3.7s）、word-slot-icon-zoom（3.7s）、tag-ring-spin-dive（4.2s）、dot-adapters-balls（4.2s）、orb-split-three-one-app（4.3s）、interface-wall-sync（4.5s）、logo-orbit-features（4.5s）、word-ten-fonts-grid-blob（4.7s）、star-lead-word-roll（4.9s）、photo-cards-arc-stair（4.9s）、connect-word-icon-reel（5.0s）、line-unfold-card-corridor（5.4s）、carousel-pass-whip（6.0s）
- **③ 登场** → **输入**：input-closeup-send-drop（1.9s）、icons-orbit-input-type（2.1s）、input-grow-type-chase（2.2s）、dock-rise-click-ai-type（2.3s）、defocus-cut-searchbar-type（2.5s）、input-glow-type-send（3.2s）、big-type-zoomout-send（4.3s）、idea-card-role-pills（4.3s）、circle-to-button-ask-rings（4.6s）、star-pill-answer-cards（4.7s）；**点击确认**：send-tone-dropdown（1.3s）、pullback-cursor-click（1.5s）、triple-click-insert（1.5s）、button-press-rings（1.8s）、big-card-liquid-invite（2.2s）、bookmark-tap-check（2.3s）、clock-check-card（2.4s）、generate-button-press-dot-wave（2.9s）；**结果登场**：form-card-build（1.4s）、app-home-rise-focus-input（1.8s）、pill-type-click-card-open（1.9s）、orb-to-button-card（2.0s）、send-rings-result-card（2.1s）、page-rise-big-word-swap（2.2s）、word-shrink-card-slam（2.3s）、cards-to-shortlist-table（2.4s）、cards-fly-into-app（2.5s）、toolbar-cover-zoomout-page（2.6s）、words-stagger-browser-reveal（3.0s）、panels-assemble-low-drift（3.1s）、result-page-tilt-scroll（3.2s）、pages-pop-fan-out（3.2s）、glow-line-to-list（3.2s）、dots-reveal-cards（3.2s）、rays-panel-wave-strobe（3.7s）、headline-input-to-page（4.0s）、route-to-search-box（4.5s）、headline-swap-dashboard-rise（4.6s）、notebook-ui-flow（4.7s）、progress-tilt-editor（4.9s）、glass-dashboard-arc（5.9s）
- **④ 证据** → **证据**：success-card-avatars-pop（1.5s）、counter-roll-graph（1.5s）、amount-split-pill-tags（1.7s）、glass-number-cards（2.0s）、check-confetti-done（2.5s）、tilted-page-caption-swap（2.5s）、detail-drag-select-match（3.0s）、rank-first-card-map-pin（3.0s）、ai-recommend-percent-fill（3.0s）、phone-booking-toast-node-graph（3.5s）、revenue-line-dashboard（3.5s）、giant-word-dot-rings-faces（3.7s）、card-orbit-counter（3.8s）、pills-out-progress-dashboard（3.8s）、trail-dot-captions（4.3s）、glow-bar-benchmark（4.3s）、dots-word-perspective-list（4.3s）、giant-word-stack-faces（4.8s）、ray-burst-counter（5.9s）、pill-bar-report-slides（6.0s）；**功能演示**：ui-closeup-fill-scroll（1.7s）、card-hang-line-unfold（1.7s）、pullback-table-insert（1.9s）、whip-word-drag-sort（2.0s）、highlight-erase-retype（2.0s）、word-roll-side-card-edit（2.1s）、list-grow-toggles（2.2s）、comet-route-grid（2.4s）、circle-to-progress-bar（2.6s）、tilt-row-drawer-open（2.6s）、file-cards-swallow（2.7s）、blur-swap-stream-write（2.7s）、floating-cards-cursors（2.7s）、board-rise-push-bell-toast（2.9s）、folder-drop-chat（2.9s）、push-select-word-stretch-crowd（3.0s）、search-phrase-dropdown（3.3s）、picked-cards-expand（3.4s）、toggle-autopilot-cards（3.5s）、kanban-rise-drag-twice（3.8s）、line-avatars-roles-zoom（3.9s）、type-pan-select-restyle（3.9s）、dots-scatter-cards-rise（4.0s）、select-restyle-pixel-gradient（4.0s）、agent-panel-open-posts（4.2s）、field-slide-eye-stars（4.5s）、two-words-restyle-heavy-slant（4.5s）、spawn-tree-rows-focus（4.6s）、sphere-search-filter（4.8s）、word-ring-tools（4.8s）、page-tilt-dive-flicks（5.0s）、capsule-type-avatar-panel（5.3s）、bead-ring-picker（5.5s）、button-grow-sphere-spin（5.5s）、button-expand-create-card（5.8s）、row-status-flip-pan（5.8s）、type-button-slides（6.0s）
- **⑤ 收尾** → **品牌落版**：dot-logo-slam-name（2.6s）、last-glyph-wordmark-solid（2.6s）、logo-letters-tagline（2.7s）、dock-type-genie-burst-name（2.8s）、star-spin-wordmark-arcs（3.0s）、two-words-part-url（3.1s）、halftone-ear-to-logo（3.1s）、arc-sweep-wordmark（3.2s）、icons-absorbed-logo-name（3.3s）、feature-cards-social-wordmark（3.3s）、light-shift-logo-letters（3.5s）、mark-shrink-wordmark（3.5s）、sky-logo-grow-name（3.6s）、pills-split-logo-thumbs-cta（3.6s）、wordmark-orb-period（3.7s）、overexpose-focus-logo-podium（3.7s）、white-rise-logo-letters（3.7s）、beam-burst-logo-name（4.2s）、dive-spin-icon-wordmark（4.4s）、star-intro-name-lockup（4.7s）、strip-pixel-endcard（4.7s）、glow-word-trace-logo（4.8s）、pixel-cursors-merge-logo（5.0s）、star-icon-headline-cta（5.0s）、logo-check-build-cta（5.4s）、cube-invert-name-url（5.4s）、carousel-settle-logo（6.0s）
- **拍和拍之间、大字** → **字卡**：neon-word-everywhere（1.0s）、sentence-folder-tile（1.2s）、pills-slide-words-light（1.4s）、scramble-decode-word（1.4s）、small-words-drop（1.4s）、words-append-line（1.5s）、name-wipe-word-swap（1.5s）、big-lines-slam-exit（1.7s）、three-words-title（1.7s）、word-card-rise（1.9s）、type-shrink-glow-line（1.9s）、type-phrase-key-insert（1.9s）、dot-orbit-sentence（2.0s）、words-burst-whip-swap（2.1s）、word-swap-orbit（2.3s）、wash-white-logo-lines（2.3s）、title-reply-cards-fly（2.4s）、orange-circle-ovals-turn-blue（2.4s）、words-morph-line（2.5s）、sentence-grows-around-icon（2.5s）、small-type-pixel-word-gradient（2.8s）、benefit-lines-word-by-word（2.9s）、rings-blue-line-url（2.9s）、glitch-blocks-grow-word（3.0s）、outline-word-to-heat-gradient（3.1s）、words-in-dot-rings-frames（3.3s）、words-fly-pill-open（3.6s）、condensed-tall-lines-reweight（3.6s）、glyphs-drawn-one-by-one（3.8s）、mixed-glyph-type-glitch（4.0s）、words-split-lock-replace（4.1s）、carousel-type-slots（4.6s）、blue-poster-card-type-fonts（4.9s）、lines-keep-word-swap-brand（5.3s）、cards-leave-dots-form-word（5.6s）；**转场**：pill-rows-slide-claims（0.8s）、swirl-turn-dot-flood（1.7s）、comet-dots-card（1.8s）、photo-flash-bulge（1.8s）、big-line-pixel-drop-out（1.9s）、glow-flood-panel-reveal（2.9s）、form-tilt-road（3.1s）、iso-cube-rings（3.2s）、tags-ring-implode（3.3s）、photo-lens-cursor-type（4.3s）；**过渡动作**：jelly-orb-around-title（1.7s）、drawer-close-table-slide（1.7s）、sphere-collapse-back（1.9s）、cards-dissolve-to-dots-back（2.3s）、dots-sphere-cube-wire（2.6s）、generating-studio（2.7s）、zoomout-whole-sentence-cursors（2.7s）、word-to-dots-gather（2.9s）、dock-grab-folder-drag（3.0s）
