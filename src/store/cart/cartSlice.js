// store/cart/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { getParcelSize, getDeliveryCost } from "../../constants/shippingCosts";

const initialState = {
  items: [],
  summary: {
    subtotal: 0,
    parcelSize: "A",
    total: 0,
    lockerDeliveryCost: 0, // Koszt dostawy dla paczkomatu
    homeDeliveryCost: 0,   // Koszt dostawy dla adresu dostawy
    deliveryCost: 0, // Koszt dostawy, który będzie aktualizowany
  },
  lockerPrices: [],
  deliveryPrices: {
    A: 20.99,
    B: 23.99,
    C: 25.99,
  },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
    
      if (!Array.isArray(state.items)) {
        state.items = [];
      }
    
      const existing = state.items.find(item => item.id === newItem.id);
      if (existing) {
        existing.quantity += newItem.quantity;
      } else {
        state.items.push({ ...newItem });
      }
    
      const newSubtotal = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      cartSlice.caseReducers.updateSubtotal(state, { payload: newSubtotal });
      cartSlice.caseReducers.calculateDeliveryCosts(state);
    },
    removeFromCart(state, action) {
      const id = action.payload;

      // Upewnij się, że state.items jest tablicą
      if (!Array.isArray(state.items)) {
        state.items = [];
      }
      state.items = state.items.filter(item => item.id !== id);
      cartSlice.caseReducers.updateSubtotal(state);
      cartSlice.caseReducers.updateTotal(state);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }

      // Wywołaj obliczenie kosztów dostawy
  cartSlice.caseReducers.calculateDeliveryCosts(state);
  cartSlice.caseReducers.updateTotal(state);


  // Aktualizuj koszt dostawy na podstawie metody dostawy
  const deliveryMethod = state.deliveryMethod || "Kurier InPost";
  const lockerDeliveryCost = state.summary.lockerDeliveryCost || 0;
  const homeDeliveryCost = state.summary.homeDeliveryCost || 0;

  cartSlice.caseReducers.updateDeliveryCost(state, {
    payload: { deliveryMethod, lockerDeliveryCost, homeDeliveryCost },
  });
    },
    incrementQuantity(state, action) {
      const id = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity += 1;
      }
      // Wywołaj obliczenie kosztów dostawy
  cartSlice.caseReducers.calculateDeliveryCosts(state);
  cartSlice.caseReducers.updateTotal(state);

  // Aktualizuj koszt dostawy na podstawie metody dostawy
  const deliveryMethod = state.deliveryMethod || "Kurier InPost";
  const lockerDeliveryCost = state.summary.lockerDeliveryCost || 0;
  const homeDeliveryCost = state.summary.homeDeliveryCost || 0;

  cartSlice.caseReducers.updateDeliveryCost(state, {
    payload: { deliveryMethod, lockerDeliveryCost, homeDeliveryCost },
  });

    },
    decrementQuantity(state, action) {
      const id = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
      // Wywołaj obliczenie kosztów dostawy
  cartSlice.caseReducers.calculateDeliveryCosts(state);
  cartSlice.caseReducers.updateTotal(state);

  // Aktualizuj koszt dostawy na podstawie metody dostawy
  const deliveryMethod = state.deliveryMethod || "Kurier InPost";
  const lockerDeliveryCost = state.summary.lockerDeliveryCost || 0;
  const homeDeliveryCost = state.summary.homeDeliveryCost || 0;

  cartSlice.caseReducers.updateDeliveryCost(state, {
    payload: { deliveryMethod, lockerDeliveryCost, homeDeliveryCost },
  });
    },
    clearCart(state) {
      state.items = [];
      state.summary.subtotal = 0; // Zresetuj subtotal
      state.summary.total = 0; // Zresetuj total
    },
    setLockerPrices(state, action) {
      state.lockerPrices = action.payload;
    },
    updateSubtotal(state, action) {
      if (action.payload !== undefined) {
        state.summary.subtotal = action.payload;
        cartSlice.caseReducers.updateTotal(state);
      } else {
        console.error("updateSubtotal: action.payload is undefined");
      }
    },


    updateDeliveryCost: (state, action) => {
      const { deliveryMethod, lockerDeliveryCost, homeDeliveryCost } = action.payload;
    
      console.log("Delivery method:", deliveryMethod);
      console.log("Locker delivery cost:", lockerDeliveryCost);
      console.log("Home delivery cost:", homeDeliveryCost);
    
      // Przypisz odpowiednią wartość do deliveryCost w obiekcie summary
      state.summary.deliveryCost =
        deliveryMethod === "Paczkomat"
          ? lockerDeliveryCost
          : homeDeliveryCost;
    
      console.log("Updated deliveryCost in cartSlice:", state.summary.deliveryCost);
      cartSlice.caseReducers.updateTotal(state);
    },


    
    setDeliveryMethod(state, action) {
      state.deliveryMethod = action.payload;
    },
    calculateDeliveryCosts(state) {
      const totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
      const parcelSize = getParcelSize(totalItems);
    
      const lockerPrice = getDeliveryCost("Paczkomat", parcelSize, state.lockerPrices, state.deliveryPrices);
      const homePrice = getDeliveryCost("Kurier InPost", parcelSize, state.lockerPrices, state.deliveryPrices);
    
      console.log("Locker price:", lockerPrice);
      console.log("Home price:", homePrice);
    
      state.summary.parcelSize = parcelSize;
      state.summary.lockerDeliveryCost = lockerPrice;
      state.summary.homeDeliveryCost = homePrice;
    },
    updateTotal(state) {
      state.summary.total = state.summary.subtotal + state.summary.deliveryCost;
      console.log("Updated total:", state.summary.total);
    },
  },
});

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
  updateTotal
  
} = cartSlice.actions;

export default cartSlice.reducer;