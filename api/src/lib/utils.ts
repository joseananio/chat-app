const { v4: uuidv4 } = require('uuid');

export const getRandomId = () => {
  return uuidv4();
};
