import React from 'react';
import { Segment } from 'semantic-ui-react';
import LoginRegisterButtonGroup from '../LoginRegisterButtonGroup/LoginRegisterButtonGroup';

const SignupNag = () => (
  <Segment.Group horizontal>
    <Segment textAlign="center">
      <p>
        Sign in with your Osio Labs account
        <br />
        to gain instant access to our entire library.
      </p>
    </Segment>
    <Segment textAlign="center">
      <LoginRegisterButtonGroup />
    </Segment>
  </Segment.Group>
);

export default SignupNag;
