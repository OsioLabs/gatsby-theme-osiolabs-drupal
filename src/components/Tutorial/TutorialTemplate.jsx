import React from 'react';
import { Link } from 'gatsby';
import { Container, Grid, Menu } from 'semantic-ui-react';

import DrupalTutorial from '../drupal-components/DrupalTutorial';
import Tutorial from './Tutorial';
import TutorialTeaser from './TutorialTeaser';
import TutorialLoading from './TutorialLoading';
import TutorialComingSoon from './TutorialComingSoon';
import TutorialBreadcrumb from './TutorialBreadcrumb';
import withDrupalOauthConsumer from '../drupal-oauth/withDrupalOauthConsumer';
import SEO from '../Seo/Seo';
import TutorialPrevNext from './TutorialPrevNext';
import SignupNag from "../SignupNag/SignupNag";

const TutorialWithOauthConsumer = withDrupalOauthConsumer(DrupalTutorial);

/**
 * Base TutorialTemplate component.
 *
 * You'll mostly likely want to either override, or extend, this component for
 * a site specific implementation.
 */
const TutorialTemplate = props => {
  const { userAuthenticated } = props;
  const { nodeTutorial: tutorial } = props.data;
  const collection = tutorial.relationships.node__collection[0];

  // Figure out what the previous and next tutorials in this collection are, if
  // any so we can pass that information down.
  let previous;
  let next;
  const len = collection.relationships.tutorials.length;
  const currentIdx = collection.relationships.tutorials.findIndex(
    (e, i) => e.drupal_id === tutorial.drupal_id
  );
  if (currentIdx !== 0) {
    previous = collection.relationships.tutorials[(currentIdx + len - 1) % len];
  }

  if (currentIdx < len - 1) {
    next = collection.relationships.tutorials[(currentIdx + 1) % len];
  }

  return (
    <div className="tutorial">
      <SEO
        title={tutorial.title}
        description={tutorial.summary.value}
        meta={[{ name: 'og:type', content: 'article' }]}
      />
      <Grid columns={2} stackable>
        <Grid.Row>
          <Grid.Column width={4} stretched>
            <Menu
              size="large"
              secondary
              pointing
              vertical
              fluid
              as="nav"
              className="tutorial--menu"
            >
              <Menu.Item header as="header">
                {collection.title}
              </Menu.Item>
              {collection.relationships.tutorials.map(item => {
                const isActive = !!(item.drupal_id === tutorial.drupal_id);
                return (
                  <Menu.Item
                    link
                    key={item.drupal_id}
                    as={Link}
                    to={item.path.alias}
                    active={isActive}
                  >
                    {item.title}
                  </Menu.Item>
                );
              })}
            </Menu>
          </Grid.Column>
          <Grid.Column>
            <Container text>
              <TutorialBreadcrumb
                collection_title={collection.title}
                collection_path={collection.path.alias}
              />
              <div className="tutorial--body">
                <TutorialWithOauthConsumer
                  id={tutorial.drupal_id}
                  title={tutorial.title}
                  summary={tutorial.summary.processed}
                  body={tutorial.body ? tutorial.body.processed : false}
                  changed={new Date(tutorial.changed)}
                  tutorialAccess={tutorial.tutorial_access}
                  drupalOauthClient={props.drupalOauthClient}
                  tutorialComponent={Tutorial}
                  teaserComponent={TutorialTeaser}
                  loadingComponent={TutorialLoading}
                  comingSoonComponent={TutorialComingSoon}
                />
                {!userAuthenticated && <SignupNag />}
              </div>
              <div className="tutorial--previous-next">
                <TutorialPrevNext previous={previous} next={next} />
              </div>
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default withDrupalOauthConsumer(TutorialTemplate);
