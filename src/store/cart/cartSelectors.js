export const selectCartTotal = state => state.cart.summary.subtotal;
export const selectShippingCost = state => state.cart.summary.deliveryCost;
export const selectTotalWithShipping = state => state.cart.summary.total;
export const selectDeliveryPrices = (state) => {
  console.log("State.cart.deliveryPrices:", state.cart.deliveryPrices);
  return state.cart.deliveryPrices;
};
export const selectTotalQuantity = state =>
  state.cart?.items?.reduce((total, item) => total + item.quantity, 0);