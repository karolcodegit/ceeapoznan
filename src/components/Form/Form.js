import React, { useContext, useState } from "react"
import { FormField } from "./FormField/FormField"
import Button from "../Button/Button"
import Title from "../Title/Title"
import Paragraph from "../Paragraph/Paragraph"
import { ConsentCheckbox } from "./ConsentCheckbox/ConsentCheckbox"
import { FormRadioGroup } from "./FormRadioGroup/FormRadioGroup"
import { FormList } from "./FormList/FormList"
import { CheckboxOption } from "./CheckboxOption/CheckboxOption"
import { handleFormSubmit, validateForm } from "./formHandlers"
import NotificationContext from "../Notification/NotificationContext"
import { saveToAirtable } from "../../../utils/airtable"

const Form = ({
  allFields,
  buttonText,
  handleChange,
  form,
  setForm,
  initialFormState,
  formRef,
  emailjsConfig,
  isRegisterForm,
  saveToAirtable,
  successMessage, // Dodaj to
  apiEndpoint, // i to
  pattern,
  total,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const showNotification = useContext(NotificationContext)
  const [formErrors, setFormErrors] = useState({})

  const resetFormState = () => {
    setForm(initialFormState)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)

    const errors = validateForm(form, allFields)
    setFormErrors(errors)

    form.total = total

    if (Object.keys(errors).length > 0) {
      showNotification("Formularz nie został prawidłowo wypełniony")
      setIsSubmitting(false)
      return
    }
    try {
      // Właściwa obsługa wysyłki formularza
      await handleFormSubmit(
        e,
        formRef,
        form,
        emailjsConfig,
        showNotification,
        allFields,
        successMessage, // Użycie successMessage z propsów
        apiEndpoint // Użycie apiEndpoint z propsów
      )
      if (isRegisterForm) {
        try {
          const records = await saveToAirtable(form)
        } catch (err) {
          console.error(err)
        }
      }
      setFormSubmitted(false)
      resetFormState()
    } catch (err) {
      console.error(err)
      // Obsługa błędów, np. brak połączenia z serwerem
      showNotification("Wystąpił błąd podczas wysyłania formularza", "error")
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <>
      <form
        noValidate
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-6 mt-8 xl:mx-auto"
        method="post"
        aria-label="Formularz"
      >
        <fieldset>
          <legend className="sr-only">Wypełnij formularz</legend>
          {/* Mapowanie pól formularza */}
          <div className={`grid sm:grid-cols-1 gap-y-10 gap-x-6 pb-6`}>
            {allFields.map((field, index) => (
              <React.Fragment key={field.name || index}>
                {field.typ === "input" && (
                  <FormField
                    field={field}
                    form={form}
                    handleChange={handleChange}
                    formErrors={formErrors}
                    formSubmitted={formSubmitted}
                    pattern={pattern}
                  />
                )}
                {field.type === "invoice" && (
                  <>
                    <Title tag="h5">{field.title}</Title>
                    {field.fields.map((item, index) => (
                      <React.Fragment key={index}>
                        {item.typ === "input" && (
                          <FormField
                            field={item}
                            form={form}
                            handleChange={handleChange}
                            formErrors={formErrors}
                            formSubmitted={formSubmitted}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </>
                )}
                {field.typ === "checkbox" && (
                  <CheckboxOption
                    field={field}
                    form={form}
                    handleChange={handleChange}
                    formErrors={formErrors}
                    formSubmitted={formSubmitted}
                    // disabled={disabled}
                  />
                )}
                {field.typ === "radio" && (
                  <FormRadioGroup
                    field={field}
                    form={form}
                    handleChange={handleChange}
                    formErrors={formErrors}
                    formSubmitted={formSubmitted}
                  />
                )}
                {field.typ === "list" && (
                  <FormList
                    field={field}
                    form={form}
                    handleChange={handleChange}
                    formErrors={formErrors}
                    formSubmitted={formSubmitted}
                  />
                )}
                {field.typ === "consent" && (
                  <>
                    {field.content.map((item, index) => (
                      <React.Fragment key={index}>
                        <Title tag={index === 0 ? "h5" : "h3"}>
                          {item.title}
                        </Title>
                        <Paragraph>{item.description}</Paragraph>
                        {item.typ === "checkbox" && (
                          <ConsentCheckbox
                            field={item}
                            form={form}
                            handleChange={handleChange}
                            formErrors={formErrors}
                            formSubmitted={formSubmitted}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {buttonText}
          </Button>
        </fieldset>
      </form>
    </>
  )
}

export default Form
