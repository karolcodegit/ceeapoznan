// store/checkout/checkoutSlice.js — JEDEN stan całego checkoutu książek
// Zasada: w stanie TYLKO dane. Kwoty (subtotal/dostawa/total) liczą selektory.
// Stan płaski + ścieżki "address.street" – kompatybilny z FormField/FormRadioGroup.
import { createSlice } from "@reduxjs/toolkit"

export const initialState = {
  // Produkty (image przechodzi z listy produktów przy addItem!)
  items: [], // { productId, title, price, quantity, image }

  // Dane kupującego (płaskie – FormField/formSliceKey="checkout")
  firstName: "",
  lastName: "",
  email: "",
  phone: "",

  // Dostawa (płasko – FormRadioGroup name="deliveryMethod")
  deliveryMethod: "Paczkomat",     // "Paczkomat" | "Kurier InPost"
  address: { street: "", city: "", postcode: "" },
  locker: null,                    // { name, code, address }

  // Płatność
  paymentMethod: "transfer",       // "transfer" | "tpay"

  // Cennik dostawy
  prices: {
    home: { A: 19.99, B: 20.99, C: 25.99 },
    locker: { A: 20.99, B: 23.99, C: 25.99 },
  },

  lastOrder: null, // { number, method }
}

// zapis ze ścieżką "address.street" / zwykły
function setPath(obj, path, value) {
  const keys = path.split(".")
  let cur = obj
  for (let i = 0; i < keys.length - 1; i++) {
    if (cur[keys[i]] == null) cur[keys[i]] = {}
    cur = cur[keys[i]]
  }
  cur[keys[keys.length - 1]] = value
}

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    // ── Koszyk ──
    addItem(state, { payload }) {
      const existing = state.items.find(i => i.productId === payload.productId)
      if (existing) existing.quantity += payload.quantity || 1
      else state.items.push({ quantity: 1, ...payload })
    },
    incrementQuantity(state, { payload }) {
      const item = state.items.find(i => i.productId === payload)
      if (item) item.quantity += 1
    },
    decrementQuantity(state, { payload }) {
      const item = state.items.find(i => i.productId === payload)
      if (item && item.quantity > 1) item.quantity -= 1
    },
    removeFromCart(state, { payload }) {
      state.items = state.items.filter(i => i.productId !== payload)
    },
    clearCart(state) {
      state.items = []
    },

    // ── Pola formularzy (FormField/FormRadioGroup) + ścieżki ──
    updateField(state, { payload }) {
      setPath(state, payload.field, payload.value)
    },

    setParcelLocker(state, { payload }) {
      state.locker = payload
    },

    // ── Cennik ──
    setPrices(state, { payload }) {
      if (payload.locker) state.prices.locker = payload.locker
      if (payload.home) state.prices.home = payload.home
    },

    // ── Zamówienie ──
    setLastOrder(state, { payload }) {
      state.lastOrder = payload
    },
    resetCheckout(state) {
      state.items = []
      state.deliveryMethod = initialState.deliveryMethod
      state.address = { ...initialState.address }
      state.locker = null
      state.paymentMethod = initialState.paymentMethod
      state.lastOrder = null
    },
  },
})

export const {
  addItem, incrementQuantity, decrementQuantity,
  removeFromCart, clearCart,
  updateField, setParcelLocker, setPrices,
  setLastOrder, resetCheckout,
} = checkoutSlice.actions

export default checkoutSlice.reducer
