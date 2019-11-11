import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Popup } from 'semantic-ui-react';
import useProgressIndicator from '../../hooks/useProgressIndicator';

const TutorialProgressIndicator = ({
  complete,
  entityId,
  ...rest
}) => {
  const [progress, toggleProgress] = useProgressIndicator(complete, entityId);

  if (progress.loading) {
    return (
      <Icon
        {...rest}
        name="circle notch"
        aria-label="loading"
        loading
        className="loading"
        color={progress.complete ? 'blue' : 'grey'}
      />
    );
  }

  if (progress.complete) {
    return (
      <Icon
        {...rest}
        name="check circle"
        aria-label="complete"
        className="complete"
        link
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          toggleProgress(false, entityId);
        }}
        color="blue"
      />
    );
  }

  return (
    <Icon
      {...rest}
      name="check circle outline"
      aria-label="incomplete"
      className="incomplete lightgray"
      link
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleProgress(true, entityId);
      }}
      color="grey"
    />
  );
};

/**
 * For additional props see @semantic-ui-react/Icon.
 */
TutorialProgressIndicator.propTypes = {
  // At the time the tutorial is initially display is it
  // complete or incomplete?
  complete: PropTypes.bool.isRequired,
  // Drupal ID of the entity that progress tracking relates to.
  entityId: PropTypes.number.isRequired,
};

const ProgressIndicatorWithPopup = props => (
  <Popup
    trigger={<TutorialProgressIndicator {...props} />}
    size="tiny"
    on="hover"
  >
    {props.complete ? 'Mark as incomplete' : 'Mark as complete'}
  </Popup>
);

export default ProgressIndicatorWithPopup;
