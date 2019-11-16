module.exports = {
  siteMetadata: {
    title: 'Daniel Matarazzo',
    description: 'my very own world wide website',
    author: 'Daniel Matarazzo',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        stripMetadata: true,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/fav-icon.png', // This path is relative to the root of the site.
      },
    },
    {
      resolve: 'gatsby-plugin-layout',
      options: {
        component: require.resolve('./src/components/layouts/standard.js'),
      },
    },
    {
      resolve: 'gatsby-remark-images',
      options: {
        maxWidth: 850,
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.mdx', '.md'],
        defaultLayouts: {
          default: require.resolve('./src/components/layouts/mdx.js'),
        },
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-smartypants`,
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 850,
            },
          },
          {
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              icon: false,
            },
          },
          {
            resolve: 'gatsby-remark-table-of-contents',
            options: {
              exclude: 'Table of Contents',
            },
          },
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
            },
          },
        ],
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
