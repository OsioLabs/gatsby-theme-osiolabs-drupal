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
            const readUnread =
              action.data.value.tutorial_read_state === 'Read'
                ? 'read'
                : 'unread';
            const url = `${process.env.GATSBY_DRUPAL_API_ROOT}/api/flag/${readUnread}`;

            const headers = new Headers({
              Accept: 'application/vnd.api+json',
              'Content-Type': 'application/vnd.api+json',
              'X-Consumer-ID': `${process.env.GATSBY_DRUPAL_API_ID}`,
              Authorization: `${token.token_type} ${token.access_token}`,
            });

            const body = {
              data: {
                attributes: {
                  entity_uuid: action.data.id,
                },
              },
            };

            const options = {
              method: 'POST',
              headers,
              body: JSON.stringify(body),
            };

            const response = await fetch(url, options);
            const data = await response.json();
            // @todo: Do we want to do any error handling here? Or just not
            // worry about it because this isn't critical data?
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
