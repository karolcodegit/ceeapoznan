import axios from "axios"
import emailjs from "emailjs-com"

const sendEmail = async (formElement, emailjsConfig) => {
  try {
    const result = await emailjs.sendForm(
      emailjsConfig.serviceId,
      emailjsConfig.templateId,
      formElement.current,
      emailjsConfig.userId
    )
  } catch (e) {
    console.error("Error sending email:", e)
    throw e.message
  }
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const validateForm = (form, allFields) => {
  const errors = {}

  allFields.forEach(field => {
    const fieldValue = form[field.name]
    const isRequiredAndEmpty =
      field.required && (!fieldValue || fieldValue.trim() === "")
    if (isRequiredAndEmpty) {
      errors[field.name] = "To pole jest wymagane"
    }

    if (field.name === 'email' && fieldValue && !validateEmail(fieldValue)) {
      errors[field.name] = 'Nieprawidłowy adres e-mail'
    }
  })

  return errors
}

export const handleFormSubmit = async (
  event,
  formRef,
  form,
  emailjsConfig,
  showNotification,
  allFields,
  successMessage,
  apiEndpoint,
) => {
  event.preventDefault();
  try {
    if (!formRef) {
      console.error("Form reference is not available.")
      return
    }
    const errors = validateForm(form, allFields)
    

    if (Object.keys(errors).length > 0) {
      if (errors.email) {
        showNotification(`Nieprawidłowy adres e-mail`, "error")
      }
      showNotification(
        `Nie wszystkie pola zostały prawidłowo wypełnione`,
        "error"
      )
        return
    }else{
      const response = await axios.post(apiEndpoint, form);

      if (response.status === 200) {
        showNotification(successMessage, "success")
        await sendEmail(formRef, emailjsConfig)
      } else {
        throw new Error("Formularz nie został wysłany");
      }
    }
   
  } catch (err) {
    console.error(err)
    // Obsługa błędów, check for transient error
    if (err && err.text && err.text.includes("TransientError")) {
      // showNotification('Wystąpił tymczasowy problem. Spróbuj ponownie później.', 'error');
    } else {
      // showNotification(
      //   `Wiadomość nie została wysłana. Błąd: ${
      //     (err.message, "error")
      //   }`
      // )
    }
  }
}
