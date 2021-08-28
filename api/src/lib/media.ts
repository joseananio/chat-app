// sizechart
// /100 -> square
// /100/100 -> square
// /100/120 -> rectangle

export const getRandomPhotoUrl = (size = '100') => {
  const randomSeed = Math.random().toString().substr(3, 5);
  return `https://picsum.photos/seed/${randomSeed}/${size}`;
};
