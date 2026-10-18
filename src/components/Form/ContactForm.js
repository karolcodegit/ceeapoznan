import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import { useDispatch, useSelector } from "react-redux"
import PropTypes from "prop-types"
import { clearForm } from "../../store/contact/contactSlice"
import Form from "./Form"
import FormField from "../Form/FormField/FormField"
import { prepareContactData } from "../../utils/prepareContactData"
import { handleContactSubmit } from "../../utils/handlerContactSubmit"

const ContactForm = ({
  buttonText = "Wyślij wiadomość",
}) => {
  const contactData = useSelector(state => state.contact)
  const dispatch = useDispatch()

  const [token, setToken] = useState("")

  useEffect(() => {
    setToken(Math.random().toString(36).substring(2))
  }, [])

  const handleSubmitOverride = async e => {
    e.preventDefault()

    // 🧠 Sprawdź spam lokalnie (dla pewności)
    if (contactData["bot-field"] || contactData.website) {
      console.warn("🚫 Spam wykryty (honeypot/fake field).")
      return
    }

    // 🧩 Dołącz token do wysyłanych danych
    const payload = { ...contactData, token }

    await handleContactSubmit(payload)
  }

  return (
    <Form
      requireToken={true}
      name="contact"
      variant="submit"
      submitButtonText={buttonText}
      notificationMessage="Formularz został wysłany!"
      clearAction={clearForm}
      formSliceKey="contact"
      requiredFields={["name", "email", "message"]}
      prepareFormData={prepareContactData}
      onSubmitOverride={handleSubmitOverride}
      addToButton="float-right"
    >
      {/* Honeypot Netlify */}
      <p style={{ display: "none" }} aria-hidden="true">
        <label>
          Nie wypełniaj tego pola:
          <input name="bot-field" tabIndex="-1" autoComplete="off" />
        </label>
      </p>


      {/* Fake pole dla botów */}
      <input
        type="text"
        name="website"
        style={{ display: "none" }}
        tabIndex="-1"
        autoComplete="off"
      />

      {/* Token JS */}
      <input type="hidden" name="token" value={token} />

      {/* Pola formularza */}
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
  buttonText: PropTypes.string,
}

export default ContactForm
