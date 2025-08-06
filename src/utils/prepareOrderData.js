import { createSelector } from "reselect";

export const selectDelivery = (state) => state.delivery;
export const selectUserCart = (state) => state.userCart;
export const selectCartItems = (state) => state.cart.items;
export const selectCartSummary = (state) => state.cart.summary;

export const prepareOrderData = createSelector(
  [selectDelivery, selectUserCart, selectCartItems, selectCartSummary],
  (delivery, userCart, items, summary) => {
    const { deliveryMethod, address, lockerCode, parcelLocker } = delivery;

    return {
      customer: {
        firstName: userCart.firstName,
        lastName: userCart.lastName,
        email: userCart.email,
        phone: userCart.phone,
      },
      delivery: {
        method: deliveryMethod,
        address: deliveryMethod === "Kurier InPost" ? address : undefined,
        lockerCode: deliveryMethod === "Paczkomat" ? lockerCode : undefined,
        parcelLocker: deliveryMethod === "Paczkomat" ? parcelLocker : undefined,
      },
      items,
      summary,
    };
  }
);