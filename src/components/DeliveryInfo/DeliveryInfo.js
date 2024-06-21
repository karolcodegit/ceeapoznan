import React, { useState } from "react"
import { ClockIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline"
import Modal from "../Modal/Modal"
import Button from "../Button/Button"
import axios from "axios"
import Title from "../Title/Title"
import paczkomat from "../../assets/images/Paczkomat.svg"
import logoinpost from "../../assets/images/inpostlogo.svg"
import domek from "../../assets/images/Dom.svg"
const { XMLParser } = require("fast-xml-parser")

const DeliveryInfo = ({ price }) => {
  const [deliveryCost, setDeliveryCost] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const fetchDeliveryCost = () => {
    axios
      .get("https://api.paczkomaty.pl/?do=pricelist")

      .then(response => {
        const parser = new XMLParser()
        const result = parser.parse(response.data)
        const services = result.paczkomaty.service
        const costs = services
          .filter(service => ["STANDARD"].includes(service.serviceName))
          .map(service => ({
            courier: service.serviceName,
            packTypes: service.packType.map(pack => ({
              type: pack.type,
              price: pack.price,
            })),
          }))
        setDeliveryCost(costs)
        setIsModalOpen(true)
      })
      .catch(error => {
        console.log("Error fetching data:", error)
      })
  }

  return (
    <>
      <div className="mt-10 md:mt-0 bg-gray-100 rounded-md flex flex-col self-start w-full md:w-auto flex-shrink-0 max-w-xs md:max-w-full mx-auto">
        <div className="p-5 md:text-center">
          <span className="font-normal text-sm pr-3">Nasza cena: </span>
          <span className="font-bold text-3xl text-[#3a506b]">{price} zł</span>
        </div>
        <div className="border-t p-5 flex items-center">
          <ClockIcon className="h-6 w-6" aria-hidden="true" />
          <span className="font-normal text-sm pl-4">Wysyłamy w 24h</span>
        </div>
        <div className="border-t p-5 flex items-center">
          <CurrencyDollarIcon className="h-6 w-6" aria-hidden="true" />
          <Button
            onClick={fetchDeliveryCost}
            className="font-normal text-sm pl-4"
          >
            Sprawdź koszt dostawy
          </Button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <div className="px-2">
          {/* <Title tag="h4" className="text-center text-lg font-bold mb-4">
            Koszt dostawy:
          </Title> */}
          <img
            alt="Logo inpost"
            src={logoinpost}
            className="w-20 pt-8 pb-4"
          />
          {deliveryCost && deliveryCost.length > 0 ? (
            deliveryCost.map((service, index) => (
              <div
                key={index}
                className="mb-5 flex pb-3 pl-10"
              >
                <div className="flex items-center pr-4 mb-2 md:mb-0">
                  <img alt="Inpost paczkomat" src={paczkomat} />
                </div>
                <div>
                  {service.packTypes.map((pack, packIndex) => (
                    <p key={packIndex} className="pl-2 text-gray-500">
                      Typ {pack.type}:{" "}
                      <span className="font-bold pl-1">{pack.price} zł</span>
                    </p>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Ładowanie danych...</p>
          )}
          <div className="border border-gray-500 w-full h-[1px] my-4"></div>
          <div className="my-5 flex pl-10">
            <div className="flex items-center pr-4 mb-2 md:mb-0">
              <img alt="Inpost domek" src={domek} />
            </div>
            <div>
              <p className="pl-2 text-gray-500">
                Typ A: <span className="font-bold pl-1">19,99 zł</span>
              </p>
              <p className="pl-2 text-gray-500">
                Typ B: <span className="font-bold pl-1">20,99 zł</span>
              </p>
              <p className="pl-2 text-gray-500">
                Typ C: <span className="font-bold pl-1">25,99 zł</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default DeliveryInfo
