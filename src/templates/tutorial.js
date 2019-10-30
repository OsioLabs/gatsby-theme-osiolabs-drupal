import { graphql } from 'gatsby';

import TutorialTemplate from '../components/Tutorial/TutorialTemplate';

export default TutorialTemplate;

// Query fragment to retrieve detailed information about the tutorial being
// viewed and a list of other tutorials in the same collection as this one.
// Note, the body field will only contain a value if the tutorial_access is set
// to "public". Otherwise it's view is restricted by Drupal.
export const query = graphql`
  query TutorialTemplate($drupal_id: String!) {
    nodeTutorial(drupal_id: { eq: $drupal_id }) {
      drupal_id
      drupal_internal__nid
      title
      changed
      summary {
        processed
      }
      body {
        processed
      }
      short_description
      tutorial_access
      path {
        alias
      }
      relationships {
        node__collection {
          title
          path {
            alias
          }
          relationships {
            tutorials {
              drupal_id
              title
              tutorial_access
              path {
                alias
              }
            }
          }
        }
        promotional_image {
          relationships {
            imageFile {
              localFile {
                childImageSharp {
                  original {
                    src
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
