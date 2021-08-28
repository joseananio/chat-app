Auth Provider
login
register
profile
logout
delete account

### Accessing own account

me/profile
me/exit

### Accessing users

users/online

### Accessing other users

user/:id/block
user/:id/unblock

### Accessing chats

GET chats/

### Managing single chat

POST chat/with/:id create new chat
GET chat/with/:id Get a chat session
PUT chat/with/:id/close Delete a chat
PUT chat/with/:id/open undelete a chat

POST chat/message post message
DEL chat/message delete message
GET chat/messages get messages
