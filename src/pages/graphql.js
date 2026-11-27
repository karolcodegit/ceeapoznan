import React from "react"
import Seo from "../components/seo"

const GraphQLPage = () => {
  return (
    <div>
      <h1>GraphQL Page</h1>
      <p>This is a simple GraphQL page.</p>
    </div>
  )
}

export const Head = ({ location }) => (
  <Seo
    title="GraphQL"
    description="Wewnętrzna strona deweloperska CEEA Poznań."
    pathname={location?.pathname || "/graphql/"}
    robots="noindex,nofollow"
  />
)

export default GraphQLPage