// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {CardRainInputs, CardRainPixelWordGroup, cardRainFrames, planCardRain, CARD_RAIN_PIXEL_WORD_CONTRACT} from './CardRainPixelWord';

export const CARD_RAIN_MAX_INPUTS: CardRainInputs = {
  word: '一万种生活感', // 6 字
  phoneTitle: '周末慢慢吃的早餐', // 8 字
  phoneNote: '煎蛋吐司和一杯手冲咖啡配果酱', // 14 字
  phoneUser: '@小满的厨房',
  notes: ['今天的早餐', '阳台的绿萝', '海边散散步', '读完第三本', '手冲咖啡馆', '周末去爬山', '傍晚的晚霞', '楼下的橘猫', '花市的一角', '雪山徒步记', '带饭的日记', '夜跑五公里'], // 各 5 字
};
const C = CARD_RAIN_PIXEL_WORD_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planCardRain(FULL);
export const CARD_RAIN_PIXEL_WORD_MAX_DURATION = cardRainFrames(EXTRAS);
export const CardRainPixelWordMax: React.FC = () => <CardRainPixelWordGroup inputs={CARD_RAIN_MAX_INPUTS} extras={EXTRAS} />;
