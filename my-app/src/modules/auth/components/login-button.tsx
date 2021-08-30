import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { Button } from 'react-bootstrap';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      onClick={() =>
        loginWithRedirect({
          scope: 'read:current_user update:current_user_metadata',
        })
      }
    >
      Log In
    </Button>
  );
};

export default LoginButton;