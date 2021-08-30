import { logger } from '@7speck/logger';
import { Server } from 'socket.io';
import { connectToDatabase } from './lib/store.mongo/client';
import { mongo_db_src } from './lib/store.mongo/index';
import { getRandomId } from './lib/utils';
import { INewMessage, IRoom, IUser } from './types';

export const initializeSocket = (server) => {
  const { users, rooms, messages } = mongo_db_src;

  const io = new Server(server, {
    cors: {
      origin: process.env.SOCKET_CORS_HOST,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', async (socket: any) => {
    // user connects, prepar socket listeners

    // User is disconnected
    socket.on('disconnect', async () => {
      logger.warn('disconnected: ', socket.user);

      // await users.offline(socket.user);
      await users.remove(socket.user);

      const _users = await users.getAll();

      socket.emit('showRooms', await rooms.getAll());
      socket.broadcast.emit('showUsers', _users);

      io.emit('notice', `${socket.user?.name} left`);
    });

    // user joins socket
    // return the rooms available to the user
    socket.on('register', async (user: IUser) => {
      if (user.name && user.identifier) {
        socket.user = user;
        await users.add(socket.user);

        const _rooms = await rooms.getAll();
        const _users = await users.getAll();

        io.emit('showRooms', _rooms);
        io.emit('showUsers', _users);
        // socket.broadcast.emit('showUsers', _users);
        logger.info(`\\registered\\${user.identifier}: ${user.name} `);
      }
    });

    // user requests for rooms??
    socket.on('getRooms', async () => {
      const _rooms = await rooms.getAll();
      logger.info(
        `INFO: \\getRooms\\${socket.user.identifier} -> [showRooms] ${_rooms.length}`
      );
      socket.emit('showRooms', _rooms);
    });

    // join or rejoin room
    socket.on('createRoom', async (room: IRoom) => {
      room.id = room.id || getRandomId();

      await rooms.add(room);
      socket.join(room.id);

      // tell the creator
      socket.emit('newRoomUpdate', room);

      const _rooms = await rooms.getAll();

      if (room.private) {
        io.to(room.id).emit('showRooms', _rooms);
      } else {
        io.emit('showRooms', _rooms);
      }

      io.to(room.id).emit(
        'notice',
        socket.user?.name + ' created room ' + room.name
      );
    });

    socket.on('joinRoom', async (room: IRoom) => {
      socket.leave(room.id);
      socket.join(room.id);
      io.to(room.id).emit('notice', socket.user?.name + ' joined ' + room.name);

      const _messages = await messages.getAll(room.id);
      socket.emit('previousMessages', _messages);
    });

    socket.on('block', async ({ user, shouldBlock }) => {
      await users.block(socket.user, user, shouldBlock);

      const _user = await users.get(socket.user.identifier);
      socket.user = _user;
      const _users = await users.getAll();
      logger.info(
        `${socket.user.name} ${shouldBlock ? 'blocked' : 'unblocked'} ${
          user.name
        }`
      );
      io.emit('showUsers', _users);
    });

    socket.on('message', async (message: INewMessage) => {
      if (message?.message) {
        const room = await rooms.get(message.room);

        if (room) {
          const _message = { ...message, id: getRandomId() };
          await messages.add(_message);

          io.to(room.id).emit('message', _message);
          logger.imp('msg: ' + _message.id);
        } else {
          socket.emit('message failed', {
            room: message.room,
            error: 'room not found',
          });
        }
      }
    });

    // We want to reset the db: DEMO Only!!
    socket.on('reset', async () => {
      try {
        logger.info('Reseting System');
        const { db } = await connectToDatabase();

        // atlas might need at least one collection to keep db and settings
        // mongo throws error if collection exists
        try {
          await db.createCollection('dummy');
        } catch (error) {}

        // drop all usefull collections
        await db.collection('users').drop();
        await db.collection('rooms').drop();
        await db.collection('members').drop();

        logger.info('Reset DONE');
      } catch (error) {
        console.error(error);
        logger.warn('Reset possibly failed');
      }
    });

    // notify others of new user
    io.emit('notice', `A new user is joining`);
  });
  logger.info('socket started');
};
