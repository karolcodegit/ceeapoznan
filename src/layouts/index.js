import React, { useEffect, useState } from "react"
import * as Sentry from "@sentry/react"
import { useLocation } from "@reach/router"
import { ThemeProvider } from "@emotion/react"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { Toaster } from "sonner"
import TopHeader from "../components/TopHeader/TopHeader"
import { FontSizeContext } from "../context/fontSizeContext"
import TitleContext from "../context/TitleContext"
import { menuLinks, otherLinks, przydatneLinki } from "../components/Menu"
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline"
import Cart from "../components/Shop/Cart"

const MainLayout = ({ children }) => {
  const [title, setTitle] = useState("")
  const location = useLocation()
  const isHomePage = location.pathname === "/"
  const currentPath = location.pathname
  const allLinks = [...menuLinks, ...przydatneLinki, ...otherLinks]
  const is404Page = !allLinks.some(link => link.to === currentPath)
  const [isPanelOpen, setPanelOpen] = useState(false)

  const togglePanel = () => {
    setPanelOpen(!isPanelOpen)
  }
  const [darkMode, setDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState("text-base")

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(isDarkMode)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode)
  }

  const theme = {
    mode: "dark", // or 'light'
  }

  return (
    <>
      <Sentry.ErrorBoundary fallback={<p>Coś poszło nie tak!</p>}>
        <ThemeProvider theme={theme}>
          <TitleContext.Provider value={{ title, setTitle }}>
            <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
              <Header />
              <Toaster richColors position="top-right" closeButton />
              <div className="bg-sky-50 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-800">
                <div className="flex flex-col items-end justify-end relative">
                  <button
                    onClick={toggleDarkMode}
                    className="fixed top-40 right-3 sm:top-48 sm:right-4 md:top-60 md:right-6 bg-gradient-to-r from-custom-blue to-navyBlue hover:from-blue-600 hover:to-blue-800
text-white font-medium
p-3 sm:p-4
rounded-full shadow-lg
flex items-center justify-center
z-50
transition-all duration-300 transform hover:scale-105
focus:ring-4 focus:ring-blue-300 focus:outline-none"
                    aria-label="Toggle dark mode"
                  >
                    {darkMode ? (
                      <SunIcon
                        className="h-5 w-5 sm:h-6 sm:w-6"
                        aria-hidden="true"
                      />
                    ) : (
                      <MoonIcon
                        className="h-5 w-5 sm:h-6 sm:w-6"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                  <Cart />
                  {/* <SlidePanel
                  isOpen={isPanelOpen}
                  toggle={togglePanel}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  setFontSize={setFontSize}
                /> */}
                </div>
                <div
                  id="top"
                  className={`${
                    isHomePage
                      ? ""
                      : "max-w-6xl py-12 sm:py-20 lg:py-28 mx-auto px-4 sm:px-6 lg:px-8"
                  }`}
                >
                  {/* Renderuj TopHeader tylko jeśli to nie jest strona 404 */}
                  {!isHomePage && !is404Page && <TopHeader />}
                  {children}
                </div>
              </div>
              <Footer />
            </FontSizeContext.Provider>
          </TitleContext.Provider>
        </ThemeProvider>
      </Sentry.ErrorBoundary>
    </>
  )
}

export default MainLayout
