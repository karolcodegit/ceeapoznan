import React from "react"
import { graphql } from "gatsby"
import ContactBox from "../components/ContactBox/ContactBox"
import ContactForm from "../components/Form/ContactForm"
import Seo from "../components/seo"
import Title from "../components/Title/Title"


const Contact = ({ data: { datoCmsCompany, allDatoCmsEmployee } }) => {
  const {
    nameCompany,
    street,
    numberHome,
    city,
    zipCode,
    regon,
    nip,
    krs,
    bankAccount,
    mail,
  } = datoCmsCompany

  const onSubmit = (formData) => {
    //console.log("Formularz wysłany:", formData);
  };

  return (
    <>
      

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-20 mx-auto py-24 border-b ">
        <div className="flex flex-col gap-4">
          <Title tag="h2">Skontaktuj się z nami</Title>
          <span className="text-sm font-normal dark:text-gray-300">
            Jeżeli nurtują Cię jakiekolwiek wątpliwości, z radością odpowiemy na
            Twoje pytania. Skontaktuj się z nami bez wahania.
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 col-span-2">
          {allDatoCmsEmployee.nodes.map(employee => (
            <ContactBox
              key={employee.surname}
              name={`${employee.name} ${employee.surname}`}
              phone={employee.phone}
              secondPhone={employee.secondPhone}
              email={employee.mail}
              degree={employee.degree}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10 mx-auto py-20 px-4 border-b">
        <div className="">
          <Title tag="h2">{nameCompany}</Title>
        </div>
        <div className="grid md:grid-cols-2 gap-8 col-span-2 items-start">
          <ContactBox
              place={`ul.${street} ${numberHome}`}
              place2={`${zipCode} ${city}`}
              email={mail}
            /> 
          <ContactBox
            name={nameCompany}
            account={bankAccount}
            regon={regon}
            nip={nip}
            krs={krs}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-20 gap-y-10 mx-auto py-10 px-4 items-center">
        <div className="flex-1  ">
        <ContactForm
            // airtableSaveFn={saveToAirtable}
           
            // notification={{ show: (msg) => toast.success(msg) }}
            // onSubmit={onSubmit}
          />
        </div>
      </div>

      {/* <GoogleMaps companyData={datoCmsCompany} /> */}
    </>
  )
}

export const query = graphql`
  query Query {
    datoCmsCompany {
      nameCompany
      street
      numberHome
      city
      zipCode
      regon
      nip
      krs
      bankAccount
      mail
    }
    allDatoCmsEmployee(filter: { role: { eq: "Administracja" } }) {
      nodes {
        name
        surname
        phone
        degree
        secondPhone
        mail
      }
    }
  }
`

export const Head = () => <Seo title="Kontakt" />

export default Contact
