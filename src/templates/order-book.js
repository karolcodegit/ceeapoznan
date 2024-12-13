import React, { useState, useRef } from "react"
import { graphql } from "gatsby"
import Form from "../components/Form/Form"
import DeliveryInfo from "../components/DeliveryInfo/DeliveryInfo"
import Title from "../components/Title/Title"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { saveAirableOrderBook } from "../../utils/airtable-order"
import QuantitySelector from "../components/QuantitySelector/QuantitySelector"
import { generateOrderNumber } from "../../utils/generateOrderNumber"

const OrderBook = ({ data }) => {  
  const book = data.datoCmsBook
  const formRef = useRef(null)
  // Wygeneruj numer zamówienia
  const orderNumber = generateOrderNumber()
  const initialFormState = {
    name: "",
    surname: "",
    email: "",
    phone: "",
    delivery: "Adres dostawy", // Domyślnie puste
    streetDelivery: "", // Dodane dla opcji "Adres dostawy"
    cityDelivery: "",
    postcodeDelivery: "",
    quantity: 1, // Ustawienie domyślnej ilości
    orderNumber: orderNumber || null,
    title: book.title,
  }

  const [form, setForm] = useState(initialFormState)

  const allFields = [
    {
      name: "name",
      label: "Imię",
      type: "text",
      typ: "input",
      required: "true",
    },
    {
      name: "surname",
      label: "Nazwisko",
      type: "text",
      typ: "input",
      required: "true",
    },
    {
      name: "email",
      label: "E-mail",
      type: "email",
      typ: "input",
      required: "true",
    },
    {
      name: "phone",
      label: "Numer telefonu",
      type: "phone",
      typ: "input",
      required: "true",
    },
    {
      name: "delivery",
      type: "radio",
      label: "Opcje dostawy",
      options: ["Adres dostawy", "Paczkomat"],
      typ: "radio",
    },
  ]

  const handleChange = e => {
    // const { name, type, value } = e.target;
    // setForm((prevForm) => ({ ...prevForm, [name]: value }));

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }
  const successMessage = "Zamówienie zostało złożone"
  const apiEndpoint =
    "https://us-central1-ceea-poznan-426120.cloudfunctions.net/sengrid-order"

  const imageData = getImage(book.image.gatsbyImageData)
  
  if (!data.datoCmsBook) {
      return <p>Dane książki są niedostępne. Spróbuj ponownie później.</p>
    }
  return (
    <>
      <div className="text-center">
        <Title tag="h2" padding>
          Zamówienie
        </Title>
      </div>
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row py-20 border-b last-of-type:border-none gap-10">
        <div className="flex flex-col lg:flex-row  md:mx-0 flex-1">
          <div className="w-full">
            <Title tag="h4" padding>
              Wybrany produkt
            </Title>
            <div className="flex flex-row gap-6 border p-6 rounded-lg shadow-lg my-6 hover:shadow-xl transition duration-300 ease-in-out">
              {/* Sekcja obrazu */}
              <div className="flex-shrink-0 w-48 h-48 max-sm:w-32 max-sm:h-32 overflow-hidden rounded-lg bg-gray-100">
                {imageData ? (
                  <GatsbyImage
                    image={imageData}
                    alt={`Okładka książki ${book.title}`}
                    className="object-cover w-full h-full rounded-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
                    <span className="text-lg">📚</span> {/* Ikonka książki */}
                  </div>
                )}
              </div>

              {/* Sekcja szczegółów */}
              <div className="flex flex-col justify-center w-full px-5">
                <div>
                  <Title
                    tag="h4"
                    className="text-xl  max-md:text-lg font-semibold text-dark dark:text-gray-100 mb-2"
                  >
                    {book.title}
                  </Title>
                  <Title
                    tag="h6"
                    className="text-md max-md:text-sm text-gray-700 dark:text-gray-400 font-medium"
                  >
                    {book.editor}
                  </Title>
                </div>
              </div>
            </div>
            <div className="mt-12">
              <div className="mt-6 mb-12">
                <Title tag="h4" padding>
                  Ilość
                </Title>
                <QuantitySelector
                  min={1}
                  max={20}
                  initial={1}
                  onChange={newQuantity =>
                    setForm(prevForm => ({
                      ...prevForm,
                      quantity: newQuantity,
                    }))
                  }
                />
              </div>
              <Title tag="h4" padding>
                Dane do wysyłki
              </Title>
              <Form
                allFields={allFields}
                buttonText="Wyślij zamówienie"
                handleChange={handleChange}
                form={form}
                setForm={setForm}
                initialFormState={initialFormState}
                formRef={formRef}
                maxLength={2000}
                isRegisterForm={true}
                saveToAirtable={saveAirableOrderBook}
                successMessage={successMessage}
                apiEndpoint={apiEndpoint}
                book={book}
                orderNumber={generateOrderNumber}
              />
            </div>
          </div>
        </div>
        <DeliveryInfo
          className="xl:w-1/4 lg:sticky lg:top-0 lg:right-0 lg:max-h-[calc(100vh-15vh)] overflow-y-auto"
          price={book.price}
          title={book.title}
        />
      </div>
    </>
  )
}

export const query = graphql`
  query ($id: String!) {
    datoCmsBook(id: { eq: $id }) {
      title
      editor
      price
      available
      image {
        gatsbyImageData(width: 200, placeholder: BLURRED)
      }
    }
  }
`

export default OrderBook
