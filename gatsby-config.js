require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `CEEA Poznań – Kursy Anestezjologii i Medycyny Okołooperacyjnej`,
    description: `CEEA Poznań – kursy i szkolenia dla anestezjologów od 1995 roku. Medycyna okołooperacyjna, neurologia, znieczulenie regionalne. Certyfikowane szkolenia stacjonarne. Zapisz się na kurs!`,
    keywords: `kurs anestezjologii, szkolenia medyczne, medycyna okołooperacyjna, znieczulenie regionalne, CEEA Poznań, kursy dla lekarzy, anestezjologia`,
    author: `Karol Znojkiewicz`,
    lang: `pl`,
    locale: `pl_PL`,
    siteUrl: process.env.GATSBY_SITE_URL || `https://ceea.org.pl/`,
    organization: {
      name: `CEEA – Centrum Edukacji w Anestezjologii`,
      url: `https://ceea.org.pl/`,
      logo: `https://ceea.org.pl/logo-ceea.png`,
    },
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
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        siteUrl: `https://ceea.org.pl/`,
        changefreq: `weekly`,
        priority: 0.7,
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage {
              nodes {
                path
                pageContext
              }
            }
          }
        `,
        resolveSiteUrl: ({ site }) => site.siteMetadata.siteUrl,
        serialize: ({ path, pageContext }) => {
          return {
            url: path,
            lastmod: pageContext?.lastmod,
            changefreq: pageContext?.changefreq || `weekly`,
            priority: pageContext?.priority || 0.7,
          }
        },
      }
    },
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: `https://ceea.org.pl/`,
        sitemap: `https://ceea.org.pl/sitemap-index.xml`,
        policy: [
          {
            userAgent: `*`,
            allow: `/`,
            disallow: [
              `/kurs-nr-6-2024/`,
              `/kurs-nr-1-2024/`,
              `/kurs-nr-5-2023/`,
              `/kurs-nr-5/`,
              `/aktualnosci.html`,
              `/kursy-ceea.html`,
              `/*?from=xiaodiaomao.com`,
              `/*?from=www.xiaodiaomao.com`,
              `/*?from=192.168.1.19:9090`,
              `/feed/`,
              `/contact/`,
            ],
          },
        ],
      },
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
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-datocms`,
      options: {
        apiToken: process.env.GATSBY_DATOCMS_API,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `CEEA Poznań – Kursy Anestezjologii i Medycyny Okołooperacyjnej`,
        short_name: `CEEA Poznań`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#00499A`,
        display: `minimal-ui`,
        icon: `src/assets/images/Icon-logo.png`,
        crossOrigin: `use-credentials`,
      },
    },
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://ceea.org.pl/`,
        stripQueryString: true,
      },
    },
    {
      resolve: `gatsby-plugin-schema-snapshot`,
      options: {
        path: `./src/graphql/schema.graphql`,
        update: false,
      },
    },
  ],
}