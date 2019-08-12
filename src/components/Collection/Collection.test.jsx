import React from 'react';
import { render } from '@testing-library/react';

import Collection from './Collection';

const tutorials = [
  {
    id: 'one',
    title: 'Tutorial One',
    path: '/tutorial/one',
    tutorial_access: 'public',
  },
  {
    id: 'two',
    title: 'Tutorial Two',
    path: '/tutorial/two',
    tutorial_access: 'membership_required',
  },
  {
    id: 'three',
    title: 'Tutorial Three',
    path: '/tutorial/three',
    tutorial_access: 'asdf',
  },
];

describe('Component: <Collection />', () => {
  it('renders correctly', () => {
    // Basic snapshot test.
    const { asFragment } = render(
      <Collection
        title="Tacos Rock"
        path="/tutorial/tacos"
        id="collection-id"
        summary="<p>Copy goes here ...</p>"
        tutorials={tutorials}
      />
    );
    const firstRender = asFragment();
    expect(firstRender).toMatchSnapshot();
  });
});
