import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, navigate } from 'gatsby';
import { Item, Icon, Label } from 'semantic-ui-react';

import withDrupalOauthConsumer from '../drupal-oauth/withDrupalOauthConsumer';
import TutorialProgressIndicator from './TutorialProgressIndicator';

class TutorialItem extends Component {
  onClick = event => {
    event.preventDefault();
    const { path } = this.props;
    navigate(path);
  };

  render() {
    const {
      hasText,
      hasVideo,
      path,
      isPublic,
      isComingSoon,
      sequence,
      timeToComplete,
      title,
      userAuthenticated,
    } = this.props;

    const displayLock = !userAuthenticated && !isPublic && !isComingSoon;
    const displayFree = isPublic && !isComingSoon;

    return (
      <Item className="tutorial--item" onClick={this.onClick}>
        {sequence && (
          <Item.Content className="sequence">
            <Label color="purple">
              {sequence}
            </Label>
          </Item.Content>
        )}
        <Item.Content className="progress">
          {userAuthenticated &&
            <TutorialProgressIndicator/>
          }
        </Item.Content>
        <Item.Content>
          <Item.Header>
            <Link to={path}>{title}</Link>
          </Item.Header>
          <Item.Meta>
            {hasText && (
              <Icon name="file text" aria-label="Tutorial contains text" />
            )}
            {hasVideo && (
              <Icon
                name="video play"
                aria-label="Tutorial has one or more videos"
              />
            )}
            {timeToComplete && ` ${timeToComplete}`}
          </Item.Meta>
        </Item.Content>
        {(displayLock || displayFree || isComingSoon) && (
          <Item.Content className="lock">
            {displayLock && (
              <Icon
                name="lock"
                aria-label="Membership required. Preview available"
                size="large"
              />
            )}
            {displayFree && (
              <Label as="span">
                free
              </Label>
            )}
            {isComingSoon && (
              <Label as="span">
                next up
              </Label>
            )}
          </Item.Content>
        )}
      </Item>
    );
  }
}

TutorialItem.propTypes = {
  // Path to the tutorial relative to application root.
  path: PropTypes.string.isRequired,
  // Title of the tutorial.
  title: PropTypes.string.isRequired,
  // Set to true if the tutorial is public and availble to anyone, otherwise set
  // to false if this is a members only tutorial.
  isPublic: PropTypes.bool,
  // Set to true if the tutorial is coming soon.
  isComingSoon: PropTypes.bool,
  // If the tutorial is being displayed as part of a sequence this is it's
  // position in the list.
  sequence: PropTypes.number,
  // The tutorial contains text.
  hasText: PropTypes.bool,
  // The tutorial contains one more video embedded in it.
  hasVideo: PropTypes.bool,
  // 0-100, percent of the tutorial that the current viewer has completed.
  progress: PropTypes.number,
  // Time to complete. Estimated time in seconds it would take someone to
  // complete this tutorial.
  timeToComplete: PropTypes.number,
  userAuthenticated: PropTypes.bool.isRequired,
};

TutorialItem.defaultProps = {
  isPublic: false,
  isComingSoon: false,
  sequence: null,
  hasText: false,
  hasVideo: false,
  progress: 0,
  timeToComplete: null,
};

export default withDrupalOauthConsumer(TutorialItem);
