import React from "react"
import { useLocation } from "@reach/router"
import Button from "../Button/Button"
import { slugify } from "../../utils/slugify"
import { getYearFromDate } from "../../utils/getYearFromDate"

const SideInfoPanel = ({ money, time, available, nameCourse, date }) => {
  const location = useLocation()
  const rejestraction = location.pathname.includes("/rejestracja")
  return (
    <div
      className={`xl:sticky xl:top-0 xl:right-0 xl:max-h-[calc(100vh-15vh)] overflow-y-auto mt-10 md:mt-0 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow-lg flex flex-col self-start w-full md:w-auto max-w-xs md:max-w-full mx-auto overflow-hidden`}
    >
      {/* Sekcja cena */}
      <div className="py-8 px-6 md:text-center bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800">
        <span className="font-bold text-lg text-gray-600 dark:text-gray-400">
          Cena kursu:
        </span>
        <span className="font-bold text-4xl text-darkBlueGreen dark:text-[#6b91c0] ml-2">
          {money ? `${money} zł` : "Nieznana"}
        </span>
      </div>

      {/* Sekcja punkty edukacyjne */}
      <div className="py-4 px-6 md:text-center border-t space-x-4 flex flex-col items-center flex-1 w-full">
        {/* <AcademicCapIcon
          className="h-6 w-6 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
        /> */}
        
          <span className="font-bold text-lg text-gray-600 dark:text-gray-400">Punkty edukacyjne:</span>
          <span className="font-bold text-3xl block dark:text-gray-50 ml-2">
            {time ? `${time}` : "Nieznane"}
          </span>
      
      </div>

      {/* Sekcja status zapisów */}
      <div className="border-t p-5 flex flex-col items-center justify-center">
        <span
          className={`font-bold text-center text-xl px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform ${
            available
              ? "bg-green-500 text-white dark:bg-green-700"
              : "bg-red-500 text-white dark:bg-red-700"
          } ${available ? "animate-pulse" : ""}`}
        >
          Zapisy {available ? "dostępne" : "niedostępne"}
        </span>
        {available && !rejestraction && (
          <Button
            href={`/kursy/${getYearFromDate(date)}/${slugify(
              nameCourse
            )}/rejestracja`}
            className="mt-4"
            variant='default'
          >
            Zapisz się na kurs
          </Button>
        )}
      </div>
    </div>
  )
}

export default SideInfoPanel
