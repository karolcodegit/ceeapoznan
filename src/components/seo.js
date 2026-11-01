import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import { useLocation } from '@reach/router';

// Wymagane pola w siteMetadata: title, description, author, siteUrl,
//   twitterAccount (opcjonalnie, może być ""), ogImage (np. "/og-image.png" w static/)
function Seo({ description, title, children, favicon, twitterImage }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            author
            siteUrl
            description
            twitterAccount
            ogImage
          }
        }
      }
    `
  );

  const location = useLocation();
  const meta = site.siteMetadata;

  const metaDescription = description || meta.description;
  const defaultTitle = meta.title;
  const pageTitle = defaultTitle ? `${title} | ${defaultTitle}` : title;
  const baseUrl = (meta.siteUrl || '').replace(/\/$/, '');
  const shareImageUrl =
    twitterImage || `${baseUrl}${meta.ogImage || '/og-image.png'}`;
  const canonicalUrl = `${meta.siteUrl}${location.pathname}`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="author" content={meta.author} />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="icon" href={favicon} />
      <meta httpEquiv="content-language" content="PL-pl" />
      <meta name="robots" content="index,follow" />
      <meta name="description" content={metaDescription} />

      {/* Open Graph (Facebook, LinkedIn, Messenger...) */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={shareImageUrl} />
      <meta property="og:locale" content="pl_PL" />

      {/* X / Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {meta.twitterAccount && (
        <meta name="twitter:creator" content={meta.twitterAccount} />
      )}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={shareImageUrl} />

      {children}
    </Helmet>
  );
}

export default Seo;