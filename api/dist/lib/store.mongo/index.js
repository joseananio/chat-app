"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongo_db_src = void 0;
const messages_1 = require("./messages");
const rooms_1 = require("./rooms");
const users_1 = require("./users");
exports.mongo_db_src = {
    users: new users_1.Users(),
    rooms: new rooms_1.Rooms(),
    messages: new messages_1.Messages(),
};
