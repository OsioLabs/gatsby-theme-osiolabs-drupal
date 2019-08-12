import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

const TutorialPrevNext = ({ previous, next }) => (
  <div>
    {previous && <Link to={previous.path.alias}>&larr; {previous.title}</Link>}
    {next && <Link to={next.path.alias}>{next.title}&rarr;</Link>}
  </div>
);

TutorialPrevNext.propTypes = {
  previous: PropTypes.shape({
    title: PropTypes.string.isRequired,
    path: PropTypes.shape({
      alias: PropTypes.string.isRequired,
    }),
  }),
  next: PropTypes.shape({
    title: PropTypes.string.isRequired,
    path: PropTypes.shape({
      alias: PropTypes.string.isRequired,
    }),
  }),
};

export default TutorialPrevNext;
