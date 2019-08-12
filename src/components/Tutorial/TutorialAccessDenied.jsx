import React from 'react';
import { Container, Header } from 'semantic-ui-react';

const TutorialAccessDenied = () => (
  <Container className="tutrial--access-denied">
    <Header size="small">Access denied:</Header>
    <p>
      Your account does not have permission to view the complete content of this
      tutorial. If you believe this is an error please contact support.
    </p>
  </Container>
);

export default TutorialAccessDenied;
