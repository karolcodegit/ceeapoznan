import React from "react"
import { useLocation } from "@reach/router"
import Button from "../Button/Button"
import { AcademicCapIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline"
import { slugify } from "../../../utils/slugify"

const SideInfoPanel = ({ money, time, available, nameCourse }) => {
  const location = useLocation()
  const rejestraction = location.pathname.includes("/rejestracja")
  return (
    <div className="md:w-1/4 xl:w-1/4 xl:sticky xl:top-0 xl:right-0 xl:max-h-[calc(100vh-15vh)] overflow-y-auto mx-auto">
      <div className="rounded-md flex flex-col h-full">
        <div className="p-5 flex flex-col items-center justify-center">
          <CurrencyDollarIcon className="h-8 w-8 mb-2 dark:text-gray-200" aria-hidden="true" />
          <span className="font-normal text-sm dark:text-gray-200">Cena kursu: </span>
          <span className="font-bold py-2 text-3xl dark:text-gray-50">{money ? `${money} zł` : 'Nieznana'}</span>
        </div>
        <div className="border-t p-5 flex flex-col items-center justify-center">
          <AcademicCapIcon className="h-8 w-8 mb-2 dark:text-gray-200" aria-hidden="true" />
          <span className="font-normal text-center text-sm dark:text-gray-200">
            Punkty edukacyjne:</span>
          <span className="font-bold py-2 text-3xl dark:text-gray-50">{time ? `${time}` : 'Nieznana'}</span>
        </div>
        <div className="p-5 flex flex-col items-center justify-center">
          <span className="font-bold text-darker text-center text-2xl mb-5 bg-gray-100 px-4 py-2 rounded shadow-sm animate-pulse">
            Zapisy {available ? "dostępne" : "niedostępne"}
          </span>
          {available && !rejestraction && (
            <Button href={`/kursy/${slugify(nameCourse)}/rejestracja`}>
              Zapisz się na kurs
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SideInfoPanel
