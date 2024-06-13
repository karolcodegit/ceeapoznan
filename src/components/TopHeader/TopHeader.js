import React from "react"
import { useLocation } from "@reach/router"
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs"
import useLastBreadcrumb from "../../hooks/useLastBreadcrumb"
import { menuLinks, otherLinks, przydatneLinki } from "../Menu"



const TopHeader = ({ children }) => {
  const title = useLastBreadcrumb()
  const location = useLocation()
  const currentPath = location.pathname
  const allLinks = [...menuLinks, ...przydatneLinki, ...otherLinks]
  const currentLink = allLinks.find(link => link.to === currentPath)
  return (
    <div className="">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs />
      </div>
      <div className="mt-10 max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-dark dark:text-gray-100">{title}</h1>
        {children}
      </div>
      <p className="mt-2 text-base text-cyan-800 pb-12 dark:text-gray-200">
        {currentLink ? currentLink.description : ""}
      </p>

    </div>
  )
}

export default TopHeader
