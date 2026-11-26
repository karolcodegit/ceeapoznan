import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { motion } from "framer-motion"

import FaqItem from "../components/FaqItem/FaqItem"
import PageHeroV2 from "../components/PageHeroV2/PageHeroV2"
import Seo from "../components/seo"

const API_URL = process.env.GATSBY_REGISTER_ENDPOINT

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const Faq2 = () => {
  const [faq, setFaq] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch(`${API_URL}/faq`)
      .then(r => {
        if (!r.ok) throw new Error("Nie udało się pobrać pytań i odpowiedzi.")
        return r.json()
      })
      .then(({ faq: list }) => {
        if (!cancelled) setFaq(list || [])
      })
      .catch(e => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-gray-100">
      <PageHeroV2
        title="FAQ"
        subtitle="Częste pytania"
        description="Szybkie odpowiedzi na najczęściej zadawane pytania o kursy, zapisy i organizację szkoleń CEEA."
        crumbs={[
          { label: "Strona główna", to: "/home2/" },
          { label: "FAQ" },
        ]}
        actions={
          <Link
            to="/kontakt2/"
            className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#002C7C] transition hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
          >
            Napisz do nas
          </Link>
        }
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {loading && (
          <div className="flex items-center justify-center py-20" role="status">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-[#0C6478] border-t-transparent"
              aria-hidden="true"
            />
            <span className="ml-3 text-slate-600 dark:text-slate-400">
              Ładowanie…
            </span>
          </div>
        )}

        {!loading && error && (
          <p className="py-16 text-center text-rose-700 dark:text-rose-400">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#002C7C] dark:text-sky-300">
                Nie znalazłeś odpowiedzi?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Skontaktuj się z naszym działem obsługi — chętnie pomożemy.
              </p>
              <Link
                to="/kontakt2/"
                className="mt-6 inline-flex rounded-full bg-[#002C7C] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0C6478] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317] dark:bg-sky-600 dark:hover:bg-sky-500"
              >
                Przejdź do kontaktu
              </Link>
            </div>
            <motion.dl
              className="lg:col-span-8 space-y-2"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {faq.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  className="break-words rounded-2xl border border-slate-200 bg-slate-50 px-2 sm:px-3 dark:border-slate-700 dark:bg-slate-900"
                >
                  <FaqItem question={item.question} answer={item.answer} />
                </motion.div>
              ))}
              {faq.length === 0 && (
                <p className="text-slate-500 dark:text-slate-400">
                  Brak pytań do wyświetlenia.
                </p>
              )}
            </motion.dl>
          </div>
        )}
      </section>
    </div>
  )
}

export const Head = () => <Seo title="FAQ — wariant 2" />
export default Faq2
