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
exports.connectToDatabase = void 0;
const logger_1 = require("@7speck/logger");
const mongodb_1 = require("mongodb");
require('dotenv').config();
const { MONGODB_URI, MONGODB_DB } = process.env;
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable ');
}
if (!MONGODB_DB) {
    throw new Error('Please define the MONGODB_DB environment variable ');
}
let cached = global.mongo;
if (!cached)
    cached = global.mongo = {};
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        if (cached.conn)
            return cached.conn;
        if (!cached.promise) {
            const conn = {};
            const opts = {};
            cached.promise = mongodb_1.MongoClient.connect(MONGODB_URI, opts)
                .then((client) => {
                conn.client = client;
                return client.db(MONGODB_DB);
            })
                .then((db) => {
                conn.db = db;
                cached.conn = conn;
            });
        }
        logger_1.logger.imp('Database connected!');
        yield cached.promise;
        return cached.conn;
    });
}
exports.connectToDatabase = connectToDatabase;
