import React from "react"
import Title from "../Title/Title"
import DeliveryInfo from "../DeliveryInfo/DeliveryInfo"

const Book = ({
  image,
  title,
  editor,
  year,
  price,
  publisher,
  covertype,
  ean,
  available,
}) => (
  <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row py-20 border-b last-of-type:border-none">
    <div className="flex flex-col lg:flex-row max-w-4xl  md:mx-0 flex-1">
      <div className="mx-auto md:mx-0 mb-10 md:mb-0">
        <img
          className="flex-shrink object-cover lg:w-96 max-lg:w-48 h-auto"
          src={image.fluid.src}
          alt={title}
        />
      </div>
      <div className="lg:px-10 w-full dark:text-gray-200">
        <div className="flex flex-col">
          <div className="flex py-4">
            <span
              className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
                available
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {available ? "Dostępny" : "Niedostępny"}
            </span>
          </div>
          <Title tag="h4">{title}</Title>
          <div className="py-3 ">
            <span className="dark:text-gray-200">Autor:</span> <span>red. {editor}</span>
          </div>
        </div>
        <div className="flex flex-col mx-auto pt-8">
          <div className="py-1">
            <span className="font-normal text-sm pr-3">Wydawca:</span>
            <span className="font-bold">{publisher}</span>
          </div>
          <div className="py-1">
            <span className="font-normal text-sm mr-3">Rok wydania:</span>
            <span className="font-bold">{year}</span>
          </div>
          <div className="py-1">
            <span className="font-normal text-sm mr-3">Typ okładki:</span>
            <span className="font-bold">{covertype}</span>
          </div>
          <div className="py-1">
            {/* <span className="font-normal text-sm mr-3">EAN:</span>
            <span className="font-bold">{ean}</span> */}
          </div>
        </div>
      </div>
    </div>
    <DeliveryInfo price={price} />
  </div>
)

export default Book
