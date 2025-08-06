import { createSelector } from 'reselect';

const selectUserCart = state => state.userCart;
const selectDelivery = state => state.delivery;

const selectFormSlice = (state, formSliceKey) => state[formSliceKey] || {};

export const selectDynamicState = createSelector(
  [selectUserCart, selectDelivery],
  (userCart, delivery) => ({ userCart, delivery })
);




export const selectFormErrors = createSelector(
  [selectFormSlice],
  (formSlice) => formSlice.formErrors || {}
);

export const selectFormSubmitted = createSelector(
  [selectFormSlice],
  (formSlice) => formSlice.formSubmitted
);