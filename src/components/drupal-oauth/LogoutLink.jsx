import React from 'react';
import PropTypes from 'prop-types';
import withDrupalOauthConsumer from './withDrupalOauthConsumer';

/**
 * Example usage:
 * <LogoutLink
 *    component={(props) => (
 *      <button onClick={props.onClick}>Log out</button>
 *    )}
 * />
 */
class LogoutLink extends React.Component {
  onClick = async event => {
    const { drupalOauthClient, updateAuthenticatedUserState } = this.props;
    event.preventDefault();
    await drupalOauthClient.handleLogout();
    updateAuthenticatedUserState(false);
  };

  render() {
    const { component, render, children } = this.props;
    const { onClick } = this;

    if (component != null) {
      return React.createElement(component, { onClick });
    }

    if (render != null) {
      return render({ onClick });
    }

    if (children != null) {
      React.Children.only(children);
      return children({ onClick });
    }

    return null;
  }
}

LogoutLink.propTypes = {
  drupalOauthClient: PropTypes.object.isRequired,
  updateAuthenticatedUserState: PropTypes.func.isRequired,
  render: PropTypes.func,
  component: PropTypes.func,
  children: PropTypes.func,
};

export default withDrupalOauthConsumer(LogoutLink);
