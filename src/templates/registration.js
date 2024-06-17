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
      <p className="mt-2 text-base text-cyan-800 pb-12">
        {/* {currentLink
          ? currentLink.description
          : "Chcesz poszerzyć swoje umiejętności? Zapisz się na nasz kurs! Oferujemy różne kursy dostosowane do Twoich potrzeb."} */}
      </p>
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
