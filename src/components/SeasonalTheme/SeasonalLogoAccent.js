import React from "react"
import { useSeasonalTheme } from "./SeasonalThemeContext"

/**
 * Ozdoba logo: czerwona czapka (christmas) lub kieliszek szampana (nye).
 * Classic / brak motywu → bez ozdoby.
 */
const SeasonalLogoAccent = ({ size = "md" }) => {
  const { theme } = useSeasonalTheme()
  const accent = theme?.logoAccent
  if (!accent) return null

  const scale =
    size === "sm" ? "scale-75" : size === "lg" ? "scale-110" : "scale-100"

  if (accent === "santa-hat") {
    return (
      <span
        className={`seasonal-logo-accent seasonal-logo-accent--hat pointer-events-none absolute ${scale}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 64 56" width="40" height="35" fill="none">
          <path
            d="M8 38c2-16 14-30 28-32 6 10 14 18 20 22-8 2-18 4-28 4-8 0-14 2-20 6z"
            fill="#C41E3A"
          />
          <ellipse cx="52" cy="26" rx="7" ry="6" fill="#fff" />
          <path
            d="M4 40c8-4 20-6 32-6s20 3 28 8v6H4v-8z"
            fill="#fff"
          />
        </svg>
      </span>
    )
  }

  if (accent === "champagne") {
    return (
      <span
        className={`seasonal-logo-accent seasonal-logo-accent--champagne pointer-events-none absolute ${scale}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 40 56" width="28" height="40" fill="none">
          <path
            d="M14 4h12l-2 22c0 4-2 7-6 7s-6-3-6-7L14 4z"
            fill="#F5E6A3"
            stroke="#E8C872"
            strokeWidth="1.5"
          />
          <path d="M18 33v14M14 48h12" stroke="#E8C872" strokeWidth="2" />
          <circle cx="30" cy="10" r="2" fill="#fff" opacity="0.9" />
          <circle cx="33" cy="16" r="1.5" fill="#fff" opacity="0.7" />
          <circle cx="28" cy="18" r="1.2" fill="#fff" opacity="0.6" />
        </svg>
      </span>
    )
  }

  return null
}

export default SeasonalLogoAccent
