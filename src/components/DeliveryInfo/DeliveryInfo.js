import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Tooltip } from "react-tooltip"
import {
  ClockIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline"
import Button from "../Button/Button"
import DeliveryModal from "../Modal/DeliveryModal"
// import { slugify } from "../../utils/slugify"
import { addToCart, calculateSummary } from "../../store/cart/cartSlice"
import { toast } from "sonner"
import Form from "../Form/Form"
import FormField from "../Form/FormField/FormField"
import { handleNotificationSubmit } from "../../utils/handlerNotificationSubmit"
import { updateBookInfo } from "../../store/notificationBook/notificationSlice"
import { selectBookById } from "../../store/notificationBook/notificationBook"; // Import selektora



const DeliveryInfo = ({
  price,
  available,
  title,
  className,
  originalId,
  image,
}) => {
  const dispatch = useDispatch()


  const formData = useSelector((state) => selectBookById(state, originalId));



  // const formData = useSelector((state) => state.notificationBook.books[originalId] || {}); // Pobierz dane dla konkretnej książki

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: originalId,
        title,
        price,
        image,
        quantity: 1,
      })
    )
    // dispatch(calculateSummary())
    toast.success("Dodano do koszyka")
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

  const apiEndpoint =
    "https://notificationbook-559160331745.us-central1.run.app"
    
    useEffect(() => {
      dispatch(updateBookInfo({ id: originalId, bookInfo: { title, price, image } })); // Zapisz dane książki w Redux
    }, [title, originalId, price, image, dispatch]);

    const handleSubmitOverride = async (e) => {
      e.preventDefault();
      const localFormData = {
        email: formData.email || "",
      };
    
      const bookInfo = {
        title,
        originalId,
        price,
        image,
      };
      await handleNotificationSubmit(localFormData, bookInfo,  apiEndpoint, dispatch);
    };
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
            className="font-normal text-sm pl-4 cursor-pointer"
          >
            Sprawdź koszt dostawy
          </span>
        </div>
        {available ? (
          <Button
            onClick={handleAddToCart}
            className="font-normal text-sm pl-4"
            variant='default'
            margines='mt-0'
          >
            <div className="flex items-center px-1 py-2 gap-4 text-gray-50 rounded-md">
              <ShoppingCartIcon
                className="h-6 w-6 flex-shrink-0"
                aria-hidden="true"
              />
              <span>Dodaj do koszyka</span>
            </div>
          </Button>
        ) : (
          <>
            <div className="border-t flex flex-col items-center gap-4 py-5 px-8 mx-auto w-full max-w-[280px] justify-center">
              <span className="text-gray-700 font-medium text-center text-sm dark:text-gray-200">
                Podaj swój e-mail, aby otrzymać powiadomienie o dostępności:
              </span>
              <Form
                ref={formRef}
                submitButtonText="Powiadom mnie"
                formSliceKey="notificationBook"
                notificationMessage="Formularz został wysłany!"
                requiredFields={[]}
                apiEndpoint={apiEndpoint}
                onSubmitOverride={handleSubmitOverride} 
                variant="notify"
                addToButton='mt-3'
                padding="py-3"
                className="flex flex-col items-center w-full"
                // tooltip={[
                //   'Jeśli planujesz zamówić więcej niż 3 egzemplarze,',
                //   'skontaktuj się z nami pod adresem:',
                //   'sekretariat@ceea.org.pl'
                // ]}
                // tooltipId="button-more-books"
              >
                <FormField
                  type="email"
                  name="email"
                  formSliceKey="notificationBook"
                  placeholder="Twój e-mail"
                  id={originalId}
                  margin='mt-0'
                />
              </Form>
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
