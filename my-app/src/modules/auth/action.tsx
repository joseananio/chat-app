import { FC } from 'react';
import { Card } from 'react-bootstrap';
import LogoutButton from './components/logout-button';
import ResetDbButton from './components/reset-db-button';
import './styles.scss';

type Props = {
  handleDBReset: () => void;
};
const ActionView: FC<Props> = ({ handleDBReset }) => {
  return (
    <Card
      className="user-card p-5"
      style={{ height: 72, alignItems: 'flex-start' }}
    >
      <div className="d-flex gap-3">
        <div className="mr-2">
          <LogoutButton />
        </div>
        <div>
          <ResetDbButton handleDBReset={handleDBReset} />
        </div>
      </div>
    </Card>
  );
};

export default ActionView;
