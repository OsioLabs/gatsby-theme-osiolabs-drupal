/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from 'react';
import TutorialListProvider from './src/hooks/useTutorialList/TutorialListProvider';
import DrupalOauth from './src/components/drupal-oauth/DrupalOauth';
import withDrupalOauthProvider from './src/components/drupal-oauth/withDrupalOauthProvider';
import withDrupalOauthConsumer from './src/components/drupal-oauth/withDrupalOauthConsumer';

// Initialize a new DrupalOauth client which we can use to seed the context
// provider.
const drupalOauthClient = DrupalOauth.createFromEnvironment();

const OauthProvider = withDrupalOauthProvider(drupalOauthClient, React.Fragment);
const TutorialListProviderWithOauthConsumer = withDrupalOauthConsumer(TutorialListProvider);

// eslint-disable-next-line react/prop-types
export const wrapRootElement = ({ element }) => (
  <OauthProvider>
    <TutorialListProviderWithOauthConsumer>
      {element}
    </TutorialListProviderWithOauthConsumer>
  </OauthProvider>
);
