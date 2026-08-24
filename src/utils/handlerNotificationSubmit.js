import { toast } from "react-toastify"

import { renderEmailTemplate } from "./renderEmailTemplate"
import { saveAirableNotificationBook } from "./airtable-notificationBook";
import { clearForm } from "../store/notificationBook/notificationSlice";
import { BookNotificationUserText } from "../utils/emails/notification/NotificationConfirmationUser"


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


    const emailHtmlToUser = renderEmailTemplate("bookNotificationUser", {
      title_book: bookInfo.title,
    })
    
    const emailTextToUser = BookNotificationUserText({
      title_book: bookInfo.title,
    })
    

    // Przygotowanie payload do wysyłki do Google Cloud Functions
    const payload = {
      toUser: {
        to: formData.email,
        subject: `Zapisaliśmy Cię na listę oczekujących – "${formData.title_book}"`,
        html: emailHtmlToUser,
        text: emailTextToUser, // ← BookNotificationUserText({ title_book: formData.title_book })
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
