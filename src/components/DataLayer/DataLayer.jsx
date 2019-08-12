import React from 'react';

/**
 * A component for pushing events into the Google Tag Manager datalayer. Uses
 * componentDidMount() to ensure a window DOM element is available.
 */
class DataLayer extends React.Component {
  componentDidMount() {
    if (typeof window.dataLayer !== 'undefined') {
      // If there is drupal-oauth-token in local storage they're probably logged
      // in, or will be eventually. And that's good enough for this data point.
      if (localStorage.getItem('drupal-oauth-token') !== null) {
        window.dataLayer.push({ authentication_status: 'signed in' });
      } else {
        window.dataLayer.push({ authentication_status: 'signed out' });
      }
    }
  }

  render() {
    return null;
  }
}

export default DataLayer;
