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
  className={`xl:sticky xl:top-20 xl:right-0 xl:max-h-[calc(100vh-15vh)] overflow-y-auto 
    mt-10 md:mt-0 
    bg-white dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-700 
    dark:text-gray-100 rounded-2xl shadow-xl 
    flex flex-col self-start w-full md:w-auto max-w-xs md:max-w-full mx-auto overflow-hidden 
    transition-all duration-300`}
>
  {/* Sekcja cena */}
  <div className="py-8 px-6 md:text-center 
    bg-white dark:bg-gradient-to-b dark:from-slate-700 dark:to-slate-800 
    border-b border-gray-200 dark:border-slate-600">
    <span className="font-bold text-lg text-gray-800 dark:text-gray-300">
      Cena kursu:
    </span>
    <span
      className={`font-bold ${
        money ? "text-4xl" : "text-3xl"
      } text-darkBlueGreen dark:text-[#7fa8db] ml-2`}
    >
      {money ? `${money} zł` : "Nieznana"}
    </span>
  </div>

  {/* Sekcja punkty edukacyjne */}
  <div className="py-6 px-6 md:text-center border-t border-gray-200 dark:border-slate-700 
    flex flex-col items-center flex-1 w-full 
    bg-white dark:bg-slate-800/60 transition-colors duration-300">
    <span className="font-bold text-lg text-gray-600 dark:text-gray-300">
      Punkty edukacyjne:
    </span>
    <span className="font-bold text-3xl block text-darkBlueGreen dark:text-[#9fbde7] mt-1">
      {time ? `${time}` : "Nieznane"}
    </span>
  </div>

  {/* Sekcja status zapisów */}
  <div className="border-t border-gray-200 dark:border-slate-700 
    p-6 flex flex-col items-center justify-center 
    bg-white dark:bg-slate-800/50 transition-colors duration-300">
    <span
      className={`font-bold text-center text-xl px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform ${
        available
          ? "bg-green-500 text-white dark:bg-green-700 dark:shadow-green-900/50"
          : "bg-red-500 text-white dark:bg-red-700 dark:shadow-red-900/50"
      } ${available ? "animate-pulse" : ""}`}
    >
      Zapisy {available ? "dostępne" : "niedostępne"}
    </span>

    {available && !rejestraction && (
      <Button
        href={`/kursy/${getYearFromDate(date)}/${slugify(nameCourse)}/rejestracja`}
        className="mt-4"
        variant="default"
      >
        Zapisz się na kurs
      </Button>
    )}
  </div>
</div>
  )
}

export default SideInfoPanel
