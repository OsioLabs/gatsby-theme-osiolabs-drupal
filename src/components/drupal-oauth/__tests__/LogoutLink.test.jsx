import React from 'react';
import { render, fireEvent } from '@testing-library/react';

// LogoutLink requires DrupalOauthProvider context to work, which requires an
// instance of DrupalOauth. So we import those, and create a mock.
import DrupalOauth from '../DrupalOauth';
import withDrupalOauthProvider from '../withDrupalOauthProvider';

import LogoutLink from '../LogoutLink';

jest.mock('../DrupalOauth');
const drupalOauthClient = new DrupalOauth();

const Dummy = props => (
  <a href="#" onClick={props.onClick}>
    I love to logout
  </a>
);
const Element = withDrupalOauthProvider(drupalOauthClient, () => (
  <LogoutLink component={Dummy} />
));

describe('LogoutLink', () => {
  it('renders correctly', () => {
    // Basic snapshot test.
    const { getByText, asFragment } = render(<Element />);
    const firstRender = asFragment();
    expect(firstRender).toMatchSnapshot();

    // Verify that clicking the link triggers the logout function.
    fireEvent.click(getByText(/I love to logout/));
    expect(drupalOauthClient.handleLogout).toHaveBeenCalledTimes(1);
  });
});
