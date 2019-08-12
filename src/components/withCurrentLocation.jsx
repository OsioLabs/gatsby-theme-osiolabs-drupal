import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Location } from '@reach/router';

/**
 * HOC to wrap a child component and inject the current location.
 *
 * This uses the Location component from @reach/router to get the current location.
 * But is also smart enough to deal with SSR where the location isn't set and
 * instead needs to get pulled from configuration data.
 *
 * @param {*} Component
 */
export const withCurrentLocation = Component => props => (
  <Location>
    {({ location }) => {
      // This is required because during gatsby build (SSR) the value of
      // location.origin will not be set, But, we need to make sure that we
      // include a valid URL in the &redirect_uri parameter or OAuth won't
      // work on SSR pages.
      let locationRoot = '';
      if (
        typeof location.origin === 'undefined' &&
        process.env.GATSBY_ROOT_URL
      ) {
        locationRoot = process.env.GATSBY_ROOT_URL;
      } else {
        locationRoot = location.origin;
      }

      return (
        <Component
          {...props}
          currentLocationRoot={locationRoot}
          currentLocation={location}
        />
      );
    }}
  </Location>
);

export default withCurrentLocation;
