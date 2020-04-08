import React from 'react';
import { render } from '@testing-library/react';
import Tutorial from './Tutorial';
import { TutorialListContext } from '../../hooks/useTutorialList';

// Mock the TutorialList context so that the <TutorialProgressIndicator />
// in the Tutorial component doesn't break.
// eslint-disable-next-line react/prop-types
const MockProviders = ({ children }) => (
  <TutorialListContext.Provider
    value={{
      list: { list: null },
    }}
  >
    {children}
  </TutorialListContext.Provider>
);

const props = {
  id: 'aaaa-bbbb-cccc-dddd',
  title: 'Tacos Rock',
  summary: '<p>Tacos <strong>go here</strong> ...</p>',
  changed: new Date(),
  processing: true,
  currentUserId: 'UUID-123',
};

describe('Component: <Tutorial />', () => {
  it('renders correctly', () => {
    const propsCopy = props;
    propsCopy.data = {
      attributes: {
        body: {
          processed: '<p>This is the full tutorial content.</p>',
        },
      },
    };
    const { container } = render(<Tutorial {...propsCopy} />, {
      wrapper: MockProviders,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  // If there is no body content either in props.body or
  // props.data.attributes.body.processed show an access denied message.
  it('renders access deined', () => {
    const propsCopy = props;
    propsCopy.processing = false;
    const { container } = render(<Tutorial {...propsCopy} />,{
      wrapper: MockProviders,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders an error', () => {
    const propsCopy = props;
    propsCopy.processing = false;
    propsCopy.error = new Error("Oh no, we're all out of cake.");
    const { container } = render(<Tutorial {...propsCopy} />,{
      wrapper: MockProviders,
    });
    expect(container.firstChild).toMatchSnapshot();
  });
});
