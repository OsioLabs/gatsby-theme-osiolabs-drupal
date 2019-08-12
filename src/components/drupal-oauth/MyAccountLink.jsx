import React from 'react';
import PropTypes from 'prop-types';
import withDrupalOauthConsumer from './withDrupalOauthConsumer';

const MyAccountLink = ({ title, drupalOauthClient, className }) => (
  <a
    href={`${drupalOauthClient.config.drupal_root}/user?consumerId=${drupalOauthClient.config.client_id}`}
    className={className}
  >
    {title}
  </a>
);

MyAccountLink.propTypes = {
  title: PropTypes.string.isRequired,
  drupalOauthClient: PropTypes.object.isRequired,
  className: PropTypes.string,
};

MyAccountLink.defaultProps = {
  className: '',
};

export default withDrupalOauthConsumer(MyAccountLink);
