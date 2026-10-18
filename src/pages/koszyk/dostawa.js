import React, { useRef } from "react"
import { navigate } from "gatsby"
import { useDispatch, useSelector } from "react-redux"
import ParcelLockerMap from "../../ParcelLockerMap/ParcelMockerMap"
import CheckoutProgress from "../../components/CheckoutProgress/CheckoutProgress"
import Title from "../../components/Title/Title"
import Form from "../../components/Form/Form"
import FormField from "../../components/Form/FormField/FormField"
import FormRadioGroup from "../../components/Form/FormRadioGroup/FormRadioGroup"
import Button from "../../components/Button/Button"
import { setParcelLocker } from "../../store/checkout/checkoutSlice"

const Dostawa = () => {
  const dispatch = useDispatch()
  const formRef = useRef()
  const deliveryMethod = useSelector(s => s.checkout.deliveryMethod)
  const locker = useSelector(s => s.checkout.locker)

  const handleNext = () => formRef.current?.submitForm()

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <CheckoutProgress currentStep="dostawa" />
      <div className="mt-4 bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 transition-colors">
        <Title tag="h4" className="pb-5 text-gray-900 dark:text-gray-100">
          Wybierz metodę dostawy
        </Title>

        <Form
          ref={formRef}
          formSliceKey="checkout"
          notificationMessage="Dane dostawy zapisane!"
          isStepForm
          onSuccess={() => navigate("/koszyk/podsumowanie")}
          dynamicRequiredFields={() => {
            if (deliveryMethod === "Kurier InPost")
              return [
                "deliveryMethod",
                "address.street",
                "address.city",
                "address.postcode",
              ]
            if (deliveryMethod === "Paczkomat")
              return ["deliveryMethod", "locker.code"] // ← było "locker"
            return []
          }}
        >
          <FormRadioGroup
            name="deliveryMethod"
            label="Metoda dostawy"
            options={["Paczkomat", "Kurier InPost"]}
            required
            formSliceKey="checkout"
          />

          {deliveryMethod === "Kurier InPost" && (
            <>
              <FormField
                label="Ulica"
                type="text"
                name="address.street"
                required
                formSliceKey="checkout"
              />
              <FormField
                label="Kod pocztowy"
                type="text"
                name="address.postcode"
                required
                formSliceKey="checkout"
              />
              <FormField
                label="Miasto"
                type="text"
                name="address.city"
                required
                formSliceKey="checkout"
              />
            </>
          )}

          {deliveryMethod === "Paczkomat" && (
            <>
              <ParcelLockerMap />
            
            </>
          )}
        </Form>

        <div className="flex justify-between mt-6">
          <Button variant="back" onClick={() => navigate("/koszyk/dane")}>
            Wstecz
          </Button>
          <Button variant="next" onClick={handleNext}>
            Przejdź dalej
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Dostawa
