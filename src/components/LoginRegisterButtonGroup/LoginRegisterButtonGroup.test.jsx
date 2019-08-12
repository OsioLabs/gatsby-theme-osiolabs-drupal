import React from 'react';
import { render, cleanup } from '@testing-library/react';

// Configure some mocks we need to make this component work.
import DrupalOauth from '../drupal-oauth/DrupalOauth';
import withDrupalOauthProvider from '../drupal-oauth/withDrupalOauthProvider';

import LoginRegisterButtonGroup from './LoginRegisterButtonGroup';
import ReceiveFromDrupal from '../drupal-oauth/ReceiveFromDrupal';

jest.mock('../drupal-oauth/DrupalOauth');
const drupalOauthClient = new DrupalOauth();
ReceiveFromDrupal.fetchToken = jest.fn(() => Promise.resolve({}));

const TestElement = withDrupalOauthProvider(drupalOauthClient, () => (
  <LoginRegisterButtonGroup />
));

describe('Component: <LoginRegisterButtonGroup />', () => {
  beforeEach(() => {
    fetch.resetMocks();
    drupalOauthClient.storeToken.mockClear();
  });

  afterEach(cleanup);

  // Test the the component renders correctly with a simple snapshot test.
  it('renders correctly', () => {
    // Basic snapshot test.
    const { asFragment } = render(<TestElement />);
    const firstRender = asFragment();
    expect(firstRender).toMatchSnapshot();
  });
});
