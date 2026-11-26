import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { motion } from "framer-motion"

import ContactBox from "../components/ContactBox/ContactBox"
import ContactForm from "../components/Form/ContactForm"
import PageHeroV2 from "../components/PageHeroV2/PageHeroV2"
import Seo from "../components/seo"

const API_URL = process.env.GATSBY_REGISTER_ENDPOINT

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const Contact2 = () => {
  const [company, setCompany] = useState(null)
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    let cancelled = false

    fetch(`${API_URL}/company`)
      .then(r => {
        if (!r.ok) throw new Error("company")
        return r.json()
      })
      .then(({ company: data }) => {
        if (!cancelled) setCompany(data)
      })
      .catch(() => {})

    fetch(`${API_URL}/employees?role=Administracja`)
      .then(r => {
        if (!r.ok) throw new Error("employees")
        return r.json()
      })
      .then(({ employees: list }) => {
        if (!cancelled) setEmployees(list || [])
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-gray-100">
      <PageHeroV2
        title="Kontakt"
        subtitle="Jesteśmy do Twojej dyspozycji"
        description="Masz pytania o kursy, zapisy lub książki? Napisz lub zadzwoń — odpowiemy możliwie szybko."
        crumbs={[
          { label: "Strona główna", to: "/home2/" },
          { label: "Kontakt" },
        ]}
        actions={
          <Link
            to="/faq2/"
            className="inline-flex rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
          >
            Zobacz FAQ
          </Link>
        }
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="grid gap-10 lg:grid-cols-12"
        >
          <motion.div variants={fadeUp} className="lg:col-span-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#002C7C] dark:text-sky-300">
              Skontaktuj się z nami
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Jeżeli nurtują Cię jakiekolwiek wątpliwości, z radością odpowiemy
              na Twoje pytania.
            </p>
          </motion.div>
          <motion.div
            variants={stagger}
            className="grid gap-5 sm:grid-cols-2 lg:col-span-8"
          >
            {employees.map((employee, index) => (
              <motion.div
                key={`${employee.surname}-${index}`}
                variants={fadeUp}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-900"
              >
                <ContactBox
                  name={`${employee.name} ${employee.surname}`}
                  phone={employee.phone}
                  secondPhone={employee.second_phone}
                  email={employee.email}
                  degree={employee.degree}
                />
              </motion.div>
            ))}
            {employees.length === 0 && (
              <p className="text-slate-500 dark:text-slate-400 sm:col-span-2">
                Ładowanie danych kontaktowych…
              </p>
            )}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-slate-100 dark:bg-slate-900/80 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="grid gap-10 lg:grid-cols-12"
          >
            <motion.div variants={fadeUp} className="lg:col-span-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#002C7C] dark:text-sky-300">
                {company?.name_company || "Dane fundacji"}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Adres korespondencyjny oraz dane rejestrowe ośrodka.
              </p>
            </motion.div>
            <motion.div
              variants={stagger}
              className="grid gap-5 sm:grid-cols-2 lg:col-span-8"
            >
              <motion.div
                variants={fadeUp}
                className="rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-950"
              >
                <ContactBox
                  place={`${company?.street || ""} ${
                    company?.number_home || ""
                  }`}
                  place2={`${company?.zip_code || ""} ${company?.city || ""}`}
                  email={company?.email}
                />
              </motion.div>
              <motion.div
                variants={fadeUp}
                className="rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-950"
              >
                <ContactBox
                  name={company?.name_company}
                  account={company?.bank_account}
                  regon={company?.regon}
                  nip={company?.nip}
                  krs={company?.krs}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#002C7C] dark:text-sky-300">
            Formularz kontaktowy
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Wyślij wiadomość — odezwiemy się na wskazany adres e-mail.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-[#F7F4EF] p-4 sm:p-8 dark:border-slate-700 dark:bg-slate-900">
          <ContactForm />
        </div>
      </section>
    </div>
  )
}

export const Head = () => <Seo title="Kontakt — wariant 2" />
export default Contact2
