import React from "react"
import { Link, useStaticQuery, graphql, navigate } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import scrollTo from "gatsby-plugin-smoothscroll"
import { FaFacebookF, FaYoutube } from "react-icons/fa"
import {
  MapPinIcon,
  EnvelopeIcon,
  BuildingLibraryIcon,
  AcademicCapIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid"
import Logo from "../../assets/images/logo-header.png"
import { menuLinks, przydatneLinki } from "../Menu"
import CopyToClipboardWithNotification from "../CopyToClipboardWithNotification/CopyToClipboardWithNotification"
import { slugify } from "../../utils/slugify"
import { getYearFromDate } from "../../utils/getYearFromDate"

const Footer = () => {
  const data = useStaticQuery(graphql`
    query FooterQuery {
      datoCmsCompany {
        nameCompany
        description
        street
        numberHome
        city
        zipCode
        regon
        nip
        krs
        bankAccount
        bankAccountName
        mail
        facebook
        youtube
      }
      allDatoCmsCourse(filter: { available: { eq: true } }) {
        nodes {
          id
          nameCourse
          date
          available
          image {
            fluid(maxWidth: 800) {
              ...GatsbyDatoCmsFluid
            }
          }
        }
      }
    }
  `)
  const company = data.datoCmsCompany
  const activeCourse = data.allDatoCmsCourse.nodes[0]

  const handleClick = (to, event) => {
    event.preventDefault()
    navigate(to)
    setTimeout(() => {
      scrollTo("#top")
    }, 100)
  }

  const footerMenuLinks = [...menuLinks]

  return (
    <footer className="relative bg-dark text-gray-100 overflow-hidden">
      {/* Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-full h-[40px] sm:h-[60px] md:h-[80px] lg:h-[100px]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="footerWaveLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F1FAFF" />
              <stop offset="100%" stopColor="#f0f9ff" />
            </linearGradient>
            <linearGradient id="footerWaveDark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>
          <path
            d="M0,224L60,197.3C120,171,240,117,360,122.7C480,128,600,192,720,208C840,224,960,192,1080,197.3C1200,203,1320,245,1380,266.7L1440,288V320H0Z"
            fill="url(#footerWaveLight)"
            className="dark:fill-[url(#footerWaveDark)]"
          />
        </svg>
      </div>

      <div className="relative pt-20 sm:pt-24 md:pt-32 lg:pt-40 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Grid: 1 col → 2 cols → 12 cols */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-8">
            
            {/* Brand – separator na mobile/tablet */}
            <div className="lg:col-span-4 lg:pr-10 border-b border-white/10 pb-8 mb-8 lg:border-0 lg:pb-0 lg:mb-0">
              <Link to="/" className="inline-flex items-center gap-3 mb-5">
                <img
                  className="h-9 w-auto object-contain brightness-0 invert"
                  src={Logo}
                  alt="CEEA - Ośrodek Poznański"
                />
              </Link>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {company.description}
              </p>

              <div className="flex items-center gap-3">
                {company.facebook && (
                  <a
                    href={`https://www.facebook.com/${company.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#1877F2] hover:scale-110 transition-all duration-300"
                  >
                    <FaFacebookF className="w-4 h-4" />
                  </a>
                )}
                {company.youtube && (
                  <a
                    href="https://www.youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#FF0000] hover:scale-110 transition-all duration-300"
                  >
                    <FaYoutube className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Menu – separator na mobile/tablet */}
            <div className="lg:col-span-2 border-b border-white/10 pb-8 mb-8 lg:border-0 lg:pb-0 lg:mb-0">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300 mb-5">
                Menu
              </h3>
              <ul className="space-y-3">
                {footerMenuLinks.map(link => (
                  <li key={link.title}>
                    <Link
                      to={link.to}
                      onClick={e => handleClick(link.to, e)}
                      className="block text-sm text-gray-300 hover:text-white transition-colors duration-200 py-0.5"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Przydatne linki – separator na mobile/tablet */}
            <div className="lg:col-span-3 border-b border-white/10 pb-8 mb-8 lg:border-0 lg:pb-0 lg:mb-0">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300 mb-5">
                Przydatne linki
              </h3>
              <ul className="space-y-3">
                {przydatneLinki.map(link => {
                  const isStudent = link.title === "Panel kursanta"
                  return (
                    <li key={link.title}>
                      <Link
                        to={link.to}
                        onClick={e => handleClick(link.to, e)}
                        className={`inline-flex items-center gap-2 text-sm transition-colors duration-200 py-0.5 ${
                          isStudent
                            ? "text-amber-300 hover:text-amber-200 font-medium"
                            : "text-gray-300 hover:text-white"
                        }`}
                      >
                        {isStudent && (
                          <UserCircleIcon className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        )}
                        <span>{link.title}</span>
                      </Link>
                    </li>
                  )
                })}
                {activeCourse?.nameCourse && (
                  <li className="pt-1">
                    <Link
                      to={`/kursy/${getYearFromDate(
                        activeCourse.date
                      )}/${slugify(activeCourse.nameCourse)}/rejestracja`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-amber-300 hover:text-amber-200 transition-colors py-0.5"
                    >
                      <AcademicCapIcon className="w-4 h-4 flex-shrink-0" />
                      <span>Zapis na kurs</span>
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Kontakt – bez separatora, ostatnia sekcja */}
            <div className="lg:col-span-3">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300 mb-5">
                Kontakt
              </h3>
              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white text-sm leading-tight">
                      {company.nameCompany}
                    </p>
                    <p className="text-sm mt-1">
                      ul. {company.street} {company.numberHome}
                    </p>
                    <p className="text-sm">
                      {company.zipCode} {company.city}
                    </p>
                  </div>
                </div>

                {company.mail && (
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <a
                      href={`mailto:${company.mail}`}
                      className="hover:text-white transition-colors text-sm"
                    >
                      {company.mail}
                    </a>
                  </div>
                )}

                <div className="flex items-start gap-3 pt-1">
                  <BuildingLibraryIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] text-gray-300 mb-1 uppercase tracking-wide">
                      {company.bankAccountName}
                    </p>
                    <CopyToClipboardWithNotification text={company.bankAccount}>
                      <span className="inline-block font-mono text-xs bg-white/5 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors border border-white/5">
                        {company.bankAccount}
                      </span>
                    </CopyToClipboardWithNotification>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row flex-wrap items-center sm:items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs text-gray-400">
                <span>
                  © 2023 – {new Date().getFullYear()} CEEA. Wszelkie prawa zastrzeżone.
                </span>
                <span className="hidden sm:inline text-gray-600">|</span>
                <span className="flex gap-5">
                  <Link to="/sitemap-index.xml" className="hover:text-white transition-colors">
                    Sitemap
                  </Link>
                  <span className="hidden sm:inline text-gray-600">|</span>
                  <Link to="/polityka-prywatnosci" className="hover:text-white transition-colors">
                    Polityka prywatności
                  </Link>
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="text-nowrap text-gray-200">Projekt i wykonanie:</span>
                <a
                  href="https://karolznojkiewicz.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-100 opacity-60 transition-opacity"
                >
                  <StaticImage
                    alt="Karol Znojkiewicz"
                    width={30}
                    className="brightness-0 invert"
                    src="../../assets/images/LogoKarolZnojkiewicz.svg"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer