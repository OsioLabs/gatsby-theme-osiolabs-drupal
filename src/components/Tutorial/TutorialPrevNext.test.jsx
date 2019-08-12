import React from 'react';
import { render } from '@testing-library/react';
import 'jest-dom/extend-expect';

import TutorialPrevNext from './TutorialPrevNext';

const previous = {
  title: 'Previous tutorial',
  path: {
    alias: '/asdf/previous',
  },
};

const next = {
  title: 'Next tutorial',
  path: {
    alias: '/asdf/next',
  },
};

describe('Component: <TutorialPrevNext />', () => {
  it('renders correctly', () => {
    // Basic snapshot test.
    const { asFragment } = render(
      <TutorialPrevNext previous={previous} next={next} />
    );
    const firstRender = asFragment();
    expect(firstRender).toMatchSnapshot();
  });

  it('does not display previous link if no tutorial specified', () => {
    const { asFragment } = render(<TutorialPrevNext next={next} />);
    expect(asFragment().textContent).toContain('Next tutorial');
    expect(asFragment().textContent).not.toContain('Previous tutorial');
  });

  it('does not display next link if no tutorial specified', () => {
    const { asFragment } = render(<TutorialPrevNext previous={previous} />);
    expect(asFragment().textContent).not.toContain('Next tutorial');
    expect(asFragment().textContent).toContain('Previous tutorial');
  });
});
