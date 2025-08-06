import React from "react"
import Title from "../Title/Title"
import DeliveryInfo from "../DeliveryInfo/DeliveryInfo"
import { MarkdownText } from "../../utils/markdownText"

const Book = ({
  originalId,
  image,
  title,
  editor,
  year,
  price,
  publisher,
  covertype,
  // ean,
  printOnDemand,
  additionalInformation,
  available,
  reprint,
}) => {
  return (
    <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row py-10 md:py-20 border-b last-of-type:border-none">
      {/* Obrazek */}
      <div className="flex flex-col lg:flex-row flex-1 items-center md:items-start">
        <div className="mb-6 md:mb-0">
          <img
            className="object-cover rounded-lg w-48 sm:w-64 md:w-72 lg:w-96 h-auto"
            src={image.fluid.src}
            alt={title}
          />
        </div>
        {/* Informacje o produkcie */}
        <div className="lg:px-10 w-full dark:text-gray-200">
          {/* Dostępność i tytuł */}
          <div className="flex space-x-4 align-middle items-center mb-10">
            <span
              className={`self-start px-4 py-2  text-xs sm:text-sm font-semibold rounded-full ${
                available
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {available ? "Dostępny" : "Niedostępny"}
            </span>
            {reprint && (
              <span className="self-start px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-sky-900 rounded-full">
                W dodruku
              </span>
            )}

            {printOnDemand && (
              <span className="self-start px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-red-500 rounded-full">
                Na żądanie
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-4">
            <Title tag="h4" className="text-lg sm:text-xl font-semibold">
              {title}
            </Title>
            <div className="text-sm sm:text-base">
              <span className="dark:text-gray-400">Autor:</span>{" "}
              <span className="font-medium">red. {editor}</span>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t my-6"></div>

          {/* Szczegóły produktu */}
          <div className="space-y-4 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="dark:text-gray-400">Wydawca:</span>
              <span className="font-bold">{publisher}</span>
            </div>
            <div className="flex justify-between">
              <span className="dark:text-gray-400">Rok wydania:</span>
              <span className="font-bold">{year}</span>
            </div>
            <div className="flex justify-between">
              <span className="dark:text-gray-400">Typ okładki:</span>
              <span className="font-bold">{covertype}</span>
            </div>
            {/* Jeśli dodamy EAN */}
            {/* <div className="flex justify-between">
          <span className="dark:text-gray-400">EAN:</span>
          <span className="font-bold">{ean}</span>
        </div> */}
            {additionalInformation && (
              <div className="mt-6 space-y-4">
                <span className="dark:text-gray-400">
                  Dodatkowe informacje:
                </span>
                <div className="text-sm sm:text-base">
                  <MarkdownText text={additionalInformation} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Informacje o dostawie */}
      <div className="mt-8 md:mt-0 md:ml-8 flex-shrink-0">
        <DeliveryInfo price={price} available={available} title={title} originalId={originalId} image={image}/>
      </div>
    </div>
  )
}

export default Book
