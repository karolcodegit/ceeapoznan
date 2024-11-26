import React, { useState } from "react"
import {
  ClockIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline"
import Button from "../Button/Button"
import DeliveryModal from "../Modal/DeliveryModal"
// import OrderBooks from "../Modal/OrderBooks"
import { Tooltip } from "react-tooltip"
import { slugify } from "../../../utils/slugify"

const DeliveryInfo = ({ price, available, title, className }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isOrderBooksOpen, setIsOrderBooksOpen] = useState(false)

  const closeModal = () => {
    setIsModalOpen(false)
  }
  const openModal = () => {
    setIsModalOpen(true)
  }
  const closeContactModal = () => {
    setIsOrderBooksOpen(false)
  }

  const openContactModal = () => {
    setIsOrderBooksOpen(true)
  }

  return (
    <>
      <div
        className={`${className} mt-10 md:mt-0 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow-lg flex flex-col self-start w-full md:w-auto max-w-xs md:max-w-full mx-auto overflow-hidden z-10`}
      >
        <div className="py-8 px-6 md:text-center bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800">
          <span className="font-bold text-lg text-gray-600 dark:text-gray-400">
            Nasza cena:
          </span>
          <span className="font-bold text-4xl text-darkBlueGreen dark:text-[#6b91c0] ml-2">
            {price} zł
          </span>
        </div>
        {/* Wysyłka */}
        <div className="border-t p-5 flex items-start space-x-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300">
          <ClockIcon
            className="h-6 w-6 text-gray-500 dark:text-gray-400 flex-shrink-0"
            aria-hidden="true"
          />
          <div className="flex-1 text-gray-700 dark:text-gray-300">
            <span
              className="font-normal text-sm cursor-help"
              data-tooltip-id="my-tooltip-children-multiline"
              data-tooltip-place="bottom"
            >
              Wysyłamy w 24h
            </span>
            <Tooltip
              id="my-tooltip-children-multiline"
              style={{
                position: "fixed", // Lub "fixed" w zależności od kontekstu
                zIndex: 999,
                // Przykład wyśrodkowania
               
              }}
            >
              <div className="flex flex-col gap-1 text-xs z-50">
                <span>WYSYŁAMY W 24H – to znaczy, że taki produkt mamy</span>
                <span>
                  w magazynie i wyślemy go w ciągu 24 godzin w dni robocze.
                </span>
                <span>(1 dzień roboczy) od momentu złożenia zamówienia.</span>
              </div>
            </Tooltip>
          </div>
        </div>
        <div className="border-t p-5 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300">
          <CurrencyDollarIcon
            className="h-6 w-6 text-gray-500 dark:text-gray-400 flex-shrink-0"
            aria-hidden="true"
          />
          <span
            onClick={openModal}
            className="font-normal text-sm pl-4 cursor-pointer text-blue-600 dark:text-blue-400"
          >
            Sprawdź koszt dostawy
          </span>
        </div>
        {available ? (
          <Button
            className="font-normal text-sm pl-4"
            href={`/ksiazki/${slugify(title)}/zamowienie`}
          >
            <div className="flex items-center px-1 py-2 gap-4 text-gray-50 rounded-md">
              <ShoppingCartIcon
                className="h-6 w-6 flex-shrink-0"
                aria-hidden="true"
              />
              <span>Zamów teraz</span>
            </div>
          </Button>
        ) : (
          " "
        )}
      </div>

      <DeliveryModal isOpen={isModalOpen} closeModal={closeModal} />
      {/* <OrderBooks isOpen={isOrderBooksOpen} closeModal={closeContactModal} /> */}
    </>
  )
}

export default DeliveryInfo
