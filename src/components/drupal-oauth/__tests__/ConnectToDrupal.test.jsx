/* eslint-disable react/prop-types */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import DrupalOauth from '../DrupalOauth';
import ConnectToDrupal from '../ConnectToDrupal';

jest.mock('../DrupalOauth');

const drupalOauthClient = new DrupalOauth();

describe('Component: <SendToDrupal />', () => {
  afterEach(cleanup);

  it('Renders a link to authorize a user against Drupal', () => {
    const { getByText, rerender } = render(
      <ConnectToDrupal
        drupalOauthClient={drupalOauthClient}
        title="Connect to Drupal"
        redirectUri="http://www.example.com"
        queryString="&foo=bar"
      />
    );

    const render1 = getByText('Connect to Drupal');
    expect(render1).toMatchSnapshot();

    // Render a second time, NOTE the trailing slash on the redirectUri.
    // This verifies our logic to handle normalizing the redirectUri is
    // working.
    rerender(
      <ConnectToDrupal
        drupalOauthClient={drupalOauthClient}
        title="Connect to Drupal"
        redirectUri="http://www.example.com/"
      />
    );
    const render2 = getByText('Connect to Drupal');
    expect(render1).toEqual(render2);
  });

  it('Renders a link to register and then authorize a user against Drupal', () => {
    const { getByText } = render(
      <ConnectToDrupal
        drupalOauthClient={drupalOauthClient}
        title="Register with Drupal"
        redirectUri="http://www.example.com"
        useRegistrationLink
      />
    );
    expect(getByText('Register with Drupal')).toMatchSnapshot();
  });
});
