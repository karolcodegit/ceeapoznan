  import { createSlice } from "@reduxjs/toolkit";

  const initialState = {
    name: "",
    email: "",
    message: "",
    loading: false,
    success: false,
    error: null,
  };

  const contactFormSlice = createSlice({
    name: "contactForm",
    initialState,
    reducers: {
      updateField: (state, action) => {
        const { field, value } = action.payload;
        state[field] = value;
      },
      clearForm: () => initialState,
      setLoading: (state, action) => {
        state.loading = action.payload;
      },
      setSuccess: (state, action) => {
        state.success = action.payload;
      },
      setError: (state, action) => {
        state.error = action.payload;
      },
    },
  });

  export const {
    updateField,
    clearForm,
    setLoading,
    setSuccess,
    setError,
  } = contactFormSlice.actions;

  export default contactFormSlice.reducer;