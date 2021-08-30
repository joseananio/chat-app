"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rooms = void 0;
class Rooms {
    constructor() {
        this._rooms = [];
    }
    get(_id) {
        return this._rooms.find(({ id }) => id === _id);
    }
    add(room) {
        room.createdAt = new Date().toISOString();
        if (!this.get(room.name)) {
            this._rooms = [room, ...this._rooms];
        }
    }
    remove(room) {
        this._rooms = this._rooms.filter((_room) => _room.name !== room.name);
    }
    getAll() {
        return this._rooms;
    }
}
exports.Rooms = Rooms;
