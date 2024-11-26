import React from "react"
import { useLocation } from "@reach/router"
import { menuLinks, otherLinks, przydatneLinki } from "../components/Menu"
import Seo from "../components/seo"
import FormRegister from "../components/Form/FormRegister"

const Rejestracja = () => {
  const location = useLocation()
  const currentPath = location.pathname
  const allLinks = [...menuLinks, ...przydatneLinki, ...otherLinks]
  const currentLink = allLinks.find(link => link.to === currentPath)
  return (
    <>
      
      <div className="">
        <div className="max-w-6xl mx-auto ">
          <FormRegister />
        </div>
      </div>
    </>
  )
}



export const Head = () => <Seo title="Rejestracja" />

export default Rejestracja
