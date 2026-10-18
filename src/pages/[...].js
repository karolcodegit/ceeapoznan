// src/pages/kursy/[...].js — client-only route: /kursy/{rok}/{slug}/*
// Obsługuje WSZYSTKIE widoki kursu z danych Supabase (bez DatoCMS):
//   /kursy/{rok}/{slug}                    → strona kursu (opis + program)
//   /kursy/{rok}/{slug}/szczegoly          → szczegóły (hotel, płatności)
//   /kursy/{rok}/{slug}/rejestracja        → formularz rejestracji
//   /kursy/{rok}/{slug}/rejestracja/formularz-wyslany → strona sukcesu
import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { motion } from "framer-motion"
import Title from "../components/Title/Title"
import Paragraph from "../components/Paragraph/Paragraph"
import Line from "../components/Line/Line"
import Button from "../components/Button/Button"
import SideInfoPanel from "../components/SideInfoPanel/SideInfoPanel"
import { slugify } from "../utils/slugify"
import StyledMarkdown from "../components/StyledMarkdown/StyledMarkdown"
import { FaFacebook } from "react-icons/fa"
import { getYearFromDate } from "../utils/getYearFromDate"
import CourseProgram from "../templates/CourseProgram"

import FormRegister from "../components/Form/FormRegister"
import Seo from "../components/seo"
import CourseDetails from "../templates/course-details"

// --- API ---

const API_URL =
  process.env.GATSBY_REGISTER_ENDPOINT // ← podmień, jeśli nie masz env

// --- Animacje (strona kursu) ---

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}
const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}
const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
}
const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
}
const viewportSettings = { once: true, margin: "-60px" }

// --- Komponent główny ---

const CourseClient = ({ location }) => {
  const segments = location.pathname.split("/").filter(Boolean)
  // ["kursy", rok, slug, (sub)]
  const slug = segments[2] || ""
  const sub = (segments[3] || "").toLowerCase() // "" | "szczegoly" | "rejestracja" | "formularz-wyslany"

  const [course, setCourse] = useState(undefined) // undefined = ładowanie, null = nie znaleziono
  const [company, setCompany] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch(`${API_URL}/courses`)
      .then(r => {
        if (!r.ok) throw new Error("courses")
        return r.json()
      })
      .then(({ courses }) => {
        if (cancelled) return
        const found = (courses || []).find(c => slugify(c.title) === slug)
        setCourse(found || null)
      })
      .catch(() => { if (!cancelled) setCourse(null) })

    fetch(`${API_URL}/company`)
      .then(r => (r.ok ? r.json() : null))
      .then(j => { if (!cancelled && j) setCompany(j.company) })
      .catch(() => {})

    return () => { cancelled = true }
  }, [slug])

  // Ładowanie
  if (course === undefined) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Ładowanie…</span>
      </div>
    )
  }

  // Nie znaleziono
  if (course === null) {
    return (
      <div className="py-32 max-w-2xl mx-auto px-6 text-center">
        <Title tag="h1" className="text-3xl font-bold mb-4">Nie znaleziono kursu</Title>
        <Paragraph className="text-gray-600 dark:text-gray-400 mb-8">
          Kurs o adresie <code className="text-sm bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">{location.pathname}</code> nie istnieje lub został przeniesiony.
        </Paragraph>
        <Link to="/kursy" className="inline-flex items-center gap-2 bg-[#016ABA] text-white font-semibold py-3 px-8 rounded-xl shadow hover:opacity-90 transition">
          ← Wróć do listy kursów
        </Link>
      </div>
    )
  }

  // ===== WIDOK: /szczegoly =====
  if (sub === "szczegoly") {
    return (
      <>
        <Seo title={`${course.title} — szczegóły — CEEA`} />
        <CourseDetails course={course} company={company} />
      </>
    )
  }

  // ===== WIDOK: /rejestracja =====
  if (sub === "rejestracja") {
    // FormRegister oczekuje kształtu DatoCMS → syntetyzujemy z pól Supabase
    const availableCourse = course.available
      ? {
          originalId: course.course_id,
          courseCost: course.price,
          available: course.available,
          courseDuration: course.points,
          nameCourse: course.title,
        }
      : null

    const registerFormNode = {
      positioncheckbox: (Array.isArray(course.meal_options) ? course.meal_options : []).map(
        (m, i) => ({ id: m.id || `opt-${i}`, price: m.price, label: m.label, available: m.available })
      ),
      dish: (Array.isArray(course.dishes) ? course.dishes : []).map(d => ({ dish: d.name })),
    }

    return (
      <>
        <Seo title={`Rejestracja — ${course.title} — CEEA`} />
        <div className="max-w-6xl mx-auto">
          <FormRegister
            data={{ allDatoCmsRegisterform: { nodes: [registerFormNode] } }}
            availableCourse={availableCourse}
          />
        </div>
      </>
    )
  }

  // ===== WIDOK: /rejestracja/formularz-wyslany =====
  if (sub === "formularz-wyslany") {
    return (
      <div className="py-24 max-w-xl mx-auto px-6 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-500/15 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <Title tag="h1" className="text-3xl font-bold mb-4">Formularz wysłany</Title>
        <Paragraph className="text-gray-600 dark:text-gray-400 mb-8">
          Dziękujemy za rejestrację na kurs „{course.title}”. Potwierdzenie oraz dane do płatności otrzymasz mailem.
        </Paragraph>
        <Link to="/kursy" className="inline-flex items-center gap-2 bg-[#016ABA] text-white font-semibold py-3 px-8 rounded-xl shadow hover:opacity-90 transition">
          Wróć do listy kursów
        </Link>
      </div>
    )
  }

  // ===== WIDOK: strona kursu (domyślna) =====
  const days = Array.isArray(course.program) ? course.program : []

  return (
    <>
      <Seo title={`${course.title} — CEEA`} />
      <motion.div
        className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 gap-12 lg:gap-20 flex flex-col lg:flex-row justify-between"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {/* Lewa kolumna - treść */}
        <div className="max-w-3xl w-full">
          <motion.section
            className="border-b border-gray-200 dark:border-gray-700 pb-10"
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={staggerContainer}
          >
            <motion.div variants={slideLeft}>
              <Title tag="h1" className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {course.title}
              </Title>
              <Line />
            </motion.div>
            <motion.div variants={slideUp} className="mt-6">
              <CourseProgram text={course.description} />
            </motion.div>
          </motion.section>

          {/* Program kursu */}
          <motion.section
            className="pt-16"
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={staggerContainer}
          >
            <motion.div className="py-10" variants={slideLeft}>
              <Title tag="h2" className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Program kursu
              </Title>
              <Line />
            </motion.div>

            <div className="space-y-10">
              {days.length === 0 ? (
                <motion.div
                  className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6"
                  variants={scaleIn}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <Paragraph className="text-lg text-amber-800 dark:text-amber-200 font-medium">
                      Plan w trakcie tworzenia
                    </Paragraph>
                  </div>
                </motion.div>
              ) : (
                days.map((day, index) => {
                  const events = (Array.isArray(day.events)
                    ? day.events
                    : String(day.events || "").split("\n")
                  ).map(e =>
                    (e && typeof e === "object" ? (e.event ?? "") : String(e ?? "")).toString().trim()
                  ).filter(Boolean)

                  return (
                    <motion.div key={index} className="relative" variants={slideUp}>
                      <div className="flex items-center md:gap-4 mb-6">
                        <div className="flex-shrink-0 md:w-12 md:h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center" />
                        <div>
                          <Title tag="h3" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            Dzień {index + 1}
                          </Title>
                          {day.date && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                              {day.date}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="md:ml-6 md:pl-10 md:border-l-2 md:border-gray-200 dark:border-gray-700 space-y-1">
                        {events.map((eventLine, eventIndex) => {
                          const isFacebookLink = eventLine.includes("facebook.com")
                          const isWorkshop = eventLine.toLowerCase().includes("warsztat")

                          return (
                            <motion.div
                              key={eventIndex}
                              className={`relative py-3 ${
                                isWorkshop
                                  ? "bg-blue-50 dark:bg-blue-900/20 -ml-10 pl-10 pr-4 rounded-r-lg border-l-4 border-blue-500"
                                  : ""
                              }`}
                            >
                              {isFacebookLink ? (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                    <FaFacebook className="text-xl" />
                                    <span className="font-semibold text-sm">Facebook:</span>
                                  </div>
                                  <StyledMarkdown>{eventLine}</StyledMarkdown>
                                </div>
                              ) : (
                                <div className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                                  {isWorkshop && (
                                    <span className="inline-flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-semibold mb-1">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                      </svg>
                                      Warsztaty
                                    </span>
                                  )}
                                  <StyledMarkdown>{eventLine}</StyledMarkdown>
                                </div>
                              )}
                            </motion.div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </motion.section>

          {(course.info_description || course.participation_condition) && (
            <motion.div
              className="flex justify-start mt-12"
              initial="hidden"
              whileInView="visible"
              viewport={viewportSettings}
              variants={slideUp}
            >
              <Button
                href={`/kursy/${getYearFromDate(course.start_date || course.date_label)}/${slug}/szczegoly`}
                variant="notify"
              >
                Szczegółowe informacje o kursie
              </Button>
            </motion.div>
          )}
        </div>

        {/* Prawa kolumna - panel boczny */}
        <motion.div
          className="w-full lg:w-auto lg:min-w-[320px]"
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={slideLeft}
        >
          <SideInfoPanel
            money={course.price}
            time={course.date_label}
            available={course.available}
            nameCourse={course.title}
            date={course.date_label}
          />
        </motion.div>
      </motion.div>
    </>
  )
}

export default CourseClient
