import { toast } from "react-toastify"
import { clearForm } from "../store/contact/contactSlice"
import { renderEmailTemplate } from "./renderEmailTemplate"

export const handleContactSubmit = async (
  contactData,
  apiEndpoint,
  dispatch,
  navigate,
  token
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

    // ✅ UWAGA: Dodajemy token do payloadu!
    const payload = {
      name: contactData.name,
      email: contactData.email,
      message: contactData.message,
      token,
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

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Błąd odpowiedzi z Google Cloud Functions:", errorText)
      throw new Error(`HTTP status: ${response.status}`)
    }

    toast.success("Formularz pomyślnie wysłany!")
    dispatch(clearForm())
    if (navigate) navigate("/kontakt/wyslano")
  } catch (error) {
    console.error("❌ Błąd podczas wysyłania formularza:", error)
    toast.error("Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.")
  }
}
