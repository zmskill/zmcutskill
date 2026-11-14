# 镜头卡

每张卡讲一个镜头：它在演什么、动效核心、参数表、已知坑。代码在 `../../demos-own/<类>/<卡名>/`，样片是同目录的 `preview.mp4`。

规矩：

1. 每张卡背后有参考片或真实片子，用户看过样片认可才入库，不凭想象入库。
2. 分 10 类：opening / camera / transition / typography / ui-entrance / interaction / data / effects / rhythm / outro。
3. 卡片按 `TEMPLATE.md` 写，代码放 `demos-own/<类>/<卡名>/<组件名>.tsx`。
4. 每张卡标成熟度：候选 / 已用 / 稳定，规则见 `../groups/README.md`。新入库一律"候选"。
5. 几个镜头连起来才演完一段意思的，做成**镜头组**放 `../groups/`，不拆成几张卡。
6. 加了卡，记得在 `index/koubo-fit.md` 里按句子类型登记一行。
