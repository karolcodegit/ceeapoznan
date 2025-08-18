import { useState, useEffect } from "react"
import axios from "axios"
import { XMLParser } from "fast-xml-parser"

const usePaczkomatPrices = () => {
  const [deliveryCost, setDeliveryCost] = useState([])

  useEffect(() => {
    const fetchDeliveryCost = () => {
      axios
        .get("https://api.paczkomaty.pl/?do=pricelist")
        .then(response => {
          const parser = new XMLParser()
          const result = parser.parse(response.data)
          const services = result.paczkomaty.service

          const costs = services
            .filter(service => service.serviceName === "STANDARD")
            .map(service => ({
              courier: service.serviceName,
              packTypes: service.packType.map(pack => {
                const price = typeof pack.price === "string" ? pack.price.replace(",", ".") : pack.price;
                return {
                  type: pack.type,
                  price: parseFloat(price),
                };
              }),
            }));
          console.log("Pobrane ceny paczkomatów:", costs)
          setDeliveryCost(costs[0]?.packTypes || [])
        })
        .catch(error => {
          console.error("Błąd pobierania cen:", error)
          setDeliveryCost([
            { type: "A", price: 20.99 },
            { type: "B", price: 23.99 },
            { type: "C", price: 25.99 },
          ])
        })
    }

    fetchDeliveryCost()
  }, [])

  return deliveryCost
}

export default usePaczkomatPrices