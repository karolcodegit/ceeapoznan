import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

const userSlice = createSlice({
  name: "userCart",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    clearForm: () => initialState,
  },
});

export const { updateField, clearForm } = userSlice.actions;
export default userSlice.reducer;