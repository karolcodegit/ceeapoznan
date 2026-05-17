import React, { useState } from "react"
import { graphql } from "gatsby"
import { motion, AnimatePresence } from "framer-motion"
import Book from "../components/Book/Book"
import Seo from "../components/seo"
import Input from "../components/Input/Input"
import Label from "../components/Label/Label"

// --- Animacje ---

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const slideDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const bookItem = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.3 },
  },
}

const emptyState = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
}

// --- Komponent ---

const Books = ({ data }) => {
  const {
    allDatoCmsBook: { nodes },
  } = data

  const [inputValue, setInputValue] = useState("")

  const handleInputChange = e => {
    setInputValue(e.target.value)
  }

  const searchBooks = (books, query) => {
    return books.filter(book =>
      book.title.toLowerCase().includes(query.toLowerCase())
    )
  }

  const filteredBooks = searchBooks(nodes, inputValue)

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Sekcja wyszukiwarki */}
      <motion.div
        className="flex justify-end py-20"
        variants={slideDown}
      >
        <div className="mr-4">
          <Label name="Wyszukiwarka: " />
        </div>
        <motion.div
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Input
            label="Wyszukiwarka:"
            type="text"
            name="name"
            value={inputValue}
            onChange={handleInputChange}
          />
        </motion.div>
      </motion.div>

      {/* Lista książek z animacją filtrowania */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {filteredBooks.length > 0 ? (
            filteredBooks.map(book => (
              <motion.div
                key={book.originalId || book.id}
                variants={bookItem}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <Book {...book} />
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty"
              className="text-center py-16 text-gray-500 dark:text-gray-400"
              variants={emptyState}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.p
                className="text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Nie znaleziono książek pasujących do wyszukiwania.
              </motion.p>
              <motion.p
                className="text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Spróbuj wpisać inną frazę.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export const query = graphql`
  query MyQuery {
    allDatoCmsBook(sort: { year: DESC }) {
      nodes {
        originalId
        title
        stockQuantity
        price
        publisher
        editor
        year
        reprint
        printOnDemand
        additionalInformation
        covertype
        available
        image {
          fluid {
            src
          }
        }
      }
    }
  }
`

export const Head = () => <Seo title="Książki" />

export default Books
