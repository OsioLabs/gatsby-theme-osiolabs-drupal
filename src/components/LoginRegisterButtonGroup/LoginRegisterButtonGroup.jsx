import React from 'react';
import { Button } from 'semantic-ui-react';
import DrupalLoginButton from '../drupal-oauth/DrupalLoginButton';

const LoginRegisterButtonGroup = () => (
  <Button.Group>
    <DrupalLoginButton title="Log in" classes="ui button" />
    <Button.Or text="/" />
    <DrupalLoginButton
      title="Sign up"
      useRegistrationLink
      classes="ui button primary"
    />
  </Button.Group>
);

export default LoginRegisterButtonGroup;
