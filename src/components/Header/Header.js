import React from "react"
import { useState } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import {Squash as Hamburger} from "hamburger-react"
import { Dialog } from "@headlessui/react"
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import Button from "../Button/Button"
import Logo from "../../assets/images/logo-header.png"
import { menuLinks } from "../Menu"
import RightArrow from "../RightArrow"
import { slugify } from "../../../utils/slugify"

const Header = () => {
  const data = useStaticQuery(graphql`
    query {
      activeCourse: allDatoCmsCourse(filter: { available: { eq: true } }) {
        nodes {
          id
          nameCourse
        }
      }
    }
  `)
  const activeCourse = data.activeCourse.nodes[0]
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const handleClick = () => {
    if (mobileMenuOpen) {
      setTimeout(() => setMobileMenuOpen(false), 100); // 500ms delay
    } else {
      setMobileMenuOpen(true);
    }
  }
  return (
    <header className="relative bg-medium px-10 h-28 shadow-slate-900 shadow-sm dark:bg-slate-800 dark:shadow-slate-700">
      <nav
        className="mx-auto lg:grid flex justify-between 2xl:grid-cols-6 grid-cols-5 h-full items-center text-center  max-lg:py-9"
        aria-label="Global"
      >
        <div className="absolute max-lg:hidden top-0 left-0 right-0 w-27 h-36 bg-gradient-to-r from-cyan-500 to-dark skew-x-40 scale-x-150	dark:from-gray-700 dark:to-gray-900"></div>
        <div className="z-50 col-span-2">
          <Link to="/" className="-m-1.5 p-1.5 flex lg:pt-10">
            <span className="sr-only">CEEA - Ośrodek Poznański</span>
            <img
              className=" w-auto 2xl:h-12 max-2xl:h-8 max-xl:pr-0 grow z-50 lg:pr-10 object-contain self-center mr-8"
              src={Logo}
              alt="Logo CEEA"
            />
          </Link>
        </div>
        <div className="lg:hidden">
          <button
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-gray-50"
            onClick={handleClick}
          >
            <span className="sr-only">Open main menu</span>
            {/* {mobileMenuOpen ? <Bars3Icon/> : <XMarkIcon/>} */}
            <Hamburger
            size={20}
              toggled={mobileMenuOpen} toggle={setMobileMenuOpen}
            />
          </button>
        </div>
        {/* Navigation desktop */}
        <div className="hidden h-full lg:flex text-white w-full relative z-50 col-span-3 2xl:ml-4 justify-between">
          {menuLinks.map(link => (
            <Link
              activeClassName="active"
              activeStyle={{ color: "dark", fontWeight: 700 }}
              key={link.title}
              to={link.to}
              className='px-4 flex items-center relative before:absolute before:content-[""] before:top-0 before:right-0 before:left-0 before:w-full before:h-full before:bg-dark dark:before:bg-slate-900 before:skew-x-40 before:opacity-0 hover:before:opacity-100 before:-z-10 hover:text-white delay-50 xl:text-lg md:text-base font-medium  justify-end transition duration-500 ease-in-out transform hover:scale-110'
            >
              {link.title}
            </Link>
          ))}
        </div>
        {activeCourse && (
          <div className="hidden 2xl:flex justify-end relative">
            <Button
              href={`/kursy/${slugify(activeCourse.nameCourse)}/rejestracja`}
            >
              <RightArrow />
              Zapisz się na kurs
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
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gradient-to-r text-white from-cyan-500 to-dark bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:from-gray-700 dark:to-gray-900">
          <div className="flex items-center justify-between relative">
            <Link to="/" className=" -m-1.5 p-1.5">
              <span className="sr-only">CEEA - Ośrodek Poznański</span>
              <img
                className="h-8 w-auto mr-5 max-sm:hidden"
                src={Logo}
                alt=""
              />
            </Link>
            <button
              type="button"
              className=" rounded-md pr-4 pt-1 text-gray-200 dark:text-gray-50 text-sm"
              onClick={handleClick}
            >
              <span className="sr-only ">Close menu</span>
              <Hamburger
              size={20}
                toggled={mobileMenuOpen} toggle={setMobileMenuOpen}
              />
            </button>
          </div>
          <div className="mt-20 flow">
            <div className="-my-6 divide-y divide-gray-900/10 dark:divide-gray-100/50">
              <div className="space-y-5 py-6 flex flex-col">
                {menuLinks.map(link => (
                  <Link
                    key={link.title}
                    to={link.to}
                    className="dark:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {activeCourse && (
                  <Link
                    to={`/kursy/${slugify(
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
