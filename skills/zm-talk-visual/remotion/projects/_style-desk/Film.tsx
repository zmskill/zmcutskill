// 书桌风格：每一段一个 composition（竖屏 1080×1920）。内容在 content.ts，这里不用改。
import React from 'react';
import {SEGMENTS} from './content';
import {SegmentView} from './Scenes';

export const DESK_SEGMENTS = SEGMENTS.map((seg) => ({id: seg.id, frames: Math.round((seg.to - seg.from) * 30), component: (() => <SegmentView seg={seg} />) as React.FC}));
