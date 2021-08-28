import { Messages } from './messages';
import { Rooms } from './rooms';
import { Users } from './users';

export const memory_db_src = {
  users: new Users(),
  rooms: new Rooms(),
  messages: new Messages(),
};
