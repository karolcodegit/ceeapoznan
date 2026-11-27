import React, { useState } from "react"
import { Link } from "gatsby"
import { useSeasonalTheme } from "./SeasonalThemeContext"
import { SEASONAL_THEMES, THEME_ORDER } from "../../themes/seasonalThemes"

/**
 * Pływający switcher — tylko gdy preview włączony (develop / GATSBY_SEASONAL_PREVIEW).
 * Służy do akceptacji motywów przed włączeniem dat produkcyjnych.
 */
const SeasonalPreviewSwitcher = () => {
  const {
    themeId,
    previewEnabled,
    autoEnabled,
    calendarThemeId,
    setPreviewTheme,
    clearPreview,
  } = useSeasonalTheme()
  // Na wąskich ekranach start zwinięty — otwarty panel zasłania hero.
  const [open, setOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  )

  if (!previewEnabled) return null

  return (
    <div className="fixed bottom-4 left-4 z-[60] max-w-[min(100vw-2rem,20rem)] font-sans">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="mb-2 rounded-full bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur hover:bg-slate-800"
        aria-expanded={open}
      >
        {open ? "Ukryj motywy" : "Motywy sezonowe"}
      </button>

      {open && (
        <div
          className="rounded-2xl border border-white/20 bg-slate-950/95 p-3 text-white shadow-2xl backdrop-blur"
          role="region"
          aria-label="Podgląd motywów sezonowych"
        >
          <p className="text-[11px] uppercase tracking-wide text-amber-300/90">
            Preview · nie produkcja
          </p>
          <p className="mt-1 text-xs text-white/70 leading-snug">
            Auto-daty:{" "}
            <strong className="text-white">
              {autoEnabled ? "włączone" : "wyłączone"}
            </strong>
            {` · dziś wg kalendarza: ${
              calendarThemeId
                ? SEASONAL_THEMES[calendarThemeId].label
                : SEASONAL_THEMES.classic.label
            }`}
          </p>

          <div className="mt-3 flex flex-col gap-1.5">
            {THEME_ORDER.map(id => {
              const t = SEASONAL_THEMES[id]
              const active =
                themeId === id || (id === "classic" && themeId === null)
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPreviewTheme(id === "classic" ? "classic" : id)}
                  className={`rounded-lg px-2.5 py-2 text-left text-sm transition ${
                    active
                      ? "bg-white text-slate-900"
                      : "bg-white/10 hover:bg-white/15"
                  }`}
                >
                  <span className="font-semibold">{t.label}</span>
                  <span className="mt-0.5 block text-[11px] opacity-80">
                    {t.windowLabel}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-2">
            <button
              type="button"
              onClick={clearPreview}
              className="text-[11px] text-white/60 underline-offset-2 hover:text-white hover:underline"
            >
              Reset (auto/brak)
            </button>
            <Link
              to="/podglad-motywow/"
              className="text-[11px] font-medium text-amber-200 hover:text-amber-100"
            >
              Strona porównania →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default SeasonalPreviewSwitcher
