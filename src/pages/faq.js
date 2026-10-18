import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Title from "../components/Title/Title"
import Paragraph from "../components/Paragraph/Paragraph"
import FaqItem from "../components/FaqItem/FaqItem"
import Seo from "../components/seo"

// --- API ---

const API_URL =
  process.env.GATSBY_REGISTER_ENDPOINT

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.15,
    },
  },
}

const slideLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
}

const slideRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
}

const faqItemAnim = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

// Ustawienia viewport – animacje odpalają się przy przewijaniu
const viewportSettings = {
  once: true,
  margin: "-80px",
}

// --- Komponent ---

const Faq = () => {
  const [faq, setFaq] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  

  useEffect(() => {
    let cancelled = false
    console.log("API_URL =", API_URL)
    fetch(`${API_URL}/faq`)
        .then(r => {
          if (!r.ok) throw new Error("Nie udało się pobrać pytań i odpowiedzi.")
          return r.json()
        })
      
      .then(({ faq }) => {
        if (!cancelled) setFaq(faq || [])
      })
      .catch(e => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    // bez interwału – FAQ to treść statyczna, odświeża się wejściem na stronę
    return () => { cancelled = true }
  }, [])

  return (
    <>
      {/* Stany: ładowanie / błąd */}
      {loading && (
        <p className="text-center py-16 text-gray-500 dark:text-gray-400">
          Ładowanie…
        </p>
      )}
      {!loading && error && (
        <p className="text-center py-16 text-red-600 dark:text-red-400">{error}</p>
      )}

      {!loading && !error && (
        <motion.div
          className="mx-auto px-4 md:px-0"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="gap-8 grid grid-cols-1 lg:grid-cols-12 py-24">
            {/* Lewa kolumna - tytuł + opis */}
            <motion.div
              className="lg:col-span-5"
              initial="hidden"
              whileInView="visible"
              viewport={viewportSettings}
              variants={staggerContainer}
            >
              <motion.div variants={slideLeft}>
                <Title tag="h2">Częste pytania</Title>
              </motion.div>
              <motion.div variants={slideLeft}>
                <Paragraph>
                  Nie możesz znaleźć odpowiedzi, której szukasz? Skontaktuj się z
                  naszym działem obsługi klienta.
                </Paragraph>
              </motion.div>
            </motion.div>

            {/* Prawa kolumna - lista FAQ */}
            <motion.div
              className="lg:col-span-7"
              initial="hidden"
              whileInView="visible"
              viewport={viewportSettings}
              variants={staggerContainer}
            >
              <dl>
                {faq.map((item, index) => (
                  <motion.div key={index} variants={faqItemAnim}>
                    <FaqItem
                      question={item.question}
                      answer={item.answer}
                    />
                  </motion.div>
                ))}
              </dl>
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  )
}

export const Head = () => <Seo title="Faq" />

export default Faq
