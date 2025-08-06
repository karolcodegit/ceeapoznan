import React from "react"
import { navigate } from "gatsby"
import { useDispatch, useSelector } from "react-redux"
import PropTypes from "prop-types"
import {
  clearForm,
} from "../../store/contact/contactSlice"
import Form from "./Form"
import FormField from "../Form/FormField/FormField"
import { prepareContactData } from "../../utils/prepareContactData"
import { handleContactSubmit } from "../../utils/handlerContactSubmit"

const ContactForm = ({
  apiEndpoint = "https://contact-559160331745.us-central1.run.app",
  buttonText = "Wyślij wiadomość",
}) => {
  const contactData = useSelector((state) => state.contact)
  const dispatch = useDispatch();


  const handleSubmitOverride = async (e) => {
    e.preventDefault();
    await handleContactSubmit(contactData, apiEndpoint, dispatch, navigate);
  };
 
  return (
    <Form
      apiEndpoint={apiEndpoint}
      variant='submit'
      submitButtonText={buttonText}
      notificationMessage="Formularz został wysłany!"
      clearAction={clearForm}
      formSliceKey="contact"
      requiredFields={["name", "email", "message"]}
      prepareFormData={prepareContactData}
      onSubmitOverride={handleSubmitOverride}
      addToButton='float-right'
    >
      <FormField
        label="Imię"
        type="text"
        name="name"
        required
        formSliceKey="contact"
      />
      <FormField
        label="E-mail"
        type="email"
        name="email"
        required
        formSliceKey="contact"
      />
      <FormField
        label="Wiadomość"
        name="message"
        type="textarea"
        required
        formSliceKey="contact"
      />
    </Form>
  )
}

ContactForm.propTypes = {
  apiEndpoint: PropTypes.string,
  airtableSaveFn: PropTypes.func,
  buttonText: PropTypes.string,
  notification: PropTypes.shape({
    show: PropTypes.func,
  }),
}

export default ContactForm
