/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

exports.createPages = async ({ actions, graphql }) => {
  const { createPage, createRedirect } = actions;

  const tutorialTemplate = require.resolve('./src/templates/tutorial.js');
  const collectionTemplate = require.resolve('./src/templates/collection.js');

  // Load any information about redirects.
  // This data is used when creating pages below to check for changes in the
  // Drupal generated path to a page and then calls createRedirect().
  // Note that calls to createRedirect() don't do anything by default other than
  // make the data available to plugins. You'll need a plugin like
  // https://www.gatsbyjs.org/packages/gatsby-plugin-netlify/ to actually setup
  // redirects to happen.
  const redirects = await graphql(`
    {
      allRedirectRedirect {
        edges {
          node {
            redirect_source {
              path
            }
            redirect_redirect {
              uri
            }
          }
        }
      }
    }
  `).then(result => {
    // Create pages for collections sourced from Drupal.
    const data = [];
    if (!result.errors) {
      result.data.allRedirectRedirect.edges.forEach(({ node }) => {
        // Redirect paths will take one of two forms depending on how they were
        // created in Drupal. entity:node/42 or internal:/node/42, this
        // normalizes them both to /node/42.
        data[node.redirect_redirect.uri.replace(/^entity:|internal:\//, '/')] = node;
      });
    }

    return data;
  });

  const loadCollections = new Promise((resolve, reject) => {
    return graphql(`
      {
        allNodeCollection {
          edges {
            node {
              drupal_id
              drupal_internal__nid
              title
              path {
                alias
              }
            }
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        reject(result.errors);
      }

      // Create pages for collections sourced from Drupal.
      result.data.allNodeCollection.edges.forEach(({ node }) => {
        let path;
        if (node.path.alias == null) {
          path = `collection/${node.drupal_id}`;
        } else {
          path = node.path.alias;
        }

        // Handle generating redirects as needed.
        if (redirects[`/node/${node.drupal_internal__nid}`]) {
          createRedirect({
            fromPath:
              redirects[`/node/${node.drupal_internal__nid}`].redirect_source
                .path,
            toPath: path,
            isPermanent: true,
            redirectInBrowser: true,
          });
        }

        createPage({
          path,
          component: collectionTemplate,
          context: {
            drupal_id: node.drupal_id,
          },
        });
      });

      resolve();
    });
  });

  const loadTutorials = new Promise((resolve, reject) => {
    graphql(`
      {
        allNodeTutorial {
          edges {
            node {
              drupal_id
              drupal_internal__nid
              title
              path {
                alias
              }
            }
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        reject(result.errors);
      }

      result.data.allNodeTutorial.edges.forEach(({ node }) => {
        let path;
        if (node.path.alias == null) {
          path = `tutorial/${node.drupal_id}`;
        } else {
          path = node.path.alias;
        }

        // Handle generating redirects as needed.
        if (redirects[`/node/${node.drupal_internal__nid}`]) {
          createRedirect({
            fromPath:
              redirects[`/node/${node.drupal_internal__nid}`].redirect_source
                .path,
            toPath: path,
            isPermanent: true,
            redirectInBrowser: true,
          });
        }

        createPage({
          path,
          component: tutorialTemplate,
          context: {
            drupal_id: node.drupal_id,
          },
        });
      });

      resolve();
    });
  });

  return Promise.all([loadCollections, loadTutorials]);
};
