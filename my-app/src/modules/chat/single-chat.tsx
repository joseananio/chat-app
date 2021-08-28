import { User } from '@auth0/auth0-react';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { getUserIdentifier } from '../../lib/user';
import { IMessage, INewMessage, IRoom } from '../../types';

type Props = {
  user: User;
  chatRoom: IRoom;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  messages: IMessage[];
};

const SingleChat: FC<Props> = ({ user, chatRoom, socket, messages }) => {
  const [message, setMessage] = useState('');
  const userIdentifier = getUserIdentifier(user);
  const [_messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    const msgs = messages.filter((msg) => msg.room === chatRoom.id);
    setMessages(msgs);
  }, [chatRoom, messages]);

  const sendMessage = () => {
    const on = new Date().toISOString();
    const _message: INewMessage = {
      sender: { identifier: userIdentifier, name: String(user.name) },
      message,
      on,
      room: chatRoom.id,
    };

    setMessage('');
    socket.emit('message', _message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message) {
      sendMessage();
    }
  };
  const handleChange = (event) => setMessage(event.target.value);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef?.current) {
      ((messagesEndRef.current as unknown) as HTMLElement)?.scrollIntoView(
        false
      );
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [_messages]);

  return (
    <div>
      <div className="chatWindow">
        <ul className="chat" id="chatList">
          {_messages.map((data: any, i) => (
            <div key={i}>
              {userIdentifier === data.sender.identifier ? (
                <li className="self">
                  <div className="msg">
                    <p>{data.sender.name}</p>
                    <div className="message"> {data.message}</div>
                  </div>
                </li>
              ) : (
                <li className="other">
                  <div className="msg">
                    <p>{data.sender.name}</p>
                    <div className="message"> {data.message} </div>
                  </div>
                </li>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} id="scroller"></div>
        </ul>
        <div className="chatInputWrapper">
          <form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <input
                  type="text"
                  placeholder="Enter your message..."
                  value={message}
                  onChange={handleChange}
                />
              </Col>
              <Col className="col-auto">
                <Button type="submit" className="send-btn" disabled={!message}>
                  Send
                </Button>
              </Col>
            </Row>
          </form>
        </div>
      </div>
    </div>
  );
};
export default SingleChat;
