// src/utils/handleOrderSubmit.js — złożenie zamówienia książki
// transfer → /koszyk/wyslane | tpay → redirect do bramki
import { navigate } from "gatsby"
import { store } from "../store"
import { setLastOrder, resetCheckout } from "../store/checkout/checkoutSlice"
import {
  selectItems, selectSubtotal, selectDeliveryCost, selectTotal, selectGrandTotal,
  selectCustomer, selectDelivery, selectPaymentMethod,
} from "../store/checkout/selectors"

const API = process.env.GATSBY_REGISTER_ENDPOINT

export const handleOrderSubmit = async () => {
  const s = store.getState()
  const orderNumber = generateOrderNumber()

  // ── Normalizacja pozycji: gwarantujemy productId + qty ──
  // Stare (persystowane sprzed migracji do Supabase) pozycje mogą mieć
  // inne pola — bez tego trafiają na backend z productId = undefined
  // i stan magazynowy jest po cichu pomijany.
  const items = selectItems(s).map(i => {
    const productId = i.productId ?? i.datocmsId ?? i.datocms_id ?? null
    const qty = Number(i.quantity ?? i.qty) || 1
    if (!productId) {
      console.error("[order] POZYCJA BEZ productId – stan NIE zostanie odjęty:", i)
    }
    return { productId, title: i.title, qty, price: i.price }
  })

  const payload = {
    orderNumber,
    token: s.checkout.token,
    paymentMethod: selectPaymentMethod(s),
    ...selectCustomer(s),
    delivery: selectDelivery(s),
    items,
    costs: {
      subtotal: selectSubtotal(s),
      delivery: selectDeliveryCost(s),
      total: selectTotal(s),          // bez opłaty – chmura doliczy fee sama
    },
    amount: selectGrandTotal(s),      // ← z opłatą (dla tpay); dla transferu = total
  }

  let json
  try {
    const res = await fetch(`${API}/book-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json.error || "Błąd zapisu zamówienia. Spróbuj ponownie.")
  } catch (e) {
    console.error("[order] submit:", e)
    alert(e.message || "Błąd połączenia. Spróbuj ponownie.")
    return
  }

  store.dispatch(setLastOrder({ number: orderNumber, method: payload.paymentMethod }))

  // tpay → bramka (po powrocie: /koszyk/wyslane?metoda=tpay)
  if (json.transactionUrl) {
    window.location.href = json.transactionUrl
    return
  }

  // transfer → strona potwierdzenia
  store.dispatch(resetCheckout())
  navigate(`/koszyk/wyslane?metoda=transfer&zamowienie=${orderNumber}`)
}

function generateOrderNumber() {
  const now = new Date()
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`
  return `CEEA-${ymd}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}