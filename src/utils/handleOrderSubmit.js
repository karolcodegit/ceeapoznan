import { toast } from "react-toastify";
import { generateOrderNumber } from "../utils/generateOrderNumber";
import { clearOrder, setOrderNumber, setSubmittedAt } from "../store/order/orderSlice";
import { renderEmailTemplate } from "./renderEmailTemplate"; // Import funkcji do generowania e-maili
import { clearCart } from "../store/cart/cartSlice";
import { saveAirableBookOrders } from "./Airtable/bookOrders";



export const handleOrderSubmit = async (orderData, apiEndpoint, dispatch, navigate) => {
  try {
    // Generowanie numeru zamówienia i daty złożenia
    const orderNumber = generateOrderNumber();
    const submittedAt = new Date().toISOString();

    // Aktualizacja Redux
    dispatch(setOrderNumber(orderNumber));
    dispatch(setSubmittedAt(submittedAt));

    // Natychmiastowe przekierowanie użytkownika
    navigate("/koszyk/wyslane");

    // Przygotowanie danych do wysyłki
    const fullOrderData = {
      ...orderData,
      orderNumber,
      submittedAt,
    };

    // Operacje w tle
    const performBackgroundTasks = async () => {
      try {
        // Zapis zamówienia w Airtable
        await saveAirableBookOrders(fullOrderData);

        // Generowanie treści e-maili za pomocą szablonów
        const emailHtmlToYou = renderEmailTemplate("orderConfirmation", {
          firstName: orderData.customer.firstName,
          lastName: orderData.customer.lastName,
          orderNumber,
          totalPrice: orderData.summary.total,
          items: orderData.items,
          deliveryCost: orderData.summary.deliveryCost,
          total: orderData.summary.total,
          deliveryMethod: orderData.delivery.method,
        });
        const emailHtmlToUser = renderEmailTemplate("orderConfirmationUser", {
          firstName: orderData.customer.firstName,
          lastName: orderData.customer.lastName,
          email: orderData.customer.email,
          phone: orderData.customer.phone,
          orderNumber,
          deliveryMethod: orderData.delivery.method,
          addressHomeParcel: orderData.delivery,
          items: orderData.items,
          deliveryCost: orderData.summary.deliveryCost,
          total: orderData.summary.total,
        });

        // Przygotowanie payload do wysyłki do Google Cloud Functions
        const payload = {
          toYou: {
            to: "sekretariat@ceea.org.pl",
            subject: `Nowa wiadomość od ${orderData.customer.firstName} ${orderData.customer.lastName}`,
            html: emailHtmlToYou,
          },
          toUser: {
            to: orderData.customer.email,
            subject: "Dziękujemy za przesłanie formularza",
            html: emailHtmlToUser,
          },
        };

        console.log("📦 Payload wysyłany do Google Cloud Functions:", payload);

        // Wysłanie zamówienia do API
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Błąd odpowiedzi z Google Cloud Functions:", errorText);
          throw new Error(`HTTP status: ${response.status}`);
        }

        console.log("✅ E-maile zostały wysłane.");
        toast.success("Zamówienie zostało pomyślnie złożone!");

        // Usunięcie danych zamówienia i koszyka
        dispatch(clearOrder());
        dispatch(clearCart());
      } catch (error) {
        console.error("❌ Błąd podczas operacji w tle:", error);
        toast.error("Wystąpił błąd podczas przetwarzania zamówienia w tle.");
      }
    };

    // Uruchomienie operacji w tle
    performBackgroundTasks();
  } catch (error) {
    console.error("❌ Błąd podczas składania zamówienia:", error);
    toast.error("Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.");
  }
};