import React from 'react';
import PropTypes from 'prop-types';
import withCurrentLocation from '../withCurrentLocation';
import withDrupalOauthConsumer from './withDrupalOauthConsumer';
import ConnectToDrupal from './ConnectToDrupal';

const OauthConnectButton = withDrupalOauthConsumer(ConnectToDrupal);

/**
 * Create a button to Login or Register with Drupal via Oauth.
 *
 * This is a convenience wrapper around <ConnecToDrupal />.
 */
const DrupalLoginButton = ({
  title,
  useRegistrationLink,
  queryString,
  currentLocation,
  currentLocationRoot,
  ...rest
}) => (
  <OauthConnectButton
    {...rest}
    title={title}
    redirectUri={`${currentLocationRoot}${currentLocation.pathname}`}
    useRegistrationLink={useRegistrationLink}
    queryString={queryString}
  />
);

DrupalLoginButton.propTypes = {
  title: PropTypes.string.isRequired,
  useRegistrationLink: PropTypes.bool,
  // Additional query string parameters to add to the link.
  queryString: PropTypes.string,
  currentLocation: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  currentLocationRoot: PropTypes.string.isRequired,
};

DrupalLoginButton.defaultProps = {
  useRegistrationLink: false,
  queryString: '',
};

export default withCurrentLocation(DrupalLoginButton);
