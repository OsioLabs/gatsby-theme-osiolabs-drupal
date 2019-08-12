import React from 'react';
import PropTypes from 'prop-types';
import { Container, Segment } from 'semantic-ui-react';
import TutorialList from '../Tutorial/TutorialList';

const Collection = ({ summary, tutorials }) => (
  <Container>
    <div dangerouslySetInnerHTML={{ __html: summary }} />

    {tutorials && tutorials.length > 0 && (
      <Segment>
        <h2>Tutorials in this collection:</h2>
        <TutorialList tutorials={tutorials} />
      </Segment>
    )}
  </Container>
);

Collection.propTypes = {
  // eslint-disable-next-line
  id: PropTypes.string.isRequired,
  // eslint-disable-next-line
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line
  summary: PropTypes.string.isRequired,
  tutorials: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      tutorial_access: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Collection;
