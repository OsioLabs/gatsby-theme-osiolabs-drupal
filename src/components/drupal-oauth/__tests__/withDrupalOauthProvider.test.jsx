import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DrupalOauth from '../DrupalOauth';

import withDrupalOauthProvider from '../withDrupalOauthProvider';
import withDrupalOauthConsumer from '../withDrupalOauthConsumer';

jest.mock('../DrupalOauth');
const drupalOauthClient = new DrupalOauth();

const Dummy = () => <p>Hello there</p>;

const DummyWithConsumer = withDrupalOauthConsumer(
  ({ userAuthenticated, currentUserId }) => (
    <ul>
      <li>userAuthenticated: {String(userAuthenticated)}</li>
      <li>currentUserId: {String(currentUserId)}</li>
    </ul>
));

beforeEach(() => {
  fetch.resetMocks();
  drupalOauthClient.isLoggedIn.mockClear();
});

describe('withDrupalOauthProvider()', () => {
  it('Triggers logic to check for authenticated users when called.', async () => {
    const Component = withDrupalOauthProvider(drupalOauthClient, Dummy);
    const { getByText } = render(<Component />);
    const element = getByText('Hello there');
    expect(element).toHaveTextContent(/Hello there/);
    expect(drupalOauthClient.isLoggedIn).toHaveBeenCalledTimes(1);
  });

  it('Updates state properly when login succeeds.', async () => {
    // Mock response from Drupal when asking to get the ID of the current
    // user.
    fetch.mockResponseOnce(
      JSON.stringify({
        meta: { links: { me: { meta: { id: 'test-user' } } } },
      })
    );
    const Component = withDrupalOauthProvider(
      drupalOauthClient,
      DummyWithConsumer
    );
    const { getByText } = render(<Component />);

    await waitForElement(() => getByText('userAuthenticated: true'));

    expect(getByText('userAuthenticated: true')).toBeTruthy();
    expect(getByText('currentUserId: test-user')).toBeTruthy();
    expect(drupalOauthClient.isLoggedIn).toHaveBeenCalledTimes(2);
    // Once to get the oauth token, once to get info about the logged in user.
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('Updates state properly when login fails.', async () => {
    // Mock response from Drupal when asking to get the ID of the current
    // user.
    fetch.mockReject();
    drupalOauthClient.isLoggedIn = jest.fn(() => Promise.reject());
    const Component = withDrupalOauthProvider(
      drupalOauthClient,
      DummyWithConsumer
    );
    const { getByText } = render(<Component />);

    await waitForElement(() => getByText('userAuthenticated: false'));

    expect(getByText('userAuthenticated: false')).toBeTruthy();
    expect(getByText('currentUserId: anon')).toBeTruthy();
    expect(drupalOauthClient.isLoggedIn).toHaveBeenCalledTimes(1);
    // Make sure we don't try and retrieve a user ID for anon users.
    expect(fetch).toHaveBeenCalledTimes(0);
  });
});
