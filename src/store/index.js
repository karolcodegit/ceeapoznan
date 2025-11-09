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

    // Domyślne ceny dostawy do domu
    const defaultHomeDeliveryPrices = {
      A: 19.99,
      B: 20.99,
      C: 25.99,
    };

    // Domyślne ceny paczkomatów
    const defaultLockerPrices = {
      A: 20.99,
      B: 23.99,
      C: 25.99,
    };

    const defaultDelivery = {
      method: "Paczkomat", // Domyślna metoda dostawy
    };

    const deliveryPrices = parsedCart?.deliveryPrices || defaultLockerPrices;
    const homeDeliveryCost = defaultHomeDeliveryPrices;
    const lockerPrices = parsedCart?.lockerPrices || defaultLockerPrices; // Dodano obsługę lockerPrices


    const lockerDeliveryCost =
      parsedCart?.summary?.parcelSize && deliveryPrices[parsedCart.summary.parcelSize]
        ? deliveryPrices[parsedCart.summary.parcelSize]
        : 0;

    const homeDeliveryCostValue =
      parsedCart?.summary?.parcelSize && homeDeliveryCost[parsedCart.summary.parcelSize]
        ? homeDeliveryCost[parsedCart.summary.parcelSize]
        : 0;

    const deliveryCost =
      parsedDelivery?.method === "Paczkomat"
        ? lockerDeliveryCost
        : homeDeliveryCostValue;


   

        return {
          cart: {
            ...parsedCart,
            deliveryPrices,
            lockerPrices,
            summary: {
              ...parsedCart?.summary,
              lockerDeliveryCost,
              homeDeliveryCost: homeDeliveryCostValue,
              deliveryCost,
              total: parsedCart?.summary?.total || 0,
            },
          },
          userCart: userCart ? JSON.parse(userCart) : undefined,
          delivery: parsedDelivery || defaultDelivery,
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