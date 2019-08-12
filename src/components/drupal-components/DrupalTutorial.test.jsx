import React from 'react';
import { render, cleanup, waitForElement } from '@testing-library/react';

// Create a mock DrupalOauth instance.
import DrupalOauth from '../drupal-oauth/DrupalOauth';

import DrupalTutorial from './DrupalTutorial';

jest.mock('../drupal-oauth/DrupalOauth');
const drupalOauthClient = new DrupalOauth();

afterEach(cleanup);

beforeEach(() => {
  fetch.resetMocks();
  drupalOauthClient.isLoggedIn.mockClear();
});

const props = {
  id: 'aaaa-bbbb-cccc-dddd',
  title: 'Tacos Rock',
  summary: '<p>Tacos <strong>go here</strong> ...</p>',
  drupalOauthClient,
  userAuthenticated: true,
};

const MockTutorial = props => (
  <div>
    {props.error && props.error.toString()}
    {props.body && props.body}
  </div>
);

const MockTeaserTutorial = () => <div>Teaser ...</div>;

const MockLoadingTutorial = () => <div>Loading ...</div>;

const MockComingSoonTutorial = () => <div>Coming soon ...</div>;

describe('Component: <DrupalTutorial />', () => {
  it('works when data is retrieved from an API', async () => {
    // Mock an API response. Other than nesting in data: the shape doesn't
    // really matter. The DrupalTutorial component just passes whatever data
    // it gets back on the render function/component that it was provided with.
    fetch.mockResponseOnce(
      JSON.stringify({
        data: {
          attributes: {
            body: {
              processed:
                'Processed body content + <p>Text with <a href="//example.com/tutorial/one">a link</a>',
            },
          },
        },
      })
    );

    // Mock the Drupal domain so that we can test that internal
    // links get cleaned up.
    process.env.GATSBY_DRUPAL_API_ROOT = 'https://example.com';

    const { container, getByText, queryByText } = render(
      <DrupalTutorial
        tutorialComponent={MockTutorial}
        teaserComponent={MockTeaserTutorial}
        loadingComponent={MockLoadingTutorial}
        comingSoonComponent={MockComingSoonTutorial}
        tutorialAccess="membership_required"
        {...props}
      />
    );

    // Verify that first you see a loading message.
    expect(getByText('Loading ...')).toBeTruthy();

    // Then API calls should complete and we should see the returned data.
    await waitForElement(() => getByText(/Processed body content/));

    // Verify our API methods are called.
    expect(queryByText('Loading ...')).toBeFalsy();
    expect(drupalOauthClient.isLoggedIn).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);

    // Verify that internal links are cleaned up and have the Drupal domain
    // removed.
    expect(container.firstChild).not.toHaveTextContent(
      'href="//example.com/tutorial/one"'
    );
    expect(container.firstChild).toHaveTextContent('href="/tutorial/one"');
  });

  it('displays an error if there are errors while accessing the API', async () => {
    // Mock a failed fetch from the Drupal API.
    fetch.mockReject(new Error('fake error message'));

    const { getByText, queryByText } = render(
      <DrupalTutorial
        tutorialComponent={MockTutorial}
        teaserComponent={MockTeaserTutorial}
        loadingComponent={MockLoadingTutorial}
        comingSoonComponent={MockComingSoonTutorial}
        tutorialAccess="membership_required"
        {...props}
      />
    );

    expect(getByText('Loading ...')).toBeTruthy();
    expect(queryByText(/fake error message/)).toBeFalsy();
    await waitForElement(() => getByText(/fake error message/));

    expect(queryByText('Teaser ...')).toBeFalsy();
    expect(getByText(/fake error message/)).toBeTruthy();

    expect(drupalOauthClient.isLoggedIn).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('displays a teaser message for non authenticated users.', async () => {
    const { getByText } = render(
      <DrupalTutorial
        tutorialComponent={MockTutorial}
        teaserComponent={MockTeaserTutorial}
        loadingComponent={MockLoadingTutorial}
        comingSoonComponent={MockComingSoonTutorial}
        {...props}
        userAuthenticated={false}
        tutorialAccess="membership_required"
      />
    );

    await waitForElement(() => getByText('Teaser ...'));
    expect(getByText('Teaser ...')).toBeTruthy();

    expect(fetch).toHaveBeenCalledTimes(0);
  });

  it('displays the full version of public tutorials for anon users.', async () => {
    // Mock a failed attempt at getting an OAuth token.
    props.drupalOauthClient.isLoggedIn = jest
      .fn()
      .mockReturnValueOnce(new Error('bad token'));

    const { getByText, queryByText } = render(
      <DrupalTutorial
        tutorialComponent={MockTutorial}
        teaserComponent={MockTeaserTutorial}
        loadingComponent={MockLoadingTutorial}
        comingSoonComponent={MockComingSoonTutorial}
        {...props}
        userAuthenticated={false}
        tutorialAccess="public"
        body="<p>Peanut butter ice-cream is the best.</p>"
      />
    );

    expect(getByText(/Peanut butter ice-cream/)).toBeTruthy();
    expect(queryByText(/Tacos/)).toBeFalsy();
  });

  it('displays a the coming soon component for coming_soon tutorials', async () => {
    const { getByText } = render(
      <DrupalTutorial
        tutorialComponent={MockTutorial}
        teaserComponent={MockTeaserTutorial}
        loadingComponent={MockLoadingTutorial}
        comingSoonComponent={MockComingSoonTutorial}
        {...props}
        userAuthenticated={false}
        tutorialAccess="coming_soon"
      />
    );

    await waitForElement(() => getByText('Coming soon ...'));
    expect(getByText('Coming soon ...')).toBeTruthy();

    expect(fetch).toHaveBeenCalledTimes(0);
  });
});
