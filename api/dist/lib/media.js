"use strict";
// sizechart
// /100 -> square
// /100/100 -> square
// /100/120 -> rectangle
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomPhotoUrl = void 0;
const getRandomPhotoUrl = (size = '100') => {
    const randomSeed = Math.random().toString().substr(3, 5);
    return `https://picsum.photos/seed/${randomSeed}/${size}`;
};
exports.getRandomPhotoUrl = getRandomPhotoUrl;
