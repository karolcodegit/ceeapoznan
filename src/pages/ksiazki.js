import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Book from "../components/Book/Book"
import Seo from "../components/seo"
import Input from "../components/Input/Input"
import Label from "../components/Label/Label"

// --- Animacje (bez zmian) ---

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
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const bookItem = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3 } },
}

const emptyState = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
}

// --- API ---

const API_URL =
  process.env.GATSBY_REGISTER_ENDPOINT

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5'%3E%3C/svg%3E"

// Mapowanie wiersza Supabase -> props komponentu Book
function mapProduct(p) {
  return {
    originalId: p.datocms_id,
    title: p.name,
    editor: p.author,
    price: p.price,
    publisher: p.publisher,
    year: p.year,
    covertype: p.cover_type,
    available: p.available,
    reprint: p.reprint,
    printOnDemand: p.print_on_demand,
    additionalInformation: p.additional_info,
    stockQuantity: Number(p.stock_quantity) || 0,
    image: { fluid: { src: p.image_url || PLACEHOLDER_IMG } },
  }
}

// --- Komponent ---

const Books = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    let cancelled = false

    const load = () =>
      fetch(`${API_URL}/products`)
        .then(r => {
          if (!r.ok) throw new Error("Nie udało się pobrać listy książek.")
          return r.json()
        })
        .then(({ products }) => {
          if (!cancelled) setBooks((products || []).map(mapProduct))
        })
        .catch(e => {
          if (!cancelled) setError(e.message)
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })

    load()
    // odświeżanie stanu co 60 s – wyczerpany stan szybko znika ze strony
    const t = setInterval(load, 60_000)
    return () => { cancelled = true; clearInterval(t) }
  }, [])

  const handleInputChange = e => setInputValue(e.target.value)

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(inputValue.toLowerCase())
  )

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
      {/* Sekcja wyszukiwarki */}
      <motion.div className="flex justify-end py-20" variants={slideDown}>
        <div className="mr-4">
          <Label name="Wyszukiwarka: " />
        </div>
        <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Input
            label="Wyszukiwarka:"
            type="text"
            name="name"
            value={inputValue}
            onChange={handleInputChange}
          />
        </motion.div>
      </motion.div>

      {/* Stany: ładowanie / błąd */}
      {loading && (
        <p className="text-center py-16 text-gray-500 dark:text-gray-400">
          Ładowanie książek…
        </p>
      )}
      {!loading && error && (
        <p className="text-center py-16 text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Lista książek z animacją filtrowania */}
      {!loading && !error && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <AnimatePresence mode="popLayout">
            {filteredBooks.length > 0 ? (
              filteredBooks.map(book => (
                <motion.div
                  key={book.originalId}
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
                <motion.p className="text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  Nie znaleziono książek pasujących do wyszukiwania.
                </motion.p>
                <motion.p className="text-sm mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  Spróbuj wpisać inną frazę.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  )
}

export const Head = () => <Seo title="Książki" />

export default Books
