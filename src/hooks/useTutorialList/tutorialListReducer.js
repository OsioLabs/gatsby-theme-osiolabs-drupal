import LocalCache from '../../utils/localCacheLocalStorage';
import DrupalOauth from '../../components/drupal-oauth/DrupalOauth';

function tutorialListReducer(state, action) {
  const { list } = state;
  switch (action.type) {
    case 'initialize':
      return { list: action.data };

    case 'update':
      // Update the local cache.
      LocalCache.create('tutorialList').set(action.data.id, action.data.value);
      // Update Drupal. It's fine to do this async, and not worry much about
      // errors. We can assume that this is going to complete. And if for some
      // weird reason it doesn't it's probably fine.
      DrupalOauth.createFromEnvironment()
        .isLoggedIn()
        .then(async token => {
          if (token) {
            const url = `${process.env.GATSBY_DRUPAL_API_ROOT}/api/flaggings_or_whatever...`;

            const headers = new Headers({
              Accept: 'application/vnd.api+json',
              'Content-Type': 'application/vnd.api+json',
              'X-Consumer-ID': `${process.env.GATSBY_DRUPAL_API_ID}`,
              Authorization: `${token.token_type} ${token.access_token}`,
            });

            const options = {
              method: 'POST',
              headers,
            };

            // @TODO: Make this actually save to Drupal when we know what that
            // API looks like.
            console.log('update drupal with the data please!');
            //const response = await fetch(url, options);
            //const data = await response.json();
          }
          return true;
        });
      list[action.data.id] = action.data.value;
      return { ...state, list: list };

    default:
      throw new Error('Unknown action type');
  }
}

export default tutorialListReducer;
