import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { motion } from "framer-motion"

import Seo from "../components/seo"
import Title from "../components/Title/Title"
import { slugify } from "../utils/slugify"
import { getYearFromDate } from "../utils/getYearFromDate"

// --- API ---

const API_URL = process.env.GATSBY_REGISTER_ENDPOINT

// --- Animacje ---

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
}

const cardFadeUp = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const titleSlide = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

const badgePop = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "backOut", delay: 0.2 },
  },
}

// --- Komponent ---

const Courses = () => {
  const [windowWidth, setWindowWidth] = useState(0)

  // Kursy ze Supabase (zamiast allDatoCmsCourse)
  const [courses, setCourses] = useState(null) // null = ładowanie

  useEffect(() => {
    if (typeof window === "undefined") return
    let t
    const handleResize = () => {
      clearTimeout(t)
      t = setTimeout(() => setWindowWidth(window.innerWidth), 150)
    }
    setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(t)
    }
  }, [])

  if (courses === null) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-24"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading...</span>
      </motion.div>
    )
  }

  const nodes = courses

  const gridCols = windowWidth < 840
    ? "1fr"
    : windowWidth < 1024
    ? `repeat(${Math.min(nodes.length, 2)}, 1fr)`
    : `repeat(${Math.min(nodes.length, 3)}, 1fr)`

  return (
    <motion.div
      className="grid gap-4 py-24 relative"
      style={{ gridTemplateColumns: gridCols }}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {nodes.map((course, index) => {
        const courseSlug = slugify(course.title)

        return (
          <motion.div
            key={course.course_id}
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 z-0 overflow-hidden group"
            style={{
              backgroundImage: course.image_url ? `url(${course.image_url})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            variants={cardFadeUp}
            whileHover={{
              scale: 1.05,
              zIndex: 10,
              transition: { duration: 0.4, ease: "easeOut" },
            }}
          >
            {/* Overlay z animacją */}
            <motion.div
              className="absolute inset-0 bg-black rounded-xl"
              initial={{ opacity: 0.5 }}
              whileHover={{ opacity: 0.35 }}
              transition={{ duration: 0.3 }}
            />

            <Link to={`/kursy/${getYearFromDate(course.start_date || course.date_label)}/${courseSlug}`}>
              <div className="relative z-10 flex flex-col h-full gap-6">
                {/* Tytuł kursu */}
                <motion.div variants={titleSlide}>
                  <Title white tag="h5">
                    Kurs nr {course.course_number ?? "—"}
                  </Title>
                </motion.div>

                <motion.div variants={titleSlide}>
                  <Title white tag="h4" className="text-white dark:text-gray-200">
                    {course.title}
                  </Title>
                </motion.div>

                {/* Informacje o kursie */}
                <div className="flex justify-between mt-auto text-white dark:text-gray-300">
                  <motion.p
                    className="text-white dark:text-gray-200"
                    variants={titleSlide}
                  >
                    {course.date_label || "Brak daty"}
                  </motion.p>

                  <motion.span
                    className={`px-2 items-center inline-flex text-xs leading-5 font-semibold rounded-full ${
                      course.available
                        ? "bg-green-100 dark:bg-green-600 text-green-800 dark:text-green-200"
                        : "bg-red-100 dark:bg-red-600 text-red-800 dark:text-red-200"
                    }`}
                    variants={badgePop}
                  >
                    {course.available ? "Dostępne" : "Niedostępne"}
                  </motion.span>
                </div>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// GraphQL usunięte – kursy z /courses (filtr is_archive=false jest po stronie
// endpointu: scope=home, sortowanie po course_number jak w DatoCMS)
export const Head = () => <Seo title="Kursy" />

export default Courses
