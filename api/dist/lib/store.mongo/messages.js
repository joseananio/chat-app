"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
const client_1 = require("./client");
class Messages {
    conn() {
        return __awaiter(this, void 0, void 0, function* () {
            const { db } = yield client_1.connectToDatabase();
            return db.collection('messages');
        });
    }
    get(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.conn();
            return collection.findOne({ id: _id });
        });
    }
    add(message) {
        return __awaiter(this, void 0, void 0, function* () {
            message.createdAt = new Date().toISOString();
            if (!(yield this.get(message.id))) {
                const collection = yield this.conn();
                yield collection.insertOne(message);
            }
        });
    }
    getAll(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.conn();
            return yield collection.find({ room: roomId }).toArray();
        });
    }
    remove(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.conn();
            yield collection.deleteOne({ id: message.id });
        });
    }
}
exports.Messages = Messages;
