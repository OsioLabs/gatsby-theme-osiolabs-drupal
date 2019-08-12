import { graphql } from 'gatsby';

import CollectionTemplate from '../components/Collection/CollectionTemplate';

export default CollectionTemplate;

// Query fragment to retrieve detailed information about the collection.
export const query = graphql`
  query DrupalCollectionTemplate($drupal_id: String!) {
    nodeCollection(drupal_id: { eq: $drupal_id }) {
      drupal_id
      title
      collection_summary {
        processed
      }
      relationships {
        tutorials {
          title
          drupal_id
          path {
            alias
          }
          tutorial_access
        }
      }
    }
  }
`;
