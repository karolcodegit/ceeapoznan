import React from "react"
import { motion } from "framer-motion"

import { graphql } from "gatsby"
import Title from "../components/Title/Title"
import Paragraph from "../components/Paragraph/Paragraph"
import FaqItem from "../components/FaqItem/FaqItem"
import Seo from "../components/seo"


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

const Faq = ({ data }) => {
  return (
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
            {data.allDatoCmsFaq.nodes[0].questionanswer.map((faq, index) => (
              <motion.div
                key={index}
                variants={faqItemAnim}
              >
                <FaqItem
                  question={faq.question}
                  answer={faq.answer}
                />
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>
    </motion.div>
  )
}

export const query = graphql`
  query faq {
    allDatoCmsFaq {
      nodes {
        questionanswer {
          question
          answer
        }
      }
    }
  }
`

export const Head = () => <Seo title="Faq" />

export default Faq
