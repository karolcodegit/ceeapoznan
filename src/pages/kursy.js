import React, { useEffect, useState } from "react"
import { Link, graphql } from "gatsby"
import { motion } from "framer-motion"

import Seo from "../components/seo"
import Title from "../components/Title/Title"
import { slugify } from "../utils/slugify"
import { getYearFromDate } from "../utils/getYearFromDate"


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

const Courses = ({ data }) => {
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)

    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth)
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  if (!data) {
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

  const {
    allDatoCmsCourse: { nodes },
  } = data

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
        const courseSlug = slugify(course.nameCourse)

        return (
          <motion.div
            key={course.id}
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 z-0 overflow-hidden group"
            style={{
              backgroundImage: `url(${course.image.fluid.src})`,
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

            <Link to={`/kursy/${getYearFromDate(course.date)}/${courseSlug}`}>
              <div className="relative z-10 flex flex-col h-full gap-6">
                {/* Tytuł kursu */}
                <motion.div variants={titleSlide}>
                  <Title white tag="h5">
                    Kurs nr {course.numerCourse}
                  </Title>
                </motion.div>

                <motion.div variants={titleSlide}>
                  <Title white tag="h4" className="text-white dark:text-gray-200">
                    {course.nameCourse}
                  </Title>
                </motion.div>

                {/* Informacje o kursie */}
                <div className="flex justify-between mt-auto text-white dark:text-gray-300">
                  <motion.p
                    className="text-white dark:text-gray-200"
                    variants={titleSlide}
                  >
                    {course.date || "Brak daty"}
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

export const query = graphql`
  query MyQuery {
    allDatoCmsCourse(
      filter: { archive: { ne: true } }
      sort: { numerCourse: ASC }
    ) {
      nodes {
        id
        nameCourse
        date
        numerCourse
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

export const Head = () => <Seo title="Kursy" />

export default Courses
