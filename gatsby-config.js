require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
// Build (production) często nie ma .env.production — doładuj development jako fallback
require("dotenv").config({
  path: `.env.development`,
  override: false,
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
    // Produkcyjny siteUrl do canonical/OG/sitemap (nie localhost z .env.development)
    siteUrl: `https://ceea.org.pl`,
    twitterAccount: ``,
    ogImage: `/images/og-image.png`,
    organization: {
      name: `CEEA – Centrum Edukacji w Anestezjologii`,
      url: `https://ceea.org.pl/`,
      // Prawdziwy asset z gatsby-plugin-manifest (logo-ceea.png to soft 404)
      logo: `https://ceea.org.pl/icons/icon-512x512.png`,
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
        preconnect: [
          `https://fonts.googleapis.com`,
          `https://fonts.gstatic.com`,
        ],
        web: [
          {
            name: `Montserrat`,
            file: `https://fonts.googleapis.com/css2?family=Montserrat:wght@100;400;500;600;700;800;900&display=swap`,
          },
          {
            name: `Roboto`,
            file: `https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap`,
          },
          {
            name: `Syne`,
            file: `https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&display=swap`,
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
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
        excludes: [
          `/dev-404-page`,
          `/404`,
          `/404.html`,
          `/offline-plugin-app-shell-fallback`,
          `/graphql`,
          `/graphql/`,
          `/home2`,
          `/home2/`,
          `/platnosc-test`,
          `/platnosc-test/`,
          `/platnosc-status`,
          `/platnosc-status/`,
          `/kontakt/wyslano`,
          `/kontakt/wyslano/`,
          `/koszyk`,
          `/koszyk/`,
          `/koszyk/**`,
          `/kursy/[...]`,
          `/kursy/[...]/`,
          `/[...]`,
          `/[...]/`,
        ],
        resolveSiteUrl: () => `https://ceea.org.pl`,
        resolvePages: ({ allSitePage: { nodes: allPages } }) => {
          const { getCourseSitemapPaths } = require("./src/utils/courseSitemap")
          const coursePaths = getCourseSitemapPaths()
          const junk = p => {
            const path = p || ""
            return (
              path.includes("[...]") ||
              path.includes("graphql") ||
              path.startsWith("/koszyk") ||
              path.startsWith("/platnosc-") ||
              path.startsWith("/home2") ||
              path.startsWith("/kontakt/wyslano") ||
              path.startsWith("/dev-404") ||
              path === "/404" ||
              path === "/404.html"
            )
          }
          const fromSite = allPages
            .filter(page => !junk(page.path))
            .map(page => ({ ...page }))
          const extras = coursePaths.map(path => ({
            path,
            pageContext: {
              changefreq: `weekly`,
              priority: 0.8,
            },
          }))
          return [...fromSite, ...extras]
        },
        serialize: ({ path, pageContext }) => {
          let priority = pageContext?.priority
          if (priority == null) {
            if (path === `/`) priority = 1.0
            else if (path === `/kursy/` || path === `/kursy`) priority = 0.9
            else if (path.startsWith(`/kursy/`)) priority = 0.8
            else if (path === `/o-nas/` || path === `/o-nas`) priority = 0.8
            else priority = 0.7
          }
          return {
            url: path,
            lastmod: pageContext?.lastmod,
            changefreq: pageContext?.changefreq || `weekly`,
            priority,
          }
        },
      },
    },
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: `https://ceea.org.pl`,
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
              `/graphql/`,
              `/platnosc-test/`,
              `/koszyk/`,
              `/kursy/*/rejestracja/`,
              `/kursy/*/formularz-wyslany/`,
            ],
          },
        ],
      },
    },
    `gatsby-plugin-layout`,
    "gatsby-plugin-postcss",
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
      resolve: "gatsby-plugin-playground",
      options: {
        disableNetlify: false,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
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
        siteUrl: `https://ceea.org.pl`,
        stripQueryString: true,
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [process.env.GATSBY_GA_MEASUREMENT_ID].filter(Boolean),
        gtagConfig: {
          anonymize_ip: true,
        },
        pluginConfig: {
          head: true,
          respectDNT: true,
        },
      },
    },
  ],
}
