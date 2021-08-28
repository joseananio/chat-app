import { FC } from 'react';
import { Accordion } from 'react-bootstrap';

export const Collapsible: FC<any> = ({ children }) => {
  return <Accordion defaultActiveKey="0">{children}</Accordion>;
};

export const CollapsibleItem = ({ title, children, id }) => {
  return (
    <Accordion.Item eventKey={`${id}`}>
      <Accordion.Header>{title}</Accordion.Header>
      <Accordion.Body>{children}</Accordion.Body>
    </Accordion.Item>
  );
};
