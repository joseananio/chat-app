import { Col, Container, Row } from 'react-bootstrap';
import LoginButton from './components/login-button';
import './styles.scss';

export const LoginView = () => {
  return (
    <Container fluid className="wrapper">
      <Row>
        <Col
          xs={10}
          md={6}
          lg={4}
          className="text-center offset-1 offset-md-3 offset-lg-4"
        >
          <div className="d-flex flex-column justify-content-center boxx">
            <h3>ChatApp</h3>
            <div>
              <LoginButton />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
