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
exports.initializeSocket = void 0;
const logger_1 = require("@7speck/logger");
const socket_io_1 = require("socket.io");
const client_1 = require("./lib/store.mongo/client");
const index_1 = require("./lib/store.mongo/index");
const utils_1 = require("./lib/utils");
const initializeSocket = (server) => {
    const { users, rooms, messages } = index_1.mongo_db_src;
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.SOCKET_CORS_HOST,
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
        // user connects, prepar socket listeners
        // User is disconnected
        socket.on('disconnect', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            logger_1.logger.warn('disconnected: ', socket.user);
            // await users.offline(socket.user);
            yield users.remove(socket.user);
            const _users = yield users.getAll();
            socket.emit('showRooms', yield rooms.getAll());
            socket.broadcast.emit('showUsers', _users);
            io.emit('notice', `${(_a = socket.user) === null || _a === void 0 ? void 0 : _a.name} left`);
        }));
        // user joins socket
        // return the rooms available to the user
        socket.on('register', (user) => __awaiter(void 0, void 0, void 0, function* () {
            if (user.name && user.identifier) {
                socket.user = user;
                yield users.add(socket.user);
                const _rooms = yield rooms.getAll();
                const _users = yield users.getAll();
                io.emit('showRooms', _rooms);
                io.emit('showUsers', _users);
                // socket.broadcast.emit('showUsers', _users);
                logger_1.logger.info(`\\registered\\${user.identifier}: ${user.name} `);
            }
        }));
        // user requests for rooms??
        socket.on('getRooms', () => __awaiter(void 0, void 0, void 0, function* () {
            const _rooms = yield rooms.getAll();
            logger_1.logger.info(`INFO: \\getRooms\\${socket.user.identifier} -> [showRooms] ${_rooms.length}`);
            socket.emit('showRooms', _rooms);
        }));
        // join or rejoin room
        socket.on('createRoom', (room) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            room.id = room.id || utils_1.getRandomId();
            yield rooms.add(room);
            socket.join(room.id);
            // tell the creator
            socket.emit('newRoomUpdate', room);
            const _rooms = yield rooms.getAll();
            if (room.private) {
                io.to(room.id).emit('showRooms', _rooms);
            }
            else {
                io.emit('showRooms', _rooms);
            }
            io.to(room.id).emit('notice', ((_b = socket.user) === null || _b === void 0 ? void 0 : _b.name) + ' created room ' + room.name);
        }));
        socket.on('joinRoom', (room) => __awaiter(void 0, void 0, void 0, function* () {
            var _c;
            socket.leave(room.id);
            socket.join(room.id);
            io.to(room.id).emit('notice', ((_c = socket.user) === null || _c === void 0 ? void 0 : _c.name) + ' joined ' + room.name);
            const _messages = yield messages.getAll(room.id);
            socket.emit('previousMessages', _messages);
        }));
        socket.on('block', ({ user, shouldBlock }) => __awaiter(void 0, void 0, void 0, function* () {
            yield users.block(socket.user, user, shouldBlock);
            const _user = yield users.get(socket.user.identifier);
            socket.user = _user;
            const _users = yield users.getAll();
            logger_1.logger.info(`${socket.user.name} ${shouldBlock ? 'blocked' : 'unblocked'} ${user.name}`);
            io.emit('showUsers', _users);
        }));
        socket.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
            if (message === null || message === void 0 ? void 0 : message.message) {
                const room = yield rooms.get(message.room);
                if (room) {
                    const _message = Object.assign(Object.assign({}, message), { id: utils_1.getRandomId() });
                    yield messages.add(_message);
                    io.to(room.id).emit('message', _message);
                    logger_1.logger.imp('msg: ' + _message.id);
                }
                else {
                    socket.emit('message failed', {
                        room: message.room,
                        error: 'room not found',
                    });
                }
            }
        }));
        // We want to reset the db: DEMO Only!!
        socket.on('reset', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                logger_1.logger.info('Reseting System');
                const { db } = yield client_1.connectToDatabase();
                // atlas might need at least one collection to keep db and settings
                // mongo throws error if collection exists
                try {
                    yield db.createCollection('dummy');
                }
                catch (error) { }
                // drop all usefull collections
                yield db.collection('users').drop();
                yield db.collection('rooms').drop();
                yield db.collection('members').drop();
                logger_1.logger.info('Reset DONE');
            }
            catch (error) {
                console.error(error);
                logger_1.logger.warn('Reset possibly failed');
            }
        }));
        // notify others of new user
        io.emit('notice', `A new user is joining`);
    }));
    logger_1.logger.info('socket started');
};
exports.initializeSocket = initializeSocket;
