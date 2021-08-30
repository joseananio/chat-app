import { User } from '@auth0/auth0-react';
import { FC, useEffect, useState } from 'react';
import { Card, Image } from 'react-bootstrap';
import Logo from '../../components/app/logo';
import { Collapsible, CollapsibleItem } from '../../components/collapsible';
import { getRandomPhotoUrl } from '../../lib/media';
import { getUserIdentifier } from '../../lib/user';
import { INewRoom, IRoom, IUser } from '../../types';

type Props = {
  user: User;
  connected: boolean;
  rooms: IRoom[];
  users: IUser[];
  blocked: IUser[];

  handleRoomClick: (room: IRoom | INewRoom) => void;
  blockorUnblockUser: (user: IUser, shouldBlock: boolean) => void;
};

export const Sidebar: FC<Props> = ({
  user,
  connected,
  rooms,
  users,
  blocked = [],
  handleRoomClick,
  blockorUnblockUser,
}) => {
  const [roomName, setRoomName] = useState('');
  const [_users, setUsers] = useState<IUser[]>([]);

  /**
   * User types the name of a room, and then clicks outside
   * Create a new room and broadcast
   */
  const handleNewPublicRoomBlur = () => {
    if (roomName) {
      handleRoomClick({
        name: roomName,
        private: false,
        dp: getRandomPhotoUrl(),
      });
    }
    setRoomName('');
  };

  /**
   * Prepare current user: User as IUser
   * @returns IUser
   */
  const getMeAsParticipant = () => {
    return {
      name: String(user.name || user.nickname),
      identifier: getUserIdentifier(user),
      dp: user.picture,
    };
  };

  /**
   * When I click on a user ive not chatted with
   * Create a room for us and remove the user
   * @param _user: IUser
   */
  const handleUserClick = (_user: IUser) => {
    const myIdentifier = getUserIdentifier(user);
    const thisIsSelfNote = _user.identifier === myIdentifier;
    const me = getMeAsParticipant();
    const us = [_user, me];

    const ourRoomName =
      _user.name.split(' ')[0] + ' & ' + user.name?.split(' ')[0];

    handleRoomClick({
      name: thisIsSelfNote ? 'Self Notes' : ourRoomName,
      dp: _user.dp,
      private: true,
      participants: thisIsSelfNote ? [me] : us,
    } as INewRoom);
  };

  /**
   * Double click on a user to block or unblock
   * @param user Iuser
   */
  const handleBlockOrUnblockUser = (_user: IUser, shouldBlock = true) => {
    const myId = getUserIdentifier(user);

    // we dont wanna block our current user
    if (_user.identifier !== myId) {
      blockorUnblockUser(_user, shouldBlock);
    }
  };

  /**
   * We want to show users you havent started a chat with in one section and add
   * the others to rooms
   * TODO: make this simple
   */
  useEffect(() => {
    const myIdentifier = getUserIdentifier(user);
    const privateRooms = rooms.filter((room) => room.private);

    const iHaveSelftNoteRoom = privateRooms.find(
      (room) =>
        room.participants?.length === 1 &&
        room.participants?.[0].identifier === myIdentifier
    );

    const usersInPrivateChats: IRoom['participants'] = [];
    privateRooms.forEach((room) => {
      (room.participants || []).map((part) => usersInPrivateChats.push(part));
    });
    const usersIChatWith = usersInPrivateChats; // Including me, for self Notes

    const usersIwannaChatWith = users.filter(
      (_user) =>
        !usersIChatWith.find((__user) => __user.identifier === _user.identifier)
    );
    // if (
    //   !iHaveSelftNoteRoom &&
    //   !usersIwannaChatWith.find((usr) => usr.identifier === myIdentifier)
    // ) {
    //   usersIwannaChatWith.push(getMeAsParticipant() as any);
    // }
    setUsers(usersIwannaChatWith);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, rooms, user]);

  return (
    <div className="sidebar">
      <Logo />
      <Card className="user-card mb-5">
        <Image
          src={user.picture || 'https://picsum.photos/100/100'}
          height={84}
          width={84}
          style={{ marginBottom: 12 }}
          roundedCircle
        />
        <div
          className="onlineIndicator"
          style={{
            backgroundColor: connected ? 'rgb(4, 184, 156)' : 'goldenrod',
          }}
        ></div>
        <h3 className="mv-2">{user.name}</h3>
        <p className="fs-6 text-muted">{user.email}</p>
      </Card>
      <Collapsible>
        <CollapsibleItem id="0" title={`Rooms (${rooms.length})`}>
          <ul>
            <li>
              <input
                type="text"
                placeholder="New Room"
                className="input-clean"
                value={roomName}
                onChange={(evt) => setRoomName(evt.target.value)}
                onBlur={handleNewPublicRoomBlur}
              />
            </li>
            {rooms.map((room, idx) => (
              <li key={idx} onClick={() => handleRoomClick(room)}>
                <Image
                  src={room.dp}
                  height={48}
                  width={48}
                  style={{ marginRight: 12 }}
                  roundedCircle
                />
                {room.name}
              </li>
            ))}
          </ul>
        </CollapsibleItem>

        <CollapsibleItem id="1" title={`Active Users (${_users.length})`}>
          <ul>
            {_users.map((_user, idx) => (
              <li
                key={idx}
                onClick={() => handleBlockOrUnblockUser(_user, true)}
                // onDoubleClick={() => handleBlockOrUnblockUser(_user, true)}
              >
                <Image
                  src={_user.dp || `https://picsum.photos/10${idx}/10${idx}`}
                  height={48}
                  width={48}
                  style={{ marginRight: 12 }}
                  roundedCircle
                />
                {_user.name}
              </li>
            ))}
          </ul>
        </CollapsibleItem>
        <CollapsibleItem id="1" title={`Blocked Users (${blocked.length})`}>
          <ul>
            {blocked.map((_user, idx) => (
              <li
                key={idx}
                onClick={() => handleBlockOrUnblockUser(_user, false)}
              >
                <Image
                  src={_user.dp || `https://picsum.photos/10${idx}/10${idx}`}
                  height={48}
                  width={48}
                  style={{ marginRight: 12 }}
                  roundedCircle
                />
                {_user.name}
              </li>
            ))}
          </ul>
        </CollapsibleItem>
      </Collapsible>
    </div>
  );
};
