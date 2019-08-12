import React from 'react';
import { render } from '@testing-library/react';

import SignupNag from './SignupNag';

// We don't need to test this inner component, which requires Oauth context,
// since it has it's own tests.
jest.mock('../LoginRegisterButtonGroup/LoginRegisterButtonGroup', () => () =>
  'LoginRegisterButtonGroup'
);

describe('Component: <SignupNag />', () => {
  it('renders correctly', () => {
    // Basic snapshot test.
    const { asFragment } = render(<SignupNag />);
    const firstRender = asFragment();
    expect(firstRender).toMatchSnapshot();
  });
});
