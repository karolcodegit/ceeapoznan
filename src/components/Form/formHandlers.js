// import axios from "axios"

// const sendEmail = async (formElement) => {
//   try {
  
//   } catch (e) {
//     console.error("Error sending email:", e)
//     throw e.message
//   }
// }

// function validateEmail(email) {
//   const re =
//     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//   return re.test(String(email).toLowerCase())
// }

// const getDynamicFields = form => {
//   const dynamicFields = []
//   return dynamicFields
// }

// export const validateForm = (form, allFields) => {
//   const errors = {}

//   const fieldsToValidate = [
//     ...(Array.isArray(allFields) ? allFields : []),
//     ...(Array.isArray(getDynamicFields(form)) ? getDynamicFields(form) : []),
//   ]

//   fieldsToValidate.forEach(field => {
//     const fieldValue = form[field.name]
//     const isRequiredAndEmpty =
//       field.required && (!fieldValue || fieldValue.trim() === "")
//     if (isRequiredAndEmpty) {
//       errors[field.name] = "To pole jest wymagane"
//     }

//     if (field.name === "email" && fieldValue && !validateEmail(fieldValue)) {
//       errors[field.name] = "Nieprawidłowy adres e-mail"
//     }
//   })

//   // Walidacja dodatkowa dla adresu dostawy
//   if (form.delivery === "Kurier InPost") {
//     if (!form.streetDelivery || form.streetDelivery.trim() === "") {
//       errors.street = "Ulica jest wymagana"
//     }
//     if (!form.cityDelivery || form.cityDelivery.trim() === "") {
//       errors.city = "Miasto jest wymagane"
//     }
//     if (!form.postcodeDelivery || form.postcodeDelivery.trim() === "") {
//       errors.postcode = "Kod pocztowy jest wymagany"
//     }
//   }

//   return errors
// }

// export const handleFormSubmit = async (
//   event,
//   formRef,
//   form,
//   // emailjsConfig,
//   allFields,
//   successMessage,
//   apiEndpoint,
//   book,
//   setForm,
// ) => {
//   event.preventDefault()

//   try {
//     if (!formRef) {
//       console.error("Form reference is not available.")
//       return
//     }

//     const errors = validateForm(form, allFields)


//     const imageUrl = book?.image?.gatsbyImageData?.images?.fallback?.src || ""

//     // Przygotowanie danych
//     const formWithAdditionalData = {
//       ...form,
//       setForm,
//       quantity: form.quantity,
//       title: book?.title || "Domyślny tytuł",
//       title_book: form?.title || "Domyślny tytuł",
//       book_image: imageUrl,
//       orderNumber: form.orderNumber,
//       parcelLocker:
//         form.delivery === "Paczkomat"
//           ? form.parcelLocker
//           : {
//               name: "",
//               address: {
//                 city: "",
//                 province: "",
//                 post_code: "",
//                 street: "",
//                 building_number: "",
//                 flat_number: "",
//               },
//             },
      
//     }

//     // console.log("Form data being sent:", formWithAdditionalData);
//   // console.log("Title book value:", formWithAdditionalData.title_book);

//     // Wysyłanie danych
//     const response = await axios.post(
//       apiEndpoint,
//       formWithAdditionalData,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.GATSBY_API_TOKEN}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//     // console.log("API Response:",  process.env.GATSBY_API_TOKEN);

//     // console.log('Wysyłane dane:', formWithAdditionalData);
    

//     if (response.status === 200) {
//       showNotification(successMessage, "success")
//       await sendEmail(formRef)
//     } else {
//       console.error("Błąd API:", response)
//       throw new Error("Formularz nie został wysłany")
//     }
//     // Zwracanie przetworzonych danych
//     return formWithAdditionalData
//   } catch (err) {
//     console.error("Error during form submission:", err)
//     showNotification("Nie udało się wysłać formularza.", "error")
//   }
// }
