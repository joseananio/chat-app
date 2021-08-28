import { FC } from 'react';
import Accordion from 'react-bootstrap/Accordion';

export const List: FC<any> = ({ data = [] as any }) => {
  return (
    <div style={{ width: '100%' }}>
      <Accordion style={{ position: 'relative' }}>
        {data.map((convo, idx) => (
          <Accordion.Item key={idx} eventKey={`${idx}`}>
            <Accordion.Header>{convo.name}</Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};
