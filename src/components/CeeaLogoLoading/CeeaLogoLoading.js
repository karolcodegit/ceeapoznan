import React from "react"
import Logo from "../../assets/images/logo-header.png"

/**
 * Estetyczny loading CEEA (zamiast generycznego spinnera) —
 * używany przy pierwszym ładowaniu kursów bez cache.
 */
const CeeaLogoLoading = ({
  label = "Ładowanie oferty kursów…",
  compact = false,
  className = "",
  light = false,
}) => {
  return (
    <div
      className={`ceea-logo-loading flex flex-col items-center justify-center gap-3 ${
        compact ? "py-2" : "py-6"
      } ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="relative inline-flex items-center justify-center">
        <span
          className={`absolute inset-0 rounded-full blur-md opacity-40 ceea-logo-loading__glow ${
            light ? "bg-white/40" : "bg-[#0077FF]/35"
          }`}
          aria-hidden="true"
        />
        <img
          src={Logo}
          alt=""
          aria-hidden="true"
          className={`ceea-logo-loading__mark relative object-contain ${
            compact ? "h-7 w-auto" : "h-10 sm:h-12 w-auto"
          } ${light ? "brightness-0 invert" : ""}`}
        />
      </span>
      <span
        className={`text-xs sm:text-sm font-medium tracking-wide ${
          light ? "text-white/80" : "text-slate-500 dark:text-slate-400"
        }`}
      >
        {label}
      </span>
      <span className="sr-only">{label}</span>
    </div>
  )
}

export default CeeaLogoLoading
