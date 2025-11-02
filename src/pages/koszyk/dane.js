import React, { useRef } from "react"
import { navigate } from "gatsby"
// import CheckoutProgress from "../../components/CheckoutProgress/CheckoutProgress"
import Form from "../../components/Form/Form"
import FormField from "../../components/Form/FormField/FormField"
import Title from "../../components/Title/Title"
import Button from "../../components/Button/Button"
import CheckoutProgress from "../../components/CheckoutProgress/CheckoutProgress"

const Dane = () => {
  const formRef = useRef()

  const handleNext = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    } else {
      console.error("formRef.current is null. Upewnij się, że ref jest poprawnie przypisany.");
    }
  };
  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md transition-colors duration-300">
      <CheckoutProgress currentStep="dane" />
          <Title tag="h4" className="pt-3 pb-5">
            Dane do wysyłki
          </Title>

          <Form
            ref={formRef}
            notificationMessage="Dane zostały zapisane!"
            formSliceKey="userCart"
            requiredFields={["firstName", "lastName", "email", "phone"]}
            isStepForm={true}
            id="step-form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
            onSuccess={() => {
              navigate("/koszyk/dostawa");
            }}
          >
            <FormField
              label="Imię"
              type="text"
              name="firstName"
              required
              formSliceKey="userCart"
            />
            <FormField
              label="Nazwisko"
              type="text"
              name="lastName"
              required
              formSliceKey="userCart"
            />
            <FormField
              label="E-mail"
              type="email"
              name="email"
              required
              formSliceKey="userCart"
            />
            <FormField
              label="Telefon"
              type="tel"
              name="phone"
              required
              formSliceKey="userCart"
            />
          </Form>
          <div className="flex justify-between mt-6">
            <Button variant='back' onClick={() => navigate("/koszyk")} type="button">Wstecz</Button>
            <Button
              type="button"
              variant='next'
              onClick={() => {
                handleNext();
              }}
              // className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Przejdź dalej
            </Button>
          </div>
      </div>
    </>
  )
}

export default Dane
