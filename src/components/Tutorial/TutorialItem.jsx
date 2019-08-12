import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { Item, Icon, Label } from 'semantic-ui-react';

const TutorialItem = ({
  hasText,
  hasVideo,
  path,
  progress,
  isPublic,
  sequence,
  timeToComplete,
  title,
}) => (
  <Item className="tutorial--item">
    {sequence && (
      <Item.Content>
        <Label circular>{sequence}</Label>
      </Item.Content>
    )}
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
    {!isPublic && (
      <Item.Content>
        <Icon
          name="lock"
          aria-label="Membership required. Preview available"
          size="large"
        />
      </Item.Content>
    )}
  </Item>
);

TutorialItem.propTypes = {
  // Path to the tutorial relative to application root.
  path: PropTypes.string.isRequired,
  // Title of the tutorial.
  title: PropTypes.string.isRequired,
  // Set to true if the tutorial is public and available to anyone, otherwise
  // set to false if this is a members only tutorial.
  isPublic: PropTypes.bool,
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
  timeToComplete: PropTypes.string,
};

TutorialItem.defaultProps = {
  isPublic: false,
  sequence: null,
  hasText: false,
  hasVideo: false,
  progress: 0,
  timeToComplete: null,
};

export default TutorialItem;
