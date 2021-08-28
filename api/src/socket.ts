import { logger } from '@7speck/logger';
import { Server } from 'socket.io';
import { connectToDatabase } from './lib/store.mongo/client';
import { mongo_db_src } from './lib/store.mongo/index';
import { getRandomId } from './lib/utils';
import { INewMessage, IRoom, IUser } from './types';
const getUserId = async (socket) => {
  return socket.id;
};

export const initializeSocket = (server) => {
  const { users, rooms, messages } = mongo_db_src;

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', async (socket: any) => {
    socket.on('disconnect', async () => {
      logger.warn('disconnected: ', socket.user);
      // TODO
      await users.remove(socket.user);

      const _users = await users.getAll();
      socket.emit('showRooms', rooms);
      socket.broadcast.emit('showUsers', _users);
    });

    // user joins socket
    // return the rooms available to the user
    socket.on('register', async (user: IUser) => {
      if (user.name && user.identifier) {
        socket.user = user;

        await users.add(socket.user);
        const _rooms = await rooms.getAll(user.identifier);
        const _users = await users.getAll();

        socket.emit('showRooms', _rooms);
        socket.emit('showUsers', _users);
        socket.broadcast.emit('showUsers', _users);
        logger.info(`\\registered\\${user.identifier}: ${user.name} `);
      }
    });

    // user requests for rooms??
    socket.on('getRooms', async () => {
      const _rooms = await rooms.getAll(socket.user.identifier);
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
      socket.emit('newRoomUpdate', room);

      const _rooms = await rooms.getAll(socket.user?.identifier);

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
  });
  logger.info('socket started');
};
