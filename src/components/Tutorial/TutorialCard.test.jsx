import React from 'react';
import { render } from '@testing-library/react';

import TutorialCard from './TutorialCard';

describe('Component: <TutorialCard />', () => {
  it('renders correctly', () => {
    // Basic snapshot test.
    const { asFragment, getByText, queryByText } = render(
      <TutorialCard
        id="UUID-1"
        title="Tacos Rock"
        path="/tutorial/tacos"
        summary="This is some text. And it's long."
      />
    );
    const firstRender = asFragment();
    expect(firstRender).toMatchSnapshot();

    expect(getByText(/This is some text./)).toBeTruthy();
    expect(queryByText(/And it's long./)).toBeFalsy();
  });

  it('displays coming soon label', () => {
    // Basic snapshot test.
    const { getByText } = render(
      <TutorialCard
        id="UUID-1"
        title="Tacos Rock"
        path="/tutorial/tacos"
        summary="This is some text. And it's long."
        isComingSoon
      />
    );

    expect(getByText(/This is some text./)).toBeTruthy();
    expect(getByText('Soon ...')).toBeTruthy();
  });
});
