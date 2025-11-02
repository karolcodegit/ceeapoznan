import React from "react"
import { navigate } from "gatsby"
import { useDispatch, useSelector } from "react-redux"
import CheckoutProgress from "../../components/CheckoutProgress/CheckoutProgress"
import Title from "../../components/Title/Title"
import Form from "../../components/Form/Form"
import { prepareOrderData } from "../../utils/prepareOrderData"
import Button from "../../components/Button/Button"
import { handleOrderSubmit } from "../../utils/handleOrderSubmit"


const Podsumowanie = ({
  apiEndpoint = "https://order-books-cart-559160331745.us-central1.run.app",
}) => {
  const dispatch = useDispatch();
  const orderData = useSelector(prepareOrderData)

  const summary = useSelector((state) => state.cart.summary); // Pobierz dane podsumowania z Redux

  console.log("Order Data:", orderData);




  // Ten warunek można zostawić, ale **po hookach**
  if (typeof window === "undefined") {
    return null // albo <div>Ładowanie...</div>
  }
  if (!orderData?.items?.length) {
    return <div>Brak książki w koszyku. Nie można kontynuować zamówienia.</div>
  }

  const handleSubmitOverride = async (e) => {
    e.preventDefault();
    await handleOrderSubmit(orderData, apiEndpoint, dispatch, navigate);
  };
  return (
    <>
      <div className="mt-3">
  <CheckoutProgress currentStep="podsumowanie" />
  <div className="max-w-6xl mx-auto p-6 flex flex-col xl:flex-row gap-8">
    {/* Lewa kolumna: postęp i podsumowanie zamówienia */}
    <div className="flex-1 w-full">
      <Title tag="h4" className="pt-6 pb-10 text-gray-900 dark:text-gray-100">
        Podsumowanie zamówienia
      </Title>
      <Form
        apiEndpoint={apiEndpoint}
        formSliceKey="order"
        submitButtonText="Złóż zamówienie"
        variant="submit"
        showSubmit={true}
        notificationMessage="Formularz został wysłany!"
        requiredFields={[]}
        onSubmitOverride={handleSubmitOverride}
        addToButton="float-right"
      >
        {orderData.items && orderData.items.length > 0 ? (
          <div className="space-y-4 p-4 pt-6 border rounded bg-white dark:bg-gray-900 transition-colors duration-300">
            <Title tag="h5" className="text-gray-900 dark:text-gray-100">Produkty</Title>
            {orderData.items.map(({ id, title, price, quantity }) => (
              <div
                key={id}
                className="flex justify-between items-start gap-8 border-b last:border-none pb-2 text-gray-900 dark:text-gray-100"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold break-words">{title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ilość: {quantity}
                  </p>
                </div>
                <div className="font-medium whitespace-nowrap">
                  {(price * quantity).toFixed(2)} zł
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">Brak produktów w koszyku.</p>
        )}

        {/* Dane do dostawy */}
        <div className="mt-10 p-4 border rounded bg-white dark:bg-gray-900 transition-colors duration-300">
          <Title tag="h5" className="text-gray-900 dark:text-gray-100">Dane do dostawy</Title>
          <div className="space-y-4 pt-6">
            {[
              { label: "Imię", value: orderData.customer.firstName },
              { label: "Nazwisko", value: orderData.customer.lastName },
              { label: "E-mail", value: orderData.customer.email },
              { label: "Telefon", value: orderData.customer.phone },
            ].map((field, idx) => (
              <div key={idx} className="flex justify-between border-b last:border-none pb-2 text-gray-900 dark:text-gray-100">
                <div>
                  <p className="font-semibold">{field.label}:</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{field.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metoda dostawy */}
        <div className="mt-6 p-4 border rounded bg-white dark:bg-gray-900 transition-colors duration-300">
          <Title tag="h5" className="text-gray-900 dark:text-gray-100">Metoda dostawy</Title>
          <div className="space-y-4 pt-6 text-gray-900 dark:text-gray-100">
            <div className="flex justify-between border-b last:border-none pb-2">
              <div>
                <p className="font-semibold">Sposób dostawy:</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {orderData.delivery.method === "Paczkomat" ? "Paczkomat" : "Kurier InPost"}
                </p>
              </div>
            </div>

            {orderData.delivery.method === "Paczkomat" && orderData.delivery.lockerCode ? (
              <>
                <div className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-semibold">ID paczkomatu:</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {orderData.delivery.lockerCode || "—"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between pb-2">
                  <div>
                    <p className="font-semibold">Adres paczkomatu:</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {[
                        orderData.delivery.parcelLocker.address?.street,
                        orderData.delivery.parcelLocker.address?.building_number,
                      ].filter(Boolean).join(" ")}
                      ,{" "}
                      {[
                        orderData.delivery.parcelLocker.address?.post_code,
                        orderData.delivery.parcelLocker.address?.city,
                      ].filter(Boolean).join(" ")}
                    </p>
                  </div>
                </div>
              </>
            ) : orderData.delivery.address ? (
              <>
                {["Ulica", "Kod pocztowy", "Miasto"].map((label, idx) => {
                  const value = label === "Ulica" ? orderData.delivery.address.street
                    : label === "Kod pocztowy" ? orderData.delivery.address.postcode
                    : orderData.delivery.address.city;
                  return (
                    <div key={idx} className="flex justify-between border-b last:border-none pb-2">
                      <div>
                        <p className="font-semibold">{label}:</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{value}</p>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <p className="text-gray-700 dark:text-gray-400">Brak adresu dostawy</p>
            )}
          </div>
        </div>

        <Button variant="back" className="my-6" onClick={() => navigate("/koszyk/dostawa")}>
          Wstecz
        </Button>
      </Form>
    </div>

    {/* Prawa kolumna: widget podsumowania */}
    <aside className="xl:sticky xl:top-20 mt-14 xl:self-start w-full xl:w-96 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow-lg overflow-hidden z-10 transition-colors duration-300">
      <div className="p-7 divide-y divide-gray-300 dark:divide-gray-700 leading-5">
        <div className="flex justify-between pb-3">
          <Title tag="h4" className="text-gray-900 dark:text-gray-100">Podsumowanie</Title>
        </div>
        <div className="py-4 space-y-4 text-gray-900 dark:text-gray-100">
          <div className="flex justify-between">
            <span>Wartość produktów</span>
            <span>{summary.subtotal?.toFixed(2)} zł</span>
          </div>
          <div className="flex justify-between">
            <span>Dostawa:</span>
            <span>{summary.deliveryCost?.toFixed(2)} zł</span>
          </div>
        </div>
        <div className="py-4 pt-6 flex justify-between border-t border-gray-300 dark:border-gray-700">
          <span className="font-bold text-xl">Razem</span>
          <span className="text-2xl font-bold">{orderData.summary.total?.toFixed(2)} zł</span>
        </div>
      </div>
    </aside>
  </div>
</div>
    </>
  )
}

export default Podsumowanie
