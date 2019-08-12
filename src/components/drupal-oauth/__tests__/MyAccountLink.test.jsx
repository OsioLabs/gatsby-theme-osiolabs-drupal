import React from 'react';
import { render } from '@testing-library/react';

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
  it('renders correctly', () => {
    // Basic snapshot test.
    const { asFragment } = render(<TestElement />);
    const firstRender = asFragment();
    expect(firstRender).toMatchSnapshot();
  });
});
