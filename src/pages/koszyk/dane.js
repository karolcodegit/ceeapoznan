import React, { useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { navigate } from "gatsby"
import CheckoutProgress from "../../components/CheckoutProgress/CheckoutProgress"
import Form from "../../components/Form/Form"
import FormField from "../../components/Form/FormField/FormField"
import Title from "../../components/Title/Title"
import Button from "../../components/Button/Button"
import { updateField } from "../../store/checkout/checkoutSlice"
import { selectWantInvoice } from "../../store/checkout/selectors"

// Pola wymagane zawsze; NIP dołącza tylko gdy użytkownik chce fakturę
const BASE_REQUIRED = ["firstName", "lastName", "email", "phone"]

const Dane = () => {
  const formRef = useRef()
  const dispatch = useDispatch()
  const wantInvoice = useSelector(selectWantInvoice)

  const requiredFields = wantInvoice
    ? [...BASE_REQUIRED, "invoiceNip"]
    : BASE_REQUIRED

  const handleNext = () => formRef.current?.submitForm()

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <CheckoutProgress currentStep="dane" />
      <div className="mt-4 bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 transition-colors">
        <Title tag="h4" className="pb-5 text-gray-900 dark:text-gray-100">Dane do wysyłki</Title>

        <Form
          ref={formRef}
          formSliceKey="checkout"
          notificationMessage="Dane zostały zapisane!"
          requiredFields={requiredFields}
          isStepForm
          onSuccess={() => navigate("/koszyk/dostawa")}
        >
          <FormField label="Imię" type="text" name="firstName" required formSliceKey="checkout" />
          <FormField label="Nazwisko" type="text" name="lastName" required formSliceKey="checkout" />
          <FormField label="E-mail" type="email" name="email" required formSliceKey="checkout" />
          <FormField label="Telefon" type="tel" name="phone" required formSliceKey="checkout" />

          {/* Checkbox jak przy rejestracji na kurs — chowa/pokazuje pola faktury */}
          <label className="mt-4 flex items-center gap-3 cursor-pointer select-none text-gray-800 dark:text-gray-200">
            <input
              type="checkbox"
              checked={wantInvoice}
              onChange={e =>
                dispatch(updateField({ field: "wantInvoice", value: e.target.checked }))
              }
              className="w-5 h-5 rounded accent-green-600"
            />
            <span>Potrzebuję faktury VAT</span>
          </label>

          {wantInvoice && (
            <div className="mt-6 rounded-2xl border border-gray-200 dark:border-slate-600 p-4 sm:p-6">
              <Title tag="h5" className="pb-4 text-gray-900 dark:text-gray-100">Dane do faktury</Title>

              <FormField label="Nazwa firmy/imię i nazwisko" type="text" name="invoiceName" formSliceKey="checkout" />
              <FormField label="Ulica" type="text" name="invoiceStreet" formSliceKey="checkout" />
              <FormField label="Numer domu" type="text" name="invoiceNumberHome" formSliceKey="checkout" />
              <FormField label="Kod pocztowy" type="text" name="invoicePostcode" formSliceKey="checkout" />
              <FormField label="Miasto" type="text" name="invoiceCity" formSliceKey="checkout" />
              <FormField label="NIP" type="text" name="invoiceNip" required formSliceKey="checkout" />
            </div>
          )}
        </Form>

        <div className="flex justify-between mt-6">
          <Button variant="back" onClick={() => navigate("/koszyk")}>Wstecz</Button>
          <Button variant="next" onClick={handleNext}>Przejdź dalej</Button>
        </div>
      </div>
    </div>
  )
}

export default Dane