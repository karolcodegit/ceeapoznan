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
import ParcelLockerMap from "../../ParcelLockerMap/ParcelMockerMap"

const Form = ({
  allFields,
  buttonText,
  handleChange,
  form,
  setForm,
  initialFormState,
  formRef,
  // emailjsConfig,
  isRegisterForm,
  saveToAirtable = null,
  successMessage,
  apiEndpoint,
  pattern,
  book,
  orderNumber,
  total,
  courseTitle,
  noSpace,
  DeliveryInfoButton,
  tooltip, tooltipId
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const showNotification = useContext(NotificationContext)
  const [formErrors, setFormErrors] = useState({})

  // Resetuj formularz do wartości początkowych
  const resetFormState = () => {
    setForm(initialFormState)
  }

  const handleDeliveryChange = e => {
    const { name, value } = e.target; 
    setForm(prevForm => {
      if (name === "delivery" && value === "Paczkomat") {
        return {
          ...prevForm,
          [name]: value,
          streetDelivery: "", // Resetujemy pola adresowe
          cityDelivery: "",
          postcodeDelivery: "",
        }
      }
      return {
        ...prevForm,
        [name]: value,
      }
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)

    // Sprawdzenie, czy allFields jest tablicą
    if (!Array.isArray(allFields)) {
      console.error("allFields nie jest tablicą:", allFields)
      showNotification("Wystąpił błąd: allFields nie jest tablicą", "error")
      setIsSubmitting(false)
      return
    }
    const errors = validateForm(form, allFields)
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      showNotification("Formularz nie został prawidłowo wypełniony")
      setIsSubmitting(false)
      return
    }
    try {
      // Wywołanie handleFormSubmit i uzyskanie przetworzonych danych
      const enrichedForm = await handleFormSubmit(
        e,
        formRef,
        form,
        // emailjsConfig,
        showNotification,
        allFields,
        successMessage,
        apiEndpoint,
        book,
        setForm,
        orderNumber,
        total,
        courseTitle
      )

      // Jeśli zapis do Airtable jest wymagany i funkcja jest dostępna
      if (isRegisterForm && typeof saveToAirtable === "function") {
        try {
          const records = await saveToAirtable(form)
          // console.log("Zapisano dane w Airtable:", records)
        } catch (err) {
          console.log(err);
          console.error("Błąd podczas zapisu do Airtable:", err)
          showNotification("Nie udało się zapisać danych w Airtable", "error")
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
        className={`${noSpace ? '' : 'space-y-6 mt-8'}  xl:mx-auto`}
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
                    resetFormState={resetFormState}
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
                            resetFormState={resetFormState}
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
                    resetFormState={resetFormState}
                    // disabled={disabled}
                  />
                )}
                {field.typ === "radio" && (
                  <>
                    <FormRadioGroup
                      field={field}
                      form={form}
                      handleChange={handleDeliveryChange}
                      formErrors={formErrors}
                      formSubmitted={formSubmitted}
                      resetFormState={resetFormState}
                    />
                  </>
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

                {form.delivery === "Adres dostawy" && field.typ === "radio" && (
                  <>
                    <FormField
                      field={{
                        name: "streetDelivery",
                        label: "Ulica",
                        type: "text",
                        typ: "input",
                        required: true,
                      }}
                      form={form}
                      formErrors={formErrors}
                      formSubmitted={formSubmitted}
                      handleChange={handleChange}
                      resetFormState={resetFormState}
                    />
                    <FormField
                      field={{
                        name: "cityDelivery",
                        label: "Miasto",
                        type: "text",
                        typ: "input",
                        required: true,
                      }}
                      form={form}
                      formErrors={formErrors}
                      formSubmitted={formSubmitted}
                      handleChange={handleChange}
                      resetFormState={resetFormState}
                    />
                    <FormField
                      field={{
                        name: "postcodeDelivery",
                        label: "Kod pocztowy",
                        type: "text",
                        typ: "input",
                        required: true,
                      }}
                      form={form}
                      formErrors={formErrors}
                      formSubmitted={formSubmitted}
                      handleChange={handleChange}
                      resetFormState={resetFormState}
                    />
                  </>
                )}

                {form.delivery === "Paczkomat" && field.typ === "radio" && (
                  <ParcelLockerMap setForm={setForm} />
                )}

                {form.delivery === "Paczkomat" &&
                  field.typ === "radio" &&
                  form.parcelLocker && (
                    <div className="flex flex-col gap-5 border p-5 rounded-lg shadow-md my-6">
                      <Title tag="h4">Wybrany paczkomat:</Title>
                      <p>
                        <strong>Nazwa paczkomatu:</strong>{" "}
                        {form.parcelLocker.name}
                      </p>
                      <p>
                        <strong>Adres:</strong>{" "}
                        {form.parcelLocker.address.street}{" "}
                        {form.parcelLocker.address.building_number},{" "}
                        {form.parcelLocker.address.city},{" "}
                        {form.parcelLocker.address.post_code}
                      </p>
                    </div>
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
                            resetFormState={resetFormState}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
          <Button type="submit" disabled={isSubmitting} DeliveryInfoButton={DeliveryInfoButton} tooltip={tooltip} tooltipId={tooltipId}>
            {buttonText}
          </Button>
        </fieldset>
      </form>
    </>
  )
}

export default Form
