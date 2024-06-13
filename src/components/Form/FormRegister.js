import React, { useRef, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import Title from "../Title/Title"
import SideInfoPanel from "../SideInfoPanel/SideInfoPanel"
import Form from "./Form"
import { saveToAirtable } from "../../../utils/airtable"
import Paragraph from "../Paragraph/Paragraph"

const FormRegister = () => {
  const data = useStaticQuery(graphql`
    query {
      activeCourse: allDatoCmsCourse(filter: { available: { eq: true } }) {
        nodes {
          id
          nameCourse
          courseDuration
        }
      }
    }
  `)

  const formRef = useRef(null)
  const [isRegisterForm, setIsRegisterForm] = useState(true)

  const initialFormState = {
    firstName: "",
    surName: "",
    street: "",
    numberHome: "",
    zipCode: "",
    city: "",
    phone: "",
    email: "",
    profession: "",
    profesionNumber: "",
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
    breakfast: false,
    dinner: false,
    super: false,
    dishes: "Proszę wybrać dania",
    wyrazamZgode: false,
    total: 0,
  }

  const [form, setForm] = useState({ initialFormState })

  const allFields = [
    {
      name: "firstName",
      label: "Imię",
      type: "text",
      typ: "input",
      required: true,
    },
    {
      name: "surName",
      label: "Nazwisko",
      type: "text",
      typ: "input",
      required: true,
    },
    {
      name: "street",
      label: "Ulica",
      type: "text",
      typ: "input",
      required: true,
    },
    {
      name: "numberHome",
      label: "Numer domu",
      type: "text",
      typ: "input",
      required: true,
    },
    {
      name: "zipCode",
      label: "Kod pocztowy",
      type: "text",
      typ: "input",
      required: true,
    },
    {
      name: "city",
      label: "Miasto",
      type: "text",
      typ: "input",
      required: true,
    },
    {
      name: "phone",
      label: "Numer telefonu",
      type: "text",
      typ: "input",
      required: true,
    },
    {
      name: "email",
      label: "E-mail",
      type: "mail",
      typ: "input",
      required: true,
    },
    {
      name: "profession",
      label: " Ile lat w zawodzie?",
      type: "number",
      typ: "input",
      required: true,
    },
    {
      name: "profesionNumber",
      label: " Numer Prawa Wykonywania Zawodu (NPWZ)",
      type: "number",
      typ: "input",
      required: true,
    },
    {
      name: "specjalist",
      type: "radio",
      label:
        "Jestem w trakcie specjalizacji z anestezjologii i intensywnej terapii",
      options: ["tak", "nie"],
      typ: "radio",
      required: true,
    },
    {
      name: "specialist2",
      type: "radio",
      label: "Jestem specjalistą anestezjologii i intensywnej terapii",
      options: ["tak", "nie"],
      typ: "radio",
      required: true,
    },
    {
      name: "lastcourse",
      type: "radio",
      label: " Czy bieżący kurs jest ostatnim z cyklu kursów CEEA?",
      options: ["tak", "nie"],
      typ: "radio",
      required: true,
    },
    
   
   
    {
      type: 'invoice',
      title: 'Dane do faktury',
      fields: [
        {
          name: "invoiceName",
          label: "Nazwa firmy/imię i nazwisko",
          type: "text",
          typ: "input",
        },
        { name: "invoiceStreet", label: "Ulica", type: "text", typ: "input" },
        {
          name: "invoiceNumberHome",
          label: "Numer domu",
          type: "text",
          typ: "input",
        },
        {
          name: "invoiceZipCode",
          label: "Kod pocztowy",
          type: "text",
          typ: "input",
        },
        { name: "invoiceCity", label: "Miasto", type: "text", typ: "input" },
        { name: "invoiceNip", label: "NIP", type: "text", typ: "input" },
      ],
    },
   
    {
      name: "yearSpecialist",
      label: "Rok specjalizacji",
      options: ["Nie dotyczy", "1", "2", "3", "4", "5"],
      typ: "list",
    },
    {
      name: "dishes",
      label: "W przypadku wybrania posiłków:",
      options: [
        "Proszę wybrać dania",
        "Dania wegetariańskie",
        "Dania wegańskie",
        "Dania z mięsem",
      ],
      typ: "list",
    },
    {
      name: "breakfast",
      label: "Warsztaty - wentylacja mechaniczna ",
      price: 100,
      typ: "checkbox",
    },
    {
      name: "dinner",
      label: "Obiad w drugim i trzecim dniu kursu ",
      price: 90,
      typ: "checkbox",
    },
    {
      name: "super",
      label: "Kolacja w drugi dzień kursu",
      price: 200,
      typ: "checkbox",
    },

    {
      typ: "consent",
      content: [
        {
          title: "Zgody na przetwarzanie danych osobowych:",
          description:
            "Zgoda na przetwarzanie danych osobowych jest dobrowolna, ale niezbędna do udziału w kursie. Zgoda może być w każdej chwili wycofana. Wycofanie zgody nie wpływa na zgodność z prawem przetwarzania, którego dokonano na podstawie zgody przed jej wycofaniem. Wycofanie zgody może nastąpić poprzez wysłanie wiadomości na adres",
          typ: "checkbox",
          label:
            "Nie wyrażam zgody na utrwalanie wizerunku podczas Kursu (zdjęcia, nagrania).",
          name: "wyrazamZgode",
        },
        {
          title: "Uwaga",
          description:
            "Potwierdzenie rejestracji oraz faktura za udział w kursie zostaną przesłane na wskazany adres mailowy po opłaceniu przelewem kosztów udziału w kursie.",
        },
      ],
    },
  ]

  const defaultPrice = 1500
  const oplatyDodatkowe = [
    {
      name: "breakfast",
      label: "Warsztaty - monitorowanie hemodynamiczne",
      price: 100,
      typ: "checkbox",
    },
    {
      name: "dinner",
      label: "Obiad z napojami i deserem w drugi i trzeci dzień kursu",
      price: 180,
      typ: "checkbox",
    },
    {
      name: "super",
      label: "Kolacja w drugi dzień kursu",
      price: 200,
      typ: "checkbox",
    },
  ]

  const emailjsConfig = {
    serviceId: "service_r6jzpbd",
    templateId: "template_1mhvytc",
    userId: "sUtJzifkBSdcRbC_M",
  }

  const successMessage = "Zapisano na kurs!"
  const apiEndpoint =
    "https://us-central1-ceea-poznan-426120.cloudfunctions.net/sendgrid"

  const total = oplatyDodatkowe.reduce((sum, item) => {
    return form[item.name] ? sum + item.price : sum
  }, defaultPrice)

  const handleChange = (e, type) => {
    const { name, checked, value } = e.target

    setForm(prev => {
      const updatedForm = { ...prev }

      if (type === "checkbox") {
        updatedForm[name] = checked
      } else if (type === "radio") {
        updatedForm[name] = value

        const brakfast2 = oplatyDodatkowe.reduce(
          (sum, item) => (updatedForm[item.name] ? sum + item.price : sum),
          defaultPrice
        )
        updatedForm.total = brakfast2
      } else {
        updatedForm[name] = value
      }

      return updatedForm
    })
  }

  return (
    <div className=" py-20 max-w-6xl max-md:mx-auto gap-32 flex flex-col xl:flex-row justify-between">
      <div className="max-w-3xl max-xl:mx-auto md:w-3/4">
        <Title tag="h1">Formularz rejestracyjny</Title>
        <Paragraph>
          Kurs:{" "}
          <span className="font-medium">
            {data.activeCourse.nodes[0].nameCourse}
          </span>
        </Paragraph>
        <Form
          allFields={allFields}
          buttonText="Wyślij zgłoszenie"
          handleChange={handleChange}
          form={form}
          setForm={setForm}
          initialFormState={initialFormState}
          formRef={formRef}
          emailjsConfig={emailjsConfig}
          isRegisterForm={isRegisterForm}
          saveToAirtable={saveToAirtable}
          successMessage={successMessage}
          apiEndpoint={apiEndpoint}
          total={total}
        />
      </div>
      <SideInfoPanel money={total} time={data.activeCourse.nodes[0].courseDuration} available="dostępne" />
    </div>
  )
}

export default FormRegister
