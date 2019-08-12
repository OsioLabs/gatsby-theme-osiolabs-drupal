/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

// @TODO: The code in this file doesn't currently do anything. Something about
// trying to wrap elements like this breaks a bunch of other functionality
// so instead it makes more sense to do this in the layout.js of the site that
// implements this theme ... for now.

//import React from "react";

//import DrupalOauth from './src/components/drupal-oauth/drupalOauth';
//import withDrupalOauthProvider from './src/components/drupal-oauth/withDrupalOauthProvider';

// Initialize a new DrupalOauth client which we can use to seed the context
// provider.
/*
const drupalOauthClient = new DrupalOauth({
  drupal_root: process.env.GATSBY_DRUPAL_API_ROOT,
  client_id: process.env.GATSBY_DRUPAL_API_ID,
  client_secret: process.env.GATSBY_DRUPAL_API_SECRET,
});
*/

// Compose a component with the drupalOauthClient provided that we can use to
// wrap the entire application.
/*
const RootElement = ({ children }) => <>{children}</>;
const RootElementWithOauthClient = withDrupalOauthProvider(drupalOauthClient, RootElement);
*/

/**
 * Implements Gatsby Page API wrapRootElement.
 *
 * Wrap the application with our OAuth provider.
 */
/*
export const wrapRootElement = ({ element }) => {
  return <ReceiveFromDrupal>{element}</ReceiveFromDrupal>;
};
*/
