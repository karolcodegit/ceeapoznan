import * as React from "react"
import { useEffect } from "react"
import { navigate } from "gatsby"
import Seo from "../components/seo"

/** Stary URL podglądu v3 → strona główna */
const Home2Redirect = () => {
  useEffect(() => {
    navigate("/", { replace: true })
  }, [])
  return null
}

export const Head = ({ location }) => (
  <Seo
    title="CEEA Poznań – Kursy Anestezjologii i Medycyny Okołooperacyjnej"
    description="CEEA Poznań – Regionalne Centrum CEEA od 1995 roku. Kursy anestezjologii i medycyny okołooperacyjnej."
    pathname={location?.pathname || "/home2/"}
    absoluteTitle
    robots="noindex,follow"
  />
)

export default Home2Redirect
