import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { io } from 'socket.io-client';
import './App.scss';
import LoginButton from './components/auth/login-button';
import config from './env.json';
import { getRandomPhotoUrl } from './lib/media';
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
  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
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
  }, [socket, setConnected]);

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
      setMessages([...messages, msg]);
    });

    socket.on('previousMessages', (msgs: IMessage[]) => {
      setMessages([...messages, ...msgs]);
    });
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

    socket.on('showUsers', (users) => {
      setUsers(users);
    });
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

  if (!isAuthenticated) return <LoginButton />;

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
              user={user}
              connected={connected}
              handleRoomClick={handleRoomClick}
              rooms={rooms}
              users={users}
              handleDBReset={handleDBReset}
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
