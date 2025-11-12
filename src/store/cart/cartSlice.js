// store/cart/cartSlice.js
import { createSlice } from "@reduxjs/toolkit"
import { getParcelSize, getDeliveryCost } from "../../constants/shippingCosts"

const initialState = {
  items: [],
  summary: {
    deliveryCost: 0,
    lockerDeliveryCost: 0,
    homeDeliveryCost: 0,
    total: 0,
    subtotal: 0,
    parcelSize: "A",
    token: "",
  },
  deliveryPrices: {
    A: 20.99,
    B: 23.99,
    C: 25.99,
  },
  lockerPrices: {
    A: 16.99,
    B: 18.99,
    C: 20.99,
  },
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload

      if (!Array.isArray(state.items)) {
        state.items = []
      }

      const existing = state.items.find(item => item.id === newItem.id)
      if (existing) {
        existing.quantity += newItem.quantity
      } else {
        state.items.push({ ...newItem })
      }

      const newSubtotal = state.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      )
      cartSlice.caseReducers.updateSubtotal(state, { payload: newSubtotal })
      cartSlice.caseReducers.calculateDeliveryCosts(state)
    },
    removeFromCart(state, action) {
      const id = action.payload

      if (!Array.isArray(state.items)) {
        state.items = []
      }

      state.items = state.items.filter(item => item.id !== id)

      const newSubtotal = state.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      )
      cartSlice.caseReducers.updateSubtotal(state, { payload: newSubtotal })
      cartSlice.caseReducers.updateTotal(state)
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)
      if (item) {
        item.quantity = quantity
      }

      // Wywołaj obliczenie kosztów dostawy
      cartSlice.caseReducers.calculateDeliveryCosts(state)
      cartSlice.caseReducers.updateTotal(state)

      // Aktualizuj koszt dostawy na podstawie metody dostawy
      const deliveryMethod = state.deliveryMethod || "Kurier InPost"
      const lockerDeliveryCost = state.summary.lockerDeliveryCost || 0
      const homeDeliveryCost = state.summary.homeDeliveryCost || 0

      cartSlice.caseReducers.updateDeliveryCost(state, {
        payload: { deliveryMethod, lockerDeliveryCost, homeDeliveryCost },
      })
    },
    incrementQuantity(state, action) {
      const id = action.payload
      const item = state.items.find(item => item.id === id)
      if (item) {
        item.quantity += 1
      }
      // Wywołaj obliczenie kosztów dostawy
      cartSlice.caseReducers.calculateDeliveryCosts(state)
      cartSlice.caseReducers.updateTotal(state)

      // Aktualizuj koszt dostawy na podstawie metody dostawy
      const deliveryMethod = state.deliveryMethod || "Kurier InPost"
      const lockerDeliveryCost = state.summary.lockerDeliveryCost || 0
      const homeDeliveryCost = state.summary.homeDeliveryCost || 0

      cartSlice.caseReducers.updateDeliveryCost(state, {
        payload: { deliveryMethod, lockerDeliveryCost, homeDeliveryCost },
      })
    },
    decrementQuantity(state, action) {
      const id = action.payload
      const item = state.items.find(item => item.id === id)
      if (item && item.quantity > 1) {
        item.quantity -= 1
      }
      // Wywołaj obliczenie kosztów dostawy
      cartSlice.caseReducers.calculateDeliveryCosts(state)
      cartSlice.caseReducers.updateTotal(state)

      // Aktualizuj koszt dostawy na podstawie metody dostawy
      const deliveryMethod = state.deliveryMethod || "Kurier InPost"
      const lockerDeliveryCost = state.summary.lockerDeliveryCost || 0
      const homeDeliveryCost = state.summary.homeDeliveryCost || 0

      cartSlice.caseReducers.updateDeliveryCost(state, {
        payload: { deliveryMethod, lockerDeliveryCost, homeDeliveryCost },
      })
    },
    clearCart(state) {
      state.items = []
      state.summary.subtotal = 0 // Zresetuj subtotal
      state.summary.total = 0 // Zresetuj total
    },
    setLockerPrices(state, action) {
      state.lockerPrices = action.payload

      // Automatyczne przeliczenie kosztów dostawy po aktualizacji lockerPrices
      const totalItems = state.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      )
      const parcelSize = getParcelSize(totalItems)

      const lockerPricesArray = Object.entries(state.lockerPrices).map(
        ([type, price]) => ({
          type,
          price,
        })
      )

      const lockerPrice = getDeliveryCost(
        "Paczkomat",
        parcelSize,
        lockerPricesArray,
        state.deliveryPrices
      )
      const homePrice = getDeliveryCost(
        "Kurier InPost",
        parcelSize,
        lockerPricesArray,
        state.deliveryPrices
      )

      state.summary.parcelSize = parcelSize
      state.summary.lockerDeliveryCost = lockerPrice
      state.summary.homeDeliveryCost = homePrice

    },
    updateSubtotal(state, action) {
      if (action.payload !== undefined) {
        state.summary.subtotal = action.payload
        cartSlice.caseReducers.updateTotal(state)
      } else {
        //console.error("updateSubtotal: action.payload is undefined")
      }
    },

    updateDeliveryCost: (state, action) => {
      const { deliveryMethod, lockerDeliveryCost, homeDeliveryCost } =
        action.payload

      // Przypisz odpowiednią wartość do deliveryCost w obiekcie summary
      state.summary.deliveryCost =
        deliveryMethod === "Paczkomat" ? lockerDeliveryCost : homeDeliveryCost
      cartSlice.caseReducers.updateTotal(state)
    },

    setDeliveryMethod(state, action) {
      state.deliveryMethod = action.payload
    },
    calculateDeliveryCosts(state) {
      const totalItems = state.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      )
      const parcelSize = getParcelSize(totalItems)

      // Przekształć lockerPrices na tablicę obiektów
      const lockerPricesArray = state.lockerPrices
        ? Object.entries(state.lockerPrices).map(([type, price]) => ({
            type,
            price,
          }))
        : []
      const lockerPrice = getDeliveryCost(
        "Paczkomat",
        parcelSize,
        lockerPricesArray,
        state.deliveryPrices
      )
      const homePrice = getDeliveryCost(
        "Kurier InPost",
        parcelSize,
        lockerPricesArray,
        state.deliveryPrices
      )

      state.summary.parcelSize = parcelSize
      state.summary.lockerDeliveryCost = lockerPrice
      state.summary.homeDeliveryCost = homePrice
    },
    updateTotal(state) {
      state.summary.total = state.summary.subtotal + state.summary.deliveryCost
    },
  },
})

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  updateQuantity,
  clearCart,
  calculateSummary,
  updateSubtotal,
  setDeliveryMethod,
  setLockerPrices,
  updateDeliveryMethod,
  calculateDeliveryCosts,
  updateDeliveryCost,
  updateTotal,
  setToken,
} = cartSlice.actions

export default cartSlice.reducer
