import { toast } from "react-toastify"

import { renderEmailTemplate } from "./renderEmailTemplate"
import { saveAirableNotificationBook } from "./airtable-notificationBook";
import { clearForm } from "../store/notificationBook/notificationSlice";


export const handleNotificationSubmit = async (
    formData, 
    bookInfo,
    apiEndpoint,
    dispatch
) => {
  try {

const payloadData = {
    email: formData.email,
    bookTitle: bookInfo.title,
    bookId: bookInfo.originalId,
    price: bookInfo.price,
  };


    // Generowanie treści e-maili za pomocą szablonów
    // const emailHtmlToYou = renderEmailTemplate("ContactConfirmation", {

    //     bookTitle: bookInfo.title,
    // })
    const emailHtmlToUser = renderEmailTemplate("ContactConfirmationUser", {
        bookTitle: bookInfo.title,
    })

    // Przygotowanie payload do wysyłki do Google Cloud Functions
    const payload = {
      toUser: {
        to: formData.email,
        subject: "Dziękujemy za zainteresowanie książką!",
        html: emailHtmlToUser,
      },
    }

    //console.log("Payload wysyłany do Google Cloud Functions:", payload);
    await saveAirableNotificationBook(payloadData);
    // Wysłanie zamówienia do API
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Błąd odpowiedzi z Google Cloud Functions:", errorText)
      throw new Error(`HTTP status: ${response.status}`)
    }

    // Sukces: przekierowanie na stronę sukcesu
    toast.success("Formularz pomyślnie wysłany!")
    dispatch(clearForm()) // Usunięcie danych koszyka
  } catch (error) {
    console.error("Błąd podczas wysyłania zamówienia:", error)
    toast.error("Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.")
  }
}
