import React, {useState, useEffect} from "react"
import Modal from "./Modal"
import paczkomat from "../../assets/images/Paczkomat.svg"
import logoinpost from "../../assets/images/inpostlogo.svg"
import domek from "../../assets/images/Dom.svg"
import axios from "axios"
const { XMLParser } = require("fast-xml-parser")

const DeliveryModal = ({ isOpen, closeModal}) => {
    
    const [deliveryCost, setDeliveryCost] = useState(null);

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
            
          })
          .catch(error => {
            console.log("Error fetching data:", error)
          })
      }

      useEffect(() => {
        if (isOpen) {
          fetchDeliveryCost();
        }
      }, [isOpen]);

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
  <div className="px-2">
    <img alt="Logo inpost" src={logoinpost} className="w-20 pt-8 pb-4" />
    {deliveryCost && deliveryCost.length > 0 ? (
      deliveryCost.map((service, index) => (
        <div key={index} className="mb-5 flex pb-3 pl-10">
          <div className="flex items-center pr-4 mb-2 md:mb-0">
            <img alt="Inpost paczkomat" src={paczkomat} />
          </div>
          <div>
            {service.packTypes.map((pack, packIndex) => (
              <p key={packIndex} className="pl-2 text-gray-500">
                Typ {pack.type}: <span className="font-bold pl-1">{pack.price} zł</span>
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
  )
}

export default DeliveryModal
