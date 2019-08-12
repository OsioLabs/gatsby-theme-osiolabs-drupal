import React from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import {OauthReceiver} from 'react-oauth-flow';
import withCurrentLocation from '../withCurrentLocation';
import withDrupalOauthConsumer from './withDrupalOauthConsumer';

class ReceiveFromDrupal extends React.Component {
  state = {
    codePresent: false,
  };

  componentDidMount() {
    if (/code=/.test(window.location.search)) {
      this.setState({ codePresent: true });
    }
  }

  handleSuccess = (accessToken, { response, state }) => {
    const { updateAuthenticatedUserState } = this.props;
    updateAuthenticatedUserState(true);
  };

  handleError = error => {
    // @todo: What should we do when this doesn't work?
  };

  // Drupal's Simple Oauth module expects parameters to be be form encoded and
  // in the body of the request. The default fetch function of the OauthReceiver
  // component uses query string arguments. So we provide our own implementation.
  fetchToken = (url, fetchArgs) => {
    try {
      const token = this.props.drupalOauthClient.fetchOauthToken(url)
        .then(response => {
          return response;
        });
      return token;
    } catch (e) {
      throw e;
    }
  };

  render() {
    // Normalize the redirect URI so that it always contains a trailing slash.
    // Gatsby likes to redirect example.com/asdf?code= to example.com/asdf/?code=
    // and if the URL that we send in the original request doesn't match the one
    // we use to verify the ?code= param there will be problems.
    const {
      currentLocation,
      currentLocationRoot,
      drupalOauthClient,
    } = this.props;

    const { codePresent } = this.state;

    let redirectUri = `${currentLocationRoot}${currentLocation.pathname}`;

    redirectUri += redirectUri.endsWith('/') ? '' : '/';

    if (codePresent) {
      return (
        <OauthReceiver
          tokenUrl={drupalOauthClient.config.token_url}
          clientId={drupalOauthClient.config.client_id}
          clientSecret={drupalOauthClient.config.client_secret}
          redirectUri={redirectUri}
          onAuthSuccess={this.handleSuccess}
          onAuthError={this.handleError}
          tokenFn={this.fetchToken}
          render={({ processing, state, error }) => (
            <div data-testid="receiver" style={{display: 'none'}}>
              {processing && <p>Authorizing now...</p>}
              {error && (
                <p className="error">An error occurred: {error.message}</p>
              )}
            </div>
          )}
        />
      );
    }

    // Render nothing.
    return <></>;
  }
}

ReceiveFromDrupal.propTypes = {
  drupalOauthClient: PropTypes.object.isRequired,
  updateAuthenticatedUserState: PropTypes.func.isRequired,
  currentLocation: PropTypes.object.isRequired,
  currentLocationRoot: PropTypes.string.isRequired,
};

export default withCurrentLocation(withDrupalOauthConsumer(ReceiveFromDrupal));
