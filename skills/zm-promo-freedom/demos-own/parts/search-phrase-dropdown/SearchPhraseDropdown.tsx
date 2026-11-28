// 小零件："在找什么" · 标题拉开成下拉 · 露出结果（99 帧，3.3 秒）
// 整个镜头就是这一个动作：SearchPhraseDropdown 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/search-phrase-dropdown/SearchPhraseDropdown.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SearchPhraseDropdown as Source} from '../../groups/search-phrase-dropdown/SearchPhraseDropdown'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const SEARCH_PHRASE_DROPDOWN_DURATION = 99;
export const SearchPhraseDropdown_RANGE = [0, 99] as const; // 在原镜头里的起止帧

export const SearchPhraseDropdown: React.FC = () => (
  <Sequence from={-0} durationInFrames={99} layout="none">
    <Source />
  </Sequence>
);
