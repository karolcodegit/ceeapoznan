// Zapis na listę oczekujących -> chmura: book_notifications + mail z layoutu
import { toast } from "sonner"
import { clearForm } from "../store/notificationBook/notificationSlice"

const API = process.env.GATSBY_REGISTER_ENDPOINT

export const handleNotificationSubmit = async (formData, bookInfo, _apiEndpoint, dispatch) => {
  try {
    const res = await fetch(`${API}/book-notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        productId: bookInfo.originalId,
        title: bookInfo.title,
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || "Błąd zapisu powiadomienia.")
    }
    toast.success("Zapisaliśmy Cię na listę oczekujących!")
    dispatch(clearForm())
  } catch (error) {
    console.error("handleNotificationSubmit:", error)
    toast.error("Wystąpił błąd. Spróbuj ponownie.")
  }
}