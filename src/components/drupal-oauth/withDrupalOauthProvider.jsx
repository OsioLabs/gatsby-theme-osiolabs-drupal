import React, { useEffect, useState } from 'react';
import DrupalOauthContext from './DrupalOauthContext';

/**
 * HOC to assist in initializing a Drupal OAuth context provider.
 *
 * Creates a new context with the following values:
 * - userAuthenticated: A boolean indicating if the current user is
 *   authenticated.
 * - drupalOauthClient: An instance of the DrupalOauth client from
 *   drupalOauthClient.js which can be used to access information about the
 *   current user.
 * - updateAuthenicaticatedUserState: A function that can be called by child
 *   components to update the value of userAuthenticated within the existing
 *   context.
 *
 * @param {*} client
 *   An instance of the drupalOAuth class from drupalOAuth.js that has already
 *   been initialized.
 * @param {*} Component
 *   The child component to wrap with the new context provider.
 */
const withDrupalOauthProvider = (client, Component) => props => {
  const [isAuthenticated, setUserAuthenticated] = useState(false);
  const [oauthClient, changeOauthClient] = useState(client);
  const [currentUserId, setUserId] = useState(null);

  // Figure out if the user is logged in or not. Wrap in useEffect so that we
  // only call this when the isAuthenticated state changes.
  useEffect(() => {
    oauthClient
      .isLoggedIn(setUserAuthenticated)
      .then(async token => {
        if (token !== false) {
          // Get the Drupal ID of the current user if we can.
          try {
            const url = `${process.env.GATSBY_DRUPAL_API_ROOT}/api`;
            const headers = new Headers({
              Accept: 'application/vnd.api+json',
              'Content-Type': 'application/vnd.api+json',
              Authorization: `${token.token_type} ${token.access_token}`,
              'X-Consumer-ID': `${process.env.GATSBY_DRUPAL_API_ID}`,
            });

            const options = {
              method: 'GET',
              headers,
            };

            const response = await fetch(url, options);
            const data = await response.json();
            setUserAuthenticated(true);
            setUserId(data.meta.links.me.meta.id);
          } catch (e) {
            // noop.
          }
        }
      })
      // eslint-disable-next-line no-unused-vars
      .catch(error => {
        setUserId('anon');
      });
  }, [isAuthenticated]);

  return (
    <DrupalOauthContext.Provider
      value={{
        userAuthenticated: isAuthenticated,
        currentUserId: currentUserId,
        drupalOauthClient: oauthClient,
        updateAuthenticatedUserState: setUserAuthenticated,
      }}
    >
      <Component {...props} />
    </DrupalOauthContext.Provider>
  );
};

export default withDrupalOauthProvider;
