import React from "react"
import { navigate } from "gatsby"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import CheckoutProgress from "../../components/CheckoutProgress/CheckoutProgress"
import Title from "../../components/Title/Title"
import Form from "../../components/Form/Form"
import Button from "../../components/Button/Button"
import PaymentMethodSelector from "../../components/PaymentMethodSelector/PaymentMethodSelector"
import { updateField } from "../../store/checkout/checkoutSlice"
import {
  selectItems,
  selectSubtotal,
  selectDeliveryCost,
  selectTotal,
  selectCustomer,
  selectPaymentFee,
  selectDelivery,
  selectPaymentMethod,
  selectGrandTotal,
} from "../../store/checkout/selectors"
import { handleOrderSubmit } from "../../utils/handleOrderSubmit"
import BookCover from "../../components/Book/BookCover"

const TPAY_ENABLED = process.env.GATSBY_TPAY_ENABLED === "true"

const Row = ({ label, children }) => (
  <div className="flex justify-between gap-4 border-b border-gray-100 dark:border-slate-700 last:border-0 py-2 text-gray-900 dark:text-gray-100">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-sm font-medium text-right">{children || "—"}</span>
  </div>
)

const Podsumowanie = () => {
  const dispatch = useDispatch()
  const items = useSelector(selectItems)
  const customer = useSelector(selectCustomer)
  const delivery = useSelector(selectDelivery)
  const paymentMethod = useSelector(selectPaymentMethod)
  const subtotal = useSelector(selectSubtotal)
  const deliveryCost = useSelector(selectDeliveryCost)
  const fee = useSelector(selectPaymentFee)
  const grandTotal = useSelector(selectGrandTotal)

  // w komponencie, obok innych selektorów:
  useEffect(() => {
    dispatch(
      updateField({
        field: "token",
        value: Math.random().toString(36).substring(2),
      })
    )
  }, [dispatch])

  // tpay wyłączone (do aktywacji konta) – wymuszamy przelew
  useEffect(() => {
    if (!TPAY_ENABLED && paymentMethod === "tpay") {
      dispatch(updateField({ field: "paymentMethod", value: "transfer" }))
    }
  }, [TPAY_ENABLED, paymentMethod, dispatch])

  if (typeof window !== "undefined" && items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <p className="text-gray-700 dark:text-gray-300">Koszyk jest pusty.</p>
        <Button
          variant="next"
          className="mt-6"
          onClick={() => navigate("/sklep")}
        >
          Przeglądaj książki
        </Button>
      </div>
    )
  }

  const handleSubmitOverride = async e => {
    e.preventDefault()
    await handleOrderSubmit()
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <CheckoutProgress currentStep="podsumowanie" />
      <div className="mt-4 flex flex-col xl:flex-row gap-8 items-start">
        <div className="flex-1 w-full">
          <Title tag="h4" className="pb-6 text-gray-900 dark:text-gray-100">
            Podsumowanie zamówienia
          </Title>

          <Form
            formSliceKey="checkout"
            submitButtonText={
              TPAY_ENABLED && paymentMethod === "tpay"
                ? "Opłać i złóż zamówienie"
                : "Złóż zamówienie"
            }
            paymentMethods
            variant="submit"
            notificationMessage="Zamówienie złożone!"
            requiredFields={["paymentMethod"]}
            onSubmitOverride={handleSubmitOverride}
            addToButton="float-right"
          >
            {/* Produkty */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 transition-colors">
              <Title tag="h5" className="pb-4">
                Produkty
              </Title>
              {items.map(i => (
                <div
                  key={i.productId}
                  className="flex gap-4 py-3 border-b border-gray-100 dark:border-slate-700 last:border-0"
                >
                  {i.image && (
                    <BookCover
                      src={i.image}
                      alt={i.title}
                      className="w-12 h-18 object-cover rounded-md shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 leading-snug">
                      {i.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Ilość: {i.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    {(i.price * i.quantity).toFixed(2)} zł
                  </p>
                </div>
              ))}
            </section>

            {/* Dane + dostawa */}
            <section className="mt-6 bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 transition-colors">
              <Title tag="h5" className="pb-2">
                Dane i dostawa
              </Title>
              <Row label="Imię i nazwisko">
                {customer.firstName} {customer.lastName}
              </Row>
              <Row label="Email">{customer.email}</Row>
              <Row label="Telefon">{customer.phone}</Row>
              <Row label="Dostawa">
                {delivery.method === "paczkomat"
                  ? "Paczkomat InPost"
                  : "Kurier InPost"}
              </Row>
              {delivery.method === "paczkomat" && delivery.locker && (
                <>
                  <Row label="Paczkomat">
                    {delivery.locker.name} ({delivery.locker.code})
                  </Row>
                  <Row label="Adres paczkomatu">
                    {delivery.locker.address?.street}{" "}
                    {delivery.locker.address?.building_number},{" "}
                    {delivery.locker.address?.post_code}{" "}
                    {delivery.locker.address?.city}
                  </Row>
                </>
              )}
              {delivery.method === "courier" && (
                <Row label="Adres">
                  {delivery.address?.street}, {delivery.address?.postcode}{" "}
                  {delivery.address?.city}
                </Row>
              )}
            </section>

            {/* Płatność – ten sam komponent co w zapisie na kurs */}
            <section className="mt-6 bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 transition-colors">
              <PaymentMethodSelector
                name="paymentMethod"
                value={paymentMethod}
                onChange={e =>
                  dispatch(
                    updateField({
                      field: "paymentMethod",
                      value: e.target.value,
                    })
                  )
                }
              />
            </section>
          </Form>
        </div>

        {/* Sticky podsumowanie kosztów */}
        <aside className="xl:sticky xl:top-20 w-full xl:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 transition-colors">
          <Title tag="h5" className="pb-4">
            Podsumowanie
          </Title>
          <Row label="Produkty">{subtotal.toFixed(2)} zł</Row>
          <Row label="Dostawa">{deliveryCost.toFixed(2)} zł</Row>
          {fee > 0 && (
            <Row label="Opłata obsługi płatności online">
              {fee.toFixed(2)} zł
            </Row>
          )}
          <div className="flex justify-between pt-4 mt-2 border-t ...">
            <span>Razem</span>
            <span>{grandTotal.toFixed(2)} zł</span>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Podsumowanie
