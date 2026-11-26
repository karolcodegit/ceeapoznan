import React, { useEffect, useId, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  ChevronDownIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline"
import DeliveryModal from "../Modal/DeliveryModal"
import { addItem } from "../../store/checkout/checkoutSlice"
import { toast } from "sonner"
import Form from "../Form/Form"
import FormField from "../Form/FormField/FormField"
import { handleNotificationSubmit } from "../../utils/handlerNotificationSubmit"
import { updateBookInfo } from "../../store/notificationBook/notificationSlice"
import { selectBookById } from "../../store/notificationBook/notificationBook"

const API_ENDPOINT =
  "https://notificationbook-559160331745.us-central1.run.app"

const DeliveryInfo = ({
  price,
  available,
  title,
  className = "",
  originalId,
  image,
}) => {
  const dispatch = useDispatch()
  const formData = useSelector(state => selectBookById(state, originalId))
  const formRef = useRef(null)
  const panelId = useId()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    dispatch(
      updateBookInfo({
        id: originalId,
        bookInfo: { title, price, image },
      })
    )
  }, [title, originalId, price, image, dispatch])

  const handleAddToCart = () => {
    dispatch(
      addItem({
        productId: originalId,
        title,
        price,
        image: image?.fluid?.src || image?.url || image || null,
        quantity: 1,
      })
    )
    toast.success("Dodano do koszyka")
  }

  const handleSubmitOverride = async e => {
    e.preventDefault()
    const localFormData = { email: formData?.email || "" }
    const bookInfo = { title, originalId, price, image }
    await handleNotificationSubmit(
      localFormData,
      bookInfo,
      API_ENDPOINT,
      dispatch
    )
  }

  const priceBlock = (
    <div className="min-w-0">
      <p className="whitespace-nowrap text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300 sm:text-sm">
        Nasza cena
      </p>
      <p className="mt-1 whitespace-nowrap text-3xl font-black leading-none tracking-tight text-[#0C6478] dark:text-sky-300 sm:text-4xl">
        {price}
        <span className="ml-1 text-xl font-extrabold text-[#002C7C] dark:text-sky-200 sm:text-2xl">
          zł
        </span>
      </p>
      <p className="mt-1.5 whitespace-nowrap text-sm font-medium text-slate-500 dark:text-slate-400">
        + koszty przesyłki
      </p>
    </div>
  )

  const shippingButton = (
    <button
      type="button"
      onClick={() => setIsModalOpen(true)}
      className="inline-flex min-h-11 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-[#002C7C] transition hover:border-[#0C6478]/40 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317] dark:border-slate-600 dark:bg-slate-900 dark:text-sky-200 dark:hover:bg-slate-800"
    >
      <CurrencyDollarIcon
        className="h-5 w-5 shrink-0 text-[#0C6478] dark:text-sky-400"
        aria-hidden="true"
      />
      <span>Sprawdź koszt dostawy</span>
    </button>
  )

  const notifyForm = (
    <div className="space-y-3">
      <p className="text-sm leading-snug text-slate-600 dark:text-slate-300">
        Podaj e-mail, a damy znać, gdy książka wróci do sprzedaży.
      </p>
      <Form
        ref={formRef}
        submitButtonText="Powiadom mnie"
        formSliceKey="notificationBook"
        notificationMessage="Formularz został wysłany!"
        requiredFields={[]}
        apiEndpoint={API_ENDPOINT}
        onSubmitOverride={handleSubmitOverride}
        variant="notify"
        addToButton="mt-2"
        padding="py-3"
        className="flex w-full flex-col"
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
  )

  const addToCartButton = (
    <button
      type="button"
      onClick={handleAddToCart}
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#002C7C] px-4 text-sm font-bold text-white transition hover:bg-[#0C6478] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317] dark:bg-sky-600 dark:hover:bg-sky-500"
    >
      <ShoppingCartIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
      Do koszyka
    </button>
  )

  const notifyToggle = (
    <button
      type="button"
      aria-expanded={detailsOpen}
      aria-controls={panelId}
      onClick={() => setDetailsOpen(open => !open)}
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E8A317] to-[#d4890f] px-4 text-sm font-bold text-white transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C6478]"
    >
      {detailsOpen ? "Zwiń" : "Powiadom mnie"}
      <ChevronDownIcon
        className={`h-4 w-4 transition ${detailsOpen ? "rotate-180" : ""}`}
        aria-hidden="true"
      />
    </button>
  )

  return (
    <>
      <div className={`${className} w-full max-w-sm md:sticky md:top-24`}>
        {/* Mobile / tablet (< md): cena → CTA poniżej → dostawa rozwijana */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 md:hidden">
          <div className="space-y-3 p-3.5">
            {priceBlock}
            {available ? addToCartButton : notifyToggle}
            {available && (
              <button
                type="button"
                aria-expanded={detailsOpen}
                aria-controls={panelId}
                onClick={() => setDetailsOpen(open => !open)}
                className="inline-flex min-h-10 w-full items-center justify-center gap-1 rounded-full border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C6478] dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Dostawa
                <ChevronDownIcon
                  className={`h-4 w-4 transition ${
                    detailsOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
            )}
          </div>

          <div
            id={panelId}
            hidden={!detailsOpen}
            className="border-t border-slate-200 px-3.5 pb-3.5 pt-3 dark:border-slate-700"
          >
            <div className="space-y-3">
              {shippingButton}
              {!available && notifyForm}
              {available && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Dostawa paczkomatem lub kurierem InPost.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Desktop (md+): cena → CTA poniżej → dostawa zawsze widoczna */}
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 md:block">
          <div className="space-y-4 border-b border-slate-100 px-4 py-5 dark:border-slate-700">
            {priceBlock}
            {available ? addToCartButton : null}
          </div>
          <div className="space-y-3 p-4">
            {shippingButton}
            {available ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dostawa paczkomatem lub kurierem InPost.
              </p>
            ) : (
              notifyForm
            )}
          </div>
        </div>
      </div>

      <DeliveryModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default DeliveryInfo
