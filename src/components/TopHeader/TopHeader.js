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
    <div className="pb-12">
  <div className="max-w-6xl mx-auto">
    {/* Breadcrumbs Section */}
    <div className="pt-6">
      <Breadcrumbs className="text-sm text-gray-600 dark:text-gray-400" />
    </div>

    {/* Title and Content */}
    <div className="mt-10">
      <h1 className="text-3xl font-extrabold text-dark dark:text-gray-100">
        {title}
      </h1>
      <div className="mt-4 text-base leading-7 text-gray-800 dark:text-gray-300">
        {children}
      </div>
    </div>

    {/* Description */}
    {currentLink?.description && (
      <p className="mt-6 text-base text-cyan-800 dark:text-gray-400 leading-relaxed">
        {currentLink.description}
      </p>
    )}
  </div>
</div>
  )
}

export default TopHeader
