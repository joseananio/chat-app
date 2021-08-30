"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
class Messages {
    constructor() {
        this._messages = [];
    }
    get(_id) {
        return this._messages.find(({ id }) => id === _id);
    }
    add(message) {
        message.createdAt = new Date().toISOString();
        if (!this.get(message.id)) {
            this._messages = [message, ...this._messages];
        }
    }
    remove(message) {
        this._messages = this._messages.filter((_message) => _message.id !== message.id);
    }
    getAll(room) {
        return this._messages.filter((message) => message.room === room.id);
    }
}
exports.Messages = Messages;
