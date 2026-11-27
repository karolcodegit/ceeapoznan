import React from "react"
import { useLocation } from "@reach/router"
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs"
import useLastBreadcrumb from "../../hooks/useLastBreadcrumb"
import { menuLinks, otherLinks, przydatneLinki } from "../Menu"
import SeasonalBandEffects from "../SeasonalTheme/SeasonalBandEffects"

/**
 * Niebieski pas pod headerem (podstrony poza full-bleed).
 * Hostuje sezonowe efekty (śnieg / fajerwerki).
 */
const TopHeader = ({ children }) => {
  const title = useLastBreadcrumb()
  const location = useLocation()
  const currentPath = location.pathname
  const allLinks = [...menuLinks, ...przydatneLinki, ...otherLinks]
  const currentLink = allLinks.find(link => link.to === currentPath)

  return (
    <section className="seasonal-subpage-band relative w-full overflow-hidden bg-gradient-to-br from-[#0b1f3a] via-[#0c6478] to-[#023e8a] text-white pt-20 lg:pt-24">
      <SeasonalBandEffects />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 lg:pb-12 pt-6 sm:pt-8">
        <div className="pt-1">
          <Breadcrumbs className="text-sm text-white/75" light />
        </div>

        <div className="mt-6 sm:mt-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {title}
          </h1>
          {children && (
            <div className="mt-4 text-base leading-7 text-white/90">
              {children}
            </div>
          )}
        </div>

        {currentLink?.description && (
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/85">
            {currentLink.description}
          </p>
        )}
      </div>
    </section>
  )
}

export default TopHeader
