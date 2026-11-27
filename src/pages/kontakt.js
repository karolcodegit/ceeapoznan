import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { motion, useReducedMotion } from "framer-motion"

import ContactBox from "../components/ContactBox/ContactBox"
import ContactForm from "../components/Form/ContactForm"
import PageHeroV2 from "../components/PageHeroV2/PageHeroV2"
import Seo from "../components/seo"
import {
  fadeUp as fadeUpBase,
  staggerContainer,
  withReducedMotion,
} from "../utils/motionVariants"

const API_URL = (process.env.GATSBY_REGISTER_ENDPOINT || "")
  .trim()
  .replace(/^['"]|['"]$/g, "")

const Contact2 = () => {
  const reduceMotion = useReducedMotion()
  const fadeUp = withReducedMotion(fadeUpBase, reduceMotion)
  const stagger = withReducedMotion(staggerContainer, reduceMotion)

  const [company, setCompany] = useState(null)
  const [employees, setEmployees] = useState([])
  const [peopleStatus, setPeopleStatus] = useState("loading") // loading | ready | error
  const [companyStatus, setCompanyStatus] = useState("loading")

  useEffect(() => {
    let cancelled = false

    if (!API_URL) {
      setPeopleStatus("error")
      setCompanyStatus("error")
      return undefined
    }

    fetch(`${API_URL}/company`)
      .then(r => {
        if (!r.ok) throw new Error("company")
        return r.json()
      })
      .then(({ company: data }) => {
        if (cancelled) return
        setCompany(data || null)
        setCompanyStatus("ready")
      })
      .catch(() => {
        if (!cancelled) {
          setCompany(null)
          setCompanyStatus("error")
        }
      })

    fetch(`${API_URL}/employees?role=${encodeURIComponent("Administracja")}`)
      .then(r => {
        if (!r.ok) throw new Error("employees")
        return r.json()
      })
      .then(payload => {
        if (cancelled) return
        const list = Array.isArray(payload?.employees)
          ? payload.employees
          : Array.isArray(payload)
            ? payload
            : []
        const admin = list
          .filter(e => !e?.role || e.role === "Administracja")
          .slice()
          .sort(
            (a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999)
          )
        setEmployees(admin)
        setPeopleStatus("ready")
      })
      .catch(() => {
        if (!cancelled) {
          setEmployees([])
          setPeopleStatus("error")
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="w-full bg-white text-slate-900 dark:bg-slate-950 dark:text-gray-100">
      <PageHeroV2
        title="Kontakt"
        subtitle="Jesteśmy do Twojej dyspozycji"
        description="Masz pytania o kursy, zapisy lub książki? Napisz lub zadzwoń — odpowiemy możliwie szybko."
        crumbs={[
          { label: "Strona główna", to: "/" },
          { label: "Kontakt" },
        ]}
        actions={
          <Link
            to="/faq/"
            className="inline-flex rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
          >
            Zobacz FAQ
          </Link>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={stagger}
          className="grid gap-8 lg:grid-cols-12 lg:gap-10"
        >
          <motion.div variants={fadeUp} className="lg:col-span-4">
            <h2 className="text-2xl font-bold text-[#002C7C] dark:text-sky-300 sm:text-3xl">
              Skontaktuj się z nami
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Administracja ośrodka — telefon, e-mail i osoby do kontaktu w
              sprawach organizacyjnych.
            </p>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
            {peopleStatus === "loading" && (
              <div
                className="grid gap-3 sm:col-span-2 sm:grid-cols-2"
                aria-busy="true"
                aria-label="Wczytywanie osób kontaktowych"
              >
                {[0, 1].map(i => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800"
                  />
                ))}
              </div>
            )}
            {peopleStatus === "error" && (
              <p
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200 sm:col-span-2"
                role="alert"
              >
                Nie udało się pobrać listy osób. Spróbuj odświeżyć stronę lub
                napisz na{" "}
                <a
                  className="font-semibold underline underline-offset-2"
                  href="mailto:sekretariat@ceea.org.pl"
                >
                  sekretariat@ceea.org.pl
                </a>
                .
              </p>
            )}
            {peopleStatus === "ready" && employees.length === 0 && (
              <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 sm:col-span-2">
                Brak osób z roli Administracja w katalogu. Skorzystaj z
                formularza poniżej lub napisz na sekretariat@ceea.org.pl.
              </p>
            )}
            {employees.map((employee, index) => (
              <ContactBox
                key={`${employee.email || employee.surname}-${index}`}
                name={`${employee.name || ""} ${employee.surname || ""}`.trim()}
                phone={employee.phone}
                secondPhone={employee.second_phone}
                email={employee.email}
                degree={employee.degree}
              />
            ))}
          </div>
        </motion.div>
      </section>

      <section className="bg-slate-100 py-10 dark:bg-slate-900/80 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={stagger}
            className="grid gap-8 lg:grid-cols-12 lg:gap-10"
          >
            <motion.div variants={fadeUp} className="lg:col-span-4">
              <h2 className="text-2xl font-bold text-[#002C7C] dark:text-sky-300 sm:text-3xl">
                {company?.name_company || "Dane fundacji"}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Adres korespondencyjny oraz dane rejestrowe ośrodka.
              </p>
              {companyStatus === "error" && (
                <p className="mt-3 text-sm text-rose-700 dark:text-rose-300" role="alert">
                  Nie udało się odświeżyć danych fundacji.
                </p>
              )}
            </motion.div>
            <motion.div
              variants={fadeUp}
              className="grid items-start gap-3 sm:grid-cols-2 lg:col-span-8"
            >
              <ContactBox
                place={`${company?.street || ""} ${company?.number_home || ""}`.trim()}
                place2={`${company?.zip_code || ""} ${company?.city || ""}`.trim()}
                email={company?.email}
              />
              <ContactBox
                name={company?.name_company}
                account={company?.bank_account}
                regon={company?.regon}
                nip={company?.nip}
                krs={company?.krs}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-sky-50/80 to-[#F7F4EF] shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
          <div className="grid lg:grid-cols-12">
            <div className="border-b border-slate-200/80 px-5 py-6 sm:px-8 sm:py-8 lg:col-span-4 lg:border-b-0 lg:border-r dark:border-slate-700">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0C6478] dark:text-sky-400">
                Napisz do nas
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#002C7C] dark:text-sky-300 sm:text-3xl">
                Formularz kontaktowy
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Odpowiemy na wskazany adres e-mail. Pola oznaczone gwiazdką są
                wymagane.
              </p>
            </div>
            <div className="px-5 py-6 sm:px-8 sm:py-8 lg:col-span-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export const Head = ({ location }) => (
  <Seo
    title="Kontakt"
    description="Kontakt CEEA Poznań — pytania o kursy, zapisy i książki. Napisz lub zadzwoń do Regionalnego Centrum CEEA w Poznaniu."
    pathname={location?.pathname || "/kontakt/"}
  />
)
export default Contact2
