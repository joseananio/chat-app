import { User } from '@auth0/auth0-react';

export const getUserIdentifier = (user: User) => {
  return user.sub || user.email || getRandomIdentifier();
};

const getRandomIdentifier = () => Math.random().toString().substr(2);

export const getUserIdFromSocket = async (socket) => {
  return socket.id;
};
