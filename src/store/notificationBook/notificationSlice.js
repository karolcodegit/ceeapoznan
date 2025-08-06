import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  books: {},
  loading: false,
  success: false,
  error: null,
};

const notificationFormSlice = createSlice({
  name: "notificationBook",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { id, field, value } = action.payload;
      if (!id) {
        console.error("ID książki jest undefined! Sprawdź, czy jest poprawnie przekazywane.");
        return;
      }
      if (!state.books[id]) {
        state.books[id] = {};
      }
      state.books[id][field] = value; // Aktualizuj pole dla konkretnej książki
    },
    updateBookInfo: (state, action) => {
      const { id, bookInfo } = action.payload;
      state.books[id] = { ...state.books[id], ...bookInfo }; // Aktualizuj dane książki
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
  updateBookInfo,
  clearForm,
  setLoading,
  setSuccess,
  setError,
} = notificationFormSlice.actions;

export default notificationFormSlice.reducer;