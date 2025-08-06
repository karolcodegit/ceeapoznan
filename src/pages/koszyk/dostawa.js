import React, { useRef } from "react"
import { navigate } from "gatsby"
import { useDispatch, useSelector } from "react-redux"
import ParcelLockerMap from "../../ParcelLockerMap/ParcelMockerMap"
import CheckoutProgress from "../../components/CheckoutProgress/CheckoutProgress"
import Title from "../../components/Title/Title"
import Form from "../../components/Form/Form"
import {
  updateDeliveryField,
} from "../../store/delivery/deliverySlice"
import FormField from "../../components/Form/FormField/FormField"
import FormRadioGroup from "../../components/Form/FormRadioGroup/FormRadioGroup"
import Button from "../../components/Button/Button"
import { updateDeliveryCost } from "../../store/cart/cartSlice"


const Dostawa = () => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const {
    deliveryMethod = "Kurier InPost",
    address = {},
    parcelLocker = null,
  } = useSelector((state) => state.delivery) || {};


  const { summary } = useSelector((state) => state.cart);

  const lockerDeliveryCost = summary.lockerDeliveryCost;
  const homeDeliveryCost = summary.homeDeliveryCost;

  

  const handleDeliveryMethodChange = (deliveryMethod) => {
    console.log("Selected delivery method:", deliveryMethod);

    // Zaktualizuj metodę dostawy w deliverySlice
    dispatch(updateDeliveryField({ field: "deliveryMethod", value: deliveryMethod }));

    // Wywołaj akcję w deliverySlice, aby zaktualizować deliveryCost
    dispatch(updateDeliveryCost({ deliveryMethod, lockerDeliveryCost, homeDeliveryCost }));
  };

  const handleNext = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      )
    } else {
      console.error(
        "formRef.current is null. Upewnij się, że ref jest poprawnie przekazany."
      )
    }
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <CheckoutProgress currentStep="dostawa" />
        <Title tag="h4" className="pt-3 pb-5">
          Wybierz metodę dostawy
        </Title>

        <Form
          ref={formRef}
          formSliceKey="delivery"
          notificationMessage="Dane dostawy zostały zapisane!"
          isStepForm={true}
          // requiredFields={["address.street", "address.city", "address.postcode", "deliveryMethod"]}
          onSuccess={() => navigate("/koszyk/podsumowanie")}
          dynamicRequiredFields={(state) => {
            const { deliveryMethod } = state.delivery;
            if (deliveryMethod === "Kurier InPost") {
              return ["deliveryMethod", "address.street", "address.city", "address.postcode"];
            }
            if (deliveryMethod === "Paczkomat") {
              return ["deliveryMethod", "parcelLocker.name"];
            }
            return [];
          }}
        >
          <FormRadioGroup
            name="deliveryMethod"
            label="Wybierz metodę dostawy"
            options={["Kurier InPost", "Paczkomat"]}
            required={true}
            formSliceKey="delivery"
            className="mb-4"
            onChange={(method) => handleDeliveryMethodChange(method)}
          />

          {deliveryMethod === "Kurier InPost" && (
            <>
              <FormField
                label="Ulica"
                type="text"
                name="address.street"
                value={address.street}
                required
                formSliceKey="delivery"
                onChangeAction={({ field, value }) => {
                  dispatch(updateDeliveryField({ field, value }));
                }}
              />

              <FormField
                label="Miasto"
                type="text"
                name="address.city"
                value={address.city}
                required
                formSliceKey="delivery"
                onChangeAction={({ field, value }) => {
                  dispatch(updateDeliveryField({ field, value }));
                }}
              />

              <FormField
                label="Kod pocztowy"
                type="text"
                name="address.postcode"
                value={address.postcode}
                required
                formSliceKey="delivery"
                onChangeAction={({ field, value }) => {
                  dispatch(updateDeliveryField({ field, value }));
                }}
              />
            </>
          )}

          {deliveryMethod === "Paczkomat" && (
              <>
                <ParcelLockerMap />
                {parcelLocker && (
                  <div className="flex flex-col gap-5 border p-5 rounded-lg shadow-md my-6">
                    <Title tag="h4">Wybrany paczkomat:</Title>
                    <p>
                      <strong>Nazwa paczkomatu:</strong> {parcelLocker.name}
                    </p>
                    <p>
                      <strong>Adres:</strong> {parcelLocker.address.street}{" "}
                      {parcelLocker.address.building_number},{" "}
                      {parcelLocker.address.city},{" "}
                      {parcelLocker.address.post_code}
                    </p>
                  </div>
                )}
              </>
            )}
        </Form>
        <div className="flex justify-between mt-6">
          <Button variant='back' onClick={() => navigate("/koszyk/dane")}>Wstecz</Button>
          <Button
            type="button"
            variant='next'
            onClick={handleNext}

          >
            Przejdź dalej
          </Button>
        </div>
      </div>
    </>
  )
}

export default Dostawa
