import React from "react"
import { useSeasonalTheme } from "./SeasonalThemeContext"

/**
 * Globalne akcenty sezonowe (poza pasem tytułu).
 * Śnieg/fajerwerki są w SeasonalBandEffects wewnątrz TopHeader / PageHeroV2.
 */
const SeasonalOverlays = () => {
  const { theme } = useSeasonalTheme()
  if (!theme?.effect) return null

  return <div className="seasonal-header-accent" aria-hidden="true" />
}

/** Subtelne ozdoby stopki — tylko przy christmas / nye. */
export const SeasonalFooterOrnaments = () => {
  const { theme } = useSeasonalTheme()
  if (!theme?.effect) return null
  return (
    <>
      <div
        className="seasonal-footer-ornament seasonal-footer-ornament--tl"
        aria-hidden="true"
      />
      <div
        className="seasonal-footer-ornament seasonal-footer-ornament--br"
        aria-hidden="true"
      />
    </>
  )
}

export default SeasonalOverlays
