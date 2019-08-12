import React from 'react';
import { render } from '@testing-library/react';

import TutorialList from './TutorialList';

const tutorials = [
  { id: 'one', title: 'Tutorial One', path: '/tutorial/one' },
  { id: 'two', title: 'Tutorial Two', path: '/tutorial/two' },
  { id: 'three', title: 'Tutorial Three', path: '/tutorial/three' },
];

describe('Component: <TutorialList />', () => {
  it('renders correctly', () => {
    // Basic snapshot test.
    const { asFragment } = render(<TutorialList tutorials={tutorials} />);
    const firstRender = asFragment();
    expect(firstRender).toMatchSnapshot();
  });
});
