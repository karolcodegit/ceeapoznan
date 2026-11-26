import React, { useEffect } from "react"
import { navigate } from "gatsby"
import { useDispatch, useSelector } from "react-redux"
import CheckoutShellV2 from "../../components/CheckoutShellV2/CheckoutShellV2"
import Form from "../../components/Form/Form"
import Button from "../../components/Button/Button"
import PaymentMethodSelector from "../../components/PaymentMethodSelector/PaymentMethodSelector"
import { updateField } from "../../store/checkout/checkoutSlice"
import {
  selectItems,
  selectSubtotal,
  selectDeliveryCost,
  selectCustomer,
  selectPaymentFee,
  selectDelivery,
  selectPaymentMethod,
  selectGrandTotal,
} from "../../store/checkout/selectors"
import { handleOrderSubmit } from "../../utils/handleOrderSubmit"
import BookCover from "../../components/Book/BookCover"
import Seo from "../../components/seo"

const TPAY_ENABLED = process.env.GATSBY_TPAY_ENABLED === "true"

const Row = ({ label, children }) => (
  <div className="flex justify-between gap-4 border-b border-slate-100 py-2 text-slate-900 last:border-0 dark:border-slate-700 dark:text-slate-100">
    <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
    <span className="text-right text-sm font-medium">{children || "—"}</span>
  </div>
)

const Podsumowanie2 = () => {
  const dispatch = useDispatch()
  const items = useSelector(selectItems)
  const customer = useSelector(selectCustomer)
  const delivery = useSelector(selectDelivery)
  const paymentMethod = useSelector(selectPaymentMethod)
  const subtotal = useSelector(selectSubtotal)
  const deliveryCost = useSelector(selectDeliveryCost)
  const fee = useSelector(selectPaymentFee)
  const grandTotal = useSelector(selectGrandTotal)

  useEffect(() => {
    dispatch(
      updateField({
        field: "token",
        value: Math.random().toString(36).substring(2),
      })
    )
  }, [dispatch])

  useEffect(() => {
    if (!TPAY_ENABLED && paymentMethod === "tpay") {
      dispatch(updateField({ field: "paymentMethod", value: "transfer" }))
    }
  }, [paymentMethod, dispatch])

  if (typeof window !== "undefined" && items.length === 0) {
    return (
      <CheckoutShellV2
        title="Podsumowanie"
        subtitle="Koszyk pusty"
        description="Dodaj książki, aby złożyć zamówienie."
        currentStep="podsumowanie"
      >
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-slate-700 dark:text-slate-300">Koszyk jest pusty.</p>
          <Button
            variant="next"
            className="mt-6"
            onClick={() => navigate("/ksiazki")}
          >
            Przeglądaj książki
          </Button>
        </div>
      </CheckoutShellV2>
    )
  }

  const handleSubmitOverride = async e => {
    e.preventDefault()
    await handleOrderSubmit({ successPath: "/koszyk/wyslane" })
  }

  return (
    <CheckoutShellV2
      title="Podsumowanie"
      subtitle="Krok 4 z 4"
      description="Sprawdź zamówienie i wybierz metodę płatności."
      currentStep="podsumowanie"
    >
      <div className="flex flex-col items-start gap-8 xl:flex-row">
        <div className="w-full flex-1">
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
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h2 className="pb-4 text-lg font-bold text-[#002C7C] dark:text-sky-300">
                Produkty
              </h2>
              {items.map(i => (
                <div
                  key={i.productId}
                  className="flex gap-4 border-b border-slate-100 py-3 last:border-0 dark:border-slate-700"
                >
                  {i.image && (
                    <BookCover
                      src={i.image}
                      alt={i.title}
                      className="h-18 w-12 shrink-0 rounded-md object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="leading-snug font-medium text-slate-900 dark:text-slate-100">
                      {i.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Ilość: {i.quantity}
                    </p>
                  </div>
                  <p className="whitespace-nowrap font-semibold text-slate-900 dark:text-slate-100">
                    {(i.price * i.quantity).toFixed(2)} zł
                  </p>
                </div>
              ))}
            </section>

            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h2 className="pb-2 text-lg font-bold text-[#002C7C] dark:text-sky-300">
                Dane i dostawa
              </h2>
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

            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
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

        <aside className="w-full rounded-3xl border border-slate-200 bg-[#F7F4EF] p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 xl:sticky xl:top-24 xl:w-96">
          <h2 className="pb-4 text-lg font-bold text-[#002C7C] dark:text-sky-300">
            Podsumowanie
          </h2>
          <Row label="Produkty">{subtotal.toFixed(2)} zł</Row>
          <Row label="Dostawa">{deliveryCost.toFixed(2)} zł</Row>
          {fee > 0 && (
            <Row label="Opłata obsługi płatności online">
              {fee.toFixed(2)} zł
            </Row>
          )}
          <div className="mt-2 flex justify-between border-t border-slate-300 pt-4 dark:border-slate-600">
            <span className="font-semibold">Razem</span>
            <span className="font-bold">{grandTotal.toFixed(2)} zł</span>
          </div>
          <Button
            variant="back"
            className="mt-6 w-full"
            onClick={() => navigate("/koszyk/dostawa")}
          >
            Wstecz do dostawy
          </Button>
        </aside>
      </div>
    </CheckoutShellV2>
  )
}

export const Head = () => <Seo title="Koszyk — podsumowanie" />
export default Podsumowanie2
