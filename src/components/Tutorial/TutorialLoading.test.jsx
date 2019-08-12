import React from 'react';
import { render } from '@testing-library/react';

import TutorialLoading from './TutorialLoading';

// We don't need to test this inner component, which requires Oauth context,
// since it has it's own tests.
jest.mock('./TutorialTeaser', () => () => 'TutorialTeaser');

describe('Component: <TutorialLoading />', () => {
  it('renders correctly', () => {
    // Basic snapshot test.
    const { asFragment } = render(
      <TutorialLoading
        title="Tacos Rock"
        summary="<p>Tacos <strong>go here</strong> ...</p>"
      />
    );
    const firstRender = asFragment();
    expect(firstRender).toMatchSnapshot();
  });
});
