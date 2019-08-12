/**
 * Configuration for gatsby-theme-osiolabs-drupal.
 *
 * This theme makes use of the gatsby-source-drupal plugin, but doesn't by
 * default provide configuration to enable it. And instead relies on the site
 * that is using the theme to provide that configuration. This ensures that we
 * can use site specific settings for connecting to Drupal.
 */
module.exports = {
  plugins: [
    'gatsby-plugin-react-helmet',
    `gatsby-plugin-catch-links`,
  ],
};
