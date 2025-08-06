import React, { useEffect, useState } from "react"
import { Link, graphql } from "gatsby"
import Seo from "../components/seo"
import Title from "../components/Title/Title"
import { slugify } from "../utils/slugify"
import { getYearFromDate } from "../utils/getYearFromDate"

const Courses = ({ data }) => {
  const [windowWidth, setWindowWidth] = useState(0) // Zmieniamy początkową wartość na 0

  // Wykonujemy kod tylko po stronie klienta, aby uzyskać dostęp do `window`
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)

    if (typeof window !== "undefined") {
      // Ustawienie początkowej szerokości okna, gdy komponent jest renderowany po stronie klienta
      setWindowWidth(window.innerWidth)

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  if (!data) {
    return <div>Loading...</div>
  }

  const {
    allDatoCmsCourse: { nodes },
  } = data

  return (
    <div
  className="grid gap-4 py-24 relative"
  style={{
    gridTemplateColumns: `${
      windowWidth < 840
        ? "1fr" // Jedna kolumna na małych ekranach
        : windowWidth < 1024
        ? `repeat(${Math.min(nodes.length, 2)}, 1fr)` // Dwie kolumny na średnich ekranach
        : `repeat(${Math.min(nodes.length, 3)}, 1fr)` // Trzy kolumny na dużych ekranach
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
              <div className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-60 rounded-md" />
              <div className="relative z-10 flex flex-col h-full gap-6">
                {/* Tytuł kursu */}
                <Title white tag="h5">
                  Kurs nr {course.numerCourse}
                </Title>
                <Title white tag="h4" className="text-white dark:text-gray-200">
                  {course.nameCourse}
                </Title>

                {/* Informacje o kursie */}
                <div className="flex justify-between mt-auto text-white dark:text-gray-300">
                  <p className="text-white dark:text-gray-200">
                    {course.date || "Brak daty"}
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
  )
}

export const query = graphql`
  query MyQuery {
    allDatoCmsCourse(
    filter: {
      archive: { ne: true }
    }
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
