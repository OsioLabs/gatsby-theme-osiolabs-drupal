import React from 'react';
import Helmet from 'react-helmet';
import Collection from './Collection';

/**
 * This is a super simple example of a CollectionTemplate component.
 *
 * In most cases you'll probably want to override this with a site specific
 * component.
 */
const CollectionTemplate = ({ data }) => {
  const {
    // eslint-disable-next-line camelcase
    drupal_id,
    relationships,
    // eslint-disable-next-line camelcase
    collection_summary,
    title,
  } = data.nodeCollection;

  let tutorials = [];
  if (relationships.tutorials && relationships.tutorials.length > 0) {
    tutorials = relationships.tutorials.map(item => ({
      title: item.title,
      id: item.drupal_id,
      path: item.path.alias,
      tutorial_access: item.tutorial_access,
    }));
  }

  return (
    <div className="collection">
      <Helmet title={`${title} | Gatsby Guides`} />
      <Collection
        id={drupal_id}
        title={title}
        summary={collection_summary.processed}
        tutorials={tutorials}
      />
    </div>
  );
};

export default CollectionTemplate;
