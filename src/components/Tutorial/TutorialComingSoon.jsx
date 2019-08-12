import React from 'react';
import PropTypes from 'prop-types';
import Prism from 'prismjs';
import { Container, Header } from 'semantic-ui-react';

// Styling for code syntax highlighting.
require('prismjs/themes/prism.css');

const TutorialComingSoon = ({ title, summary }) => (
  <Container>
    <Header as="h1">{title}</Header>
    <Header as="h2">Coming soon:</Header>
    <div dangerouslySetInnerHTML={{ __html: summary }} />
  </Container>
);

TutorialComingSoon.componentDidMount = () => {
  // Whenever the component updates trigger Prism so that any new content will
  // get syntax highlighting.
  Prism.highlightAll();
};

TutorialComingSoon.propTypes = {
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  changed: PropTypes.instanceOf(Date).isRequired,
};

export default TutorialComingSoon;
