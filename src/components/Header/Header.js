import React from "react"
import { useState } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { Squash as Hamburger } from "hamburger-react"
import { Dialog } from "@headlessui/react"
import Button from "../Button/Button"
import Logo from "../../assets/images/logo-header.png"
import { menuLinks } from "../Menu"
import RightArrow from "../RightArrow"
import { slugify } from "../../utils/slugify"
import { getYearFromDate } from "../../utils/getYearFromDate"

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
      setTimeout(() => setMobileMenuOpen(false), 100) // 500ms delay
    } else {
      setMobileMenuOpen(true)
    }
  }

  return (
    <header className="relative bg-medium px-10 h-28 shadow-sm shadow-slate-900/10 dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:shadow-slate-800/60 transition-colors duration-500 z-50">
      <nav
        className="mx-auto lg:grid flex justify-between 2xl:grid-cols-6 grid-cols-5 h-full items-center text-center  max-lg:py-9"
        aria-label="Global"
      >
        <div className="absolute max-lg:hidden top-0 left-0 right-0 w-27 h-36 bg-gradient-to-r bg-dark skew-x-40 scale-x-150	to-dark  dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
        <div className="z-50 col-span-2">
          <Link to="/" className="-m-1.5 p-1.5 flex lg:pt-10">
            <span className="sr-only">CEEA - Ośrodek Poznański</span>
            <img
              className="w-auto 2xl:h-12 xl:h-10 lg:h-9 md:h-12 max-md:h-11 max-sm:h-10 max-xl:pr-0 grow z-50 lg:pr-10 object-contain self-center mr-8"
              src={Logo}
              alt="Logo CEEA"
            />
          </Link>
        </div>
        <div className="lg:hidden">
          <button
            aria-label="Open menu"
            type="button"
            className="rounded-md py-2.5 text-gray-50"
            onClick={handleClick}
          >
            <span className="sr-only">Open main menu</span>
            {/* {mobileMenuOpen ? <Bars3Icon/> : <XMarkIcon/>} */}
            <Hamburger
              size={26}
              toggled={mobileMenuOpen}
              toggle={setMobileMenuOpen}
            />
          </button>
        </div>
        {/* Navigation desktop */}
        <div className="hidden h-full lg:flex text-white w-full relative z-50 2xl:col-span-3 justify-between">
      {menuLinks.map(link => (
        <Link
          key={link.title}
          to={link.to}
          activeClassName="text-navyBlue dark:text-[#6b91c0] font-bold"
          className='relative whitespace-nowrap px-4 flex items-center xl:px-7 md:px-5 font-semibold xl:text-lg md:text-base justify-end
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
        {activeCourse && (
          <div className="hidden 2xl:flex justify-end relative">
            <Button
            margines="mt-0"
            variant="submit"
              href={`/kursy/${getYearFromDate(data.activeCourse.nodes[0].date)}/${slugify(data.activeCourse.nodes[0].nameCourse)}/szczegoly`}
            >
              
              Informacje o kursie
            </Button>
          </div>
        )}

      </nav>

      {/* Mobile */}
      <Dialog
        as="div"
        className="lg:hidden z-50"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel
  className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto 
  bg-gradient-to-b from-cyan-500 to-dark 
  text-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 
  dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 
  transition-colors duration-300"
>
          <div className="flex items-center justify-between relative">
            <Link to="/" className="p-1.5">
              <span className="sr-only">CEEA - Ośrodek Poznański</span>
              <img
                className="h-8 w-auto mr-5 max-sm:hidden"
                src={Logo}
                alt=""
              />
            </Link>
            <button
              aria-label="Close menu"
              type="button"
              className=" rounded-md pr-4 pt-2 text-gray-200 dark:text-gray-50 text-sm"
              onClick={handleClick}
            >
              <span className="sr-only ">Close menu</span>
              <Hamburger
                size={20}
                toggled={mobileMenuOpen}
                toggle={setMobileMenuOpen}
              />
            </button>
          </div>
          <div className="mt-20 flow">
            <div className="-my-6 divide-y divide-gray-900/10 dark:divide-gray-100/50 ml-5">
              <div className="space-y-2 py-6 flex flex-col">
                {menuLinks.map(link => (
                  <Link 
                    key={link.title}
                    to={link.to}
                    className="dark:text-white py-4 "
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.title}
                  </Link>
                ))}
                {activeCourse && (
                  <Link
                    to={`/kursy/${getYearFromDate(data.activeCourse.nodes[0].date)}/${slugify(data.activeCourse.nodes[0].nameCourse)}/szczegoly`}
                    className="dark:text-white py-4 "
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Informacje o kursie
                  </Link>
                )}
              </div>
              <div className="py-6">
                {activeCourse && (
                  <Link
                    to={`/kursy/${getYearFromDate(activeCourse.date)}/${slugify(
                      activeCourse.nameCourse
                    )}/rejestracja`}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Zapisz się na kurs
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}

export default Header
