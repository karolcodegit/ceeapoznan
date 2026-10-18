// Wysyła dane formularza kontaktowego do chmury – mail buduje i wysyła serwer
const API = process.env.GATSBY_REGISTER_ENDPOINT

export const handleContactSubmit = async (payload) => {
  const res = await fetch(`${API}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || "Nie udało się wysłać wiadomości.")
  }
  return true
}