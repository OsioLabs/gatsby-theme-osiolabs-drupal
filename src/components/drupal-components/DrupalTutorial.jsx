import React from 'react';
import PropTypes from 'prop-types';
import { InView } from 'react-intersection-observer';
import useProgressIndicator from '../../hooks/useProgressIndicator';

/**
 * Fix internal links.
 *
 * In content retrieved from Drupal internal links all point to the Drupal site
 * and we need to re-write them so that they're internal to this site, and not
 * the Drupal site where the data was pulled from.
 *
 * @param {string} string
 *   The string of data containing links to fix.
 * @returns {string|*}
 *   The value of string with any internal links fixed.
 */
function fixLinks(string) {
  if (typeof string === 'string') {
    const originalPath = process.env.GATSBY_DRUPAL_API_ROOT.replace(
      /http[s]?:/,
      ''
    );
    const pattern = new RegExp(`href="${originalPath}`, 'g');
    const replacement = 'href="';
    return string.replace(pattern, replacement);
  }

  return string;
}

/**
 * Utility component that marks tutorial as read whenever it comes into view.
 *
 * Place this after the end of the tutorial to automatically update a
 * previously unread tutorial to read when this comes into the viewport.
 */
const AutomaticProgressTracker = ({ entityId, currentReadState }) => {
  const [progress, markAsRead, markAsUnread] = useProgressIndicator(
    currentReadState,
    entityId
  );

  return (
    <InView
      as="div"
      threshold={0}
      // Give a 400px buffer for "complete".
      rootMargin="0px 0px 400px 0px"
      onChange={inView => {
        if (inView && progress.complete !== true) {
          markAsRead();
        }
      }}
    />
  );
};

/**
 * Component to display content for anon users.
 */
const AnonTutorial = props => {
  const {
    tutorialAccess,
    teaserComponent,
    tutorialComponent,
    comingSoonComponent,
  } = props;

  // Display the coming soon version if it's flagged as such.
  if (tutorialAccess === 'coming_soon') {
    return React.createElement(comingSoonComponent, {
      ...props,
      summary: fixLinks(props.summary),
      body: fixLinks(props.body),
    });
  }

  // Display the complete tutorial if it's public, or a teaser if it is not.
  if (tutorialAccess === 'public') {
    return React.createElement(tutorialComponent, {
      ...props,
      summary: fixLinks(props.summary),
      body: fixLinks(props.body),
    });
  }

  return React.createElement(teaserComponent, {
    ...props,
    summary: fixLinks(props.summary),
    body: fixLinks(props.body),
  });
};

/**
 * Component to display content for an authenticated user.
 *
 * Contains the logic for retrieving a tutorial from Drupal, but delegates
 * responsibility for rendering in order to ensure this component can be
 * re-used across projects.
 */
class AuthenticatedTutorial extends React.Component {
  state = {
    processing: true,
    data: null,
    error: null,
  };

  /**
   * Attempt to retrieve data from Drupal for this tutorial.
   *
   * First check to see if the user is logged in, and has a valid OAuth token.
   * Then use that token to make an authenticated request to Drupal's API in
   * order to retrieve the full content of the tutorial, including any data
   * that requires authorization to view.
   */
  getTutorial = async () => {
    const { props } = this;
    const url = `${process.env.GATSBY_DRUPAL_API_ROOT}/api/node/tutorial/${props.id}`;

    let data;
    let token;

    // We need a valid OAuth token to make the request to Drupal with.
    try {
      token = await props.drupalOauthClient.isLoggedIn();
    } catch (e) {
      return;
    }

    // See if we can get some data back from Drupal.
    try {
      const headers = new Headers({
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        Authorization: `${token.token_type} ${token.access_token}`,
        'X-Consumer-ID': `${process.env.GATSBY_DRUPAL_API_ID}`,
      });

      const options = {
        method: 'GET',
        headers,
      };

      const response = await fetch(url, options);
      data = await response.json();

      // Validate the response.
      if (data === null || data.data === undefined || data.data === null) {
        throw new Error('No valid data received from the API.');
      }

      if (typeof data.data.attributes !== 'undefined') {
        if (
          typeof data.data.attributes.body !== 'undefined' &&
          data.data.attributes.body.processed
        ) {
          data.data.attributes.body.processed = fixLinks(
            data.data.attributes.body.processed
          );
        } else {
          // If the API response doesn't return a body that means the current
          // user doesn't have permission to view the body content of the
          // tutorial. In order to prevent errors, we should set a default
          // value that indicates this. The display component can then decide
          // what to do with this information.
          data.data.attributes.body = {
            processed: false,
            reason: 'access denied',
          };
        }

        if (
          typeof data.data.attributes.summary !== 'undefined' &&
          data.data.attributes.summary.processed
        ) {
          data.data.attributes.summary.processed = fixLinks(
            data.data.attributes.summary.processed
          );
        }
      }

      this.setState({
        data: data.data,
        processing: false,
      });
    } catch (err) {
      this.setState({
        processing: false,
        error: err,
      });
    }
  };

  componentDidMount = () => {
    const { tutorialAccess } = this.props;
    if (tutorialAccess !== 'coming_soon') {
      this.getTutorial();
    }
  };

  render() {
    const {
      tutorialAccess,
      loadingComponent,
      comingSoonComponent,
      tutorialComponent,
      ...propsToPassDown
    } = this.props;
    const { processing, data, error } = this.state;

    const currentReadState = data ? data.attributes.tutorial_read_state : false;

    let bodyContent;
    if (data && data.attributes.body.processed) {
      bodyContent = data.attributes.body.processed;
    } else {
      bodyContent = fixLinks(propsToPassDown.body);
    }

    let summaryContent;
    if (data && data.attributes.summary.processed) {
      summaryContent = data.attributes.summary.processed;
    } else {
      summaryContent = fixLinks(propsToPassDown.summary);
    }

    // Display the coming soon version if it's flagged as such.
    if (tutorialAccess === 'coming_soon') {
      return React.createElement(comingSoonComponent, {
        ...propsToPassDown,
        summary: fixLinks(propsToPassDown.summary),
        body: fixLinks(propsToPassDown.body),
      });
    }

    // If we're currently in the process of trying to retrieve data from Drupal
    // display the processing placeholder tutorial.
    if (processing) {
      return React.createElement(loadingComponent, {
        ...propsToPassDown,
        summary: fixLinks(propsToPassDown.summary),
        body: bodyContent,
        error,
      });
    }

    // Display the full tutorial.
    const C = tutorialComponent;
    return (
      <>
        <C {...propsToPassDown} body={bodyContent} summary={summaryContent} error={error} />
        <AutomaticProgressTracker
          currentReadState={currentReadState}
          entityId={propsToPassDown.id}
        />
      </>
    );
  }
}

/**
 * Wrapper component used to toggle between authenticated/anon user display.
 */
const DrupalTutorial = ({ userAuthenticated, ...props }) => {
  if (userAuthenticated) {
    return (
      <AuthenticatedTutorial userAuthenticated={userAuthenticated} {...props} />
    );
  }

  return <AnonTutorial userAuthenticated={userAuthenticated} {...props} />;
};

DrupalTutorial.propTypes = {
  id: PropTypes.string.isRequired,
  // The summary and title are required so that they can be passed on to the
  // rendering component which can use them to render a placeholder while the
  // full version loads. This allows users to at least get started reading the
  // page while they wait for the rest of it to load.
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  // (optional) Body text for public tutorials, only include when it's safe to
  // display this to anon users.
  body: PropTypes.string,
  // Date the tutorial was laste updated.
  changed: PropTypes.instanceOf(Date),
  // Is the current user authenticated?
  userAuthenticated: PropTypes.bool.isRequired,
  // One of "public" or "membership_required".
  tutorialAccess: PropTypes.string.isRequired,
  // An instance of DrupalOauth.
  drupalOauthClient: PropTypes.object.isRequired,
  // Component used to display a full tutorial.
  tutorialComponent: PropTypes.func.isRequired,
  // Component used to display a teaser of a tutorial.
  teaserComponent: PropTypes.func.isRequired,
  // Component used to display a tutorial in the loading state. aka.) during the
  // process of making an API request to get to he data required to display a
  // complete tutorial.
  loadingComponent: PropTypes.func.isRequired,
  // Component used to display a tutorial that is marked as coming soon.
  comingSoonComponent: PropTypes.func.isRequired,
};

export default DrupalTutorial;
