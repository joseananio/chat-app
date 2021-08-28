# chat-app
Basic Single page chat application

A user can  login with their email address and chat with other users in realtime
- Socket io to manage communication
- MongoDB as persistent database (Atlas)
- Express server to host socket.io
- Auth0 to manage authentication
- Docker compose and build


## Installation
API
```bash
cd api
yarn
yarn start
```

Frontend
```
cd my-app
yarn
yarn start

```

## User Operation
- User signs in with email
- User can reset the database ( for testing only!! )
- User can view current chats in *Rooms*
- User can start new chat under rooms by
- 1. Selecting existing room or user
- 2. Createing new Room
- To create a new room click the new room field, type something and then click outside
- User can send messages to the chat

## Potential Additions
- [ ] Cache server -> Redis  
- [ ] Socket io adapter for multiple installations  
- [ ] User management activities  
