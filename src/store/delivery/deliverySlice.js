import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  deliveryMethod: "Kurier InPost",
  address: {
    street: "",
    city: "",
    postcode: "",
  },
  lockerCode: "",
  parcelLocker: {
    name: "",
    address: {
      street: "",
      building_number: "",
      city: "",
      post_code: "",
    },
  },

}

const deliverySlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {
    updateDeliveryField: (state, action) => {
      const { field, value } = action.payload;
    
      if (field.startsWith("address.")) {
        const addressField = field.split(".")[1]; // Pobierz nazwę pola, np. "street"
    
        // Upewnij się, że state.address istnieje
        if (!state.address) {
          state.address = {
            street: "",
            city: "",
            postcode: "",
          };
        }
    
        state.address[addressField] = value; // Aktualizuj tylko w obiekcie address
      } else {
        state[field] = value; // Aktualizuj inne pola, np. deliveryMethod
      }
    },
    setParcelLocker: (state, action) => {
      state.parcelLocker = action.payload
    },


    clearDelivery: () => ({
      deliveryMethod: "Kurier InPost", // Domyślna metoda dostawy
      address: {
        street: "",
        city: "",
        postcode: "",
      },
      lockerCode: null,
      parcelLocker: null,
    }),
  },
})

export const { updateDeliveryField, clearDelivery, setParcelLocker } =
  deliverySlice.actions
export default deliverySlice.reducer
