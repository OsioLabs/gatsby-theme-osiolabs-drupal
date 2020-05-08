import React from 'react';
import { act, render, fireEvent, screen } from '@testing-library/react';
import {
  TutorialListContext,
  TutorialListProvider,
} from '../../hooks/useTutorialList';
import TutorialProgressIndicator from './TutorialProgressIndicator';

// Create a mock DrupalOauth instance.
// This is necessary because tutorialListReducer() uses DrupalOauth to sync
// data with Drupal when a tutorial's read state is changed.
jest.mock('../drupal-oauth/DrupalOauth');
const dispatchMock = jest.fn();

beforeEach(() => {
  fetch.resetMocks();
});

const mockList = {
  'uuid-1': { title: 'Tutorial One', tutorial_read_state: 'Unread' },
  'uuid-2': { title: 'Tutorial Two', tutorial_read_state: 'Unread' },
};

const TutorialProgressIndicatorWithProvider = ({ list: listData, ...rest }) => (
  <TutorialListContext.Provider
    value={{
      list: {
        list: listData,
      },
      dispatch: dispatchMock,
    }}
  >
    <TutorialProgressIndicator {...rest} />
  </TutorialListContext.Provider>
);

describe('<TutorialProgressIndicator />', () => {
  it('Toggles progress on click', async () => {
    const { getByLabelText } = render(
      <TutorialProgressIndicatorWithProvider
        list={mockList}
        currentUserId="UUID-123"
        entityId="uuid-1"
      />
    );

    // Initial state shows an incomplete progress indicator. This demonstrates
    // that we can compute the state from the provided tutorial list.
    expect(getByLabelText('incomplete')).toBeTruthy();

    // Clicking on it converts to the "Read" state.
    fireEvent.click(getByLabelText('incomplete'));

    expect(getByLabelText('complete')).toBeTruthy();
    // Check that the dispatch function was called, and that the state values
    // were updated to 'Unread'.
    expect(dispatchMock).lastCalledWith({
      type: 'update',
      data: {
        id: 'uuid-1',
        value: {
          ...mockList['uuid-1'],
          tutorial_read_state: 'Read',
        },
      },
    });

    // Clicking on it again converts to the "Unread" state.
    fireEvent.click(getByLabelText('complete'));

    expect(getByLabelText('incomplete')).toBeTruthy();
    // Check that the dispatch function was called, and that the state values
    // were updated to 'Unread'.
    expect(dispatchMock).lastCalledWith({
      type: 'update',
      data: {
        id: 'uuid-1',
        value: {
          ...mockList['uuid-1'],
          tutorial_read_state: 'Unread',
        },
      },
    });
  });

  it('Displays progress based on complete prop when present.', async () => {
    // This uses the complete prop, and it should render a complete progress
    // indicator despite the fact that uuid-x isn't in the list of tutorials
    // that we have data about.
    const { getByLabelText } = render(
      <TutorialProgressIndicatorWithProvider
        list={mockList}
        complete
        currentUserId="UUID-123"
        entityId="uuid-x"
      />
    );

    expect(getByLabelText('complete')).toBeTruthy();
  });

  it('Calculates current read state when `complete` prop is not provided', async () => {
    const { getByLabelText } = render(
      <TutorialProgressIndicatorWithProvider
        list={{
          'uuid-1': { title: 'Tutorial One', tutorial_read_state: 'Read' },
        }}
        currentUserId="UUID-123"
        entityId="uuid-1"
      />
    );

    expect(getByLabelText('complete')).toBeTruthy();
  });

  it('Shows the loading state when progress can not be computed', async () => {
    const { getByLabelText } = render(
      <TutorialProgressIndicatorWithProvider
        list={null}
        currentUserId="UUID-123"
        entityId="uuid-x"
      />
    );

    // Initial state shows an incomplete progress indicator.
    expect(getByLabelText('loading')).toBeTruthy();
  });

  /**
   * Unlike the tests above which provide a mock of the tutorialListReducer
   * function to the TutorialList context this one uses the actual
   * tutorialListReducer(), which requires mocking a few of it's dependencies.
   */
  it('Updates all instances of component associated with tutorial when any one changes the tutorial read state', async () => {
    // This mocks the request to the Drupal API that's used to populate the the
    // cache with data about tutorial read states from the current user. It
    // gets triggered when TutorialListProvider is initialized with no existing
    // list data.
    fetch.mockResponse(
      JSON.stringify({
        data: [
          {
            id: 'uuid-1',
            attributes: {
              title: 'Tutorial One',
              tutorial_read_state: 'Unread',
            },
          },
          {
            id: 'uuid-2',
            attributes: {
              title: 'Tutorial Two',
              tutorial_read_state: 'Unread',
            },
          },
        ],
      })
    );

    const wrapper = ({ children }) => (
      <TutorialListProvider currentUserId="UUID-123">
        {children}
      </TutorialListProvider>
    );

    await act(async () => {
      render(
        <>
          <TutorialProgressIndicator
            currentUserId="UUID-123"
            entityId="uuid-1"
            data-testid="indicator-1"
          />
          <TutorialProgressIndicator
            currentUserId="UUID-123"
            entityId="uuid-1"
            data-testid="indicator-2"
          />
          <TutorialProgressIndicator
            currentUserId="UUID-123"
            entityId="uuid-2"
            data-testid="indicator-3"
          />
        </>,
        { wrapper }
      );
    });

    // Initial state shows an incomplete progress indicator.
    expect(screen.getByTestId('indicator-1')).toHaveAttribute(
      'aria-label',
      'incomplete'
    );
    expect(screen.getByTestId('indicator-2')).toHaveAttribute(
      'aria-label',
      'incomplete'
    );
    expect(screen.getByTestId('indicator-3')).toHaveAttribute(
      'aria-label',
      'incomplete'
    );

    // Clicking on one should update the state for both.
    fireEvent.click(screen.getByTestId('indicator-1'));

    // First one updates because we clicked it, and useProgressIndicator changed
    // the internal state to complete when clicked.
    expect(screen.getByTestId('indicator-1')).toHaveAttribute(
      'aria-label',
      'complete'
    );
    // Second one updates because we clicked the first one, which triggers an
    // update to the tutorialList context to reflect the new state of the item
    // which then causes this 2nd component to re-render and display the new
    // value.
    expect(screen.getByTestId('indicator-2')).toHaveAttribute(
      'aria-label',
      'complete'
    );
    // Should remain unchanged.
    expect(screen.getByTestId('indicator-3')).toHaveAttribute(
      'aria-label',
      'incomplete'
    );
  });
});
