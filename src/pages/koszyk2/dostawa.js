import React, { useRef } from "react"
import { navigate } from "gatsby"
import { useSelector } from "react-redux"
import ParcelLockerMap from "../../ParcelLockerMap/ParcelMockerMap"
import CheckoutShellV2 from "../../components/CheckoutShellV2/CheckoutShellV2"
import Form from "../../components/Form/Form"
import FormField from "../../components/Form/FormField/FormField"
import FormRadioGroup from "../../components/Form/FormRadioGroup/FormRadioGroup"
import Button from "../../components/Button/Button"
import Seo from "../../components/seo"

const Dostawa2 = () => {
  const formRef = useRef()
  const deliveryMethod = useSelector(s => s.checkout.deliveryMethod)

  const handleNext = () => formRef.current?.submitForm()

  return (
    <CheckoutShellV2
      title="Dostawa"
      subtitle="Krok 3 z 4"
      description="Wybierz paczkomat InPost albo dostawę kurierem."
      currentStep="dostawa"
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
        <h2 className="pb-5 text-xl font-bold text-[#002C7C] dark:text-sky-300">
          Wybierz metodę dostawy
        </h2>

        <Form
          ref={formRef}
          formSliceKey="checkout"
          notificationMessage="Dane dostawy zapisane!"
          isStepForm
          onSuccess={() => navigate("/koszyk2/podsumowanie")}
          dynamicRequiredFields={() => {
            if (deliveryMethod === "Kurier InPost")
              return [
                "deliveryMethod",
                "address.street",
                "address.city",
                "address.postcode",
              ]
            if (deliveryMethod === "Paczkomat")
              return ["deliveryMethod", "locker.code"]
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

          {deliveryMethod === "Paczkomat" && <ParcelLockerMap />}
        </Form>

        <div className="mt-6 flex justify-between">
          <Button variant="back" onClick={() => navigate("/koszyk2/dane")}>
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

export const Head = () => <Seo title="Koszyk — dostawa — wariant 2" />
export default Dostawa2
