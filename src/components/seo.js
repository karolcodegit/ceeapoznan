import React from "react"
import { useStaticQuery, graphql } from "gatsby"

/**
 * SEO dla Gatsby Head API — natywne <title>/<meta>/<script>, bez react-helmet.
 *
 * @param {object} props
 * @param {string} props.title — tytuł strony (bez brandu, chyba że absoluteTitle)
 * @param {string} props.description — unikalny meta description (wymagany dla indeksowanych stron)
 * @param {string} [props.pathname] — z Head props.location.pathname (canonical / og:url)
 * @param {string} [props.robots="index,follow"]
 * @param {boolean} [props.absoluteTitle=false] — użyj title bez sufiksu „| CEEA Poznań”
 * @param {string} [props.image] — absolutny lub względny URL obrazu OG
 * @param {object|object[]} [props.jsonLd] — JSON-LD (Organization / WebSite / Course / FAQ…)
 * @param {React.ReactNode} [props.children]
 */
function Seo({
  title,
  description,
  pathname = "/",
  robots = "index,follow",
  absoluteTitle = false,
  image,
  jsonLd,
  children,
}) {
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
            organization {
              name
              url
              logo
            }
          }
        }
      }
    `
  )

  const meta = site.siteMetadata
  const baseUrl = (meta.siteUrl || "https://ceea.org.pl").replace(/\/$/, "")
  const brand = "CEEA Poznań"
  const metaDescription =
    (description && String(description).trim()) || meta.description
  const pageTitle = absoluteTitle
    ? title
    : title
      ? `${title} | ${brand}`
      : meta.title

  const path = pathname.startsWith("/") ? pathname : `/${pathname}`
  const normalizedCanonical =
    path === "/" ? `${baseUrl}/` : `${baseUrl}${path.replace(/\/?$/, "/")}`

  const shareImageUrl = image
    ? image.startsWith("http")
      ? image
      : `${baseUrl}${image.startsWith("/") ? image : `/${image}`}`
    : `${baseUrl}${meta.ogImage || "/images/og-image.png"}`

  const ldNodes = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : null

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="author" content={meta.author} />
      <meta name="robots" content={robots} />

      {/* Canonical: zostawiamy też gatsby-plugin-canonical-urls — tu spójny og:url.
          Unikamy drugiego <link rel="canonical"> — plugin emituje link. */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={normalizedCanonical} />
      <meta property="og:image" content={shareImageUrl} />
      <meta property="og:locale" content="pl_PL" />
      <meta property="og:site_name" content={brand} />

      <meta name="twitter:card" content="summary_large_image" />
      {meta.twitterAccount ? (
        <meta name="twitter:creator" content={meta.twitterAccount} />
      ) : null}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={shareImageUrl} />

      {ldNodes &&
        ldNodes.map((node, i) => (
          <script
            key={`ld-${i}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
          />
        ))}

      {children}
    </>
  )
}

/** JSON-LD Organization + WebSite (strona główna). */
export function buildOrgWebsiteJsonLd(siteMetadata) {
  const baseUrl = (siteMetadata?.siteUrl || "https://ceea.org.pl").replace(
    /\/$/,
    ""
  )
  const org = siteMetadata?.organization || {}
  const orgId = `${baseUrl}/#organization`
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": orgId,
      name: org.name || "CEEA – Centrum Edukacji w Anestezjologii",
      alternateName: ["CEEA Poznań", "Regionalne Centrum CEEA w Poznaniu"],
      url: org.url || `${baseUrl}/`,
      logo: org.logo || `${baseUrl}/icons/icon-512x512.png`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Poznań",
        addressCountry: "PL",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: "CEEA Poznań",
      url: `${baseUrl}/`,
      inLanguage: "pl-PL",
      publisher: { "@id": orgId },
    },
  ]
}

export default Seo
