# chat-app

Basic Single page chat application

A user can login with their email address and chat with other users in realtime

- Socket io to manage communication
- MongoDB as persistent database (Atlas)
- Express server to host socket.io
- Auth0 to manage authentication
- Docker compose and build

## Testing

- Clone project and unzip
- Enter project folder and type the following command

```sh
docker-compose up
```

## User Operation

- User signs in with email
- User can reset the database ( for testing only!! )
- User can view current chats in _Rooms_
- User can start new chat under rooms by createing new Room
- To create a new room click the new room field, type something and then click outside
- User can send messages to the chat
- Click on a user's name to block or unblock

## Potential Additions

- [ ] Cache server -> Redis
- [ ] Socket io adapters for multiple installations
- [ ] User management activities
- [ ] Private chat

## Environment setup (Ubuntu 20.04)

```bash
sudo apt update

# git, docker
sudo apt install git curl docker.io docker-compose

#nodejs
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt install nodejs -y
# ensure node version is 14.x.x
npm -v
node -v
# optional
sudo npm i -g yarn

#setup docker
sudo systemctl enable docker
sudo systemctl start docker

#from project dir
docker-compose up
```

## Dev Installation

API

```bash
cd api
yarn
yarn start
```

Frontend

```sh
cd my-app
yarn
yarn start

```

## Building docker

```sh
docker-compose build --no-cache
```
