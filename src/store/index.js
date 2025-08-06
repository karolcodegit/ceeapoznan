import { configureStore } from "@reduxjs/toolkit"
import cartReducer, { updateDeliveryCost } from "./cart/cartSlice"
import contactReducer from "./contact/contactSlice"
import userReducer from "./user/userSlice"
import deliveryReducer from "./delivery/deliverySlice"
import orderReducer from "./order/orderSlice"
import formRegisterReducer from './RegisterForm/formSlice'
import notificationReducer from "./notificationBook/notificationSlice"

const isBrowser = typeof window !== "undefined";

const loadState = () => {
  try {
    if (!isBrowser) return undefined;

    const cart = localStorage.getItem("cartState");
    const userCart = localStorage.getItem("userCartState");
    const delivery = localStorage.getItem("delivery");

    const parsedCart = cart ? JSON.parse(cart) : undefined;
    const parsedDelivery = delivery ? JSON.parse(delivery) : undefined;

    // Oblicz koszt dostawy na podstawie zapisanej metody dostawy
    if (parsedCart && parsedDelivery?.method) {
      const deliveryMethod = parsedDelivery.method;
      const lockerDeliveryCost = parsedCart.summary?.lockerDeliveryCost || 0;
      const homeDeliveryCost = parsedCart.summary?.homeDeliveryCost || 0;

      parsedCart.summary.deliveryCost =
        deliveryMethod === "Paczkomat"
          ? lockerDeliveryCost
          : homeDeliveryCost;
    }

    return {
      cart: {
        ...parsedCart,
        deliveryPrices: parsedCart?.deliveryPrices || {
          A: 20.99,
          B: 23.99,
          C: 25.99,
        },
        summary: {
          ...parsedCart?.summary,
          lockerDeliveryCost: parsedCart?.summary?.lockerDeliveryCost || 0,
          homeDeliveryCost: parsedCart?.summary?.homeDeliveryCost || 0,
          deliveryCost: parsedCart?.summary?.deliveryCost || 0,
          total: parsedCart?.summary?.total || 0,
        },
      },
      userCart: userCart ? JSON.parse(userCart) : undefined,
      delivery: parsedDelivery || undefined,
    };
  } catch (e) {
    console.error("Błąd przy ładowaniu stanu z localStorage:", e);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    if (!isBrowser) return;
    localStorage.setItem("cartState", JSON.stringify(state.cart));
    localStorage.setItem("userCartState", JSON.stringify(state.userCart));
    localStorage.setItem("delivery", JSON.stringify(state.delivery));
  } catch (e) {
    console.error("Błąd przy zapisie stanu do localStorage:", e);
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    contact: contactReducer,
    userCart: userReducer,
    delivery: deliveryReducer,
    order: orderReducer,
    formRegister: formRegisterReducer,
    notificationBook: notificationReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true, // Upewnij się, że redux-thunk jest włączony
    }),
});

if (preloadedState?.delivery?.method) {
  const deliveryMethod = preloadedState.delivery.method;
  const lockerDeliveryCost = preloadedState.cart?.summary?.lockerDeliveryCost || 0;
  const homeDeliveryCost = preloadedState.cart?.summary?.homeDeliveryCost || 0;

  store.dispatch(
    updateDeliveryCost({ deliveryMethod, lockerDeliveryCost, homeDeliveryCost })
  );
}

if (isBrowser) {
  store.subscribe(() => {
    saveState(store.getState());
  });
}