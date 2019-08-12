import React from 'react';
import PropTypes from 'prop-types';
import { Container, Placeholder } from 'semantic-ui-react';
import TutorialTeaser from './TutorialTeaser';

const TutorialLoading = props => (
  <Container>
    <TutorialTeaser {...props} />
    <p />
    <Placeholder fluid>
      <Placeholder.Header>
        <Placeholder.Line />
      </Placeholder.Header>
      <Placeholder.Paragraph>
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
      </Placeholder.Paragraph>
      <Placeholder.Header>
        <Placeholder.Line />
      </Placeholder.Header>
      <Placeholder.Paragraph>
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
      </Placeholder.Paragraph>
    </Placeholder>
  </Container>
);

TutorialLoading.propTypes = {
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
};

export default TutorialLoading;
