import React from "react"
import { Link } from "gatsby"
import Seo from "../components/seo"
import { useSeasonalTheme } from "../components/SeasonalTheme/SeasonalThemeContext"
import { SEASONAL_THEMES, THEME_ORDER } from "../themes/seasonalThemes"

/**
 * Strona porównania motywów sezonowych — tylko do akceptacji (preview).
 */
const PodgladMotywow = () => {
  const { themeId, setPreviewTheme, autoEnabled, calendarThemeId } =
    useSeasonalTheme()

  return (
    <div className="w-full bg-[#F7F4EF] dark:bg-slate-950 min-h-[70vh]">
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
          Preview · nie włączone produkcyjnie
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] dark:text-white">
          Motywy sezonowe
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300 leading-relaxed">
          Śnieg / fajerwerki w niebieskim pasie tytułu (wszystkie podstrony poza
          home) + czapka lub szampan na logo. Klasyczny = bez dekoracji. Po
          akceptacji włączymy daty (Europe/Warsaw). Auto-daty:{" "}
          <strong>{autoEnabled ? "ON" : "OFF"}</strong>
          {` (dziś → ${
            calendarThemeId
              ? SEASONAL_THEMES[calendarThemeId].label
              : SEASONAL_THEMES.classic.label
          })`}.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {THEME_ORDER.map(id => {
            const t = SEASONAL_THEMES[id]
            const active = themeId === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setPreviewTheme(id)}
                className={`rounded-2xl border p-5 text-left transition ${
                  active
                    ? "border-[#0B1F3A] bg-white shadow-lg ring-2 ring-[#E8A317] dark:border-sky-400 dark:bg-slate-900"
                    : "border-slate-200 bg-white/80 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/80"
                }`}
              >
                <span
                  className="mb-3 block h-2 w-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${t.accents.secondary}, ${t.accents.gold}, ${t.accents.primary})`,
                  }}
                  aria-hidden="true"
                />
                <h2 className="text-lg font-bold text-[#0B1F3A] dark:text-white">
                  {t.label}
                </h2>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {t.windowLabel}
                </p>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-snug">
                  {t.description}
                </p>
                {active && (
                  <p className="mt-3 text-xs font-semibold text-amber-700">
                    Aktywny w podglądzie
                  </p>
                )}
              </button>
            )
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/kursy/?theme=christmas"
            className="rounded-full bg-[#C41E3A] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            /kursy/ · świąteczna
          </Link>
          <Link
            to="/kursy/?theme=nye"
            className="rounded-full bg-[#0B1F3A] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            /kursy/ · sylwestrowa
          </Link>
          <Link
            to="/o-nas2/?theme=christmas"
            className="rounded-full bg-[#0C6478] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            /o-nas2/ · śnieg
          </Link>
          <Link
            to="/kursy/?theme=classic"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            /kursy/ · klasyczny
          </Link>
        </div>
      </section>
    </div>
  )
}

export const Head = () => <Seo title="Podgląd motywów sezonowych" />
export default PodgladMotywow
