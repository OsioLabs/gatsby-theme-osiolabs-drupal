import React from 'react';
import PropTypes from 'prop-types';
import { Item } from 'semantic-ui-react';
import TutorialItem from './TutorialItem';

const TutorialList = ({ tutorials }) => (
  <Item.Group>
    {tutorials.map((item, index) => (
      <TutorialItem
        title={item.title}
        path={item.path}
        sequence={index + 1}
        key={index + 1}
        hasText
        hasVideo
        timeToComplete="3 minutes"
      />
    ))}
  </Item.Group>
);

TutorialList.propTypes = {
  // Tutorials is an array of tutorial items with keys title, id, and path.
  tutorials: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      path: PropTypes.string,
    })
  ).isRequired,
};

export default TutorialList;
