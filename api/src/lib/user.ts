export const getUserIdentifier = (user) => {
  return user.sub || user.email || getRandomIdentifier();
};

const getRandomIdentifier = () => Math.random().toString().substr(2);

export const getUserIdFromSocket = async (socket) => {
  return socket.id;
};
