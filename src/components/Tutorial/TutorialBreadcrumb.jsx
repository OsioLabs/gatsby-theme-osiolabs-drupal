import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { Breadcrumb } from 'semantic-ui-react';

const TutorialBreadcrumb = props => (
  <Breadcrumb>
    <Breadcrumb.Section link as={Link} to="/">
      Home
    </Breadcrumb.Section>
    <Breadcrumb.Divider icon="right chevron" />
    <Breadcrumb.Section link as={Link} to={props.collection_path}>
      {props.collection_title}
    </Breadcrumb.Section>
    <Breadcrumb.Divider icon="right chevron" />
  </Breadcrumb>
);

TutorialBreadcrumb.propTypes = {
  collection_title: PropTypes.string,
  collection_path: PropTypes.string,
};

export default TutorialBreadcrumb;
