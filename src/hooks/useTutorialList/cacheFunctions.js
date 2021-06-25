import LocalCache from '../../utils/localCacheLocalStorage';
import DrupalOauth from '../../components/drupal-oauth/DrupalOauth';

/**
 * Get a list of tutorials and associated meta-data.
 *
 * This returns a list of all the tutorials available on the site with metadata
 * that is specific to the current user. Like for example the read state of the
 * tutorial.
 *
 * After retrieving the list from the API it's cached locally for better
 * performance.
 *
 * @returns {Promise<any|null>}
 *   Returns a promise that resolves to an object containing key/value pairs
 *   where the key is the UUID of the tutorial, an the value is an object that
 *   contains the title, and the tutorial_read_state.
 *
 *   Example:
 *   {
 *     'UUID-1234-ASDF...': {
 *       title: 'Tutorial Title',
 *       tutorial_read_state: 'Read' // one of 'Read', 'Unread', null.
 *     }
 *   }
 */
export async function getDataFromCache() {
  const cache = LocalCache.create('tutorialList');

  // If the cache is empty see if we can populate it.
  if (cache && cache.data === null) {
    let token;
    try {
      // We need a valid OAuth token to make the request to Drupal with.
      const oauthClient = DrupalOauth.createFromEnvironment();
      token = await oauthClient.isLoggedIn();
    } catch (e) {
      token = false;
    }

    // Otherwise, get the list from Drupal, and cache it and return
    // the list.
    try {
      // The page[limit] is set to 30,000 which should be way more than the
      // most tutorials we'll ever have.
      let url;

      // Use a different URL that doesn't include the tutorial_read_state field
      // if the user is logged. This allows the anon user API request to be
      //cached.
      if (token) {
        url = `${process.env.GATSBY_DRUPAL_API_ROOT}/api/node/tutorial?filter[consumer.label][value]=heynode.com&fields[node--tutorial]=nid,title,tutorial_read_state&page[limit]=30000`;
      } else {
        url = `${process.env.GATSBY_DRUPAL_API_ROOT}/api/node/tutorial?filter[consumer.label][value]=heynode.com&fields[node--tutorial]=nid,title&page[limit]=30000`;
      }

      const headers = new Headers({
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'X-Consumer-ID': `${process.env.GATSBY_DRUPAL_API_ID}`,
      });

      // Append the user's access token if we've got one.
      if (token) {
        headers.append(
          'Authorization',
          `${token.token_type} ${token.access_token}`
        );
      }

      const options = {
        method: 'GET',
        headers,
      };

      const response = await fetch(url, options);
      const data = await response.json();

      // Validate the response.
      if (data === null || data.data === undefined || data.data === null) {
        return null;
      }

      const newList = {};
      data.data.forEach(item => {
        newList[item.id] = item.attributes;
      });

      cache.bulkAdd(newList);
      return cache.data;
    } catch (e) {
      return null;
    }
  } else {
    return cache.data;
  }
}

/**
 * Purge the locally cached list of tutorials.
 *
 * @returns {Promise<void>}
 */
export async function purgeDataFromCache() {
  return LocalCache.create('tutorialList').destroy();
}
