import React from "react"
import Switch from "react-switch"
import { CSSTransition } from "react-transition-group"
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faA } from "@fortawesome/free-solid-svg-icons"

const SlidePanel = ({ isOpen, toggle, darkMode, setDarkMode, setFontSize }) => {
  return (
    <CSSTransition
      in={isOpen}
      timeout={300}
      classNames="slide"
      unmountOnExit
      appear
    >
      <div className="fixed right-0 top-0 h-full bg-gray-800 shadow-lg w-64 p-6 z-50 text-white">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-end">
            <button
              onClick={toggle}
              className="mb-4 rounded-full bg-gray-100 p-1"
              aria-label="Close panel"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          <div>
            <div className="flex flex-col space-y-2 py-2">
              <span className="pb-5 text-lg font-bold">Personalizacja: </span>
              <span>Zmiana motywu</span>
              <Switch
                checked={darkMode}
                onChange={checked => setDarkMode(checked)}
                offColor="#CBD5E0" // ciemny szary
                onColor="#4A5568" // jasny szary
                uncheckedIcon={
                  <SunIcon className="w-6 h-6 ml-2 pt-2 text-yellow-500" />
                }
                checkedIcon={
                  <MoonIcon className="w-6 h-6 ml-1 pt-2 text-gray-500" />
                }
                height={30}
                width={64}
                handleDiameter={20}
              />
            </div>
            
          </div>
        </div>
      </div>
    </CSSTransition>
  )
}

export default SlidePanel
