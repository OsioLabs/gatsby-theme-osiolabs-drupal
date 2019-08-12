import React from 'react';
import { render } from '@testing-library/react';

import TutorialBreadcrumb from './TutorialBreadcrumb';

describe('Component: <TutorialBreadcrumb />', () => {
  it('renders correctly', () => {
    // Basic snapshot test.
    const { asFragment } = render(
      <TutorialBreadcrumb
        collection_title="Tacos Rock"
        collection_path="/collection/tacos"
      />
    );
    const firstRender = asFragment();
    expect(firstRender).toMatchSnapshot();
  });
});
