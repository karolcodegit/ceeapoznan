import React, { useEffect, useState } from "react"
import { useLocation } from "@reach/router"
import { ThemeProvider } from "@emotion/react"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import NotificationProvider from "../components/Notification/NotificationProvider"
import TopHeader from "../components/TopHeader/TopHeader"
import SlidePanel from "../components/SlidePanel/SlidePanel"
import { Bars4Icon } from "@heroicons/react/24/solid"
import { FontSizeContext } from "../context/fontSizeContext"
import TitleContext from "../context/TitleContext"

const MainLayout = ({ children }) => {
  const [title, setTitle] = React.useState("")
  const location = useLocation()
  const isHomePage = location.pathname === "/"
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
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    
    localStorage.setItem("darkMode", darkMode)
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const theme = {
    mode: darkMode ? "dark" : "light",
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <TitleContext.Provider value={{ title, setTitle }}>
          <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
            <NotificationProvider>
              <Header />
              
              <div className="flex flex-col items-end justify-end relative">
                <button
                  onClick={togglePanel}
                  className="fixed top-36 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded z-50"
                  aria-label="Open modal"
                >
                  <Bars4Icon className="h-6 w-6" />
                </button>
                <SlidePanel
                  isOpen={isPanelOpen}
                  toggle={togglePanel}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  setFontSize={setFontSize}
                />
              </div>
              <div
              id="top"
                className={` ${
                  isHomePage
                    ? ""
                    : "max-w-6xl py-32 mx-auto px-4 sm:px-6 lg:px-8"
                }`}
              >
                {!isHomePage && <TopHeader />}
                {children}
              </div>
              <Footer />
            </NotificationProvider>
          </FontSizeContext.Provider>
        </TitleContext.Provider>
      </ThemeProvider>
    </>
  )
}

export default MainLayout
