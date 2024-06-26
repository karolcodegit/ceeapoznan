import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

function Seo({
  description,
  title,
  children,
  favicon,
  twitterImage,
}) {
  const { site, datoCmsSite } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            author
          }
        }
        datoCmsSite {
          name
          noIndex
          globalSeo {
            siteName
            titleSuffix
            twitterAccount
            facebookPageUrl
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
  )
  const metaDescription =
    description ||
    site.siteMetadata.description ||
    datoCmsSite.globalSeo.fallbackSeo.description
  const defaultTitle =
    site.siteMetadata?.title || datoCmsSite.globalSeo.fallbackSeo.title
  const twitterAccount = datoCmsSite.globalSeo.twitterAccount
  // const ogImage = ogImage || datoCmsSite.globalSeo.fallbackSeo.image.fluid.tracedSVG
  const twitterImageUrl =
    twitterImage || datoCmsSite.globalSeo.fallbackSeo.image.fluid.tracedSVG

  // const titleContext = useContext(TitleContext);

  // useEffect(() => {
  //   titleContext.setTitle(title);
  // }, [title]);
  return (
    <>
      <title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
      <meta name="author" content={site.siteMetadata.author} />
      <link rel="canonical" href="http://www.ceea.org.pl/" />
      <link rel="icon" href={favicon} />
      <meta httpEquiv="content-language" content="PL-pl" />
      <meta name="robots" content="index,follow" />
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content={metaDescription}
        data-gatsby-head="true"
      />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={twitterAccount} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      {/* <meta property="og:image" content={ogImage} /> */}
      <meta name="twitter:image" content={twitterImageUrl} />
      {children}
    </>
  )
}

export default Seo
