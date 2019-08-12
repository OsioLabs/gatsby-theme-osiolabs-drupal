/* eslint-disable react/prop-types */
import React from 'react';
import { render, cleanup, waitForElement } from '@testing-library/react';
// Configure some mocks we need to make this component work.
import DrupalOauth from '../DrupalOauth';
import withDrupalOauthProvider from '../withDrupalOauthProvider';
import ReceiveFromDrupal from '../ReceiveFromDrupal';

jest.mock('../DrupalOauth');
const drupalOauthClient = new DrupalOauth();
ReceiveFromDrupal.fetchToken = jest.fn(() => Promise.resolve({}));

const TestElement = withDrupalOauthProvider(drupalOauthClient, props => (
  <ReceiveFromDrupal {...props} />
));

ReceiveFromDrupal.fetchToken = jest.fn(() => Promise.resolve({}));

describe('Component: <ReceiveFromDrupal />', () => {
  beforeEach(() => {
    drupalOauthClient.fetchOauthToken.mockClear();

    // The OauthReceiver component looks for the ?code query string parameter
    // and then uses that if it exists to request a token from Drupal. We need
    // to act like there is one in the URL otherwise the component just errors
    // out and we can't test a happy path.
    window.history.pushState({}, '', '?code=TACOCAT');
  });

  afterEach(cleanup);

  // Test that the OAuth receive code which is responsible for handling the
  // ?code= param returned during the authentication flow is only rendered when
  // it is needed.
  it('renders receive component when ?code= is present', () => {
    // https://www.ryandoll.com/post/2018/3/29/jest-and-url-mocking
    window.history.pushState({}, '', '/test?code=asdf');

    const { getByText } = render(<TestElement />);

    expect(getByText('Authorizing now...')).toBeTruthy();
  });

  it('does not render receive component when ?code= is not present', () => {
    // https://www.ryandoll.com/post/2018/3/29/jest-and-url-mocking
    window.history.pushState({}, '', '/test');

    const { queryByText } = render(<TestElement />);

    expect(queryByText('Authorizing now...')).toBeNull();
  });

  // Happy path. :)
  it('Does what it is supposed to ...', async () => {
    const response = {
      token_type: 'Bearer',
      expires_in: 300,
      access_token: 'ACCESS_TOKEN',
      refresh_token: 'REFRESH_TOKEN',
    };
    drupalOauthClient.fetchOauthToken.mockResolvedValue(response);

    const { getAllByTestId } = render(
      <TestElement
        drupalOauthClient={drupalOauthClient}
        currentLocation="http://www.example.com"
      />
    );

    await waitForElement(() => getAllByTestId('receiver'));
    expect(drupalOauthClient.fetchOauthToken).toHaveBeenCalledTimes(1);
  });

  // Sad path. :(
  it('Breaks when it is supposed to ...', async () => {
    drupalOauthClient.fetchOauthToken.mockReset();
    drupalOauthClient.fetchOauthToken.mockRejectedValueOnce(
      new Error('fake error message')
    );

    const { getByTestId } = render(
      <TestElement
        drupalOauthClient={drupalOauthClient}
        currentLocation="http://www.example.com"
      />
    );
    await waitForElement(() => getByTestId('receiver'));

    //expect(drupalOauthClient.fetchOauthToken).toHaveBeenCalledTimes(1);
    expect(getByTestId('receiver')).toHaveTextContent(/fake error message/);
  });
});
