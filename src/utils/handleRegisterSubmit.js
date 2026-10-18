// src/utils/handleRegisterSubmit.js
import { navigate } from "gatsby"

const REGISTER_ENDPOINT = process.env.GATSBY_REGISTER_ENDPOINT

export const handleRegisterSubmit = async (registerData) => {
  const orderNumber = generateOrderNumber()
  const currentPath = window.location.pathname.replace(/\/$/, "")
  console.log("[REGISTER] endpoint:", REGISTER_ENDPOINT, "| path:", currentPath)

  try {
    const regRes = await fetch(REGISTER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber,
        email: registerData.email,
        firstName: registerData.firstName,
        surName: registerData.surName,
        phone: registerData.phone ? String(registerData.phone) : null,
        courseId: registerData.courseId,
        courseTitle: registerData.courseTitle,
        baseAmount: registerData.baseAmount,
        paymentMethod: registerData.paymentMethod || "transfer",
        payload: registerData,
      }),
    })

    console.log("[REGISTER] status:", regRes.status)
    const json = await regRes.json().catch(() => ({}))
    console.log("[REGISTER] response:", json)

    if (!regRes.ok) {
      throw new Error(
        json.error ||
          (regRes.status === 409
            ? "Brak wolnych miejsc na tym kursie."
            : "Błąd zapisu rejestracji. Spróbuj ponownie.")
      )
    }

    if (json.transactionUrl) {
      window.location.href = json.transactionUrl
      return
    }

    const target = `${currentPath}/formularz-wyslany`
    console.log("[REGISTER] navigate →", target)
    navigate(target)
  } catch (err) {
    console.error("[REGISTER] BŁĄD:", err)
    alert("Błąd wysyłki: " + (err.message || err))
    throw err   // ← Form dostał błąd, nie czyść formularza jako sukces
  }
}

function generateOrderNumber() {
  const now = new Date()
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`
  return `CEEA-${ymd}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}