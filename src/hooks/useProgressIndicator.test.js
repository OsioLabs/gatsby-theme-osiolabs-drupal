import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { TutorialListContext } from './useTutorialList';
import useProgressIndicator from './useProgressIndicator';

const mockList = {
  'UUID-1': { title: 'Tutorial One', tutorial_read_state: 'Read' },
  'UUID-2': { title: 'Tutorial One', tutorial_read_state: 'Unread' },
};

describe('the useProgressIndicator hook', () => {
  it('Indicates loading if `initialValue` is null and there is no data from useTutorialList yet.', async () => {
    const wrapper = ({ children }) => (
      <TutorialListContext.Provider
        currentUserId="UUID-123"
        value={{
          list: { list: null },
        }}
      >
        {children}
      </TutorialListContext.Provider>
    );

    const { result } = renderHook(
      () => useProgressIndicator(null, 'UUID-1'),
      { wrapper }
    );

    expect(result.current[0]).toEqual({
      loading: true,
      complete: null,
    });
  });

  it('Locates current progress in results from useTutorialList if initialValue is null.', async () => {
    const wrapper = ({ children }) => (
      <TutorialListContext.Provider
        currentUserId="UUID-123"
        value={{
          list: { list: mockList },
        }}
      >
        {children}
      </TutorialListContext.Provider>
    );

    const { result } = renderHook(
      () => useProgressIndicator(null, 'UUID-1'),
      { wrapper }
    );

    expect(result.current[0]).toEqual({
      loading: false,
      complete: true,
    });
  });

  it('Callback functions work to toggle read/unread state.', async () => {
    const dispatchMock = jest.fn();
    const wrapper = ({ children }) => (
      <TutorialListContext.Provider
        currentUserId="UUID-123"
        value={{
          list: { list: mockList },
          dispatch: dispatchMock,
        }}
      >
        {children}
      </TutorialListContext.Provider>
    );

    const { result } = renderHook(
      () => useProgressIndicator(null, 'UUID-1'),
      { wrapper }
    );

    // Verify that the progress is initially set to "Read" based on looking it
    // up in the list. Then use the markAsRead() and markAsUnread() functions to
    // toggle between read/unread.
    const [progress, markAsRead, markAsUnread] = result.current;

    expect(result.current[0]).toEqual({
      loading: false,
      complete: true,
    });

    act(() => {
      markAsUnread();
    });

    // Check that the dispatch function was called, and that the state values
    // were updated to 'Unread'.
    expect(dispatchMock).lastCalledWith({
      type: 'update',
      data: {
        id: 'UUID-1',
        value: {
          ...mockList['UUID-1'],
          tutorial_read_state: 'Unread',
        },
      },
    });
    expect(result.current[0]).toEqual({
      loading: false,
      complete: false,
    });

    act(() => {
      markAsRead();
    });

    expect(dispatchMock).lastCalledWith({
      type: 'update',
      data: {
        id: 'UUID-1',
        value: {
          ...mockList['UUID-1'],
          tutorial_read_state: 'Read',
        },
      },
    });
    expect(result.current[0]).toEqual({
      loading: false,
      complete: true,
    });
  });
});
