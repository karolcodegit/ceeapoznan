import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import PropTypes from "prop-types"
import { clearForm } from "../../store/contact/contactSlice"
import Form from "./Form"
import FormField from "../Form/FormField/FormField"
import { prepareContactData } from "../../utils/prepareContactData"
import { handleContactSubmit } from "../../utils/handlerContactSubmit"

const ContactForm = ({ buttonText = "Wyślij wiadomość" }) => {
  const contactData = useSelector(state => state.contact)
  const [token, setToken] = useState("")

  useEffect(() => {
    setToken(Math.random().toString(36).substring(2))
  }, [])

  const handleSubmitOverride = async e => {
    e.preventDefault()

    if (contactData["bot-field"] || contactData.website) {
      console.warn("Spam wykryty (honeypot/fake field).")
      return
    }

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
      padding="py-3"
      className="flex flex-col gap-1"
      addToButton="!float-none !clear-both !mt-6 !ml-0 w-full sm:w-auto sm:self-end rounded-full px-8 shadow-lg"
    >
      <p style={{ display: "none" }} aria-hidden="true">
        <label>
          Nie wypełniaj tego pola:
          <input name="bot-field" tabIndex="-1" autoComplete="off" />
        </label>
      </p>

      <input
        type="text"
        name="website"
        style={{ display: "none" }}
        tabIndex="-1"
        autoComplete="off"
      />

      <input type="hidden" name="token" value={token} />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Imię"
          type="text"
          name="name"
          required
          formSliceKey="contact"
          margin="mt-0"
          placeholder="Twoje imię"
        />
        <FormField
          label="E-mail"
          type="email"
          name="email"
          required
          formSliceKey="contact"
          margin="mt-0"
          placeholder="np. jan@example.pl"
        />
      </div>
      <FormField
        label="Wiadomość"
        name="message"
        type="textarea"
        required
        formSliceKey="contact"
        margin="mt-4"
        rows={15}
        placeholder="W czym możemy pomóc?"
      />
    </Form>
  )
}

ContactForm.propTypes = {
  buttonText: PropTypes.string,
}

export default ContactForm
