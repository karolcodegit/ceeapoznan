import React from "react"
import { graphql } from "gatsby"
import { motion } from "framer-motion"
import ContactBox from "../components/ContactBox/ContactBox"
import ContactForm from "../components/Form/ContactForm"
import Seo from "../components/seo"
import Title from "../components/Title/Title"




const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const slideRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

const separatorLine = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeInOut" },
  },
}

// --- Komponent ---

const Contact = ({ data: { datoCmsCompany, allDatoCmsEmployee } }) => {
  const {
    requireToken = true,
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Sekcja: Skontaktuj się z nami + Pracownicy */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-20 mx-auto py-24 border-b"
        variants={staggerContainer}
      >
        {/* Lewa kolumna - tytuł + opis */}
        <motion.div className="flex flex-col gap-4" variants={slideLeft}>
          <Title tag="h2">Skontaktuj się z nami</Title>
          <motion.span
            className="text-sm font-normal dark:text-gray-300"
            variants={slideUp}
          >
            Jeżeli nurtują Cię jakiekolwiek wątpliwości, z radością odpowiemy na
            Twoje pytania. Skontaktuj się z nami bez wahania.
          </motion.span>
        </motion.div>

        {/* Prawa kolumna - pracownicy */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 col-span-2"
          variants={staggerContainer}
        >
          {allDatoCmsEmployee.nodes.map((employee, index) => (
            <motion.div
              key={employee.surname}
              variants={scaleIn}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
            >
              <ContactBox
                name={`${employee.name} ${employee.surname}`}
                phone={employee.phone}
                secondPhone={employee.secondPhone}
                email={employee.mail}
                degree={employee.degree}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Separator z animacją */}
      <motion.div
        className="border-b origin-left"
        variants={separatorLine}
      />

      {/* Sekcja: Dane firmy + Adres / Konto bankowe */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10 mx-auto py-20 px-4 border-b"
        variants={staggerContainer}
      >
        {/* Lewa kolumna - nazwa firmy */}
        <motion.div variants={slideLeft}>
          <Title tag="h2">{nameCompany}</Title>
        </motion.div>

        {/* Prawa kolumna - adres + dane firmy */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 col-span-2 items-start"
          variants={staggerContainer}
        >
          <motion.div
            variants={slideUp}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <ContactBox
              place={`ul.${street} ${numberHome}`}
              place2={`${zipCode} ${city}`}
              email={mail}
            />
          </motion.div>

          <motion.div
            variants={slideUp}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <ContactBox
              name={nameCompany}
              account={bankAccount}
              regon={regon}
              nip={nip}
              krs={krs}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Separator z animacją */}
      <motion.div
        className="border-b origin-left"
        variants={separatorLine}
      />

      {/* Sekcja: Formularz kontaktowy */}
      <motion.div
        className="grid grid-cols-1 gap-x-20 gap-y-10 mx-auto py-10 px-4 items-center"
        variants={staggerContainer}
      >
        <motion.div
          className="flex-1"
          variants={slideUp}
        >
          <ContactForm />
        </motion.div>
      </motion.div>
    </motion.div>
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
