// shared/payment.js – TEN SAM plik w src/utils/ i backend/shared/
// Jedno źródło prawdy dla opłat płatności online.
//
// UWAGA: tpay NIE udostępnia API z aktualną taryfą prowizji. Formuła poniżej
// (2% + 1 zł) zawsze pokrywa taryfę Starter (1,59% + 0,41 zł BLIK) i rośnie
// wraz z ceną kursu – nie trzeba ręcznie sprawdzać cennika.
// Weryfikacja rzeczywistych kosztów: panel tpay -> raporty (kolumny
// "commission %", "flat commission", "commission taken").
//
// Jeśli tpay zmieni cennik, wystarczy poprawić współczynniki tutaj.

export const FEE_PERCENT = 0.02 // 2% kwoty
export const FEE_FLAT = 1.0     // + 1 zł stałe

// Opłata obsługi płatności online dla danej kwoty (zaokrąglona w górę do 0,10 zł)
export const getPaymentFee = (amount, paymentMethod) => {
  if (paymentMethod !== "tpay") return 0
  const fee = Number(amount || 0) * FEE_PERCENT + FEE_FLAT
  return Math.ceil(fee * 10) / 10
}

// Formatowanie kwoty po polsku: 1208.99 -> "1 208,99"
export const formatMoney = amount => {
  const num = Number(amount) || 0
  return num
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}