import * as React from "react"
import { Link } from "gatsby"
import Seo from "../components/seo"
import { StaticImage } from "gatsby-plugin-image"
import {
  HomeIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid"

const NotFoundPage = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center py-16 px-4 sm:px-6">
    <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
      
      {/* Lewa kolumna – tekst */}
      <div className="text-center md:text-left order-2 md:order-1">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-sm font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          Błąd 404
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
          Strona nie{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
            istnieje
          </span>
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-md mx-auto md:mx-0">
          Ups! Wygląda na to, że trafiłeś na adres, którego nie ma w naszej bazie. 
          Może strona została przeniesiona lub wpisano nieprawidłowy URL.
        </p>

        {/* Główny CTA */}
        <Link
          to="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
        >
          <HomeIcon className="w-5 h-5" />
          Wróć na stronę główną
        </Link>

        {/* Pomocnicze linki */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto md:mx-0">
          <Link
            to="/kursy"
            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-cyan-700 dark:hover:text-white hover:border-cyan-300 dark:hover:border-cyan-500/30 hover:bg-cyan-50 dark:hover:bg-white/10 transition-all duration-200 group shadow-sm"
          >
            <AcademicCapIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Przeglądaj kursy</span>
            <ArrowRightIcon className="w-4 h-4 ml-auto text-gray-400 group-hover:text-cyan-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </Link>

          <Link
            to="/kontakt"
            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-cyan-700 dark:hover:text-white hover:border-cyan-300 dark:hover:border-cyan-500/30 hover:bg-cyan-50 dark:hover:bg-white/10 transition-all duration-200 group shadow-sm"
          >
            <EnvelopeIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Skontaktuj się</span>
            <ArrowRightIcon className="w-4 h-4 ml-auto text-gray-400 group-hover:text-cyan-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </Link>
        </div>
      </div>

      {/* Prawa kolumna – obrazek */}
      <div className="order-1 md:order-2 flex justify-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl opacity-60" />
          <StaticImage
            src="../assets/images/404.png"
            alt="Strona nie istnieje"
            className="relative mx-auto max-w-sm md:max-w-md w-full drop-shadow-xl"
            placeholder="blurred"
            layout="constrained"
          />
        </div>
      </div>
    </div>
  </div>
)

export const Head = () => <Seo title="Nie znaleziono strony | CEEA" />

export default NotFoundPage