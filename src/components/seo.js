import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import { useLocation } from '@reach/router';

function Seo({ description, title, children, favicon, twitterImage }) {
  const { site, datoCmsSite } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            author
            siteUrl
            description
          }
        }
        datoCmsSite {
          globalSeo {
            siteName
            titleSuffix
            twitterAccount
            fallbackSeo {
              title
              description
              twitterCard
              image {
                fluid {
                  tracedSVG
                }
              }
            }
          }
        }
      }
    `
  );

  const location = useLocation();

  const metaDescription =
    description ||
    site.siteMetadata.description ||
    datoCmsSite.globalSeo.fallbackSeo.description;
  const defaultTitle =
    site.siteMetadata?.title || datoCmsSite.globalSeo.fallbackSeo.title;
  const twitterAccount = datoCmsSite.globalSeo.twitterAccount;
  const twitterImageUrl =
    twitterImage || datoCmsSite.globalSeo.fallbackSeo.image.fluid.tracedSVG;
  const canonicalUrl = `${site.siteMetadata.siteUrl}${location.pathname}`;

  return (
    <Helmet>
      <title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
      <meta name="author" content={site.siteMetadata.author} />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="icon" href={favicon} />
      <meta httpEquiv="content-language" content="PL-pl" />
      <meta name="robots" content="index,follow" />
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={twitterAccount} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={twitterImageUrl} />
      {children}
    </Helmet>
  );
}

export default Seo;