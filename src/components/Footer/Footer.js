import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Logo from "../../assets/images/Logo.png"
import { menuLinks, przydatneLinki } from "../Menu"
import CopyToClipboardWithNotification from "../CopyToClipboardWithNotification/CopyToClipboardWithNotification"
import LogoCompany from "../../assets/images/LogoWhiteCompany.png"
import { slugify } from "../../../utils/slugify"

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

  return (
    <footer className="min-w-full bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-gray-800 dark:to-gray-900 text-gray-100 dark:text-gray-300 flex flex-col md:flex-row justify-between bottom-0 left-0 right-0">
      <div className="min-w-full md:mx-auto  xl:pt-32 lg:pt-20 max-lg:pt-8 xl:px-20 max-xl:px-5">
        <div className="grid grid-cols-2 max-xl:grid-cols-1 justify-between md:gap-12 max-md:gap-0">
          <div className="max-w-md mb-10 md:mb-0">
            <div className="flex items-center">
              <img className="h-10 max-w-full" src={Logo} alt="" />
              <h1 className="font-bold ml-5 ">CEEA - Ośrodek Poznański</h1>
            </div>
            <p className="leading-6	pt-5">{data.datoCmsCompany.description}</p>
            <div className="flex mt-8">
              <a
                href={`https://www.facebook.com/${data.datoCmsCompany.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-8 bg-text-300 mr-2"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              {data.datoCmsCompany.youtube && (
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-8 bg-text-300"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              )}
            </div>
          </div>
          <div className="max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-x-3 gap-y-8">
            <div className="">
              <>
                <h3 className="uppercase font-bold">Menu</h3>
                <ul className="mt-6">
                  {menuLinks.map(link => (
                    <li key={link.title} className="py-1">
                      <Link to={link.to}>{link.title}</Link>
                    </li>
                  ))}
                </ul>
              </>
            </div>
            <div>
              <h3 className="uppercase font-bold">Przydatne linki</h3>
              <ul className="mt-6">
                {przydatneLinki.map(link => (
                  <li key={link.title} className="py-1">
                    <Link to={link.to}>{link.title}</Link>
                  </li>
                ))}
                <li className="py-1">
                  <Link
                    to={`/kursy/${slugify(
                      data.allDatoCmsCourse.nodes[0].nameCourse
                    )}/rejestracja`}
                  >
                    Zapis na kurs
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col">
              <p className="pb-4 font-bold">{company.nameCompany}</p>
              <span className="py-2">
                ul. {company.street} {company.numberHome}
              </span>
              <span className="">
                {company.zipCode} {company.city}
              </span>
            </div>
          </div>
        </div>
        <div className="flex xl:justify-between flex-row max-xl:flex-col py-6 mt-24 border-t border-slate-50 text-xs mx-auto">
          <div className="flex-col">
            <div className="flex justify-between">
              <div>
                <div className="mb-4 flex items-center">
                  <span>
                    © {new Date().getFullYear()} CEEA. Wszelkie prawa
                    zastrzeżone.
                  </span>
                  <span className="xl:flex hidden ml-2">
                    Projekt i wykonanie:
                  </span>
                </div>
                <div className="mb-4">
                  <span className="max-md:mt-2">
                    <Link to="/sitemap-0.xml">Sitemap</Link>
                    <span className="px-1">|</span>
                    <Link to="/polityka-prywatnosci">Polityka prywatności</Link>
                  </span>
                </div>
              </div>
              <div>
                <div className="flex flex-col items-center">
                  <span className="xl:hidden flex">Projekt i wykonanie:</span>
                  <a
                    href="https://karolznojkiewicz.pl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Karol Znojkiewicz"
                  >
                    <img
                      alt="Karol Znojkiewicz"
                      className="h-7 xl:ml-4"
                      src={LogoCompany}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <span>Konto bankowe: {company.bankAccountName}</span>
            <span className="px-1">|</span>
            <CopyToClipboardWithNotification text={company.bankAccount}>
              <span className="font-bold cursor-pointer">
                {company.bankAccount}
              </span>
            </CopyToClipboardWithNotification>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
