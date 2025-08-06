import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderNumber: null,
  submittedAt: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderNumber: (state, action) => {
      state.orderNumber = action.payload;
    },
    setSubmittedAt: (state, action) => {
      state.submittedAt = action.payload;
    },
    clearOrder: () => initialState,
  },
});

export const { setOrderNumber, setSubmittedAt, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;