// 5 个口播版镜头的样片（每个约 4.5 秒）。左边灰块是人物窗的位置。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Ico, LK, SANS, SX, SY, TINT, cardShadow, mk} from './Kit';
import {BookmarkTap, CurvedReel, DMWall, OrbitCounter, PickWall, QuestionWall, SceneCuts, TwoLines} from './KouboShots';
export const KSHOTS_FRAMES = 1110;
const NAMES = ['card-orbit-counter · 大数字环绕', 'search-pick-shortlist · 一墙里挑', 'invite-wall-to-chat · 私信墙', 'notification-scene-cuts · 场景硬切', 'benefit-lines-to-logo · 两句收尾', 'complaint-wall-pick · 提问墙（整屏，在人物窗下面）', 'curved-carousel-reel · 弯曲轮播', 'bookmark-tap-check · 书签'];
const QS = ['零基础真的能学会吗', '你是怎么开始的', '普通人还有机会吗', '从哪个工具学起', '要不要先报个课', '一个人做得来吗', '学多久才能上手', '电脑配置要多高', '路径能复刻吗', '第一单怎么来的', '每天要学多久', '现在入场晚不晚', '怎么找到方向', '踩过哪些坑', '有没有教程', '上班族能学吗', '怎么坚持下来的', '不会英语怎么办', '做账号还是接单', '没有粉丝能做吗'];
export const KShotsTest: React.FC = () => {
  const f = useCurrentFrame(), c = mk(0, f), k = Math.min(7, Math.floor(c.t / 4.6));
  const In = (a: number, b: number, n: React.ReactNode) => (c.t >= a && c.t < b ? n : null);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 60% at 50% 45%, #ffffff 0%, #f3efe8 78%)', fontFamily: SANS}}>
      {In(23.0, 27.6, <QuestionWall c={c} at={23.2} out={26.9} questions={QS} />)}
      <div style={{position: 'absolute', left: 56, top: 212, width: 1040, height: 585, borderRadius: 28, background: '#ddd6ca', boxShadow: cardShadow(26, 0.55), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 800, color: '#9c9a98'}}>人物窗</div>
      <div style={{position: 'absolute', left: 56, top: 86, padding: '10px 24px', borderRadius: 999, background: '#fffdf9', boxShadow: cardShadow(10, 0.5), fontSize: 32, fontWeight: 800, color: LK.ink}}>{NAMES[k]}</div>
      <div style={{position: 'absolute', left: SX, top: SY, width: 740, height: 660}}>
        {In(0, 4.6, <OrbitCounter c={c} at={0.3} land={2.6} to={5000} unit="张图" lead="前前后后调试了" />)}
        {In(4.6, 9.2, <PickWall c={c} at={4.7} pickAt={[6.4, 7.3]} picks={[4, 2]} recedeAt={8.0} item={(i, on) => <><div style={{position: 'absolute', left: 12, top: 12, right: 12, height: 80, borderRadius: 12, background: `${TINT[i % 7]}26`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ico n="video" size={42} color={TINT[i % 7]} /></div><div style={{position: 'absolute', left: 14, top: 104, fontSize: 24, fontWeight: 800, color: on ? LK.accent : LK.ink2}}>{on ? '就看这个' : '教程'}</div></>} />)}
        {In(9.2, 14.2, <DMWall c={c} at={9.4} pushAt={10.3} sendAt={11.2} backAt={11.8} noAt={12.7} replyAt={13.4} />)}
        {In(14.2, 18.3, <SceneCuts c={c} at={14.4} out={18.0}><div style={{fontSize: 120, fontWeight: 900, color: LK.ink, lineHeight: 1}}>02:00</div><div style={{fontSize: 34, fontWeight: 800, color: LK.red, marginTop: 8}}>问题还没解决</div></SceneCuts>)}
        {In(32.2, 37, <div style={{position: 'absolute', left: 120, top: 150, width: 500, height: 330, borderRadius: 28, background: '#fffdf9', boxShadow: cardShadow(18, 0.55)}}><div style={{position: 'absolute', left: 36, top: 40, fontSize: 52, fontWeight: 900, color: LK.ink, lineHeight: 1.3}}>这条视频<br />建议你看完</div><div style={{position: 'absolute', right: -30, top: -30}}><BookmarkTap c={c} at={32.8} tapAt={34.2} /></div></div>)}
        {In(18.3, 23.0, <TwoLines c={c} a={[['想，', 18.6], ['全是问题', 19.1]]} b={[['做，', 20.4], ['都是答案', 20.9]]} swapAt={20.2} accentB={1} />)}
      </div>
      {In(27.6, 32.2, <CurvedReel c={c} box={[SX - 20, SY, 780, 660]} h={420} inAt={27.7} outAt={31.9} stops={[[27.7, 28.6, 0], [28.9, 29.9, 1], [30.2, 31.9, 2]]} cards={['报道', '杂志', '聘书'].map((tx, i) => ({w: 520, tint: TINT[i + 1], render: () => <><div style={{position: 'absolute', left: 24, top: 24, right: 24, height: 250, borderRadius: 18, background: `${TINT[i + 1]}26`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ico n="image" size={110} color={TINT[i + 1]} /></div><div style={{position: 'absolute', left: 28, top: 300, fontSize: 54, fontWeight: 900, color: LK.ink}}>{tx}<span style={{fontSize: 30, color: LK.ink3}}>　这里放真截图</span></div></>}))} />)}
    </AbsoluteFill>
  );
};
