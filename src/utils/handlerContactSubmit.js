import { toast } from "react-toastify"
import { clearForm } from "../store/contact/contactSlice"
import { renderEmailTemplate } from "./renderEmailTemplate"


export const handleContactSubmit = async (
  contactData,
  apiEndpoint,
  dispatch,
  navigate,
) => {
  try {

    // Generowanie treści e-maili za pomocą szablonów
    const emailHtmlToYou = renderEmailTemplate("ContactConfirmation", {
        name: contactData.name,
        email: contactData.email,
        message: contactData.message,
    })
    const emailHtmlToUser = renderEmailTemplate("ContactConfirmationUser", {
      name: contactData.name,
      email: contactData.email,
      message: contactData.message,
    })

    // Przygotowanie payload do wysyłki do Google Cloud Functions
    const payload = {
      toYou: {
        to: "sekretariat@ceea.org.pl",
        subject: `Nowa wiadomość od ${contactData.name}`,
        html: emailHtmlToYou,
      },
      toUser: {
        to: contactData.email,
        subject: "Dziękujemy za przesłanie formularza",
        html: emailHtmlToUser,
      },
    }

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
    navigate("/kontakt/wyslano")
  } catch (error) {
    console.error("Błąd podczas wysyłania zamówienia:", error)
    toast.error("Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.")
  }
}
