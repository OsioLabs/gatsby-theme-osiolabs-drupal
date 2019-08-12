import retry from 'async-retry';
import qs from 'qs';

class DrupalOauth {
  processing = false;

  /**
   *
   * @param config
   * - drupal_root:
   * - token_url:
   * - authorize_url:
   * - client_id:
   * - client_secret:
   */
  constructor(config) {
    this.config = config;
    this.config.token_url = `${this.config.drupal_root}/oauth/token`;
    this.config.authorize_url = `${this.config.drupal_root}/oauth/authorize`;
  }

  /**
   * Check to see if the current user is logged in.
   *
   * If the user was previously logged in but their access token is expired
   * attempt to retrieve a new token.
   *
   * @param {function} refreshComplete
   *  Optional callback function to call after a refresh token has been
   *  processed.
   *
   * @returns <Mixed>
   *   The current users authorization token, or false.
   */
  isLoggedIn = async refreshComplete =>
    retry(async bail => {
      if (
        typeof localStorage === 'undefined' ||
        typeof window === 'undefined'
      ) {
        // This is being executed outside of the browser, so it's not going to work
        // and we can just bail out now
        bail();
        return false;
      }

      const token =
        localStorage.getItem('drupal-oauth-token') !== null
          ? JSON.parse(localStorage.getItem('drupal-oauth-token'))
          : null;

      // If there is no token, and we're not processing, that means there is no
      // logged in user. So we're done.
      if (token === null && this.processing === false) {
        bail();
        return false;
      }

      // If we're currently trying to retrieve a refersh token from another
      // request then just retry.
      if (this.processing === true) {
        throw new Error('retry');
      }

      // If we've got an active token, the user is logged in, so we return their
      // current token.
      if (
        token !== null &&
        token.expirationDate > Math.floor(Date.now() / 1000)
      ) {
        this.processing = false;
        return token;
      }

      // If there is an existing token, but it's expired, see if we can get a
      // a new one using the refresh token. If not, see if we can get a refresh
      // token.
      this.processing = true;
      await this.getRefreshToken(token).then(fullfilledToken => {
        if (fullfilledToken !== null) {
          this.processing = false;
          if (typeof refreshComplete === 'function') {
            refreshComplete(true);
          }
          return fullfilledToken;
        }

        bail(new Error('Unable to retrieve an access token'));
        return false;
      });

      return false;
    });

  /**
   *
   */
  async handleLogin(username, password, scope) {
    return this.fetchOauthToken(username, password, scope);
  }

  /**
   * Log the current user out.
   *
   * Deletes the token from local storage.
   */
  // eslint-disable-next-line class-methods-use-this
  async handleLogout() {
    return localStorage.removeItem('drupal-oauth-token');
  }

  async getOauthToken(username, password, scope) {
    return this.fetchOauthToken(username, password, scope);
  }

  async getRefreshToken(token) {
    return this.refreshOauthToken(token);
  }

  /**
   * Get an OAuth token from Drupal.
   *
   * Exchange a an authorization code for an OAuth token. Uses ?code and other
   * parameters from the current URL.
   *
   * @returns {Promise<void>}
   *   Returns a promise that resolves with the new token returned from Drupal.
   */
  // eslint-disable-next-line consistent-return
  async fetchOauthToken(url) {
    this.processing = true;

    const queryString = qs.parse(url.split('?')[1], {
      ignoreQueryPrefix: true,
    });

    if (!queryString.code) {
      throw new Error('Can not retrieve authorization token without a code.');
    }

    const formData = new FormData();
    Object.keys(queryString).forEach(item => {
      formData.append(item, queryString[item]);
    });

    const response = await fetch(this.config.token_url, {
      method: 'post',
      headers: new Headers({
        Accept: 'application/json',
      }),
      body: formData,
    });

    if (response.ok) {
      const json = await response.json();

      if (json.error) {
        this.processing = false;
        throw new Error(json.error.message);
      }

      this.processing = false;
      return this.storeToken(json);
    }
  }

  /**
   * Exchange your refresh token for a new auth token.
   *
   * @param token
   * @param scope
   *
   * @returns {Promise<void>}
   *  Returns a Promise that resolves with the new token retrieved from Drupal.
   */
  // eslint-disable-next-line consistent-return
  async refreshOauthToken(token) {
    if (token !== null) {
      const formData = new FormData();
      formData.append('grant_type', 'refresh_token');
      formData.append('client_id', this.config.client_id);
      formData.append('client_secret', this.config.client_secret);
      formData.append('refresh_token', token.refresh_token);

      const response = await fetch(this.config.token_url, {
        method: 'post',
        headers: new Headers({
          Accept: 'application/json',
          'X-Consumer-ID': `${this.config.client_id}`,
        }),
        body: formData,
      });

      if (response.ok) {
        const json = await response.json();

        if (json.error) {
          throw new Error(json.error.message);
        }

        return this.storeToken(json);
      }

      throw new Error(response.status);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  storeToken(json) {
    const token = Object.assign({}, json);
    token.date = Math.floor(Date.now() / 1000);
    token.expirationDate = token.date + token.expires_in;
    localStorage.setItem('drupal-oauth-token', JSON.stringify(token));
    return token;
  }
}

export default DrupalOauth;
