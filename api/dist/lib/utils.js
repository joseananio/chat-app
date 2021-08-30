"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomId = void 0;
const { v4: uuidv4 } = require('uuid');
const getRandomId = () => {
    return uuidv4();
};
exports.getRandomId = getRandomId;
