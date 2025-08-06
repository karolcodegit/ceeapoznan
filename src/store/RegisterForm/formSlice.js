import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  firstName: "",
  surName: "",
  street: "",
  numberHome: "",
  zipCode: "",
  city: "",
  phone: "",
  birthday: "",
  email: "",
  profession: "",
  npwz: "",
  specjalist: false,
  specialist2: false,
  lastcourse: false,
  yearSpecialist: "Nie dotyczy",
  invoiceName: "",
  invoiceStreet: "",
  invoiceNumberHome: "",
  invoiceZipCode: "",
  invoiceCity: "",
  invoiceNip: "",
  option1: false,
  option2: false,
  option3: false,
  dishes: "Proszę wybrać dania",
  wyrazamZgode: false,
  courseTitle: "",
  formErrors: {},
  total: 0,
  orderNumber: null,
}

const formSlice = createSlice({
  name: "formRegister",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
      delete state.formErrors?.[field];
    },
    setCourseTitle: (state, action) => {
      state.courseTitle = action.payload
    },
    setFormError: (state, action) => {
      const { name, message } = action.payload
      state.formErrors[name] = message
    },
    setOrderNumber: (state, action) => {
      state.orderNumber = action.payload;
    },
    clearFormErrors: state => {
      state.formErrors = {}
    },
    resetForm: () => initialState,
  },
})

export const {
  updateField,
  resetForm,
  setOrderNumber,
  setCourseTitle,
  setFormError,
  clearFormErrors,
} = formSlice.actions

export default formSlice.reducer
