import React from 'react';
import { render, wait } from '@testing-library/react';
// Done this way so we can mock internal functions.
import TutorialListProvider from './TutorialListProvider';

jest.mock('./cacheFunctions');
import { getDataFromCache, purgeDataFromCache } from './cacheFunctions';

const mockList = {
  'UUID-1': { title: 'Tutorial One', tutorial_read_state: 'Read' },
  'UUID-2': { title: 'Tutorial One', tutorial_read_state: 'Unread' },
};

const Dummy = () => <p>Hello world</p>;

beforeEach(() => {
  getDataFromCache.mockClear();
  getDataFromCache.mockResolvedValue(mockList);
  purgeDataFromCache.mockClear();
  purgeDataFromCache.mockResolvedValue(true);
});

describe('<TutorialListProvider />', () => {
  it('Triggers a cache purge when the currentUserId changes.', async () => {
    const { getByText, rerender } = render(
      <TutorialListProvider currentUserId="anon">
        <Dummy />
      </TutorialListProvider>
    );

    await wait(() => getByText('Hello world'));
    expect(getDataFromCache).toHaveBeenCalledTimes(1);
    expect(purgeDataFromCache).toHaveBeenCalledTimes(0);

    // Change the currentUserId, using rerender is the same as updating the
    // props value of the existing component. This should cause the cached
    // data to get purged, and refreshed. This is testing what happens when a
    // user logs in, or out.
    rerender(
      <TutorialListProvider currentUserId="user-1">
        <Dummy />
      </TutorialListProvider>
    );

    await wait(() => getByText('Hello world'));
    expect(getDataFromCache).toHaveBeenCalledTimes(2);
    expect(purgeDataFromCache).toHaveBeenCalledTimes(1);
  });
});
