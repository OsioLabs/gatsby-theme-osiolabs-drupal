## gatsby-theme-osiolabs-drupal

This is a [Gatsby theme](https://www.gatsbyjs.org/docs/themes) that encapsulates the code necessary to interact with the members.osiolabs.com API.

This includes:

- Sourcing content with `gatsby-source-drupal`
- Components and code for providing user authentication via OAuth
- Components for displaying Tutorial and Collection content from Drupal.

Some of the included components make use of components from the semantic-ui-react library. But do not include any theming for them. The intent is that sites building off of this theme will also be using semantic-ui. If that's not the case you can always override all the components that do.

## Usage

You should use this as part of another Gatsby site.

```
yarn add https://github.com/OsioLabs/gatsby-theme-osiolabs-drupal
yarn add gatsby-plugin-compile-es6-packages
```

Then add it to your projects _gatsby-config.js_:

```javascript
module.exports = {
  __experimentalThemes: [
    {
      resolve: 'gatsby-theme-osiolabs-drupal',
    },
  ],
  plugins: [
    // https://www.gatsbyjs.org/docs/themes/api-reference#add-theme-transpilation
    {
      resolve: 'gatsby-plugin-compile-es6-packages',
      options: {
        modules: ['gatsby-theme-osiolabs-drupal'],
      },
    },
  ]
};
```

To learn more about how Gatsby theme's work, and especially how to use component shadowing to override components provided by this package checkout the [official docs](https://www.gatsbyjs.org/docs/themes).

## How to do development on this package

If you want to make updates to this package the easiest thing to do is to copy the repo locally and then link it into an existing project.

Use `yarn link` to replace the *web/node_modules/gatsby-themes-osiolabs-drupal/* with a link to *themes/gatsby-theme-osiolabs-drupal/*.

```bash
cd themes/gatsby-theme-osiolabs-drupal/
yarn link
cd ../web/
yarn link gatsby-theme-osiolabs-drupal
``` 

After that, any changes you make in *themes/gatsby-theme-osiolabs-drupal/* will be reflected in *web/node_modules/gatsby-theme-osiolabs-drupal/*.

Note: Anytime you remove the *web/node_modules/* directory you'll need to run `yarn link gatsby-theme-osiolabs-drupal` again.
