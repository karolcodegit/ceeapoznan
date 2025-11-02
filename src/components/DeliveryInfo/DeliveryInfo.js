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
  className={`${className} mt-10 md:mt-0 
    bg-sky-50 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-700 
    dark:text-gray-100 rounded-2xl shadow-xl 
    flex flex-col self-start w-full md:w-auto max-w-xs md:max-w-full 
    mx-auto overflow-hidden z-10 transition-all duration-300`}
>
  {/* Sekcja nagłówka */}
  <div className="py-8 px-6 md:text-center 
    bg-white dark:bg-gradient-to-b dark:from-slate-700 dark:to-slate-800 
    border-b border-gray-200 dark:border-slate-600">
    <span className="font-bold text-lg text-gray-800 dark:text-gray-300">
      Nasza cena:
    </span>
    <span className="font-bold text-4xl text-darkBlueGreen dark:text-[#7fa8db] ml-2">
      {price} zł
    </span>
    <div>
      <span className="font-bold text-sm text-darkBlueGreen dark:text-[#7fa8db] ml-2 flex justify-end">
        + koszty przesyłki
      </span>
    </div>
  </div>

  {/* Sekcja kosztów dostawy */}
  <div className="border-t border-gray-200 dark:border-slate-700 
    p-5 flex items-center 
    hover:bg-gray-100 dark:hover:bg-slate-700/70 
    transition duration-300 bg-white dark:bg-slate-800/60">
    <CurrencyDollarIcon
      className="h-6 w-6 text-gray-800 dark:text-gray-400 flex-shrink-0"
      aria-hidden="true"
    />
    <span
      onClick={openModal}
      className="font-normal text-sm pl-4 cursor-pointer hover:text-darkBlueGreen dark:hover:text-[#9ebae4] transition-colors"
    >
      Sprawdź koszt dostawy
    </span>
  </div>

  {/* Sekcja przycisku lub formularza */}
  {available ? (
    <Button
      onClick={handleAddToCart}
      className="font-normal text-sm pl-4 mt-1"
      variant="default"
      margines="mt-0"
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
      <div className="border-t border-gray-200 dark:border-slate-700 
        flex flex-col items-center gap-4 py-5 px-8 mx-auto 
        w-full max-w-[280px] justify-center bg-white dark:bg-slate-800/50">
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
          addToButton="mt-3"
          padding="py-3"
          className="flex flex-col items-center w-full"
        >
          <FormField
            type="email"
            name="email"
            formSliceKey="notificationBook"
            placeholder="Twój e-mail"
            id={originalId}
            margin="mt-0"
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
