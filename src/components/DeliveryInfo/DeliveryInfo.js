import React, { useRef, useState } from "react"
import {
  ClockIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline"
import Button from "../Button/Button"
import DeliveryModal from "../Modal/DeliveryModal"
import { Tooltip } from "react-tooltip"
import { slugify } from "../../../utils/slugify"
import Form from "../Form/Form"
import { saveAirableNotificationBook } from "../../../utils/airtable-notificationBook"

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

  const formRef = useRef(null)
  const initialFormState = {
    email: "",
    title: title
  }
  const [form, setForm] = useState(initialFormState)
  const allFields = [
    {
      name: "email",
      type: "email",
      typ: "input",
      required: "true",
      placeholder: "E-mail",
    },
  ]

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }
  const successMessage = "Zamówienie zostało złożone"
  const apiEndpoint =
    "https://us-central1-ceea-poznan-426120.cloudfunctions.net/sengrid-notificationBook"

    console.log("Dostępność książki (available):", available);
    
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
          <div>
          <span className="font-bold text-sm text-darkBlueGreen dark:text-[#6b91c0] ml-2 flex justify-end">
           + koszty przesyłki
          </span>
          </div>
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
          <>
            <div className="border-t flex flex-col items-center gap-4 py-5 px-8 mx-auto w-full max-w-[280px] justify-center">
              <span className="text-gray-700 font-medium text-center text-sm dark:text-gray-200">
                Podaj swój e-mail, aby otrzymać powiadomienie o dostępności:
              </span>
              <Form
                allFields={allFields}
                buttonText="Powiadom mnie"
                handleChange={handleChange}
                form={form}
                setForm={setForm}
                initialFormState={initialFormState}
                formRef={formRef}
                maxLength={2000}
                isRegisterForm={true}
                saveToAirtable={saveAirableNotificationBook}
                successMessage={successMessage}
                apiEndpoint={apiEndpoint}
                noSpace
                DeliveryInfoButton
                tooltip={[
                  'Jeśli planujesz zamówić więcej niż 3 egzemplarze,',
                  'skontaktuj się z nami pod adresem:',
                  'sekretariat@ceea.org.pl'
                ]}
                tooltipId="button-more-books"
              />
            </div>
          </>
        )}
      </div>

      <DeliveryModal isOpen={isModalOpen} closeModal={closeModal} />
      {/* <OrderBooks isOpen={isOrderBooksOpen} closeModal={closeContactModal} /> */}
    </>
  )
}

export default DeliveryInfo
