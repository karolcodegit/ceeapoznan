import React, { useRef, useState } from "react"
import {
  ClockIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline"
import Button from "../Button/Button"
import DeliveryModal from "../Modal/DeliveryModal"
import { Tooltip } from "react-tooltip"
import { slugify } from "../../utils/slugify"
import Form from "../Form/Form"
import { saveAirableNotificationBook } from "../../utils/airtable-notificationBook"
import { useDispatch } from "react-redux"
import { addToCart } from "../../store/cart/cartSlice"
import Title from "../Title/Title"

const DeliveryShop = ({
  price,
  title,
  className,
  originalId,
}) => {
  const dispatch = useDispatch()

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: originalId,
        title: title,
        price: price,
        quantity: 1, // domyślnie 1 sztuka
      })
    )
  }

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

  const formRef = useRef(null)
  const initialFormState = {
    email: "",
    title: title,
  }
  const [form, setForm] = useState(initialFormState)

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }
  return (
    <>
      <div
        className={`${className} xl:sticky xl:top-20 xl:right-0 xl:max-h-[calc(100vh-15vh)] overflow-y-auto  mt-10 md:mt-0 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow-lg flex flex-col self-start  w-96 mx-auto overflow-hidden z-10`}
      >
        <div className="leading-5">
          <div className="p-7 divide-y divide-gray-200">
            <div className="flex justify-between pt-1 pb-3">
              <Title tag="h4">Podsumowanie</Title>
            </div>
            <div className="p-1 pt-4">
              <section className="py-4">
                <div className="flex justify-between">
                  <div>
                    <span>Wartość produktów</span></div>
                  <div>
                    <span>{price} zł</span>
                  </div>
                </div>
                <section className="py-4">
                  <div className="flex justify-between">
                    <div>
                        <span>Koszt dostawy</span></div>
                    <div>
                      <span>16.99 zł</span>
                    </div>
                  </div>
                </section>
              </section>
            </div>
            <div className="p-1 pt-2">
              <section className="py-4">
                <div className="flex justify-between">
                  <div>
                    <span className="font-bold text-xl">Razem</span></div>
                  <div>
                    <span className="text-2xl font-bold">{price} zł</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeliveryShop
