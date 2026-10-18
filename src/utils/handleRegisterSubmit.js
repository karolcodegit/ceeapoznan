// src/utils/handleRegisterSubmit.js
// Wysyła TYLKO dane do /register; emaile wysyła chmura.
// Online (tpay) → redirect do bramki; Transfer → formularz-wyslany.
import { navigate } from "gatsby"

const REGISTER_ENDPOINT = process.env.GATSBY_REGISTER_ENDPOINT

export const handleRegisterSubmit = async (registerData) => {
  const orderNumber = generateOrderNumber()
  const currentPath = window.location.pathname.replace(/\/$/, "")

  // ── 1. ZAPIS (await) – 409/500 = throw, Form pokaże błąd ──
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

  if (!regRes.ok) {
    const err = await regRes.json().catch(() => ({}))
    if (regRes.status === 409) throw new Error(err.error || "Brak wolnych miejsc na tym kursie.")
    throw new Error(err.error || "Błąd zapisu rejestracji. Spróbuj ponownie.")
  }

  const json = await regRes.json()

  // ── 2. Online → przekierowanie do bramki tpay / symulatora ──
  if (json.transactionUrl) {
    window.location.href = json.transactionUrl
    return
  }

  // ── 3. Transfer → strona potwierdzenia ──
  navigate(`${currentPath}/formularz-wyslany`)
}

function generateOrderNumber() {
  const now = new Date()
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`
  return `CEEA-${ymd}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}