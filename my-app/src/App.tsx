import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { io } from 'socket.io-client';
import './App.scss';
import config from './env.json';
import { getRandomPhotoUrl } from './lib/media';
import { getUserIdentifier } from './lib/user';
import { LoginView } from './modules/auth/login';
import NoChatView from './modules/chat/components/no-chat-view';
import { Rightbar } from './modules/chat/rightbar';
import { Sidebar } from './modules/chat/sidebar';
import SingleChat from './modules/chat/single-chat';
import './modules/chat/styles.scss';
import { IMessage, INewRoom, IRoom, IUser } from './types';

const socket = io(config.io.server, {});
const App: React.FC<any> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth0();
  const [connected, setConnected] = useState(false);
  const [activeChatRoom, setActiveChatRoom] = useState<IRoom | null>(null);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<IUser[]>([]);
  const [messages, setMessages] = useState<any>([]);

  const handleUsersUpdate = (_users: IUser[]) => {
    if (user) {
      const myId = getUserIdentifier(user);
      const me = _users.find((usr) => usr.identifier === myId);

      const blockedFilter = (usr) => me?.blocked?.includes(usr.identifier);
      const unblockedFilter = (usr) => !me?.blocked?.includes(usr.identifier);

      setBlockedUsers(_users.filter(blockedFilter));
      setUsers(_users.filter(unblockedFilter));
    }
  };

  const handleIncomingMessages = (__messages: IMessage[]) => {
    const _messages: IMessage[] = [];
    __messages.forEach((msg) => {
      const messageAdded = _messages.find((_msg) => _msg.id === msg.id);
      if (!messageAdded) {
        _messages.push(msg);
      }
    });
    setMessages(_messages);
  };

  const blockorUnblockUser = (user: IUser, shouldBlock: boolean) => {
    socket.emit('block', { user, shouldBlock });
  };

  useEffect(() => {
    // always recreates subscriptions
    socket.off('notice');
    socket.off('disconnect');
    socket.off('connect_error');
    socket.off('connect');

    socket.on('connect', async () => {
      setConnected(true);
      console.log('connected:', user);
    });

    socket.on('connect_error', () => {
      setConnected(false);
      setTimeout(() => {
        console.log('retrying in 1sec...');
        socket.connect();
      }, 1000);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('notice', (message) => {
      console.log('Notice: ' + message);
    });
  }, [socket, setConnected, user]);

  useEffect(() => {
    /** throw away the old listener,
    /*  create new one with the updated array injected
    /*  for next concatenation
    */
    socket.off('message');
    socket.off('previousMessages');

    // listen for next message
    socket.on('message', (msg: IMessage) => {
      // concatenate and save
      handleIncomingMessages([...messages, msg]);
    });

    socket.on('previousMessages', (msgs: IMessage[]) => {
      handleIncomingMessages([...messages, ...msgs]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, socket]);

  useEffect(() => {
    /**
     * Clean up sockets and create new on dependency change
     */
    socket.off('showRooms');
    socket.off('showUsers');

    socket.on('showRooms', (rooms: IRoom[]) => {
      setRooms(rooms);
      rooms.map((room) => socket.emit('joinRoom', room));
    });

    socket.on('showUsers', handleUsersUpdate);
  }, [socket, user]);

  useEffect(() => {
    if (user && connected) {
      console.log('registering as ' + user.name);
      socket.emit('register', {
        name: user.name,
        identifier: user.sub || user.email,
        dp: user.picture,
      } as IUser);
    }
  }, [user, connected]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) return <LoginView />;

  /**
   * Create a chatroom
   * @param e Event
   * @returns
   */
  const createRoom = (room: INewRoom) => {
    socket.emit('createRoom', room);
  };

  const handleRoomClick = (room: IRoom | INewRoom) => {
    if (!room.private && !room.dp) {
      room.dp = getRandomPhotoUrl();
    }

    if (!('id' in room)) {
      createRoom(room);
      socket.on('newRoomUpdate', (newRoom) => {
        setActiveChatRoom(newRoom);
        socket.off('newRoomUpdate');
      });
    } else {
      setActiveChatRoom(room);
    }
  };

  // WARNING: DEMO ONLY!!!!
  const handleDBReset = () => {
    socket.emit('reset');
  };

  return user ? (
    <div className="layout">
      <Container fluid>
        <Row style={{ height: '5vh' }}></Row>
        <Row>
          <Col md={3}>
            <Sidebar
              blocked={blockedUsers}
              user={user}
              connected={connected}
              rooms={rooms}
              users={users}
              handleRoomClick={handleRoomClick}
              handleDBReset={handleDBReset}
              blockorUnblockUser={blockorUnblockUser}
            />
          </Col>
          <Col md={6}>
            {activeChatRoom ? (
              <SingleChat
                user={user}
                chatRoom={activeChatRoom}
                socket={socket}
                messages={messages}
              />
            ) : (
              <NoChatView />
            )}
          </Col>
          <Col md={3}>
            {activeChatRoom ? (
              <Rightbar user={user} chatRoom={activeChatRoom} />
            ) : null}
          </Col>
        </Row>
      </Container>
    </div>
  ) : null;
};
export default App;
