import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"
import Title from "../components/Title/Title"
import Seo from "../components/seo"
import { Link } from "gatsby"
import { slugify } from "../../utils/slugify"
import { getYearFromDate } from "../../utils/getYearFromDate"

const ArchiwumKursow = ({ data }) => {
  const [windowWidth, setWindowWidth] = useState(0) // Początkowa szerokość okna

  // Użycie useEffect tylko po stronie klienta
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)

    if (typeof window !== "undefined") {
      // Ustawiamy początkową szerokość okna
      setWindowWidth(window.innerWidth)
      window.addEventListener("resize", handleResize)

      return () => window.removeEventListener("resize", handleResize)
    }
  }, []) // Pusta tablica zależności, aby uruchomić tylko raz po zamontowaniu

  if (!data) {
    return <div>Loading...</div>
  }

  const {
    allDatoCmsCourse: { nodes },
  } = data

  return (
    <div>
      <div
        className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 py-24 relative"
        style={{
          gridTemplateColumns: `${
            windowWidth < 640
              ? "1fr"
              : `repeat(${Math.min(nodes.length, 3)}, 1fr)`
          }`,
        }}
      >
        {nodes.map(course => {
          const courseSlug = slugify(course.nameCourse)
          return (
            <div
              key={course.id}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition duration-500 ease-in-out transform lg:hover:scale-110 hover:z-10 z-0"
              style={{
                backgroundImage: `url(${course.image.fluid.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <Link to={`/kursy/${getYearFromDate(course.date)}/${courseSlug}`}>
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md" />
                <div className="relative z-10 flex flex-col h-full gap-6">
                  {/* Tytuł kursu */}
                  <Title white tag="h5" className="text-white dark:text-gray-300">
                    Kurs nr {course.numerCourse}
                  </Title>
                  <Title white tag="h4" className="text-white dark:text-gray-200">
                    {course.nameCourse}
                  </Title>

                  {/* Informacje o kursie */}
                  <div className="flex justify-between mt-auto text-white dark:text-gray-300">
                    <p className="text-white dark:text-gray-400">
                      {course.date || "Brak daty"}
                    </p>
                    <span
                      className={`px-2 items-center inline-flex text-xs leading-5 font-semibold rounded-full ${
                        course.available
                          ? "bg-green-100 dark:bg-green-600 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-600 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {course.available ? "Dostępne" : "Nieaktywny"}
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

export const query = graphql`
  query archiveCourse {
    allDatoCmsCourse(filter: { archive: { eq: true } }, sort: { date: ASC }) {
      nodes {
        id
        nameCourse
        numerCourse
        date
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

export const Head = () => <Seo title="Archiwum kursów" />

export default ArchiwumKursow
