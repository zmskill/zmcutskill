// 上限文案验证用：本组没有文字字段，只把停留区拉满
import React from 'react';
import {PhotoFlashBulgeGroup, photoFrames, planPhoto, PHOTO_FLASH_BULGE_CONTRACT} from './PhotoFlashBulge';

const C = PHOTO_FLASH_BULGE_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planPhoto(FULL);
export const PHOTO_FLASH_BULGE_MAX_DURATION = photoFrames(EXTRAS);
export const PhotoFlashBulgeMax: React.FC = () => <PhotoFlashBulgeGroup extras={EXTRAS} />;
