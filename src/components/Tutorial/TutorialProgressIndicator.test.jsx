import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TutorialListContext } from '../../hooks/useTutorialList';
import TutorialProgressIndicator from './TutorialProgressIndicator';

const dispatchMock = jest.fn();

const TutorialProgressIndicatorWithProvider = props => (
  <TutorialListContext.Provider
    value={{
      list: {
        list: { 'UUID-1': { tutorial_read_state: 'Unread' } },
      },
      dispatch: dispatchMock,
    }}
  >
    <TutorialProgressIndicator {...props} />
  </TutorialListContext.Provider>
);

describe('<TutorialProgressIndicator />', () => {
  it('Toggles progress on click', async () => {
    const { getByLabelText } = render(
      <TutorialProgressIndicatorWithProvider
        currentUserId="UUID-123"
        entityId="UUID-1"
      />
    );

    // Initial state shows an incomplete progress indicator. This demonstrates
    // that we can compute the state from the provided tutorial list.
    expect(getByLabelText('incomplete')).toBeTruthy();

    // Clicking on it converts to the "Read" state.
    fireEvent.click(getByLabelText('incomplete'));

    expect(getByLabelText('complete')).toBeTruthy();
    expect(dispatchMock).toHaveBeenCalled();
  });

  it('Displays progress based on complete prop when present.', async () => {
    // This uses the complete prop, and it should render a complete progress
    // indicator despite the fact that UUID-2 isn't in the list of tutorials
    // that we have data about.
    const { getByLabelText } = render(
      <TutorialProgressIndicatorWithProvider
        complete={true}
        currentUserId="UUID-123"
        entityId="UUID-2"
      />
    );

    expect(getByLabelText('complete')).toBeTruthy();
  });

  it('Shows the loading state when progress can not be computed', async () => {
    const { getByLabelText } = render(
      <TutorialProgressIndicatorWithProvider
        currentUserId="UUID-123"
        entityId="UUID-2"
      />
    );

    // Initial state shows an incomplete progress indicator.
    expect(getByLabelText('loading')).toBeTruthy();
  });
});
