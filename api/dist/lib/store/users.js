"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
// TODO, does not include offline features
class Users {
    constructor() {
        this._users = [];
    }
    get(_identifier) {
        return this._users.find(({ identifier }) => identifier === _identifier);
    }
    add(user) {
        if (!this.get(user.identifier)) {
            this._users = [user, ...this._users];
        }
    }
    remove(user) {
        if (user === null || user === void 0 ? void 0 : user.identifier) {
            this._users = this._users.filter((_user) => _user.identifier !== user.identifier);
        }
    }
    getAll() {
        return this._users;
    }
}
exports.Users = Users;
