import React from 'react';
import { render, waitForElement } from '@testing-library/react';

// MyAccountLink requires DrupalOauthProvider context to work, which requires an
// instance of DrupalOauth. So we import those, and create a mock.
import DrupalOauth from '../DrupalOauth';
import withDrupalOauthProvider from '../withDrupalOauthProvider';

import MyAccountLink from '../MyAccountLink';

jest.mock('../DrupalOauth');
const drupalOauthClient = new DrupalOauth();

const TestElement = withDrupalOauthProvider(drupalOauthClient, () => (
  <MyAccountLink title="My account" className="testClassName" />
));

describe('<MyAccountLink />', () => {
  it('renders correctly', async () => {
    // Basic snapshot test.
    const { asFragment, getByText } = render(<TestElement />);
    // This is required because we want to wait for the withOauthProvider()
    // function to finish figuring out if the user is logged in or not. Which,
    // triggers a state change after it happens.
    await waitForElement(() => getByText('My account'));
    const firstRender = asFragment();
    expect(firstRender).toMatchSnapshot();
  });
});
