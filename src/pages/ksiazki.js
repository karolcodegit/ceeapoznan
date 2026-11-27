import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

import Book from "../components/Book/Book"
import PageHeroV2 from "../components/PageHeroV2/PageHeroV2"
import Seo from "../components/seo"
import { fadeUpSoft, withReducedMotion } from "../utils/motionVariants"

const API_URL = process.env.GATSBY_REGISTER_ENDPOINT

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5'%3E%3C/svg%3E"

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

const Books2 = () => {
  const reduceMotion = useReducedMotion()
  const bookItem = {
    ...withReducedMotion(fadeUpSoft, reduceMotion),
    exit: reduceMotion
      ? { opacity: 1, transition: { duration: 0 } }
      : { opacity: 0, y: -8, transition: { duration: 0.2 } },
  }
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
    const t = setInterval(load, 60_000)
    return () => {
      cancelled = true
      clearInterval(t)
    }
  }, [])

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(inputValue.toLowerCase())
  )

  return (
    <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-gray-100">
      <PageHeroV2
        title="Książki"
        subtitle="Skrypty i publikacje CEEA"
        description="Każdy kurs CEEA znajduje podsumowanie w skrypcie dla uczestników. Poniżej oferta książek dostępnych także poza pakietem kursowym."
        crumbs={[
          { label: "Strona główna", to: "/" },
          { label: "Książki" },
        ]}
        actions={
          <>
            <Link
              to="/koszyk/"
              className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#002C7C] transition hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
            >
              Koszyk
            </Link>
            <Link
              to="/kontakt/"
              className="inline-flex rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
            >
              Zapytaj o dostępność
            </Link>
          </>
        }
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#002C7C] dark:text-sky-300 sm:text-2xl">
              Katalog
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Wyszukaj tytuł po nazwie publikacji.
            </p>
          </div>
          <label className="block w-full sm:max-w-xs">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Wyszukiwarka
            </span>
            <input
              type="search"
              name="book-search"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="np. anestezjologia…"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#0C6478] focus:ring-2 focus:ring-[#0C6478]/30 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            />
          </label>
        </div>

        {loading && (
          <div
            className="space-y-4 py-6"
            aria-busy="true"
            aria-label="Wczytywanie katalogu książek"
          >
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="py-16 text-center text-rose-700 dark:text-rose-400">
            {error}
          </p>
        )}

        {!loading && !error && (
          <AnimatePresence mode="popLayout">
            {filteredBooks.length > 0 ? (
              <ul className="space-y-4">
                {filteredBooks.map(book => (
                  <motion.li
                    key={book.originalId}
                    variants={bookItem}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-1 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:px-4"
                  >
                    <Book {...book} />
                  </motion.li>
                ))}
              </ul>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-dashed border-slate-300 bg-[#F7F4EF] px-6 py-16 text-center dark:border-slate-600 dark:bg-slate-900"
              >
                <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
                  Nie znaleziono książek pasujących do wyszukiwania.
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Spróbuj wpisać inną frazę.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </section>
    </div>
  )
}

export const Head = ({ location }) => (
  <Seo
    title="Książki i skrypty"
    description="Skrypty i publikacje CEEA Poznań do kursów anestezjologii. Książki dostępne także poza pakietem kursowym — katalog Regionalnego Centrum CEEA."
    pathname={location?.pathname || "/ksiazki/"}
  />
)
export default Books2
