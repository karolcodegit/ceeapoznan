import React, { useRef } from "react"
import { navigate } from "gatsby"
import CheckoutProgress from "../../components/CheckoutProgress/CheckoutProgress"
import Form from "../../components/Form/Form"
import FormField from "../../components/Form/FormField/FormField"
import Title from "../../components/Title/Title"
import Button from "../../components/Button/Button"

const Dane = () => {
  const formRef = useRef()

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
          requiredFields={["firstName", "lastName", "email", "phone"]}
          isStepForm
          onSuccess={() => navigate("/koszyk/dostawa")}
        >
          <FormField label="Imię" type="text" name="firstName" required formSliceKey="checkout" />
          <FormField label="Nazwisko" type="text" name="lastName" required formSliceKey="checkout" />
          <FormField label="E-mail" type="email" name="email" required formSliceKey="checkout" />
          <FormField label="Telefon" type="tel" name="phone" required formSliceKey="checkout" />
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
