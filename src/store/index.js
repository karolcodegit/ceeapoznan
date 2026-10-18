// store/index.js — store Redux
// Checkout (koszyk książek) trwa w localStorage (cały slice, 1 klucz).
// Reszta slice'y (formularz kursu, kontakt, powiadomienia) bez zmian.
import { configureStore } from "@reduxjs/toolkit"
import checkoutReducer, { initialState as checkoutInitial } from "./checkout/checkoutSlice"
import contactReducer from "./contact/contactSlice"
import formRegisterReducer from "./RegisterForm/formSlice"
import notificationReducer from "./notificationBook/notificationSlice"

const isBrowser = typeof window !== "undefined"

function loadCheckout() {
  try {
    if (!isBrowser) return undefined
    const raw = localStorage.getItem("checkout")
    if (!raw) return undefined
    const saved = JSON.parse(raw)
    // merge z initialState – nowe pola dostają wartości domyślne
    return {
      ...checkoutInitial,
      ...saved,
      delivery: { ...checkoutInitial.delivery, ...saved.delivery },
      payment: { ...checkoutInitial.payment, ...saved.payment },
      prices: { ...checkoutInitial.prices, ...saved.prices },
    }
  } catch {
    return undefined
  }
}

export const store = configureStore({
  reducer: {
    checkout: checkoutReducer,
    contact: contactReducer,
    formRegister: formRegisterReducer,
    notificationBook: notificationReducer,
  },
  preloadedState: loadCheckout() ? { checkout: loadCheckout() } : undefined,
})

if (isBrowser) {
  store.subscribe(() => {
    try {
      localStorage.setItem("checkout", JSON.stringify(store.getState().checkout))
    } catch { /* quota/private mode – ignorujemy */ }
  })
}
