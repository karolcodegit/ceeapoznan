import React from "react"
import { Link } from "gatsby"
import { useLocation } from "@reach/router"
import { menuLinks, otherLinks, przydatneLinki } from "../Menu"
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/solid"

const Breadcrumbs = () => {
  const location = useLocation()
  const currentPath = location.pathname

  // Nie renderuj na stronie głównej
  if (currentPath === "/") return null

  // Wszystkie znane linki poza rootem
  const allLinks = [...menuLinks, ...przydatneLinki, ...otherLinks].filter(
    link => link.to && link.to !== "/"
  )

  // Znajdź pasujące i posortuj od najkrótszej ścieżki
  const matched = allLinks
    .filter(link => currentPath.includes(link.to))
    .sort((a, b) => a.to.length - b.to.length)

  // Zbuduj pełną ścieżkę
  const breadcrumbs = [
    { title: "Strona główna", to: "/" },
    ...matched,
  ]

  // Jeśli ścieżka jest głębsza niż ostatni znany link, dodaj aktualny segment
  const lastKnown = matched[matched.length - 1]
  if (!lastKnown || currentPath !== lastKnown.to) {
    const remaining = currentPath.replace(lastKnown?.to || "", "")
    const lastSegment = remaining.split("/").filter(Boolean).pop()
    if (lastSegment) {
      const title = lastSegment
        .replace(/-/g, " ")
        .replace(/szczegoly|rejestracja/g, match => 
          match === "szczegoly" ? "Szczegóły" : "Rejestracja"
        )
      breadcrumbs.push({ title, to: currentPath })
    }
  }

  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol className="inline-flex flex-wrap items-center gap-1 text-sm sm:text-base">
        {breadcrumbs.map((link, index) => {
          const isLast = index === breadcrumbs.length - 1
          const isHome = index === 0

          return (
            <li key={link.to + index} className="flex items-center">
              {index !== 0 && (
                <ChevronRightIcon
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4 mx-1 sm:mx-1.5 text-slate-400 dark:text-slate-500 flex-shrink-0"
                  aria-hidden="true"
                />
              )}

              {isLast ? (
                <span
                  className="font-semibold text-slate-800 dark:text-white truncate max-w-[140px] sm:max-w-[200px] md:max-w-xs"
                  aria-current="page"
                >
                  {isHome && (
                    <HomeIcon className="h-4 w-4 inline-block -mt-0.5 mr-1 text-cyan-600 dark:text-cyan-400" />
                  )}
                  {link.title}
                </span>
              ) : (
                <Link
                  to={link.to}
                  className="text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 flex items-center gap-1"
                >
                  {isHome ? (
                    <HomeIcon className="h-4 w-4 flex-shrink-0 text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors" />
                  ) : (
                    <span className="truncate max-w-[100px] sm:max-w-[140px]">
                      {link.title}
                    </span>
                  )}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs