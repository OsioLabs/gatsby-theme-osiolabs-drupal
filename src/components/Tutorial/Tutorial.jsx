import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Label } from 'semantic-ui-react';

// Styling for code syntax highlighting.
import Prism from 'prismjs';
import TutorialAccessDenied from './TutorialAccessDenied';
import TutorialProgressIndicator from './TutorialProgressIndicator';

require('prismjs/themes/prism.css');

/**
 * Render a tutorial.
 *
 * Initially render a tutorial teaser using the <TutorialTeaser/> component,
 * with a placeholder graphic underneath. Then once the data has been loaded
 * from the server use that content instead.
 *
 * For use with <DrupalTutorial />.
 */
class Tutorial extends React.Component {
  componentDidMount() {
    Prism.highlightAll();
  }

  render() {
    const { error, title, summary, body, userAuthenticated } = this.props;

    return (
      <Container>
        {!userAuthenticated &&
          <TutorialProgressIndicator complete entityId={1} />
        }
        <Header as="h1">{title}</Header>
        {error && (
          // eslint-disable-next-line react/jsx-one-expression-per-line
          <Label basic color='red'>
            Unable to load tutorial content. {error.toString()}
          </Label>
        )}

        {summary && <div dangerouslySetInnerHTML={{ __html: summary }} />}
        <p />

        {body ? (
          <div dangerouslySetInnerHTML={{ __html: body }} />
        ) : (
          <TutorialAccessDenied />
        )}
      </Container>
    );
  }
}

Tutorial.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  body: PropTypes.string,
  changed: PropTypes.instanceOf(Date).isRequired,
  error: PropTypes.object,
};

export default Tutorial;
