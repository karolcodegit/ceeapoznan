import React, { useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { navigate } from "gatsby"
import CheckoutShellV2 from "../../components/CheckoutShellV2/CheckoutShellV2"
import Form from "../../components/Form/Form"
import FormField from "../../components/Form/FormField/FormField"
import Button from "../../components/Button/Button"
import { updateField } from "../../store/checkout/checkoutSlice"
import { selectWantInvoice } from "../../store/checkout/selectors"
import Seo from "../../components/seo"

const BASE_REQUIRED = ["firstName", "lastName", "email", "phone"]

const Dane2 = () => {
  const formRef = useRef()
  const dispatch = useDispatch()
  const wantInvoice = useSelector(selectWantInvoice)

  const requiredFields = wantInvoice
    ? [...BASE_REQUIRED, "invoiceNip"]
    : BASE_REQUIRED

  const handleNext = () => formRef.current?.submitForm()

  return (
    <CheckoutShellV2
      title="Dane do wysyłki"
      subtitle="Krok 2 z 4"
      description="Podaj dane kontaktowe — fakturę VAT możesz dodać opcjonalnie."
      currentStep="dane"
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
        <h2 className="pb-5 text-xl font-bold text-[#002C7C] dark:text-sky-300">
          Dane do wysyłki
        </h2>

        <Form
          ref={formRef}
          formSliceKey="checkout"
          notificationMessage="Dane zostały zapisane!"
          requiredFields={requiredFields}
          isStepForm
          onSuccess={() => navigate("/koszyk2/dostawa")}
        >
          <FormField
            label="Imię"
            type="text"
            name="firstName"
            required
            formSliceKey="checkout"
          />
          <FormField
            label="Nazwisko"
            type="text"
            name="lastName"
            required
            formSliceKey="checkout"
          />
          <FormField
            label="E-mail"
            type="email"
            name="email"
            required
            formSliceKey="checkout"
          />
          <FormField
            label="Telefon"
            type="tel"
            name="phone"
            required
            formSliceKey="checkout"
          />

          <label className="mt-4 flex cursor-pointer select-none items-center gap-3 text-slate-800 dark:text-slate-200">
            <input
              type="checkbox"
              checked={wantInvoice}
              onChange={e =>
                dispatch(
                  updateField({
                    field: "wantInvoice",
                    value: e.target.checked,
                  })
                )
              }
              className="h-5 w-5 rounded accent-[#0C6478]"
            />
            <span>Potrzebuję faktury VAT</span>
          </label>

          {wantInvoice && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-[#F7F4EF] p-4 sm:p-6 dark:border-slate-600 dark:bg-slate-950">
              <h3 className="pb-4 text-lg font-semibold text-[#002C7C] dark:text-sky-300">
                Dane do faktury
              </h3>
              <FormField
                label="Nazwa firmy/imię i nazwisko"
                type="text"
                name="invoiceName"
                formSliceKey="checkout"
              />
              <FormField
                label="Ulica"
                type="text"
                name="invoiceStreet"
                formSliceKey="checkout"
              />
              <FormField
                label="Numer domu"
                type="text"
                name="invoiceNumberHome"
                formSliceKey="checkout"
              />
              <FormField
                label="Kod pocztowy"
                type="text"
                name="invoicePostcode"
                formSliceKey="checkout"
              />
              <FormField
                label="Miasto"
                type="text"
                name="invoiceCity"
                formSliceKey="checkout"
              />
              <FormField
                label="NIP"
                type="text"
                name="invoiceNip"
                required
                formSliceKey="checkout"
              />
            </div>
          )}
        </Form>

        <div className="mt-6 flex justify-between">
          <Button variant="back" onClick={() => navigate("/koszyk2")}>
            Wstecz
          </Button>
          <Button variant="next" onClick={handleNext}>
            Przejdź dalej
          </Button>
        </div>
      </div>
    </CheckoutShellV2>
  )
}

export const Head = () => <Seo title="Koszyk — dane — wariant 2" />
export default Dane2
