import { User } from '@auth0/auth0-react';
import { faBell, faClock } from '@fortawesome/free-regular-svg-icons';
import { faCog, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FC, useEffect, useRef, useState } from 'react';
import { Card, Col, Image, Row } from 'react-bootstrap';
import { getDateDiff } from '../../lib/date';
import { IRoom } from '../../types';
import { MiniCard } from './components/mini-card';

type Props = {
  user: User;
  chatRoom: IRoom;
};
export const Rightbar: FC<Props> = ({ user, chatRoom }) => {
  const [startTime, setStartTime] = useState(new Date());
  const [duration, setDuration] = useState({ val: 0, unit: 'secs' });

  const intv = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      getDuration();
    }, 5000);

    (intv.current as any) = id;
    const interval = intv.current;

    return () => {
      clearInterval(interval);
    };
  });

  const getDuration = () => {
    setDuration(getDateDiff(startTime.toISOString()));
  };

  return (
    <div>
      <Card className="user-card mb-5">
        <Image
          src={chatRoom?.dp}
          height={84}
          width={84}
          style={{ marginBottom: 12 }}
          roundedCircle
        />
        <h5 className="mv-2">{chatRoom?.name}</h5>
      </Card>
      <div className="grid-card mb-5">
        <Row>
          <Col md={12} lg={12} xl={6}>
            <MiniCard
              theme="blue"
              title={`${duration.unit} Uptime`}
              value={duration.val}
              icon={faClock}
            />
          </Col>
          <Col md={12} lg={12} xl={6}>
            <MiniCard theme="orange" title="Users" value="••" icon={faUsers} />
          </Col>
          <Col md={12} lg={12} xl={6}>
            <MiniCard theme="green" title="Messages" value="••" icon={faBell} />
          </Col>
          <Col md={12} lg={12} xl={6}>
            <MiniCard theme="purple" title="Settings" value="••" icon={faCog} />
          </Col>
        </Row>
      </div>
    </div>
  );
};
