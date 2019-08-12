import React from 'react';
import { render } from '@testing-library/react';

import TutorialTeaser from './TutorialTeaser';

describe('Component: <TutorialTeaser />', () => {
  it('renders correctly', () => {
    // Basic snapshot test.
    const { asFragment } = render(
      <TutorialTeaser
        title="Tacos Rock"
        summary="<p>Tacos <strong>go here</strong> ...</p>"
        changed={new Date()}
      />
    );
    const firstRender = asFragment();
    expect(firstRender).toMatchSnapshot();
  });
});
