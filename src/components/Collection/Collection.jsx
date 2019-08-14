import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Image, Grid } from 'semantic-ui-react';
import TutorialList from '../Tutorial/TutorialList';

const Collection = ({ title, summary, tutorials }) => (
  <Container className="collection">
    <Grid columns={1} stackable centered>
      <Grid.Row>
        <Grid.Column computer={7} tablet={10} mobile={12} relaxed>
          <Header as="h1">{title}</Header>
          <Container dangerouslySetInnerHTML={{ __html: summary }} />
          {tutorials && tutorials.length > 0 && (
            <>
              <Header as="h2">Tutorials in this collection</Header>
              <TutorialList tutorials={tutorials} />
            </>
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
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
