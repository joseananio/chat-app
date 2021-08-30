import { FC } from 'react';
import { Button } from 'react-bootstrap';

type Props = {
  handleDBReset: () => void;
};

const ResetDbButton: FC<Props> = ({ handleDBReset }) => {
  return (
    <Button variant="danger" onClick={handleDBReset}>
      Reset Database
    </Button>
  );
};

export default ResetDbButton;
