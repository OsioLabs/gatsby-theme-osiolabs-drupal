import React from 'react';
import PropTypes from 'prop-types';
import { Link, navigate } from 'gatsby';
import { Card, Label, Icon } from 'semantic-ui-react';
import TutorialProgressIndicator from './TutorialProgressIndicator';

class TutorialCard extends React.Component {
  onClick = event => {
    event.preventDefault();
    const { path } = this.props;
    navigate(path);
  };

  render() {
    const {
      hasText,
      hasVideo,
      isPublic,
      isComingSoon,
      timeToComplete,
      title,
      path,
      summary,
      userAuthenticated,
    } = this.props;

    const displayLock = !userAuthenticated && !isPublic && !isComingSoon;

    return (
      <Card
        onClick={this.onClick}
        as="div"
        className={[
          isComingSoon && 'coming-soon',
          (isComingSoon || isPublic) && 'has-label',
        ].join(' ')}
      >
        {isPublic && !isComingSoon && (
          <Label as="span" corner="right" color="blue">
            Free!
          </Label>
        )}
        {isComingSoon && (
          <Label as="span" corner="right" color="red">
            Soon ...
          </Label>
        )}
        <Card.Content>
          <Card.Header as={Link} to={path}>
            {title}
            {' '}
            {displayLock && (
              <Icon
                name="lock"
                aria-label="Membership required. Preview available"
                size="small"
                color="red"
                fitted
              />
            )}
          </Card.Header>
          <Card.Description>
            {
              // Strip all the HTML tags, and then split out the first sentence.
              summary.replace(/<(?:.|\n)*?>/gm, '').split(/\.\s+/)[0]
              // The period after this is intentional because it's stripped above.
            }
            .
          </Card.Description>
        </Card.Content>
        <Card.Content>
          <Card.Meta className="left floated">
            {!userAuthenticated && (
              <TutorialProgressIndicator complete={false} entityId={1} />
            )}
            {hasText && (
              <Icon
                name="file text"
                aria-label="Tutorial contains text"
                size="small"
              />
            )}
            {hasVideo && (
              <Icon
                name="video play"
                aria-label="Tutorial has one or more videos"
                size="small"
              />
            )}
            {timeToComplete && ` ${timeToComplete}`}
          </Card.Meta>
          <Link to={path} className="right floated">
            {!displayLock && !isComingSoon ? 'Start now' : 'Preview'}
            <Icon name="angle double right" />
          </Link>
        </Card.Content>
      </Card>
    );
  }
}

TutorialCard.propTypes = {
  // Path to the tutorial relative to application root.
  path: PropTypes.string.isRequired,
  // Title of the tutorial.
  title: PropTypes.string.isRequired,
  // Summary of the tutorial.
  summary: PropTypes.string.isRequired,
  // Set to true if the tutorial is public and availble to anyone, otherwise set
  // to false if this is a members only tutorial.
  isPublic: PropTypes.bool,
  // Set to true if the tutorial is coming soon and should be displayed as a
  // teaser only.
  isComingSoon: PropTypes.bool,
  // Is the user viewing this authenticated?
  userAuthenticated: PropTypes.bool,
  // The tutorial contains text.
  hasText: PropTypes.bool,
  // The tutorial contains one more video embedded in it.
  hasVideo: PropTypes.bool,
  // 0-100, percent of the tutorial that the current viewer has completed.
  progress: PropTypes.number,
  // Time to complete. Estimated time in seconds it would take someone to
  // complete this tutorial.
  timeToComplete: PropTypes.number,
};

TutorialCard.defaultProps = {
  isPublic: false,
  isComingSoon: false,
  userAuthenticated: false,
  hasText: false,
  hasVideo: false,
  progress: 0,
  timeToComplete: null,
};

export default TutorialCard;
