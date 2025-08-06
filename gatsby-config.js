require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
/**
 * @type {import('gatsby').GatsbyConfig}
 */


module.exports = {
  siteMetadata: {
    title: `CEEA Poznań`,
    description: `Ceea - Ośrodek Poznański. Szkolenia, kursy z certyfikatem. `,
    author: `Karol Znojkiewicz`,
    siteUrl: process.env.GATSBY_SITE_URL,
  },
  plugins: [
    {
      resolve: `gatsby-transformer-remark`,
      options: {},
    },
    {
      resolve: `gatsby-omni-font-loader`,
      options: {
        enableListener: true,
        preconnect: [`https://fonts.googleapis.com`, `https://fonts.gstatic.com`],
        web: [
          {
            name: `Montserrat`,
            file: `https://fonts.googleapis.com/css2?family=Montserrat:wght@100;400;500;600;700;800;900&display=swap`,
          },
          {
            name: `Roboto`,
            file: `https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap`,
          },
        ],
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        siteUrl: `https://ceea.org.pl/`,
      }
    },
    `gatsby-plugin-layout`,
    'gatsby-plugin-postcss',
    `gatsby-plugin-image`,
    `gatsby-plugin-smoothscroll`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    {
      resolve: 'gatsby-plugin-playground',
      options: {
        disableNetlify: false,
        // Możesz dostosować inne opcje w zależności od potrzeb
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-datocms`,
      options: {
        apiToken: 
          process.env.GATSBY_DATOCMS_API,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Ceea - Ośrodek Poznański`,
        short_name: `Ceea`,
        start_url: `/`,
        background_color: `#fff`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/assets/images/Icon-logo.png`, // This path is relative to the root of the site.
      },
    },
  ],
}
