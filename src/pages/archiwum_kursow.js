import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import Title from "../components/Title/Title"
import Seo from "../components/seo"
import { slugify } from "../utils/slugify"
import { getYearFromDate } from "../utils/getYearFromDate"

// --- API ---

const API_URL =
  process.env.GATSBY_CLOUD_API_URL ||
  process.env.GATSBY_REGISTER_ENDPOINT ||
  "https://ceea-registration-course-XXXXX.run.app" // ← podmień, jeśli nie masz env

const ArchiwumKursow = () => {
  const [windowWidth, setWindowWidth] = useState(0)
  const [courses, setCourses] = useState(null) // null = ładowanie

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setWindowWidth(window.innerWidth)
      setWindowWidth(window.innerWidth)
      window.addEventListener("resize", handleResize)

      let cancelled = false
      fetch(`${API_URL}/courses`)
        .then(r => {
          if (!r.ok) throw new Error("courses")
          return r.json()
        })
        .then(({ courses }) => {
          if (cancelled) return
          const archived = (courses || [])
            .filter(c => c.is_archive === true)
            // sort rosnąco po dacie (jak dotychczas: najstarsze pierwsze)
            .sort((a, b) => (a.start_date || "").localeCompare(b.start_date || ""))
          setCourses(archived)
        })
        .catch(() => {
          if (!cancelled) setCourses([])
        })

      return () => {
        window.removeEventListener("resize", handleResize)
        cancelled = true
      }
    }
  }, [])

  if (courses === null) {
    return <div className="py-24 text-center text-gray-400">Ładowanie…</div>
  }

  const sortedCourses = courses

  return (
    <div>
      <div
        className="grid gap-4 py-24 relative"
        style={{
          gridTemplateColumns: `${
            windowWidth < 840
              ? "1fr"
              : windowWidth < 1024
              ? `repeat(${Math.min(sortedCourses.length, 2)}, 1fr)`
              : `repeat(${Math.min(sortedCourses.length, 3)}, 1fr)`
          }`,
        }}
      >
        {sortedCourses.map(course => {
          const courseSlug = slugify(course.title)
          return (
            <div
              key={course.course_id}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition duration-500 ease-in-out transform lg:hover:scale-110 hover:z-10 z-0"
              style={{
                backgroundImage: course.image_url ? `url(${course.image_url})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <Link to={`/kursy/${getYearFromDate(course.start_date || course.date_label)}/${courseSlug}`}>
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md" />
                <div className="relative z-10 flex flex-col h-full gap-6">
                  {/* Tytuł kursu */}
                  <Title white tag="h5" className="text-white dark:text-gray-300">
                    Kurs nr {course.course_number ?? "—"}
                  </Title>
                  <Title white tag="h4" className="text-white dark:text-gray-200">
                    {course.title}
                  </Title>

                  {/* Informacje o kursie */}
                  <div className="flex justify-between mt-auto text-white dark:text-gray-300">
                    <p className="text-white dark:text-gray-400">
                      {course.date_label || "Brak daty"}
                    </p>
                    <span
                      className={`px-2 items-center inline-flex text-xs leading-5 font-semibold rounded-full ${
                        course.available
                          ? "bg-green-100 dark:bg-green-600 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-600 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {course.available ? "Dostępne" : "Niedostępne"}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// GraphQL usunięte – archiwum z /courses (filtr is_archive po stronie klienta)
export const Head = () => <Seo title="Archiwum kursów" />

export default ArchiwumKursow
