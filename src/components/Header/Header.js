import React, { useState } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { Squash as Hamburger } from "hamburger-react"
import { Dialog } from "@headlessui/react"
import {
  HomeIcon,
  InformationCircleIcon,
  AcademicCapIcon,
  BookOpenIcon,
  EnvelopeIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon,
  ArrowRightIcon,
  XMarkIcon
} from "@heroicons/react/24/solid"
import Button from "../Button/Button"
import Logo from "../../assets/images/logo-header.png"
import { menuLinks } from "../Menu"
import { slugify } from "../../utils/slugify"
import { getYearFromDate } from "../../utils/getYearFromDate"

const linkIcons = {
  "Strona główna": HomeIcon,
  "O nas": InformationCircleIcon,
  Kursy: AcademicCapIcon,
  Książki: BookOpenIcon,
  Kontakt: EnvelopeIcon,
  FAQ: QuestionMarkCircleIcon,
  "Panel kursanta": UserCircleIcon,
}

const Header = () => {
  const data = useStaticQuery(graphql`
    query {
      activeCourse: allDatoCmsCourse(filter: { available: { eq: true } }) {
        nodes {
          id
          nameCourse
          date
        }
      }
    }
  `)
  const activeCourse = data.activeCourse.nodes[0]
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const handleClick = () => {
    if (mobileMenuOpen) {
      setTimeout(() => setMobileMenuOpen(false), 100)
    } else {
      setMobileMenuOpen(true)
    }
  }

  const courseDetailsPath = `/kursy/${getYearFromDate(
    data.activeCourse.nodes[0].date
  )}/${slugify(data.activeCourse.nodes[0].nameCourse)}/szczegoly`

  const courseRegistrationPath = `/kursy/${getYearFromDate(
    activeCourse.date
  )}/${slugify(activeCourse.nameCourse)}/rejestracja`

  // Dodajemy Panel kursanta lokalnie (nie modyfikując menuLinks w innych miejscach)
  const allMenuLinks = [
    ...menuLinks,
    { title: "Panel kursanta", to: "https://panel.ceea.org.pl" },
  ]

  return (
    <header className="relative bg-medium px-6 sm:px-8 xl:px-10 h-28 shadow-sm shadow-slate-900/10 dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:shadow-slate-800/60 transition-colors duration-500 z-50">
      <nav
        className="mx-auto lg:grid flex justify-between 2xl:grid-cols-6 grid-cols-5 h-full items-center text-center max-lg:py-9"
        aria-label="Global"
      >
        {/* Skewed background - desktop only */}
        <div className="absolute max-lg:hidden top-0 left-0 right-0 w-27 h-36 bg-gradient-to-r bg-dark skew-x-40 scale-x-150 to-dark dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>

        {/* Logo */}
        <div className="z-50 col-span-2">
          <Link to="/" className="-m-1.5 p-1.5 flex lg:pt-10">
            <span className="sr-only">CEEA - Ośrodek Poznański</span>
            <img
              className="w-auto 2xl:h-12 xl:h-10 lg:h-9 md:h-12 max-md:h-11 max-sm:h-10 max-xl:pr-0 grow z-50 lg:pr-4 xl:pr-8 2xl:pr-10 object-contain self-center mr-4 xl:mr-6 2xl:mr-8"
              src={Logo}
              alt="Logo CEEA"
            />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="lg:hidden">
          <button
            aria-label="Open menu"
            type="button"
            className="rounded-md py-2.5 text-gray-50"
            onClick={handleClick}
          >
            <span className="sr-only">Open main menu</span>
            <Hamburger
              size={26}
              toggled={mobileMenuOpen}
              toggle={setMobileMenuOpen}
            />
          </button>
        </div>

        {/* Desktop Navigation */}
        <div
          className={`hidden h-full lg:flex text-white w-full relative z-50 justify-between ${
            activeCourse ? "2xl:col-span-3" : "2xl:col-span-4"
          }`}
        >
          {menuLinks.map(link => (
            <Link
              key={link.title}
              to={link.to}
              activeClassName="text-navyBlue dark:text-[#6b91c0] font-bold"
              className='relative whitespace-nowrap px-2 lg:px-3 xl:px-5 2xl:px-6 flex items-center font-semibold text-sm lg:text-sm xl:text-base 2xl:text-lg justify-end
        before:absolute before:content-[""] before:inset-0 before:bg-gradient-to-r before:from-vividTurquoise before:to-deepTurquoise before:opacity-0 before:skew-x-40 before:transition-all before:duration-300
        hover:before:opacity-100 before:-z-10
        hover:text-white hover:scale-[1.05] transition duration-300 ease-in-out
        dark:before:from-[#3fa7d6] dark:before:to-[#257ca3]
      '
            >
              {link.title}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        {activeCourse && (
          <div className="hidden 2xl:flex justify-end relative">
            <Button
              margines="mt-0"
              variant="submit"
              href={`/kursy/${getYearFromDate(
                data.activeCourse.nodes[0].date
              )}/${slugify(data.activeCourse.nodes[0].nameCourse)}/szczegoly`}
            >
              Informacje o kursie
            </Button>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      <Dialog
        as="div"
        className="lg:hidden z-50"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-gradient-to-b from-cyan-600 via-cyan-700 to-blue-900 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 text-white shadow-2xl flex flex-col">
          {/* Header mobilny */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
            <img
              className="h-8 w-auto brightness-0 invert"
              src={Logo}
              alt="CEEA"
            />
            <button
              aria-label="Zamknij menu"
              type="button"
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollowalna lista linków */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="space-y-1">
              {allMenuLinks.map(link => {
                const Icon = linkIcons[link.title] || InformationCircleIcon
                const isStudentPanel = link.title === "Panel kursanta"

                return (
                  <Link
                    key={link.title}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 ${
                      isStudentPanel
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/20 hover:bg-amber-500/25"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isStudentPanel ? "bg-amber-500/20" : "bg-white/10"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isStudentPanel ? "text-amber-400" : "text-cyan-300"
                        }`}
                      />
                    </div>
                    <span>{link.title}</span>
                    {isStudentPanel && (
                      <ArrowRightIcon className="w-4 h-4 ml-auto text-amber-400" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Informacje o kursie (jeśli aktywny) */}
            {activeCourse && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <Link
                  to={courseDetailsPath}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  <div className="p-2 rounded-lg bg-white/10">
                    <InformationCircleIcon className="w-5 h-5 text-cyan-300" />
                  </div>
                  <span>Informacje o kursie</span>
                </Link>
              </div>
            )}
          </div>

          {/* CTA na dole – w normalnym flow, nie absolute */}
          {activeCourse && (
            <div className="flex-shrink-0 p-6 border-t border-white/10 bg-gradient-to-t from-black/20 to-transparent">
              <Link
                to={courseRegistrationPath}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <AcademicCapIcon className="w-5 h-5" />
                Zapisz się na kurs
              </Link>
            </div>
          )}
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}

export default Header
